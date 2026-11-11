# `newlang.ye` production overview

This is an inventory of the 231 production occurrences in
[`Proposals/newlang.ye`](../Proposals/newlang.ye), not an endorsement of that
file as the current language grammar. Each production name below links to its
verbatim rule in the source; keeping the RHS there avoids maintaining a second,
potentially divergent copy. Repeated names are listed separately at each
definition.

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
- **D — duplicate definition:** The name is defined more than once in the
  source. The definitions overlap or conflict, so a canonical rule must be
  chosen before either can be treated as a single production.

## Production inventory

### Package, declaration, and value-type proposal — O

The concrete package, import/export, declaration, and type spellings here are
not settled language syntax. In particular, a trailing semicolon is not
generally a required declaration terminator (DEC-051), and the name-first
binding forms in DEC-011 are not represented by these declaration rules.

- [CompilationUnit](../Proposals/newlang.ye#L4)
- [PackageName](../Proposals/newlang.ye#L10)
- [SubPackageName](../Proposals/newlang.ye#L14)
- [PackageInterfaceFile](../Proposals/newlang.ye#L20)
- [RemotePackageDef](../Proposals/newlang.ye#L24)
- [PackageExportsFile](../Proposals/newlang.ye#L30)
- [ModuleName](../Proposals/newlang.ye#L34)
- [ModuleDeclarationFile](../Proposals/newlang.ye#L41)
- [ContextDeclaration](../Proposals/newlang.ye#L45)
- [Declaration](../Proposals/newlang.ye#L51)
- [Modifier](../Proposals/newlang.ye#L55)
- [BasicDeclaration](../Proposals/newlang.ye#L70)
- [ImportDeclaration](../Proposals/newlang.ye#L76)
- [Name](../Proposals/newlang.ye#L80)
- [FieldOrConstantDeclaration](../Proposals/newlang.ye#L84)
- [VariableDeclaratorList](../Proposals/newlang.ye#L88)
- [VariableDeclarator](../Proposals/newlang.ye#L92)
- [TypeDeclaration](../Proposals/newlang.ye#L96)
- [Type](../Proposals/newlang.ye#L102)
- [BasicType](../Proposals/newlang.ye#L106)
- [ValueTypeDeclaration](../Proposals/newlang.ye#L112)
- [OrdinalTypeDeclaration](../Proposals/newlang.ye#L117)
- [ComposedTypeDeclaration](../Proposals/newlang.ye#L122)
- [ReferenceTypeDeclaration](../Proposals/newlang.ye#L128)
- [EnumDeclaration](../Proposals/newlang.ye#L135)
- [EnumDeclaratorList](../Proposals/newlang.ye#L139)
- [EnumDeclarator](../Proposals/newlang.ye#L143)
- [SubrangeDeclaration](../Proposals/newlang.ye#L147)
- [SetDeclaration](../Proposals/newlang.ye#L151)
- [ArrayDeclaration](../Proposals/newlang.ye#L155)
- [StructDeclaration](../Proposals/newlang.ye#L159)
- [DeclarationList](../Proposals/newlang.ye#L163)

### Class-model outline — M

These productions correspond to the provisionally accepted class-model
concepts. They are links to the source proposal, not acceptance of its exact
Java-derived RHS or of the unresolved helper rules listed next.

- [ClassDeclaration](../Proposals/newlang.ye#L169)
- [NormalClassDeclaration](../Proposals/newlang.ye#L174)
- [Superclass](../Proposals/newlang.ye#L197)
- [Superinterfaces](../Proposals/newlang.ye#L201)
- [ClassBody](../Proposals/newlang.ye#L209)
- [ClassBodyDeclaration](../Proposals/newlang.ye#L213)
- [ClassMemberDeclaration](../Proposals/newlang.ye#L221)
- [FieldDeclaration](../Proposals/newlang.ye#L229)
- [MethodDeclaration](../Proposals/newlang.ye#L301)
- [ConstructorDeclaration](../Proposals/newlang.ye#L386)
- [InterfaceDeclaration](../Proposals/newlang.ye#L438)
- [NormalInterfaceDeclaration](../Proposals/newlang.ye#L443)
- [InterfaceBody](../Proposals/newlang.ye#L461)
- [InterfaceMemberDeclaration](../Proposals/newlang.ye#L465)

### Class and member details — O

These support the class outline, but DEC-019 does not settle their exact
syntax, permitted alternatives, or detailed member forms. The angle-bracket
template spelling also conflicts with the selected square-bracket spelling.

- [ClassModifier](../Proposals/newlang.ye#L178)
- [TypeParameters](../Proposals/newlang.ye#L189)
- [TypeParameterList](../Proposals/newlang.ye#L193)
- [InterfaceTypeList](../Proposals/newlang.ye#L205)
- [FieldModifier](../Proposals/newlang.ye#L233)
- [VariableDeclaratorList](../Proposals/newlang.ye#L244)
- [VariableDeclarator](../Proposals/newlang.ye#L248)
- [VariableDeclaratorId](../Proposals/newlang.ye#L252)
- [VariableInitializer](../Proposals/newlang.ye#L256)
- [UnannType](../Proposals/newlang.ye#L261)
- [UnannPrimitiveType](../Proposals/newlang.ye#L266)
- [UnannReferenceType](../Proposals/newlang.ye#L271)
- [UnannClassOrInterfaceType](../Proposals/newlang.ye#L277)
- [UnannClassType](../Proposals/newlang.ye#L282)
- [UnannInterfaceType](../Proposals/newlang.ye#L287)
- [UnannTypeVariable](../Proposals/newlang.ye#L291)
- [UnannArrayType](../Proposals/newlang.ye#L295)
- [MethodModifier](../Proposals/newlang.ye#L305)
- [MethodHeader](../Proposals/newlang.ye#L318)
- [Result](../Proposals/newlang.ye#L323)
- [MethodDeclarator](../Proposals/newlang.ye#L328)
- [FormalParameterList](../Proposals/newlang.ye#L332)
- [FormalParameters](../Proposals/newlang.ye#L337)
- [FormalParameter](../Proposals/newlang.ye#L342)
- [VariableModifier](../Proposals/newlang.ye#L346)
- [LastFormalParameter](../Proposals/newlang.ye#L351)
- [ReceiverParameter](../Proposals/newlang.ye#L356)
- [Throws](../Proposals/newlang.ye#L360)
- [ExceptionTypeList](../Proposals/newlang.ye#L364)
- [ExceptionType](../Proposals/newlang.ye#L368)
- [MethodBody](../Proposals/newlang.ye#L373)
- [InstanceInitializer](../Proposals/newlang.ye#L378)
- [StaticInitializer](../Proposals/newlang.ye#L382)
- [ConstructorModifier](../Proposals/newlang.ye#L390)
- [ConstructorDeclarator](../Proposals/newlang.ye#L397)
- [ConstructorBody](../Proposals/newlang.ye#L401)
- [ExplicitConstructorInvocation](../Proposals/newlang.ye#L405)
- [InterfaceModifier](../Proposals/newlang.ye#L447)
- [ExtendsInterfaces](../Proposals/newlang.ye#L457)

### Java-like productions not adopted — J

The following are Java-like grammar material rather than selected NewLang
requirements. DEC-019 explicitly does not adopt every Java-like construct;
DEC-076 also means these are not additional parser productions.

- [EnumDeclaration](../Proposals/newlang.ye#L412) **D**
- [EnumBody](../Proposals/newlang.ye#L416)
- [EnumConstantList](../Proposals/newlang.ye#L420)
- [EnumConstant](../Proposals/newlang.ye#L424)
- [EnumConstantModifier](../Proposals/newlang.ye#L428)
- [EnumBodyDeclarations](../Proposals/newlang.ye#L432)
- [ConstantDeclaration](../Proposals/newlang.ye#L473)
- [ConstantModifier](../Proposals/newlang.ye#L477)
- [InterfaceMethodDeclaration](../Proposals/newlang.ye#L484)
- [InterfaceMethodModifier](../Proposals/newlang.ye#L488)
- [AnnotationTypeDeclaration](../Proposals/newlang.ye#L497)
- [AnnotationTypeBody](../Proposals/newlang.ye#L501)
- [AnnotationTypeMemberDeclaration](../Proposals/newlang.ye#L505)
- [AnnotationTypeElementDeclaration](../Proposals/newlang.ye#L513)
- [AnnotationTypeElementModifier](../Proposals/newlang.ye#L517)
- [DefaultValue](../Proposals/newlang.ye#L523)
- [Annotation](../Proposals/newlang.ye#L527)
- [NormalAnnotation](../Proposals/newlang.ye#L533)
- [ElementValuePairList](../Proposals/newlang.ye#L537)
- [ElementValuePair](../Proposals/newlang.ye#L541)
- [ElementValue](../Proposals/newlang.ye#L545)
- [ElementValueArrayInitializer](../Proposals/newlang.ye#L551)
- [ElementValueList](../Proposals/newlang.ye#L555)
- [MarkerAnnotation](../Proposals/newlang.ye#L559)
- [SingleElementAnnotation](../Proposals/newlang.ye#L563)
- [ArrayInitializer](../Proposals/newlang.ye#L569)
- [VariableInitializerList](../Proposals/newlang.ye#L573)
- [Block](../Proposals/newlang.ye#L579)
- [BlockStatements](../Proposals/newlang.ye#L583)
- [BlockStatement](../Proposals/newlang.ye#L587)
- [LocalVariableDeclarationStatement](../Proposals/newlang.ye#L593)
- [LocalVariableDeclaration](../Proposals/newlang.ye#L597)
- [Statement](../Proposals/newlang.ye#L601)
- [StatementNoShortIf](../Proposals/newlang.ye#L610)
- [StatementWithoutTrailingSubstatement](../Proposals/newlang.ye#L618)
- [EmptyStatement](../Proposals/newlang.ye#L633)
- [LabeledStatement](../Proposals/newlang.ye#L637)
- [LabeledStatementNoShortIf](../Proposals/newlang.ye#L641)
- [ExpressionStatement](../Proposals/newlang.ye#L645)
- [StatementExpression](../Proposals/newlang.ye#L649)
- [IfThenStatement](../Proposals/newlang.ye#L659)
- [IfThenElseStatement](../Proposals/newlang.ye#L663)
- [IfThenElseStatementNoShortIf](../Proposals/newlang.ye#L667)
- [AssertStatement](../Proposals/newlang.ye#L671)
- [SwitchStatement](../Proposals/newlang.ye#L676)
- [SwitchBlock](../Proposals/newlang.ye#L680)
- [SwitchBlockStatementGroup](../Proposals/newlang.ye#L684)
- [SwitchLabels](../Proposals/newlang.ye#L688)
- [SwitchLabel](../Proposals/newlang.ye#L692)
- [EnumConstantName](../Proposals/newlang.ye#L698)
- [WhileStatement](../Proposals/newlang.ye#L702)
- [WhileStatementNoShortIf](../Proposals/newlang.ye#L706)
- [DoStatement](../Proposals/newlang.ye#L710)
- [ForStatement](../Proposals/newlang.ye#L714)
- [ForStatementNoShortIf](../Proposals/newlang.ye#L719)
- [BasicForStatement](../Proposals/newlang.ye#L724)
- [BasicForStatementNoShortIf](../Proposals/newlang.ye#L728)
- [ForInit](../Proposals/newlang.ye#L732)
- [ForUpdate](../Proposals/newlang.ye#L737)
- [StatementExpressionList](../Proposals/newlang.ye#L741)
- [EnhancedForStatement](../Proposals/newlang.ye#L745)
- [EnhancedForStatementNoShortIf](../Proposals/newlang.ye#L749)
- [BreakStatement](../Proposals/newlang.ye#L753)
- [ContinueStatement](../Proposals/newlang.ye#L757)
- [ReturnStatement](../Proposals/newlang.ye#L761)
- [ThrowStatement](../Proposals/newlang.ye#L765)
- [SynchronizedStatement](../Proposals/newlang.ye#L769)
- [TryStatement](../Proposals/newlang.ye#L773)
- [Catches](../Proposals/newlang.ye#L779)
- [CatchClause](../Proposals/newlang.ye#L783)
- [CatchFormalParameter](../Proposals/newlang.ye#L787)
- [CatchType](../Proposals/newlang.ye#L791)
- [Finally](../Proposals/newlang.ye#L795)
- [TryWithResourcesStatement](../Proposals/newlang.ye#L799)
- [ResourceSpecification](../Proposals/newlang.ye#L803)
- [ResourceList](../Proposals/newlang.ye#L807)
- [Resource](../Proposals/newlang.ye#L811)
- [Primary](../Proposals/newlang.ye#L817)
- [PrimaryNoNewArray](../Proposals/newlang.ye#L822)
- [ClassInstanceCreationExpression](../Proposals/newlang.ye#L836)
- [TypeArgumentsOrDiamond](../Proposals/newlang.ye#L842)
- [FieldAccess](../Proposals/newlang.ye#L847)
- [ArrayAccess](../Proposals/newlang.ye#L853)
- [MethodInvocation](../Proposals/newlang.ye#L858)
- [ArgumentList](../Proposals/newlang.ye#L867)
- [MethodReference](../Proposals/newlang.ye#L871)
- [ArrayCreationExpression](../Proposals/newlang.ye#L881)
- [DimExprs](../Proposals/newlang.ye#L888)
- [DimExpr](../Proposals/newlang.ye#L892)
- [ConstantExpression](../Proposals/newlang.ye#L896)
- [Expression](../Proposals/newlang.ye#L900)
- [LambdaExpression](../Proposals/newlang.ye#L905)
- [LambdaParameters](../Proposals/newlang.ye#L909)
- [InferredFormalParameterList](../Proposals/newlang.ye#L915)
- [LambdaBody](../Proposals/newlang.ye#L919)
- [AssignmentExpression](../Proposals/newlang.ye#L924)
- [Assignment](../Proposals/newlang.ye#L929)
- [LeftHandSide](../Proposals/newlang.ye#L933)
- [AssignmentOperator](../Proposals/newlang.ye#L939)
- [ConditionalExpression](../Proposals/newlang.ye#L954)
- [ConditionalOrExpression](../Proposals/newlang.ye#L959)
- [ConditionalAndExpression](../Proposals/newlang.ye#L964)
- [InclusiveOrExpression](../Proposals/newlang.ye#L969)
- [ExclusiveOrExpression](../Proposals/newlang.ye#L974)
- [AndExpression](../Proposals/newlang.ye#L979)
- [EqualityExpression](../Proposals/newlang.ye#L984)
- [RelationalExpression](../Proposals/newlang.ye#L990)
- [ShiftExpression](../Proposals/newlang.ye#L999)
- [AdditiveExpression](../Proposals/newlang.ye#L1006)
- [MultiplicativeExpression](../Proposals/newlang.ye#L1012)
- [UnaryExpression](../Proposals/newlang.ye#L1019)
- [PreIncrementExpression](../Proposals/newlang.ye#L1027)
- [PreDecrementExpression](../Proposals/newlang.ye#L1031)
- [UnaryExpressionNotPlusMinus](../Proposals/newlang.ye#L1035)
- [PostfixExpression](../Proposals/newlang.ye#L1042)
- [PostIncrementExpression](../Proposals/newlang.ye#L1049)
- [PostDecrementExpression](../Proposals/newlang.ye#L1053)
- [CastExpression](../Proposals/newlang.ye#L1057)

### Name and type productions — J

These further Java-like productions duplicate or extend the earlier type/name
proposal. The angle-bracket type-argument syntax is not selected; DEC-011 uses
square brackets for templates.

- [PackageName](../Proposals/newlang.ye#L1065) **D**
- [TypeName](../Proposals/newlang.ye#L1070)
- [PackageOrTypeName](../Proposals/newlang.ye#L1075)
- [ExpressionName](../Proposals/newlang.ye#L1080)
- [MethodName](../Proposals/newlang.ye#L1085)
- [AmbiguousName](../Proposals/newlang.ye#L1089)
- [SimpleTypeName](../Proposals/newlang.ye#L1096)
- [TypeParameterModifier](../Proposals/newlang.ye#L1100)
- [Type](../Proposals/newlang.ye#L1108) **D**
- [PrimitiveType](../Proposals/newlang.ye#L1113)
- [NumericType](../Proposals/newlang.ye#L1118)
- [IntegralType](../Proposals/newlang.ye#L1123)
- [FloatingPointType](../Proposals/newlang.ye#L1131)
- [ReferenceType](../Proposals/newlang.ye#L1136)
- [ClassOrInterfaceType](../Proposals/newlang.ye#L1142)
- [ClassType](../Proposals/newlang.ye#L1147)
- [InterfaceType](../Proposals/newlang.ye#L1152)
- [TypeVariable](../Proposals/newlang.ye#L1156)
- [ArrayType](../Proposals/newlang.ye#L1160)
- [Dims](../Proposals/newlang.ye#L1166)
- [TypeParameter](../Proposals/newlang.ye#L1170)
- [TypeBound](../Proposals/newlang.ye#L1174)
- [AdditionalBound](../Proposals/newlang.ye#L1179)
- [TypeArguments](../Proposals/newlang.ye#L1183)
- [TypeArgumentList](../Proposals/newlang.ye#L1187)
- [TypeArgument](../Proposals/newlang.ye#L1191)
- [Wildcard](../Proposals/newlang.ye#L1196)
- [WildcardBounds](../Proposals/newlang.ye#L1200)

`newlang` at line 99 is a file marker, not a production. The source also has
two `PackageName`, `Type`, `VariableDeclaratorList`, `VariableDeclarator`, and
`EnumDeclaration` definitions; see the linked occurrences above. In addition
to those duplicates, the Java-like sections introduce syntax and names that
are not established by the NewLang proposal or current decisions. These gaps
must be resolved before treating `newlang.ye` as a normative complete grammar.
