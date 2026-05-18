import cssCatalog from './data.js';

document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('catalogContainer');
    const template = document.getElementById('cardTemplate');
    const searchInput = document.getElementById('searchInput');
    const clearSearchBtn = document.getElementById('clearSearch');
    const filterBtns = document.querySelectorAll('.filter-btn');

    let currentFilter = 'all';
    let searchQuery = '';

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
        searchQuery = e.target.value.toLowerCase();
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
    filterBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            // Actualizar clase activa
            filterBtns.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            
            currentFilter = e.target.dataset.filter;
            filterCatalog();
        });
    });

    function filterCatalog() {
        const filtered = cssCatalog.filter(item => {
            const matchesSearch = item.name.toLowerCase().includes(searchQuery) || 
                                  item.description.toLowerCase().includes(searchQuery);
            const matchesFilter = currentFilter === 'all' || item.category === currentFilter;
            
            return matchesSearch && matchesFilter;
        });
        
        renderCatalog(filtered);
    }

    function renderCatalog(items) {
        container.innerHTML = '';
        
        if (items.length === 0) {
            container.innerHTML = '<p style="text-align:center; color:var(--text-muted); padding:2rem;">No se encontraron selectores con esos criterios.</p>';
            return;
        }

        items.forEach((item, index) => {
            // Clonar template
            const clone = template.content.cloneNode(true);
            
            // Llenar datos básicos
            clone.querySelector('.selector-name').textContent = item.name;
            clone.querySelector('.selector-badge').textContent = item.category;
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
                iframe.style.height = '250px';
                iframe.style.border = 'none';
                iframe.style.borderRadius = '4px';
                iframe.style.backgroundColor = 'transparent';
                
                sandboxContent.appendChild(iframe);
            } else {
                // Modo Normal (@scope puro)
                sandboxContent.innerHTML = item.html;

                const styleEl = document.createElement('style');
                styleEl.textContent = `
                    @scope (#${sandboxId}) {
                        ${item.css}
                    }
                `;
                sandboxContainer.appendChild(styleEl);
            }

            container.appendChild(clone);
        });

        // Aplicar resaltado de sintaxis a los nuevos elementos insertados
        if (window.Prism) {
            Prism.highlightAllUnder(container);
        }
    }
});
