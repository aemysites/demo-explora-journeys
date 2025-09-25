/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract the main content from a column
  function extractColumnContent(column) {
    const parts = [];
    // Get image (picture)
    const media = column.querySelector('.b2c-2025-column-image__media picture');
    if (media) parts.push(media);
    // Get title
    const title = column.querySelector('.b2c-2025-column-image__title');
    if (title) parts.push(title);
    // Get subtitle
    const subtitle = column.querySelector('.b2c-2025-column-image__subtitle');
    if (subtitle) parts.push(subtitle);
    // Get button (link)
    const buttonWrapper = column.querySelector('.b2c-2025-column-image__button a');
    if (buttonWrapper) parts.push(buttonWrapper);
    return parts;
  }

  // Get all columns (immediate children)
  const columns = Array.from(element.querySelectorAll(':scope > .b2c-2025-activation__column'));

  // Defensive: Only proceed if we have columns
  if (columns.length === 0) return;

  // Build the table rows
  const headerRow = ['Columns (columns37)'];
  // Each column's content is an array of elements
  const contentRow = columns.map(col => extractColumnContent(col));

  // Compose table cells
  const cells = [headerRow, contentRow];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element
  element.replaceWith(block);
}
