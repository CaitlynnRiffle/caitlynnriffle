const order = ['Duplex', 'Rancher', 'Two-Story'];
const cards = document.getElementById('cards');
const returnTo = encodeURIComponent(`${location.pathname.split('/').pop()}${location.search}`);

cards.innerHTML = order
  .map((type) => {
    const grouped = projects.filter((project) => project.type === type);
    if (!grouped.length) return '';

    return `
      <section class="type-group">
        <h2 class="type-heading">${type}</h2>
        <div class="cards grouped">
          ${grouped
            .map(
              (project) => `
                <a class="card" href="project.html?id=${project.id}&from=${returnTo}">
                  <img class="thumb" src="${project.image}" data-hover-src="${project.hover || project.floor}" alt="${project.name} elevation" />
                  <div class="body">
                    <h2>${project.name}</h2>
                    <p class="meta">${project.sqft} sq ft | ${project.beds} beds | ${project.baths} baths | ${project.garage}</p>
                  </div>
                </a>
              `
            )
            .join('')}
        </div>
      </section>
    `;
  })
  .join('');

window.__initHoverSwap?.();
