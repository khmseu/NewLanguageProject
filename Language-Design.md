# Language Design

## Status and scope

This is the evolving design record for the next language experiment. Approved choices and explicitly labeled open alternatives are recorded here; unresolved feature conflicts remain in [the project knowledge view](./Kontext/Wissensstand.md). TypeScript is confirmed as the implementation language (DEC-054).

## Identifier normalization

**Decision DEC-006 — approved, partially superseded by DEC-024:** Identifiers are case-sensitive and source spelling is preserved for user interaction. DEC-006 originally selected NFC-normalized equality keys; DEC-024 replaces that key policy with NFKC while retaining an NFC form for interaction.

The original NFC choice followed the general guidance in [UAX #31, Unicode 18.0.0, Revision 45, §5](https://www.unicode.org/reports/tr31/tr31-45.html); the later user choice of NFKC for internal names is an intentional design change.

**Decision DEC-007 — approved:** Use the proposed identifier syntax in [NewLang's syntax notes](/bigdata/KAI/NewLang/IDEAS/Syntax.txt): an identifier starts with a code point having the Unicode `XID_Start` property, followed by zero or more code points having `XID_Continue` (`XID_Start XID_Continue*`, UAX #31 R1). No extra start characters are added. In particular, underscore may continue an identifier but may not start one under this rule.

DEC-031 fixes the Unicode data version and requires implementations to use it consistently.

## Comments, identifiers, and constants

**Decision DEC-024 — approved:** Identifier names are case-sensitive. Accept identifiers matching `XID_Start XID_Continue*`; derive the internal name used for lookup/equality by applying NFKC, and retain the NFC form for user interaction. This supersedes DEC-006's NFC equality key while preserving case sensitivity and the user-facing NFC representation. DEC-031 fixes the Unicode data version; DEC-036 specifies whole-source NFC before tokenization.

**Decision DEC-025 — approved:** Use `//` line comments and `/* ... */` block comments; block comments do not nest. Character literals use single quotes (`'...'`) and ordinary strings use double quotes (`"..."`). Integers may be written as unmarked decimal, with `0b`, `0o`, `0d`, or `0x` base markers, or using `base#number`. Apply C++-style universal-character names `\uXXXX` and `\UXXXXXXXX` to source characters generally, and support the Perl-style escapes described in NewLang's syntax notes in character and ordinary string literals. Floating-point literals include decimal and hexadecimal forms from ISO floating-point language standards.

The precise lexical productions remaining include further numeric token boundaries and the ISO standard/version and precision grammar for floating-point literals (Q-014). DEC-047 specifies numeric suffix spelling and radix/suffix disambiguation. Ordinary literal escape forms and their phase interactions are specified in DEC-039–045. DEC-055 makes non-universal raw-string backslashes literal. Detailed source mappings through translation and normalization remain open (LP-23).

**Decision DEC-026 — approved:** Raw strings use NewLang's tagged-backtick delimiter structure: opening backtick, tag, and double quote; content; then double quote, the same tag, and closing backtick. For example, `` `END"raw content"END` ``. DEC-027 specifies tag characters and newline handling; DEC-055 makes non-universal backslashes literal.

**Decision DEC-027 — approved:** Translate `\uXXXX` and `\UXXXXXXXX` universal-character names globally before tokenization, including in comments and raw strings. Consequently, translated characters can affect comment and literal delimiters. Raw-string tags consist of zero or more ASCII letters, digits, or underscores (`[A-Za-z0-9_]*`), with no fixed length limit. Raw strings may span lines; recognized line endings in their contents are normalized to LF.

DEC-032 specifies recognized physical line endings, DEC-035 specifies Unicode-escape eligibility, validation, and generated line-break behavior, and DEC-036 specifies mixed-origin CRLF and whole-source NFC. DEC-029 requires original-source mapping; DEC-036 selects its span units, but detailed mapping remains open. For non-universal raw escapes, the user first rejected both proposed alternatives—all other backslashes literal, or a delimiter-specific escape—and later selected literal backslashes after reviewing NewLang's scanner (DEC-055).

The raw-string question concerns spellings such as `` `END"\n"END` ``: whether `\n` contributes literal backslash and `n`, or has some escape meaning. It does not reopen global `\u`/`\U` translation, which already applies inside raw strings. The user requested this clarification without selecting a replacement rule.

**Decision DEC-028 — approved:** For integer `base#number` literals, the decimal base is from 2 through 36, with digit values represented by `0`–`9` and case-insensitive `A`–`Z`/`a`–`z` as applicable. A single underscore may separate digits in an integer literal, but may not occur immediately after a radix prefix or `#` as a digit separator. Accept both lowercase and uppercase radix-marker letters (`0b`/`0B`, `0o`/`0O`, `0d`/`0D`, and `0x`/`0X`). Leading zeros in unmarked decimal integers do not change the base: `012` means decimal twelve. Support typed numeric suffixes; DEC-047 specifies their spelling and radix disambiguation. The meanings of individual suffixes and allowed numeric types remain open.

**Decision DEC-029 — approved:** Adopt the following lexer and source-location rules:

- Accept UTF-8 source, diagnose malformed UTF-8, and ignore an optional initial UTF-8 BOM in the token stream. DEC-031 selects UTF-8 as the only source encoding.
- Use longest-match tokenization for the selected token set; recognize comments and literals as such rather than interpreting their contents as operators. Comments separate tokens: `a/*x*/b` yields two identifiers, not `ab`.
- Report malformed recognized tokens explicitly with source locations, including unterminated comments/literals, malformed escapes, and invalid numeric digits. The boundaries of malformed numeric-looking sequences and the error-recovery policy remain open.
- Treat leading `+` and `-` as operators, not part of numeric tokens; an exponent sign belongs to the numeric literal.
- Ordinary character and string literals cannot contain unescaped physical line breaks; DEC-035 extends this restriction to escape-generated line breaks. Escaped delimiters, backslashes, named escapes, fixed control escapes, braced hex escapes, and generated-backslash interactions are specified in DEC-029/030/035/039–045. Raw-string non-universal backslashes are literal (DEC-055).
- Support decimal floats such as `1.5` and `1e3`, and hexadecimal floats such as `0x1.8p+2` with a mandatory `p`/`P` binary exponent. DEC-033 specifies their shapes and DEC-047 specifies suffix spelling; the exact standard edition and further numeric boundaries remain open.
- Attach original-source spans to lexer tokens and operator/operand tree nodes, preserving mappings through universal-character translation and normalization. DEC-036 specifies byte-offset units; detailed mapping behavior remains open.

**Decision DEC-030 — approved:** In ordinary character and string literals:

- A character literal must produce exactly one Unicode scalar value after escape processing. For example, `'😀'` is one scalar; a sequence of two scalars is not a valid character literal, even if it is perceived as one character.
- `\N{name}` supports Unicode 18 character names and official aliases, with ASCII case-insensitive matching and otherwise exact spacing/punctuation; it resolves to one scalar, not a named sequence (DEC-030/040).
- In an ordinary string, a backslash immediately followed by a physical line ending continues the string: remove the backslash, the line ending, and any immediately following spaces and tabs. This continuation is not allowed in character literals. DEC-032 specifies recognized physical line endings; DEC-035 extends string continuation to escape-generated endings.
- An unrecognized ordinary escape, such as `\q`, is an error. This rule does not apply to raw strings, where non-universal backslashes are literal (DEC-055).

DEC-039–045 specify the remaining ordinary escape forms, validation, name lookup, and interactions with global translation. Non-universal raw-string backslashes are literal (DEC-055).

**Decision DEC-031 — approved:** Source files use UTF-8 only; DEC-029's malformed-input diagnostics and optional initial UTF-8 BOM apply. Use Unicode 18.0.0 consistently for identifier properties, identifier normalization, and Unicode character-name data. The language specification pins this exact data version; changing it requires a deliberate specification revision rather than silently following a compiler or host-runtime update.

**Decision DEC-032 — approved:** Recognize the Unicode 18 [UAX #14 hard line breaks](https://www.unicode.org/reports/tr14/tr14-57.html#LB4) as physical source-line endings: LF (U+000A), CR (U+000D), CRLF (U+000D U+000A), NEL (U+0085), VT (U+000B), FF (U+000C), LS (U+2028), and PS (U+2029). Count CRLF as one ending. This is the complete hard-break set in the [Unicode 18 line-break property data](https://www.unicode.org/Public/18.0.0/ucd/LineBreak.txt) and matches NewLang's listed line endings.

These recognized physical endings terminate line comments, are normalized to LF in raw-string values (including LS and PS), and are eligible for ordinary-string continuation under DEC-030. DEC-035 extends these lexical effects to escape-generated line breaks; DEC-036 groups adjacent CR and LF even when their origins differ.

**Decision DEC-033 — approved:** Use the following decimal and hexadecimal floating-point shapes, before any typed suffix:

```text
decimal-digits = digit (["_"] digit)*
hex-digits     = hex-digit (["_"] hex-digit)*
decimal-exp    = ("e" | "E") ["+" | "-"] decimal-digits
binary-exp     = ("p" | "P") ["+" | "-"] decimal-digits
decimal-float  = decimal-digits "." [decimal-digits] [decimal-exp]
               | "." decimal-digits [decimal-exp]
               | decimal-digits decimal-exp
hex-float      = ("0x" | "0X")
                 (hex-digits ["." [hex-digits]] | "." hex-digits)
                 binary-exp
```

`digit` is an ASCII decimal digit, and `hex-digit` is an ASCII decimal digit or `A`–`F`/`a`–`f`. Thus a significand has at least one digit, hexadecimal floats require a `p`/`P` exponent, and a single underscore used as a digit separator appears only between digits of the same component. For example, `.5`, `1.`, `1e3`, `0x1p0`, `0x1.p0`, and `0x.8p0` are supported. DEC-047 specifies suffix spelling; the exact ISO/IEEE reference edition remains open.

Tokenize `1.foo` as the float `1.` followed by identifier `foo`, to which DEC-008's implicit `APPLY` rule applies. Report an invalid-digit error for `0b102` and `123foo`. Under DEC-047, a suffix must start with `#`, so an attached bare `foo` cannot be a suffix. These decisions do not by themselves determine every other number/identifier boundary (LP-14/25).

**Decision DEC-034 — approved:** Apply these additional numeric-boundary rules:

- After an operand, `.5` remains a floating-point token under context-independent longest matching. For example, `a.5`, `a .5`, and `a/*comment*/.5` contain identifier `a` followed by float `.5`, with implicit `APPLY`.
- If a floating-point core ending in a digit is immediately followed by a bare identifier, report an invalid-digit error. For example, `1.2foo` and `1e3foo` are errors; DEC-047 requires a suffix to start with `#`. The selected `1.foo` behavior is unchanged: its float core ends in a dot.
- An exponent introducer recognized for a numeric literal must be followed by decimal exponent digits after any optional sign. Incomplete exponents such as `1e+` and `0x1p` are malformed numeric literals.

For these malformed numeric patterns, issue the specified diagnostic rather than splitting back to an earlier valid token. DEC-047 separates suffixes from exponent markers with `#`; further numeric boundary cases remain open (LP-25).

**Decision DEC-035 — approved:** Apply these rules to global universal-character translation:

- Use Java-style backslash eligibility. An original source backslash is eligible to start an escape if the immediately preceding translated character was produced by a universal-character escape, or if the translated output ends in an even number of consecutive backslashes. Count generated backslashes in that trailing run; the empty run has length zero. For example, source `\\u0041` remains `\\u0041` at this phase, while `\u005C\u0041` produces the characters `\A`.
- An eligible `\u` requires exactly four following ASCII hexadecimal digits; an eligible `\U` requires eight. Consume exactly that many digits, leaving additional source characters for subsequent processing. Diagnose missing or non-hexadecimal digits and values that are not Unicode scalars, including surrogates and values above U+10FFFF. Adjacent surrogate escapes such as `\uD83D\uDE00` do not form a valid pair; a supplementary scalar can instead be written as `\U0001F600`.
- Translate in one pass. A backslash produced by an escape cannot itself start another universal-character escape. For example, `\u005Cu0041` produces the characters `\u0041`, without translating them again. A later original-source backslash can still be eligible under the rule above.
- Escape-generated hard-break characters have the same lexical effects as the physical endings in DEC-032: they terminate line comments, are forbidden unescaped in ordinary character and string literals, and are normalized to LF in raw strings. They may also participate in ordinary-string continuation, extending DEC-030's physical-only rule. After translation, remove the backslash, line ending, and immediately following spaces and tabs; character literals still cannot use continuation. The backslash may itself be generated: `"\u005C\u000A"` produces an empty ordinary string.

DEC-036 specifies mixed-origin CRLF grouping and the phase ordering relative to normalization. Detailed original-source mapping remains open (LP-23). Non-universal raw-string backslashes are literal (DEC-055).

**Decision DEC-036 — approved:** Apply these source-processing and location rules:

- After global universal-character translation and before tokenization, normalize the entire translated source to NFC using the Unicode version in DEC-031. This applies to comments, identifiers, ordinary literals, and raw strings. Token matching, including ASCII raw-tag syntax and identifier `XID_Start XID_Continue*`, applies to the resulting stream. Identifier lookup names are still derived with NFKC, and the NFC form is retained for user interaction (DEC-024).
- Whole-source NFC can change literal content and even token spelling. For example, an `e` followed by U+0301 in translated source normalizes to U+00E9; a character literal containing that sequence can therefore contain one scalar. U+037E GREEK QUESTION MARK normalizes to the ASCII semicolon `;` before tokenization. Ordinary literal escape processing occurs later; DEC-039 specifies that decoded literal values are not normalized again.
- Recognize adjacent CR and LF as one CRLF ending even if either or both characters came from Unicode escapes. This applies to comment termination, raw-string LF normalization, and ordinary-string continuation; the latter removes both characters in the pair.
- Represent original-source spans on lexer tokens and operator/operand tree nodes as zero-based, half-open UTF-8 byte ranges `[start,end)`. Count an initial UTF-8 BOM in these offsets even though it produces no token: an `a` immediately after the BOM has span `[3,4)`. Preserve mappings back through Unicode translation and source and identifier normalization.
- Display diagnostic locations using physical lines and columns in the original file. Escape-generated line breaks do not advance the physical line count; translated logical locations may be provided additionally. For example, in `// x\u000A y` on one physical line, `y` is on physical line 1 even though it is on translated logical line 2. Human-facing columns are one-based and count Unicode scalar values in the original physical source line; tabs count as one column (DEC-046). Editor protocol positions are converted separately from original UTF-8 byte spans to the negotiated encoding.

The detailed mapping of normalized characters and nodes back to original bytes, including canonical composition and reordering, remains open (LP-23). Non-universal raw-string backslashes are literal (DEC-055); DEC-047 specifies numeric suffix syntax.

Other raw-string syntaxes are retained below as comparisons; they are not selected.

| Family / examples | Delimiter model | Trade-offs |
|---|---|---|
| Fixed backtick: `` `text` `` (Go; also GenLang) | One fixed delimiter; Go uses literal content through the next backtick. GenLang allows doubled backticks inside its multiline raw string. | Very concise; a literal backtick requires a special rule or cannot appear directly. |
| Hash-counted: `r#"text"#`, `r##"text with "# inside"##` (Rust) | Choose a count of `#` characters; matching quote-plus-hashes ends the string. | Flexible content and simple matching; introduces a delimiter-count rule and prefix. |
| Tagged paired delimiter: `R"tag(text)tag"` (C++ and LangLLVM PEG) | A short tag appears at both ends around `(` and `)`. | Accommodates quotes and backslashes; more punctuation and restrictions on tags. |
| Variable quote run: `"""text"""` (C#) | Matching delimiter uses a run of at least three quotes; longer runs allow quote runs in content. | Familiar quote-only form; multiline indentation rules can add complexity. |
| Raw prefix on ordinary quotes: `r"text"` or `r"""text"""` (Python) | Prefix changes backslash handling; quote count still determines termination. | Familiar and compact; rawness does not itself solve delimiter collisions, and ordinary string constraints still apply. |
| NewLang scanner prototype: `` `tag"text"tag` `` | Appears to use a tag between the opening backtick and quote and a matching quote/tag/backtick close. | Selected delimiter family (DEC-026); scanner behavior is prototype evidence, not a complete content specification. |

Illustrative forms:

```text
Go fixed backtick:
`C:\temp\file.txt
second line`

GenLang doubled embedded backtick:
`A doubled `` backtick in the content`

Rust, with two hashes so an inner "# does not close it:
r##"The sequence "# is content here."##

C++, with a custom END tag:
R"END(The sequence )ENDX is content.)END"

C#, with four quote characters delimiting content that contains three:
""""Contains """ but not """" inside""""

Python raw prefix (backslashes remain uninterpreted):
r"C:\temp\file.txt"
r"""First line
second line"""

NewLang scanner prototype:
`END"Raw content: `, "quotes", and \slashes"END`
```

The NewLang tagged-backtick form is selected by DEC-026; DEC-027 specifies its tag characters and newline normalization. Other examples are comparisons, not selections. DEC-055 makes non-universal raw backslashes literal; as a consequence, raw content cannot contain its own closing sequence `"TAG` `` ` ``, so a different tag must be chosen.

External references: [Go string literals](https://go.dev/ref/spec#String_literals), [Rust raw string literals](https://doc.rust-lang.org/reference/tokens.html#raw-string-literals), [C++ string literals](https://en.cppreference.com/w/cpp/language/string_literal), [C# raw string literals](https://learn.microsoft.com/en-us/dotnet/csharp/language-reference/tokens/raw-string), and [Python string and bytes literals](https://docs.python.org/3/reference/lexical_analysis.html#string-and-bytes-literals). Experiment evidence is in [GenLang's lexical specification](/bigdata/KAI/projects/GenLang/docs/language.md), [its generated token definitions](/bigdata/KAI/projects/GenLang/packages/genlang/src/combined-definitions.json), [NewLang's syntax notes](/bigdata/KAI/NewLang/IDEAS/Syntax.txt), [NewLang's scanner](/bigdata/KAI/NewLang/parser/NLparser/Scanner.cc), and [LangLLVM's PEG](/bigdata/KAI/projects/LangLLVM/src/mylang.pegjs).

## Agreed token syntax summary

This table consolidates the currently agreed source forms; it is an inventory, not a complete lexical grammar. Items marked open still need precise productions. Operator precedence and associativity are specified in the table under DEC-022 below. The language has no separate keyword-token category: keyword-like constructs are predefined identifiers (DEC-012).

| Token/category | Agreed source syntax | Notes / unresolved details |
|---|---|---|
| Source encoding | UTF-8 only; optional initial UTF-8 BOM | The BOM is ignored in the token stream, but counts in original byte offsets; malformed UTF-8 is diagnosed (DEC-029/031/036). |
| Source normalization | NFC of the entire source after global universal-character translation, before tokenization | Applies to literals and comments as well as identifiers; can change token spelling (DEC-036). Original-byte mapping must be preserved. |
| Physical line ending | LF, CR, CRLF, NEL, VT, FF, LS, or PS | Unicode 18 UAX #14 hard-break set; adjacent CR and LF count as one even when their origins differ (DEC-032/036). |
| Inter-token whitespace | Unicode 18 `White_Space` property | Characters in the selected hard-break set retain line-ending behavior; all other `White_Space` characters separate tokens (DEC-032/044). |
| Escape-generated line ending | Universal-character escape producing a recognized hard-break character, e.g. `\u000A` | Has the lexical effects of the corresponding physical line ending, including ordinary-string continuation (DEC-035). Original-source mapping remains open. |
| Line comment | `//` through a recognized physical or escape-generated line ending | Comments separate tokens (DEC-029/032/035). |
| Block comment | `/* ... */` | Non-nested; ends at the first `*/`; separates tokens. |
| Identifier | `XID_Start XID_Continue*` | Applied after whole-source NFC; case-sensitive, with NFKC internal name and NFC user-facing form. Unicode data version 18.0.0 is pinned (DEC-031/036). |
| Universal-character escape | `\uXXXX`, `\UXXXXXXXX` | Globally translated before tokenization using Java-style eligibility and one pass; malformed escapes and non-scalar values are errors (DEC-027/035). A generated backslash may start a later ordinary literal escape, but never another global Unicode translation (DEC-045). Original-source mapping details remain open. |
| Named character escape | `\N{name}` | Looks up Unicode 18.0.0 character names and name aliases, case-insensitively; names are single-scalar only, with no named sequences (DEC-030/040). Unknown names are errors. |
| Character literal | `'...'` | Whole-source NFC precedes tokenization and ordinary escapes; the decoded result must be exactly one Unicode scalar, with no post-escape normalization (DEC-030/039). No unescaped line breaks or continuation. |
| Ordinary string literal | `"..."` | Whole-source NFC precedes tokenization and ordinary escapes. No unescaped line breaks; backslash followed by a line ending continues the string, removing both and immediately following spaces/tabs (DEC-030/035). Decoded values are not normalized again after escapes (DEC-039). |
| Raw string literal | `` `TAG"..."TAG` `` | Tags match `[A-Za-z0-9_]*` after whole-source NFC, including empty, without a fixed length limit. Physical and escape-generated line endings normalize to LF, including LS and PS (DEC-032/035/036). Non-universal backslashes are literal: `` `END"\n"END` `` contains backslash and `n` (DEC-055). Global `\u`/`\U` translation still applies first (DEC-027). |
| Perl-style character/string escapes | `\a`, `\b`, `\cX`, `\e`, `\f`, `\n`, `\N{...}`, `\r`, `\t`, `\v`, `\x{...}` | DEC-030/040–045 select named single-scalar lookup, fixed control escapes, `\x{hex}`, and no `\N{U+...}`; `\o{...}` is not selected. A generated backslash may start any ordinary escape but cannot restart global Unicode translation. For `\cX`, `?` maps to DEL; ASCII `@`–`~` maps to `X & 0x1F`; other values are errors. |
| Integer literal | Decimal digits; `0b`/`0B`, `0o`/`0O`, `0d`/`0D`, `0x`/`0X`; or `base#number` | Bases 2–36 for `base#number`; case-insensitive letter digits; single `_` only between digits. Unmarked leading zeros remain decimal (DEC-028). `0b102` and `123foo` are invalid-digit errors (DEC-033/047). Further boundary/range rules remain open (Q-014). |
| Floating-point literal | Decimal or hexadecimal form as specified in DEC-033 | Hexadecimal floats require a `p`/`P` binary exponent; single `_` digit separators occur only between digits of a component. DEC-034 specifies additional malformed-number boundaries. Leading signs are operators; exponent signs are part of the literal. DEC-047 specifies suffix spelling; remaining boundaries, exact ISO/IEEE edition, and precision rules remain open (Q-014). |
| Numeric suffix | `#` followed by `[A-Za-z0-9]+` | ASCII case-insensitive; no empty body or underscore. After an unmarked integer from 2 through 36, the first `#` selects radix notation and a second `#` selects a suffix. Use `0d` to force decimal interpretation (DEC-047). |
| Grouping / collection delimiters | `(` `)`, `{` `}`, `[` `]` | Parentheses group; braces delimit function expressions/bodies; square brackets delimit template parameters/arguments. Full grammar remains open (Q-015). |
| Member-access / dot operator | `.` | Left-associative; exact operator form/semantics remain open (Q-007). |
| Function type arrow | `->` | Used in `(INPARAMS) -> (OUTPARAMS)` and as a function-definition operator; non-associative (DEC-037). `.` binds tighter (DEC-049); other form details remain open (Q-007). |
| Binding operators | `:` `:=` `::=` | Constant, variable, and type binding meanings respectively; each requires a left `@name` operand (DEC-052). Other binding/type/initializer semantics remain open (Q-009/010). |
| Initializer / assignment | `=` | Also appears as the initializer marker within a type form; expression form and semantics are tracked in Q-007/009. |
| Name-declaration operator | `@name` | Supplies the required left operand for binding meanings of `:`, `:=`, and `::=` (DEC-052); detailed name-declaration semantics remain open (Q-007). |
| Arithmetic / bitwise / comparison / logical operators | `++` `--` `!` `~` `**` `*` `/` `%` `+` `-` `<<` `>>` `&` `^` <code>&#124;</code> `<` `<=` `>` `>=` `==` `!=` `&&` <code>&#124;&#124;</code> | `**` is exponentiation and right-associative; `^` is XOR. Other semantics and prefix/postfix forms are not fully specified (Q-007). Their relative levels are in DEC-022. |
| Channel operator | `<-` | Retained from the adopted precedence inventory; exact meaning/form remains open (Q-007). |
| Conditional operators | `?` `:` | `?` begins the conditional; `:` separates its arms. Exact grammar/associativity details are in Q-007. |
| Reserved token | `::` | Reserved, without a current expression meaning; retains its placement alongside `:` (DEC-050). |
| Compound assignment operators | `+=` `-=` `*=` `/=` `%=` `&=` <code>&#124;=</code> `^=` `<<=` `>>=` | Present in the selected precedence inventory; detailed semantics/forms remain open (Q-007). |
| Argument/element separator | `,` | Left-associative in the precedence table; exact grammar depends on the construct. |
| Sequencing operator | `;` | Loosest operator; evaluates the left expression before the right. It is not a required statement terminator, and newlines do not insert it. Result-value and associativity details remain open (DEC-051). |
| Implicit parser tokens (not source spellings) | `APPLY`, `EMPTY` | Make only the insertions needed to alternate operands and operators: `APPLY` between adjacent operands and `EMPTY` between adjacent operators (DEC-008/048). Unary prefix/postfix forms use `EMPTY` on the missing side (DEC-010). Semantic legality remains open (Q-008). |

Longest-match tokenization, explicit lexical diagnostics, and original-source spans are specified by DEC-029/036. Detailed numeric boundaries and source-mapping mechanics are still open.

## Expression token stream and implicit insertions

**Decision DEC-008 — approved:** After comments are stripped without joining the tokens they separate (DEC-029), the source is treated as an operand/operator sequence. Whitespace separates tokens; apart from its role inside strings and comments, it does not itself express grouping or application. Syntactic elements are classified as operators, identifiers, or constants; identifiers and constants are operands.

To restore alternation in the token stream:

- Insert an implicit `APPLY` operator between two directly adjacent operands. It has no explicit source spelling.
- Insert an implicit `EMPTY` operand between two directly adjacent operators. It has no explicit source spelling.

The transformed sequence alternates operands and operators. DEC-048 confirms that these are minimal insertions, not additional construct-specific insertion rules.

**Decision DEC-009 — approved:** Parse the resulting stream into a tree using operand-priority rules. Whether an inserted `APPLY` or `EMPTY` is legal in its resulting semantic context is checked during semantic analysis, not parsing.

**Decision DEC-010 — approved:** Unary prefix and postfix operators are represented using an implicit `EMPTY` operand, not separate unary-operator syntax in the tree. A prefix operator has `EMPTY` on its left; a postfix operator has `EMPTY` on its right. This is the tree representation; semantic analysis determines whether the operator is valid in that unary context.

The adopted relative operator priorities are listed in DEC-022. Semantic legality rules for inserted elements remain open (Q-008); operator semantics and the remaining associativity choices are tracked in Q-007.

**Decision DEC-037 — approved, sequencing interpretation refined by DEC-051:** The first parser targets the full selected language, including declarations, functions, types, blocks, classes/interfaces, packages, and imports; this choice does not complete their source forms or authorize implementation. Newlines remain whitespace, with no automatic semicolon insertion. DEC-051 specifies `;` as an expression-sequencing operator rather than a required statement terminator. DEC-053 places predefined-identifier recognition in semantic analysis, not in construct-specific parser productions.

The `->` operator is non-associative: ungrouped chains such as `A -> B -> C` require explicit grouping or must be rejected. This does not decide the legality of grouped forms. DEC-049 subsequently makes `.` bind tighter than `->`, resolving their former mixed-precedence tie (LP-26).

The parser must produce both the selected operator/operand tree, including implicit `APPLY`/`EMPTY` representation, and a lossless concrete syntax tree for the original source. When produced, the concrete tree must preserve the original bytes, including an initial BOM, comments, whitespace, and escape spellings, so the input can be reconstructed even though parsing uses translated and NFC-normalized text. DEC-008's comment stripping applies to the operator/operand stream, not to this lossless representation. The mapping between the representations remains open (LP-23); DEC-038 specifies the CST policy for syntax errors.

**Decision DEC-038 — approved:** On parser syntax errors, report errors explicitly and attempt to recover to find further diagnostics. Return a lossless original-source CST even for syntactically invalid input, representing invalid or skipped syntax with error nodes or an equivalent. The presence of a CST does not make an invalid parse successful. The recovery algorithm and limits, behavior for malformed encoding or lexical errors, and the operator/operand tree's behavior on erroneous input remain open.

**Decision DEC-039 — approved:** Do not normalize ordinary character or string values after processing their literal escapes. Validate the one-scalar character-literal rule directly on the decoded value. Whole-source NFC remains before tokenization as specified in DEC-036; this decision adds no normalization pass after literal escape processing.

**Decision DEC-040 — approved:** For `\N{name}`, look up Unicode 18.0.0 character names and official name aliases. Match ASCII letters case-insensitively; spaces and punctuation otherwise match exactly. Unknown names are errors. A lookup must resolve to one Unicode scalar; named sequences remain unsupported as specified in DEC-030.

**Decision DEC-041 — approved:** Do not support Perl-style `\N{U+...}` numeric code-point notation. Reserve `\N{...}` for names and aliases; global `\uXXXX` and `\UXXXXXXXX` remain the numeric Unicode escapes.

**Decision DEC-042 — approved:** Ordinary character and string literals recognize NewLang's simple escape set: `\a`, `\b`, `\e`, `\f`, `\n`, `\r`, `\t`, `\v`, and `\cX`, in addition to the selected quote and backslash escapes. `\e` denotes ESC (U+001B). For `\cX`, `?` (U+003F) maps to DEL (U+007F); ASCII `@` through `~` (U+0040–U+007E) map to `X & 0x1F`; all other following characters are invalid. This adopts the mapping recorded in NewLang's notes. DEC-043 subsequently selects `\x{hex}`; `\o{...}` is not selected.

**Decision DEC-043 — approved:** Support `\x{hex}` in ordinary character and string literals as a Unicode scalar escape. The braces must contain one or more ASCII hexadecimal digits; leading zeros are allowed, with no separators. An empty body, missing closing brace, or non-hex digit is an error. Reject values above U+10FFFF and surrogate values. The escape contributes the one scalar it denotes; it does not encode bytes. Do not support `\o{...}`.

**Decision DEC-044 — approved:** Treat every Unicode 18 `White_Space` character as a separator between tokens unless it belongs to the selected DEC-032 hard-break set, in which case it retains line-ending behavior. This includes non-ASCII spaces. Whitespace inside comments or literals is governed by those constructs' rules.

**Decision DEC-045 — approved:** In ordinary character and string literals, perform literal-escape processing on the translated source stream, regardless of whether a backslash came from the original source or a global Unicode escape. Thus a generated backslash can start any recognized ordinary escape, including `\n`, `\x{...}`, `\N{...}`, or a line continuation. It cannot initiate another global `\u`/`\U` translation: global translation remains one-pass under DEC-035. An unrecognized ordinary escape remains an error under DEC-030.

**Decision DEC-046 — approved:** Human-facing diagnostic columns are one-based and count Unicode scalar values in the original physical source line; each tab counts as one column. This convention does not change the zero-based, half-open original UTF-8 byte spans selected by DEC-036. Editor protocol positions are a separate representation and must be converted to the negotiated encoding.

**Decision DEC-047 — approved:** Every numeric suffix starts with `#`, followed by one or more ASCII alphanumeric characters (`[A-Za-z0-9]+`), matched case-insensitively. The suffix body is not empty and contains no underscore. For an unmarked decimal integer whose value is from 2 through 36, the first `#` introduces `base#number`; a further `#` introduces its suffix. Invalid digits in this selected radix interpretation are errors, not a reason to fall back to a decimal suffix. Outside that base range, the first `#` can introduce a decimal suffix. An explicit `0d` marker forces decimal interpretation. Thus `16#ff` denotes base-16 digits, `36#1#I32` has suffix `I32`, and `0d16#ff` has a decimal core and suffix `ff`. Suffix names and type meanings remain semantic questions.

**Decision DEC-048 — approved clarification of DEC-008/010:** Make the minimal insertions needed to produce an alternating operand/operator sequence: insert `APPLY` between adjacent operands and `EMPTY` between adjacent operators. Do not add construct-specific insertion requirements. The existing `EMPTY` representation of a missing unary operand remains unchanged.

**Decision DEC-049 — approved:** Make `.` bind tighter than `->`, splitting their former shared priority level. Keep `.` left-associative and `->` non-associative; leave both below `APPLY` and above the next operator level.

**Decision DEC-050 — approved:** Reserve `::` without assigning it a current expression meaning. Its existing relative placement alongside `:` remains unchanged.

**Decision DEC-051 — approved:** `;` is an operator that sequentially processes expressions: evaluate the left expression before the right. It remains the loosest operator; it is not a required statement terminator. This refines DEC-037's earlier statement-terminator description without changing the newline-as-whitespace rule. Its result-value convention and associativity are not specified by this decision.

**Decision DEC-052 — approved:** The binding meanings of `:`, `:=`, and `::=` require a left `@name` operand. These bindings are expressions in the operator/operand model, not a separate parser-recognized declaration category. This refines the bare-name sketches in DEC-011; `:` also retains its separate conditional role.

**Decision DEC-053 — approved:** The parser does not recognize keyword-like meanings of predefined identifiers. Semantic analysis looks identifiers up in the symbol table; the resulting binding may carry the semantic meaning associated with a keyword-like construct. Redefinition therefore affects semantic interpretation, not lexical classification or a parser keyword recognizer.

**Decision DEC-054 — approved:** TypeScript is confirmed as the implementation language for the next attempt. This supersedes the tentative status of DEC-004.

**Decision DEC-055 — approved:** In raw strings, every backslash that is not part of a globally translated `\uXXXX`/`\UXXXXXXXX` universal-character escape (DEC-027/035) is literal content. Raw strings have no ordinary escapes, so `` `END"\n"END` `` contains a backslash followed by `n`. This matches NewLang's scanner prototype (KP-074) and supersedes the earlier rejection of this alternative.

**Decision DEC-056 — approved:** The current `?` and `:` priorities are retained. Conditional nesting in the then-branch requires explicit parentheses, for example `a ? (b ? c : d) : e`; no special conditional parser rule or semantic reassociation is provided.

**Decision DEC-021 — approved:** Use GenLang's numeric priority scale as the starting point for the next language. Set `@` to priority 190; keep `.` left-associative; use `^` for XOR and `**` for exponentiation; use `->` for function definition; and set `?` to priority 45. DEC-022 resolves the remaining relative-order conflicts and assigns `**` a priority.

**Decision DEC-022 — approved:** Adopt the following relative precedence for the next language, from tightest to loosest. Each line is a distinct priority level; operators on one line share a level. This uses GenLang's relative ordering to resolve the historical conflicts, with the explicit placements below, and makes `**` right-associative.

| Relative level (tightest first) | Operators | Associativity / notes |
|---|---|---|
| Tightest | `@` | No associativity specified; name-declaration operator. |
|  | implicit `APPLY`, `(` `)` `{` `}` `[` `]` | APPLY is left-associative; delimiters group syntax. |
|  | `.` | Left-associative member access; tighter than `->` (DEC-049). |
|  | `->` | Function definition/type arrow; non-associative (DEC-037). |
|  | `++` `--` `!` `~` | No infix associativity specified in the GenLang table; prefix/postfix forms and semantics remain subject to Q-007. |
|  | `**` | Right-associative exponentiation; one level tighter than `*`. |
|  | `*` `/` `%` | Left-associative. |
|  | `+` `-` | Left-associative. |
|  | `<<` `>>` | Left-associative. |
|  | `&` | Left-associative bitwise AND. |
|  | `^` | Left-associative XOR. |
|  | <code>&#124;</code> | Left-associative bitwise OR. |
|  | `<` `<=` `>` `>=` | Left-associative relational operators. |
|  | `==` `!=` | Left-associative equality operators. |
|  | `&&` | Left-associative logical AND. |
|  | <code>&#124;&#124;</code> | Left-associative logical OR. |
|  | `<-` | No associativity specified; source describes a channel operation. |
|  | `?` | Right-associative; begins a ternary conditional. |
|  | `:` `::` | `:` is right-associative and has conditional and binding meanings; `::` is reserved (DEC-050/052). |
|  | `=` `:=` `::=` `+=` `-=` `*=` `/=` `%=` `&=` <code>&#124;=</code> `^=` `<<=` `>>=` | Assignment/binding operators are right-associative. Binding meanings of `:=` and `::=` require a left `@name` operand (DEC-052). |
|  | `,` | Left-associative separator. |
| Loosest | `;` | Expression sequencing; left expression is evaluated before the right. Associativity remains unspecified (DEC-051). |

**Decision DEC-023 — approved:** Place `::` at the same relative precedence level as `:`, and place `:=` and `::=` at the same level as `=`. These are relative placements only; DEC-052 subsequently clarifies their binding-expression interpretation and required left `@name` operand.

`**` occupies the level immediately above `*`; no numeric priorities are part of this table. `::` remains reserved at the level of `:`. The `:=` variable and `::=` type binding operators from DEC-011/052 are placed with `=` in this relative ordering.

The table adopts GenLang's relative order for APPLY versus `.`, bitwise versus comparison operators, and `?` versus assignment/`:`, resolving those historical differences for this design. The placement of reserved `::` and the binding operators is explicitly selected here rather than copied from GenLang. Historical source disagreements remain documented in the project knowledge view. Q-007 tracks operator meanings/forms and unresolved associativity, not these adopted relative priorities.

### Conditional precedence check

**Analysis, not an additional parser rule:** With `?` tighter than `:` and both right-associative, an ordinary binary-precedence tree has the following shapes (KP-073):

| Source | Binary-operator grouping |
|---|---|
| `a ? b : c` | `(a ? b) : c` |
| `a ? b : c ? d : e` | `(a ? b) : ((c ? d) : e)` |
| `a ? b ? c : d : e` | `(a ? (b ? c)) : (d : e)` |

The else-branch nesting has the familiar conditional subtree, but the then-branch nesting does not: the usual meaning of the last source is `a ? (b ? c : d) : e`, represented here as `(a ? ((b ? c) : d)) : e`. Explicit parentheses produce that tree. A later semantic pairing or reinterpretation could account for the unparenthesized form, but scalar priorities alone do not produce this familiar then-branch subtree. DEC-056 resolves this: then-branch nesting requires explicit parentheses, and the current priorities are retained (LP-19).

**Analysis of a rejected alternative: `?` and `:` at one priority (KP-074; not adopted, see DEC-056).**

| Source | Same level, right-associative | Same level, left-associative |
|---|---|---|
| `a ? b : c` | `a ? (b : c)` | `(a ? b) : c` |
| `a ? b : c ? d : e` | `a ? (b : (c ? (d : e)))` | `(((a ? b) : c) ? d) : e` |
| `a ? b ? c : d : e` | `a ? (b ? (c : (d : e)))` | `(((a ? b) ? c) : d) : e` |

Right associativity gives the shape "condition `?` (then `:` else)" and handles else-chains, but then-branch nesting would require `a ? ((b ? (c : d)) : e)`. That needs one `:` to group to its left over another `:` at the same level, which conflicts with right associativity. Left associativity also breaks else-chains, and non-associativity rejects even `a ? b : c`. No scalar priority/associativity assignment produces familiar unparenthesized then-branch nesting, because the middle operand is delimited on both sides like a bracketed subexpression. C, for example, parses it with a separate `? expression :` production. Keeping `?` on the `:` line would also place it at the same level as binding `:` and reserved `::`.

## Declarations and bindings

**Decision DEC-011 — approved, refined by DEC-052:** Adopt the name-first binding model from [LangLLVM's declaration design](/bigdata/KAI/projects/LangLLVM/src/Design:%20Declarations,%20Definitions.md). With the required `@name` left operand, the illustrative forms are:

```text
@NAME :    [TEMPLATEPARAMS] (TYPE | INITEXPR)  // constant
@NAME :=   [TEMPLATEPARAMS] (TYPE | INITEXPR)  // variable
@NAME ::=  [TEMPLATEPARAMS] (TYPE | INITEXPR)  // type
```

In that model, `TYPE` may itself include an initializer expression; the design note also sketches `=` as the initializer marker within a type form. These are sketches, not a complete grammar; the trailing statement terminators from the historical note are not requirements under DEC-051. Template parameters and arguments use square brackets (`NAME[ARGS]`). Function expressions use `{ BODY }`, and function types use `(INPARAMS) -> (OUTPARAMS)`.

This selects the LangLLVM model over GenLang's type-first declaration syntax. It does not settle scope and visibility, initialization and inference details, or whether declarations without bodies are distinct from definitions (Q-009, Q-010).

**Decision DEC-012 — approved:** The language has no keywords as a separate lexical category; keyword-like constructs are represented by predefined identifiers. While such an identifier has not been redefined, its semantic effect should closely emulate the corresponding construct as if it were a keyword. Redefining it means it no longer has that predefined semantic effect. Name lookup uses the namespace hierarchy in DEC-018; exact redefinition semantics remain open (Q-009).

DEC-053 confirms that the parser does not recognize these meanings; semantic analysis obtains them through symbol-table lookup.

Square brackets are the selected delimiters for template parameters and arguments (DEC-011); no angle-bracket template syntax is adopted.

**Decision DEC-018 — approved:** Name lookup proceeds through a hierarchy of predefined, imported, and block-related namespaces, selecting a name from the closest namespace. Declaring a function with the same name does not by itself create an overload set: functions are overloaded only through explicit overload declarations that identify the functions grouped together. Resolve a call among that group first by type compatibility (DEC-014); when multiple candidates remain, identical types rank ahead of merely compatible types. Resolution must leave exactly one candidate; otherwise it does not resolve.

The precise namespace ordering and import behavior, the syntax and validation of overload declarations, and how to rank candidates when argument lists mix identical and merely compatible types remain open (Q-009).

## Type system

**Decision DEC-013 — approved:** The language is statically typed. A type may be written explicitly or inferred. Inference does not make the language dynamically typed; the type of each relevant expression or binding must be determined statically.

**Decision DEC-014 — approved:** Type compatibility follows a safety-first principle: allow an operation when its safety can be proven; otherwise reject it.

The inference rules, required-annotation cases, exact safety properties and proof criteria, type compatibility rules, and point at which types are checked remain unspecified (Q-009). No unsafe escape hatch or runtime-check fallback is implied by DEC-014.

## Values, references, and field collections

**Decision DEC-015 — approved:** Distinguish value types from reference types. A reference type consists of an implicit value type (pointer-like) that identifies a variable, analogously to how a variable is identified by its name. Variables may hold either value types or reference types.

**Requirement REQ-002 — user-stated:** The language has collections of fields identified by names or by indices.

The exact representation and semantics remain open: in particular, what “identifies a variable” means operationally, how reference identity and aliasing work, whether references can be reassigned or become invalid, and whether named/indexed field collections are value types, reference types, or both (Q-011). Reference values have the GC-like behavior specified in DEC-017; no particular collector, ownership discipline, or memory-safety mechanism is selected.

**Decision DEC-016 — approved:** Multiple parameters and multiple return values are modeled logically as one temporary collection each. This is a semantic model; it does not yet choose a concrete collection type, syntax, storage strategy, or whether the temporary is observable as an ordinary value (Q-011).

**Decision DEC-017 — approved:** Reference values behave as if managed by garbage collection. Implementations may optimize particular cases when lifetimes are predictable enough to do so. Such optimizations must preserve the observable behavior of the garbage-collected reference model; the specific analysis, optimization techniques, and fallback mechanism remain unspecified (Q-011).

## Object model

**Decision DEC-019 — approved:** Adopt NewLang's language-level object model from `NewLang/IDEAS/OtherStuff.txt` and its class grammar in `NewLang/IDEAS/newlang.ye`. Do not adopt NewLang's bytecode, interpreter, compiler-backend, or native-interoperability architecture from `NewLang/IDEAS/Implementation.txt`.

The selected model includes:

- Modules are classes. Packages are collections of modules that expose one or more interfaces; source-global names are rooted in a package and may include namespace components.
- Classes have fields, methods, constructors, modifiers, and may contain nested classes/interfaces; they may have a superclass, implement interfaces, and be parameterized. Classes have class objects; each parameterization has a distinct class object, instantiated when first needed.
- `Object` is the primitive reference type. Derived classes, `Class`, `Metaclass`, methods, and instantiations are among the proposed constructed reference types; constructed reference types may be parameterized, including container types. Mixins are not derived from `Object`, are not independently instantiable, and may also be parameterized.
- Flat/value types include primitive integer, floating-point, and character types, and constructed enums (including boolean), subranges, sets of subranges, fixed-index arrays, and structs. Flat values have their exact declared type and are destroyed when they leave scope. Reference-typed variables may hold values of a subtype of their declared type; references retain the GC-like behavior in DEC-017.

This adopts the model at the level described by the notes, not every Java-like construct in the separate Java 8 grammar/reference tree. Exact class-variable semantics, local functions as possible function objects, the role/type semantics of methods and instantiations as reference types, packed types, and details of package/import configuration and namespace components remain open (Q-012). Previously selected safety-first compatibility rules (DEC-014) and the user's field-collection requirement (REQ-002) continue to apply.

## Control flow

**Decision DEC-020 — approved:** The language must support proper tail calls and continuations. Proper tail calls are a semantic guarantee, not merely an optimization: calls in tail position must not require unbounded additional continuation space. The specific continuation facility and operations are not yet selected; in particular, this decision alone does not choose full versus delimited continuations, one-shot versus multi-shot continuations, or a particular `call/cc` interface (Q-013).

This requirement constrains the implementation's control representation and calling convention, but does not select NewLang's bytecode VM or any other backend. The implementation must preserve the GC-like reference behavior in DEC-017 when continuations retain execution state.

## Questions to resolve before parser implementation

The decisions above establish design direction, but not a complete grammar. DEC-037 selects the full language as the first parser's target; its applicable syntax and output contract still require the work below. These questions block their affected components or a complete full-scope parser, not necessarily every independent implementation step. No implementation has been authorized by this selection.

### Scope and general parser blockers

1. **Parser scope and language — selected:** Target the full selected language (DEC-037) in TypeScript (DEC-054). Binding expressions and predefined identifiers use the generic operator/operand model (DEC-052/053); missing semantic forms do not automatically require separate parser productions. Features that were never selected are not added by this choice.
2. **What is the remaining lexical grammar?** DEC-024 through DEC-056 select basic token forms, global universal-character translation and source NFC, Unicode data and line-ending and whitespace behavior, numeric suffix spelling/radix disambiguation, several numeric and quoted-literal details, longest-match tokenization, diagnostics, and source positions. Raw-string backslashes are literal (DEC-055). Specify further numeric boundaries (Q-014).
3. **What structural expression rules remain?** Minimal `APPLY`/`EMPTY` insertion is confirmed by DEC-048; legality remains semantic under DEC-009/010. `.` binds tighter than `->` (DEC-049), and `::` is reserved (DEC-050). Specify remaining delimiter/grouping structure and any still-unspecified associativity needed to build trees. Then-branch conditional nesting requires parentheses (DEC-056).
4. **What is the detailed parse-tree contract?** DEC-037 selects a lossless original-source concrete syntax tree plus the operator/operand tree; DEC-038 selects recovery with a lossless CST for syntax errors. Define node contracts for operands, operators, grouping, declarations, and source locations, and how both trees map through Unicode translation and normalization to original UTF-8 bytes, including locations for implicit elements. DEC-046 specifies human-facing diagnostic columns. Recovery mechanics and limits, the result on malformed encoding or lexical errors, and the operator/operand tree on errors remain open.

### Blocking for the corresponding language forms

5. **Bindings and keyword-like meanings — semantic phase selected:** Binding meanings of `:`, `:=`, and `::=` require a left `@name` operand (DEC-052). `;` sequences expressions rather than terminating parser-recognized statements (DEC-051). Semantic analysis, not the parser, recognizes predefined-identifier meanings (DEC-053). Remaining type/initializer, prototype, and overload meanings belong to Q-009/010 unless they require new structural syntax.
6. **What delimiter and collection structure is needed?** Specify type/function/template expression grouping, bracket nesting, parameter and multiple-result collections, and brace-delimited bodies where existing generic expression rules do not yet determine the tree. These are structural questions; permitted semantic forms need not be a separate parser grammar.
7. **What source expressions express namespaces, packages, imports, and the selected object model?** Their remaining source and semantic forms are Q-009/012 questions. Under DEC-053, keyword-like identifiers need no parser recognizer; only additional lexical or structural syntax blocks the corresponding parser component.

### Can be deferred beyond parsing

Precise type-inference and safety proofs, reference identity and lifetime optimization, overload resolution behavior beyond the syntax of overload declarations, object-model runtime semantics, and continuation implementation details need not block a syntax-only parser. They must be resolved before implementing the corresponding semantic/runtime phases; any syntax choices they affect, including any dedicated continuation syntax, must still be fixed before parsing those forms.
