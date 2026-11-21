const $ = (s) => document.querySelector(s);

async function loadJSON(path, fallback = {}) {
  try {
    const res = await fetch(path, { cache: "no-store" });
    if (!res.ok) throw new Error(`${res.status} ${path}`);
    return await res.json();
  } catch (e) {
    console.warn("Could not load", path, e);
    return fallback;
  }
}

function normalizePath(value) {
  if (!value) return "";
  if (typeof value === "string") return value;
  if (typeof value === "object") return value.path || value.value || value.url || "";
  return "";
}

function youtubeId(url) {
  if (!url) return "";
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtu.be")) return u.pathname.slice(1);
    if (u.hostname.includes("youtube.com")) return u.searchParams.get("v") || "";
  } catch {}
  return "";
}

function escapeHTML(s) {
  return String(s).replace(/[&<>"']/g, c => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"
  }[c]));
}
function stripMarkdown(s) {
  return String(s).replace(/[#*_`>]/g,"").replace(/\[([^\]]+)\]\([^)]+\)/g,"$1");
}

async function initSite() {
  const site = await loadJSON("data/site.json", {});
  if ($("#tagline")) $("#tagline").textContent = site.tagline || "MUSIC PRODUCER • COMPOSER • ARRANGER";
  if ($("#bio")) {
    $("#bio").innerHTML = String(site.bio || "Welcome to my portfolio.").replace(/\n/g, "<br>");
  }
  const hero = normalizePath(site.hero_image);
  if ($("#heroImage") && hero) {
    $("#heroImage").style.backgroundImage = `url("${hero}")`;
    $("#heroImage").classList.add("has-image");
  }
  if ($("#year")) $("#year").textContent = new Date().getFullYear();

  const toggle = $(".nav-toggle");
  if (toggle) toggle.addEventListener("click", () => $(".nav")?.classList.toggle("open"));
}

async function loadCollection(dir) {
  // GitHub Action generates these manifest files from the collection folders.
  return await loadJSON(`data/${dir}/index.json`, []);
}

function card(item, kind = "") {
  const title = item.title || item.name || "Untitled";
  const image = normalizePath(item.cover || item.photo || item.image);
  const year = item.year ? `<span class="meta">${escapeHTML(item.year)}</span>` : "";
  const artist = typeof item.artist === "object"
    ? (item.artist.label || item.artist.value || "")
    : (item.artist || "");
  const description = item.description || item.biography || "";
  const website = item.website ? `<a class="tag" href="${escapeHTML(item.website)}" target="_blank" rel="noopener">Website ↗</a>` : "";
  const youtube = item.youtube ? `<a class="tag" href="${escapeHTML(item.youtube)}" target="_blank" rel="noopener">YouTube ↗</a>` : "";
  const spotify = item.spotify ? `<a class="tag" href="${escapeHTML(item.spotify)}" target="_blank" rel="noopener">Spotify ↗</a>` : "";

  return `<article class="card">
    <div class="card-media">${image ? `<img src="${escapeHTML(image)}" alt="">` : `<span>NO IMAGE</span>`}</div>
    <div class="card-body">
      ${year}
      <h3>${escapeHTML(title)}</h3>
      ${artist ? `<div class="meta">${escapeHTML(artist)}</div>` : ""}
      ${item.role ? `<span class="tag">${escapeHTML(item.role)}</span>` : ""}
      ${description ? `<p>${escapeHTML(stripMarkdown(description)).slice(0,220)}</p>` : ""}
      <div class="card-links">${website}${youtube}${spotify}</div>
    </div>
  </article>`;
}

async function initCatalog() {
  const containers = [...document.querySelectorAll("[data-dir]")];
  if (!containers.length) return;

  for (const container of containers) {
    const dir = container.dataset.dir;
    const kind = container.dataset.kind || "";
    const items = await loadCollection(dir);

    if (!items.length) {
      container.innerHTML = `<div class="empty">No entries yet. Add content in Pages CMS.</div>`;
      continue;
    }

    container.innerHTML = items
      .sort((a,b)=>(Number(b.year)||0)-(Number(a.year)||0))
      .map(x => card(x, kind))
      .join("");

    const search = container.closest("section")?.querySelector("#search");
    if (search) search.addEventListener("input", () => {
      const q = search.value.toLowerCase();
      [...container.children].forEach(el => {
        el.style.display = el.textContent.toLowerCase().includes(q) ? "" : "none";
      });
    });
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  await initSite();
  await initCatalog();
});
