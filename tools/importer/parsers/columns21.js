/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main wrapper for the columns
  const wrapper = element.querySelector('.b2c-2025-inclusions__wrapper');
  if (!wrapper) return;
  const columns = wrapper.querySelectorAll(':scope > .b2c-2025-inclusions__column');
  if (columns.length < 2) return;

  // LEFT COLUMN
  const left = columns[0];
  const leftContent = [];
  const title = left.querySelector('.b2c-2025-inclusions__title');
  if (title) leftContent.push(title);
  const list = left.querySelector('.b2c-2025-inclusions__list ul');
  if (list) leftContent.push(list);
  const disclaimer = left.querySelector('.b2c-2025-inclusions__disclaimer');
  if (disclaimer) leftContent.push(disclaimer);

  // RIGHT COLUMN
  const right = columns[1];
  let rightContent = [];
  // Prefer image if present, else video
  const img = right.querySelector('img');
  if (img) {
    rightContent = [img];
  } else {
    const video = right.querySelector('video');
    if (video) {
      // Reference the <video> element directly
      rightContent = [video];
    }
  }

  // Build table
  const headerRow = ['Columns (columns21)'];
  const contentRow = [leftContent, rightContent];
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow,
  ], document);

  element.replaceWith(table);
}
