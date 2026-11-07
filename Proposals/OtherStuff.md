# Language Design Notes

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
