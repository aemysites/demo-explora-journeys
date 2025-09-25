/* global WebImporter */
export default function parse(element, { document }) {
  // Get all question and content pairs in order
  const questions = element.querySelectorAll('.faqAcc__question');
  const rows = [ ['Accordion (accordion28)'] ];

  questions.forEach((question) => {
    // Find the next sibling .faqAcc__content
    let content = question.nextElementSibling;
    while (content && !content.classList.contains('faqAcc__content')) {
      content = content.nextElementSibling;
    }
    if (content) {
      rows.push([
        question.textContent.trim(),
        Array.from(content.querySelectorAll('p,a')).map(el => el.cloneNode(true))
      ]);
    }
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
