/* global WebImporter */
export default function parse(element, { document }) {
  // Find the block wrapper containing all main columns
  const wrapper = element.querySelector('.image-by-image-by-text__wrapper');
  if (!wrapper) return;

  // Find inner container for columns
  const inner = wrapper.querySelector('.image-by-image-by-text__inner');
  if (!inner) return;

  // Collect column blocks
  const colBlocks = Array.from(inner.children);

  // Find all image columns and the text column
  const imageBlocks = colBlocks.filter(col => col.classList.contains('image-by-image-by-text__col--image'));
  const textBlock = colBlocks.find(col => col.classList.contains('image-by-image-by-text__col--text'));

  // Defensive: ensure we only get two image blocks and one text block
  let figureEls = imageBlocks.map(imgCol => imgCol.querySelector('figure')).filter(Boolean);

  // For the text column, grab the whole content area
  let textContent = null;
  if (textBlock) {
    // Prefer the .image-by-image-by-text__text-block--content container if it exists
    textContent = textBlock.querySelector('.image-by-image-by-text__text-block--content') || textBlock;
  }

  // There must be exactly 3 cells: text, image1, image2
  // If less than 2 image blocks, fill with nulls for resilience
  while (figureEls.length < 2) figureEls.push(null);

  // Table header matches spec
  const headerRow = ['Columns (columns3)'];

  const cells = [
    headerRow,
    [textContent, figureEls[0], figureEls[1]]
  ];

  // Create and replace block
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
