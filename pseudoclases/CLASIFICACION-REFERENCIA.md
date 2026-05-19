## Guía de Referencia: Clasificación de Selectores CSS (V2)

### 📋 Tabla de Clasificación y Relaciones Transversales

Esta tabla muestra cada selector, su categoría principal y dónde más debería buscarse.

| Selector | Tipo | Categoría | También en | Nivel |
|----------|------|-----------|-----------|-------|
| **:has()** | PC | Relacionales | Árbol CSS | Actual |
| **:is() / :where()** | PC | Relacionales | Transversales | Imprescindible |
| **:not()** | PC | Relacionales | Transversales | Imprescindible |
| **:active** | PC | Interacción | — | Imprescindible |
| **:hover** | PC | Interacción | — | Imprescindible |
| **:focus** | PC | Interacción | **Formularios** ⭐ | Imprescindible |
| **:focus-visible** | PC | Interacción | **Formularios** ⭐ | Imprescindible |
| **:focus-within** | PC | Interacción | **Formularios** ⭐ | Actual |
| **:target** | PC | Interacción | — | Actual |
| **:link / :visited** | PC | Interacción | — | Actual |
| **:any-link** | PC | Interacción | — | Actual |
| **:open** | PC | Interacción | **Pseudo-elementos** ⭐ | Moderna |
| **:popover-open** | PC | Interacción | — | Moderna |
| **:modal** | PC | Interacción | — | Moderna |
| **:checked** | PC | Formularios | — | Actual |
| **:disabled / :enabled** | PC | Formularios | — | Imprescindible |
| **:required / :optional** | PC | Formularios | — | Imprescindible |
| **:valid / :invalid** | PC | Formularios | — | Imprescindible |
| **:user-invalid / :user-valid** | PC | Formularios | — | Actual |
| **:in-range / :out-of-range** | PC | Formularios | — | Actual |
| **:placeholder-shown** | PC | Formularios | — | Actual |
| **:autofill** | PC | Formularios | — | Actual |
| **:indeterminate** | PC | Formularios | — | Actual |
| **:first-child / :last-child** | PC | Árbol CSS | — | Imprescindible |
| **:nth-child()** | PC | Árbol CSS | — | Imprescindible |
| **:nth-last-child()** | PC | Árbol CSS | — | Actual |
| **:first-of-type / :last-of-type** | PC | Árbol CSS | — | Actual |
| **:nth-of-type()** | PC | Árbol CSS | — | Actual |
| **:only-child / :only-of-type** | PC | Árbol CSS | — | Actual |
| **:empty** | PC | Árbol CSS | — | Actual |
| **::before / ::after** | PE | Pseudo-elementos | — | Imprescindible |
| **::first-letter / ::first-line** | PE | Pseudo-elementos | — | Imprescindible |
| **::selection** | PE | Pseudo-elementos | — | Actual |
| **::target-text** | PE | Pseudo-elementos | — | Especializada |
| **::placeholder** | PE | Pseudo-elementos | **Formularios** ⭐ | Imprescindible |
| **::marker** | PE | Pseudo-elementos | **Árbol CSS** ⭐ | Actual |
| **::file-selector-button** | PE | Pseudo-elementos | — | Actual |
| **::backdrop** | PE | Pseudo-elementos | **Interacción** ⭐ | Actual |
| **::details-content** | PE | Pseudo-elementos | **Interacción** ⭐ | Moderna |
| **::cue** | PE | Pseudo-elementos | — | Moderna |
| **:lang()** | PC | Transversales | — | Actual |

**PC** = Pseudo-clase | **PE** = Pseudo-elemento | **⭐** = Relación cruzada importante

---

### 🎓 Flujos de Aprendizaje por Tema

#### Si estudias: **Validación de Formularios**
Busca en "Formularios":
- `:valid`, `:invalid`, `:user-valid`, `:user-invalid`
- `:required`, `:optional`
- `:disabled`, `:enabled`
- `:checked`, `:indeterminate`
- `:in-range`, `:out-of-range`

**Pero también mira en "Interacción":**
- `:focus`, `:focus-visible`, `:focus-within`

**Y en "Pseudo-elementos":**
- `::placeholder`

---

#### Si estudias: **Navegación e Índices**
Busca en "Interacción":
- `:target` (ir a una sección)
- `:hover` (efectos al pasar)
- `:focus`, `:focus-visible` (accesibilidad)
- `:any-link` (estilizar enlaces)

**Y en "Pseudo-elementos":**
- `::before`, `::after` (indicadores visuales)
- `::target-text` (resaltar fragmentos)

---

#### Si estudias: **Componentes UI Nativos (2026)**
Busca en "Interacción":
- `:open` (detalles/acordeones)
- `:popover-open` (popovers)
- `:modal` (diálogos modales)

**Y en "Pseudo-elementos":**
- `::backdrop` (fondo del modal)
- `::details-content` (contenido desplegable)

---

#### Si estudias: **Selectores Lógicos**
Busca en "Relacionales":
- `:has()` (selector padre)
- `:is()`, `:where()` (agrupación)
- `:not()` (negación)

**Éstos también son "Transversales"** porque aplican en muchos contextos.

---

#### Si estudias: **Estructura del Árbol (nth-child, etc.)**
Busca en "Árbol CSS":
- `:first-child`, `:last-child`
- `:nth-child()`, `:nth-last-child()`
- `:first-of-type`, `:nth-of-type()`
- `:only-child`
- `:empty`

**Relacionados en "Pseudo-elementos":**
- `::marker` (viñetas de listas)

---

### 💡 Criterios de Clasificación

#### **Categoría Principal**
Se elige según el **propósito pedagógico** principal o el contexto más frecuente.

#### **Relaciones Transversales**
Se agregan cuando el selector es igualmente importante en otra categoría.

**Criterios:**
1. ¿Aparece el selector frecuentemente en esa categoría?
2. ¿Es pedagogicamente importante verlo en ambos contextos?
3. ¿Está documentado junto a otros selectores relacionados?

---

### 📌 Reglas Mnemotécnicas

**Relacionales** → `:` + operadores lógicos (`:has`, `:is`, `:not`)  
**Interacción** → `:` + eventos/estados del usuario (`:hover`, `:focus`, `:open`)  
**Formularios** → `:` + validación HTML (`:valid`, `:required`, etc.)  
**Árbol CSS** → `:` + posición en el árbol (`:first-child`, `:nth-child`)  
**Pseudo-elementos** → `::` + contenido generado (`::`before`, `::selection`)  
**Transversales** → `:` + selectores "trasversales" (`:lang()`)  

---

### 🔗 Conexiones Conceptuales Clave

```
:has() ──────────→ padre dependiente del contenido
   ↓
:is() / :where() ──→ agrupación y simplificación
   ↓
:not() ──────────→ negación compuesta

:focus ──────────→ entrada de usuario
   ↓
:focus-visible ──→ solo teclado (UX mejor)
   ↓
:focus-within ──→ contenedor con foco

:target ────────→ URL + id
   ↓
::target-text ──→ URL + fragmento de texto

:open ──────────→ estado abierto/cerrado
   ↓
::details-content → contenido interno del abierto
   ↓
::backdrop ─────→ fondo modal
```

---

**Versión:** 2.0  
**Para:** Docentes y estudiantes de DGPC - FADU-UBA  
**Actualizado:** Mayo 2026
