/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: get direct children by class
  function getDirectChildrenByClass(parent, className) {
    return Array.from(parent.children).filter(child => child.classList.contains(className));
  }

  // Get all accordion items: question/content pairs
  const questions = getDirectChildrenByClass(element, 'faqAcc__question');
  const contents = getDirectChildrenByClass(element, 'faqAcc__content');

  // Defensive: ensure pairs and handle missing data
  const items = [];
  for (let i = 0; i < Math.max(questions.length, contents.length); i++) {
    const title = questions[i] || document.createTextNode('');
    let content = contents[i] || document.createTextNode('');
    // Use inner div if present for content
    if (content.nodeType === 1 && content.children.length === 1 && content.children[0].tagName === 'DIV') {
      content = content.children[0];
    }
    items.push([title, content]);
  }

  // Build table rows
  const rows = [];
  // Header row: must match block name exactly
  rows.push(['Accordion (accordion24)']);
  // Each item as [title, content]
  items.forEach(([title, content]) => {
    rows.push([title, content]);
  });

  // Create table
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace original element
  element.replaceWith(table);
}
