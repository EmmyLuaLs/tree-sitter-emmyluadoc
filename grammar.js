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
        $.source_annotation,
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
      optional(field('modifier', choice(
        seq('(', 'exact', ')'),
        seq('(', 'partial', ')')
      ))),
      field('name', $.identifier),
      optional(seq(':', field('parent', $.type_list)))
    ),

    // @field 注解
    field_annotation: $ => seq(
      '@field',
      optional(field('visibility', choice('public', 'private', 'protected', 'package'))),
      choice(
        // 命名字段: [access] name[?] type [description]
        seq(
          field('name', $.field_name),
          field('type', $.type_annotation_value),
          optional(field('description', $.description))
        ),
        // 索引签名: [access] [key_type] value_type [description]
        seq(
          '[',
          field('key_type', $.type),
          ']',
          field('value_type', $.type),
          optional(field('description', $.description))
        )
      )
    ),

    // 字段名（可以带可选标记）
    field_name: $ => token(seq(
      /[a-zA-Z_][a-zA-Z0-9_]*/,
      optional('?')
    )),

    // @type 注解
    type_annotation: $ => seq(
      '@type',
      field('type', $.type_annotation_value)
    ),

    // @param 注解
    param_annotation: $ => seq(
      '@param',
      field('name', $.param_name),
      field('type', $.type_annotation_value),
      optional(field('description', $.description))
    ),

    // 参数名（可以带可选标记或变参标记）
    param_name: $ => token(choice(
      seq(/[a-zA-Z_][a-zA-Z0-9_]*/, optional('?')),
      '...'
    )),

    // @return 注解
    return_annotation: $ => seq(
      '@return',
      field('type', $.type_annotation_value),
      optional(field('name', $.identifier)),
      optional(field('description', $.description))
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
    deprecated_annotation: $ => seq(
      '@deprecated',
      optional(field('description', $.description))
    ),

    // @see 注解
    see_annotation: $ => seq(
      '@see',
      field('reference', $.identifier),
      optional(field('description', $.description))
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
      field('version', choice($.identifier, $.string, $.version_range)),
      optional(field('description', $.description))
    ),

    // 版本范围（如 >=5.1, <5.4）
    version_range: $ => token(seq(
      choice('>', '<', '>=', '<='),
      /\d+(\.\d+)*/
    )),

    // @diagnostic 注解
    diagnostic_annotation: $ => seq(
      '@diagnostic',
      field('action', choice('disable', 'enable', 'disable-next-line', 'disable-line')),
      optional(seq(':', field('diagnostics', $.diagnostic_list)))
    ),

    // @operator 注解
    operator_annotation: $ => seq(
      '@operator',
      '(',
      field('op', $.operator),
      ')',
      optional(seq(':', field('return_type', $.type_annotation_value)))
    ),

    // @source 注解
    source_annotation: $ => seq(
      '@source',
      field('source', $.string)
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

    // 描述（必须在同一行，至少包含一个非空白字符）
    description: $ => token(seq(
      /[ \t]+/,  // 至少一个空格或制表符
      /[^\n\r]+/  // 然后是非换行的内容
    ))
  }
});
