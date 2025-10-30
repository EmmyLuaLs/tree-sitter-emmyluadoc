-- 这是一个测试语言注入的 Lua 文件

---@class Person
---@field name string 姓名
---@field age number 年龄
---@field email string? 邮箱（可选）

---@class Student : Person
---@field studentId string 学号
---@field grade number 年级

---@type string
--- | number
--- | boolean
local mixed_value

---@param name string 学生姓名
---@param age number 学生年龄
---@return Student 返回学生对象
--- | nil 如果创建失败返回 nil
function createStudent(name, age)
    return {
        name = name,
        age = age,
        studentId = "S" .. math.random(10000, 99999),
        grade = 1
    }
end

---@generic T
---@param arr T[] 输入数组
---@param predicate fun(item: T): boolean 判断函数
---@return T[] 过滤后的数组
function filter(arr, predicate)
    local result = {}
    for _, item in ipairs(arr) do
        if predicate(item) then
            table.insert(result, item)
        end
    end
    return result
end

---@alias StringOrNumber string | number

---@type StringOrNumber
local value = "hello"

---@enum Color
local Color = {
    RED = 1,
    GREEN = 2,
    BLUE = 3
}

-- 测试不同的注释前缀
---@class Teacher (triple dash)
--@class Manager (double dash)


---@type table<string, Person>
local people = {}

---@param id string | number
---@return Person
--- | nil
function findPerson(id)
    return people[tostring(id)]
end
