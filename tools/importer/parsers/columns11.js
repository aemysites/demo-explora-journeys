/* global WebImporter */
export default function parse(element, { document }) {
  // Correct header row: single cell, exactly as example
  const headerRow = ['Columns (columns11)'];

  // Get the swiper-wrapper containing the actual columns (images)
  const wrapper = element.querySelector('.b2c-2025-awords__image .swiper-wrapper');
  let columnElements = [];
  if (wrapper) {
    columnElements = Array.from(wrapper.children);
  }

  // Each column contains a picture (the accolade image)
  const imagesRow = columnElements.map((col) => {
    const pic = col.querySelector('picture');
    // Defensive: If the picture is missing, insert an empty string
    return pic ? pic : '';
  });

  // Build the table: header row is a single column, then one row with all columns
  const tableCells = [headerRow, imagesRow];
  const block = WebImporter.DOMUtils.createTable(tableCells, document);

  // Replace the original element
  element.replaceWith(block);
}
