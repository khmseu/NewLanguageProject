# Language Design

## Status and scope

This is the evolving design record for the next language experiment. Approved choices and explicitly labeled open alternatives are recorded here; unresolved feature conflicts remain in [the project knowledge view](../../Kontext/Wissensstand.md). TypeScript is confirmed as the implementation language (DEC-054).

The [tentative semantic specification](#tentative-semantic-specification)
incorporates SEM-001 from the user's proposal, with a compatibility review.
Tentative content does not silently replace approved decisions.

## Identifier normalization

**Decision DEC-006 — approved, partially superseded by DEC-024:** Identifiers are case-sensitive and source spelling is preserved for user interaction. DEC-006 originally selected NFC-normalized equality keys; DEC-024 replaces that key policy with NFKC while retaining an NFC form for interaction.

The original NFC choice followed the general guidance in [UAX #31, Unicode 18.0.0, Revision 45, §5](https://www.unicode.org/reports/tr31/tr31-45.html); the later user choice of NFKC for internal names is an intentional design change.

**Decision DEC-007 — approved:** Use the proposed identifier syntax in [NewLang's syntax notes](/bigdata/KAI/NewLang/IDEAS/Syntax.txt): an identifier starts with a code point having the Unicode `XID_Start` property, followed by zero or more code points having `XID_Continue` (`XID_Start XID_Continue*`, UAX #31 R1). No extra start characters are added. In particular, underscore may continue an identifier but may not start one under this rule.

DEC-031 fixes the Unicode data version and requires implementations to use it consistently.

## Comments, identifiers, and constants

**Decision DEC-024 — approved:** Identifier names are case-sensitive. Accept identifiers matching `XID_Start XID_Continue*`; derive the internal name used for lookup/equality by applying NFKC, and retain the NFC form for user interaction. This supersedes DEC-006's NFC equality key while preserving case sensitivity and the user-facing NFC representation. DEC-031 fixes the Unicode data version; DEC-082 applies these normalizations to identifier tokens after tokenization, with no whole-source NFC.

**Decision DEC-025 — approved:** Use `//` line comments and `/* ... */` block comments; block comments do not nest. Character literals use single quotes (`'...'`) and ordinary strings use double quotes (`"..."`). Integers may be written as unmarked decimal, with `0b`, `0o`, `0d`, or `0x` base markers, or using `base#number`. Apply C++-style universal-character names `\uXXXX` and `\UXXXXXXXX` to source characters generally, and support the Perl-style escapes described in NewLang's syntax notes in character and ordinary string literals. Floating-point literals include decimal and hexadecimal forms from ISO floating-point language standards.

DEC-083–085 settle identifier/number adjacency, unterminated comments and raw strings, and fallback error runs. DEC-089 selects one unified numeric candidate for integers and floats, including suffixes, followed by classification. The exact permissive candidate grammar and any lexical significand/exponent length limits remain open (Q-014). DEC-047/057–061 specify numeric suffixes and earlier boundary requirements; DEC-062 selects the floating-point standard reference. Ordinary literal escape forms and their phase interactions are specified in DEC-039–045. DEC-055 makes non-universal raw-string backslashes literal. Detailed source mappings through translation and normalization remain open (LP-23).

**Decision DEC-026 — approved:** Raw strings use NewLang's tagged-backtick delimiter structure: opening backtick, tag, and double quote; content; then double quote, the same tag, and closing backtick. For example, `` `END"raw content"END` ``. DEC-027 specifies tag characters and newline handling; DEC-055 makes non-universal backslashes literal.

**Decision DEC-027 — approved:** Translate `\uXXXX` and `\UXXXXXXXX` universal-character names globally before tokenization, including in comments and raw strings. Consequently, translated characters can affect comment and literal delimiters. Raw-string tags consist of zero or more ASCII letters, digits, or underscores (`[A-Za-z0-9_]*`), with no fixed length limit. Raw strings may span lines; recognized line endings in their contents are normalized to LF.

DEC-032 specifies recognized physical line endings, DEC-035 specifies Unicode-escape eligibility, validation, and generated line-break behavior, and DEC-036 specifies mixed-origin CRLF; its whole-source NFC was superseded by DEC-082's token-level normalization. DEC-029 requires original-source mapping; DEC-036 selects its span units, but detailed mapping remains open. For non-universal raw escapes, the user first rejected both proposed alternatives—all other backslashes literal, or a delimiter-specific escape—and later selected literal backslashes after reviewing NewLang's scanner (DEC-055).

For example, `` `END"\n"END` `` contains a literal backslash followed by `n` under DEC-055. Global `\u`/`\U` translation still applies inside raw strings before tokenization.

**Decision DEC-028 — approved:** For integer `base#number` literals, the decimal base is from 2 through 36, with digit values represented by `0`–`9` and case-insensitive `A`–`Z`/`a`–`z` as applicable. A single underscore may separate digits in an integer literal, but may not occur immediately after a radix prefix or `#` as a digit separator. Accept both lowercase and uppercase radix-marker letters (`0b`/`0B`, `0o`/`0O`, `0d`/`0D`, and `0x`/`0X`). Leading zeros in unmarked decimal integers do not change the base: `012` means decimal twelve. Support typed numeric suffixes; DEC-047 specifies their spelling and radix disambiguation. The meanings of individual suffixes and allowed numeric types remain open.

**Decision DEC-029 — approved:** Adopt the following lexer and source-location rules:

- Accept UTF-8 source, diagnose malformed UTF-8, and ignore an optional initial UTF-8 BOM in the token stream. DEC-031 selects UTF-8 as the only source encoding; DEC-078 defines error characters for malformed UTF-8.
- Use longest-match tokenization for the selected token set; recognize comments and literals as such rather than interpreting their contents as operators. For token recognition, comments act as whitespace (DEC-075): `a/*x*/b` yields two identifiers, not `ab`.
- Report malformed recognized tokens explicitly with source locations, including unterminated comments/literals, malformed escapes, and invalid numeric digits. DEC-067/071 specify longest candidate matching, post-match validation, and minimal fallback error-token recovery; exact candidate boundaries remain open.
- Treat leading `+` and `-` as operators, not part of numeric tokens; an exponent sign belongs to the numeric literal.
- Ordinary character and string literals cannot contain unescaped physical line breaks; DEC-035 extends this restriction to escape-generated line breaks. Escaped delimiters, backslashes, named escapes, fixed control escapes, braced hex escapes, and generated-backslash interactions are specified in DEC-029/030/035/039–045. Raw-string non-universal backslashes are literal (DEC-055).
- Support decimal floats such as `1.5` and `1e3`, and hexadecimal floats such as `0x1.8p+2` with a mandatory `p`/`P` binary exponent. DEC-033 specifies their shapes, DEC-047/059 specify suffix spelling and applicability, and DEC-062 selects IEEE 754-2019 / ISO/IEC 60559:2020 as the floating-point standard reference.
- Attach original-source spans to lexer tokens and CST nodes, preserving mappings through universal-character translation and normalization. DEC-036 specifies byte-offset units; DEC-082 limits normalization to token level, and remaining mapping representation is tracked in LP-23.

**Decision DEC-067 — approved:** Always consume the longest matching token candidate. Tokenization is based on candidate shape; internal validity checks do not shorten a candidate or cause fallback to a shorter token. In particular, numeric digit values are checked against the selected base after candidate matching, not used to truncate the token.

If no candidate begins at the current position, consume the minimum nonempty sequence of characters needed to reach a position where a candidate can begin again, and emit the consumed sequence as an error token. If there is no later candidate start before EOF, the remaining invalid input forms the error token. Existing whitespace and comment handling still applies.

**Decision DEC-068 — approved:** For determining implicit `APPLY`/`EMPTY` insertions, if interpreting an error token as an operand or as an operator would require no added insertion, use that interpretation. Otherwise, interpret it as an operand. This classification does not make the error token valid or remove its diagnostic. DEC-079 collapses consecutive error tokens before classification; DEC-086 gives an operator-classified error the tightest binding with left associativity.

**Decision DEC-070 — approved, refined by DEC-078/079:** Unicode errors produce single-character error tokens, classified for insertion purposes under DEC-068. DEC-078 defines the error-character unit and span: one per UTF-8 maximal subpart, or one per malformed universal-character escape. DEC-079 collapses consecutive error tokens before classification.

**Decision DEC-071 — approved:** Use permissive candidate matching for numeric literals and other lexical constructs with required internal constraints. First consume the longest candidate according to its candidate shape; then validate completeness and internal rules such as allowed digits for a base, separator placement, and required components. A candidate that fails validation produces an error token covering that candidate; do not fall back to a shorter valid token. Apply the same candidate-then-validation approach to malformed comments and literals so their diagnostics are not lost by tokenizing their contents as unrelated operators or identifiers. The exact candidate shapes and validation rules remain to be specified (Q-014). Whether equal-length ties between candidate kinds can occur at all is analyzed in the parser-readiness checklist (item 4).

**Decision DEC-077 — approved:** If a numeric candidate (integer or float) is only an incomplete prefix of a number and the next character cannot continue it, the consumed prefix forms one token returned as an error operand. Examples include `0x`, `16#`, `1e+`, `0x1p`, and `0d1#` followed by whitespace or punctuation. Complete numbers followed by letters are each one error operand: `123foo`, `1.2foo`, and `1e3foo`. DEC-083 now also makes `1.foo` one error operand, superseding its earlier split into `1.` and `foo`. Ordinary (non-raw) string and character literals interrupted by a physical or escape-generated line ending work the same way: the literal prefix up to the line ending forms one error operand, and the line ending is not part of it. Whether a character "can continue" a number refers to the permissive candidate shape (DEC-067/071), so invalid base digits such as in `0b102` still remain inside the candidate. DEC-083 settles the non-ASCII tail `123é` as one error operand.

**Decision DEC-078 — approved; refines DEC-029/070:** Invalid UTF-8 and `\u`/`\U` sequences that cannot produce a legal Unicode scalar generate _error characters_. For malformed UTF-8, follow the Unicode recommendation [U+FFFD Substitution of Maximal Subparts](https://www.unicode.org/versions/Unicode18.0.0/core-spec/chapter-3/) (Unicode 18.0.0 core specification, §3.9.6), as implemented by WHATWG/JavaScript `TextDecoder`: each maximal subpart becomes one error character whose span is the bytes of that subpart. For example, bytes `E2 82` before `b` yield one error character, whereas `F0 80 80` yields three. Spans for bad UTF-8 may be approximate across tools; the language does not require other tools to count invalid input identically. A malformed or non-scalar universal-character escape yields one error character whose span is the consumed escape text.

Outside comments and literals, an error character produces an error token (DEC-070) and is collapsed with adjacent error tokens under DEC-079. Inside a comment or a character/string/raw-string literal, the error character is diagnosed, but the comment or literal remains intact; a literal's value contains U+FFFD at that position.

**Decision DEC-079 — approved; refines DEC-068/070:** Collapse a sequence of multiple consecutive error tokens into a single error token before deciding whether it acts as an operand or an operator under DEC-068. Error operands bind as tightly as possible; DEC-086 specifies the binding of an operator-classified error, and DEC-087 specifies that whitespace and comments do not prevent collapse.

**Decision DEC-092 — approved; clarifies DEC-068/077/079/083:** A lexically designated error operand retains its operand role rather than being reclassified under DEC-068. After consecutive errors collapse, any run containing at least one such error operand is likewise an operand, including mixed runs with fallback errors or unexpected closers. Apply DEC-068 only to collapsed runs without a designated operand part. Thus `a 0x b` and `a 0x § b` both have an error operand between `a` and `b`, requiring two implicit `APPLY` operators. By contrast, the fallback-only run in `a § b` acts as an error operator without insertions. Choosing the zero-insertion interpretation for every collapsed run, regardless of lexical operand designation, is rejected.

**Decision DEC-080 — approved:** A comment-only source file is converted to a single `EMPTY` operand as its tree; its comments remain in the lossless CST (DEC-069). The user confirmed that an empty or whitespace/BOM-only file is likewise a single `EMPTY`.

**Decision DEC-081 — approved; refines DEC-072:** When closing delimiters do not match their openers, at least one closer is unexpected and is converted into an error token, classified under DEC-068/079. An unmatched closer with no open delimiter is likewise an error token. A closer that does not match the innermost open delimiter is the unexpected one: `([a)]` then yields `(`, `[`, `a`, error `)`, and `]`, followed by a closing `)` inserted and diagnosed at EOF. The user confirmed this interpretation.

**Decision DEC-083 — approved; supersedes the `1.foo` split (DEC-033/077), `a.5` (DEC-034), and `1..2` (DEC-061):** Identifier and number tokens must not touch one another. When two such tokens (identifier or numeric literal, in any combination) follow each other with no whitespace or comment between them, they form one error operand. A maximal run of directly touching identifier/number tokens forms a single error operand. This rule applies after longest-match tokenization, so `foo123` remains one identifier. Examples:

- One error operand each: `123foo`, `1.2foo`, `1e3foo`, `123é`, `1.foo` (`1.` + `foo`), `a.5` (`a` + `.5`), `1..2` (`1.` + `.2`), and `1.2.3` (`1.2` + `.3`).
- Not affected: `a .5`, `a/*c*/.5`, and `1. foo`, which stay separate tokens with implicit `APPLY`, and `1...x`, where operators separate the tokens.

**Decision DEC-084 — approved:** An unterminated block comment or raw string extends to EOF, and an error is reported.

**Decision DEC-085 — approved; refines DEC-067:** When no candidate can begin, the fallback error token consumes the smallest number of characters after which a token can again be parsed. Whitespace and comments count as parsable at that point. Example: in `a §  b`, the error token is just `§`.

**Decision DEC-086 — approved; refines DEC-079:** An operator-classified error token has the tightest binding, tighter than every source operator including `@`, and is left-associative. Thus `a E b + c` groups as `(a E b) + c`, `@x E y` groups as `@(x E y)`, and `a E1 b E2 c` groups as `(a E1 b) E2 c`, where `E` denotes a collapsed error token. An operand-classified error token is an ordinary operand.

**Decision DEC-087 — approved; refines DEC-079:** Error merging happens after the parser has created the error tokens, at least under an as-if rule. By that stage whitespace is no longer relevant, and under DEC-075 comments act as whitespace. So error tokens that are adjacent in the token stream collapse even when whitespace or comments separate them in the source: `a § § b` yields one error token between `a` and `b`.

**Decision DEC-088 — approved:** The spans of implicit and inserted elements (`APPLY`, `EMPTY`, and closers inserted at EOF) and diagnostic positions inside NFC-normalized literals are postponed to implementation. They must still satisfy DEC-036/046's byte-span and column conventions.

**Decision DEC-089 — approved:** Match integers and floating-point literals using one unified numeric candidate shape, including numeric suffixes, then classify and validate the matched candidate as an integer, float, or malformed number. Do not select separate integer and float candidates and resolve a tie afterward. This preserves the candidate-then-validation rule (DEC-067/071) and avoids integer/float candidate ties by construction. The exact permissive shape and validation rules remain to be specified (Q-014); it must preserve `1e3` as a float, `16#1e2` as a radix integer, `0x1p0` as a hexadecimal float, and DEC-047's suffix rules.

**Decision DEC-030 — approved:** In ordinary character and string literals:

- A character literal must produce exactly one Unicode scalar value after escape processing. For example, `'😀'` is one scalar; a sequence of two scalars is not a valid character literal, even if it is perceived as one character.
- `\N{name}` supports Unicode 18 character names and official aliases, with ASCII case-insensitive matching and otherwise exact spacing/punctuation; it resolves to one scalar, not a named sequence (DEC-030/040).
- In an ordinary string, a backslash immediately followed by a physical line ending continues the string: remove the backslash, the line ending, and any immediately following spaces and tabs. This continuation is not allowed in character literals. DEC-032 specifies recognized physical line endings; DEC-035 extends string continuation to escape-generated endings.
- An unrecognized ordinary escape, such as `\q`, is an error. This rule does not apply to raw strings, where non-universal backslashes are literal (DEC-055).

DEC-039–045 specify the remaining ordinary escape forms, validation, name lookup, and interactions with global translation. Non-universal raw-string backslashes are literal (DEC-055).

**Decision DEC-031 — approved:** Source files use UTF-8 only; DEC-029's malformed-input diagnostics and optional initial UTF-8 BOM apply. Use Unicode 18.0.0 consistently for identifier properties, identifier normalization, and Unicode character-name data. The language specification pins this exact data version; changing it requires a deliberate specification revision rather than silently following a compiler or host-runtime update.

**Decision DEC-032 — approved:** Recognize the Unicode 18 [UAX #14 hard line breaks](https://www.unicode.org/reports/tr14/tr14-57.html#LB4) as physical source-line endings: LF (U+000A), CR (U+000D), CRLF (U+000D U+000A), NEL (U+0085), VT (U+000B), FF (U+000C), LS (U+2028), and PS (U+2029). Count CRLF as one ending. This is the complete hard-break set in the [Unicode 18 line-break property data](https://www.unicode.org/Public/18.0.0/ucd/LineBreak.txt) and matches NewLang's listed line endings.

These recognized physical endings terminate line comments, are normalized to LF in raw-string values (including LS and PS), and are eligible for ordinary-string continuation under DEC-030. DEC-035 extends these lexical effects to escape-generated line breaks; DEC-036 groups adjacent CR and LF even when their origins differ.

**Decision DEC-033 — approved:** Use the following decimal and hexadecimal floating-point shapes, before any typed suffix. These describe valid literals; the wider candidate grammar required by DEC-067 is still open.

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

`digit` is an ASCII decimal digit, and `hex-digit` is an ASCII decimal digit or `A`–`F`/`a`–`f`. Thus a significand has at least one digit, hexadecimal floats require a `p`/`P` exponent, and a single underscore used as a digit separator appears only between digits of the same component. For example, `.5`, `1.`, `1e3`, `0x1p0`, `0x1.p0`, and `0x.8p0` are supported. DEC-047 specifies suffix spelling; DEC-062 selects the standard reference.

_Superseded by DEC-083:_ tokenize `1.foo` as the float `1.` followed by identifier `foo`, to which DEC-008's implicit `APPLY` rule applies. Under DEC-083, these touching tokens are now one error operand. Report an invalid-digit error for `0b102` and `123foo`. Under DEC-047, a suffix must start with `#`, so an attached bare `foo` cannot be a suffix. These decisions do not by themselves determine every other number/identifier boundary (LP-14/25).

**Decision DEC-034 — approved:** Apply these additional numeric-boundary rules:

- After an operand, `.5` remains a floating-point token under context-independent longest matching. For example, `a .5` and `a/*comment*/.5` contain identifier `a` followed by float `.5`, with implicit `APPLY`. _Superseded by DEC-083:_ `a.5` is now one error operand, because the identifier and the number touch.
- If a floating-point core ending in a digit is immediately followed by a bare identifier, report an invalid-digit error. For example, `1.2foo` and `1e3foo` are errors; DEC-047 requires a suffix to start with `#`. DEC-083 now also makes `1.foo` one error operand, superseding its earlier split.
- An exponent introducer recognized for a numeric literal must be followed by decimal exponent digits after any optional sign. Incomplete exponents such as `1e+` and `0x1p` are malformed numeric literals.

These earlier decisions require the specified diagnostic rather than splitting back to an earlier valid token. DEC-067/071 select longest candidate matching followed by validation as the approach for preserving those diagnostics; exact candidate boundaries remain open below. DEC-047 separates suffixes from exponent markers with `#`.

**Decision DEC-057 — approved:** Incomplete integer forms are errors: a radix marker without digits (`0x`, `0b`, `0o`, `0d`) and a `base#` without digits (`16#`, `2#`). The diagnostic covers the whole incomplete form rather than splitting back to a shorter valid token.

**Decision DEC-058 — approved:** The base field of `base#number` has no leading zeros. For example, `02#10` and `036#z` are errors rather than radix literals or decimal-plus-suffix forms.

**Decision DEC-059 — approved:** Every floating-point form may carry a numeric suffix (DEC-047), for example `1.5#F64`, `1.#F64`, `.5#F64`, `1e3#F64`, and `0x1p0#F64`. Suffix names and type meanings remain semantic questions.

**Decision DEC-060 — approved:** Malformed digit separators are errors. Any `_` not placed singly between two digits of the same component is diagnosed, for example `1__2`, `1_`, `0x_1`, `1._2`, `1e_2`, and `16#_f`.

**Decision DEC-061 — approved:** Numbers adjacent to dot runs use ordinary longest-match tokenization (LP-02); no special rule applies. With the current operator set, which has no `..` or `...` operator, `1..2` is float `1.` followed by float `.2` (implicit `APPLY`; _superseded by DEC-083_: these touching numbers now form one error operand), and `1...x` is float `1.`, operator `.`, operator `.`, and identifier `x` (implicit `EMPTY` between the two operators). Adding multi-dot operators later would change these results through the same longest-match rule.

DEC-090 selects no language-level significand/exponent/suffix length limits. Numeric range, overflow/underflow, and rounding remain numeric-type and semantic questions.

**Decision DEC-062 — approved:** Use IEEE 754-2019, identical to ISO/IEC 60559:2020, as the floating-point standard reference for this language.

**Permissive candidates and post-match validation — selected approach; exact boundaries open (DEC-071):**

DEC-071 selects permissive candidate matching followed by validation. For example, `0b102` is retained as a numeric candidate and then rejected for its invalid base-2 digit. Earlier requirements for incomplete numbers, malformed separators, and unterminated comments/literals are handled by recognizing malformed constructs as candidates and diagnosing them after matching, rather than by a special fallback exception. This chooses the strategy, not all candidate boundaries:

- **Incomplete forms:** Candidate shapes must include forms such as `0x`, `16#`, `1e+`, and `0x1p` far enough to issue DEC-034/057 diagnostics over the intended extent.
- **Malformed separators:** Candidate shapes must include `1__2`, `1_`, `0x_1`, and analogous malformed placements so DEC-060 can reject them as numeric candidates rather than split them into unrelated valid tokens.
- **Base-field spelling:** Deferring digit/base checks does not by itself defer DEC-058's no-leading-zero rule for the base field. Candidate recognition and later validation must distinguish invalid `02#10` from radix/suffix fallback under DEC-047. Checking the base field after matching can preserve this requirement; it is not an inherent conflict with longest matching.
- **Bare identifier tails:** Candidate boundaries must preserve errors for `123foo`, `1.2foo`, and `1e3foo`, and, under DEC-083, `1.foo` (DEC-033/034/047/083).
- **Unified numeric candidate (DEC-089):** Match integer and floating-point forms, including suffixes, as one candidate, then classify and validate it. The exact permissive shape must distinguish `1e3`, `0x1p2`, and radix digits in `16#1e2` without separate integer/float candidate ties.
- **Malformed comments/literals:** Candidate matching must retain constructs such as unterminated `/*text`, quoted literals, and malformed escapes through validation so DEC-029 diagnostics are produced rather than losing them to operator/identifier tokenization.

These are remaining candidate-boundary and validation details, not conflicts with the selected candidate-then-validation strategy. No malformed-candidate exception to longest matching is selected.

**Decision DEC-035 — approved:** Apply these rules to global universal-character translation:

- Use Java-style backslash eligibility. An original source backslash is eligible to start an escape if the immediately preceding translated character was produced by a universal-character escape, or if the translated output ends in an even number of consecutive backslashes. Count generated backslashes in that trailing run; the empty run has length zero. For example, source `\\u0041` remains `\\u0041` at this phase, while `\u005C\u0041` produces the characters `\A`.
- An eligible `\u` requires exactly four following ASCII hexadecimal digits; an eligible `\U` requires eight. Consume exactly that many digits, leaving additional source characters for subsequent processing. Diagnose missing or non-hexadecimal digits and values that are not Unicode scalars, including surrogates and values above U+10FFFF. Adjacent surrogate escapes such as `\uD83D\uDE00` do not form a valid pair; a supplementary scalar can instead be written as `\U0001F600`.
- Translate in one pass. A backslash produced by an escape cannot itself start another universal-character escape. For example, `\u005Cu0041` produces the characters `\u0041`, without translating them again. A later original-source backslash can still be eligible under the rule above.
- Escape-generated hard-break characters have the same lexical effects as the physical endings in DEC-032: they terminate line comments, are forbidden unescaped in ordinary character and string literals, and are normalized to LF in raw strings. They may also participate in ordinary-string continuation, extending DEC-030's physical-only rule. After translation, remove the backslash, line ending, and immediately following spaces and tabs; character literals still cannot use continuation. The backslash may itself be generated: `"\u005C\u000A"` produces an empty ordinary string.

DEC-036 specifies mixed-origin CRLF grouping and the phase ordering relative to normalization. Detailed original-source mapping remains open (LP-23). Non-universal raw-string backslashes are literal (DEC-055).

**Decision DEC-036 — approved; whole-source NFC superseded by DEC-082:** Apply these source-processing and location rules:

- _(Superseded by DEC-082.)_ Originally: after global universal-character translation and before tokenization, normalize the entire translated source to NFC, including comments, identifiers, ordinary literals, and raw strings, so that token matching applies to the normalized stream.
- _(Superseded by DEC-082.)_ Originally noted consequences: whole-source NFC could change literal content and token spelling, for example U+037E GREEK QUESTION MARK becoming `;` before tokenization.
- Recognize adjacent CR and LF as one CRLF ending even if either or both characters came from Unicode escapes. This applies to comment termination, raw-string LF normalization, and ordinary-string continuation; the latter removes both characters in the pair.
- Represent original-source spans on lexer tokens and operator/operand tree nodes as zero-based, half-open UTF-8 byte ranges `[start,end)`. Count an initial UTF-8 BOM in these offsets even though it produces no token: an `a` immediately after the BOM has span `[3,4)`. Preserve mappings back through Unicode translation and token-level normalization (DEC-082).
- Display diagnostic locations using physical lines and columns in the original file. Escape-generated line breaks do not advance the physical line count; translated logical locations may be provided additionally. For example, in `// x\u000A y` on one physical line, `y` is on physical line 1 even though it is on translated logical line 2. Human-facing columns are one-based and count Unicode scalar values in the original physical source line; tabs count as one column (DEC-046). Editor protocol positions are converted separately from original UTF-8 byte spans to the negotiated encoding.

DEC-082 removes whole-source normalization, so token and node spans map to original bytes through global Unicode translation alone. Normalized identifier and literal forms are token-level values; mapping positions inside a normalized literal back to original bytes is only needed for diagnostics within that literal (LP-23). Non-universal raw-string backslashes are literal (DEC-055); DEC-047 specifies numeric suffix syntax.

**Decision DEC-082 — approved; supersedes DEC-036's whole-source NFC:** Do not normalize before tokenization. Global universal-character translation (DEC-027/035) still precedes tokenization, and token matching, including raw-tag syntax and identifier `XID_Start XID_Continue*`, operates on translated but unnormalized text. After tokenization:

- Identifiers keep DEC-024: an NFKC internal lookup name and an NFC user-facing form.
- All string forms, meaning ordinary strings, character literals, and raw strings, apply NFC using Unicode 18.0.0 to their literal content after global `\u`/`\U` translation and before ordinary escape processing. DEC-039 still forbids normalization after escapes. For example, `'e\u0301'` becomes `'é'` and is a valid one-scalar character literal, whereas `'e\x{301}'` decodes to two scalars and is invalid. A combining mark after an escape letter can compose with it: `"\n\u0303"` becomes `"\ñ"`, an unrecognized escape (Belegt via Node NFC).
- Comments and other tokens are not normalized. The user expects normalization would not change other tokens. Without whole-source NFC, former normalization cases become errors rather than different tokens: U+037E is an error token rather than `;`, and `=` followed by U+0338 is `=` followed by an error token rather than `≠`.

This resolves the whole-source composition/reordering mapping problem in LP-23: no normalized text has to be mapped across token boundaries.

Other raw-string syntaxes are retained below as comparisons; they are not selected.

| Family / examples                                                  | Delimiter model                                                                                                                           | Trade-offs                                                                                                             |
| ------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| Fixed backtick: `` `text` `` (Go; also GenLang)                    | One fixed delimiter; Go uses literal content through the next backtick. GenLang allows doubled backticks inside its multiline raw string. | Very concise; a literal backtick requires a special rule or cannot appear directly.                                    |
| Hash-counted: `r#"text"#`, `r##"text with "# inside"##` (Rust)     | Choose a count of `#` characters; matching quote-plus-hashes ends the string.                                                             | Flexible content and simple matching; introduces a delimiter-count rule and prefix.                                    |
| Tagged paired delimiter: `R"tag(text)tag"` (C++ and LangLLVM PEG)  | A short tag appears at both ends around `(` and `)`.                                                                                      | Accommodates quotes and backslashes; more punctuation and restrictions on tags.                                        |
| Variable quote run: `"""text"""` (C#)                              | Matching delimiter uses a run of at least three quotes; longer runs allow quote runs in content.                                          | Familiar quote-only form; multiline indentation rules can add complexity.                                              |
| Raw prefix on ordinary quotes: `r"text"` or `r"""text"""` (Python) | Prefix changes backslash handling; quote count still determines termination.                                                              | Familiar and compact; rawness does not itself solve delimiter collisions, and ordinary string constraints still apply. |
| NewLang scanner prototype: `` `tag"text"tag` ``                    | Appears to use a tag between the opening backtick and quote and a matching quote/tag/backtick close.                                      | Selected delimiter family (DEC-026); scanner behavior is prototype evidence, not a complete content specification.     |

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

| Token/category                                        | Agreed source syntax                                                                                                                                                                        | Notes / unresolved details                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| ----------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Source encoding                                       | UTF-8 only; optional initial UTF-8 BOM                                                                                                                                                      | The BOM is ignored in the token stream, but counts in original byte offsets; malformed UTF-8 is diagnosed (DEC-029/031/036).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| Source normalization                                  | None before tokenization; token-level after it                                                                                                                                              | Identifiers use NFKC lookup names and NFC user-facing forms. Literal content of strings, character literals, and raw strings is normalized to NFC after `\u` translation and before escapes. Comments and other tokens are not normalized (DEC-082, superseding DEC-036's whole-source NFC).                                                                                                                                                                                                                                                                                                                    |
| Physical line ending                                  | LF, CR, CRLF, NEL, VT, FF, LS, or PS                                                                                                                                                        | Unicode 18 UAX #14 hard-break set; adjacent CR and LF count as one even when their origins differ (DEC-032/036).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| Inter-token whitespace                                | Unicode 18 `White_Space` property                                                                                                                                                           | Characters in the selected hard-break set retain line-ending behavior; all other `White_Space` characters separate tokens (DEC-032/044).                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| Escape-generated line ending                          | Universal-character escape producing a recognized hard-break character, e.g. `\u000A`                                                                                                       | Has the lexical effects of the corresponding physical line ending, including ordinary-string continuation (DEC-035). Original-source mapping remains open.                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| Line comment                                          | `//` through a recognized physical or escape-generated line ending                                                                                                                          | Comments separate tokens (DEC-029/032/035).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| Block comment                                         | `/* ... */`                                                                                                                                                                                 | Non-nested; ends at the first `*/`; separates tokens.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| Identifier                                            | `XID_Start XID_Continue*`                                                                                                                                                                   | Matched on translated, unnormalized text; case-sensitive, with NFKC internal name and NFC user-facing form. Unicode data version 18.0.0 is pinned (DEC-031/082).                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| Universal-character escape                            | `\uXXXX`, `\UXXXXXXXX`                                                                                                                                                                      | Globally translated before tokenization using Java-style eligibility and one pass; malformed escapes and non-scalar values are errors (DEC-027/035). A generated backslash may start a later ordinary literal escape, but never another global Unicode translation (DEC-045). Original-source mapping details remain open.                                                                                                                                                                                                                                                                                      |
| Named character escape                                | `\N{name}`                                                                                                                                                                                  | Looks up Unicode 18.0.0 character names and name aliases, case-insensitively; names are single-scalar only, with no named sequences (DEC-030/040). Unknown names are errors.                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| Character literal                                     | `'...'`                                                                                                                                                                                     | Content NFC after `\u` translation and before ordinary escapes; the decoded result must be exactly one Unicode scalar, with no post-escape normalization (DEC-030/039/082). No unescaped line breaks or continuation; a literal interrupted by a line ending is an error operand (DEC-077).                                                                                                                                                                                                                                                                                                                     |
| Ordinary string literal                               | `"..."`                                                                                                                                                                                     | Content NFC after `\u` translation and before ordinary escapes (DEC-082). No unescaped line breaks; a literal interrupted by a line ending is an error operand (DEC-077); backslash followed by a line ending continues the string, removing both and immediately following spaces/tabs (DEC-030/035). Decoded values are not normalized again after escapes (DEC-039).                                                                                                                                                                                                                                         |
| Raw string literal                                    | `` `TAG"..."TAG` ``                                                                                                                                                                         | Tags match `[A-Za-z0-9_]*` on unnormalized text, including empty, without a fixed length limit. Physical and escape-generated line endings normalize to LF, including LS and PS (DEC-032/035/036). Non-universal backslashes are literal: `` `END"\n"END` `` contains backslash and `n` (DEC-055). Global `\u`/`\U` translation still applies first (DEC-027); content is then normalized to NFC (DEC-082).                                                                                                                                                                                                     |
| Perl-style character/string escapes                   | `\a`, `\b`, `\cX`, `\e`, `\f`, `\n`, `\N{...}`, `\r`, `\t`, `\v`, `\x{...}`                                                                                                                 | DEC-030/040–045 select named single-scalar lookup, fixed control escapes, `\x{hex}`, and no `\N{U+...}`; `\o{...}` is not selected. A generated backslash may start any ordinary escape but cannot restart global Unicode translation. For `\cX`, `?` maps to DEL; ASCII `@`–`~` maps to `X & 0x1F`; other values are errors.                                                                                                                                                                                                                                                                                   |
| Integer literal                                       | Decimal digits; `0b`/`0B`, `0o`/`0O`, `0d`/`0D`, `0x`/`0X`; or `base#number`                                                                                                                | Bases 2–36; case-insensitive letter digits; single `_` only between digits; unmarked leading zeros remain decimal (DEC-028). Shares DEC-089's unified numeric candidate with floats; classify and validate after matching. Exact permissive candidate shape remains open (DEC-033/047/057/058/060/089).                                                                                                                                                                                                                                                                                                         |
| Floating-point literal                                | Valid decimal or hexadecimal form as specified in DEC-033                                                                                                                                   | Hexadecimal floats require a `p`/`P` exponent; single `_` separators occur only between digits of a component. Shares DEC-089's unified candidate with integers; classify and validate after matching. Exact permissive shape remains open. Leading signs are operators; exponent signs belong to literals. All forms may carry suffixes (DEC-047/059); dot runs follow longest match (DEC-061). IEEE 754-2019 / ISO/IEC 60559:2020 is selected (DEC-062); lexical length limits remain open.                                                                                                                   |
| Numeric suffix                                        | `#` followed by `[A-Za-z0-9]+`                                                                                                                                                              | ASCII case-insensitive; no empty body or underscore. After an unmarked integer from 2 through 36, the first `#` selects radix notation and a second `#` selects a suffix. Use `0d` to force decimal interpretation (DEC-047).                                                                                                                                                                                                                                                                                                                                                                                   |
| Grouping / template / block delimiters                | `(` `)`, `{` `}`, `[` `]`                                                                                                                                                                   | Parentheses group; braces define blocks/scopes; square brackets delimit template parameters and arguments (DEC-011/063). Each pair encloses an operator tree, with an interior loosest-operator boundary, and acts as one operand outside. Empty groups contain one `EMPTY`; pairs must match, with missing closers inserted at EOF and diagnosed (DEC-072). Concrete CST layout remains open (Q-015).                                                                                                                                                                                                          |
| Member-access / dot operator                          | `.`                                                                                                                                                                                         | Left-associative; exact operator form/semantics remain open (Q-007).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| Function type arrow                                   | `->`                                                                                                                                                                                        | Used in `(INPARAMS) -> (OUTPARAMS)` and as a function-definition operator; non-associative (DEC-037). `.` binds tighter (DEC-049); other form details remain open (Q-007).                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| Binding operators                                     | `:` `:=` `::=`                                                                                                                                                                              | Constant, variable, and type binding meanings respectively; each requires a left `@name` operand (DEC-052). Other binding/type/initializer semantics remain open (Q-009/010).                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| Initializer / assignment                              | `=`                                                                                                                                                                                         | Also appears as the initializer marker within a type form; expression form and semantics are tracked in Q-007/009.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| Name-declaration operator                             | `@name`                                                                                                                                                                                     | Supplies the required left operand for binding meanings of `:`, `:=`, and `::=` (DEC-052); detailed name-declaration semantics remain open (Q-007).                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| Arithmetic / bitwise / comparison / logical operators | `++` `--` `!` `~` `**` `*` `/` `%` `+` `-` `<<` `>>` `&` `^` <code>&#124;</code> `<` `<=` `>` `>=` `==` `!=` `&&` <code>&#124;&#124;</code>                                                 | `**` is exponentiation and right-associative; `^` is XOR. Other semantics and prefix/postfix forms are not fully specified (Q-007). Their relative levels are in DEC-022.                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| Channel operator                                      | `<-`                                                                                                                                                                                        | Retained from the adopted precedence inventory; exact meaning/form remains open (Q-007).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| Conditional operators                                 | `?` `:`                                                                                                                                                                                     | `?` begins the conditional; `:` separates its arms. Both are right-associative at their selected levels; then-branch nesting requires parentheses (DEC-056).                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| Reserved operator                                     | `::`                                                                                                                                                                                        | Parses as a valid operator with the `:` precedence and right associativity, but has no valid operands; use is diagnosed semantically (DEC-050/066/074).                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| Compound assignment operators                         | `+=` `-=` `*=` `/=` `%=` `&=` <code>&#124;=</code> `^=` `<<=` `>>=`                                                                                                                         | Present in the selected precedence inventory; detailed semantics/forms remain open (Q-007).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| List operator                                         | `,`                                                                                                                                                                                         | Creates a list of expressions, which may be evaluated in parallel; left-associative (DEC-022/064). List representation and evaluation details remain open.                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| Sequencing operator                                   | `;`                                                                                                                                                                                         | Creates a sequence of expressions, evaluating the left expression before the right. It is left-associative and the loosest operator, not a required statement terminator; newlines do not insert it. Its result value remains open (DEC-051/064/066).                                                                                                                                                                                                                                                                                                                                                           |
| Implicit parser tokens (not source spellings)         | `APPLY`, `EMPTY`                                                                                                                                                                            | Make only the insertions needed to alternate operands and operators: `APPLY` between adjacent operands and `EMPTY` between adjacent operators (DEC-008/048). Unary prefix/postfix forms use `EMPTY` on the missing side (DEC-010). Semantic legality remains open (Q-008).                                                                                                                                                                                                                                                                                                                                      |
| Error token                                           | Minimal unmatched sequence; invalid or incomplete candidates retain their candidate extent; one error character per UTF-8 maximal subpart or malformed universal escape; unexpected closers | DEC-067/071/077/089 select longest candidates, post-match validation, one unified numeric candidate, and incomplete-prefix error operands; DEC-068 classifies the token for implicit insertions after DEC-079 collapses consecutive error tokens. DEC-078 keeps Unicode errors inside comments/literals diagnostic-only; DEC-081 makes unexpected closers error tokens. DEC-083 makes touching identifiers/numbers one error operand; DEC-084 extends unterminated block comments/raw strings to EOF; DEC-085 bounds fallback runs; DEC-086/087 specify operator-error binding and trivia-independent collapse. |

Longest-match tokenization, candidate-then-validation, error-token recovery, explicit lexical diagnostics, and original-source spans are specified by DEC-029/036/067–071. DEC-077–089 settle incomplete-candidate extents, Unicode-error units, error collapse and binding, empty files, unexpected closers, token-level normalization, identifier/number adjacency, unterminated comments and raw strings, fallback error runs, and unified numeric candidate matching. The exact numeric candidate grammar and the CST/mapping representation remain implementation-level work.

## Expression token stream and implicit insertions

**Decision DEC-008 — approved:** After comments are stripped without joining the tokens they separate (DEC-029), the source is treated as an operand/operator sequence. Whitespace separates tokens; apart from its role inside strings and comments, it does not itself express grouping or application. Syntactic elements are classified as operators, identifiers, or constants; identifiers and constants are operands.

To restore alternation in the token stream:

- Insert an implicit `APPLY` operator between two directly adjacent operands. It has no explicit source spelling.
- Insert an implicit `EMPTY` operand between two directly adjacent operators. It has no explicit source spelling.

The transformed sequence alternates operands and operators. DEC-048 confirms that these are minimal insertions, not additional construct-specific insertion rules.

Error tokens use DEC-068's contextual operand/operator classification; Unicode-error tokens use the same rule (DEC-070). Consecutive error tokens are first collapsed into one (DEC-079/087), and an operator-classified error binds tightest with left associativity (DEC-086). Touching identifiers/numbers form one error operand before insertion (DEC-083). Comments are retained in the CST even though they are excluded from this insertion stream (DEC-069).

**Decision DEC-009 — approved:** Parse the resulting stream into a tree using operand-priority rules. Whether an inserted `APPLY` or `EMPTY` is legal in its resulting semantic context is checked during semantic analysis, not parsing.

**Decision DEC-010 — approved:** Unary prefix and postfix operators are represented using an implicit `EMPTY` operand, not separate unary-operator syntax in the tree. A prefix operator has `EMPTY` on its left; a postfix operator has `EMPTY` on its right. This is the tree representation; semantic analysis determines whether the operator is valid in that unary context.

The adopted relative operator priorities and associativities are listed in DEC-022/066/093. Semantic legality rules for inserted elements remain open (Q-008); operator semantics and remaining binding interactions are tracked in Q-007.

**Decision DEC-063 — approved:** Parentheses `()` group expressions; braces `{}` define blocks (scopes); and square brackets `[]` delimit template parameters. The previously selected square-bracket form for template arguments remains in DEC-011. DEC-072 specifies their shared grouping behavior; concrete CST representation remains open (Q-015).

**Decision DEC-072 — approved:** All three delimiter families can enclose an operator tree. The inside of a delimiter pair acts as a loosest operator for that enclosed tree, and the complete group acts as a single operand in the enclosing tree. Apply this recursively to nested groups without changing DEC-063's distinct grouping, scope, and template roles. An empty group contains one implicit `EMPTY` operand.

Opening and closing delimiters must match; a mismatch is a syntax error. If a delimiter remains open at EOF, diagnose the missing closing delimiter and insert it. The concrete CST encoding, original-source spans for inserted closers, and recovery limits remain implementation/recovery questions; mismatches are not silently accepted. DEC-081 converts unexpected closers into error tokens.

**Decision DEC-073 — approved:** Prefix and postfix forms parse like all other operators, using the ordinary operator priorities, associativities, and implicit insertions. There is no separate unary parsing rule or special group-boundary binding rule. Semantic analysis decides their prefix/postfix meaning and legality from the `EMPTY` arguments (DEC-010). This retains DEC-065's current treatment of `a * -b`.

**Decision DEC-074 — approved:** Implement `::` as a syntactically valid operator at its already-selected precedence and associativity. It has no valid operands, so its use is diagnosed by semantic analysis, not rejected as an unknown or invalid parser operator. This clarifies DEC-050's reservation without assigning it a valid expression meaning.

**Decision DEC-075 — approved:** Token recognition acts as if recognized comments have been replaced by whitespace. Comments cannot join token fragments or operator spellings across their extent; they are also excluded from implicit insertion as already specified. This is a recognition rule, not deletion from the lossless CST: retain original comments and source bytes (DEC-069). Comment recognition still respects literal boundaries and the selected global Unicode-translation phase; malformed comments still require diagnostics under DEC-029/071.

**Decision DEC-076 — approved:** All language syntax fits the selected operator/operand model, including delimiter groups. No selected language form requires an additional construct-specific parser production. Further definitions of declarations, functions, types, templates, namespaces, imports, packages, and the object model concern their semantic interpretation within this syntax, not an outstanding decision about additional structural syntax.

**Decision DEC-064 — approved:** `;` creates a sequence of expressions, with the left expression processed before the right (DEC-051). `,` creates a list of expressions; those expressions may be evaluated in parallel. This permits parallel evaluation but does not require it. The left associativity of `,` from DEC-022 is unchanged; DEC-066 makes `;` left-associative too. List representation, evaluation-order and side-effect details, and `;`'s result remain open.

**Decision DEC-065 — approved for now:** Do nothing special for `a * -b`; no additional parsing rule is selected for this case. Minimal insertion yields `a * EMPTY - b`; under the straightforward binary-precedence interpretation checked in KP-079, it groups as `(a * EMPTY) - b`. This does not decide the semantic legality of the resulting `EMPTY`. DEC-073 confirms ordinary parsing for prefix/postfix forms generally.

**Decision DEC-066 — approved:** `;` is left-associative, like `,`, without changing their relative precedence. Operators on the same precedence level share associativity; where none was previously specified for a level, it is non-associative. Thus `@`, `++`, `--`, `!`, `~`, and `<-` are non-associative; `->` remains non-associative. Reserved `::` shares the right associativity of `:` but remains without an expression meaning. When non-associative operators would require association at the same level, explicit grouping is required or the ungrouped chain is rejected. This does not determine semantic legality.

**Decision DEC-037 — approved, sequencing interpretation refined by DEC-051:** The first parser targets the full selected language, including declarations, functions, types, blocks, classes/interfaces, packages, and imports; this choice does not complete their source forms or authorize implementation. Newlines remain whitespace, with no automatic semicolon insertion. DEC-051 specifies `;` as an expression-sequencing operator rather than a required statement terminator. DEC-053 places predefined-identifier recognition in semantic analysis, not in construct-specific parser productions.

The `->` operator is non-associative: ungrouped chains such as `A -> B -> C` require explicit grouping or must be rejected. This does not decide the legality of grouped forms. DEC-049 subsequently makes `.` bind tighter than `->`, resolving their former mixed-precedence tie (LP-26).

DEC-069 replaces DEC-037's earlier separate-tree output requirement: the first parser produces a CST whose operators each have two operands, plus comments. Implicit `APPLY`/`EMPTY` use the selected operator/operand representation in this CST. No separate AST is required or produced by the first parser.

**Decision DEC-069 — approved:** The CST is a tree of operators with two operands each, plus comments. Postpone AST design until more semantic definitions exist; the AST is not part of the first parser. This supersedes the earlier requirement for a separate operator/operand tree alongside the CST, not the existing source-preservation requirement: preserve original bytes, including an initial BOM, comments, whitespace, and escape spellings, so the input can be reconstructed despite translation and NFC normalization. Comment attachment, operand/group/error node layouts, trivia storage, and source mappings remain open (Q-015, LP-23).

**Decision DEC-038 — approved, refined by DEC-067–071:** On parser syntax errors, report errors explicitly and attempt to recover to find further diagnostics. Return a lossless original-source CST even for syntactically invalid input, representing invalid or skipped syntax with error nodes or an equivalent. The presence of a CST does not make an invalid parse successful. DEC-067/068/071 select lexical candidate matching, post-match validation, fallback error-token recovery, and insertion classification; DEC-070/078/079 select Unicode-error units and spans and collapse of consecutive error tokens; DEC-081 converts unexpected closers into error tokens; and DEC-080 represents a comment-only file as one `EMPTY`. Further structural recovery limits, error-operator binding, and error-token representation in the binary CST remain open. There is no separate AST error-result contract for the first parser (DEC-069).

**Decision DEC-039 — approved:** Do not normalize ordinary character or string values after processing their literal escapes. Validate the one-scalar character-literal rule directly on the decoded value. DEC-082 replaces DEC-036's whole-source NFC with NFC of literal content, including raw strings, after global translation and before escape processing. This decision still allows no normalization pass after literal escape processing.

**Decision DEC-040 — approved:** For `\N{name}`, look up Unicode 18.0.0 character names and official name aliases. Match ASCII letters case-insensitively; spaces and punctuation otherwise match exactly. Unknown names are errors. A lookup must resolve to one Unicode scalar; named sequences remain unsupported as specified in DEC-030.

**Decision DEC-041 — approved:** Do not support Perl-style `\N{U+...}` numeric code-point notation. Reserve `\N{...}` for names and aliases; global `\uXXXX` and `\UXXXXXXXX` remain the numeric Unicode escapes.

**Decision DEC-042 — approved:** Ordinary character and string literals recognize NewLang's simple escape set: `\a`, `\b`, `\e`, `\f`, `\n`, `\r`, `\t`, `\v`, and `\cX`, in addition to the selected quote and backslash escapes. `\e` denotes ESC (U+001B). For `\cX`, `?` (U+003F) maps to DEL (U+007F); ASCII `@` through `~` (U+0040–U+007E) map to `X & 0x1F`; all other following characters are invalid. This adopts the mapping recorded in NewLang's notes. DEC-043 subsequently selects `\x{hex}`; `\o{...}` is not selected.

**Decision DEC-043 — approved:** Support `\x{hex}` in ordinary character and string literals as a Unicode scalar escape. The braces must contain one or more ASCII hexadecimal digits; leading zeros are allowed, with no separators. An empty body, missing closing brace, or non-hex digit is an error. Reject values above U+10FFFF and surrogate values. The escape contributes the one scalar it denotes; it does not encode bytes. Do not support `\o{...}`.

**Decision DEC-044 — approved:** Treat every Unicode 18 `White_Space` character as a separator between tokens unless it belongs to the selected DEC-032 hard-break set, in which case it retains line-ending behavior. This includes non-ASCII spaces. Whitespace inside comments or literals is governed by those constructs' rules.

**Decision DEC-045 — approved:** In ordinary character and string literals, perform literal-escape processing on the translated source stream, regardless of whether a backslash came from the original source or a global Unicode escape. Thus a generated backslash can start any recognized ordinary escape, including `\n`, `\x{...}`, `\N{...}`, or a line continuation. It cannot initiate another global `\u`/`\U` translation: global translation remains one-pass under DEC-035. An unrecognized ordinary escape remains an error under DEC-030.

**Decision DEC-046 — approved:** Human-facing diagnostic columns are one-based and count Unicode scalar values in the original physical source line; each tab counts as one column. This convention does not change the zero-based, half-open original UTF-8 byte spans selected by DEC-036. Editor protocol positions are a separate representation and must be converted to the negotiated encoding.

**Decision DEC-047 — approved:** Every numeric suffix starts with `#`, followed by one or more ASCII alphanumeric characters (`[A-Za-z0-9]+`), matched case-insensitively. The suffix body is not empty and contains no underscore. For an unmarked decimal integer whose value is from 2 through 36, the first `#` introduces `base#number`; a further `#` introduces its suffix. Invalid digits in this selected radix interpretation are errors, not a reason to fall back to a decimal suffix. Outside that base range, the first `#` can introduce a decimal suffix. An explicit `0d` marker forces decimal interpretation. Thus `16#ff` denotes base-16 digits, `36#1#I32` has suffix `I32`, and `0d16#ff` has a decimal core and suffix `ff`. Suffix names and type meanings remain semantic questions.

**Decision DEC-090 — approved:** Numeric candidate exponent signs are local: an exponent marker may consume one immediately following sign even when exponent digits are missing; further signs are operators. Thus `1e++2` is malformed `1e+`, operator `+`, number `2`. Radix integers do not have exponent syntax: `16#1e+2` is radix integer `16#1e`, operator `+`, number `2`. Preserve malformed candidates rather than shortening them: `0x1.2` (missing binary exponent) and `0x#x` (missing significand, suffix-shaped tail retained) each form one error candidate. Impose no language-level length limits on significands, exponents, or suffixes; retain numeric text without using host-number precision as a lexical constraint. Resource exhaustion must be reported explicitly, not by truncating a candidate or silently shortening it. Numeric type ranges, rounding, overflow/underflow and suffix meanings remain semantic questions.

These policies were approved on 2026-11-06 at 20:06 (+01:00). DEC-091 completes the component and hash-boundary rules.

**Decision DEC-091 — approved (2026-11-06 20:10, +01:00):** Use these deterministic rules for the unified permissive numeric candidate, then classify and validate without shorter-token fallback:

- Start at an ASCII digit, or `.` immediately followed by an ASCII digit.
- Decimal/prefixed components consume ASCII alphanumerics and underscores, except their first eligible exponent marker (`e/E` for decimal, `p/P` for hex). Once invalid alphabetic tail text begins, later marker letters do not reopen exponent recognition. At most one point precedes the exponent; no point occurs after it. Exponent components likewise consume ASCII alphanumerics/underscores, but never a second sign or exponent. Binary/octal prefixed and radix integer components do not accept points/exponents.
- A `#` after a plain decimal base field selects radix under DEC-047/058; underscores in that base field remain for validation. A radix body consumes ASCII alphanumerics/underscores; letters never introduce an exponent. Prefix recognition takes place immediately after initial `0`; later prefix-like text stays within a malformed component.
- Consume at most one suffix separator after the numeric core (a radix form already used one `#` for its base). The permissive suffix component consumes ASCII alphanumerics/underscores; validate against `[A-Za-z0-9]+` afterward. Empty and underscore-containing suffixes are errors. Leave any further `#` for fallback recovery.
- Apply DEC-083 after candidate recognition, including malformed numeric candidates: maximal directly touching identifier/number runs are one error operand. Unicode XID identifier tails participate in adjacency, not ASCII numeric/suffix validity. Unicode-error characters remain separate error units.
- Components after consumed introducers may be empty in a candidate and are rejected during validation when required. The initial digit/`.digit` requirement remains mandatory.

Consequences: `1e2e+3` gives error operand `1e2e`, `+`, `3`; `1fooE+2` gives error operand `1fooE`, `+`, `2`; `1e2.3` is one touching-run error operand; `1#F_64` is one invalid suffix candidate; `16##x` is one invalid candidate with an empty radix body and suffix `x`. Extra hashes stay outside: `37#foo#bar` gives numeric `37#foo`, fallback error `#`, identifier `bar`; `16#ff#I32#x` gives numeric `16#ff#I32`, fallback error `#`, identifier `x`. Existing `1..2` adjacency errors and `1...x` operator boundaries remain unchanged.

**Decision DEC-048 — approved clarification of DEC-008/010:** Make the minimal insertions needed to produce an alternating operand/operator sequence: insert `APPLY` between adjacent operands and `EMPTY` between adjacent operators. Do not add construct-specific insertion requirements. The existing `EMPTY` representation of a missing unary operand remains unchanged.

**Decision DEC-049 — approved, with the APPLY relationship superseded by DEC-093:** Make `.` bind tighter than `->`, splitting their former shared priority level. Keep `.` left-associative and `->` non-associative. DEC-093 places both above `APPLY`.

**Decision DEC-050 — approved, clarified by DEC-074:** Reserve `::` without assigning it a current expression meaning. Its existing relative placement alongside `:` remains unchanged. It parses as a valid operator with no valid operands; semantic analysis diagnoses its use.

**Decision DEC-051 — approved:** `;` is an operator that sequentially processes expressions: evaluate the left expression before the right. It remains the loosest operator; it is not a required statement terminator. This refines DEC-037's earlier statement-terminator description without changing the newline-as-whitespace rule. DEC-066 subsequently specifies left associativity; the result-value convention remains open.

**Decision DEC-052 — approved:** The binding meanings of `:`, `:=`, and `::=` require a left `@name` operand. These bindings are expressions in the operator/operand model, not a separate parser-recognized declaration category. This refines the bare-name sketches in DEC-011; `:` also retains its separate conditional role.

**Decision DEC-053 — approved:** The parser does not recognize keyword-like meanings of predefined identifiers. Semantic analysis looks identifiers up in the symbol table; the resulting binding may carry the semantic meaning associated with a keyword-like construct. Redefinition therefore affects semantic interpretation, not lexical classification or a parser keyword recognizer.

**Decision DEC-054 — approved:** TypeScript is confirmed as the implementation language for the next attempt. This supersedes the tentative status of DEC-004.

**Decision DEC-055 — approved:** In raw strings, every backslash that is not part of a globally translated `\uXXXX`/`\UXXXXXXXX` universal-character escape (DEC-027/035) is literal content. Raw strings have no ordinary escapes, so `` `END"\n"END` `` contains a backslash followed by `n`. This matches NewLang's scanner prototype (KP-074) and supersedes the earlier rejection of this alternative.

**Decision DEC-056 — approved:** The current `?` and `:` priorities are retained. Conditional nesting in the then-branch requires explicit parentheses, for example `a ? (b ? c : d) : e`; no special conditional parser rule or semantic reassociation is provided.

**Decision DEC-021 — approved:** Use GenLang's numeric priority scale as the starting point for the next language. Set `@` to priority 190; keep `.` left-associative; use `^` for XOR and `**` for exponentiation; use `->` for function definition; and set `?` to priority 45. DEC-022 resolves the remaining relative-order conflicts and assigns `**` a priority.

**Decision DEC-022 — approved, with the original APPLY placement superseded by DEC-093:** Adopt the following relative precedence for the next language, from tightest to loosest. Each line is a distinct priority level; operators on one line share a level and, under DEC-066, associativity. This uses GenLang's relative ordering to resolve historical conflicts, with the explicit placements below, and makes `**` right-associative. Delimiters group syntax rather than introducing a separate associativity choice or precedence level.

| Relative level (tightest first) | Operators                                                                          | Associativity / notes                                                                                                            |
| ------------------------------- | ---------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| Tightest                        | `@`                                                                                | Non-associative; name-declaration operator.                                                                                      |
|                                 | `.`                                                                                | Left-associative member access; tighter than `->` (DEC-049).                                                                     |
|                                 | `->`                                                                               | Function definition/type arrow; non-associative (DEC-037).                                                                       |
|                                 | implicit `APPLY`                                                                   | Left-associative; between `->` and the prefix/postfix operator level (DEC-093).                                                  |
|                                 | `++` `--` `!` `~`                                                                  | Non-associative; prefix/postfix forms and semantics remain subject to Q-007.                                                     |
|                                 | `**`                                                                               | Right-associative exponentiation; one level tighter than `*`.                                                                    |
|                                 | `*` `/` `%`                                                                        | Left-associative.                                                                                                                |
|                                 | `+` `-`                                                                            | Left-associative.                                                                                                                |
|                                 | `<<` `>>`                                                                          | Left-associative.                                                                                                                |
|                                 | `&`                                                                                | Left-associative bitwise AND.                                                                                                    |
|                                 | `^`                                                                                | Left-associative XOR.                                                                                                            |
|                                 | <code>&#124;</code>                                                                | Left-associative bitwise OR.                                                                                                     |
|                                 | `<` `<=` `>` `>=`                                                                  | Left-associative relational operators.                                                                                           |
|                                 | `==` `!=`                                                                          | Left-associative equality operators.                                                                                             |
|                                 | `&&`                                                                               | Left-associative logical AND.                                                                                                    |
|                                 | <code>&#124;&#124;</code>                                                          | Left-associative logical OR.                                                                                                     |
|                                 | `<-`                                                                               | Non-associative; source describes a channel operation.                                                                           |
|                                 | `?`                                                                                | Right-associative; begins a ternary conditional.                                                                                 |
|                                 | `:` `::`                                                                           | Right-associative; `:` has conditional and binding meanings, while `::` is reserved (DEC-050/052/066).                           |
|                                 | `=` `:=` `::=` `+=` `-=` `*=` `/=` `%=` `&=` <code>&#124;=</code> `^=` `<<=` `>>=` | Assignment/binding operators are right-associative. Binding meanings of `:=` and `::=` require a left `@name` operand (DEC-052). |
|                                 | `,`                                                                                | Left-associative list operator; expressions may be evaluated in parallel (DEC-064).                                              |
| Loosest                         | `;`                                                                                | Left-associative expression sequence; left expression is evaluated before the right (DEC-051/064/066).                           |

The delimiters `(` `)` `{` `}` `[` `]` group syntax and have no operator binding level. For a one-operator-per-row index with ordinal binding levels, see [Operator binding](../operator-binding.md).

**Decision DEC-023 — approved:** Place `::` at the same relative precedence level as `:`, and place `:=` and `::=` at the same level as `=`. These are relative placements only; DEC-052 subsequently clarifies their binding-expression interpretation and required left `@name` operand.

`**` occupies the level immediately above `*`; no numeric priorities are part of this table. `::` remains reserved at the level of `:`. The `:=` variable and `::=` type binding operators from DEC-011/052 are placed with `=` in this relative ordering.

The table adopts GenLang's relative order for bitwise versus comparison operators and `?` versus assignment/`:`, resolving those historical differences for this design. DEC-022 originally placed `APPLY` tighter than `.`, following GenLang; DEC-093 supersedes that placement and puts `APPLY` looser than `->` but tighter than the prefix/postfix level. The placement of reserved `::` and the binding operators is explicitly selected here rather than copied from GenLang. Historical source disagreements remain documented in the project knowledge view. Q-007 tracks operator meanings/forms and remaining binding interactions, not the adopted precedence and associativity table.

**Decision DEC-093 — approved:** Move implicit `APPLY` to a distinct binding level looser than `->` and tighter than the shared `++`, `--`, `!`, `~` level. Keep `APPLY` left-associative. This supersedes DEC-022's original placement of `APPLY` with delimiters above `.`.

### Conditional precedence check

**Analysis, not an additional parser rule:** With `?` tighter than `:` and both right-associative, an ordinary binary-precedence tree has the following shapes (KP-073):

| Source              | Binary-operator grouping  |
| ------------------- | ------------------------- |
| `a ? b : c`         | `(a ? b) : c`             |
| `a ? b : c ? d : e` | `(a ? b) : ((c ? d) : e)` |
| `a ? b ? c : d : e` | `(a ? (b ? c)) : (d : e)` |

The else-branch nesting has the familiar conditional subtree, but the then-branch nesting does not: the usual meaning of the last source is `a ? (b ? c : d) : e`, represented here as `(a ? ((b ? c) : d)) : e`. Explicit parentheses produce that tree. A later semantic pairing or reinterpretation could account for the unparenthesized form, but scalar priorities alone do not produce this familiar then-branch subtree. DEC-056 resolves this: then-branch nesting requires explicit parentheses, and the current priorities are retained (LP-19).

**Analysis of a rejected alternative: `?` and `:` at one priority (KP-074; not adopted, see DEC-056).**

| Source              | Same level, right-associative | Same level, left-associative |
| ------------------- | ----------------------------- | ---------------------------- |
| `a ? b : c`         | `a ? (b : c)`                 | `(a ? b) : c`                |
| `a ? b : c ? d : e` | `a ? (b : (c ? (d : e)))`     | `(((a ? b) : c) ? d) : e`    |
| `a ? b ? c : d : e` | `a ? (b ? (c : (d : e)))`     | `(((a ? b) ? c) : d) : e`    |

Right associativity gives the shape "condition `?` (then `:` else)" and handles else-chains, but then-branch nesting would require `a ? ((b ? (c : d)) : e)`. That needs one `:` to group to its left over another `:` at the same level, which conflicts with right associativity. Left associativity also breaks else-chains, and non-associativity rejects even `a ? b : c`. No scalar priority/associativity assignment produces familiar unparenthesized then-branch nesting, because the middle operand is delimited on both sides like a bracketed subexpression. C, for example, parses it with a separate `? expression :` production. Keeping `?` on the `:` line would also place it at the same level as binding `:` and reserved `::`.

## Declarations and bindings

**Decision DEC-011 — approved, refined by DEC-052:** Adopt the name-first binding model from [LangLLVM's declaration design](/bigdata/KAI/projects/LangLLVM/src/Design:%20Declarations,%20Definitions.md). With the required `@name` left operand, the illustrative forms are:

```text
@NAME :    [TEMPLATEPARAMS] (TYPE | INITEXPR)  // constant
@NAME :=   [TEMPLATEPARAMS] (TYPE | INITEXPR)  // variable
@NAME ::=  [TEMPLATEPARAMS] (TYPE | INITEXPR)  // type
```

In that model, `TYPE` may itself include an initializer expression; the design note also sketches `=` as the initializer marker within a type form. These are sketches, not a complete grammar; the trailing statement terminators from the historical note are not requirements under DEC-051. Template parameters and arguments use square brackets (`NAME[ARGS]`). Braces define blocks/scopes (DEC-063); function expressions use `{ BODY }`, and function types use `(INPARAMS) -> (OUTPARAMS)`.

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

## Tentative semantic specification

**Status: tentative, not an approved supersession or implemented semantics.**
At the user's request on 2026-11-08, the complete contents of
[OtherStuff.md](../../Proposals/OtherStuff.md) are incorporated below as a
starting point for semantic analysis (proposal SEM-001; context KP-122).
Questions and alternatives in the source remain questions, not requirements.
Where these notes repeat approved DEC-015–019 behavior, that existing approval
continues to apply; where they conflict, the approved decisions remain in force
until explicitly superseded. This incorporation does not authorize changing
the parser or implementing a semantic analyzer.

### SEM-001 — Language Design Notes

* Modules are classes
* Packages are collections of modules with one or more interfaces exported to the outside
* Imports reference a configuration file that tells in what directory hierarchy top level identifiers are implemented
  * any identifier not found is either located via compiler-internal info, or must be local
* Source-global names start with package-local package names, then possibly some namespace components (which correspond to source subdirs)
  * Compilation units start with "package &lt;localpkgname&gt;{.namespace};" to give a context, then a sequence of struct defs
* Class vars are actual instance vars of classes?
  * then classes must be derived from a base class, and thus have meta classes that are all members of a meta class class
* as many constructs as possible should be defined as syntactic sugar over a few simpler constructs
* reference types and non-reference (flat) types
  * when flat types get out of context, they are automatically desctructed - reference vars get destructed by garbage collection some time after they are no longer reachable
  * flat type variables always hold the exact declared type, reference type variables a subtype of the declared type
  * parameterizable types have one class object per parameterization
* Class objects are instantiated when they are first needed

* Coroutines have constructor arguments, and control flow switching argument/return value lists
* Functions have argument list and return value list, allowing multi-value returns
  * do we still want ref parameters, especially given that classes are reference types anyway?
* Complex constants (arrays, structs, ...) will have a generic syntax, that produces generic types (approximately equivalent to JSON), that can be assigned to compatible types (via constructor or by element - define how).
  * SHOULD procedures accept a generic blob with an entry per parameter like the above? In fact, should we interpret proc params as an instance of this? (That immediately gives us named parameters.)
  * What is the runtime behaviour if we get that blob from elsewhere, and have overloaded procs? Or should that only work with constants?

* Local functions implemented as function objects?

* Flat types & type constructors:
  * Primitive: integer types, float types, character
  * Constructed: enums (includes bool), subranges, set-of-subranges, array-with-fixed-subrange-index, structs, packed??

* Reference types & type constructors:
  * Primitive: Object
  * Constructed: derived classes (includes Class, Metaclass, methods & instantiations), mixins (not derived from Object, not instantiable on their own), all with and without type parameters (includes all sorts of containers)

* Overloading (only for unqualified identifiers)
  * type parameters count as part of identifier?
  * local identifier hides all identifiers of same spelling in lexical ancestors
  * non-hidden identifiers of same spelling, if more than one, must all be callable
  * for dictionary-style parameters, only matching arguments count
  * if still more than one, parameters with exact argument types; or if none, parameters convertible to argument types
  * if not exactly one, give up

* no implicit cast ops (as in constructor-with-one-arg or operator-type), only explicit (maybe keyword cast instead of operator?)

### SEM-001 compatibility review

The following distinguishes actual contradictions from conditional conflicts,
missing semantic mappings, and compatible extensions. Historical experiment
ideas in [the idea bank](../../Kontext/Wissensstand.md#candidate-semantic-ideas-from-the-experiments)
are alternatives, not additional normative requirements.

#### Parser and source-form cases

| ID | Case | Assessment against the current parser specification |
| --- | --- | --- |
| SEM-P01 | `package <localpkgname>{.namespace};` | **Notation needs interpretation, not a demonstrated conflict.** The earlier package survey supports reading angle brackets and repeated braces as metanotation; this remains an interpretation of the sketch. Concrete `package P.N;` is generic APPLY/member-access/sequencing syntax, with a trailing EMPTY for `;`. Literal `<localpkgname>` would be comparison operators, and literal `{.namespace}` would be a block with an ordinary dot expression, not a parser-recognized repetition or namespace production (DEC-022/063/072/076/093). |
| SEM-P02 | Header followed by a sequence of struct definitions | **Missing mapping; conflict if adjacency/newlines are meant to sequence definitions.** Adjacent definition-shaped expressions receive APPLY, not implicit `;`; newlines are whitespace. The trailing `;` in the header can sequence expressions but is not a mandatory statement terminator. Specify separators or how a definition combination represented by APPLY is interpreted (DEC-008/037/048/051/076). |
| SEM-P03 | Generic JSON-like arrays/struct constants | **Conditional delimiter-role conflict.** The notes do not choose actual JSON syntax. If `{...}` becomes an aggregate literal instead of a scope, or `[...]` an ordinary array literal instead of template syntax, that changes DEC-063/011. Both groups are structurally parsable, but need an explicit semantic rule or supersession. JSON object keys such as `"x": 1` also need a new semantic role for `:`, distinct from its selected binding/conditional roles (DEC-052/072). |
| SEM-P04 | Struct/type definitions and syntactic sugar | **Missing binding mapping, not an automatic contradiction.** The notes provide no concrete definition syntax. If their sugar introduces bindings, explain how it relates to the approved name-first `@name :`, `@name :=`, `@name ::=` model (DEC-011/052). Elaboration over the existing CST is compatible; adding class/struct-specific parser productions would contradict DEC-076. |
| SEM-P05 | A possible `cast` keyword | **Conditional keyword conflict.** A predefined identifier `cast` with semantic meaning is compatible. A reserved lexer keyword or parser-recognized cast production would contradict DEC-012/053/076. The note explicitly leaves keyword versus operator syntax open. |

No unconditional lexical or precedence contradiction is established by these
notes alone. None specifies a replacement operator table, concrete aggregate
syntax, or a separate keyword-token category.

#### Semantic conflicts and unresolved integration

| ID | Case | Assessment against approved decisions or other proposed meanings |
| --- | --- | --- |
| SEM-S01 | Multiple visible same-spelled callables form an overload set | **Direct conflict on the natural automatic-grouping reading.** SEM-001 groups non-hidden same-spelled callables; DEC-018 explicitly says same-name function declarations do not form an overload set and requires a separate explicit overload declaration. Applying the remaining filtering rules only inside an explicitly declared group would reconcile them, but is not stated in SEM-001. |
| SEM-S02 | Overloading only for unqualified identifiers | **New restriction, not a demonstrated contradiction.** DEC-018 does not select an unqualified-only restriction. Define how a qualified reference to an explicitly declared overload group behaves. This also needs reconciliation with the historical function/operator-overloading idea bank, which does not impose this restriction. |
| SEM-S03 | Convertible matches versus “no implicit cast ops” | **Internal ambiguity/conditional conflict.** If a match silently invokes a single-argument constructor or conversion operator, it contradicts the final explicit-casts-only note. Safe compatibility without such an operation could be consistent. Also, “parameters convertible to argument types” states the reverse of the usual argument-to-parameter direction; do not silently correct it. DEC-014/018 require a defined safety/compatibility relation before either reading can be adopted. |
| SEM-S04 | Generic aggregate assigned via constructor or element-wise conversion | **Unchosen alternative.** Define whether this is explicit construction, structural compatibility, or an implicit conversion; the last interpretation may contradict the explicit-casts-only note. Exact flat declared types (DEC-019) do not prohibit constructing a new target-typed value, but do not permit a variable to retain an arbitrary differently typed generic blob. |
| SEM-S05 | Runtime dictionary arguments select overloaded procedures | **Conditional static-typing conflict.** DEC-013 requires static expression/binding types and DEC-018 a unique compatible candidate. A runtime blob with unknown keys/types cannot by itself justify that static selection. A statically typed record, explicit runtime-dispatch facility with defined result typing, or constants-only policy could reconcile the ideas. The source asks the question; it does not approve dynamic typing or dispatch. Named arguments fit DEC-016's logical parameter collection but still need matching rules. |
| SEM-S06 | Configuration/import lookup and lexical hiding | **Compatible direction with missing ordering.** Closest-scope hiding agrees with DEC-018. The configuration fallback must specify where predefined, imported, package and local namespaces enter that hierarchy; “not found ... must be local” must not silently bypass an existing closer binding. Type parameters counting as identifier identity remain a question and must be distinguished from lexical identifier spelling/normalization (DEC-007/024). |
| SEM-S07 | Flat destruction, GC references, escaping function objects, coroutines and continuations | **Lifetime integration gap, not a new contradiction with DEC-019.** Scope-exit flat destruction and GC references already appear in DEC-017/019. DEC-020 also requires proper tail calls and continuations. Define whether suspended/captured scopes remain live, how escaping closures retain flat locals, and when destruction happens after a coroutine return or tail call; do not assume suspension is scope exit or that GC may invalidate captured state. |
| SEM-S08 | Universal class base/metaclass model versus mixins | **Conditional internal conflict; source still asks a question.** If “classes must be derived from a base class” is generalized to all type constructors or specifically to `Object`, it clashes with the stated non-`Object`, non-instantiable mixins. Restricting it to instantiable classes may be consistent. Class variables, metaclass termination, local functions as objects, reference parameters and packed types are unresolved, not newly approved. |

Modules-as-classes, package interfaces, lazy per-parameterization class objects,
the flat/reference categories, and multiple argument/result lists otherwise
agree with DEC-015–019. Coroutines are a possible addition, not a substitute for
DEC-020's proper tail calls and continuations. No semantic choice was made by
this review; these cases identify the decisions needed next.

### SEM-002 — Package manifests

**Decision DEC-094 — approved:** The user approved the package-manifest
proposal on 2026-11-08 (KP-124), following its introduction in KP-123.
Use `package.json` / `subpackage.json` and the fields, recursive child listing,
path resolution, sibling case-insensitive uniqueness, and validation rules
below. Explicitly unresolved details remain open; no implementation is
authorized by this specification approval. SEM-001's broader notes remain
intact; this section refines its package configuration topic without changing
parser syntax, DEC-018's namespace precedence, or DEC-019's module/class model.

#### User-specified package rules

- A package is a collection of source files in a directory. It can contain
  subpackages in subdirectories.
- A well-known JSON manifest at the package tree root supplies its canonical
  URL, all subpackages, the internal names and local filesystem locations of
  imported non-system packages, and the main export-declaration source file.
- Canonical URLs may use `file:`. The special string `"."` means the directory
  in which this manifest was found.
- Subdirectory names match subpackage names as filesystem semantics allow.
  Subpackage names must differ when ignoring case, to avoid filesystem trouble.
- A program's main export-declaration file should export `main`.
- Each subpackage has a similar manifest in its own root, but no canonical URL
  and no import list. Its location and imports come from its containing package.
  Subpackage exports are package-local unless re-exported.
- Filename/path values use syntax appropriate to the path portion of a `file:`
  URL, not native platform-specific path spelling.

#### Manifest names and fields

Use **`package.json`** at the package root and **`subpackage.json`** at each
subpackage root. Distinct names make the two roles explicit. These describe
source-language packages, not npm packages; no manifest is being added to the
compiler repository root, whose existing package.json is npm configuration.

| Field | Root package | Subpackage | Meaning |
| --- | --- | --- | --- |
| `canonicalUrl` | Required string | Forbidden | Absolute canonical directory URL, or `"."`. It identifies the package; local imports still locate source through `imports`. It is not an instruction to download anything. |
| `subpackages` | Required string array | Required string array | Immediate child subpackage names; empty array for a leaf. The complete tree is listed recursively by its manifests, not discovered from arbitrary unlisted directories. |
| `imports` | Required object | Forbidden | Map of internal/local package identifiers to directory paths containing the imported package's `package.json`. Empty object if none; omit system packages. |
| `exportFile` | Required string | Required string | Path to the main export-declaration source file, relative to this manifest's directory. It is source code, not a list of exported names in JSON. |

Each `subpackages` list is the complete list of immediate children.
Recursive traversal yields all descendants without repeating the entire tree
in every ancestor. The earlier flat-root-list alternative in KP-123 is not
selected by approval of this proposal.

Root example:

```json
{
  "canonicalUrl": "https://example.org/packages/demo/",
  "subpackages": ["text", "math"],
  "imports": {
    "collections": "../collections",
    "graphics": "/opt/language/graphics"
  },
  "exportFile": "exports.nl"
}
```

Subpackage example, in `text/subpackage.json`:

```json
{
  "subpackages": ["format"],
  "exportFile": "exports.nl"
}
```

Leaf example, in `text/format/subpackage.json`:

```json
{
  "subpackages": [],
  "exportFile": "exports.nl"
}
```

`exports.nl` is illustrative, not a new decision about source extensions.
For a local-only root, use `"canonicalUrl": "."`, or an absolute directory URL
such as `"file:///home/example/demo/"`. The physical tree in the examples is:

```text
demo/
  package.json
  exports.nl
  text/
    subpackage.json
    exports.nl
    format/
      subpackage.json
      exports.nl
  math/
    subpackage.json
    exports.nl
```

#### Name and path resolution

- Resolve relative import paths against the **root package manifest directory**,
  never a subpackage directory or the process working directory. Subpackages
  share this resolved map rather than re-resolving its relative strings.
- Resolve `exportFile` against the directory of the manifest that contains it.
  It must be a nonempty relative path to an existing file within that
  directory tree, not an absolute or escaping path.
- Use `/` separators and UTF-8 percent encoding for path characters needing
  escaping: `../shared%20tools` denotes `../shared tools`. These fields contain
  URL **paths**, not complete `file:` URLs, query strings, or fragments.
  Literal `?`, `#`, and `%` in filenames use `%3F`, `%23`, and `%25`.
  Decode escapes once; malformed escapes are errors, not literal fallbacks.
- Absolute local paths may use `/opt/library` or the file-URL path form
  `/C:/Libraries/library` on Windows, not `C:\Libraries\library`. UNC authority
  representation, symlinks, and platform-specific filename limitations still
  need a precise policy; do not infer them from URL path spelling alone.
- Each `subpackages` entry is a logical language identifier, not an arbitrary
  path. Its directory is the corresponding single filename component using
  the same URL-path escaping when needed. No separators, `.`/`..` traversal,
  or alternate directory alias is proposed for an entry.
- Require case-insensitive uniqueness **among siblings**, not across unrelated
  parents: `text` and `Text` cannot coexist under one parent, while
  `text/util` and `math/util` may. Language lookup remains case-sensitive
  (DEC-024); this is a portability constraint on declarations.
- Propose Unicode 18 full default case folding of NFKC identifier lookup keys
  for the sibling collision check, independent of host locale. The exact
  case-insensitive comparison rule still needs approval. Also diagnose any
  distinct names that the actual filesystem cannot represent distinctly;
  case folding alone cannot guarantee portability to every filesystem.

#### Exports, validation, and remaining scope

The root's `exportFile` defines its external interface. A subpackage's
`exportFile` defines its interface inside the enclosing top-level package;
listing the subpackage does **not** automatically export it outside that
package. External exposure requires a re-export through the root interface.
The syntax and transitive behavior of re-export declarations remain open.
For a program, the user asks that this interface export `main`; its signature,
program/library classification and whether absence is an error remain open.
No separate JSON `main` or `exports` field is proposed.

Require explicit diagnostics for malformed JSON, duplicate JSON keys, unknown
fields, wrong field types, forbidden subpackage fields, duplicate/colliding
names, missing listed manifests/export files, and unresolved import paths.
Never silently scan a replacement directory, select a colliding name, or
substitute a different export file.

Canonical identity equivalence, source-file discovery/extensions, import
cycles, version selection, system-package discovery, nested subpackage export
visibility, and filesystem alias/symlink containment remain open. JSON metadata
does not introduce parser keywords, determine source-level package headers, or
replace semantic namespace lookup.

#### Manifest editing and package retrieval

**Requirement REQ-006 — approved:** Provide a small tool, or equivalent
functionality within the compiler, to manipulate package and subpackage JSON
manifests. Its purpose is to make correct editing easier and prevent manifest
problems before they occur, rather than relying only on later compiler errors.
Editing must respect DEC-094's field, name, path and validation rules.

The tool must also support downloading a package from its URL. Merely reading
a manifest or compiling a package does not imply downloading; retrieval is
an explicitly supported tool operation. This extends the tooling scope, not
the local-path meaning of `imports` or the package's export visibility.

**Deferred by the user:** Specify URL/provider-specific retrieval rules when
implementing and testing the tool. GitHub retrieval may differ from access to
an SVN repository over SSH; these are examples, not a selected transport
protocol or exhaustive support list. URL interpretation, revisions, checkout
layout, authentication, destination handling, and the behavior of `file:` and
`"."` during retrieval remain undefined until that work. Do not infer a
universal HTTP download rule from `canonicalUrl`.

Standalone versus compiler-integrated packaging, commands/UI, and detailed
editing workflow remain open. No tool implementation or network operation is
requested at this stage.

## Questions to resolve before parser implementation

The decisions above establish design direction, but not a complete grammar. DEC-037 selects the full language as the first parser's target; its applicable syntax and output contract still require the work below. These questions block their affected components or a complete full-scope parser, not necessarily every independent implementation step. Some describe observable language behavior; others are representation or recovery choices that can be made during implementation if they preserve the approved requirements. No implementation has been authorized by this selection.

### Scope and general parser blockers

1. **Parser scope and language — selected:** Target the full selected language (DEC-037) in TypeScript (DEC-054). Binding expressions and predefined identifiers use the generic operator/operand model (DEC-052/053); missing semantic forms do not automatically require separate parser productions. Independent parser components can be developed before all questions below are settled.
2. **Delimiter behavior — selected:** DEC-072 makes every delimiter group an operand containing an operator tree with an interior loosest-operator boundary. Empty groups contain one `EMPTY`; nesting follows the same rule. Delimiters must match; an open group at EOF is diagnosed and a closer inserted. Unexpected closers become error tokens (DEC-081), and empty files are `EMPTY` (DEC-080). Concrete CST layout and inserted-closer spans are implementation choices (DEC-088, Q-015). Empty or trailing operator operands follow ordinary insertion; semantic legality remains separate.
3. **Operator forms and reserved `::` — selected:** Prefix/postfix forms use ordinary operator parsing; semantics interprets their `EMPTY` arguments (DEC-073). `::` parses normally but has no valid operands and is diagnosed semantically (DEC-074). Existing priorities, associativities, DEC-065's treatment of `a * -b`, and DEC-056's parentheses for conditional then-branch nesting remain unchanged.
4. **Lexical candidate boundaries — selected; exact numeric candidate grammar remains to be specified:** DEC-067/071/089 select longest candidate matching followed by validation, with a unified numeric candidate. DEC-077 makes incomplete numeric prefixes and line-interrupted ordinary literals single error operands. DEC-083 makes touching identifiers/numbers one error operand, which settles `123é`. DEC-084 extends unterminated block comments and raw strings to EOF. DEC-085 makes fallback error runs minimal (`a §  b` → error `§`). Comments act as whitespace (DEC-075).
   - **Numeric candidate matching — selected (DEC-089):** Match integers and floats, including suffixes, as one candidate, then classify and validate it. This avoids separate integer/float candidate ties. Exact candidate shape remains to be specified, preserving `1e3`, `16#1e2`, `0x1p0`, and DEC-047's `#` rules.
   - Token classes otherwise have distinct starting characters, so cross-class equal-length ties do not arise; equal-length operator matches have the same spelling.
   - Lexical significand/exponent length limits remain a separate policy question (Q-014).
5. **CST and empty input — selected; representation is implementation work:** DEC-069 selects a binary operator/operand CST plus comments, with no AST in the first parser. Empty, whitespace/BOM-only, and comment-only files are one `EMPTY` (DEC-080). Operand/group/error node layouts, comment attachment, trivia storage, and exposure of original spelling and BOM are representation choices made during implementation, provided they preserve the agreed observable requirements (Q-015).
6. **Source mappings — postponed to implementation:** DEC-082 removes whole-source normalization, so token and node spans map through global Unicode translation alone, and normalized identifier/literal forms are token-level values. Spans of implicit/inserted elements and diagnostic positions inside NFC-normalized literals are implementation choices (DEC-088, LP-23), within DEC-036/046's conventions.
7. **Error handling — selected:** DEC-078 defines Unicode error characters. DEC-079/087 collapse error tokens that are adjacent in the token stream regardless of whitespace or comments. DEC-086 makes an operator-classified error bind tightest and left-associatively. DEC-081 makes the closer that does not match the innermost opener an error token, so `([a)]` yields error `)` and an inserted `)` at EOF. DEC-038 requires a lossless CST even for invalid input.

### Language-form coverage

8. **Additional structural syntax — not required:** DEC-076 confirms that all syntax fits the operator/operand model. Remaining source-form meanings for types, functions, templates, namespaces, packages, imports, and the object model are semantic questions (Q-009/010/012), not additional parser-production blockers.

### Can be deferred beyond parsing

Precise type-inference and safety proofs, reference identity and lifetime optimization, overload resolution, object-model runtime semantics, and continuation implementation details need not block a syntax-only parser. They must be resolved before implementing the corresponding semantic/runtime phases. DEC-076 requires their source forms to fit the selected operator/operand syntax rather than introducing additional parser productions.
