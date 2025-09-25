/* global WebImporter */
export default function parse(element, { document }) {
  // Get all immediate swiper-slide columns
  const columns = Array.from(
    element.querySelectorAll('.swiper-wrapper > .swiper-slide, .swiper-wrapper > .b2c-2025-awords__column')
  );

  // Defensive: If no columns found, do nothing
  if (!columns.length) return;

  // Each column contains a <picture> with an <img>
  // We'll use the <picture> as the cell content for resilience
  const row = columns.map(col => {
    // Find the first <picture> in the column
    const pic = col.querySelector('picture');
    if (pic) return pic;
    // Fallback: if no picture, try to find an img
    const img = col.querySelector('img');
    if (img) return img;
    // Fallback: empty cell
    return '';
  });

  // Build table rows
  const headerRow = ['Columns (columns11)'];
  const tableRows = [headerRow, row];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(tableRows, document);

  // Replace the original element with the new table
  element.replaceWith(block);
}
