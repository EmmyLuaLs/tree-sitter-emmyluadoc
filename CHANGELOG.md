# Changelog

All notable changes to tree-sitter-emmyluadoc will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.2.0] - 2025-10-16

### ✨ Added
- **Lua comment prefix support**: Can now parse annotations with `-`, `--`, or `---` prefixes
  - `---@class Person` ✓
  - `--@class Person` ✓
  - `-@class Person` ✓
  - `@class Person` ✓ (still works)
- **Type continuation**: Support multi-line union types with `--- | type` syntax
  - Example: `---@type string\n--- | number\n--- | nil`
  - Works with `@type`, `@param`, `@return`, `@field`, etc.
- New `comment_prefix` node in syntax tree
- New `type_continuation` node for multi-line types
- 6 new test cases in `test/corpus/lua_comments.txt`
- Complete example in `examples/lua_example.lua`
- Documentation: `LUA_COMMENTS_FEATURE.md`

### 🎨 Changed
- Updated `grammar.js` to support new syntax
- Enhanced `queries/highlights.scm` to highlight comment prefixes
- Updated all documentation to reflect new features

### 📊 Tests
- All 20 tests passing (14 original + 6 new)
- 100% success rate
- Parse speed: 3040 bytes/ms average

## [0.1.0] - 2025-10-16

### ✨ Added
- Initial release
- Complete EmmyLua annotation support (25+ types)
- Type system support:
  - Basic types: `string`, `number`, `boolean`, etc.
  - Array types: `string[]`
  - Union types: `string | number`
  - Function types: `fun(name: string): Person`
  - Generic types: `List<string>`
  - Table types: `table<string, number>`
- Syntax highlighting queries:
  - `queries/highlights.scm` - 197 lines
  - `queries/locals.scm` - Scope analysis
  - `queries/tags.scm` - Symbol tagging
  - `queries/injections.scm` - Language injections
- Multi-language bindings:
  - Node.js (native module)
  - Rust (crate)
  - Python (extension)
- 14 comprehensive test cases
- Complete documentation:
  - `README.md` - Main documentation
  - `BINDINGS.md` - Language bindings guide
  - `HIGHLIGHTS.md` - Syntax highlighting guide
  - `PROJECT_STATUS.md` - Project overview
  - `RUST_BINDING_TEST_REPORT.md` - Rust testing report
  - `HIGHLIGHTS_TEST_REPORT.md` - Highlighting tests

### 🎯 Supported Annotations
- Class system: `@class`, `@field`
- Type system: `@type`, `@alias`, `@enum`
- Functions: `@param`, `@return`, `@generic`, `@vararg`, `@overload`
- Access control: `@private`, `@protected`, `@public`, `@package`
- Metadata: `@deprecated`, `@see`, `@module`, `@async`, `@cast`, `@nodiscard`, `@meta`, `@version`
- Diagnostics: `@diagnostic`
- Operators: `@operator`

### 📊 Test Results
- 14/14 tests passing
- 100% annotation coverage
- Average parse speed: 2174 bytes/ms

### 🔧 Build System
- Tree-sitter generation
- Node.js native binding (node-gyp)
- Rust crate with cc
- Python setuptools with extension
- Cargo build system
- npm scripts

---

## Version Details

### [0.2.0] - Lua Comments & Type Continuation
**Release Date**: 2025-10-16  
**Focus**: Enhanced Lua integration  
**Status**: ✅ Stable  
**Breaking Changes**: None (fully backward compatible)

**Key Features**:
- 🔥 Lua comment prefix support
- 🔄 Multi-line type continuation
- 📝 Improved documentation
- ✅ More test coverage

### [0.1.0] - Initial Release
**Release Date**: 2025-10-16  
**Focus**: Core functionality  
**Status**: ✅ Stable  
**Breaking Changes**: N/A (initial release)

**Key Features**:
- 🎯 Complete EmmyLua support
- 🎨 Syntax highlighting
- 🦀 Multi-language bindings
- 📚 Comprehensive documentation

---

## Migration Guide

### From 0.1.0 to 0.2.0

**No breaking changes!** All existing code continues to work.

**Optional Updates**:

If you want to use the new features:

1. **Add Lua comment prefixes** (optional):
   ```lua
   # Before (still works)
   @class Person
   @field name string
   
   # After (optional, more Lua-like)
   ---@class Person
   ---@field name string
   ```

2. **Use type continuation** (optional):
   ```lua
   # Before (still works)
   @type string | number | boolean
   
   # After (optional, more readable)
   @type string
   --- | number
   --- | boolean
   ```

3. **Update grammar** if you're using tree-sitter directly:
   ```bash
   npm install tree-sitter-emmyluadoc@0.2.0
   # or
   cargo update tree-sitter-emmyluadoc
   ```

4. **Regenerate if building from source**:
   ```bash
   npx tree-sitter generate
   npm run build
   ```

---

## Upcoming Features

### v0.3.0 (Planned)
- [ ] Support for inline comments: `@type string -- this is a comment`
- [ ] Multi-line descriptions
- [ ] `@see` reference validation
- [ ] Enhanced error recovery
- [ ] Performance optimizations

### v0.4.0 (Planned)
- [ ] LSP integration helpers
- [ ] Code action support
- [ ] Auto-completion data
- [ ] Documentation generation

### Future Ideas
- [ ] Custom annotation support
- [ ] Annotation validation
- [ ] Type checking integration
- [ ] VS Code extension

---

## Links

- **Repository**: https://github.com/EmmyLuaLs/tree-sitter-emmyluadoc
- **Issues**: https://github.com/EmmyLuaLs/tree-sitter-emmyluadoc/issues
- **Releases**: https://github.com/EmmyLuaLs/tree-sitter-emmyluadoc/releases

---

## Contributors

Thanks to all contributors!

---

**Last Updated**: 2025-10-16
