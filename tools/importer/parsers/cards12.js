/* global WebImporter */
export default function parse(element, { document }) {
  // Header row for the block
  const cells = [
    ['Cards (cards12)']
  ];

  // Collect the image/icon for the card (mandatory, first cell)
  // Reference the <picture> element directly (it contains the img)
  const picture = element.querySelector('picture');

  // Collect the text content and CTA for the second cell
  const info = element.querySelector('.subLevelCarousel__info');
  
  // Defensive: ensure text content is handled even if some elements are missing
  let textContent = document.createElement('div');

  if (info) {
    // Get the title (may be absent)
    const titleEl = info.querySelector('.subLevelCarousel__name');
    if (titleEl) {
      // bold for heading semantic (as in example)
      const strong = document.createElement('strong');
      strong.textContent = titleEl.textContent;
      textContent.appendChild(strong);
    }
    // Get CTA (may be absent)
    const ctaEl = info.querySelector('.cta-white-btn');
    if (ctaEl) {
      if (titleEl) textContent.appendChild(document.createElement('br'));
      textContent.appendChild(ctaEl);
    }
  }

  // Add the card row: [image, text content]
  cells.push([
    picture,
    textContent
  ]);

  // Create and replace
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
