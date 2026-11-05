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
| SRC-001 | `/bigdata/KAI/projects/NewLanguageProject/langlist` | Read during this task | Four listed directory roots | The list itself does not explain ownership or intent for individual files. |
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
| SRC-093 | [Language Design](../Language-Design.md) and relevant lexer/parser sections of [Wissensstand](./Wissensstand.md) | Reviewed at commit `5e32bcb`, 2026-11-05 (+01:00) | Approved DEC-008–046 where relevant, questions Q-007–016 and blockers LP-18–29 | Assessment uses the current project records; earlier experiment sources were not re-examined for this request. |
| SRC-094 | User decisions in this conversation | 2026-11-05 (+01:00) | Specifies `#` suffixes, minimal insertion, tighter `.`, reserved `::`, sequencing `;`, left `@name` binding targets, semantic identifier recognition, and confirms TypeScript; requests raw-string clarification and conditional counterexamples | Does not select raw-backslash behavior, change `?`/`:` priorities, or authorize parser implementation. |
| SRC-095 | User response to numeric-suffix clarification | 2026-11-05 (+01:00) | Selects a nonempty ASCII alphanumeric suffix sequence and radix-first interpretation for the first `#` after an unmarked integer from 2 through 36 | Selected proposal uses `0d` to force decimal suffix interpretation and retains errors for invalid digits in a recognized radix form. |
| SRC-096 | Inline Python 3 specification probes run in this project | 2026-11-05 (+01:00) | Six binary-precedence trees, eleven integer suffix/radix cases, and 254 operand/operator kind sequences checked with assertions | No project implementation or files created; binary conditional trees do not establish any unselected semantic pairing/reinterpretation rule. Integer probes are not a full float/Unicode lexer. |
| SRC-097 | `/bigdata/KAI/NewLang/parser/NLparser/Scanner.cc` raw-string branch (around lines 599–632) and inline Python 3 precedence probe | 2026-11-05 (+01:00) | NewLang raw-content backslash handling; conditional trees for `?`/`:` at the same priority | Prototype code, not normative; probe is not project parser code. |
| SRC-098 | User decisions in this conversation | 2026-11-05 22:57 (+01:00) | Selects literal non-universal raw backslashes; retains `?`/`:` priorities and requires parentheses for then-branch nesting | No other lexical or structural decisions. |
| SRC-099 | [Language Design](../Language-Design.md) numeric productions and [Wissensstand](./Wissensstand.md) LP-13/14 | Reviewed 2026-11-05 (+01:00) | Existing integer, float, separator, suffix, and malformed-number decisions compared to open numeric-boundary notes | The resulting examples identify gaps to specify; they are not language decisions or lexer-test results. |
| SRC-100 | User decisions in this conversation | 2026-11-05 23:24 (+01:00) | Incomplete integers and malformed separators are errors; no leading zeros in bases; float suffixes allowed; longest match decides dot runs; asks for floating-point standard options | Does not select the ISO/IEEE edition. |
| SRC-101 | User decision in this conversation | 2026-11-05 23:46 (+01:00) | Selects option A, IEEE 754-2019 / ISO/IEC 60559:2020, as the floating-point reference | No separate rounding policy, suffix type inventory, or lexical length limit is selected here. |

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

DEC-006 records the approved decision in the Wissensstand and the initial [Language Design](../Language-Design.md). This policy avoids NFKC compatibility folding. The next step was to choose identifier characters and a Unicode data version; KP-006 records the user's selection of the proposed XID syntax. The property version remains open; revisit standards guidance when a next-version draft becomes available.

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

DEC-007 updates the [Language Design](../Language-Design.md) and resolves the character-set policy. The Unicode property-data version remains open as Q-006. The recorded proposal contains no version choice, so none is inferred.

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

DEC-008 and DEC-009 record these rules in [Language Design](../Language-Design.md). This resolves whether implicit application is part of the syntax model and when inserted elements are validated. The complete operand-priority table and rules for semantic legality remain open as Q-007 and Q-008.

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

DEC-010 adds this rule to [Language Design](../Language-Design.md). Unary operators therefore do not require a separate tree-forming mechanism, but their precedence and semantic validity remain part of Q-007 and Q-008.

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

DEC-011 updates [Language Design](../Language-Design.md) and resolves the syntactic-model choice. Q-009 now tracks remaining binding semantics; Q-010 tracks declaration-versus-definition behavior.

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

DEC-012 records the no-keywords rule in [Language Design](../Language-Design.md); DEC-011 already records square brackets as the template delimiter. The reserved-keyword conflict is resolved, while the exact lookup and redefinition mechanics remain open.

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

DEC-013 records the typing requirement in [Language Design](../Language-Design.md). Q-009 remains open for type-inference rules, cases requiring annotations, type compatibility, and the timing/scope of type checking.

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

DEC-014 records the principle in [Language Design](../Language-Design.md). Q-009 remains open for the safety properties and proof criteria, alongside inference, annotation, and checking details.

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

DEC-015 and REQ-002 record the model and collection requirement in [Language Design](../Language-Design.md). Q-011 tracks the unresolved operational meaning of variable identity, aliasing, reference lifetime/validity, and the representation and value/reference classification of named/indexed field collections. No garbage collector, deterministic destruction, ownership discipline, or other lifetime mechanism is selected by this statement.

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

DEC-016 adds the logical model to [Language Design](../Language-Design.md), related to the named/indexed field collections in REQ-002. The concrete type and syntax of these collections, field naming/indexing, construction/unpacking behavior, lifetime, and whether they are observable as ordinary values remain open under Q-011.

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

DEC-017 records the lifetime model in [Language Design](../Language-Design.md). Q-011 now includes the proof criteria and behavior-preservation conditions for lifetime optimizations, in addition to the still-open identity and collection semantics.

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

DEC-018 records these rules in [Language Design](../Language-Design.md). Q-009 now tracks the remaining namespace, declaration, ranking, and type-checking details.

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
