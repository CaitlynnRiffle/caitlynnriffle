(function () {
  function initHoverSwap() {
    const images = Array.from(document.querySelectorAll('img[data-hover-src]'));

    images.forEach((image) => {
      if (image.dataset.hoverBound === 'true') return;
      image.dataset.hoverBound = 'true';

      const original = image.getAttribute('src');
      const hover = image.getAttribute('data-hover-src');
      if (!hover) return;

      const preload = new Image();
      preload.src = hover;

      const card = image.closest('.card, .project-card') || image;

      card.addEventListener('mouseenter', () => {
        image.setAttribute('src', hover);
      });

      card.addEventListener('mouseleave', () => {
        image.setAttribute('src', original);
      });
    });
  }

  window.__initHoverSwap = initHoverSwap;
  initHoverSwap();
})();
