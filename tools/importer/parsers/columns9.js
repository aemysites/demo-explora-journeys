/* global WebImporter */
export default function parse(element, { document }) {
  // Table header row
  const headerRow = ['Columns (columns9)'];

  // Get all immediate column containers
  const columnBoxes = Array.from(element.querySelectorAll(':scope > .newFooter__topContainer-box'));

  // Defensive: Only keep non-empty columns
  const columns = columnBoxes.filter(box => {
    // Newsletter column may be empty except for logos
    if (box.classList.contains('newFooter__topContainer-box-logos')) return false;
    // Otherwise, must have at least one child
    return box.children.length > 0;
  });

  // Compose each column cell
  const columnCells = columns.map((box) => {
    // For the newsletter column, combine all its content
    if (box.querySelector('.newFooter__topContainer-box-title-newsletter')) {
      // Newsletter title
      const title = box.querySelector('.newFooter__topContainer-box-title-newsletter');
      // Newsletter main content
      const newsletter = box.querySelector('.newFooter__topContainer-box-newsletter');
      // Compose all social and button content
      const logos = box.querySelector('.newFooter__topContainer-box-logos');
      // Compose cell contents, filter out nulls
      return [title, newsletter, logos].filter(Boolean);
    }
    // For standard columns, combine title and list
    const title = box.querySelector('.newFooter__topContainer-box-title');
    const list = box.querySelector('.newFooter__topContainer-box-list');
    return [title, list].filter(Boolean);
  });

  // Table rows
  const rows = [headerRow, columnCells];

  // Create block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace original element
  element.replaceWith(block);
}
