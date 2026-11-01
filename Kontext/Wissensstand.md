# Current Knowledge

## Maintenance and coverage

- Project/workspace: `/bigdata/KAI/projects/NewLanguageProject`
- Last substantive update: 2026-11-01 (timezone +01:00)
- Sources reviewed: `langlist`, the four listed directory roots, project manifests/readmes, and selected source files noted below.
- Not reviewed: every file's contents, dependency trees, all archives, build outputs, and full version-control histories. No earlier project discussion history has been reconstructed.
- Historical context: [Kontextprotokoll](./Kontextprotokoll.md)

This is a first-pass classification, not a provenance audit or a decision to move/delete files. The directories listed in `langlist` are outside this workspace. They were read for this task; no source files were changed.

## Goal and scope

REQ-001: Identify which material in the directories listed by `langlist` belongs to the language/parser experiments and which is from other projects or reference sources. Status: user-stated and agreed for this first task (KP-001).

## Source map and preliminary classification

`langlist` names four directory roots:

1. `/bigdata/KAI/NewLang`
2. `/bigdata/KAI/projects/GenLang`
3. `/bigdata/KAI/projects/LangLLVM`
4. `/bigdata/KAI/projects/OPPlang` (the contents reviewed are under `OPPrs/`)

### `/bigdata/KAI/NewLang`

| Classification | Paths / file groups | Evidence and confidence |
| --- | --- | --- |
| Language/parser experiments | `oppp/` (`Objects.*`, `Parser.*`, `Stack.*`, `oppp.pro`); `parser/NLparser/` (`main.cpp`, `Scanner.*`, `Parser.*`, `Config.*`, `SourceFile.*`, `NLparser.pro`, and related files); root `oplscan.l`, `oppgen.pl`, `oplparse.h`, `prec.y`, and likely `oppp.cc`; `IDEAS/Implementation.txt`, `newlang.ye`, `Syntax.txt`, `OtherStuff.txt`, `txt2bnf.pl`, `ye2y.pl`; `IDEAS/chknexts/`, `defstruct/`, `to_c/`; `IDEAS/java8/` grammar work | Source/build configuration and design notes indicate experiments. For `oppp.cc` and some IDEAS files, attribution is based on location and subject; review individually before treating as definite. |
| Clearly external/reference material | Root `ANSI-C-grammar.l` and `.y` (attribute their headers to Jutta Degener, 1995); `clangtools/` and `CLANGTOOLS.SVN/`; `gc/libgc-7.2d/`; `lisp/` distribution trees and archives (including ECL, SBCL, cl-ppcre, cl-unicode); `parser/NLparser/icu-*`; `parser/UCD/`, `IDEAS/UCD/`, Unicode archives/specifications; `IDEAS/bsn/` Bison source/docs; `IDEAS/SchemeInterpreter/r7rs-small-spec/` and the R7RS PDF/spec text; `IDEAS/App-L-ISP/` historical disk/ROM/docs | Contents, licenses, and/or explicit source attributions identify these as software, datasets, or specifications separate from the language implementation. Some may have been used as references or dependencies. |
| Generated/build/editor artifacts | `build-oppp-Desktop-Debug/`, `parser/build-NLparser-*/`; root `oplscan.c`, `oplscan.h`, `oplscan.i`, `oplscan.o`, `oplscan.s`, `prec.tab.c`, `prec.output`, `prec.dump`, `lex.backup`, swap files | Makefile and source names indicate generated or local build/editor products. Treat as derived from experiments unless separately proven otherwise. |
| Needs provenance check | Root `opp.c`, `229.full.pdf`, `Operator Precedence Parsing | Practice (C++).html`, `mist`, and older archives/backups | Their contents or origins were not established sufficiently to make a reliable ownership claim. The ANSI C grammar files are not in this uncertain group; their headers identify their source. |

### `/bigdata/KAI/projects/GenLang`

| Classification | Paths / file groups | Evidence and confidence |
| --- | --- | --- |
| Language experiment/project | `packages/{compiler,docs-utils,generator,genlang,genlang-cli,shared}/`; `docs/language.md`; root `gl/` language examples/tests; `scripts/`, root build/config files, and project tests | Workspace manifest describes a language-processing project using Chevrotain; the language spec and package layout align. `gl/` is part of this project's examples/fixtures, not evidence of separate upstream projects. |
| Other projects / dependencies | `node_modules/` and package-manager dependencies | Third-party installed packages; not GenLang implementation source. |
| Generated or local artifacts | `docs/diagrams/`, `logs/`, `test-reports/`, `tmp/`, generated JS/maps/build metadata, `ARCHIVE.zip`, and editor/session files | Generated/local/archive material; archive contents and provenance not inspected. |

### `/bigdata/KAI/projects/LangLLVM`

| Classification | Paths / file groups | Evidence and confidence |
| --- | --- | --- |
| Language/compiler experiment | `src/index.ts`, `src/test_gen.ts`, `src/mylang.pegjs`, `src/Design: Declarations, Definitions.md`, and `pegjs-c++/chain.pl`, `recur.pl` plus timestamped backups | Project README calls this “My language compiler”; PEG grammar is copyright 2019 Kai, and the Perl scripts are grammar-processing experiments. |
| Other projects / dependencies | `node_modules/` | Installed third-party dependencies, including LLVM bindings and PEG.js. |
| Generated/local artifacts | `src/*.js`, `*.js.map`, `biteCodeFileName.*`, `nohup.out`, and build/editor files | Generated or execution output, not primary source. |

### `/bigdata/KAI/projects/OPPlang/OPPrs`

| Classification | Paths / file groups | Evidence and confidence |
| --- | --- | --- |
| Language/parser experiments | `miniopp/src/` and its own package files; `minipratt.js/{index.ts,shunting-yard.ts,test.ts}`; `bison-calc/{b2o.pl,generate.sh,do.sh,ansic/b2o.pl,op-summary.txt*}` | `miniopp` and `minipratt.js` package metadata names Kai as author; parser/lexer and precedence-analysis sources show experimental work. |
| Separate upstream project/reference | `JSONFROMTABLE/jsonfromtable/` (README identifies `coderosh/jsonfromtable`); `minipratt/` (README links to matklad's Pratt-parser posts and Cargo metadata names Aleksey Kladov); `bison-calc/calc/calc.y` (GNU Bison manual calculator example); `bison-calc/ansic/ansic.l` and `.y` (Jutta Degener's ANSI C grammar) | README, package metadata, and source headers provide direct evidence. Generated Bison outputs in these folders derive from the sample grammars. |
| Data/dependencies/generated/local files | `miniopp/UCD/`, `UCD.zip`, Unicode tables; `node_modules/`; generated `.mjs`, `.map`, `typescript`, `unidata.json`; `out/`, `.git-alt/`, editor files; generated Bison `.tab.c/.h`, `.output`, `.xml` | Data, dependencies, generated parser outputs, and repository/editor metadata; not independent language source. |

## Experiment findings: features, implementation languages, and algorithms

These are source-backed findings, not claims that every planned feature is implemented. An early language-design note, grammar prototype, and working compiler may describe different stages or directions.

### NewLang (`/bigdata/KAI/NewLang`)

- **Proposed language features:** package/module organization with imports and exports; classes, interfaces, inheritance, mixins, generic/type-parameterized types and overload resolution; value/flat types versus garbage-collected reference types; enums, subranges, sets, arrays and structs; explicit definition markers for constants, variables and types; function types with multiple inputs and outputs; coroutines; reflection-aware bytecode and native-code interoperation. These are design notes, not proof of implementation. Scheme/Chicken and eventual compilation to C were considered, with continuations and tail-call optimization cited as motivations; neither target is recorded as a final decision.
- **Grammar experiment:** `IDEAS/newlang.ye` describes package/import/export files, modules, declarations, modifiers, type parameters, fields and Java-like class structure. Nearby `IDEAS/java8/` is a Java grammar/specification experiment/reference and should not be read as proof that all Java features were intended for the language.
- **Implementation languages:** observed parser prototypes are C++ (`oppp/`, `parser/NLparser/`); scanner/parser experiments use ICU for Unicode. Perl scripts process grammars/Bison output (`oppgen.pl`, `ye2y.pl`, `txt2bnf.pl`). Scheme and C are alternatives in the design note, not verified implementations of the proposed runtime.
- **Algorithms actually visible:** `oppp/` has a small arithmetic evaluator: it tokenizes numbers/operators into polymorphic operator objects, then uses precedence comparisons and stack reduction; it supports `+ - * / ^` and parentheses. The separate `NLparser` scanner normalizes input to NFC, recognizes Unicode XID identifiers and Pattern_Whitespace, skips line/block comments, and inserts synthetic implicit-application and dummy tokens based on neighboring token kinds. Its parser configures precedence/associativity, but `treeGen()` contains placeholder branches; a complete parser is not evidenced. `oppgen.pl` invokes Bison, analyzes LR states with a two-symbol lookback, and emits shift/reduce relations organized by operator-stack prefixes. EBNF-to-BNF-to-LR and an AST-building grammar generator are proposals in `Implementation.txt`, not verified completed tools.

### GenLang (`/bigdata/KAI/projects/GenLang`)

- **Documented features:** a statically typed, C-style language with numeric/character/string/raw-string literals; decimal, binary, octal, hexadecimal and custom-base integers; operators, assignments, function calls, member/array access, functions and declarations; blocks; `if`, `while`, `for`, `do-while`, `switch`; and `break`, `continue`, `return`, `goto`. The spec also proposes Unicode UAX #31 identifiers, NFKC normalization, no reserved keyword tokens, a whitespace-inserted implicit `APPLY` operator, and synthetic `EMPTY` operands. `<-` channel operation is documented. These features are in the language spec; implementation coverage varies.
- **Implementation language:** TypeScript across compiler, generator, lexer, parser, AST, type-checking and interpreter packages.
- **Algorithms:** regex-based generated lexer data; generated shift/reduce operator table; conversion of operator precedence/associativity relations to left/right binding-power numbers; stack-based operator-precedence parsing with separate operator and operand stacks; AST rewrite/rework followed by symbol-table construction, type checking and tree-walking evaluation. These mechanisms are present in source. No claim is made that every documented statement or type has end-to-end working coverage.

### LangLLVM (`/bigdata/KAI/projects/LangLLVM`)

- **Proposed language features:** a separate design note explores explicit binding/definition forms (`:` for constants, `:=` for variables, `::=` for types), templates, function expressions/types, and multi-value input/output signatures. The NewLang architecture note mentions a reflective stack-bytecode interpreter and native modules, but the evidence does not establish that as a LangLLVM implementation.
- **Grammar experiment:** `src/mylang.pegjs` and `pegjs-c++/syntax.pegjs` contain extensive C++-style productions (classes, templates, expressions and declarations). They are grammar/parser experiments, not conclusive evidence that the custom language itself had all C++ features.
- **Implementation languages:** TypeScript, PEG.js, and the `llvm-node` binding are used by the small compiler/IR test. Perl scripts under `pegjs-c++/` transform or inspect PEG grammar. `test_gen.ts` currently demonstrates creating an LLVM module, adding a global integer, printing IR and writing bitcode; it does not demonstrate a complete language compiler.
- **Algorithms:** PEG grammar parsing; Perl grammar-tree transformation; LLVM IR/bitcode generation in the minimal test. No complete source-to-IR pipeline is evidenced.

### OPPrs parser experiments (`/bigdata/KAI/projects/OPPlang/OPPrs`)

- **Language features:** these directories primarily test expression parsing, not a full language. The `miniopp` token set includes Unicode identifiers and a broad operator/bracket inventory; `minipratt` examples cover prefix, infix and postfix operators, grouping, indexing and ternary expressions. `bison-calc/calc/calc.y` is an upstream calculator example, and `ansic/` is an upstream ANSI C grammar, not a custom-language feature list.
- **Implementation languages:** TypeScript (`miniopp`, `minipratt.js`), Rust (`minipratt`), and Perl (`bison-calc` analysis/generation scripts); Bison/Yacc grammars and generated C parser outputs are also present.
- **Algorithms:** `miniopp` uses a table-driven shift/reduce operator-precedence parser with token left/right binding powers and an AST-like tree. Rust `minipratt` uses Pratt/precedence-climbing binding powers with recursive expression parsing; prefix, infix, postfix, indexing and ternary cases are represented. `minipratt.js` explores a stack/frame-based iterative binding-power parser. Bison examples use LR shift/reduce parsing; local Perl utilities inspect Bison output/XML and derive operator relationships.

### Cross-project caution

The strongest direct language-design evidence is in `NewLang/IDEAS/Implementation.txt`, `NewLang/IDEAS/OtherStuff.txt`, `NewLang/IDEAS/Syntax.txt`, and the GenLang language specification. Parser prototypes in `oppp`, `miniopp`, and `minipratt` demonstrate algorithms, but do not by themselves establish that their expression syntax was intended for any other experiment. See KP-002 for the inspected source set and limits.

## Consolidated feature candidate list

This list merges features proposed or tried in the distinct experiments; it is an inventory, not a recommendation or an approved specification. “Source” identifies where the feature appears, not an endorsement. Features found only in language design notes are proposals; grammar descriptions and specs do not guarantee complete working implementations.

Effort is a rough relative estimate for a TypeScript implementation, assuming a small, single-process language with an expression parser and tree-walking interpreter as a starting point. `S` = bounded addition; `M` = several connected compiler/runtime pieces; `L` = broad semantic/runtime/tooling work; `XL` = architectural or cross-cutting work. The estimates are not calendar forecasts and rise if features must interoperate.

| Candidate feature | Evidence/source | Effort if selected | Main implementation work / dependencies |
| --- | --- | --- | --- |
| Source locations, diagnostics and lexer recovery | GenLang spec/implementation notes; NewLang scanner | S-M | Track spans through Unicode normalization and parser errors; foundational for useful tooling. |
| Unicode identifiers, normalization and broad whitespace/newline rules | NewLang `Syntax.txt`/scanner; GenLang spec | M | Define normalization policy and line/column semantics; test Unicode edge cases. Decide NFC vs NFKC first. |
| Comments and string/character escapes, including raw strings and Unicode escapes | NewLang `Syntax.txt`; GenLang spec | S-M | Lexer rules, escape decoding and diagnostics. Nested comments are only a question in notes, not an agreed feature. |
| Integer formats (decimal, binary, octal, hex, arbitrary/custom radix), floats, chars, strings and raw strings | GenLang spec and lexer definitions; NewLang scanner notes | M | Literal grammar, conversion/range/error rules, runtime value model. |
| Basic expressions, precedence/associativity, unary/binary operators and parentheses | C++ `oppp`; GenLang; `miniopp`/Pratt trials | M | Lexer, precedence table, parser and AST; a narrow operator set is lower effort. |
| Assignment and compound assignment; conditional/ternary; comma and statement separators | GenLang; parser experiments | M | L-values, evaluation order, associativity and parser behavior. |
| Postfix/prefix increment/decrement, calls, indexing, member access and pointer/member operators | GenLang spec; Pratt trials | M-L | AST plus evaluation and addressability/mutability rules; pointer semantics increase effort. |
| Implicit application and empty operands; unary operators represented by `EMPTY` | NewLang scanner; GenLang; DEC-008/009/010 | L | Insert `APPLY` between adjacent operands and `EMPTY` between adjacent operators; prefix unary operators use a left `EMPTY`, postfix unary operators a right `EMPTY`. Build a tree by operand priorities, then validate inserted elements semantically. Priority and legality rules remain open. |
| Declarations and bindings using name-first `:`, `:=`, `::=` markers | LangLLVM design note; DEC-011 | M | Implement distinct constant, variable and type binding forms; scope, visibility, initialization/inference, and declaration-versus-definition semantics remain open. |
| Static typing with explicit or inferred types and safety-first compatibility | User decisions DEC-013/014; GenLang; NewLang strongly typed runtime proposal | M-L | Determine types statically; allow operations only when safety can be proven, otherwise reject. Define proof criteria, inference, required annotations, and checking rules. |
| Enums, subranges, sets, fixed-index arrays, structs/unions and aggregate literals | NewLang notes; GenLang C-style type syntax | M-L | Data layout, constructors, indexing, equality/copy rules and type checking. Sets/ranges need clear semantics. |
| Value and reference types; named/indexed field collections | User decisions DEC-015/017; requirement REQ-002; NewLang design notes | L-XL | Reference values behave as if GC-managed; predictable lifetimes may permit behavior-preserving optimization. Define identity/aliasing, collection representation, and optimization criteria. |
| Functions, function types/expressions, local functions/closures and named/dictionary-style arguments | LangLLVM note; NewLang notes; GenLang functions | M-L | Call frames, closures/environments, argument validation and scope; named args plus overloads increase complexity. Multiple parameters are logically one temporary collection (DEC-016). |
| Multiple return values | NewLang and LangLLVM design notes; DEC-016 | M-L | Parameters and returns are logically single temporary collections; specify their type, construction, unpacking, and interaction with calls and assignments. |
| Classes, methods, constructors, inheritance, interfaces and visibility modifiers | NewLang grammar/design; C++-style LangLLVM grammar | L | Object model, dispatch, initialization, access checking and type relations. Grammar presence alone does not establish language intent. |
| Mixins, metaclasses/class objects and parameterized types/templates | NewLang notes/grammar; LangLLVM template syntax | L-XL | Composition/dispatch model, type identity, instantiation strategy and diagnostics; compile-time templates can grow to XL. |
| Function/operator overloading and explicit conversions (notes reject implicit casts) | NewLang notes; GenLang operator set | L | Candidate selection, type-directed resolution, ambiguity rules and conversion ranking. |
| C-style statements and control flow: blocks, `if/else`, loops, `switch`, `break`, `continue`, `return`, `goto` | GenLang spec and examples | M-L | Parser and interpreter/compiler control-flow semantics; `goto` requires labels and control-flow validation. |
| Modules, packages, namespaces, imports/exports and package configuration | NewLang grammar/design | L | Name resolution, file layout, dependency graph, visibility and separate compilation. |
| Channel send/receive operator `<-` | GenLang spec | L-XL | Syntax is small; meaningful channel semantics require concurrency, scheduling, blocking and errors. |
| Coroutines with arguments/results passed on control transfer | NewLang notes | XL | Suspended execution state, resumption protocol, stack/frame representation and interaction with exceptions/GC. |
| Proper tail calls and continuations / `call/cc` | NewLang implementation rationale | XL | Requires compatible calling convention and explicit control/runtime representation; conflicts with relying on ordinary host/C++ stack calls. |
| Reflection metadata and native-code module interoperability | NewLang bytecode/runtime notes | XL | Metadata format, stable type/member identity, ABI, loading, safety and versioning. |
| Bytecode VM / stack machine and native or LLVM/C/C++ code-generation backends | NewLang architecture; LangLLVM LLVM experiment | XL | This is an implementation architecture, not a surface-language feature. Pick an execution model before promising reflection, interop or continuations. |
| Parser/grammar generator and AST construction from EBNF/BNF | NewLang notes and Perl/Bison tools | L | Grammar representation, ambiguity/error handling and generated AST/API; separable from the language feature set. |

### Declaration concepts found in the experiments

These are separate experiment designs, not one unified or selected declaration system. The first two provide concrete syntax; NewLang's inspected notes primarily describe binding and compilation-unit concepts.

| Experiment | Concept | Evidence and limits |
| --- | --- | --- |
| GenLang | C-style, type-first declarations. A variable declaration is `type declarator (',' declarator)* ';'`; each declarator is a name with an optional `= expression` initializer. Functions put the return type before the name and use typed named parameters. A trailing `;` gives a prototype, while a body gives a definition. | Documented grammar and examples in `GenLang/docs/language.md`, “C-Style Declarations.” The keyword list includes `const`, storage-class words, `struct`, `union`, `enum`, and `typedef`, but the inspected declaration grammar does not fully specify their declaration forms. |
| LangLLVM | **Selected by DEC-011.** Name-first definitions distinguished by marker: `NAME : ...` for constants, `NAME := ...` for variables, and `NAME ::= ...` for types. The marker is followed by a `TYPE` or initializer expression; the note defines `TYPE` as `SOMETYPE` optionally followed by an initializer, and sketches `=` as the initializer marker. Square brackets carry template parameters/arguments. Function expressions use `{ BODY }`; function types use `(INPARAMS) -> (OUTPARAMS)`. | Proposal in `LangLLVM/src/Design: Declarations, Definitions.md`, now adopted as the next language's binding model. Exact typing/inference and scope semantics are not specified. The note questions whether declaration and definition need separate concepts; that remains open (Q-010). |
| NewLang | Compilation-unit and namespace context: `package <localpkgname>{.namespace};`, followed by struct definitions. Modules are proposed as classes and packages as collections of modules with exported interfaces. Separately, notes describe flat/reference type constructors, constants and functions with argument/result lists, and raise the possibility of local functions as function objects. | Concepts in `NewLang/IDEAS/OtherStuff.txt`; not a complete declaration grammar. No concrete variable/function binding markers or full declaration productions were found in the inspected notes. Do not treat the separate ANSI C grammar in the NewLang tree as NewLang syntax; it is reference material. |

**Current status:** DEC-011 selects LangLLVM's name-first binding markers, square-bracket template syntax, function expression, and function type forms over GenLang's type-first syntax. Scope, visibility, precise initialization/inference rules, and the relation between declarations and definitions remain open.

### Obvious conflicts and decisions to resolve

| Conflict | Why the options interact | Decision needed before implementation |
| --- | --- | --- |
| NFC vs NFKC identifier normalization | NewLang scanner normalizes to NFC; GenLang specification calls for NFKC. UAX #31 Unicode 18 says NFC is generally appropriate for case-sensitive identifiers, while NFKC is generally more appropriate for case-insensitive identifiers. | Resolved: case-sensitive identifiers use NFC for equality and preserve source spelling (DEC-006; [Language Design](../Language-Design.md#identifier-normalization)). |
| C-style calls vs implicit application / `EMPTY` operands | The design uses an implicit `APPLY` between adjacent operands, `EMPTY` between adjacent operators, and `EMPTY` to represent unary prefix/postfix operators; whitespace separates tokens rather than expressing application. | Resolved at the token-stream/parsing model level: use implicit insertions and semantic validation (DEC-008/009/010; [Language Design](../Language-Design.md#expression-token-stream-and-implicit-insertions)). Operator priorities and semantic legality rules remain open (Q-007/008). |
| C-style type-first declarations vs `:`, `:=`, `::=` binding markers | GenLang leads with a type and optionally initializes a named declarator; LangLLVM leads with a name and uses different markers for constants, variables, and types. NewLang's notes focus on package/type scope without a full declaration grammar. | Syntax choice resolved in favor of LangLLVM (DEC-011). Define scope, visibility, initialization/inference semantics (Q-009), and declaration-versus-definition behavior (Q-010). |
| Generic type arguments in `<...>` vs comparisons/shifts, versus `[...]` | Angle brackets overlap with `<`, `>`, `>>`, and nested generic parsing. LangLLVM uses bracketed template parameters. | Resolved in favor of square brackets for template parameters and arguments (DEC-011); no angle-bracket template syntax. |
| Reserved keywords vs predefined identifiers | The user chose no keyword category: keyword-like constructs are predefined identifiers whose special semantic effect applies until redefinition. | Resolved in favor of predefined identifiers (DEC-012); exact name-resolution and redefinition scope rules remain open (Q-009). |
| Static typing, inference, and compatibility | Static typing and explicit-or-inferred types are selected (DEC-013). Compatibility must follow the safety-first rule: allow when safety can be proven, otherwise reject (DEC-014). Exact safety properties, proof criteria, inference, and checking rules are not yet defined. | Specify the safety property/proof standard, inference, required annotations, and when type checking occurs (Q-009). No unsafe escape hatch or runtime fallback is assumed. |
| Value versus reference semantics and field collections | The user selected a distinction between value and reference types, with a reference containing an implicit pointer-like value identifying a variable; collections of named or indexed fields are also required (DEC-015, REQ-002). Multiple parameters and returns logically form single temporary collections (DEC-016). Reference values behave as if GC-managed; implementations may optimize where lifetime is predictable (DEC-017). | Define identity/aliasing, whether named/indexed collections are value types, reference types, or both, and how temporary parameter/result collections are typed and accessed (Q-011). Also specify behavior-preserving lifetime optimizations and their proof criteria. |
| Single-result vs multiple-result functions and coroutine transfers | Both shape function types, call conventions, assignment syntax and native interfaces. | Decide whether all callables can return tuples/multiple values and how suspension values differ. |
| Overloads vs named/dictionary arguments and conversions | Several candidates may match by name, exact type, conversion or partial argument keys. NewLang notes leave resolution rules partly open. | Define deterministic resolution, ambiguity errors and conversion ranking before combining them. |
| OO inheritance vs mixins/metaclasses/parameterized types | These are separate composition and dispatch models with interacting type identity and initialization rules. | Start with one object model; add the others only with explicit semantics. |
| Ordinary host/native stack vs proper tail calls and continuations | C++/native calling conventions and host stacks do not directly provide the proposed control semantics. | Choose interpreter/frame representation and backend constraints early if call/cc or guaranteed tail calls matter. |
| Parser algorithm and language grammar | LR/Bison, operator-precedence and Pratt experiments are alternative implementation techniques; none requires adopting the associated sample grammar. | Select algorithm based on intended grammar; do not treat parser prototypes as user-visible features. |

### Unicode identifier normalization: standards research

- **Belegt:** The current approved [UAX #31, Unicode 18.0.0, Revision 45](https://www.unicode.org/reports/tr31/tr31-45.html) says in §5 that NFC is generally appropriate for case-sensitive identifiers and NFKC is generally more appropriate for case-insensitive identifiers. This is guidance, not a universal mandate. UAX #31 recommends `XID_Start` / `XID_Continue` for most identifier uses.
- **Belegt:** UAX #31 separates two policies: equivalent normalized identifiers (R4), where identifiers with the same specified normalization form compare as equivalent, and filtered normalized identifiers (R6), where permitted identifiers must already be in that form. For NFKC, implementations must also apply the modifications in §5.1. Case-insensitive matching is a separate case-folding policy, not simply a choice of NFC versus NFKC.
- **Belegt:** [UAX #15, Unicode 18.0.0](https://www.unicode.org/reports/tr15/tr15-58.html) defines the normalization forms. NFKC additionally folds compatibility distinctions; this can be undesirable where those distinctions carry meaning, including mathematical alphanumeric symbols.
- **Open:** The [UAX #31 proposed-update page](https://www.unicode.org/reports/tr31/proposed.html) reported no proposed update when checked. A Unicode 19.0 / next-version draft was not available among the sources checked, so no claim is made about future guidance. Recheck when a draft is published.
- **Beschlossen (DEC-006):** Identifiers are case-sensitive; use NFC-normalized keys for equality and retain original source spelling for diagnostics/display. The selected equality policy does not require the source spelling itself to be pre-normalized. This aligns with UAX #31's general guidance and NewLang's scanner, while avoiding NFKC's broader compatibility folding.
- **Beschlossen (DEC-007):** Use NewLang's proposed UAX #31 R1 syntax: `XID_Start XID_Continue*`. No additional start characters are included, so `_` may continue an identifier but may not start one. The Unicode property data version remains open (Q-006).

### Effort interpretation

The cheapest useful starting slice is source positions/diagnostics, literals, identifiers, arithmetic and comparison expressions, declarations, simple static types, blocks and a small set of control-flow statements, using a TypeScript lexer/parser and tree-walking interpreter. The most expensive features are not just “more syntax”: GC/value semantics, generics, overload resolution, modules, reflection/native ABI, coroutines, continuations and guaranteed tail calls affect architecture across the compiler and runtime. These are engineering estimates, not chosen priorities.

## Decisions and open questions

| ID | Item | Status | Source |
| --- | --- | --- | --- |
| DEC-001 | Keep this pass as classification only; do not move or delete files based on it. | Proposed working boundary; no file changes made. | KP-001 |
| DEC-002 | Separate proposed language features from implementation evidence and from borrowed grammar/parser examples in the experiment summary. | Applied in this evidence-based summary; not a user-approved language design. | KP-002 |
| DEC-003 | Treat NewLang, GenLang, LangLLVM, and OPPrs as distinct experiments with overlapping goals. | User-stated and accepted as the framing for synthesis. | KP-003 |
| DEC-004 | Use TypeScript for the next implementation attempt. | User-stated preference (“it seems”); tentative, not yet a finalized implementation commitment. | KP-003 |
| DEC-005 | Use Unicode 18 UAX #31 as the current standards reference for identifier-normalization discussion; treat next-version guidance as unavailable until a draft is published. | Research basis, not a language-design decision. | KP-004 |
| DEC-006 | Make identifiers case-sensitive; normalize to NFC for equality and preserve source spelling. | User-approved design choice; source spellings need not already be NFC. | KP-005 |
| DEC-007 | Use XID_Start followed by zero or more XID_Continue code points for identifier syntax, with no extra start characters. | User-approved by reference to NewLang's proposed syntax; underscore is not allowed at the start. | KP-006 |
| DEC-008 | Treat source after comment stripping as an operand/operator sequence; whitespace separates tokens; insert implicit APPLY between adjacent operands and EMPTY between adjacent operators. | User-approved design rule; inserted symbols have no explicit syntax. | KP-007 |
| DEC-009 | Parse the transformed sequence by operand-priority rules, then check inserted APPLY/EMPTY legality in semantic analysis rather than parsing. | User-approved phase boundary. | KP-007 |
| DEC-010 | Represent unary prefix and postfix operators using an implicit EMPTY operand on the missing side. | User-approved design rule; prefix uses left EMPTY, postfix uses right EMPTY. | KP-008 |
| DEC-011 | Adopt LangLLVM's name-first binding model: `:` constant, `:=` variable, `::=` type; square-bracket template parameters/arguments; function expressions `{ BODY }` and function types `(INPARAMS) -> (OUTPARAMS)`. | User-approved selection of the LangLLVM model; semantic details remain open. | KP-010, KP-011 |
| DEC-012 | Do not define keywords as a separate language category; model keyword-like constructs as predefined identifiers whose special semantics cease when redefined. | User-approved; exact redefinition and name-resolution scope remains open. | KP-011 |
| DEC-013 | Use static typing; types may be explicit or inferred. | User-approved; inference and checking rules remain open. | KP-012 |
| DEC-014 | For type compatibility, allow an operation only when safety can be proven; otherwise reject it. | User-approved principle; exact safety properties and proof criteria remain open. | KP-013 |
| DEC-015 | Distinguish value and reference types; a reference type consists of an implicit pointer-like value identifying a variable, and variables may hold either category. | User-stated model; identity, aliasing, lifetime, and memory-management semantics remain open. | KP-014 |
| REQ-002 | Support collections of fields identified by names or indices. | User-stated requirement; concrete collection forms and their value/reference behavior remain open. | KP-014 |
| DEC-016 | Model multiple parameters and multiple return values logically as one temporary collection each. | User-approved semantic model; concrete collection/type/syntax and observability remain open. | KP-015 |
| DEC-017 | Reference values behave as if garbage-collected; implementations may optimize cases with sufficiently predictable lifetimes. | User-approved lifetime model; optimization must preserve the GC-model behavior. Specific techniques and proof criteria remain open. | KP-016 |
| Q-001 | Establish provenance of the uncertain NewLang root files, archives, backups, and `GenLang/ARCHIVE.zip`. | Open; contents/origins not fully inspected. | KP-001 |
| Q-002 | Decide whether the next deliverable should be a complete file-by-file manifest or a proposed cleanup/move plan. | Open; not requested yet. | KP-001 |
| Q-003 | Determine which feature candidates belong in the next attempt, and define the minimum initial slice. | Open; this turn provides inventory/conflicts/effort only. | KP-003 |
| Q-004 | Choose NFC or NFKC identifier policy, and decide whether normalized form is applied for identifier equivalence or required in source spelling. | Resolved by DEC-006; retained here as the history of the question. | KP-004, KP-005 |
| Q-005 | Choose identifier start/continue properties and any extra start characters or exclusions. | Resolved by DEC-007: use UAX #31 R1 (`XID_Start XID_Continue*`), with no extra start characters. | KP-004, KP-005, KP-006 |
| Q-006 | Choose the Unicode data version that defines `XID_Start` and `XID_Continue`. | Open; use one consistent version once selected. | KP-006 |
| Q-007 | Specify operand-priority rules, including implicit `APPLY`, used to build the expression tree. | Open; the user selected priority-based tree construction but has not specified the priority rules. | KP-007 |
| Q-008 | Specify semantic-context legality rules for inserted `APPLY` operators and `EMPTY` operands. | Open; validation belongs to semantic analysis, not parsing. | KP-007 |
| Q-009 | Define scope, visibility, initialization, type inference/annotation and checking, safety properties/proof criteria for type compatibility, and lookup/redefinition semantics for the selected LangLLVM binding forms and predefined identifiers. | Partially resolved by DEC-011/012/013/014: binding syntax, no-keyword model, static typing with optional inference, and safety-first compatibility chosen; detailed rules remain open. | KP-009, KP-010, KP-011, KP-012, KP-013 |
| Q-010 | Decide whether declarations without bodies/prototypes are distinct from definitions with bodies, or whether binding forms alone suffice. | Open; LangLLVM's design note raises but does not resolve this question. | KP-009, KP-010 |
| Q-011 | Specify reference identity/aliasing and field/temporary collection types and operations; define proof criteria and behavior-preserving optimizations for predictable reference lifetimes. | Partially resolved by DEC-015/016/017: reference values have GC-like behavior and predictable lifetimes may be optimized; detailed identity, collection, and optimization semantics remain open. | KP-014, KP-015, KP-016 |

## Work status and verification

- Identified: the four `langlist` roots, dominant experiment roots, clear upstream/reference trees, and generated/dependency groupings.
- Evidence checked: root directory entries; project manifests/READMEs; NewLang grammar headers and Makefiles; selected source files; `GenLang` language specification; `LangLLVM` package and grammar; `OPPrs` package metadata and parser/sample grammars.
- Experiment-feature evidence: selected NewLang architecture, syntax and grammar files; GenLang specification and parser/generator/interpreter sources; LangLLVM grammar/design/test sources; miniopp, Rust Pratt, TypeScript Pratt and Bison utility sources.
- Consolidation: candidate feature matrix, conflict analysis, and relative TypeScript effort estimates recorded in this section; no feature selection or implementation has been approved.
- Not verified: complete file-by-file provenance, all nested archive contents, all source histories, or licenses beyond inspected headers/metadata.
- Implementation claims are limited to mechanisms directly visible in the selected code; no builds or tests were run for this research task.
- Source trees remain unchanged.

## Next steps

1. Specify operand priorities and semantic legality for implicit insertions, including unary operators (Q-007/008); resolve remaining declaration/type semantics (Q-009/010/011); choose a Unicode property data version (Q-006); then continue toward a coherent feature subset and minimum initial slice (Q-003) for the next TypeScript attempt.
2. Resolve Q-001 only if exact ownership or cleanup is needed; do not treat this inventory as authorization to relocate files.

## Handover

Read [Language Design](../Language-Design.md) for approved design choices, this Wissensstand for current evidence and open questions, and the relevant entries in [Kontextprotokoll](./Kontextprotokoll.md) for rationale and provenance. The feature inventory is not a complete language specification; continue resolving open questions before implementation. The four source roots are named in `../langlist` (relative to this document; absolute paths are recorded above). Treat the file classifications as preliminary and check uncertain items before cleanup.

> Start prompt: Work in `/bigdata/KAI/projects/NewLanguageProject`. Read `Language-Design.md`, `Kontext/Wissensstand.md`, and its relevant entries in `Kontext/Kontextprotokoll.md`. Treat NewLang, GenLang, LangLLVM, and OPPrs as distinct experiments with overlapping goals. Use the candidate inventory to select a feature subset and MVP for the tentative TypeScript attempt; check Q-001 before any cleanup.
