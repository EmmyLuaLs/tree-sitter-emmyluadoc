; Highlights query for EmmyLuaDoc
; Syntax highlighting query file

; ============================================
; Comment Prefix
; ============================================

(comment_prefix) @comment

; ============================================
; Annotation Keywords
; ============================================

; 使用匿名节点匹配注解标记
"@class" @keyword
"@field" @keyword
"@type" @keyword
"@param" @keyword
"@return" @keyword
"@generic" @keyword
"@vararg" @keyword
"@overload" @keyword
"@see" @keyword
"@alias" @keyword
"@enum" @keyword
"@module" @keyword
"@cast" @keyword
"@version" @keyword
"@diagnostic" @keyword
"@operator" @keyword

; Special annotation nodes (these text nodes without @ prefix)
(deprecated_annotation) @keyword
(private_annotation) @keyword
(protected_annotation) @keyword
(public_annotation) @keyword
(package_annotation) @keyword
(async_annotation) @keyword
(nodiscard_annotation) @keyword
(meta_annotation) @keyword

; ============================================
; Type Keywords
; ============================================

[
  "fun"
  "table"
] @keyword.type

; ============================================
; Basic Types
; ============================================

((identifier) @type.builtin
  (#match? @type.builtin "^(string|number|integer|boolean|table|function|thread|userdata|nil|any|unknown|self)$"))

; Custom types
(basic_type
  (identifier) @type)

; ============================================
; Class Definitions
; ============================================

(class_annotation
  name: (identifier) @type.definition)

(class_annotation
  parent: (type_list
    (type
      (primary_type
        (basic_type
          (identifier) @type)))))

; Class modifiers
(class_annotation
  [
    "exact"
    "partial"
    "constructor"
  ] @keyword.modifier)

; Brackets
(class_annotation
  "(" @punctuation.bracket
  ")" @punctuation.bracket)

; ============================================
; Fields and Parameters
; ============================================

(field_annotation
  name: (field_name) @variable.member)

(param_annotation
  name: (param_name) @variable.parameter)

(return_value
  name: (identifier)? @variable.parameter)

(param_def
  name: (identifier) @variable.parameter)

; ============================================
; Generics
; ============================================

(generic_annotation
  name: (identifier) @type.parameter)

(generic_type
  base: (identifier) @type)

; ============================================
; Aliases and Enums
; ============================================

(alias_annotation
  name: (identifier) @type.definition)

(enum_annotation
  name: (identifier) @type.definition)

; Enum modifiers
(enum_annotation
  "key" @keyword.modifier)

; Brackets
(enum_annotation
  "(" @punctuation.bracket
  ")" @punctuation.bracket)

; ============================================
; Visibility Modifiers
; ============================================

[
  "public"
  "private"
  "protected"
  "package"
] @keyword.modifier

; ============================================
; Operators
; ============================================

[
  "call"
  "add" "sub" "mul" "div" "mod" "pow"
  "concat"
  "len"
  "eq" "lt" "le"
  "unm"
  "bnot" "band" "bor" "bxor" "shl" "shr"
] @operator

; ============================================
; Literals
; ============================================

(string) @string

(number) @number

(boolean) @boolean

; ============================================
; Punctuation
; ============================================

[
  ":"
  "|"
  ","
  "?"
] @punctuation.delimiter

; | in type continuation
(type_continuation
  "|" @punctuation.delimiter)

; Description in type continuation
(continuation_description) @comment

[
  "("
  ")"
  "["
  "]"
  "<"
  ">"
] @punctuation.bracket

; ============================================
; Tuple Types
; ============================================

; Tuple brackets
(tuple_type
  "[" @punctuation.bracket
  "]" @punctuation.bracket)

; Commas in tuple elements
(tuple_elements
  "," @punctuation.delimiter)

; ============================================
; References and Diagnostics
; ============================================

(see_annotation
  reference: (identifier) @variable)

(diagnostic_annotation
  action: [
    "disable"
    "enable"
    "disable-next-line"
    "disable-line"
  ] @keyword.directive)

(diagnostic_list
  (identifier) @constant)

; ============================================
; Module Names
; ============================================

(module_annotation
  name: (string) @module)

; ============================================
; Version
; ============================================

(version_annotation
  version: [
    (identifier) @constant
    (string) @string
  ])

; ============================================
; Array Type Markers
; ============================================

(array_type
  "[" @punctuation.bracket
  "]" @punctuation.bracket)

; ============================================
; Function Types
; ============================================

(function_type
  "fun" @keyword.function
  ":" @punctuation.delimiter)

; ============================================
; Table Types
; ============================================

(table_type
  "table" @type.builtin)

; Table Literal Types
(table_literal_type
  "{" @punctuation.bracket
  "}" @punctuation.bracket)

; Named fields
(table_field
  name: (identifier) @property
  ":" @punctuation.delimiter
  type: (type_list
    (type
      (primary_type
        (basic_type
          (identifier) @type)))))

; Index fields
(table_field
  "[" @punctuation.bracket
  "]" @punctuation.bracket
  ":" @punctuation.delimiter)

; Commas in table fields
(table_literal_type
  "," @punctuation.delimiter)

; ============================================
; Generic Parameters
; ============================================

; Generic parameter definitions for @class and @alias
(generic_params
  "<" @punctuation.bracket
  ">" @punctuation.bracket)

(generic_params
  params: (identifier) @type.parameter)

; ============================================
; nil Literal
; ============================================

"nil" @constant.builtin
