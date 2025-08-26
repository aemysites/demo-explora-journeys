/* global WebImporter */
export default function parse(element, { document }) {
  // Ensure the block header matches the example
  const headerRow = ['Cards (cards29)'];

  // Prepare the card rows array
  const rows = [];

  // The provided HTML is a single card div; could be called for each card individually
  // Extract the card wrapper
  const cardWrap = element.querySelector('.six-section-card__wrap');
  if (cardWrap) {
    // First column: image or icon (mandatory)
    let imageCell = '';
    const imgDiv = cardWrap.querySelector('.six-section-card__img');
    if (imgDiv) {
      // Prefer <picture> if present, otherwise <img>
      const picture = imgDiv.querySelector('picture');
      if (picture) {
        imageCell = picture;
      } else {
        const img = imgDiv.querySelector('img');
        if (img) imageCell = img;
      }
    }

    // Second column: text content (mandatory)
    // Title (optional), Description (optional), CTA (optional)
    const infoDiv = cardWrap.querySelector('.six-section-card__info');
    let textCell;
    if (infoDiv) {
      textCell = document.createElement('div');

      // Title
      const title = infoDiv.querySelector('.six-section-card__title');
      if (title) textCell.appendChild(title);

      // Description
      const desc = infoDiv.querySelector('.six-section-card__desc');
      if (desc) textCell.appendChild(desc);

      // CTA (check if present and non-empty)
      const cta = infoDiv.querySelector('.six-section-card__cta');
      if (cta && cta.textContent.trim().length > 0) {
        textCell.appendChild(cta);
      }
    } else {
      textCell = '';
    }

    // Push card row
    rows.push([imageCell, textCell]);
  }
  // Compose the table: block header row, then card rows
  const cells = [headerRow, ...rows];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
