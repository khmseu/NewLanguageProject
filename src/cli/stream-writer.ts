/**
 * Promise-based Node writable-stream support for the runnable CLI.
 * @module
 */
import type { Writable } from "node:stream";

/**
 * Writes one complete text chunk and waits for both its write callback and,
 * when required, the stream's drain signal.
 *
 * Waiting for the callback propagates asynchronous write errors; waiting for
 * `drain` when `write` returns false prevents the next chunk from bypassing
 * Node's writable-stream backpressure.
 *
 * @param stream Destination writable stream.
 * @param chunk Text to encode and write in the stream's configured encoding.
 * @returns A promise that resolves after the chunk is flushed and backpressure
 * has cleared.
 * @throws If the stream rejects, errors, or closes before the write completes.
 */
export function writeNodeStream(
  stream: Writable,
  chunk: string,
): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    let callbackCompleted = false;
    let drainCompleted = false;
    let settled = false;

    /**
     * Removes temporary listeners once the write settles.
     * @returns Nothing.
     * @throws This cleanup helper does not throw.
     */
    const cleanup = (): void => {
      stream.off("error", onError);
      stream.off("drain", onDrain);
      stream.off("close", onClose);
    };

    /**
     * Settles the promise once, even if a callback and stream event race.
     * @param error Optional failure that rejects the write promise.
     * @returns Nothing.
     * @throws This settlement helper does not throw.
     */
    const settle = (error?: Error): void => {
      if (settled) {
        return;
      }
      settled = true;
      cleanup();
      if (error === undefined) {
        resolve();
      } else {
        reject(error);
      }
    };

    /**
     * Resolves only after both Node write completion conditions are satisfied.
     * @returns Nothing.
     * @throws This completion helper does not throw.
     */
    const completeIfReady = (): void => {
      if (callbackCompleted && drainCompleted) {
        settle();
      }
    };

    /**
     * Rejects on an error emitted by the destination.
     * @param error Error emitted by the stream.
     * @returns Nothing.
     * @throws This event handler does not throw.
     */
    const onError = (error: Error): void => settle(error);

    /**
     * Records that the destination has accepted more buffered data.
     * @returns Nothing.
     * @throws This event handler does not throw.
     */
    const onDrain = (): void => {
      drainCompleted = true;
      completeIfReady();
    };

    /**
     * Rejects if the destination disappears before its write can finish.
     * @returns Nothing.
     * @throws This event handler does not throw.
     */
    const onClose = (): void => {
      if (!callbackCompleted || !drainCompleted) {
        settle(new Error("Output stream closed before the write completed"));
      }
    };

    stream.once("error", onError);
    stream.once("drain", onDrain);
    stream.once("close", onClose);
    try {
      const accepted = stream.write(chunk, (error?: Error | null) => {
        if (error != null) {
          // Node schedules the matching `error` event after this callback.
          // Keep the listener alive through that event to avoid an unhandled
          // stream error, while still rejecting if the stream emits no event.
          setImmediate(() => settle(error));
          return;
        }
        callbackCompleted = true;
        completeIfReady();
      });
      if (accepted) {
        drainCompleted = true;
        stream.off("drain", onDrain);
      }
      completeIfReady();
    } catch (error) {
      settle(
        error instanceof Error
          ? error
          : new Error(`Output write failed: ${String(error)}`),
      );
    }
  });
}
