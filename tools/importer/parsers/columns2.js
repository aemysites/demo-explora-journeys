/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: Ensure element exists and has content
  if (!element) return;

  // Find the main grid that contains the columns
  const grid = element.querySelector('.article-content__buttons-grid');
  if (!grid) return;

  // Get direct children columns
  const columns = Array.from(grid.querySelectorAll(':scope > .article-content__buttons-grid-element'));
  // If no columns found, fallback to grid itself
  const dataRow = columns.length > 0 ? columns : [grid];

  // Correct the header row to be a SINGLE cell with the block name
  const headerRow = ['Columns (columns2)']; // One cell only

  // Compose cells array: header row (single cell), then data row (multiple cells)
  const cells = [headerRow, dataRow];

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with our new block
  element.replaceWith(table);
}
