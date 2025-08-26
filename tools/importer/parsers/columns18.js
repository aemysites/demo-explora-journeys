/* global WebImporter */
export default function parse(element, { document }) {
  // Find the grid containing the columns
  const grid = element.querySelector('.article-content__buttons-grid');
  if (!grid) return;
  // Get all direct child columns
  const columns = Array.from(grid.querySelectorAll(':scope > .article-content__buttons-grid-element'));

  // Header row: exactly one cell
  const headerRow = ['Columns (columns18)'];

  // Second row: each column's content
  const contentRow = columns.map((col) => {
    // If the column is empty
    if (!col.hasChildNodes()) return '';
    // Return all children as a fragment or the only element
    if (col.childNodes.length === 1) {
      return col.firstElementChild || col.firstChild;
    }
    return Array.from(col.childNodes);
  });

  // The table must have one header cell, even if multiple content columns
  // Build the table data: [[headerRow], [contentRow]]
  const tableData = [headerRow, contentRow];
  const blockTable = WebImporter.DOMUtils.createTable(tableData, document);
  element.replaceWith(blockTable);
}
