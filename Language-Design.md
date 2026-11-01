# Language Design

## Status and scope

This is the evolving design record for the next language experiment. Approved choices and explicitly labeled open alternatives are recorded here; unresolved feature conflicts remain in [the project knowledge view](./Kontext/Wissensstand.md). The implementation language is tentatively TypeScript, not a finalized commitment.

## Identifier normalization

**Decision DEC-006 — approved, partially superseded by DEC-024:** Identifiers are case-sensitive and source spelling is preserved for user interaction. DEC-006 originally selected NFC-normalized equality keys; DEC-024 replaces that key policy with NFKC while retaining an NFC form for interaction.

The original NFC choice followed the general guidance in [UAX #31, Unicode 18.0.0, Revision 45, §5](https://www.unicode.org/reports/tr31/tr31-45.html); the later user choice of NFKC for internal names is an intentional design change.

**Decision DEC-007 — approved:** Use the proposed identifier syntax in [NewLang's syntax notes](/bigdata/KAI/NewLang/IDEAS/Syntax.txt): an identifier starts with a code point having the Unicode `XID_Start` property, followed by zero or more code points having `XID_Continue` (`XID_Start XID_Continue*`, UAX #31 R1). No extra start characters are added. In particular, underscore may continue an identifier but may not start one under this rule.

The Unicode property data version is not yet fixed (Q-006); implementations must use one consistent version rather than mixing property data across versions.

## Comments, identifiers, and constants

**Decision DEC-024 — approved:** Identifier names are case-sensitive. Accept identifiers matching `XID_Start XID_Continue*`; derive the internal name used for lookup/equality by applying NFKC, and retain the NFC form for user interaction. This supersedes DEC-006's NFC equality key while preserving case sensitivity and the user-facing NFC representation. The Unicode property-data version remains open (Q-006).

**Decision DEC-025 — approved:** Use `//` line comments and `/* ... */` block comments; block comments do not nest. Character literals use single quotes (`'...'`) and ordinary strings use double quotes (`"..."`). Integers may be written as unmarked decimal, with `0b`, `0o`, `0d`, or `0x` base markers, or using `base#number`. Apply C++-style universal-character names `\uXXXX` and `\UXXXXXXXX` to source characters generally, and support the Perl-style escapes described in NewLang's syntax notes in character and ordinary string literals. Floating-point literals include decimal and hexadecimal forms from ISO floating-point language standards.

The precise lexical productions remain to be specified: escape translation order relative to tokenization and normalization; character-literal cardinality; exact accepted Perl escape spellings and validation; radix-marker case, digit separators and range rules; and the ISO standard/version and suffix/precision grammar for floating-point literals (Q-014).

**Decision DEC-026 — approved:** Raw strings use NewLang's tagged-backtick delimiter structure: opening backtick, tag, and double quote; content; then double quote, the same tag, and closing backtick. For example, `` `END"raw content"END` ``. The tag's allowed spelling and the literal's content, newline, and escape behavior remain open (Q-016).

Other raw-string syntaxes are retained below as comparisons; they are not selected.

| Family / examples | Delimiter model | Trade-offs |
|---|---|---|
| Fixed backtick: `` `text` `` (Go; also GenLang) | One fixed delimiter; Go uses literal content through the next backtick. GenLang allows doubled backticks inside its multiline raw string. | Very concise; a literal backtick requires a special rule or cannot appear directly. |
| Hash-counted: `r#"text"#`, `r##"text with "# inside"##` (Rust) | Choose a count of `#` characters; matching quote-plus-hashes ends the string. | Flexible content and simple matching; introduces a delimiter-count rule and prefix. |
| Tagged paired delimiter: `R"tag(text)tag"` (C++ and LangLLVM PEG) | A short tag appears at both ends around `(` and `)`. | Accommodates quotes and backslashes; more punctuation and restrictions on tags. |
| Variable quote run: `"""text"""` (C#) | Matching delimiter uses a run of at least three quotes; longer runs allow quote runs in content. | Familiar quote-only form; multiline indentation rules can add complexity. |
| Raw prefix on ordinary quotes: `r"text"` or `r"""text"""` (Python) | Prefix changes backslash handling; quote count still determines termination. | Familiar and compact; rawness does not itself solve delimiter collisions, and ordinary string constraints still apply. |
| NewLang scanner prototype: `` `tag"text"tag` `` | Appears to use a tag between the opening backtick and quote and a matching quote/tag/backtick close. | Selected delimiter family (DEC-026); scanner behavior is prototype evidence, not a complete content specification. |

Illustrative forms:

```text
Go fixed backtick:
`C:\temp\file.txt
second line`

GenLang doubled embedded backtick:
`A doubled `` backtick in the content`

Rust, with two hashes so an inner "# does not close it:
r##"The sequence "# is content here."##

C++, with a custom END tag:
R"END(The sequence )ENDX is content.)END"

C#, with four quote characters delimiting content that contains three:
""""Contains """ but not """" inside""""

Python raw prefix (backslashes remain uninterpreted):
r"C:\temp\file.txt"
r"""First line
second line"""

NewLang scanner prototype:
`END"Raw content: `, "quotes", and \slashes"END`
```

The NewLang tagged-backtick form is selected by DEC-026. Other examples are comparisons, not selections. The examples do not decide the new language's escape, newline, or delimiter-collision rules.

External references: [Go string literals](https://go.dev/ref/spec#String_literals), [Rust raw string literals](https://doc.rust-lang.org/reference/tokens.html#raw-string-literals), [C++ string literals](https://en.cppreference.com/w/cpp/language/string_literal), [C# raw string literals](https://learn.microsoft.com/en-us/dotnet/csharp/language-reference/tokens/raw-string), and [Python string and bytes literals](https://docs.python.org/3/reference/lexical_analysis.html#string-and-bytes-literals). Experiment evidence is in [GenLang's lexical specification](/bigdata/KAI/projects/GenLang/docs/language.md), [its generated token definitions](/bigdata/KAI/projects/GenLang/packages/genlang/src/combined-definitions.json), [NewLang's syntax notes](/bigdata/KAI/NewLang/IDEAS/Syntax.txt), [NewLang's scanner](/bigdata/KAI/NewLang/parser/NLparser/Scanner.cc), and [LangLLVM's PEG](/bigdata/KAI/projects/LangLLVM/src/mylang.pegjs).

## Agreed token syntax summary

This table consolidates the currently agreed source forms; it is an inventory, not a complete lexical grammar. Items marked open still need precise productions. Operator precedence and associativity are specified in the table under DEC-022 below. The language has no separate keyword-token category: keyword-like constructs are predefined identifiers (DEC-012).

| Token/category | Agreed source syntax | Notes / unresolved details |
|---|---|---|
| Line comment | `//` through the line ending | Exact line-ending handling remains part of Q-014. |
| Block comment | `/* ... */` | Non-nested; ends at the first `*/`. |
| Identifier | `XID_Start XID_Continue*` | Case-sensitive; NFKC internal name, retain NFC form for user interaction. Unicode property version is open (Q-006). |
| Universal-character name | `\uXXXX`, `\UXXXXXXXX` | Accepted for source characters generally, not just inside literals. Translation phase, invalid code-point handling, and source-location mapping remain open (Q-014). |
| Character literal | `'...'` | NewLang Perl-style escapes are supported. Character cardinality and the exact escape subset/validation remain open. |
| Ordinary string literal | `"..."` | NewLang Perl-style escapes are supported. Exact escape subset, newline rules, and validation remain open. |
| Raw string literal | `` `TAG"..."TAG` `` | The closing tag must match the opening tag. Tag grammar, newline behavior, and whether/how content is transformed remain open (Q-016). |
| Perl-style character/string escapes | Examples in NewLang's notes: `\a`, `\b`, `\c`, `\e`, `\f`, `\n`, `\N{...}`, `\o{...}`, `\r`, `\t`, `\v`, `\x{...}` | The notes mark some forms as undecided; this list illustrates the family and does not settle the accepted subset. |
| Integer literal | Decimal digits; `0b...`, `0o...`, `0d...`, `0x...`; or `base#number` | Radix-marker case, allowed bases/digits, separators, and range rules remain open (Q-014). |
| Floating-point literal | Decimal or hexadecimal form from ISO floating-point standards | Exact standard/edition, grammar, suffixes, and precision rules remain open (Q-014). |
| Grouping / collection delimiters | `(` `)`, `{` `}`, `[` `]` | Parentheses group; braces delimit function expressions/bodies; square brackets delimit template parameters/arguments. Full grammar remains open (Q-015). |
| Member-access / dot operator | `.` | Left-associative; exact operator form/semantics remain open (Q-007). |
| Function type arrow | `->` | Used in `(INPARAMS) -> (OUTPARAMS)`; also selected as a function-definition operator. Its associativity/form details remain open (Q-007). |
| Binding / declaration markers | `:` `:=` `::=` | Name-first forms: constant, variable, and type declarations respectively; each may be followed by `[TEMPLATEPARAMS]`. Detailed declaration grammar remains open (Q-009/010). |
| Initializer / assignment | `=` | Also appears as the initializer marker within a type form; expression form and semantics are tracked in Q-007/009. |
| Name-declaration operator | `@` | Exact syntactic form/semantics remain open (Q-007). |
| Arithmetic / bitwise / comparison / logical operators | `++` `--` `!` `~` `**` `*` `/` `%` `+` `-` `<<` `>>` `&` `^` <code>&#124;</code> `<` `<=` `>` `>=` `==` `!=` `&&` <code>&#124;&#124;</code> | `**` is exponentiation and right-associative; `^` is XOR. Other semantics and prefix/postfix forms are not fully specified (Q-007). Their relative levels are in DEC-022. |
| Channel operator | `<-` | Retained from the adopted precedence inventory; exact meaning/form remains open (Q-007). |
| Conditional operators | `?` `:` | `?` begins the conditional; `:` separates its arms. Exact grammar/associativity details are in Q-007. |
| Other colon operator | `::` | Same relative level as `:`; no current use or meaning is selected (Q-007). |
| Compound assignment operators | `+=` `-=` `*=` `/=` `%=` `&=` <code>&#124;=</code> `^=` `<<=` `>>=` | Present in the selected precedence inventory; detailed semantics/forms remain open (Q-007). |
| Argument/element separator | `,` | Left-associative in the precedence table; exact grammar depends on the construct. |
| Statement terminator | `;` | Selected as the loosest token in the precedence table; newline interaction remains open (Q-014). |
| Implicit parser tokens (not source spellings) | `APPLY`, `EMPTY` | Insert `APPLY` between adjacent operands and `EMPTY` between adjacent operators; unary prefix/postfix operators use `EMPTY` on the missing side (DEC-008/010). Semantic legality remains open (Q-008). |

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

## Questions to resolve before parser implementation

The decisions above establish design direction, but not a complete grammar. A parser can be started for a deliberately limited first slice once that slice and its syntax are specified; implementing a parser for the full selected language requires resolving the applicable questions below. These are open questions, not additional design decisions.

### Blocking for any parser slice

1. **What is the first parser's scope?** Choose whether it parses expressions only, or also declarations, functions, types, statements, classes, packages, and imports. Identify explicitly which forms are excluded from the first slice (Q-003).
2. **What is the remaining lexical grammar?** Comment forms, identifier syntax/normalization, basic character/string forms, integer bases, universal-character names, decimal/hex float classes, and the raw-string delimiter family are selected in DEC-024/026. Specify raw-string tag syntax and content behavior (Q-016), the Unicode property-data version (Q-006), and precise escape, numeric, token-boundary/longest-match, whitespace/newline, and statement-termination rules (Q-014).
3. **What is the exact expression grammar?** For each expression operator in DEC-022 that is included in the slice, specify whether it can occur prefix, infix, postfix, or in another form; which operands/arity it takes; how delimiters and nesting work; and how equal-precedence operators associate. In particular, settle `->` associativity, ternary `? :` parsing, and where implicit `APPLY`/`EMPTY` insertion applies, including expression boundaries (Q-007/008). `::` has a precedence placement but no selected syntactic use; either define its expression form or exclude it from the initial parser slice.
4. **What parse structure does the parser produce?** Define the minimum AST/tree node contract for operands, operators, grouping, declarations, and source locations needed by the next compiler phase. The chosen representation may be refined during implementation, but parser and consumer must agree on this contract.

### Blocking for the corresponding language forms

5. **What are the declaration and definition productions?** Specify how the selected `:`, `:=`, and `::=` bindings are distinguished from expression uses; the grammar of optional type and initializer parts; the role of `=`; and whether declarations can omit bodies or be prototypes (Q-009/010). For keyword-like constructs represented by predefined identifiers (DEC-012), decide how syntax recognition works when identifiers are not a separate keyword token category and may be redefined.
6. **What are the type, function, and block productions?** Specify type-expression syntax, template parameter/argument syntax and nesting, parameter and multiple-result syntax, function expression/body boundaries, and statement/block structure. The selected markers and forms in DEC-011 are not yet a complete grammar.
7. **What source forms express namespaces, packages, imports, and the selected object model?** If included in the parser's scope, specify their productions and how class/interface/member declarations are delimited and nested (Q-009/012). Runtime class, type-compatibility, and dispatch semantics can be specified separately.

### Can be deferred beyond parsing

Precise type-inference and safety proofs, reference identity and lifetime optimization, overload resolution behavior beyond the syntax of overload declarations, object-model runtime semantics, and continuation implementation details need not block a syntax-only parser. They must be resolved before implementing the corresponding semantic/runtime phases; any syntax choices they affect must still be fixed before parsing those forms.
