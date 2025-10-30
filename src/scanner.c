#include "tree_sitter/parser.h"
#include <wctype.h>
#include <stdbool.h>

enum TokenType {
  TEXT_LINE,
  DESCRIPTION,
};

void *tree_sitter_emmyluadoc_external_scanner_create() { return NULL; }

void tree_sitter_emmyluadoc_external_scanner_destroy(void *payload) {}

unsigned tree_sitter_emmyluadoc_external_scanner_serialize(void *payload, char *buffer) { return 0; }

void tree_sitter_emmyluadoc_external_scanner_deserialize(void *payload, const char *buffer, unsigned length) {}

static bool scan_text_line(TSLexer *lexer) {
  // First, skip any leading newlines to get to the start of a line
  while (lexer->lookahead == '\n' || lexer->lookahead == '\r') {
    lexer->advance(lexer, true);
  }

  // After skipping newlines, we should be at column 0 (start of a line).
  // If not at column 0, we're in the middle of a line -> not a text_line
  if (lexer->get_column(lexer) != 0) {
    return false;
  }

  // Now skip horizontal whitespace
  while (lexer->lookahead == ' ' || lexer->lookahead == '\t') {
    lexer->advance(lexer, true);
  }

  // If EOF -> not a text_line
  if (lexer->lookahead == 0) return false;

  // If another newline (empty line) -> not a text_line
  if (lexer->lookahead == '\n' || lexer->lookahead == '\r') return false;

  // Case 1: Starts with @ directly (e.g., "@class MyClass")
  // According to new rules, @ without --- prefix should be treated as text_line
  if (lexer->lookahead == '@') {
    // Consume the entire line as text_line
    while (lexer->lookahead != '\n' && lexer->lookahead != '\r' && lexer->lookahead != 0) {
      lexer->advance(lexer, false);
    }
    lexer->result_symbol = TEXT_LINE;
    lexer->mark_end(lexer);
    return true;
  }
  
  // Case 2: Starts with dash sequence (comment-like) e.g. ---something
  if (lexer->lookahead == '-') {
    int dash_count = 0;
    // Count the dashes
    while (lexer->lookahead == '-') {
      dash_count++;
      lexer->advance(lexer, true);
    }

    // Skip horizontal whitespace after dashes
    while (lexer->lookahead == ' ' || lexer->lookahead == '\t') lexer->advance(lexer, true);

    // If exactly 3 dashes followed by @ or @[ -> this is an annotation, not text_line
    if (dash_count == 3 && lexer->lookahead == '@') return false;
    
    // If exactly 3 dashes followed by | -> this is a type continuation, not text_line
    if (dash_count == 3 && lexer->lookahead == '|') return false;

    // Otherwise consume to end of line and return TEXT_LINE
    while (lexer->lookahead != '\n' && lexer->lookahead != '\r' && lexer->lookahead != 0) {
      lexer->advance(lexer, true);
    }
    lexer->mark_end(lexer);
    lexer->result_symbol = TEXT_LINE;
    return true;
  }
  
  // Case 3: Regular text line (doesn't start with - or @)
  // Consume the entire line
  while (lexer->lookahead != '\n' && lexer->lookahead != '\r' && lexer->lookahead != 0) {
    lexer->advance(lexer, false);
  }
  
  lexer->result_symbol = TEXT_LINE;
  lexer->mark_end(lexer);
  return true;
}

static bool scan_description(TSLexer *lexer) {
  // Description starts with at least one space/tab
  if (lexer->lookahead != ' ' && lexer->lookahead != '\t') {
    return false;
  }
  
  // Skip leading whitespace
  while (lexer->lookahead == ' ' || lexer->lookahead == '\t') {
    lexer->advance(lexer, false);
  }
  
  // If we hit EOF or newline immediately, no description
  if (lexer->lookahead == 0 || lexer->lookahead == '\n' || lexer->lookahead == '\r') {
    return false;
  }
  
  // Description cannot start with | or ,
  if (lexer->lookahead == '|' || lexer->lookahead == ',') {
    return false;
  }
  
  // Strategy: Description is multi-word text OR starts with uppercase letter OR starts with # or @
  // This allows single-word lowercase names to be matched by identifier first
  
  // Check first character
  bool starts_with_uppercase = (lexer->lookahead >= 'A' && lexer->lookahead <= 'Z');
  bool starts_with_special = (lexer->lookahead == '#' || lexer->lookahead == '@');
  
  // Scan the line to check if it contains multiple words
  bool found_space_in_content = false;
  bool has_comma = false;
  
  while (lexer->lookahead != '\n' && lexer->lookahead != '\r' && lexer->lookahead != 0) {
    if (lexer->lookahead == ',') {
      has_comma = true;
      break;
    }
    
    // Check for space within content
    if (lexer->lookahead == ' ' || lexer->lookahead == '\t') {
      // Skip spaces
      while ((lexer->lookahead == ' ' || lexer->lookahead == '\t') && 
             lexer->lookahead != '\n' && lexer->lookahead != '\r' && 
             lexer->lookahead != 0) {
        lexer->advance(lexer, false);
      }
      
      // If there's content after the space(s), we have multiple words
      if (lexer->lookahead != '\n' && lexer->lookahead != '\r' && 
          lexer->lookahead != 0 && lexer->lookahead != ',') {
        found_space_in_content = true;
        // Continue consuming to end of line
        while (lexer->lookahead != '\n' && lexer->lookahead != '\r' && 
               lexer->lookahead != 0) {
          lexer->advance(lexer, false);
        }
        break;
      } else {
        // Space at end of line, just whitespace
        break;
      }
    } else {
      lexer->advance(lexer, false);
    }
  }
  
  // Don't match if there's a comma (part of a list)
  if (has_comma) {
    return false;
  }
  
  // Match description if:
  // 1. It has multiple words, OR
  // 2. It's a single word starting with uppercase (likely a sentence), OR
  // 3. It starts with # or @ (special markers)
  if (found_space_in_content || starts_with_uppercase || starts_with_special) {
    lexer->mark_end(lexer);
    lexer->result_symbol = DESCRIPTION;
    return true;
  }
  
  // Single lowercase word - let identifier match it as name
  return false;
}

bool tree_sitter_emmyluadoc_external_scanner_scan(void *payload, TSLexer *lexer, const bool *valid_symbols) {
  if (valid_symbols[DESCRIPTION]) {
    return scan_description(lexer);
  }
  
  if (valid_symbols[TEXT_LINE]) {
    return scan_text_line(lexer);
  }
  
  return false;
}
