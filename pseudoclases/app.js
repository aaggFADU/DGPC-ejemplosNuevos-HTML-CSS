import cssCatalog from './data.js';

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('catalogContainer');
  const template = document.getElementById('cardTemplate');
  const searchInput = document.getElementById('searchInput');
  const clearSearchBtn = document.getElementById('clearSearch');
  const categoryFilterBtns = document.querySelectorAll('#categoryFilters .filter-btn');
  const levelFilterBtns = document.querySelectorAll('#levelFilters .filter-btn');

  let currentFilter = 'all';
  let currentLevel = 'all';
  let searchQuery = '';

  function normalizeText(text) {
    return (text || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  }

  function updateHeaderHeight() {
    const header = document.querySelector('.header');
    if (header) {
      document.documentElement.style.setProperty('--header-height', `${header.offsetHeight}px`);
    }
  }

  window.addEventListener('resize', updateHeaderHeight);
  updateHeaderHeight();

  renderCatalog(cssCatalog);

  let debounceTimeout;
  searchInput.addEventListener('input', (e) => {
    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(() => {
      searchQuery = normalizeText(e.target.value);
      filterCatalog();
    }, 200);
  });

  clearSearchBtn.addEventListener('click', () => {
    searchInput.value = '';
    searchQuery = '';
    filterCatalog();
    searchInput.focus();
  });

  categoryFilterBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      categoryFilterBtns.forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');

      currentFilter = e.target.dataset.filter;
      filterCatalog();
      scrollToCatalogStart();
    });

    // Manejar popover para los tooltips en hover
    if (btn.classList.contains('popover-trigger')) {
      const targetId = btn.dataset.target;
      const popover = document.getElementById(targetId);
      if (popover) {
        btn.addEventListener('mouseenter', () => popover.showPopover());
        btn.addEventListener('mouseleave', () => popover.hidePopover());
        btn.addEventListener('focus', () => popover.showPopover());
        btn.addEventListener('blur', () => popover.hidePopover());
      }
    }
  });

  levelFilterBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      levelFilterBtns.forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');

      currentLevel = e.target.dataset.level;
      filterCatalog();
      scrollToCatalogStart();
    });

    // Manejar popover para los tooltips en hover
    if (btn.classList.contains('popover-trigger')) {
      const targetId = btn.dataset.target;
      const popover = document.getElementById(targetId);
      if (popover) {
        btn.addEventListener('mouseenter', () => popover.showPopover());
        btn.addEventListener('mouseleave', () => popover.hidePopover());
        btn.addEventListener('focus', () => popover.showPopover());
        btn.addEventListener('blur', () => popover.hidePopover());
      }
    }
  });

  function filterCatalog() {
    let visibleCount = 0;
    
    cssCatalog.forEach((item) => {
      const matchesSearch = !searchQuery || matchesItemSearch(item, searchQuery);
      const matchesFilter = currentFilter === 'all' || item.category === currentFilter;
      const primaryLevel = item.level || 'actual';
      const matchesLevel = currentLevel === 'all' || primaryLevel === currentLevel ||
        (item.relatedLevels && item.relatedLevels.includes(currentLevel));

      const card = document.getElementById(`card-${item.id}`);
      if (card) {
        if (matchesSearch && matchesFilter && matchesLevel) {
          card.style.display = '';
          visibleCount++;
        } else {
          card.style.display = 'none';
        }
      }
    });

    let noResultsMsg = document.getElementById('no-results-msg');
    if (visibleCount === 0) {
      if (!noResultsMsg) {
        noResultsMsg = document.createElement('p');
        noResultsMsg.id = 'no-results-msg';
        noResultsMsg.style.textAlign = 'center';
        noResultsMsg.style.color = 'var(--text-muted)';
        noResultsMsg.style.padding = '2rem';
        noResultsMsg.textContent = 'No se encontraron selectores con esos criterios.';
        container.appendChild(noResultsMsg);
      }
      noResultsMsg.style.display = 'block';
    } else if (noResultsMsg) {
      noResultsMsg.style.display = 'none';
    }
  }

  function matchesItemSearch(item, query) {
    const name = normalizeText(item.name);
    const description = normalizeText(item.description);
    const category = normalizeText(item.category);
    const tags = (item.tags || []).map(normalizeText);

    return (
      name.includes(query) ||
      description.includes(query) ||
      category.includes(query) ||
      tags.some(tag => tag.includes(query))
    );
  }

  function getLevelLabel(level) {
    const labels = {
      imprescindible: 'Imprescindible',
      actual: 'Uso actual',
      moderna: 'Moderna',
      especializada: 'Especializada'
    };

    return labels[level] || labels.actual;
  }

  function scrollToCatalogStart() {
    requestAnimationFrame(() => {
      let firstVisibleCard = null;
      const cards = container.querySelectorAll('.card');
      for (const card of cards) {
        if (card.style.display !== 'none') {
          firstVisibleCard = card;
          break;
        }
      }
      
      const targetElement = firstVisibleCard || container;
      const header = document.querySelector('.header');
      const headerHeight = header ? header.offsetHeight : 0;
      const top = targetElement.getBoundingClientRect().top + window.scrollY - headerHeight - 16;

      window.scrollTo({
        top: Math.max(0, top),
        behavior: 'smooth'
      });
    });
  }

  function renderCatalog(items) {
    container.innerHTML = '';

    if (items.length === 0) {
      container.innerHTML = '<p style="text-align:center; color:var(--text-muted); padding:2rem;">No se encontraron selectores con esos criterios.</p>';
      return;
    }

    items.forEach((item, index) => {
      try {
        const clone = template.content.cloneNode(true);
        
        const article = clone.querySelector('.card');
        if (article) article.id = `card-${item.id}`;

        clone.querySelector('.selector-name').textContent = item.name;
        clone.querySelector('.selector-badge').textContent = item.category;
        const levelBadge = clone.querySelector('.level-badge');
        levelBadge.textContent = getLevelLabel(item.level);
        levelBadge.dataset.level = item.level || 'actual';
        clone.querySelector('.selector-description').textContent = item.description;

        // Renderizar tags relacionadas si existen
        const relatedTagsContainer = clone.querySelector('.related-tags');
        if (item.relatedCategories && item.relatedCategories.length > 0) {
          relatedTagsContainer.innerHTML = item.relatedCategories
            .map(cat => `<span class="related-tag">También en: ${cat}</span>`)
            .join('');
        }

        clone.querySelector('.language-html').textContent = item.html;
        clone.querySelector('.language-css').textContent = item.css;

        const sandboxContainer = clone.querySelector('.sandbox-container');
        const sandboxContent = clone.querySelector('.sandbox-content');

        const sandboxId = `sandbox-${item.id}-${index}`;
        sandboxContent.id = sandboxId;

        if (item.useExternalIframe) {
          const iframe = document.createElement('iframe');
          iframe.src = item.useExternalIframe;
          iframe.style.width = '100%';
          iframe.style.height = item.iframeHeight || '250px';
          iframe.style.border = 'none';
          iframe.style.borderRadius = '4px';
          iframe.style.backgroundColor = 'transparent';

          sandboxContent.appendChild(iframe);
        } else {
          sandboxContent.innerHTML = item.html;

          const styleEl = document.createElement('style');
          styleEl.textContent = `
                        #${sandboxId},
                        #${sandboxId} * {
                            box-sizing: border-box;
                        }

                        #${sandboxId} img,
                        #${sandboxId} video,
                        #${sandboxId} iframe,
                        #${sandboxId} input,
                        #${sandboxId} select,
                        #${sandboxId} textarea,
                        #${sandboxId} button,
                        #${sandboxId} dialog {
                            max-width: 100%;
                            font: inherit;
                        }

                        @scope (#${sandboxId}) {
                            ${item.css}
                        }
                    `;
          sandboxContainer.appendChild(styleEl);
        }

        container.appendChild(clone);
      } catch (error) {
        console.error(`Error al renderizar ${item.id}:`, error);
        const errorCard = document.createElement('article');
        errorCard.className = 'card render-error-card';
        errorCard.innerHTML = `
                    <div class="card-header">
                        <div class="card-title">
                            <h2 class="selector-name">${item.name}</h2>
                            <span class="selector-badge">error</span>
                        </div>
                        <p class="selector-description">
                            Este ejemplo no pudo renderizarse en este navegador. Selector: ${item.id}
                        </p>
                    </div>
                `;
        container.appendChild(errorCard);
      }
    });

    if (window.Prism) {
      Prism.highlightAllUnder(container);
    }
  }
});
