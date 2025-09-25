/* global WebImporter */
export default function parse(element, { document }) {
  // Prepare header row as required
  const headerRow = ['Accordion (accordion38)'];
  const rows = [headerRow];

  // Accordion items are pairs of .faqAcc__question and .faqAcc__content
  const children = Array.from(element.children);
  for (let i = 0; i < children.length; i++) {
    const questionEl = children[i];
    if (!questionEl.classList.contains('faqAcc__question')) continue;
    const contentEl = children[i + 1];
    if (!contentEl || !contentEl.classList.contains('faqAcc__content')) continue;

    // Title cell: use plain text only
    const titleText = questionEl.textContent.trim();

    // Content cell: use the inner content of the content element
    let contentCell;
    const innerDivs = contentEl.querySelectorAll(':scope > div');
    if (innerDivs.length === 1) {
      contentCell = Array.from(innerDivs[0].childNodes);
    } else {
      contentCell = Array.from(contentEl.childNodes);
    }
    contentCell = contentCell.filter(node => {
      if (node.nodeType === Node.TEXT_NODE) {
        return node.textContent.trim().length > 0;
      }
      return true;
    });

    rows.push([titleText, contentCell]);
    i++; // Skip the content node in the next loop
  }

  // Create table and replace element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
