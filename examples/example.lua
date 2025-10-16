---@class Person
---@field name string
---@field age number

---@class Student : Person
---@field grade number
---@field school string

---@param name string
---@param age number
---@return Person
function createPerson(name, age)
    return {
        name = name,
        age = age
    }
end

---@generic T
---@param list T[]
---@return T
function first(list)
    return list[1]
end

---@type string | number
local myVar

---@type fun(name: string, age: number): Person
local personFactory

---@type table<string, number>
local scoreMap

---@alias ID string | number

---@enum Color
local Color = {
    Red = 1,
    Green = 2,
    Blue = 3
}

---@deprecated
function oldFunction()
end

---@private
function privateFunction()
end

---@async
function fetchData()
end

---@cast myVar string

---@nodiscard
function mustUse()
    return "important"
end
