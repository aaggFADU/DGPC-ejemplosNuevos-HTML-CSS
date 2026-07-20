const apiKeyInput = document.querySelector("#apiKey");
const bookmarksInput = document.querySelector("#bookmarks");
const status = document.querySelector("#status");
const content = document.querySelector("#content");

function showError(message) {
  status.textContent = "";
  content.textContent = message;
  content.className = "error";
}

function getYouTubeUrl(raw) {
  try {
    const url = new URL(raw, location.href);
    const host = url.hostname.toLowerCase().replace(/^www\./, "");
    if ((host !== "youtube.com" && host !== "youtu.be") || !/^https?:$/.test(url.protocol)) return null;
    return url;
  } catch (_) {
    return null;
  }
}

function getReference(raw) {
  const url = getYouTubeUrl(raw);
  if (!url) return null;
  const host = url.hostname.toLowerCase().replace(/^www\./, "");
  const parts = url.pathname.split("/").filter(Boolean);

  if (host === "youtu.be" && parts[0]) return { type: "video", value: parts[0] };
  if (parts[0] === "watch" && url.searchParams.get("v")) return { type: "video", value: url.searchParams.get("v") };
  if (parts[0] === "shorts" && parts[1]) return { type: "video", value: parts[1] };
  if (parts[0] === "channel" && /^UC[\w-]{20,}$/.test(parts[1] || "")) return { type: "id", value: parts[1] };
  if (parts[0] && parts[0].startsWith("@")) return { type: "handle", value: parts[0].slice(1) };
  if (parts[0] === "user" && parts[1]) return { type: "username", value: parts[1] };
  if (parts[0] === "c" && parts[1]) return { type: "custom", value: parts[1] };
  return null;
}

async function readBookmarks(file) {
  const text = await file.text();
  const parsed = new DOMParser().parseFromString(text, "text/html");
  return Array.from(parsed.querySelectorAll("a[href]"))
    .map(anchor => ({ url: anchor.href, ref: getReference(anchor.href) }))
    .filter(item => item.ref);
}

async function youtube(resource, params, key) {
  const url = new URL("https://www.googleapis.com/youtube/v3/" + resource);
  Object.entries({ ...params, key }).forEach(([name, value]) => url.searchParams.set(name, value));
  const response = await fetch(url);
  const data = await response.json();
  if (!response.ok) throw new Error(data.error?.message || "Error de YouTube API (HTTP " + response.status + ")");
  return data;
}

async function resolveChannel(reference, key) {
  if (reference.type === "video") {
    const videoData = await youtube("videos", { part: "snippet", id: reference.value }, key);
    const video = videoData.items?.[0];
    if (!video) throw new Error("Video no encontrado: " + reference.value);
    reference = { type: "id", value: video.snippet.channelId };
  }

  if (reference.type === "custom") {
    const searchData = await youtube("search", { part: "snippet", type: "channel", q: reference.value, maxResults: "5" }, key);
    const item = searchData.items?.[0];
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

function addVideo(container, item) {
  const id = item.contentDetails.videoId;
  const link = document.createElement("a");
  link.className = "video";
  link.href = "https://www.youtube.com/watch?v=" + encodeURIComponent(id);
  link.target = "_blank";
  link.rel = "noopener";

  const image = document.createElement("img");
  image.src = item.snippet.thumbnails?.medium?.url || "https://i.ytimg.com/vi/" + encodeURIComponent(id) + "/mqdefault.jpg";
  image.alt = "";
  const title = document.createElement("h3");
  title.textContent = item.snippet.title;
  const date = document.createElement("small");
  date.textContent = new Date(item.snippet.publishedAt).toLocaleDateString();
  link.append(image, title, date);
  container.append(link);
}

function renderChannel(channel, videos) {
  const section = document.createElement("section");
  section.className = "channel";
  const heading = document.createElement("h2");
  heading.textContent = channel.snippet.title;
  const grid = document.createElement("div");
  grid.className = "videos";
  videos.forEach(video => addVideo(grid, video));
  section.append(heading, grid);
  content.append(section);
}

async function load() {
  const key = apiKeyInput.value.trim();
  const file = bookmarksInput.files?.[0];
  content.replaceChildren();
  content.className = "";
  if (!key) return showError("Falta la API key.");
  if (!file) return showError("Seleccioná el archivo bookmarks.html.");

  try {
    status.textContent = "Leyendo marcadores locales…";
    const bookmarks = await readBookmarks(file);
    if (!bookmarks.length) throw new Error("No encontré enlaces de YouTube en el archivo.");

    const entries = [];
    const errors = [];
    for (const bookmark of bookmarks) {
      try {
        const channel = await resolveChannel(bookmark.ref, key);
        entries.push({ bookmark, channel });
      } catch (error) {
        errors.push(bookmark.url + " — " + error.message);
      }
    }

    let index = 0;
    let shown = 0;
    const maximumAge = 30 * 24 * 60 * 60 * 1000;
    for (const entry of entries) {
      const channel = entry.channel;
      index += 1;
      status.textContent = "Leyendo canal " + index + " de " + entries.length + "…";
      try {
        const playlistId = channel.contentDetails.relatedPlaylists.uploads;
        const data = await youtube("playlistItems", { part: "snippet,contentDetails", playlistId, maxResults: "50" }, key);
        const latest = (data.items || []).reduce((newest, item) => {
          if (!newest) return item;
          return new Date(item.snippet.publishedAt) > new Date(newest.snippet.publishedAt) ? item : newest;
        }, null);
        if (!latest) continue;

        const publicationDate = new Date(latest.snippet.publishedAt);
        const age = Date.now() - publicationDate.getTime();
        if (age >= 0 && age < maximumAge) {
          renderChannel(channel, [latest]);
          shown += 1;
        }
      } catch (error) {
        errors.push(entry.bookmark.url + " — " + error.message);
      }
    }

    if (errors.length) {
      const errorBox = document.createElement("p");
      errorBox.className = "error";
      errorBox.textContent = "Enlaces no resueltos:\n" + errors.join("\n");
      content.append(errorBox);
    }
    status.textContent = shown + " videos recientes de " + entries.length + " enlaces; " + errors.length + " problemas.";
  } catch (error) {
    showError(error.message);
  }
}

document.querySelector("#controls").addEventListener("submit", event => {
  event.preventDefault();
  load();
});
document.querySelector("#clear").addEventListener("click", () => {
  apiKeyInput.value = "";
  bookmarksInput.value = "";
  content.replaceChildren();
  content.className = "";
  status.textContent = "Esperando archivo…";
});
