## Catálogo de Selectores CSS - V2 (Mejorado)

### ✨ Mejoras Implementadas

Esta versión (V2) incorpora todas las recomendaciones del análisis pedagógico:

#### 1️⃣ **Categorías Refinadas**

**De:** 6 categorías básicas  
**A:** 7 categorías estructuradas

| Antigua | Nueva | Cambio |
|---------|-------|--------|
| Lógica | **Relacionales** | Mejor describe :has(), :is(), :not() |
| Interacción | Interacción | Mantiene nombre, mejorados ejemplos |
| Formularios | Formularios | Ampliado con relaciones transversales |
| Árbol CSS | Árbol CSS | Mejorado con :empty y ejemplos claros |
| Pseudo-elementos | Pseudo-elementos | Organización más clara |
| — | **Transversales** | NUEVA: Para selectores en múltiples contextos |

---

#### 2️⃣ **Clasificación Cruzada (Transversal)**

Cada selector ahora incluye un campo `relatedCategories` que muestra dónde más debería buscarse:

```javascript
{
  name: ":focus",
  category: "interaccion",
  relatedCategories: ["Formularios"],  // ← NUEVO
  // ...
}
```

**Ejemplos:**
- `:focus` → Aparece en "Interacción" pero también relevante en "Formularios"
- `:focus-visible`, `:focus-within` → Similar
- `::placeholder` → Pseudo-elementos + Formularios
- `::marker` → Pseudo-elementos + Árbol CSS
- `:open`, `::details-content` → Interacción ↔ Pseudo-elementos

---

#### 3️⃣ **Ejemplos Mejorados**

- **:nth-child()** → Ahora muestra fórmulas claras (2n, 2n+1, 3n+1)
- **:has()** → Agrega ejemplo con combinadores (> para hijo directo)
- **:not()** → Muestra múltiples negaciones en CSS 4 (`:not(.a, .b)`)
- **:is() / :where()** → Enfatiza la diferencia de especificidad
- **:focus**, **:focus-visible**, **:focus-within** → Ejemplos complementarios

---

#### 4️⃣ **Nuevos Selectores**

✅ **:lang()** - Internacionalización (i18n)  
  - Categoría: Transversales
  - Nivel: Actual
  - Útil para tipografía por idioma

---

#### 5️⃣ **UI Mejorada en el Catálogo**

- ✅ Botón "Transversales" en filtros
- ✅ Tags de "También en:" bajo la descripción de cada selector
- ✅ Estilos visuales para diferenciar relaciones cruzadas
- ✅ Footer actualizado mencionando V2

---

### 📊 Estadísticas

| Métrica | V1 | V2 |
|---------|----|----|
| Total de selectores | 44 | 45 |
| Categorías | 6 | 7 |
| Selectores con relaciones transversales | 0 | 12 |
| Ejemplos mejorados | — | 8 |
| Selectores nuevos | — | 1 |

---

### 🎯 Casos de Uso Pedagógicos

La V2 permite a los estudiantes:

1. **Buscar por caso de uso** (no solo por categoría)
   - "Necesito estilizar formularios" → Ver todas las pseudoclases relevantes en categorías diferentes

2. **Entender relaciones conceptuales**
   - `:open` ↔ `::details-content` (control nativo con dos formas de estilizar)
   - `:target` ↔ `::target-text` (conceptos similares, casos diferentes)

3. **Comprender especificidad y performance**
   - :is() vs :where() lado a lado
   - Comparación clara de selectores equivalentes

4. **Aprender patrones modernos** (2026)
   - Popover, Dialog modal, Details
   - Validación UX (user-invalid vs invalid)

---

### 📂 Estructura de Archivos

```
V2/
├── index.html                (Actualizado con botón "Transversales")
├── app.js                    (Incluye renderizado de tags relacionadas)
├── styles.css                (+ estilos para .related-tags)
├── data.js                   (PRINCIPAL: datos refinados + relaciones)
├── ejemplo-target.html       (Copiado para :target)
└── ejemplo-target-text.html  (Copiado para ::target-text)
```

---

### 🚀 Próximas Mejoras Sugeridas (V3)

- [ ] Agregar `:is()` vs `:where()` vs `calc-size()` comparison
- [ ] Incluir navegador / soporte (caniuse API integration)
- [ ] Agregar tests interactivos simples (mini-quizzes)
- [ ] Expandir ejemplos de responsive (media queries + pseudoclases)
- [ ] Documentar `:state()` (Web Components, 2026+)

---

**Versión:** 2.0  
**Fecha:** Mayo 2026  
**Cátedra:** DGPC - FADU-UBA  
**Autor:** Análisis y mejoras educativas
