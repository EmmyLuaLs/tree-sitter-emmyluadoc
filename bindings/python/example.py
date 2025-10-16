#!/usr/bin/env python3
"""
Example usage of tree-sitter-emmyluadoc Python bindings
"""

import tree_sitter_emmyluadoc
from tree_sitter import Language, Parser

# Get the language
EMMYLUADOC_LANGUAGE = Language(tree_sitter_emmyluadoc.language())

# Create a parser
parser = Parser(EMMYLUADOC_LANGUAGE)

# Parse some code
source_code = b"""@class Person
@field name string
@field age number

@param name string
@param age number
@return Person"""

tree = parser.parse(source_code)

# Print the syntax tree
print("Syntax Tree:")
print(tree.root_node.sexp())

# Walk the tree
def walk_tree(node, depth=0):
    indent = "  " * depth
    print(f"{indent}{node.type}: {node.text.decode('utf8')[:50]}")
    for child in node.children:
        walk_tree(child, depth + 1)

print("\nTree Structure:")
walk_tree(tree.root_node)

# Query for specific nodes
def find_classes(tree):
    classes = []
    cursor = tree.walk()
    
    def visit_node(cursor):
        node = cursor.node
        if node.type == 'class_annotation':
            name_node = node.child_by_field_name('name')
            if name_node:
                classes.append(name_node.text.decode('utf8'))
        
        if cursor.goto_first_child():
            visit_node(cursor)
            while cursor.goto_next_sibling():
                visit_node(cursor)
            cursor.goto_parent()
    
    visit_node(cursor)
    return classes

classes = find_classes(tree)
print(f"\nFound classes: {classes}")
