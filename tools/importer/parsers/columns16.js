/* global WebImporter */
export default function parse(element, { document }) {
  // The structure: .multi-column-cmp > .multiCol > .multiCol__wrap > .body-script > ... > .cmp-container > (columns)
  // Goal: Each direct child of .cmp-container is a column cell, containing all its content

  // Find the cmp-container that contains the columns
  const cmpContainer = element.querySelector('.cmp-container');
  if (!cmpContainer) return;

  // Each direct child of cmp-container is a column's content block
  const columnNodes = Array.from(cmpContainer.children);

  // For each column, we want ALL of its contents, not just images
  // We'll gather all child nodes (including text, images, buttons, etc) for each column
  const columns = columnNodes.map(col => {
    // Collect all non-empty child nodes (elements or non-whitespace text)
    const colContent = Array.from(col.childNodes).filter(n => {
      return n.nodeType !== Node.TEXT_NODE || n.textContent.trim();
    });
    // If there is content, return as array; otherwise fallback to the element itself
    return colContent.length ? colContent : [col];
  });
  // If there are no columns, abort
  if (columns.length === 0) return;

  // Create the table rows: header + one row with as many columns as found
  const cells = [
    ['Columns (columns16)'],
    columns
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);

  element.replaceWith(table);
}
