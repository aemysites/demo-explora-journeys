/* global WebImporter */
export default function parse(element, { document }) {
  // Compose the header row
  const cells = [['Accordion (accordion24)']];
  // Get all immediate child elements of the accordion group
  const children = Array.from(element.children);
  let i = 0;
  while (i < children.length) {
    const question = children[i];
    // Only process if this is a question block
    if (question.classList.contains('faqAcc__question')) {
      // Try to find corresponding content block (next sibling)
      let content = null;
      let j = i + 1;
      if (j < children.length && children[j].classList.contains('faqAcc__content')) {
        content = children[j];
      }
      // Title cell - reference the existing element
      const titleCell = question;
      // Content cell - reference the relevant div, preserving full structure
      let contentCell;
      if (content) {
        // If content contains a child div, use it (it preserves formatting and structure)
        const innerDiv = content.querySelector('div');
        contentCell = innerDiv ? innerDiv : content;
      } else {
        contentCell = document.createElement('div');
      }
      cells.push([titleCell, contentCell]);
    }
    i++;
  }
  // Create the table and replace the original element
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
