/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get immediate children by selector
  const getImmediate = (parent, selector) => Array.from(parent.children).filter(el => el.matches(selector));

  // Find the main wrapper for images and info
  const wrap = element.querySelector('.overlappingImage__wrap');
  if (!wrap) return;

  // Get images column
  const imagesContainer = wrap.querySelector('.overlappingImage__images');
  let images = [];
  if (imagesContainer) {
    // Get all picture elements (overlapping images)
    images = Array.from(imagesContainer.querySelectorAll('picture'));
  }

  // Get info column
  const infoContainer = wrap.querySelector('.overlappingImage__info');
  let infoElements = [];
  if (infoContainer) {
    // Collect intro and text blocks
    const intro = infoContainer.querySelector('.overlappingImage__intro');
    const text = infoContainer.querySelector('.overlappingImage__text');
    if (intro) infoElements.push(intro);
    if (text) infoElements.push(text);
  }

  // Compose table rows
  const headerRow = ['Columns (columns34)'];
  // First content row: left column is info, right column is images
  const contentRow = [infoElements, images];

  // Create the block table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow
  ], document);

  // Replace the original element
  element.replaceWith(table);
}
