/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to add <br> only if needed
  function addBr(arr) {
    if (arr.length) arr.push(document.createElement('br'));
  }

  const headerRow = ['Cards (cards17)'];
  const rows = [];

  // Find the direct grid container (skip any wrapper divs)
  const grid = element.querySelector(':scope > div');
  if (!grid) return;

  // Get all the card elements (immediate children)
  const cardElements = grid.querySelectorAll(':scope > div.posts-grid__grid-element');

  cardElements.forEach((cardEl) => {
    // Find the image (figure > a > img)
    let img = cardEl.querySelector('figure img');
    // If image is missing, use an empty string for first cell
    let imgCell = img ? img : '';

    // Now build the right cell: title, description, date, CTA
    const content = cardEl.querySelector('.article-card__content');
    const cellContent = [];

    // Date (span)
    const date = content && content.querySelector('.article-card__eyelet');
    if (date && date.textContent.trim()) {
      addBr(cellContent);
      const small = document.createElement('small');
      small.textContent = date.textContent.trim();
      cellContent.push(small);
    }

    // Heading (h4 > a)
    const heading = content && content.querySelector('h4');
    if (heading && heading.textContent.trim()) {
      addBr(cellContent);
      // Use <strong> for the heading, preserving text
      const strong = document.createElement('strong');
      strong.textContent = heading.textContent.trim();
      cellContent.push(strong);
    }

    // Description (div.article-card__excerpt)
    const desc = content && content.querySelector('.article-card__excerpt');
    if (desc && desc.textContent.trim()) {
      addBr(cellContent);
      cellContent.push(document.createTextNode(desc.textContent.trim()));
    }

    // CTA (a, but not inside heading)
    let cta;
    if (content) {
      // Find all <a> elements inside .article-card__content
      const links = Array.from(content.querySelectorAll('a'));
      // Filter out those that are inside the heading
      cta = links.find(a => !heading || !heading.contains(a));
    }
    if (cta && cta.textContent.trim()) {
      addBr(cellContent);
      cellContent.push(cta);
    }

    // Build the row: [image cell, right cell]
    rows.push([imgCell, cellContent]);
  });

  // Create the block table
  const cells = [headerRow, ...rows];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
