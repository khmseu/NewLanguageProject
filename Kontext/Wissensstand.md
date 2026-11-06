# Current Knowledge

## Maintenance and coverage

- Project/workspace: `/bigdata/KAI/projects/NewLanguageProject`
- Last substantive update: 2026-11-06 (timezone +01:00); delimiter roles, sequencing/list behavior, and the current treatment of `a * -b` were recorded. Earlier experiment sources were not re-examined.
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

### Object models found in the experiments

These are historical source findings, not evidence that the models were implemented end to end. The user subsequently selected the NewLang language-level model for the next language (DEC-019); the other rows remain useful comparisons.

| Experiment | Object/type model evidenced | Status and caveats |
| --- | --- | --- |
| NewLang | **Selected for the next language by DEC-019.** Modules are classes; packages collect modules and expose interfaces. Classes may have a superclass, implement interfaces, and contain fields and methods. The type model distinguishes flat/value types from reference classes: flat values retain their exact declared type and are destroyed on leaving scope; reference variables may hold subtypes and references are collected after becoming unreachable. Class/metaclass objects, one class object per parameterization, lazy class-object instantiation, and non-`Object` mixins that cannot be independently instantiated are included in the proposal. | Language-level model adopted, excluding bytecode/interpreter/compiler-backend/native-interop architecture. The notes leave “class vars” semantics open and only raise local functions as possible function objects. The separate Java 8 grammar/reference tree does not add all Java semantics to the selected model. |
| GenLang | The inspected language spec is C-like and procedural: functions, arrays/pointers in examples, and aggregate type names such as `struct`, `union`, and `enum`. | No class/object-oriented inheritance, method dispatch, or interface model is specified in the reviewed language spec. This is a limit of reviewed evidence, not proof that no such idea exists elsewhere in the tree. |
| LangLLVM | The adopted declaration note specifies binding forms, templates, and function expressions/types, but no object model. Its PEG grammar includes C++ class, base-clause, and virtual-member productions. | Treat those C++ productions as grammar/parser material, not proof that the custom language adopted C++ objects or inheritance. |
| OPPrs | Expression-parser experiments represent syntax/tree nodes and operator objects internally. | No source-backed language-level object model was found; these projects focus on parsing rather than specifying a whole language. |

NewLang also sketches an object-oriented native-interoperation bridge: non-final exported classes would have derived wrappers translating virtual calls into interpreter calls, while exported classes would expose a virtual route from interpreter calls to native methods. Native compilation targets would implement an interface or abstract class that can provide C/assembly entry points. This is an implementation proposal, distinct from the language's class/type semantics; it is not shown to be complete.

Sources: `NewLang/IDEAS/OtherStuff.txt`, `NewLang/IDEAS/newlang.ye`, and `NewLang/IDEAS/Implementation.txt`; `GenLang/docs/language.md`; `LangLLVM/src/Design: Declarations, Definitions.md` and `LangLLVM/src/mylang.pegjs`; the OPPrs parser-focused source inventory summarized in KP-002. See KP-018 for provenance and scope.

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
| Classes, methods, constructors, inheritance, interfaces and visibility modifiers | NewLang object model selected by DEC-019; C++ grammar in LangLLVM is parser material only | L | Implement the selected class/type hierarchy, dispatch, initialization, access checks and type relations; the design notes do not settle every detail. |
| Mixins, metaclasses/class objects and parameterized types/templates | NewLang object model selected by DEC-019 | L-XL | Implement the selected composition/type identity and lazy class-object instantiation; details and diagnostics remain open. |
| Function/operator overloading and explicit conversions (notes reject implicit casts) | NewLang notes; GenLang operator set | L | Candidate selection, type-directed resolution, ambiguity rules and conversion ranking. |
| C-style statements and control flow: blocks, `if/else`, loops, `switch`, `break`, `continue`, `return`, `goto` | GenLang spec and examples | M-L | Parser and interpreter/compiler control-flow semantics; `goto` requires labels and control-flow validation. |
| Modules, packages, namespaces, imports/exports and package configuration | NewLang grammar/design | L | Name resolution, file layout, dependency graph, visibility and separate compilation. |
| Channel send/receive operator `<-` | GenLang spec | L-XL | Syntax is small; meaningful channel semantics require concurrency, scheduling, blocking and errors. |
| Coroutines with arguments/results passed on control transfer | NewLang notes | XL | Suspended execution state, resumption protocol, stack/frame representation and interaction with exceptions/GC. |
| Proper tail calls and continuations | User decision DEC-020; also discussed in NewLang implementation rationale | XL | Proper tail calls are required as a semantic guarantee. Choose continuation operations and a control/runtime representation that preserves captured state and DEC-017's GC-like reference behavior; bytecode is not mandated. |
| Reflection metadata and native-code module interoperability | NewLang bytecode/runtime notes | XL | Metadata format, stable type/member identity, ABI, loading, safety and versioning. |
| Bytecode VM / stack machine and native or LLVM/C/C++ code-generation backends | NewLang architecture; LangLLVM LLVM experiment | XL | This is an implementation architecture, not a surface-language feature. DEC-019 excludes NewLang's bytecode architecture; DEC-020 nevertheless requires an execution model capable of proper tail calls and continuations. Reflection and native interop remain unselected. |
| Parser/grammar generator and AST construction from EBNF/BNF | NewLang notes and Perl/Bison tools | L | Grammar representation, ambiguity/error handling and generated AST/API; separable from the language feature set. |

### Declaration concepts found in the experiments

These are separate experiment designs, not one unified or selected declaration system. The first two provide concrete syntax; NewLang's inspected notes primarily describe binding and compilation-unit concepts.

| Experiment | Concept | Evidence and limits |
| --- | --- | --- |
| GenLang | C-style, type-first declarations. A variable declaration is `type declarator (',' declarator)* ';'`; each declarator is a name with an optional `= expression` initializer. Functions put the return type before the name and use typed named parameters. A trailing `;` gives a prototype, while a body gives a definition. | Documented grammar and examples in `GenLang/docs/language.md`, “C-Style Declarations.” The keyword list includes `const`, storage-class words, `struct`, `union`, `enum`, and `typedef`, but the inspected declaration grammar does not fully specify their declaration forms. |
| LangLLVM | **Selected by DEC-011.** Name-first definitions distinguished by marker: `NAME : ...` for constants, `NAME := ...` for variables, and `NAME ::= ...` for types. The marker is followed by a `TYPE` or initializer expression; the note defines `TYPE` as `SOMETYPE` optionally followed by an initializer, and sketches `=` as the initializer marker. Square brackets carry template parameters/arguments. Function expressions use `{ BODY }`; function types use `(INPARAMS) -> (OUTPARAMS)`. | Proposal in `LangLLVM/src/Design: Declarations, Definitions.md`, now adopted as the next language's binding model. Exact typing/inference and scope semantics are not specified. The note questions whether declaration and definition need separate concepts; that remains open (Q-010). |
| NewLang | Compilation-unit and namespace context: `package <localpkgname>{.namespace};`, followed by struct definitions. Modules are proposed as classes and packages as collections of modules with exported interfaces. Separately, notes describe flat/reference type constructors, constants and functions with argument/result lists, and raise the possibility of local functions as function objects. | Concepts in `NewLang/IDEAS/OtherStuff.txt`; not a complete declaration grammar. No concrete variable/function binding markers or full declaration productions were found in the inspected notes. Do not treat the separate ANSI C grammar in the NewLang tree as NewLang syntax; it is reference material. |

**Current status:** DEC-011 selects LangLLVM's name-first binding markers, square-bracket template syntax, function expression, and function type forms over GenLang's type-first syntax. Scope, visibility, precise initialization/inference rules, and the relation between declarations and definitions remain open.

### Combined operator inventory from the experiments

This is an evidence inventory, not by itself the next language's operator specification. Priority numbers are only comparable within the individual source table. `higher`/`lower` below describes binding strength, not the magnitude of the source's number. Associativity labels are reproduced from source; `n/a` means the operator's grammar role does not form an ordinary infix chain. DEC-021 and DEC-022 record the user's selected operator meanings and adopted relative order; historical cross-experiment differences are summarized after the tables.

#### GenLang language specification and generated definitions

The specification says higher numeric priority binds more tightly. The generated definitions table supplies the `@` row at priority 190, while the prose specification lists it with the priority-170 group; this is called out below.

| Priority | Operators | Associativity in source | Semantic notes stated by source |
|---:|---|---|---|
| 190 generated / 170 prose | `@` | none | Name-declaration operator. Priority discrepancy: `combined-definitions.json` says 190; `docs/language.md` groups it at 170. The next-language value is selected as 190 (DEC-021). |
| 180 | `APPLY` (implicit whitespace), `(` `)` `{` `}` `[` `]` | left for APPLY; delimiters are open/close in generated data (prose calls them left) | APPLY represents function application; brackets/grouping. The next design inserts APPLY between adjacent operands (DEC-008) and adopts its GenLang ordering above dot (DEC-022). |
| 170 | `.`; `->` | left; none | Dot is described as member access in examples and is selected as left-associative (DEC-021). `->` is labeled “function definition” in the priority table but used for pointer-member access in the expression grammar/examples; the next-language meaning is selected as function definition (DEC-021). |
| 160 | `++` `--` `!` `~` | none | Increment/decrement; logical NOT; bitwise NOT. Prefix and postfix increment/decrement forms appear in the grammar. |
| 150 | `*` `/` `%` | left | Multiplication, division, modulo. |
| 140 | `+` `-` | left | Addition and subtraction; unary minus is also in the grammar. |
| 130 | `<<` `>>` | left | Left and right shift. |
| 120 / 110 / 100 | `&` / `^` / `|` | left | Bitwise AND / XOR / OR. `^` as XOR is selected (DEC-021). `&` and `*` also occur as unary operators; the grammar does not fully specify unary `*` semantics, while `&x` appears in a pointer example. |
| 90 / 80 | `<` `<=` `>` `>=` / `==` `!=` | left | Relational comparisons / equality and inequality. |
| 70 / 60 | `&&` / `||` | left | Logical AND / OR. |
| 50 source / 45 selected | `<-` / `?` | none for `<-`; right for `?` | `<-` is described as a Go-like channel operation; `?` begins a ternary conditional. The next-language priority for `?` is selected as 45 (DEC-021), below `<-` at 50 and above `:` at 40. |
| 40 | `:` | right | Ternary separator in the grammar; the source also lists it as a colon operator. |
| 30 | `=` `+=` `-=` `*=` `/=` `%=` `&=` `|=` `^=` `<<=` `>>=`; `::` `::=` | right for assignments; none for `::` and `::=` in generated data, although prose groups all as right | Assignments/compound assignments and explicit/implicit definition. This differs from selected declaration meanings `:` constant, `:=` variable, `::=` type (DEC-011). |
| 20 / 10 | `,` / `;` | left | Comma separator / statement terminator. |

#### NewLang parser precedence prototype

`Parser.cc` declares the following values. The parser compares incoming and stacked priorities so that a *smaller* number is treated as tighter binding. However, `treeGen()` is visibly incomplete (placeholder branches), so this is prototype evidence rather than a verified complete parse table.

| Priority (smaller = tighter, as implied by parser) | Operators | Declared associativity | Semantic notes / limits |
|---:|---|---|---|
| 100,000,000 | `::` | left | No operator meaning specified in this table. |
| 200,000,000 | implicit `APPLY`, `.`, `->` | left | Application is synthesized; member meaning for `.`/`->` is not given here. APPLY ties with member access. |
| 300,000,000 | `++` `--` `!` `~` `sizeof` `new` `delete` | right | Looks like unary/postfix/operator keywords; exact forms and semantics are not defined here. Unary `+` `-` `*` `&` and alternate `++`/`--` definitions are commented out. |
| 400,000,000 | `.*` `->*` | left | C++-style pointer-to-member spellings in a parser experiment. |
| 500,000,000 / 600,000,000 | `*` `/` `%` / `+` `-` | left | Arithmetic operator grouping; no evaluator semantics specified in this table. |
| 700,000,000 | `<<` `>>` | left | Shift operators. |
| 800,000,000 / 900,000,000 | `<` `<=` `>` `>=` / `==` `!=` | left | Relational / equality groups. |
| 1,000,000,000 / 1,100,000,000 / 1,200,000,000 | `&` / `^` / `|` | left | Bitwise groups; here `^` is assigned a bitwise-style tier, not the separate arithmetic sample's `PWR`. |
| 1,300,000,000 / 1,400,000,000 | `&&` / `||` | left | Logical groups. |
| 1,500,000,000 | `?` `:` `=` and compound assignments | right | Conditional/assignment group. |
| 1,600,000,000 | `throw` | right | Throw-like operator keyword. |
| 1,700,000,000 / 1,800,000,000 | `,` / `;` | left | Comma / statement separator. |

A separate NewLang Bison arithmetic grammar (`prec.y`) declares `+`/`-` left, then `*`/`/` left, then unary `NEG`, and finally right-associative `PWR`; later Bison declarations have higher precedence. `PWR`'s spelling is not shown and the grammar has no semantic actions. This is a small arithmetic parser sample, not the same table as `Parser.cc`.

#### User-selected operator decisions and adopted relative order

DEC-021 records the initial selections: `@` 190, left-associative `.`, `->` as function definition, `^` as XOR, and `?` 45; `**` is exponentiation. DEC-022 now adopts GenLang's relative ordering for the remaining conflicts and sets `**` one distinct level tighter than `*`, right-associative. The source-only `@` discrepancy (GenLang prose 170 vs generated data 190) is resolved for the next language by selecting 190, though the historical discrepancy remains. The complete normative, non-numeric order is in [Language Design](../Language-Design.md#expression-token-stream-and-implicit-insertions).

The historical differences between GenLang and NewLang remain evidence about the experiments, but DEC-022 resolves their relative ordering for the next language:

| Operator relationship | GenLang-scale selected/referenced order | NewLang parser prototype order | Assessment |
|---|---|---|---|
| `APPLY` vs `.` | APPLY stronger than dot (180 > 170) | APPLY and dot tie (both 200, smaller is stronger) | Resolved for the next language: APPLY is tighter, following GenLang. |
| Bitwise `&`, `^`, `|` vs relational/equality operators | All bitwise tiers are stronger than relational/equality (120–100 > 90–80) | Relational/equality are stronger than bitwise tiers (800–900 < 1000–1200) | Resolved for the next language: bitwise operators are tighter, following GenLang. |
| `?` vs assignment | `?` stronger than assignment (45 > 30) | `?` and assignment tie (both 1500) | Resolved for the next language: `?` is tighter, following GenLang. |
| `?` vs `:` | `?` stronger than `:` (45 > 40) | `?` and `:` tie (both 1500) | Resolved for the next language: `?` is tighter, following GenLang. |
| `::` vs assignment | GenLang generated table puts `::` at assignment priority 30 | NewLang puts `::` at 100,000,000, its tightest declared level | Historical conflict; current design places `::` with `:` by explicit user decision DEC-023, despite its GenLang assignment-level position. Its meaning/use remains unspecified. |

Other tested common-tier relationships broadly agree after reversing NewLang's numeric direction, including multiplicative > additive > shifts, relational > equality, and bitwise OR/logical AND/logical OR ordering. DEC-022 adopts GenLang's order for the next language except for explicit user-selected placements, including `::` and declaration markers.

Associativity/role differences remain distinct from priority conflicts: OPPrs uses postfix `!` more tightly than `.`, unlike the adopted GenLang order of dot above the unary tier; OPPrs supplies no semantics for postfix `!`, while GenLang describes logical NOT. GenLang marks `->` non-associative whereas NewLang marks it left-associative; the new language selects non-associative `->` (DEC-037). The new language explicitly makes `**` right-associative and one level tighter than `*`; this is a design choice, not an inference from NewLang's Bison `PWR` token (whose spelling is unknown).

#### OPPrs Pratt / iterative binding-power experiments

These are parser-algorithm examples, not a language-wide operator specification. Binding powers are pairs `(left, right)`; the pair encodes associativity for infix operators (e.g. `(5,6)` parses left-associatively, `(2,1)` right-associatively). These values are not comparable to the integer priority scales above.

| Form | Operators | Binding power(s) | Effective association / observed meaning |
|---|---|---|---|
| Prefix | `+` `-` | right BP 9 (Rust Pratt); TypeScript frame parser uses `(99,9)` | Prefix nesting; numeric value is parser-specific. |
| Postfix | `!` `[` | left BP 11 | Postfix `!` and indexing are syntactic examples; `!` is not assigned factorial semantics. |
| Infix | `=` | `(2,1)` | Right-associative assignment-shaped example. |
| Infix | `? :` | `?` `(4,3)`, with `:` consumed by ternary parser | Right-associative conditional (`a ? b : c ? d : e` nests on the right). |
| Infix | `+` `-` | `(5,6)` | Left-associative. |
| Infix | `*` `/` | `(7,8)` | Left-associative. |
| Infix | `.` | `(14,13)` | Right-associative in parser tests (`f . g . h` => `f . (g . h)`). This differs from GenLang and NewLang's declared left association. |
| Grouping | `(` `)` | parser-specific special case | Parentheses group; no ordinary associativity. |

The TypeScript `minipratt.js` and Rust `minipratt` examples do not have identical operator sets: Rust includes ternary and indexing in this implementation, while the inspected TypeScript version demonstrates assignment, arithmetic, dot, postfix `!`, and grouping. `miniopp` has a generated shift/reduce relation table and Unicode operator-token families, but no single human-readable numeric priority/associativity listing in the inspected artifacts.

#### LangLLVM grammar material

`LangLLVM/src/mylang.pegjs` includes a broad C++-style operator grammar: postfix calls/index/member access and increment/decrement; prefix `++ -- * & + - ! ~ sizeof alignof new delete`; pointer-to-member `.* ->*`; arithmetic, shifts, comparisons, bitwise/logical operators, `? :`, throw, assignments, and comma. Its layered grammar provides relative parse precedence and repetition/recursion patterns, but the inspected file is parser grammar material and does not provide a distinct custom-language numeric-priority/associativity table or semantic specification. Do not merge these productions as approved operators for the new language.

### Obvious conflicts and decisions to resolve

| Conflict | Why the options interact | Decision needed before implementation |
| --- | --- | --- |
| NFC vs NFKC identifier normalization | NewLang scanner normalizes to NFC; GenLang specification calls for NFKC. UAX #31 Unicode 18 generally recommends NFC for case-sensitive identifiers; the user's later choice intentionally selects NFKC internal names. | Resolved by DEC-024: case-sensitive XID identifiers use NFKC internal names and retain an NFC form for user interaction; this supersedes DEC-006's NFC equality key. |
| C-style calls vs implicit application / `EMPTY` operands | The design uses an implicit `APPLY` between adjacent operands, `EMPTY` between adjacent operators, and `EMPTY` to represent unary prefix/postfix operators; whitespace separates tokens rather than expressing application. | Resolved at the token-stream/parsing model level: use implicit insertions and semantic validation (DEC-008/009/010; [Language Design](../Language-Design.md#expression-token-stream-and-implicit-insertions)). Operator priorities and semantic legality rules remain open (Q-007/008). |
| C-style type-first declarations vs `:`, `:=`, `::=` binding markers | GenLang leads with a type and optionally initializes a named declarator; LangLLVM leads with a name and uses different markers for constants, variables, and types. NewLang's notes focus on package/type scope without a full declaration grammar. | Syntax choice resolved in favor of LangLLVM (DEC-011). Define scope, visibility, initialization/inference semantics (Q-009), and declaration-versus-definition behavior (Q-010). |
| Generic type arguments in `<...>` vs comparisons/shifts, versus `[...]` | Angle brackets overlap with `<`, `>`, `>>`, and nested generic parsing. LangLLVM uses bracketed template parameters. | Resolved in favor of square brackets for template parameters and arguments (DEC-011); no angle-bracket template syntax. |
| Reserved keywords vs predefined identifiers | The user chose no keyword category: keyword-like constructs are predefined identifiers whose special semantic effect applies until redefinition. Names are resolved through predefined, imported, and block-related namespaces by closest namespace (DEC-018). | Resolved in favor of predefined identifiers and closest-namespace lookup (DEC-012/018); exact redefinition semantics and namespace/import ordering remain open (Q-009). |
| Static typing, inference, and compatibility | Static typing and explicit-or-inferred types are selected (DEC-013). Compatibility must follow the safety-first rule: allow when safety can be proven, otherwise reject (DEC-014). Exact safety properties, proof criteria, inference, and checking rules are not yet defined. | Specify the safety property/proof standard, inference, required annotations, and when type checking occurs (Q-009). No unsafe escape hatch or runtime fallback is assumed. |
| Value versus reference semantics and field collections | The user selected a distinction between value and reference types, with a reference containing an implicit pointer-like value identifying a variable; collections of named or indexed fields are also required (DEC-015, REQ-002). Multiple parameters and returns logically form single temporary collections (DEC-016). Reference values behave as if GC-managed; implementations may optimize where lifetime is predictable (DEC-017). | Define identity/aliasing, whether named/indexed collections are value types, reference types, or both, and how temporary parameter/result collections are typed and accessed (Q-011). Also specify behavior-preserving lifetime optimizations and their proof criteria. |
| Single-result vs multiple-result functions and coroutine transfers | Both shape function types, call conventions, assignment syntax and native interfaces. | Decide whether all callables can return tuples/multiple values and how suspension values differ. |
| Overloads vs named/dictionary arguments and conversions | Overload sets require explicit declarations identifying their member functions; resolution filters by type compatibility and prefers identical types over merely compatible types (DEC-018). NewLang notes leave named/dictionary argument behavior partly open. | Define overload declaration syntax/validation and deterministic ranking for mixed exact/compatible argument lists (Q-009); decide separately whether named/dictionary arguments are supported. |
| OO inheritance vs mixins/metaclasses/parameterized types | These are separate composition and dispatch mechanisms with interacting type identity and initialization rules. | Resolved in favor of NewLang's combined model (DEC-019); define the remaining interactions and open class-variable semantics (Q-012). |
| Operator priorities, associativity, and meanings | GenLang, NewLang's parser prototype, a separate NewLang Bison sample, and OPPrs use different numeric scales, binding-power pairs, and some conflicting labels/meanings. The user selected operator choices and the relative precedence table in DEC-021/022. | Relative ordering follows GenLang and is resolved in DEC-022; DEC-066 specifies associativity for each operator level. Forms, meanings, and binding interactions remain Q-007 questions. |
| Ordinary host/native stack vs proper tail calls and continuations | NewLang's implementation note says an ordinary processor stack conflicts with `call/cc`, and calls for compatible calling conventions to achieve perfect tail-call optimization. The new language requires proper tail calls and continuations (DEC-020), but excludes NewLang's bytecode VM (DEC-019). | Select a non-bytecode or bytecode execution architecture that can guarantee proper tail calls and implement the chosen continuation semantics; specify the continuation facility in Q-013. |
| Parser algorithm and language grammar | LR/Bison, operator-precedence and Pratt experiments are alternative implementation techniques; none requires adopting the associated sample grammar. | Select algorithm based on intended grammar; do not treat parser prototypes as user-visible features. |

### Comments, identifiers, and constants in experiment sources

These are findings from the inspected artifacts, not syntax decisions for the next language. The NewLang scanner is an implementation prototype; GenLang has both prose and lexer definitions; LangLLVM's PEG is C++-style grammar material; OPPrs lexer/parser samples are not complete language specifications.

| Experiment/source | Comments | Identifiers | Constants/literals |
|---|---|---|---|
| **NewLang design notes** (`IDEAS/Syntax.txt`) | Proposal is tentative: `//` line comments, possibly block comments, and a question about recursive/nested comments. | Proposes Unicode UAX #31 `XID_Start XID_Continue*`, `Pattern_Whitespace`, NFC input, and `\uXXXX` / `\UXXXXXXXX` source escapes. | Suggests single-quoted characters, double-quoted strings, and raw strings, without settling their grammar. Lists Perl-like escapes including `\a`, `\b`, `\c`, `\e`, `\f`, `\n`, named/code-point `\N{...}`, `\o{...}`, `\r`, `\t`, `\v`, and `\x{...}`; the note explicitly leaves parts undecided. |
| **NewLang scanner prototype** (`parser/NLparser/Scanner.cc`) | Skips `//` through a line break and `/*...*/` through the first closing delimiter; nesting is not implemented. | Reads whole input through NFC, recognizes XID start/continue, then applies NFKC to identifiers. | Scans decimal digits and a `base#digits` form with optional fraction/exponent; uses both `'...'` character and `"..."` string tokens, rejects line breaks in these constants, and recognizes a subset of backslash escapes (`a/A`, `b/B`, `e/E`, `f/F`, `n/N`, `r/R`, `t/T`, `v/V`, and `x/X` hex). A backtick path attempts a tagged-delimiter raw string, unlike the simple “raw string” note. No distinct boolean/null literal production was found in the inspected scanner. |
| **GenLang** (`docs/language.md`, generated token definitions and converters) | `//` and `/*...*/`; nested comments are explicitly unsupported. | Prose cites UAX #31 R1-2, adds `_` as start and continue, and specifies NFKC equality; it also says there are no reserved keyword tokens and describes keyword-like constructs as predefined identifiers. The generated lexer uses `ID_Start` / `ID_Continue` plus `_`, which is not the prose's `XID` spelling. | Integers: decimal, `0x`, `0b`, `0o`, and `<base>r<digits>` (base 2-36). Floats: decimal (including leading-dot and exponent forms) and hex `p` exponents. Strings: escaped double quotes and backtick raw strings (multiline, doubled backtick escape); characters are single-quoted. The prose and token regexes list standard escapes plus `\xhh`, `\uhhhh`, and `\Uhhhhhhhh`. The grammar's `constantExpression` also admits `IDENTIFIER`. |
| **LangLLVM PEG** (`src/mylang.pegjs`) | C-style `/*...*/` and `//` comments; the PEG block-comment rule stops at `*/` and does not nest. | ASCII letters/underscore start; then ASCII letters, underscore, or digits. C++-style `\uXXXX` / `\UXXXXXXXX` universal-character names are also accepted in identifiers. | C++-style binary/octal/decimal/hex integers with digit separators and suffixes; decimal/hex floats; encoded character/string forms, standard escapes, `R"..."` delimited raw strings, booleans `true`/`false`, `nullptr`, and user-defined literal suffixes. This is reference grammar, not an adopted LangLLVM language specification. |
| **OPPrs lexer/parser examples** (`miniopp` matchers; TypeScript shunting-yard/Pratt demo) | The inspected `miniopp` matcher ignores whitespace but has no comment token. The character-at-a-time TypeScript Pratt demo has no comment grammar. | `miniopp` uses `ID_Start ID_Continue*`; the TypeScript parser demo treats individual alphanumeric characters as operand tokens rather than defining identifier spelling. | `miniopp` has a simple decimal number regex with optional fraction/exponent. No string or character literal syntax was found in the inspected examples. These are parser demonstrations, not full source-language designs. |

#### Conflicts and relevance to the next design

- **Comments:** `//` and `/*...*/` recur in NewLang's scanner, GenLang, and LangLLVM. NewLang's notes contemplate recursive comments, but its scanner, GenLang, and LangLLVM grammar use first-terminator/non-nested behavior. OPPrs does not establish a comment convention.
- **Identifier policy:** DEC-024 selects case-sensitive identifiers with `XID_Start XID_Continue*`, NFKC internal names, and an NFC user-facing form. This matches GenLang's NFKC choice but not its underscore-start policy, and differs from NewLang's source-NFC then identifier-NFKC pipeline. GenLang documentation/lexer also differ on ID vs XID property names. DEC-031 pins Unicode data to version 18.0.0.
- **Literal syntax:** DEC-025 selects single-quoted character literals, double-quoted ordinary strings, decimal and marked/base# integers, C++-style universal-character names, NewLang's Perl-style string/character escapes, and ISO-standard decimal/hex float forms. DEC-026 selects NewLang's tagged-backtick raw-string delimiter family. DEC-055 makes non-universal raw backslashes literal. Exact remaining productions are open; comparisons and examples are in [Language Design](../Language-Design.md#comments-identifiers-and-constants), with remaining details tracked by Q-016.
- **Scope/evidence limit:** The inventory covers the named design notes, selected lexer/parser sources, and the LangLLVM PEG. It does not imply that every project source, generated artifact, or upstream reference tree was searched exhaustively.

### Unicode identifier normalization: standards research

- **Belegt:** The current approved [UAX #31, Unicode 18.0.0, Revision 45](https://www.unicode.org/reports/tr31/tr31-45.html) says in §5 that NFC is generally appropriate for case-sensitive identifiers and NFKC is generally more appropriate for case-insensitive identifiers. This is guidance, not a universal mandate. UAX #31 recommends `XID_Start` / `XID_Continue` for most identifier uses.
- **Belegt:** UAX #31 separates two policies: equivalent normalized identifiers (R4), where identifiers with the same specified normalization form compare as equivalent, and filtered normalized identifiers (R6), where permitted identifiers must already be in that form. For NFKC, implementations must also apply the modifications in §5.1. Case-insensitive matching is a separate case-folding policy, not simply a choice of NFC versus NFKC.
- **Belegt:** [UAX #15, Unicode 18.0.0](https://www.unicode.org/reports/tr15/tr15-58.html) defines the normalization forms. NFKC additionally folds compatibility distinctions; this can be undesirable where those distinctions carry meaning, including mathematical alphanumeric symbols.
- **Open:** The [UAX #31 proposed-update page](https://www.unicode.org/reports/tr31/proposed.html) reported no proposed update when checked. A Unicode 19.0 / next-version draft was not available among the sources checked, so no claim is made about future guidance. Recheck when a draft is published.
- **Beschlossen (DEC-006; superseded in part by DEC-024):** The original choice made identifiers case-sensitive with NFC equality keys and retained source spelling. DEC-024 replaces NFC equality with NFKC internal names and retains NFC for user interaction.
- **Beschlossen (DEC-007):** Use NewLang's proposed UAX #31 R1 syntax: `XID_Start XID_Continue*`. No additional start characters are included, so `_` may continue an identifier but may not start one. DEC-031 subsequently pins Unicode data to 18.0.0.

### Effort interpretation

The cheapest useful starting slice was assessed as source positions/diagnostics, literals, identifiers, arithmetic and comparison expressions, declarations, simple static types, blocks and a small set of control-flow statements, using a TypeScript lexer/parser and tree-walking interpreter. DEC-037 instead selects the full selected language as the first parser's target. The most expensive features are not just “more syntax”: GC/value semantics, generics, overload resolution, modules, reflection/native ABI, coroutines, continuations and guaranteed tail calls affect architecture across the compiler and runtime. These are engineering estimates, not chosen implementation priorities.

## Decisions and open questions

| ID | Item | Status | Source |
| --- | --- | --- | --- |
| DEC-001 | Keep this pass as classification only; do not move or delete files based on it. | Proposed working boundary; no file changes made. | KP-001 |
| DEC-002 | Separate proposed language features from implementation evidence and from borrowed grammar/parser examples in the experiment summary. | Applied in this evidence-based summary; not a user-approved language design. | KP-002 |
| DEC-003 | Treat NewLang, GenLang, LangLLVM, and OPPrs as distinct experiments with overlapping goals. | User-stated and accepted as the framing for synthesis. | KP-003 |
| DEC-004 | Use TypeScript for the next implementation attempt. | Initially tentative; confirmed by DEC-054. | KP-003, KP-071 |
| DEC-005 | Use Unicode 18 UAX #31 as the current standards reference for identifier-normalization discussion; treat next-version guidance as unavailable until a draft is published. | Research basis, not a language-design decision. | KP-004 |
| DEC-006 | Make identifiers case-sensitive; normalize to NFC for equality and preserve source spelling. | Historical user-approved choice; its NFC equality-key portion is superseded by DEC-024, while case sensitivity and user-facing spelling are retained. | KP-005, KP-027 |
| DEC-007 | Use XID_Start followed by zero or more XID_Continue code points for identifier syntax, with no extra start characters. | User-approved by reference to NewLang's proposed syntax; underscore is not allowed at the start. | KP-006 |
| DEC-008 | Treat source after comment stripping as an operand/operator sequence; whitespace separates tokens; insert implicit APPLY between adjacent operands and EMPTY between adjacent operators. | User-approved; DEC-048 confirms minimal insertions, with no additional construct-specific insertion rules. | KP-007, KP-071 |
| DEC-009 | Parse the transformed sequence by operand-priority rules, then check inserted APPLY/EMPTY legality in semantic analysis rather than parsing. | User-approved phase boundary. | KP-007 |
| DEC-010 | Represent unary prefix and postfix operators using an implicit EMPTY operand on the missing side. | User-approved design rule; prefix uses left EMPTY, postfix uses right EMPTY. | KP-008 |
| DEC-011 | Adopt LangLLVM's name-first binding model: `:` constant, `:=` variable, `::=` type; square-bracket template parameters/arguments; function expressions `{ BODY }` and function types `(INPARAMS) -> (OUTPARAMS)`. | User-approved; DEC-052 requires a left `@name` operand for binding expressions. Semantic details remain open. | KP-010, KP-011, KP-071 |
| DEC-012 | Do not define keywords as a separate language category; model keyword-like constructs as predefined identifiers whose special semantics cease when redefined. | User-approved; DEC-053 places recognition solely in semantic symbol-table lookup. Closest-namespace lookup is DEC-018. | KP-011, KP-017, KP-071 |
| DEC-013 | Use static typing; types may be explicit or inferred. | User-approved; inference and checking rules remain open. | KP-012 |
| DEC-014 | For type compatibility, allow an operation only when safety can be proven; otherwise reject it. | User-approved principle; exact safety properties and proof criteria remain open. | KP-013 |
| DEC-015 | Distinguish value and reference types; a reference type consists of an implicit pointer-like value identifying a variable, and variables may hold either category. | User-stated model; identity, aliasing, lifetime, and memory-management semantics remain open. | KP-014 |
| REQ-002 | Support collections of fields identified by names or indices. | User-stated requirement; concrete collection forms and their value/reference behavior remain open. | KP-014 |
| DEC-016 | Model multiple parameters and multiple return values logically as one temporary collection each. | User-approved semantic model; concrete collection/type/syntax and observability remain open. | KP-015 |
| DEC-017 | Reference values behave as if garbage-collected; implementations may optimize cases with sufficiently predictable lifetimes. | User-approved lifetime model; optimization must preserve the GC-model behavior. Specific techniques and proof criteria remain open. | KP-016 |
| DEC-018 | Resolve names through predefined, imported, and block-related namespace hierarchy, preferring the closest namespace; create overload groups only through explicit declarations; resolve by type compatibility, preferring identical types, with exactly one candidate required. | User-approved lookup and overload policy; namespace/import details, overload declaration syntax, and ranking among mixed exact/compatible arguments remain open. | KP-017 |
| DEC-019 | Adopt NewLang's language-level object model: modules as classes; packages expose module interfaces; classes with inheritance/interfaces; flat/value types and reference classes; class/metaclass objects, parameterized class objects, and non-instantiable `Object`-independent mixins. Exclude its bytecode/interpreter/backend/native-interop architecture. | User-approved selection; exact class-variable semantics and several type/package details remain open. | KP-019 |
| DEC-020 | Require proper tail calls and continuations as language/runtime capabilities. Proper tail calls are guaranteed semantics; no particular continuation facility or execution architecture is selected. | User-approved capability requirement; continuation operations, capture/multiplicity semantics, tail-position rules, and runtime representation remain open. | KP-020 |
| DEC-021 | Use GenLang's priority scale for selected operators: `@` 190; `.` left-associative at 170; `->` function definition at 170; `^` XOR at 110; `?` at 45; `**` means exponentiation. | Historical starting point; DEC-022 selects `**` priority and DEC-049 splits `.` above `->`. | KP-022, KP-071 |
| DEC-022 | Adopt the complete non-numeric relative operator precedence table from tightest to loosest, with `**` right-associative one level above `*`. | User-approved ordering, refined by DEC-023 and DEC-049. | KP-023, KP-071 |
| DEC-023 | Place `::` with `:`, and place `:=` and `::=` with `=` in the relative precedence table. | User-approved placement; DEC-050 reserves `::` and DEC-052 clarifies binding-expression meanings and their left `@name` operand. | KP-024, KP-071 |
| DEC-024 | Use case-sensitive `XID_Start XID_Continue*` identifiers, normalize internal names with NFKC, and retain an NFC form for user interaction. | User-approved; supersedes DEC-006's NFC equality key, preserving its case-sensitivity choice. DEC-036 selects whole-source NFC before tokenization. | KP-027, KP-048 |
| DEC-025 | Select non-nested `//` and `/*...*/` comments; single-quoted character literals; double-quoted strings; decimal, `0b/0o/0d/0x`, and `base#number` integers; C++-style source `\uXXXX`/`\UXXXXXXXX`; NewLang Perl-style character/string escapes; and decimal/hex ISO floating-point forms. | User-approved lexical direction; detailed productions remain open. DEC-026 subsequently selects a raw-string delimiter family. | KP-027, KP-029 |
| DEC-026 | Use NewLang's tagged-backtick raw-string delimiter: backtick + tag + quote, content, quote + same tag + backtick. | User-approved delimiter structure; DEC-027 subsequently specifies tag characters and newline normalization. | KP-029, KP-032 |
| DEC-027 | Translate `\uXXXX`/`\UXXXXXXXX` globally before tokenization, including comments and raw strings; raw tags use `[A-Za-z0-9_]*` with no fixed length limit; permit multiline raw content and normalize recognized line endings to LF. | User-approved; DEC-032 specifies physical line endings, DEC-035 selects escape eligibility and generated-line-break effects, and DEC-036 selects mixed-origin CRLF and whole-source NFC. Detailed source mapping remains open. Non-universal raw backslashes are literal (DEC-055), superseding the earlier rejection (LP-24). | KP-032, KP-034, KP-040, KP-046, KP-048 |
| DEC-028 | For integer `base#number`, use bases 2–36 and case-insensitive ASCII letter digits; allow single underscores only between integer digits; accept both cases of `0b/0o/0d/0x` markers; interpret leading zeros of unmarked integers as decimal; support typed numeric suffixes. | User-approved; DEC-033 specifies float separators and DEC-047 specifies suffix spelling/radix disambiguation. Type meanings and further boundaries remain open. | KP-033, KP-072 |
| DEC-029 | Accept UTF-8 and an optional initial BOM; use longest-match tokens and comments as separators; report malformed recognized tokens with locations; keep leading signs as operators and exponent signs in numeric tokens; disallow unescaped physical newlines in ordinary quoted literals and support escaped delimiters/backslashes; require `p`/`P` exponents for hex floats; preserve original-source spans and transformation mappings. | User-approved LP-01 through LP-07; DEC-031 selects UTF-8 only and DEC-036 selects zero-based half-open original-byte spans and physical diagnostic locations. Detailed mapping and error recovery remain open. | KP-034, KP-038, KP-048 |
| DEC-030 | Character literals produce exactly one Unicode scalar after escapes; `\N{name}` accepts individual character names, not named sequences; ordinary strings alone support backslash-physical-line-ending continuation, removing it and immediately following spaces/tabs; unknown ordinary escapes are errors. | User-approved LP-11 choices; DEC-031 pins Unicode data, DEC-032 specifies physical line endings, DEC-035 extends string continuation to escape-generated endings, DEC-039/040 refine literal-value normalization and name lookup, and DEC-042/043 specify ordinary escapes. Raw backslashes are literal (DEC-055). | KP-035, KP-036, KP-038, KP-040, KP-046, KP-055, KP-057, KP-061, KP-063 |
| DEC-031 | Use UTF-8 only for source files, and pin Unicode 18.0.0 data for identifier properties/normalization and character names in the language specification; change the data version only by deliberate specification revision. | User-approved; DEC-032 subsequently specifies Unicode-recommended physical line endings. | KP-037, KP-038, KP-040 |
| DEC-032 | Recognize the Unicode 18 UAX #14 hard-break set as physical source-line endings: LF, CR, CRLF, NEL, VT, FF, LS, and PS; count CRLF as one. | User-approved; applies to line comments, raw-string LF normalization, and ordinary-string continuation. DEC-035 gives escape-generated hard breaks equivalent lexical effects; DEC-036 groups mixed-origin CRLF as one ending. | KP-039, KP-040, KP-046, KP-048 |
| DEC-033 | Use Go/IEEE-style decimal/hex float shapes, with a single underscore as a separator only between digits of a component; `1.foo` is float `1.` followed by identifier `foo`; `0b102` and `123foo` are invalid-digit errors. | User-approved; DEC-047 requires `#` for suffixes and resolves radix/suffix overlap. DEC-057–061 resolve further boundaries; DEC-062 selects the standard reference. | KP-041, KP-042, KP-072, KP-078 |
| DEC-034 | A leading-dot float after an operand remains a float and uses implicit `APPLY`; a bare identifier after a float core ending in a digit is an invalid-digit error; a recognized exponent without digits is a malformed numeric literal. | User-approved; DEC-047 separates suffixes from exponent markers with `#`. The selected `1.foo` split remains unchanged. | KP-043, KP-044, KP-072 |
| DEC-035 | Apply Java-style eligibility and one-pass global Unicode-escape translation; reject malformed and non-scalar escapes; treat escape-generated hard breaks as line endings, including for ordinary-string continuation. | User-approved; extends DEC-030's physical-only continuation. DEC-036 specifies mixed-origin CRLF and whole-source NFC after translation; DEC-045 specifies later ordinary-escape processing of generated backslashes. Detailed original-source mapping remains open; DEC-055 resolves LP-24. | KP-045, KP-046, KP-048, KP-067 |
| DEC-036 | After global Unicode translation, NFC-normalize the entire source before tokenization; group adjacent CRLF regardless of origin; use zero-based half-open original UTF-8 byte spans counting the BOM and display physical source locations. | User-approved; NFC also affects literals and may change token spelling. Detailed mapping through composition/reordering remains open; DEC-046 specifies displayed diagnostic columns. DEC-039 specifies no further normalization after literal escapes. | KP-047, KP-048, KP-055, KP-069 |
| DEC-037 | Target the full selected language in the first parser; keep newlines as whitespace; make `->` non-associative; produce a lossless original-source CST plus the selected operator/operand tree. | User-approved; DEC-051 replaces the terminator interpretation with expression sequencing, DEC-049 resolves dot/arrow ties, and DEC-053 leaves predefined-identifier meanings to semantics. Tree mappings remain open. Scope selection is not implementation authorization. | KP-049, KP-050, KP-053, KP-071 |
| DEC-038 | Report parser syntax errors, attempt recovery for additional diagnostics, and return a lossless original-source CST with error nodes or equivalent for invalid/skipped syntax; a CST with errors does not indicate a successful parse. | User-approved; recovery mechanics and limits, lexical/encoding errors, and the operator/operand tree on erroneous input remain open. | KP-051, KP-053 |
| DEC-039 | Do not normalize ordinary character or string values after processing their literal escapes; check the one-scalar character-literal rule directly on the decoded value. | User-approved; source Unicode translation and whole-source NFC still occur before tokenization. | KP-054, KP-055 |
| DEC-040 | `\N{name}` looks up Unicode 18.0.0 character names and official aliases, with ASCII case-insensitive matching and otherwise exact spacing/punctuation; unknown or multi-scalar names are errors. | User-approved; named sequences remain excluded. DEC-041 rejects the additional `\N{U+...}` numeric form. | KP-056, KP-057, KP-059 |
| DEC-041 | Do not support `\N{U+...}`; reserve `\N{...}` for names/aliases and use global `\uXXXX`/`\UXXXXXXXX` for numeric Unicode escapes. | User-approved; DEC-043 selects the additional `\x{hex}` literal escape and DEC-045 specifies generated-backslash interaction. | KP-058, KP-059, KP-063, KP-067 |
| DEC-042 | Support ordinary escapes `\a \b \e \f \n \r \t \v` and `\cX`; `\e` is ESC, and `\cX` maps `?` to DEL or ASCII `@`–`~` to `X & 0x1F`, rejecting other characters. | User-approved NewLang set; DEC-043 selects `\x{hex}` and excludes `\o{...}`. | KP-060, KP-061, KP-063 |
| DEC-043 | Support `\x{hex}` as a braced Unicode-scalar escape with one or more ASCII hex digits (leading zeros allowed, no separators); malformed forms and non-scalar values are errors. Exclude `\o{...}`. | User-approved; ordinary-literal escape, not byte, with exact error handling as specified. | KP-062, KP-063 |
| DEC-044 | Treat Unicode 18 `White_Space` characters as token separators, except selected DEC-032 hard breaks retain line-ending behavior. | User-approved; whitespace inside comments/literals follows those constructs' rules. | KP-064, KP-065 |
| DEC-045 | Process ordinary literal escapes after global Unicode translation even when their backslash was generated; do not rescan generated backslashes for another global `\u`/`\U` escape. | User-approved; unrecognized ordinary escapes remain errors, and existing generated-line-continuation behavior is preserved. | KP-066, KP-067 |
| DEC-046 | Use one-based human-facing diagnostic columns counting Unicode scalar values in the original physical source line; count each tab as one column. Keep original UTF-8 byte spans and editor-protocol encoding conversion separate. | User-approved; this resolves displayed column units/indexing without changing DEC-036's byte spans. | KP-068, KP-069 |
| DEC-047 | Numeric suffixes are `#` plus `[A-Za-z0-9]+`, ASCII case-insensitive. First `#` after an unmarked integer from 2–36 introduces radix digits; the next introduces a suffix. Use `0d` to force decimal interpretation; outside that range first `#` can introduce a decimal suffix. | User-approved; malformed radix digits remain errors rather than suffix fallback. Individual suffix type meanings remain open. | KP-071, KP-072 |
| DEC-048 | Make minimal `APPLY`/`EMPTY` insertions to obtain an alternating operand/operator sequence; do not invent construct-specific insertion requirements. | User-approved clarification of DEC-008/010; the user states this was already answered. | KP-071 |
| DEC-049 | Place left-associative `.` one level tighter than non-associative `->`, keeping both below `APPLY`. | User-approved; resolves LP-26's former dot/arrow tie. | KP-071, KP-073 |
| DEC-050 | Reserve `::` without a current expression meaning. | User-approved; its relative placement alongside `:` remains. | KP-071 |
| DEC-051 | Treat `;` as the loosest expression-sequencing operator, evaluating the left expression before the right, not a required statement terminator. | User-approved; newline whitespace is unchanged. DEC-066 specifies left associativity; the result value remains unspecified. | KP-071, KP-081 |
| DEC-052 | Binding meanings of `:`, `:=`, and `::=` require a left `@name` operand; they are expressions in the generic operator model. | User-approved; refines DEC-011's bare-name sketches. Conditional `:` retains a separate semantic role. | KP-071 |
| DEC-053 | Recognize predefined-identifier keyword-like meanings only through semantic symbol-table lookup, not in the parser. | User-approved; resolves LP-20 and confirms DEC-012's phase boundary. | KP-071 |
| DEC-054 | Confirm TypeScript as the implementation language. | User-approved; supersedes tentative DEC-004. No parser implementation is requested. | KP-071 |
| DEC-055 | Non-universal backslashes in raw strings are literal content; only global `\uXXXX`/`\UXXXXXXXX` translation (DEC-027/035) affects raw content. | User-approved; supersedes the KP-032 rejection of this alternative; matches NewLang's scanner (KP-074). | KP-075 |
| DEC-056 | Retain current `?`/`:` priorities; then-branch conditional nesting requires explicit parentheses. | User-approved; no special conditional parser rule or semantic reassociation. | KP-075 |
| DEC-057 | Incomplete integer forms (`0x`, `0b`, `16#`, `2#`) are errors. | User-approved. | KP-077 |
| DEC-058 | The base field of `base#number` has no leading zeros; `02#10` is an error. | User-approved; Ableitung: error rather than decimal-plus-suffix reading. | KP-077 |
| DEC-059 | All floating-point forms may carry `#` suffixes. | User-approved; suffix meanings remain semantic. | KP-077 |
| DEC-060 | Malformed digit separators are errors. | User-approved. | KP-077 |
| DEC-061 | Number/dot-run boundaries use ordinary longest match: currently `1..2` → `1.` `.2`; `1...x` → `1.` `.` `.` `x`. | User-approved; results change only if multi-dot operators are added. | KP-077 |
| DEC-062 | Use IEEE 754-2019, identical to ISO/IEC 60559:2020, as the floating-point standard reference. | User-approved; does not by itself select suffix type meanings or lexical length limits. | KP-078 |
| DEC-063 | `()` groups expressions, `{}` defines blocks/scopes, and `[]` delimits template parameters. | User-approved; DEC-011's square-bracket template arguments remain selected. Exact group tree structure remains open. | KP-080 |
| DEC-064 | `;` creates a sequence of expressions; `,` creates a list whose expressions may be evaluated in parallel. | User-approved; `;` retains left-before-right processing, and DEC-066 makes it left-associative like `,`. Parallelism is permitted, not required. | KP-080, KP-081 |
| DEC-065 | For now, apply no special parsing rule to `a * -b`. | User-approved; under the binary grouping checked in KP-079, insertion gives `(a * EMPTY) - b`. Semantic legality and other prefix/postfix cases remain separate. | KP-080 |
| DEC-066 | `;` is left-associative; operators sharing a precedence level share associativity, with previously unspecified levels non-associative. | User-approved; `@`, `++`, `--`, `!`, `~`, and `<-` are non-associative; `->` remains so. `::` shares `:`'s right associativity but remains reserved. | KP-081 |
| Q-001 | Establish provenance of the uncertain NewLang root files, archives, backups, and `GenLang/ARCHIVE.zip`. | Open; contents/origins not fully inspected. | KP-001 |
| Q-002 | Decide whether the next deliverable should be a complete file-by-file manifest or a proposed cleanup/move plan. | Open; not requested yet. | KP-001 |
| Q-003 | Determine which feature candidates belong in the next attempt, and define the minimum initial slice. | DEC-037 selects the full already-selected language as the first parser's target. Other candidate features and implementation staging remain open; the selection does not authorize implementation. | KP-003, KP-050 |
| Q-004 | Choose NFC or NFKC identifier policy, and decide whether normalized form is applied for identifier equivalence or required in source spelling. | Resolved first by DEC-006, then refined by DEC-024: internal names use NFKC and an NFC form is retained for user interaction. | KP-004, KP-005, KP-027 |
| Q-005 | Choose identifier start/continue properties and any extra start characters or exclusions. | Resolved by DEC-007: use UAX #31 R1 (`XID_Start XID_Continue*`), with no extra start characters. | KP-004, KP-005, KP-006 |
| Q-006 | Choose the Unicode data version that defines `XID_Start` and `XID_Continue`. | Resolved by DEC-031: Unicode 18.0.0, pinned in the language specification. | KP-006, KP-038 |
| Q-007 | Complete the next language's operator inventory, forms, semantics, and remaining binding interactions without treating parser prototypes as normative. | DEC-049 resolves dot/arrow priority, DEC-050 reserves `::`, and DEC-056 requires parentheses for conditional then-branch nesting. DEC-064 specifies list and sequence roles; DEC-065 leaves `a * -b` without a special rule for now. DEC-066 specifies associativity for each operator level; other prefix/postfix interactions remain open. | KP-007, KP-021, KP-022, KP-023, KP-024, KP-050, KP-071, KP-073, KP-079, KP-080, KP-081 |
| Q-008 | Specify semantic-context legality rules for inserted `APPLY` operators and `EMPTY` operands. | Open; validation belongs to semantic analysis, not parsing. | KP-007 |
| Q-009 | Define scope/visibility details, namespace ordering and import behavior, redefinition semantics, overload declaration syntax and validation, mixed exact/compatible candidate ranking, initialization, inference/checking, and safety proof criteria for the selected LangLLVM bindings. | Partially resolved by DEC-011/012/013/014/018: binding syntax, predefined-identifier model, closest-namespace lookup, explicit overload grouping, static typing and safety-first compatibility are chosen; listed details remain open. | KP-009, KP-010, KP-011, KP-012, KP-013, KP-017 |
| Q-010 | Decide whether declarations without bodies/prototypes are distinct from definitions with bodies, or whether binding forms alone suffice. | Open; LangLLVM's design note raises but does not resolve this question. | KP-009, KP-010 |
| Q-011 | Specify reference identity/aliasing and field/temporary collection types and operations; define proof criteria and behavior-preserving optimizations for predictable reference lifetimes. | Partially resolved by DEC-015/016/017: reference values have GC-like behavior and predictable lifetimes may be optimized; detailed identity, collection, and optimization semantics remain open. | KP-014, KP-015, KP-016 |
| Q-012 | Specify class-variable semantics; decide whether local functions are function objects; clarify method/instantiation type roles, packed types, and how NewLang package/import configuration and namespace components integrate with DEC-018 lookup. | Open; DEC-019 adopts the model where notes are explicit but does not resolve questions or underspecified mechanics in those notes. | KP-018, KP-019 |
| Q-013 | Specify what continuation operations are provided (including full/delimited and one-shot/multi-shot behavior), what control state they capture, interactions with exceptions/coroutines and GC, and which calls qualify as tail calls. | Open; DEC-020 requires proper tail calls and continuations but does not select their full semantics or implementation. | KP-020 |
| Q-014 | Define remaining lexical grammar, token boundaries, expression sequencing, and source-location behavior. | DEC-024–062 select basic lexer rules, numeric boundaries and standard reference, minimal insertions, sequencing, and diagnostic units. Detailed source mappings, any lexical significand/exponent limits, and error-result details remain open. | KP-025, KP-034, KP-048, KP-069, KP-071, KP-072, KP-077, KP-078 |
| Q-015 | Complete remaining delimiter/grouping rules and the dual-tree/source-map/error-result contract. | DEC-048 confirms minimal insertion; DEC-063/064 select delimiter and sequence/list roles; DEC-053 leaves predefined-identifier meanings to semantics. Separate construct-specific productions are not automatically parser prerequisites. Group tree shapes and the output contracts remain open. | KP-025, KP-034, KP-048, KP-050, KP-053, KP-071, KP-080 |
| Q-016 | Specify tagged raw-string content behavior and remaining delimiter/newline details. | Partially resolved by DEC-026/027/032/035/036: tagged backticks, ASCII tags after source NFC (empty allowed, no fixed limit), multiline content, and normalization of recognized physical and escape-generated line endings to LF are selected; adjacent CRLF is one ending even with mixed origins. Non-universal raw backslashes are literal (DEC-055); raw content cannot contain its own closing sequence (Ableitung from DEC-026/055). | KP-027, KP-028, KP-029, KP-032, KP-040, KP-046, KP-048 |

## Lexer/parser decision triage

The user requests common-language proposals, explicit choices where several are customary, and a remaining-blockers list where no easy answer exists or all proposed choices are rejected (KP-031). Rows identify proposals, pending choices, and any subsequent decisions; proposals are not approved merely by appearing here. The source comparisons sample well-known languages rather than claiming a statistical majority. Existing decisions, including DEC-008/009 and DEC-024 through DEC-056, continue to govern.

### Common-practice proposals approved by DEC-029

All seven proposals below were approved by the user (KP-034). Their noted qualifications remain open.

| ID / question | Approved answer | Evidence and limits |
|---|---|---|
| LP-01 / Q-014 | Accept UTF-8 source, reject malformed UTF-8 explicitly, and allow an initial UTF-8 BOM without including it in tokens. Preserve a mapping to original source locations. | [Rust input format](https://doc.rust-lang.org/reference/input-format.html) requires UTF-8 and strips an initial BOM; [Go](https://go.dev/ref/spec#Source_code_representation) uses UTF-8 but leaves BOM acceptance optional; [Python](https://docs.python.org/3/reference/lexical_analysis.html#encoding-declarations) defaults to UTF-8 but permits declared alternatives. DEC-031 subsequently selects UTF-8 only. |
| LP-02 / Q-014 | Use longest-match tokenization for the selected token set; recognize comments and literals as such before interpreting their contents as operators. Treat comments as token separators: `a/*x*/b` produces two identifiers, not `ab`. | [Go tokens/comments](https://go.dev/ref/spec#Tokens), [Python tokens](https://docs.python.org/3/reference/lexical_analysis.html#other-tokens), and [C++ preprocessing tokens](https://eel.is/c++draft/lex.pptoken) provide examples; C++ has documented exceptions. Numeric/dot and malformed-number boundaries still need explicit rules (LP-13/14). |
| LP-03 / Q-014 | Report malformed encoding, unterminated comments/literals, malformed escapes, and invalid numeric digits explicitly rather than silently accepting or substituting values. Preserve source ranges for diagnostics. | Common compiler practice; [Go literals](https://go.dev/ref/spec#Rune_literals) and [Rust tokens](https://doc.rust-lang.org/reference/tokens.html) illustrate invalid literals. Python currently warns for some unrecognized string escapes, so this is not universal. Error recovery is a separate choice (LP-17). |
| LP-04 / Q-014 | Treat a leading `+` or `-` as an operator rather than part of a numeric token; signs following an exponent marker remain part of the exponent. | [Python numeric literals](https://docs.python.org/3/reference/lexical_analysis.html#numeric-literals) and [Rust float literals](https://doc.rust-lang.org/reference/tokens.html#floating-point-literals) explicitly distinguish `-1` from one numeric token. This does not decide unary-operator precedence. |
| LP-05 / Q-014 | Ordinary quoted strings and characters do not contain unescaped physical line breaks; provide escapes for the quote delimiter and backslash in addition to the selected Perl-style family. | Common in Go, Python, and C++; Rust permits line breaks in ordinary strings. DEC-030 selects ordinary-string continuation; DEC-039–045 specify the remaining ordinary escape forms and interactions. Raw-string backslashes are literal (DEC-055). |
| LP-06 / Q-014 | Use decimal and hexadecimal floating forms compatible with the selected ISO/IEEE direction: decimal `1.5`, `1e3`; hexadecimal `0x1.8p+2` with mandatory binary `p`/`P` exponent. Specify the exact reference edition and reconcile dot boundaries and suffixes separately. | [Go float literals](https://go.dev/ref/spec#Floating-point_literals) explicitly relates its hex form to IEEE 754-2008 §5.12.3; [C++ float literals](https://eel.is/c++draft/lex.fcon) also specify decimal/hex forms. Python and Rust reference grammars do not define hex *source literal* forms, so this is not universal practice. |
| LP-07 / Q-014/015 | Attach source spans to lexer tokens and operator/operand tree nodes, preserving a mapping to the original source through Unicode escapes and identifier normalization. | A practical tooling proposal; DEC-036 selects original UTF-8 byte coordinates and physical diagnostic locations. Detailed mapping and parse-error recovery remain open (LP-17/23). |

### Choices with recognizable alternatives

| ID / question | Alternatives to discuss | Status |
|---|---|---|
| LP-08 / Q-003 | First parser scope: expression-only; expressions plus name-first bindings; a broader slice including functions/types/blocks; or the full selected language. | Full selected language chosen (DEC-037); this does not complete the grammar or authorize implementation. |
| LP-09 / Q-014/016 | Translate `\uXXXX`/`\UXXXXXXXX` globally before tokenization, including comments and raw strings. | Global translation selected (DEC-027); Java-style eligibility, one-pass translation, scalar validation, and generated-line-break effects selected (DEC-035); DEC-036 adds whole-source NFC and mixed-origin CRLF grouping. Detailed mapping remains open (LP-23). |
| LP-10 / Q-016 | Tagged raw strings: `[A-Za-z0-9_]*` tags, including empty, with no fixed length limit; multiline content with recognized line endings normalized to LF. | Selected (DEC-027); DEC-032/035/036 specify physical and escape-generated line-ending effects, including mixed-origin CRLF. Tag matching and raw content occur after whole-source NFC. Non-universal raw backslashes are literal (DEC-055). |
| LP-11 / Q-014 | Character unit, named sequences, ordinary line continuation, unrecognized escapes, and the complete recognized escape repertoire. | Ordinary escape forms, validation, name lookup, and generated-backslash interactions are selected (DEC-030/039–045). Non-universal raw-string backslashes are literal (DEC-055); detailed source mapping remains under LP-23. |
| LP-12 / Q-014 | For integer `base#number`, use bases 2–36 and case-insensitive `0`–`9`/`A`–`Z` digits; accept both cases of radix markers; unmarked leading-zero integers are decimal. | Selected (DEC-028). [Erlang](https://www.erlang.org/doc/system/data_types.html#number) is direct prior art for the base range/alphabet; Go permits uppercase base prefixes while Rust specifies lowercase ones. |
| LP-13 / Q-014 | For integer literals, allow one `_` only between digits; support typed numeric suffixes. | DEC-028/033 select digit separators; DEC-047 specifies `#` plus nonempty case-insensitive ASCII alphanumerics and radix disambiguation. Suffix type meanings and further boundaries remain open. |
| LP-14 / Q-014 | Set decimal-point rules and malformed numeric token boundaries. | DEC-033/034/047 specify `1.foo` as float plus identifier, `a.5` as operand plus float, and errors for `0b102`, `123foo`, bare names after digit-ending float cores, and incomplete exponents. A bare name is not a suffix. Further boundaries remain open. |
| LP-15 / Q-006/014 | Pin the Unicode/XID, normalization, and named-character data to an explicit version per language or compiler release, versus another versioning policy. Define which physical line endings count as line breaks and how CRLF affects string contents. | DEC-031 pins Unicode 18.0.0; DEC-032/035/036 select physical and generated hard-break effects, including grouping mixed-origin CRLF, and raw LF normalization. |
| LP-16 / Q-007/014/015 | Define newline/semicolon behavior and arrow associativity. | DEC-037 keeps newlines as whitespace and makes `->` non-associative; DEC-051 specifies expression sequencing rather than statement termination. DEC-049 resolves dot/arrow priority. |
| LP-17 / Q-014/015 | Choose source-span units, parser output, and fail-fast versus recovery for additional syntax errors. | DEC-036 selects original UTF-8 byte spans and physical diagnostic locations; DEC-046 selects human-facing column units/indexing. DEC-037 selects a lossless original-source CST plus the operator/operand tree; DEC-038 selects recovery and a lossless CST for syntax errors. Detailed mappings, recovery mechanics, lexical/encoding errors, and the operator/operand tree on errors remain open. |

#### LP-08/16/17: parser-scope and output selections

The user selected these rules (DEC-037, KP-049/050); selecting the scope does not authorize implementation or resolve its grammar.

- **First parser scope:** The full selected language, including objects, packages, and imports. The offered expression-only and intermediate slices were not selected.
- **Expression sequencing:** Newlines are whitespace; DEC-051 specifies `;` as the loosest sequencing operator, not a required statement terminator.
- **Arrow associativity:** `->` is non-associative; ungrouped chains need grouping or rejection. DEC-049 makes `.` tighter and resolves their former tie.
- **Parser output:** A lossless CST for the original source plus DEC-009's operator/operand tree. The CST preserves original bytes, comments, whitespace, BOM, and escape spellings; exact tree mappings remain open. DEC-038 subsequently selects syntax-error recovery.

#### LP-17/26: mixed operator ties and syntax-error recovery

The earlier mixed-tie alternatives were not selected (KP-052); DEC-049 subsequently resolves that issue by changing priorities. Syntax-error recovery remains selected (DEC-038, KP-053):

- **Former `.`/`->` tie:** DEC-049 makes `.` bind tighter, producing `(a . b) -> c` and `a -> (b . c)` in the checked binary-precedence examples (KP-073). The earlier rejected tie-breaking proposals remain historical context in KP-052.
- **Syntax-error recovery:** The user chose explicit syntax errors, attempted recovery for additional diagnostics, and a lossless CST representing invalid/skipped syntax with error nodes or equivalent; invalid input is not presented as a successful parse. The fail-fast alternative was not selected. Recovery strategy and limits, malformed encoding, lexical errors, and the operator/operand tree's behavior on errors remain separate questions.

#### LP-11: quoted-literal choices and remaining questions

- **Character unit:** Selected one Unicode scalar (DEC-030), as in [Rust `char`](https://doc.rust-lang.org/reference/types/char.html). The alternatives compared were a UTF-16 code unit ([Java `char`](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/lang/Character.html)) and an extended grapheme cluster ([Swift `Character`](https://developer.apple.com/documentation/swift/character)); these are value-model comparisons, not claims of identical literal syntax.
- **Named sequences and aliases:** Selected single-character names only, not named sequences (DEC-030); DEC-040 selects Unicode 18 canonical names and official aliases with ASCII case-insensitive matching and otherwise exact spacing/punctuation. The alternative of rejecting aliases was not selected.
- **Backslash followed by a line ending:** Selected continuation in ordinary strings only, removing the backslash, line ending, and immediately following spaces/tabs (DEC-030). DEC-032 specifies physical endings; DEC-035 extends continuation to escape-generated endings.
- **Unrecognized ordinary escapes:** Selected errors (DEC-030), as in [Go](https://go.dev/ref/spec#Rune_literals). Raw strings instead keep non-universal backslashes literal (DEC-055).
- **Fixed control escapes:** Selected NewLang's set (DEC-042): `\a`, `\b`, `\e`, `\f`, `\n`, `\r`, `\t`, `\v`, and `\cX`, in addition to quote/backslash escapes. The `\cX` mapping follows [NewLang's notes](/bigdata/KAI/NewLang/IDEAS/Syntax.txt); DEC-043 subsequently selects numeric `\x{...}` and excludes `\o{...}`.

These selections and the offered alternatives are recorded in KP-035/036. DEC-042 specifies `\cX` and `\e`; DEC-043 adds `\x{...}` and excludes `\o{...}`. DEC-045 specifies that generated backslashes participate in later ordinary-escape processing without restarting global Unicode translation. DEC-039 specifies no post-escape normalization; DEC-040/041 specify name lookup and exclude the numeric `\N{U+...}` form.

**DEC-040 — selected:** For `\N{name}`, accept official Unicode character names and Unicode 18 aliases, with ASCII case-insensitive matching and otherwise exact spaces/punctuation. Unknown names are errors; named sequences remain excluded. Python's `unicodedata.lookup()` supports case-insensitive names and aliases, providing a familiar comparison (SRC-075/076/078). DEC-041 separately excludes the `\N{U+...}` numeric form.

**DEC-041 — selected:** Keep `\N{...}` exclusively for names and aliases; do not add `\N{U+...}`. Global `\uXXXX` and `\UXXXXXXXX` already provide numeric Unicode escapes throughout the source. Perl uses `\N{U+...}` for variable-width code-point notation, and NewLang's notes explicitly asked whether to include it (SRC-080); it is an optional convenience rather than a necessary capability.

**DEC-042 — selected:** Use NewLang's fixed escape set `\a`, `\b`, `\e`, `\f`, `\n`, `\r`, `\t`, `\v`, and `\cX`, in addition to quote and backslash escapes. `\e` means ESC. For `\cX`, `?` maps to DEL; ASCII `@`–`~` maps to the low five bits (`X & 0x1F`); other characters are errors. This follows the mapping in NewLang's notes. DEC-043 selects `\x{hex}` and excludes `\o{...}`.

**DEC-043 — selected:** Support `\x{hex}` only as an ordinary-literal Unicode scalar escape. Require one or more ASCII hexadecimal digits in braces; permit leading zeros but no separators. Empty bodies, missing closing braces, non-hex digits, values above U+10FFFF, and surrogates are errors. The result is a scalar, not encoded bytes. The user rejected `\o{...}`.

#### LP-11/23: ordinary literal values after escape processing

**DEC-039 — selected:** Do not normalize ordinary character or string values again after processing their escapes. Check the one-scalar character-literal rule directly on the decoded result. The offered alternative was to apply NFC to each decoded ordinary literal before that check.

The distinction follows from the selected phase order, not from a raw-source difference alone. In `"e\u0301"`, the global Unicode escape is translated before whole-source NFC, producing one U+00E9. In `"e\N{COMBINING ACUTE ACCENT}"`, the named escape is processed after whole-source NFC: its value is U+0065 followed by U+0301, with no second normalization. Thus the analogous single-quoted spelling produces two scalars and is invalid. The canonical Unicode 18 names and decomposition are in SRC-075. A Python comparison in SRC-076 confirms this result for the examples, but uses host Unicode 15.0.0, not the selected version.

This question concerns ordinary literals only. Raw-string backslashes are separately literal (DEC-055); DEC-045 subsequently specifies interactions between globally generated backslashes and ordinary escapes.

#### LP-27: inter-token whitespace

**DEC-044 — selected:** Every Unicode 18 `White_Space` character separates tokens, except DEC-032 hard breaks, which retain line-ending behavior. This admits non-ASCII spaces as separators; whitespace in comments and literals remains governed by their own syntax. The user selected this instead of restricting horizontal whitespace to ASCII space and tab.

#### LP-28: generated backslashes and ordinary literal escapes

**DEC-045 — selected:** Process ordinary literal escapes on the translated stream, whether the backslash originated literally or from a global Unicode escape. Thus `"\u005Cn"` decodes like `"\n"`, and `"\u005Cx{41}"` decodes to `A`. A generated backslash does not initiate a second global Unicode-translation pass; unrecognized ordinary escapes still error, and DEC-035's generated-backslash line continuation remains in force.

#### LP-01/15: source input and Unicode selections

- **Unicode data policy:** Selected one exact Unicode version named by the language specification, changed only by a deliberate specification revision, for identifier properties, normalization, and character-name data (DEC-031).
- **Initial version:** Selected Unicode 18.0.0 (DEC-031). Unicode's [18.0 announcement](https://blog.unicode.org/2026/09/announcing-unicode-standard-version-180.html) says it is available, and its [UCD readme](https://www.unicode.org/Public/18.0.0/ucd/ReadMe.txt) describes final data. However, the [18.0 overview](https://www.unicode.org/versions/Unicode18.0.0/) still displays a preliminary-draft banner; this discrepancy is recorded without assuming its cause.
- **Source encoding:** Selected UTF-8 only, with the previously approved optional initial BOM (DEC-029/031).
- **Physical line endings:** Selected all Unicode 18 UAX #14 hard breaks (DEC-032): LF, CR, CRLF, NEL, VT, FF, LS, and PS, with CRLF counted once. This matches [NewLang's notes](/bigdata/KAI/NewLang/IDEAS/Syntax.txt). DEC-035/036 select generated-line-break effects and group mixed-origin CRLF.

**Belegt:** [Unicode 18 core §5.8.3](https://www.unicode.org/versions/Unicode18.0.0/core-spec/chapter-5/#G29990) recommends that `readline` stop at CR, LF, CRLF, NEL, LS, PS, and FF; it does not include VT in that `readline` list. [UAX #14 LB4/LB5](https://www.unicode.org/reports/tr14/tr14-57.html#LB4), together with the [Unicode 18 line-break data](https://www.unicode.org/Public/18.0.0/ucd/LineBreak.txt), treats all of those plus VT as hard breaks. [UTS #55](https://www.unicode.org/reports/tr55/tr55-5.html#Atoms) recommends supporting all such hard breaks in source-code editors, while recognizing that a language may support a narrower terminator set. These are related recommendations for different contexts, not a single mandated source-lexer grammar.

**Beschlossen:** Treat all UAX #14 hard breaks as source line endings, including VT; this matches NewLang's listed set (DEC-032). The offered alternative was the core §5.8.3 `readline` set, which excludes VT. CRLF counts as one in both (KP-039/040).

The approved selections are recorded in KP-037 through KP-040. Raw-string LF normalization (DEC-027) and ordinary-string continuation (DEC-030) apply to the physical endings selected by DEC-032; this normalizes LS and PS to LF in raw-string values.

#### LP-13/14: numeric syntax selections and remaining boundaries

- **Floating forms:** Selected [Go-style decimal and hexadecimal shapes](https://go.dev/ref/spec#Floating-point_literals), including `.5`, `1.`, `1e3`, `0x1p0`, `0x1.p0`, and `0x.8p0` (DEC-033). DEC-047/059 specify suffix spelling and applicability; DEC-062 selects IEEE 754-2019 / ISO/IEC 60559:2020.
- **Floating digit separators:** Selected one underscore used as a digit separator only between digits of the same component (DEC-033); unlike Go, this does not allow an underscore immediately after the hexadecimal prefix. A suffix's own spelling is separate.
- **Dot followed by an identifier:** Selected float `1.` followed by `foo`, with implicit `APPLY` (DEC-033). DEC-047 requires a suffix to start with `#`, so bare `foo` cannot be one. The earlier three-token comparison is historical evidence, not the selected rule.
- **Invalid digits and bare identifiers:** Selected invalid-digit errors for `0b102` and `123foo` (DEC-033/047). These choices do not decide all further adjacent-number boundaries.

The selections and alternatives are recorded in KP-041/042. DEC-047 resolves suffix spelling and radix overlap; DEC-034 specifies `a.5`, bare names after digit-ending float cores, and incomplete exponents.

#### LP-14: further numeric-boundary selections

- **A leading-dot float after an operand:** Selected identifier `a` followed by float `.5`, with implicit `APPLY`, including when whitespace or comments intervene (DEC-034). The context-sensitive dot-plus-integer alternative was not selected.
- **Bare names after other floats:** Selected an invalid-digit diagnostic when a float core ends in a digit and is immediately followed by a bare identifier; for example, `1.2foo` and `1e3foo` (DEC-034/047). The selected float-plus-identifier behavior for `1.foo` remains unchanged.
- **Incomplete exponents:** Selected malformed-literal diagnostics for recognized exponent markers without digits, such as `1e+` and `0x1p` (DEC-034). DEC-047 requires `#` before suffixes, separating them from exponent markers.

The selections and alternatives are recorded in KP-043/044. DEC-047 fixes suffix spelling and radix disambiguation (KP-072); individual suffix meanings and further numeric boundary cases remain open.

KP-076 enumerated the remaining boundary cases; DEC-057–061 (KP-077) resolve incomplete forms, base leading zeros, float suffixes, malformed separators, and dot runs. DEC-062 (KP-078) selects IEEE 754-2019 / ISO/IEC 60559:2020. Any lexical significand/exponent limits remain open; runtime numeric range and rounding belong with numeric semantics unless the language chooses to make them lexical constraints.

#### LP-23: global Unicode-escape selections and remaining questions

The user selected the following rules (DEC-035, KP-045/046). They apply inside comments and raw strings as well as elsewhere; DEC-055 separately makes all other raw-string backslashes literal.

- **Backslash eligibility:** Selected Java-style eligibility, including its generated-character exception; source `\\u0041` remains unchanged at this phase. The alternative was to translate every occurrence, which would instead produce `\A`. Java's repeated-`u` spelling and UTF-16 code-unit model were not adopted.
- **Generated escape-like text:** Selected one pass: `\u005Cu0041` produces the characters `\u0041`, without translating them again. Repeated rescanning was the unselected alternative; subsequent lexical treatment depends on context.
- **Malformed escapes and values:** Selected exactly four/eight ASCII hexadecimal digits per `\u`/`\U` escape and scalar-only values, with diagnostics for malformed digits, surrogates, and values above U+10FFFF. The unselected alternative would also have allowed adjacent `\u` high/low surrogate pairs.
- **Generated line endings:** Selected the same lexical effects as physical endings, including ordinary-string continuation. This extends DEC-030's physical-only continuation rule. The other options retained physical-only continuation or treated generated endings as non-terminating content in comments and literals.

The Java comparison is specifically [JLS 25 section 3.3](https://docs.oracle.com/javase/specs/jls/se25/html/jls-3.html#jls-3.3); the scalar-value comparison is [C++ universal-character names](https://eel.is/c++draft/lex.universal.char). DEC-036 subsequently selects mixed-origin CRLF grouping and source NFC after translation; detailed original-source mapping remains open.

#### LP-17/23: source-location and translation selections

The user selected the following rules (DEC-036, KP-047/048); the other offered alternatives were not selected.

- **Mixed-origin CRLF:** Adjacent translated CR and LF form one ending regardless of origin. It produces one LF in a raw string and is removed as one ordinary-string continuation.
- **Span coordinates:** Original UTF-8 byte ranges are zero-based and half-open, and count an initial BOM. For example, an `a` immediately after a three-byte BOM has range `[3,4)`. [Go positions](https://go.dev/src/go/token/position.go?m=text) use byte offsets; LSP line/character coordinates default to UTF-16 and can be negotiated, so an adapter may need conversion.
- **Displayed diagnostics (DEC-046):** Use physical line/column positions in the original file; logical translated locations may be provided additionally. In `// x\u000A y` on one physical line, `y` is on physical line 1 but logical line 2. Human-facing columns are one-based Unicode scalar counts in the original physical source line, with each tab counting as one column. Keep original UTF-8 byte spans as the primary internal locations and convert separately to an editor protocol's negotiated encoding. LSP defaults to zero-based UTF-16 code units but permits UTF-8/UTF-32 negotiation; Go's token positions expose byte offsets and one-based byte columns (SRC-090).
- **Normalization phase:** NFC-normalize the entire source after Unicode-escape translation and before tokenization; the recommended identifier-only alternative was not selected. This includes literal and comment content and can change token spelling: U+037E becomes ASCII `;`, and source `e` followed by U+0301 becomes U+00E9. The pinned Unicode 18 [normalization tests](https://www.unicode.org/Public/18.0.0/ucd/NormalizationTest.txt) verify these examples. No additional post-escape literal-value normalization is selected.

Detailed mappings through composition, reordering, and Unicode escapes remain open; the selected original-byte spans must still be preserved.

### Remaining blockers and unresolved project-specific choices

These are blockers for the affected grammar or parser slice, not claims that all language semantics must be decided before any parser can be built.

| ID / question | Blocker | When it matters |
|---|---|---|
| LP-18 / Q-007/008/015 | Minimal implicit `APPLY`/`EMPTY` insertion. | Resolved by DEC-048, reaffirming DEC-008/010. Structural delimiter/tree contracts are separate Q-015 questions; do not reopen minimal insertion. |
| LP-19 / Q-007/009/015 | Conditional interpretation under the current `?`/`:` priorities. | Binding contexts require left `@name` (DEC-052), and `::` is reserved (DEC-050). Binary-precedence analysis finds unexpected then-branch nesting (KP-073); Same-priority alternatives were analyzed and not adopted (KP-074). **Resolved by DEC-056:** current priorities retained; then-branch nesting requires explicit parentheses. |
| LP-20 / Q-009/015 | Recognition of predefined-identifier keyword-like meanings. | Resolved by DEC-053: semantic symbol-table lookup, not parser recognition. |
| LP-21 / Q-009/010/015 | Remaining type/initializer/function/template/overload source forms and structural grouping. | DEC-051/052 fix sequencing and binding targets. Remaining meanings can be semantic; only missing lexical or structural syntax blocks the generic parser. |
| LP-22 / Q-009/012/015 | Source expressions for namespaces, imports, packages, classes/interfaces, and members. | Semantic identifier recognition requires no parser-specific production (DEC-053); additional structural syntax, if needed, remains to be specified. |
| LP-23 / Q-014/016 | Specify detailed original-source mappings through global Unicode translation, whole-source NFC, canonical composition/reordering, and identifier NFKC, including links between the lossless CST and operator/operand tree. DEC-035/036/046 select phase ordering, line-break behavior, original-byte span units, and displayed column units, but not the mapping mechanics. | Before implementing the affected translation, tree, and source-location behavior. |
| LP-24 / Q-016 | Define non-universal backslash behavior in raw strings; prior alternatives were not selected. | **Resolved by DEC-055 (KP-075):** after reviewing NewLang's scanner (KP-074), the user selects literal non-universal backslashes, superseding the KP-032 rejection. Global `\u`/`\U` translation still applies first. |
| LP-25 / Q-014 | Numeric suffix/radix ambiguity and further number boundaries. | DEC-047 and DEC-057–061 resolve suffix/radix disambiguation and several malformed forms; DEC-062 selects the floating-point reference. Remaining malformed-token extents and any lexical significand/exponent limits need a contract; individual suffix type meanings belong to semantics. |
| LP-26 / Q-007/015 | Former dot/arrow same-priority tie. | Resolved by DEC-049: `.` binds tighter than `->`. DEC-066 specifies level associativities; operator forms and interactions remain Q-007 questions. |
| LP-27 / Q-014 | Define which non-line-ending characters separate tokens. | Resolved by DEC-044: all Unicode 18 `White_Space` characters are separators, while DEC-032 hard breaks retain line-ending behavior. |
| LP-28 / Q-014/016 | Decide whether a backslash generated by global `\u`/`\U` translation may start a later ordinary literal escape. | Resolved by DEC-045: ordinary escapes process the translated stream, but global Unicode translation is not repeated. |
| LP-29 / Q-014/015 | Specify the unit and indexing convention for physical diagnostic columns, in relation to original UTF-8 byte spans and editor-protocol positions. | Resolved by DEC-046: one-based original-source Unicode scalar columns, tabs count one; convert separately to negotiated editor encoding. |

LP-24 and LP-19 are resolved by DEC-055/056. LP-26 is now resolved by changed priorities. Type compatibility, reference/GC optimization, dispatch, and continuation implementation remain later semantic/runtime work unless a syntax decision depends on them.

### Current parser-readiness assessment

The user clarified the compilation in KP-071/072, settled further numeric and floating-point reference questions in KP-077/078, selected delimiter roles and sequence/list behavior in KP-080, and specified level associativities in KP-081. **Belegt:** TypeScript, minimal insertion, binding targets, semantic predefined-identifier recognition, numeric suffix/radix rules, dot/arrow ordering, the IEEE reference edition, delimiter and list/sequence roles, and operator level associativities are settled. The dual-tree and syntax-error recovery requirements remain. **Ableitung:** These decisions remove the need to treat every semantic construct as a separate parser production. Remaining parser-facing work includes:

- Delimiter/group tree structure and empty/nested groups; remaining prefix/postfix binding interactions (Q-007/015). For `a * -b`, no special rule is selected for now (DEC-065); minimal insertion and the level associativities are not reopened.
- Treatment of unlisted symbolic input, remaining malformed-token extents, and any lexical numeric-length limits (Q-014).
- Mapping translated and normalized tokens/nodes to original bytes and between both trees (LP-23); precise node contracts, lexical/encoding-error results, and operator-tree behavior on erroneous input (Q-014/015). Recovery algorithm and limits are also unspecified.

TypeScript is confirmed (DEC-054). Type inference, safety proofs, reference lifetimes, dispatch, numeric rounding/representation, suffix type meanings, and continuation runtime semantics can be deferred unless a selected syntax depends on them. Remaining semantic source forms (LP-21/22) need not block a generic expression parser when no additional structural syntax is required. No parser implementation has been requested.

## Work status and verification

- Identified: the four `langlist` roots, dominant experiment roots, clear upstream/reference trees, and generated/dependency groupings.
- Evidence checked: root directory entries; project manifests/READMEs; NewLang grammar headers and Makefiles; selected source files; `GenLang` language specification; `LangLLVM` package and grammar; `OPPrs` package metadata and parser/sample grammars.
- Experiment-feature evidence: selected NewLang architecture, syntax and grammar files; GenLang specification and parser/generator/interpreter sources; LangLLVM grammar/design/test sources; miniopp, Rust Pratt, TypeScript Pratt and Bison utility sources.
- Consolidation: candidate feature matrix, conflict analysis, and relative TypeScript effort estimates are recorded here. The NewLang language-level object model is selected by DEC-019, proper tail calls/continuations are required by DEC-020, and DEC-037 selects the full already-selected language as the first parser's target. Other feature selection and implementation staging remain open (Q-003). No implementation has been approved or verified.
- The agreed lexical and operator source forms are consolidated in the [token syntax summary](../Language-Design.md#agreed-token-syntax-summary); this is an index, not a complete lexical grammar.
- Not verified: complete file-by-file provenance, all nested archive contents, all source histories, or licenses beyond inspected headers/metadata.
- Implementation claims are limited to mechanisms directly visible in the selected code; no project build or test suite was run for this research task. One-off Python 3 probes checked DEC-035 translation examples, malformed/non-scalar cases, and selected DEC-036 NFC, BOM-span, and mixed-origin CRLF examples. The host uses Unicode 15.0.0, so the selected NFC examples were also checked against Unicode 18 conformance data; these probes are not a language implementation (KP-046/048).
- One-off Python 3 specification probes checked six binary-precedence trees, eleven integer suffix/radix examples, and all 254 operand/operator kind sequences of lengths one through seven for minimal adjacent-kind insertions (KP-073). These checks do not validate a complete lexer/parser, Unicode processing, or semantic type names.
- A one-off binary-precedence probe checked `a * -b` after the selected `EMPTY` insertion and two possible equal-priority groupings of `!a++` (KP-079). It does not decide the language's prefix/postfix binding rules or test a project parser.
- A one-off documentation check verified all 22 precedence levels state an associativity and checked DEC-066's changed levels (KP-081). It does not test a parser.
- Source trees remain unchanged.

## Next steps

1. Complete delimiter/tree/source-map/error-result contracts (Q-014/015, LP-23). Raw backslashes (DEC-055), conditional then-nesting via parentheses (DEC-056), numeric suffix/radix spelling and boundaries plus the floating-point reference (DEC-057–062), minimal insertion, dot/arrow ordering, and semantic identifier recognition are settled. Use the [Language Design checklist](../Language-Design.md#questions-to-resolve-before-parser-implementation) without reinstating construct-specific parser requirements for semantic meanings.
2. Resolve Q-001 only if exact ownership or cleanup is needed; do not treat this inventory as authorization to relocate files.

## Handover

Read [Language Design](../Language-Design.md) for approved design choices, this Wissensstand for current evidence and open questions, and the relevant entries in [Kontextprotokoll](./Kontextprotokoll.md) for rationale and provenance. The feature inventory is not a complete language specification; continue resolving open questions before implementation. The four source roots are named in `../langlist` (relative to this document; absolute paths are recorded above). Treat the file classifications as preliminary and check uncertain items before cleanup.

> Start prompt: Work in `/bigdata/KAI/projects/NewLanguageProject`. Read `Language-Design.md`, `Kontext/Wissensstand.md`, and relevant entries in `Kontext/Kontextprotokoll.md`. Treat NewLang, GenLang, LangLLVM, and OPPrs as distinct experiments with overlapping goals. TypeScript and the full selected-language target are confirmed; retain the generic expression parser and semantic identifier-recognition boundary. Check Q-001 before any cleanup.
