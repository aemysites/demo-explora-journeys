/* global WebImporter */
export default function parse(element, { document }) {
  // Find the innermost wrapper containing image columns
  let contentWrapper = element;
  while (true) {
    const divs = Array.from(contentWrapper.children).filter(child => child.tagName === 'DIV');
    if (divs.some(div => div.classList.contains('imageb2c'))) {
      contentWrapper = contentWrapper;
      break;
    }
    if (divs.length > 0) {
      contentWrapper = divs[0];
    } else {
      break;
    }
  }

  // Get all imageb2c divs (each is a column)
  const imageDivs = Array.from(contentWrapper.children).filter(div => div.classList && div.classList.contains('imageb2c'));

  // Defensive: If no images found, fallback to empty cells
  const images = imageDivs.map(div => {
    // Reference the <picture> element directly
    const picture = div.querySelector('picture');
    return picture ? picture : document.createElement('div');
  });

  // Table header must match block name exactly
  const headerRow = ['Columns (columns16)'];
  // Each image is a column cell
  const contentRow = images;

  // Build the table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow
  ], document);

  element.replaceWith(table);
}
