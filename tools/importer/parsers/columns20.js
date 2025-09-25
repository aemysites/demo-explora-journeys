/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get direct children by selector
  const getDirectChild = (parent, selector) => {
    return Array.from(parent.children).find((el) => el.matches(selector));
  };

  // Get carousel content root
  const carouselContent = element;

  // Get carousel media carousel
  const mediaCarousel = getDirectChild(carouselContent, '.carousel-offers__media_carousel');
  if (!mediaCarousel) return;

  // Get the first slide (assume only one for this block)
  const swiperWrapper = getDirectChild(mediaCarousel, '.swiper-wrapper');
  if (!swiperWrapper) return;
  const slide = getDirectChild(swiperWrapper, '.carousel-offers__media_carousel__slide');
  if (!slide) return;

  // Get image (picture)
  const imageWrapper = getDirectChild(slide, '.carousel-offers__media_carousel__slide_image');
  let imageEl = null;
  if (imageWrapper) {
    imageEl = imageWrapper.querySelector('picture') || imageWrapper.querySelector('img');
  }

  // Get text column
  const textWrapper = getDirectChild(slide, '.carousel-offers__media_carousel__slide_text');

  // Compose text column content
  const textColumnContent = [];
  if (textWrapper) {
    // Label (if present)
    const labelsWrapper = getDirectChild(textWrapper, '.carousel-offers__labels_wrapper');
    if (labelsWrapper) {
      Array.from(labelsWrapper.children).forEach(label => {
        textColumnContent.push(label);
      });
    }
    // Title
    const title = getDirectChild(textWrapper, '.carousel-offers__slide_title');
    if (title) textColumnContent.push(title);
    // Description
    const desc = getDirectChild(textWrapper, '.carousel-offers__slide_description');
    if (desc) textColumnContent.push(desc);
    // CTA
    const cta = getDirectChild(textWrapper, '.carousel-offers__slide_cta');
    if (cta) textColumnContent.push(cta);
  }

  // Build table rows
  const headerRow = ['Columns (columns20)'];
  const contentRow = [imageEl, textColumnContent];
  const cells = [headerRow, contentRow];

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
