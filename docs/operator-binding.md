# Operator binding reference

This reference expands the approved relative precedence in DEC-022/093/095 and the
associativity rule in DEC-066 into one row per operator spelling. Binding levels
are ordinal: **1 is tightest, 23 is loosest**. They are not numeric precedence
values. Operators at the same level share associativity.

Rows within a level are ordered by operator spelling (ASCII lexicographic
order); `APPLY` is the synthetic operator inserted between adjacent operands.
The delimiters `(` `)` `{` `}` `[` `]` group syntax and are not precedence
operators, so they have no binding level or associativity.

**Specification versus implementation:** DEC-095 adds `...` at level 21.
This addition is not implemented yet: the current lexer still splits `...`
into dots, and the parser still uses its previous 22-level inventory.

| Operator | Binding level | Associativity | Notes |
|---|---:|---|---|
| `@` | 1 | Non-associative | Name-declaration operator. |
| `.` | 2 | Left | Member access; tighter than `->` (DEC-049). |
| `->` | 3 | Non-associative | Function definition/type arrow; tighter than `APPLY` (DEC-093). |
| `APPLY` | 4 | Left | Implicit function application inserted between adjacent operands; tighter than the prefix/postfix operator level (DEC-093). |
| `!` | 5 | Non-associative | Logical-not role in the source inventory; prefix/postfix form legality and meaning remain semantic questions. |
| `++` | 5 | Non-associative | Increment role; prefix/postfix forms use ordinary parsing, while operand legality and effects remain semantic questions. |
| `--` | 5 | Non-associative | Decrement role; prefix/postfix forms use ordinary parsing, while operand legality and effects remain semantic questions. |
| `~` | 5 | Non-associative | Bitwise-not role in the source inventory; operand legality is semantic. |
| `**` | 6 | Right | Exponentiation. |
| `%` | 7 | Left | Modulo. |
| `*` | 7 | Left | Multiplication; unary/prefix interpretation is handled through `EMPTY` and semantic analysis. |
| `/` | 7 | Left | Division. |
| `+` | 8 | Left | Addition; prefix use is parsed as an ordinary operator form. |
| `-` | 8 | Left | Subtraction; prefix use is parsed as an ordinary operator form. No special parse rule applies to `a * -b` (DEC-065). |
| `<<` | 9 | Left | Left shift. |
| `>>` | 9 | Left | Right shift. |
| `&` | 10 | Left | Bitwise AND; unary/prefix interpretation is a semantic question. |
| `^` | 11 | Left | Bitwise XOR. |
| <code>&#124;</code> | 12 | Left | Bitwise OR. |
| `<` | 13 | Left | Relational comparison. |
| `<=` | 13 | Left | Relational comparison. |
| `>` | 13 | Left | Relational comparison. |
| `>=` | 13 | Left | Relational comparison. |
| `!=` | 14 | Left | Inequality comparison. |
| `==` | 14 | Left | Equality comparison. |
| `&&` | 15 | Left | Logical AND. |
| <code>&#124;&#124;</code> | 16 | Left | Logical OR. |
| `<-` | 17 | Non-associative | Source describes a channel operation; its semantic details remain open. |
| `?` | 18 | Right | Begins a ternary conditional. Conditional then-branch nesting requires parentheses (DEC-056). |
| `:` | 19 | Right | Conditional separator and binding operator; binding requires a left `@name` operand (DEC-052). |
| `::` | 19 | Right | Reserved; has no valid operands and is diagnosed semantically (DEC-050/074). |
| `%=` | 20 | Right | Compound assignment. |
| `&=` | 20 | Right | Compound assignment. |
| `*=` | 20 | Right | Compound assignment. |
| `+=` | 20 | Right | Compound assignment. |
| `-=` | 20 | Right | Compound assignment. |
| `/=` | 20 | Right | Compound assignment. |
| `::=` | 20 | Right | Type-binding operator; requires a left `@name` operand (DEC-052). |
| `:=` | 20 | Right | Variable-binding operator; requires a left `@name` operand (DEC-052). |
| `<<=` | 20 | Right | Compound assignment. |
| `=` | 20 | Right | Assignment operator; also used as an initializer marker in the selected declaration model. |
| `>>=` | 20 | Right | Compound assignment. |
| `^=` | 20 | Right | Compound assignment. |
| <code>&#124;=</code> | 20 | Right | Compound assignment. |
| `...` | 21 | Non-associative | Prefix spread: left `EMPTY`, right expression; looser than assignment, tighter than comma (DEC-095). Specification only; not implemented. |
| `,` | 22 | Left | List operator; expressions may be evaluated in parallel, but need not be (DEC-064). |
| `;` | 23 | Left | Expression sequence; evaluate the left expression before the right (DEC-051/064/066). |

This table specifies precedence and associativity, not a complete operator
semantics. Prefix/postfix forms use the generic binary operator model with
inserted `EMPTY` operands (DEC-073); semantic legality and several operator
meanings remain open under Q-007/Q-008.
