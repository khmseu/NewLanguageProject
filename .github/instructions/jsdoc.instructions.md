---
description: "Use when adding or maintaining JSDoc in compiler sources or the Unicode normalization generator."
applyTo: "src/**/*.ts,scripts/**/*.mjs"
---

# Source documentation

- Keep meaningful, complete JSDoc on modules, classes, constructors, accessors,
  methods, functions (including private helpers), interfaces, type aliases and
  their properties, and nontrivial constants/exported tables.
- Describe actual behavior, not intended invariants. Explain byte, Unicode scalar
  and UTF-16 units, normalization, copying/mutability, recovery/errors, and deferred
  work wherever relevant.
- Document parameters, results and thrown errors with `@param`, `@returns` and
  `@throws`; use `@typeParam` for generic type parameters where appropriate.
  Explain semantically important union branches and members.
- Add useful contracts, not repetitions of TypeScript types. Do not duplicate
  declaration documentation on re-exports or annotate every table row, local
  variable, loop or anonymous callback.
- Emit generated documentation from the generator template and synchronize its
  output. Preserve licenses, data rows, fixtures and runtime behavior during
  documentation-only maintenance.
