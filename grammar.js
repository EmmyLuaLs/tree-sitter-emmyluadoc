module.exports = grammar({
  name: 'emmyluadoc',

  externals: $ => [
    $.text_line
  ],

  extras: $ => [
    /\s/
  ],

  word: $ => $.identifier,

  rules: {
    // Root rule of the document
    source: $ => repeat(choice(
      $.text_line,
      $.annotation,
      $.type_continuation
    )),

    // Plain text line (handled by external scanner)
    // Matches lines that don't start with valid annotation patterns

    // Lua comment prefix
    comment_prefix: $ => token(prec(-1, /-{1,3}[ \t]*/)),

    // Annotation
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

    // Type continuation (--- | <type>)
    type_continuation: $ => seq(
      $.comment_prefix,
      '|',
      field('type', $.type_list),
      optional(field('description', $.continuation_description))
    ),

    // Continuation description (starts with #)
    continuation_description: $ => token(seq(
      '#',
      /[^\n\r]*/
    )),

    // @class annotation
    class_annotation: $ => seq(
      '@class',
      optional(field('modifier', choice(
        seq('(', 'exact', ')'),
        seq('(', 'partial', ')'),
        seq('(', 'constructor', ')')
      ))),
      field('name', $.identifier),
      optional(field('generics', $.generic_params)),
      optional(seq(':', field('parent', $.type_list)))
    ),

    // Generic parameter list (for class and alias)
    generic_params: $ => seq(
      '<',
      field('params', seq(
        $.identifier,
        repeat(seq(',', $.identifier))
      )),
      '>'
    ),

    // @field annotation
    field_annotation: $ => seq(
      '@field',
      optional(field('visibility', choice('public', 'private', 'protected', 'package'))),
      choice(
        // Named field: [access] name[?] type [description]
        seq(
          field('name', $.field_name),
          field('type', $.type_annotation_value),
          optional(field('description', $.description))
        ),
        // Index signature: [access] [key_type] value_type [description]
        seq(
          '[',
          field('key_type', $.type),
          ']',
          field('value_type', $.type),
          optional(field('description', $.description))
        )
      )
    ),

    // Field name (can have optional marker, supports hyphens and dots)
    field_name: $ => token(seq(
      /[a-zA-Z_][a-zA-Z0-9_\.\-]*/,
      optional('?')
    )),

    // @type annotation
    type_annotation: $ => seq(
      '@type',
      field('type', $.type_annotation_value)
    ),

    // @param annotation
    param_annotation: $ => seq(
      '@param',
      field('name', $.param_name),
      field('type', $.type_annotation_value),
      optional(field('description', $.description))
    ),

    // Parameter name (can have optional marker or vararg marker, supports hyphens and dots)
    param_name: $ => token(choice(
      seq(/[a-zA-Z_][a-zA-Z0-9_\.\-]*/, optional('?')),
      '...'
    )),

    // @return annotation
    return_annotation: $ => seq(
      '@return',
      $.return_value,
      repeat(seq(',', $.return_value))
    ),

    // Return value definition
    return_value: $ => seq(
      field('type', $.return_type_annotation),
      optional(field('name', $.identifier)),
      optional(field('description', $.description))
    ),

    // @generic annotation
    generic_annotation: $ => seq(
      '@generic',
      field('name', $.identifier),
      optional(seq(':', field('constraint', $.type_annotation_value)))
    ),

    // @vararg annotation
    vararg_annotation: $ => seq(
      '@vararg',
      field('type', $.type_annotation_value)
    ),

    // @overload annotation
    overload_annotation: $ => seq(
      '@overload',
      field('signature', $.function_type)
    ),

    // @deprecated annotation
    deprecated_annotation: $ => seq(
      '@deprecated',
      optional(field('description', $.description))
    ),

    // @see annotation
    see_annotation: $ => seq(
      '@see',
      field('reference', $.identifier),
      optional(field('description', $.description))
    ),

    // @alias annotation
    alias_annotation: $ => seq(
      '@alias',
      field('name', $.identifier),
      optional(field('generics', $.generic_params)),
      field('type', $.type_annotation_value)
    ),

    // @enum annotation
    enum_annotation: $ => seq(
      '@enum',
      optional(field('modifier', seq('(', 'key', ')'))),
      field('name', $.identifier)
    ),

    // @module annotation
    module_annotation: $ => seq(
      '@module',
      field('name', $.string)
    ),

    // @private annotation
    private_annotation: $ => '@private',

    // @protected annotation
    protected_annotation: $ => '@protected',

    // @public annotation
    public_annotation: $ => '@public',

    // @package annotation
    package_annotation: $ => '@package',

    // @async annotation
    async_annotation: $ => '@async',

    // @cast annotation
    cast_annotation: $ => seq(
      '@cast',
      field('name', $.identifier),
      field('type', $.type_annotation_value)
    ),

    // @nodiscard annotation
    nodiscard_annotation: $ => '@nodiscard',

    // @meta annotation
    meta_annotation: $ => '@meta',

    // @version annotation
    version_annotation: $ => seq(
      '@version',
      field('version', choice($.identifier, $.string, $.version_range)),
      optional(field('description', $.description))
    ),

    // Version range (e.g. >=5.1, <5.4)
    version_range: $ => token(seq(
      choice('>', '<', '>=', '<='),
      /\d+(\.\d+)*/
    )),

    // @diagnostic annotation
    diagnostic_annotation: $ => seq(
      '@diagnostic',
      field('action', choice('disable', 'enable', 'disable-next-line', 'disable-line')),
      optional(seq(':', field('diagnostics', $.diagnostic_list)))
    ),

    // @operator annotation
    operator_annotation: $ => seq(
      '@operator',
      '(',
      field('op', $.operator),
      ')',
      optional(seq(':', field('return_type', $.type_annotation_value)))
    ),

    // @source annotation
    source_annotation: $ => seq(
      '@source',
      field('source', $.string)
    ),

    // Type annotation value
    type_annotation_value: $ => $.type_list,

    // Return type annotation value
    return_type_annotation: $ => $.type_list,

    // Parameter type annotation value
    param_type_annotation: $ => $.type_list,

    // Type list
    type_list: $ => prec.left(1, seq(
      $.type,
      repeat(prec.left(1, seq('|', $.type)))
    )),

    // Type
    type: $ => prec.left(choice(
      $.array_type,
      $.primary_type
    )),

    // Primary type (excluding arrays)
    primary_type: $ => choice(
      $.basic_type,
      $.table_type,
      $.table_literal_type,
      $.function_type,
      $.generic_type,
      $.literal_type,
      $.parenthesized_type,
      $.tuple_type
    ),

    // Basic type
    basic_type: $ => $.identifier,

    // Array type
    array_type: $ => prec(1, seq(
      field('element', $.primary_type),
      '[',
      ']'
    )),

    // Table type
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

    // Table literal type { field: type, ... }
    table_literal_type: $ => seq(
      '{',
      optional(seq(
        $.table_field,
        repeat(seq(',', $.table_field)),
        optional(',')
      )),
      '}'
    ),

    // Table field definition
    table_field: $ => choice(
      // Named field: name: type
      seq(
        field('name', $.identifier),
        ':',
        field('type', $.type_list)
      ),
      // Index field: [key]: type
      seq(
        '[',
        field('key', $.type_list),
        ']',
        ':',
        field('type', $.type_list)
      )
    ),

    // Function type
    function_type: $ => seq(
      'fun',
      '(',
      optional(field('params', $.param_list)),
      ')',
      optional(seq(':', field('return', $.type_list)))
    ),

    // Parameter list
    param_list: $ => seq(
      $.param_def,
      repeat(seq(',', $.param_def))
    ),

    // Parameter definition
    param_def: $ => seq(
      field('name', $.identifier),
      optional(seq(':', field('type', $.type))),
      optional('?')
    ),

    // Generic type
    generic_type: $ => seq(
      field('base', $.identifier),
      '<',
      field('params', $.generic_params_types),
      '>'
    ),

    // Generic parameter type list (comma-separated)
    generic_params_types: $ => seq(
      $.type,
      repeat(seq(',', $.type))
    ),

    // Literal type
    literal_type: $ => choice(
      $.string,
      $.number,
      $.boolean,
      'nil'
    ),

    // Parenthesized type (supports union types)
    parenthesized_type: $ => seq(
      '(',
      $.type_list,
      ')'
    ),

    // Tuple type
    tuple_type: $ => seq(
      '[',
      field('elements', $.tuple_elements),
      ']'
    ),

    // Tuple element list
    tuple_elements: $ => seq(
      $.type_list,
      repeat(seq(',', $.type_list)),
      optional(',')  // Support trailing comma
    ),

    // Diagnostic list
    diagnostic_list: $ => seq(
      $.identifier,
      repeat(seq(',', $.identifier))
    ),

    // Operator
    operator: $ => choice(
      'call',
      'add', 'sub', 'mul', 'div', 'mod', 'pow',
      'concat',
      'len',
      'eq', 'lt', 'le',
      'unm',
      'bnot', 'band', 'bor', 'bxor', 'shl', 'shr'
    ),

    // Identifier (supports letters, numbers, underscores, dots and hyphens)
    identifier: $ => /[a-zA-Z_][a-zA-Z0-9_\.\-]*/,

    // String
    string: $ => choice(
      seq('"', /[^"]*/, '"'),
      seq("'", /[^']*/, "'")
    ),

    // Number
    number: $ => /\d+(\.\d+)?/,

    // Boolean
    boolean: $ => choice('true', 'false'),

    // Description (must be on the same line, preceded by space, cannot start with | or ,)
    description: $ => token(prec(-1, seq(
      /[ \t]+/,  // Must have at least one space/tab before description
      /[^|\n\r,][^\n\r]*/
    )))
  }
});
