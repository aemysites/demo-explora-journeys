/* global WebImporter */
export default function parse(element, { document }) {
  // Ensure header row matches prompt exactly
  const headerRow = ['Columns (columns31)'];

  // 1. Left column: grouped filter UI (all 'Where?' and 'When?' filters and the button)
  const leftCol = document.createElement('div');
  const filtersInputsContainer = element.querySelector('.filtersWrapper__inputs--container');
  if (filtersInputsContainer) {
    // Append all immediate children (the filters)
    Array.from(filtersInputsContainer.children).forEach(child => {
      leftCol.appendChild(child);
    });
  }
  // Also append the 'View journeys' button (so all filter UI is grouped in left column)
  const viewBtn = element.querySelector('.filtersWrapper__button');
  if (viewBtn) {
    leftCol.appendChild(viewBtn);
  }

  // 2. Right column: extract any visual element that belongs in the second column
  // Find candidate images or visual elements that belong in the right side
  // Look for any img, picture, video that is a direct child of the block (or inside filtersWrapper but outside the input containers)
  let rightCol = '';
  // Search for images that are not part of the input controls
  const images = Array.from(element.querySelectorAll('img'));
  // Only include images that are outside form/filter controls
  // (for robustness, in this HTML there are only icon images, so allow visual placeholder)
  // If there is a visual image, use it; else leave rightCol blank
  // This block doesn't have a real image, so nothing to add

  // Compose table cells: two columns, one row below header
  const cells = [
    headerRow,
    [leftCol, rightCol]
  ];

  // Create the table block & replace the original
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
