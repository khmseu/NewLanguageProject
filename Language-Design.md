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

The adopted relative operator priorities are listed in DEC-022. Semantic legality rules for inserted elements remain open (Q-008); operator semantics and the remaining associativity choices are tracked in Q-007.

**Decision DEC-021 — approved:** Use GenLang's numeric priority scale as the starting point for the next language. Set `@` to priority 190; keep `.` left-associative; use `^` for XOR and `**` for exponentiation; use `->` for function definition; and set `?` to priority 45. DEC-022 resolves the remaining relative-order conflicts and assigns `**` a priority.

**Decision DEC-022 — approved:** Adopt the following relative precedence for the next language, from tightest to loosest. Each line is a distinct priority level; operators on one line share a level. This uses GenLang's relative ordering to resolve the historical conflicts, with the explicit placements below, and makes `**` right-associative.

| Relative level (tightest first) | Operators | Associativity / notes |
|---|---|---|
| Tightest | `@` | No associativity specified; name-declaration operator. |
|  | implicit `APPLY`, `(` `)` `{` `}` `[` `]` | APPLY is left-associative; delimiters group syntax. |
|  | `.` `->` | `.` is left-associative; `->` means function definition, with associativity still open. |
|  | `++` `--` `!` `~` | No infix associativity specified in the GenLang table; prefix/postfix forms and semantics remain subject to Q-007. |
|  | `**` | Right-associative exponentiation; one level tighter than `*`. |
|  | `*` `/` `%` | Left-associative. |
|  | `+` `-` | Left-associative. |
|  | `<<` `>>` | Left-associative. |
|  | `&` | Left-associative bitwise AND. |
|  | `^` | Left-associative XOR. |
|  | <code>&#124;</code> | Left-associative bitwise OR. |
|  | `<` `<=` `>` `>=` | Left-associative relational operators. |
|  | `==` `!=` | Left-associative equality operators. |
|  | `&&` | Left-associative logical AND. |
|  | <code>&#124;&#124;</code> | Left-associative logical OR. |
|  | `<-` | No associativity specified; source describes a channel operation. |
|  | `?` | Right-associative; begins a ternary conditional. |
|  | `:` `::` | `:` is right-associative and separates a ternary conditional; `::` has no specified meaning/use or associativity. |
|  | `=` `:=` `::=` `+=` `-=` `*=` `/=` `%=` `&=` <code>&#124;=</code> `^=` `<<=` `>>=` | Assignment operators are right-associative. `:=` and `::=` are declaration markers (DEC-011), placed at this level without thereby making them expression operators. |
|  | `,` | Left-associative separator. |
| Loosest | `;` | Statement terminator. |

**Decision DEC-023 — approved:** Place `::` at the same relative precedence level as `:`, and place `:=` and `::=` at the same level as `=`. These are relative placements only; the meanings selected in DEC-011 remain unchanged.

`**` occupies the level immediately above `*`; no numeric priorities are part of this table. `::` is placed with `:` despite having no current use case. The `:=` variable and `::=` type declaration markers from DEC-011 are placed with `=` in this relative ordering; these are declaration markers, not expression operators.

The table adopts GenLang's relative order for APPLY versus `.`, bitwise versus comparison operators, and `?` versus assignment/`:`, resolving those historical differences for this design. The placement of `::` and the declaration markers is explicitly selected here rather than copied from GenLang. Historical source disagreements remain documented in the project knowledge view. Q-007 tracks operator meanings/forms and unresolved associativity, not these adopted relative priorities.

## Declarations and bindings

**Decision DEC-011 — approved:** Adopt the name-first binding model from [LangLLVM's declaration design](/bigdata/KAI/projects/LangLLVM/src/Design:%20Declarations,%20Definitions.md):

```text
NAME :    [TEMPLATEPARAMS] (TYPE | INITEXPR);  // constant
NAME :=   [TEMPLATEPARAMS] (TYPE | INITEXPR);  // variable
NAME ::=  [TEMPLATEPARAMS] (TYPE | INITEXPR);  // type
```

In that model, `TYPE` may itself include an initializer expression; the design note also sketches `=` as the initializer marker within a type form. Template parameters and arguments use square brackets (`NAME[ARGS]`). Function expressions use `{ BODY }`, and function types use `(INPARAMS) -> (OUTPARAMS)`.

This selects the LangLLVM model over GenLang's type-first declaration syntax. It does not settle scope and visibility, initialization and inference details, or whether declarations without bodies are distinct from definitions (Q-009, Q-010).

**Decision DEC-012 — approved:** The language has no keywords as a separate lexical category; keyword-like constructs are represented by predefined identifiers. While such an identifier has not been redefined, its semantic effect should closely emulate the corresponding construct as if it were a keyword. Redefining it means it no longer has that predefined semantic effect. Name lookup uses the namespace hierarchy in DEC-018; exact redefinition semantics remain open (Q-009).

Square brackets are the selected delimiters for template parameters and arguments (DEC-011); no angle-bracket template syntax is adopted.

**Decision DEC-018 — approved:** Name lookup proceeds through a hierarchy of predefined, imported, and block-related namespaces, selecting a name from the closest namespace. Declaring a function with the same name does not by itself create an overload set: functions are overloaded only through explicit overload declarations that identify the functions grouped together. Resolve a call among that group first by type compatibility (DEC-014); when multiple candidates remain, identical types rank ahead of merely compatible types. Resolution must leave exactly one candidate; otherwise it does not resolve.

The precise namespace ordering and import behavior, the syntax and validation of overload declarations, and how to rank candidates when argument lists mix identical and merely compatible types remain open (Q-009).

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

## Object model

**Decision DEC-019 — approved:** Adopt NewLang's language-level object model from `NewLang/IDEAS/OtherStuff.txt` and its class grammar in `NewLang/IDEAS/newlang.ye`. Do not adopt NewLang's bytecode, interpreter, compiler-backend, or native-interoperability architecture from `NewLang/IDEAS/Implementation.txt`.

The selected model includes:

- Modules are classes. Packages are collections of modules that expose one or more interfaces; source-global names are rooted in a package and may include namespace components.
- Classes have fields, methods, constructors, modifiers, and may contain nested classes/interfaces; they may have a superclass, implement interfaces, and be parameterized. Classes have class objects; each parameterization has a distinct class object, instantiated when first needed.
- `Object` is the primitive reference type. Derived classes, `Class`, `Metaclass`, methods, and instantiations are among the proposed constructed reference types; constructed reference types may be parameterized, including container types. Mixins are not derived from `Object`, are not independently instantiable, and may also be parameterized.
- Flat/value types include primitive integer, floating-point, and character types, and constructed enums (including boolean), subranges, sets of subranges, fixed-index arrays, and structs. Flat values have their exact declared type and are destroyed when they leave scope. Reference-typed variables may hold values of a subtype of their declared type; references retain the GC-like behavior in DEC-017.

This adopts the model at the level described by the notes, not every Java-like construct in the separate Java 8 grammar/reference tree. Exact class-variable semantics, local functions as possible function objects, the role/type semantics of methods and instantiations as reference types, packed types, and details of package/import configuration and namespace components remain open (Q-012). Previously selected safety-first compatibility rules (DEC-014) and the user's field-collection requirement (REQ-002) continue to apply.

## Control flow

**Decision DEC-020 — approved:** The language must support proper tail calls and continuations. Proper tail calls are a semantic guarantee, not merely an optimization: calls in tail position must not require unbounded additional continuation space. The specific continuation facility and operations are not yet selected; in particular, this decision alone does not choose full versus delimited continuations, one-shot versus multi-shot continuations, or a particular `call/cc` interface (Q-013).

This requirement constrains the implementation's control representation and calling convention, but does not select NewLang's bytecode VM or any other backend. The implementation must preserve the GC-like reference behavior in DEC-017 when continuations retain execution state.
