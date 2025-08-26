/* global WebImporter */
export default function parse(element, { document }) {
  const headerRow = ['Cards (cards15)'];
  const cells = [headerRow];

  // Get all cards
  const cardElements = element.querySelectorAll('.posts-grid__grid-element');
  cardElements.forEach((cardElem) => {
    // Get the image element (already in the DOM, don't clone)
    const img = cardElem.querySelector('figure img');

    // Compose the text column
    const content = cardElem.querySelector('.article-card__content');
    const fragments = [];

    // Date (time)
    const time = content.querySelector('time');
    if (time && time.textContent.trim()) {
      const timeP = document.createElement('p');
      timeP.textContent = time.textContent.trim();
      fragments.push(timeP);
    }

    // Title (h4, with its a)
    const h4 = content.querySelector('h4');
    if (h4 && h4.textContent.trim()) {
      fragments.push(h4);
    }

    // Description paragraph
    const desc = content.querySelector('.article-card__excerpt');
    if (desc && desc.textContent.trim()) {
      const descP = document.createElement('p');
      descP.textContent = desc.textContent.trim();
      fragments.push(descP);
    }

    // CTA (See more link)
    const cta = content.querySelector('a.text-deco--underline');
    if (cta) {
      // Only reference the existing anchor, but wrap in <p> for structure
      const ctaP = document.createElement('p');
      ctaP.appendChild(cta);
      fragments.push(ctaP);
    }

    // Include only if we have at least a title or description
    if (img && fragments.length > 0) {
      cells.push([img, fragments]);
    }
  });

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
