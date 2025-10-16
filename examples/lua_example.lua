-- EmmyLua 文档注释示例 - 支持 Lua 注释前缀

--- 定义一个 Person 类
---@class Person
---@field name string 人的名字
---@field age number 人的年龄

--- 定义学生类，继承自 Person
---@class Student : Person
---@field grade number 年级
---@field school string 学校名称

--- 创建一个人对象
---@param name string 人的名字
---@param age number 人的年龄
---@return Person 新创建的人对象
function createPerson(name, age)
    return {
        name = name,
        age = age
    }
end

--- 联合类型示例（使用类型续行）
---@type string
--- | number
--- | boolean
--- | nil
local mixedValue

--- 参数支持多种类型
---@param id string
--- | number
--- | nil
---@return boolean
function validateId(id)
    return id ~= nil
end

--- 返回值支持多种类型
---@return Person
--- | Student
--- | nil 可能返回空
function findPerson(name)
    -- 实现代码
end

--- 复杂的表类型
---@type table<string, number>
--- | table<string, string>
--- | table<number, Person>
local complexTable

--- 函数类型续行
---@type fun(x: number): string
--- | fun(x: string): number
--- | fun(x: boolean): nil
local converter

-- 单破折号也支持
-@class Animal
-@field species string

-- 双破折号也支持
--@class Plant
--@field type string

--- 泛型示例
---@generic T
---@param list T[]
---@return T
--- | nil
function first(list)
    return list[1]
end

--- 字段支持续行类型
---@class Config
---@field mode "development"
--- | "production"
--- | "test"
---@field port number
--- | string

--- 私有字段
---@class Database
---@field private connection any
---@field public host string
---@field protected port number

--- 类型别名
---@alias ID string
--- | number

--- 枚举类型
---@enum Status
local Status = {
    PENDING = 1,
    SUCCESS = 2,
    FAILED = 3
}

--- 重载函数
---@overload fun(name: string): Person
---@overload fun(name: string, age: number): Person
---@overload fun(data: table): Person
function createPersonOverloaded(...)
    -- 实现代码
end

--- 异步函数
---@async
---@param url string
---@return string
--- | nil
function fetchData(url)
    -- 异步实现
end

--- 诊断控制
---@diagnostic disable-next-line: undefined-global
local globalVar = unknownFunction()

--- 操作符重载
---@class Vector
---@field x number
---@field y number
---@operator add(Vector): Vector
---@operator mul(number): Vector
