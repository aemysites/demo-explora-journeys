/* global WebImporter */
export default function parse(element, { document }) {
  // Find all direct children that are columns
  const boxes = Array.from(element.querySelectorAll(':scope > .newFooter__topContainer-box'));

  // Each box is a column; extract content semantically
  const cols = boxes.map(box => {
    // NEWSLETTER COLUMN: newsletter title + newsletter content (including social icons and share)
    const newsletterTitle = box.querySelector(':scope > .newFooter__topContainer-box-title-newsletter');
    const newsletterBlock = box.querySelector(':scope > .newFooter__topContainer-box-newsletter');
    if (newsletterTitle && newsletterBlock) {
      const frag = document.createElement('div');
      frag.appendChild(newsletterTitle);
      frag.appendChild(newsletterBlock);
      // There may be logos (most likely empty, but preserve for edge cases)
      const logos = box.querySelector(':scope > .newFooter__topContainer-box-logos');
      if (logos && logos.childNodes.length > 0) {
        frag.appendChild(logos);
      }
      return frag;
    }
    // Standard column with data-item child (accordion style)
    const dataItem = box.querySelector(':scope > [data-item]');
    if (dataItem) {
      // The content structure: Title and List
      const title = dataItem.querySelector(':scope > .newFooter__topContainer-box-title');
      const list = dataItem.querySelector(':scope > .newFooter__topContainer-box-list');
      const colDiv = document.createElement('div');
      if (title) colDiv.appendChild(title);
      if (list) colDiv.appendChild(list);
      return colDiv;
    }
    // Edge case: top-level title & list (for some source variations)
    const title = box.querySelector(':scope > .newFooter__topContainer-box-title');
    const list = box.querySelector(':scope > .newFooter__topContainer-box-list');
    if (title || list) {
      const colDiv = document.createElement('div');
      if (title) colDiv.appendChild(title);
      if (list) colDiv.appendChild(list);
      return colDiv;
    }
    // Fallback: if box has any content, return it
    return box;
  });

  // If all columns are empty, don't output the block
  if (!cols.some(col => col && (col.textContent || '').trim().length > 0)) {
    element.remove();
    return;
  }

  // Table header: exact per instructions and example
  const headerRow = ['Columns (columns9)'];
  // Columns row: each column is a cell, in order
  const cellsRow = cols;

  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    cellsRow,
  ], document);

  element.replaceWith(table);
}
