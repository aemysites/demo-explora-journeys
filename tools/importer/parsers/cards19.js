/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Find the carousel cards wrapper and all card elements
  const wrapper = element.querySelector('.b2c-2025-carousel__wrapper');
  if (!wrapper) return;

  const cardNodes = wrapper.querySelectorAll('.b2c-2025-carousel__column');
  const rows = [['Cards (cards19)']];

  cardNodes.forEach(card => {
    // --- First column: image or video as element/link ---
    let mediaContent = null;
    const media = card.querySelector('.b2c-2025-column-image__media');
    if (media) {
      const picture = media.querySelector('picture');
      if (picture) {
        mediaContent = picture;
      } else {
        const videoContainer = media.querySelector('.video-container');
        if (videoContainer) {
          const video = videoContainer.querySelector('video');
          let videoSrc = '';
          if (video) {
            const source = video.querySelector('source[src]');
            if (source && source.src) {
              videoSrc = source.src;
            } else if (video.src) {
              videoSrc = video.src;
            }
          }
          if (videoSrc) {
            const a = document.createElement('a');
            a.href = videoSrc;
            a.textContent = 'Watch Video';
            mediaContent = a;
          } else {
            // fallback: reference video container
            mediaContent = videoContainer;
          }
        } else {
          // fallback: reference whatever media is
          mediaContent = media;
        }
      }
    }
    // --- Second column: title, description, CTA (as elements) ---
    const textWrapper = card.querySelector('.b2c-2025-column-image__text-wrapper');
    const textCellContents = [];
    if (textWrapper) {
      // Title (may be rich text)
      const title = textWrapper.querySelector('.b2c-2025-column-image__title');
      if (title) textCellContents.push(title);
      // Description (subtitle)
      const subtitle = textWrapper.querySelector('.b2c-2025-column-image__subtitle');
      if (subtitle) textCellContents.push(subtitle);
      // CTA button (optional)
      const cta = textWrapper.querySelector('.b2c-2025-column-image__button');
      if (cta) textCellContents.push(cta);
    }
    // Edge case: If no media or text, skip row
    if (!mediaContent && textCellContents.length === 0) return;
    // Compose row
    rows.push([mediaContent, textCellContents]);
  });

  // 3. Create table and replace in DOM
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
