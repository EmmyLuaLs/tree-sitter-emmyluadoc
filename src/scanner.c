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
  if (lexer->lookahead == '@') return false;
  
  // Case 2: Starts with dash sequence (comment-like) e.g. ---something
  if (lexer->lookahead == '-') {
    // Consume up to the sequence of dashes (we don't limit count strictly here)
    while (lexer->lookahead == '-') lexer->advance(lexer, true);

    // Skip horizontal whitespace after dashes
    while (lexer->lookahead == ' ' || lexer->lookahead == '\t') lexer->advance(lexer, true);

    // If next char is @ or | treat it as not a plain text_line
    if (lexer->lookahead == '@' || lexer->lookahead == '|') return false;

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

bool tree_sitter_emmyluadoc_external_scanner_scan(void *payload, TSLexer *lexer, const bool *valid_symbols) {
  if (valid_symbols[TEXT_LINE]) {
    return scan_text_line(lexer);
  }
  
  return false;
}
