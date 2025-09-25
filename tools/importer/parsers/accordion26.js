/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get all accordion items
  function getAccordionItems(root) {
    const items = [];
    // Defensive: find all .faq-accordion blocks (could be multiple)
    const accordionBlocks = root.querySelectorAll('.faq-accordion');
    accordionBlocks.forEach((accordion) => {
      // Each item is a pair of .faqAcc__question and .faqAcc__content
      const questions = accordion.querySelectorAll('.faqAcc__question');
      const contents = accordion.querySelectorAll('.faqAcc__content');
      // Defensive: match questions and contents by order
      for (let i = 0; i < questions.length; i++) {
        const question = questions[i];
        const content = contents[i];
        if (question && content) {
          // Remove extraneous attributes and unwrap question content
          let titleContent = document.createElement('div');
          Array.from(question.childNodes).forEach((node) => titleContent.appendChild(node.cloneNode(true)));
          // Defensive: grab the content block (usually a div with paragraphs)
          let contentBlock = content;
          if (content.children.length === 1 && content.firstElementChild.tagName === 'DIV') {
            contentBlock = content.firstElementChild;
          }
          // Remove extraneous attributes and unwrap content
          let bodyContent = document.createElement('div');
          Array.from(contentBlock.childNodes).forEach((node) => bodyContent.appendChild(node.cloneNode(true)));
          items.push([titleContent, bodyContent]);
        }
      }
    });
    return items;
  }

  // Build table cells
  const cells = [];
  // Header row
  cells.push(['Accordion (accordion26)']);

  // Find the main accordion container
  const accordionItems = getAccordionItems(element);

  // Add each accordion item as a row
  accordionItems.forEach(([titleEl, contentEl]) => {
    cells.push([
      titleEl,
      contentEl,
    ]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Fix header row colspan to visually align with data rows
  const thead = block.querySelector('thead');
  if (thead && thead.rows[0] && thead.rows[0].cells[0]) {
    thead.rows[0].cells[0].setAttribute('colspan', '2');
  }

  // Replace original element
  element.replaceWith(block);
}
