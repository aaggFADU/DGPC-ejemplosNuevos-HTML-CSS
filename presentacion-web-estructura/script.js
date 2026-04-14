/**
 * DGPC – Cátedra Díaz Cortez
 * Presentación: Cómo está organizado un sitio web
 * script.js — Navegación + posicionamiento de anotaciones
 */

'use strict';

/* ======================================================
   CONFIGURACIÓN
   ====================================================== */

const TOTAL_SLIDES = 16;
let currentSlide = 0;

/* ======================================================
   NAVEGACIÓN
   ====================================================== */

function goTo(index) {
  const slides = document.querySelectorAll('.slide');
  const prev = slides[currentSlide];
  const next = slides[index];

  if (!next || index === currentSlide) return;

  // Animación
  const goingForward = index > currentSlide;
  prev.classList.add(goingForward ? 'exit-left' : 'exit-right');
  setTimeout(() => {
    prev.classList.remove('active', 'exit-left', 'exit-right');
  }, 420);

  next.style.transform = goingForward ? 'translateX(50px)' : 'translateX(-50px)';
  requestAnimationFrame(() => {
    next.classList.add('active');
    setTimeout(() => { next.style.transform = ''; }, 10);
  });

  currentSlide = index;
  updateUI();
  layoutAnnotations(); // Recalcular anotaciones al cambiar slide
}

function nextSlide() {
  if (currentSlide < TOTAL_SLIDES - 1) goTo(currentSlide + 1);
}

function prevSlide() {
  if (currentSlide > 0) goTo(currentSlide - 1);
}

function updateUI() {
  document.getElementById('current-slide').textContent = currentSlide + 1;
  document.getElementById('btn-prev').disabled = currentSlide === 0;
  document.getElementById('btn-next').disabled = currentSlide === TOTAL_SLIDES - 1;

  const pct = ((currentSlide + 1) / TOTAL_SLIDES) * 100;
  document.getElementById('progress-bar').style.width = pct + '%';
}

/* ======================================================
   TECLADO
   ====================================================== */

document.addEventListener('keydown', e => {
  switch (e.key) {
    case 'ArrowRight':
    case 'ArrowDown':
    case ' ':
      e.preventDefault();
      nextSlide();
      break;
    case 'ArrowLeft':
    case 'ArrowUp':
      e.preventDefault();
      prevSlide();
      break;
    case 'Home':
      goTo(0);
      break;
    case 'End':
      goTo(TOTAL_SLIDES - 1);
      break;
  }
});

/* ======================================================
   TÁCTIL / SWIPE
   ====================================================== */

let touchStartX = 0;
let touchStartY = 0;

document.addEventListener('touchstart', e => {
  touchStartX = e.changedTouches[0].clientX;
  touchStartY = e.changedTouches[0].clientY;
}, { passive: true });

document.addEventListener('touchend', e => {
  const dx = e.changedTouches[0].clientX - touchStartX;
  const dy = e.changedTouches[0].clientY - touchStartY;
  if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) {
    if (dx < 0) nextSlide();
    else prevSlide();
  }
}, { passive: true });

/* ======================================================
   POSICIONAMIENTO DE ANOTACIONES
   Calcula la posición en px de cada .ann-box o .ann-dim
   según el tamaño natural de la imagen referenciada.

   Atributos esperados en .ann-box / .ann-dim:
     data-img   → id del <img> de referencia
     data-top   → fracción top del alto natural (0..1)
     data-h     → fracción de altura (0..1)
     data-left  → fracción left del ancho natural (default 0)
     data-w     → fracción de ancho (default 1)
     data-crop  → si la imagen tiene transform translateY(-X%),
                  valor X/100 para compensar el offset vertical
   ====================================================== */

function layoutAnnotations() {
  document.querySelectorAll('.ann-box[data-img], .ann-dim[data-img]').forEach(box => {
    const img = document.getElementById(box.dataset.img);
    if (!img || !img.naturalWidth) return;

    const stage = img.parentElement;
    const stageW = stage.offsetWidth;
    const stageH = stage.offsetHeight;

    let scaleX, scaleY, offX, offY;

    // Determinar si la imagen usa object-fit:contain en un contenedor de altura fija
    const useContain = getComputedStyle(img).objectFit === 'contain';

    if (useContain && stageH > 0) {
      // object-fit: contain — la imagen se escala para caber toda, 
      // centrada horizontalmente y alineada al top (object-position: top center)
      const scaleW = stageW / img.naturalWidth;
      const scaleH = stageH / img.naturalHeight;
      const scale = Math.min(scaleW, scaleH);
      scaleX = scaleY = scale;
      offX = (stageW - img.naturalWidth * scale) / 2; // centrado horizontal
      offY = 0; // alineado top
    } else {
      // width: 100%; height: auto — escala por ancho
      const scale = stageW / img.naturalWidth;
      scaleX = scaleY = scale;
      offX = 0;
      offY = 0;
    }

    // Compensar crop (transform: translateY(-X%))
    const cropFrac = parseFloat(box.dataset.crop || '0');
    const cropOffset = cropFrac * img.naturalHeight * scaleY;

    const top   = parseFloat(box.dataset.top  || '0');
    const h     = parseFloat(box.dataset.h    || '0.1');
    const left  = parseFloat(box.dataset.left || '0');
    const w     = parseFloat(box.dataset.w    || '1');

    box.style.top    = (offY + top * img.naturalHeight * scaleY - cropOffset) + 'px';
    box.style.height = (h * img.naturalHeight * scaleY) + 'px';
    box.style.left   = (offX + left * img.naturalWidth * scaleX) + 'px';
    box.style.width  = (w * img.naturalWidth * scaleX) + 'px';
    box.style.position = 'absolute';
  });
}

/* ======================================================
   INICIALIZACIÓN
   ====================================================== */

function init() {
  updateUI();

  // Posicionar anotaciones cuando las imágenes están listas
  document.querySelectorAll('.img-stage img, .compare-stage img').forEach(img => {
    if (img.complete && img.naturalWidth) {
      layoutAnnotations();
    } else {
      img.addEventListener('load', layoutAnnotations);
    }
  });

  // Actualizar anotaciones al redimensionar la ventana
  window.addEventListener('resize', layoutAnnotations);
}

document.addEventListener('DOMContentLoaded', init);
