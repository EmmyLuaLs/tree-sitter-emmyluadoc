; Lua 语言的注入查询示例
; 这个文件应该放在 Lua 语法的 queries/injections.scm 中
; 用于将 EmmyLuaDoc 语法注入到 Lua 注释中

; 匹配 Lua 的注释并注入 EmmyLuaDoc 语法
((comment) @injection.content
  (#match? @injection.content "^%-%-%-?@")
  (#set! injection.language "emmyluadoc"))

; 匹配多行注释块中的 EmmyLua 注解
((comment) @injection.content
  (#lua-match? @injection.content "^%-%-%-*%s*@")
  (#set! injection.language "emmyluadoc"))
