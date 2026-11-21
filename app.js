const $ = (selector) => document.querySelector(selector);

async function loadJSON(path, fallback = {}) {
  try {
    const res = await fetch(path, { cache: "no-store" });
    if (!res.ok) throw new Error(`${res.status} ${path}`);
    return await res.json();
  } catch (error) {
    console.warn("Could not load", path, error);
    return fallback;
  }
}

function normalizePath(value) {
  if (!value) return "";
  if (typeof value === "string") return value;
  if (typeof value === "object") {
    return value.path || value.value || value.url || "";
  }
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

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, (c) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  }[c]));
}

function stripMarkdown(value) {
  return String(value)
    .replace(/[#*_`>]/g, "")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");
}

async function initSite() {
  const site = await loadJSON("data/site.json", {});

  // Site Settings > Name controls the navbar and footer name.
  const name = String(site.name || "Kaisutee").trim();
  const tagline = String(
    site.tagline || "MUSIC PRODUCER • COMPOSER • ARRANGER"
  ).trim();

  if ($("#siteName")) $("#siteName").textContent = name;
  if ($("#footerName")) $("#footerName").textContent = name;
  if ($("#footerTagline")) $("#footerTagline").textContent = tagline;
  if ($("#heroTagline")) $("#heroTagline").textContent = tagline;

  const bio = String(
    site.bio || "Welcome to my portfolio.\nMusic, production, compositions\nand selected works."
  );
  if ($("#heroBio")) $("#heroBio").innerHTML = escapeHTML(bio).replace(/\\n/g, "<br>");

  document.title = `${name} — ${tagline}`;

  // Site Settings > Main Page Cover controls the HOME image.
  const hero = normalizePath(site.hero_image);
  const heroEl = $("#heroImage");

  if (heroEl) {
    heroEl.style.backgroundImage = hero ? `url("${hero}")` : "";
    heroEl.classList.toggle("has-image", Boolean(hero));
  }

  if ($("#year")) $("#year").textContent = new Date().getFullYear();

  const toggle = $(".nav-toggle");
  const nav = $(".nav");

  if (toggle && nav) {
    toggle.addEventListener("click", () => nav.classList.toggle("open"));
  }
}

async function loadCollection(dir) {
  return await loadJSON(`data/${dir}/index.json`, []);
}

function card(item, kind = "") {
  const title = item.title || item.name || "Untitled";
  const image = normalizePath(item.cover || item.photo || item.image);
  const year = item.year
    ? `<span class="meta">${escapeHTML(item.year)}</span>`
    : "";

  const artist = typeof item.artist === "object"
    ? (item.artist.label || item.artist.value || "")
    : (item.artist || "");

  return `<article class="card">
    <div class="card-media">
      ${image
        ? `<img src="${escapeHTML(image)}" alt="">`
        : `<span>NO IMAGE</span>`}
    </div>
    <div class="card-body">
      ${year}
      <h3>${escapeHTML(title)}</h3>
      ${artist ? `<div class="meta">${escapeHTML(artist)}</div>` : ""}
      ${item.role ? `<span class="tag">${escapeHTML(item.role)}</span>` : ""}
      ${item.description
        ? `<p>${escapeHTML(stripMarkdown(item.description)).slice(0, 180)}</p>`
        : ""}
      ${kind === "song" && item.youtube
        ? `<a class="tag" href="${escapeHTML(item.youtube)}" target="_blank" rel="noopener">YouTube ↗</a>`
        : ""}
    </div>
  </article>`;
}

async function initCatalog() {
  const container = $("#cards");
  if (!container) return;

  const dir = container.dataset.dir;
  const kind = container.dataset.kind || "";
  const items = await loadCollection(dir);

  if (!items.length) {
    container.innerHTML =
      `<div class="empty">No entries yet. Add content in Pages CMS.</div>`;
    return;
  }

  container.innerHTML = items
    .sort((a, b) => (Number(b.year) || 0) - (Number(a.year) || 0))
    .map((item) => card(item, kind))
    .join("");

  const search = $("#search");
  if (search) {
    search.addEventListener("input", () => {
      const q = search.value.toLowerCase();
      [...container.children].forEach((el) => {
        el.style.display = el.textContent.toLowerCase().includes(q)
          ? ""
          : "none";
      });
    });
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  await initSite();
  await initCatalog();
});
