/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Table header must match exactly
  const headerRow = ['Tabs (tabs33)'];
  const cells = [headerRow];

  // 2. Extract tab labels and contents in correct order
  // Try to find nav items and panels first
  let tabLabels = [];
  let tabContents = [];
  const navItems = Array.from(element.querySelectorAll('.accordion-with-images__content__nav__item'));
  const navPanels = Array.from(element.querySelectorAll('.accordion-with-images__content__nav__panel'));

  if (navItems.length && navPanels.length && navItems.length === navPanels.length) {
    // Both nav items and panels found and matched in count
    tabLabels = navItems.map(item => item.textContent.trim());
    tabContents = navPanels.map(panel => {
      // Combine all content within panel: text, images, lists, etc.
      const contentFragments = [];
      // Extract text wrapper content (usually contains heading, description, etc)
      const textWrapper = panel.querySelector('.accordion-with-images__content__items__slide__text-wrapper');
      if (textWrapper) {
        Array.from(textWrapper.children).forEach(child => {
          contentFragments.push(child);
        });
      }
      // Extract image wrapper content
      const imageWrapper = panel.querySelector('.accordion-with-images__content__items__slide__image');
      if (imageWrapper) {
        Array.from(imageWrapper.children).forEach(child => {
          contentFragments.push(child);
        });
      }
      // Ensure NO text content is missed: If neither found, include all children of panel
      if (contentFragments.length === 0) {
        Array.from(panel.children).forEach(child => {
          contentFragments.push(child);
        });
        if (contentFragments.length === 0) {
          contentFragments.push(panel);
        }
      }
      // If only one element, don't wrap in array
      return contentFragments.length === 1 ? contentFragments[0] : contentFragments;
    });
  } else {
    // Fallback: use swiper slides
    const slides = Array.from(element.querySelectorAll('.accordion-with-images__content__items__slide'));
    tabLabels = slides.map(slide => {
      const titleEl = slide.querySelector('.accordion-with-images__content__items__slide__title p');
      return titleEl ? titleEl.textContent.trim() : 'Tab';
    });
    tabContents = slides.map(slide => {
      const contentFragments = [];
      const textWrapper = slide.querySelector('.accordion-with-images__content__items__slide__text-wrapper');
      if (textWrapper) {
        Array.from(textWrapper.children).forEach(child => {
          contentFragments.push(child);
        });
      }
      const imageWrapper = slide.querySelector('.accordion-with-images__content__items__slide__image');
      if (imageWrapper) {
        Array.from(imageWrapper.children).forEach(child => {
          contentFragments.push(child);
        });
      }
      if (contentFragments.length === 0) {
        Array.from(slide.children).forEach(child => {
          contentFragments.push(child);
        });
        if (contentFragments.length === 0) {
          contentFragments.push(slide);
        }
      }
      return contentFragments.length === 1 ? contentFragments[0] : contentFragments;
    });
  }

  // 3. Add each tab row to table
  for (let i = 0; i < tabLabels.length; i++) {
    // Semantic: keep structure, formatting, lists etc.
    cells.push([tabLabels[i], tabContents[i]]);
  }

  // 4. Replace element with new table, do not return
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
