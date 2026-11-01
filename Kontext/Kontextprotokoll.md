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
