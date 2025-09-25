/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main columns wrapper
  const mainWrap = element.querySelector('.multiCol__wrap');
  if (!mainWrap) return;

  // Get all immediate column wrappers (body-script)
  const columnDivs = Array.from(mainWrap.querySelectorAll(':scope > .body-script'));

  // For each column, extract the inner image (picture) element
  const columns = columnDivs.map((colDiv) => {
    // Find the picture element inside this column
    const picture = colDiv.querySelector('picture');
    if (picture) {
      return picture;
    }
    // If no image, fallback to the whole column div (should not happen in this block)
    return colDiv;
  });

  // Table header row
  const headerRow = ['Columns (columns35)'];

  // Table columns row: one cell per image
  const columnsRow = columns;

  // Build the table
  const cells = [
    headerRow,
    columnsRow,
  ];
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the new block
  element.replaceWith(block);
}
