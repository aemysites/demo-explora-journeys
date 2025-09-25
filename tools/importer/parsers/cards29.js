/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: Find the card wrapper
  const cardWrap = element.querySelector('.six-section-card');
  if (!cardWrap) return;

  // Find the card inner wrap
  const innerWrap = cardWrap.querySelector('.six-section-card__wrap');
  if (!innerWrap) return;

  // Get image element (picture)
  const imgDiv = innerWrap.querySelector('.six-section-card__img');
  let imgEl = null;
  if (imgDiv) {
    imgEl = imgDiv.querySelector('picture');
  }

  // Get info div
  const infoDiv = innerWrap.querySelector('.six-section-card__info');

  // Title (h3 > p)
  let titleEl = null;
  if (infoDiv) {
    const titleH3 = infoDiv.querySelector('.six-section-card__title');
    if (titleH3) {
      titleEl = titleH3.querySelector('p') || titleH3;
    }
  }

  // Description (h3 > p)
  let descEl = null;
  if (infoDiv) {
    const descH3 = infoDiv.querySelector('.six-section-card__desc');
    if (descH3) {
      descEl = descH3.querySelector('p') || descH3;
    }
  }

  // CTA (if present)
  let ctaEl = null;
  if (infoDiv) {
    const ctaDiv = infoDiv.querySelector('.six-section-card__cta');
    if (ctaDiv) {
      const link = ctaDiv.querySelector('a');
      if (link) {
        ctaEl = link;
      }
    }
  }

  // Compose the text cell
  const textCellContent = [];
  if (titleEl) textCellContent.push(titleEl);
  if (descEl) textCellContent.push(descEl);
  if (ctaEl) textCellContent.push(ctaEl);

  // Table rows
  const headerRow = ['Cards (cards29)'];
  const cardRow = [imgEl, textCellContent];
  const cells = [headerRow, cardRow];

  // Create table block
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace original element
  element.replaceWith(block);
}
