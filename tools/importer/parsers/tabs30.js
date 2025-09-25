/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get all tab panels and their corresponding labels/content
  function getTabsAndContent(el) {
    // Find the nav container
    const nav = el.querySelector('.accordion-with-images__content__nav');
    // Find all tab label containers
    let labelDivs = [];
    if (nav) {
      labelDivs = Array.from(nav.querySelectorAll('.accordion-with-images__content__nav__item'));
    }
    // Find all tab panel containers
    let panelDivs = [];
    if (nav) {
      panelDivs = Array.from(nav.querySelectorAll('.accordion-with-images__content__nav__panel'));
    }
    // Defensive: If panels are not found, try fallback in the root
    if (panelDivs.length === 0) {
      panelDivs = Array.from(el.querySelectorAll('.accordion-with-images__content__nav__panel'));
    }
    // If still not found, fallback to slides
    if (panelDivs.length === 0) {
      panelDivs = Array.from(el.querySelectorAll('.accordion-with-images__content__items__slide'));
    }
    // Pair labels and panels by index
    const tabs = [];
    for (let i = 0; i < Math.max(labelDivs.length, panelDivs.length); i++) {
      // Label
      let label = '';
      if (labelDivs[i]) {
        const labelItem = labelDivs[i].querySelector('p');
        if (labelItem) label = labelItem.textContent.trim();
      }
      // Content: find the title, description, and image inside the panel
      let contentArr = [];
      const panel = panelDivs[i];
      if (panel) {
        // If it's a nav panel, look for text-wrapper inside
        let textWrapper = panel.querySelector('.accordion-with-images__content__items__slide__text-wrapper');
        if (!textWrapper && panel.classList.contains('accordion-with-images__content__items__slide')) {
          textWrapper = panel.querySelector('.accordion-with-images__content__items__slide__text-wrapper') || panel;
        }
        if (textWrapper) {
          // Title
          const title = textWrapper.querySelector('.accordion-with-images__content__items__slide__title');
          if (title) contentArr.push(title);
          // Description
          const desc = textWrapper.querySelector('.accordion-with-images__content__items__slide__description');
          if (desc) contentArr.push(desc);
        }
        // Image
        let imageDiv = panel.querySelector('.accordion-with-images__content__items__slide__image picture');
        if (!imageDiv && panel.classList.contains('accordion-with-images__content__items__slide')) {
          imageDiv = panel.querySelector('picture');
        }
        if (imageDiv) contentArr.push(imageDiv);
      }
      // Fallback: If label is missing, try to get from title
      if (!label && contentArr.length) {
        const firstTitle = contentArr.find(e => e.classList && e.classList.contains('accordion-with-images__content__items__slide__title'));
        if (firstTitle) {
          const p = firstTitle.querySelector('p');
          if (p) label = p.textContent.trim();
        }
      }
      // Defensive: If still missing, try to get label from panel itself
      if (!label && panel) {
        const possibleTitle = panel.querySelector('.accordion-with-images__content__items__slide__title p');
        if (possibleTitle) label = possibleTitle.textContent.trim();
      }
      // Only add if label or content exists
      if ((label && label.length > 0) || contentArr.length) {
        tabs.push([label, contentArr]);
      }
    }
    return tabs;
  }

  // Find the root accordion block
  let root = element.querySelector('.accordion-with-images');
  if (!root) root = element;
  // Get tabs and their content
  const tabs = getTabsAndContent(root);

  // Table header row
  const headerRow = ['Tabs (tabs30)'];
  // Build table rows: each tab is a row [label, content]
  const rows = tabs.map(([label, contentArr]) => [label, contentArr]);
  // Compose table cells
  const cells = [headerRow, ...rows];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);
  // Replace the original element
  element.replaceWith(block);
}
