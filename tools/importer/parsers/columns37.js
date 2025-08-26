/* global WebImporter */
export default function parse(element, { document }) {
  // Header row: one column, block name exactly as specified
  const headerRow = ['Columns (columns37)'];

  // Get all direct column wrapper divs
  const columns = Array.from(element.querySelectorAll(':scope > div'));

  // For each column, assemble its content into a single fragment for the cell
  const contentRow = columns.map(col => {
    // The image/media section
    const media = col.querySelector('.b2c-2025-column-image__media');
    // The text wrapper
    const textWrapper = col.querySelector('.b2c-2025-column-image__text-wrapper');

    // Create a container for column content
    const frag = document.createElement('div');
    if (media) frag.appendChild(media);
    if (textWrapper) frag.appendChild(textWrapper);
    return frag;
  });

  // Create the table with a single header cell (first row), and a content row with N columns
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow,
  ], document);

  element.replaceWith(table);
}
