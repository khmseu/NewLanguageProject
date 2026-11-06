# Kontextprotokoll

## Purpose and coverage

This log records the material context and evidence behind the current file classification. The current view is in [Wissensstand](./Wissensstand.md).

- Project: NewLanguageProject workspace and its `langlist`-referenced experiment archive
- Documentation begun: 2026-11-01 (+01:00)
- Event date: 2026-11-01 (+01:00)
- Reconstructed history: None. This entry records only the current request and the inspection performed for it.
- Gaps: Earlier discussions, complete file contents, and full project histories were not reviewed.

## Sources

| ID | Source | Stand/date | Inspected coverage | Limits |
| --- | --- | --- | --- | --- |
| SRC-001 | [langlist](../docs/design-research/langlist) (originally `/bigdata/KAI/projects/NewLanguageProject/langlist`) | Read during this task | Four listed directory roots | The list itself does not explain ownership or intent for individual files. |
| SRC-002 | Project trees named by `langlist` | Read during this task | Top-level structure, selected manifests/READMEs, selected source and grammar files | Not a complete file-by-file content review; dependencies, archives, and generated outputs were not exhaustively examined. |
| SRC-003 | User request in this conversation | 2026-11-01 | User says the directories contain years of language experiments as well as sources from related internet projects; asks to identify which files belong to each class | No earlier rationale, cleanup authorization, or file-moving request was provided. |
| SRC-004 | [Unicode Standard Annex #31, Unicode 18.0.0, Revision 45](https://www.unicode.org/reports/tr31/tr31-45.html) | Approved 2026-09-01; checked 2026-11-01 | §5 normalization/case guidance and requirements R4–R7; §5.1 NFKC modifications | Current-version guidance only; not a future-version draft. |
| SRC-005 | [Unicode Standard Annex #15, Unicode 18.0.0](https://www.unicode.org/reports/tr15/tr15-58.html) | Unicode 18.0.0; checked 2026-11-01 | Definitions and behavior of Unicode normalization forms | Consulted for the meaning of NFC/NFKC, not for language-specific policy. |
| SRC-006 | [UAX #31 proposed update](https://www.unicode.org/reports/tr31/proposed.html) and [Unicode 18.0.0 release information](https://www.unicode.org/versions/Unicode18.0.0/) | Checked 2026-11-01 | Proposed-update status and current published version | No proposed update was listed; no Unicode 19 / next-version UAX #31 draft was found among the checked sources. |
| SRC-007 | `/bigdata/KAI/NewLang/IDEAS/Syntax.txt` | Inspected 2026-11-01 | Proposed identifier syntax based on UAX #31 `XID_Start` / `XID_Continue` | The note does not state a Unicode property-data version. |
| SRC-008 | User clarification in this conversation | 2026-11-01 13:05:05 (+01:00) | Operand/operator sequence, whitespace, implicit `APPLY`/`EMPTY` insertion, priority-based tree construction, and semantic validation boundary | Records the user's design statement and clarification; no complete priority table or semantic rules were supplied. |
| SRC-009 | User clarification in this conversation | 2026-11-01 13:10:22 (+01:00) | Unary prefix and postfix operators are implemented using empty operands | The precise tree-side mapping is recorded as an interpretation of the operand/operator tree model. |
| SRC-010 | `/bigdata/KAI/projects/GenLang/docs/language.md` | Inspected 2026-11-01 | “C-Style Declarations”: variable declarations, declarators, function prototypes/definitions, and typed parameters | Specification evidence; not proof that every listed grammar form is implemented. |
| SRC-011 | `/bigdata/KAI/projects/LangLLVM/src/Design: Declarations, Definitions.md` | Inspected 2026-11-01 | Name-first constant/variable/type markers, template syntax, function expression/type, and declaration-vs-definition question | Design proposal, not an approved next-language choice or demonstrated complete implementation. |
| SRC-012 | `/bigdata/KAI/NewLang/IDEAS/OtherStuff.txt` | Inspected 2026-11-01 | Package/module/compilation-unit organization, struct definitions, type categories, function results, and open local-function/parameter questions | Conceptual notes; no complete declaration grammar in the inspected source. |
| SRC-013 | User clarification in this conversation | 2026-11-01 14:46:08 (+01:00) | Square-bracket template parameters and no-keywords design using predefined identifiers | User-approved policy; exact redefinition/name-resolution scope was not specified. |
| SRC-014 | User clarification in this conversation | 2026-11-01 15:25:31 (+01:00) | Static typing with explicit or inferred types | User-approved type-system direction; inference/checking details were not specified. |
| SRC-015 | User clarification in this conversation | 2026-11-01 15:34:00 (+01:00) | Safety-first principle for type compatibility: allow when safety can be proven, otherwise reject | User-approved principle; the safety properties and proof standard were not defined. |
| SRC-016 | User clarification in this conversation | 2026-11-01 15:45:16 (+01:00) | Value/reference type distinction, implicit pointer-like value identifying a variable, variables holding either kind, and collections of named or indexed fields | User-stated model and requirement; representation, lifetime, aliasing, and collection semantics remain unspecified. |
| SRC-017 | User clarification in this conversation | 2026-11-01 15:54:23 (+01:00) | Multiple-result parameters and returns logically behave like single temporary collections | User-stated semantic model; concrete type, syntax, and runtime representation remain unspecified. |
| SRC-018 | User clarification in this conversation | 2026-11-01 15:56:54 (+01:00) | Reference values behave as if governed by GC; predictable lifetimes may permit optimization | User-stated semantic model; optimization criteria and techniques remain unspecified. |
| SRC-019 | User clarification in this conversation | 2026-11-01 16:11:26.061 (+01:00) | Closest-namespace lookup and explicit overload grouping with compatibility/exact-type ranking and a unique-candidate requirement | User-stated name-resolution policy; namespace/import details and overload ranking for mixed matches remain unspecified. |
| SRC-020 | `/bigdata/KAI/NewLang/IDEAS/OtherStuff.txt` and `/bigdata/KAI/NewLang/IDEAS/newlang.ye` | Inspected 2026-11-01 | Proposed NewLang object/type model: modules as classes; package interfaces; classes, inheritance/interfaces, fields/methods/constructors; flat and reference types; class/metaclass objects; mixins; parameterized classes | Design notes and a Java-like grammar proposal, not evidence of a complete implementation; class-variable semantics are explicitly unresolved. |
| SRC-021 | `/bigdata/KAI/NewLang/IDEAS/Implementation.txt` | Inspected 2026-11-01 | Proposed reflective bytecode/native interoperability through class wrappers and interfaces/abstract classes | Implementation sketch only; not verified complete or selected as the design for other experiments. |
| SRC-022 | `/bigdata/KAI/projects/GenLang/docs/language.md` | Inspected 2026-11-01 | C-style language specification, function declarations, and struct/union/enum type keywords/examples | No object-oriented class, inheritance, or dispatch model was found in the reviewed specification; this does not prove absence elsewhere. |
| SRC-023 | `/bigdata/KAI/projects/LangLLVM/src/Design: Declarations, Definitions.md` and `/bigdata/KAI/projects/LangLLVM/src/mylang.pegjs` | Inspected 2026-11-01 | Binding/template/function design note and C++ grammar productions for classes, base clauses, and virtual members | The custom design note does not specify an object model; C++ grammar productions are parser material, not proof of adopted C++ semantics. |
| SRC-024 | OPPrs source inventory as summarized in KP-002 | Inspected 2026-11-01 | Parser-focused experiments, including operator/syntax tree machinery | No language-level object model identified in the reviewed parser projects. |
| SRC-025 | User request in this conversation | 2026-11-01 17:32:17.450 (+01:00) | Requests a description of object models found in previous experiments | A request for historical synthesis, not approval of any model for the next language. |
| SRC-026 | User decision in this conversation | 2026-11-01 17:46:04.712 (+01:00) | Select NewLang's object model and explicitly exclude its bytecode part | Approval of the language-level object model; implementation architecture is excluded. |
| SRC-027 | User decision in this conversation | 2026-11-01 17:59:12.529 (+01:00) | Require proper tail calls and continuations | User-selected language/runtime capabilities; precise continuation semantics and execution representation remain open. |
| SRC-028 | `/bigdata/KAI/NewLang/IDEAS/Implementation.txt` | Inspected 2026-11-01 | Note says ordinary processor stack conflicts with `call/cc` and motivates a consistent calling convention for perfect tail-call optimization | Historical implementation rationale only; not selected as the next language's execution architecture. |
| SRC-029 | User request in this conversation | 2026-11-01 18:05:09.685 (+01:00) | Requests one combined list of operators from experiments, including priority, associativity, semantic notes, and conflicts | Research/synthesis request; not approval of any operator set or precedence table for the next language. |
| SRC-030 | `/bigdata/KAI/projects/GenLang/docs/language.md` and `packages/genlang/src/combined-definitions.json` | Inspected 2026-11-01 | GenLang operator precedence/associativity list, operator grammar/examples, generated token descriptions and priorities | Specification and generated table disagree on `@` priority; `->` and definition-operator associativity/semantics have internal discrepancies. |
| SRC-031 | `/bigdata/KAI/NewLang/parser/NLparser/Parser.cc`, `Scanner.cc`, and `/bigdata/KAI/NewLang/prec.y` | Inspected 2026-11-01 | Parser prototype operator-priority/associativity declarations and separate Bison arithmetic sample | `treeGen()` is incomplete; sample grammar has no semantic actions; values/meaning belong to different experiments in the same tree. |
| SRC-032 | `/bigdata/KAI/projects/OPPlang/OPPrs/minipratt/src/bin/pratt.rs`, `shunting-yard.rs`, `minipratt.js/shunting-yard.ts`, and `miniopp/src/parser/config/propsdata.mts` | Inspected 2026-11-01 | Pratt binding-power pairs, parser tests, and generated shift/reduce token table | Algorithm demonstrations, not a complete language specification; TypeScript and Rust variants do not expose identical operator sets. |
| SRC-033 | `/bigdata/KAI/projects/LangLLVM/src/mylang.pegjs` | Inspected 2026-11-01 | C++-style layered operator grammar | Parser grammar only; not an approved custom-language operator specification. |
| SRC-034 | User clarification in this conversation | 2026-11-01 18:39:57.143 (+01:00) | Select `@` priority 190, left-associative `.`, `^` as XOR, `**` as power, `->` as function definition, and `?` priority 45 using GenLang values; asks for remaining relative conflicts | User-approved partial operator specification; no priority for `**` or decisions on the remaining conflicts were supplied. |
| SRC-035 | User clarification in this conversation | 2026-11-01 19:05:36.092 (+01:00) | Resolve remaining precedence conflicts in favor of GenLang ordering; initially asks to remove `::` and `::=`, specifies `**` one level tighter than `*` and right-associative, and requests a non-numeric ordered table in the design | The subsequent clarification in this conversation withdraws the removal request for `::` and `::=`; see SRC-036. |
| SRC-036 | User correction in this conversation | 2026-11-01 (after 19:05:36; exact time not provided) | Keep `::` and `::=` unchanged after noting `::=` is the selected type-declaration marker; `::` has no current use case | Supersedes only the request in SRC-035 to drop those tokens; no replacement syntax or semantics for `::` is selected. |
| SRC-037 | User clarification in this conversation | 2026-11-01 19:27:31.747 (+01:00) | Place `::` at the same relative level as `:`, and place `:=` and `::=` at the same level as `=` | User-approved refinement of DEC-022; does not change the selected declaration meanings in DEC-011. |
| SRC-038 | User request in this conversation | 2026-11-01 19:47:42.245 (+01:00) | Compile the questions that must be answered in Language-Design.md before parser creation can begin | Request for an actionable readiness checklist; it does not itself approve answers to the listed open questions. |
| SRC-039 | `/bigdata/KAI/NewLang/IDEAS/Syntax.txt` | Inspected 2026-11-01 | Exploratory proposals for comment forms, string/character/raw-string syntax, escapes, Unicode source escapes, identifier properties, and whitespace | Explicitly tentative in places; not a complete lexical specification. |
| SRC-040 | `/bigdata/KAI/NewLang/parser/NLparser/Scanner.cc` | Inspected 2026-11-01 | Implemented scanner behavior for comments, XID identifiers and normalization, numbers, quoted strings/chars, raw strings, and escapes | Prototype behavior conflicts with some NewLang notes and normalizes the entire source before identifier scanning; not normative for the new language. |
| SRC-041 | `/bigdata/KAI/projects/GenLang/docs/language.md`, `packages/genlang/src/combined-definitions.json`, and `packages/compiler/src/lexer/genlang/TokenConverters.ts` | Inspected 2026-11-01 | GenLang prose and generated implementation patterns/converters for comments, identifiers, numeric/string/character literals | Prose and implementation differ in identifier-property spelling; this records experiment evidence, not a selected policy. |
| SRC-042 | `/bigdata/KAI/projects/LangLLVM/src/mylang.pegjs` | Inspected 2026-11-01 | C++-style PEG rules for comments, identifiers, escapes, and literal forms | Parser/reference grammar material, not proof of a separate LangLLVM custom-language lexical specification. |
| SRC-043 | `/bigdata/KAI/projects/OPPlang/OPPrs/miniopp/src/lexer/config/matchers.mts`, `miniopp/src/lexer/next_token.mts`, and `minipratt.js/shunting-yard.ts` | Inspected 2026-11-01 | Identifier/number/whitespace token matchers and a character-wise expression parser lexer | Parser demos only; no complete comment/string/character syntax was found in these inspected files. |
| SRC-044 | User decision in this conversation | 2026-11-01 21:22:17 (+01:00) | Select non-nested `//` and `/*...*/` comments; XID identifiers with NFKC internal names and NFC user-facing form; single-quoted characters, double-quoted strings, integer forms, universal-character names, NewLang Perl-style escapes, and decimal/hex ISO floating forms; requests raw-string options before choosing | Approved lexical direction; detailed productions and raw-string delimiter remain open. |
| SRC-045 | Official language references: [Go specification](https://go.dev/ref/spec#String_literals), [Rust Reference](https://doc.rust-lang.org/reference/tokens.html#raw-string-literals), [C++ string literals](https://en.cppreference.com/w/cpp/language/string_literal), [C# raw strings](https://learn.microsoft.com/en-us/dotnet/csharp/language-reference/tokens/raw-string), [Python lexical analysis](https://docs.python.org/3/reference/lexical_analysis.html#string-and-bytes-literals) | Consulted 2026-11-01 | Raw-string delimiter families and examples | Used to show alternatives, not to choose one. |
| SRC-046 | User follow-up in this conversation | 2026-11-01 (after SRC-044; exact time not provided) | Requests concrete examples of the raw-string options | Clarification request only; no syntax choice made. |
| SRC-047 | User decision in this conversation | 2026-11-01 (after SRC-046; exact time not provided) | Selects the NewLang tagged-backtick raw-string option | Approves the delimiter family; exact tag grammar and raw-content semantics remain open. |
| SRC-048 | User request in this conversation | 2026-11-01 21:46:33.577 (+01:00) | Requests a table of all agreed token syntaxes in Language-Design.md | Documentation consolidation request; it does not add or change a syntax decision. |
| SRC-049 | User request in this conversation | 2026-11-01 22:33:59.561 (+01:00) | For open lexer/parser questions, propose common answers; present small sets of usual alternatives for preference; list cases without easy answers or whose alternatives are all rejected as remaining blockers | Requests a decision workflow, not blanket approval of proposed answers. |
| SRC-050 | Official reference sample: [Go specification](https://go.dev/ref/spec), [Rust Reference](https://doc.rust-lang.org/reference/lexical-structure.html), [Python lexical analysis](https://docs.python.org/3/reference/lexical_analysis.html), [C++ lexical phases](https://eel.is/c++draft/lex.phases), [Java lexical structure](https://docs.oracle.com/javase/specs/jls/se25/html/jls-3.html), [Erlang numbers](https://www.erlang.org/doc/system/data_types.html#number) | Consulted 2026-11-01 | Representative lexer behavior, comments, Unicode/source handling, numeric forms, and statement boundaries | Examples are a sample, not proof of universal or majority practice; references do not decide this language's rules. |
| SRC-051 | User selections in this conversation | 2026-11-01 (after SRC-049; exact time not provided) | Global universal-character translation; reject both offered non-universal raw escape options; normalize multiline raw-string newlines to LF; use ASCII tags with empty tag allowed | No replacement raw escape rule or reason for rejection was supplied. |
| SRC-052 | User selections in this conversation | 2026-11-01 (after SRC-051; exact time not provided) | Select integer bases 2–36, single underscore between digits, both cases for radix markers, decimal interpretation of unmarked leading zeros, and typed numeric suffixes | Exact suffix syntax and type set were expressly left for later. |
| SRC-053 | User selections in this conversation | 2026-11-01 (after SRC-052; exact time not provided) | Approves all seven common lexer proposals, LP-01 through LP-07 | The proposals explicitly leave several related choices open; approval does not settle them. |
| SRC-054 | [Rust character type](https://doc.rust-lang.org/reference/types/char.html), [Java Character](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/lang/Character.html), [Swift Character](https://developer.apple.com/documentation/swift/character), [Go rune and string literals](https://go.dev/ref/spec#Rune_literals), and [NewLang syntax notes](/bigdata/KAI/NewLang/IDEAS/Syntax.txt) | Consulted 2026-11-01 | Character-value units, ordinary escapes, and NewLang's named-character/sequence and numeric escape proposals | Comparison evidence only; it does not select rules for the new language. Rust, Java, and Swift are value-model examples, not claims of identical literal syntax. |
| SRC-055 | User selections in this conversation | 2026-11-01 (after SRC-053; exact time not provided) | Selects a Unicode scalar per character literal; individual character names rather than named sequences; string-only line continuation removing following spaces/tabs; and errors for unrecognized ordinary escapes | Supplies no reason for excluding named sequences; does not decide raw-string backslashes or remaining escape details. |
| SRC-056 | [Unicode 18 announcement](https://blog.unicode.org/2026/09/announcing-unicode-standard-version-180.html), [18.0 UCD readme](https://www.unicode.org/Public/18.0.0/ucd/ReadMe.txt), [18.0 version overview](https://www.unicode.org/versions/Unicode18.0.0/), [Rust identifiers](https://doc.rust-lang.org/reference/identifiers.html), [Python physical lines](https://docs.python.org/3/reference/lexical_analysis.html#physical-lines), and [Java line terminators](https://docs.oracle.com/javase/specs/jls/se25/html/jls-3.html#jls-3.4) | Consulted 2026-11-01 | Unicode version status and representative source line-ending/version policies | Unicode's announcement and UCD call 18.0 available/final, but its overview still bears a preliminary-draft banner; no cause for the discrepancy was verified. |
| SRC-057 | User selections in this conversation | 2026-11-01 (after SRC-055; exact time not provided) | Selects specification-pinned Unicode 18.0.0 and UTF-8-only source; asks to “follow unicode standard recommendations” for line endings | Does not identify a specific Unicode document or enumerate line-ending characters. |
| SRC-058 | [Unicode 18 core §5.8.3](https://www.unicode.org/versions/Unicode18.0.0/core-spec/chapter-5/#G29990), [UAX #14 revision 57](https://www.unicode.org/reports/tr14/tr14-57.html#LB4), [Unicode 18 line-break data](https://www.unicode.org/Public/18.0.0/ucd/LineBreak.txt), and [UTS #55 source-code handling](https://www.unicode.org/reports/tr55/tr55-5.html#Atoms) | Consulted 2026-11-01 | Core newline and `readline` recommendations, UAX #14 hard breaks and CRLF, and source-editor display guidance | The documents address different contexts; none alone selects the new language's physical source-line grammar. |
| SRC-059 | User selection in this conversation | 2026-11-01 (after SRC-057; exact time not provided) | Selects all Unicode UAX #14 hard breaks, including VT, as physical source-line endings | The presented option explained CRLF pairing and the previously selected raw-string LF normalization; Unicode-escape-generated line breaks remain separate. |
| SRC-060 | [Go floating literals](https://go.dev/ref/spec#Floating-point_literals), [Rust floating literals](https://doc.rust-lang.org/reference/tokens.html#floating-point-literals), and a local Python 3.12 `tokenize` probe | Consulted 2026-11-01 | Go decimal/hex float shapes, Rust trailing-dot/member disambiguation, and Python tokenization of `.5`, `1.`, `1.foo`, `123name`, and `0b102` | Comparisons are not selected rules. Python and Rust do not define hexadecimal source float literals; the Python probe is limited to the named examples and local version. |
| SRC-061 | User selections in this conversation | 2026-11-01 (after SRC-059; exact time not provided) | Selects Go-style float shapes, separators between digits, `1.foo` as float plus identifier, an invalid-digit error for `0b102`, and “report invalid digit” for non-suffix `123foo` | The questions expressly deferred exact typed-suffix syntax and other numeric boundary cases. |
| SRC-062 | User selections in this conversation | 2026-11-01 (after SRC-061; exact time not provided) | Selects leading-dot float tokenization after an operand; invalid-digit errors for non-suffix names after digit-ending float cores; and malformed-literal errors for incomplete exponents | The previously selected `1.foo` behavior and deferred suffix spelling/type set were explicitly retained in the choices. |
| SRC-063 | [Java lexical structure, section 3.3](https://docs.oracle.com/javase/specs/jls/se25/html/jls-3.html#jls-3.3) and [C++ universal-character names](https://eel.is/c++draft/lex.universal.char) | Consulted 2026-11-02 | Java's backslash eligibility and non-recursive Unicode-escape translation; C++'s Unicode-scalar validation for universal-character names | Java's escape syntax and UTF-16 code-unit model differ from the selected `\u`/`\U` forms and the proposed scalar-only validation; these are comparison evidence, not decisions. |
| SRC-064 | User selections in this conversation | 2026-11-02 (after SRC-063; exact time not recorded) | Selects Java-style eligibility, one-pass translation, scalar-only Unicode escapes, and escape-generated line endings for ordinary-string continuation | The choice extends DEC-030's physical-only continuation. It does not settle mixed-origin CRLF, source mapping, or non-universal raw-string escapes; no additional rationale was supplied. |
| SRC-065 | One-off local Python 3 probe in this conversation | Executed 2026-11-02 | Seven DEC-035 translation examples, four malformed/non-scalar inputs, and the generated-continuation example passed | An ephemeral model, not an implementation or full lexer test; it did not test mixed-origin CRLF or raw-string behavior. |
| SRC-066 | [Go token positions](https://go.dev/src/go/token/position.go?m=text), [Go AST nodes](https://go.dev/src/go/ast/ast.go?m=text), [LSP 3.17 positions](https://microsoft.github.io/language-server-protocol/specifications/lsp/3.17/specification/#position), [Python identifiers](https://docs.python.org/3/reference/lexical_analysis.html#identifiers), and [Go source representation](https://go.dev/ref/spec#Source_code_representation) | Consulted 2026-11-02 | Byte offsets and end positions, LSP's default and negotiated position encodings, Python name normalization, and Go's unnormalized source | Comparisons concern different languages and tooling layers; they do not choose this language's coordinates, normalization phases, or source mapping. |
| SRC-067 | User selections in this conversation | 2026-11-02 (after SRC-066; exact time not recorded) | Selects one mixed-origin CRLF ending, original UTF-8 byte spans, physical diagnostic locations, and whole-source NFC after Unicode-escape translation | Whole-source NFC was selected over the recommended identifier-only option. No additional reason was supplied; detailed mapping and column units remain open. |
| SRC-068 | [Unicode 18 normalization conformance test data](https://www.unicode.org/Public/18.0.0/ucd/NormalizationTest.txt) and [UnicodeData.txt](https://www.unicode.org/Public/18.0.0/ucd/UnicodeData.txt) | Consulted 2026-11-02 | NFC examples U+0065 U+0301 to U+00E9, U+037E to U+003B, and U+212A to U+004B | Validates these examples for the selected Unicode version, not the complete source-mapping design. |
| SRC-069 | One-off local Python 3 probe in this conversation | Executed 2026-11-02 | Selected NFC examples, a BOM-counted original byte span, and three mixed-origin CRLF cases | The local Python uses Unicode 15.0.0; the selected NFC examples were separately checked against Unicode 18 data (SRC-068). This is not a complete lexer or mapping test. |
| SRC-070 | [Haskell 2010 function-type grammar](https://www.haskell.org/onlinereport/haskell2010/haskellch4.html#x10-650004.1.2), [Go semicolons](https://go.dev/ref/spec#Semicolons), and [rust-analyzer syntax trees](https://rust-analyzer.github.io/book/contributing/syntax.html) | Consulted 2026-11-02 | Right-recursive function types, automatic semicolon insertion, and a lossless syntax-tree approach | These are comparisons, not selections. Rust-analyzer's guide describes a historical 2020 snapshot; Haskell's type arrow is not the selected function-definition grammar. |
| SRC-071 | User selections in this conversation | 2026-11-02 (after SRC-070; exact time not recorded) | Selects full selected-language scope, explicit semicolons, non-associative `->`, and a lossless original-source CST plus operator/operand tree | The selection does not specify complete productions or authorize parser implementation. Mixed `.`/`->` ties, tree mapping, and error recovery remain open; no additional rationale was supplied. |
| SRC-072 | [Haskell 2010 operator fixity](https://www.haskell.org/onlinereport/haskell2010/haskellch3.html#dx8-22006) | Consulted 2026-11-02 | Same-precedence infix operators with incompatible associativity require grouping rather than implicit association | Haskell's function-type arrow has separate grammar; this is an analogy for mixed-operator fixity, not a rule already selected for this language. |
| SRC-073 | User selection in this conversation | 2026-11-02 (after SRC-072; exact time not recorded) | Chooses none of the offered mixed `.`/`->` tie rules and keeps the question as a blocker | No replacement rule or rationale was supplied; the existing precedence and associativity decisions remain unchanged. |
| SRC-074 | User selection in this conversation | 2026-11-02 (after SRC-073; exact time not recorded) | Selects syntax-error recovery with additional diagnostics and a lossless CST containing error nodes or equivalent | The choice does not specify the recovery algorithm, lexical/encoding error behavior, or operator/operand tree on errors; no rationale was supplied. |
| SRC-075 | [Unicode 18 `UnicodeData.txt`](https://www.unicode.org/Public/18.0.0/ucd/UnicodeData.txt) and [Python Unicode lookup](https://docs.python.org/3/library/unicodedata.html#unicodedata.lookup) | Consulted 2026-11-02 | Names and canonical decomposition for U+0301 and U+00E9; Python's `\N` character lookup and alias support | Python also supports named sequences, which this language excludes. Python's documented UCD version is not a substitute for the selected Unicode 18 data. |
| SRC-076 | One-off local Python 3 probe in this conversation | Executed 2026-11-02 | A literal containing `e` plus `\N{COMBINING ACUTE ACCENT}` has two scalars, while the precomposed form has one; NFC equates these examples. Python also resolved tested mixed-case names and the `LF` alias. | The host Python uses Unicode 15.0.0; the selected name and decomposition examples were separately checked in Unicode 18 data (SRC-075). The probe is illustrative, not the language implementation or a proof of all alias rules. |
| SRC-077 | User selection in this conversation | 2026-11-05 (+01:00) | Selects no additional normalization of ordinary character/string values after literal escapes; character scalar count is checked on decoded value | Source translation and whole-source NFC remain earlier phases. No additional rationale was supplied. |
| SRC-078 | [Python `unicodedata.lookup`](https://docs.python.org/3/library/unicodedata.html#unicodedata.lookup) and [Unicode Standard Annex #44, Unicode 18](https://www.unicode.org/reports/tr44/tr44-38.html) | Consulted 2026-11-05 | Python documents name aliases and named-sequence lookup; UAX #44 documents the versioned Unicode Character Database | Python lookup behavior is comparative prior art, not a required rule. Alias categories, matching details, and named-sequence support remain language choices. |
| SRC-079 | User selection in this conversation | 2026-11-05 (+01:00) | Selects Unicode 18 character names and official aliases with case-insensitive matching for `\N{name}` | Named sequences remain excluded by DEC-030. The selection does not include `\N{U+...}` or other unresolved ordinary escapes; no rationale was supplied. |
| SRC-080 | [NewLang escape notes](/bigdata/KAI/NewLang/IDEAS/Syntax.txt) and [Perl `perlrebackslash`](https://perldoc.perl.org/perlrebackslash#Named-or-numbered-characters-and-character-sequences) | Consulted 2026-11-05 | NewLang's notes list `\N{U+...}` as a question; Perl documents it as a numeric code-point form | Existing global `\uXXXX`/`\UXXXXXXXX` escapes already represent Unicode scalars; whether a variable-width synonym is useful is a language-design choice. |
| SRC-081 | User selection in this conversation | 2026-11-05 (+01:00) | Rejects `\N{U+...}` and reserves `\N{...}` for names and aliases | Global `\uXXXX`/`\UXXXXXXXX` remain the selected numeric source escapes. No rationale beyond the selection was supplied. |
| SRC-082 | [Go specification, rune literals](https://go.dev/ref/spec#Rune_literals), [Python lexical analysis, escape sequences](https://docs.python.org/3/reference/lexical_analysis.html#escape-sequences), and [Java Language Specification §3.10.7](https://docs.oracle.com/javase/specs/jls/se25/html/jls-3.html#jls-3.10.7) | Consulted 2026-11-05 | Go and Python share `\a`, `\b`, `\f`, `\n`, `\r`, `\t`, `\v`, plus quote/backslash escapes; Java documents a narrower set | These are comparisons only. Shared support does not imply universal practice or user approval. |
| SRC-083 | User selection in this conversation | 2026-11-05 (+01:00) | Selects NewLang/Perl-style simple escapes, including `\e` and `\cX` | The documented NewLang mapping is adopted: `?` -> DEL, ASCII `@`–`~` -> low five bits, otherwise error. Numeric `\x{...}`/`\o{...}` were not part of this selection. |
| SRC-084 | [Perl `perlrebackslash`](https://perldoc.perl.org/perlrebackslash#Octal-escapes) and [hexadecimal escapes](https://perldoc.perl.org/perlrebackslash#Hexadecimal-escapes), [Go specification, rune literals](https://go.dev/ref/spec#Rune_literals), [Python lexical analysis, escape sequences](https://docs.python.org/3/reference/lexical_analysis.html#escape-sequences), and NewLang's [escape notes](/bigdata/KAI/NewLang/IDEAS/Syntax.txt) | Consulted 2026-11-05 | Perl/NewLang document braced `\x{...}` and `\o{...}`; Go/Python use fixed-width numeric escape variants | These systems differ in exact width, byte/code-point meaning, and escape phase. The proposal treats any adopted braced forms as Unicode scalar values; this is not yet a decision. |
| SRC-085 | User selection in this conversation | 2026-11-05 (+01:00) | Selects `\x{hex}` and rejects `\o{octal}` for ordinary literals | The chosen hex form denotes one Unicode scalar, not bytes; malformed and non-scalar values are errors. No rationale beyond the selection was supplied. |
| SRC-086 | [Go token/whitespace specification](https://go.dev/ref/spec#Tokens) and [Python lexical analysis, whitespace between tokens](https://docs.python.org/3/reference/lexical_analysis.html#whitespace-between-tokens) | Consulted 2026-11-05 | Go ignores ASCII space, horizontal tab, CR, and LF between tokens; Python permits space, tab, and form feed as inter-token whitespace | DEC-032 already specifies a broader line-break set, including FF. These examples do not establish a universal rule for other Unicode `White_Space` characters. |
| SRC-087 | User selection in this conversation | 2026-11-05 (+01:00) | Selects all Unicode 18 `White_Space` characters as token separators except those already selected as hard line breaks | DEC-032 line-ending behavior is preserved. No additional rationale was supplied. |
| SRC-088 | [Java Language Specification §3.2, lexical translations](https://docs.oracle.com/javase/specs/jls/se25/html/jls-3.html#jls-3.2) and [§3.10.7, escape sequences](https://docs.oracle.com/javase/specs/jls/se25/html/jls-3.html#jls-3.10.7) | Consulted 2026-11-05 | Java specifies Unicode translation before input-element/literal escape interpretation | Phase ordering is comparative evidence, not proof that the user selected Java's exact interaction rule. |
| SRC-089 | User selection in this conversation | 2026-11-05 (+01:00) | Selects later ordinary-escape processing for backslashes generated by global Unicode translation | The one-pass global translation rule remains unchanged; no rationale beyond the selection was supplied. |
| SRC-090 | [LSP 3.17 position encoding](https://microsoft.github.io/language-server-protocol/specifications/lsp/3.17/specification/#position) and [Go `token.Position`](https://pkg.go.dev/go/token#Position) | Consulted 2026-11-05 | LSP positions are zero-based and default to UTF-16, with UTF-8/UTF-32 negotiation; Go positions use byte offsets and one-based byte columns | Editor protocol coordinates and user-facing diagnostic columns are different presentation layers; neither is selected here. |
| SRC-091 | User selection in this conversation | 2026-11-05 (+01:00) | Selects one-based human-facing columns counting Unicode scalars in the original physical source line, with tabs counting as one column | Original UTF-8 byte spans remain unchanged; editor positions are converted separately to the negotiated protocol encoding. |
| SRC-092 | User request in this conversation | 2026-11-05 (+01:00) | Requests an updated compilation of questions remaining before parser development | Does not select new syntax or authorize implementation. |
| SRC-093 | [Language Design](../docs/design-research/Language-Design.md) and relevant lexer/parser sections of [Wissensstand](./Wissensstand.md) | Reviewed at commit `5e32bcb`, 2026-11-05 (+01:00) | Approved DEC-008–046 where relevant, questions Q-007–016 and blockers LP-18–29 | Assessment uses the current project records; earlier experiment sources were not re-examined for this request. |
| SRC-094 | User decisions in this conversation | 2026-11-05 (+01:00) | Specifies `#` suffixes, minimal insertion, tighter `.`, reserved `::`, sequencing `;`, left `@name` binding targets, semantic identifier recognition, and confirms TypeScript; requests raw-string clarification and conditional counterexamples | Does not select raw-backslash behavior, change `?`/`:` priorities, or authorize parser implementation. |
| SRC-095 | User response to numeric-suffix clarification | 2026-11-05 (+01:00) | Selects a nonempty ASCII alphanumeric suffix sequence and radix-first interpretation for the first `#` after an unmarked integer from 2 through 36 | Selected proposal uses `0d` to force decimal suffix interpretation and retains errors for invalid digits in a recognized radix form. |
| SRC-096 | Inline Python 3 specification probes run in this project | 2026-11-05 (+01:00) | Six binary-precedence trees, eleven integer suffix/radix cases, and 254 operand/operator kind sequences checked with assertions | No project implementation or files created; binary conditional trees do not establish any unselected semantic pairing/reinterpretation rule. Integer probes are not a full float/Unicode lexer. |
| SRC-097 | `/bigdata/KAI/NewLang/parser/NLparser/Scanner.cc` raw-string branch (around lines 599–632) and inline Python 3 precedence probe | 2026-11-05 (+01:00) | NewLang raw-content backslash handling; conditional trees for `?`/`:` at the same priority | Prototype code, not normative; probe is not project parser code. |
| SRC-098 | User decisions in this conversation | 2026-11-05 22:57 (+01:00) | Selects literal non-universal raw backslashes; retains `?`/`:` priorities and requires parentheses for then-branch nesting | No other lexical or structural decisions. |
| SRC-099 | [Language Design](../docs/design-research/Language-Design.md) numeric productions and [Wissensstand](./Wissensstand.md) LP-13/14 | Reviewed 2026-11-05 (+01:00) | Existing integer, float, separator, suffix, and malformed-number decisions compared to open numeric-boundary notes | The resulting examples identify gaps to specify; they are not language decisions or lexer-test results. |
| SRC-100 | User decisions in this conversation | 2026-11-05 23:24 (+01:00) | Incomplete integers and malformed separators are errors; no leading zeros in bases; float suffixes allowed; longest match decides dot runs; asks for floating-point standard options | Does not select the ISO/IEEE edition. |
| SRC-101 | User decision in this conversation | 2026-11-05 23:46 (+01:00) | Selects option A, IEEE 754-2019 / ISO/IEC 60559:2020, as the floating-point reference | No separate rounding policy, suffix type inventory, or lexical length limit is selected here. |
| SRC-102 | User request in this conversation | 2026-11-05 23:52 (+01:00) | Requests an updated compilation of questions before creating a parser | Does not select new rules or request implementation. |
| SRC-103 | [Language Design](../docs/design-research/Language-Design.md) and parser-readiness sections of [Wissensstand](./Wissensstand.md) | Reviewed at commit `4b4767b`, 2026-11-05 (+01:00) | Current lexer, operator, tree, error, and semantic-phase decisions | Earlier experiment sources were not re-examined for this request. |
| SRC-104 | Inline Python 3 binary-precedence probe in this conversation | Executed 2026-11-05 (+01:00) | Checks `a * EMPTY - b` and equal-priority left/right groupings for `EMPTY ! a ++ EMPTY` | Illustrates ordinary binary grouping only; not a project parser or a decision about prefix/postfix binding. |
| SRC-105 | User clarification in this conversation | 2026-11-06 00:33 (+01:00) | Selects delimiter roles, sequence and list meanings, possible parallel evaluation, and no special treatment of `a * -b` for now | Does not define tree shapes, general prefix/postfix rules, or semantic validity of `EMPTY`. |
| SRC-106 | User decision in this conversation | 2026-11-06 00:40 (+01:00) | Makes `;` left-associative, gives same-level operators the same associativity, and assigns none where unspecified | Does not change precedence, make reserved `::` an expression, or settle semantic legality. |
| SRC-107 | Inline Python 3 documentation check in this conversation | Executed 2026-11-06 (+01:00) | Checks 22 precedence rows have one stated associativity and verifies the changed levels | Checks the table only; it is not a parser test. |
| SRC-108 | User decisions in this conversation | 2026-11-06 01:36 (+01:00) | Selects uniform longest tokens, minimal invalid runs, contextual error-token classification, binary CST plus comments without a first-parser AST, and single-character Unicode errors | Does not define all candidate productions, error-node layouts, or malformed-Unicode character units. |
| SRC-109 | User clarification through the question form in this conversation | 2026-11-06 (+01:00), after SRC-108 | Combines uniform longest matching with digit/base checks only after tokenization; asks which conflicts remain | Does not broaden the grammar for incomplete numbers/separators or select an exception to longest matching. |
| SRC-110 | [Language Design](../docs/design-research/Language-Design.md) DEC-029/033/034/047/057–061 and current parser-output requirements | Reviewed against commit `b51e1b3`, 2026-11-06 (+01:00) | Existing complete-token shapes and diagnostic requirements compared with SRC-108/109 | Conflict examples are specification analysis, not lexer/parser test results or new selected productions. |
| SRC-111 | User decision in this conversation | 2026-11-06 01:56 (+01:00) | Approves permissive candidate matching for malformed numeric and other constrained lexical forms, followed by validation | Selects this approach, not the exact candidate productions or token-kind tie-breaks. |
| SRC-112 | User request in this conversation | 2026-11-06 02:10 (+01:00) | Requests an updated compilation of questions before creating a parser | Does not choose new language rules or request implementation. |
| SRC-113 | [Language Design](../docs/design-research/Language-Design.md) and [Wissensstand](./Wissensstand.md), current working-tree versions | Reviewed 2026-11-06 (+01:00) | DEC-067–071, existing lexer/parser requirements, and remaining questions | Includes uncommitted changes after `b51e1b3`; earlier experiment sources were not re-examined. |
| SRC-114 | User decisions in this conversation | 2026-11-06 (+01:00), following the parser-readiness compilation | Specifies delimiter-tree behavior, matching errors and missing-closer insertion at EOF, empty groups, ordinary prefix/postfix parsing, semantic rejection of `::`, comments as lexical whitespace, and universal operator/operand syntax | Does not select concrete CST layouts, source mappings, or all remaining recovery and candidate-boundary details. No parser implementation requested. |
| SRC-115 | User request in this conversation | 2026-11-06 02:46 (+01:00) | Requests a fresh compilation of questions before creating a parser | No new language decision or implementation request. |
| SRC-116 | [Language Design](../docs/design-research/Language-Design.md) and [Wissensstand](./Wissensstand.md), as committed in `0ade6eb` | Reviewed 2026-11-06 (+01:00) | Current lexer, operator/operand, grouping, CST, source-mapping, and recovery decisions and open questions | Earlier experiment sources were not re-examined. |
| SRC-117 | [Unicode 18 UnicodeData](https://www.unicode.org/Public/18.0.0/ucd/UnicodeData.txt), [composition exclusions](https://www.unicode.org/Public/18.0.0/ucd/CompositionExclusions.txt), and a one-off Python 3 NFC probe | Reviewed 2026-11-06 (+01:00) | Illustrates non-contiguous source contributors after canonical reordering and composition | The Python host uses Unicode 15.0.0; the Unicode 18 property checks are not a full Unicode 18 normalization conformance test. |
| SRC-118 | User decisions in this conversation (six numbered answers) and the follow-up `ask_user` form answers | Datum unbekannt (session before compaction) / 2026-11-06 (+01:00) | Incomplete-number and line-ended literal errors, Unicode error characters, error collapse/binding, comment-only file, unexpected closers, token-level normalization; form: keep number-tail errors, NFC for all string forms on source text before escapes, Unicode errors inside comments/literals diagnostic-only | Durable record is this summary; exact event time of the six answers is not available. |
| SRC-119 | [The Unicode Standard 18.0.0, Chapter 3](https://www.unicode.org/versions/Unicode18.0.0/core-spec/chapter-3/), §3.9.6 "U+FFFD Substitution of Maximal Subparts" | Reviewed 2026-11-06 (+01:00) | Recommended replacement unit for ill-formed UTF-8: each maximal subpart becomes one U+FFFD and conversion proceeds after it | Fetched and grepped; the section's full text was not otherwise reviewed. |
| SRC-120 | One-off Node v26.13.0 probes (`TextDecoder`, `String.prototype.normalize`, Unicode 17) | 2026-11-06 (+01:00) | `61 E2 82 62` gives one U+FFFD; `F0 80 80`, `C0 AF`, and `ED A0 80` give 3, 2, and 3. NFC maps `\n`+U+0303 to `\ñ`, `e`+U+0301 to U+00E9, U+037E to `;`, and `=`/`<`+U+0338 to U+2260/U+226E. | Host runtime uses Unicode 17, not the pinned 18.0.0; not a project lexer test. |
| SRC-121 | User decisions in this conversation (nine numbered answers) | 2026-11-06 16:18 (+01:00) | Adds an identifier/number adjacency rule; answers the KP-087 open points on EOF extents, ties, fallback runs, error binding, collapse, closers, empty files, and spans | Answer 3 is a question ("Can there be ties?"), not a decision. |
| SRC-122 | User decision in this conversation | 2026-11-06 16:30 (+01:00) | Accepts the proposal to use one numeric candidate for integers and floats, then classify the match | Exact candidate grammar remains open. |
| SRC-123 | User request in this conversation | 2026-11-06 16:35 (+01:00) | Requests a documentation directory with a design/research subdirectory, and relocation of `langlist` and `Language-Design.md` into it | The user did not prescribe directory names or request changes to the experiment trees. |
| SRC-124 | User request in this conversation | 2026-11-06 16:47 (+01:00) | Requests a compiler plan: generic base, then lexer/parser according to Language Design; always TDD; necessary agent support files | Planning/guidance request, not approval of implementation phases, new tooling, or commits. |
| SRC-125 | Current Language Design, relevant current knowledge and KP-088–090, repository inventory | Reviewed 2026-11-06 (+01:00), baseline commit `7da7c1f` | Compiler frontend constraints, remaining numeric grammar question, confirmed TypeScript, and absence of compiler source/manifests/tests or agent guidance | Earlier experiment trees and historical source coverage were not re-examined. |
| SRC-126 | User approval in this conversation | 2026-11-06 17:05 (+01:00) | "approved. commit changes, then start implementing the plan." | Approves roadmap/toolchain and requests planning commit before implementation; existing per-phase confirmation checkpoints remain. |
| SRC-127 | Phase 1 implementation/review reports and local verification commands | 2026-11-06 (+01:00) | Test-first foundation implementation, runtime-validation review findings/fixes, 49-test pass, type-check/build/export smoke, Node LTS/Unicode metadata | Foundation only; no Unicode 18 conformance, decoding, lexing, or parsing verified. Node 24 not tested. |
| SRC-128 | User confirmation in this conversation | 2026-11-06 17:36 (+01:00) | "commit that, then continue" | Authorizes Phase 1 commit and Phase 2 execution, retaining per-phase checkpoints. |
| SRC-129 | Phase 2 implementation/review reports, source inspection and local checks | 2026-11-06 (+01:00) | Source decoder/translator/provenance, Unicode18 data package, 94-test/type-check/build/export-smoke results, explicit initial TDD evidence gap | Not a lexer/parser or normalization implementation; added coverage is not retrospective behavioral red. |
| SRC-130 | Official versioned Unicode UCD ReadMe/DerivedAge and installed package metadata | Checked 2026-11-06 (+01:00) | ReadMe states final 18.0.0; DerivedAge lists U+0558 as 18.0; installed `@unicode/unicode-18.0.0` is 2.1.0, MIT | These probes verify provenance/version examples, not exhaustive Unicode conformance. |
| SRC-131 | User confirmation in this conversation | 2026-11-06 18:18 (+01:00) | "commit that, then continue" | Authorizes Phase 2 commit and Phase 3 implementation, retaining phase checkpoints. |
| SRC-132 | Phase 3 implementation/review reports, inspected code, local verification | 2026-11-06 (+01:00) | Core scanner, Unicode18 generated normalization, behavioral-red evidence, 110 tests and type-check/build/export smoke | Core lexer only; deferred literal/numeric surfaces and later parser behavior not implemented. |
| SRC-133 | Official Unicode18 normalization files/fixture and checksum-verified generator | 2026-11-06 (+01:00) | 20,171 normalization rows, five columns each for NFC/NFKC; official hashes and licensing/provenance documented | Full fixture-row comparisons, not a claim of untested forms NFD/NFKD or host conformance. |

## Entries

### KP-001 - First-pass experiment and upstream-source classification

- Documented: 2026-11-01 (+01:00)
- Event date: 2026-11-01 (+01:00)
- Capture: contemporaneous
- Sources: SRC-001, SRC-002, SRC-003
- Related requirements/decisions/questions: REQ-001, DEC-001, Q-001, Q-002
- Supersedes: Not applicable

#### Starting point and user perspective

The user describes four directories accumulated over years while experimenting with creating a programming language. They also contain source material from other internet projects that is more or less related to language creation. The stated goal for this first task is to distinguish the experiment files from those other projects. This is a summary of the user's statement, not an independently verified history of how the directories were assembled.

#### Alternatives discussed

| Alternative | Stated reasons for | Stated objections | Result |
| --- | --- | --- | --- |
| Inventory and classify without changing source files | Directly answers the requested identification task while preserving the original archive | None stated | Used for this first pass; no move/delete authorization was given. |
| Move, delete, or reorganize files immediately | Not discussed | Ownership is uncertain for some files; no such action was requested | Not performed. |

#### Result and evidence

`langlist` lists `/bigdata/KAI/NewLang`, `/bigdata/KAI/projects/GenLang`, `/bigdata/KAI/projects/LangLLVM`, and `/bigdata/KAI/projects/OPPlang`. The last root contains the reviewed subdirectory `OPPrs`.

The inspected evidence supports these initial groupings:

- `GenLang` is a coherent language-processing/language project: its package manifest, package workspaces, language specification, and examples align.
- `LangLLVM/src` and its grammar-processing scripts are a compiler/parser experiment; its manifest and README describe a language compiler.
- `NewLang` is mixed: its parser/compiler directories and design notes are experiments, while directories such as Clang tools, Boehm GC, ICU, Bison, Unicode data/specifications, and language/package distributions are separate external or reference material. The ANSI C grammar headers explicitly attribute their source to Jutta Degener.
- `OPPrs` is mixed: `miniopp` and `minipratt.js` are Kai-authored experiments; `JSONFROMTABLE` and Rust `minipratt` identify separate projects; `bison-calc` contains upstream sample grammars alongside Kai's Bison-output analysis scripts.
- Dependencies, generated parser/code outputs, build directories, and editor artifacts were distinguished from primary source where their names and build files supported that inference.

The directory grouping and classifications above are evidence-based first-pass findings, not a claim that every file has been reviewed. The entries in Wissensstand mark uncertain files and archives explicitly. No source files were changed.

#### Contradictions, uncertainty, and missing evidence

Ownership remains uncertain for selected NewLang root materials (`opp.c`, the PDF, HTML practice file, `mist`, and older backups/archives), and for `GenLang/ARCHIVE.zip`. Folder placement or a suggestive filename alone does not establish authorship. Nested dependency trees and archives can contain further independent projects and were not opened exhaustively.

#### Consequences and next step

The current result is recorded in the Wissensstand. If exact ownership is required, review Q-001 against file headers, archive listings, and available version history. Do not move or delete files until that review and the user’s intent are clear.

### KP-002 - Features, implementation languages, and parser algorithms

- Documented: 2026-11-01 (+01:00)
- Event date: 2026-11-01 (+01:00)
- Capture: contemporaneous
- Sources: SRC-002 and the follow-up request in this conversation (2026-11-01)
- Related requirements/decisions/questions: REQ-001, DEC-002, Q-003
- Supersedes: Not applicable; extends KP-001 without changing its file classification.

#### Starting point and user perspective

The user set the next task as extracting what features the language experiments tried or planned, which implementation languages were used, and which main algorithms were used. This is a request to synthesize historical project artifacts, not approval of any one language design.

#### Alternatives discussed

| Alternative | Stated reasons for | Stated objections | Result |
| --- | --- | --- | --- |
| Combine every grammar and parser example as one language design | None stated | Would conflate clearly separate upstream C/C++/calculator grammars and parser algorithm experiments with custom language proposals | Rejected as an unreliable inference. |
| Separate proposals, observed implementation, and upstream/sample material | Keeps planned features and concrete code distinct | None stated | Used in Wissensstand; disagreement between artifacts remains open. |

#### Result and evidence

The review of NewLang architecture/syntax notes and parser sources found proposals for reflective stack bytecode, native interoperation, modules/classes/generics and value/reference type systems, coroutines, multiple return values, and Unicode-aware source handling. C++ is used in parser/scanner prototypes; Perl in grammar/Bison tooling. Scheme/Chicken and C appear as possible implementation targets only. A toy arithmetic parser uses precedence-based shift/reduce stack reduction; a separate Unicode scanner/parser experiment uses NFC, XID identifiers, and synthetic APPLY/EMPTY-like symbols, while its tree-generation parser is visibly incomplete.

GenLang has a language specification for static typing, C-style control flow/declarations, broad expression syntax, Unicode identifiers, implicit application and empty operands. TypeScript implements the package suite. Inspected compiler sources show a generated operator precedence/shifting table, two-stack precedence parsing, AST rework, type checking, and interpretation. The spec is not proof of complete feature coverage.

LangLLVM includes C++-style PEG grammar files, a distinct design note proposing explicit declaration operators/templates/function types, and a TypeScript/LLVM-binding test that emits minimal IR/bitcode. Perl scripts process grammar. The inspected material does not show a complete custom-language compiler.

OPPrs is mainly an expression-parser algorithm collection: TypeScript `miniopp` uses shift/reduce binding powers; Rust `minipratt` uses Pratt binding powers; TypeScript `minipratt.js` studies an iterative frame-stack variant. Bison calculator and ANSI C grammars are references/samples, not custom-language feature evidence.

#### Contradictions, uncertainty, and missing evidence

It remains unknown whether the LangLLVM declaration-design note belongs to the same language as the NewLang architecture notes. Several grammars deliberately test existing language syntax or parser algorithms. No full build/test was run, so implementation statements describe source mechanisms, not verified end-to-end functionality.

#### Consequences and next step

The Wissensstand now groups source-backed findings by experiment and labels proposals versus observable implementation. Q-003 captures the unresolved relationship between design-note sets. If a single consolidated language specification is desired, first identify which experiment/version is authoritative; do not combine all proposed features by assumption.

### KP-003 - Combined feature inventory and next-attempt framing

- Documented: 2026-11-01 (+01:00)
- Event date: 2026-11-01 (+01:00)
- Capture: contemporaneous
- Sources: SRC-002; follow-up user message in this conversation (2026-11-01)
- Related requirements/decisions/questions: DEC-003, DEC-004, Q-003
- Supersedes or clarifies: Clarifies the open relationship noted in KP-002; the experiments are distinct, not one evolving project.

#### Starting point and user perspective

The user stated: “these are distinct experiments with overlapping goals.” They also said: “it seems that typescript should be the next implementation language.” The first statement establishes the framing for the synthesis. The TypeScript statement is phrased tentatively; it is recorded as the current preference, not as an irrevocable implementation decision. The user asked for a combined inventory of features, obvious conflicts, and rough implementation effort if features are selected.

#### Alternatives discussed

| Alternative | Stated reasons for | Stated objections | Result |
| --- | --- | --- | --- |
| Treat all experiments as stages of one language | None | User clarified they are distinct experiments with overlapping goals | Rejected; preserve provenance by experiment. |
| Build a combined candidate list, identify conflicts, and estimate relative effort | User's requested next step | None stated | Completed as an inventory; no feature choice made. |
| Select a feature set now | Not requested | The current task is to prepare the inventory for later selection | Deferred; Q-003 remains open. |

#### Result and evidence

The Wissensstand now contains a deduplicated feature candidate table spanning lexical/Unicode behavior, literals and expressions, declarations and static types, aggregate and object models, functions/control flow, modules, channels/concurrency, runtime/interop, and compiler architecture. It marks each feature's source experiment and gives rough TypeScript effort levels with assumptions. A separate conflict table records choices such as NFC vs NFKC, implicit application vs explicit calls, declaration syntax, generic delimiters, type/lifetime models, return/coroutine conventions, overload resolution, object models, and VM/native runtime choices.

Effort ratings are assistant estimates for a small TypeScript tree-walking implementation baseline. They are not measurements, user approval, or a schedule. The notes explicitly distinguish language features from implementation architecture and parser algorithms. No source project code was changed and no build/test was run.

#### Contradictions, uncertainty, and missing evidence

Some candidate features appear only as design questions or proposals, while others appear in a language spec or parser prototype; their presence does not mean they were implemented or approved. Interactions between features could change effort substantially. No next-attempt feature set, syntax, runtime model, or MVP boundary has yet been selected.

#### Consequences and next step

DEC-003 records the user's clarification that the experiments are distinct. DEC-004 records TypeScript as the tentative implementation-language preference. Q-003 asks which feature candidates to choose and what the first slice should include. The candidate matrix and conflict analysis are in the Wissensstand; the next discussion can use that inventory to select a coherent subset.

### KP-004 - Unicode identifier-normalization guidance

- Documented: 2026-11-01 (+01:00)
- Event date: 2026-11-01 (+01:00)
- Capture: contemporaneous research following the user's question about current and next Unicode recommendations
- Sources: SRC-004, SRC-005, SRC-006; the existing experiment evidence summarized in KP-002
- Related requirements/decisions/questions: DEC-005, Q-004
- Supersedes: Not applicable; this adds standards context to the unresolved NFC/NFKC conflict in KP-003.

#### Question and evidence

The user asked what current and next Unicode standards recommend for programming-language identifier normalization. UAX #31 Unicode 18.0.0 Revision 45 states in §5 that NFC is generally appropriate for case-sensitive identifiers and NFKC is generally more appropriate for case-insensitive identifiers. It recommends XID identifier properties for most use. This is guidance rather than a universal requirement.

UAX #31 distinguishes equivalent normalized identifiers (R4) from filtered normalized identifiers (R6): R4 makes identifiers with the same specified normalization form equivalent, while R6 requires allowed identifier spellings to already be in that form. For NFKC, §5.1 modifications are required. Case-insensitive identifiers additionally require a specified case-folding policy. NFKC folds compatibility distinctions and can therefore conflate spellings that NFC keeps distinct; UAX #31 cautions about mathematical alphanumeric symbols.

At the check, the official proposed-update page listed no proposed update. A Unicode 19.0 / next-version UAX #31 draft was not available in the checked sources. Therefore the next-version recommendation remains unknown; recheck once a draft is published.

#### Recommendation and status

A reasonable **proposal**, not yet user-approved, is NFC-normalized equality keys for a case-sensitive language, while preserving original spellings for diagnostics and display. Separately decide whether to accept and normalize non-NFC source spellings or reject them. This is consistent with the standard's general guidance and with NewLang's NFC scanner, but conflicts with GenLang's NFKC specification. No language policy was finalized in this discussion.

#### Consequences and next step

The Wissensstand records the standards evidence and the proposal. Q-004 remained open at this checkpoint for the user's choice of normalization form and source-spelling policy; KP-005 records the later resolution. Continue resolving the feature conflict table one issue at a time; the next-version Unicode guidance must be revisited when an official draft appears.

### KP-005 - NFC identifier equality decision

- Documented: 2026-11-01 (+01:00)
- Event date: 2026-11-01 (+01:00)
- Capture: contemporaneous; user selected a policy after the standards guidance was summarized
- Sources: user's structured selection in this conversation; SRC-004
- Related requirements/decisions/questions: DEC-006, Q-004, Q-005
- Supersedes: The unresolved state of Q-004 in KP-004; it does not supersede the historical alternatives.

#### User decision

The user selected: “Case-sensitive; normalize to NFC for equality and preserve source spelling.” This resolves the NFC-versus-NFKC choice and the equality-versus-filtering question. The implementation interpretation is to derive an NFC comparison key while retaining the written spelling; identifiers are not rejected solely for being written in a non-NFC form. Identifier-start/continue rules and exclusions remain undecided.

#### Consequences and next step

DEC-006 records the approved decision in the Wissensstand and the initial [Language Design](../docs/design-research/Language-Design.md). This policy avoids NFKC compatibility folding. The next step was to choose identifier characters and a Unicode data version; KP-006 records the user's selection of the proposed XID syntax. The property version remains open; revisit standards guidance when a next-version draft becomes available.

### KP-006 - XID identifier syntax decision

- Documented: 2026-11-01 (+01:00)
- Event date: 2026-11-01 12:50:55 (+01:00)
- Capture: contemporaneous; user approved a prior proposal by reference
- Sources: SRC-007; user's statement in this conversation
- Related requirements/decisions/questions: DEC-007, Q-005, Q-006
- Supersedes: The unresolved character-set portion of Q-005 in KP-005; the Unicode property version remains unresolved.

#### User decision and interpretation

The user said: “for the identifier character set let's use the proposed syntax.” The inspected proposal in NewLang's `IDEAS/Syntax.txt` states that identifier syntax is based on Unicode UAX #31 `XID_Start` / `XID_Continue`. This is recorded as UAX #31 R1: one `XID_Start` code point followed by zero or more `XID_Continue` code points. No extra start character is added; therefore `_` is allowed only as a continuation character. No explicit character exclusions beyond the properties are specified.

#### Consequences and next step

DEC-007 updates the [Language Design](../docs/design-research/Language-Design.md) and resolves the character-set policy. The Unicode property-data version remains open as Q-006. The recorded proposal contains no version choice, so none is inferred.

### KP-007 - Implicit expression-token insertion and semantic validation

- Documented: 2026-11-01 (+01:00)
- Event date: 2026-11-01 13:05:05 (+01:00)
- Capture: contemporaneous; user specified the expression token model and clarified the EMPTY trigger
- Sources: SRC-008
- Related requirements/decisions/questions: DEC-008, DEC-009, Q-007, Q-008
- Supersedes: The unresolved application/call/empty-operand conflict recorded in KP-003; detailed priorities and semantic legality remain open.

#### User specification

The user specified that, after comments are stripped, source is treated as an alternating operand/operator sequence. Whitespace is used to separate tokens, except as part of strings and comments. Syntactic elements are classified as operators, identifiers, or constants; identifiers and constants are operands.

When two operands are directly adjacent, insert an implicit application operator (`APPLY`) with no explicit source syntax. When two operators are directly adjacent, insert an implicit empty operand (`EMPTY`), also with no explicit source syntax. The user clarified the second trigger as adjacent operators.

The resulting sequence is converted into a tree according to operand-priority rules. The inserted elements' legality in their semantic contexts is checked during semantic analysis, not during parsing. This phase ordering is a user-stated design constraint, not an implementation result.

#### Consequences and next step

DEC-008 and DEC-009 record these rules in [Language Design](../docs/design-research/Language-Design.md). This resolves whether implicit application is part of the syntax model and when inserted elements are validated. The complete operand-priority table and rules for semantic legality remain open as Q-007 and Q-008.

### KP-008 - Unary operators represented by empty operands

- Documented: 2026-11-01 (+01:00)
- Event date: 2026-11-01 13:10:22 (+01:00)
- Capture: contemporaneous; user clarified how unary operators use the implicit empty operand
- Sources: SRC-009 and the operand/operator tree model in SRC-008
- Related requirements/decisions/questions: DEC-010, Q-007, Q-008
- Supersedes: No earlier rule; elaborates the role of `EMPTY` in KP-007.

#### User statement and interpretation

The user stated that unary prefix and postfix operators are implemented by empty operands. In the established operand/operator tree model, this is represented as a prefix operator with an implicit `EMPTY` operand on its left, and a postfix operator with an implicit `EMPTY` operand on its right. This side mapping is the structural interpretation recorded here; semantic analysis determines which operators accept a missing-side operand.

#### Consequences and next step

DEC-010 adds this rule to [Language Design](../docs/design-research/Language-Design.md). Unary operators therefore do not require a separate tree-forming mechanism, but their precedence and semantic validity remain part of Q-007 and Q-008.

### KP-009 - Declaration concepts across experiments

- Documented: 2026-11-01 (+01:00)
- Event date: 2026-11-01 13:39:09.993 (+01:00)
- Capture: contemporaneous source review in response to the user's request to show declaration concepts
- Sources: SRC-010, SRC-011, SRC-012
- Related requirements/decisions/questions: Q-009; no new design decision
- Supersedes: Not applicable; consolidates evidence without selecting among alternatives.

#### Findings

GenLang's specification provides concrete C-style, type-first syntax: variable declarations can have comma-separated declarators and optional initializers; function declarations place the result type first, use typed named parameters, and distinguish a prototype ending in `;` from a definition with a body.

LangLLVM's design note proposes name-first binding markers, using `:` for constants, `:=` for variables, and `::=` for types. It also sketches template parameters/arguments in square brackets, initializer expressions, function expressions and function types. The note questions whether declaration and definition need separate concepts when a binding marker already identifies a new binding.

NewLang's notes describe compilation units with a package/namespace header followed by struct definitions, modules as classes, packages as collections of modules with exported interfaces, flat and reference type categories, and functions with argument/result lists. These are architectural and semantic concepts, not a fully specified declaration syntax. The ANSI C grammar in the NewLang tree is reference material, not evidence that NewLang adopted C declaration grammar.

#### Status and next step

The Wissensstand records the three concepts side by side and initially tracked the declaration choice as Q-009. No syntax was chosen in that turn; the user asked to see the concepts, not to select one. KP-010 records the later selection of the LangLLVM model. Its remaining semantic and declaration-versus-definition questions stay open.

### KP-010 - LangLLVM declaration model selected

- Documented: 2026-11-01 (+01:00)
- Event date: 2026-11-01 14:14:08.730 (+01:00)
- Capture: contemporaneous; user selected the LangLLVM model after reviewing the declaration alternatives
- Sources: user's statement in this conversation; SRC-011
- Related requirements/decisions/questions: DEC-011, Q-009, Q-010
- Supersedes: The unresolved syntax-selection portion of Q-009 as recorded in KP-009; it does not resolve binding semantics or declaration-versus-definition behavior.

#### User decision and interpretation

The user said: “let's use the LangLLVM model.” This is recorded as adopting its name-first markers—`:` for constants, `:=` for variables, and `::=` for types—as well as the associated square-bracket template parameter/argument notation, function expressions `{ BODY }`, and function types `(INPARAMS) -> (OUTPARAMS)`. The model's binding forms allow a type or initializer expression; the source note defines a type form as `SOMETYPE` optionally followed by an initializer.

This selects the LangLLVM proposal over GenLang's C-style type-first declaration syntax. It is not evidence that the syntax has been fully specified or implemented. The design note explicitly leaves open whether declarations and definitions should be distinct; this remains unresolved, along with scope, visibility, precise initialization, and type inference/annotation semantics.

#### Consequences and next step

DEC-011 updates [Language Design](../docs/design-research/Language-Design.md) and resolves the syntactic-model choice. Q-009 now tracks remaining binding semantics; Q-010 tracks declaration-versus-definition behavior.

### KP-011 - Predefined identifiers instead of keywords

- Documented: 2026-11-01 (+01:00)
- Event date: 2026-11-01 14:46:08.730 (+01:00)
- Capture: contemporaneous; user clarified template delimiters and the status of keyword-like names
- Sources: SRC-013
- Related requirements/decisions/questions: DEC-011, DEC-012, Q-009
- Supersedes: The unresolved reserved-keyword versus predefined/contextual-identifier conflict from KP-003; the precise name-resolution rules remain open.

#### User decision

The user confirmed square brackets for template parameters and stated that the design should have no keywords, only predefined identifiers. While these identifiers are not redefined, their semantic effect should closely emulate the effect they would have if declared as keywords. This means keyword-like behavior belongs to identifier semantics rather than a separate reserved-token category.

No exact rules were supplied for what counts as redefinition, how local bindings shadow predefined identifiers, or whether some predefined names are protected. These are not inferred and remain within Q-009's name-resolution/scope work.

#### Consequences and next step

DEC-012 records the no-keywords rule in [Language Design](../docs/design-research/Language-Design.md); DEC-011 already records square brackets as the template delimiter. The reserved-keyword conflict is resolved, while the exact lookup and redefinition mechanics remain open.

### KP-012 - Static typing with explicit or inferred types

- Documented: 2026-11-01 (+01:00)
- Event date: 2026-11-01 15:25:31.363 (+01:00)
- Capture: contemporaneous; user specified the typing approach
- Sources: SRC-014
- Related requirements/decisions/questions: DEC-013, Q-009
- Supersedes: The unresolved static-versus-inferred/dynamic choice in the feature conflict inventory; it does not define the inference or compatibility rules.

#### User decision

The user stated that the language should be statically typed and that types may be explicit or inferred. This establishes that inferred types are still determined statically; it does not imply dynamic typing.

#### Consequences and next step

DEC-013 records the typing requirement in [Language Design](../docs/design-research/Language-Design.md). Q-009 remains open for type-inference rules, cases requiring annotations, type compatibility, and the timing/scope of type checking.

### KP-013 - Safety-first type compatibility

- Documented: 2026-11-01 (+01:00)
- Event date: 2026-11-01 15:34:00.898 (+01:00)
- Capture: contemporaneous; user stated a design principle for type compatibility
- Sources: SRC-015
- Related requirements/decisions/questions: DEC-014, Q-009
- Supersedes: The previously open general type-compatibility policy in KP-012; the concrete compatibility rules remain open.

#### User decision

The user stated the fundamental type-compatibility principle: when an operation can be proven safe, allow it; otherwise reject it. This establishes a conservative default: lack of a safety proof means rejection.

The user did not define what safety means for each operation, which facts the type system may use as proof, whether any runtime checks can establish safety, or whether an explicitly unsafe escape hatch will exist. None of those mechanisms is implied by the principle.

#### Consequences and next step

DEC-014 records the principle in [Language Design](../docs/design-research/Language-Design.md). Q-009 remains open for the safety properties and proof criteria, alongside inference, annotation, and checking details.

### KP-014 - Value/reference types and field collections

- Documented: 2026-11-01 (+01:00)
- Event date: 2026-11-01 15:45:16.934 (+01:00)
- Capture: contemporaneous; user stated a type-model distinction and a collection requirement
- Sources: SRC-016
- Related requirements/decisions/questions: DEC-015, REQ-002, Q-011
- Supersedes: The unresolved choice whether to distinguish value and reference types in the feature conflict table; ownership, lifetime, and memory-management details remain unresolved.

#### User statement

The user stated that the language distinguishes value types and reference types. A reference type consists of an implicit value type, comparable to a pointer, that identifies a variable in the same way a name identifies a variable. Variables can hold either value types or reference types. The user also stated that the language has collections of fields identified by names or indices.

This records the user's conceptual description without assuming that a reference is literally a machine pointer, that it stores a source-level name, or that a collection has either value or reference semantics.

#### Open details and consequences

DEC-015 and REQ-002 record the model and collection requirement in [Language Design](../docs/design-research/Language-Design.md). Q-011 tracks the unresolved operational meaning of variable identity, aliasing, reference lifetime/validity, and the representation and value/reference classification of named/indexed field collections. No garbage collector, deterministic destruction, ownership discipline, or other lifetime mechanism is selected by this statement.

### KP-015 - Multiple parameters and returns as temporary collections

- Documented: 2026-11-01 (+01:00)
- Event date: 2026-11-01 15:54:23.525 (+01:00)
- Capture: contemporaneous; user clarified the logical model for multiple parameters and returns
- Sources: SRC-017
- Related requirements/decisions/questions: DEC-016, Q-011
- Supersedes: No earlier rule; clarifies the relationship between function argument/result lists and the general field-collection model.

#### User statement

The user stated that, logically, multiple-result parameters and returns work like single temporary collections. This is recorded as one temporary collection representing the parameter set and one temporary collection representing the return set, rather than as an implementation mandate to allocate concrete collection objects.

#### Open details and consequences

DEC-016 adds the logical model to [Language Design](../docs/design-research/Language-Design.md), related to the named/indexed field collections in REQ-002. The concrete type and syntax of these collections, field naming/indexing, construction/unpacking behavior, lifetime, and whether they are observable as ordinary values remain open under Q-011.

### KP-016 - GC-like reference behavior with lifetime optimizations

- Documented: 2026-11-01 (+01:00)
- Event date: 2026-11-01 15:56:54.545 (+01:00)
- Capture: contemporaneous; user clarified reference lifetime behavior and permitted optimizations
- Sources: SRC-018
- Related requirements/decisions/questions: DEC-017, Q-011
- Supersedes: The unresolved question whether reference lifetimes use GC or deterministic destruction in KP-014; predictable-lifetime optimization is now permitted, but concrete mechanics remain open.

#### User decision

The user stated that reference values behave as if governed by garbage collection, while specific cases may be optimized when lifetimes can be predicted well enough. This establishes garbage-collected behavior as the semantic model while allowing implementation optimizations for provably predictable lifetimes.

This does not require a particular tracing/reference-counting collector or any other concrete collector design. Nor does it establish manual destruction, ownership annotations, or a particular stack/heap placement rule. Any optimization is understood to preserve the observable behavior of the GC-like model.

#### Consequences and next step

DEC-017 records the lifetime model in [Language Design](../docs/design-research/Language-Design.md). Q-011 now includes the proof criteria and behavior-preservation conditions for lifetime optimizations, in addition to the still-open identity and collection semantics.

### KP-017 - Closest-namespace lookup and explicit overload groups

- Documented: 2026-11-01 (+01:00)
- Event date: 2026-11-01 16:11:26.061 (+01:00)
- Capture: contemporaneous; user specified namespace lookup and overload selection
- Sources: SRC-019
- Related requirements/decisions/questions: DEC-012, DEC-018, Q-009
- Supersedes: The previously open general lookup and overload-resolution choices in KP-003 and KP-011; namespace ordering details and exact ranking remain open.

#### User decision

The user specified a namespace hierarchy containing predefined, imported, and block-related namespaces, with name lookup selecting the declaration in the closest namespace.

Overloading must be explicit: declaring same-named functions alone does not form an overload group. An explicit overload declaration identifies the functions to group. Resolution first applies type compatibility rules. If more than one candidate remains, identical types take precedence over merely compatible types. The resolution must leave exactly one candidate.

The unique-candidate requirement means an unresolved tie cannot be selected arbitrarily. The precise error behavior, namespace/import ordering, overload declaration syntax and validation, and ranking when a call has a mixture of identical and merely compatible argument types were not specified.

#### Consequences and next step

DEC-018 records these rules in [Language Design](../docs/design-research/Language-Design.md). Q-009 now tracks the remaining namespace, declaration, ranking, and type-checking details.

### KP-018 - Object models across prior experiments

- Documented: 2026-11-01 (+01:00)
- Event date: 2026-11-01 17:32:17.450 (+01:00)
- Capture: contemporaneous; user requested a historical comparison
- Sources: SRC-020, SRC-021, SRC-022, SRC-023, SRC-024, SRC-025
- Related requirements/decisions/questions: Q-003; no new language-design decision
- Supersedes: No earlier findings; refines the cross-project object-oriented feature inventory by distinguishing design intent from parser grammar and implementation evidence.

#### Findings

NewLang has the clearest and most extensive object model proposal. `OtherStuff.txt` says modules are classes and packages group modules behind exported interfaces. It proposes reference classes and flat/value types, with subtype values allowed in reference-typed variables but exact declared types for flat variables; flat values are destroyed on leaving scope, while unreachable reference values are eventually garbage-collected. It further sketches class/metaclass objects, one class object per parameterization, and lazy class-object creation. Mixins are described as outside the `Object` inheritance tree and not instantiable by themselves. `newlang.ye` supplies Java-like syntax for classes with a superclass and implemented interfaces, fields, methods, constructors, modifiers, and nested declarations. These are proposals/grammar, not proof of a functioning implementation. The semantics of class variables are explicitly posed as an open question; local functions as function objects are also only a question.

NewLang's `Implementation.txt` separately proposes reflective bytecode/native interoperation through derived wrappers that redirect virtual calls between interpreter and native code, with native compilation targets implementing an interface or abstract class. This is an implementation architecture sketch, not another language-level object model and not evidence of completion.

The reviewed GenLang specification is C-like and procedural, with functions and C-style aggregate types (`struct`, `union`, `enum`); it does not specify classes, inheritance, or virtual dispatch. LangLLVM's adopted declaration note has no object-model semantics. Although its PEG grammar contains C++ class/base/virtual productions, that is grammar/parser material and cannot be treated as a custom-language design decision. OPPrs focuses on expression parsing; its internal operator/tree objects do not constitute a source-language object model.

#### Status and limits

This comparison answers the request to describe the models, but does not choose one for the next experiment. Coverage is based on the specifically cited notes, grammar, and language specification; “not found” means absent from those reviewed sources, not proven absent from every file or historical version.

### KP-019 - NewLang object model selected; bytecode architecture excluded

- Documented: 2026-11-01 (+01:00)
- Event date: 2026-11-01 17:46:04.712 (+01:00)
- Capture: contemporaneous; user approved a model after the comparison in KP-018
- Sources: SRC-020, SRC-021, SRC-026
- Related requirements/decisions/questions: DEC-015, DEC-017, DEC-019, Q-012
- Supersedes: KP-018's then-current status that no object model had been selected; the historical comparison itself remains valid.

#### User decision

The user said to copy NewLang's object model and ignore its bytecode part. DEC-019 therefore adopts the language-level model in `OtherStuff.txt` and the class syntax in `newlang.ye`, while excluding the bytecode, interpreter, compiler-backend, and native-interoperability architecture sketched in `Implementation.txt`.

The adopted model includes modules as classes and packages as collections of modules exposing interfaces; classes with fields, methods, constructors, modifiers and nested classes/interfaces, inheritance and implemented interfaces; flat/value types with exact declared types and scope-exit destruction; and reference classes whose variables may hold subtype instances and whose unreachable references are collected. It also includes class/metaclass objects, one class object for each parameterization with lazy instantiation, and parameterizable mixins that are outside the `Object` hierarchy and not independently instantiable. Parameterized constructed reference types include containers. This is adoption of the model as documented, not a claim that the source proposal was fully specified or implemented.

#### Open details and consequences

The source explicitly questions class-variable semantics and local functions as function objects; neither is resolved by this adoption. The precise role of methods and instantiations in the reference-type list, packed types, and package/import configuration remain underspecified. Q-012 tracks these items and integration with the already selected closest-namespace lookup in DEC-018.

### KP-020 - Proper tail calls and continuations required

- Documented: 2026-11-01 (+01:00)
- Event date: 2026-11-01 17:59:12.529 (+01:00)
- Capture: contemporaneous; user selected proper tail calls and continuations as required capabilities
- Sources: SRC-027, SRC-028
- Related requirements/decisions/questions: DEC-019, DEC-020, Q-013
- Supersedes: The previously unresolved feature-selection item in the effort inventory; it does not reverse DEC-019's exclusion of the NewLang bytecode architecture.

#### User decision and relationship to prior architecture choice

The user stated that the language should “support proper tail calls and continuations.” DEC-020 records both as required capabilities. Proper tail calls are a guarantee for calls in tail position, not merely an optional optimization.

The prior choice to ignore NewLang's bytecode architecture remains in force. This selects the control-flow capabilities, not NewLang's VM or its proposed C/C++ backend. NewLang's implementation note provides historical context: it says an ordinary processor stack conflicts with `call/cc` and motivates a consistent calling convention for perfect tail-call optimization. That is source-backed rationale from the experiment, not an additional user-stated implementation requirement.

#### Open details and consequences

The continuation interface and semantics remain unspecified, including full versus delimited capture, one-shot versus multi-shot use, interaction with exceptions/coroutines, and precisely which expressions are tail calls. The runtime must also retain captured state consistently with DEC-017's GC-like reference semantics. Q-013 tracks these semantic and representation questions; no implementation strategy or bytecode is selected.

### KP-021 - Combined operator inventory and source conflicts

- Documented: 2026-11-01 (+01:00)
- Event date: 2026-11-01 18:05:09.685 (+01:00)
- Capture: contemporaneous; user requested a cross-experiment operator inventory
- Sources: SRC-029 through SRC-033
- Related requirements/decisions/questions: DEC-008, DEC-009, DEC-010, DEC-011, Q-007, Q-008
- Supersedes: No prior decision; provides source evidence for resolving Q-007 without selecting the final next-language operator table.

#### Findings

The Wissensstand's “Combined operator inventory from the experiments” records the grouped symbols, source priority/precedence values, associativity, and semantic descriptions where available.

GenLang has the most explicit language-spec table: priority 180 for delimiters/APPLY, then 170 dot/arrow, through 10 semicolon, with higher numbers declared tighter. Its generated operator table assigns `@` priority 190 while the prose places it at 170. Its prose calls `->` a function-definition operator, but its expression productions and examples use `->` for pointer-member access. The generated table gives `<-` priority 50 and non-associative, while `?` is also at 50 and right-associative. The prose groups `::` and `::=` with right-associative assignment, whereas generated metadata marks both non-associative. Semantic labels include arithmetic, bitwise/logical, comparison, increment/decrement, declaration, assignment, ternary, and Go-like channel operation.

NewLang's `Parser.cc` declares its own table, with smaller numeric values acting as tighter priorities in the comparison logic. It gives `::` the tightest declared priority, APPLY/dot/arrow the same next level, then unary-like operators and member-pointer/arithmetic/bitwise/logical/conditional/assignment/throw/comma/semicolon tiers. Its tree-generation routine has placeholders and is incomplete. Separately, `prec.y` is a small Bison arithmetic sample with left-associative addition and multiplication groups, unary `NEG`, and right-associative `PWR`; its token spelling and runtime semantics are not supplied. In the parser table `^` has a bitwise tier; the arithmetic sample has a distinct token named `PWR`.

OPPrs contributes parser examples rather than language semantics. Pratt examples encode priorities in `(left,right)` binding-power pairs: assignment and ternary are right-associative; arithmetic is left-associative; dot is right-associative in tests, in conflict with the left-associative declaration in GenLang and NewLang. The TypeScript and Rust examples are not identical, and `miniopp`'s shift/reduce table does not give a single readable priority ranking in the inspected data.

LangLLVM's PEG grammar contains C++-style layered operator productions, but no independent numeric operator table or custom-language semantic spec. It is included only as parser evidence.

#### Conflicts and status

Notable conflicts are recorded without resolving them: priority numbers increase with binding strength in GenLang but decrease in the NewLang parser prototype; OPPrs uses binding-power pairs. Dot is left-associative in GenLang/NewLang and right-associative in OPPrs examples. `^` is XOR in GenLang and the NewLang parser table, while a separate NewLang arithmetic sample uses a `PWR` token. `!` is described as unary logical NOT in GenLang but appears postfix in OPPrs; its OPPrs semantics are not stated. GenLang's `->`, `@`, `<-`, `?`, `::`, and `::=` metadata/prose have the discrepancies listed above. The selected binding syntax (DEC-011) also conflicts with the older GenLang definition spellings and meanings.

This inventory does not approve any of those historical precedence tables. Q-007 remains open for choosing the actual operator set, priorities, associativity and APPLY binding in light of DEC-008 through DEC-010; semantic legality is separately tracked in Q-008.

### KP-022 - Partial operator choices and normalized precedence comparison

- Documented: 2026-11-01 (+01:00)
- Event date: 2026-11-01 18:39:57.143 (+01:00)
- Capture: contemporaneous; user specified selected operator meanings/values and asked for conflicts after normalizing scales
- Sources: SRC-030 through SRC-034
- Related requirements/decisions/questions: DEC-008, DEC-009, DEC-010, DEC-011, DEC-021, Q-007, Q-008
- Supersedes: The unresolved choices for the specific symbols `@`, `.`, `^`, `**`, `->`, and `?` in KP-021; it does not resolve the remaining relative-order conflicts.

#### User decisions

The user set `@` to priority 190; chose left associativity for `.`; assigned `^` to XOR and `**` to exponentiation; assigned `->` the function-definition meaning; and set `?` to priority 45, using GenLang's numeric scale. DEC-021 records these choices. From the GenLang scale, `.` and `->` are at 170, and `^` at 110. No priority for `**` was stated. The source discrepancy over `@` remains historically true (GenLang prose 170 versus generated table 190), but the next language's value is selected as 190.

#### Relative-order comparison

Raw priority magnitudes were normalized to stronger/weaker/equal relations, accounting for the inverse scale direction in NewLang's incomplete parser prototype. The Wissensstand records the complete comparison. Remaining disagreements are:

1. GenLang makes APPLY stronger than `.`, while NewLang gives them equal priority.
2. GenLang makes bitwise operators stronger than relational/equality operators, while NewLang's table puts relational/equality operators stronger than bitwise operators.
3. GenLang's selected `?` priority 45 is stronger than assignment at 30 and colon at 40; NewLang puts `?`, assignment, and colon at one shared priority.
4. GenLang's generated table places `::` at the weak assignment tier; NewLang's prototype makes `::` its strongest declared operator. The meanings are not established as equivalent, and `::` is not a selected binding marker in DEC-011.

Other common tiers broadly agree after scale normalization, including multiplicative > additive > shifts, relational > equality, and bitwise AND > XOR > OR > logical AND > logical OR. Some syntax/semantic roles are not comparable: for example, OPPrs postfix `!` has no stated meaning, and the NewLang Bison sample uses a `PWR` token without spelling it. Therefore no `**` priority is inferred. `->`'s selected meaning is resolved, but its source associativity differs (GenLang none, NewLang left) and remains open.

#### Status

The comparison identifies remaining historical conflicts; it does not choose among them. The later decision in KP-023 resolves their relative ordering for the next language. Q-008 still covers semantic legality for the implicit `APPLY`/`EMPTY` insertions.

### KP-023 - Adopted relative operator precedence table

- Documented: 2026-11-01 (+01:00)
- Event date: 2026-11-01 19:05:36.092 (+01:00) for the initial instruction; exact time of the subsequent correction is not provided
- Capture: contemporaneous; user selects GenLang ordering for the remaining relative-priority conflicts, specifies power priority/associativity, and corrects the request to remove declaration-related tokens
- Sources: SRC-030, SRC-034, SRC-035, SRC-036
- Related requirements/decisions/questions: DEC-008, DEC-009, DEC-010, DEC-011, DEC-021, DEC-022, Q-007, Q-008
- Supersedes: KP-022's status of the listed relative-order conflicts and the unresolved priority of `**`; historical cross-experiment findings remain valid.

#### Decisions

The user chose GenLang's relative ordering for the remaining conflicts and requested that the approved table use distinct lines for distinct binding levels, from tighter to looser, without numeric priority values. The user set `**` to one level tighter than `*` (GenLang's 155 position) and right-associative.

The user initially asked to drop `::` and `::=`, then corrected that request after noticing `::=` is the selected LangLLVM type-declaration marker. The final instruction is to keep both unchanged; the user noted that `::` currently has no use case. Accordingly, the design retains `::` at GenLang's assignment-level ordering with its meaning/use unspecified, and retains `::=` as DEC-011 declaration syntax, outside expression precedence.

DEC-022 records the adopted table in Language-Design.md. This resolves the next language's precedence choices for APPLY vs dot, bitwise vs comparisons, `?` vs assignment/colon, and `::` vs assignment. It does not erase the historical differences in the source experiments. Operator semantics/forms and `->` associativity remain open under Q-007; semantic legality of implicit insertions remains Q-008.

### KP-024 - Refine declaration-marker precedence placement

- Documented: 2026-11-01 (+01:00)
- Event date: 2026-11-01 19:27:31.747 (+01:00)
- Capture: contemporaneous; user assigns relative levels for `::`, `:=`, and `::=`
- Sources: SRC-037
- Related requirements/decisions/questions: DEC-011, DEC-022, DEC-023, Q-007
- Supersedes: The `::` assignment-level placement in KP-023; it does not change DEC-011's declaration syntax or other entries in the precedence table.

#### Decision

The user places `::` at the same relative level as `:`, and `:=` and `::=` at the same level as `=`. DEC-023 records these placements in the authoritative design table. `::` remains without a current use case or specified meaning. `:=` and `::=` retain their variable/type declaration meanings from DEC-011; listing them in the precedence table establishes their relative level only and does not make them expression operators.

### KP-025 - Parser-readiness questions

- Documented: 2026-11-01 (+01:00)
- Event date: 2026-11-01 19:47:42.245 (+01:00)
- Capture: contemporaneous; user asks for an actionable compilation of unresolved questions that must be answered before parser creation
- Sources: SRC-038; current approved choices and open questions in Language-Design.md and Wissensstand.md were cross-checked
- Related requirements/decisions/questions: DEC-006 through DEC-023, Q-003, Q-006 through Q-015
- Status: Checklist added to Language-Design.md; no answers or new design decisions were supplied.

#### Result

The checklist distinguishes prerequisites for any parser slice (scope, lexical rules, expression grammar, and parser-output contract) from productions required only if that slice includes declarations, functions/types/blocks, or packages/classes. It also calls out syntax recognition for predefined identifiers, since the design has no separate keyword token category and permits redefinition. Type-checking, runtime, and other semantic questions can be deferred if the selected parser slice does not need them to determine syntax.

### KP-026 - Comment, identifier, and literal syntax survey

- Documented: 2026-11-01 (+01:00)
- Event date: 2026-11-01 20:15:18.404 (+01:00)
- Capture: contemporaneous; user asks for an experiment-based survey of comments, identifiers, and constants, including conflicts
- Sources: SRC-039 through SRC-043
- Related requirements/decisions/questions: DEC-006, DEC-007, Q-006, Q-014, Q-015
- Status: Findings recorded in the Wissensstand; no syntax choice for the new language was made by this request.

#### Findings

NewLang's syntax notes are tentative and differ from its scanner prototype: the notes contemplate recursive comments and list Perl-like/string-source escapes, while the scanner implements non-nested C-style comments, XID scanning followed by NFKC identifier normalization, numeric/string/character scanning, and a distinct tagged backtick raw-string path. The whole source is normalized to NFC before scanning, so the prototype applies NFC then NFKC to identifiers.

GenLang specifies non-nested `//` and `/*...*/` comments; Unicode ID properties plus underscore and NFKC identifiers; integer bases, decimal/hex floats, quoted character and string forms, backtick raw strings, and escape sequences. Its prose names UAX #31 XID guidance, while its generated regex uses ID_Start/ID_Continue, an implementation discrepancy.

LangLLVM's inspected PEG supplies C++-style comments, ASCII/UCN identifiers, and extensive C++ literal forms; it remains reference grammar rather than an approved custom syntax source. OPPrs examples expose only a minimal identifier/decimal-number lexer (and whitespace skipping in `miniopp`); no full comment or string/character grammar was found there.

At the time of KP-026, the then-current language choices DEC-006/007 differed from GenLang and the NewLang scanner: NFC identifier equality and XID_Start/XID_Continue with no extra start character. KP-027 later supersedes DEC-006's normalization key and selects comment and ordinary literal forms; the Unicode property version remains open (Q-006), and detailed lexical rules remain open (Q-014).

### KP-027 - Lexical decisions and raw-string alternatives

- Documented: 2026-11-01 (+01:00)
- Event date: 2026-11-01 21:22:17 (+01:00)
- Capture: contemporaneous; user selects base comment/identifier/literal forms and requests comparison of raw-string choices before selecting one
- Sources: SRC-039 through SRC-045
- Related requirements/decisions/questions: DEC-006, DEC-007, DEC-024, DEC-025, Q-006, Q-014, Q-016
- Supersedes: DEC-006's NFC equality-key rule and KP-026's current-status conclusion that no comment/ordinary-literal syntax was selected; raw-string syntax remains undecided.

#### Decisions recorded

The user selected non-nested `//` and `/*...*/` comments; case-sensitive XID identifiers with NFKC internal names and an NFC form for user interaction; single-quoted character literals and double-quoted strings; decimal and `0b`, `0o`, `0d`, `0x`, or `base#number` integers; C++-style `\uXXXX` and `\UXXXXXXXX` universal-character names for source characters generally; NewLang's Perl-style escapes for strings and characters; and decimal plus hexadecimal floating-point forms from ISO floating-point standards.

At this point in the discussion, the user had deferred raw-string syntax until after seeing alternatives. The design presents fixed backticks (Go/GenLang), Rust hash-counted delimiters, C++ tagged delimiters (also present in LangLLVM's PEG), C# variable quote runs, Python raw prefixes, and the specialized tagged-backtick attempt in NewLang's scanner. The references illustrate tradeoffs only; Q-016 was open at this checkpoint and was later partially resolved by KP-029.

At this point in the chronology, raw-string behavior was not selected. The later decision KP-029 chooses NewLang's tagged-backtick delimiter family. Precise Perl escape subset/edge cases, universal-character translation phase, integer digit/separator rules, precise ISO floating grammar/edition/suffixes, and Unicode property version remain open.

### KP-028 - Concrete raw-string examples

- Documented: 2026-11-01 (+01:00)
- Event date: 2026-11-01 (after SRC-044; exact time not provided)
- Capture: contemporaneous; user asks to see examples of the raw-string alternatives
- Sources: SRC-045, SRC-046; raw-string experiment evidence in SRC-039 through SRC-042
- Related questions: Q-016
- Status: Examples added to Language-Design.md; no delimiter family selected.

Examples illustrate Go/GenLang backticks, Rust hash-counted delimiters, C++ tags, C# quote runs, Python raw prefixes, and NewLang's scanner prototype. They demonstrate delimiter handling only; they do not establish newline or escape behavior for the new language.

### KP-029 - Select tagged-backtick raw-string delimiters

- Documented: 2026-11-01 (+01:00)
- Event date: 2026-11-01 (after SRC-046; exact time not provided)
- Capture: contemporaneous; user selects the `newlang-tagged-backtick` option after asking for examples
- Sources: SRC-039, SRC-040, SRC-047
- Related decisions/questions: DEC-026, Q-016
- Supersedes: The unresolved delimiter-family status in KP-027/028; tag grammar and content semantics remain open.

#### Decision recorded

Adopt the NewLang scanner's tagged-backtick delimiter structure: opening backtick + tag + double quote, followed by content, then double quote + the same tag + closing backtick. The tag's allowed spelling and whether raw content supports newlines or any escape processing are still undecided. No implementation or tests were requested or performed.

### KP-030 - Consolidated token syntax table

- Documented: 2026-11-01 (+01:00)
- Event date: 2026-11-01 21:46:33.577 (+01:00)
- Capture: contemporaneous; user requests a table of all agreed token syntaxes in Language-Design.md
- Sources: SRC-048; approved decisions DEC-008 through DEC-026
- Related questions: Q-006 through Q-016
- Status: Added the “Agreed token syntax summary” to Language-Design.md and linked it from the current knowledge view. It consolidates approved spellings and labels details that remain open; it does not create new language decisions.

### KP-031 - Triage remaining lexer/parser questions

- Documented: 2026-11-01 (+01:00)
- Event date: 2026-11-01 22:33:59.561 (+01:00)
- Capture: contemporaneous; user requests common-language proposals, preference questions for customary alternatives, and a list for cases without easy answers or with all options rejected
- Sources: SRC-049, SRC-050; prior decisions DEC-008/009/010/011/012 and DEC-024/025/026
- Related questions: Q-003, Q-006 through Q-010, Q-012, Q-014 through Q-016
- Status at this checkpoint: Proposed triage and initial blocker list recorded in Wissensstand as LP-01 through LP-23. The request itself approved no proposals; subsequent selections and a rejection are recorded in KP-032.

The comparison distinguishes familiar lexer conventions from project-specific grammar issues. Source-wide universal-character names may alter raw strings, comments, or delimiter recognition, while DEC-008/009's generic implicit-token model and DEC-012's shadowable predefined identifiers need language-specific rules. Blockers are scoped to affected parser slices; type/runtime semantics can be deferred unless a syntax choice depends on them.

### KP-032 - Universal-character and raw-string choices

- Documented: 2026-11-01 (+01:00)
- Event date: 2026-11-01 (after SRC-049; exact time not provided)
- Capture: contemporaneous; user responds to the first group of lexer choices
- Sources: SRC-051; prior decisions DEC-025/026 and proposals LP-09/10
- Related decisions/questions: DEC-027, Q-014, Q-016, LP-09, LP-10, LP-23, LP-24
- Status: The approved choices are recorded in Language-Design.md and Wissensstand. Non-universal raw escape behavior remains a blocker.

The user selected global `\uXXXX`/`\UXXXXXXXX` translation before tokenization, including comments and raw strings. The user also selected zero-or-more ASCII letters, digits, or underscores for tags, with no fixed length limit, and multiline raw strings whose recognized line endings normalize to LF. Exact escape eligibility, recognized line endings, and source-position mapping remain open.

For other raw-string backslashes, the user rejected both offered alternatives: leaving all other backslashes literal, or permitting only a delimiter-specific escape. No replacement or reason was given, so LP-24 records the unresolved blocker rather than assuming either rule.

### KP-033 - Integer literal and suffix choices

- Documented: 2026-11-01 (+01:00)
- Event date: 2026-11-01 (after SRC-051; exact time not provided)
- Capture: contemporaneous; user responds to the integer-literal choice group
- Sources: SRC-050, SRC-052; prior DEC-025 and proposals LP-12/13
- Related decisions/questions: DEC-028, Q-014, LP-12 through LP-14
- Status: Choices are recorded in Language-Design.md and Wissensstand. Exact suffix grammar/types, float separator behavior, and token-boundary cases remain open.

The user selected bases 2–36 with case-insensitive ASCII letter digits for `base#number`; a single underscore only between integer digits; both uppercase and lowercase marker letters for the selected `0b/0o/0d/0x` integer forms; decimal interpretation of unmarked leading zeros; and support for typed numeric suffixes. The suffix option expressly deferred the exact suffix set. No numeric-boundary or floating-point edge rule was selected by these answers.

### KP-034 - Approve common lexer and location rules

- Documented: 2026-11-01 (+01:00)
- Event date: 2026-11-01 (after SRC-052; exact time not provided)
- Capture: contemporaneous; user selects all seven offered common-practice proposals for approval
- Sources: SRC-050, SRC-053; proposals LP-01 through LP-07
- Related decisions/questions: DEC-029, Q-014, Q-015, LP-01 through LP-07, LP-23
- Status: The approved rules are recorded in Language-Design.md and Wissensstand; the individual proposals' qualifications and the remaining choices still apply.

The user approved UTF-8 with malformed-input diagnostics and an optional initial BOM; longest-match tokenization with comments as token separators; explicit diagnostics for malformed recognized tokens; leading signs as operators and exponent signs within numeric tokens; no unescaped physical line breaks in ordinary quoted literals plus quote/backslash escapes; decimal and hexadecimal floats with required binary exponents on the latter; and original-source spans/mappings through translation and normalization.

These choices do not decide additional encodings, the complete escape repertoire or line continuations, numeric-looking token boundaries, the precise float grammar or suffixes, span units, recovery, or the mechanics of Unicode-escape translation and mapping. No implementation or tests were requested or performed.

### KP-035 - Quoted-literal alternatives for the next choice

- Documented: 2026-11-01 (+01:00)
- Event date: 2026-11-01 (after SRC-053; exact time not provided)
- Capture: contemporaneous; assistant presents the next group of options under the workflow requested in KP-031
- Sources: SRC-039, SRC-050, SRC-054; approved DEC-025 and DEC-029
- Related questions: Q-014, Q-016, LP-11, LP-24
- Status at this checkpoint: Alternatives are proposals, not user-approved rules; the user's response has not yet been recorded.

The options distinguish a character literal's value unit (Unicode scalar, UTF-16 code unit, or extended grapheme cluster); named-character sequences versus single-character names; ordinary-string line continuation with or without indentation removal versus rejection; and errors, warning with preservation, or backslash removal for unrecognized ordinary escapes. Raw-string backslash behavior remains the separate blocker LP-24. The exact escape inventory, Unicode version, and global Unicode-escape eligibility also remain separate.

### KP-036 - Character and ordinary-string choices

- Documented: 2026-11-01 (+01:00)
- Event date: 2026-11-01 (after KP-035; exact time not provided)
- Capture: contemporaneous; user selects among the quoted-literal options
- Sources: SRC-055; proposals in KP-035
- Related decisions/questions: DEC-030, Q-014, Q-016, LP-11, LP-24
- Status: The four selected rules are recorded in Language-Design.md and Wissensstand. Raw-string backslash behavior remains blocked.

The user selected exactly one Unicode scalar after escape processing per character literal; single-character names for `\N{name}` rather than named character sequences; backslash-physical-line-ending continuation in ordinary strings only, removing the backslash, line ending, and immediately following spaces/tabs; and errors for unrecognized ordinary escapes. No reason for excluding named sequences was supplied.

The precise recognized line endings, Unicode name/alias data, remaining escape inventory and validation, and interactions with globally translated universal-character names remain open. No implementation or tests were requested or performed.

### KP-037 - Source input and Unicode alternatives

- Documented: 2026-11-01 (+01:00)
- Event date: 2026-11-01 (after KP-036; exact time not provided)
- Capture: contemporaneous; assistant presents the next group of options under the workflow requested in KP-031
- Sources: SRC-039, SRC-050, SRC-056; approved DEC-027, DEC-029, and DEC-030
- Related questions: Q-006, Q-014, Q-016, LP-01, LP-15, LP-23
- Status at this checkpoint: Alternatives are proposals, not user-approved rules; the user's response has not yet been recorded.

The options cover the Unicode data-version policy and initial version, whether source encodings besides UTF-8 are accepted, and the set of physical line endings. Python and Java recognize LF, CRLF, and CR; NewLang's notes additionally list VT, FF, NEL, LS, and PS. Unicode's 18.0 release announcement and UCD readme say it is available/final, while its version-overview page still carries a preliminary-draft banner. This records the source discrepancy without changing the prior choice of UAX #31 research reference or selecting a language Unicode version.

### KP-038 - Pin source encoding and Unicode data

- Documented: 2026-11-01 (+01:00)
- Event date: 2026-11-01 (after KP-037; exact time not provided)
- Capture: contemporaneous; user selects among the source-input and Unicode options
- Sources: SRC-057; proposals in KP-037
- Related decisions/questions: DEC-031, Q-006, Q-014, Q-016, LP-01, LP-15, LP-23
- Status: UTF-8-only input and Unicode 18.0.0 pinned by the language specification are recorded in Language-Design.md and Wissensstand. The user asks to “follow unicode standard recommendations” for physical line endings; the precise reference and resulting set need investigation.

The user chose a specification-pinned Unicode data version, with changes made deliberately through a specification revision, and selected version 18.0.0 for identifier properties, normalization, and character-name data. The user also chose UTF-8 as the only source encoding. For line endings, the user's free-text direction was not one of the enumerated character sets; do not silently equate it with NewLang's list or another standard without checking the source.

### KP-039 - Investigate Unicode newline recommendations

- Documented: 2026-11-01 (+01:00)
- Event date: 2026-11-01 (after KP-038; exact time not provided)
- Capture: contemporaneous source research in response to the user's line-ending direction
- Sources: SRC-039, SRC-058
- Related questions: Q-014, Q-016, LP-15, LP-23
- Status at this checkpoint: The source comparison and alternatives are recorded in Wissensstand; no exact line-ending set has been selected.

Unicode 18 core §5.8.3 recommends that `readline` stop at CR, LF, CRLF, NEL, LS, PS, and FF. UAX #14's hard-break classes additionally include VT, and its CRLF rule prevents a break between CR and LF. UTS #55 recommends that source-code editors display all those hard breaks, while acknowledging that a language can recognize fewer terminators. NewLang's notes list the full UAX #14 set. The assistant proposes that full set for source lines, with the core `readline` set as an alternative; the user has not yet selected between them.

These are recommendations for different contexts, not evidence that Unicode mandates one source lexer rule. DEC-027's already-selected normalization of recognized raw-string line endings to LF would also normalize LS and PS if they are included; treatment of line breaks generated by universal-character translation remains open.

### KP-040 - Select Unicode hard breaks for source lines

- Documented: 2026-11-01 (+01:00)
- Event date: 2026-11-01 (after KP-039; exact time not provided)
- Capture: contemporaneous; user selects the UAX #14 hard-break option
- Sources: SRC-058, SRC-059; alternatives in KP-039
- Related decisions/questions: DEC-032, Q-014, Q-016, LP-15, LP-23
- Status: The exact physical line-ending set is recorded in Language-Design.md and Wissensstand. Handling of Unicode-escape-generated line breaks remains open.

The user selected LF, CR, CRLF, NEL, VT, FF, LS, and PS as source-line endings, with CRLF counted as one. The choice was presented with the consequence that recognized LS and PS normalize to LF in raw-string values under DEC-027. The alternative based on the Unicode core `readline` recommendation omitted VT; no additional reason for the user's selection was given.

### KP-041 - Numeric shape and boundary alternatives

- Documented: 2026-11-01 (+01:00)
- Event date: 2026-11-01 (after KP-040; exact time not provided)
- Capture: contemporaneous; assistant presents the next group of options under the workflow requested in KP-031
- Sources: SRC-050, SRC-060; approved DEC-008, DEC-025, DEC-028, and DEC-029
- Related questions: Q-014, LP-13, LP-14, LP-25
- Status at this checkpoint: Alternatives are proposals, not user-approved rules; the user's response has not yet been recorded.

The options compare decimal/hexadecimal float shapes, float digit separators, interpretation of `1.foo` when `foo` is not a valid suffix, invalid digits such as `0b102`, and a number immediately followed by a non-suffix identifier. The suffix spelling/type set is expressly deferred; a hypothetical attached suffix such as `i32` in `36#1i32` could also be read as base-36 digits. That project-specific ambiguity is added as LP-25 rather than silently selecting a suffix grammar.

### KP-042 - Float shapes and selected numeric boundaries

- Documented: 2026-11-01 (+01:00)
- Event date: 2026-11-01 (after KP-041; exact time not provided)
- Capture: contemporaneous; user selects among the numeric options
- Sources: SRC-061; proposals in KP-041
- Related decisions/questions: DEC-033, Q-014, LP-13, LP-14, LP-25
- Status: The selected shapes, separator rule, and specific boundary examples are recorded in Language-Design.md and Wissensstand. Typed suffixes and other boundaries remain open.

The user selected Go/IEEE-style decimal and hexadecimal float shapes and single underscores used as digit separators only between digits in the same component. For `1.foo`, assuming `foo` is not a suffix, the user selected float `1.` followed by identifier `foo` and implicit `APPLY`. The user selected an invalid-digit error for `0b102` and supplied the free-text answer “report invalid digit” for `123foo` when `foo` is not a suffix.

These are recorded as the specific examples asked, not as a blanket rule for all float/identifier adjacencies: such a generalization could contradict the selected `1.foo` tokenization. Suffix syntax, valid suffixes, `a.5`, incomplete exponents, and arbitrary-base suffix ambiguity remain open. No implementation or tests were requested or performed.

### KP-043 - Further numeric-boundary alternatives

- Documented: 2026-11-01 (+01:00)
- Event date: 2026-11-01 (after KP-042; exact time not provided)
- Capture: contemporaneous; assistant presents follow-up alternatives under the workflow requested in KP-031
- Sources: SRC-060, SRC-061; approved DEC-008, DEC-029, and DEC-033
- Related questions: Q-014, LP-14, LP-25
- Status at this checkpoint: Alternatives are proposals, not user-approved rules; the user's response has not yet been recorded.

The options compare context-independent longest matching of `.5` after an operand with context-sensitive dot-plus-integer tokenization; splitting versus invalid-digit diagnostics for non-suffix identifiers after other float forms; and explicit errors versus token splitting for incomplete exponents. The exact suffix spelling/type set and arbitrary-base suffix ambiguity remain deferred.

### KP-044 - Additional numeric-boundary choices

- Documented: 2026-11-01 (+01:00)
- Event date: 2026-11-01 (after KP-043; exact time not provided)
- Capture: contemporaneous; user selects among the numeric-boundary alternatives
- Sources: SRC-062; proposals in KP-043
- Related decisions/questions: DEC-034, Q-014, LP-14, LP-25
- Status: The three selected rules are recorded in Language-Design.md and Wissensstand. Suffix spelling, the valid suffix set, and suffix/exponent precedence remain open.

The user selected a leading-dot float after an operand under context-independent longest matching, including with whitespace or comments before it; an invalid-digit error when a float core ending in a digit is immediately followed by a non-suffix identifier; and a malformed-literal error when a recognized exponent has no digits. The prior `1.foo` split is preserved because that float core ends with a dot. The exact typed-suffix set was not selected.

### KP-045 - Global Unicode-escape alternatives

- Documented: 2026-11-02 (+01:00)
- Event date: 2026-11-02 (after KP-044; exact time not recorded)
- Capture: contemporaneous; assistant prepares the next alternatives under the workflow requested in KP-031
- Sources: SRC-049, SRC-063; approved DEC-027, DEC-029, DEC-030, and DEC-032
- Related questions: Q-014, Q-016, LP-09, LP-23, LP-24
- Status at this checkpoint: The alternatives are proposals, not user-approved rules; the user's response has not yet been recorded.

The alternatives compare Java-style backslash eligibility with translating every occurrence; single-pass translation with repeated rescanning; scalar-only validation with an explicit paired-UTF-16-surrogate alternative; and several treatments of generated line endings. Java supplies prior art for the eligibility and single-pass rules but uses a different escape spelling and UTF-16 model; C++ universal-character names must designate Unicode scalar values. An option extending string continuation to generated endings would change the physical-only rule in DEC-030 and requires explicit approval.

All proposals preserve global translation in comments and raw strings. They do not settle non-universal raw backslashes, mixed-origin CRLF handling, or original-source mapping details. LP-23 and LP-24 remain blockers until their applicable rules are selected.

### KP-046 - Select Unicode-escape translation rules

- Documented: 2026-11-02 (+01:00)
- Event date: 2026-11-02 (after KP-045; exact time not recorded)
- Capture: contemporaneous; user selects among the Unicode-escape alternatives
- Sources: SRC-064, SRC-065; alternatives in KP-045
- Related decisions/questions: DEC-027, DEC-030, DEC-032, DEC-035, Q-014, Q-016, LP-23, LP-24
- Status: The selected rules are recorded in Language-Design.md and Wissensstand. Mixed-origin CRLF, original-source mapping, and non-universal raw escapes remain open.

The user selected Java-style source-backslash eligibility, single-pass translation, and scalar-only values with malformed-escape diagnostics. Escape-generated hard breaks have the lexical effects of physical line endings, and the user explicitly selected allowing them in ordinary-string continuations. This extends the physical-only continuation rule in DEC-030; continuations remain disallowed in character literals. No reason for the selections was supplied.

The alternatives included translating every occurrence, repeated rescanning, allowing adjacent UTF-16-surrogate escapes, retaining physical-only continuation, and treating generated line endings as non-terminating content. None of those alternatives was selected; this does not imply a separately stated rejection or rationale.

A one-off Python 3 translation model checked the documented examples, malformed and non-scalar inputs, and the generated-continuation example (SRC-065). It was not a project implementation or a mixed-origin CRLF test. `git diff --check` reported no whitespace errors after the documentation update.

### KP-047 - Source-location and translation alternatives

- Documented: 2026-11-02 (+01:00)
- Event date: 2026-11-02 (after KP-046; exact time not recorded)
- Capture: contemporaneous; assistant prepares the next alternatives under the workflow requested in KP-031
- Sources: SRC-049, SRC-063, SRC-066; approved DEC-024, DEC-029, DEC-032, and DEC-035
- Related questions: Q-014, Q-015, Q-016, LP-17, LP-23
- Status at this checkpoint: The alternatives are proposals, not user-approved rules; the user's response has not yet been recorded.

The options compare recognizing mixed-origin CRLF as one ending with treating its two characters as separate endings; original-source UTF-8 byte spans with scalar or UTF-16 offsets; physical versus logical diagnostic locations; and identifier-only normalization with whole-source NFC normalization before or after Unicode-escape translation. The proposed byte spans are zero-based and half-open, and count an initial BOM in original offsets. Whole-source normalization would change the handling of decomposed literal contents and potentially character-literal validity.

These choices do not resolve non-universal raw-string backslashes or typed numeric suffixes. The already required original-source mapping remains in force under every diagnostic-display alternative.

### KP-048 - Select source normalization and location rules

- Documented: 2026-11-02 (+01:00)
- Event date: 2026-11-02 (after KP-047; exact time not recorded)
- Capture: contemporaneous; user selects among the source-processing alternatives
- Sources: SRC-067, SRC-068, SRC-069; alternatives in KP-047
- Related decisions/questions: DEC-024, DEC-029, DEC-032, DEC-035, DEC-036, Q-014, Q-015, Q-016, LP-17, LP-23
- Status: The selections are recorded in Language-Design.md and Wissensstand. Detailed original-source mapping, displayed column units, and post-escape literal-value normalization remain open.

The user selected one CRLF ending regardless of the origins of CR and LF; zero-based, half-open original UTF-8 byte spans counting an initial BOM; and physical source locations for diagnostics. The user also selected NFC normalization of the entire translated source before tokenization, rather than the recommended identifier-only approach. No reason for the selections was supplied.

Whole-source NFC affects comments and literals as well as identifiers and may change token spelling. Unicode 18 data confirms that U+037E becomes ASCII `;` and that an `e` followed by U+0301 becomes U+00E9. Ordinary literal escapes are interpreted later; no additional post-escape literal-value normalization was selected. Original-byte mapping through canonical composition and reordering still needs a precise design.

A one-off Python 3 probe passed selected NFC, BOM-span, and mixed-origin CRLF examples (SRC-069). The host's Unicode data is version 15.0.0 rather than the selected version 18.0.0, so the relevant NFC examples were separately checked against the Unicode 18 conformance data (SRC-068). `git diff --check` reported no whitespace errors after the documentation update.

### KP-049 - Parser-scope and output alternatives

- Documented: 2026-11-02 (+01:00)
- Event date: 2026-11-02 (after KP-048; exact time not recorded)
- Capture: contemporaneous; assistant prepares the next alternatives under the workflow requested in KP-031
- Sources: SRC-049, SRC-070; approved DEC-008, DEC-009, DEC-011, DEC-022, and DEC-036
- Related questions: Q-003, Q-007, Q-014, Q-015, LP-08, LP-16, LP-17, LP-26
- Status at this checkpoint: The alternatives are proposals, not user-approved rules; the user's response has not yet been recorded.

The options compare expression-only and broader parser slices; explicit semicolons with newline-based alternatives; right, left, and non-association for `->`; and an operator/operand tree alone with retaining trivia or producing a lossless concrete syntax tree. Newline-based termination would change DEC-008. Haskell's function-type arrow provides right-associative prior art, while Go's semicolon insertion and rust-analyzer's lossless syntax tree illustrate other choices; none is adopted by comparison alone.

An additional conditional blocker, LP-26, identifies equal-precedence mixed-associativity behavior: `.` is left-associative and shares a level with `->`, whose associativity is not selected. If `->` has different or unspecified association, mixed uses need a tie-breaking rule. No complete parser grammar or implementation is implied by these choices.

### KP-050 - Select full parser scope and output

- Documented: 2026-11-02 (+01:00)
- Event date: 2026-11-02 (after KP-049; exact time not recorded)
- Capture: contemporaneous; user selects among the parser alternatives
- Sources: SRC-071; alternatives in KP-049
- Related decisions/questions: DEC-008, DEC-009, DEC-022, DEC-036, DEC-037, Q-003, Q-007, Q-014, Q-015, LP-08, LP-16, LP-17, LP-26
- Status: The selections are recorded in Language-Design.md and Wissensstand. Full-language productions, mixed `.`/`->` ties, representation mappings, and error recovery remain open.

The user selected the full already-selected language as the first parser's target, not the offered smaller expression or intermediate slices. Newlines remain whitespace and semicolons are explicit wherever grammar requires them. The user selected non-associative `->`, so ungrouped arrow chains require grouping or rejection; mixed ties with left-associative `.` at the same precedence still need a separate rule.

The user selected a lossless concrete syntax tree for the original source in addition to the previously selected operator/operand tree. Preserving original bytes, BOM, comments, whitespace, and escape spellings is necessary for the offered lossless-original-source contract; DEC-008's comment stripping continues to apply to the operator stream. Mapping between the original representation and globally translated/NFC-normalized syntax, and behavior on malformed input, remain open. No implementation was requested or authorized.

### KP-051 - Mixed operator and recovery alternatives

- Documented: 2026-11-02 (+01:00)
- Event date: 2026-11-02 (after KP-050; exact time not recorded)
- Capture: contemporaneous; assistant prepares the next alternatives under the workflow requested in KP-031
- Sources: SRC-049, SRC-070, SRC-072; approved DEC-022 and DEC-037
- Related questions: Q-007, Q-014, Q-015, LP-17, LP-26
- Status at this checkpoint: The alternatives are proposals, not user-approved rules; the user's response has not yet been recorded.

The options compare requiring explicit grouping for mixed `.`/`->` ties with left-to-right grouping or favoring `.`; the latter behaves like tighter dot binding in mixed cases despite the shared precedence level. The recovery alternatives compare continuing after syntax errors and preserving error regions in the lossless CST with stopping at the first syntax error. Haskell's incompatible-fixity rule and rust-analyzer's lossless recovery are comparison evidence, not adopted rules.

The options do not settle the detailed synchronization algorithm, malformed UTF-8 recovery, raw-string backslashes, or mappings between original and normalized syntax.

### KP-052 - Mixed-tie alternatives left open

- Documented: 2026-11-02 (+01:00)
- Event date: 2026-11-02 (after KP-051; exact time not recorded)
- Capture: contemporaneous user selection
- Source: SRC-073
- Related questions: Q-007, Q-015, LP-26
- Status: Blocker; no mixed-tie rule adopted.

The user chose “None of these; keep this as a blocker” instead of the offered explicit-parentheses, left-to-right, and dot-favoring alternatives. No replacement or reason was provided. The existing shared precedence, left associativity of `.`, and non-associativity of `->` are unchanged; the grouping examples do not establish that the surrounding syntax is otherwise legal. The separately described syntax-error recovery alternatives remain unanswered.

### KP-053 - Syntax-error recovery selected

- Documented: 2026-11-02 (+01:00)
- Event date: 2026-11-02 (after KP-052; exact time not recorded)
- Capture: contemporaneous user selection
- Sources: SRC-070, SRC-074
- Related questions: Q-014, Q-015, LP-17
- Status: Approved as DEC-038; detailed recovery mechanics remain open.

The user selected recovery from parser syntax errors, attempting further diagnostics and retaining the entire original source in a lossless CST with error nodes or an equivalent representation. Syntax errors are explicitly reported and a CST does not imply a successful parse. The alternative of stopping at the first syntax error without requiring a CST was not selected. The proposal cited rust-analyzer as an example; the user supplied no additional rationale.

The choice does not specify synchronization or recovery limits, malformed-encoding or lexical-error recovery, nor the operator/operand tree's behavior when errors occur. It does not authorize implementation.

### KP-054 - Ordinary-literal normalization alternatives

- Documented: 2026-11-02 (+01:00)
- Event date: 2026-11-02 (after KP-053; exact time not recorded)
- Capture: contemporaneous proposal and evidence
- Sources: SRC-075, SRC-076; approved DEC-030, DEC-035, and DEC-036
- Related questions: Q-014, Q-016, LP-11, LP-23
- Status at this checkpoint: Proposed, not approved; the user's response has not yet been recorded.

The assistant proposes no further normalization of ordinary character and string values after escape processing. The alternative is to NFC-normalize decoded ordinary literals before validating that a character literal produces one scalar. The difference is visible because source Unicode escapes are translated before whole-source NFC, while named literal escapes are processed after it: `"e\u0301"` becomes U+00E9 under the selected source phase, whereas `"e\N{COMBINING ACUTE ACCENT}"` produces U+0065 U+0301 without a later pass and U+00E9 with one. The analogous single-quoted form would be invalid under the first option but valid under the second.

The Python example is comparative evidence, not an assertion that Python performs this language's earlier whole-source normalization. Raw-string escape behavior and named-character alias rules remain separate questions.

### KP-055 - Post-escape literal normalization rejected

- Documented: 2026-11-05 (+01:00)
- Event date: 2026-11-05 (+01:00)
- Capture: contemporaneous user selection
- Source: SRC-077
- Related questions: Q-014, Q-016, LP-11, LP-23
- Status: Approved as DEC-039.

The user selected no further normalization of ordinary character or string values after escape processing. Accordingly, a character literal is checked for exactly one scalar directly after its escapes are decoded. Whole-source NFC remains in its already selected earlier phase (DEC-036). No rationale beyond the selection was supplied.

### KP-056 - Unicode character-name matching proposal

- Documented: 2026-11-05 (+01:00)
- Event date: 2026-11-05 (+01:00)
- Capture: contemporaneous proposal, pending user choice
- Sources: SRC-075, SRC-076, SRC-078
- Related questions: Q-014, Q-016, LP-11
- Status: Proposed, not approved.

For `\N{name}`, the proposed behavior accepts canonical Unicode character names and Unicode 18 name aliases, with ASCII case-insensitive matching and otherwise exact spacing and punctuation. Unknown names are errors. Named sequences remain excluded by DEC-030. This follows Python's familiar case-insensitive name lookup and alias support as comparative prior art; Python's named-sequence behavior is not proposed. The separate `\N{U+...}` notation and the rest of the escape repertoire remain open.

### KP-057 - Unicode character-name matching selected

- Documented: 2026-11-05 (+01:00)
- Event date: 2026-11-05 (+01:00)
- Capture: contemporaneous user selection
- Sources: SRC-078, SRC-079
- Related questions: Q-014, Q-016, LP-11
- Status: Approved as DEC-040.

The user selected Unicode character names and official aliases for `\N{name}`, with case-insensitive matching. DEC-040 records this as ASCII case-insensitive, otherwise exact spacing and punctuation; unknown and multi-scalar names are errors, consistent with the earlier single-scalar-only choice. The case-sensitive and canonical-names-only alternatives were not selected. No rationale beyond the selection was supplied.

### KP-058 - Numeric `\N{U+...}` proposal

- Documented: 2026-11-05 (+01:00)
- Event date: 2026-11-05 (+01:00)
- Capture: contemporaneous proposal, pending user choice
- Sources: SRC-080; approved DEC-027/035 and DEC-040
- Related questions: Q-014, Q-016, LP-11
- Status: Proposed, not approved.

The assistant proposed reserving `\N{...}` for the selected Unicode name/alias lookup and omitting `\N{U+...}` because global fixed-width `\uXXXX` and `\UXXXXXXXX` already encode Unicode scalars everywhere in source. Perl documents `\N{U+...}` as a variable-width numeric code-point form; NewLang's notes explicitly ask whether it is wanted.

### KP-059 - Numeric `\N{U+...}` rejected

- Documented: 2026-11-05 (+01:00)
- Event date: 2026-11-05 (+01:00)
- Capture: contemporaneous user selection
- Source: SRC-081
- Related questions: Q-014, Q-016, LP-11
- Status: Approved as DEC-041.

The user selected names-only use of `\N{...}`, rejecting the additional numeric `U+` form. Global `\uXXXX` and `\UXXXXXXXX` remain available for numeric Unicode escapes. No rationale beyond the selection was supplied.

### KP-060 - Simple control-escape set proposal

- Documented: 2026-11-05 (+01:00)
- Event date: 2026-11-05 (+01:00)
- Capture: contemporaneous proposal, pending user choice
- Sources: SRC-082; NewLang escape inventory in SRC-080
- Related questions: Q-014, Q-016, LP-11
- Status: Proposed, not approved.

The assistant proposed the seven simple control escapes shared by the inspected Go and Python specifications: `\a`, `\b`, `\f`, `\n`, `\r`, `\t`, and `\v`, in addition to the already selected escaped quotes and backslash. It proposed omitting `\e` and Perl/NewLang `\cX`; Java's narrower list demonstrates that the broader set is not universal. The already selected global Unicode escapes can encode control scalars directly. The exact `\cX` mapping and support for `\e` were pending the user's choice.

### KP-061 - NewLang simple control escapes selected

- Documented: 2026-11-05 (+01:00)
- Event date: 2026-11-05 (+01:00)
- Capture: contemporaneous user selection
- Sources: SRC-080, SRC-083
- Related questions: Q-014, Q-016, LP-11
- Status: Approved as DEC-042.

The user selected the NewLang/Perl-style alternative, adding `\e` and `\cX` to the shared simple escape set. DEC-042 records `\e` as ESC (U+001B) and adopts NewLang's mapping: `\c?` yields DEL, `\cX` for ASCII `@` through `~` yields the low five bits of `X`, and other following characters are errors. The choice does not select numeric `\x{...}` or `\o{...}` forms.

### KP-062 - Braced numeric literal escapes proposal

- Documented: 2026-11-05 (+01:00)
- Event date: 2026-11-05 (+01:00)
- Capture: contemporaneous proposal, pending user choice
- Sources: SRC-084; approved DEC-027/035/041
- Related questions: Q-014, Q-016, LP-11
- Status: Proposed, not approved.

The assistant proposed omitting braced `\x{hex}` and `\o{octal}` literal escapes because global `\uXXXX` and `\UXXXXXXXX` already encode Unicode scalars throughout source. The historical NewLang notes and Perl provide the braced forms, while Go and Python use different fixed-width numeric escape forms. If adopted, the proposal treats the braced results as Unicode scalar values (not bytes), with malformed digits and non-scalar values diagnosed. The offered choice was neither, hex only, octal only, or both.

### KP-063 - Braced hexadecimal escape selected

- Documented: 2026-11-05 (+01:00)
- Event date: 2026-11-05 (+01:00)
- Capture: contemporaneous user selection
- Sources: SRC-084, SRC-085
- Related questions: Q-014, Q-016, LP-11
- Status: Approved as DEC-043.

The user selected `\x{hex}` only and rejected `\o{octal}`. DEC-043 specifies one or more ASCII hex digits, allows leading zeros, disallows separators, and treats malformed and non-scalar values as errors. The result is a Unicode scalar, not encoded bytes. No rationale beyond the selection was supplied.

### KP-064 - Inter-token whitespace proposal

- Documented: 2026-11-05 (+01:00)
- Event date: 2026-11-05 (+01:00)
- Capture: contemporaneous proposal, pending user choice
- Sources: SRC-086; approved DEC-032
- Related questions: Q-014, LP-27
- Status: Proposed, not approved.

The assistant proposed ASCII space and horizontal tab as token-separating horizontal whitespace, while retaining DEC-032's full Unicode hard-break set as line endings and rejecting other Unicode 18 `White_Space` characters as separators. Go uses a narrow ASCII separator set; Python also accepts form feed between tokens, but DEC-032 already makes form feed a line ending here. The alternative was to accept all remaining Unicode 18 `White_Space` characters as separators without changing selected hard-break behavior.

### KP-065 - Unicode whitespace separators selected

- Documented: 2026-11-05 (+01:00)
- Event date: 2026-11-05 (+01:00)
- Capture: contemporaneous user selection
- Sources: SRC-086, SRC-087
- Related questions: Q-014, LP-27
- Status: Approved as DEC-044.

The user selected all Unicode 18 `White_Space` characters as inter-token separators, except characters in DEC-032's hard-break set, which retain line-ending behavior. This includes non-ASCII spaces; comments and literals continue to apply their own content rules. The narrower ASCII-only proposal was not selected. No rationale beyond the selection was supplied.

### KP-066 - Generated-backslash literal-escape proposal

- Documented: 2026-11-05 (+01:00)
- Event date: 2026-11-05 (+01:00)
- Capture: contemporaneous proposal, pending user choice
- Sources: SRC-088; approved DEC-035/036/039/042/043
- Related questions: Q-014, Q-016, LP-28
- Status: Proposed, not approved.

The assistant proposes that a backslash generated by global Unicode translation may initiate an ordinary literal escape in the later literal-processing phase, while never initiating a second global `\u`/`\U` pass. For example, `"\u005Cn"` would decode like `"\n"` and `"\u005Cx{41}"` would decode to `A`. The alternative treats generated backslashes as literal data for ordinary escapes, retaining only the already-selected special case for generated-backslash line continuation. Java's phase ordering is precedent, not a rule already selected here.

### KP-067 - Generated backslashes enter ordinary escape processing

- Documented: 2026-11-05 (+01:00)
- Event date: 2026-11-05 (+01:00)
- Capture: contemporaneous user selection
- Sources: SRC-088, SRC-089
- Related questions: Q-014, Q-016, LP-28
- Status: Approved as DEC-045.

The user selected processing generated backslashes as ordinary literal escapes in the later literal phase. Thus `"\u005Cn"` behaves like `"\n"` and `"\u005Cx{41}"` decodes to `A`. Global Unicode translation remains one-pass; generated backslashes cannot initiate another `\u`/`\U` scan. The alternative of treating generated backslashes as literal data (apart from the previously selected generated-backslash line continuation) was not selected. No rationale beyond the choice was supplied.

### KP-068 - Diagnostic column proposal

- Documented: 2026-11-05 (+01:00)
- Event date: 2026-11-05 (+01:00)
- Capture: contemporaneous proposal, pending user choice
- Sources: SRC-090; approved DEC-036
- Related questions: Q-014, Q-015, LP-17/23/29
- Status: Proposed, not approved.

The assistant proposed one-based human-facing columns counted in Unicode scalar values from the original physical source line; tabs count as one source scalar rather than visual tab-expanded cells. Original UTF-8 byte spans remain the internal source locations. An editor adapter separately converts to the negotiated protocol encoding. LSP defaults to zero-based UTF-16 units but supports UTF-8/UTF-32 negotiation; Go's token positions use byte offsets and one-based byte columns. At that point this was not yet selected; the user later approved the proposal in KP-069.

### KP-069 - Diagnostic columns selected

- Documented: 2026-11-05 (+01:00)
- Event date: 2026-11-05 (+01:00)
- Capture: contemporaneous user selection
- Sources: SRC-090, SRC-091
- Related questions: Q-014, Q-015, LP-17/23/29
- Status: Approved as DEC-046.

The user selected one-based human-facing diagnostic columns counting Unicode scalar values in the original physical source line; each tab counts as one column. This does not change the zero-based, half-open original UTF-8 byte spans already selected in DEC-036. Editor-protocol positions remain a separate representation and must be converted to the negotiated encoding. The alternative column conventions were not selected; no rationale beyond the choice was supplied.

### KP-070 - Parser-readiness questions recompiled

- Documented: 2026-11-05 (+01:00)
- Event date: 2026-11-05 (+01:00)
- Capture: contemporaneous user request and assessment
- Sources: SRC-092, SRC-093
- Related questions: Q-003, Q-007–016, LP-18–29
- Status: Evidence-based inventory and assessment; no new design decisions.

The user requested an updated list of the questions to answer before creating a parser. The existing full-language target, dual-tree output, syntax-error recovery, and previously selected lexer and diagnostic rules remain in force. The compilation groups the remaining lexical, expression, production, source-mapping, and error-output questions; LP-24 and LP-26 remain unresolved after earlier alternatives were not selected. TypeScript remains tentative.

As an assessment rather than a user decision, individual components can be developed incrementally without implying full parser conformance; each affected form and contract must still be specified for the selected full target. Semantic and runtime details can wait unless they affect chosen syntax. The review corrected stale current-view statements that treated DEC-046 diagnostic columns and DEC-039–045 ordinary escapes as unresolved; the historical decisions were not changed.

### KP-071 - Generic parser and semantic interpretation clarified

- Documented: 2026-11-05 (+01:00)
- Event date: 2026-11-05 (+01:00)
- Capture: contemporaneous user decisions
- Sources: SRC-094
- Related questions: Q-003, Q-007–016, LP-18–26
- Status: Approved DEC-048–054; suffix marker subsequently completed by DEC-047 in KP-072.

The user says minimal insertions to obtain an alternating operand/operator sequence were already specified; DEC-048 records this clarification rather than introducing construct-specific rules. The user makes `.` tighter than `->`, reserves `::`, defines `;` as sequential expression processing, and requires left `@name` operands for the binding meanings of `:`, `:=`, and `::=`. Predefined-identifier meanings are obtained by semantic symbol-table lookup, not parser recognition. TypeScript is confirmed.

These statements supersede the earlier dot/arrow tie, bare-name binding sketches, tentative implementation-language status, and statement-terminator interpretation in the current view. They also correct the earlier assessment that keyword-like or binding forms necessarily require dedicated parser productions. Remaining structural syntax and output contracts are distinguished from semantic meanings.

The user says the raw-string question was unclear. The assistant clarifies it with `` `END"\n"END` ``: literal backslash-plus-`n` versus an escape meaning, separate from already-selected global Unicode translation. No raw-backslash replacement rule is selected. The user hopes the existing `?`/`:` priorities naturally handle nested conditionals and requests counterexamples if they do not; KP-073 records the check. No new conditional parser rule or implementation is authorized.

### KP-072 - Numeric suffix spelling and radix overlap resolved

- Documented: 2026-11-05 (+01:00)
- Event date: 2026-11-05 (+01:00)
- Capture: contemporaneous user clarification
- Sources: SRC-094, SRC-095
- Related questions: Q-014, LP-13/14/25
- Status: Approved as DEC-047.

The user selects `#` followed by one or more ASCII letters/digits, case-insensitive. The first `#` after an unmarked decimal integer from 2 through 36 selects radix notation; a subsequent `#` introduces its suffix. Invalid radix digits remain errors rather than causing a decimal-suffix fallback. For other unmarked decimal integers, the first `#` can introduce a suffix; `0d` forces decimal interpretation when needed. Thus `16#ff` is hexadecimal, `36#1#I32` includes a suffix, and `0d16#ff` is decimal 16 with suffix `ff`. The one-character suffix option and leaving the ambiguity open were not selected.

Individual suffix type meanings and further lexical boundary cases remain separate questions. The former ambiguity with suffix letters inside base digits is no longer a reason to leave suffix spelling unresolved.

### KP-073 - Precedence and insertion specification probes

- Documented: 2026-11-05 (+01:00)
- Event date: 2026-11-05 (+01:00)
- Capture: contemporaneous verification and analysis
- Sources: SRC-094, SRC-096
- Related questions: Q-007/014/015, LP-18/19/25/26
- Status: Checked specification examples; no new language decisions.

An inline Python 3 probe checks ordinary binary precedence with `?` tighter than `:` and both right-associative. `a ? b : c ? d : e` produces `(a ? b) : ((c ? d) : e)`, giving a familiar else-branch subtree. In contrast, `a ? b ? c : d : e` produces `(a ? (b ? c)) : (d : e)`, not the usual then-branch representation `(a ? ((b ? c) : d)) : e`. Explicit parentheses produce the latter. This is a tree-shape counterexample for scalar binary priorities alone; a semantic pairing or reinterpretation could differ, but none is selected. The existing priorities are retained.

Assertions also verify the revised dot/arrow shapes `(a . b) -> c` and `a -> (b . c)`, eleven integer suffix/radix examples including malformed radix and suffix cases, and minimal adjacent-kind insertions for all 254 operand/operator sequences of lengths one through seven. These are bounded specification probes, not a parser implementation or validation of Unicode, floats, suffix type meanings, or full recovery behavior.

### KP-074 - NewLang raw backslashes and equal `?`/`:` priority

- Documented: 2026-11-05 (+01:00)
- Event date: 2026-11-05 (+01:00)
- Capture: contemporaneous; user asks how NewLang handled non-universal raw backslashes and what equal `?`/`:` priority would do
- Sources: SRC-040, SRC-097
- Related questions: Q-007/015/016, LP-19, LP-24
- Status: Evidence and analysis only; no decision.

**Belegt:** NewLang's scanner raw branch reads a delimiter tag after the backtick up to `"` or `'` (tag may not contain backslash, backtick, or non-graphic characters), then copies content unchanged until the closing quote/tag/backtick, normalizing mandatory breaks/NEL/CR/CRLF/LF to LF. Backslashes in raw content have no meaning; `\n` remains backslash plus `n`. The scanner has no global `\u` translation. Its closing-delimiter comparison appears inverted (`compare` result nonzero means mismatch), a prototype defect (Ableitung, not executed). This is the "leave all other backslashes literal" alternative that the user rejected in KP-032; the conflict is open, not resolved.

**Analysis:** A probe with `?` and `:` on one level gives, right-associative, `a ? (b : c)`, `a ? (b : (c ? (d : e)))`, and `a ? (b ? (c : (d : e)))`; left-associative gives `(a ? b) : c`, `(((a ? b) : c) ? d) : e`, and `(((a ? b) ? c) : d) : e`. Right associativity handles simple and else-chain conditionals as condition `?` (then `:` else), but not then-branch nesting, which would require `a ? ((b ? (c : d)) : e)`. **Ableitung:** No scalar priority/associativity assignment yields that, because the middle operand is delimited on both sides; C uses a separate production. Current priorities are retained.

### KP-075 - Literal raw backslashes and parenthesized then-nesting selected

- Documented: 2026-11-05 (+01:00)
- Event date: 2026-11-05 22:57 (+01:00)
- Capture: contemporaneous
- Sources: SRC-098, SRC-097
- Related questions: Q-007/015/016, LP-19, LP-24
- Status: Decided (DEC-055, DEC-056).

**Belegt:** After reviewing the NewLang scanner evidence (KP-074), the user switches non-universal backslashes in raw strings to always literal (DEC-055). This reverses the user's earlier rejection of this alternative (KP-032); global universal-character translation remains unchanged. **Ableitung:** With no raw escapes, raw content cannot contain its own closing sequence; authors choose a different tag.

**Belegt:** Because then-branch nesting cannot be obtained through priorities, the user decides that it requires parentheses and keeps the current `?`/`:` priorities (DEC-056). The same-priority alternative is not adopted.

### KP-076 - Numeric-syntax edge cases enumerated

- Documented: 2026-11-05 (+01:00)
- Event date: 2026-11-05 23:10 (+01:00)
- Capture: contemporaneous compilation in response to the user's question
- Sources: SRC-099; DEC-033/034/047; LP-13/14/25
- Related questions: Q-014, LP-25
- Status: Open-question inventory only; no syntax choice.

**Belegt:** Existing decisions already settle basic integer and float shapes, `1.foo`, leading-dot floats after operands, invalid `0b102`/`123foo` and digit-ending-float-plus-name cases, incomplete recognized exponents, the separator constraint, suffix spelling, and radix/suffix overlap.

**Offen:** The design now calls out incomplete radix prefixes/cores and base-field spelling; suffix applicability to decimal and hexadecimal floats; malformed separators at component boundaries; number/dot-run tokenization where multi-dot operators may be selected; and the exact ISO/IEEE edition and any lexical significand/exponent limits. Numeric value range, overflow/underflow, and rounding are noted as likely numeric-semantics matters, not as decisions. The examples are prompts for specification, not asserted tokenizations or validated lexer behavior.

### KP-077 - Numeric boundary decisions

- Documented: 2026-11-05 (+01:00)
- Event date: 2026-11-05 23:24 (+01:00)
- Capture: contemporaneous
- Sources: SRC-100
- Related questions: Q-014, LP-25
- Status: Decided (DEC-057–061); floating-point edition open.

**Nutzerangabe/beschlossen:** Incomplete integers are errors (DEC-057); bases cannot have leading zeros (DEC-058); floats can have suffixes (DEC-059); malformed separators are errors (DEC-060); longest-match tokenization gives a definite parse for `1..2` and `1...x` (DEC-061).

**Ableitung:** With no `..`/`...` operator, longest match gives `1.` `.2` and `1.` `.` `.` `x`. `02#10` is recorded as an error, not as decimal `02` with suffix `#10`, following the wording "cannot have"; confirm if the suffix reading was intended.

**Offen:** The user asks for the floating-point standard options; IEEE 754-2019 / ISO/IEC 60559:2020 is current, with an IEEE P754 revision project (PAR approved 2024-06-06) in progress.

### KP-078 - IEEE 754 / ISO 60559 edition selected

- Documented: 2026-11-05 (+01:00)
- Event date: 2026-11-05 23:46 (+01:00)
- Capture: contemporaneous
- Sources: SRC-101
- Related questions: Q-014, LP-25
- Status: Decided (DEC-062).

**Nutzerangabe/beschlossen:** The user selects option A: IEEE 754-2019, identical to ISO/IEC 60559:2020, as the floating-point standard reference.

**Scope:** This pins the cited standard edition for the selected decimal and hexadecimal floating forms. The decision does not select suffix names/types, a separate rounding policy, numeric range/overflow behavior, or lexical significand/exponent length limits.

### KP-079 - Parser-readiness questions recompiled after numeric decisions

- Documented: 2026-11-05 (+01:00)
- Event date: 2026-11-05 23:52 (+01:00)
- Capture: contemporaneous compilation
- Sources: SRC-102, SRC-103, SRC-104
- Related questions: Q-007/009/012/014/015, LP-23/25
- Status: Open-question inventory and analysis; no new language decisions.

**Belegt:** DEC-047/057–061 settle the specified numeric suffix and boundary cases, and DEC-062 selects the floating-point standard reference. The current-view statements that still called the edition and raw-backslash behavior open were corrected. The generic parser, minimal insertions, semantic identifier recognition, and parenthesized conditional then-nesting remain as previously selected.

**Ableitung:** Remaining work for affected parser components or the complete target includes delimiter/group trees, unspecified operator associativity and prefix/postfix binding, residual lexical boundaries and limits, dual-tree and source-map contracts, and error outputs/recovery. Selected semantic forms need further syntax only if the generic structure cannot express them. Independent components can be started without settling all of these questions.

**Checked example:** After minimal insertion, `a * -b` gives `a * EMPTY - b`; ordinary binary grouping with the current listed priorities gives `(a * EMPTY) - b`. Whether prefix `-` needs different binding behavior is open. The probe also illustrates alternative equal-priority groupings of `!a++`; it does not implement the language or decide either grouping.

### KP-080 - Delimiters, expression lists, and unary example clarified

- Documented: 2026-11-06 (+01:00)
- Event date: 2026-11-06 00:33 (+01:00)
- Capture: contemporaneous user clarification
- Sources: SRC-105, SRC-104
- Related questions: Q-007/008/015
- Status: Decided (DEC-063–065); detailed tree and semantic contracts remain open.

**Nutzerangabe/beschlossen:** `[]` delimit template parameters, `()` is grouping, and `{}` defines blocks/scopes (DEC-063). DEC-011's previously selected square-bracket template arguments are retained. The user states that `;` creates a sequence of expressions and `,` creates a list whose expressions may be calculated in parallel (DEC-064); this does not require parallel execution.

**Nutzerangabe/beschlossen:** For now, do nothing special for `a * -b` (DEC-065). **Ableitung:** Under the ordinary binary-precedence interpretation checked in KP-079, the inserted stream `a * EMPTY - b` groups as `(a * EMPTY) - b`. This does not decide the semantic legality of `EMPTY` there, or general prefix/postfix behavior.

**Offen:** Group node shapes and empty/nested forms, `;` associativity/result, list representation and evaluation/side-effect details, and other operator binding questions remain unspecified.

### KP-081 - Associativity specified by precedence level

- Documented: 2026-11-06 (+01:00)
- Event date: 2026-11-06 00:40 (+01:00)
- Capture: contemporaneous user decision
- Sources: SRC-106, SRC-107
- Related questions: Q-007/015
- Status: Decided (DEC-066); operator meanings and remaining binding interactions remain open.

**Nutzerangabe/beschlossen:** `;` is left-associative like `,`. Operators on one precedence level share associativity, and a previously unspecified associativity is none (non-associative). Thus `a; b; c` groups as `(a; b); c`.

**Ableitung:** The previously unspecified `@`, `++`, `--`, `!`, `~`, and `<-` levels are non-associative; `->` was already non-associative. Reserved `::` shares its level's right associativity with `:`, without gaining an expression meaning. Paired delimiters still group syntax rather than introducing a separate associativity choice.

**Checked:** An inline documentation check verifies that all 22 precedence rows state one associativity and that the changed levels match DEC-066. It does not test a parser.

**Offen:** The sequence result, semantic legality, and other prefix/postfix interactions are not decided by this choice.

### KP-082 - Longest matching, error tokens, and CST-only parser output

- Documented: 2026-11-06 (+01:00)
- Event date: 2026-11-06 01:36 (+01:00) for SRC-108; the follow-up clarification's exact time is not recorded.
- Capture: contemporaneous user decisions and follow-up analysis
- Sources: SRC-108, SRC-109, SRC-110
- Related questions: Q-014/015, LP-17/23/25
- Status at capture: DEC-067–070 decided; the permissive-candidate strategy was then open and is selected later by DEC-071/KP-083. Exact candidate boundaries and detailed error contracts remain open.

**Nutzerangabe/beschlossen:** Always consume the longest syntactically matching token. If no token starts at the current position, consume the minimum invalid sequence needed to resume valid tokenization and emit it as an error token (DEC-067). For implicit insertion, choose an error token's operand/operator interpretation if it requires no added insertion; otherwise use operand (DEC-068). Unicode errors produce single-character error tokens with the same classification (DEC-070).

**Nutzerangabe/beschlossen:** The CST is a tree of operators with two operands each, plus comments. Postpone AST design until more semantic definitions exist; the first parser does not produce an AST (DEC-069). This replaces DEC-037's earlier separate-tree output requirement. Existing source-preservation and syntax-recovery requirements were not withdrawn; exact node/trivia/comment representation remains open.

**Clarification and alternative:** The assistant pointed out that strict matching of the earlier complete valid-token grammar would split `0b102`, `123foo`, and `0x` instead of necessarily diagnosing whole malformed numbers, and offered uniform matching versus malformed-number exceptions. The user chose uniform matching combined with checking digit values against the specified base only after tokenization. A malformed-number exception was not selected.

**Ableitung:** The clarification allows `0b102` to remain one candidate and then fail base-2 validation. It does not specify the complete candidate grammar. Remaining reconciliation concerns incomplete prefixes/exponents, malformed separators, leading-zero base fields, bare identifier tails, and integer/float candidate ties. Preserving `123foo` as one candidate requires deciding whether decimal candidates also admit letter digits; float-tail errors must coexist with the selected `1.` plus `foo` split.

**Ableitung:** Uniform matching of only complete valid comments can split unterminated `/*text` into valid `/`, `*`, and identifier `text`, conflicting with DEC-029's earlier unterminated-comment diagnostic. Similar malformed-literal/escape recognition needs reconciliation. Broader candidate shapes followed by validation are a possible solution, not an accepted extension of DEC-067.

**Offen:** Candidate productions and numeric-form tie-breaking; earlier diagnostic requirements that no longer follow from matching alone; consecutive/boundary error-token classification and operator-error precedence/associativity; the unit and original-source spans for single-character malformed-UTF-8/Unicode-escape errors; binary CST node layouts/comment attachment/trivia storage; source mappings and structural syntax recovery. No parser implementation or specification test was performed for this analysis.

### KP-083 - Permissive token candidates followed by validation selected

- Documented: 2026-11-06 (+01:00)
- Event date: 2026-11-06 01:56 (+01:00)
- Capture: contemporaneous user decision
- Sources: SRC-111; prior analysis in KP-082
- Related questions: Q-014/015, LP-14/17/25
- Status: DEC-071 decided; exact candidate productions and tie-breaking remain open.

**Nutzerangabe/beschlossen:** The user approves the approach of matching permissive candidates for numbers and other lexical constructs, then validating required internal constraints. Thus malformed numbers, comments, and literals are to remain candidates long enough to report their errors, rather than being split into unrelated valid tokens. The selected longest-match policy remains; no malformed-token fallback exception is introduced.

**Ableitung:** Candidate validation can preserve the earlier requirements for incomplete numbers, invalid base digits, malformed separators, and unterminated comments/literals. The exact candidate spans and boundaries remain unspecified, including how `123foo` and float tails are distinguished, how integer candidates tie with exponent-form floats, and how malformed comments/literals end.

**Offen:** Specify candidate productions, the validation rules and their order after matching, error-token extents for invalid candidates, and ties between candidate kinds. This decision settles the strategy, not a complete lexer grammar or implementation.

### KP-084 - Parser-readiness questions recompiled

- Documented: 2026-11-06 (+01:00)
- Event date: 2026-11-06 02:10 (+01:00)
- Capture: contemporaneous compilation and specification review
- Sources: SRC-112, SRC-113
- Related questions: Q-007/014/015, LP-21/22/23/25
- Status: Question inventory and analysis; no new language decisions.

**Belegt:** DEC-008/048 and DEC-063–071 already select delimiter roles, level associativities, minimal implicit insertions, longest permissive candidate matching followed by validation, contextual error-token classification, single-character Unicode errors, and a binary CST with comments rather than a first-parser AST. Syntax errors require diagnostics, recovery attempts, and a lossless CST. The user has not requested parser implementation.

**Ableitung:** Remaining questions concern delimiter and group structures, the phase diagnosing use of reserved `::`, candidate boundaries/tie-breaking, CST and source mappings, Unicode-error units and phase interactions, contextual classification of consecutive/boundary errors, error-operator precedence, and structural recovery/output. For example, in `a <error> b + c`, where `<error>` denotes one error token, DEC-068 classifies it as an operator without an added insertion, but its unspecified precedence leaves the error-tree grouping open.

**Ableitung:** Error-run boundaries around whitespace/comments and Unicode errors occurring inside comments/literals need precise contracts. The selected strategy is not reopened. Check whether any selected language forms require additional structural syntax; predefined-identifier recognition and semantic legality remain semantic.

**Scope:** These questions block the affected components or a complete full-scope parser, not necessarily every independent valid-input component. CST representation and recovery mechanics may be implementation choices where approved observable requirements suffice. No lexer/parser implementation or test was performed.

### KP-085 - Delimiter trees and generic syntax coverage clarified

- Documented: 2026-11-06 (+01:00)
- Event date: 2026-11-06 (+01:00), following KP-084
- Capture: contemporaneous user decisions
- Sources: SRC-114
- Related decisions/questions: DEC-072–076, Q-007/014/015, LP-21/22/23
- Status: User-approved language rules; concrete representation and remaining recovery details open.

**Nutzerangabe/beschlossen:** Any parenthesis/bracket family encloses an operator tree. Its interior acts as a loosest operator; the complete group acts as one operand in the enclosing tree. This also applies recursively. An empty pair contains one `EMPTY`. Delimiters must match; mismatches are errors. An opener still pending at EOF is an error, and its missing closer is inserted (DEC-072). The previously chosen grouping/scope/template roles remain.

**Nutzerangabe/beschlossen:** Prefix/postfix forms parse like all other operators; semantic analysis interprets their `EMPTY` arguments (DEC-073). No distinct unary or special group-boundary parsing is selected. `::` is a syntactically valid operator with no valid operands, so its use is diagnosed semantically (DEC-074), preserving its selected precedence and associativity.

**Nutzerangabe/beschlossen:** Token recognition acts as if comments were replaced by whitespace (DEC-075). All language syntax fits the operator/operand model (DEC-076). This resolves KP-084's question about additional structural productions for selected language forms, without deciding their semantic meanings.

**Ableitung:** Comments remain preserved under the existing lossless CST requirement; the lexical-whitespace rule does not remove them from source records, recognize comments inside literals, or change global Unicode translation. Group behavior is now specified without choosing a concrete node encoding. EOF closer insertion does not select a recovery policy for a mismatched or unmatched closing delimiter.

**Offen:** Exact lexical candidate extents/ties and fallback error-run boundaries at separators; concrete CST/root/trivia layouts and empty whole-file output; original-source mappings including inserted closers; Unicode-error units/spans and phase interactions; consecutive/boundary error classification and error-operator precedence; other structural recovery and lexical/encoding-error result contracts.

**Verification/scope:** Documentation-only update to the design and both context views; no lexer/parser implementation, project build, or parser test. Existing accumulated changes remain uncommitted.

### KP-086 - Remaining parser questions made concrete

- Documented: 2026-11-06 (+01:00)
- Event date: 2026-11-06 02:46 (+01:00)
- Capture: contemporaneous compilation and specification review
- Sources: SRC-115, SRC-116, SRC-117
- Related questions: Q-014/015, LP-23/25
- Status: Analysis and question inventory; no new language decisions.

**Belegt:** DEC-072–076 settle group behavior, ordinary prefix/postfix parsing, semantic rejection of `::`, comments as lexical whitespace, and coverage by the operator/operand model. Empty groups contain one `EMPTY`; the syntax and root for an empty or comment-only *file* are not specified.

**Ableitung:** Exact permissive candidate boundaries remain observable choices: `0d1#` could be one invalid candidate or a numeric token followed by an error token; `123é` could be one invalid candidate or a numeric token followed by an identifier. These are questions, not selections. Known requirements such as the `123foo` error and `1.foo` split still constrain the candidate grammar.

**Ableitung:** In `a <error1> <error2> b`, where each placeholder denotes one error token, treating both as operators inserts one `EMPTY` between them; treating the first as operator and the second as operand inserts one `APPLY` before `b`; treating the first as operand and the second as operator inserts one `APPLY` after `a`. The alternation/minimum-insertion criterion alone therefore does not select an error-role assignment. How DEC-068 applies to consecutive errors remains open, not superseded.

**Belegt/Ableitung:** A Python 3 probe using the host's Unicode 15.0.0 database normalizes source `a` U+0315 U+0300 to U+00E0 U+0315. Unicode 18 data confirms the relevant combining classes, canonical decomposition of U+00E0, and absence from the composition-exclusion list. The original source characters contributing to U+00E0 are nonadjacent, illustrating why exact contributor mappings and contiguous enclosing byte spans may differ. This is not a full Unicode 18 normalizer conformance test.

**Offen:** Candidate boundaries and tie-breaking; the empty-file contract; Unicode-error units and handling within comments/literals; consecutive-error classification and error-operator precedence; lexical/encoding-error output and delimiter recovery; concrete CST, trivia, and source-map representations. Representation and recovery mechanisms can be implementation choices when they preserve the agreed observable behavior. These questions block affected components or a complete conforming parser, not every independent implementation step.

**Verification/scope:** Reviewed the committed design and current knowledge; updated the question inventory and both context views. A one-off enumeration of all four error-role assignments confirmed insertion counts of 3, 1, 1, and 1; it does not select an assignment under DEC-068. No new parser was implemented, built, or tested.

### KP-087 - Lexical error, empty-file, closer, and normalization decisions

- Documented: 2026-11-06 08:52 (+01:00)
- Event date: 2026-11-06 (time of the six answers unknown; form answers immediately before documentation)
- Capture: contemporaneous decisions with one clarification form
- Sources: SRC-118, SRC-119, SRC-120
- Related: DEC-077–082; supersedes DEC-036's whole-source NFC; refines DEC-029/068/070/072; Q-014/015, LP-23
- Status: beschlossen (DEC-077–082); some interpretations offen as listed

**Nutzerangabe/beschlossen (DEC-077):** If a number prefix (integer or float) is incomplete and the next character is not legal in a number, return that prefix as one error operand; the same applies to non-raw strings or characters at line ends. Asked whether complete numbers followed by letters now split, the user chose to keep the earlier rule: `123foo`, `1.2foo`, `1e3foo` stay single error operands; `1.foo` still splits. Alternative "split into `123` APPLY `foo`" was **verworfen**.

**Nutzerangabe/beschlossen (DEC-078):** Invalid UTF-8 and `\u`/`\U` sequences that cannot produce legal Unicode generate error characters, which cause error tokens. Spans for bad UTF-8 may be approximate, since tools differ; a Unicode recommendation should be followed if one exists. **Belegt:** Unicode 18 §3.9.6 recommends maximal-subpart substitution (SRC-119), as `TextDecoder` implements (SRC-120). Form answer: inside comments/literals the error is diagnosed while the construct stays intact, and literal values contain U+FFFD; the alternative of making the whole comment/literal an error token was **verworfen**.

**Nutzerangabe/beschlossen (DEC-079):** "error operands bind as tightly as possible"; consecutive error tokens collapse into one before operand/operator classification. **Offen:** the exact meaning for an operator-classified error's priority/associativity, and whether whitespace/comments block collapse.

**Nutzerangabe/beschlossen (DEC-080):** A comment-only file converts to a single `EMPTY`. **Ableitung (offen):** the same for empty or whitespace/BOM-only files.

**Nutzerangabe/beschlossen (DEC-081):** With mismatched delimiters at least one closer is unexpected and is converted into an error token. **Ableitung (offen):** the unexpected closer is the one not matching the innermost opener, so `([a)]` yields error `)` plus an inserted `)` at EOF.

**Nutzerangabe/beschlossen (DEC-082):** The user was convinced the whole-source normalization rules were problematic and changed them: no normalization before tokenization; identifiers as already decided; strings as NFC; the user believes normalization would not change other tokens, answering the mapping problem. Form answers: NFC applies to ordinary strings, character literals, and raw strings, on literal source text after `\u` translation and before ordinary escapes, keeping DEC-039. Alternatives **verworfen:** ordinary strings only, strings plus characters only, and NFC on decoded values. **Ableitung/Belegt (SRC-120):** former normalization cases become error tokens rather than different tokens (U+037E, `=`+U+0338), and `"\n\u0303"` becomes the invalid escape `\ñ`.

**Offen:** `123é` tail; EOF extents of unterminated block comments/raw strings; equal-length ties; fallback-run boundaries; error-operator binding; collapse across whitespace/comments; innermost-closer confirmation; empty/whitespace-only files; implicit-node and in-literal diagnostic spans.

**Verification/scope:** Documentation-only update of the design and both context views; no lexer/parser implementation or test. Changes since `0ade6eb` (KP-086 and KP-087) remain uncommitted.

### KP-088 - Adjacency rule and remaining error/lexical answers

- Documentation date: 2026-11-06 (+01:00). Source: SRC-121.

**Nutzerangabe/beschlossen (DEC-083):** "both Identifiers and numbers, if any two appear next to each other, must be separated by white space and/or comments, they may not touch. Otherwise, this is an error operand." **Ableitung (documented consequences):**
- A maximal touching run forms one error operand.
- The rule supersedes the earlier `1.foo` split (DEC-033/077), `a.5` as identifier plus float (DEC-034), and `1..2` as two floats (DEC-061). `1.2.3` also becomes one error operand.
- It settles `123é` as an error.
- `a .5`, `a/*c*/.5`, `1. foo`, and `1...x` are unaffected.

These consequences are mechanical, but they reverse decisions the user explicitly approved earlier, so they are flagged to the user.

**Nutzerangabe/beschlossen (DEC-084):** Unterminated block comments and raw strings extend to EOF, and an error is reported ("Correct, and then an error is reported").

**Nutzerangabe (offen):** "Can there be ties?" **Ableitung:** Ties between token classes cannot occur, because the first characters determine the class and equal-length operator candidates are identical. Overlap is possible only between integer and float candidate shapes, for example `0x1p0` under an alphanumeric hex-integer candidate. **Vorschlag:** Use a single numeric candidate, classified after matching.

**Nutzerangabe/beschlossen (DEC-085):** A fallback run consumes "the smallest number of character so we can again parse a token after". **Ableitung:** Whitespace and comments count as parsable, so `a §  b` yields the error `§`.

**Nutzerangabe/beschlossen (DEC-086):** Operator-classified errors use "tightest binding, left assoc". **Ableitung:** This is tighter than every source operator, including `@`.

**Nutzerangabe/beschlossen (DEC-087):** Whitespace does not block collapse: "error merging happens after parsing created the errors (at least by an as-if rule), and by then, whitespace is already no longer relevant". **Ableitung:** Comments are included via DEC-075.

**Nutzerangabe/beschlossen:**
- The innermost-closer interpretation of DEC-081 is confirmed ("that works").
- Empty and whitespace/BOM-only files are `EMPTY` (DEC-080, "yes").
- Span questions are postponed to implementation (DEC-088).

**Offen:** Confirmation of the single numeric candidate proposal, and the exact numeric candidate grammar.

**Verification/scope:** Documentation-only update of the design and both context views; no implementation or test. Changes since `0ade6eb` (KP-086–088) remain uncommitted.

### KP-089 - Unified numeric candidate accepted

- Documentation date: 2026-11-06 (+01:00). Source: SRC-122.
- Related: DEC-089; refines DEC-067/071 and Q-014.
- Status: beschlossen (approach); exact candidate grammar remains open.

**Nutzerangabe/beschlossen (DEC-089):** The user accepted the proposal to use one unified numeric candidate for integers and floats, then classify the match. The candidate includes numeric suffixes. Candidate matching remains longest-match with post-match validation; the implementation/specification must preserve `1e3` as a float, `16#1e2` as a radix integer, `0x1p0` as a hexadecimal float, and DEC-047's suffix rules. Separate integer and float candidate ties are thereby avoided by construction.

**Offen:** The exact permissive numeric candidate shape, classification and validation details, and any numeric length limits remain Q-014 work. No implementation was requested.

**Verification/scope:** Documentation-only update of the design and both context views; no parser implementation or tests. Changes since `0ade6eb` remain uncommitted.

### KP-090 - Design and research documentation relocated

- Documentation date: 2026-11-06 (+01:00). Source: SRC-123.
- Status: implemented as documentation cleanup; no language-design decisions changed.

**Nutzerangabe:** The user requested a documentation directory with a design and research subdirectory, moving the root `langlist` and `Language-Design.md` into it.

**Belegt:** Both files now reside in [docs/design-research](../docs/design-research/): [langlist](../docs/design-research/langlist) and [Language Design](../docs/design-research/Language-Design.md). The directory name is an implementation choice. The list continues to name the same external experiment roots by absolute path. Links and the handover were updated; the experiment trees were not moved. The preceding design changes were committed as `2963acd` before this cleanup.

**Verification/scope:** The list matches its pre-move bytes; the design differs only in its relative knowledge-view link. All 43 relative Markdown links in the three affected documents resolved. No parser code was changed or tested.

### KP-091 - TDD-first compiler roadmap and project agent support

- Documentation/event date: 2026-11-06 (+01:00); user request at 16:47.
- Sources: SRC-124, SRC-125.
- Related requirement/questions: REQ-003, Q-014, Q-015, DEC-054/069/076/088/089.
- Status: planning request recorded; roadmap/toolchain proposed, not approved.

**Nutzerangabe:** Start a compiler plan with the generic base followed by lexer
and parser work according to the current Language Design. Always follow TDD
and create the necessary agent support files. No further motivation or preferred
test framework/package manager was supplied.

**Belegt:** The worktree was clean at inspection. The repository contained
design/context documents and workspace metadata, but no compiler source,
package manifest, test harness, or existing project agent support files.
TypeScript is already selected. The lossless binary CST, generic
operator/operand syntax, semantic identifier recognition, Unicode 18.0.0,
token-level normalization, error behavior, and unified numeric candidate must
be preserved; this request does not reopen those language decisions.

**Vorschlag:** Eight independently tested phases: (1) generic base and harness,
(2) source/Unicode/provenance, (3) core lexer/trivia/comments, (4) literals,
(5) numeric candidates and lexical recovery, (6) groups and implicit elements,
(7) binary precedence CST, (8) integrated recovery/conformance. The detailed
draft is preserved in
[current knowledge](./Wissensstand.md#proposed-compiler-implementation-plan).
One strict TypeScript package with Node.js LTS, npm, and Vitest is proposed;
exact versions and commands are not yet selected. Every behavior slice has
test-first red/green/refactor acceptance checks. Compiler implementation waits
for plan approval, and each reviewed phase waits for commit/continue
confirmation. Save the standalone plan in `plans/` after approval.

**Offen:** Approve roadmap/toolchain. Resolve Q-014's exact permissive numeric
candidate grammar and length policy before its implementation, without blocking
independent foundation work. Unicode-data provider availability must be verified
against the pinned version, not inferred from host APIs. CST representation,
synthetic spans, and normalized-literal diagnostic mapping remain implementation
choices under DEC-088, to be documented and tested in their phases.

**Belegt / support delivered:** Created [AGENTS.md](../AGENTS.md) for entry
points, strict TDD, initial scope, phase gates, plan directory, and continuity.
Created [frontend instructions](../.github/instructions/compiler-frontend.instructions.md)
with discovery metadata and `src/**,tests/**` scope to preserve lexer/parser
contracts and supersessions. These are project-local, not personal settings.

**Alternatives not adopted in this proposal:** No speculative plugin/pipeline
framework, duplicated always-on instruction file, extra custom-agent roles,
or executable hooks: the requested frontend work needs concise shared guidance,
not additional orchestration infrastructure. No AST or construct-specific
grammar is added; those would contradict the selected parser model rather
than provide a necessary foundation.

**Verification/scope:** Documentation and agent-support changes only. No
compiler implementation, dependency installation, project build/tests, or
commit performed. `git diff --check` passed. A documentation check verified all
55 project-relative Markdown links/heading fragments in the four changed
documents, instruction metadata structure/scope, eight draft phases, and stable
ID uniqueness. External URLs and absolute experiment-archive references were
excluded (102 references). An initial broader link check encountered an
unavailable historical absolute archive reference; no archive files or old
references were changed. These checks do not prove editor instruction loading
or compiler behavior.

### KP-092 - Compiler plan approved; foundation implementation authorized

- Documentation/event date: 2026-11-06 (+01:00); user approval at 17:05.
- Source: SRC-126. Related: REQ-003, KP-091, Q-014.
- Status: beschlossen; planning commit and Phase 1 execution authorized.

**Nutzerangabe:** The user approved the presented roadmap/toolchain and requested
committing the changes, then starting implementation.

**Belegt:** Saved the [approved plan](../plans/compiler-frontend-plan.md) with
eight test-first phases and updated agent guidance to point to it. No language
rules changed. The shell reports Node v26.13.0 and npm 12.2.2; runtime LTS status
and compatible package versions must be verified during foundation setup.

**Next step:** Commit the planning/support documents, implement Phase 1 with
recorded red/green evidence, review, and stop at the phase checkpoint. Numeric
grammar approval remains a gate before Phase 5, not a foundation blocker.

### KP-093 - Planning committed; foundation green after runtime-boundary fixes

- Documentation/event date: 2026-11-06 (+01:00).
- Source: SRC-127; related REQ-003, KP-092.
- Status: implemented/verified Phase 1; awaiting commit/continue confirmation.

**Belegt:** Planning/support changes were committed as `08c381a` before any
compiler implementation. Phase 1 now provides a strict TypeScript ESM package,
pinned npm lockfile, Vitest, declaration build, public export smoke,
original-byte `SourceInput`, validated ranges, and diagnostic/result types.
See the [completion record](../plans/compiler-frontend-phase-1-complete.md)
and [README](../README.md) for API and commands.

**Documented implementation choices:** Source construction and access copy
bytes without decoding; unsupported runtime inputs throw `TypeError`; malformed
or out-of-bounds ranges throw `RangeError`. Returned ranges are frozen.
Diagnostic locations remain original-byte ranges, with physical-line display
deferred. Result types statically exclude errors from success and require
failure's first diagnostic to be an error; no runtime result factory or parser
is provided. These are small foundation contracts, not new language rules.

**TDD/review evidence:** The implementer reported initial source tests red
(10/10) on missing copying/range validation, then green. Static review returned
NEEDS_REVISION for constructor coercion of invalid JS input and inconsistent
null-range errors. The implementer added regressions first (15 failures,
32 passes), fixed both, and reached 47 passing source tests. Conductor inspected
the final fixes and reran all 49 tests, type-check, build, and public export
smoke successfully; `git diff --check` passed. Final review status is approved
after revisions. The review agent did not execute commands; test results come
from the implementer and conductor, not an invented reviewer run.

**Environment/limits:** Node v26.13.0 reports LTS `Lithium`, npm is 12.2.2.
Pinned TypeScript 7.0.2, Vitest 5.1.0, and `@types/node` 26.6.6 were installed.
Node 24 is in the declared engine range but not tested locally. Host Unicode
reports 17.0: it must not be used as evidence for Unicode 18 behavior.
No source decoding, Unicode translation/tables, lexer/parser, AST, or backend
was implemented. Numeric grammar remains Q-014.

**Next step:** Phase 1 implementation remains uncommitted at the phase
checkpoint. Present its completion and Conventional Commit message; await
commit/continue confirmation before Phase 2.

### KP-094 - Foundation committed; source processing and Unicode data added

- Documentation/event date: 2026-11-06 (+01:00); confirmation at 17:36.
- Sources: SRC-128–130; related REQ-003, KP-093, DEC-035/036/046/078/082.
- Status: Phase 1 committed; Phase 2 implemented/verified, uncommitted.

**Nutzerangabe:** The user requested committing the reviewed foundation and
continuing. **Belegt:** Phase 1 committed as `5fa5ce9` before Phase 2 work.

**Implementation:** Added original-byte UTF-8 maximal-subpart decoding,
initial BOM handling, one-based physical scalar positions, eligible global
Unicode escapes with one-pass translation, origin/error metadata, immutable
units/diagnostics, and translated-unit-to-byte ranges. Invalid UTF-8 and
non-scalar/malformed escapes retain diagnosed output rather than discarding it.
Physical lines remain those of original source; translated mixed-origin CRLF
is preserved for subsequent lexical handling.

**Unicode provenance:** Pinned `@unicode/unicode-18.0.0@2.1.0` (MIT) for XID
and names/official aliases. The official
[ReadMe](https://www.unicode.org/Public/18.0.0/ucd/ReadMe.txt) states final
Unicode 18.0.0 data; [DerivedAge](https://www.unicode.org/Public/18.0.0/ucd/DerivedAge.txt)
lists U+0558 at 18.0, used in version-specific data tests. The implementer
also checked property/name and normalization-file headers. No raw UCD files
were vendored; package licensing and Unicode terms are linked in the README.
Normalization itself remains deferred; host Unicode 17 was not substituted.

**Review/verification:** Static review identified missing literal-U+FFFD
coverage. Added that distinction, further malformed UTF-8/escape interactions,
backslash parity, empty/range boundaries, physical line cases and a Unicode18
data-based test; clarified README physical versus logical line endings.
Conductor inspected the source and ran all 94 tests, type-check, build/public
export smoke, and whitespace checks successfully. Review code/coverage findings
are resolved. See [completion record](../plans/compiler-frontend-phase-2-complete.md).

**Process exception:** The initial reported red was missing APIs, not an
assertion against incomplete behavior. Follow-up tests passed immediately and
are coverage additions, not TDD red evidence. This does not meet the user's
strict TDD workflow for that initial implementation; it is recorded rather
than relabeled or retroactively manufactured. Future implementation must
establish importable contracts and confirm behavioral assertion failures
before adding behavior.

**Next step:** Await commit/continue confirmation for Phase 2. Phase 3 core
lexer/trivia has not started; a verified Unicode18 normalization implementation
is required before normalized identifier values. Q-014 numeric matching
remains a later approval gate. No language design rules changed.

### KP-095 - Source phase committed; core lexer and Unicode18 normalization green

- Documentation/event date: 2026-11-06 (+01:00); user confirmation at 18:18.
- Sources: SRC-131–133; related REQ-003, KP-094, DEC-024/031/044/075/082.
- Status: Phase 2 committed; Phase 3 implemented/reviewed, awaiting checkpoint.

**Nutzerangabe:** Commit Phase 2 and continue. **Belegt:** Phase 2 committed
as `aa36992` before implementation. Phase 3 now provides core identifier,
operator, delimiter, whitespace and comment recognition over translated source,
with explicit incomplete/deferred boundaries for numerics and literals.

**Implementation choices:** Separate `scanCoreAt` for composable one-surface
recognition and `lexCore` for ordered lossless items plus diagnostics/status.
Scalar offsets are distinct from original byte offsets. Identifier source
spelling is not normalized for recognition; values use NFC/NFKC as selected.
BOM/trivia/escape spelling/invalid bytes remain recoverable through item ranges.
Comments do not join fragments; embedded Unicode errors retain comment shape.
Deferred regions preserve the unscanned suffix instead of pretending later
numeric/literal syntax is implemented or diagnosing valid future forms.

**Unicode choice/rationale:** The existing Unicode18 package supplies
properties/names but no normalization mappings, while host Unicode is 17.
Added NFC/NFKC with generated minimal decomposition, combining-class and
composition tables from official Unicode18 UCD, plus algorithmic Hangul.
Checksum-verified generator/README record exact source URLs, licensing and
procedure. The implementer reproduced generated output byte-for-byte.
The approximately 2.9 MB official fixture is retained for complete row-based
conformance; runtime tables are approximately 227 KB, not the full raw UCD.
No new package was needed. Host normalization was not selected.

**TDD and review:** The implementer first established an importable skeleton,
then reported eight behavioral assertion failures before core behavior.
Supplementary-character offsets and dot-digit numeric deferral each had a
failing regression before a fix. Focused API/lexer suite reached 15 passing
tests. Static review APPROVED with two minor recommendations; conductor added
`+`/`-` inventory assertions and exact generator source URLs. Those additions
were coverage/documentation, not new red/green behavior.

**Verification:** Conductor ran all 110 tests in five files, type-check,
build/public export smoke and whitespace checks successfully. Normalization
test asserts every official row (20,171), all five input columns for NFC and
NFKC: 201,710 comparisons. Official fixture SHA-256 matched
`25a50d816764b04abfb4a646d3eb2b2a803284c3873d9a06757b94fe4513dde3`.
Reviewer itself did not run commands; execution evidence is implementation/
conductor evidence. Phase 2's prior TDD exception remains recorded.

**Next step:** Phase 3 uncommitted; present the
[completion record](../plans/compiler-frontend-phase-3-complete.md) and wait for
commit/continue confirmation before Phase 4 literals. Numeric grammar Q-014
remains the Phase 5 approval gate. No parser or semantic work added.

### KP-096 - Phase 3 commit authorized without continuation

- Documentation/event date: 2026-11-06 18:56 (+01:00).
- Source: user message in the current conversation, "commit that".
- Status: Nutzerangabe/beschlossen; commit Phase 3 only.

The user authorized committing the reviewed Phase 3 changes. Unlike the prior
confirmations, this request does not ask to continue, so Phase 4 remains paused.
This record accompanies the Phase 3 commit; its hash is retrievable in Git
history. Verification remains the 110-test/type-check/build/export-smoke
checkpoint in KP-095; no code behavior changed in this commit-only turn.

### KP-097 - Complete source JSDoc and persistent agent guidance

- Documentation/event date: 2026-11-06 (+01:00); user request at 18:59.
- Source: current conversation, request to add an agent instruction requiring
  complete JSDoc and document the existing sources.
- Related: REQ-004, KP-096. Status: requested and implemented, uncommitted.

**Nutzerangabe:** Add complete JSDoc documentation to sources, supported by an
agent instruction. No compiler phase advancement or commit was requested.

**Belegt:** Phase 3 is committed as `7823575`. Added
[JSDoc instructions](../.github/instructions/jsdoc.instructions.md) scoped to
`src/**/*.ts,scripts/**/*.mjs` and linked them from [AGENTS.md](../AGENTS.md).
Documented all eight source modules and the Unicode normalization generator:
module responsibilities, declarations/properties, generic contracts, parameters,
returns/errors, byte/scalar/UTF-16 units, normalization, mutation/copying,
provenance, diagnostic recovery and deferred work.

**Maintenance choice:** Documented table declarations, not each generated row;
the generator emits the same JSDoc as the checked-in generated output, retaining
Unicode attribution. No duplicate re-export documentation, dependency additions,
runtime behavior changes, data-row changes, or third-party fixture edits.
Documentation-only work uses no artificial TDD red stage.

**Verification:** Implementer reports an AST/tag audit of nine modules,
175 declarations with 77 parameters and seven generic parameters, no missing
audited tags; comment-insensitive AST comparison and exact regenerated-output
comparison passed. These audit counts establish coverage, not an automatic
proof of comment accuracy. Conductor inspected representative contracts against
implementations and reran type-check, build, all 110 tests, and public export
smoke successfully. Whitespace checks passed. No new documentation tooling
was installed. Restored existing semicolon style during final review.

**Next step:** Documentation changes await the user's next request.
Phase 4 remains paused; no commit performed in this turn.

### KP-098 - JSDoc documentation commit authorized

- Documentation/event date: 2026-11-06 19:21 (+01:00).
- Source: current conversation, user request "commit that".
- Status: Nutzerangabe/beschlossen; commit the documentation changes in KP-097.

The user authorized committing source JSDoc, generator-preserved documentation,
and project agent guidance. This record accompanies that commit; its hash is
retrievable in Git history. Verification remains the checks recorded in KP-097;
no source behavior changed in this commit-only turn. Phase 4 remains paused.

### KP-099 - Phase 4 literals implemented after continuation

- Documentation/event date: 2026-11-06 (+01:00); user request at 19:23.
- Sources: current conversation, "continue with the plan"; Phase 4 implementation
  and static-review reports; inspected source and local verification commands.
- Related: REQ-003/004, DEC-025–027/030/039–045/055/078/082/088.
- Status: continuation approved; Phase 4 implemented/reviewed, uncommitted.

**Nutzerangabe:** Continue with the approved plan. **Belegt:** JSDoc maintenance
is committed as `185b5a4`; Phase 4 started from that clean baseline.

**Implementation:** Added ordinary/character/tagged raw literal candidates and
validation to the core scanner, leaving only numeric starts deferred. Selected
escapes, Unicode names/aliases, scalar-length checks, Unicode18 NFC before
ordinary escapes, raw LF normalization, string-only continuation, global
generated characters, newline/EOF extents and exact original-byte coverage
are covered. Invalid literal candidates are operand-classified error tokens;
diagnostics remain explicit alongside best-effort values. Source JSDoc and
README updated; dependencies/tables/generator/third-party fixtures unchanged.

**Representation choice under DEC-088:** Normalization carries exact input
contributors through decomposition, reordering and composition. Internal
diagnostic ranges are the smallest original-byte hull of those contributors;
reordering can include intervening bytes, not unrelated prefix/suffix bytes.
Shared hard-ending helpers keep decoding/comment/literal behavior aligned.

**TDD/review evidence:** Implementer reported 234 assertion failures against
importable incomplete literal behavior before implementation. Static review
requested revision because malformed ordinary escapes could swallow multiple
source-error replacements. Five regressions failed before fixing that issue:
each source error now contributes its own U+FFFD even inside a consumed escape.
A malformed enclosing escape remains independently invalid and contributes
its own replacement in the best-effort value; this does not suppress errors or
make the literal successful. Contributor arrays have direct decomposition,
reorder, composition/Hangul/noncontiguous tests. Some continuation test inputs
were corrected for already-selected global backslash eligibility.

**Verification:** Conductor inspected the revised path and ran all 360 tests
in six files, type-check, build/public export smoke and whitespace checks
successfully. Full official NFC/NFKC fixture comparisons still pass. Initial
review NEEDS_REVISION findings are resolved; final conductor assessment approved
after revisions. The reviewer itself ran no commands.

**Next step:** Present [Phase 4 completion](../plans/compiler-frontend-phase-4-complete.md)
and pause for commit/continue confirmation. Phase 5 has not started: Q-014 exact
numeric candidate grammar/classification boundaries and length policy require
agreement before matcher implementation. No language rule or parser added.

### KP-100 - Literal phase committed; numeric policy approval requested

- Documentation/event date: 2026-11-06 (+01:00); confirmation at 19:59.
- Sources: current conversation, "commit that, then continue"; approved Phase 5
  gate; read-only numeric design research and current design decisions.
- Related: Q-014, DEC-047/057–061/067/071/077/083/089, KP-099.
- Status: Phase 4 committed; numeric policy proposed, not selected.

**Nutzerangabe:** Commit Phase 4 and continue. **Belegt:** Phase 4 committed
as `5f43c73` before further work. The approved plan requires agreement on exact
numeric candidate boundaries and length policy before matcher code. No code
was added after the commit.

**Vorschlag:** Local exponent signs and one point/exponent per core, no exponent
syntax in radix integers; preserve malformed digit/separator extents; repeated
exponents do not absorb new signs; suffix-shaped tails can remain attached to
incomplete cores; hex points without binary exponents are malformed candidates;
no language-level numeric text length cap. Concrete examples and remaining
production questions are saved in
[current knowledge](./Wissensstand.md#phase-5-numeric-approval-gate).

**Rationale:** Keep ordinary operators from being swallowed by broad numeric
recovery while preserving already-selected invalid extents, adjacency errors and
dot runs. Avoid mistaking JavaScript numeric precision for a language lexical
limit; numeric representation/range/rounding and suffix meanings remain semantic.

**Open:** User approval of boundary/length policy, exact component productions,
invalid suffix tails and repeated-hash boundaries. This turn does not silently
promote research recommendations to language decisions.

**Verification/scope:** Commit succeeded; no compiler behavior changed after
the previously verified 360-test Phase 4 checkpoint. Only completion/context
records updated after the commit; these gate notes remain uncommitted.
Next step: obtain the numeric decisions before implementation.

### KP-101 - Numeric policy approved; remaining productions made explicit

- Documentation/event date: 2026-11-06 20:06 (+01:00).
- Source: current conversation, user response "approved" to the four policies
  presented after KP-100.
- Related: DEC-090, Q-014. Status: policies approved; remaining grammar proposed.

**Nutzerangabe/beschlossen:** Local exponent signs (`1e++2` boundaries), no
radix exponents (`16#1e+2` boundaries), intact malformed `0x1.2`/`0x#x`
candidates, and no language-level length cap. Recorded precisely as DEC-090
in Language Design. The response approves the presented policies, not
previously unpresented malformed hash/tail behavior.

**Vorschlag:** Finalized a deterministic remaining component/tail/hash proposal
in [current knowledge](./Wissensstand.md#final-candidate-production-proposal-pending-approval).
It makes sign handling after invalid tails, suffix underscores, empty radix
bodies, and extra hashes explicit, retaining candidate-then-validation and
DEC-083 adjacency. New examples distinguish pending choices from existing
approved outcomes.

**Scope/verification:** Specification/context update only. No matcher code,
dependency change, commit or test run. Existing staged gate notes were
preserved; this turn adds unstaged updates without resetting the index.
The approved plan still requires exact grammar agreement before implementation.
Next step: confirm remaining productions, then implement Phase 5 with TDD.

### KP-102 - Remaining numeric grammar approved; Phase 5 implementation starts

- Documentation/event date: 2026-11-06 20:10 (+01:00).
- Source: current conversation, "approved" in response to remaining boundaries
  and permissive components/one-suffix-separator proposal.
- Related: DEC-091, DEC-090, Q-014, KP-101.
- Status: beschlossen; numeric grammar gate complete.

Recorded the remaining deterministic components, malformed tails, extra-hash
boundaries and adjacency consequences as DEC-091 in Language Design. The
user's approval permits test-first Phase 5 implementation, not automatic phase
advancement or a commit. Existing staged documentation is preserved. Next:
numeric candidate matching/classification/validation and full lexer recovery,
then tests/review and the usual commit checkpoint.

### KP-103 - Phase 5 numeric lexer implemented, reviewed and verified

- Documentation/event date: 2026-11-06 (+01:00).
- Sources: implementation report, read-only Code-Review-subagent result,
  conductor validation commands and
  [completion evidence](../plans/compiler-frontend-phase-5-complete.md).
- Related: DEC-089–091, Q-014, KP-101/102.
- Status: implemented/verified; awaiting user commit/continue confirmation.

**Belegt:** Unified numeric candidate matching/classification/validation,
text-preserving `CoreNumber`, touching identifier/number errors and shortest
fallback recovery are implemented. Numeric deferral API is removed and the
README/export smoke updated. Numeric meanings, rounding and parser-level
error collapse remain deferred; no parser added. The numeric grammar approval
gate is resolved, superseding older current-state claims that it remains open.

**TDD/review evidence:** Implementer reported 62 behavioral failures/two passes
before implementation and a later exponent regression with one failure/67
passes before fixing it. Focused green reported as 336 tests. These are
implementer-reported red runs, not conductor reruns. Static review approved
with no findings; the reviewer did not execute commands.

**Independent verification:** Conductor ran `npm test` (432 passed in seven
files), `npm run typecheck`, `npm run smoke:exports` (including build),
`git diff --check` and `git diff --cached --check`; all passed. Existing
normalization conformance remains covered by the full suite. No dependency or
generated-data changes. Staged/unstaged documentation preserved.

**Next:** User checkpoint to commit and/or continue to Phase 6 grouping and
implicit APPLY/EMPTY elements. No commit made and no Phase 6 implementation
started. Grammar approval alone does not authorize either action.

### KP-104 - Phase 5 committed; Phase 6 structural grouping completed

- Event date: 2026-11-06 21:15 (+01:00), user "commit that, then continue".
- Documentation date: 2026-11-06 (+01:00).
- Sources: current conversation, commit `e2afc57`, implementation/review
  reports, independent validation and
  [Phase 6 completion record](../plans/compiler-frontend-phase-6-complete.md).
- Status: Phase 5 committed; Phase 6 implemented/verified, uncommitted.

**Nutzerangabe/beschlossen:** Commit reviewed Phase 5 and continue the approved
plan. Committed its 13 files as `e2afc57`, including the documented numeric
deferral API removal. Worktree clean immediately after that commit.

**Belegt:** Phase 6 adds `structureCore`, structural CST contracts,
explicit-stack delimiter grouping and independent minimal APPLY/EMPTY
insertion. Mismatched closers remain unexpected relative to the innermost
opener, not ancestor-autoclosing instructions. Outstanding closers are
diagnosed and inserted at EOF; source entries/trivia remain retained.
Precedence and final contextual error classification/collapse are deferred,
not silently approximated. Unresolved errors are explicit insertion barriers.

**Implementation choices under DEC-088:** Synthetic spans are zero-width byte
anchors. Insertions before tokens use the following significant token's start;
trailing EMPTY uses the preceding operator's end. Empty/trivia-only file EMPTY
uses EOF; empty groups use their closer's start or EOF if missing. Inserted
closers use EOF and contain no original bytes. README and tests pin these rules.

**TDD/review:** Implementer reported eight initial behavioral failures against
an importable unimplemented skeleton, then 11 focused tests green. Static
review requested accurate root-unmatched-closer wording and helper JSDoc
including known-role operand errors. Exact-message regression failed before
fixing the diagnostic. Conductor inspected both revisions; static reviewer
did not run tests.

**Independent verification:** `npm test`: 443 passing tests in eight files.
`npm run typecheck`, `npm run smoke:exports` (includes build) and
`git diff --check` pass. Tests include 1,500-level nesting, explicit token
fixtures, all delimiter families, exact anchors and byte reconstruction with
BOM/global escape spelling. No dependency/generated-data changes.

**Next:** Await user checkpoint for Phase 6 commit and/or Phase 7 continuation.
No Phase 6 commit and no Phase 7 implementation performed.

### KP-105 - Phase 6 committed; Phase 7 precedence-based CST completed

- Event date: 2026-11-06 21:52 (+01:00), user "commit that, then continue".
- Documentation date: 2026-11-06 (+01:00).
- Sources: current conversation, commit `6a0e637`, implementation/review
  reports, independent validation and
  [Phase 7 completion record](../plans/compiler-frontend-phase-7-complete.md).
- Status: Phase 6 committed; Phase 7 implemented/verified, uncommitted.

**Nutzerangabe/beschlossen:** Commit reviewed Phase 6 and continue the approved
plan. Committed its ten files as `6a0e637`; worktree clean immediately after.

**Belegt:** Phase 7 adds `parseSource`, `parseCore`, the full DEC-022/066 table,
and binary expression/group/scope/result contracts. Operators remain generic;
there is no special unary grammar, conditional reassociation or semantic
rejection of `::`. Groups retain independently parsed interiors. Each scope
retains structural entries including comments/trivia and original-byte spans.

**Implementation choices:** Iterative shunting-yard reduction and explicit
post-order group traversal avoid call-stack consumption by operator chains or
group depth. Binary spans cover left-child start to right-child end. Repeated
non-associative levels receive diagnostics with deterministic left-reduced
partial trees. Unresolved errors leave their scope's expression undefined,
retaining structural data; all error diagnostics cause error status.
Contextual roles/collapse and full frontend conformance remain Phase 8.

**TDD/review:** Implementer reported 31 of 32 behavioral failures against an
importable skeleton. A later off-by-one expected span was corrected as a
test-fixture error, not a production bug. Focused green initially 33 tests.
Static review approved with a minor misleading-title recommendation, now
corrected. Three parser-level stress tests were added and passed without
production changes: 1,500 nested groups and 5,000-operator left/right chains,
with exact iterative depth/count assertions. Final focused suite: 36 tests.
Reviewer did not execute checks.

**Independent verification:** `npm test`: 479 passing tests in nine files.
`npm run typecheck`, `npm run smoke:exports` (includes build) and
`git diff --check` pass. Full normalization conformance remains covered.
No dependency or generated-data changes.

**Next:** Await user checkpoint for Phase 7 commit and/or Phase 8 continuation.
No Phase 7 commit and no Phase 8 implementation performed.

### KP-106 - Phase 7 committed; Phase 8 awaits error-role policy decision

- Event date: 2026-11-06 22:39 (+01:00), user "commit that, then continue".
- Documentation date: 2026-11-06 (+01:00).
- Sources: current conversation, commit `d91ffb4`, implementation/static review
  reports, Language Design DEC-068/077/079/083 and independent validation.
- Status: Phase 7 committed; Phase 8 provisionally implemented, review blocked.

**Nutzerangabe/beschlossen:** Commit reviewed Phase 7 and continue. Its ten
files were committed as `d91ffb4`. An unrelated untracked `.trunk/` directory
was excluded and left untouched.

**Belegt/provisional:** Integrated recovery collapses consecutive errors across
trivia before choosing roles, retains original error parts/interior trivia and
all diagnostics, and builds full error-bearing trees. Error operators bind
most tightly with left associativity. `reconstructSource` walks ordered CST
source ranges and rejects gaps/overlaps/incomplete coverage rather than
returning a copy of the input without checking its structure.

**Offen Q-017:** Implementer flagged, and reviewer confirmed, a consequential
policy conflict. DEC-068 uses a zero-insertion role or otherwise operand;
DEC-079 collapses errors before classification. DEC-077/083 name malformed
numbers/touching candidates error operands. Current code forces any collapsed
run containing a lexically known operand error to operand, documented explicitly
as an interpretation rather than agreement. In `a 0x b`, this needs two APPLYs
where contextual operator classification needs none. `a 0x § b` also exposes
whether that designation fixes a mixed collapsed run. Both fixed-role and
uniform contextual approaches remain options pending user choice; no decision
is inferred from code or passing tests.

**TDD/review:** Implementer reported 46 of 47 new tests failed behaviorally
against Phase 7 before implementation. Static review NEEDS_REVISION: policy
decision required; exhaustive 5,460-input oracle currently covers fallback
errors only and should include known/mixed errors after agreement. Add full
expression-retention assertions for malformed numeric candidates. Reviewer
did not execute automated checks.

**Independent provisional validation:** `npm test`: 526 passing tests in ten
files; `npm run typecheck`, `npm run smoke:exports` (includes build) and
`git diff --check` pass. Tests cover large error runs, deep groups, long
error chains, malformed UTF-8/BOM/global escapes, reconstruction and tamper
rejection. This verifies current behavior, not resolution of the specification
conflict. No dependency or generated-data changes.

**Next:** Ask user to select error-role precedence, record selected policy,
align source/docs/tests test-first, cover the identified gaps and revalidate.
No Phase 8 completion document or commit; plan not declared complete.

### KP-107 - Fixed error-operand policy approved as DEC-092

- Event/documentation date: 2026-11-06 23:16 (+01:00).
- Source: current conversation, user selected "1" from the two explicit
  error-role policies in response to KP-106's blocker.
- Status: beschlossen; Q-017 resolved, Phase 8 review work resumes.

**Nutzerangabe/beschlossen:** A lexically designated error operand remains
operand, and so does any collapsed run containing one. Thus `a 0x b` and
`a 0x § b` require two APPLYs. Uniform contextual classification of all
collapsed errors was rejected. DEC-068 still classifies runs without a
designated operand part. Recorded in Language Design as DEC-092; this resolves
the apparent precedence conflict rather than silently rewriting past decisions.

**Next:** Existing provisional code already follows the chosen role policy.
Align README/JSDoc, extend independent known/mixed-error coverage and assert
full-tree retention, then review and independently validate. Approval is of
the policy, not a Phase 8 commit or proof that all implementation checks pass.

### KP-108 - Phase 8 and approved frontend implementation plan complete

- Documentation/event date: 2026-11-06 (+01:00).
- Sources: implementation/static review reports, conductor inspection and
  executed checks, [Phase 8 record](../plans/compiler-frontend-phase-8-complete.md)
  and [overall report](../plans/compiler-frontend-complete.md).
- Status: implemented/verified, reviewed after revisions; Phase 8 uncommitted.

**Belegt:** DEC-092 policy is reflected in README/JSDoc and constrained-oracle
fixtures. Malformed numeric/literal/touching errors and mixed runs in both
orders, comments and unexpected closers now assert fixed roles, insertion
counts, complete trees, exact spans/diagnostics and byte reconstruction.
These coverage-only additions required no role-algorithm change; initial
fixture expectation errors were corrected without claiming production red.
The previously disputed policy is resolved by user choice, not by tests alone.

**Review/root fix:** Final static review found that three function-call spreads
of held trivia could exceed the JavaScript argument limit. Three regression
tests with 200,000 comments each failed with `RangeError: Maximum call stack
size exceeded` before replacement with iterative appends. All passed afterward,
including exact trivia/source retention. Added missing overlap/reorder
reconstruction negatives and explicit touching-operand cases. Conductor
inspected final revisions and validated; reviewers ran static review only.
Both NEEDS_REVISION reports are resolved on that basis.

**Independent final checks:** `npm test`: 541 passed in ten files;
`npm run typecheck`, `npm run smoke:exports` (includes build) and
`git diff --check`: pass. Recovery adds 62 runner tests over Phase 7.
Independent fallback oracle covers 5,460 sequences; constrained known-operand
fixtures cover DEC-092. Tests include 50,000 error parts, 20,000 error operators,
20,000 nested groups and 200,000 trivia entries on each flush path.
Existing full Unicode18 normalization conformance remains covered.

**Public migration:** Error entries own original parts/interior trivia in
`components`, with operand/operator roles; direct source/errorKind fields and
unresolved barriers are removed. Error operators bind tightly and
left-associatively. Reconstruction walks ordered CST ranges, rejecting gaps,
overlaps, reordered or incomplete coverage. Error diagnostics retain error
status despite complete recovered trees.

**Completion/next:** All eight implementation phases completed, evidence and
overall file/commit inventory saved. Phase 8 and these records are uncommitted;
await explicit commit authorization. No automatic new scope. Semantics, AST,
numeric suffix interpretation/rounding, runtime and backend remain deferred.
Unrelated `.trunk/` unchanged. The documented Phase 2 TDD evidence exception
remains; completion does not retroactively fabricate missing red evidence.

### KP-109 - Final frontend commit authorized; next scope to clarify

- Event/documentation date: 2026-11-06 23:50 (+01:00).
- Source: current conversation, user "commit that, then continue".
- Status: final commit authorized; approved eight-phase implementation complete.

The user authorized committing Phase 8 and the final documentation. This entry
accompanies `feat(frontend)!: complete recovery and conformance`; its hash can
be retrieved from Git history without embedding a self-referential hash.
Unrelated `.trunk/` remains excluded. Prior 541-test/type-check/build/export
verification is unchanged; documentation-only authorization updates need no
new fabricated TDD run.

"Continue" has no remaining phase in the approved plan. Next scope is open,
not inferred approval to implement semantics, runtime or backend. Ask whether
to plan semantic analysis or prioritize frontend tooling/hardening; these are
proposals, not selected requirements.
