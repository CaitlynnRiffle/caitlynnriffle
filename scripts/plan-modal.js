(function () {
  let styleInjected = false;

  function injectStyles() {
    if (styleInjected) return;
    styleInjected = true;
    const style = document.createElement('style');
    style.textContent = `
      .plan-modal-overlay {
        position: fixed;
        inset: 0;
        background: rgba(2, 6, 23, 0.82);
        display: none;
        align-items: center;
        justify-content: center;
        z-index: 9999;
      }
      .plan-modal-overlay.open { display: flex; }
      .plan-modal-panel {
        width: min(95vw, 1300px);
        height: min(90vh, 900px);
        background: #0b1220;
        border: 1px solid rgba(226, 232, 240, 0.35);
        position: relative;
        overflow: hidden;
      }
      .plan-modal-toolbar {
        position: absolute;
        top: 10px;
        left: 10px;
        display: flex;
        gap: 0.4rem;
        z-index: 2;
      }
      .plan-modal-cloned-controls {
        z-index: 2;
      }
      .plan-modal-cloned-controls .viewer-btn {
        min-width: 112px;
      }
      @media (max-width: 899px) {
        .plan-modal-cloned-controls {
          position: absolute !important;
          top: 10px;
          right: 10px;
          margin-top: 0;
          grid-template-columns: 1fr;
        }
        .plan-modal-cloned-controls .viewer-btn {
          min-width: 0;
        }
      }
      .plan-modal-btn {
        border: 1px solid rgba(226, 232, 240, 0.45);
        background: rgba(2, 6, 23, 0.9);
        color: #e2e8f0;
        cursor: pointer;
        padding: 0.2rem 0.55rem;
        font: inherit;
      }
      .plan-modal-stage {
        width: 100%;
        height: 100%;
        display: grid;
        place-items: center;
        cursor: grab;
      }
      .plan-modal-stage.dragging { cursor: grabbing; }
      .plan-modal-image {
        max-width: 95%;
        max-height: 95%;
        object-fit: contain;
        transform-origin: center center;
        will-change: transform;
        user-select: none;
        pointer-events: none;
      }
    `;
    document.head.appendChild(style);
  }

  function createModal() {
    injectStyles();
    const overlay = document.createElement('div');
    overlay.className = 'plan-modal-overlay';
    overlay.innerHTML = `
      <div class="plan-modal-panel" role="dialog" aria-modal="true" aria-label="Plan image viewer">
        <div class="plan-modal-toolbar">
          <button class="plan-modal-btn" data-pm="out">-</button>
          <button class="plan-modal-btn" data-pm="in">+</button>
          <button class="plan-modal-btn" data-pm="reset">reset</button>
          <button class="plan-modal-btn" data-pm="close">close</button>
        </div>
        <div class="plan-modal-stage"><img class="plan-modal-image" alt="Plan zoom view" /></div>
      </div>
    `;
    document.body.appendChild(overlay);

    const stage = overlay.querySelector('.plan-modal-stage');
    const panel = overlay.querySelector('.plan-modal-panel');
    const image = overlay.querySelector('.plan-modal-image');
    let clonedControls = null;
    let syncControls = null;
    let scale = 1;
    let offsetX = 0;
    let offsetY = 0;
    let dragging = false;
    let startX = 0;
    let startY = 0;

    const render = () => {
      image.style.transform = `translate(${offsetX}px, ${offsetY}px) scale(${scale})`;
    };

    const reset = () => {
      scale = 1;
      offsetX = 0;
      offsetY = 0;
      render();
    };

    const clearClonedControls = () => {
      if (clonedControls) {
        clonedControls.remove();
        clonedControls = null;
      }
      syncControls = null;
    };

    const syncClonedControls = (sourceControls) => {
      if (!clonedControls || !sourceControls) return;
      const sourceButtons = Array.from(sourceControls.querySelectorAll('[data-sheet]'));
      const clonedButtons = Array.from(clonedControls.querySelectorAll('[data-sheet]'));
      clonedButtons.forEach((button) => {
        const sourceButton = sourceButtons.find((candidate) => candidate.dataset.sheet === button.dataset.sheet);
        button.classList.toggle('active', Boolean(sourceButton?.classList.contains('active')));
      });
    };

    const attachClonedControls = (sourceImage) => {
      clearClonedControls();
      const controlsSelector = sourceImage?.dataset.modalControls;
      if (!controlsSelector) return;
      const sourceControls = document.querySelector(controlsSelector);
      if (!sourceControls) return;

      clonedControls = sourceControls.cloneNode(true);
      clonedControls.id = `${sourceControls.id || 'plan-controls'}-modal`;
      clonedControls.classList.add('plan-modal-cloned-controls');

      Array.from(clonedControls.querySelectorAll('[data-sheet]')).forEach((button) => {
        button.addEventListener('click', () => {
          const sourceButton = sourceControls.querySelector(`[data-sheet="${button.dataset.sheet}"]`);
          sourceButton?.click();
          image.src = sourceImage.currentSrc || sourceImage.src;
          syncClonedControls(sourceControls);
        });
      });

      syncControls = () => {
        image.src = sourceImage.currentSrc || sourceImage.src;
        syncClonedControls(sourceControls);
      };

      panel.appendChild(clonedControls);
      syncControls();
    };

    const closeModal = () => {
      overlay.classList.remove('open');
      clearClonedControls();
      reset();
      image.src = '';
    };

    overlay.querySelector('[data-pm="in"]').addEventListener('click', () => {
      scale = Math.min(5, scale + 0.2);
      render();
    });

    overlay.querySelector('[data-pm="out"]').addEventListener('click', () => {
      scale = Math.max(0.5, scale - 0.2);
      render();
    });

    overlay.querySelector('[data-pm="reset"]').addEventListener('click', reset);

    overlay.querySelector('[data-pm="close"]').addEventListener('click', closeModal);

    overlay.addEventListener('click', (event) => {
      if (event.target === overlay) {
        closeModal();
      }
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        closeModal();
      }
    });

    stage.addEventListener('wheel', (event) => {
      event.preventDefault();
      const delta = event.deltaY > 0 ? -0.1 : 0.1;
      scale = Math.min(5, Math.max(0.5, scale + delta));
      render();
    }, { passive: false });

    stage.addEventListener('mousedown', (event) => {
      dragging = true;
      stage.classList.add('dragging');
      startX = event.clientX - offsetX;
      startY = event.clientY - offsetY;
    });

    window.addEventListener('mouseup', () => {
      dragging = false;
      stage.classList.remove('dragging');
    });

    window.addEventListener('mousemove', (event) => {
      if (!dragging) return;
      offsetX = event.clientX - startX;
      offsetY = event.clientY - startY;
      render();
    });

    return {
      open(sourceImage) {
        const src = sourceImage.dataset.fullsrc || sourceImage.currentSrc || sourceImage.src;
        if (!src) return;
        image.src = src;
        attachClonedControls(sourceImage);
        reset();
        overlay.classList.add('open');
      }
    };
  }

  const modal = createModal();

  window.attachPlanModal = function attachPlanModal(selector) {
    const elements = Array.from(document.querySelectorAll(selector));
    elements.forEach((element) => {
      element.style.cursor = 'zoom-in';
      element.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
        modal.open(element);
      });
    });
  };
})();
