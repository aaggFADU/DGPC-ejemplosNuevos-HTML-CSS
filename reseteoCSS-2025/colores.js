// syntax-highlighter.js
// Script para aplicar syntax highlighting a código CSS con numeración de líneas

document.addEventListener('DOMContentLoaded', () => {
  const codeBlocks = document.querySelectorAll('code.language-css');
  
  codeBlocks.forEach(block => {
    let code = block.textContent;
    const lines = code.split('\n');
    
    // Variable para rastrear si estamos dentro de un comentario multilínea
    let inMultilineComment = false;
    
    const html = lines.map((line, index) => {
      const lineNumber = index + 1;
      const result = highlightCSSLine(line, inMultilineComment);
      
      // Actualizar el estado del comentario para la siguiente línea
      inMultilineComment = result.inComment;
      
      return `<div class="code-line"><span class="line-number">${lineNumber}</span><span class="line-content">${result.html}</span></div>`;
    }).join('');
    
    block.innerHTML = html;
  });
});

function highlightCSSLine(line, wasInComment) {
  // Si la línea está vacía
  if (line.trim() === '') {
    return { html: '', inComment: wasInComment };
  }
  
  let inComment = wasInComment;
  let escaped = line
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
  
  // Caso 1: Ya estábamos en comentario
  if (inComment) {
    // Buscar si termina el comentario en esta línea
    if (escaped.includes('*/')) {
      const parts = escaped.split('*/');
      const commentPart = parts[0] + '*/';
      const restOfLine = parts.slice(1).join('*/');
      
      // El comentario terminó
      inComment = false;
      
      // Colorear la parte del comentario y procesar el resto
      const processedRest = restOfLine ? highlightCSSLine(restOfLine, false).html : '';
      return {
        html: `<span class="comment">${commentPart}</span>${processedRest}`,
        inComment: false
      };
    } else {
      // Toda la línea sigue siendo comentario
      return {
        html: `<span class="comment">${escaped}</span>`,
        inComment: true
      };
    }
  }
  
  // Caso 2: No estábamos en comentario, buscar inicio
  if (escaped.includes('/*')) {
    const openIndex = escaped.indexOf('/*');
    const closeIndex = escaped.indexOf('*/', openIndex);
    
    // Parte antes del comentario
    const beforeComment = escaped.substring(0, openIndex);
    
    if (closeIndex !== -1) {
      // Comentario completo en una línea
      const comment = escaped.substring(openIndex, closeIndex + 2);
      const afterComment = escaped.substring(closeIndex + 2);
      
      const processedBefore = beforeComment ? applySyntaxHighlight(beforeComment) : '';
      const processedAfter = afterComment ? highlightCSSLine(afterComment, false).html : '';
      
      return {
        html: `${processedBefore}<span class="comment">${comment}</span>${processedAfter}`,
        inComment: false
      };
    } else {
      // Comentario que continúa en la siguiente línea
      const comment = escaped.substring(openIndex);
      const processedBefore = beforeComment ? applySyntaxHighlight(beforeComment) : '';
      
      return {
        html: `${processedBefore}<span class="comment">${comment}</span>`,
        inComment: true
      };
    }
  }
  
  // Caso 3: Línea normal sin comentarios
  return {
    html: applySyntaxHighlight(escaped),
    inComment: false
  };
}

function applySyntaxHighlight(text) {
  let result = text;
  
  // @media, @supports, @view-transition
  result = result.replace(/(@media|@supports|@view-transition)\b/g, '<span class="at-rule">$1</span>');
  
  // Pseudo-clases y pseudo-elementos (:root, ::before, ::after)
  result = result.replace(/(:{1,2}[a-z-]+(?:\([^)]*\))?)/gi, '<span class="pseudo">$1</span>');
  
  // Selectores al inicio de línea
  result = result.replace(/^(\s*)(\*|body|img|picture|svg|video|html|h[1-6]|p|li|figcaption|header|footer|main|section|article|input|button|textarea|select|label|optgroup)\b/gi, 
    '$1<span class="selector">$2</span>');
  
  // Propiedades CSS
  result = result.replace(/\b([a-z-]+)(\s*)(:)/gi, '<span class="property">$1</span>$2<span class="punctuation">$3</span>');
  
  // Funciones var()
  result = result.replace(/\b(var)(\()/g, '<span class="function">$1</span><span class="punctuation">$2</span>');
  
  // Números con unidades
  result = result.replace(/:\s*(-?\d+\.?\d*)(px|em|rem|%|vh|vw|svh|vmin|vmax|ch|s|ms)\b/gi, 
    ': <span class="number">$1</span><span class="unit">$2</span>');
  
  // Números sin unidad
  result = result.replace(/:\s*(-?\d+\.?\d*)(?=\s*[;}])/g, ': <span class="number">$1</span>');
  
  // Colores hexadecimales
  result = result.replace(/(#[0-9a-fA-F]{3,6})\b/g, '<span class="color">$1</span>');
  
  // Palabras clave
  result = result.replace(/:\s*(auto|none|block|inline|flex|grid|smooth|light|dark|first|last|border-box|inherit|allow-keywords|inline-size|balance|pretty)\b/gi, 
    ': <span class="keyword">$1</span>');
  
  // Llaves
  result = result.replace(/([{}])/g, '<span class="punctuation">$1</span>');
  
  // Punto y coma
  result = result.replace(/(;)/g, '<span class="punctuation">$1</span>');
  
  // Paréntesis
  result = result.replace(/([()])/g, '<span class="punctuation">$1</span>');
  
  return result;
}