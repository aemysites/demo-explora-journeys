/* global WebImporter */
export default function parse(element, { document }) {
  // Header row: block name as required in the spec and example
  const cells = [['Tabs (tabs30)']];

  // Find the content navigation (labels) and content panels for each tab
  const content = element.querySelector('.accordion-with-images__content');
  if (!content) return;

  // Get nav labels and their corresponding panels (flexible for variations)
  const navItems = Array.from(content.querySelectorAll('.accordion-with-images__content__nav__item'));
  const navPanels = Array.from(content.querySelectorAll('.accordion-with-images__content__nav__panel'));

  // If we have labels and panels (preferred structure)
  if (navItems.length && navPanels.length && navItems.length === navPanels.length) {
    navItems.forEach((navItem, i) => {
      // Extract the label: prefer <p> tag if present, fallback to textContent
      let label = '';
      const p = navItem.querySelector('p');
      label = p ? p.textContent.trim() : navItem.textContent.trim();
      if (!label) label = `Tab ${i+1}`;

      const panel = navPanels[i];
      // Gather all direct children for the content, ensuring all text & images are included
      const tabContentNodes = Array.from(panel.childNodes).filter((n) => {
        // skip comments and empty whitespace
        if (n.nodeType === 8) return false;
        if (n.nodeType === 3 && !n.textContent.trim()) return false;
        return true;
      });
      // Fallback: if nothing found, push the full panel
      const tabContent = tabContentNodes.length ? tabContentNodes : [panel];
      cells.push([label, tabContent]);
    });
  } else {
    // Fallback if nav/panels not found: try to extract slides
    const slides = Array.from(element.querySelectorAll('.accordion-with-images__content__items__slide'));
    slides.forEach((slide, i) => {
      let label = '';
      const title = slide.querySelector('.accordion-with-images__content__items__slide__title');
      label = title ? title.textContent.trim() : `Tab ${i+1}`;
      // All direct children for content
      const tabContentNodes = Array.from(slide.childNodes).filter((n) => {
        if (n.nodeType === 8) return false;
        if (n.nodeType === 3 && !n.textContent.trim()) return false;
        return true;
      });
      const tabContent = tabContentNodes.length ? tabContentNodes : [slide];
      cells.push([label, tabContent]);
    });
  }

  // Build table and replace original element
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
