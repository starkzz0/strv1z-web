// EDIT ONCE — global site settings (name, city, contact email, shopify)
// ============================================================
// STRV1Z — behavior (graphic-portfolio/script.js)
// ★ SHOP STATUS — set true to re-enable shop + cart everywhere.
// While false: cart stays shut, buy buttons show "opening soon".
// (Also re-link SHOP in the navs/footers when you flip this.)
// ============================================================
const SHOP_ENABLED = false;
// MAP: loader → hero canvas → clock → smooth scroll → header → page
//      transitions → tilted grid → WORKS ★ → shop (products/cart/shopify)
//      → info modal → TOC sidebar → reveal on scroll → forms.
// NOTHING below needs editing except the marked ★ arrays + SITE above.
// ============================================================
const SITE = { name:"strv1z", giant:"STRV1Z", city:"YOUR CITY", email:"hello@example.com",
  shopify: { domain:"", storefrontToken:"", collectionHandle:"posters" }
};
const POSTERS = [
  { id:"NOISE", title:"Noise Zine", desc:"GRUNGE TYPE / 2025", bg:"#1B1B18" },
  { id:"BLOOM", title:"Bloom Fest", desc:"TEXTURED / 2025", bg:"#24241F" },
  { id:"FERN", title:"Fern & Co", desc:"BRAND POSTER / 2024", bg:"#1B1B18" },
  { id:"ARCADE", title:"Retro Arcade", desc:"LOGO + POSTER / 2024", bg:"#141412" },
  { id:"SUNSET", title:"Sunset Records", desc:"GIG POSTER / 2024", bg:"#2A2118" },
  { id:"TYPE", title:"Grotesk Spec", desc:"TYPE POSTER / 2023", bg:"#1B1B18" },
];
const FAQS = [
  ["What services do you provide?","Posters, logos, brand kits, social packs, typography and art direction."],
  ["What is your typical timeline?","Posters 3–5 days, branding 1–2 weeks. Express 48h available."],
  ["What are your charges?",'Fixed packages from $45 + ready posters from $29 — <a href="shop.html">see shop →</a>'],
  ["How do we start?","Send a message via contact or <a href='shop.html#order'>shop order form →</a>. I confirm price + date within 24h, 50% upfront."],
  ["How many revisions?","2 on Starter, 3 on Pro/Brand. Extra revision +$10."],
  ["Do you use AI?","No. All type and texture work is hand-built."],
];
const $ = id => document.getElementById(id);
// entrance fade plays once per session — later page views paint instantly
try{ sessionStorage.setItem("strv1z_seen","1"); }catch(e){}
// loader — fast minimal veil: eased 0→100 counter, quick fade-rise exit (guarded, skips on reduced motion)
(function(){
  const box = $("loader"); if(!box) return;
  if(matchMedia("(prefers-reduced-motion: reduce)").matches){ box.remove(); return; }
  // safety: never trap the visitor
  const kill = setTimeout(()=>{ box.classList.add("done"); setTimeout(()=>box.remove(), 650); }, 4000);
  const count = $("loaderCount"), bar = $("loaderBar");
  const DUR = 750, t0 = performance.now();
  function tick(t){
    const k = Math.min(1, (t - t0) / DUR);
    const n = Math.round(100 * (1 - Math.pow(1 - k, 2)));
    if(count) count.textContent = String(n).padStart(2,"0");
    if(bar) bar.style.width = n + "%";
    if(k < 1){ requestAnimationFrame(tick); return; }
    clearTimeout(kill);
    setTimeout(()=>{ box.classList.add("done"); setTimeout(()=>box.remove(), 650); }, 120);
  }
  requestAnimationFrame(tick);
})();
// LE RÊVE header title — change giant word once here via SITE.giant (skip shop hero)
if($("lereveTitle")&&!document.querySelector(".shop-hero")) $("lereveTitle").textContent = SITE.giant;
if($("lereveBrand")) $("lereveBrand").textContent = SITE.giant;
if($("featSignName")) $("featSignName").textContent = SITE.name;
if($("giantName")) $("giantName").textContent = SITE.giant;
if($("aboutName")) $("aboutName").textContent = SITE.name;
document.querySelectorAll(".brand").forEach(b=>b.textContent = SITE.giant);
if($("city")) $("city").textContent = SITE.city;
if($("cityM")) $("cityM").textContent = SITE.city;

// auto-switching header image
(function(){
  const box = $("lereveSlides");
  if(!box) return;
  const slides = [...box.querySelectorAll(".lereve-slide")];
  let i = 0;
  setInterval(()=>{
    slides[i].classList.remove("is-active");
    i = (i+1) % slides.length;
    slides[i].classList.add("is-active");
  }, 2800);
})();

// hero magnet-lines field — lines ease toward the cursor (guarded)
(function(){
  const grid = $("magnetGrid"); if(!grid) return;
  // cursor-driven effect — dead weight (and battery drain) on touch
  if(matchMedia("(prefers-reduced-motion: reduce)").matches || matchMedia("(pointer: coarse)").matches){ grid.remove(); return; }
  const ROWS = 12, COLS = 20;
  grid.style.gridTemplateColumns = `repeat(${COLS},1fr)`;
  grid.style.gridTemplateRows = `repeat(${ROWS},1fr)`;
  const lines = [];
  for(let i=0;i<ROWS*COLS;i++){
    const s = document.createElement("span");
    grid.appendChild(s);
    lines.push({ el:s, a:0, t:0, cx:0, cy:0 });
  }
  const mouse = { x:innerWidth/2, y:innerHeight/2 };
  addEventListener("pointermove", e=>{ mouse.x = e.clientX; mouse.y = e.clientY; }, {passive:true});
  // measure once in PAGE coordinates (resize/fonts only) — the animation loop
  // then needs zero layout reads; scrolling converts the cursor instead.
  function measure(){
    const sx = scrollX, sy = scrollY;
    for(const l of lines){
      const r = l.el.getBoundingClientRect();
      l.cx = r.left + sx + r.width / 2; l.cy = r.top + sy + r.height / 2;
    }
  }
  measure();
  addEventListener("resize", measure);
  setTimeout(measure, 1200);
  if(document.fonts && document.fonts.ready) document.fonts.ready.then(measure);
  let raf = 0;
  function frame(){
    const mx = mouse.x + scrollX, my = mouse.y + scrollY;
    for(const l of lines){
      const ang = Math.atan2(my - l.cy, mx - l.cx) * 180 / Math.PI;
      let d = ang - l.a;
      while(d > 180) d -= 360; while(d < -180) d += 360;
      l.a += d * 0.12;
      l.el.style.transform = `rotate(${l.a.toFixed(2)}deg)`;
    }
    raf = requestAnimationFrame(frame);
  }
  // run only while the hero is on screen — nothing burns in the background
  if("IntersectionObserver" in window){
    new IntersectionObserver(en=>{
      if(en[0].isIntersecting){ if(!raf) raf = requestAnimationFrame(frame); }
      else if(raf){ cancelAnimationFrame(raf); raf = 0; }
    }, {rootMargin:"120px"}).observe(grid);
  } else raf = requestAnimationFrame(frame);
})();

// clock
function tick(){
  const t = new Date().toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'});
  ["clock","clock2","clockM"].forEach(id=>{ const e=$(id); if(e) e.textContent=t+" GMT"; });
}
tick(); setInterval(tick, 15000);

// buttery smooth scrolling (Lenis) across the whole site
(function initSmooth(){
  if(matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  if(!window.Lenis) return;
  const lenis = new window.Lenis({ lerp:0.09, wheelMultiplier:1, anchors:true, autoRaf:true });
  window.__lenis = lenis;
})();
function smoothTo(target){
  const el = typeof target === "string" ? document.querySelector(target) : target;
  if(!el) return;
  if(window.__lenis) window.__lenis.scrollTo(el, { offset:-90, duration:1.2 });
  else el.scrollIntoView({behavior:"smooth"});
}
// modal scroll lock — freezes the page behind any overlay, keeps inner scrolling,
// and compensates the scrollbar width so nothing shifts sideways.
function lockScroll(on){
  const de = document.documentElement;
  if(on){
    if(lockScroll._prev === undefined) lockScroll._prev = document.activeElement;
    const sw = window.innerWidth - de.clientWidth;
    de.style.paddingRight = sw > 0 ? sw + "px" : "";
    de.classList.add("scroll-locked");
    if(window.__lenis) window.__lenis.stop();
  } else {
    de.classList.remove("scroll-locked"); de.style.paddingRight = "";
    if(window.__lenis) window.__lenis.start();
    const p = lockScroll._prev; lockScroll._prev = undefined;
    if(p && document.contains(p)){ try{ p.focus({preventScroll:true}); }catch(e){} }
  }
}

// persistent header: same blur state on both pages, no sudden jump
function syncHeader(){ const h=$("siteHeader"); if(!h) return; h.classList.toggle("scrolled", window.scrollY>24); }
window.addEventListener("scroll", syncHeader, {passive:true}); syncHeader();

// directional page transitions: swipe along navbar order (HOME included).
// forward (later in nav) slides out to the left and the next page slides in
// from the right; backward mirrors it. Pages outside the navbar order (shop,
// content links, hashes) fall back to a plain cross-fade.
const NAV_ORDER = ["index.html","works.html","terms.html"];
function pageFile(href){ return new URL(href, location.href).pathname.split("/").pop() || "index.html"; }
document.addEventListener("click", e=>{
  const a=e.target.closest('a[href$=".html"],a[href*=".html#"]');
  if(!a||a.target==="_blank") return;
  // let modified clicks (new tab / download / context menu) behave natively
  if(e.ctrlKey||e.metaKey||e.shiftKey||e.altKey||e.button!==0) return;
  const url=new URL(a.getAttribute("href"), location.href);
  if(url.origin!==location.origin) return;
  // same-page link (e.g. the active nav item) — no reload, no swipe
  if(url.pathname===location.pathname) return;
  e.preventDefault();
  const fi = NAV_ORDER.indexOf(pageFile(location.href)), ti = NAV_ORDER.indexOf(pageFile(url.href));
  // navigate at the exact end of the outgoing transition (340ms slide /
  // 260ms fade) so the page is never cut mid-motion; reduced-motion collapses
  // those transitions to .01ms, so leave without waiting
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  let delay = reduce ? 0 : 260;
  if(fi >= 0 && ti >= 0 && fi !== ti){
    const dir = ti > fi ? "fwd" : "back";
    try{ sessionStorage.setItem("strv1z_dir", dir); }catch(err){}
    document.body.classList.add(dir === "fwd" ? "leaving-fwd" : "leaving-back");
    delay = reduce ? 0 : 340;
  } else {
    try{ sessionStorage.removeItem("strv1z_dir"); }catch(err){}
    document.body.classList.add("leaving");
  }
  setTimeout(()=>{ location.href=a.getAttribute("href"); }, delay);
});
// bfcache restore: never leave the page stuck mid-"leaving" (invisible)
window.addEventListener("pageshow", ()=>{ document.body.classList.remove("leaving","leaving-fwd","leaving-back"); });
window.addEventListener("load", ()=>{
  if(location.hash){ const t=document.querySelector(location.hash); if(t) setTimeout(()=>t.scrollIntoView({behavior:"instant"}),120); }
});

// featured scroll-tilted-grid (vanilla compat — replaces old auto-scroll strip)
const FEATURED = [
  { src:"images/feat-1.l.jpg", fb:"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1000&auto=format&fit=crop", alt:"Persona Gold — grunge anime poster by strv1z", title:"Persona Gold", sub:"2025" },
  { src:"images/feat-2.l.jpg", fb:"https://images.unsplash.com/photo-1512496015851-a90fb38ba796?q=80&w=1000&auto=format&fit=crop", alt:"Egress — pale collage poster by strv1z", title:"Egress", sub:"2025" },
  { src:"https://images.unsplash.com/photo-1568557412756-7d219873dd11?w=900&q=80&auto=format&fit=crop", alt:"Retro Arcade brand poster", title:"Retro Arcade", sub:"2024" },
  { src:"https://images.unsplash.com/photo-1624344965194-6aa6729ad832?w=900&q=80&auto=format&fit=crop", alt:"Sunset Records gig poster", title:"Sunset Records", sub:"2024" },
  { src:"https://images.unsplash.com/photo-1633382148761-d56d55cee3cd?w=900&q=80&auto=format&fit=crop", alt:"Grotesk type specimen poster", title:"Grotesk Spec", sub:"2023" },
  { src:"https://images.unsplash.com/photo-1514906689926-25ba6dcb584b?w=900&q=80&auto=format&fit=crop", alt:"Fern and Co brand poster", title:"Fern & Co", sub:"2024" },
];
const tilted = $("tiltedGrid");
if(tilted){
  tilted.innerHTML = FEATURED.map((f,i)=>`<figure data-tilt="${i}"><div class="tile"><img src="${f.src}" onerror="this.onerror=null;this.src='${f.fb||f.src}'" alt="${f.alt}" loading="${i<2?"eager":"lazy"}"></div><div class="cap"><span>${f.title}</span><span>${f.sub}</span></div></figure>`).join("");
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const tiles = [...tilted.querySelectorAll(".tile")];
  function tilt(){
    if(reduce) return;
    tiles.forEach((el,i)=>{
      const r = el.getBoundingClientRect();
      const travel = innerHeight + r.height;
      const pos = Math.min(1, Math.max(0, (innerHeight - r.top) / travel));
      const dist = Math.abs(pos - .5) * 2;
      const signed = (pos - .5) * 2;
      const eased = dist * dist * (3 - 2 * dist);
      const side = i % 2 === 0 ? -1 : 1;
      el.style.transform = `translate3d(${side*eased*10}%, ${-signed*eased*14}px, 0) rotateX(${-signed*14}deg) rotateZ(${side*signed*2}deg)`;
      el.style.filter = `blur(${eased*5}px) brightness(${1-eased*.4})`;
    });
  }
  let ticking = false;
  addEventListener("scroll", ()=>{ if(!ticking){ ticking = true; requestAnimationFrame(()=>{ tilt(); ticking = false; }); } }, {passive:true});
  addEventListener("resize", tilt); tilt();
}

// ============================================================
// ★ EDIT YOUR WORK HERE — add / remove / reorder posters freely
// Each entry needs: title, cat1, cat2, year, img
// Optional: fb (fallback image URL), dims (print size), desc, process
//
// ★ VARIANTS (extra images per work, shown as VERSION 01/02/… pills):
//   Add a "variants" list to any entry, e.g.
//   variants: [
//     { label:"VERSION 01", img:"images/my-poster.jpg" },
//     { label:"VERSION 02", img:"images/my-poster-detail.jpg" },
//   ]
//   Without "variants", the preview shows the main img as VERSION 01.
//   Drop image files into the "images/" folder first.
// Images: drop files into the "images/" folder, e.g. img:"images/my-poster.jpg"
// To add a poster, copy the template line, paste it, fill in your details.
// Numbering (01, 02…) and the counter update automatically.
// ============================================================
// TEMPLATE:
// { title:"My Poster", cat1:"Grunge", cat2:"Poster", year:"2026", img:"images/my-poster.jpg", fb:"", dims:"3600 × 4500 PX", desc:"One-line description.", process:["Step one","Step two"], variants:[{ label:"VERSION 01", img:"images/my-poster.jpg" },{ label:"VERSION 02", img:"images/my-poster-detail.jpg" }] },
const WORKS = [
  { title:"Persona Gold", cat1:"Grunge", cat2:"Poster", format:"posters", year:"2025", dims:"3600 × 4500 PX", img:"images/feat-1.l.jpg", fb:"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=900&auto=format&fit=crop", desc:"Gold-foil grunge poster built around a single heavyweight portrait and hand-set type. Grain, tears and misregistration kept in on purpose.", process:["Sketch + reference board","Custom type setting","Texture + distress pass","Print + social export"] },
  { title:"Egress", cat1:"Type", cat2:"Poster", format:"posters", year:"2025", dims:"3600 × 4500 PX", img:"images/feat-2.l.jpg", fb:"https://images.unsplash.com/photo-1512496015851-a90fb38ba796?q=80&w=900&auto=format&fit=crop", desc:"Pale collage study in restraint — soft paper tones, one quiet grid, minimal type doing maximal work.", process:["Collage studies","Grid + type system","Paper texture grade","Print + social export"] },
  { title:"Retro Arcade", cat1:"Brand", cat2:"Poster", format:"banners", year:"2024", dims:"3600 × 4500 PX", img:"https://images.unsplash.com/photo-1568557412756-7d219873dd11?w=900&q=80&auto=format&fit=crop", desc:"Neon arcade identity piece — lockup, poster and color system for a fictional retro venue.", process:["Lockup sketches","Neon color system","Poster application","Brand sheet export"] },
  { title:"Sunset Records", cat1:"Gig", cat2:"Poster", format:"banners", year:"2024", dims:"3600 × 4500 PX", img:"https://images.unsplash.com/photo-1624344965194-6aa6729ad832?w=900&q=80&auto=format&fit=crop", desc:"Gig poster in warm sunset grain — bold grotesk over heat-toned photography.", process:["Photo treatment","Grotesk setting","Grain + color grade","Print + social export"] },
  { title:"Grotesk Spec", cat1:"Type", cat2:"Poster", format:"layouts", year:"2023", dims:"3600 × 4500 PX", img:"https://images.unsplash.com/photo-1633382148761-d56d55cee3cd?w=900&q=80&auto=format&fit=crop", desc:"Twelve-weight type specimen sheet — grid notes, sizes and print-sharp setting for designers.", process:["Weight survey","Grid construction","Specimen setting","A2 print export"] },
  { title:"Fern & Co", cat1:"Brand", cat2:"Poster", format:"layouts", year:"2024", dims:"3600 × 4500 PX", img:"https://images.unsplash.com/photo-1514906689926-25ba6dcb584b?w=900&q=80&auto=format&fit=crop", desc:"Small brand poster pack — logo lockup, poster and a one-page mini guideline.", process:["Lockup + palette","Poster design","Mini guideline","Vector + print export"] },
];
(function(){
  const wg = $("workGrid"), wl = $("workList");
  if(!wg || !wl) return;
  // format filter (driven by the category fan-cards below; "all" default)
  let workFilter = "all";
  function renderWorks(){
    // chronological — oldest first, newest last (original indices kept so popups stay stable)
    const list = WORKS.map((w,i)=>({w,i})).filter(x=>workFilter==="all"||x.w.format===workFilter)
      .sort((a,b)=>(parseInt(a.w.year,10)||0)-(parseInt(b.w.year,10)||0));
    if($("workCount")) $("workCount").textContent = String(list.length).padStart(2,"0") + " / " + String(WORKS.length).padStart(2,"0");
    wg.innerHTML = list.map(({w,i},pos)=>`
    <button type="button" class="wcard" data-work="${i}" aria-label="${w.title} — view details"><span class="wcard-media"><img src="${w.img}" onerror="this.onerror=null;this.src='${w.fb||w.img}'" alt="${w.title}" loading="${pos<4?"eager":"lazy"}"><span class="wcard-hover"><span class="n">${String(pos+1).padStart(2,"0")} / ${String(list.length).padStart(2,"0")}</span><span class="t">${w.title}</span><span>${w.cat1} · ${w.cat2} · ${w.year}</span></span></span></button>`).join("");
    wl.innerHTML = list.map(({w,i},pos)=>`
    <button type="button" class="wrow" data-work="${i}"><span class="cats"><span>${w.cat1}</span><span>${w.cat2}</span></span><h3>${w.title}</h3><span class="yr">${w.year}</span><span class="n">${String(pos+1).padStart(2,"0")}</span></button>`).join("");
    if(typeof revealScan === "function") revealScan();
  }
  renderWorks();
  // pick up a format handed over from another page's nav dropdown
  let pendingFilter = null;
  try{ pendingFilter = sessionStorage.getItem("strv1z.workFilter"); }catch(e){}
  if(pendingFilter){
    sessionStorage.removeItem("strv1z.workFilter");
    if(pendingFilter !== "all"){
      workFilter = pendingFilter;
      renderWorks();
      setTimeout(()=>smoothTo("#workIndex"), 80);
    }
  }
  // project preview — full metadata only on click
  function openWork(i){
    const w = WORKS[i]; if(!w || !$("workModal")) return;
    openWorkIdx = i;
    // variants: extra images per work (defaults to the main image)
    const vs = (w.variants && w.variants.length) ? w.variants : [{ label:"VERSION 01", img:w.img, fb:w.fb }];
    const media = $("workMedia");
    function showVariant(v){
      const it = vs[v] || vs[0];
      if(media){ media.onerror = function(){ this.onerror=null; this.src=it.fb||w.fb||it.img; }; media.src = it.img; media.alt = w.title + " — " + it.label; }
      document.querySelectorAll("#workVariants button").forEach((x,xi)=>x.classList.toggle("on", xi === v));
    }
    if($("workVariants")) $("workVariants").innerHTML = vs.map((v,vi)=>`<button type="button" data-v="${vi}">${v.label}</button>`).join("");
    showVariant(0);
    if($("workTitle")) $("workTitle").textContent = w.title;
    if($("workNum")) $("workNum").textContent = String(i+1).padStart(2,"0") + " / " + String(WORKS.length).padStart(2,"0");
    if($("workYear")) $("workYear").textContent = "YEAR: " + w.year;
    if($("workDims")) $("workDims").textContent = w.dims;
    if($("workOrder")) $("workOrder").href = `shop.html?want=${encodeURIComponent(w.title)}#order`;
    const m = $("workModal");
    m.classList.remove("closing"); m.classList.add("open"); m.setAttribute("aria-hidden","false");
    lockScroll(true);
    const pvBox = m.querySelector(".pv");
    if(pvBox){
      pvBox.classList.remove("go"); void pvBox.offsetWidth;
      const kick = ()=>{ pvBox.classList.add("go"); const x=$("workClose"); if(x){ try{ x.focus({preventScroll:true}); }catch(e){} } };
      requestAnimationFrame(()=>requestAnimationFrame(kick));
      setTimeout(()=>{ if(!pvBox.classList.contains("go")) kick(); }, 350);
    }
  }
  let openWorkIdx = -1;
  if($("workVariants")) $("workVariants").addEventListener("click", e=>{
    const b = e.target.closest("button"); if(!b || openWorkIdx < 0) return;
    const w = WORKS[openWorkIdx]; if(!w) return;
    const vs = (w.variants && w.variants.length) ? w.variants : [{ label:"VERSION 01", img:w.img, fb:w.fb }];
    const it = vs[+b.dataset.v] || vs[0];
    const media = $("workMedia");
    if(media){ media.onerror = function(){ this.onerror=null; this.src=it.fb||w.fb||it.img; }; media.src = it.img; }
    document.querySelectorAll("#workVariants button").forEach(x=>x.classList.toggle("on", x === b));
  });
  function closeWork(){
    const m = $("workModal"); if(!m || !m.classList.contains("open")) return;
    const pvBox = m.querySelector(".pv"); if(pvBox) pvBox.classList.remove("go");
    // fade the backdrop + pop the card in one pass (open removed immediately)
    m.classList.add("closing"); m.classList.remove("open"); m.setAttribute("aria-hidden","true");
    lockScroll(false);
    setTimeout(()=>m.classList.remove("closing"), 320);
  }
  document.addEventListener("click", e=>{
    const card = e.target.closest("[data-work]");
    if(card && ($("workGrid") || $("workList"))){ openWork(+card.dataset.work); return; }
  });
  if($("workOrder")) $("workOrder").addEventListener("click", e=>{
    if(!SHOP_ENABLED){ e.preventDefault(); toast("Shop opening soon"); }
  });
  if($("workClose")) $("workClose").addEventListener("click", closeWork);
  if($("workModal")) $("workModal").addEventListener("click", e=>{ if(e.target.id === "workModal") closeWork(); });
  document.addEventListener("keydown", e=>{ if(e.key === "Escape") closeWork(); });
  document.querySelectorAll(".works-toggle .chip").forEach(ch=>ch.addEventListener("click", ()=>{
    document.querySelectorAll(".works-toggle .chip").forEach(c=>{ c.classList.remove("active"); c.setAttribute("aria-selected","false"); });
    ch.classList.add("active"); ch.setAttribute("aria-selected","true");
    const list = ch.dataset.view === "list";
    wl.hidden = !list; wg.hidden = list;
    if(typeof revealScan === "function") revealScan();
  }));
  // hover preview follows cursor (fine pointers only)
  if(matchMedia("(hover:hover) and (pointer:fine)").matches){
    const peek = $("workPeek");
    if(peek){
      const img = peek.querySelector("img");
      wl.addEventListener("mousemove", e=>{
        peek.style.left = Math.min(e.clientX + 24, innerWidth - 320) + "px";
        peek.style.top = Math.min(Math.max(e.clientY - 160, 80), innerHeight - 420) + "px";
      });
      wl.addEventListener("mouseover", e=>{
        const row = e.target.closest(".wrow"); if(!row || !wl.contains(row)) return;
        const w = WORKS[+row.dataset.work]; if(!w) return;
        if(img.dataset.k === row.dataset.work && peek.classList.contains("on")) return;
        img.dataset.k = row.dataset.work;
        img.onerror = function(){ this.onerror=null; this.src=w.fb||w.img; };
        img.src = w.img; peek.classList.add("on");
      });
      wl.addEventListener("mouseleave", ()=>{ peek.classList.remove("on"); img.dataset.k = ""; });
    }
  }
  if(typeof revealScan === "function") revealScan();
  // expose the filter driver so the nav dropdown (bound on every page) can drive it
  window.__strv1zWorks = { setFilter(f){
    workFilter = f;
    document.querySelectorAll("#catRow .cat").forEach(x=>{
      const on = x.dataset.format === f;
      x.classList.toggle("open", on);
      x.setAttribute("aria-pressed", String(on));
    });
    renderWorks();
  } };
  // category fan-cards: fan open on click, filter the grid, click again for all
  (function(){
    const row = $("catRow"); if(!row) return;
    const cards = [...row.querySelectorAll(".cat")];
    const now = new Date();
    row.querySelectorAll(".cat-month").forEach(b=>b.textContent = now.toLocaleString([], {month:"long"}));
    row.querySelectorAll(".cat-year").forEach(s=>s.textContent = now.getFullYear());
    cards.forEach(c=>{
      const n = WORKS.filter(w=>w.format===c.dataset.format).length;
      const cc = c.querySelector(".cat-count"); if(cc) cc.textContent = String(n).padStart(2,"0");
    });
    if(pendingFilter && pendingFilter !== "all"){
      cards.forEach(x=>{
        const on = x.dataset.format === pendingFilter;
        x.classList.toggle("open", on);
        x.setAttribute("aria-pressed", String(on));
      });
    }
    cards.forEach(c=>c.addEventListener("click", ()=>{
      const next = c.classList.contains("open") ? "all" : c.dataset.format;
      workFilter = next;
      cards.forEach(x=>{ const on = x.dataset.format===next; x.classList.toggle("open", on); x.setAttribute("aria-pressed", on); });
      renderWorks();
      if(next !== "all"){ const idx = $("workIndex"); if(idx) smoothTo("#workIndex"); }
    }));
  })();
  // warm the poster files so the popup opens without decode jank
  const warm = ()=>WORKS.forEach(w=>{ const im = new Image(); im.src = w.img; });
  if("requestIdleCallback" in window) requestIdleCallback(warm); else setTimeout(warm, 1500);
})();
// nav dropdown — filters the grid on works.html, hands the filter over on other pages
document.querySelectorAll("#workDrop .work-drop-item").forEach(b=>b.addEventListener("click", ()=>{
  const f = b.dataset.format || "all";
  const api = window.__strv1zWorks;
  if(api && typeof api.setFilter === "function" && $("workGrid")){
    api.setFilter(f);
    smoothTo("#workIndex");
  }else{
    try{ sessionStorage.setItem("strv1z.workFilter", f); }catch(e){}
    location.href = "works.html";
  }
  // on touch the dropdown was opened by a tap — close it after picking
  document.querySelectorAll(".work-drop.open").forEach(d=>d.classList.remove("open"));
}));

// touch devices have no :hover — make the "Works" link itself open the
// dropdown: first tap opens it, second tap navigates. Outside tap / Esc close.
(function(){
  if(!matchMedia("(hover: none)").matches) return; // desktop keeps hover
  document.querySelectorAll('.work-nav > a[href="works.html"]').forEach(a=>{
    a.addEventListener("click", e=>{
      const drop = a.parentElement && a.parentElement.querySelector(".work-drop");
      if(!drop || drop.classList.contains("open")) return; // already open → follow the link
      e.preventDefault();
      document.querySelectorAll(".work-drop.open").forEach(d=>{ if(d !== drop) d.classList.remove("open"); });
      drop.classList.add("open");
    });
  });
  document.addEventListener("click", e=>{
    if(!e.target.closest(".work-nav"))
      document.querySelectorAll(".work-drop.open").forEach(d=>d.classList.remove("open"));
  });
  document.addEventListener("keydown", e=>{
    if(e.key === "Escape")
      document.querySelectorAll(".work-drop.open").forEach(d=>d.classList.remove("open"));
  });
})();

// works tape — gapless ticker: rebuild two identical halves so EACH covers the
// tape width (measured with live font metrics), keeping the -50% loop seamless
// at any viewport; speed held constant (~80px/s) via width-scaled duration
(function(){
  const track = $("tapeTrack"); if(!track || !track.parentElement) return;
  const UNIT = "SEE MORE.\u00A0";
  function unitW(){
    const s = document.createElement("span");
    s.style.cssText = "position:absolute;visibility:hidden;white-space:nowrap;";
    s.textContent = UNIT;
    track.appendChild(s);
    const w = s.offsetWidth || 90;
    s.remove();
    return w;
  }
  function build(){
    const tapeW = track.parentElement.clientWidth || innerWidth;
    const reps = Math.max(6, Math.ceil(tapeW / unitW()) + 1);
    track.textContent = "";
    for(let h = 0; h < 2; h++){
      const half = document.createElement("span");
      half.textContent = UNIT.repeat(reps);
      if(h) half.setAttribute("aria-hidden", "true");
      track.appendChild(half);
    }
    // constant scroll speed on every screen: duration follows half-width
    track.style.animationDuration = Math.max(8, (track.scrollWidth / 2) / 80).toFixed(1) + "s";
  }
  build();
  if(document.fonts && document.fonts.ready) document.fonts.ready.then(build);
  let t = 0;
  addEventListener("resize", ()=>{ clearTimeout(t); t = setTimeout(build, 200); });
  // smooth hover pause — CSS play-state freezes mid-frame (erratic); eased
  // velocity glides to a halt on hover and back on leave (CSS anim = fallback)
  const tape = track.parentElement;
  if(!matchMedia("(prefers-reduced-motion: reduce)").matches){
    track.style.animation = "none";
    const PX_PER_SEC = 80;
    let x = 0, cur = 1, goal = 1, last = 0;
    tape.addEventListener("pointerenter", ()=>{ goal = 0; });
    tape.addEventListener("pointerleave", ()=>{ goal = 1; });
    requestAnimationFrame(function tick(now){
      if(last){
        const dt = Math.min(0.05, (now - last) / 1000);
        cur += (goal - cur) * (1 - Math.pow(0.001, dt)); // frame-rate independent glide
        if(Math.abs(cur) > 0.0005){
          x -= cur * PX_PER_SEC * dt;
          const h = track.scrollWidth / 2 || 1;
          x = ((x % h) + h) % h; // wrap across the identical halves
          track.style.transform = "translate3d(" + (-x).toFixed(1) + "px,0,0)";
        }
      }
      last = now;
      requestAnimationFrame(tick);
    });
  }
})();

// works index — editorial rows with numbers (signature: hover shifts art, cursor names the project)
const grid = $("worksGrid");
if(grid) grid.innerHTML = POSTERS.map((p,i)=>`
  <div class="work rv" data-cursor="${String(i+1).padStart(2,"0")} — ${p.title}"><span class="work-index">${String(i+1).padStart(2,"0")}</span><div class="work-art" style="background:${p.bg}">${p.id}</div>
  <div class="work-meta"><div><h4>${p.title}</h4><p>${p.desc}</p></div>
  <a class="enq" href="shop.html?want=${encodeURIComponent(p.title)}#order">Buy →</a></div></div>`).join("");
// signature cursor label — quietly names the hovered project (rAF-throttled)
(function(){
  const label = $("cursorLabel"); if(!label) return;
  let pending = null, raf = 0;
  function apply(){
    raf = 0;
    const t = pending.target && pending.target.closest("[data-cursor]");
    if(t){ label.textContent = t.dataset.cursor; label.classList.add("on"); label.style.left = pending.clientX+"px"; label.style.top = pending.clientY+"px"; }
    else label.classList.remove("on");
  }
  document.addEventListener("mousemove", e=>{ pending = e; if(!raf) raf = requestAnimationFrame(apply); }, {passive:true});
})();
// reveal on scroll — rows enter at slightly different scales
(function(){
  const els = [...document.querySelectorAll(".rv")];
  if(!("IntersectionObserver" in window)){ els.forEach(el=>el.classList.add("in")); return; }
  const io = new IntersectionObserver(entries=>{
    entries.forEach(en=>{ if(en.isIntersecting){ en.target.classList.add("in"); io.unobserve(en.target); } });
  }, {threshold:.12});
  els.forEach((el,i)=>{ el.style.transitionDelay = Math.min(i*60,300)+"ms"; io.observe(el); });
})();

// faq
const fl = $("faqList");
if(fl) fl.innerHTML = FAQS.map((f,i)=>`
  <div class="faq"><button type="button" aria-expanded="false"><span><span class="num">0${i+1}</span> &nbsp;${f[0]}</span><span class="plus" aria-hidden="true">+</span></button><div class="body"><div class="body-in">${f[1]}</div></div></div>`).join("");
document.addEventListener("click", e=>{
  const b = e.target.closest(".faq button");
  if(b){ const open = b.parentElement.classList.toggle("open"); b.setAttribute("aria-expanded", open); }
});

// notion-like quick-scroll sidebar for terms (guarded)
(function(){
  const nav = $("tocNav"); if(!nav) return;
  const mobileNav = $("tocNavMobile");
  const terms = [...document.querySelectorAll("#terms .term")];
  if(!terms.length) return;
  function addLink(targetId, label){
    const clean = label.trim().replace(/\s+/g," ").replace(/^(\d+)\s+(.*)$/, "$1 — $2");
    const mk = ()=>{
      const a = document.createElement("a");
      a.href = "#" + targetId;
      a.textContent = clean;
      a.title = clean;
      a.setAttribute("aria-label", clean);
      a.addEventListener("click", e=>{
        e.preventDefault();
        links.forEach(l=>l.classList.toggle("active", l.dataset.target===targetId));
        smoothTo("#"+targetId); history.replaceState(null,"","#"+targetId);
        const det = a.closest("details"); if(det) det.open = false;
      });
      a.dataset.target = targetId;
      return a;
    };
    nav.appendChild(mk());
    if(mobileNav) mobileNav.appendChild(mk());
  }
  terms.forEach((art,i)=>{
    if(!art.id) art.id = "t" + String(i+1).padStart(2,"0");
    const label = (art.querySelector("h3")||{}).textContent || ("Section "+(i+1));
    addLink(art.id, label);
  });
  const qr = $("quickref");
  if(qr){ if(!qr.id) qr.id = "quickref"; addLink("quickref", "Quick reference"); }
  const links = [...document.querySelectorAll("#tocNav a, #tocNavMobile a")];
  const spy = new IntersectionObserver(entries=>{
    entries.forEach(en=>{
      if(en.isIntersecting){
        links.forEach(l=>l.classList.toggle("active", l.getAttribute("href")==="#"+en.target.id));
      }
    });
  }, {rootMargin:"-30% 0px -60% 0px"});
  terms.forEach(t=>spy.observe(t));
})();

// contact form reveals only via "start a project" (guarded)
if($("startProjectBtn")) $("startProjectBtn").addEventListener("click", e=>{
  e.preventDefault();
  const box = $("contactForm"); if(!box) return;
  box.hidden = false;
  setTimeout(()=>smoothTo("#contactForm"), 60);
});

// reveal on scroll — every section fades in (guarded; re-runnable for dynamic grids)
function revealScan(){
  const els = [...document.querySelectorAll("section.sec, .term, .product, .price-card, .feat-sign, .tilted figure, .formbox, .wcard, .wrow")].filter(el=>!el.classList.contains("rv")&&!el.dataset.rvDone);
  if(!("IntersectionObserver" in window)){ els.forEach(el=>el.classList.add("in")); return; }
  els.forEach(el=>{ el.classList.add("rv"); el.dataset.rvDone = "1"; });
  const io = new IntersectionObserver(entries=>{
    entries.forEach(en=>{ if(en.isIntersecting){ en.target.classList.add("in"); io.unobserve(en.target); } });
  }, {threshold:.1, rootMargin:"0px 0px -6% 0px"});
  document.querySelectorAll(".rv:not(.in)").forEach(el=>{
    if(el.dataset.rvSeen) return; el.dataset.rvSeen = "1";
    const sibs = el.parentElement ? [...el.parentElement.children].filter(c=>c.classList.contains("rv")) : [el];
    el.style.transitionDelay = Math.min(Math.max(0, sibs.indexOf(el))*70, 280)+"ms";
    io.observe(el);
  });
  // failsafe: never leave content invisible (e.g. observer stalls on some mobile browsers)
  function forceVisible(){
    document.querySelectorAll(".rv:not(.in)").forEach(el=>{
      const r = el.getBoundingClientRect();
      if(r.top < innerHeight * 0.92 && r.bottom > 0) el.classList.add("in");
    });
  }
  setTimeout(forceVisible, 900);
  setTimeout(()=>document.querySelectorAll(".rv:not(.in)").forEach(el=>el.classList.add("in")), 4000);
}
revealScan();

// hello form
const hf = $("helloForm");
if(hf) hf.addEventListener("submit", e=>{
  e.preventDefault();
  const fd = new FormData(hf);
  const body = encodeURIComponent(`Name: ${fd.get("name")}\nEmail: ${fd.get("email")}\n\n${fd.get("msg")}`);
  location.href = `mailto:${SITE.email}?subject=${encodeURIComponent("Project — "+fd.get("name"))}&body=${body}`;
});

// shop page logic (guarded)
// ============================================================
// ★ EDIT SHOP PRODUCTS HERE — copy the template line, fill in details.
// Fields: id (unique), title, cat, price, old (sale price or null),
// rating, reviews, badge (or null), year, img, bg (flat color).
// shopifyVariantId/shopifyHandle: leave null until Shopify is connected.
// ============================================================
// TEMPLATE:
// { id:"p9", title:"My Poster", cat:"grunge", price:49, old:null, rating:5.0, reviews:10, badge:"NEW", year:"2026", img:"images/my-poster.jpg", fb:"", bg:"#1B1B18", desc:"One line.", specs:["A3 print-ready","Digital files"], shopifyVariantId:null, shopifyHandle:"my-poster" },
const PRODUCTS = [
  { id:"p1", title:"Persona Gold", cat:"grunge", price:49, old:69, rating:4.9, reviews:128, badge:"BESTSELLER", year:"2025", dims:"3600 × 4500 PX", img:"images/feat-1.l.jpg", fb:"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop", bg:"#2A2118", desc:"Gold-foil grunge anime poster. Hand-built type + grain, printed on 250gsm matte.", specs:["A3 / A2 print-ready","250gsm matte + digital files","Limited run of 100","Ships in 3–5 days"], shopifyVariantId:null, shopifyHandle:"persona-gold" },
  { id:"p2", title:"Egress", cat:"type", price:39, old:55, rating:4.8, reviews:96, badge:"NEW", year:"2025", dims:"3600 × 4500 PX", img:"images/feat-2.l.jpg", fb:"https://images.unsplash.com/photo-1512496015851-a90fb38ba796?q=80&w=800&auto=format&fit=crop", bg:"#24241F", desc:"Pale collage poster. Soft paper texture, minimal type system.", specs:["A3 / A2 print-ready","200gsm silk + digital","Open edition","Ships in 3–5 days"], shopifyVariantId:null, shopifyHandle:"egress" },
  { id:"p3", title:"Noise Zine", cat:"grunge", price:45, old:null, rating:4.9, reviews:74, badge:"LOW STOCK", year:"2025", bg:"#1B1B18", desc:"Raw xerox-style zine poster. Loud headers, dirty borders.", specs:["A3 + social kit","Digital + print PDF","Only 12 left","Ships in 48h"], shopifyVariantId:null, shopifyHandle:"noise-zine" },
  { id:"p4", title:"Bloom Fest", cat:"gig", price:35, old:45, rating:4.7, reviews:61, badge:null, year:"2025", bg:"#24241F", desc:"Festival poster with textured bloom type. High contrast for walls.", specs:["A3 / A2","Digital included","Open edition","Ships in 3–5 days"], shopifyVariantId:null, shopifyHandle:"bloom-fest" },
  { id:"p5", title:"Fern & Co", cat:"brand", price:59, old:null, rating:5.0, reviews:42, badge:"LIMITED", year:"2024", bg:"#1B1B18", desc:"Brand poster pack — logo lockup + poster + mini guideline.", specs:["Logo + poster set","Vector + print PDF","Commercial license","1–2 weeks custom"], shopifyVariantId:null, shopifyHandle:"fern-co" },
  { id:"p6", title:"Retro Arcade", cat:"gig", price:29, old:39, rating:4.6, reviews:88, badge:"SALE", year:"2024", bg:"#141412", desc:"Neon arcade poster. Perfect for rooms / studios.", specs:["A3 print-ready","Digital files","Open edition","Ships in 3–5 days"], shopifyVariantId:null, shopifyHandle:"retro-arcade" },
  { id:"p7", title:"Sunset Records", cat:"gig", price:32, old:null, rating:4.8, reviews:53, badge:null, year:"2024", bg:"#2A2118", desc:"Gig poster with sunset grain. Warm reds, bold grotesk.", specs:["A3 / A2","Digital included","Open edition","Ships in 3–5 days"], shopifyVariantId:null, shopifyHandle:"sunset-records" },
  { id:"p8", title:"Grotesk Spec", cat:"type", price:42, old:52, rating:4.9, reviews:67, badge:"BESTSELLER", year:"2023", bg:"#1B1B18", desc:"Type specimen poster. 12 weights, grid notes, print-sharp.", specs:["A2 type sheet","Print PDF + PNG","Designers favourite","Ships in 3–5 days"], shopifyVariantId:null, shopifyHandle:"grotesk-spec" },
];
// ---- SHOPIFY SUPPORT (demo mode: fill SITE.shopify.domain to go live) ----
function shopifyCfg(){
  try {
    const saved = JSON.parse(localStorage.getItem("strv1z_shopify")||"{}");
    return { domain:(saved.domain||SITE.shopify.domain||"").replace(/^https?:\/\//,"").replace(/\/$/,""), token:saved.token||SITE.shopify.storefrontToken||"" };
  } catch(e){ return { domain:SITE.shopify.domain||"", token:SITE.shopify.storefrontToken||"" }; }
}
function shopifyEnabled(){ return !!shopifyCfg().domain; }
function shopifyProductUrl(p){ const c=shopifyCfg(); if(!c.domain||!p.shopifyHandle) return null; return `https://${c.domain}/products/${p.shopifyHandle}`; }
function shopifyCartUrl(){
  const c=shopifyCfg(); if(!c.domain||!cart.length) return null;
  const parts=[];
  for(const line of cart){
    const p=PRODUCTS.find(x=>x.id===line.id); if(!p||!p.shopifyVariantId) return null;
    parts.push(`${p.shopifyVariantId}:${line.qty}`);
  }
  if(!parts.length) return null;
  return `https://${c.domain}/cart/${parts.join(",")}`;
}
async function shopifyCheckout(){
  const url=shopifyCartUrl();
  if(url){ location.href=url; return; }
  // No variant IDs yet -> fall back to single-handle or store frontpage, keep cart text for manual order
  const c=shopifyCfg();
  if(c.domain){ location.href=`https://${c.domain}/cart`; return; }
  toast("Add your Shopify domain first ↓");
  smoothTo("#shopify");
}
async function shopifyFetchProducts(){
  const c=shopifyCfg(); if(!c.domain||!c.token) return null;
  const q=`{ products(first:20, query:"product_type:Poster") { edges { node { title handle variants(first:5){ edges{ node{ id price { amount } } } } } } } }`;
  try{
    const r=await fetch(`https://${c.domain}/api/2024-01/graphql.json`,{method:"POST",headers:{"Content-Type":"application/json","X-Shopify-Storefront-Access-Token":c.token},body:JSON.stringify({query:q})});
    if(!r.ok) return null; return await r.json();
  }catch(e){ return null; }
}
function refreshShopifyUI(){
  const on=shopifyEnabled();
  document.querySelectorAll("[data-shopify-only]").forEach(el=>{ el.style.display=on?"":"none"; });
  const badge=$("shopifyStatus"); if(badge) badge.textContent=on?`● CONNECTED: ${shopifyCfg().domain}`:"○ DEMO MODE — local cart only";
  const d=$("shopifyDomain"), t=$("shopifyToken");
  if(d&&!d.value) d.value=shopifyCfg().domain||"";
  if(t&&!t.value) t.value=shopifyCfg().token||"";
}
let activeCat = "all";
function money(n){ return "$"+n; }
function stars(r){ const f=Math.round(r); return "★".repeat(f)+"☆".repeat(5-f); }

// cart state
let cart = [];
try { cart = JSON.parse(localStorage.getItem("strv1z_cart")||"[]"); } catch(e){ cart=[]; }
if(!Array.isArray(cart)) cart = [];
function saveCart(){ try{ localStorage.setItem("strv1z_cart", JSON.stringify(cart)); }catch(e){} }
function cartQty(){ return cart.reduce((s,c)=>s+c.qty,0); }
function cartSum(){ return cart.reduce((s,c)=>{ const p=PRODUCTS.find(x=>x.id===c.id); if(!p) return s; const extra=c.sizeExtra||0; return s+(p.price+extra)*c.qty; },0); }
function toast(msg){ const t=$("toast"); if(!t) return; t.textContent=msg; t.classList.add("show"); clearTimeout(t._h); t._h=setTimeout(()=>t.classList.remove("show"),1800); }
function updateCartUI(){
  const qty = cartQty();
  const btn = $("cartBtn");
  if(btn) btn.style.display = (!SHOP_ENABLED || qty === 0) ? "none" : "";
  if($("cartCount")) $("cartCount").textContent = qty;
  if($("cartCount2")) $("cartCount2").textContent = qty;
  if($("cartTotal")) $("cartTotal").textContent = money(cartSum());
  const box=$("cartItems"); if(!box) return;
  if(!cart.length){ box.innerHTML = `<p class="mono muted" style="font-size:12px;text-align:center;margin-top:40px">Cart is empty.<br/>Tap INFO on a poster to see details.</p>`; return; }
  box.innerHTML = cart.map(c=>{
    const p=PRODUCTS.find(x=>x.id===c.id); if(!p) return "";
    const thumb = p.img ? `<img src="${p.img}" onerror="this.remove()" alt="">` : "";
    return `<div class="cart-item"><div class="cart-thumb" style="background:${p.bg}">${thumb}${p.img?"":p.title.slice(0,2)}</div>
    <div style="flex:1"><h5>${p.title}</h5><p class="mono muted" style="font-size:11px;margin:4px 0">${c.sizeLabel||"A3"} • ${money(p.price+(c.sizeExtra||0))}</p>
    <div class="cart-qty"><button data-dec="${c.key}">−</button><span class="mono">${c.qty}</span><button data-inc="${c.key}">+</button><button data-rem="${c.key}" style="width:auto;padding:0 8px;font-size:11px">remove</button></div></div></div>`;
  }).join("");
}
function addToCart(id, qty=1, sizeLabel="A3", sizeExtra=0){
  if(!SHOP_ENABLED){ toast("Shop opening soon"); return; }
  const key = id+"|"+sizeLabel;
  const ex = cart.find(c=>c.key===key);
  if(ex) ex.qty = Math.min(10, ex.qty+qty); else cart.push({key,id,qty,sizeLabel,sizeExtra});
  saveCart(); updateCartUI(); toast("Added to cart ✓"); openCart();
}
function openCart(){
  if(!SHOP_ENABLED) return;
  if($("cartDrawer")){ $("cartDrawer").classList.add("open"); $("cartBackdrop").classList.add("open"); }
  clearTimeout(openCart._t);
  openCart._t = setTimeout(closeCart, 5000);
}
function closeCart(){
  clearTimeout(openCart._t);
  if($("cartDrawer")){ $("cartDrawer").classList.remove("open"); $("cartBackdrop").classList.remove("open"); }
}

// shop grid
function renderShop(){
  const g=$("shopGrid"); if(!g) return;
  const q=(($("shopSearch")||{}).value||"").toLowerCase();
  const sort=(($("shopSort")||{}).value||"feat");
  let list=PRODUCTS.filter(p=>(activeCat==="all"||p.cat===activeCat)&&(p.title.toLowerCase().includes(q)||p.desc.toLowerCase().includes(q)));
  if(sort==="low") list=[...list].sort((a,b)=>a.price-b.price);
  if(sort==="high") list=[...list].sort((a,b)=>b.price-a.price);
  if(sort==="rating") list=[...list].sort((a,b)=>b.rating-a.rating);
  g.innerHTML=list.map(p=>{
    const art = p.img ? `<img src="${p.img}" onerror="this.onerror=null;this.src='${p.fb||""}'" alt="${p.title}" loading="lazy">` : p.title.slice(0,4);
    const sUrl = shopifyProductUrl(p);
    return `<div class="product">
      <div class="product-art" data-info="${p.id}" style="background:${p.bg}">${p.badge?`<span class="product-badge${p.badge==="SALE"||p.badge==="LOW STOCK"?" red":""}">${p.badge}</span>`:""}${art}</div>
      <div class="product-body"><div><h4>${p.title}</h4><p class="product-cat">${p.cat.toUpperCase()} / ${p.year}</p></div>
      <div class="stars">${stars(p.rating)} <span class="mono muted" style="font-size:11px">${p.rating} (${p.reviews})</span></div>
      <div class="product-row"><span class="product-price">${money(p.price)}${p.old?`<s>${money(p.old)}</s>`:""}</span><span class="mono muted" style="font-size:11px">IN STOCK ✓</span></div>
      <div class="product-actions"><button class="btn-info" data-info="${p.id}">INFO ⓘ</button><button class="btn-buy" data-buy="${p.id}">ADD TO CART</button></div>
      ${sUrl?`<a class="mono muted" style="font-size:11px;text-align:center" href="${sUrl}" target="_blank" rel="noopener">View on Shopify ↗</a>`:`<span class="mono muted" style="font-size:11px;text-align:center;opacity:.6">Shopify: add variant ID to enable direct checkout</span>`}
      </div></div>`;
  }).join("") || `<p class="mono muted">No posters found. Try another search.</p>`;
  if(typeof revealScan === "function") revealScan();
}

// info modal
let currentInfo=null;
function openInfo(id){
  const p=PRODUCTS.find(x=>x.id===id); if(!p) return; currentInfo=p;
  if($("infoMedia")){ $("infoMedia").style.background=p.bg; $("infoMedia").innerHTML=(p.img?`<img src="${p.img}" onerror="this.onerror=null;this.src='${p.fb||""}'" alt="">`:"")+`<span style="position:relative;z-index:1">${p.img?"":p.title}</span>`; }
  if($("infoCat")) $("infoCat").textContent=`${p.cat.toUpperCase()} / ${p.year} • ${p.reviews} REVIEWS`;
  if($("infoTitle")) $("infoTitle").textContent=p.title;
  if($("infoStars")) $("infoStars").innerHTML=`${stars(p.rating)} <span class="mono muted">${p.rating} (${p.reviews})</span>`;
  if($("infoPrice")) $("infoPrice").textContent=money(p.price);
  if($("infoOld")) $("infoOld").textContent=p.old?money(p.old):"";
  if($("infoBadge")){ $("infoBadge").textContent=p.badge||"ORIGINAL"; $("infoBadge").style.display=p.badge?"":"none"; }
  if($("infoDesc")) $("infoDesc").textContent=p.desc;
  if($("infoSpecs")) $("infoSpecs").innerHTML=p.specs.map(s=>`<li>${s}</li>`).join("");
  if($("infoQty")) $("infoQty").value=1;
  const im = $("infoModal");
  im.classList.add("open"); im.setAttribute("aria-hidden","false");
  lockScroll(true);
  const x = $("infoClose"); if(x) requestAnimationFrame(()=>{ try{ x.focus({preventScroll:true}); }catch(e){} });
}
function closeInfo(){
  const im = $("infoModal"); if(!im) return;
  if(!im.classList.contains("open")) return;
  im.classList.remove("open"); im.setAttribute("aria-hidden","true");
  lockScroll(false);
}

document.addEventListener("click", e=>{
  const inf=e.target.closest("[data-info]"); if(inf){ openInfo(inf.dataset.info); return; }
  const buy=e.target.closest("[data-buy]"); if(buy){ const p=PRODUCTS.find(x=>x.id===buy.dataset.buy); if(p) addToCart(p.id,1,"A3",0); return; }
  const chip=e.target.closest("#shopFilters .chip"); if(chip){ document.querySelectorAll("#shopFilters .chip").forEach(c=>c.classList.remove("active")); chip.classList.add("active"); activeCat=chip.dataset.cat; renderShop(); return; }
  const dec=e.target.closest("[data-dec]"); if(dec){ const it=cart.find(c=>c.key===dec.dataset.dec); if(it){ it.qty--; if(it.qty<=0) cart=cart.filter(c=>c.key!==it.key); saveCart(); updateCartUI(); } return; }
  const inc=e.target.closest("[data-inc]"); if(inc){ const it=cart.find(c=>c.key===inc.dataset.inc); if(it){ it.qty=Math.min(10,it.qty+1); saveCart(); updateCartUI(); } return; }
  const rem=e.target.closest("[data-rem]"); if(rem){ cart=cart.filter(c=>c.key!==rem.dataset.rem); saveCart(); updateCartUI(); return; }
});
if($("shopSearch")) $("shopSearch").addEventListener("input", renderShop);
if($("shopSort")) $("shopSort").addEventListener("change", renderShop);
if($("infoClose")) $("infoClose").addEventListener("click", closeInfo);
if($("infoModal")) $("infoModal").addEventListener("click", e=>{ if(e.target.id==="infoModal") closeInfo(); });
document.addEventListener("keydown", e=>{ if(e.key==="Escape"){ closeInfo(); closeCart(); } });
if($("cartBtn")) $("cartBtn").addEventListener("click", openCart);
if($("cartDrawer")) $("cartDrawer").addEventListener("pointermove", ()=>{
  if(!$("cartDrawer").classList.contains("open")) return;
  clearTimeout(openCart._t);
  openCart._t = setTimeout(closeCart, 5000);
}, {passive:true});
if($("cartClose")) $("cartClose").addEventListener("click", closeCart);
if($("cartBackdrop")) $("cartBackdrop").addEventListener("click", closeCart);
if($("continueBtn")) $("continueBtn").addEventListener("click", closeCart);
if($("infoAdd")) $("infoAdd").addEventListener("click", ()=>{ if(!currentInfo) return; const q=Math.max(1,+$("infoQty").value||1); const sel=$("infoSize"); const label=sel?sel.options[sel.selectedIndex].text.split(" (")[0]:"A3"; const extra=sel?+sel.value:0; addToCart(currentInfo.id,q,label,extra); });
if($("infoBuy")) $("infoBuy").addEventListener("click", ()=>{ if(!currentInfo) return; const q=Math.max(1,+$("infoQty").value||1); const sel=$("infoSize"); const label=sel?sel.options[sel.selectedIndex].text.split(" (")[0]:"A3"; const extra=sel?+sel.value:0; addToCart(currentInfo.id,q,label,extra); closeInfo(); setTimeout(()=>smoothTo("#order"),300); if($("orderPackage")) $("orderPackage").value="Cart checkout"; const ta=document.querySelector('#orderForm textarea'); if(ta) ta.value=`Cart: ${currentInfo.title} x${q} (${label}) — $${(currentInfo.price+extra)*q}. Name/address: ...`; });
if($("checkoutBtn")) $("checkoutBtn").addEventListener("click", ()=>{ closeCart(); const o=document.getElementById("order"); if(o){ smoothTo(o); if($("orderPackage")) $("orderPackage").value="Cart checkout"; const ta=document.querySelector('#orderForm textarea'); if(ta&&cart.length){ ta.value="CART:\n"+cart.map(c=>{ const p=PRODUCTS.find(x=>x.id===c.id); return `• ${p.title} (${c.sizeLabel}) x${c.qty} — $${(p.price+c.sizeExtra)*c.qty}`; }).join("\n")+`\nTotal: $${cartSum()}\n\nName/address: ...`; } } else { location.href="shop.html#order"; } });
if($("shopifyCheckoutBtn")) $("shopifyCheckoutBtn").addEventListener("click", shopifyCheckout);
if($("shopifyBuyBtn")) $("shopifyBuyBtn").addEventListener("click", ()=>{ if(!currentInfo) return; const u=shopifyProductUrl(currentInfo); if(u) window.open(u,"_blank"); else toast("Set Shopify domain + handle first"); });
if($("shopifySave")) $("shopifySave").addEventListener("click", ()=>{ const d=($("shopifyDomain").value||"").trim(), t=($("shopifyToken").value||"").trim(); localStorage.setItem("strv1z_shopify", JSON.stringify({domain:d,token:t})); refreshShopifyUI(); renderShop(); toast(d?"Shopify connected ✓":"Shopify cleared"); });
if($("shopifyTest")) $("shopifyTest").addEventListener("click", async ()=>{ toast("Testing Shopify…"); const r=await shopifyFetchProducts(); toast(r?"Shopify API OK ✓":"API failed — check domain/token"); if(r) console.log(r); });
renderShop(); updateCartUI(); refreshShopifyUI();

if($("orderPackage")){
  const w=new URLSearchParams(location.search).get("want");
  if(w){ const ta=document.querySelector('#orderForm textarea'); if(ta) ta.value=`Hi! I saw "${w}" in your works. I'd like something similar. My idea: ...`; }
}
document.addEventListener("click", e=>{
  const b=e.target.closest("[data-order]");
  if(b&&$("orderPackage")){ $("orderPackage").value=b.dataset.order; smoothTo("#order"); }
});
if($("orderForm")) $("orderForm").addEventListener("submit",e=>{
  e.preventDefault(); const fd=new FormData(e.target);
  const txt=`Name: ${fd.get("name")}\nEmail: ${fd.get("email")}\nPackage: ${fd.get("package")}\nBrief:\n${fd.get("brief")}`;
  $("orderSummary").textContent="✓ READY:\n"+txt;
  location.href=`mailto:${SITE.email}?subject=${encodeURIComponent("Order — "+fd.get("package"))}&body=${encodeURIComponent(txt)}`;
});

// split-text mask reveal — staggered character entrance (Framer-style).
// Applied to display titles + hero tagline; scroll-triggered, hero delayed past the loader.
(function(){
  if(matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  function splitChars(el){
    if(!el || el.dataset.split) return;
    el.dataset.split = "1";
    // keep the original wording available to screen readers (chars are aria-hidden)
    const spoken = el.textContent.replace(/\s+/g," ").trim();
    if(spoken) el.setAttribute("aria-label", spoken);
    let idx = 0;
    const out = [];
    el.childNodes.forEach(node=>{
      if(node.nodeType === 3){
        node.textContent.split("").forEach(ch=>{
          if(ch === " " || ch === "\n"){ out.push(document.createTextNode(" ")); return; }
          const m = document.createElement("span"); m.className = "split-mask"; m.setAttribute("aria-hidden","true");
          const c = document.createElement("span"); c.className = "split-ch"; c.style.setProperty("--i", idx++); c.textContent = ch;
          m.appendChild(c); out.push(m);
        });
      }
      else if(node.nodeName === "BR"){ out.push(node); }
      else { const m = document.createElement("span"); m.className = "split-mask"; node.classList.add("split-ch"); node.style.setProperty("--i", idx++); m.appendChild(node); out.push(m); }
    });
    el.replaceChildren(...out);
    el.classList.add("split-root");
  }
  const scrollTargets = [];
  document.querySelectorAll(".sec-title, .page-title, .cta-title, .archive-title, .hero-tagline").forEach(el=>{
    if(el.classList.contains("hero-tagline")) return;
    splitChars(el); scrollTargets.push(el);
  });
  if("IntersectionObserver" in window){
    const io = new IntersectionObserver(entries=>{
      entries.forEach(en=>{ if(en.isIntersecting){ en.target.classList.add("in"); io.unobserve(en.target); } });
    }, {threshold:.3});
    scrollTargets.forEach(el=>io.observe(el));
  } else scrollTargets.forEach(el=>el.classList.add("in"));
  const hero = document.querySelector(".hero-tagline");
  if(hero){ splitChars(hero); setTimeout(()=>hero.classList.add("in"), 1150); }
})();

// hero headline fit guard - shrink until one line fits (covers slow or failed
// webfonts and odd viewports). Only ever shrinks; never grows past the CSS size.
(function(){
  const h = document.querySelector(".kai-headline"); if(!h) return;
  function fit(){
    h.style.fontSize = "";
    const max = h.parentElement.clientWidth || innerWidth;
    let px = parseFloat(getComputedStyle(h).fontSize) || 100, guard = 0;
    while(h.scrollWidth > max && guard++ < 40 && px > 40){ px *= max / h.scrollWidth; h.style.fontSize = px + "px"; }
  }
  fit();
  if(document.fonts && document.fonts.ready) document.fonts.ready.then(()=>setTimeout(fit, 50));
  if(document.fonts && document.fonts.load) document.fonts.load('700 100px Oswald').then(()=>fit()).catch(()=>{});
  let tm = 0;
  addEventListener("resize", ()=>{ clearTimeout(tm); tm = setTimeout(fit, 200); });
})();
