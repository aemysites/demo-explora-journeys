/* global WebImporter */
export default function parse(element, { document }) {
  // Find the Cards section (App Key Features)
  const cardsSection = element.querySelector('.six-section');
  if (!cardsSection) return;
  const cardsWrapper = cardsSection.querySelector('.six-section-wrapper');
  if (!cardsWrapper) return;
  const swiperWrapper = cardsWrapper.querySelector('.swiper-wrapper');
  if (!swiperWrapper) return;

  // Prepare table rows
  const rows = [['Cards (cards10)']];

  // Get all cards (one per swiper-slide)
  const cardSlides = swiperWrapper.querySelectorAll('.six-section-card');
  cardSlides.forEach(cardEl => {
    // Card image (picture element)
    const img = cardEl.querySelector('.six-section-card__img picture');
    // Card title (should be h3 or similar)
    const info = cardEl.querySelector('.six-section-card__info');
    let title = null;
    let desc = null;
    if (info) {
      title = info.querySelector('.six-section-card__title');
      desc = info.querySelector('.six-section-card__desc');
    }
    const textParts = [];
    if (title) textParts.push(title);
    if (desc) textParts.push(desc);
    rows.push([
      img,
      textParts
    ]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  cardsSection.replaceWith(table);
}
