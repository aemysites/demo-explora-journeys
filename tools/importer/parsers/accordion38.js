/* global WebImporter */
export default function parse(element, { document }) {
  // Header: use the exact block name as specified
  const headerRow = ['Accordion (accordion38)'];

  // Get all immediate children of the block
  const children = Array.from(element.querySelectorAll(':scope > *'));

  const rows = [headerRow];
  let i = 0;
  while (i < children.length) {
    const item = children[i];
    if (item.classList.contains('faqAcc__question')) {
      // Title cell: reference the existing title element
      const titleEl = item;
      // Content cell: reference the next sibling content element
      let contentEl = null;
      if ((i + 1) < children.length && children[i + 1].classList.contains('faqAcc__content')) {
        contentEl = children[i + 1];
      } else {
        // If content missing, use an empty div to preserve structure
        contentEl = document.createElement('div');
      }
      rows.push([titleEl, contentEl]);
      i += 2; // Move past both question and content
    } else {
      // If not a question (shouldn't happen), skip
      i++;
    }
  }

  // Create table using referenced elements; no cloning, no markdown, no hardcoded text
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
