/* global WebImporter */
export default function parse(element, { document }) {
  // Header row should be a single column, per the example
  const headerRow = ['Columns (columns21)'];

  // Find the main columns wrapper
  const wrapper = element.querySelector('.b2c-2025-inclusions__wrapper');
  if (!wrapper) return;
  // There should be two columns: text and image/media
  const columns = Array.from(wrapper.children);
  if (columns.length < 2) return;

  // ----- Column 1: Textual Content (reference all content in order) -----
  const textCol = columns[0];
  let column1Content = [];
  Array.from(textCol.children).forEach(child => {
    if (child.textContent.trim() !== '') {
      column1Content.push(child);
    }
  });

  // ----- Column 2: Media Content -----
  const mediaCol = columns[1];
  let column2Content = [];
  const videoEl = mediaCol.querySelector('video');
  if (videoEl) {
    const source = videoEl.querySelector('source');
    let videoSrc = null;
    if (source && source.getAttribute('src')) {
      videoSrc = source.getAttribute('src');
    } else if (videoEl.getAttribute('src')) {
      videoSrc = videoEl.getAttribute('src');
    }
    if (videoSrc) {
      const link = document.createElement('a');
      link.href = videoSrc;
      link.textContent = 'Video';
      column2Content.push(link);
    }
  }

  // Compose the cells array: header is single cell, second row has two cells
  const cells = [
    headerRow,
    [column1Content, column2Content]
  ];

  // Create the table block and replace the original element
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
