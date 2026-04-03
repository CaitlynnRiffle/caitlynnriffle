const category = document.body.dataset.category;
const cards = document.getElementById('cards');
const items = projects.filter((project) => project.type === category);
const returnTo = encodeURIComponent(`${location.pathname.split('/').pop()}${location.search}`);

cards.innerHTML = items
  .map((project) => `
    <a class="card" href="project.html?id=${project.id}&from=${returnTo}">
      <img class="thumb" src="${project.image}" data-hover-src="${project.hover || project.floor}" alt="${project.name} elevation" />
      <div class="body">
        <h2>${project.name}</h2>
        <p class="meta">${project.sqft} sq ft | ${project.beds} beds | ${project.baths} baths | ${project.garage}</p>
      </div>
    </a>
  `)
  .join('');

window.__initHoverSwap?.();
