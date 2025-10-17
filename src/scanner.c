#include "tree_sitter/parser.h"
#include <wctype.h>
#include <stdbool.h>

enum TokenType {
  TEXT_LINE,
};

void *tree_sitter_emmyluadoc_external_scanner_create() { return NULL; }

void tree_sitter_emmyluadoc_external_scanner_destroy(void *payload) {}

unsigned tree_sitter_emmyluadoc_external_scanner_serialize(void *payload, char *buffer) { return 0; }

void tree_sitter_emmyluadoc_external_scanner_deserialize(void *payload, const char *buffer, unsigned length) {}

static bool scan_text_line(TSLexer *lexer) {
  // The key insight: we need to be greedy and claim text_line ASAP
  // Skip empty lines and look ahead to find the next non-empty line
  
  // If we're in the middle of a line (column != 0), we need to advance
  // to the next line to check if it's a text_line
  if (lexer->get_column(lexer) != 0) {
    // We're in the middle of a line, skip to the next line
    while (lexer->lookahead != '\n' && lexer->lookahead != '\r' && lexer->lookahead != 0) {
      lexer->advance(lexer, true);
    }
    // Skip the newline(s)
    while (lexer->lookahead == '\n' || lexer->lookahead == '\r') {
      lexer->advance(lexer, true);
    }
  }
  
  // Now we should be at column 0 (or EOF)
  if (lexer->lookahead == 0) {
    return false;
  }
  
  // Make sure we're at the start of a line
  if (lexer->get_column(lexer) != 0) {
    return false;
  }
  
  // Skip empty lines - look ahead to find content
  while (true) {
    // Skip horizontal whitespace
    while (lexer->lookahead == ' ' || lexer->lookahead == '\t') {
      lexer->advance(lexer, true);
    }
    
    // If we hit a newline, skip it and continue to next line
    if (lexer->lookahead == '\n' || lexer->lookahead == '\r') {
      while (lexer->lookahead == '\n' || lexer->lookahead == '\r') {
        lexer->advance(lexer, true);
      }
      // Continue the loop to check the next line
      continue;
    }
    
    // If we hit EOF, no text_line found
    if (lexer->lookahead == 0) {
      return false;
    }
    
    // We found a non-empty line, break and check it
    break;
  }
  
  // Now we're at the first non-whitespace character of a non-empty line
  // Make sure we're still at column 0 (after skipping only whitespace)
  if (lexer->get_column(lexer) != 0) {
    return false;
  }
  
  // Now we're at the first non-whitespace character of the line
  // Let's check if this line is a valid annotation
  
  // Case 1: Starts with @ directly (e.g., "@class MyClass")
  if (lexer->lookahead == '@') {
    return false;
  }
  
  // Case 2: Starts with dashes (potential comment prefix)
  if (lexer->lookahead == '-') {
    // Save position
    int dash_count = 0;
    
    // Count dashes
    while (lexer->lookahead == '-') {
      dash_count++;
      lexer->advance(lexer, false);
    }
    
    // Skip spaces/tabs after dashes
    while (lexer->lookahead == ' ' || lexer->lookahead == '\t') {
      lexer->advance(lexer, false);
    }
    
    // Check what follows
    if (lexer->lookahead == '@' || lexer->lookahead == '|') {
      // This is an annotation or type continuation, not a text_line
      return false;
    }
    
    // If we get here, it's something like "---jfoiawoifjoiw @class MyClass"
    // This IS a text_line, so consume the rest of the line
    while (lexer->lookahead != '\n' && lexer->lookahead != '\r' && lexer->lookahead != 0) {
      lexer->advance(lexer, false);
    }
    
    lexer->result_symbol = TEXT_LINE;
    lexer->mark_end(lexer);
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

bool tree_sitter_emmyluadoc_external_scanner_scan(void *payload, TSLexer *lexer, const bool *valid_symbols) {
  if (valid_symbols[TEXT_LINE]) {
    return scan_text_line(lexer);
  }
  
  return false;
}
