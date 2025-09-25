/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: get all direct children columns
  const grid = element.querySelector('.article-content__buttons-grid');
  let columns = [];
  if (grid) {
    columns = Array.from(grid.children);
  } else {
    // fallback: treat all children as columns
    columns = Array.from(element.children);
  }

  // Defensive: Only keep non-empty columns
  columns = columns.filter(col => col && (col.textContent.trim() || col.querySelector('a,button')));

  // Table header row (block name)
  const headerRow = ['Columns (columns2)'];

  // Table content row: each column as a cell
  // Use the entire column element as the cell content for resilience
  const contentRow = columns.map(col => col);

  // Build table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow,
  ], document);

  // Replace original element
  element.replaceWith(table);
}
