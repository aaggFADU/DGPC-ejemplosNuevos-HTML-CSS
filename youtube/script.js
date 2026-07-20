const fileInput = document.getElementById("bookmarksInput");
const gallery = document.getElementById("gallery");
const loadingOverlay = document.getElementById("loadingOverlay");
const MAX_AGE_DAYS = 30;

function getApiKey() {
  const key = window.prompt("Pegá tu API key de YouTube Data API v3. No se guardará:");
  return key ? key.trim() : "";
}

function youtubeUrl(raw) {
  try {
    const url = new URL(raw);
    const host = url.hostname.toLowerCase().replace(/^www\./, "");
    if ((host !== "youtube.com" && host !== "youtu.be") || url.protocol !== "https:") return null;
    return url;
  } catch (_) {
    return null;
  }
}

function getReference(raw) {
  const url = youtubeUrl(raw);
  if (!url) return null;
  const host = url.hostname.toLowerCase().replace(/^www\./, "");
  const parts = url.pathname.split("/").filter(Boolean).map(part => {
    try {
      return decodeURIComponent(part);
    } catch (_) {
      return part;
    }
  });

  if (host === "youtu.be" && parts[0]) return { type: "video", value: parts[0] };
  if (parts[0] === "watch" && url.searchParams.get("v")) return { type: "video", value: url.searchParams.get("v") };
  if (parts[0] === "shorts" && parts[1]) return { type: "video", value: parts[1] };
  if (parts[0] === "channel" && /^UC[\w-]{20,}$/.test(parts[1] || "")) return { type: "id", value: parts[1] };
  if (parts[0]?.startsWith("@")) return { type: "handle", value: parts[0].slice(1) };
  if (parts[0] === "user" && parts[1]) return { type: "username", value: parts[1] };
  if (parts[0] === "c" && parts[1]) return { type: "custom", value: parts[1] };
  return null;
}

function collectBookmarks(node, folder, result, visited = new WeakSet()) {
  if (!node?.children || visited.has(node)) return;
  visited.add(node);
  const children = Array.from(node.children);
  for (let index = 0; index < children.length; index += 1) {
    const element = children[index];
    if (element.tagName === "H3") {
      // En el HTML exportado por Chrome, el DL puede ser hermano del DT
      // que contiene al H3, no hermano directo del H3.
      let childList = element.nextElementSibling;
      if (childList?.tagName !== "DL" && element.parentElement?.tagName === "DT") {
        childList = element.parentElement.nextElementSibling;
      }
      if (childList?.tagName === "DL") {
        collectBookmarks(childList, element.textContent.trim() || folder, result, visited);
        if (children[index + 1] === childList) index += 1;
      }
      continue;
    }
    if (element.tagName === "A") {
      const ref = getReference(element.href);
      if (ref) result.push({ url: element.href, title: element.textContent.trim(), folder, ref });
      continue;
    }
    // Chrome exporta los marcadores dentro de DT; hay que atravesar
    // cualquier contenedor para llegar a los A y a las subcarpetas.
    collectBookmarks(element, folder, result, visited);
  }
}

async function readBookmarks(file) {
  const text = await file.text();
  const document = new DOMParser().parseFromString(text, "text/html");
  const bookmarks = [];
  collectBookmarks(document.body, "Sin carpeta", bookmarks);
  return bookmarks;
}

async function youtube(resource, params, key) {
  const url = new URL("https://www.googleapis.com/youtube/v3/" + resource);
  Object.entries({ ...params, key }).forEach(([name, value]) => url.searchParams.set(name, value));
  const response = await fetch(url);
  const data = await response.json();
  if (!response.ok) throw new Error(data.error?.message || "YouTube API HTTP " + response.status);
  return data;
}

async function resolveChannel(reference, key) {
  if (reference.type === "video") {
    const data = await youtube("videos", { part: "snippet", id: reference.value }, key);
    const video = data.items?.[0];
    if (!video) throw new Error("Video no encontrado: " + reference.value);
    reference = { type: "id", value: video.snippet.channelId };
  }

  if (reference.type === "custom") {
    const data = await youtube("search", { part: "snippet", type: "channel", q: reference.value, maxResults: "5" }, key);
    const item = data.items?.[0];
    if (!item) throw new Error("Canal no encontrado: /c/" + reference.value);
    reference = { type: "id", value: item.snippet.channelId || item.id.channelId };
  }

  const params = { part: "snippet,contentDetails" };
  if (reference.type === "id") params.id = reference.value;
  if (reference.type === "handle") params.forHandle = reference.value;
  if (reference.type === "username") params.forUsername = reference.value;
  const data = await youtube("channels", params, key);
  if (!data.items?.length) throw new Error("Canal no encontrado: " + reference.value);
  return data.items[0];
}

async function getLatestRecentVideo(channel, key) {
  const playlistId = channel.contentDetails.relatedPlaylists.uploads;
  const data = await youtube("playlistItems", {
    part: "snippet,contentDetails",
    playlistId,
    maxResults: "50"
  }, key);
  const newest = (data.items || []).reduce((newestItem, item) => {
    if (!newestItem) return item;
    return new Date(item.snippet.publishedAt) > new Date(newestItem.snippet.publishedAt) ? item : newestItem;
  }, null);
  console.log("Último video recibido:", channel.snippet.title, newest?.snippet?.title, newest?.snippet?.publishedAt);
  return newest;
}

function addVideo(container, video) {
  const id = video.contentDetails.videoId;
  const link = document.createElement("a");
  link.href = "https://www.youtube.com/watch?v=" + encodeURIComponent(id);
  link.target = "_blank";
  link.rel = "noopener";
  link.className = "video-card video-item";

  const image = document.createElement("img");
  image.src = video.snippet.thumbnails?.medium?.url || "https://i.ytimg.com/vi/" + id + "/mqdefault.jpg";
  image.alt = video.snippet.title;

  const title = document.createElement("h3");
  title.textContent = video.snippet.title;
  const date = document.createElement("time");
  date.dateTime = video.snippet.publishedAt;
  date.textContent = new Date(video.snippet.publishedAt).toLocaleDateString("es-AR");
  link.append(image, title, date);
  container.append(link);
}

function renderFolders(results) {
  gallery.replaceChildren();
  const folders = new Map();
  results.forEach(result => {
    if (!folders.has(result.folder)) folders.set(result.folder, []);
    folders.get(result.folder).push(result);
  });

  folders.forEach((items, folder) => {
    items.sort((a, b) => new Date(b.video.snippet.publishedAt) - new Date(a.video.snippet.publishedAt));
    const section = document.createElement("section");
    section.className = "category-section category bookmark-folder";
    const heading = document.createElement("h2");
    heading.className = "category-title";
    heading.textContent = folder;
    const grid = document.createElement("div");
    grid.className = "video-grid";
    items.forEach(item => addVideo(grid, item.video));
    section.append(heading, grid);
    gallery.append(section);
  });
}

fileInput.addEventListener("change", async () => {
  const file = fileInput.files?.[0];
  if (!file) return;
  const key = getApiKey();
  if (!key) return;

  loadingOverlay.classList.remove("hidden");
  try {
    const bookmarks = await readBookmarks(file);
    if (!bookmarks.length) throw new Error("El archivo no contiene enlaces de YouTube válidos.");

    // El archivo fue leído correctamente: ocultar solo el bloque de selección.
    document.querySelector(".file-input-container")?.classList.add("hidden");
    const results = [];
    const errors = [];
    const now = Date.now();
    const maximumAge = MAX_AGE_DAYS * 24 * 60 * 60 * 1000;
    gallery.replaceChildren();

    for (const [index, bookmark] of bookmarks.entries()) {
      try {
        const loadingText = loadingOverlay.querySelector("p");
        if (loadingText) loadingText.textContent = `Buscando ${index + 1} de ${bookmarks.length}: ${bookmark.title || bookmark.url}`;
        const channel = await resolveChannel(bookmark.ref, key);
        const video = await getLatestRecentVideo(channel, key);
        if (!video) continue;
        const publication = new Date(video.snippet.publishedAt).getTime();
        if (publication >= now - maximumAge) {
          results.push({ folder: bookmark.folder, bookmark, channel, video });
          // Renderizado progresivo: cada video aparece sin esperar el final.
          renderFolders(results);
        }
      } catch (error) {
        errors.push(bookmark.url + " — " + error.message);
      }
    }

    renderFolders(results);
    if (!results.length) {
      gallery.innerHTML = "<div class=\"placeholder-message\">No hay videos publicados en los últimos 30 días.</div>";
    }
    if (errors.length) {
      const errorBox = document.createElement("pre");
      errorBox.className = "errors";
      errorBox.textContent = "Enlaces no resueltos:\n" + errors.join("\n");
      gallery.append(errorBox);
    }
  } catch (error) {
    document.querySelector(".file-input-container")?.classList.remove("hidden");
    gallery.textContent = error.message;
  } finally {
    loadingOverlay.classList.add("hidden");
  }
});
