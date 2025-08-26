/* global WebImporter */
export default function parse(element, { document }) {
  // Prepare header row as required
  const headerRow = ['Cards (cards23)'];
  const cells = [headerRow];

  // Find all swiper-slide card containers (direct, not nested)
  const swiperSlides = element.querySelectorAll('.swiper-slide.subLevelCarousel__el');

  swiperSlides.forEach((slide) => {
    // Image: find the <picture> inside the card
    const imageContainer = slide.querySelector('.six-section-card__img picture');
    // Info container (title/desc)
    const info = slide.querySelector('.six-section-card__info');
    // Defensive: if missing, skip this card
    if (!imageContainer || !info) return;

    // Title: prefer <p> inside .six-section-card__title, else textContent
    let titleElem = info.querySelector('.six-section-card__title');
    let title = null;
    if (titleElem) {
      let p = titleElem.querySelector('p');
      title = p || titleElem;
    }

    // Description: prefer <p> inside .six-section-card__desc, else textContent
    let descElem = info.querySelector('.six-section-card__desc');
    let desc = null;
    if (descElem) {
      let p = descElem.querySelector('p');
      desc = p || descElem;
    }

    // Compose the text cell: title (if any), then desc (if any)
    const textCellContents = [];
    if (title) textCellContents.push(title);
    if (desc) textCellContents.push(desc);

    cells.push([
      imageContainer,
      textCellContents
    ]);
  });

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}