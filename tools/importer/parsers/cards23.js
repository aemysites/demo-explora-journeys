/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: Get all immediate card elements
  const cardSelector = '.swiper-wrapper > .swiper-slide';
  const cards = element.querySelectorAll(cardSelector);

  // Table header row
  const headerRow = ['Cards (cards23)'];
  const rows = [headerRow];

  // For each card, extract image and text
  cards.forEach((card) => {
    // Image cell: find <picture> or <img>
    let imgCell = null;
    const imgWrap = card.querySelector('.six-section-card__img');
    if (imgWrap) {
      // Use the <picture> element if present, else fallback to <img>
      const pic = imgWrap.querySelector('picture');
      if (pic) {
        imgCell = pic;
      } else {
        const img = imgWrap.querySelector('img');
        if (img) imgCell = img;
      }
    }

    // Text cell: title, description, CTA
    const infoWrap = card.querySelector('.six-section-card__info');
    const textCellContent = [];
    if (infoWrap) {
      // Title
      const title = infoWrap.querySelector('.six-section-card__title');
      if (title) {
        // If <h3> contains a <p>, use its content
        const p = title.querySelector('p');
        if (p) {
          const h = document.createElement('h3');
          h.innerHTML = p.innerHTML;
          textCellContent.push(h);
        } else {
          textCellContent.push(title);
        }
      }
      // Description
      const desc = infoWrap.querySelector('.six-section-card__desc');
      if (desc) {
        // If <h3> contains a <p>, use its content
        const p = desc.querySelector('p');
        if (p) {
          const d = document.createElement('p');
          d.innerHTML = p.innerHTML;
          textCellContent.push(d);
        } else {
          textCellContent.push(desc);
        }
      }
      // CTA (if present and has a link)
      const ctaWrap = infoWrap.querySelector('.six-section-card__cta');
      if (ctaWrap) {
        // Look for <a> inside CTA
        const link = ctaWrap.querySelector('a');
        if (link) {
          textCellContent.push(link);
        }
      }
    }

    // Defensive: fallback to card if infoWrap missing
    if (textCellContent.length === 0 && card) {
      textCellContent.push(card);
    }

    rows.push([imgCell, textCellContent]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
