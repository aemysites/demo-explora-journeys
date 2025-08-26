/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract direct images from the overlappingImage__images container
  function getImages(imagesContainer) {
    const images = [];
    if (imagesContainer) {
      const imageDivs = imagesContainer.querySelectorAll(':scope > .overlappingImage__image');
      imageDivs.forEach((imgDiv) => {
        const picture = imgDiv.querySelector('picture');
        if (picture) images.push(picture);
      });
    }
    return images;
  }

  // Locate the main block elements for columns
  const overlappingWrap = element.querySelector('.overlappingImage__wrap');
  const imagesContainer = overlappingWrap && overlappingWrap.querySelector('.overlappingImage__images');
  const infoContainer = overlappingWrap && overlappingWrap.querySelector('.overlappingImage__info');

  // Prepare left column: all images
  const leftCol = [];
  const images = getImages(imagesContainer);
  if (images.length) leftCol.push(...images);

  // Prepare right column: heading and all paragraphs
  const rightCol = [];
  if (infoContainer) {
    const intro = infoContainer.querySelector('.overlappingImage__intro');
    if (intro) rightCol.push(intro);
    const text = infoContainer.querySelector('.overlappingImage__text');
    if (text) {
      Array.from(text.children).forEach((child) => {
        rightCol.push(child);
      });
    }
  }

  // Header row must be a single column with only the block name
  const header = ['Columns (columns32)'];
  const row = [leftCol, rightCol];

  const cells = [header, row];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
