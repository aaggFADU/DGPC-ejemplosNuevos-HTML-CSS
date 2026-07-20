const $ = selector => document.querySelector(selector);
const apiKeyInput = $("#apiKey");
const bookmarksInput = $("#bookmarks");
const status = $("#status");
const content = $("#content");

function html(value) {
  return String(value ?? "").replace(/[&<>\"']/g, char => ({
    "&":"&amp;", "<":"&lt;", ">":"&gt;", "\"":"&quot;", "'":"&#39;"
  }[char]));
}

function youtubeUrl(raw) {
  try {
    const url = new URL(raw, location.href);
    if (!/^https?:$/.test(url.protocol)) return null;
    const host = url.hostname.toLowerCase().replace(/^www\./, "");
    if (host !== "youtube.com" && host !== "youtu.be") return null;
    return url;
  } catch { return null; }
}

function reference(raw) {
  const url = youtubeUrl(raw);
  if (!url) return null;
  if (url.hostname.replace(/^www\./, "") === "youtu.be") {
    return { type: "video", value: url.pathname.split("/").filter(Boolean)[0] };
  }
  const parts = url.pathname.split("/").filter(Boolean);
  if (parts[0] === "watch" && url.searchParams.get("v")) return { type: "video", value: url.searchParams.get("v") };
  if (parts[0] === "shorts" && parts[1]) return { type: "video", value: parts[1] };
  if (parts[0] === "channel" && /^UC[\w-]{20,}$/.test(parts[1] || "")) return { type: "id", value: parts[1] };
  if (parts[0]?.startsWith("@")) return { type: "handle", value: parts[0].slice(1) };
  if (parts[0] === "user" && parts[1]) return { type: "username", value: parts[1] };
  if (parts[0] === "c" && parts[1]) return { type: "custom", value: parts[1] };
  return null;
}

function getBookmarks(file) {
  return file.text().then(text => {
    const document = new DOMParser().parseFromString(text, "text/html");
    return [...document.querySelectorAll("a[href]")]
      .map(anchor => ({ url: anchor.href, title: anchor.textContent.trim(), ref: reference(anchor.href) }))
      .filter(item => item.ref);
  });
}

async function api(resource, params, key) {
  const url = new URL(`https://www.googleapis.com/youtube/v3/${resource}`);
  Object.entries({ ...params, key }).forEach(([name, value]) => url.searchParams.set(name, value));
  const response = await fetch(url);
  const data = await response.json();
  if (!response.ok) throw new Error(data.error?.message || `YouTube API: HTTP ${response.status}`);
  return data;
}

async function resolveChannel(ref, key) {
  if (ref.type === "video") {
    const videos = await api("videos", { part: "snippet", id: ref.value }, key);
    const video = videos.items?.[0];
    if (!video) throw new Error(`Video no encontrado: ${ref.value}`);
    ref = { type: "id", value: video.snippet.channelId };
  }
  if (ref.type === "custom") {
    const search = await api("search", { part: "snippet", type: "channel", q: ref.value, maxResults: "5" }, key);
    const match = search.items?.find(item => item.snippet?.customUrl?.toLowerCase() === `@${ref.value}`.toLowerCase()) || search.items?.[0];
    if (!match) throw new Error(`No se encontró el canal personalizado /c/${ref.value}`);
    ref = { type: "id", value: match.snippet.channelId || match.id.channelId };
  }
  const params = { part: "snippet,contentDetails" };
  params[ref.type === "id" ? "id" : ref.type === "handle" ? "forHandle" : "forUsername"] = ref.value;
  const data = await api("channels", params, key);
  const channel = data.items?.[0];
  if (!channel) throw new Error(`No se encontró ${ref.value}`);
  return channel;
}

async function load() {
  const key = apiKeyInput.value.trim();
  const file = bookmarksInput.files?.[0];
  if (!key) return showError("Falta la API key.");
  if (!file) return showError("Seleccioná el bookmarks.html de tu navegador.");
  content.replaceChildren();
  status.textContent = "Leyendo marcadores locales…";
  try {
    const bookmarks = await getBookmarks(file);
    if (!bookmarks.length) throw new Error("No encontré enlaces de YouTube en el archivo.");
    const channels = new Map();
    const errors = [];
    for (const bookmark of bookmarks) {
      try {
        const channel = await resolveChannel(bookmark.ref, key);
        channels.set(channel.id, channel);
      } catch (error) { errors.push(`${bookmark.url} — ${error.message}`); }
    }
    const results = [];