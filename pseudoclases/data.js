const cssCatalog = [
  // LÓGICA Y RELACIÓN
  {
    id: "has",
    name: ":has()",
    type: "pseudo-class",
    category: "logica",
    level: "actual",
    tags: ["selector padre", "relacion", "2026"],
    description: "El 'selector padre'. Permite estilizar un elemento dependiendo de su contenido o de sus elementos descendientes.",
    html: `<div class="card">
  <h3>Card simple</h3>
  <p>Sin imagen destacada.</p>
</div>

<div class="card">
  <img src="https://picsum.photos/200/100" alt="Destacada">
  <h3>Card con imagen</h3>
  <p>Esta card tiene un fondo distinto porque contiene una imagen.</p>
</div>`,
    css: `.card {
  border: 2px solid #333;
  padding: 1rem;
  margin-bottom: 1rem;
  border-radius: 8px;
  background: #1e1e1e;
}

/* Si la .card contiene una <img> dentro, cambia su borde y fondo */
.card:has(img) {
  border-color: #f39c12;
  background: #2a2215;
}

img {
  max-width: 100%;
  border-radius: 4px;
}`
  },
  {
    id: "is-where",
    name: ":is() / :where()",
    type: "pseudo-class",
    category: "logica",
    level: "imprescindible",
    tags: ["agrupacion", "especificidad", "selectores"],
    description: "Agrupan selectores para simplificar el código. :is() mantiene la especificidad del selector más alto, mientras que :where() siempre tiene especificidad 0.",
    html: `<header>
  <h2>Título en Header</h2>
  <p>Párrafo en header</p>
</header>
<main>
  <h2>Título en Main</h2>
  <p>Párrafo en main</p>
</main>
<footer>
  <h2>Título en Footer</h2>
  <p>Párrafo en footer</p>
</footer>`,
    css: `/* Aplica a h2 y p dentro de header, main o footer sin repetir selectores */
:is(header, main, footer) :is(h2, p) {
  color: #3498db;
  margin: 5px 0;
}

header, main, footer {
  padding: 10px;
  border: 1px solid #444;
  margin-bottom: 10px;
}`
  },
  {
    id: "not",
    name: ":not()",
    type: "pseudo-class",
    category: "logica",
    level: "imprescindible",
    tags: ["negacion", "filtro", "selectores"],
    description: "Representa todos los elementos seleccionados menos los que responden al selector dentro de los paréntesis.",
    html: `<ul class="lista">
  <li>Elemento 1</li>
  <li class="destacado">Elemento 2 (Destacado)</li>
  <li>Elemento 3</li>
  <li>Elemento 4</li>
</ul>`,
    css: `.lista { list-style: none; padding: 0; }
.lista li { padding: 8px; background: #2c3e50; margin-bottom: 4px; }

/* Aplica a todos los li que NO tengan la clase .destacado */
.lista li:not(.destacado) { opacity: 0.5; }
.destacado { background: #e74c3c !important; font-weight: bold; }`
  },

  // INTERACCIÓN Y ESTADO
  {
    id: "active",
    name: ":active",
    type: "pseudo-class",
    category: "interaccion",
    level: "imprescindible",
    description: "Se aplica en el momento exacto en que un elemento está siendo activado (por ejemplo, mientras se hace click en él con el ratón).",
    html: `<button class="btn">Mantenme presionado</button>`,
    css: `.btn {
  background: #3498db; color: white; padding: 10px 20px;
  border: none; border-radius: 4px; cursor: pointer; transition: transform 0.1s;
}
.btn:active {
  background: #2980b9; transform: scale(0.95);
}`
  },
  {
    id: "hover",
    name: ":hover",
    type: "pseudo-class",
    category: "interaccion",
    level: "imprescindible",
    description: "Se aplica cuando el usuario coloca el puntero sobre algún elemento.",
    html: `<button class="btn">Pasa el cursor por aquí</button>`,
    css: `.btn {
  background: #27ae60; color: white; padding: 15px 30px;
  border: none; border-radius: 8px; cursor: pointer; transition: all 0.3s ease;
}
.btn:hover { background: #2ecc71; transform: translateY(-3px); }`
  },
  {
    id: "focus",
    name: ":focus",
    type: "pseudo-class",
    category: "interaccion",
    level: "imprescindible",
    description: "Se aplica cuando un elemento recibe el foco (mediante teclado o clic).",
    html: `<input type="text" placeholder="Haz click aquí para foco">`,
    css: `input { padding: 10px; border: 2px solid #555; background: #222; color: white; outline: none; }
input:focus { border-color: #3498db; box-shadow: 0 0 8px rgba(52,152,219,0.5); }`
  },
  {
    id: "focus-visible",
    name: ":focus-visible",
    type: "pseudo-class",
    category: "interaccion",
    level: "imprescindible",
    tags: ["accesibilidad", "teclado", "focus"],
    description: "Muestra el estilo de foco solo cuando el usuario navega por teclado (ej. Tab), evitando bordes indeseados al hacer clic con ratón.",
    html: `<button class="btn-modern">Botón (Navega con TAB)</button>`,
    css: `.btn-modern { padding: 10px 20px; background: #34495e; color: white; border: none; cursor: pointer; outline: none; }
.btn-modern:focus-visible { outline: 3px solid #3498db; outline-offset: 3px; }`
  },
  {
    id: "focus-within",
    name: ":focus-within",
    type: "pseudo-class",
    category: "interaccion",
    level: "actual",
    tags: ["contenedor", "focus", "formularios"],
    description: "Se aplica a un contenedor si este o cualquiera de sus hijos recibe foco.",
    html: `<form class="caja-formulario">
  <input type="text" placeholder="Usuario">
  <input type="password" placeholder="Contraseña">
</form>`,
    css: `.caja-formulario { padding: 20px; background: #111; border: 2px solid #333; transition: 0.3s; }
.caja-formulario:focus-within { border-color: #9b59b6; }
input { display: block; width: 100%; margin-bottom: 10px; padding: 8px; }`
  },
  {
    id: "target",
    name: ":target",
    type: "pseudo-class",
    category: "interaccion",
    level: "actual",
    useExternalIframe: "ejemplo-target.html",
    iframeHeight: "290px",
    tags: ["anclas", "indice", "scroll"],
    description: "Representa el elemento único con un 'id' coincidente con el ancla (#) de la URL. Hoy en día es ideal en UX para resaltar visualmente la sección exacta a la que el usuario acaba de saltar en un índice.",
    html: `<nav class="indice">
  <a href="#cap1" class="btn-link">Capítulo 1</a> | 
  <a href="#cap2" class="btn-link">Capítulo 2</a>
</nav>

<article id="cap1" class="seccion">
  <h4>Capítulo 1</h4>
  <p>Texto introductorio de la sección uno.</p>
</article>

<article id="cap2" class="seccion">
  <h4>Capítulo 2</h4>
  <p>Desarrollo principal de la sección dos.</p>
</article>`,
    css: `/* Previene que el menú fijo tape la sección al hacer scroll */
html {
  scroll-padding-top: 60px;
}

.indice {
  position: sticky;
  top: 0;
  background: #111;
  padding: 10px 0;
  border-bottom: 1px solid #333;
}

.btn-link { color: #3498db; text-decoration: none; font-weight: bold; margin-right: 5px; }
.btn-link:hover { text-decoration: underline; }

.seccion {
  padding: 10px;
  margin-top: 15px;
  border-left: 4px solid transparent;
  transition: all 0.4s ease;
  background: #1e1e1e;
  border-radius: 0 4px 4px 0;
}

/* Cuando la sección es el objetivo de la URL */
.seccion:target {
  background: rgba(243, 156, 18, 0.15); 
  border-left-color: #f39c12; 
}
.seccion:target h4 {
  color: #f39c12;
}`
  },
  {
    id: "link-visited",
    name: ":link / :visited",
    type: "pseudo-class",
    category: "interaccion",
    level: "actual",
    tags: ["historial", "enlaces", "privacidad"],
    description: ":link se aplica a enlaces no visitados. :visited a enlaces que el usuario ya visitó en su historial. Su demostración depende del historial real del navegador.",
    html: `<a href="https://example.com/no-visitado" class="mi-enlace">Enlace posiblemente no visitado</a><br>
<a href="https://developer.mozilla.org/" class="mi-enlace">Enlace quizás visitado</a>`,
    css: `.mi-enlace:link { color: #3498db; font-weight: bold; }
.mi-enlace:visited { color: #8e44ad; }`
  },
  {
    id: "any-link",
    name: ":any-link",
    type: "pseudo-class",
    category: "interaccion",
    level: "actual",
    tags: ["enlaces", "link", "visited"],
    description: "Selecciona cualquier enlace real con href, sin importar si ya fue visitado o no. Es práctico cuando querés estilizar enlaces sin separar :link y :visited.",
    html: `<nav class="mini-nav">
  <a href="#interno">Ancla interna</a>
  <a href="https://example.com/">Enlace externo</a>
  <a>Texto sin href</a>
</nav>
<p id="interno">Este párrafo es el destino del enlace interno.</p>`,
    css: `.mini-nav {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.mini-nav a:any-link {
  color: #f39c12;
  text-decoration-color: currentColor;
  text-underline-offset: 0.2em;
  font-weight: 700;
}

.mini-nav a:not(:any-link) {
  color: #777;
}`
  },
  {
    id: "open",
    name: ":open",
    type: "pseudo-class",
    category: "interaccion",
    level: "moderna",
    tags: ["details", "dialog", "ui nativa"],
    description: "Aplica a elementos que tienen estado abierto/cerrado cuando están abiertos. En HTML actual se usa mucho con <details>, <dialog> y controles con picker nativo.",
    html: `<details class="faq">
  <summary>¿Qué hace :open?</summary>
  <p>Este contenido se estiliza distinto cuando el details está desplegado.</p>
</details>`,
    css: `.faq {
  border: 1px solid #444;
  border-radius: 10px;
  background: #171717;
  overflow: clip;
}

.faq summary {
  cursor: pointer;
  padding: 0.9rem 1rem;
  font-weight: 700;
}

.faq:open {
  border-color: #f39c12;
  box-shadow: 0 0 0 3px rgba(243, 156, 18, 0.18);
}

.faq:open summary {
  background: rgba(243, 156, 18, 0.14);
}

.faq p {
  padding: 0 1rem 1rem;
}`
  },
  {
    id: "popover-open",
    name: ":popover-open",
    type: "pseudo-class",
    category: "interaccion",
    level: "moderna",
    tags: ["popover", "ui nativa", "2026"],
    description: "Selecciona un popover nativo mientras está visible. Es útil para enseñar UI nativa moderna sin recurrir a JavaScript pesado.",
    html: `<button class="btn-pop" popovertarget="demo-pop">Abrir popover</button>
<div id="demo-pop" popover class="popover-demo">
  <strong>Popover nativo</strong>
  <p>Este bloque sólo recibe estos estilos mientras está mostrado.</p>
</div>`,
    css: `.btn-pop {
  padding: 0.75rem 1rem;
  border: 0;
  border-radius: 999px;
  background: #2d7ff9;
  color: white;
  cursor: pointer;
}

[popover] {
  inset: 50% auto auto 50%;
  transform: translate(-50%, -50%);
  margin: 0;
  border: 1px solid #444;
  border-radius: 12px;
  padding: 1rem;
  background: #181818;
  color: #f3f3f3;
  max-width: 260px;
}

.popover-demo:popover-open {
  border-color: #2d7ff9;
  box-shadow: 0 14px 40px rgba(45, 127, 249, 0.28);
}`
  },
  {
    id: "modal",
    name: ":modal",
    type: "pseudo-class",
    category: "interaccion",
    level: "moderna",
    tags: ["dialog", "modal", "top layer"],
    description: "Coincide con un diálogo modal activo. Complementa muy bien a ::backdrop: uno selecciona la caja modal y el otro el fondo detrás de ella.",
    html: `<button class="btn-modal" onclick="this.nextElementSibling.showModal()">Abrir diálogo modal</button>
<dialog class="modal-demo">
  <h4>Diálogo modal</h4>
  <p>Mientras esté abierto con showModal(), este dialog coincide con :modal.</p>
  <button onclick="this.closest('dialog').close()">Cerrar</button>
</dialog>`,
    css: `.btn-modal {
  padding: 0.75rem 1rem;
  border: 0;
  border-radius: 0.6rem;
  background: #16a085;
  color: white;
  cursor: pointer;
}

.modal-demo {
  width: min(100%, 28rem);
  padding: 1.25rem;
  border-radius: 14px;
  border: 1px solid #444;
  background: #151515;
  color: white;
}

.modal-demo:modal {
  border-color: #16a085;
  box-shadow: 0 16px 50px rgba(22, 160, 133, 0.35);
}`
  },

  // FORMULARIOS
  {
    id: "checked",
    name: ":checked",
    type: "pseudo-class",
    category: "formularios",
    level: "actual",
    description: "Aplica a checkboxes o radio buttons cuando están marcados.",
    html: `<input type="checkbox" id="chk" class="cb"> 
<label for="chk">Opción 1</label>
<div class="resultado">¡Marcaste la opción!</div>`,
    css: `.resultado { display: none; margin-top: 10px; color: #2ecc71; }
.cb:checked ~ .resultado { display: block; }`
  },
  {
    id: "disabled-enabled",
    name: ":disabled / :enabled",
    type: "pseudo-class",
    category: "formularios",
    level: "imprescindible",
    tags: ["formularios", "estado", "inputs"],
    description: "Selecciona elementos de formulario habilitados o deshabilitados.",
    html: `<input type="text" value="Habilitado">
<input type="text" value="Deshabilitado" disabled>`,
    css: `input { padding: 5px; margin: 5px; border: 1px solid #555; }
input:enabled { border-color: #2ecc71; color: white; background: #222; }
input:disabled { border-color: #e74c3c; cursor: not-allowed; opacity: 0.5; }`
  },
  {
    id: "required-optional",
    name: ":required / :optional",
    type: "pseudo-class",
    category: "formularios",
    level: "imprescindible",
    tags: ["formularios", "validacion", "required"],
    description: "Aplica cuando un campo tiene (o no) el atributo required.",
    html: `<input type="text" placeholder="Requerido" required>
<input type="text" placeholder="Opcional">`,
    css: `input { padding: 5px; margin: 5px; border: 1px solid #555; background: #222; color: white; }
input:required { border-left: 4px solid #e74c3c; }
input:optional { border-left: 4px solid #95a5a6; }`
  },
  {
    id: "valid-invalid",
    name: ":valid / :invalid",
    type: "pseudo-class",
    category: "formularios",
    level: "imprescindible",
    tags: ["validacion", "formularios", "estado"],
    description: "Evalúa si un campo cumple con la validación HTML (type, min, max, required). ¡Cuidado! Se disparan antes de que el usuario interactúe.",
    html: `<input type="email" placeholder="Email (escribe mal)">`,
    css: `input { padding: 5px; border: 2px solid #555; }
input:valid { border-color: #2ecc71; }
input:invalid { border-color: #e74c3c; }`
  },
  {
    id: "user-invalid",
    name: ":user-invalid / :user-valid",
    type: "pseudo-class",
    category: "formularios",
    level: "actual",
    tags: ["validacion", "ux", "formularios"],
    description: "Mejora UX frente a :invalid. Marca el error de validación solo DESPUÉS de que el usuario ha interactuado con el input.",
    html: `<input type="email" required placeholder="Escribe un email erróneo y sal del campo">`,
    css: `input { padding: 10px; border: 2px solid #444; background: #222; color: white; }
input:user-invalid { border-color: #e74c3c; background: rgba(231, 76, 60, 0.1); }
input:user-valid { border-color: #2ecc71; }`
  },
  {
    id: "in-out-range",
    name: ":in-range / :out-of-range",
    type: "pseudo-class",
    category: "formularios",
    level: "actual",
    tags: ["rangos", "formularios", "validacion"],
    description: "Aplica a campos numéricos según si su valor está dentro de los límites (min/max).",
    html: `<input type="number" min="10" max="20" value="5" placeholder="10 a 20">`,
    css: `input { padding: 5px; border: 2px solid #555; background: #222; color: white; }
input:in-range { background: rgba(46, 204, 113, 0.2); }
input:out-of-range { background: rgba(231, 76, 60, 0.2); border-color: #e74c3c; }`
  },
  {
    id: "placeholder-shown",
    name: ":placeholder-shown",
    type: "pseudo-class",
    category: "formularios",
    level: "actual",
    tags: ["floating label", "formularios", "placeholder"],
    description: "Detecta si el placeholder es visible. Permite animar etiquetas (floating labels) sin JS.",
    html: `<div class="input-container">
  <input type="text" id="nombre" placeholder=" " required>
  <label for="nombre">Nombre Completo</label>
</div>`,
    css: `.input-container { position: relative; margin-top: 20px; }
input { width: 100%; padding: 15px 10px 5px; background: transparent; border: none; border-bottom: 2px solid #888; color: white; outline: none; }
label { position: absolute; top: 10px; left: 10px; color: #aaa; transition: 0.2s ease; pointer-events: none; }
input:not(:placeholder-shown) + label, input:focus + label { top: -10px; font-size: 12px; color: #3498db; }
input:focus { border-bottom-color: #3498db; }`
  },
  {
    id: "empty",
    name: ":empty",
    type: "pseudo-class",
    category: "arbol",
    level: "actual",
    tags: ["estructura", "arbol", "contenido"],
    description: "Corresponde a un elemento sin hijos de elemento ni texto visible. Un espacio o salto de línea dentro del elemento puede hacer que deje de coincidir.",
    html: `<div class="caja">Con texto</div>
<div class="caja"></div>
<div class="caja">Otro texto</div>`,
    css: `.caja { padding: 10px; background: #2c3e50; margin: 5px 0; border: 1px solid #34495e; min-height: 20px; }
.caja:empty { background: #e74c3c; border-color: #c0392b; }
.caja:empty::before { content: '¡Caja vacía detectada!'; color: white; font-size: 0.8em; }`
  },
  {
    id: "autofill",
    name: ":autofill",
    type: "pseudo-class",
    category: "formularios",
    level: "actual",
    tags: ["formularios", "autocompletado", "2026"],
    description: "Se activa cuando el navegador completa un campo automáticamente. En la práctica suele combinarse con :-webkit-autofill usando :is() para mejorar compatibilidad.",
    html: `<form class="autofill-demo" autocomplete="on">
  <label for="mail">Email</label>
  <input id="mail" name="mail" type="email" autocomplete="email" placeholder="tu@correo.com">
  <label for="pais">País</label>
  <input id="pais" name="pais" type="text" autocomplete="country-name" placeholder="Argentina">
</form>`,
    css: `.autofill-demo {
  display: grid;
  gap: 0.65rem;
}

.autofill-demo input {
  padding: 0.8rem 0.9rem;
  border: 2px solid #444;
  border-radius: 0.65rem;
  background: #171717;
  color: white;
}

.autofill-demo input:is(:-webkit-autofill, :autofill) {
  border-color: #f39c12;
  box-shadow: 0 0 0 3px rgba(243, 156, 18, 0.15);
}`
  },
  {
    id: "indeterminate",
    name: ":indeterminate",
    type: "pseudo-class",
    category: "formularios",
    level: "actual",
    tags: ["formularios", "progress", "estado"],
    description: "Coincide con controles en estado indeterminado. Un caso simple de mostrar sin JS es <progress> sin atributo value.",
    html: `<label class="estado">Cargando indefinido</label>
<progress class="barra" max="100"></progress>

<label class="estado">Carga definida</label>
<progress class="barra" max="100" value="65"></progress>`,
    css: `.estado {
  display: block;
  margin: 0.25rem 0;
  color: #bbb;
}

.barra {
  width: 100%;
  height: 0.9rem;
  margin-bottom: 0.9rem;
}

.barra:indeterminate {
  outline: 2px dashed #f39c12;
  outline-offset: 4px;
}`
  },

  // ESTRUCTURA DEL ÁRBOL
  {
    id: "first-last-child",
    name: ":first-child / :last-child",
    type: "pseudo-class",
    category: "arbol",
    level: "imprescindible",
    description: "Representa el primero o el último elemento 'hijo' de su 'padre'.",
    html: `<ul class="lista">
  <li>Primer ítem</li>
  <li>Ítem medio</li>
  <li>Último ítem</li>
</ul>`,
    css: `.lista li { padding: 5px; background: #34495e; margin: 2px 0; }
.lista li:first-child { background: #27ae60; color: white; }
.lista li:last-child { background: #e67e22; color: white; }`
  },
  {
    id: "nth-child",
    name: ":nth-child()",
    type: "pseudo-class",
    category: "arbol",
    level: "imprescindible",
    description: "Selecciona elementos según su posición numérica entre sus hermanos. (ej: 2n = pares, 2n+1 = impares)",
    html: `<div class="grilla">
  <div class="box">1</div><div class="box">2</div><div class="box">3</div>
  <div class="box">4</div><div class="box">5</div><div class="box">6</div>
</div>`,
    css: `.grilla { display: flex; gap: 5px; }
.box { width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; background: #333; }
.box:nth-child(even) { background: #2980b9; }
.box:nth-child(5) { background: #e74c3c; }`
  },
  {
    id: "nth-last-child",
    name: ":nth-last-child()",
    type: "pseudo-class",
    category: "arbol",
    level: "actual",
    description: "Igual que :nth-child(), pero cuenta desde el final hacia el principio.",
    html: `<div class="grilla">
  <div class="box">1</div><div class="box">2</div><div class="box">3</div>
</div>`,
    css: `.grilla { display: flex; gap: 5px; }
.box { width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; background: #333; }
.box:nth-last-child(2) { background: #9b59b6; /* El penúltimo */ }`
  },
  {
    id: "first-last-of-type",
    name: ":first-of-type / :last-of-type",
    type: "pseudo-class",
    category: "arbol",
    level: "actual",
    description: "Selecciona el primer/último hermano de su MISMO TIPO de etiqueta (ej: el primer <p> aunque antes haya un <h2>).",
    html: `<article class="art">
  <h2>Título (primer h2)</h2>
  <p>Párrafo 1 (primer p)</p>
  <p>Párrafo 2</p>
  <p>Párrafo 3 (último p)</p>
</article>`,
    css: `.art p { color: #ccc; }
.art p:first-of-type { color: #f39c12; font-weight: bold; }
.art p:last-of-type { color: #2ecc71; text-decoration: underline; }`
  },
  {
    id: "nth-of-type",
    name: ":nth-of-type() / :nth-last-of-type()",
    type: "pseudo-class",
    category: "arbol",
    level: "actual",
    description: "Cuenta la posición ignorando otros tipos de etiquetas.",
    html: `<article class="art">
  <h2>T1</h2>
  <p>P1</p>
  <p>P2</p>
  <h2>T2 (segundo h2)</h2>
  <p>P3</p>
</article>`,
    css: `.art h2 { font-size: 1.1em; color: #888; }
.art h2:nth-of-type(2) { color: #e74c3c; }`
  },
  {
    id: "only-child-type",
    name: ":only-child / :only-of-type",
    type: "pseudo-class",
    category: "arbol",
    level: "actual",
    description: ":only-child aplica si es el único nodo. :only-of-type si es el único de su etiqueta.",
    html: `<div class="box"> <p>Único P aquí adentro</p> </div>
<div class="box"> <p>P uno</p> <p>P dos</p> </div>`,
    css: `.box { border: 1px solid #555; padding: 5px; margin-bottom: 5px; }
p:only-child { color: #f1c40f; }`
  },

  // PSEUDO-ELEMENTOS
  {
    id: "before-after",
    name: "::before / ::after",
    type: "pseudo-element",
    category: "pseudo-elementos",
    level: "imprescindible",
    tags: ["contenido generado", "decoracion"],
    description: "Crea elementos virtuales dentro del elemento (antes/después del contenido). Requiere la propiedad 'content'.",
    html: `<a href="#" class="link-externo">Sitio externo</a>`,
    css: `.link-externo::after { content: ' ↗'; color: #3498db; }
.link-externo::before { content: '🌐 '; }`
  },
  {
    id: "first-letter-line",
    name: "::first-letter / ::first-line",
    type: "pseudo-element",
    category: "pseudo-elementos",
    level: "imprescindible",
    description: "Aplica estilos solo a la primera letra (tipo letra capital) o primera línea de un bloque de texto.",
    html: `<p class="capitular">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quisquam repudiandae, officiis nisi pariatur.</p>`,
    css: `.capitular::first-letter { font-size: 2.5em; float: left; margin-right: 5px; color: #e74c3c; line-height: 1; }
.capitular::first-line { font-weight: bold; color: #f1c40f; }`
  },
  {
    id: "selection",
    name: "::selection",
    type: "pseudo-element",
    category: "pseudo-elementos",
    level: "actual",
    tags: ["highlight", "texto", "seleccion"],
    description: "Cambia el aspecto del texto cuando el usuario lo selecciona (sombrea) con el cursor.",
    html: `<p class="texto-sel">Selecciona este texto con tu ratón. Verás que el resaltado nativo se reemplaza.</p>`,
    css: `.texto-sel::selection { background: #e74c3c; color: #fff; }`
  },
  {
    id: "target-text",
    name: "::target-text",
    type: "pseudo-element",
    category: "pseudo-elementos",
    level: "especializada",
    useExternalIframe: "ejemplo-target-text.html",
    iframeHeight: "320px",
    tags: ["text fragments", "highlight", "2026"],
    description: "Estiliza el texto resaltado por un text fragment (#:~:text=...). Es una extensión moderna de la idea de :target, pero aplicada al texto en lugar del elemento completo.",
    html: `<a href="#:~:text=fragmento%20de%20texto%20que%20queremos%20resaltar" class="btn-demo">
  Ir al fragmento
</a>

<p>
  Este ejemplo intenta resaltar un fragmento de texto que queremos resaltar
  usando un text fragment en la URL.
</p>

<p>
  Si tu navegador soporta esta función, al activar el enlace se aplicará el
  estilo definido en ::target-text sólo sobre esas palabras.
</p>`,
    css: `::target-text {
  background: #f39c12;
  color: #111;
}`
  },
  {
    id: "placeholder",
    name: "::placeholder",
    type: "pseudo-element",
    category: "pseudo-elementos",
    level: "imprescindible",
    description: "Permite dar estilo al texto sugerido de un input.",
    html: `<input type="text" class="input-custom" placeholder="Ingresa tu nombre...">`,
    css: `.input-custom { padding: 10px; background: #111; border: 1px solid #555; color: white; width: 100%; }
.input-custom::placeholder { color: #f1c40f; font-style: italic; opacity: 0.8; }`
  },
  {
    id: "marker",
    name: "::marker",
    type: "pseudo-element",
    category: "pseudo-elementos",
    level: "actual",
    description: "Permite cambiar color o viñeta de los elementos de una lista sin afectar al texto.",
    html: `<ul class="lista-custom">
  <li>Elemento uno</li>
  <li>Elemento dos</li>
</ul>`,
    css: `.lista-custom li::marker { content: '👉 '; color: #e74c3c; font-size: 1.2em; }`
  },
  {
    id: "file-selector-button",
    name: "::file-selector-button",
    type: "pseudo-element",
    category: "pseudo-elementos",
    level: "actual",
    description: "Estiliza el feo botón nativo de los inputs de tipo 'file'.",
    html: `<input type="file" class="file-input">`,
    css: `.file-input::file-selector-button {
  background: #2980b9; color: white; padding: 8px 16px; border: none;
  border-radius: 4px; cursor: pointer; transition: 0.3s;
}
.file-input::file-selector-button:hover { background: #3498db; }`
  },
  {
    id: "backdrop",
    name: "::backdrop",
    type: "pseudo-element",
    category: "pseudo-elementos",
    level: "actual",
    tags: ["dialog", "top layer", "modal"],
    description: "Capa que se coloca detrás de un elemento en la 'top layer' (como un <dialog> abierto o popover), oscureciendo la página.",
    html: `<button onclick="this.nextElementSibling.showModal()">Abrir Modal Nativo</button>
<dialog>
  <p>Modal nativo con Backdrop estilizado.</p>
  <button onclick="this.closest('dialog').close()">Cerrar</button>
</dialog>`,
    css: `dialog { padding: 20px; background: #1e1e1e; color: white; border: 1px solid #444; border-radius: 8px; }
/* El fondo oscuro que cubre el sitio */
dialog::backdrop { background: rgba(231, 76, 60, 0.4); backdrop-filter: blur(3px); }`
  },
  {
    id: "details-content",
    name: "::details-content",
    type: "pseudo-element",
    category: "pseudo-elementos",
    level: "moderna",
    tags: ["details", "ui nativa", "2026"],
    description: "Selecciona el contenido desplegable de <details>. Es muy útil para dar estilo o transiciones al bloque expandible sin envolverlo en divs extra.",
    html: `<details class="acordeon">
  <summary>Mostrar explicación</summary>
  <p>Este bloque pertenece al contenido desplegable del details.</p>
  <p>Con ::details-content se puede animar o dar fondo al interior expandido.</p>
</details>`,
    css: `.acordeon {
  border: 1px solid #444;
  border-radius: 12px;
  overflow: hidden;
  background: #141414;
}

.acordeon summary {
  padding: 0.9rem 1rem;
  cursor: pointer;
  font-weight: 700;
}

.acordeon::details-content {
  opacity: 0;
  transition: opacity 280ms ease, content-visibility 280ms allow-discrete;
  background: rgba(52, 152, 219, 0.12);
}

.acordeon[open]::details-content {
  opacity: 1;
}

.acordeon p {
  padding: 0 1rem 1rem;
}`
  },
  {
    id: "cue",
    name: "::cue",
    type: "pseudo-element",
    category: "pseudo-elementos",
    level: "moderna",
    description: "Estiliza los subtítulos de video (captions) dentro de un elemento multimedia.",
    html: `<video controls src="https://www.w3schools.com/html/mov_bbb.mp4" style="width:100%">
  <!-- <track default src="subtitulos.vtt"> -->
</video>
<p style="font-size:0.8em; color:#888;">(Imagina que tiene un archivo .vtt cargado)</p>`,
    css: `video::cue {
  background-color: rgba(0, 0, 0, 0.8);
  color: #f1c40f;
  font-size: 1.2rem;
  text-shadow: 2px 2px 2px #000;
}`
  }
];

export default cssCatalog;
