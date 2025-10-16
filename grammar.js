module.exports = grammar({
  name: 'emmyluadoc',

  extras: $ => [
    /\s/
  ],

  rules: {
    // 文档的根规则
    source: $ => repeat(choice(
      $.annotation,
      $.type_continuation
    )),

    // 可选的 Lua 注释前缀
    comment_prefix: $ => token(prec(-1, /-{1,3}[ \t]*/)),

    // 注解
    annotation: $ => seq(
      optional($.comment_prefix),
      choice(
        $.class_annotation,
        $.field_annotation,
        $.type_annotation,
        $.param_annotation,
        $.return_annotation,
        $.generic_annotation,
        $.vararg_annotation,
        $.overload_annotation,
        $.deprecated_annotation,
        $.see_annotation,
        $.alias_annotation,
        $.enum_annotation,
        $.module_annotation,
        $.private_annotation,
        $.protected_annotation,
        $.public_annotation,
        $.package_annotation,
        $.async_annotation,
        $.cast_annotation,
        $.nodiscard_annotation,
        $.meta_annotation,
        $.version_annotation,
        $.diagnostic_annotation,
        $.operator_annotation,
      )
    ),

    // 类型续行 (--- | <type>)
    type_continuation: $ => seq(
      $.comment_prefix,
      '|',
      field('type', $.type_list)
    ),

    // @class 注解
    class_annotation: $ => seq(
      '@class',
      field('name', $.identifier),
      optional(seq(':', field('parent', $.type_list)))
    ),

    // @field 注解
    field_annotation: $ => seq(
      '@field',
      optional(field('visibility', choice('public', 'private', 'protected', 'package'))),
      field('name', $.identifier),
      optional(field('type', $.type_annotation_value))
    ),

    // @type 注解
    type_annotation: $ => seq(
      '@type',
      field('type', $.type_annotation_value)
    ),

    // @param 注解
    param_annotation: $ => seq(
      '@param',
      field('name', $.identifier),
      optional(field('type', $.type_annotation_value)),
      optional(field('nullable', '?'))
    ),

    // @return 注解
    return_annotation: $ => seq(
      '@return',
      field('type', $.type_annotation_value),
      optional(field('name', $.identifier))
    ),

    // @generic 注解
    generic_annotation: $ => seq(
      '@generic',
      field('name', $.identifier),
      optional(seq(':', field('constraint', $.type_annotation_value)))
    ),

    // @vararg 注解
    vararg_annotation: $ => seq(
      '@vararg',
      field('type', $.type_annotation_value)
    ),

    // @overload 注解
    overload_annotation: $ => seq(
      '@overload',
      field('signature', $.function_type)
    ),

    // @deprecated 注解
    deprecated_annotation: $ => '@deprecated',

    // @see 注解
    see_annotation: $ => seq(
      '@see',
      field('reference', $.identifier)
    ),

    // @alias 注解
    alias_annotation: $ => seq(
      '@alias',
      field('name', $.identifier),
      field('type', $.type_annotation_value)
    ),

    // @enum 注解
    enum_annotation: $ => seq(
      '@enum',
      field('name', $.identifier)
    ),

    // @module 注解
    module_annotation: $ => seq(
      '@module',
      field('name', $.string)
    ),

    // @private 注解
    private_annotation: $ => '@private',

    // @protected 注解
    protected_annotation: $ => '@protected',

    // @public 注解
    public_annotation: $ => '@public',

    // @package 注解
    package_annotation: $ => '@package',

    // @async 注解
    async_annotation: $ => '@async',

    // @cast 注解
    cast_annotation: $ => seq(
      '@cast',
      field('name', $.identifier),
      field('type', $.type_annotation_value)
    ),

    // @nodiscard 注解
    nodiscard_annotation: $ => '@nodiscard',

    // @meta 注解
    meta_annotation: $ => '@meta',

    // @version 注解
    version_annotation: $ => seq(
      '@version',
      field('version', choice($.identifier, $.string))
    ),

    // @diagnostic 注解
    diagnostic_annotation: $ => seq(
      '@diagnostic',
      field('action', choice('disable', 'enable', 'disable-next-line', 'disable-line')),
      optional(seq(':', field('diagnostics', $.diagnostic_list)))
    ),

    // @operator 注解
    operator_annotation: $ => seq(
      '@operator',
      field('op', $.operator),
      optional(seq('(', field('type', $.type_annotation_value), ')')),
      optional(seq(':', field('return_type', $.type_annotation_value)))
    ),

    // 类型注解值
    type_annotation_value: $ => $.type_list,

    // 类型列表
    type_list: $ => prec.left(1, seq(
      $.type,
      repeat(prec.left(1, seq('|', $.type)))
    )),

    // 类型
    type: $ => prec.left(choice(
      $.array_type,
      $.primary_type
    )),

    // 主要类型（不包括数组）
    primary_type: $ => choice(
      $.basic_type,
      $.table_type,
      $.function_type,
      $.generic_type,
      $.literal_type,
      $.parenthesized_type
    ),

    // 基础类型
    basic_type: $ => $.identifier,

    // 数组类型
    array_type: $ => prec(1, seq(
      field('element', $.primary_type),
      '[',
      ']'
    )),

    // 表类型
    table_type: $ => seq(
      'table',
      optional(seq(
        '<',
        field('key', $.type),
        ',',
        field('value', $.type),
        '>'
      ))
    ),

    // 函数类型
    function_type: $ => seq(
      'fun',
      '(',
      optional(field('params', $.param_list)),
      ')',
      optional(seq(':', field('return', $.type_list)))
    ),

    // 参数列表
    param_list: $ => seq(
      $.param_def,
      repeat(seq(',', $.param_def))
    ),

    // 参数定义
    param_def: $ => seq(
      field('name', $.identifier),
      optional(seq(':', field('type', $.type))),
      optional('?')
    ),

    // 泛型类型
    generic_type: $ => seq(
      field('base', $.identifier),
      '<',
      field('params', $.type_list),
      '>'
    ),

    // 字面量类型
    literal_type: $ => choice(
      $.string,
      $.number,
      $.boolean
    ),

    // 括号类型
    parenthesized_type: $ => seq(
      '(',
      $.type,
      ')'
    ),

    // 诊断列表
    diagnostic_list: $ => seq(
      $.identifier,
      repeat(seq(',', $.identifier))
    ),

    // 操作符
    operator: $ => choice(
      'call',
      'add', 'sub', 'mul', 'div', 'mod', 'pow',
      'concat',
      'len',
      'eq', 'lt', 'le',
      'unm',
      'bnot', 'band', 'bor', 'bxor', 'shl', 'shr'
    ),

    // 标识符
    identifier: $ => /[a-zA-Z_][a-zA-Z0-9_\.]*/,

    // 字符串
    string: $ => choice(
      seq('"', /[^"]*/, '"'),
      seq("'", /[^']*/, "'")
    ),

    // 数字
    number: $ => /\d+(\.\d+)?/,

    // 布尔值
    boolean: $ => choice('true', 'false'),

    // 描述（匹配到行尾，但不贪婪吃掉所有内容）
    description: $ => /[^\n\r]+/
  }
});
