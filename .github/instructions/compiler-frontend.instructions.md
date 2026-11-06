---
description: "Use when implementing or testing the compiler lexer, parser, source mapping, diagnostics, or lossless CST. Preserve the approved frontend phase boundaries and TDD contracts."
applyTo: "src/**,tests/**"
---

# Compiler frontend

Use [Language Design](../../docs/design-research/Language-Design.md) as the
behavior reference; keep tests traceable to its decision IDs.

- Process UTF-8 and global one-pass Unicode escapes before token recognition,
  retaining original byte provenance. Do not NFC-normalize the whole source
  (DEC-078/082). Identifiers have NFC user forms and NFKC lookup keys; literal
  content is NFC-normalized before ordinary escapes, not afterward.
- Verify Unicode 18.0.0 for identifiers, whitespace, names/aliases, and
  normalization. A runtime's Unicode property regexes or normalization API are
  not sufficient without version evidence.
- Match the longest permissive token candidate, then validate without falling
  back to a shorter valid token (DEC-067/071). Integers, floats, and suffixes use
  one numeric candidate (DEC-089). Resolve Q-014's exact candidate grammar and
  length policy before implementing that matcher.
- Comments separate tokens but remain preserved. Touching identifier/number
  token runs form one error operand (DEC-083); do not reinstate superseded
  `1.foo`, `a.5`, or `1..2` splits. `foo123` remains one identifier.
- Treat all constructs as generic operands/operators. Insert only the selected
  `APPLY`/`EMPTY` elements; use the approved precedence and level associativity.
  Delimiter groups contain trees and act as outer operands.
- Do not add keyword token kinds, separate unary grammar, conditional
  reassociation, or declaration/class/function parser productions. Predefined
  names, `::` legality, operand legality, and suffix meanings are semantic work.
- Produce a lossless binary CST, not a separate AST. Preserve comments, trivia,
  BOM, escape spelling, and malformed bytes so the original input can be
  reconstructed even when decoding required replacement characters.
- Test errors explicitly: maximal-subpart UTF-8 recovery, intact comments and
  literals with embedded Unicode diagnostics, minimal fallback runs, contextual
  error classification, trivia-independent collapse, and tightest,
  left-associative operator errors.
- Mismatched closers are unexpected relative to the innermost open group.
  Preserve them as errors; diagnose and insert outstanding closers at EOF.
  Empty/trivia-only input and empty groups contain `EMPTY`.
- Choose CST layouts and synthetic spans during implementation as allowed by
  DEC-088, document those choices, and assert their exact behavior in tests.
  Never invent original source bytes for inserted elements.
- Every behavioral change follows test-first red/green/refactor. Include
  focused assertions for source spans, diagnostics, and tree shape alongside
  valid/invalid conformance fixtures.
