/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main inner wrapper
  const inner = element.querySelector('.image-by-image-by-text__inner') || element;

  // Find all image columns in DOM order
  const imageCols = Array.from(inner.querySelectorAll('.image-by-image-by-text__col--image'));

  // Find the text column
  const textCol = inner.querySelector('.image-by-image-by-text__col--text');

  // Extract the referenced <picture> for each image column (not cloning)
  const imageCells = imageCols.map(col => {
    const pic = col.querySelector('picture');
    return pic || '';
  });

  // Use the referenced text column element (not cloning)
  const textCell = textCol || '';

  // Compose the table rows
  const headerRow = ['Columns (columns3)'];
  const contentRow = [textCell, ...imageCells];

  // Ensure exactly three columns for columns3
  while (contentRow.length < 3) contentRow.push('');
  if (contentRow.length > 3) contentRow.length = 3;

  // Build the table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow,
  ], document);

  // Replace the original element
  element.replaceWith(table);
}
