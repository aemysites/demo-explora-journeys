/* global WebImporter */
export default function parse(element, { document }) {
  // Find the carousel block
  const carouselEl = element.querySelector('.b2c-2025-carousels-payoffs');
  if (!carouselEl) return;

  // Find the swiper-wrapper that contains all slides
  const swiperWrapper = carouselEl.querySelector('.swiper-wrapper');
  if (!swiperWrapper) return;

  // Only include unique slides (not duplicates)
  const slideEls = Array.from(swiperWrapper.children).filter(slide =>
    slide.classList.contains('swiper-slide') &&
    !slide.classList.contains('swiper-slide-duplicate')
  );

  // Header row for a 2-column table: block name and empty string
  const rows = [['Carousel (carousel22)', '']];

  // Each slide is a row: [image, text-content]. No image in sample HTML, so first cell is empty.
  slideEls.forEach(slide => {
    const contentWrapper = slide.querySelector('.b2c-2025-carousels-payoffs__slide');
    if (!contentWrapper) return;
    // Reference all direct children from contentWrapper so we get all text content and structure
    const textContent = Array.from(contentWrapper.children);
    if (textContent.length === 0) return;
    rows.push(['', textContent]);
  });

  // Create the table block
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
