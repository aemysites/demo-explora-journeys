/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: find the grid container
  const grid = element.querySelector('.article-content__buttons-grid');
  if (!grid) return;

  // Find all immediate button grid elements (columns)
  const gridElements = Array.from(grid.querySelectorAll(':scope > .article-content__buttons-grid-element'));
  if (gridElements.length === 0) return;

  // The block header row
  const headerRow = ['Columns (columns18)'];

  // The columns row: each cell is a button grid element (contains a button or share widget)
  const columnsRow = gridElements.map((el) => el);

  // Build the table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    columnsRow
  ], document);

  // Replace the original element with the new table
  element.replaceWith(table);
}
