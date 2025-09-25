/* global WebImporter */
export default function parse(element, { document }) {
  // Find the six-section block containing the cards
  const sixSection = element.querySelector('.six-section');
  if (!sixSection) return;

  // Find the carousel wrapper containing the card slides
  const carouselWrap = sixSection.querySelector('.subLevelCarousel__wrap, .six-section__wrap');
  if (!carouselWrap) return;

  // Find all card elements
  const cardEls = carouselWrap.querySelectorAll('.six-section-card');
  if (!cardEls.length) return;

  // Prepare the table rows
  const headerRow = ['Cards (cards10)'];
  const rows = [headerRow];

  cardEls.forEach(cardEl => {
    // Image: find the <picture> element inside .six-section-card__img
    const imgWrap = cardEl.querySelector('.six-section-card__img');
    let image = null;
    if (imgWrap) {
      image = imgWrap.querySelector('picture') || imgWrap.querySelector('img');
    }

    // Info: find the title and description
    const info = cardEl.querySelector('.six-section-card__info');
    let title = null;
    let desc = null;
    if (info) {
      // Title: .six-section-card__title
      const titleEl = info.querySelector('.six-section-card__title');
      if (titleEl) {
        // Sometimes the title is inside a <p> inside the h3
        title = titleEl.querySelector('p') || titleEl;
      }
      // Description: .six-section-card__desc
      const descEl = info.querySelector('.six-section-card__desc');
      if (descEl) {
        desc = descEl.querySelector('p') || descEl;
      }
    }

    // Compose the text cell
    const textCellContent = [];
    if (title) textCellContent.push(title);
    if (desc) textCellContent.push(desc);

    // Add the row: [image, text]
    rows.push([
      image,
      textCellContent
    ]);
  });

  // Create the table block
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the six-section block with the new block
  sixSection.replaceWith(block);
}
