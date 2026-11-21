async function loadJSON(url){const r=await fetch(url); if(!r.ok) throw new Error(url); return r.json();}
async function loadCollection(path){
  const manifest = await fetch(path + "/index.json").catch(()=>null);
  if(manifest && manifest.ok) return manifest.json();
  return [];
}
function esc(v=""){return String(v).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]));}
function media(url, fallback=""){
  return url ? `<img src="${esc(url)}" alt="">` : `<span>${esc(fallback)}</span>`;
}
function card(item, type){
  const meta=[item.year,item.category || item.artist].filter(Boolean).join(" • ");
  const links=[];
  if(item.audio) links.push(`<a href="${esc(item.audio)}" target="_blank" rel="noopener">Audio</a>`);
  if(item.spotify) links.push(`<a href="${esc(item.spotify)}" target="_blank" rel="noopener">Spotify</a>`);
  if(item.youtube) links.push(`<a href="${esc(item.youtube)}" target="_blank" rel="noopener">YouTube</a>`);
  if(item.link) links.push(`<a href="${esc(item.link)}" target="_blank" rel="noopener">View</a>`);
  return `<article class="card">
    <div class="card-media">${media(item.cover || item.image, type==="music" ? "MUSIC" : "WORK")}</div>
    <div class="card-body">
      <div class="meta">${esc(meta)}</div>
      <h3>${esc(item.title)}</h3>
      ${item.role ? `<p>${esc(item.role)}</p>` : ""}
      ${item.description ? `<p style="margin-top:10px">${esc(item.description)}</p>` : ""}
      ${links.length ? `<div class="links">${links.join("")}</div>` : ""}
    </div>
  </article>`;
}
async function loadDir(path){
  // Cloudflare Pages serves static files, so the browser cannot list a directory.
  // Keep a small manifest file generated from the content folder.
  const r=await fetch(path+"/index.json");
  if(!r.ok) return [];
  return r.json();
}
(async()=>{
  try{
    const site=await loadJSON("data/site.json");
    document.title=site.title || "Kaisutee Portfolio";
    heroName.textContent=site.name||"Kaisutee";
    heroTagline.textContent=site.tagline||"";
    heroBio.textContent=site.bio||"";
    aboutBio.textContent=site.bio||"";
    if(site.email){
      emailLink.href="mailto:"+site.email;
      emailLink.textContent=site.email;
    }else{emailLink.style.display="none";}
    const s=site.social||{};
    socials.innerHTML=[["Facebook",s.facebook],["Instagram",s.instagram],["YouTube",s.youtube]]
      .filter(x=>x[1]).map(x=>`<a href="${esc(x[1])}" target="_blank" rel="noopener">${x[0]}</a>`).join("");
    year.textContent=new Date().getFullYear();

    const [music,works]=await Promise.all([loadDir("content/music"),loadDir("content/works")]);
    musicGrid.innerHTML=music.length?music.map(x=>card(x,"music")).join(""):`<div class="empty">ยังไม่มีรายการเพลง</div>`;
    worksGrid.innerHTML=works.length?works.map(x=>card(x,"works")).join(""):`<div class="empty">ยังไม่มีผลงาน</div>`;
  }catch(e){
    console.error(e);
    musicGrid.innerHTML=`<div class="empty">ไม่สามารถโหลดข้อมูลผลงานได้</div>`;
    worksGrid.innerHTML=`<div class="empty">ไม่สามารถโหลดข้อมูลผลงานได้</div>`;
  }
})();
