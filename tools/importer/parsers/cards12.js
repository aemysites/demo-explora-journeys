/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract the first <img> from a <picture>
  function getImageFromPicture(picture) {
    if (!picture) return null;
    return picture.querySelector('img');
  }

  // Find the main anchor with the image
  const mainLink = element.querySelector('a');
  const picture = mainLink ? mainLink.querySelector('picture') : null;
  const img = getImageFromPicture(picture);

  // Find the info section
  const infoDiv = element.querySelector('.subLevelCarousel__info');
  let title = null;
  let cta = null;
  if (infoDiv) {
    // Title is the first anchor with class 'subLevelCarousel__name'
    title = infoDiv.querySelector('.subLevelCarousel__name');
    // CTA is the anchor with class 'cta-white-btn'
    cta = infoDiv.querySelector('.cta-white-btn');
  }

  // Build the text content cell
  const textContent = document.createElement('div');
  if (title) {
    // Use strong for heading style
    const strong = document.createElement('strong');
    strong.textContent = title.textContent;
    textContent.appendChild(strong);
  }
  if (cta) {
    // Add a space if title exists
    if (title) textContent.appendChild(document.createElement('br'));
    // Use the existing CTA anchor
    textContent.appendChild(cta);
  }

  // Compose the table rows
  const headerRow = ['Cards (cards12)'];
  const cardRow = [img, textContent];
  const rows = [headerRow, cardRow];

  // Create the table
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element
  element.replaceWith(table);
}
