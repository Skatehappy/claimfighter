// src/stripMarkdown.js - the model is told to write plain text, but sometimes still emits markdown.
// Letters are shown and exported as plain text, so headings, bold/italic markers, bullets, tables and code fences
// are removed before display, copy, e-mail and PDF. Placeholders such as [DATE] / [Address] are untouched.
export function stripMarkdown(input) {
  if (typeof input !== 'string' || !input) return input || '';
  let t = input.replace(/\r\n/g, '\n');
  t = t.replace(/^[ \t]*(```|~~~).*$/gm, '');                          // code fence lines (content kept)
  t = t.replace(/^[ \t]*\|?[ \t]*:?-{2,}:?[ \t]*(\|[ \t]*:?-{2,}:?[ \t]*)*\|?[ \t]*$/gm, m => (m.includes('|') ? '' : m)); // table separator rows
  t = t.replace(/^[ \t]*\|(.+)\|[ \t]*$/gm, (_, row) => row.split('|').map(c => c.trim()).filter(Boolean).join(',  ')); // table rows
  t = t.replace(/^[ \t]*([-*_])([ \t]*\1){2,}[ \t]*$/gm, '');         // horizontal rules
  t = t.replace(/^[ \t]{0,3}#{1,6}[ \t]+(.*?)(?:[ \t]+#+)?[ \t]*$/gm, '$1'); // # headings
  t = t.replace(/^([ \t]*)[*+•][ \t]+/gm, '$1- ');                    // * bullets -> plain hyphen bullets
  t = t.replace(/\*\*\*(\S(?:[^*\n]*?\S)?)\*\*\*/g, '$1');            // ***bold italic***
  t = t.replace(/\*\*(\S(?:[^*\n]*?\S)?)\*\*/g, '$1');                // **bold**
  t = t.replace(/__(\S(?:[^_\n]*?\S)?)__/g, '$1');                    // __bold__
  t = t.replace(/(^|[^\w*])\*(?!\s)([^*\n]*?\S)\*(?![\w*])/g, '$1$2'); // *italic*
  t = t.replace(/(^|[^\w])_(?!\s)([^_\n]*?\S)_(?![\w])/g, '$1$2');    // _italic_
  t = t.replace(/`([^`\n]+)`/g, '$1');                                // inline code
  t = t.replace(/\n{3,}/g, '\n\n');
  return t.trim();
}
