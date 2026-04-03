(function () {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'back-to-top-btn';
  button.setAttribute('aria-label', 'Back to top');
  button.textContent = '↑ Top';

  Object.assign(button.style, {
    position: 'fixed',
    right: '18px',
    bottom: '18px',
    zIndex: '1000',
    border: '1px solid rgba(148,163,184,0.5)',
    background: 'rgba(15,23,42,0.92)',
    color: '#e5e7eb',
    padding: '0.5rem 0.8rem',
    borderRadius: '999px',
    cursor: 'pointer',
    font: '500 0.8rem Inter, sans-serif',
    opacity: '0',
    transform: 'translateY(8px)',
    pointerEvents: 'none',
    transition: 'opacity 0.2s ease, transform 0.2s ease'
  });

  function updateVisibility() {
    const isLong = document.documentElement.scrollHeight > window.innerHeight * 1.25;
    const pastFold = window.scrollY > 280;
    const visible = isLong && pastFold;
    button.style.opacity = visible ? '1' : '0';
    button.style.transform = visible ? 'translateY(0)' : 'translateY(8px)';
    button.style.pointerEvents = visible ? 'auto' : 'none';
  }

  button.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  document.addEventListener('DOMContentLoaded', function () {
    document.body.appendChild(button);
    updateVisibility();
  });

  window.addEventListener('scroll', updateVisibility, { passive: true });
  window.addEventListener('resize', updateVisibility);
})();
