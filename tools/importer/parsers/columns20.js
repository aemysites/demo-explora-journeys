/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as specified
  const headerRow = ['Columns (columns20)'];

  // Attempt to get the first carousel slide (should be exactly one for this block)
  const slide = element.querySelector('.carousel-offers__media_carousel__slide');

  // Fallback for non-existing slide
  if (!slide) {
    // Empty block table fallback
    const block = WebImporter.DOMUtils.createTable([
      headerRow,
      ['', ''],
    ], document);
    element.replaceWith(block);
    return;
  }

  // LEFT COLUMN: the image
  let leftCell = '';
  const imgWrapper = slide.querySelector('.carousel-offers__media_carousel__slide_image');
  if (imgWrapper) {
    // Reference the <picture> element (prefer) or the <img>
    const picture = imgWrapper.querySelector('picture');
    if (picture) {
      leftCell = picture;
    } else {
      const img = imgWrapper.querySelector('img');
      if (img) leftCell = img;
    }
  }

  // RIGHT COLUMN: label, title, description, CTA (all inline)
  const textWrapper = slide.querySelector('.carousel-offers__media_carousel__slide_text');
  let rightCellContent = [];
  if (textWrapper) {
    // Label
    const label = textWrapper.querySelector('.carousel-offers__label_item');
    if (label) rightCellContent.push(label);
    // Title (may be p inside rich-text-content)
    const titleBlock = textWrapper.querySelector('.carousel-offers__slide_title');
    if (titleBlock) rightCellContent.push(titleBlock);
    // Description
    const descBlock = textWrapper.querySelector('.carousel-offers__slide_description');
    if (descBlock) rightCellContent.push(descBlock);
    // CTA button
    const ctaBlock = textWrapper.querySelector('.carousel-offers__slide_cta');
    if (ctaBlock) rightCellContent.push(ctaBlock);
  }
  // If nothing found, leave empty string
  const rightCell = rightCellContent.length > 0 ? rightCellContent : '';

  // Compose table cells: header row, then the one content row with two columns
  const cells = [
    headerRow,
    [leftCell, rightCell],
  ];

  // Create and replace
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
