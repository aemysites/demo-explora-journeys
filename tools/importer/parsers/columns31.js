/* global WebImporter */
export default function parse(element, { document }) {
  // Block header must match exactly
  const headerRow = ['Columns (columns31)'];

  // Find the main content wrapper for the columns
  const filtersWrapper = element.querySelector('.filtersWrapper');
  if (!filtersWrapper) return;

  // Identify the main column containers for side-by-side layout
  // 1. The filters input section (contains Where? and When?)
  // 2. The calendar dropdown (dates selection)
  // 3. The button (View journeys)
  const filtersInputs = filtersWrapper.querySelector('.filtersWrapper__inputs');
  const calendarDropdown = filtersWrapper.querySelector('.filtersWrapper__dropdown--full');
  const viewJourneysBtn = filtersWrapper.querySelector('.filtersWrapper__button');

  // Compose the columns row, referencing existing elements
  // Only include non-empty elements
  const columnsRow = [filtersInputs, calendarDropdown, viewJourneysBtn].filter(el => el);

  // If not enough columns, fallback to all direct children
  if (columnsRow.length < 2) {
    columnsRow.length = 0;
    Array.from(filtersWrapper.children).forEach(child => {
      if (child.nodeType === 1 && (child.textContent.trim() || child.querySelector('img'))) columnsRow.push(child);
    });
  }

  // Create the table structure
  const tableCells = [headerRow, columnsRow];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(tableCells, document);

  // Replace the original element with the block table
  element.replaceWith(block);
}
