# tree-sitter-emmyluadoc

A Tree-sitter grammar for parsing EmmyLua documentation comments.

## Overview

This project provides Tree-sitter grammar support for EmmyLua documentation comments. EmmyLua is an annotation format for documenting Lua code, widely used in Lua IDEs and editors.

## ✨ Features

- 🎯 **Complete annotation support** - 25+ annotation types
- 📝 **Lua comment prefix support** - Works with `-`, `--`, and `---` prefixes
- 🔄 **Type continuation** - Multi-line union types with `--- | type`
- 🎨 **Syntax highlighting** - Full query support for highlighting
- 🦀 **Multi-language bindings** - Node.js, Rust, and Python
- ⚡ **High performance** - 3000+ bytes/ms parsing speed

## 💡 Quick Examples

### Basic Annotations
```lua
---@class Person
---@field name string
---@field age number

---@param name string
---@param age number
---@return Person
function createPerson(name, age)
end
```

### Type Continuation (NEW!)
```lua
---@type string
--- | number
--- | boolean
--- | nil
local value

---@param id string
--- | number
---@return Person
--- | nil
function findPerson(id)
end
```

### Lua Comment Prefixes (NEW!)
```lua
--- Triple dash (recommended)
---@class Person

-- Double dash
--@class Student

- Single dash
-@class Teacher

# No prefix (still supported)
@class Admin
```

## Supported annotations

- `@class` - define a class
- `@field` - define a field
- `@type` - define a variable type
- `@param` - define a function parameter
- `@return` - define a return value
- `@generic` - define generic type parameters
- `@vararg` - define variadic parameters
- `@overload` - define function overloads
- `@deprecated` - mark as deprecated
- `@see` - reference
- `@alias` - type alias
- `@enum` - enum definition
- `@module` - module definition
- `@private` / `@protected` / `@public` / `@package` - access modifiers
- `@async` - async function marker
- `@cast` - type cast
- `@nodiscard` - non-discardable return value
- `@meta` - metadata marker
- `@version` - version information
- `@diagnostic` - diagnostic control
- `@operator` - operator overload

## Installation

```bash
npm install
```

## Build

```bash
npm run build
```

## Test

```bash
npm test
```

## Examples

### @class annotation
```lua
---@class Person
---@field name string
---@field age number
```

### @param and @return annotations
```lua
---@param name string The person's name
---@param age number The person's age
---@return Person The newly created person object
function createPerson(name, age)
end
```

### @generic annotation
```lua
---@generic T
---@param list T[]
---@return T
function first(list)
end
```

### @overload annotation
```lua
---@overload fun(name: string): Person
---@overload fun(name: string, age: number): Person
function createPerson(...)
end
```

## Development

1. Edit the `grammar.js` file to update grammar rules
2. Run `tree-sitter generate` to generate the parser
3. Run `tree-sitter test` to run tests

## License

MIT
