/* global WebImporter */
export default function parse(element, { document }) {
  // Table header row
  const headerRow = ['Cards (cards17)'];
  const rows = [headerRow];

  // Defensive: find the grid container
  const grid = element.querySelector('.posts-grid__grid');
  if (!grid) return;

  // Get all card elements
  const cardElements = grid.querySelectorAll(':scope > .posts-grid__grid-element');

  cardElements.forEach((cardEl) => {
    // Find the article-card inside each grid element
    const article = cardEl.querySelector('.article-card');
    if (!article) return;

    // --- Image cell ---
    let imageEl = null;
    const figure = article.querySelector('figure');
    if (figure) {
      imageEl = figure.querySelector('img');
    }

    // --- Text cell ---
    const content = article.querySelector('.article-card__content');
    const textCellContent = [];
    if (content) {
      // Date (eyelet)
      const dateSpan = content.querySelector('.article-card__eyelet');
      if (dateSpan) {
        // Remove problematic min-height style
        dateSpan.removeAttribute('style');
        textCellContent.push(dateSpan);
      }
      // Title (h4)
      const titleH4 = content.querySelector('.article-card__title');
      if (titleH4) {
        titleH4.removeAttribute('style');
        textCellContent.push(titleH4);
      }
      // Description (excerpt)
      const excerptDiv = content.querySelector('.article-card__excerpt');
      if (excerptDiv) {
        excerptDiv.removeAttribute('style');
        textCellContent.push(excerptDiv);
      }
      // CTA (Read More link)
      const ctaLink = content.querySelector('a.text-deco--underline');
      if (ctaLink) {
        textCellContent.push(ctaLink);
      }
    }

    // Add the row: [image, text content]
    rows.push([
      imageEl ? imageEl : '',
      textCellContent
    ]);
  });

  // Create the table block
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
