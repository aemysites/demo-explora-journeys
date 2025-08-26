/* global WebImporter */
export default function parse(element, { document }) {
  // Create header row: must be a single column with exact text
  const cells = [['Cards (cards25)']];

  // Extract block intro (title and description)
  const mainContent = element.querySelector('.carousel-destinations__main_content');
  let introFragments = [];
  if (mainContent) {
    const textContent = mainContent.querySelector('.carousel-destinations__text_content');
    if (textContent) {
      // Grab all children (e.g. title, description)
      Array.from(textContent.children).forEach(child => {
        if (child.textContent.trim()) introFragments.push(child);
      });
    }
  }
  // Block intro should be its own row, NOT part of the header
  if (introFragments.length) {
    cells.push(['', introFragments.length === 1 ? introFragments[0] : introFragments]);
  }

  // Extract cards from carousel
  const carousel = element.querySelector('.carousel-destinations__media_carousel');
  if (carousel) {
    const slides = carousel.querySelectorAll('.carousel-destinations__media_carousel__slide');
    slides.forEach(slide => {
      // IMAGE CELL
      let imageCell = '';
      const picture = slide.querySelector('picture');
      if (picture) {
        let img = picture.querySelector('img');
        if (img && (!img.src || img.src === '')) {
          let src = '';
          const sources = picture.querySelectorAll('source');
          for (const source of sources) {
            const srcset = source.getAttribute('srcset');
            if (srcset) {
              src = srcset.split(',')[0].trim();
              break;
            }
          }
          if (!src && picture.hasAttribute('data-asset')) {
            src = picture.getAttribute('data-asset');
          }
          if (src) img.src = src;
        }
        imageCell = picture;
      }
      // TEXT CELL
      let textCellContent = [];
      const title = slide.querySelector('.carousel-destinations__media_carousel__slide__title');
      if (title && title.textContent.trim()) {
        const strong = document.createElement('strong');
        strong.textContent = title.textContent.trim();
        textCellContent.push(strong);
      }
      // CTA (link)
      const cardLink = slide.querySelector('a.carousel-destinations__media_carousel__slide__link');
      if (cardLink && cardLink.href) {
        const ctaText = cardLink.title ? cardLink.title.trim() : cardLink.textContent.trim();
        // Only add as CTA if not duplicating the title
        if (!textCellContent.length || textCellContent[0].textContent !== ctaText) {
          const cta = document.createElement('a');
          cta.href = cardLink.href;
          cta.textContent = ctaText;
          cta.setAttribute('title', ctaText);
          textCellContent.push(cta);
        }
      }
      if (textCellContent.length === 0 && slide.textContent.trim()) {
        textCellContent.push(document.createTextNode(slide.textContent.trim()));
      }
      cells.push([imageCell, textCellContent.length === 1 ? textCellContent[0] : textCellContent]);
    });
  }

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
