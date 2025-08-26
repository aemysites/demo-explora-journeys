/* global WebImporter */
export default function parse(element, { document }) {
  // Get the main overlapping image wrapper
  const wrap = element.querySelector('.overlappingImage__wrap');
  if (!wrap) return;

  // Prepare left column: title and descriptive text
  const infoDiv = wrap.querySelector('.overlappingImage__info');
  let leftContent;
  if (infoDiv) {
    leftContent = document.createElement('div');
    // Retain the order and reference existing elements
    const intro = infoDiv.querySelector('.overlappingImage__intro');
    if (intro) leftContent.appendChild(intro);
    const text = infoDiv.querySelector('.overlappingImage__text');
    if (text) leftContent.appendChild(text);
  } else {
    leftContent = document.createElement('div');
  }

  // Prepare right column: stacked overlapping images (as existing <picture> elements)
  const imagesDiv = wrap.querySelector('.overlappingImage__images');
  let rightContent;
  if (imagesDiv) {
    rightContent = document.createElement('div');
    // Find all .overlappingImage__image > picture elements in order
    imagesDiv.querySelectorAll('.overlappingImage__image picture').forEach(pic => {
      rightContent.appendChild(pic);
    });
  } else {
    rightContent = document.createElement('div');
  }

  const cells = [
    ['Columns (columns34)'],
    [leftContent, rightContent]
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
