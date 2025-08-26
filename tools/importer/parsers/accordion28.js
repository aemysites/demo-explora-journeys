/* global WebImporter */
export default function parse(element, { document }) {
  // Collect all direct children of the accordion group
  const children = Array.from(element.children);

  // Collect the accordion items as pairs of [question, content]
  const items = [];
  for (let i = 0; i < children.length; i++) {
    const child = children[i];
    if (child.classList.contains('faqAcc__question')) {
      let contentDiv = null;
      for (let j = i + 1; j < children.length; j++) {
        if (children[j].classList.contains('faqAcc__content')) {
          contentDiv = children[j];
          break;
        }
        if (children[j].classList.contains('faqAcc__question')) {
          break;
        }
      }
      if (!contentDiv) continue;
      items.push([child, contentDiv]);
    }
  }

  // Manually create the table so the header row has only one column (no extra <th>)
  const table = document.createElement('table');

  // Header row: single column
  const headerTr = document.createElement('tr');
  const headerTh = document.createElement('th');
  headerTh.textContent = 'Accordion (accordion28)';
  headerTr.appendChild(headerTh);
  table.appendChild(headerTr);

  // Data rows: two columns
  items.forEach(pair => {
    const tr = document.createElement('tr');
    pair.forEach(cell => {
      const td = document.createElement('td');
      td.appendChild(cell);
      tr.appendChild(td);
    });
    table.appendChild(tr);
  });

  element.replaceWith(table);
}
