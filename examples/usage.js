// 使用示例：如何在 Node.js 中使用这个 tree-sitter 解析器

const Parser = require('tree-sitter');
const EmmyLuaDoc = require('../bindings/node');

// 创建解析器实例
const parser = new Parser();
parser.setLanguage(EmmyLuaDoc);

// 要解析的 EmmyLua 文档注释
const sourceCode = `@class Person
@field name string
@field age number

@param name string
@param age number
@return Person`;

// 解析代码
const tree = parser.parse(sourceCode);

// 打印语法树
console.log(tree.rootNode.toString());

// 遍历节点
function traverse(node, depth = 0) {
    const indent = '  '.repeat(depth);
    console.log(`${indent}${node.type}: "${node.text}"`);
    
    for (let i = 0; i < node.childCount; i++) {
        traverse(node.child(i), depth + 1);
    }
}

console.log('\n遍历语法树:');
traverse(tree.rootNode);

// 查询特定节点
const classNodes = tree.rootNode.descendantsOfType('class_annotation');
console.log(`\n找到 ${classNodes.length} 个 @class 注解`);

classNodes.forEach(node => {
    const nameNode = node.childForFieldName('name');
    if (nameNode) {
        console.log(`  类名: ${nameNode.text}`);
    }
});
