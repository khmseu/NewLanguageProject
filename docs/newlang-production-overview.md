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

### Package, declaration, and value-type proposal — O

The concrete package, import/export, declaration, and type spellings here are
not settled language syntax. In particular, a trailing semicolon is not
generally a required declaration terminator (DEC-051), and the name-first
binding forms in DEC-011 are not represented by these declaration rules.

- **O — `CompilationUnit`** ([source](../Proposals/newlang.ye#L4))
  ```text
  CompilationUnit
  :	'=I=' PackageImportsFile
  |	'=E=' PackageExportsFile
  |	'=M=' ModuleDeclarationFile
  ;
  ```
- **O / D — `PackageName`** ([source](../Proposals/newlang.ye#L10))
  ```text
  PackageName
  :	Identifier
  ;
  ```
- **O — `SubPackageName`** ([source](../Proposals/newlang.ye#L14))
  ```text
  SubPackageName
  :	Identifier
  ;
  ```
- **O — `PackageInterfaceFile`** ([source](../Proposals/newlang.ye#L20))
  ```text
  PackageInterfaceFile
  :	'package' PackageName { RemotePackageDef }
  ;
  ```
- **O — `RemotePackageDef`** ([source](../Proposals/newlang.ye#L24))
  ```text
  RemotePackageDef
  :	Identifier Literal
  ;
  ```
- **O — `PackageExportsFile`** ([source](../Proposals/newlang.ye#L30))
  ```text
  PackageExportsFile
  :	'package' PackageName 'exports' ModuleName { ',' ModuleName } ';'
  ;
  ```
- **O — `ModuleName`** ([source](../Proposals/newlang.ye#L34))
  ```text
  ModuleName
  :	{ SubPackageName '.' } Identifier
  ;
  ```
- **O — `ModuleDeclarationFile`** ([source](../Proposals/newlang.ye#L41))
  ```text
  ModuleDeclarationFile
  :	ContextDeclaration { StructDeclaration }
  ;
  ```
- **O — `ContextDeclaration`** ([source](../Proposals/newlang.ye#L45))
  ```text
  ContextDeclaration
  :	'package' PackageName { '.' SubPackageName } ';'
  ;
  ```
- **O — `Declaration`** ([source](../Proposals/newlang.ye#L51))
  ```text
  Declaration
  :	{ Modifier } BasicDeclaration
  ;
  ```
- **O — `Modifier`** ([source](../Proposals/newlang.ye#L55))
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
- **O — `BasicDeclaration`** ([source](../Proposals/newlang.ye#L70))
  ```text
  BasicDeclaration
  :	ImportDeclaration
  |	FieldOrConstantDeclaration
  |	TypeDeclaration
  ;
  ```
- **O — `ImportDeclaration`** ([source](../Proposals/newlang.ye#L76))
  ```text
  ImportDeclaration
  :	'import' Name ';'
  ;
  ```
- **O — `Name`** ([source](../Proposals/newlang.ye#L80))
  ```text
  Name
  :	PackageName { '.' Identifier }
  ;
  ```
- **O — `FieldOrConstantDeclaration`** ([source](../Proposals/newlang.ye#L84))
  ```text
  FieldOrConstantDeclaration
  :	[ TypeParameters ] Type VariableDeclaratorList ';'
  ;
  ```
- **O / D — `VariableDeclaratorList`** ([source](../Proposals/newlang.ye#L88))
  ```text
  VariableDeclaratorList
  :	VariableDeclarator { ',' VariableDeclarator }
  ;
  ```
- **O / D — `VariableDeclarator`** ([source](../Proposals/newlang.ye#L92))
  ```text
  VariableDeclarator
  :	Identifier [ '=' Expression ]
  ;
  ```
- **O — `TypeDeclaration`** ([source](../Proposals/newlang.ye#L96))
  ```text
  TypeDeclaration
  :	'typedef' [ TypeParameters ] Type Identifier ';'
  ;
  ```
- **O / D — `Type`** ([source](../Proposals/newlang.ye#L102))
  ```text
  Type
  :	BasicType [ TypeArguments ]
  ;
  ```
- **O — `BasicType`** ([source](../Proposals/newlang.ye#L106))
  ```text
  BasicType
  :	Name
  |	ValueTypeDeclaration
  |	ReferenceTypeDeclaration
  ;
  ```
- **O — `ValueTypeDeclaration`** ([source](../Proposals/newlang.ye#L112))
  ```text
  ValueTypeDeclaration
  :	OrdinalTypeDeclaration
  |	ComposedTypeDeclaration
  ;
  ```
- **O — `OrdinalTypeDeclaration`** ([source](../Proposals/newlang.ye#L117))
  ```text
  OrdinalTypeDeclaration
  :	EnumDeclaration
  |	SubrangeDeclaration
  ;
  ```
- **O — `ComposedTypeDeclaration`** ([source](../Proposals/newlang.ye#L122))
  ```text
  ComposedTypeDeclaration
  :	SetDeclaration
  |	ArrayDeclaration
  |	StructDeclaration
  ;
  ```
- **O — `ReferenceTypeDeclaration`** ([source](../Proposals/newlang.ye#L128))
  ```text
  ReferenceTypeDeclaration
  :	ClassDeclaration
  |	MixInDeclaration
  ;
  ```
- **O / D — `EnumDeclaration`** ([source](../Proposals/newlang.ye#L135))
  ```text
  EnumDeclaration
  :	'enum' [ Derivation ] '{' [ EnumDeclaratorList [ ';' [ DeclarationList ] ] ] '}'
  ;
  ```
- **O — `EnumDeclaratorList`** ([source](../Proposals/newlang.ye#L139))
  ```text
  EnumDeclaratorList
  :	EnumDeclarator { ',' EnumDeclarator }
  ;
  ```
- **O — `EnumDeclarator`** ([source](../Proposals/newlang.ye#L143))
  ```text
  EnumDeclarator
  :	Identifier [ '=' Expression ]
  ;
  ```
- **O — `SubrangeDeclaration`** ([source](../Proposals/newlang.ye#L147))
  ```text
  SubrangeDeclaration
  :	'range' [ Derivation ] '{' Expression '...' Expression [ ';' [ DeclarationList ] ] '}'
  ;
  ```
- **O — `SetDeclaration`** ([source](../Proposals/newlang.ye#L151))
  ```text
  SetDeclaration
  :	'set' [ Derivation ] '{' Type [ ';' [ DeclarationList ] ] '}'
  ;
  ```
- **O — `ArrayDeclaration`** ([source](../Proposals/newlang.ye#L155))
  ```text
  ArrayDeclaration
  :	'array' [ Derivation ] '{' Lambda [ ';' [ DeclarationList ] ] '}'
  ;
  ```
- **O — `StructDeclaration`** ([source](../Proposals/newlang.ye#L159))
  ```text
  StructDeclaration
  :	'struct' [ Derivation ] '{' [ DeclarationList ] '}'
  ;
  ```
- **O — `DeclarationList`** ([source](../Proposals/newlang.ye#L163))
  ```text
  DeclarationList
  :	Declaration { Declaration }
  ;
  ```

### Class-model outline — M

These productions correspond to the provisionally accepted class-model
concepts. They are links to the source proposal, not acceptance of its exact
Java-derived RHS or of the unresolved helper rules listed next.

- **M — `ClassDeclaration`** ([source](../Proposals/newlang.ye#L169))
  ```text
  ClassDeclaration
  :	NormalClassDeclaration
  |	EnumDeclaration
  ;
  ```
- **M — `NormalClassDeclaration`** ([source](../Proposals/newlang.ye#L174))
  ```text
  NormalClassDeclaration
  :	{ ClassModifier } 'class' Identifier [ TypeParameters ] [ Superclass ] [ Superinterfaces ] ClassBody
  ;
  ```
- **M — `Superclass`** ([source](../Proposals/newlang.ye#L197))
  ```text
  Superclass
  :	'extends' ClassType
  ;
  ```
- **M — `Superinterfaces`** ([source](../Proposals/newlang.ye#L201))
  ```text
  Superinterfaces
  :	'implements' InterfaceTypeList
  ;
  ```
- **M — `ClassBody`** ([source](../Proposals/newlang.ye#L209))
  ```text
  ClassBody
  :	'{' { ClassBodyDeclaration } '}'
  ;
  ```
- **M — `ClassBodyDeclaration`** ([source](../Proposals/newlang.ye#L213))
  ```text
  ClassBodyDeclaration
  :	ClassMemberDeclaration
  |	InstanceInitializer
  |	StaticInitializer
  |	ConstructorDeclaration
  |	ImportDeclaration
  ;
  ```
- **M — `ClassMemberDeclaration`** ([source](../Proposals/newlang.ye#L221))
  ```text
  ClassMemberDeclaration
  :	FieldDeclaration
  |	MethodDeclaration
  |	ClassDeclaration
  |	InterfaceDeclaration
  |	';'
  ;
  ```
- **M — `FieldDeclaration`** ([source](../Proposals/newlang.ye#L229))
  ```text
  FieldDeclaration
  :	{ FieldModifier } UnannType VariableDeclaratorList ';'
  ;
  ```
- **M — `MethodDeclaration`** ([source](../Proposals/newlang.ye#L301))
  ```text
  MethodDeclaration
  :	{ MethodModifier } MethodHeader MethodBody
  ;
  ```
- **M — `ConstructorDeclaration`** ([source](../Proposals/newlang.ye#L386))
  ```text
  ConstructorDeclaration
  :	{ ConstructorModifier } ConstructorDeclarator [ Throws ] ConstructorBody
  ;
  ```
- **M — `InterfaceDeclaration`** ([source](../Proposals/newlang.ye#L438))
  ```text
  InterfaceDeclaration
  :	NormalInterfaceDeclaration
  |	AnnotationTypeDeclaration
  ;
  ```
- **M — `NormalInterfaceDeclaration`** ([source](../Proposals/newlang.ye#L443))
  ```text
  NormalInterfaceDeclaration
  :	{ InterfaceModifier } 'interface' Identifier [ TypeParameters ] [ ExtendsInterfaces ] InterfaceBody
  ;
  ```
- **M — `InterfaceBody`** ([source](../Proposals/newlang.ye#L461))
  ```text
  InterfaceBody
  :	'{' { InterfaceMemberDeclaration } '}'
  ;
  ```
- **M — `InterfaceMemberDeclaration`** ([source](../Proposals/newlang.ye#L465))
  ```text
  InterfaceMemberDeclaration
  :	ConstantDeclaration
  |	InterfaceMethodDeclaration
  |	ClassDeclaration
  |	InterfaceDeclaration
  |	';'
  ;
  ```

### Class and member details — O

These support the class outline, but DEC-019 does not settle their exact
syntax, permitted alternatives, or detailed member forms. The angle-bracket
template spelling also conflicts with the selected square-bracket spelling.

- **O — `ClassModifier`** ([source](../Proposals/newlang.ye#L178))
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
- **O — `TypeParameters`** ([source](../Proposals/newlang.ye#L189))
  ```text
  TypeParameters
  :	'<' TypeParameterList '>'
  ;
  ```
- **O — `TypeParameterList`** ([source](../Proposals/newlang.ye#L193))
  ```text
  TypeParameterList
  :	TypeParameter { ',' TypeParameter }
  ;
  ```
- **O — `InterfaceTypeList`** ([source](../Proposals/newlang.ye#L205))
  ```text
  InterfaceTypeList
  :	InterfaceType { ',' InterfaceType }
  ;
  ```
- **O — `FieldModifier`** ([source](../Proposals/newlang.ye#L233))
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
- **O / D — `VariableDeclaratorList`** ([source](../Proposals/newlang.ye#L244))
  ```text
  VariableDeclaratorList
  :	VariableDeclarator { ',' VariableDeclarator }
  ;
  ```
- **O / D — `VariableDeclarator`** ([source](../Proposals/newlang.ye#L248))
  ```text
  VariableDeclarator
  :	VariableDeclaratorId [ '=' VariableInitializer ]
  ;
  ```
- **O — `VariableDeclaratorId`** ([source](../Proposals/newlang.ye#L252))
  ```text
  VariableDeclaratorId
  :	Identifier [ Dims ]
  ;
  ```
- **O — `VariableInitializer`** ([source](../Proposals/newlang.ye#L256))
  ```text
  VariableInitializer
  :	Expression
  |	ArrayInitializer
  ;
  ```
- **O — `UnannType`** ([source](../Proposals/newlang.ye#L261))
  ```text
  UnannType
  :	UnannPrimitiveType
  |	UnannReferenceType
  ;
  ```
- **O — `UnannPrimitiveType`** ([source](../Proposals/newlang.ye#L266))
  ```text
  UnannPrimitiveType
  :	NumericType
  |	'boolean'
  ;
  ```
- **O — `UnannReferenceType`** ([source](../Proposals/newlang.ye#L271))
  ```text
  UnannReferenceType
  :	UnannClassOrInterfaceType
  |	UnannTypeVariable
  |	UnannArrayType
  ;
  ```
- **O — `UnannClassOrInterfaceType`** ([source](../Proposals/newlang.ye#L277))
  ```text
  UnannClassOrInterfaceType
  :	UnannClassType
  |	UnannInterfaceType
  ;
  ```
- **O — `UnannClassType`** ([source](../Proposals/newlang.ye#L282))
  ```text
  UnannClassType
  :	Identifier [ TypeArguments ]
  |	UnannClassOrInterfaceType '.' { Annotation } Identifier [ TypeArguments ]
  ;
  ```
- **O — `UnannInterfaceType`** ([source](../Proposals/newlang.ye#L287))
  ```text
  UnannInterfaceType
  :	UnannClassType
  ;
  ```
- **O — `UnannTypeVariable`** ([source](../Proposals/newlang.ye#L291))
  ```text
  UnannTypeVariable
  :	Identifier
  ;
  ```
- **O — `UnannArrayType`** ([source](../Proposals/newlang.ye#L295))
  ```text
  UnannArrayType
  :	UnannPrimitiveType Dims
  |	UnannClassOrInterfaceType Dims
  |	UnannTypeVariable Dims
  ;
  ```
- **O — `MethodModifier`** ([source](../Proposals/newlang.ye#L305))
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
- **O — `MethodHeader`** ([source](../Proposals/newlang.ye#L318))
  ```text
  MethodHeader
  :	Result MethodDeclarator [ Throws ]
  |	TypeParameters { Annotation } Result MethodDeclarator [ Throws ]
  ;
  ```
- **O — `Result`** ([source](../Proposals/newlang.ye#L323))
  ```text
  Result
  :	UnannType
  |	'void'
  ;
  ```
- **O — `MethodDeclarator`** ([source](../Proposals/newlang.ye#L328))
  ```text
  MethodDeclarator
  :	Identifier '(' [ FormalParameterList ] ')' [ Dims ]
  ;
  ```
- **O — `FormalParameterList`** ([source](../Proposals/newlang.ye#L332))
  ```text
  FormalParameterList
  :	FormalParameters ',' LastFormalParameter
  |	LastFormalParameter
  ;
  ```
- **O — `FormalParameters`** ([source](../Proposals/newlang.ye#L337))
  ```text
  FormalParameters
  :	FormalParameter { ',' FormalParameter }
  |	ReceiverParameter { ',' FormalParameter }
  ;
  ```
- **O — `FormalParameter`** ([source](../Proposals/newlang.ye#L342))
  ```text
  FormalParameter
  :	{ VariableModifier } UnannType VariableDeclaratorId
  ;
  ```
- **O — `VariableModifier`** ([source](../Proposals/newlang.ye#L346))
  ```text
  VariableModifier
  :	Annotation
  |	'final'
  ;
  ```
- **O — `LastFormalParameter`** ([source](../Proposals/newlang.ye#L351))
  ```text
  LastFormalParameter
  :	{ VariableModifier } UnannType { Annotation } '...' VariableDeclaratorId
  |	FormalParameter
  ;
  ```
- **O — `ReceiverParameter`** ([source](../Proposals/newlang.ye#L356))
  ```text
  ReceiverParameter
  :	{ Annotation } UnannType [ Identifier '.' ] 'this'
  ;
  ```
- **O — `Throws`** ([source](../Proposals/newlang.ye#L360))
  ```text
  Throws
  :	'throws' ExceptionTypeList
  ;
  ```
- **O — `ExceptionTypeList`** ([source](../Proposals/newlang.ye#L364))
  ```text
  ExceptionTypeList
  :	ExceptionType { ',' ExceptionType }
  ;
  ```
- **O — `ExceptionType`** ([source](../Proposals/newlang.ye#L368))
  ```text
  ExceptionType
  :	ClassType
  |	TypeVariable
  ;
  ```
- **O — `MethodBody`** ([source](../Proposals/newlang.ye#L373))
  ```text
  MethodBody
  :	Block
  |	';'
  ;
  ```
- **O — `InstanceInitializer`** ([source](../Proposals/newlang.ye#L378))
  ```text
  InstanceInitializer
  :	Block
  ;
  ```
- **O — `StaticInitializer`** ([source](../Proposals/newlang.ye#L382))
  ```text
  StaticInitializer
  :	'static' Block
  ;
  ```
- **O — `ConstructorModifier`** ([source](../Proposals/newlang.ye#L390))
  ```text
  ConstructorModifier
  :	Annotation
  |	'public'
  |	'protected'
  |	'private'
  ;
  ```
- **O — `ConstructorDeclarator`** ([source](../Proposals/newlang.ye#L397))
  ```text
  ConstructorDeclarator
  :	[ TypeParameters ] SimpleTypeName '(' [ FormalParameterList ] ')'
  ;
  ```
- **O — `ConstructorBody`** ([source](../Proposals/newlang.ye#L401))
  ```text
  ConstructorBody
  :	'{' [ ExplicitConstructorInvocation ] [ BlockStatements ] '}'
  ;
  ```
- **O — `ExplicitConstructorInvocation`** ([source](../Proposals/newlang.ye#L405))
  ```text
  ExplicitConstructorInvocation
  :	[ TypeArguments ] 'this' '(' [ ArgumentList ] ')' ';'
  |	[ TypeArguments ] 'super' '(' [ ArgumentList ] ')' ';'
  |	ExpressionName '.' [ TypeArguments ] 'super' '(' [ ArgumentList ] ')' ';'
  |	Primary '.' [ TypeArguments ] 'super' '(' [ ArgumentList ] ')' ';'
  ;
  ```
- **O — `InterfaceModifier`** ([source](../Proposals/newlang.ye#L447))
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
- **O — `ExtendsInterfaces`** ([source](../Proposals/newlang.ye#L457))
  ```text
  ExtendsInterfaces
  :	'extends' InterfaceTypeList
  ;
  ```

### Java-like productions not adopted — J

The following are Java-like grammar material rather than selected NewLang
requirements. DEC-019 explicitly does not adopt every Java-like construct;
DEC-076 also means these are not additional parser productions.

- **J / D — `EnumDeclaration`** ([source](../Proposals/newlang.ye#L412))
  ```text
  EnumDeclaration
  :	{ ClassModifier } 'enum' Identifier [ Superinterfaces ] EnumBody
  ;
  ```
- **J — `EnumBody`** ([source](../Proposals/newlang.ye#L416))
  ```text
  EnumBody
  :	'{' [ EnumConstantList ] [ ',' ] [ EnumBodyDeclarations ] '}'
  ;
  ```
- **J — `EnumConstantList`** ([source](../Proposals/newlang.ye#L420))
  ```text
  EnumConstantList
  :	EnumConstant { ',' EnumConstant }
  ;
  ```
- **J — `EnumConstant`** ([source](../Proposals/newlang.ye#L424))
  ```text
  EnumConstant
  :	{ EnumConstantModifier } Identifier [ '(' [ ArgumentList ] ')' ] [ ClassBody ]
  ;
  ```
- **J — `EnumConstantModifier`** ([source](../Proposals/newlang.ye#L428))
  ```text
  EnumConstantModifier
  :	Annotation
  ;
  ```
- **J — `EnumBodyDeclarations`** ([source](../Proposals/newlang.ye#L432))
  ```text
  EnumBodyDeclarations
  :	';' { ClassBodyDeclaration }
  ;
  ```
- **J — `ConstantDeclaration`** ([source](../Proposals/newlang.ye#L473))
  ```text
  ConstantDeclaration
  :	{ ConstantModifier } UnannType VariableDeclaratorList ';'
  ;
  ```
- **J — `ConstantModifier`** ([source](../Proposals/newlang.ye#L477))
  ```text
  ConstantModifier
  :	Annotation
  |	'public'
  |	'static'
  |	'final'
  ;
  ```
- **J — `InterfaceMethodDeclaration`** ([source](../Proposals/newlang.ye#L484))
  ```text
  InterfaceMethodDeclaration
  :	{ InterfaceMethodModifier } MethodHeader MethodBody
  ;
  ```
- **J — `InterfaceMethodModifier`** ([source](../Proposals/newlang.ye#L488))
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
- **J — `AnnotationTypeDeclaration`** ([source](../Proposals/newlang.ye#L497))
  ```text
  AnnotationTypeDeclaration
  :	{ InterfaceModifier } '@' 'interface' Identifier AnnotationTypeBody
  ;
  ```
- **J — `AnnotationTypeBody`** ([source](../Proposals/newlang.ye#L501))
  ```text
  AnnotationTypeBody
  :	'{' { AnnotationTypeMemberDeclaration } '}'
  ;
  ```
- **J — `AnnotationTypeMemberDeclaration`** ([source](../Proposals/newlang.ye#L505))
  ```text
  AnnotationTypeMemberDeclaration
  :	AnnotationTypeElementDeclaration
  |	ConstantDeclaration
  |	ClassDeclaration
  |	InterfaceDeclaration
  |	';'
  ;
  ```
- **J — `AnnotationTypeElementDeclaration`** ([source](../Proposals/newlang.ye#L513))
  ```text
  AnnotationTypeElementDeclaration
  :	{ AnnotationTypeElementModifier } UnannType Identifier '(' ')' [ Dims ] [ DefaultValue ] ';'
  ;
  ```
- **J — `AnnotationTypeElementModifier`** ([source](../Proposals/newlang.ye#L517))
  ```text
  AnnotationTypeElementModifier
  :	Annotation
  |	'public'
  |	'abstract'
  ;
  ```
- **J — `DefaultValue`** ([source](../Proposals/newlang.ye#L523))
  ```text
  DefaultValue
  :	'default' ElementValue
  ;
  ```
- **J — `Annotation`** ([source](../Proposals/newlang.ye#L527))
  ```text
  Annotation
  :	NormalAnnotation
  |	MarkerAnnotation
  |	SingleElementAnnotation
  ;
  ```
- **J — `NormalAnnotation`** ([source](../Proposals/newlang.ye#L533))
  ```text
  NormalAnnotation
  :	'@' TypeName '(' [ ElementValuePairList ] ')'
  ;
  ```
- **J — `ElementValuePairList`** ([source](../Proposals/newlang.ye#L537))
  ```text
  ElementValuePairList
  :	ElementValuePair { ',' ElementValuePair }
  ;
  ```
- **J — `ElementValuePair`** ([source](../Proposals/newlang.ye#L541))
  ```text
  ElementValuePair
  :	Identifier '=' ElementValue
  ;
  ```
- **J — `ElementValue`** ([source](../Proposals/newlang.ye#L545))
  ```text
  ElementValue
  :	ConditionalExpression
  |	ElementValueArrayInitializer
  |	Annotation
  ;
  ```
- **J — `ElementValueArrayInitializer`** ([source](../Proposals/newlang.ye#L551))
  ```text
  ElementValueArrayInitializer
  :	'{' [ ElementValueList ] [ ',' ] '}'
  ;
  ```
- **J — `ElementValueList`** ([source](../Proposals/newlang.ye#L555))
  ```text
  ElementValueList
  :	ElementValue { ',' ElementValue }
  ;
  ```
- **J — `MarkerAnnotation`** ([source](../Proposals/newlang.ye#L559))
  ```text
  MarkerAnnotation
  :	'@' TypeName
  ;
  ```
- **J — `SingleElementAnnotation`** ([source](../Proposals/newlang.ye#L563))
  ```text
  SingleElementAnnotation
  :	'@' TypeName '(' ElementValue ')'
  ;
  ```
- **J — `ArrayInitializer`** ([source](../Proposals/newlang.ye#L569))
  ```text
  ArrayInitializer
  :	{ [ VariableInitializerList ] [ ',' ] }
  ;
  ```
- **J — `VariableInitializerList`** ([source](../Proposals/newlang.ye#L573))
  ```text
  VariableInitializerList
  :	VariableInitializer { ',' VariableInitializer }
  ;
  ```
- **J — `Block`** ([source](../Proposals/newlang.ye#L579))
  ```text
  Block
  :	'{' [ BlockStatements ] '}'
  ;
  ```
- **J — `BlockStatements`** ([source](../Proposals/newlang.ye#L583))
  ```text
  BlockStatements
  :	BlockStatement { BlockStatement }
  ;
  ```
- **J — `BlockStatement`** ([source](../Proposals/newlang.ye#L587))
  ```text
  BlockStatement
  :	LocalVariableDeclarationStatement
  |	ClassDeclaration
  |	Statement
  ;
  ```
- **J — `LocalVariableDeclarationStatement`** ([source](../Proposals/newlang.ye#L593))
  ```text
  LocalVariableDeclarationStatement
  :	LocalVariableDeclaration ';'
  ;
  ```
- **J — `LocalVariableDeclaration`** ([source](../Proposals/newlang.ye#L597))
  ```text
  LocalVariableDeclaration
  :	{ VariableModifier } UnannType VariableDeclaratorList
  ;
  ```
- **J — `Statement`** ([source](../Proposals/newlang.ye#L601))
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
- **J — `StatementNoShortIf`** ([source](../Proposals/newlang.ye#L610))
  ```text
  StatementNoShortIf
  :	StatementWithoutTrailingSubstatement
  |	LabeledStatementNoShortIf
  |	IfThenElseStatementNoShortIf
  |	WhileStatementNoShortIf
  |	ForStatementNoShortIf
  ;
  ```
- **J — `StatementWithoutTrailingSubstatement`** ([source](../Proposals/newlang.ye#L618))
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
- **J — `EmptyStatement`** ([source](../Proposals/newlang.ye#L633))
  ```text
  EmptyStatement
  :	';'
  ;
  ```
- **J — `LabeledStatement`** ([source](../Proposals/newlang.ye#L637))
  ```text
  LabeledStatement
  :	Identifier ':' Statement
  ;
  ```
- **J — `LabeledStatementNoShortIf`** ([source](../Proposals/newlang.ye#L641))
  ```text
  LabeledStatementNoShortIf
  :	Identifier ':' StatementNoShortIf
  ;
  ```
- **J — `ExpressionStatement`** ([source](../Proposals/newlang.ye#L645))
  ```text
  ExpressionStatement
  :	StatementExpression ';'
  ;
  ```
- **J — `StatementExpression`** ([source](../Proposals/newlang.ye#L649))
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
- **J — `IfThenStatement`** ([source](../Proposals/newlang.ye#L659))
  ```text
  IfThenStatement
  :	'if' '(' Expression ')' Statement
  ;
  ```
- **J — `IfThenElseStatement`** ([source](../Proposals/newlang.ye#L663))
  ```text
  IfThenElseStatement
  :	'if' '(' Expression ')' StatementNoShortIf 'else' Statement
  ;
  ```
- **J — `IfThenElseStatementNoShortIf`** ([source](../Proposals/newlang.ye#L667))
  ```text
  IfThenElseStatementNoShortIf
  :	'if' '(' Expression ')' StatementNoShortIf 'else' StatementNoShortIf
  ;
  ```
- **J — `AssertStatement`** ([source](../Proposals/newlang.ye#L671))
  ```text
  AssertStatement
  :	'assert' Expression ';'
  |	'assert' Expression ':' Expression ';'
  ;
  ```
- **J — `SwitchStatement`** ([source](../Proposals/newlang.ye#L676))
  ```text
  SwitchStatement
  :	'switch' '(' Expression ')' SwitchBlock
  ;
  ```
- **J — `SwitchBlock`** ([source](../Proposals/newlang.ye#L680))
  ```text
  SwitchBlock
  :	'{' { SwitchBlockStatementGroup } { SwitchLabel } '}'
  ;
  ```
- **J — `SwitchBlockStatementGroup`** ([source](../Proposals/newlang.ye#L684))
  ```text
  SwitchBlockStatementGroup
  :	SwitchLabels BlockStatements
  ;
  ```
- **J — `SwitchLabels`** ([source](../Proposals/newlang.ye#L688))
  ```text
  SwitchLabels
  :	SwitchLabel { SwitchLabel }
  ;
  ```
- **J — `SwitchLabel`** ([source](../Proposals/newlang.ye#L692))
  ```text
  SwitchLabel
  :	'case' ConstantExpression ':'
  |	'case' EnumConstantName ':'
  |	'default' ':'
  ;
  ```
- **J — `EnumConstantName`** ([source](../Proposals/newlang.ye#L698))
  ```text
  EnumConstantName
  :	Identifier
  ;
  ```
- **J — `WhileStatement`** ([source](../Proposals/newlang.ye#L702))
  ```text
  WhileStatement
  :	'while' '(' Expression ')' Statement
  ;
  ```
- **J — `WhileStatementNoShortIf`** ([source](../Proposals/newlang.ye#L706))
  ```text
  WhileStatementNoShortIf
  :	'while' '(' Expression ')' StatementNoShortIf
  ;
  ```
- **J — `DoStatement`** ([source](../Proposals/newlang.ye#L710))
  ```text
  DoStatement
  :	'do' Statement 'while' '(' Expression ')' ';'
  ;
  ```
- **J — `ForStatement`** ([source](../Proposals/newlang.ye#L714))
  ```text
  ForStatement
  :	BasicForStatement
  |	EnhancedForStatement
  ;
  ```
- **J — `ForStatementNoShortIf`** ([source](../Proposals/newlang.ye#L719))
  ```text
  ForStatementNoShortIf
  :	BasicForStatementNoShortIf
  |	EnhancedForStatementNoShortIf
  ;
  ```
- **J — `BasicForStatement`** ([source](../Proposals/newlang.ye#L724))
  ```text
  BasicForStatement
  :	'for' '(' [ ForInit ] ';' [ Expression ] ';' [ ForUpdate ] ')' Statement
  ;
  ```
- **J — `BasicForStatementNoShortIf`** ([source](../Proposals/newlang.ye#L728))
  ```text
  BasicForStatementNoShortIf
  :	'for' '(' [ ForInit ] ';' [ Expression ] ';' [ ForUpdate ] ')' StatementNoShortIf
  ;
  ```
- **J — `ForInit`** ([source](../Proposals/newlang.ye#L732))
  ```text
  ForInit
  :	StatementExpressionList
  |	LocalVariableDeclaration
  ;
  ```
- **J — `ForUpdate`** ([source](../Proposals/newlang.ye#L737))
  ```text
  ForUpdate
  :	StatementExpressionList
  ;
  ```
- **J — `StatementExpressionList`** ([source](../Proposals/newlang.ye#L741))
  ```text
  StatementExpressionList
  :	StatementExpression { ',' StatementExpression }
  ;
  ```
- **J — `EnhancedForStatement`** ([source](../Proposals/newlang.ye#L745))
  ```text
  EnhancedForStatement
  :	'for' '(' { VariableModifier } UnannType VariableDeclaratorId ':' Expression ')' Statement
  ;
  ```
- **J — `EnhancedForStatementNoShortIf`** ([source](../Proposals/newlang.ye#L749))
  ```text
  EnhancedForStatementNoShortIf
  :	'for' '(' { VariableModifier } UnannType VariableDeclaratorId ':' Expression ')' StatementNoShortIf
  ;
  ```
- **J — `BreakStatement`** ([source](../Proposals/newlang.ye#L753))
  ```text
  BreakStatement
  :	'break' [ Identifier ] ';'
  ;
  ```
- **J — `ContinueStatement`** ([source](../Proposals/newlang.ye#L757))
  ```text
  ContinueStatement
  :	'continue' [ Identifier ] ';'
  ;
  ```
- **J — `ReturnStatement`** ([source](../Proposals/newlang.ye#L761))
  ```text
  ReturnStatement
  :	'return' [ Expression ] ';'
  ;
  ```
- **J — `ThrowStatement`** ([source](../Proposals/newlang.ye#L765))
  ```text
  ThrowStatement
  :	'throw' Expression ';'
  ;
  ```
- **J — `SynchronizedStatement`** ([source](../Proposals/newlang.ye#L769))
  ```text
  SynchronizedStatement
  :	'synchronized' '(' Expression ')' Block
  ;
  ```
- **J — `TryStatement`** ([source](../Proposals/newlang.ye#L773))
  ```text
  TryStatement
  :	'try' Block Catches
  |	'try' Block [ Catches ] Finally
  |	TryWithResourcesStatement
  ;
  ```
- **J — `Catches`** ([source](../Proposals/newlang.ye#L779))
  ```text
  Catches
  :	CatchClause { CatchClause }
  ;
  ```
- **J — `CatchClause`** ([source](../Proposals/newlang.ye#L783))
  ```text
  CatchClause
  :	'catch' '(' CatchFormalParameter ')' Block
  ;
  ```
- **J — `CatchFormalParameter`** ([source](../Proposals/newlang.ye#L787))
  ```text
  CatchFormalParameter
  :	{ VariableModifier } CatchType VariableDeclaratorId
  ;
  ```
- **J — `CatchType`** ([source](../Proposals/newlang.ye#L791))
  ```text
  CatchType
  :	UnannClassType { '|' ClassType }
  ;
  ```
- **J — `Finally`** ([source](../Proposals/newlang.ye#L795))
  ```text
  Finally
  :	'finally' Block
  ;
  ```
- **J — `TryWithResourcesStatement`** ([source](../Proposals/newlang.ye#L799))
  ```text
  TryWithResourcesStatement
  :	'try' ResourceSpecification Block [ Catches ] [ Finally ]
  ;
  ```
- **J — `ResourceSpecification`** ([source](../Proposals/newlang.ye#L803))
  ```text
  ResourceSpecification
  :	'(' ResourceList [ ';' ] ')'
  ;
  ```
- **J — `ResourceList`** ([source](../Proposals/newlang.ye#L807))
  ```text
  ResourceList
  :	Resource { ';' Resource }
  ;
  ```
- **J — `Resource`** ([source](../Proposals/newlang.ye#L811))
  ```text
  Resource
  :	{ VariableModifier } UnannType VariableDeclaratorId '=' Expression
  ;
  ```
- **J — `Primary`** ([source](../Proposals/newlang.ye#L817))
  ```text
  Primary
  :	PrimaryNoNewArray
  |	ArrayCreationExpression
  ;
  ```
- **J — `PrimaryNoNewArray`** ([source](../Proposals/newlang.ye#L822))
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
- **J — `ClassInstanceCreationExpression`** ([source](../Proposals/newlang.ye#L836))
  ```text
  ClassInstanceCreationExpression
  :	'new' [ TypeArguments ] { Annotation } Identifier [ TypeArgumentsOrDiamond ] '(' [ ArgumentList ] ')' [ ClassBody ]
  |	ExpressionName '.' 'new' [ TypeArguments ] { Annotation } Identifier [ TypeArgumentsOrDiamond ] '(' [ ArgumentList ] ')' [ ClassBody ]
  |	Primary '.' 'new' [ TypeArguments ] { Annotation } Identifier [ TypeArgumentsOrDiamond ] '(' [ ArgumentList ] ')' [ ClassBody ]
  ;
  ```
- **J — `TypeArgumentsOrDiamond`** ([source](../Proposals/newlang.ye#L842))
  ```text
  TypeArgumentsOrDiamond
  :	TypeArguments
  |	'<' '>'
  ;
  ```
- **J — `FieldAccess`** ([source](../Proposals/newlang.ye#L847))
  ```text
  FieldAccess
  :	Primary '.' Identifier
  |	'super' '.' Identifier
  |	TypeName '.' 'super' '.' Identifier
  ;
  ```
- **J — `ArrayAccess`** ([source](../Proposals/newlang.ye#L853))
  ```text
  ArrayAccess
  :	ExpressionName '[' Expression ']'
  |	PrimaryNoNewArray '[' Expression ']'
  ;
  ```
- **J — `MethodInvocation`** ([source](../Proposals/newlang.ye#L858))
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
- **J — `ArgumentList`** ([source](../Proposals/newlang.ye#L867))
  ```text
  ArgumentList
  :	Expression { ',' Expression }
  ;
  ```
- **J — `MethodReference`** ([source](../Proposals/newlang.ye#L871))
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
- **J — `ArrayCreationExpression`** ([source](../Proposals/newlang.ye#L881))
  ```text
  ArrayCreationExpression
  :	'new' PrimitiveType DimExprs [ Dims ]
  |	'new' ClassOrInterfaceType DimExprs [ Dims ]
  |	'new' PrimitiveType Dims ArrayInitializer
  |	'new' ClassOrInterfaceType Dims ArrayInitializer
  ;
  ```
- **J — `DimExprs`** ([source](../Proposals/newlang.ye#L888))
  ```text
  DimExprs
  :	DimExpr { DimExpr }
  ;
  ```
- **J — `DimExpr`** ([source](../Proposals/newlang.ye#L892))
  ```text
  DimExpr
  :	{ Annotation } '[' Expression ']'
  ;
  ```
- **J — `ConstantExpression`** ([source](../Proposals/newlang.ye#L896))
  ```text
  ConstantExpression
  :	Expression
  ;
  ```
- **J — `Expression`** ([source](../Proposals/newlang.ye#L900))
  ```text
  Expression
  :	LambdaExpression
  |	AssignmentExpression
  ;
  ```
- **J — `LambdaExpression`** ([source](../Proposals/newlang.ye#L905))
  ```text
  LambdaExpression
  :	LambdaParameters '->' LambdaBody
  ;
  ```
- **J — `LambdaParameters`** ([source](../Proposals/newlang.ye#L909))
  ```text
  LambdaParameters
  :	Identifier
  |	'(' [ FormalParameterList ] ')'
  |	'(' InferredFormalParameterList ')'
  ;
  ```
- **J — `InferredFormalParameterList`** ([source](../Proposals/newlang.ye#L915))
  ```text
  InferredFormalParameterList
  :	Identifier { ',' Identifier }
  ;
  ```
- **J — `LambdaBody`** ([source](../Proposals/newlang.ye#L919))
  ```text
  LambdaBody
  :	Expression
  |	Block
  ;
  ```
- **J — `AssignmentExpression`** ([source](../Proposals/newlang.ye#L924))
  ```text
  AssignmentExpression
  :	ConditionalExpression
  |	Assignment
  ;
  ```
- **J — `Assignment`** ([source](../Proposals/newlang.ye#L929))
  ```text
  Assignment
  :	LeftHandSide AssignmentOperator Expression
  ;
  ```
- **J — `LeftHandSide`** ([source](../Proposals/newlang.ye#L933))
  ```text
  LeftHandSide
  :	ExpressionName
  |	FieldAccess
  |	ArrayAccess
  ;
  ```
- **J — `AssignmentOperator`** ([source](../Proposals/newlang.ye#L939))
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
- **J — `ConditionalExpression`** ([source](../Proposals/newlang.ye#L954))
  ```text
  ConditionalExpression
  :	ConditionalOrExpression
  |	ConditionalOrExpression '?' Expression ':' ConditionalExpression
  ;
  ```
- **J — `ConditionalOrExpression`** ([source](../Proposals/newlang.ye#L959))
  ```text
  ConditionalOrExpression
  :	ConditionalAndExpression
  |	ConditionalOrExpression '||' ConditionalAndExpression
  ;
  ```
- **J — `ConditionalAndExpression`** ([source](../Proposals/newlang.ye#L964))
  ```text
  ConditionalAndExpression
  :	InclusiveOrExpression
  |	ConditionalAndExpression '&&' InclusiveOrExpression
  ;
  ```
- **J — `InclusiveOrExpression`** ([source](../Proposals/newlang.ye#L969))
  ```text
  InclusiveOrExpression
  :	ExclusiveOrExpression
  |	InclusiveOrExpression '|' ExclusiveOrExpression
  ;
  ```
- **J — `ExclusiveOrExpression`** ([source](../Proposals/newlang.ye#L974))
  ```text
  ExclusiveOrExpression
  :	AndExpression
  |	ExclusiveOrExpression '^' AndExpression
  ;
  ```
- **J — `AndExpression`** ([source](../Proposals/newlang.ye#L979))
  ```text
  AndExpression
  :	EqualityExpression
  |	AndExpression '&' EqualityExpression
  ;
  ```
- **J — `EqualityExpression`** ([source](../Proposals/newlang.ye#L984))
  ```text
  EqualityExpression
  :	RelationalExpression
  |	EqualityExpression '==' RelationalExpression
  |	EqualityExpression '!=' RelationalExpression
  ;
  ```
- **J — `RelationalExpression`** ([source](../Proposals/newlang.ye#L990))
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
- **J — `ShiftExpression`** ([source](../Proposals/newlang.ye#L999))
  ```text
  ShiftExpression
  :	AdditiveExpression
  |	ShiftExpression '<<' AdditiveExpression
  |	ShiftExpression '>>' AdditiveExpression
  |	ShiftExpression '>>>' AdditiveExpression
  ;
  ```
- **J — `AdditiveExpression`** ([source](../Proposals/newlang.ye#L1006))
  ```text
  AdditiveExpression
  :	MultiplicativeExpression
  |	AdditiveExpression '+' MultiplicativeExpression
  |	AdditiveExpression '-' MultiplicativeExpression
  ;
  ```
- **J — `MultiplicativeExpression`** ([source](../Proposals/newlang.ye#L1012))
  ```text
  MultiplicativeExpression
  :	UnaryExpression
  |	MultiplicativeExpression '*' UnaryExpression
  |	MultiplicativeExpression '/' UnaryExpression
  |	MultiplicativeExpression '%' UnaryExpression
  ;
  ```
- **J — `UnaryExpression`** ([source](../Proposals/newlang.ye#L1019))
  ```text
  UnaryExpression
  :	PreIncrementExpression
  |	PreDecrementExpression
  |	'+' UnaryExpression
  |	'-' UnaryExpression
  |	UnaryExpressionNotPlusMinus
  ;
  ```
- **J — `PreIncrementExpression`** ([source](../Proposals/newlang.ye#L1027))
  ```text
  PreIncrementExpression
  :	'++' UnaryExpression
  ;
  ```
- **J — `PreDecrementExpression`** ([source](../Proposals/newlang.ye#L1031))
  ```text
  PreDecrementExpression
  :	'--' UnaryExpression
  ;
  ```
- **J — `UnaryExpressionNotPlusMinus`** ([source](../Proposals/newlang.ye#L1035))
  ```text
  UnaryExpressionNotPlusMinus
  :	PostfixExpression
  |	'~' UnaryExpression
  |	'!' UnaryExpression
  |	CastExpression
  ;
  ```
- **J — `PostfixExpression`** ([source](../Proposals/newlang.ye#L1042))
  ```text
  PostfixExpression
  :	Primary
  |	ExpressionName
  |	PostIncrementExpression
  |	PostDecrementExpression
  ;
  ```
- **J — `PostIncrementExpression`** ([source](../Proposals/newlang.ye#L1049))
  ```text
  PostIncrementExpression
  :	PostfixExpression '++'
  ;
  ```
- **J — `PostDecrementExpression`** ([source](../Proposals/newlang.ye#L1053))
  ```text
  PostDecrementExpression
  :	PostfixExpression '--'
  ;
  ```
- **J — `CastExpression`** ([source](../Proposals/newlang.ye#L1057))
  ```text
  CastExpression
  :	'(' PrimitiveType ')' UnaryExpression
  |	'(' ReferenceType { AdditionalBound } ')' UnaryExpressionNotPlusMinus
  |	'(' ReferenceType { AdditionalBound } ')' LambdaExpression
  ;
  ```

### Name and type productions — J

These further Java-like productions duplicate or extend the earlier type/name
proposal. The angle-bracket type-argument syntax is not selected; DEC-011 uses
square brackets for templates.

- **J / D — `PackageName`** ([source](../Proposals/newlang.ye#L1065))
  ```text
  PackageName
  :	Identifier
  |	PackageName '.' Identifier
  ;
  ```
- **J — `TypeName`** ([source](../Proposals/newlang.ye#L1070))
  ```text
  TypeName
  :	Identifier
  |	PackageOrTypeName '.' Identifier
  ;
  ```
- **J — `PackageOrTypeName`** ([source](../Proposals/newlang.ye#L1075))
  ```text
  PackageOrTypeName
  :	Identifier
  |	PackageOrTypeName '.' Identifier
  ;
  ```
- **J — `ExpressionName`** ([source](../Proposals/newlang.ye#L1080))
  ```text
  ExpressionName
  :	Identifier
  |	AmbiguousName '.' Identifier
  ;
  ```
- **J — `MethodName`** ([source](../Proposals/newlang.ye#L1085))
  ```text
  MethodName
  :	Identifier
  ;
  ```
- **J — `AmbiguousName`** ([source](../Proposals/newlang.ye#L1089))
  ```text
  AmbiguousName
  :	Identifier
  |	AmbiguousName '.' Identifier
  ;
  ```
- **J — `SimpleTypeName`** ([source](../Proposals/newlang.ye#L1096))
  ```text
  SimpleTypeName
  :	Identifier
  ;
  ```
- **J — `TypeParameterModifier`** ([source](../Proposals/newlang.ye#L1100))
  ```text
  TypeParameterModifier
  :	Annotation
  ;
  ```
- **J / D — `Type`** ([source](../Proposals/newlang.ye#L1108))
  ```text
  Type
  :	PrimitiveType
  |	ReferenceType
  ;
  ```
- **J — `PrimitiveType`** ([source](../Proposals/newlang.ye#L1113))
  ```text
  PrimitiveType
  :	{ Annotation } NumericType
  |	{ Annotation } 'boolean'
  ;
  ```
- **J — `NumericType`** ([source](../Proposals/newlang.ye#L1118))
  ```text
  NumericType
  :	IntegralType
  |	FloatingPointType
  ;
  ```
- **J — `IntegralType`** ([source](../Proposals/newlang.ye#L1123))
  ```text
  IntegralType
  :	'byte'
  |	'short'
  |	'int'
  |	'long'
  |	'char'
  ;
  ```
- **J — `FloatingPointType`** ([source](../Proposals/newlang.ye#L1131))
  ```text
  FloatingPointType
  :	'float'
  |	'double'
  ;
  ```
- **J — `ReferenceType`** ([source](../Proposals/newlang.ye#L1136))
  ```text
  ReferenceType
  :	ClassOrInterfaceType
  |	TypeVariable
  |	ArrayType
  ;
  ```
- **J — `ClassOrInterfaceType`** ([source](../Proposals/newlang.ye#L1142))
  ```text
  ClassOrInterfaceType
  :	ClassType
  |	InterfaceType
  ;
  ```
- **J — `ClassType`** ([source](../Proposals/newlang.ye#L1147))
  ```text
  ClassType
  :	{ Annotation } Identifier [ TypeArguments ]
  |	ClassOrInterfaceType '.' { Annotation } Identifier [ TypeArguments ]
  ;
  ```
- **J — `InterfaceType`** ([source](../Proposals/newlang.ye#L1152))
  ```text
  InterfaceType
  :	ClassType
  ;
  ```
- **J — `TypeVariable`** ([source](../Proposals/newlang.ye#L1156))
  ```text
  TypeVariable
  :	{ Annotation } Identifier
  ;
  ```
- **J — `ArrayType`** ([source](../Proposals/newlang.ye#L1160))
  ```text
  ArrayType
  :	PrimitiveType Dims
  |	ClassOrInterfaceType Dims
  |	TypeVariable Dims
  ;
  ```
- **J — `Dims`** ([source](../Proposals/newlang.ye#L1166))
  ```text
  Dims
  :	{ Annotation } '[' ']' { { Annotation } '[' ']' }
  ;
  ```
- **J — `TypeParameter`** ([source](../Proposals/newlang.ye#L1170))
  ```text
  TypeParameter
  :	{ TypeParameterModifier } Identifier [ TypeBound ]
  ;
  ```
- **J — `TypeBound`** ([source](../Proposals/newlang.ye#L1174))
  ```text
  TypeBound
  :	'extends' TypeVariable
  |	'extends' ClassOrInterfaceType { AdditionalBound }
  ;
  ```
- **J — `AdditionalBound`** ([source](../Proposals/newlang.ye#L1179))
  ```text
  AdditionalBound
  :	'&' InterfaceType
  ;
  ```
- **J — `TypeArguments`** ([source](../Proposals/newlang.ye#L1183))
  ```text
  TypeArguments
  :	'<' TypeArgumentList '>'
  ;
  ```
- **J — `TypeArgumentList`** ([source](../Proposals/newlang.ye#L1187))
  ```text
  TypeArgumentList
  :	TypeArgument { ',' TypeArgument }
  ;
  ```
- **J — `TypeArgument`** ([source](../Proposals/newlang.ye#L1191))
  ```text
  TypeArgument
  :	ReferenceType
  |	Wildcard
  ;
  ```
- **J — `Wildcard`** ([source](../Proposals/newlang.ye#L1196))
  ```text
  Wildcard
  :	{ Annotation } '?' [ WildcardBounds ]
  ;
  ```
- **J — `WildcardBounds`** ([source](../Proposals/newlang.ye#L1200))
  ```text
  WildcardBounds
  :	'extends' ReferenceType
  |	'super' ReferenceType
  ;
  ```

`newlang` at line 99 is a file marker, not a production. The source also has
two `PackageName`, `Type`, `VariableDeclaratorList`, `VariableDeclarator`, and
`EnumDeclaration` definitions; see the linked occurrences above. In addition
to those duplicates, the Java-like sections introduce syntax and names that
are not established by the NewLang proposal or current decisions. These gaps
must be resolved before treating `newlang.ye` as a normative complete grammar.
