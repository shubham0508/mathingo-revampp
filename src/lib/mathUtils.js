export const placeCaretAfter = (node) => {
  const range = document.createRange();
  const sel = window.getSelection();
  range.setStartAfter(node);
  range.collapse(true);
  sel.removeAllRanges();
  sel.addRange(range);
  if (editorRef.current) editorRef.current.focus();
};
