//! Example usage of tree-sitter-emmyluadoc Rust bindings

use tree_sitter::Parser;

fn main() {
    // Get the language
    let language = tree_sitter_emmyluadoc::language();
    
    // Create a parser
    let mut parser = Parser::new();
    parser.set_language(language).expect("Error loading EmmyLuaDoc grammar");
    
    // Parse some code
    let source_code = r#"@class Person
@field name string
@field age number

@param name string
@param age number
@return Person"#;
    
    let tree = parser.parse(source_code, None).unwrap();
    let root_node = tree.root_node();
    
    // Print the syntax tree
    println!("Syntax Tree:");
    println!("{}", root_node.to_sexp());
    
    // Walk the tree
    println!("\nTree Structure:");
    walk_tree(root_node, source_code.as_bytes(), 0);
    
    // Query for specific nodes
    println!("\nFound classes:");
    find_classes(root_node, source_code);
}

fn walk_tree(node: tree_sitter::Node, source: &[u8], depth: usize) {
    let indent = "  ".repeat(depth);
    let text = node.utf8_text(source).unwrap_or("");
    let text_preview = if text.len() > 50 {
        format!("{}...", &text[..50])
    } else {
        text.to_string()
    };
    println!("{}{}: {}", indent, node.kind(), text_preview);
    
    let mut cursor = node.walk();
    for child in node.children(&mut cursor) {
        walk_tree(child, source, depth + 1);
    }
}

fn find_classes(node: tree_sitter::Node, source: &str) {
    let mut cursor = node.walk();
    
    fn visit_node(cursor: &mut tree_sitter::TreeCursor, source: &str) {
        let node = cursor.node();
        if node.kind() == "class_annotation" {
            if let Some(name_node) = node.child_by_field_name("name") {
                let class_name = name_node.utf8_text(source.as_bytes()).unwrap();
                println!("  - {}", class_name);
            }
        }
        
        if cursor.goto_first_child() {
            visit_node(cursor, source);
            while cursor.goto_next_sibling() {
                visit_node(cursor, source);
            }
            cursor.goto_parent();
        }
    }
    
    visit_node(&mut cursor, source);
}
