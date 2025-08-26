/* global WebImporter */
export default function parse(element, { document }) {
  // Header row for the block
  const headerRow = ['Accordion (accordion26)'];
  const rows = [headerRow];

  // Find the accordion container
  const faqAccordion = element.querySelector('.faq-accordion');
  if (faqAccordion) {
    // Support multiple groups/items if present
    const groups = faqAccordion.querySelectorAll('.faqAcc__group');
    groups.forEach((group) => {
      // Title cell: expect a question element
      const question = group.querySelector('.faqAcc__question');
      // Content cell: expect a content element
      const content = group.querySelector('.faqAcc__content');
      if (question && content) {
        // Reference the actual DOM elements for table cells
        rows.push([
          question,
          content
        ]);
      }
    });
  }

  // If there are no groups, don't create a table (edge case)
  if (rows.length === 1) return;

  // Create the block table and replace the original element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
