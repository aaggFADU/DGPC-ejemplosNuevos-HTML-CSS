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

    // Función para calcular dinámicamente la altura del header sticky
    function updateHeaderHeight() {
        const header = document.querySelector('.header');
        if (header) {
            document.documentElement.style.setProperty('--header-height', `${header.offsetHeight}px`);
        }
    }
    
    // Llamar al inicio y al cambiar el tamaño de la ventana
    window.addEventListener('resize', updateHeaderHeight);
    updateHeaderHeight();

    // Renderiza el catálogo inicial
    renderCatalog(cssCatalog);

    // Eventos de búsqueda
    searchInput.addEventListener('input', (e) => {
        searchQuery = normalizeText(e.target.value);
        filterCatalog();
    });

    // Evento de limpiar búsqueda
    clearSearchBtn.addEventListener('click', () => {
        searchInput.value = '';
        searchQuery = '';
        filterCatalog();
        searchInput.focus();
    });

    // Eventos de filtro por categoría
    categoryFilterBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            // Actualizar clase activa
            categoryFilterBtns.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            
            currentFilter = e.target.dataset.filter;
            filterCatalog();
            scrollToCatalogStart();
        });
    });

    levelFilterBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            levelFilterBtns.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');

            currentLevel = e.target.dataset.level;
            filterCatalog();
            scrollToCatalogStart();
        });
    });

    function filterCatalog() {
        const filtered = cssCatalog.filter(item => {
            const matchesSearch = !searchQuery || matchesItemSearch(item, searchQuery);
            const matchesFilter = currentFilter === 'all' || item.category === currentFilter;
            const matchesLevel = currentLevel === 'all' || (item.level || 'actual') === currentLevel;
            
            return matchesSearch && matchesFilter && matchesLevel;
        });
        
        renderCatalog(filtered);
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
        const firstCard = container.querySelector('.card, .render-error-card');
        const headerHeight = parseFloat(getComputedStyle(document.documentElement)
            .getPropertyValue('--header-height')) || 0;
        const top = (firstCard || container).getBoundingClientRect().top + window.scrollY - headerHeight - 16;

        window.scrollTo({
            top: Math.max(0, top),
            behavior: 'smooth'
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
                // Clonar template
                const clone = template.content.cloneNode(true);
                
                // Llenar datos básicos
                clone.querySelector('.selector-name').textContent = item.name;
                clone.querySelector('.selector-badge').textContent = item.category;
                const levelBadge = clone.querySelector('.level-badge');
                levelBadge.textContent = getLevelLabel(item.level);
                levelBadge.dataset.level = item.level || 'actual';
                clone.querySelector('.selector-description').textContent = item.description;
                
                // Asignar texto plano para que Prism haga el escape y resaltado
                clone.querySelector('.language-html').textContent = item.html;
                clone.querySelector('.language-css').textContent = item.css;

                const sandboxContainer = clone.querySelector('.sandbox-container');
                const sandboxContent = clone.querySelector('.sandbox-content');

                // ID único para el scope del sandbox
                const sandboxId = `sandbox-${item.id}-${index}`;
                sandboxContent.id = sandboxId;

                if (item.useExternalIframe) {
                    // Modo Iframe Externo (Aislamiento absoluto para evitar saltos de scroll)
                    const iframe = document.createElement('iframe');
                    iframe.src = item.useExternalIframe;
                    iframe.style.width = '100%';
                    iframe.style.height = item.iframeHeight || '250px';
                    iframe.style.border = 'none';
                    iframe.style.borderRadius = '4px';
                    iframe.style.backgroundColor = 'transparent';
                    
                    sandboxContent.appendChild(iframe);
                } else {
                    // Modo Normal (@scope puro)
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

        // Aplicar resaltado de sintaxis a los nuevos elementos insertados
        if (window.Prism) {
            Prism.highlightAllUnder(container);
        }
    }
});
