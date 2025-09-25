/* global WebImporter */
export default function parse(element, { document }) {
  // Find the carousel slides
  const carousel = element.querySelector('.carousel-destinations__media_carousel');
  if (!carousel) return;
  const slides = carousel.querySelectorAll('.carousel-destinations__media_carousel__slide');

  // Table header must match block name exactly
  const rows = [['Cards (cards25)']];

  slides.forEach(slide => {
    // Image: reference the <picture> element directly
    const picture = slide.querySelector('picture');
    const imageCell = picture || '';

    // Title: get the text from the title div
    const titleDiv = slide.querySelector('.carousel-destinations__media_carousel__slide__title');
    let textCell = '';
    if (titleDiv && titleDiv.textContent.trim()) {
      const strong = document.createElement('strong');
      strong.textContent = titleDiv.textContent.trim();
      textCell = strong;
    }

    // Try to find description from the main content block (outside the carousel)
    // We'll use the main description for all cards, as the screenshot shows no per-card description
    const descriptionDiv = element.querySelector('.carousel-destinations__description');
    if (descriptionDiv && descriptionDiv.textContent.trim()) {
      const desc = document.createElement('div');
      desc.textContent = descriptionDiv.textContent.trim();
      // If textCell is already an element, append description below
      if (textCell) {
        const wrapper = document.createElement('div');
        wrapper.appendChild(textCell);
        wrapper.appendChild(desc);
        textCell = wrapper;
      } else {
        textCell = desc;
      }
    }

    rows.push([imageCell, textCell]);
  });

  // Create the table and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
