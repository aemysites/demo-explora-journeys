/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: get direct child divs
  const topDivs = Array.from(element.querySelectorAll(':scope > div'));
  let mainWrap = element;
  if (topDivs.length === 1) mainWrap = topDivs[0];

  // Find the main content wrapper
  const wrap = mainWrap.querySelector('.overlappingImage__wrap') || mainWrap;
  const imagesContainer = wrap.querySelector('.overlappingImage__images');
  const infoContainer = wrap.querySelector('.overlappingImage__info');

  // Collect all images (picture elements only, reference them directly)
  let images = [];
  if (imagesContainer) {
    images = Array.from(imagesContainer.querySelectorAll('picture'));
  }
  if (images.length === 0) {
    images = Array.from(mainWrap.querySelectorAll('picture'));
  }

  // Compose left column: images stacked in a div
  const imagesDiv = document.createElement('div');
  images.forEach(pic => imagesDiv.appendChild(pic));

  // Compose right column: heading + text
  let infoContent = [];
  if (infoContainer) {
    const heading = infoContainer.querySelector('h2');
    if (heading) infoContent.push(heading);
    const textDiv = infoContainer.querySelector('.overlappingImage__text');
    if (textDiv) infoContent.push(textDiv);
  } else {
    const heading = mainWrap.querySelector('h2');
    if (heading) infoContent.push(heading);
    const textDiv = mainWrap.querySelector('div');
    if (textDiv) infoContent.push(textDiv);
  }

  // Table header must match block name exactly
  const headerRow = ['Columns (columns32)'];
  const contentRow = [imagesDiv, infoContent];
  const cells = [headerRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);

  element.replaceWith(table);
}
