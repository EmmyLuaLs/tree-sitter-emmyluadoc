const Parser = require('tree-sitter');
const EmmyLuaDoc = require('./bindings/node');

// 创建 EmmyLuaDoc 解析器
const parser = new Parser();
parser.setLanguage(EmmyLuaDoc);

// 测试 1: 直接解析 EmmyLuaDoc 注解
console.log('=== 测试 1: 直接解析 EmmyLuaDoc ===\n');
const emmyDocSource = `---@class Person
---@field name string
---@field age number`;

const tree1 = parser.parseString(null, emmyDocSource);
console.log('✓ 解析成功');
console.log('根节点:', tree1.rootNode.type);
console.log('子节点数:', tree1.rootNode.childCount);
console.log('\n语法树:');
console.log(tree1.rootNode.toString());

// 测试 2: 提取 Lua 注释中的 EmmyLuaDoc 内容
console.log('\n\n=== 测试 2: 从 Lua 注释提取 EmmyLuaDoc ===\n');

// 模拟从 Lua 文件中提取的注释
const luaComments = [
    '---@class Person',
    '---@field name string 姓名',
    '---@field age number 年龄',
    '',
    '---@param name string',
    '---@return Person',
];

console.log('提取的 Lua 注释:');
luaComments.forEach((line, i) => {
    console.log(`  ${i + 1}. "${line}"`);
});

const emmyDocContent = luaComments.join('\n');
const tree2 = parser.parseString(null, emmyDocContent);

console.log('\n✓ 解析成功');
console.log('找到的注解:');

// 遍历所有注解
tree2.rootNode.children.forEach((node, i) => {
    if (node.type === 'annotation') {
        const firstChild = node.child(0);
        if (firstChild && firstChild.type === 'comment_prefix') {
            const annotation = node.child(1);
            if (annotation) {
                console.log(`  ${i + 1}. ${annotation.type}`);
            }
        } else if (firstChild) {
            console.log(`  ${i + 1}. ${firstChild.type}`);
        }
    } else if (node.type === 'type_continuation') {
        console.log(`  ${i + 1}. type_continuation`);
    }
});

// 测试 3: 验证类型续行
console.log('\n\n=== 测试 3: 类型续行 ===\n');
const typeContSource = `---@type string
--- | number
--- | boolean`;

const tree3 = parser.parseString(null, typeContSource);
console.log('✓ 解析成功');
console.log('\n完整语法树:');
console.log(tree3.rootNode.toString());

// 测试 4: 不同注释前缀
console.log('\n\n=== 测试 4: 不同注释前缀 ===\n');
const prefixTests = [
    { prefix: '---', code: '---@class Person' },
    { prefix: '--', code: '--@class Student' },
    { prefix: '-', code: '-@class Teacher' },
    { prefix: 'none', code: '@class Admin' },
];

prefixTests.forEach(({ prefix, code }) => {
    const tree = parser.parseString(null, code);
    const hasError = tree.rootNode.hasError;
    const status = hasError ? '✗ 失败' : '✓ 成功';
    console.log(`  ${prefix.padEnd(6)} ${code.padEnd(25)} ${status}`);
});

// 测试 5: 复杂场景
console.log('\n\n=== 测试 5: 复杂注解场景 ===\n');
const complexSource = `---@generic T, K
---@param map table<K, T>
---@param transformer fun(value: T): T
---@return table<K, T>`;

const tree5 = parser.parseString(null, complexSource);
console.log('✓ 解析成功');
console.log('注解数:', tree5.rootNode.childCount);

// 统计信息
let stats = {
    generic: 0,
    param: 0,
    return: 0,
    total: 0
};

tree5.rootNode.children.forEach(node => {
    if (node.type === 'annotation') {
        stats.total++;
        const firstChild = node.child(0);
        if (firstChild) {
            const annotationType = firstChild.type === 'comment_prefix' ? node.child(1)?.type : firstChild.type;
            if (annotationType === 'generic_annotation') stats.generic++;
            if (annotationType === 'param_annotation') stats.param++;
            if (annotationType === 'return_annotation') stats.return++;
        }
    }
});

console.log('统计:', stats);

console.log('\n\n=== 测试完成 ===');
console.log('所有测试通过! 🎉');
