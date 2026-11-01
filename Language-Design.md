# Language Design

## Status and scope

This is the evolving design record for the next language experiment. It contains only choices approved so far; unresolved feature conflicts remain in [the project knowledge view](./Kontext/Wissensstand.md). The implementation language is tentatively TypeScript, not a finalized commitment.

## Identifier normalization

**Decision DEC-006 — approved:** Identifiers are case-sensitive. Normalize identifier spellings to NFC when deriving their equality/comparison key, and preserve the original source spelling for diagnostics and display. Source spellings do not have to be pre-normalized; canonically equivalent spellings therefore refer to the same identifier.

This selects NFC rather than NFKC, avoiding NFKC's broader compatibility folding. It follows the general guidance in [UAX #31, Unicode 18.0.0, Revision 45, §5](https://www.unicode.org/reports/tr31/tr31-45.html). The Unicode 19.0 / next-version guidance was not available in the sources checked; review this decision against a future draft before treating that draft as the language's reference.

**Decision DEC-007 — approved:** Use the proposed identifier syntax in [NewLang's syntax notes](/bigdata/KAI/NewLang/IDEAS/Syntax.txt): an identifier starts with a code point having the Unicode `XID_Start` property, followed by zero or more code points having `XID_Continue` (`XID_Start XID_Continue*`, UAX #31 R1). No extra start characters are added. In particular, underscore may continue an identifier but may not start one under this rule.

The Unicode property data version is not yet fixed (Q-006); implementations must use one consistent version rather than mixing property data across versions.

## Expression token stream and implicit insertions

**Decision DEC-008 — approved:** After comments are stripped, the source is treated as an operand/operator sequence. Whitespace separates tokens; apart from its role inside strings and comments, it does not itself express grouping or application. Syntactic elements are classified as operators, identifiers, or constants; identifiers and constants are operands.

To restore alternation in the token stream:

- Insert an implicit `APPLY` operator between two directly adjacent operands. It has no explicit source spelling.
- Insert an implicit `EMPTY` operand between two directly adjacent operators. It has no explicit source spelling.

The transformed sequence alternates operands and operators.

**Decision DEC-009 — approved:** Parse the resulting stream into a tree using operand-priority rules. Whether an inserted `APPLY` or `EMPTY` is legal in its resulting semantic context is checked during semantic analysis, not parsing.

**Decision DEC-010 — approved:** Unary prefix and postfix operators are represented using an implicit `EMPTY` operand, not separate unary-operator syntax in the tree. A prefix operator has `EMPTY` on its left; a postfix operator has `EMPTY` on its right. This is the tree representation; semantic analysis determines whether the operator is valid in that unary context.

The full operator-priority rules, including the priority of implicit `APPLY`, and the semantic legality rules for inserted elements remain to be specified (Q-007, Q-008).

## Declarations and bindings

**Decision DEC-011 — approved:** Adopt the name-first binding model from [LangLLVM's declaration design](/bigdata/KAI/projects/LangLLVM/src/Design:%20Declarations,%20Definitions.md):

```text
NAME :    [TEMPLATEPARAMS] (TYPE | INITEXPR);  // constant
NAME :=   [TEMPLATEPARAMS] (TYPE | INITEXPR);  // variable
NAME ::=  [TEMPLATEPARAMS] (TYPE | INITEXPR);  // type
```

In that model, `TYPE` may itself include an initializer expression; the design note also sketches `=` as the initializer marker within a type form. Template parameters and arguments use square brackets (`NAME[ARGS]`). Function expressions use `{ BODY }`, and function types use `(INPARAMS) -> (OUTPARAMS)`.

This selects the LangLLVM model over GenLang's type-first declaration syntax. It does not settle scope and visibility, initialization and inference details, or whether declarations without bodies are distinct from definitions (Q-009, Q-010).

**Decision DEC-012 — approved:** The language has no keywords as a separate lexical category; keyword-like constructs are represented by predefined identifiers. While such an identifier has not been redefined, its semantic effect should closely emulate the corresponding construct as if it were a keyword. Redefining it means it no longer has that predefined semantic effect. The exact name-resolution and redefinition scope rules remain open (Q-009).

Square brackets are the selected delimiters for template parameters and arguments (DEC-011); no angle-bracket template syntax is adopted.

## Type system

**Decision DEC-013 — approved:** The language is statically typed. A type may be written explicitly or inferred. Inference does not make the language dynamically typed; the type of each relevant expression or binding must be determined statically.

**Decision DEC-014 — approved:** Type compatibility follows a safety-first principle: allow an operation when its safety can be proven; otherwise reject it.

The inference rules, required-annotation cases, exact safety properties and proof criteria, type compatibility rules, and point at which types are checked remain unspecified (Q-009). No unsafe escape hatch or runtime-check fallback is implied by DEC-014.

## Values, references, and field collections

**Decision DEC-015 — approved:** Distinguish value types from reference types. A reference type consists of an implicit value type (pointer-like) that identifies a variable, analogously to how a variable is identified by its name. Variables may hold either value types or reference types.

**Requirement REQ-002 — user-stated:** The language has collections of fields identified by names or by indices.

The exact representation and semantics remain open: in particular, what “identifies a variable” means operationally, how reference identity and aliasing work, whether references can be reassigned or become invalid, and whether named/indexed field collections are value types, reference types, or both (Q-011). Reference values have the GC-like behavior specified in DEC-017; no particular collector, ownership discipline, or memory-safety mechanism is selected.

**Decision DEC-016 — approved:** Multiple parameters and multiple return values are modeled logically as one temporary collection each. This is a semantic model; it does not yet choose a concrete collection type, syntax, storage strategy, or whether the temporary is observable as an ordinary value (Q-011).

**Decision DEC-017 — approved:** Reference values behave as if managed by garbage collection. Implementations may optimize particular cases when lifetimes are predictable enough to do so. Such optimizations must preserve the observable behavior of the garbage-collected reference model; the specific analysis, optimization techniques, and fallback mechanism remain unspecified (Q-011).
