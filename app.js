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
    if (u.hostname.includes("youtube.com")) {
      if (u.pathname.startsWith("/embed/")) return u.pathname.split("/embed/")[1];
      return u.searchParams.get("v") || "";
    }
  } catch {}
  return "";
}

async function initSite() {
  const site = await loadJSON("data/site.json", {});
  if ($("#tagline")) $("#tagline").textContent = site.tagline || "MUSIC PRODUCER • COMPOSER • ARRANGER";
  if ($("#bio")) {
    const bio = String(site.bio || "Welcome to my portfolio.");
    $("#bio").innerHTML = bio.replace(/\n/g, "<br>");
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
  const index = await loadJSON(`data/${dir}/index.json`, null);
  if (Array.isArray(index)) {
    return Promise.all(index.map(item => loadJSON(`data/${dir}/${item}`, {})));
  }
  return [];
}

function imagePath(value) {
  return normalizePath(value);
}

function card(item, kind = "") {
  const title = item.title || item.name || "Untitled";
  const image = imagePath(item.cover || item.photo || item.image);
  const year = item.year ? `<span class="meta">${item.year}</span>` : "";
  const artist = typeof item.artist === "object" ? (item.artist.label || item.artist.value || "") : (item.artist || "");
  return `<article class="card">
    <div class="card-media">${image ? `<img src="${image}" alt="">` : `<span>NO IMAGE</span>`}</div>
    <div class="card-body">
      ${year}
      <h3>${escapeHTML(title)}</h3>
      ${artist ? `<div class="meta">${escapeHTML(artist)}</div>` : ""}
      ${item.role ? `<span class="tag">${escapeHTML(item.role)}</span>` : ""}
      ${item.description ? `<p>${stripMarkdown(String(item.description)).slice(0,180)}</p>` : ""}
      ${kind === "song" && item.youtube ? `<a class="tag" href="${escapeAttr(item.youtube)}" target="_blank" rel="noopener">YouTube ↗</a>` : ""}
    </div>
  </article>`;
}

function escapeHTML(s) {
  return s.replace(/[&<>"']/g, c => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;" }[c]));
}
function escapeAttr(s) { return escapeHTML(s); }
function stripMarkdown(s) { return s.replace(/[#*_`>]/g,"").replace(/\[([^\]]+)\]\([^)]+\)/g,"$1"); }

async function initCatalog() {
  const container = $("#cards");
  if (!container) return;
  const dir = container.dataset.dir;
  const kind = container.dataset.kind || "";
  const items = await loadCollection(dir);
  if (!items.length) {
    container.innerHTML = `<div class="empty">No entries yet. Add content in Pages CMS.</div>`;
    return;
  }
  container.innerHTML = items.sort((a,b)=>(b.year||0)-(a.year||0)).map(x => card(x, kind)).join("");
  const search = $("#search");
  if (search) search.addEventListener("input", () => {
    const q = search.value.toLowerCase();
    [...container.children].forEach(el => el.style.display = el.textContent.toLowerCase().includes(q) ? "" : "none");
  });
}

document.addEventListener("DOMContentLoaded", async () => {
  await initSite();
  await initCatalog();
});
