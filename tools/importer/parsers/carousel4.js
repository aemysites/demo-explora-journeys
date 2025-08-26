/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get all .searchCard elements inside the carousel
  function getCardSlides(root) {
    const swiperContainer = root.querySelector('.swiper-container');
    const cards = [];
    if (swiperContainer) {
      swiperContainer.querySelectorAll('.swiper-slide').forEach((slide) => {
        const card = slide.querySelector('.searchCard') || slide.closest('.searchCard') || slide;
        if (card && card.classList.contains('searchCard') && !cards.includes(card)) {
          cards.push(card);
        }
      });
      // Fallback: direct .searchCard.swiper-slide
      if (cards.length === 0) {
        swiperContainer.querySelectorAll('.searchCard.swiper-slide').forEach(card => {
          if (!cards.includes(card)) cards.push(card);
        });
      }
    }
    // Fallback: if not in swiper, just get all .searchCard
    if (cards.length === 0) {
      root.querySelectorAll('.searchCard').forEach(card => {
        if (!cards.includes(card)) cards.push(card);
      });
    }
    return cards;
  }

  // Helper: get first image element from card
  function getMainImage(card) {
    const imgContainer = card.querySelector('.searchCard__img');
    if (imgContainer) {
      const img = imgContainer.querySelector('img');
      if (img) return img;
    }
    return '';
  }

  // Helper: get all meaningful text content from the card, referencing existing elements
  function getTextContent(card) {
    const content = card.querySelector('.searchCard__content');
    if (!content) return '';

    // Compose a fragment to collect content in right order
    const frag = document.createElement('div');

    // Title as heading
    const titleSpan = content.querySelector('.title span');
    if (titleSpan && titleSpan.textContent.trim()) {
      const h2 = document.createElement('h2');
      h2.innerHTML = `<strong>${titleSpan.textContent.trim()}</strong>`;
      frag.appendChild(h2);
    }

    // From/To row
    const fromTo = content.querySelector('.fromTo');
    if (fromTo) {
      // Reference the entire fromTo group for flexibility
      frag.appendChild(fromTo);
    }

    // Price and nights
    const pricesNights = content.querySelector('.pricesNights');
    if (pricesNights) {
      frag.appendChild(pricesNights);
    }

    // CTA button
    const cta = content.querySelector('a.cmp-button');
    if (cta) {
      frag.appendChild(cta);
    }

    // If nothing found, but content has text, add that
    if (!frag.childNodes.length && content.textContent.trim()) {
      frag.textContent = content.textContent.trim();
    }

    // If still nothing, return empty string
    return frag.childNodes.length > 0 ? frag : '';
  }

  // Get all card slides
  const cardSlides = getCardSlides(element);
  if (!cardSlides.length) return;

  // Build block table rows
  const rows = [[ 'Carousel (carousel4)' ]];
  cardSlides.forEach(card => {
    const imageCell = getMainImage(card);
    const textCell = getTextContent(card);
    rows.push([imageCell, textCell]);
  });

  // Create block and replace
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
