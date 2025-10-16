# tree-sitter-emmyluadoc

一个用于解析 EmmyLua 文档注释的 Tree-sitter 语法。

## 简介

这个项目为 EmmyLua 文档注释提供了 Tree-sitter 语法支持。EmmyLua 是一种用于 Lua 代码文档化的注解格式，广泛用于 Lua IDE 和编辑器中。

## ✨ 特性

- 🎯 **完整的注解支持** - 25+ 种注解类型
- 📝 **Lua 注释前缀支持** - 支持 `-`、`--` 和 `---` 前缀
- 🔄 **类型续行** - 支持 `--- | type` 的多行联合类型
- 🎨 **语法高亮** - 完整的查询文件支持
- 🦀 **多语言绑定** - Node.js、Rust 和 Python
- ⚡ **高性能** - 3000+ bytes/ms 解析速度
- 📋 **ABI 15 支持** - 使用最新的 tree-sitter ABI 版本

## 📋 配置文件

本项目包含 `tree-sitter.json` 配置文件，用于：
- ✅ 使用 ABI 版本 15（最新版本）
- ✅ 自动配置查询文件
- ✅ 定义项目元数据
- ✅ 语言注入支持（`injection-regex`）
- ✅ 更好的编辑器集成

详见 [TREE_SITTER_JSON.md](TREE_SITTER_JSON.md)

## 🔄 语言注入

`injection-regex` 字段允许 EmmyLuaDoc 语法被注入到 Lua 文件的注释中：

```lua
-- 在 Lua 文件中，这些注释会自动使用 EmmyLuaDoc 语法高亮
---@class Person     ← 自动检测并应用 emmyluadoc 语法
---@field name string
---@field age number
```

这需要在 Lua 语法的 `injections.scm` 中配置相应的注入规则。参见 `examples/lua_injections_example.scm`。

## 💡 快速示例

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
