/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get immediate child elements
  function getDirectChildrenByClass(parent, className) {
    return Array.from(parent.children).filter(child => child.classList.contains(className));
  }

  // Get all card elements
  const grid = element.querySelector('.posts-grid__grid');
  if (!grid) return;
  const cardElements = getDirectChildrenByClass(grid, 'posts-grid__grid-element');

  // Table header
  const headerRow = ['Cards (cards15)'];
  const rows = [headerRow];

  // For each card, extract image and text content
  cardElements.forEach(cardEl => {
    const article = cardEl.querySelector('article.article-card');
    if (!article) return;

    // Image (first cell)
    let imgEl = article.querySelector('figure img');
    // Defensive: use the <figure> if no <img> found
    if (!imgEl) {
      imgEl = article.querySelector('figure');
    }

    // Text content (second cell)
    const contentDiv = article.querySelector('.article-card__content');
    if (!contentDiv) return;

    // Compose text cell: time, title, description, CTA
    const textParts = [];

    // Date
    const timeEl = contentDiv.querySelector('time.article-card__date');
    if (timeEl) {
      textParts.push(timeEl);
    }

    // Title (as heading)
    const h4El = contentDiv.querySelector('h4.article-card__title');
    if (h4El) {
      textParts.push(h4El);
    }

    // Description
    const descEl = contentDiv.querySelector('p.article-card__excerpt');
    if (descEl) {
      textParts.push(descEl);
    }

    // CTA (See more)
    const ctaEl = contentDiv.querySelector('a.text-deco--underline');
    if (ctaEl) {
      textParts.push(ctaEl);
    }

    rows.push([
      imgEl,
      textParts
    ]);
  });

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
