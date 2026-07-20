# Versión para GitHub Pages + bookmarks.html local

Subir solamente `index.html` y `script.js` al repositorio de GitHub Pages.

El botón lee el archivo local con `FileReader`/`DOMParser`. El archivo no se sube a GitHub ni se envía a un servidor propio.

## API key

En Google Cloud:

1. Activar **YouTube Data API v3**.
2. Crear una API key.
3. En **Restricciones de aplicaciones**, elegir **Sitios web (referentes HTTP)**.
4. Agregar:

```text
https://aaggfadu.github.io/*
```

5. En **Restricciones de API**, permitir únicamente **YouTube Data API v3**.

La clave se pega en el formulario y no se guarda en el repositorio ni en `localStorage`. En una aplicación estática no existe una forma de ocultarla completamente: la protección correcta es restringir su dominio y su API.

## Formatos admitidos

- `/@handle`
- `/channel/UC...`
- `/user/...`
- `/watch?v=...`
- `/shorts/...`
- `youtu.be/...`
- `/c/...` mediante una búsqueda de canal de mayor costo de cuota

Si el repositorio usa otra cuenta o dominio, cambiar el referente HTTP por el dominio real de GitHub Pages.