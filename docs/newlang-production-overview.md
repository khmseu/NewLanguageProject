# `newlang.ye` production overview

This is an inventory of the 231 production occurrences in
[`Proposals/newlang.ye`](../Proposals/newlang.ye), not an endorsement of that
file as the current language grammar. Each entry gives its status,
the verbatim source production, and a link to that occurrence in the source.
Repeated names are listed separately at each definition.

## What is provisionally accepted

DEC-019 approves NewLang's object model and class-form concepts, including
classes with modifiers, optional type parameters, an optional superclass and
implemented interfaces, and bodies that can contain fields, methods,
constructors, and nested classes or interfaces. This is a model-level
acceptance, not approval of every RHS below. The following EBNF records that
accepted outline only; details such as member signatures and modifier
restrictions remain open.

```ebnf
class-declaration =
    [ modifier-list ], "class", identifier,
    [ template-parameters ], [ superclass ], [ implemented-interfaces ],
    class-body ;

template-parameters = "[", template-parameter-list, "]" ;
superclass = "extends", class-type ;
implemented-interfaces =
    "implements", interface-type, { ",", interface-type } ;
class-body =
    "{", { field | method | constructor | nested-class | nested-interface },
    "}" ;
```

Square brackets for template parameters follow DEC-011; the angle-bracket
`TypeParameters` and `TypeArguments` productions in the source are not accepted
forms. This EBNF is deliberately an outline, not a complete grammar. DEC-076
requires the parser to handle the language through the generic
operator/operand model rather than these as dedicated parser productions.

## SEM-003 adaptation (tentative)

SEM-003 maps a subset of the proposal's production names to source forms over
the existing CST. It is a **tentative semantic specification**, not an approved
supersession, a new parser grammar, or an implemented semantic analyzer. The
EBNF below makes its proposed source forms explicit; it does not change the
status of the verbatim source rules in the inventory. In particular, DEC-019's
accepted class model remains distinct from SEM-003's tentative declaration
syntax.

```ebnf
qualified-name = identifier, { ".", identifier } ;
sequence = sequence-element, { ";", sequence-element }, [ ";" ] ;
scope-body = "{", [ sequence ], "}" ;

constant-binding = "@", identifier, ":", expression ;
variable-binding = "@", identifier, ":=", ( type-expression | expression ) ;
type-binding = "@", identifier, "::=", type-expression ;
template-application = expression, "[", type-expression,
    { ",", type-expression }, "]" ;
parameterized-binding =
    "@", identifier, ":", "[", parameter-list, "]", expression ;

struct-definition =
    "@", identifier, "::=", "struct", scope-body, ";" ;
enum-definition =
    "@", identifier, "::=", "enum", "{",
    enumerator, { ",", enumerator }, "}", ";" ;
enumerator = identifier, [ "=", expression ] ;
set-definition =
    "@", identifier, "::=", "set", "{", type-expression, "}", ";" ;
class-definition =
    "@", identifier, "::=", "class", scope-body, ";" ;
interface-definition =
    "@", identifier, "::=", "interface", scope-body, ";" ;

function-value-binding = "@", identifier, ":", scope-body, ";" ;
function-type =
    "(", [ parameter-list ], ")", "->", "(", [ parameter-list ], ")" ;
parameter-list = parameter, { ",", parameter } ;
parameter = constant-binding | variable-binding ;
call = expression, "(", [ argument-list ], ")" ;
argument-list = expression, { ",", expression } ;
field-access = expression, ".", identifier ;

if-form =
    "if", "(", expression, ")", scope-body,
    [ "else", scope-body ], ";" ;
while-form =
    "while", "(", expression, ")", scope-body, ";" ;
for-form =
    "for", "(", [ expression ], ";", [ expression ], ";",
    [ expression ], ")", scope-body, ";" ;
return-form = "return", "(", [ expression ], ")", ";" ;
throw-form = "throw", "(", expression, ")", ";" ;
break-form = "break", ";" ;
continue-form = "continue", ";" ;
try-form =
    "try", scope-body,
    ( "catch", "(", type-expression, ")", scope-body,
      { "catch", "(", type-expression, ")", scope-body },
      [ "finally", scope-body ]
    | "finally", scope-body ), ";" ;
```

In this notation, expressions, types, names, and scope bodies are context-bound
operands rather than extra parser productions. Each form must be recognized
within one semicolon-separated sequence element; newline or adjacency does not
separate declarations. Empty parameter/argument groups denote empty lists in
those contexts only, and the final semicolon may leave an accepted empty
sequence tail. Lists, bindings, member/type validity, lookup, and transfer
behavior remain semantic questions. Grouping and operator binding remain those
of the approved parser rules.

The following crosswalk records SEM-003's production-specific adaptations and
limitations. `N`, `T`, `E`, and `B` in the source specification denote a name,
type expression, expression, and scope body; they are metanotation, not
predefined identifiers. The complete construct vocabulary and excluded forms
remain in [SEM-003](./design-research/Language-Design.md#sem-003--first-cst-compatible-adaptation-of-the-proposal-grammar).

| Proposal production names | SEM-003 source form | SEM-003 note |
| --- | --- | --- |
| `CompilationUnit`, `PackageInterfaceFile`, `RemotePackageDef`, `PackageExportsFile` | No adapted compilation-unit goal or source-based manifest form | DEC-094 governs manifests; export-source syntax remains open. |
| `Name`, `ModuleName`, `TypeName`, `PackageOrTypeName`, `ExpressionName`, `AmbiguousName` | `P.N` | Member paths use `.`; component resolution is contextual. |
| `ContextDeclaration`, `ImportDeclaration` | `package P.N;`, `import P.N;` | Resolve package context/imports through manifests; source path literals and download operations are not implied. |
| `ModuleDeclarationFile`, `DeclarationList`, `BlockStatements`, `BlockStatement`, `ClassBody`, `InterfaceBody`, `Block` | Semicolon-separated elements in `{ B }` scopes | No newline/adjacency separation; a final semicolon may leave an empty tail. |
| `ClassBodyDeclaration`, `ClassMemberDeclaration` | Scope sequence of separately recognized forms | No Java alternative list is retained as a dedicated parser rule; forms use name-first bindings and bounded sequence elements. |
| `FieldOrConstantDeclaration`, `FieldDeclaration`, `ConstantDeclaration`, `LocalVariableDeclaration`, `LocalVariableDeclarationStatement`, `VariableDeclarator`, `VariableDeclaratorId` | `@N : E`, `@N := T`, or `@N := E` | One name-first binding per sequence element; inference and initializer/type distinctions remain incomplete. |
| `TypeDeclaration` | `@N ::= T;` | Replaces the proposal's `typedef T N` ordering. |
| `Type`, `BasicType`, `UnannType`, `PrimitiveType`, `ReferenceType`, `ClassType`, `InterfaceType`, `TypeVariable` and related type aliases | Type-valued expressions, names/member paths, and applicable template application | The Java primitive-name list is not selected by this adaptation. |
| `ValueTypeDeclaration`, `ComposedTypeDeclaration`, `StructDeclaration` | `@N ::= struct { B };` | Members use name-first bindings; derivation syntax is excluded. |
| `OrdinalTypeDeclaration`, `EnumDeclaration`, `EnumDeclaratorList`, `EnumDeclarator` | `@N ::= enum { A, B };` with optional `A=E` | This is the custom enum shape, not the duplicate Java enum production; value rules remain open. |
| `SetDeclaration` | `@N ::= set { T };` | The scope contains one type expression; element restrictions and representation remain open. |
| `ReferenceTypeDeclaration`, `ClassDeclaration`, `NormalClassDeclaration` | `@N ::= class { B };` | Minimal class form; inheritance, modifiers, and constructors are deferred here. |
| `Superclass`, `Superinterfaces`, `ClassModifier` and other modifier productions | No adapted source form | These Java-derived details are not part of this first subset; DEC-019's model-level superclass/interface/modifier concepts remain distinct. |
| `InterfaceDeclaration`, `NormalInterfaceDeclaration`, `InterfaceMemberDeclaration` | `@N ::= interface { B };` | Requirements use binding/type forms, not Java method headers; conformance rules remain open. |
| `TypeParameters`, `TypeParameterList`, `TypeParameter`, `TypeArguments`, `TypeArgumentList`, `TypeArgument` | `F[T]` or `@N : [PARAMS] E` | Uses DEC-011/063 square brackets; bounds, wildcards, and diamond syntax are excluded. |
| `Result`, `MethodHeader`, `FormalParameterList`, `FormalParameters`, `FormalParameter`, `ArgumentList` | Parenthesized comma lists; `(INPARAMS)->(OUTPARAMS)` for function types | Uses name-first parameter bindings; varargs, receiver parameters, `void`, and throws clauses are excluded. |
| `MethodDeclaration`, `MethodDeclarator`, `MethodBody`, `InterfaceMethodDeclaration`, `LambdaBody` | `@f : { B };` | Models a function value, not Java method headers or expression-body lambdas; no explicit type/body combination is invented. |
| `ConstructorDeclaration`, `ConstructorDeclarator`, `ConstructorBody`, `ExplicitConstructorInvocation` | No adapted source form | Constructors and explicit `this`/`super` calls are deferred in SEM-003. |
| `MethodInvocation`, selected `Primary`/`PostfixExpression` alternatives | `f(a,b)`; `obj.f(x)`; optionally `f[T](a,b)` | Calls are APPLY to a grouped argument list; other primary/postfix alternatives remain excluded unless separately adapted. |
| `FieldAccess` | `obj.member`; `(f(x)).member` for access on a call result | Explicit grouping is needed for the latter tree shape; `super` forms are deferred. |
| `Expression`, `AssignmentExpression`, `LeftHandSide`, `Assignment`, `AssignmentOperator`, `StatementExpression`, `StatementExpressionList`, `ConstantExpression`, arithmetic/comparison/logical productions | Existing expression, assignment, and comma-list trees | Use current binding and associativity; target mutability, assignability, types, and constant requirements remain semantic checks. `instanceof`, `>>>`, and `>>>=` are excluded. |
| `ConditionalExpression` | `c ? a : b`; group a nested then-conditional, e.g. `c ? (d ? a : b) : e` | Follows DEC-056; no reassociation to the historical Java grammar. |
| `EmptyStatement` | Final empty sequence tail or `EMPTY` in an empty scope | No independent statement node is added. |
| `IfThenStatement`, `IfThenElseStatement`, `IfThenElseStatementNoShortIf`, `WhileStatement`, `WhileStatementNoShortIf` | `if(c){ B };`, `if(c){ B } else{ B };`, `while(c){ B };` | Braced-only forms; exact application spines are bounded to one sequence element; unbraced/dangling-else forms are excluded. |
| `BasicForStatement`, `BasicForStatementNoShortIf`, `ForInit`, `ForUpdate` | `for(INIT;COND;UPDATE){ B };` | Three header positions; omitted `EMPTY` slots are allowed only in this context; enhanced-for is not adapted. |
| `ReturnStatement`, `ThrowStatement`, `BreakStatement`, `ContinueStatement` | `return (E);`, `return ();`, `throw (E);`, `break;`, `continue;` | Grouping bounds return/throw operands; labels and transfer/exception behavior remain open. |
| `TryStatement`, `Catches`, `CatchClause`, `Finally` | `try{ B } catch(T){ B } finally{ B };` | Restricted adaptation; caught-value binding, union catches, resources, and exception matching remain open. |

SEM-003 also explicitly defers annotations, `@interface`, subranges, arrays and
indexing, lambdas with ungrouped expression bodies, casts, method references,
historical unary/postfix rules, unsigned shifts, `instanceof`, unbraced and
labeled statements, switch, do/while, enhanced-for, synchronized blocks, and
try-with-resources. See its deferred-production list for the full boundaries.

## Status key

- **M — model-level provisional:** The concept is covered by the accepted
  outline above. The linked production's exact RHS is not accepted verbatim;
  its helper rules, restrictions, and detailed syntax are still open.
- **O — open:** The source form is a proposal, and the current decisions do not
  settle its details. Package/import configuration and namespace details remain
  open under Q-012; declaration/type syntax is also constrained by DEC-011,
  DEC-051, and DEC-076.
- **J — not adopted:** This is from the Java-like grammar material in the file.
  DEC-019 adopts the object model, not every Java-like construct; the grammar's
  presence does not make these forms NewLang requirements.
- **D — duplicate definition:** Added alongside the section status on every
  occurrence of a name defined more than once in the source. The definitions
  overlap or conflict, so a canonical rule must be chosen before either can be
  treated as a single production.

## Production inventory

The entries below follow the exact order of production definitions in [`newlang.ye`](../Proposals/newlang.ye). Every occurrence is listed separately, including duplicate names, with its source RHS and an explicit provisional disposition. For each **M** entry, the linked EBNF is the accepted model-level outline only; for **O** and **J**, the note states why the proposal rule is not accepted. See the SEM-003 crosswalk above for tentative adaptations, which do not change these dispositions.

### 1. `CompilationUnit` — O

[Original production in `newlang.ye` (line 4)](../Proposals/newlang.ye#L4).

**Not provisionally accepted:** This proposal RHS is not a selected rule; its source spelling or detailed requirements remain unresolved and may conflict with DEC-011, DEC-051, DEC-076, or Q-012 as applicable. The SEM-003 crosswalk above records tentative alternatives only.

```text
CompilationUnit
:	'=I=' PackageImportsFile
|	'=E=' PackageExportsFile
|	'=M=' ModuleDeclarationFile
;
```

### 2. `PackageName` — O / D

[Original production in `newlang.ye` (line 10)](../Proposals/newlang.ye#L10).

**Not provisionally accepted:** This proposal RHS is not a selected rule; its source spelling or detailed requirements remain unresolved and may conflict with DEC-011, DEC-051, DEC-076, or Q-012 as applicable. The SEM-003 crosswalk above records tentative alternatives only.

```text
PackageName
:	Identifier
;
```

### 3. `SubPackageName` — O

[Original production in `newlang.ye` (line 14)](../Proposals/newlang.ye#L14).

**Not provisionally accepted:** This proposal RHS is not a selected rule; its source spelling or detailed requirements remain unresolved and may conflict with DEC-011, DEC-051, DEC-076, or Q-012 as applicable. The SEM-003 crosswalk above records tentative alternatives only.

```text
SubPackageName
:	Identifier
;
```

### 4. `PackageInterfaceFile` — O

[Original production in `newlang.ye` (line 20)](../Proposals/newlang.ye#L20).

**Not provisionally accepted:** This proposal RHS is not a selected rule; its source spelling or detailed requirements remain unresolved and may conflict with DEC-011, DEC-051, DEC-076, or Q-012 as applicable. The SEM-003 crosswalk above records tentative alternatives only.

```text
PackageInterfaceFile
:	'package' PackageName { RemotePackageDef }
;
```

### 5. `RemotePackageDef` — O

[Original production in `newlang.ye` (line 24)](../Proposals/newlang.ye#L24).

**Not provisionally accepted:** This proposal RHS is not a selected rule; its source spelling or detailed requirements remain unresolved and may conflict with DEC-011, DEC-051, DEC-076, or Q-012 as applicable. The SEM-003 crosswalk above records tentative alternatives only.

```text
RemotePackageDef
:	Identifier Literal
;
```

### 6. `PackageExportsFile` — O

[Original production in `newlang.ye` (line 30)](../Proposals/newlang.ye#L30).

**Not provisionally accepted:** This proposal RHS is not a selected rule; its source spelling or detailed requirements remain unresolved and may conflict with DEC-011, DEC-051, DEC-076, or Q-012 as applicable. The SEM-003 crosswalk above records tentative alternatives only.

```text
PackageExportsFile
:	'package' PackageName 'exports' ModuleName { ',' ModuleName } ';'
;
```

### 7. `ModuleName` — O

[Original production in `newlang.ye` (line 34)](../Proposals/newlang.ye#L34).

**Not provisionally accepted:** This proposal RHS is not a selected rule; its source spelling or detailed requirements remain unresolved and may conflict with DEC-011, DEC-051, DEC-076, or Q-012 as applicable. The SEM-003 crosswalk above records tentative alternatives only.

```text
ModuleName
:	{ SubPackageName '.' } Identifier
;
```

### 8. `ModuleDeclarationFile` — O

[Original production in `newlang.ye` (line 41)](../Proposals/newlang.ye#L41).

**Not provisionally accepted:** This proposal RHS is not a selected rule; its source spelling or detailed requirements remain unresolved and may conflict with DEC-011, DEC-051, DEC-076, or Q-012 as applicable. The SEM-003 crosswalk above records tentative alternatives only.

```text
ModuleDeclarationFile
:	ContextDeclaration { StructDeclaration }
;
```

### 9. `ContextDeclaration` — O

[Original production in `newlang.ye` (line 45)](../Proposals/newlang.ye#L45).

**Not provisionally accepted:** This proposal RHS is not a selected rule; its source spelling or detailed requirements remain unresolved and may conflict with DEC-011, DEC-051, DEC-076, or Q-012 as applicable. The SEM-003 crosswalk above records tentative alternatives only.

```text
ContextDeclaration
:	'package' PackageName { '.' SubPackageName } ';'
;
```

### 10. `Declaration` — O

[Original production in `newlang.ye` (line 51)](../Proposals/newlang.ye#L51).

**Not provisionally accepted:** This proposal RHS is not a selected rule; its source spelling or detailed requirements remain unresolved and may conflict with DEC-011, DEC-051, DEC-076, or Q-012 as applicable. The SEM-003 crosswalk above records tentative alternatives only.

```text
Declaration
:	{ Modifier } BasicDeclaration
;
```

### 11. `Modifier` — O

[Original production in `newlang.ye` (line 55)](../Proposals/newlang.ye#L55).

**Not provisionally accepted:** This proposal RHS is not a selected rule; its source spelling or detailed requirements remain unresolved and may conflict with DEC-011, DEC-051, DEC-076, or Q-012 as applicable. The SEM-003 crosswalk above records tentative alternatives only.

```text
Modifier
:	'abstract'
|	'default'
|	'final'
|	'native'
|	'private'
|	'protected'
|	'public'
|	'static'
|	'strictfp'
|	'synchronized'
|	'transient'
|	'volatile'
;
```

### 12. `BasicDeclaration` — O

[Original production in `newlang.ye` (line 70)](../Proposals/newlang.ye#L70).

**Not provisionally accepted:** This proposal RHS is not a selected rule; its source spelling or detailed requirements remain unresolved and may conflict with DEC-011, DEC-051, DEC-076, or Q-012 as applicable. The SEM-003 crosswalk above records tentative alternatives only.

```text
BasicDeclaration
:	ImportDeclaration
|	FieldOrConstantDeclaration
|	TypeDeclaration
;
```

### 13. `ImportDeclaration` — O

[Original production in `newlang.ye` (line 76)](../Proposals/newlang.ye#L76).

**Not provisionally accepted:** This proposal RHS is not a selected rule; its source spelling or detailed requirements remain unresolved and may conflict with DEC-011, DEC-051, DEC-076, or Q-012 as applicable. The SEM-003 crosswalk above records tentative alternatives only.

```text
ImportDeclaration
:	'import' Name ';'
;
```

### 14. `Name` — O

[Original production in `newlang.ye` (line 80)](../Proposals/newlang.ye#L80).

**Not provisionally accepted:** This proposal RHS is not a selected rule; its source spelling or detailed requirements remain unresolved and may conflict with DEC-011, DEC-051, DEC-076, or Q-012 as applicable. The SEM-003 crosswalk above records tentative alternatives only.

```text
Name
:	PackageName { '.' Identifier }
;
```

### 15. `FieldOrConstantDeclaration` — O

[Original production in `newlang.ye` (line 84)](../Proposals/newlang.ye#L84).

**Not provisionally accepted:** This proposal RHS is not a selected rule; its source spelling or detailed requirements remain unresolved and may conflict with DEC-011, DEC-051, DEC-076, or Q-012 as applicable. The SEM-003 crosswalk above records tentative alternatives only.

```text
FieldOrConstantDeclaration
:	[ TypeParameters ] Type VariableDeclaratorList ';'
;
```

### 16. `VariableDeclaratorList` — O / D

[Original production in `newlang.ye` (line 88)](../Proposals/newlang.ye#L88).

**Not provisionally accepted:** This proposal RHS is not a selected rule; its source spelling or detailed requirements remain unresolved and may conflict with DEC-011, DEC-051, DEC-076, or Q-012 as applicable. The SEM-003 crosswalk above records tentative alternatives only.

```text
VariableDeclaratorList
:	VariableDeclarator { ',' VariableDeclarator }
;
```

### 17. `VariableDeclarator` — O / D

[Original production in `newlang.ye` (line 92)](../Proposals/newlang.ye#L92).

**Not provisionally accepted:** This proposal RHS is not a selected rule; its source spelling or detailed requirements remain unresolved and may conflict with DEC-011, DEC-051, DEC-076, or Q-012 as applicable. The SEM-003 crosswalk above records tentative alternatives only.

```text
VariableDeclarator
:	Identifier [ '=' Expression ]
;
```

### 18. `TypeDeclaration` — O

[Original production in `newlang.ye` (line 96)](../Proposals/newlang.ye#L96).

**Not provisionally accepted:** This proposal RHS is not a selected rule; its source spelling or detailed requirements remain unresolved and may conflict with DEC-011, DEC-051, DEC-076, or Q-012 as applicable. The SEM-003 crosswalk above records tentative alternatives only.

```text
TypeDeclaration
:	'typedef' [ TypeParameters ] Type Identifier ';'
;
```

### 19. `Type` — O / D

[Original production in `newlang.ye` (line 102)](../Proposals/newlang.ye#L102).

**Not provisionally accepted:** This proposal RHS is not a selected rule; its source spelling or detailed requirements remain unresolved and may conflict with DEC-011, DEC-051, DEC-076, or Q-012 as applicable. The SEM-003 crosswalk above records tentative alternatives only.

```text
Type
:	BasicType [ TypeArguments ]
;
```

### 20. `BasicType` — O

[Original production in `newlang.ye` (line 106)](../Proposals/newlang.ye#L106).

**Not provisionally accepted:** This proposal RHS is not a selected rule; its source spelling or detailed requirements remain unresolved and may conflict with DEC-011, DEC-051, DEC-076, or Q-012 as applicable. The SEM-003 crosswalk above records tentative alternatives only.

```text
BasicType
:	Name
|	ValueTypeDeclaration
|	ReferenceTypeDeclaration
;
```

### 21. `ValueTypeDeclaration` — O

[Original production in `newlang.ye` (line 112)](../Proposals/newlang.ye#L112).

**Not provisionally accepted:** This proposal RHS is not a selected rule; its source spelling or detailed requirements remain unresolved and may conflict with DEC-011, DEC-051, DEC-076, or Q-012 as applicable. The SEM-003 crosswalk above records tentative alternatives only.

```text
ValueTypeDeclaration
:	OrdinalTypeDeclaration
|	ComposedTypeDeclaration
;
```

### 22. `OrdinalTypeDeclaration` — O

[Original production in `newlang.ye` (line 117)](../Proposals/newlang.ye#L117).

**Not provisionally accepted:** This proposal RHS is not a selected rule; its source spelling or detailed requirements remain unresolved and may conflict with DEC-011, DEC-051, DEC-076, or Q-012 as applicable. The SEM-003 crosswalk above records tentative alternatives only.

```text
OrdinalTypeDeclaration
:	EnumDeclaration
|	SubrangeDeclaration
;
```

### 23. `ComposedTypeDeclaration` — O

[Original production in `newlang.ye` (line 122)](../Proposals/newlang.ye#L122).

**Not provisionally accepted:** This proposal RHS is not a selected rule; its source spelling or detailed requirements remain unresolved and may conflict with DEC-011, DEC-051, DEC-076, or Q-012 as applicable. The SEM-003 crosswalk above records tentative alternatives only.

```text
ComposedTypeDeclaration
:	SetDeclaration
|	ArrayDeclaration
|	StructDeclaration
;
```

### 24. `ReferenceTypeDeclaration` — O

[Original production in `newlang.ye` (line 128)](../Proposals/newlang.ye#L128).

**Not provisionally accepted:** This proposal RHS is not a selected rule; its source spelling or detailed requirements remain unresolved and may conflict with DEC-011, DEC-051, DEC-076, or Q-012 as applicable. The SEM-003 crosswalk above records tentative alternatives only.

```text
ReferenceTypeDeclaration
:	ClassDeclaration
|	MixInDeclaration
;
```

### 25. `EnumDeclaration` — O / D

[Original production in `newlang.ye` (line 135)](../Proposals/newlang.ye#L135).

**Not provisionally accepted:** This proposal RHS is not a selected rule; its source spelling or detailed requirements remain unresolved and may conflict with DEC-011, DEC-051, DEC-076, or Q-012 as applicable. The SEM-003 crosswalk above records tentative alternatives only.

```text
EnumDeclaration
:	'enum' [ Derivation ] '{' [ EnumDeclaratorList [ ';' [ DeclarationList ] ] ] '}'
;
```

### 26. `EnumDeclaratorList` — O

[Original production in `newlang.ye` (line 139)](../Proposals/newlang.ye#L139).

**Not provisionally accepted:** This proposal RHS is not a selected rule; its source spelling or detailed requirements remain unresolved and may conflict with DEC-011, DEC-051, DEC-076, or Q-012 as applicable. The SEM-003 crosswalk above records tentative alternatives only.

```text
EnumDeclaratorList
:	EnumDeclarator { ',' EnumDeclarator }
;
```

### 27. `EnumDeclarator` — O

[Original production in `newlang.ye` (line 143)](../Proposals/newlang.ye#L143).

**Not provisionally accepted:** This proposal RHS is not a selected rule; its source spelling or detailed requirements remain unresolved and may conflict with DEC-011, DEC-051, DEC-076, or Q-012 as applicable. The SEM-003 crosswalk above records tentative alternatives only.

```text
EnumDeclarator
:	Identifier [ '=' Expression ]
;
```

### 28. `SubrangeDeclaration` — O

[Original production in `newlang.ye` (line 147)](../Proposals/newlang.ye#L147).

**Not provisionally accepted:** This proposal RHS is not a selected rule; its source spelling or detailed requirements remain unresolved and may conflict with DEC-011, DEC-051, DEC-076, or Q-012 as applicable. The SEM-003 crosswalk above records tentative alternatives only.

```text
SubrangeDeclaration
:	'range' [ Derivation ] '{' Expression '...' Expression [ ';' [ DeclarationList ] ] '}'
;
```

### 29. `SetDeclaration` — O

[Original production in `newlang.ye` (line 151)](../Proposals/newlang.ye#L151).

**Not provisionally accepted:** This proposal RHS is not a selected rule; its source spelling or detailed requirements remain unresolved and may conflict with DEC-011, DEC-051, DEC-076, or Q-012 as applicable. The SEM-003 crosswalk above records tentative alternatives only.

```text
SetDeclaration
:	'set' [ Derivation ] '{' Type [ ';' [ DeclarationList ] ] '}'
;
```

### 30. `ArrayDeclaration` — O

[Original production in `newlang.ye` (line 155)](../Proposals/newlang.ye#L155).

**Not provisionally accepted:** This proposal RHS is not a selected rule; its source spelling or detailed requirements remain unresolved and may conflict with DEC-011, DEC-051, DEC-076, or Q-012 as applicable. The SEM-003 crosswalk above records tentative alternatives only.

```text
ArrayDeclaration
:	'array' [ Derivation ] '{' Lambda [ ';' [ DeclarationList ] ] '}'
;
```

### 31. `StructDeclaration` — O

[Original production in `newlang.ye` (line 159)](../Proposals/newlang.ye#L159).

**Not provisionally accepted:** This proposal RHS is not a selected rule; its source spelling or detailed requirements remain unresolved and may conflict with DEC-011, DEC-051, DEC-076, or Q-012 as applicable. The SEM-003 crosswalk above records tentative alternatives only.

```text
StructDeclaration
:	'struct' [ Derivation ] '{' [ DeclarationList ] '}'
;
```

### 32. `DeclarationList` — O

[Original production in `newlang.ye` (line 163)](../Proposals/newlang.ye#L163).

**Not provisionally accepted:** This proposal RHS is not a selected rule; its source spelling or detailed requirements remain unresolved and may conflict with DEC-011, DEC-051, DEC-076, or Q-012 as applicable. The SEM-003 crosswalk above records tentative alternatives only.

```text
DeclarationList
:	Declaration { Declaration }
;
```

### 33. `ClassDeclaration` — M

[Original production in `newlang.ye` (line 169)](../Proposals/newlang.ye#L169).

**Accepted outline (not this RHS verbatim):** the accepted class form outline; see the approved [`class-declaration` EBNF](#what-is-provisionally-accepted). Detailed syntax for this production remains open.

```text
ClassDeclaration
:	NormalClassDeclaration
|	EnumDeclaration
;
```

### 34. `NormalClassDeclaration` — M

[Original production in `newlang.ye` (line 174)](../Proposals/newlang.ye#L174).

**Accepted outline (not this RHS verbatim):** the accepted class form outline; see the approved [`class-declaration` EBNF](#what-is-provisionally-accepted). Detailed syntax for this production remains open.

```text
NormalClassDeclaration
:	{ ClassModifier } 'class' Identifier [ TypeParameters ] [ Superclass ] [ Superinterfaces ] ClassBody
;
```

### 35. `ClassModifier` — O

[Original production in `newlang.ye` (line 178)](../Proposals/newlang.ye#L178).

**Not provisionally accepted:** This proposal RHS is not a selected rule; its source spelling or detailed requirements remain unresolved and may conflict with DEC-011, DEC-051, DEC-076, or Q-012 as applicable. The SEM-003 crosswalk above records tentative alternatives only.

```text
ClassModifier
:	Annotation
|	'public'
|	'protected'
|	'private'
|	'abstract'
|	'static'
|	'final'
|	'strictfp'
;
```

### 36. `TypeParameters` — O

[Original production in `newlang.ye` (line 189)](../Proposals/newlang.ye#L189).

**Not provisionally accepted:** This proposal RHS is not a selected rule; its source spelling or detailed requirements remain unresolved and may conflict with DEC-011, DEC-051, DEC-076, or Q-012 as applicable. The SEM-003 crosswalk above records tentative alternatives only.

```text
TypeParameters
:	'<' TypeParameterList '>'
;
```

### 37. `TypeParameterList` — O

[Original production in `newlang.ye` (line 193)](../Proposals/newlang.ye#L193).

**Not provisionally accepted:** This proposal RHS is not a selected rule; its source spelling or detailed requirements remain unresolved and may conflict with DEC-011, DEC-051, DEC-076, or Q-012 as applicable. The SEM-003 crosswalk above records tentative alternatives only.

```text
TypeParameterList
:	TypeParameter { ',' TypeParameter }
;
```

### 38. `Superclass` — M

[Original production in `newlang.ye` (line 197)](../Proposals/newlang.ye#L197).

**Accepted outline (not this RHS verbatim):** the accepted optional superclass outline; see the approved [`superclass` EBNF](#what-is-provisionally-accepted). Detailed syntax for this production remains open.

```text
Superclass
:	'extends' ClassType
;
```

### 39. `Superinterfaces` — M

[Original production in `newlang.ye` (line 201)](../Proposals/newlang.ye#L201).

**Accepted outline (not this RHS verbatim):** the accepted implemented-interface outline; see the approved [`implemented-interfaces` EBNF](#what-is-provisionally-accepted). Detailed syntax for this production remains open.

```text
Superinterfaces
:	'implements' InterfaceTypeList
;
```

### 40. `InterfaceTypeList` — O

[Original production in `newlang.ye` (line 205)](../Proposals/newlang.ye#L205).

**Not provisionally accepted:** This proposal RHS is not a selected rule; its source spelling or detailed requirements remain unresolved and may conflict with DEC-011, DEC-051, DEC-076, or Q-012 as applicable. The SEM-003 crosswalk above records tentative alternatives only.

```text
InterfaceTypeList
:	InterfaceType { ',' InterfaceType }
;
```

### 41. `ClassBody` — M

[Original production in `newlang.ye` (line 209)](../Proposals/newlang.ye#L209).

**Accepted outline (not this RHS verbatim):** the accepted class-body outline; see the approved [`class-body` EBNF](#what-is-provisionally-accepted). Detailed syntax for this production remains open.

```text
ClassBody
:	'{' { ClassBodyDeclaration } '}'
;
```

### 42. `ClassBodyDeclaration` — M

[Original production in `newlang.ye` (line 213)](../Proposals/newlang.ye#L213).

**Accepted outline (not this RHS verbatim):** the accepted class-body member outline; see the approved [`class-body` EBNF](#what-is-provisionally-accepted). Detailed syntax for this production remains open.

```text
ClassBodyDeclaration
:	ClassMemberDeclaration
|	InstanceInitializer
|	StaticInitializer
|	ConstructorDeclaration
|	ImportDeclaration
;
```

### 43. `ClassMemberDeclaration` — M

[Original production in `newlang.ye` (line 221)](../Proposals/newlang.ye#L221).

**Accepted outline (not this RHS verbatim):** the accepted class-body member outline; see the approved [`class-body` EBNF](#what-is-provisionally-accepted). Detailed syntax for this production remains open.

```text
ClassMemberDeclaration
:	FieldDeclaration
|	MethodDeclaration
|	ClassDeclaration
|	InterfaceDeclaration
|	';'
;
```

### 44. `FieldDeclaration` — M

[Original production in `newlang.ye` (line 229)](../Proposals/newlang.ye#L229).

**Accepted outline (not this RHS verbatim):** the accepted field-member outline; see the approved [`class-body` EBNF](#what-is-provisionally-accepted). Detailed syntax for this production remains open.

```text
FieldDeclaration
:	{ FieldModifier } UnannType VariableDeclaratorList ';'
;
```

### 45. `FieldModifier` — O

[Original production in `newlang.ye` (line 233)](../Proposals/newlang.ye#L233).

**Not provisionally accepted:** This proposal RHS is not a selected rule; its source spelling or detailed requirements remain unresolved and may conflict with DEC-011, DEC-051, DEC-076, or Q-012 as applicable. The SEM-003 crosswalk above records tentative alternatives only.

```text
FieldModifier
:	Annotation
|	'public'
|	'protected'
|	'private'
|	'static'
|	'final'
|	'transient'
|	'volatile'
;
```

### 46. `VariableDeclaratorList` — O / D

[Original production in `newlang.ye` (line 244)](../Proposals/newlang.ye#L244).

**Not provisionally accepted:** This proposal RHS is not a selected rule; its source spelling or detailed requirements remain unresolved and may conflict with DEC-011, DEC-051, DEC-076, or Q-012 as applicable. The SEM-003 crosswalk above records tentative alternatives only.

```text
VariableDeclaratorList
:	VariableDeclarator { ',' VariableDeclarator }
;
```

### 47. `VariableDeclarator` — O / D

[Original production in `newlang.ye` (line 248)](../Proposals/newlang.ye#L248).

**Not provisionally accepted:** This proposal RHS is not a selected rule; its source spelling or detailed requirements remain unresolved and may conflict with DEC-011, DEC-051, DEC-076, or Q-012 as applicable. The SEM-003 crosswalk above records tentative alternatives only.

```text
VariableDeclarator
:	VariableDeclaratorId [ '=' VariableInitializer ]
;
```

### 48. `VariableDeclaratorId` — O

[Original production in `newlang.ye` (line 252)](../Proposals/newlang.ye#L252).

**Not provisionally accepted:** This proposal RHS is not a selected rule; its source spelling or detailed requirements remain unresolved and may conflict with DEC-011, DEC-051, DEC-076, or Q-012 as applicable. The SEM-003 crosswalk above records tentative alternatives only.

```text
VariableDeclaratorId
:	Identifier [ Dims ]
;
```

### 49. `VariableInitializer` — O

[Original production in `newlang.ye` (line 256)](../Proposals/newlang.ye#L256).

**Not provisionally accepted:** This proposal RHS is not a selected rule; its source spelling or detailed requirements remain unresolved and may conflict with DEC-011, DEC-051, DEC-076, or Q-012 as applicable. The SEM-003 crosswalk above records tentative alternatives only.

```text
VariableInitializer
:	Expression
|	ArrayInitializer
;
```

### 50. `UnannType` — O

[Original production in `newlang.ye` (line 261)](../Proposals/newlang.ye#L261).

**Not provisionally accepted:** This proposal RHS is not a selected rule; its source spelling or detailed requirements remain unresolved and may conflict with DEC-011, DEC-051, DEC-076, or Q-012 as applicable. The SEM-003 crosswalk above records tentative alternatives only.

```text
UnannType
:	UnannPrimitiveType
|	UnannReferenceType
;
```

### 51. `UnannPrimitiveType` — O

[Original production in `newlang.ye` (line 266)](../Proposals/newlang.ye#L266).

**Not provisionally accepted:** This proposal RHS is not a selected rule; its source spelling or detailed requirements remain unresolved and may conflict with DEC-011, DEC-051, DEC-076, or Q-012 as applicable. The SEM-003 crosswalk above records tentative alternatives only.

```text
UnannPrimitiveType
:	NumericType
|	'boolean'
;
```

### 52. `UnannReferenceType` — O

[Original production in `newlang.ye` (line 271)](../Proposals/newlang.ye#L271).

**Not provisionally accepted:** This proposal RHS is not a selected rule; its source spelling or detailed requirements remain unresolved and may conflict with DEC-011, DEC-051, DEC-076, or Q-012 as applicable. The SEM-003 crosswalk above records tentative alternatives only.

```text
UnannReferenceType
:	UnannClassOrInterfaceType
|	UnannTypeVariable
|	UnannArrayType
;
```

### 53. `UnannClassOrInterfaceType` — O

[Original production in `newlang.ye` (line 277)](../Proposals/newlang.ye#L277).

**Not provisionally accepted:** This proposal RHS is not a selected rule; its source spelling or detailed requirements remain unresolved and may conflict with DEC-011, DEC-051, DEC-076, or Q-012 as applicable. The SEM-003 crosswalk above records tentative alternatives only.

```text
UnannClassOrInterfaceType
:	UnannClassType
|	UnannInterfaceType
;
```

### 54. `UnannClassType` — O

[Original production in `newlang.ye` (line 282)](../Proposals/newlang.ye#L282).

**Not provisionally accepted:** This proposal RHS is not a selected rule; its source spelling or detailed requirements remain unresolved and may conflict with DEC-011, DEC-051, DEC-076, or Q-012 as applicable. The SEM-003 crosswalk above records tentative alternatives only.

```text
UnannClassType
:	Identifier [ TypeArguments ]
|	UnannClassOrInterfaceType '.' { Annotation } Identifier [ TypeArguments ]
;
```

### 55. `UnannInterfaceType` — O

[Original production in `newlang.ye` (line 287)](../Proposals/newlang.ye#L287).

**Not provisionally accepted:** This proposal RHS is not a selected rule; its source spelling or detailed requirements remain unresolved and may conflict with DEC-011, DEC-051, DEC-076, or Q-012 as applicable. The SEM-003 crosswalk above records tentative alternatives only.

```text
UnannInterfaceType
:	UnannClassType
;
```

### 56. `UnannTypeVariable` — O

[Original production in `newlang.ye` (line 291)](../Proposals/newlang.ye#L291).

**Not provisionally accepted:** This proposal RHS is not a selected rule; its source spelling or detailed requirements remain unresolved and may conflict with DEC-011, DEC-051, DEC-076, or Q-012 as applicable. The SEM-003 crosswalk above records tentative alternatives only.

```text
UnannTypeVariable
:	Identifier
;
```

### 57. `UnannArrayType` — O

[Original production in `newlang.ye` (line 295)](../Proposals/newlang.ye#L295).

**Not provisionally accepted:** This proposal RHS is not a selected rule; its source spelling or detailed requirements remain unresolved and may conflict with DEC-011, DEC-051, DEC-076, or Q-012 as applicable. The SEM-003 crosswalk above records tentative alternatives only.

```text
UnannArrayType
:	UnannPrimitiveType Dims
|	UnannClassOrInterfaceType Dims
|	UnannTypeVariable Dims
;
```

### 58. `MethodDeclaration` — M

[Original production in `newlang.ye` (line 301)](../Proposals/newlang.ye#L301).

**Accepted outline (not this RHS verbatim):** the accepted method-member outline; see the approved [`class-body` EBNF](#what-is-provisionally-accepted). Detailed syntax for this production remains open.

```text
MethodDeclaration
:	{ MethodModifier } MethodHeader MethodBody
;
```

### 59. `MethodModifier` — O

[Original production in `newlang.ye` (line 305)](../Proposals/newlang.ye#L305).

**Not provisionally accepted:** This proposal RHS is not a selected rule; its source spelling or detailed requirements remain unresolved and may conflict with DEC-011, DEC-051, DEC-076, or Q-012 as applicable. The SEM-003 crosswalk above records tentative alternatives only.

```text
MethodModifier
:	Annotation
|	'public'
|	'protected'
|	'private'
|	'abstract'
|	'static'
|	'final'
|	'synchronized'
|	'native'
|	'strictfp'
;
```

### 60. `MethodHeader` — O

[Original production in `newlang.ye` (line 318)](../Proposals/newlang.ye#L318).

**Not provisionally accepted:** This proposal RHS is not a selected rule; its source spelling or detailed requirements remain unresolved and may conflict with DEC-011, DEC-051, DEC-076, or Q-012 as applicable. The SEM-003 crosswalk above records tentative alternatives only.

```text
MethodHeader
:	Result MethodDeclarator [ Throws ]
|	TypeParameters { Annotation } Result MethodDeclarator [ Throws ]
;
```

### 61. `Result` — O

[Original production in `newlang.ye` (line 323)](../Proposals/newlang.ye#L323).

**Not provisionally accepted:** This proposal RHS is not a selected rule; its source spelling or detailed requirements remain unresolved and may conflict with DEC-011, DEC-051, DEC-076, or Q-012 as applicable. The SEM-003 crosswalk above records tentative alternatives only.

```text
Result
:	UnannType
|	'void'
;
```

### 62. `MethodDeclarator` — O

[Original production in `newlang.ye` (line 328)](../Proposals/newlang.ye#L328).

**Not provisionally accepted:** This proposal RHS is not a selected rule; its source spelling or detailed requirements remain unresolved and may conflict with DEC-011, DEC-051, DEC-076, or Q-012 as applicable. The SEM-003 crosswalk above records tentative alternatives only.

```text
MethodDeclarator
:	Identifier '(' [ FormalParameterList ] ')' [ Dims ]
;
```

### 63. `FormalParameterList` — O

[Original production in `newlang.ye` (line 332)](../Proposals/newlang.ye#L332).

**Not provisionally accepted:** This proposal RHS is not a selected rule; its source spelling or detailed requirements remain unresolved and may conflict with DEC-011, DEC-051, DEC-076, or Q-012 as applicable. The SEM-003 crosswalk above records tentative alternatives only.

```text
FormalParameterList
:	FormalParameters ',' LastFormalParameter
|	LastFormalParameter
;
```

### 64. `FormalParameters` — O

[Original production in `newlang.ye` (line 337)](../Proposals/newlang.ye#L337).

**Not provisionally accepted:** This proposal RHS is not a selected rule; its source spelling or detailed requirements remain unresolved and may conflict with DEC-011, DEC-051, DEC-076, or Q-012 as applicable. The SEM-003 crosswalk above records tentative alternatives only.

```text
FormalParameters
:	FormalParameter { ',' FormalParameter }
|	ReceiverParameter { ',' FormalParameter }
;
```

### 65. `FormalParameter` — O

[Original production in `newlang.ye` (line 342)](../Proposals/newlang.ye#L342).

**Not provisionally accepted:** This proposal RHS is not a selected rule; its source spelling or detailed requirements remain unresolved and may conflict with DEC-011, DEC-051, DEC-076, or Q-012 as applicable. The SEM-003 crosswalk above records tentative alternatives only.

```text
FormalParameter
:	{ VariableModifier } UnannType VariableDeclaratorId
;
```

### 66. `VariableModifier` — O

[Original production in `newlang.ye` (line 346)](../Proposals/newlang.ye#L346).

**Not provisionally accepted:** This proposal RHS is not a selected rule; its source spelling or detailed requirements remain unresolved and may conflict with DEC-011, DEC-051, DEC-076, or Q-012 as applicable. The SEM-003 crosswalk above records tentative alternatives only.

```text
VariableModifier
:	Annotation
|	'final'
;
```

### 67. `LastFormalParameter` — O

[Original production in `newlang.ye` (line 351)](../Proposals/newlang.ye#L351).

**Not provisionally accepted:** This proposal RHS is not a selected rule; its source spelling or detailed requirements remain unresolved and may conflict with DEC-011, DEC-051, DEC-076, or Q-012 as applicable. The SEM-003 crosswalk above records tentative alternatives only.

```text
LastFormalParameter
:	{ VariableModifier } UnannType { Annotation } '...' VariableDeclaratorId
|	FormalParameter
;
```

### 68. `ReceiverParameter` — O

[Original production in `newlang.ye` (line 356)](../Proposals/newlang.ye#L356).

**Not provisionally accepted:** This proposal RHS is not a selected rule; its source spelling or detailed requirements remain unresolved and may conflict with DEC-011, DEC-051, DEC-076, or Q-012 as applicable. The SEM-003 crosswalk above records tentative alternatives only.

```text
ReceiverParameter
:	{ Annotation } UnannType [ Identifier '.' ] 'this'
;
```

### 69. `Throws` — O

[Original production in `newlang.ye` (line 360)](../Proposals/newlang.ye#L360).

**Not provisionally accepted:** This proposal RHS is not a selected rule; its source spelling or detailed requirements remain unresolved and may conflict with DEC-011, DEC-051, DEC-076, or Q-012 as applicable. The SEM-003 crosswalk above records tentative alternatives only.

```text
Throws
:	'throws' ExceptionTypeList
;
```

### 70. `ExceptionTypeList` — O

[Original production in `newlang.ye` (line 364)](../Proposals/newlang.ye#L364).

**Not provisionally accepted:** This proposal RHS is not a selected rule; its source spelling or detailed requirements remain unresolved and may conflict with DEC-011, DEC-051, DEC-076, or Q-012 as applicable. The SEM-003 crosswalk above records tentative alternatives only.

```text
ExceptionTypeList
:	ExceptionType { ',' ExceptionType }
;
```

### 71. `ExceptionType` — O

[Original production in `newlang.ye` (line 368)](../Proposals/newlang.ye#L368).

**Not provisionally accepted:** This proposal RHS is not a selected rule; its source spelling or detailed requirements remain unresolved and may conflict with DEC-011, DEC-051, DEC-076, or Q-012 as applicable. The SEM-003 crosswalk above records tentative alternatives only.

```text
ExceptionType
:	ClassType
|	TypeVariable
;
```

### 72. `MethodBody` — O

[Original production in `newlang.ye` (line 373)](../Proposals/newlang.ye#L373).

**Not provisionally accepted:** This proposal RHS is not a selected rule; its source spelling or detailed requirements remain unresolved and may conflict with DEC-011, DEC-051, DEC-076, or Q-012 as applicable. The SEM-003 crosswalk above records tentative alternatives only.

```text
MethodBody
:	Block
|	';'
;
```

### 73. `InstanceInitializer` — O

[Original production in `newlang.ye` (line 378)](../Proposals/newlang.ye#L378).

**Not provisionally accepted:** This proposal RHS is not a selected rule; its source spelling or detailed requirements remain unresolved and may conflict with DEC-011, DEC-051, DEC-076, or Q-012 as applicable. The SEM-003 crosswalk above records tentative alternatives only.

```text
InstanceInitializer
:	Block
;
```

### 74. `StaticInitializer` — O

[Original production in `newlang.ye` (line 382)](../Proposals/newlang.ye#L382).

**Not provisionally accepted:** This proposal RHS is not a selected rule; its source spelling or detailed requirements remain unresolved and may conflict with DEC-011, DEC-051, DEC-076, or Q-012 as applicable. The SEM-003 crosswalk above records tentative alternatives only.

```text
StaticInitializer
:	'static' Block
;
```

### 75. `ConstructorDeclaration` — M

[Original production in `newlang.ye` (line 386)](../Proposals/newlang.ye#L386).

**Accepted outline (not this RHS verbatim):** the accepted constructor-member outline; see the approved [`class-body` EBNF](#what-is-provisionally-accepted). Detailed syntax for this production remains open.

```text
ConstructorDeclaration
:	{ ConstructorModifier } ConstructorDeclarator [ Throws ] ConstructorBody
;
```

### 76. `ConstructorModifier` — O

[Original production in `newlang.ye` (line 390)](../Proposals/newlang.ye#L390).

**Not provisionally accepted:** This proposal RHS is not a selected rule; its source spelling or detailed requirements remain unresolved and may conflict with DEC-011, DEC-051, DEC-076, or Q-012 as applicable. The SEM-003 crosswalk above records tentative alternatives only.

```text
ConstructorModifier
:	Annotation
|	'public'
|	'protected'
|	'private'
;
```

### 77. `ConstructorDeclarator` — O

[Original production in `newlang.ye` (line 397)](../Proposals/newlang.ye#L397).

**Not provisionally accepted:** This proposal RHS is not a selected rule; its source spelling or detailed requirements remain unresolved and may conflict with DEC-011, DEC-051, DEC-076, or Q-012 as applicable. The SEM-003 crosswalk above records tentative alternatives only.

```text
ConstructorDeclarator
:	[ TypeParameters ] SimpleTypeName '(' [ FormalParameterList ] ')'
;
```

### 78. `ConstructorBody` — O

[Original production in `newlang.ye` (line 401)](../Proposals/newlang.ye#L401).

**Not provisionally accepted:** This proposal RHS is not a selected rule; its source spelling or detailed requirements remain unresolved and may conflict with DEC-011, DEC-051, DEC-076, or Q-012 as applicable. The SEM-003 crosswalk above records tentative alternatives only.

```text
ConstructorBody
:	'{' [ ExplicitConstructorInvocation ] [ BlockStatements ] '}'
;
```

### 79. `ExplicitConstructorInvocation` — O

[Original production in `newlang.ye` (line 405)](../Proposals/newlang.ye#L405).

**Not provisionally accepted:** This proposal RHS is not a selected rule; its source spelling or detailed requirements remain unresolved and may conflict with DEC-011, DEC-051, DEC-076, or Q-012 as applicable. The SEM-003 crosswalk above records tentative alternatives only.

```text
ExplicitConstructorInvocation
:	[ TypeArguments ] 'this' '(' [ ArgumentList ] ')' ';'
|	[ TypeArguments ] 'super' '(' [ ArgumentList ] ')' ';'
|	ExpressionName '.' [ TypeArguments ] 'super' '(' [ ArgumentList ] ')' ';'
|	Primary '.' [ TypeArguments ] 'super' '(' [ ArgumentList ] ')' ';'
;
```

### 80. `EnumDeclaration` — J / D

[Original production in `newlang.ye` (line 412)](../Proposals/newlang.ye#L412).

**Not provisionally accepted:** This Java-like rule is not selected by DEC-019, which accepts the NewLang object model rather than Java grammar. Related forms are deferred or governed by the generic syntax in DEC-076; see the deferrals and crosswalk above.

```text
EnumDeclaration
:	{ ClassModifier } 'enum' Identifier [ Superinterfaces ] EnumBody
;
```

### 81. `EnumBody` — J

[Original production in `newlang.ye` (line 416)](../Proposals/newlang.ye#L416).

**Not provisionally accepted:** This Java-like rule is not selected by DEC-019, which accepts the NewLang object model rather than Java grammar. Related forms are deferred or governed by the generic syntax in DEC-076; see the deferrals and crosswalk above.

```text
EnumBody
:	'{' [ EnumConstantList ] [ ',' ] [ EnumBodyDeclarations ] '}'
;
```

### 82. `EnumConstantList` — J

[Original production in `newlang.ye` (line 420)](../Proposals/newlang.ye#L420).

**Not provisionally accepted:** This Java-like rule is not selected by DEC-019, which accepts the NewLang object model rather than Java grammar. Related forms are deferred or governed by the generic syntax in DEC-076; see the deferrals and crosswalk above.

```text
EnumConstantList
:	EnumConstant { ',' EnumConstant }
;
```

### 83. `EnumConstant` — J

[Original production in `newlang.ye` (line 424)](../Proposals/newlang.ye#L424).

**Not provisionally accepted:** This Java-like rule is not selected by DEC-019, which accepts the NewLang object model rather than Java grammar. Related forms are deferred or governed by the generic syntax in DEC-076; see the deferrals and crosswalk above.

```text
EnumConstant
:	{ EnumConstantModifier } Identifier [ '(' [ ArgumentList ] ')' ] [ ClassBody ]
;
```

### 84. `EnumConstantModifier` — J

[Original production in `newlang.ye` (line 428)](../Proposals/newlang.ye#L428).

**Not provisionally accepted:** This Java-like rule is not selected by DEC-019, which accepts the NewLang object model rather than Java grammar. Related forms are deferred or governed by the generic syntax in DEC-076; see the deferrals and crosswalk above.

```text
EnumConstantModifier
:	Annotation
;
```

### 85. `EnumBodyDeclarations` — J

[Original production in `newlang.ye` (line 432)](../Proposals/newlang.ye#L432).

**Not provisionally accepted:** This Java-like rule is not selected by DEC-019, which accepts the NewLang object model rather than Java grammar. Related forms are deferred or governed by the generic syntax in DEC-076; see the deferrals and crosswalk above.

```text
EnumBodyDeclarations
:	';' { ClassBodyDeclaration }
;
```

### 86. `InterfaceDeclaration` — M

[Original production in `newlang.ye` (line 438)](../Proposals/newlang.ye#L438).

**Accepted outline (not this RHS verbatim):** the accepted nested-interface outline; see the approved [`class-body` EBNF](#what-is-provisionally-accepted). Detailed syntax for this production remains open.

```text
InterfaceDeclaration
:	NormalInterfaceDeclaration
|	AnnotationTypeDeclaration
;
```

### 87. `NormalInterfaceDeclaration` — M

[Original production in `newlang.ye` (line 443)](../Proposals/newlang.ye#L443).

**Accepted outline (not this RHS verbatim):** the accepted nested-interface outline; see the approved [`class-body` EBNF](#what-is-provisionally-accepted). Detailed syntax for this production remains open.

```text
NormalInterfaceDeclaration
:	{ InterfaceModifier } 'interface' Identifier [ TypeParameters ] [ ExtendsInterfaces ] InterfaceBody
;
```

### 88. `InterfaceModifier` — O

[Original production in `newlang.ye` (line 447)](../Proposals/newlang.ye#L447).

**Not provisionally accepted:** This proposal RHS is not a selected rule; its source spelling or detailed requirements remain unresolved and may conflict with DEC-011, DEC-051, DEC-076, or Q-012 as applicable. The SEM-003 crosswalk above records tentative alternatives only.

```text
InterfaceModifier
:	Annotation
|	'public'
|	'protected'
|	'private'
|	'abstract'
|	'static'
|	'strictfp'
;
```

### 89. `ExtendsInterfaces` — O

[Original production in `newlang.ye` (line 457)](../Proposals/newlang.ye#L457).

**Not provisionally accepted:** This proposal RHS is not a selected rule; its source spelling or detailed requirements remain unresolved and may conflict with DEC-011, DEC-051, DEC-076, or Q-012 as applicable. The SEM-003 crosswalk above records tentative alternatives only.

```text
ExtendsInterfaces
:	'extends' InterfaceTypeList
;
```

### 90. `InterfaceBody` — M

[Original production in `newlang.ye` (line 461)](../Proposals/newlang.ye#L461).

**Accepted outline (not this RHS verbatim):** the accepted nested-interface body outline; see the approved [`class-body` EBNF](#what-is-provisionally-accepted). Detailed syntax for this production remains open.

```text
InterfaceBody
:	'{' { InterfaceMemberDeclaration } '}'
;
```

### 91. `InterfaceMemberDeclaration` — M

[Original production in `newlang.ye` (line 465)](../Proposals/newlang.ye#L465).

**Accepted outline (not this RHS verbatim):** the accepted nested-interface member outline; see the approved [`class-body` EBNF](#what-is-provisionally-accepted). Detailed syntax for this production remains open.

```text
InterfaceMemberDeclaration
:	ConstantDeclaration
|	InterfaceMethodDeclaration
|	ClassDeclaration
|	InterfaceDeclaration
|	';'
;
```

### 92. `ConstantDeclaration` — J

[Original production in `newlang.ye` (line 473)](../Proposals/newlang.ye#L473).

**Not provisionally accepted:** This Java-like rule is not selected by DEC-019, which accepts the NewLang object model rather than Java grammar. Related forms are deferred or governed by the generic syntax in DEC-076; see the deferrals and crosswalk above.

```text
ConstantDeclaration
:	{ ConstantModifier } UnannType VariableDeclaratorList ';'
;
```

### 93. `ConstantModifier` — J

[Original production in `newlang.ye` (line 477)](../Proposals/newlang.ye#L477).

**Not provisionally accepted:** This Java-like rule is not selected by DEC-019, which accepts the NewLang object model rather than Java grammar. Related forms are deferred or governed by the generic syntax in DEC-076; see the deferrals and crosswalk above.

```text
ConstantModifier
:	Annotation
|	'public'
|	'static'
|	'final'
;
```

### 94. `InterfaceMethodDeclaration` — J

[Original production in `newlang.ye` (line 484)](../Proposals/newlang.ye#L484).

**Not provisionally accepted:** This Java-like rule is not selected by DEC-019, which accepts the NewLang object model rather than Java grammar. Related forms are deferred or governed by the generic syntax in DEC-076; see the deferrals and crosswalk above.

```text
InterfaceMethodDeclaration
:	{ InterfaceMethodModifier } MethodHeader MethodBody
;
```

### 95. `InterfaceMethodModifier` — J

[Original production in `newlang.ye` (line 488)](../Proposals/newlang.ye#L488).

**Not provisionally accepted:** This Java-like rule is not selected by DEC-019, which accepts the NewLang object model rather than Java grammar. Related forms are deferred or governed by the generic syntax in DEC-076; see the deferrals and crosswalk above.

```text
InterfaceMethodModifier
:	Annotation
|	'public'
|	'abstract'
|	'default'
|	'static'
|	'strictfp'
;
```

### 96. `AnnotationTypeDeclaration` — J

[Original production in `newlang.ye` (line 497)](../Proposals/newlang.ye#L497).

**Not provisionally accepted:** This Java-like rule is not selected by DEC-019, which accepts the NewLang object model rather than Java grammar. Related forms are deferred or governed by the generic syntax in DEC-076; see the deferrals and crosswalk above.

```text
AnnotationTypeDeclaration
:	{ InterfaceModifier } '@' 'interface' Identifier AnnotationTypeBody
;
```

### 97. `AnnotationTypeBody` — J

[Original production in `newlang.ye` (line 501)](../Proposals/newlang.ye#L501).

**Not provisionally accepted:** This Java-like rule is not selected by DEC-019, which accepts the NewLang object model rather than Java grammar. Related forms are deferred or governed by the generic syntax in DEC-076; see the deferrals and crosswalk above.

```text
AnnotationTypeBody
:	'{' { AnnotationTypeMemberDeclaration } '}'
;
```

### 98. `AnnotationTypeMemberDeclaration` — J

[Original production in `newlang.ye` (line 505)](../Proposals/newlang.ye#L505).

**Not provisionally accepted:** This Java-like rule is not selected by DEC-019, which accepts the NewLang object model rather than Java grammar. Related forms are deferred or governed by the generic syntax in DEC-076; see the deferrals and crosswalk above.

```text
AnnotationTypeMemberDeclaration
:	AnnotationTypeElementDeclaration
|	ConstantDeclaration
|	ClassDeclaration
|	InterfaceDeclaration
|	';'
;
```

### 99. `AnnotationTypeElementDeclaration` — J

[Original production in `newlang.ye` (line 513)](../Proposals/newlang.ye#L513).

**Not provisionally accepted:** This Java-like rule is not selected by DEC-019, which accepts the NewLang object model rather than Java grammar. Related forms are deferred or governed by the generic syntax in DEC-076; see the deferrals and crosswalk above.

```text
AnnotationTypeElementDeclaration
:	{ AnnotationTypeElementModifier } UnannType Identifier '(' ')' [ Dims ] [ DefaultValue ] ';'
;
```

### 100. `AnnotationTypeElementModifier` — J

[Original production in `newlang.ye` (line 517)](../Proposals/newlang.ye#L517).

**Not provisionally accepted:** This Java-like rule is not selected by DEC-019, which accepts the NewLang object model rather than Java grammar. Related forms are deferred or governed by the generic syntax in DEC-076; see the deferrals and crosswalk above.

```text
AnnotationTypeElementModifier
:	Annotation
|	'public'
|	'abstract'
;
```

### 101. `DefaultValue` — J

[Original production in `newlang.ye` (line 523)](../Proposals/newlang.ye#L523).

**Not provisionally accepted:** This Java-like rule is not selected by DEC-019, which accepts the NewLang object model rather than Java grammar. Related forms are deferred or governed by the generic syntax in DEC-076; see the deferrals and crosswalk above.

```text
DefaultValue
:	'default' ElementValue
;
```

### 102. `Annotation` — J

[Original production in `newlang.ye` (line 527)](../Proposals/newlang.ye#L527).

**Not provisionally accepted:** This Java-like rule is not selected by DEC-019, which accepts the NewLang object model rather than Java grammar. Related forms are deferred or governed by the generic syntax in DEC-076; see the deferrals and crosswalk above.

```text
Annotation
:	NormalAnnotation
|	MarkerAnnotation
|	SingleElementAnnotation
;
```

### 103. `NormalAnnotation` — J

[Original production in `newlang.ye` (line 533)](../Proposals/newlang.ye#L533).

**Not provisionally accepted:** This Java-like rule is not selected by DEC-019, which accepts the NewLang object model rather than Java grammar. Related forms are deferred or governed by the generic syntax in DEC-076; see the deferrals and crosswalk above.

```text
NormalAnnotation
:	'@' TypeName '(' [ ElementValuePairList ] ')'
;
```

### 104. `ElementValuePairList` — J

[Original production in `newlang.ye` (line 537)](../Proposals/newlang.ye#L537).

**Not provisionally accepted:** This Java-like rule is not selected by DEC-019, which accepts the NewLang object model rather than Java grammar. Related forms are deferred or governed by the generic syntax in DEC-076; see the deferrals and crosswalk above.

```text
ElementValuePairList
:	ElementValuePair { ',' ElementValuePair }
;
```

### 105. `ElementValuePair` — J

[Original production in `newlang.ye` (line 541)](../Proposals/newlang.ye#L541).

**Not provisionally accepted:** This Java-like rule is not selected by DEC-019, which accepts the NewLang object model rather than Java grammar. Related forms are deferred or governed by the generic syntax in DEC-076; see the deferrals and crosswalk above.

```text
ElementValuePair
:	Identifier '=' ElementValue
;
```

### 106. `ElementValue` — J

[Original production in `newlang.ye` (line 545)](../Proposals/newlang.ye#L545).

**Not provisionally accepted:** This Java-like rule is not selected by DEC-019, which accepts the NewLang object model rather than Java grammar. Related forms are deferred or governed by the generic syntax in DEC-076; see the deferrals and crosswalk above.

```text
ElementValue
:	ConditionalExpression
|	ElementValueArrayInitializer
|	Annotation
;
```

### 107. `ElementValueArrayInitializer` — J

[Original production in `newlang.ye` (line 551)](../Proposals/newlang.ye#L551).

**Not provisionally accepted:** This Java-like rule is not selected by DEC-019, which accepts the NewLang object model rather than Java grammar. Related forms are deferred or governed by the generic syntax in DEC-076; see the deferrals and crosswalk above.

```text
ElementValueArrayInitializer
:	'{' [ ElementValueList ] [ ',' ] '}'
;
```

### 108. `ElementValueList` — J

[Original production in `newlang.ye` (line 555)](../Proposals/newlang.ye#L555).

**Not provisionally accepted:** This Java-like rule is not selected by DEC-019, which accepts the NewLang object model rather than Java grammar. Related forms are deferred or governed by the generic syntax in DEC-076; see the deferrals and crosswalk above.

```text
ElementValueList
:	ElementValue { ',' ElementValue }
;
```

### 109. `MarkerAnnotation` — J

[Original production in `newlang.ye` (line 559)](../Proposals/newlang.ye#L559).

**Not provisionally accepted:** This Java-like rule is not selected by DEC-019, which accepts the NewLang object model rather than Java grammar. Related forms are deferred or governed by the generic syntax in DEC-076; see the deferrals and crosswalk above.

```text
MarkerAnnotation
:	'@' TypeName
;
```

### 110. `SingleElementAnnotation` — J

[Original production in `newlang.ye` (line 563)](../Proposals/newlang.ye#L563).

**Not provisionally accepted:** This Java-like rule is not selected by DEC-019, which accepts the NewLang object model rather than Java grammar. Related forms are deferred or governed by the generic syntax in DEC-076; see the deferrals and crosswalk above.

```text
SingleElementAnnotation
:	'@' TypeName '(' ElementValue ')'
;
```

### 111. `ArrayInitializer` — J

[Original production in `newlang.ye` (line 569)](../Proposals/newlang.ye#L569).

**Not provisionally accepted:** This Java-like rule is not selected by DEC-019, which accepts the NewLang object model rather than Java grammar. Related forms are deferred or governed by the generic syntax in DEC-076; see the deferrals and crosswalk above.

```text
ArrayInitializer
:	{ [ VariableInitializerList ] [ ',' ] }
;
```

### 112. `VariableInitializerList` — J

[Original production in `newlang.ye` (line 573)](../Proposals/newlang.ye#L573).

**Not provisionally accepted:** This Java-like rule is not selected by DEC-019, which accepts the NewLang object model rather than Java grammar. Related forms are deferred or governed by the generic syntax in DEC-076; see the deferrals and crosswalk above.

```text
VariableInitializerList
:	VariableInitializer { ',' VariableInitializer }
;
```

### 113. `Block` — J

[Original production in `newlang.ye` (line 579)](../Proposals/newlang.ye#L579).

**Not provisionally accepted:** This Java-like rule is not selected by DEC-019, which accepts the NewLang object model rather than Java grammar. Related forms are deferred or governed by the generic syntax in DEC-076; see the deferrals and crosswalk above.

```text
Block
:	'{' [ BlockStatements ] '}'
;
```

### 114. `BlockStatements` — J

[Original production in `newlang.ye` (line 583)](../Proposals/newlang.ye#L583).

**Not provisionally accepted:** This Java-like rule is not selected by DEC-019, which accepts the NewLang object model rather than Java grammar. Related forms are deferred or governed by the generic syntax in DEC-076; see the deferrals and crosswalk above.

```text
BlockStatements
:	BlockStatement { BlockStatement }
;
```

### 115. `BlockStatement` — J

[Original production in `newlang.ye` (line 587)](../Proposals/newlang.ye#L587).

**Not provisionally accepted:** This Java-like rule is not selected by DEC-019, which accepts the NewLang object model rather than Java grammar. Related forms are deferred or governed by the generic syntax in DEC-076; see the deferrals and crosswalk above.

```text
BlockStatement
:	LocalVariableDeclarationStatement
|	ClassDeclaration
|	Statement
;
```

### 116. `LocalVariableDeclarationStatement` — J

[Original production in `newlang.ye` (line 593)](../Proposals/newlang.ye#L593).

**Not provisionally accepted:** This Java-like rule is not selected by DEC-019, which accepts the NewLang object model rather than Java grammar. Related forms are deferred or governed by the generic syntax in DEC-076; see the deferrals and crosswalk above.

```text
LocalVariableDeclarationStatement
:	LocalVariableDeclaration ';'
;
```

### 117. `LocalVariableDeclaration` — J

[Original production in `newlang.ye` (line 597)](../Proposals/newlang.ye#L597).

**Not provisionally accepted:** This Java-like rule is not selected by DEC-019, which accepts the NewLang object model rather than Java grammar. Related forms are deferred or governed by the generic syntax in DEC-076; see the deferrals and crosswalk above.

```text
LocalVariableDeclaration
:	{ VariableModifier } UnannType VariableDeclaratorList
;
```

### 118. `Statement` — J

[Original production in `newlang.ye` (line 601)](../Proposals/newlang.ye#L601).

**Not provisionally accepted:** This Java-like rule is not selected by DEC-019, which accepts the NewLang object model rather than Java grammar. Related forms are deferred or governed by the generic syntax in DEC-076; see the deferrals and crosswalk above.

```text
Statement
:	StatementWithoutTrailingSubstatement
|	LabeledStatement
|	IfThenStatement
|	IfThenElseStatement
|	WhileStatement
|	ForStatement
;
```

### 119. `StatementNoShortIf` — J

[Original production in `newlang.ye` (line 610)](../Proposals/newlang.ye#L610).

**Not provisionally accepted:** This Java-like rule is not selected by DEC-019, which accepts the NewLang object model rather than Java grammar. Related forms are deferred or governed by the generic syntax in DEC-076; see the deferrals and crosswalk above.

```text
StatementNoShortIf
:	StatementWithoutTrailingSubstatement
|	LabeledStatementNoShortIf
|	IfThenElseStatementNoShortIf
|	WhileStatementNoShortIf
|	ForStatementNoShortIf
;
```

### 120. `StatementWithoutTrailingSubstatement` — J

[Original production in `newlang.ye` (line 618)](../Proposals/newlang.ye#L618).

**Not provisionally accepted:** This Java-like rule is not selected by DEC-019, which accepts the NewLang object model rather than Java grammar. Related forms are deferred or governed by the generic syntax in DEC-076; see the deferrals and crosswalk above.

```text
StatementWithoutTrailingSubstatement
:	Block
|	EmptyStatement
|	ExpressionStatement
|	AssertStatement
|	SwitchStatement
|	DoStatement
|	BreakStatement
|	ContinueStatement
|	ReturnStatement
|	SynchronizedStatement
|	ThrowStatement
|	TryStatement
;
```

### 121. `EmptyStatement` — J

[Original production in `newlang.ye` (line 633)](../Proposals/newlang.ye#L633).

**Not provisionally accepted:** This Java-like rule is not selected by DEC-019, which accepts the NewLang object model rather than Java grammar. Related forms are deferred or governed by the generic syntax in DEC-076; see the deferrals and crosswalk above.

```text
EmptyStatement
:	';'
;
```

### 122. `LabeledStatement` — J

[Original production in `newlang.ye` (line 637)](../Proposals/newlang.ye#L637).

**Not provisionally accepted:** This Java-like rule is not selected by DEC-019, which accepts the NewLang object model rather than Java grammar. Related forms are deferred or governed by the generic syntax in DEC-076; see the deferrals and crosswalk above.

```text
LabeledStatement
:	Identifier ':' Statement
;
```

### 123. `LabeledStatementNoShortIf` — J

[Original production in `newlang.ye` (line 641)](../Proposals/newlang.ye#L641).

**Not provisionally accepted:** This Java-like rule is not selected by DEC-019, which accepts the NewLang object model rather than Java grammar. Related forms are deferred or governed by the generic syntax in DEC-076; see the deferrals and crosswalk above.

```text
LabeledStatementNoShortIf
:	Identifier ':' StatementNoShortIf
;
```

### 124. `ExpressionStatement` — J

[Original production in `newlang.ye` (line 645)](../Proposals/newlang.ye#L645).

**Not provisionally accepted:** This Java-like rule is not selected by DEC-019, which accepts the NewLang object model rather than Java grammar. Related forms are deferred or governed by the generic syntax in DEC-076; see the deferrals and crosswalk above.

```text
ExpressionStatement
:	StatementExpression ';'
;
```

### 125. `StatementExpression` — J

[Original production in `newlang.ye` (line 649)](../Proposals/newlang.ye#L649).

**Not provisionally accepted:** This Java-like rule is not selected by DEC-019, which accepts the NewLang object model rather than Java grammar. Related forms are deferred or governed by the generic syntax in DEC-076; see the deferrals and crosswalk above.

```text
StatementExpression
:	Assignment
|	PreIncrementExpression
|	PreDecrementExpression
|	PostIncrementExpression
|	PostDecrementExpression
|	MethodInvocation
|	ClassInstanceCreationExpression
;
```

### 126. `IfThenStatement` — J

[Original production in `newlang.ye` (line 659)](../Proposals/newlang.ye#L659).

**Not provisionally accepted:** This Java-like rule is not selected by DEC-019, which accepts the NewLang object model rather than Java grammar. Related forms are deferred or governed by the generic syntax in DEC-076; see the deferrals and crosswalk above.

```text
IfThenStatement
:	'if' '(' Expression ')' Statement
;
```

### 127. `IfThenElseStatement` — J

[Original production in `newlang.ye` (line 663)](../Proposals/newlang.ye#L663).

**Not provisionally accepted:** This Java-like rule is not selected by DEC-019, which accepts the NewLang object model rather than Java grammar. Related forms are deferred or governed by the generic syntax in DEC-076; see the deferrals and crosswalk above.

```text
IfThenElseStatement
:	'if' '(' Expression ')' StatementNoShortIf 'else' Statement
;
```

### 128. `IfThenElseStatementNoShortIf` — J

[Original production in `newlang.ye` (line 667)](../Proposals/newlang.ye#L667).

**Not provisionally accepted:** This Java-like rule is not selected by DEC-019, which accepts the NewLang object model rather than Java grammar. Related forms are deferred or governed by the generic syntax in DEC-076; see the deferrals and crosswalk above.

```text
IfThenElseStatementNoShortIf
:	'if' '(' Expression ')' StatementNoShortIf 'else' StatementNoShortIf
;
```

### 129. `AssertStatement` — J

[Original production in `newlang.ye` (line 671)](../Proposals/newlang.ye#L671).

**Not provisionally accepted:** This Java-like rule is not selected by DEC-019, which accepts the NewLang object model rather than Java grammar. Related forms are deferred or governed by the generic syntax in DEC-076; see the deferrals and crosswalk above.

```text
AssertStatement
:	'assert' Expression ';'
|	'assert' Expression ':' Expression ';'
;
```

### 130. `SwitchStatement` — J

[Original production in `newlang.ye` (line 676)](../Proposals/newlang.ye#L676).

**Not provisionally accepted:** This Java-like rule is not selected by DEC-019, which accepts the NewLang object model rather than Java grammar. Related forms are deferred or governed by the generic syntax in DEC-076; see the deferrals and crosswalk above.

```text
SwitchStatement
:	'switch' '(' Expression ')' SwitchBlock
;
```

### 131. `SwitchBlock` — J

[Original production in `newlang.ye` (line 680)](../Proposals/newlang.ye#L680).

**Not provisionally accepted:** This Java-like rule is not selected by DEC-019, which accepts the NewLang object model rather than Java grammar. Related forms are deferred or governed by the generic syntax in DEC-076; see the deferrals and crosswalk above.

```text
SwitchBlock
:	'{' { SwitchBlockStatementGroup } { SwitchLabel } '}'
;
```

### 132. `SwitchBlockStatementGroup` — J

[Original production in `newlang.ye` (line 684)](../Proposals/newlang.ye#L684).

**Not provisionally accepted:** This Java-like rule is not selected by DEC-019, which accepts the NewLang object model rather than Java grammar. Related forms are deferred or governed by the generic syntax in DEC-076; see the deferrals and crosswalk above.

```text
SwitchBlockStatementGroup
:	SwitchLabels BlockStatements
;
```

### 133. `SwitchLabels` — J

[Original production in `newlang.ye` (line 688)](../Proposals/newlang.ye#L688).

**Not provisionally accepted:** This Java-like rule is not selected by DEC-019, which accepts the NewLang object model rather than Java grammar. Related forms are deferred or governed by the generic syntax in DEC-076; see the deferrals and crosswalk above.

```text
SwitchLabels
:	SwitchLabel { SwitchLabel }
;
```

### 134. `SwitchLabel` — J

[Original production in `newlang.ye` (line 692)](../Proposals/newlang.ye#L692).

**Not provisionally accepted:** This Java-like rule is not selected by DEC-019, which accepts the NewLang object model rather than Java grammar. Related forms are deferred or governed by the generic syntax in DEC-076; see the deferrals and crosswalk above.

```text
SwitchLabel
:	'case' ConstantExpression ':'
|	'case' EnumConstantName ':'
|	'default' ':'
;
```

### 135. `EnumConstantName` — J

[Original production in `newlang.ye` (line 698)](../Proposals/newlang.ye#L698).

**Not provisionally accepted:** This Java-like rule is not selected by DEC-019, which accepts the NewLang object model rather than Java grammar. Related forms are deferred or governed by the generic syntax in DEC-076; see the deferrals and crosswalk above.

```text
EnumConstantName
:	Identifier
;
```

### 136. `WhileStatement` — J

[Original production in `newlang.ye` (line 702)](../Proposals/newlang.ye#L702).

**Not provisionally accepted:** This Java-like rule is not selected by DEC-019, which accepts the NewLang object model rather than Java grammar. Related forms are deferred or governed by the generic syntax in DEC-076; see the deferrals and crosswalk above.

```text
WhileStatement
:	'while' '(' Expression ')' Statement
;
```

### 137. `WhileStatementNoShortIf` — J

[Original production in `newlang.ye` (line 706)](../Proposals/newlang.ye#L706).

**Not provisionally accepted:** This Java-like rule is not selected by DEC-019, which accepts the NewLang object model rather than Java grammar. Related forms are deferred or governed by the generic syntax in DEC-076; see the deferrals and crosswalk above.

```text
WhileStatementNoShortIf
:	'while' '(' Expression ')' StatementNoShortIf
;
```

### 138. `DoStatement` — J

[Original production in `newlang.ye` (line 710)](../Proposals/newlang.ye#L710).

**Not provisionally accepted:** This Java-like rule is not selected by DEC-019, which accepts the NewLang object model rather than Java grammar. Related forms are deferred or governed by the generic syntax in DEC-076; see the deferrals and crosswalk above.

```text
DoStatement
:	'do' Statement 'while' '(' Expression ')' ';'
;
```

### 139. `ForStatement` — J

[Original production in `newlang.ye` (line 714)](../Proposals/newlang.ye#L714).

**Not provisionally accepted:** This Java-like rule is not selected by DEC-019, which accepts the NewLang object model rather than Java grammar. Related forms are deferred or governed by the generic syntax in DEC-076; see the deferrals and crosswalk above.

```text
ForStatement
:	BasicForStatement
|	EnhancedForStatement
;
```

### 140. `ForStatementNoShortIf` — J

[Original production in `newlang.ye` (line 719)](../Proposals/newlang.ye#L719).

**Not provisionally accepted:** This Java-like rule is not selected by DEC-019, which accepts the NewLang object model rather than Java grammar. Related forms are deferred or governed by the generic syntax in DEC-076; see the deferrals and crosswalk above.

```text
ForStatementNoShortIf
:	BasicForStatementNoShortIf
|	EnhancedForStatementNoShortIf
;
```

### 141. `BasicForStatement` — J

[Original production in `newlang.ye` (line 724)](../Proposals/newlang.ye#L724).

**Not provisionally accepted:** This Java-like rule is not selected by DEC-019, which accepts the NewLang object model rather than Java grammar. Related forms are deferred or governed by the generic syntax in DEC-076; see the deferrals and crosswalk above.

```text
BasicForStatement
:	'for' '(' [ ForInit ] ';' [ Expression ] ';' [ ForUpdate ] ')' Statement
;
```

### 142. `BasicForStatementNoShortIf` — J

[Original production in `newlang.ye` (line 728)](../Proposals/newlang.ye#L728).

**Not provisionally accepted:** This Java-like rule is not selected by DEC-019, which accepts the NewLang object model rather than Java grammar. Related forms are deferred or governed by the generic syntax in DEC-076; see the deferrals and crosswalk above.

```text
BasicForStatementNoShortIf
:	'for' '(' [ ForInit ] ';' [ Expression ] ';' [ ForUpdate ] ')' StatementNoShortIf
;
```

### 143. `ForInit` — J

[Original production in `newlang.ye` (line 732)](../Proposals/newlang.ye#L732).

**Not provisionally accepted:** This Java-like rule is not selected by DEC-019, which accepts the NewLang object model rather than Java grammar. Related forms are deferred or governed by the generic syntax in DEC-076; see the deferrals and crosswalk above.

```text
ForInit
:	StatementExpressionList
|	LocalVariableDeclaration
;
```

### 144. `ForUpdate` — J

[Original production in `newlang.ye` (line 737)](../Proposals/newlang.ye#L737).

**Not provisionally accepted:** This Java-like rule is not selected by DEC-019, which accepts the NewLang object model rather than Java grammar. Related forms are deferred or governed by the generic syntax in DEC-076; see the deferrals and crosswalk above.

```text
ForUpdate
:	StatementExpressionList
;
```

### 145. `StatementExpressionList` — J

[Original production in `newlang.ye` (line 741)](../Proposals/newlang.ye#L741).

**Not provisionally accepted:** This Java-like rule is not selected by DEC-019, which accepts the NewLang object model rather than Java grammar. Related forms are deferred or governed by the generic syntax in DEC-076; see the deferrals and crosswalk above.

```text
StatementExpressionList
:	StatementExpression { ',' StatementExpression }
;
```

### 146. `EnhancedForStatement` — J

[Original production in `newlang.ye` (line 745)](../Proposals/newlang.ye#L745).

**Not provisionally accepted:** This Java-like rule is not selected by DEC-019, which accepts the NewLang object model rather than Java grammar. Related forms are deferred or governed by the generic syntax in DEC-076; see the deferrals and crosswalk above.

```text
EnhancedForStatement
:	'for' '(' { VariableModifier } UnannType VariableDeclaratorId ':' Expression ')' Statement
;
```

### 147. `EnhancedForStatementNoShortIf` — J

[Original production in `newlang.ye` (line 749)](../Proposals/newlang.ye#L749).

**Not provisionally accepted:** This Java-like rule is not selected by DEC-019, which accepts the NewLang object model rather than Java grammar. Related forms are deferred or governed by the generic syntax in DEC-076; see the deferrals and crosswalk above.

```text
EnhancedForStatementNoShortIf
:	'for' '(' { VariableModifier } UnannType VariableDeclaratorId ':' Expression ')' StatementNoShortIf
;
```

### 148. `BreakStatement` — J

[Original production in `newlang.ye` (line 753)](../Proposals/newlang.ye#L753).

**Not provisionally accepted:** This Java-like rule is not selected by DEC-019, which accepts the NewLang object model rather than Java grammar. Related forms are deferred or governed by the generic syntax in DEC-076; see the deferrals and crosswalk above.

```text
BreakStatement
:	'break' [ Identifier ] ';'
;
```

### 149. `ContinueStatement` — J

[Original production in `newlang.ye` (line 757)](../Proposals/newlang.ye#L757).

**Not provisionally accepted:** This Java-like rule is not selected by DEC-019, which accepts the NewLang object model rather than Java grammar. Related forms are deferred or governed by the generic syntax in DEC-076; see the deferrals and crosswalk above.

```text
ContinueStatement
:	'continue' [ Identifier ] ';'
;
```

### 150. `ReturnStatement` — J

[Original production in `newlang.ye` (line 761)](../Proposals/newlang.ye#L761).

**Not provisionally accepted:** This Java-like rule is not selected by DEC-019, which accepts the NewLang object model rather than Java grammar. Related forms are deferred or governed by the generic syntax in DEC-076; see the deferrals and crosswalk above.

```text
ReturnStatement
:	'return' [ Expression ] ';'
;
```

### 151. `ThrowStatement` — J

[Original production in `newlang.ye` (line 765)](../Proposals/newlang.ye#L765).

**Not provisionally accepted:** This Java-like rule is not selected by DEC-019, which accepts the NewLang object model rather than Java grammar. Related forms are deferred or governed by the generic syntax in DEC-076; see the deferrals and crosswalk above.

```text
ThrowStatement
:	'throw' Expression ';'
;
```

### 152. `SynchronizedStatement` — J

[Original production in `newlang.ye` (line 769)](../Proposals/newlang.ye#L769).

**Not provisionally accepted:** This Java-like rule is not selected by DEC-019, which accepts the NewLang object model rather than Java grammar. Related forms are deferred or governed by the generic syntax in DEC-076; see the deferrals and crosswalk above.

```text
SynchronizedStatement
:	'synchronized' '(' Expression ')' Block
;
```

### 153. `TryStatement` — J

[Original production in `newlang.ye` (line 773)](../Proposals/newlang.ye#L773).

**Not provisionally accepted:** This Java-like rule is not selected by DEC-019, which accepts the NewLang object model rather than Java grammar. Related forms are deferred or governed by the generic syntax in DEC-076; see the deferrals and crosswalk above.

```text
TryStatement
:	'try' Block Catches
|	'try' Block [ Catches ] Finally
|	TryWithResourcesStatement
;
```

### 154. `Catches` — J

[Original production in `newlang.ye` (line 779)](../Proposals/newlang.ye#L779).

**Not provisionally accepted:** This Java-like rule is not selected by DEC-019, which accepts the NewLang object model rather than Java grammar. Related forms are deferred or governed by the generic syntax in DEC-076; see the deferrals and crosswalk above.

```text
Catches
:	CatchClause { CatchClause }
;
```

### 155. `CatchClause` — J

[Original production in `newlang.ye` (line 783)](../Proposals/newlang.ye#L783).

**Not provisionally accepted:** This Java-like rule is not selected by DEC-019, which accepts the NewLang object model rather than Java grammar. Related forms are deferred or governed by the generic syntax in DEC-076; see the deferrals and crosswalk above.

```text
CatchClause
:	'catch' '(' CatchFormalParameter ')' Block
;
```

### 156. `CatchFormalParameter` — J

[Original production in `newlang.ye` (line 787)](../Proposals/newlang.ye#L787).

**Not provisionally accepted:** This Java-like rule is not selected by DEC-019, which accepts the NewLang object model rather than Java grammar. Related forms are deferred or governed by the generic syntax in DEC-076; see the deferrals and crosswalk above.

```text
CatchFormalParameter
:	{ VariableModifier } CatchType VariableDeclaratorId
;
```

### 157. `CatchType` — J

[Original production in `newlang.ye` (line 791)](../Proposals/newlang.ye#L791).

**Not provisionally accepted:** This Java-like rule is not selected by DEC-019, which accepts the NewLang object model rather than Java grammar. Related forms are deferred or governed by the generic syntax in DEC-076; see the deferrals and crosswalk above.

```text
CatchType
:	UnannClassType { '|' ClassType }
;
```

### 158. `Finally` — J

[Original production in `newlang.ye` (line 795)](../Proposals/newlang.ye#L795).

**Not provisionally accepted:** This Java-like rule is not selected by DEC-019, which accepts the NewLang object model rather than Java grammar. Related forms are deferred or governed by the generic syntax in DEC-076; see the deferrals and crosswalk above.

```text
Finally
:	'finally' Block
;
```

### 159. `TryWithResourcesStatement` — J

[Original production in `newlang.ye` (line 799)](../Proposals/newlang.ye#L799).

**Not provisionally accepted:** This Java-like rule is not selected by DEC-019, which accepts the NewLang object model rather than Java grammar. Related forms are deferred or governed by the generic syntax in DEC-076; see the deferrals and crosswalk above.

```text
TryWithResourcesStatement
:	'try' ResourceSpecification Block [ Catches ] [ Finally ]
;
```

### 160. `ResourceSpecification` — J

[Original production in `newlang.ye` (line 803)](../Proposals/newlang.ye#L803).

**Not provisionally accepted:** This Java-like rule is not selected by DEC-019, which accepts the NewLang object model rather than Java grammar. Related forms are deferred or governed by the generic syntax in DEC-076; see the deferrals and crosswalk above.

```text
ResourceSpecification
:	'(' ResourceList [ ';' ] ')'
;
```

### 161. `ResourceList` — J

[Original production in `newlang.ye` (line 807)](../Proposals/newlang.ye#L807).

**Not provisionally accepted:** This Java-like rule is not selected by DEC-019, which accepts the NewLang object model rather than Java grammar. Related forms are deferred or governed by the generic syntax in DEC-076; see the deferrals and crosswalk above.

```text
ResourceList
:	Resource { ';' Resource }
;
```

### 162. `Resource` — J

[Original production in `newlang.ye` (line 811)](../Proposals/newlang.ye#L811).

**Not provisionally accepted:** This Java-like rule is not selected by DEC-019, which accepts the NewLang object model rather than Java grammar. Related forms are deferred or governed by the generic syntax in DEC-076; see the deferrals and crosswalk above.

```text
Resource
:	{ VariableModifier } UnannType VariableDeclaratorId '=' Expression
;
```

### 163. `Primary` — J

[Original production in `newlang.ye` (line 817)](../Proposals/newlang.ye#L817).

**Not provisionally accepted:** This Java-like rule is not selected by DEC-019, which accepts the NewLang object model rather than Java grammar. Related forms are deferred or governed by the generic syntax in DEC-076; see the deferrals and crosswalk above.

```text
Primary
:	PrimaryNoNewArray
|	ArrayCreationExpression
;
```

### 164. `PrimaryNoNewArray` — J

[Original production in `newlang.ye` (line 822)](../Proposals/newlang.ye#L822).

**Not provisionally accepted:** This Java-like rule is not selected by DEC-019, which accepts the NewLang object model rather than Java grammar. Related forms are deferred or governed by the generic syntax in DEC-076; see the deferrals and crosswalk above.

```text
PrimaryNoNewArray
:	Literal
|	TypeName { '[' ']' } '.' 'class'
|	'void' '.' 'class'
|	'this'
|	TypeName '.' 'this'
|	'(' Expression ')'
|	ClassInstanceCreationExpression
|	FieldAccess
|	ArrayAccess
|	MethodInvocation
|	MethodReference
;
```

### 165. `ClassInstanceCreationExpression` — J

[Original production in `newlang.ye` (line 836)](../Proposals/newlang.ye#L836).

**Not provisionally accepted:** This Java-like rule is not selected by DEC-019, which accepts the NewLang object model rather than Java grammar. Related forms are deferred or governed by the generic syntax in DEC-076; see the deferrals and crosswalk above.

```text
ClassInstanceCreationExpression
:	'new' [ TypeArguments ] { Annotation } Identifier [ TypeArgumentsOrDiamond ] '(' [ ArgumentList ] ')' [ ClassBody ]
|	ExpressionName '.' 'new' [ TypeArguments ] { Annotation } Identifier [ TypeArgumentsOrDiamond ] '(' [ ArgumentList ] ')' [ ClassBody ]
|	Primary '.' 'new' [ TypeArguments ] { Annotation } Identifier [ TypeArgumentsOrDiamond ] '(' [ ArgumentList ] ')' [ ClassBody ]
;
```

### 166. `TypeArgumentsOrDiamond` — J

[Original production in `newlang.ye` (line 842)](../Proposals/newlang.ye#L842).

**Not provisionally accepted:** This Java-like rule is not selected by DEC-019, which accepts the NewLang object model rather than Java grammar. Related forms are deferred or governed by the generic syntax in DEC-076; see the deferrals and crosswalk above.

```text
TypeArgumentsOrDiamond
:	TypeArguments
|	'<' '>'
;
```

### 167. `FieldAccess` — J

[Original production in `newlang.ye` (line 847)](../Proposals/newlang.ye#L847).

**Not provisionally accepted:** This Java-like rule is not selected by DEC-019, which accepts the NewLang object model rather than Java grammar. Related forms are deferred or governed by the generic syntax in DEC-076; see the deferrals and crosswalk above.

```text
FieldAccess
:	Primary '.' Identifier
|	'super' '.' Identifier
|	TypeName '.' 'super' '.' Identifier
;
```

### 168. `ArrayAccess` — J

[Original production in `newlang.ye` (line 853)](../Proposals/newlang.ye#L853).

**Not provisionally accepted:** This Java-like rule is not selected by DEC-019, which accepts the NewLang object model rather than Java grammar. Related forms are deferred or governed by the generic syntax in DEC-076; see the deferrals and crosswalk above.

```text
ArrayAccess
:	ExpressionName '[' Expression ']'
|	PrimaryNoNewArray '[' Expression ']'
;
```

### 169. `MethodInvocation` — J

[Original production in `newlang.ye` (line 858)](../Proposals/newlang.ye#L858).

**Not provisionally accepted:** This Java-like rule is not selected by DEC-019, which accepts the NewLang object model rather than Java grammar. Related forms are deferred or governed by the generic syntax in DEC-076; see the deferrals and crosswalk above.

```text
MethodInvocation
:	MethodName '(' [ ArgumentList ] ')'
|	TypeName '.' [ TypeArguments ] Identifier '(' [ ArgumentList ] ')'
|	ExpressionName '.' [ TypeArguments ] Identifier '(' [ ArgumentList ] ')'
|	Primary '.' [ TypeArguments ] Identifier '(' [ ArgumentList ] ')'
|	'super' '.' [ TypeArguments ] Identifier '(' [ ArgumentList ] ')'
|	TypeName '.' 'super' '.' [ TypeArguments ] Identifier '(' [ ArgumentList ] ')'
;
```

### 170. `ArgumentList` — J

[Original production in `newlang.ye` (line 867)](../Proposals/newlang.ye#L867).

**Not provisionally accepted:** This Java-like rule is not selected by DEC-019, which accepts the NewLang object model rather than Java grammar. Related forms are deferred or governed by the generic syntax in DEC-076; see the deferrals and crosswalk above.

```text
ArgumentList
:	Expression { ',' Expression }
;
```

### 171. `MethodReference` — J

[Original production in `newlang.ye` (line 871)](../Proposals/newlang.ye#L871).

**Not provisionally accepted:** This Java-like rule is not selected by DEC-019, which accepts the NewLang object model rather than Java grammar. Related forms are deferred or governed by the generic syntax in DEC-076; see the deferrals and crosswalk above.

```text
MethodReference
:	ExpressionName '::' [ TypeArguments ] Identifier
|	ReferenceType '::' [ TypeArguments ] Identifier
|	Primary '::' [ TypeArguments ] Identifier
|	'super' '::' [ TypeArguments ] Identifier
|	TypeName '.' 'super' '::' [ TypeArguments ] Identifier
|	ClassType '::' [ TypeArguments ] 'new'
|	ArrayType '::' 'new'
;
```

### 172. `ArrayCreationExpression` — J

[Original production in `newlang.ye` (line 881)](../Proposals/newlang.ye#L881).

**Not provisionally accepted:** This Java-like rule is not selected by DEC-019, which accepts the NewLang object model rather than Java grammar. Related forms are deferred or governed by the generic syntax in DEC-076; see the deferrals and crosswalk above.

```text
ArrayCreationExpression
:	'new' PrimitiveType DimExprs [ Dims ]
|	'new' ClassOrInterfaceType DimExprs [ Dims ]
|	'new' PrimitiveType Dims ArrayInitializer
|	'new' ClassOrInterfaceType Dims ArrayInitializer
;
```

### 173. `DimExprs` — J

[Original production in `newlang.ye` (line 888)](../Proposals/newlang.ye#L888).

**Not provisionally accepted:** This Java-like rule is not selected by DEC-019, which accepts the NewLang object model rather than Java grammar. Related forms are deferred or governed by the generic syntax in DEC-076; see the deferrals and crosswalk above.

```text
DimExprs
:	DimExpr { DimExpr }
;
```

### 174. `DimExpr` — J

[Original production in `newlang.ye` (line 892)](../Proposals/newlang.ye#L892).

**Not provisionally accepted:** This Java-like rule is not selected by DEC-019, which accepts the NewLang object model rather than Java grammar. Related forms are deferred or governed by the generic syntax in DEC-076; see the deferrals and crosswalk above.

```text
DimExpr
:	{ Annotation } '[' Expression ']'
;
```

### 175. `ConstantExpression` — J

[Original production in `newlang.ye` (line 896)](../Proposals/newlang.ye#L896).

**Not provisionally accepted:** This Java-like rule is not selected by DEC-019, which accepts the NewLang object model rather than Java grammar. Related forms are deferred or governed by the generic syntax in DEC-076; see the deferrals and crosswalk above.

```text
ConstantExpression
:	Expression
;
```

### 176. `Expression` — J

[Original production in `newlang.ye` (line 900)](../Proposals/newlang.ye#L900).

**Not provisionally accepted:** This Java-like rule is not selected by DEC-019, which accepts the NewLang object model rather than Java grammar. Related forms are deferred or governed by the generic syntax in DEC-076; see the deferrals and crosswalk above.

```text
Expression
:	LambdaExpression
|	AssignmentExpression
;
```

### 177. `LambdaExpression` — J

[Original production in `newlang.ye` (line 905)](../Proposals/newlang.ye#L905).

**Not provisionally accepted:** This Java-like rule is not selected by DEC-019, which accepts the NewLang object model rather than Java grammar. Related forms are deferred or governed by the generic syntax in DEC-076; see the deferrals and crosswalk above.

```text
LambdaExpression
:	LambdaParameters '->' LambdaBody
;
```

### 178. `LambdaParameters` — J

[Original production in `newlang.ye` (line 909)](../Proposals/newlang.ye#L909).

**Not provisionally accepted:** This Java-like rule is not selected by DEC-019, which accepts the NewLang object model rather than Java grammar. Related forms are deferred or governed by the generic syntax in DEC-076; see the deferrals and crosswalk above.

```text
LambdaParameters
:	Identifier
|	'(' [ FormalParameterList ] ')'
|	'(' InferredFormalParameterList ')'
;
```

### 179. `InferredFormalParameterList` — J

[Original production in `newlang.ye` (line 915)](../Proposals/newlang.ye#L915).

**Not provisionally accepted:** This Java-like rule is not selected by DEC-019, which accepts the NewLang object model rather than Java grammar. Related forms are deferred or governed by the generic syntax in DEC-076; see the deferrals and crosswalk above.

```text
InferredFormalParameterList
:	Identifier { ',' Identifier }
;
```

### 180. `LambdaBody` — J

[Original production in `newlang.ye` (line 919)](../Proposals/newlang.ye#L919).

**Not provisionally accepted:** This Java-like rule is not selected by DEC-019, which accepts the NewLang object model rather than Java grammar. Related forms are deferred or governed by the generic syntax in DEC-076; see the deferrals and crosswalk above.

```text
LambdaBody
:	Expression
|	Block
;
```

### 181. `AssignmentExpression` — J

[Original production in `newlang.ye` (line 924)](../Proposals/newlang.ye#L924).

**Not provisionally accepted:** This Java-like rule is not selected by DEC-019, which accepts the NewLang object model rather than Java grammar. Related forms are deferred or governed by the generic syntax in DEC-076; see the deferrals and crosswalk above.

```text
AssignmentExpression
:	ConditionalExpression
|	Assignment
;
```

### 182. `Assignment` — J

[Original production in `newlang.ye` (line 929)](../Proposals/newlang.ye#L929).

**Not provisionally accepted:** This Java-like rule is not selected by DEC-019, which accepts the NewLang object model rather than Java grammar. Related forms are deferred or governed by the generic syntax in DEC-076; see the deferrals and crosswalk above.

```text
Assignment
:	LeftHandSide AssignmentOperator Expression
;
```

### 183. `LeftHandSide` — J

[Original production in `newlang.ye` (line 933)](../Proposals/newlang.ye#L933).

**Not provisionally accepted:** This Java-like rule is not selected by DEC-019, which accepts the NewLang object model rather than Java grammar. Related forms are deferred or governed by the generic syntax in DEC-076; see the deferrals and crosswalk above.

```text
LeftHandSide
:	ExpressionName
|	FieldAccess
|	ArrayAccess
;
```

### 184. `AssignmentOperator` — J

[Original production in `newlang.ye` (line 939)](../Proposals/newlang.ye#L939).

**Not provisionally accepted:** This Java-like rule is not selected by DEC-019, which accepts the NewLang object model rather than Java grammar. Related forms are deferred or governed by the generic syntax in DEC-076; see the deferrals and crosswalk above.

```text
AssignmentOperator
:	'='
|	'*='
|	'/='
|	'%='
|	'+='
|	'-='
|	'<<='
|	'>>='
|	'>>>='
|	'&='
|	'^='
|	'|='
;
```

### 185. `ConditionalExpression` — J

[Original production in `newlang.ye` (line 954)](../Proposals/newlang.ye#L954).

**Not provisionally accepted:** This Java-like rule is not selected by DEC-019, which accepts the NewLang object model rather than Java grammar. Related forms are deferred or governed by the generic syntax in DEC-076; see the deferrals and crosswalk above.

```text
ConditionalExpression
:	ConditionalOrExpression
|	ConditionalOrExpression '?' Expression ':' ConditionalExpression
;
```

### 186. `ConditionalOrExpression` — J

[Original production in `newlang.ye` (line 959)](../Proposals/newlang.ye#L959).

**Not provisionally accepted:** This Java-like rule is not selected by DEC-019, which accepts the NewLang object model rather than Java grammar. Related forms are deferred or governed by the generic syntax in DEC-076; see the deferrals and crosswalk above.

```text
ConditionalOrExpression
:	ConditionalAndExpression
|	ConditionalOrExpression '||' ConditionalAndExpression
;
```

### 187. `ConditionalAndExpression` — J

[Original production in `newlang.ye` (line 964)](../Proposals/newlang.ye#L964).

**Not provisionally accepted:** This Java-like rule is not selected by DEC-019, which accepts the NewLang object model rather than Java grammar. Related forms are deferred or governed by the generic syntax in DEC-076; see the deferrals and crosswalk above.

```text
ConditionalAndExpression
:	InclusiveOrExpression
|	ConditionalAndExpression '&&' InclusiveOrExpression
;
```

### 188. `InclusiveOrExpression` — J

[Original production in `newlang.ye` (line 969)](../Proposals/newlang.ye#L969).

**Not provisionally accepted:** This Java-like rule is not selected by DEC-019, which accepts the NewLang object model rather than Java grammar. Related forms are deferred or governed by the generic syntax in DEC-076; see the deferrals and crosswalk above.

```text
InclusiveOrExpression
:	ExclusiveOrExpression
|	InclusiveOrExpression '|' ExclusiveOrExpression
;
```

### 189. `ExclusiveOrExpression` — J

[Original production in `newlang.ye` (line 974)](../Proposals/newlang.ye#L974).

**Not provisionally accepted:** This Java-like rule is not selected by DEC-019, which accepts the NewLang object model rather than Java grammar. Related forms are deferred or governed by the generic syntax in DEC-076; see the deferrals and crosswalk above.

```text
ExclusiveOrExpression
:	AndExpression
|	ExclusiveOrExpression '^' AndExpression
;
```

### 190. `AndExpression` — J

[Original production in `newlang.ye` (line 979)](../Proposals/newlang.ye#L979).

**Not provisionally accepted:** This Java-like rule is not selected by DEC-019, which accepts the NewLang object model rather than Java grammar. Related forms are deferred or governed by the generic syntax in DEC-076; see the deferrals and crosswalk above.

```text
AndExpression
:	EqualityExpression
|	AndExpression '&' EqualityExpression
;
```

### 191. `EqualityExpression` — J

[Original production in `newlang.ye` (line 984)](../Proposals/newlang.ye#L984).

**Not provisionally accepted:** This Java-like rule is not selected by DEC-019, which accepts the NewLang object model rather than Java grammar. Related forms are deferred or governed by the generic syntax in DEC-076; see the deferrals and crosswalk above.

```text
EqualityExpression
:	RelationalExpression
|	EqualityExpression '==' RelationalExpression
|	EqualityExpression '!=' RelationalExpression
;
```

### 192. `RelationalExpression` — J

[Original production in `newlang.ye` (line 990)](../Proposals/newlang.ye#L990).

**Not provisionally accepted:** This Java-like rule is not selected by DEC-019, which accepts the NewLang object model rather than Java grammar. Related forms are deferred or governed by the generic syntax in DEC-076; see the deferrals and crosswalk above.

```text
RelationalExpression
:	ShiftExpression
|	RelationalExpression '<' ShiftExpression
|	RelationalExpression '>' ShiftExpression
|	RelationalExpression '<=' ShiftExpression
|	RelationalExpression '>=' ShiftExpression
|	RelationalExpression 'instanceof' ReferenceType
;
```

### 193. `ShiftExpression` — J

[Original production in `newlang.ye` (line 999)](../Proposals/newlang.ye#L999).

**Not provisionally accepted:** This Java-like rule is not selected by DEC-019, which accepts the NewLang object model rather than Java grammar. Related forms are deferred or governed by the generic syntax in DEC-076; see the deferrals and crosswalk above.

```text
ShiftExpression
:	AdditiveExpression
|	ShiftExpression '<<' AdditiveExpression
|	ShiftExpression '>>' AdditiveExpression
|	ShiftExpression '>>>' AdditiveExpression
;
```

### 194. `AdditiveExpression` — J

[Original production in `newlang.ye` (line 1006)](../Proposals/newlang.ye#L1006).

**Not provisionally accepted:** This Java-like rule is not selected by DEC-019, which accepts the NewLang object model rather than Java grammar. Related forms are deferred or governed by the generic syntax in DEC-076; see the deferrals and crosswalk above.

```text
AdditiveExpression
:	MultiplicativeExpression
|	AdditiveExpression '+' MultiplicativeExpression
|	AdditiveExpression '-' MultiplicativeExpression
;
```

### 195. `MultiplicativeExpression` — J

[Original production in `newlang.ye` (line 1012)](../Proposals/newlang.ye#L1012).

**Not provisionally accepted:** This Java-like rule is not selected by DEC-019, which accepts the NewLang object model rather than Java grammar. Related forms are deferred or governed by the generic syntax in DEC-076; see the deferrals and crosswalk above.

```text
MultiplicativeExpression
:	UnaryExpression
|	MultiplicativeExpression '*' UnaryExpression
|	MultiplicativeExpression '/' UnaryExpression
|	MultiplicativeExpression '%' UnaryExpression
;
```

### 196. `UnaryExpression` — J

[Original production in `newlang.ye` (line 1019)](../Proposals/newlang.ye#L1019).

**Not provisionally accepted:** This Java-like rule is not selected by DEC-019, which accepts the NewLang object model rather than Java grammar. Related forms are deferred or governed by the generic syntax in DEC-076; see the deferrals and crosswalk above.

```text
UnaryExpression
:	PreIncrementExpression
|	PreDecrementExpression
|	'+' UnaryExpression
|	'-' UnaryExpression
|	UnaryExpressionNotPlusMinus
;
```

### 197. `PreIncrementExpression` — J

[Original production in `newlang.ye` (line 1027)](../Proposals/newlang.ye#L1027).

**Not provisionally accepted:** This Java-like rule is not selected by DEC-019, which accepts the NewLang object model rather than Java grammar. Related forms are deferred or governed by the generic syntax in DEC-076; see the deferrals and crosswalk above.

```text
PreIncrementExpression
:	'++' UnaryExpression
;
```

### 198. `PreDecrementExpression` — J

[Original production in `newlang.ye` (line 1031)](../Proposals/newlang.ye#L1031).

**Not provisionally accepted:** This Java-like rule is not selected by DEC-019, which accepts the NewLang object model rather than Java grammar. Related forms are deferred or governed by the generic syntax in DEC-076; see the deferrals and crosswalk above.

```text
PreDecrementExpression
:	'--' UnaryExpression
;
```

### 199. `UnaryExpressionNotPlusMinus` — J

[Original production in `newlang.ye` (line 1035)](../Proposals/newlang.ye#L1035).

**Not provisionally accepted:** This Java-like rule is not selected by DEC-019, which accepts the NewLang object model rather than Java grammar. Related forms are deferred or governed by the generic syntax in DEC-076; see the deferrals and crosswalk above.

```text
UnaryExpressionNotPlusMinus
:	PostfixExpression
|	'~' UnaryExpression
|	'!' UnaryExpression
|	CastExpression
;
```

### 200. `PostfixExpression` — J

[Original production in `newlang.ye` (line 1042)](../Proposals/newlang.ye#L1042).

**Not provisionally accepted:** This Java-like rule is not selected by DEC-019, which accepts the NewLang object model rather than Java grammar. Related forms are deferred or governed by the generic syntax in DEC-076; see the deferrals and crosswalk above.

```text
PostfixExpression
:	Primary
|	ExpressionName
|	PostIncrementExpression
|	PostDecrementExpression
;
```

### 201. `PostIncrementExpression` — J

[Original production in `newlang.ye` (line 1049)](../Proposals/newlang.ye#L1049).

**Not provisionally accepted:** This Java-like rule is not selected by DEC-019, which accepts the NewLang object model rather than Java grammar. Related forms are deferred or governed by the generic syntax in DEC-076; see the deferrals and crosswalk above.

```text
PostIncrementExpression
:	PostfixExpression '++'
;
```

### 202. `PostDecrementExpression` — J

[Original production in `newlang.ye` (line 1053)](../Proposals/newlang.ye#L1053).

**Not provisionally accepted:** This Java-like rule is not selected by DEC-019, which accepts the NewLang object model rather than Java grammar. Related forms are deferred or governed by the generic syntax in DEC-076; see the deferrals and crosswalk above.

```text
PostDecrementExpression
:	PostfixExpression '--'
;
```

### 203. `CastExpression` — J

[Original production in `newlang.ye` (line 1057)](../Proposals/newlang.ye#L1057).

**Not provisionally accepted:** This Java-like rule is not selected by DEC-019, which accepts the NewLang object model rather than Java grammar. Related forms are deferred or governed by the generic syntax in DEC-076; see the deferrals and crosswalk above.

```text
CastExpression
:	'(' PrimitiveType ')' UnaryExpression
|	'(' ReferenceType { AdditionalBound } ')' UnaryExpressionNotPlusMinus
|	'(' ReferenceType { AdditionalBound } ')' LambdaExpression
;
```

### 204. `PackageName` — J / D

[Original production in `newlang.ye` (line 1065)](../Proposals/newlang.ye#L1065).

**Not provisionally accepted:** This Java-like rule is not selected by DEC-019, which accepts the NewLang object model rather than Java grammar. Related forms are deferred or governed by the generic syntax in DEC-076; see the deferrals and crosswalk above.

```text
PackageName
:	Identifier
|	PackageName '.' Identifier
;
```

### 205. `TypeName` — J

[Original production in `newlang.ye` (line 1070)](../Proposals/newlang.ye#L1070).

**Not provisionally accepted:** This Java-like rule is not selected by DEC-019, which accepts the NewLang object model rather than Java grammar. Related forms are deferred or governed by the generic syntax in DEC-076; see the deferrals and crosswalk above.

```text
TypeName
:	Identifier
|	PackageOrTypeName '.' Identifier
;
```

### 206. `PackageOrTypeName` — J

[Original production in `newlang.ye` (line 1075)](../Proposals/newlang.ye#L1075).

**Not provisionally accepted:** This Java-like rule is not selected by DEC-019, which accepts the NewLang object model rather than Java grammar. Related forms are deferred or governed by the generic syntax in DEC-076; see the deferrals and crosswalk above.

```text
PackageOrTypeName
:	Identifier
|	PackageOrTypeName '.' Identifier
;
```

### 207. `ExpressionName` — J

[Original production in `newlang.ye` (line 1080)](../Proposals/newlang.ye#L1080).

**Not provisionally accepted:** This Java-like rule is not selected by DEC-019, which accepts the NewLang object model rather than Java grammar. Related forms are deferred or governed by the generic syntax in DEC-076; see the deferrals and crosswalk above.

```text
ExpressionName
:	Identifier
|	AmbiguousName '.' Identifier
;
```

### 208. `MethodName` — J

[Original production in `newlang.ye` (line 1085)](../Proposals/newlang.ye#L1085).

**Not provisionally accepted:** This Java-like rule is not selected by DEC-019, which accepts the NewLang object model rather than Java grammar. Related forms are deferred or governed by the generic syntax in DEC-076; see the deferrals and crosswalk above.

```text
MethodName
:	Identifier
;
```

### 209. `AmbiguousName` — J

[Original production in `newlang.ye` (line 1089)](../Proposals/newlang.ye#L1089).

**Not provisionally accepted:** This Java-like rule is not selected by DEC-019, which accepts the NewLang object model rather than Java grammar. Related forms are deferred or governed by the generic syntax in DEC-076; see the deferrals and crosswalk above.

```text
AmbiguousName
:	Identifier
|	AmbiguousName '.' Identifier
;
```

### 210. `SimpleTypeName` — J

[Original production in `newlang.ye` (line 1096)](../Proposals/newlang.ye#L1096).

**Not provisionally accepted:** This Java-like rule is not selected by DEC-019, which accepts the NewLang object model rather than Java grammar. Related forms are deferred or governed by the generic syntax in DEC-076; see the deferrals and crosswalk above.

```text
SimpleTypeName
:	Identifier
;
```

### 211. `TypeParameterModifier` — J

[Original production in `newlang.ye` (line 1100)](../Proposals/newlang.ye#L1100).

**Not provisionally accepted:** This Java-like rule is not selected by DEC-019, which accepts the NewLang object model rather than Java grammar. Related forms are deferred or governed by the generic syntax in DEC-076; see the deferrals and crosswalk above.

```text
TypeParameterModifier
:	Annotation
;
```

### 212. `Type` — J / D

[Original production in `newlang.ye` (line 1108)](../Proposals/newlang.ye#L1108).

**Not provisionally accepted:** This Java-like rule is not selected by DEC-019, which accepts the NewLang object model rather than Java grammar. Related forms are deferred or governed by the generic syntax in DEC-076; see the deferrals and crosswalk above.

```text
Type
:	PrimitiveType
|	ReferenceType
;
```

### 213. `PrimitiveType` — J

[Original production in `newlang.ye` (line 1113)](../Proposals/newlang.ye#L1113).

**Not provisionally accepted:** This Java-like rule is not selected by DEC-019, which accepts the NewLang object model rather than Java grammar. Related forms are deferred or governed by the generic syntax in DEC-076; see the deferrals and crosswalk above.

```text
PrimitiveType
:	{ Annotation } NumericType
|	{ Annotation } 'boolean'
;
```

### 214. `NumericType` — J

[Original production in `newlang.ye` (line 1118)](../Proposals/newlang.ye#L1118).

**Not provisionally accepted:** This Java-like rule is not selected by DEC-019, which accepts the NewLang object model rather than Java grammar. Related forms are deferred or governed by the generic syntax in DEC-076; see the deferrals and crosswalk above.

```text
NumericType
:	IntegralType
|	FloatingPointType
;
```

### 215. `IntegralType` — J

[Original production in `newlang.ye` (line 1123)](../Proposals/newlang.ye#L1123).

**Not provisionally accepted:** This Java-like rule is not selected by DEC-019, which accepts the NewLang object model rather than Java grammar. Related forms are deferred or governed by the generic syntax in DEC-076; see the deferrals and crosswalk above.

```text
IntegralType
:	'byte'
|	'short'
|	'int'
|	'long'
|	'char'
;
```

### 216. `FloatingPointType` — J

[Original production in `newlang.ye` (line 1131)](../Proposals/newlang.ye#L1131).

**Not provisionally accepted:** This Java-like rule is not selected by DEC-019, which accepts the NewLang object model rather than Java grammar. Related forms are deferred or governed by the generic syntax in DEC-076; see the deferrals and crosswalk above.

```text
FloatingPointType
:	'float'
|	'double'
;
```

### 217. `ReferenceType` — J

[Original production in `newlang.ye` (line 1136)](../Proposals/newlang.ye#L1136).

**Not provisionally accepted:** This Java-like rule is not selected by DEC-019, which accepts the NewLang object model rather than Java grammar. Related forms are deferred or governed by the generic syntax in DEC-076; see the deferrals and crosswalk above.

```text
ReferenceType
:	ClassOrInterfaceType
|	TypeVariable
|	ArrayType
;
```

### 218. `ClassOrInterfaceType` — J

[Original production in `newlang.ye` (line 1142)](../Proposals/newlang.ye#L1142).

**Not provisionally accepted:** This Java-like rule is not selected by DEC-019, which accepts the NewLang object model rather than Java grammar. Related forms are deferred or governed by the generic syntax in DEC-076; see the deferrals and crosswalk above.

```text
ClassOrInterfaceType
:	ClassType
|	InterfaceType
;
```

### 219. `ClassType` — J

[Original production in `newlang.ye` (line 1147)](../Proposals/newlang.ye#L1147).

**Not provisionally accepted:** This Java-like rule is not selected by DEC-019, which accepts the NewLang object model rather than Java grammar. Related forms are deferred or governed by the generic syntax in DEC-076; see the deferrals and crosswalk above.

```text
ClassType
:	{ Annotation } Identifier [ TypeArguments ]
|	ClassOrInterfaceType '.' { Annotation } Identifier [ TypeArguments ]
;
```

### 220. `InterfaceType` — J

[Original production in `newlang.ye` (line 1152)](../Proposals/newlang.ye#L1152).

**Not provisionally accepted:** This Java-like rule is not selected by DEC-019, which accepts the NewLang object model rather than Java grammar. Related forms are deferred or governed by the generic syntax in DEC-076; see the deferrals and crosswalk above.

```text
InterfaceType
:	ClassType
;
```

### 221. `TypeVariable` — J

[Original production in `newlang.ye` (line 1156)](../Proposals/newlang.ye#L1156).

**Not provisionally accepted:** This Java-like rule is not selected by DEC-019, which accepts the NewLang object model rather than Java grammar. Related forms are deferred or governed by the generic syntax in DEC-076; see the deferrals and crosswalk above.

```text
TypeVariable
:	{ Annotation } Identifier
;
```

### 222. `ArrayType` — J

[Original production in `newlang.ye` (line 1160)](../Proposals/newlang.ye#L1160).

**Not provisionally accepted:** This Java-like rule is not selected by DEC-019, which accepts the NewLang object model rather than Java grammar. Related forms are deferred or governed by the generic syntax in DEC-076; see the deferrals and crosswalk above.

```text
ArrayType
:	PrimitiveType Dims
|	ClassOrInterfaceType Dims
|	TypeVariable Dims
;
```

### 223. `Dims` — J

[Original production in `newlang.ye` (line 1166)](../Proposals/newlang.ye#L1166).

**Not provisionally accepted:** This Java-like rule is not selected by DEC-019, which accepts the NewLang object model rather than Java grammar. Related forms are deferred or governed by the generic syntax in DEC-076; see the deferrals and crosswalk above.

```text
Dims
:	{ Annotation } '[' ']' { { Annotation } '[' ']' }
;
```

### 224. `TypeParameter` — J

[Original production in `newlang.ye` (line 1170)](../Proposals/newlang.ye#L1170).

**Not provisionally accepted:** This Java-like rule is not selected by DEC-019, which accepts the NewLang object model rather than Java grammar. Related forms are deferred or governed by the generic syntax in DEC-076; see the deferrals and crosswalk above.

```text
TypeParameter
:	{ TypeParameterModifier } Identifier [ TypeBound ]
;
```

### 225. `TypeBound` — J

[Original production in `newlang.ye` (line 1174)](../Proposals/newlang.ye#L1174).

**Not provisionally accepted:** This Java-like rule is not selected by DEC-019, which accepts the NewLang object model rather than Java grammar. Related forms are deferred or governed by the generic syntax in DEC-076; see the deferrals and crosswalk above.

```text
TypeBound
:	'extends' TypeVariable
|	'extends' ClassOrInterfaceType { AdditionalBound }
;
```

### 226. `AdditionalBound` — J

[Original production in `newlang.ye` (line 1179)](../Proposals/newlang.ye#L1179).

**Not provisionally accepted:** This Java-like rule is not selected by DEC-019, which accepts the NewLang object model rather than Java grammar. Related forms are deferred or governed by the generic syntax in DEC-076; see the deferrals and crosswalk above.

```text
AdditionalBound
:	'&' InterfaceType
;
```

### 227. `TypeArguments` — J

[Original production in `newlang.ye` (line 1183)](../Proposals/newlang.ye#L1183).

**Not provisionally accepted:** This Java-like rule is not selected by DEC-019, which accepts the NewLang object model rather than Java grammar. Related forms are deferred or governed by the generic syntax in DEC-076; see the deferrals and crosswalk above.

```text
TypeArguments
:	'<' TypeArgumentList '>'
;
```

### 228. `TypeArgumentList` — J

[Original production in `newlang.ye` (line 1187)](../Proposals/newlang.ye#L1187).

**Not provisionally accepted:** This Java-like rule is not selected by DEC-019, which accepts the NewLang object model rather than Java grammar. Related forms are deferred or governed by the generic syntax in DEC-076; see the deferrals and crosswalk above.

```text
TypeArgumentList
:	TypeArgument { ',' TypeArgument }
;
```

### 229. `TypeArgument` — J

[Original production in `newlang.ye` (line 1191)](../Proposals/newlang.ye#L1191).

**Not provisionally accepted:** This Java-like rule is not selected by DEC-019, which accepts the NewLang object model rather than Java grammar. Related forms are deferred or governed by the generic syntax in DEC-076; see the deferrals and crosswalk above.

```text
TypeArgument
:	ReferenceType
|	Wildcard
;
```

### 230. `Wildcard` — J

[Original production in `newlang.ye` (line 1196)](../Proposals/newlang.ye#L1196).

**Not provisionally accepted:** This Java-like rule is not selected by DEC-019, which accepts the NewLang object model rather than Java grammar. Related forms are deferred or governed by the generic syntax in DEC-076; see the deferrals and crosswalk above.

```text
Wildcard
:	{ Annotation } '?' [ WildcardBounds ]
;
```

### 231. `WildcardBounds` — J

[Original production in `newlang.ye` (line 1200)](../Proposals/newlang.ye#L1200).

**Not provisionally accepted:** This Java-like rule is not selected by DEC-019, which accepts the NewLang object model rather than Java grammar. Related forms are deferred or governed by the generic syntax in DEC-076; see the deferrals and crosswalk above.

```text
WildcardBounds
:	'extends' ReferenceType
|	'super' ReferenceType
;
```

`newlang` at line 99 is a file marker, not a production. The source also has two `PackageName`, `Type`, `VariableDeclaratorList`, `VariableDeclarator`, and `EnumDeclaration` definitions; each occurrence is shown separately above. In addition to those duplicates, the Java-like sections introduce syntax and names that are not established by the NewLang proposal or current decisions. These gaps must be resolved before treating `newlang.ye` as a normative complete grammar.
