# EmmyLua 文档解析器增强功能

基于 [emmylua-analyzer-rust](https://github.com/EmmyLuaLs/emmylua-analyzer-rust/tree/main/crates/emmylua_parser/src/grammar/doc) 的参考,我为 tree-sitter-emmyluadoc 添加了以下增强功能:

## 新增注解类型

### 1. `@interface` 支持
- 与 `@class` 类似,但用于定义接口
- 语法: `---@interface IShape`

### 2. `@namespace` 注解
- 用于组织代码和类型定义的命名空间
- 语法: `---@namespace math.vector`
- 支持描述字段

### 3. `@using` 注解
- 导入外部模块或命名空间
- 语法: `---@using "external.module"` 或 `---@using module.name`

### 4. `@readonly` 注解
- 标记字段为只读
- 语法: `---@readonly`

### 5. `@export` 注解
- 标记导出的类型或函数
- 语法: `---@export`

### 6. `@language` 注解
- 指定语言版本或方言
- 语法: `---@language lua 5.4`

### 7. `@attribute` 注解(定义)
- 定义自定义属性
- 语法: `---@attribute deprecated(message: string)`
- 支持参数列表,参数可以有类型注解

### 8. `@[...]` 属性使用
- 将属性附加到其他注解
- 语法: `---@[deprecated, readonly]`
- 支持带参数的属性: `---@[validate(min=0, max=100)]`

### 9. `@as` 注解
- 类型转换/断言
- 语法: `---@as Vector2`

## 增强的枚举支持

### 枚举字段定义
```lua
---@enum Status : string
---| "pending"
---| "active"
---| "completed"
```

- 支持字符串字面量
- 支持数字字面量
- 支持标识符
- 每个枚举字段可以有描述

## 高级类型系统

### 1. 异步函数类型
```lua
---@type async fun(url: string): Promise
```

### 2. 一元类型操作符
- `keyof`: 获取类型的所有键
  ```lua
  ---@type keyof MyClass
  ```
- `typeof`: 获取表达式的类型
  ```lua
  ---@type typeof(myVariable)
  ```

### 3. 二元类型操作符
- `&`: 交叉类型(intersection)
  ```lua
  ---@type TypeA & TypeB
  ```
- `extends`: 类型约束
  ```lua
  ---@generic T extends BaseClass
  ```
- `in`: 成员测试
  ```lua
  ---@type K in keyof MyClass
  ```

### 4. 条件类型
```lua
---@type condition and TrueType or FalseType
```

### 5. 模板字符串类型
```lua
---@type `literal ${Type} literal`
```

### 6. 增强的操作符支持
- 支持 `@operator` 带参数列表
  ```lua
  ---@operator(add)(other: Vector): Vector
  ```
- 新增 `index` 操作符(用于 `__index` 元方法)

## 改进的现有功能

### 1. `@vararg` 支持描述
```lua
---@vararg any Additional arguments
```

### 2. `@operator` 增强
- 支持参数列表
- 支持返回类型注解

### 3. 枚举类型增强
- 支持基础类型声明: `---@enum Color : string`
- 支持枚举字段列表

## 语法改进

### 1. 类型继续行(Type Continuation)
- 独立的枚举字段继续行节点
- 与类型联合继续行分离

### 2. 描述支持
- 多个注解现在更好地支持描述字段
- 改进的空白符处理

### 3. 冲突解决
- 解决了类型列表与二元类型之间的冲突
- 优化了优先级设置

## 高亮查询增强

在 `queries/highlights.scm` 中添加了对所有新功能的支持:
- 新注解关键字
- 类型操作符
- 属性语法
- 枚举字段
- 模板类型

## 测试覆盖

在 `test/corpus/new_features.txt` 中添加了测试用例:
- ✅ Interface 注解
- ✅ 枚举字段
- ✅ 异步函数类型
- ✅ 命名空间
- ✅ Using 声明
- ✅ 只读标记
- ✅ As 类型断言
- ✅ 属性定义和使用
- ✅ Keyof 操作符
- ✅ Vararg 描述
- ✅ 操作符参数
- ✅ 语言声明
- ✅ 导出标记

## 与 Rust 版本的对齐

此实现基于以下 Rust 源文件:
- `tag.rs`: 注解标签解析
- `types.rs`: 类型系统
- `test.rs`: 测试用例参考

主要对齐的特性:
- 完整的注解类型支持
- 高级类型系统(一元、二元、条件类型)
- 属性系统
- 枚举字段定义
- 操作符重载支持

## 使用示例

### 完整的类定义
```lua
---@namespace geometry

---@[readonly]
---@class Vector2
---@field public x number
---@field public y number

---@operator(add)(other: Vector2): Vector2
---@operator(mul)(scalar: number): Vector2
function Vector2:new(x, y) end
```

### 高级类型定义
```lua
---@alias EventHandler<T> async fun(event: T): boolean | nil

---@generic K extends keyof MyClass
---@param key K
---@return typeof(MyClass[K])
function getProperty(key) end
```

### 枚举定义
```lua
---@enum HttpStatus : number
---| 200  # OK
---| 404  # Not Found
---| 500  # Internal Server Error
```

## 后续改进方向

1. **完善描述解析**: 一些复杂场景下的描述解析还需要优化
2. **属性参数验证**: 添加对属性参数的类型检查
3. **模板类型扩展**: 完善模板字符串类型的插值语法
4. **文档生成**: 基于增强的AST生成文档
5. **LSP集成**: 为编辑器提供更好的语法支持

## 参考资料

- [EmmyLua Analyzer (Rust)](https://github.com/EmmyLuaLs/emmylua-analyzer-rust)
- [EmmyLua 注解文档](https://github.com/EmmyLuaLs/emmylua-analyzer-rust/tree/main/docs/emmylua_doc/annotations_EN)
- [Tree-sitter 文档](https://tree-sitter.github.io/tree-sitter/)
