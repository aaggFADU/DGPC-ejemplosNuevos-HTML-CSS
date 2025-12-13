const fileInput = document.getElementById('bookmarksInput');
const gallery = document.getElementById('gallery');
const loadingOverlay = document.getElementById('loadingOverlay');

// CORS Proxy to bypass restrictions
const CORS_PROXY = 'https://api.allorigins.win/get?url=';

fileInput.addEventListener('change', handleFileSelect);

async function handleFileSelect(event) {
  const file = event.target.files[0];
  if (!file) return;

  showLoading(true);
  gallery.innerHTML = ''; // Clear previous content

  const reader = new FileReader();
  reader.onload = async (e) => {
    const content = e.target.result;
    try {
      const categories = parseBookmarks(content);
      await renderCategories(categories);

      // Hide upload UI on success
      const headerH1 = document.querySelector('header h1');
      const headerP = document.querySelector('header p');
      const fileInputContainer = document.querySelector('.file-input-container');
      if (headerH1) headerH1.style.fontSize = '1.5rem';
      if (headerP) headerP.style.display = 'none';
      if (fileInputContainer) fileInputContainer.style.display = 'none';

    } catch (error) {
      console.error('Error parsing bookmarks:', error);
      gallery.innerHTML = `<p class="error">Error al procesar el archivo: ${error.message}</p>`;
    } finally {
      showLoading(false);
    }
  };
  reader.readAsText(file);
}

function showLoading(show) {
  loadingOverlay.classList.toggle('hidden', !show);
}

function parseBookmarks(htmlContent) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlContent, 'text/html');
  const rootDl = doc.querySelector('dl');

  if (!rootDl) {
    throw new Error('No se encontró estructura de bookmarks válida.');
  }

  return processDl(rootDl);
}

function processDl(dlElement) {
  const items = [];
  let currentCategory = null;

  // Iterate over children. The structure is usually DT -> H3 (Folder) -> DL (Children) or DT -> A (Link)
  // Note: Bookmarks HTML is often malformed (missing closing tags), so we iterate carefully.

  const children = Array.from(dlElement.children);

  for (let i = 0; i < children.length; i++) {
    const node = children[i];

    if (node.tagName === 'DT') {
      const h3 = node.querySelector('h3');
      const a = node.querySelector('a');
      const dl = node.querySelector('dl'); // Sometimes DL is inside DT

      if (h3) {
        // It's a folder
        const categoryName = h3.textContent;
        // The DL containing items usually follows the DT or is inside it
        let childDl = dl || node.nextElementSibling;

        // Handle case where DL is next sibling (common in Netscape format)
        if (!dl && childDl && childDl.tagName === 'DD') {
          childDl = childDl.querySelector('dl');
        } else if (!dl && childDl && childDl.tagName !== 'DL') {
          // Sometimes it's just the next element
          // But strictly in Netscape format, it's usually nested or adjacent
          // Let's look for the next DL
          let next = node.nextElementSibling;
          while (next && next.tagName !== 'DL' && next.tagName !== 'DT') {
            next = next.nextElementSibling;
          }
          if (next && next.tagName === 'DL') childDl = next;
        }

        if (childDl && childDl.tagName === 'DL') {
          const subItems = processDl(childDl);
          if (subItems.length > 0) {
            items.push({
              type: 'category',
              name: categoryName,
              items: subItems
            });
          }
        }
      } else if (a) {
        // It's a link
        const href = a.getAttribute('href');
        if (isYouTubeLink(href)) {
          const channelName = a.textContent.trim();
          // Exclude "YouTube Music" or just "Music" if that's what the user meant
          if (channelName.toLowerCase() !== 'youtube music' && channelName.toLowerCase() !== 'music') {
            items.push({
              type: 'channel',
              name: channelName,
              url: href
            });
          }
        }
      }
    } else if (node.tagName === 'DL') {
      // Sometimes DL is a direct child (less common but possible)
      // We merge these items
      const subItems = processDl(node);
      items.push(...subItems);
    }
  }

  return items;
}
function isYouTubeLink(url) {
  return url && (url.includes('youtube.com') || url.includes('youtu.be')) && !url.includes('music.youtube.com');
}

async function renderCategories(items, container = gallery) {
  // Allowed categories (normalized to lowercase)
  const allowedCategories = ['ia', 'web & prog', 'wp', 'ps', 'audiovisual'];

  for (const item of items) {
    if (item.type === 'category') {
      const normalizedName = item.name.toLowerCase();
      // Check if this category matches allowed list
      const isAllowed = allowedCategories.some(allowed => normalizedName.includes(allowed));

      if (isAllowed) {
        if (hasChannels(item)) {
          const section = document.createElement('div');
          section.className = 'category-section';

          const title = document.createElement('h2');
          title.className = 'category-title';
          title.textContent = item.name;
          section.appendChild(title);

          const grid = document.createElement('div');
          grid.className = 'video-grid';
          section.appendChild(grid);

          container.appendChild(section);

          // Render sub-items
          await renderCategories(item.items, grid);
        }
      } else {
        // Recurse to find allowed categories deeper in the tree
        if (hasChannels(item)) {
          await renderCategories(item.items, container);
        }
      }
    } else if (item.type === 'channel') {
      // Only render channels if we are inside a grid (which implies we are inside an allowed category)
      if (container.classList.contains('video-grid')) {
        renderChannelCard(item, container);
      }
    }
  }
}

function hasChannels(category) {
  if (category.type === 'channel') return true;
  if (category.type === 'category') {
    return category.items.some(hasChannels);
  }
  return false;
}

async function renderChannelCard(channel, container) {
  const card = document.createElement('a');
  card.className = 'video-card';
  card.href = channel.url;
  card.target = '_blank';
  const placeholderImg = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 320 180' width='320' height='180'%3E%3Crect width='320' height='180' fill='%232a2a2a'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='14' fill='%23555'%3EVideo no disponible%3C/text%3E%3C/svg%3E";

  card.innerHTML = `
        <div class="thumbnail-container">
            <div class="spinner" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 30px; height: 30px; border-width: 2px;"></div>
        </div>
        <div class="card-content">
            <div class="channel-name">${channel.name}</div>
            <div class="video-title">Cargando...</div>
        </div>
    `;
  container.appendChild(card);

  try {
    const videoData = await fetchLatestVideo(channel.url);
    if (videoData) {
      const date = new Date(videoData.pubDate);

      // Filter by Date: Omit if older than 3 months
      const threeMonthsAgo = new Date();
      threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

      if (date < threeMonthsAgo) {
        card.remove();
        return;
      }

      card.href = videoData.link;

      // SORTING: Use CSS order property.
      // Use seconds instead of milliseconds to avoid 32-bit integer overflow in CSS order.
      const timestampSeconds = Math.floor(date.getTime() / 1000);
      card.style.order = -timestampSeconds;

      card.innerHTML = `
                <div class="thumbnail-container">
                    <img src="${videoData.thumbnail}" alt="${videoData.title}" loading="lazy" onerror="this.src='${placeholderImg}'">
                </div>
                <div class="card-content">
                    <div class="channel-name">${channel.name}</div>
                    <div class="video-title">${videoData.title}</div>
                    <div class="video-meta">
                        <span>${date.toLocaleDateString()}</span>
                    </div>
                </div>
            `;
    } else {
      card.remove();
    }
  } catch (e) {
    console.error(`Failed to load for ${channel.name}`, e);
    card.remove();
  }
}

async function fetchLatestVideo(channelUrl) {
  // Clean URL: remove /videos, /shorts, /featured suffix if present
  channelUrl = channelUrl.replace(/\/videos\/?$/, '').replace(/\/shorts\/?$/, '').replace(/\/featured\/?$/, '');

  let channelId = null;

  // 1. Try to extract ID from URL (e.g. /channel/UC...)
  const idMatch = channelUrl.match(/channel\/(UC[\w-]{21}[AQgw])/);
  if (idMatch) {
    channelId = idMatch[1];
  } else {
    // 2. If it's a handle (@name) or custom URL, fetch page to find ID
    const pageContent = await fetchText(channelUrl);
    if (pageContent) {
      // Try to find the RSS link which contains the channelId
      // <link rel="alternate" type="application/rss+xml" title="RSS" href="https://www.youtube.com/feeds/videos.xml?channel_id=UC..." />
      const rssMatch = pageContent.match(/href="https:\/\/www\.youtube\.com\/feeds\/videos\.xml\?channel_id=(UC[\w-]{21}[AQgw])"/);
      if (rssMatch) {
        channelId = rssMatch[1];
      } else {
        // Fallback: Look for "channelId":"UC..." in the JS blob
        const jsonMatch = pageContent.match(/"channelId":"(UC[\w-]{21}[AQgw])"/);
        if (jsonMatch) {
          channelId = jsonMatch[1];
        }
      }
    }
  }

  if (!channelId) {
    // console.warn('Could not resolve Channel ID for:', channelUrl);
    return null;
  }

  // 3. Fetch RSS Feed
  const rssUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;
  const rssContent = await fetchText(rssUrl);

  if (rssContent) {
    try {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(rssContent, 'text/xml');

      const entry = xmlDoc.querySelector('entry');
      if (entry) {
        const mediaGroup = entry.getElementsByTagName('media:group')[0] || entry.getElementsByTagName('group')[0];
        const thumbnail = mediaGroup ? (mediaGroup.getElementsByTagName('media:thumbnail')[0] || mediaGroup.getElementsByTagName('thumbnail')[0]) : null;
        const videoId = entry.getElementsByTagName('yt:videoId')[0] || entry.getElementsByTagName('videoId')[0];

        return {
          title: entry.querySelector('title').textContent,
          link: entry.querySelector('link').getAttribute('href'),
          thumbnail: thumbnail ? thumbnail.getAttribute('url') : `https://i.ytimg.com/vi/${videoId ? videoId.textContent : ''}/hqdefault.jpg`,
          pubDate: entry.querySelector('published').textContent
        };
      }
    } catch (e) {
      console.warn('Error parsing RSS for', channelId, e);
    }
  }

  return null;
}

async function fetchText(url) {
  // Try primary proxy first (corsproxy.io)
  try {
    // Add random delay to avoid rate limiting
    await new Promise(r => setTimeout(r, Math.random() * 1000));

    const response = await fetch(`https://corsproxy.io/?${encodeURIComponent(url)}`);
    if (response.ok) return await response.text();
  } catch (e) {
    console.warn('Primary proxy failed, trying fallback for', url);
  }

  // Fallback to allorigins
  try {
    const response = await fetch(`${CORS_PROXY}${encodeURIComponent(url)}`);
    if (response.ok) {
      const data = await response.json();
      return data.contents;
    }
  } catch (e) {
    console.error('All proxies failed for', url, e);
  }
  return null;
}
