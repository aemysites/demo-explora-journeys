/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to find all unique slides (ignore duplicates)
  function getUniqueSlides(slides) {
    const seen = new Set();
    const unique = [];
    slides.forEach((slide) => {
      // Use the quote text as a unique key
      const titleDiv = slide.querySelector('.b2c-2025-carousels-payoffs__title');
      const quote = titleDiv ? titleDiv.textContent.trim() : '';
      if (quote && !seen.has(quote)) {
        seen.add(quote);
        unique.push(slide);
      }
    });
    return unique;
  }

  // Find the carousel wrapper containing slides
  const carouselWrapper = element.querySelector('.b2c-2025-carousels-payoffs__wrapper');
  if (!carouselWrapper) return;

  // Find the swiper-wrapper containing the slides
  const swiperWrapper = carouselWrapper.querySelector('.swiper-wrapper');
  if (!swiperWrapper) return;

  // Find all slide elements (ignore nested duplicates)
  const rawSlides = Array.from(swiperWrapper.querySelectorAll(':scope > .b2c-2025-carousels-payoffs__slide'));
  const slides = getUniqueSlides(rawSlides);

  // Build table rows
  const headerRow = ['Carousel (carousel22)'];
  const rows = [headerRow];

  // Use fallback image for each slide (since no image in HTML)
  const fallbackImage = 'https://main--demo-explora-journeys--aemysites.aem.page/media_1db28012efa31eab10e70311da3a8120431c01555.jpg#width=750&height=584';

  slides.forEach((slide) => {
    // Each slide has a nested .b2c-2025-carousels-payoffs__slide
    const innerSlide = slide.querySelector('.b2c-2025-carousels-payoffs__slide') || slide;

    // First cell: fallback image (mandatory)
    const img = document.createElement('img');
    img.src = fallbackImage;
    img.alt = '';
    const imageCell = img;

    // Second cell: text content
    // Instead of only grabbing .b2c-2025-carousels-payoffs__title and subtitle,
    // grab all content from innerSlide and include it in the cell
    const textCellContent = [];
    // Get all children of innerSlide
    Array.from(innerSlide.children).forEach(child => {
      // Only add elements with text content
      if (child.textContent && child.textContent.trim()) {
        // Clone the node to preserve structure
        textCellContent.push(child.cloneNode(true));
      }
    });

    rows.push([imageCell, textCellContent]);
  });

  // Create block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace original element
  element.replaceWith(block);
}
