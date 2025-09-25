/* global WebImporter */
export default function parse(element, { document }) {
  // Find the nav root containing tab labels and panels
  const navRoot = element.querySelector('.accordion-with-images__content__nav');
  if (!navRoot) return;

  // Find all tab labels
  const labelDivs = Array.from(
    navRoot.querySelectorAll('.accordion-with-images__content__nav__item')
  );
  // Find all tab panels
  const panelDivs = Array.from(
    navRoot.querySelectorAll('.accordion-with-images__content__nav__panel')
  );
  const tabCount = Math.min(labelDivs.length, panelDivs.length);

  // Compose table rows
  const rows = [];
  // Header row as per block requirements
  const headerRow = ['Tabs (tabs33)'];
  rows.push(headerRow);

  for (let i = 0; i < tabCount; i++) {
    // Tab label
    let labelText = '';
    const p = labelDivs[i].querySelector('p');
    if (p) {
      labelText = p.textContent.trim();
    } else {
      labelText = labelDivs[i].textContent.trim();
    }
    // Tab content: collect all direct children of the panel
    const contentNodes = [];
    // Instead of only the text wrapper and image, include all direct children
    Array.from(panelDivs[i].children).forEach(child => {
      // Only include elements with meaningful content
      if (child.textContent.trim() || child.querySelector('img,picture')) {
        contentNodes.push(child.cloneNode(true));
      }
    });
    rows.push([labelText, contentNodes]);
  }

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element
  element.replaceWith(table);
}
