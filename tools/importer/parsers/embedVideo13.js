/* global WebImporter */
export default function parse(element, { document }) {
  // Block header must match exactly
  const headerRow = ['Embed'];

  // Find the <video> element
  const video = element.querySelector('video');
  let videoUrl = '';
  let posterImg = null;

  if (video) {
    // Extract the first <source> src attribute
    const source = video.querySelector('source');
    if (source && source.src) {
      videoUrl = source.src;
    } else if (video.src) {
      videoUrl = video.src;
    }
    // Check for poster attribute
    if (video.hasAttribute('poster')) {
      const posterUrl = video.getAttribute('poster');
      if (posterUrl) {
        posterImg = document.createElement('img');
        posterImg.src = posterUrl;
      }
    }
    // If no poster attribute, try to find a visible image inside the element
    if (!posterImg) {
      const img = element.querySelector('img');
      if (img && img.src) {
        posterImg = img.cloneNode(true);
      }
    }
  }

  // Compose cell content: poster image (if any), then the link
  let cellContent = [];
  if (posterImg) {
    cellContent.push(posterImg);
  }
  if (videoUrl) {
    const link = document.createElement('a');
    link.href = videoUrl;
    link.textContent = videoUrl;
    cellContent.push(link);
  }

  // If no video found, include all text content from the element
  if (!videoUrl) {
    const text = element.textContent.trim();
    if (text) {
      cellContent.push(text);
    }
  }

  // Table structure: header, then cell with content
  const tableRows = [
    headerRow,
    [cellContent]
  ];

  const table = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(table);
}
