/* global WebImporter */
export default function parse(element, { document }) {
  // Table header: must match example exactly
  const headerRow = ['Embed'];

  // We want to include all text, structure, images, and video links from the element
  // Reference the actual children of the element (not clones)
  const cellContent = [];

  // Collect all immediate children (structure + text)
  Array.from(element.childNodes).forEach(node => {
    if (node.nodeType === Node.ELEMENT_NODE || node.nodeType === Node.TEXT_NODE) {
      cellContent.push(node);
    }
  });

  // Find a video, and add a link to its src at the end of the cell
  let videoSrc = '';
  const video = element.querySelector('video');
  if (video) {
    const source = video.querySelector('source[src]');
    if (source && source.getAttribute('src')) {
      videoSrc = source.getAttribute('src');
    } else if (video.getAttribute('src')) {
      videoSrc = video.getAttribute('src');
    }
  }

  if (videoSrc) {
    const link = document.createElement('a');
    link.href = videoSrc;
    link.textContent = videoSrc;
    cellContent.push(document.createElement('br'));
    cellContent.push(link);
  }

  // Filter out empty text nodes
  const filteredCellContent = cellContent.filter(node => {
    return !(node.nodeType === Node.TEXT_NODE && node.textContent.trim() === '');
  });

  // Ensure at least empty string if nothing present
  const contentRow = [filteredCellContent.length > 0 ? filteredCellContent : ''];

  // Create block table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow
  ], document);

  // Replace original element with block table
  element.replaceWith(table);
}
