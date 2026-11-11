# Proposal grammar on the existing parser

Assessment date: 2026-11-09. Source: the complete 1,205-line
[newlang.ye](../Proposals/newlang.ye), compared with
[Language Design](./design-research/Language-Design.md),
[operator binding](./operator-binding.md), and the built TypeScript frontend.
This is a feasibility report, not adoption of the historical grammar or
authorization to implement semantic analysis.

## Bottom line

**Much of the declaration and control-flow vocabulary can be recognized on top
of the existing CST, but the grammar cannot be faithfully reproduced by simply
assigning meanings to the current expression trees.**

Names, literals, dotted names, delimiter groups, argument lists, many ordinary
binary expressions, and braced declaration/control-flow forms provide useful
building blocks. No lexer keyword category is needed.

The main obstacles are expression grouping, missing single-token operators,
statement/declaration boundaries, and conflicts with approved language rules.
The full CST retains original structural sequences and source bytes, so a
second grammar recognizer could recover historical syntax from them. However,
reparsing those sequences with different precedence is effectively another
parser, not ordinary semantic interpretation of the approved tree.

No defensible percentage of *grammar reproduction* follows from the counts
below: productions are recursive and overlap, and the draft is incomplete.

## Measured coverage and draft completeness

| Measurement | Result | What it establishes |
|---|---:|---|
| Production definitions | 231 | Count of named EBNF-like production blocks across the whole file, including after the second `%%`. |
| Distinct defined nonterminals | 226 | Five names have duplicate definitions. |
| Distinct quoted terminals | 107 | Includes three parser-goal pseudo-tokens. |
| Terminals recognized as one diagnostic-free token | 101/107 | Lexical coverage only, not grammatical or semantic coverage. |
| Representative source probes | 43 | Deliberately selected compatibility and conflict cases, not a random or exhaustive sample. |
| Probes with `status: complete`, no diagnostics | 40/43 | Generic structural acceptance; several have incompatible trees. |
| Probes with `status: error` | 3/43 | Non-associative operator chains; these are not successful parses. |

The six split terminals are:

| Draft terminal | Actual token spellings | Consequence |
|---|---|---|
| `=I=`, `=E=`, `=M=` | `=`, identifier, `=` | These are declared parser-goal markers, not ordinary source syntax. A future input-mode API could select a goal without introducing tokens. |
| `...` | `.`, `.`, `.` | Subranges and varargs do not obtain a dedicated ellipsis node. |
| `>>>` | `>>`, `>` | Java unsigned shift is not an existing operator. |
| `>>>=` | `>>`, `>=` | Java unsigned-shift assignment is not an existing operator. |

Draft defects must not be mistaken for frontend limitations:

- `CompilationUnit` references undefined `PackageImportsFile`; the file defines
  `PackageInterfaceFile` instead.
- `MixInDeclaration`, `Derivation`, and `Lambda` are referenced but undefined.
  `LambdaExpression` is defined, but equating it with `Lambda` needs a decision.
- `Identifier` and `Literal` have no definitions here. They may be intended
  lexical categories; exact compatibility with current Unicode/numeric/string
  rules cannot be established from this file alone.
- `PackageName`, `VariableDeclaratorList`, `VariableDeclarator`, `Type`, and
  `EnumDeclaration` each have two definitions. Some repeat or extend alternatives;
  others mix the custom opening grammar with Java-shaped reference grammar.
  No rule for choosing or merging these definitions is supplied.
- A stray `newlang` appears at line 99. Type productions continue after the
  second `%%` at line 1104; that is not a normal executable yacc grammar layout.
- `ArrayInitializer` uses unquoted `{ ... }` EBNF repetition, unlike the quoted
  braces in other initializer productions. As written, it does not require
  source braces. Reproduction of an intended Java-style initializer requires
  correcting/clarifying this first.

## Feasibility by construct

“Recognition” below means a future semantic recognizer; none of these
construct-specific recognizers is implemented yet.

| Grammar area | What the existing frontend provides | Remaining work or conflict |
|---|---|---|
| Package/context headers, imports, exports (lines 4–82) | Identifier/APPLY chains, dotted names, commas and semicolons. | Recognize names, list ownership and legal contexts. Source-based import-path configuration is displaced by DEC-094 JSON manifests. An export source still exists, but this particular `exports` grammar is not approved. |
| Modifiers; structs, enums, sets, arrays, classes, interfaces (lines 51–526) | Modifier/declaration words as identifiers; brace groups with independently parsed contents. | Define semantic heads, attachment and validation. Adjacent declarations without `;` merge into APPLY chains, so declaration boundaries are not already tree nodes. Missing `Derivation`/mixin rules remain blockers to completeness. |
| Fields, constants, typedefs, methods, constructors (lines 84–435) | Type/name APPLY chains, `=`, lists, parameter groups and body groups. | Type-first declarations conflict with DEC-011/052's name-first `@name` binding. Modifiers, signatures, throws clauses and list scope need recognition; comma-separated declarators do not carry the leading type on every branch. |
| Names and simple member access (lines 835–869, 1065–1097) | Dotted names and `obj.f(x)` have usable trees. | A member after a call, as in `f(x).y`, has a different grouping; see below. |
| Calls and parameter/argument lists (lines 327–380, 858–869) | `f(a,b)` is APPLY to one parenthesis group; commas form a list. | Formal versus actual parameters, varargs, receiver parameters and generic call forms need context. Ellipsis is split. |
| Templates/type arguments (lines 189–197, 1183–1204) | `<` and `>` are comparison operators, not delimiters. | Angle generics, nested closing `>>`, wildcards and diamond syntax do not produce template groups. DEC-011/063 selects `[]` instead. Adapting the source is preferable to silently reinterpreting comparisons. |
| Arrays and dimensions (lines 569–574, 853–856, 881–894, 1166–1168) | `[]` is a preserved operand group; repeated dimensions become APPLY chains. | `a[i]` has no indexing distinction from template application. Giving it Java indexing semantics conflicts with the selected template role unless separately approved. Braced initializer intent also needs clarification. |
| Annotations (lines 497–565) | `@Ann` becomes `(@ EMPTY Ann)`; following parameter/body groups survive. | Recognition is structurally possible, but annotation meaning conflicts with the selected name-declaration role of `@`. It is not automatically valid because it parses. |
| Braced control flow (lines 601–819) | `if`, `while`, `for`, `try`, `catch`, `finally`, `switch` are identifiers; header and body groups survive. | Semantic recognition must consume whole chains, attach clauses and validate header shapes. `for` semicolons and switch labels are ordinary operator trees, not dedicated syntax nodes. |
| Unbraced statements, labels, returns, dangling `else` (lines 638–819) | Tokens and order remain available; `;` produces sequencing, `:` an operator. | Grammar statement terminators can split a construct across tree branches. Dangling-else matching and operand extent are not encoded by generic precedence. Supporting the exact grammar would need a statement recognizer over sequences, or source adaptation using explicit groups. |
| Ordinary arithmetic, comparisons, logical operations, assignments (lines 931–1017) | Many operators and their associativities match; basic `a+b*c` and `a=b=c` are usable. | Bitwise/comparison ordering differs; `instanceof` is an identifier rather than an infix operator; unsigned shifts are split. Lvalue, type and evaluation checks are semantic work. |
| Unary operators, casts, lambdas, conditionals, method references (lines 871–879, 905–1061) | Operators/groups exist for many spellings. | These include major binding and approved-rule conflicts detailed next. Existing parser errors cannot be treated as successful semantic input. |

## Concrete tree mismatches

Notation: `(op left right)` is a binary CST node, `APPLY` is implicit
application, and `EMPTY` is an inserted operand. Delimiter groups are abbreviated.
“Draft intent” refers only to this proposal, not an approved language requirement.

| Source | Actual current tree or diagnostic | Draft intent / difficulty |
|---|---|---|
| `f(x).y` | `(APPLY f (. (x) y))` | Member access on the result of `f(x)`, not on its argument group. `.` binds tighter than APPLY. |
| `x -> x + 1` | `(+ (-> x x) 1)` | Lambda body should include `x+1`. Arrow binds much tighter than arithmetic. `(x)->{x+1}` preserves an explicit body group. |
| `x -> y -> y` | `non-associative-operator-chain`; status error | Draft permits a lambda whose body is another lambda. Current arrow chaining requires grouping. |
| `a * -b` | `(- (* a EMPTY) b)` | Draft multiplies by unary `-b`; DEC-065/073 explicitly retains the different current tree. |
| `-a*b` | `(- EMPTY (* a b))` | Draft multiplies unary `-a` by `b`. Equivalent numeric results in some types do not establish identical syntax or semantics. |
| `!!a`, `!a++` | `non-associative-operator-chain`; status error | Java-style recursive unary/postfix grammar permits these shapes. DEC-066 makes this level non-associative. |
| `a & b == c` | `(== (& a b) c)` | Draft equality binds tighter than bitwise AND: `a & (b==c)`. Current bitwise levels precede comparison/equality levels. |
| `a instanceof T` | `(APPLY (APPLY a instanceof) T)` | Draft relational operation; a predefined-identifier recognizer would need an explicitly defined infix-like form. Ordinary function application alone does not supply that precedence. |
| `a ? b ? c : d : e` | `(: (? a (? b c)) (: d e))` | Draft then-expression contains the inner conditional. Current separate `?`/`:` operators require explicit parentheses for that nesting (DEC-056). |
| `(T)-x` | `(- (T) x)` | Draft primitive cast of unary `-x`; current tree is subtraction. Type lookup alone cannot make this the same operand shape. |
| `List<List<T>> x;` | `(; (< (< List List) (>> T x)) EMPTY)` | No nested generic delimiter structure. |
| `T::f` | `(:: T f)`; status complete | Draft method reference, but DEC-050/074 gives `::` no valid operands. |
| `range { a ... b }` | `(APPLY range {(. (. (. a EMPTY) EMPTY) b)})` | No ellipsis/range node. Original spelling is recoverable from the full CST, not faithfully represented as that operator. |
| `return a,b;` | `(; (, (APPLY return a) b) EMPTY)` | A generic identifier head binds only `a`; draft `return Expression` consumes the comma-separated expression too. |
| `if(a) if(b) f(); else g();` | Two semicolon-sequence branches; `else g()` is in the second branch | No existing nested if/else tree or dangling-else attachment. |

These are not necessarily bugs in the parser: they follow its approved generic
rules, including the recently selected APPLY binding (DEC-093).

## Full representative probe inventory

All complete cases below had no diagnostics. “Complete” means only that the
generic parser finished without errors; it does not declare the source
semantically legal or grammar-equivalent.

| # | Source | Status |
|---:|---|---|
| 1 | `package P.N;` | complete |
| 2 | `package P exports A, B;` | complete |
| 3 | `class C extends B implements I { int x; void f() {} }` | complete |
| 4 | `int x=1,y=2;` | complete |
| 5 | `void f() {} void g() {}` | complete |
| 6 | `@Ann(x=1) class C {}` | complete |
| 7 | `@interface A {}` | complete |
| 8 | `range { a ... b }` | complete |
| 9 | `enum { A,B }` | complete |
| 10 | `array { x -> y }` | complete |
| 11 | `if(a) { f(); } else { g(); }` | complete |
| 12 | `if(a) if(b) f(); else g();` | complete |
| 13 | `while(a) f();` | complete |
| 14 | `for(int i=0;i<n;i++) f();` | complete |
| 15 | `for(T x : xs) f();` | complete |
| 16 | `try {f();} catch(E e) {g();} finally {h();}` | complete |
| 17 | `switch(x){case 1: f(); break; default: g();}` | complete |
| 18 | `f(a,b)` | complete |
| 19 | `obj.f(x)` | complete |
| 20 | `f(x).y` | complete |
| 21 | `a[i]` | complete |
| 22 | `new T(x)` | complete |
| 23 | `new int[n]` | complete |
| 24 | `List<T> x;` | complete |
| 25 | `List<List<T>> x;` | complete |
| 26 | `new T<>()` | complete |
| 27 | `T::f` | complete |
| 28 | `a >>> b` | complete |
| 29 | `a >>>= b` | complete |
| 30 | `a instanceof T` | complete |
| 31 | `a & b == c` | complete |
| 32 | `a | b < c` | complete |
| 33 | `a * -b` | complete |
| 34 | `-a*b` | complete |
| 35 | `!a++` | error: non-associative chain |
| 36 | `!!a` | error: non-associative chain |
| 37 | `x -> x + 1` | complete |
| 38 | `x -> y -> y` | error: non-associative chain |
| 39 | `f(x) -> y` | complete |
| 40 | `a ? b ? c : d : e` | complete |
| 41 | `(T)x+y` | complete |
| 42 | `(T)-x` | complete |
| 43 | `return a,b;` | complete |

## Suggested direction, not yet approved

1. Reuse the draft as a **semantic construct inventory**, not as a replacement
   grammar. Start with imports, name-first declarations, braced type definitions,
   calls, and explicitly grouped control-flow forms.
2. Define exact accepted CST shapes and consumption boundaries for each
   predefined identifier. A flat APPLY chain is not already a declaration or
   control-flow node; specify where one construct ends and another begins.
3. Adapt templates to `[]`, bindings to `@name`, and package configuration to
   DEC-094 manifests. Keep the approved binding table unless the user explicitly
   selects a supersession.
4. Decide individually whether ellipsis, unsigned shifts, indexing, annotations,
   casts, lambda-body extent, method references and unbraced control flow are
   wanted. Some require source reshaping; some would change approved rules.
5. If exact historical source compatibility is required, resolve the draft
   defects first and explicitly authorize a compatibility recognizer/parser.
   Do not silently re-associate CST operators during semantic analysis.

Verification: `npm run build` passed. Terminal measurement used exported
`lexCore`; probes used exported `parseSource`, checking diagnostics, status and
compact tree signatures. Nine further assertions passed: complete parsing of
`f(a,b)`, `obj.f(x)`, `a+b*c`, `a=b=c`, `(x)->{x+1}` and
`a ? (b ? c : d) : e`; error status and the non-associative diagnostic for
`!!a`, `!a++` and `x->y->y`. No source code changed and no full-suite result is
claimed. The grammar's unspecified lexical rules and absent productions were
not inferred.
