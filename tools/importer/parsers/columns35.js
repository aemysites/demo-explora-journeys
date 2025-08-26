/* global WebImporter */
export default function parse(element, { document }) {
  // Find the multiCol__wrap, which contains the column content
  const wrap = element.querySelector('.multiCol__wrap');
  if (!wrap) return;

  // Each column is a direct child with class body-script
  const columnDivs = Array.from(wrap.children).filter(child => child.classList.contains('body-script'));

  // For each column, extract its main content (in this example, the image inside a <picture>)
  const columnContents = columnDivs.map(col => {
    // If there's an image in a <picture> tag, reference the picture element
    const picture = col.querySelector('picture');
    if (picture) {
      // Patch the <img> src for output if needed (if missing src)
      const img = picture.querySelector('img');
      if (img && !img.getAttribute('src')) {
        // Try to find a usable src from the <source> or data-asset attribute
        let src = '';
        // Prefer the highest-res src from the <source> srcset
        const sources = Array.from(picture.querySelectorAll('source'));
        if (sources.length > 0 && sources[sources.length - 1].srcset) {
          // Use only the first src in srcset
          src = sources[sources.length - 1].srcset.split(',')[0].trim();
        }
        if (!src) src = picture.getAttribute('data-asset');
        if (src) img.setAttribute('src', src);
      }
      return picture;
    }
    // If no picture, include the column content as is
    return col;
  });

  // Construct the table: header then row of columns
  // The header row should have just one cell, per the example
  // The data row should have N cells, one for each column
  // To ensure the header row is a single-cell row, we use a single-element array for the header
  const tableCells = [
    ['Columns (columns35)'],      // Header row (one column)
    [...columnContents]           // Data row (N columns)
  ];

  const table = WebImporter.DOMUtils.createTable(tableCells, document);
  element.replaceWith(table);
}
