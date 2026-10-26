// ===================== I18N (ລາວ / ไทย / English) =====================
const LANGS = ['lo','th','en'];
const DOC_KEY = document.getElementById('albums') ? 'doc.title.portfolio' : 'doc.title.index';
let DICT = {}, LANG = 'lo';

function t(key){
  const e = DICT[key];
  return e ? (e[LANG] || e.lo) : '';
}
function savedLang(){
  try { const v = localStorage.getItem('lang'); if (LANGS.includes(v)) return v; } catch(e){}
  const n = (navigator.language || 'lo').toLowerCase();
  if (n.startsWith('th')) return 'th';
  if (n.startsWith('lo')) return 'lo';
  return n.startsWith('en') ? 'en' : 'lo';
}
// ປ່ຽນສະເພາະ text node ທຳອິດ — ບໍ່ໃຫ້ icon svg ຂ້າງໃນຫາຍ
function setText(el, val){
  const tn = [...el.childNodes].find(n => n.nodeType === 3 && n.textContent.trim());
  if (tn) tn.textContent = val; else el.prepend(document.createTextNode(val));
}
function applyLang(lang){
  LANG = LANGS.includes(lang) ? lang : 'lo';
  try { localStorage.setItem('lang', LANG); } catch(e){}
  document.documentElement.lang = LANG;

  document.querySelectorAll('[data-i18n]').forEach(el => {
    const v = t(el.dataset.i18n); if (v) setText(el, v);
  });
  document.querySelectorAll('[data-i18n-html]').forEach(el => {
    const v = t(el.dataset.i18nHtml); if (v) el.innerHTML = v;
  });
  const dt = t(DOC_KEY); if (dt) document.title = dt;

  // ປຸ່ມພາສາ
  document.querySelectorAll('.lang button').forEach(b =>
    b.setAttribute('aria-pressed', b.dataset.lang === LANG));

  // ລິ້ງ WhatsApp ທົ່ວໄປ (ບໍ່ລວມປຸ່ມໃນ card ແພັກເກັດ)
  document.querySelectorAll('a[href^="https://wa.me/"]').forEach(a => {
    if (a.closest('.pane')) return;
    a.href = 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(t('wa.generic'));
  });

  if (typeof buildCardWA === 'function') buildCardWA();
  if (typeof renderAlbums === 'function') renderAlbums();

  document.documentElement.classList.remove('i18n-pending');
  document.documentElement.classList.add('i18n-ready');
}

document.querySelectorAll('.lang button').forEach(b =>
  b.addEventListener('click', () => applyLang(b.dataset.lang)));

fetch('assets/i18n.json')
  .then(r => r.json())
  .then(d => { DICT = d; applyLang(savedLang()); })
  .catch(() => { document.documentElement.classList.remove('i18n-pending'); });

// year
document.getElementById('yr').textContent = new Date().getFullYear();

// sticky nav shadow
const nav = document.getElementById('nav');
const onScroll = () => nav.classList.toggle('stuck', window.scrollY > 8);
onScroll(); addEventListener('scroll', onScroll, {passive:true});

// tabs: ຮູບ / ວິດີໂອ
const tabs = [...document.querySelectorAll('[role="tab"]')];
const ind  = document.querySelector('.toggle .ind');

function moveIndicator(){
  const on = tabs.find(t => t.getAttribute('aria-selected') === 'true');
  if (!on || !ind) return;
  ind.style.width  = on.offsetWidth + 'px';
  ind.style.height = on.offsetHeight + 'px';
  ind.style.transform = 'translate(' + on.offsetLeft + 'px,' + on.offsetTop + 'px)';
}
function selectTab(tab){
  tabs.forEach(t => t.setAttribute('aria-selected', t === tab));
  moveIndicator();
}

// ກົດປຸ່ມ = ເລື່ອນໄປຫາກຸ່ມນັ້ນ (ເນື້ອຫາບໍ່ຖືກເຊື່ອງ — scroll ຕໍ່ກັນໄດ້)
tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    selectTab(tab);
    const head = document.getElementById(tab.id.replace('tab-', 'head-'));
    if (!head) return;
    // ເລື່ອນເອງ ພ້ອມເວັ້ນໄລຍະໃຫ້ແຖບ nav ບໍ່ບັງຫົວຂໍ້
    const nav = document.querySelector('.nav');
    const gap = (nav ? nav.offsetHeight : 66) + 18;
    const y = head.getBoundingClientRect().top + scrollY - gap;
    scrollTo({top: y, behavior: 'smooth'});
  });
});
moveIndicator();
addEventListener('resize', moveIndicator, {passive:true});
if (document.fonts && document.fonts.ready) document.fonts.ready.then(moveIndicator);

// scroll ຮອດກຸ່ມໃດ ປຸ່ມຍ້າຍຕາມເອງ
const panes = ['photo','video'].map(k => document.getElementById('pane-' + k)).filter(Boolean);
if (panes.length === 2){
  const spy = new IntersectionObserver(es => {
    es.forEach(e => {
      if (!e.isIntersecting) return;
      const key = e.target.id.replace('pane-', '');
      const tab = document.getElementById('tab-' + key);
      if (tab && tab.getAttribute('aria-selected') !== 'true') selectTab(tab);
    });
  }, {rootMargin:'-45% 0px -45% 0px'});
  panes.forEach(p => spy.observe(p));
}

// ລຳດັບ delay ຂອງແຕ່ລະ card
document.querySelectorAll('.cards').forEach(grid => {
  [...grid.children].forEach((c, i) => c.style.setProperty('--d', i));
});

// ແຖບຄວາມຄືບໜ້າຕອນ scroll
const bar = document.getElementById('progress');
const onProgress = () => {
  const h = document.documentElement.scrollHeight - innerHeight;
  bar.style.transform = 'scaleX(' + (h > 0 ? scrollY / h : 0) + ')';
};
onProgress(); addEventListener('scroll', onProgress, {passive:true});
addEventListener('resize', onProgress, {passive:true});

// ຕົວເລກນັບຂຶ້ນ
function countUp(el){
  const target = +el.dataset.count;
  const suffix = el.dataset.suffix || '';
  const dur = 1100;
  const t0 = performance.now();
  const step = now => {
    const p = Math.min((now - t0) / dur, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.round(target * eased).toLocaleString('en-US') + suffix;
    if (p < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

// ປຸ່ມໂທ: ມືຖືໂທໄດ້ເລີຍ · desktop ຄັດລອກເບີໃຫ້ແທນ
const PHONE_DISPLAY = '020 55959236';
const toastEl = document.getElementById('toast');
const toastMsg = document.getElementById('toast-msg');
let toastTimer;
function toast(msg){
  toastMsg.textContent = msg;
  toastEl.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toastEl.classList.remove('show'), 3200);
}
const canDial = matchMedia('(hover:none) and (pointer:coarse)').matches;
document.querySelectorAll('a[href^="tel:"]').forEach(a => {
  a.addEventListener('click', e => {
    if (canDial) return;                       // ມືຖື / tablet → ປ່ອຍໃຫ້ໂທປົກກະຕິ
    e.preventDefault();
    const done = () => toast(t('toast.copied') + ' ' + PHONE_DISPLAY);
    const fail = () => toast(t('toast.phone') + ' ' + PHONE_DISPLAY);
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(PHONE_DISPLAY).then(done).catch(fail);
    } else { fail(); }
  });
});

// ປຸ່ມແພັກເກັດ → WhatsApp ພ້ອມຂໍ້ມູນແພັກເກັດທີ່ເລືອກ
const WA_NUMBER = '8562055959236';

function buildCardWA(){
  document.querySelectorAll('.pane .card').forEach(card => {
    const btn = card.querySelector('a.btn');
    if (!btn) return;

    const type  = card.closest('.pane').id === 'pane-video' ? t('wa.video') : t('wa.photo');
    const nameEl  = card.querySelector('h3');
    const name  = nameEl ? nameEl.textContent.trim() : '';
    const price = card.querySelector('.price b').textContent.trim();
    const hours = [...card.querySelectorAll('.hours span')].map(h => h.textContent.trim()).join(' / ');
    const was   = card.querySelector('.price s');
    const save  = card.querySelector('.save');

    const msg = [
      t('wa.hello'), '',
      t('wa.interested'),
      t('wa.type')  + ': ' + type,
      t('wa.pkg')   + ': ' + name,
      t('wa.time')  + ': ' + hours,
      t('wa.price') + ': ' + price + ' ฿',
      ...(was ? [t('wa.normal') + ': ' + was.textContent.trim() + ' (' + save.textContent.trim() + ')'] : []),
      '', t('wa.ask')
    ].join('\n');

    btn.href = 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(msg);
    btn.target = '_blank';
    btn.rel = 'noopener';
  });
}

// ວັດຄວາມສູງແຖບລຸ່ມມືຖື → ກັນບໍ່ໃຫ້ມັນບັງເນື້ອຫາ
const mbar = document.querySelector('.mbar');
if (mbar){
  const setMbar = () => {
    const h = mbar.offsetHeight;
    document.documentElement.style.setProperty('--mbar-h', (h ? h : 78) + 'px');
  };
  setMbar();
  addEventListener('resize', setMbar, {passive:true});
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(setMbar);
  if (window.ResizeObserver) new ResizeObserver(setMbar).observe(mbar);
}

// ================= GALLERY (ອັລບັ້ມ + ເບິ່ງເຕັມຈໍ) =================
const albumsEl = document.getElementById('albums');
if (albumsEl){
  const albumsView = document.getElementById('albumsView');
  const albumView  = document.getElementById('albumView');
  const shotsEl    = document.getElementById('shots');
  const viewer = document.getElementById('viewer');
  const vImg   = document.getElementById('vImg');
  const vCount = document.getElementById('vCount');
  let album = null, idx = 0;

  let ALBUMS = [];
  const aTitle = a => a['title_' + LANG] || a.title;
  const aDesc  = a => a['desc_'  + LANG] || a.desc;

  window.renderAlbums = function(){
    if (!ALBUMS.length) return;
    albumsEl.innerHTML = ALBUMS.map((a, i) => `
      <button class="album" type="button" data-i="${i}">
        <span class="n">${a.photos.length} ${t('g.photos')}</span>
        <span class="ph"><img src="${a.cover}" alt="${aTitle(a)}" loading="lazy"></span>
        <span class="cap"><h3>${aTitle(a)}</h3><p>${aDesc(a)}</p></span>
      </button>`).join('');
    albumsEl.querySelectorAll('.album').forEach(btn =>
      btn.addEventListener('click', () => openAlbum(ALBUMS[+btn.dataset.i])));
    if (album){                       // ອັລບັ້ມທີ່ເປີດຢູ່ → ປ່ຽນຫົວຂໍ້ຕາມ
      document.getElementById('albumTitle').textContent = aTitle(album);
      document.getElementById('albumDesc').textContent  = aDesc(album);
    }
  };

  fetch('gallery/albums.json')
    .then(r => r.json())
    .then(data => { ALBUMS = data.albums; renderAlbums(); })
    .catch(() => {
      albumsEl.innerHTML = '<p style="color:var(--muted)">' + (t('g.error') || 'ໂຫຼດອັລບັ້ມບໍ່ສຳເລັດ') + '</p>';
    });

  function openAlbum(a){
    album = a;
    document.getElementById('albumTitle').textContent = aTitle(a);
    document.getElementById('albumDesc').textContent  = aDesc(a);
    const link = document.getElementById('albumPost');
    if (a.post){ link.href = a.post; link.hidden = false; } else { link.hidden = true; }
    shotsEl.innerHTML = a.photos.map((ph, i) => `
      <button type="button" data-i="${i}">
        <img src="${ph.thumb}" alt="${aTitle(a)} ${i + 1}" loading="lazy" width="${ph.w}" height="${ph.h}">
      </button>`).join('');
    shotsEl.querySelectorAll('button').forEach(b =>
      b.addEventListener('click', () => openViewer(+b.dataset.i)));
    albumsView.hidden = true;
    albumView.hidden = false;
    document.getElementById('albums-sec').scrollIntoView({behavior:'smooth', block:'start'});
  }

  document.getElementById('backBtn').addEventListener('click', () => {
    albumView.hidden = true;
    albumsView.hidden = false;
    document.getElementById('albums-sec').scrollIntoView({behavior:'smooth', block:'start'});
  });

  function openViewer(i){
    idx = i;
    show();
    viewer.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function show(){
    const ph = album.photos[idx];
    vImg.src = ph.src;
    vImg.alt = aTitle(album) + ' ' + (idx + 1);
    vCount.textContent = (idx + 1) + ' / ' + album.photos.length;
  }
  const step = d => { idx = (idx + d + album.photos.length) % album.photos.length; show(); };
  function closeViewer(){
    viewer.classList.remove('open');
    document.body.style.overflow = '';
    vImg.src = '';
  }

  document.getElementById('vNext').addEventListener('click', e => { e.stopPropagation(); step(1); });
  document.getElementById('vPrev').addEventListener('click', e => { e.stopPropagation(); step(-1); });
  document.getElementById('vClose').addEventListener('click', closeViewer);
  viewer.addEventListener('click', e => { if (e.target === viewer) closeViewer(); });
  addEventListener('keydown', e => {
    if (!viewer.classList.contains('open')) return;
    if (e.key === 'Escape') closeViewer();
    if (e.key === 'ArrowRight') step(1);
    if (e.key === 'ArrowLeft')  step(-1);
  });
  // ປັດຊ້າຍ-ຂວາຢູ່ມືຖື
  let x0 = null;
  viewer.addEventListener('touchstart', e => { x0 = e.touches[0].clientX; }, {passive:true});
  viewer.addEventListener('touchend', e => {
    if (x0 === null) return;
    const dx = e.changedTouches[0].clientX - x0;
    if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1);
    x0 = null;
  }, {passive:true});
}

// scroll reveal
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const io = new IntersectionObserver(es => {
  es.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.classList.add('in');
    e.target.querySelectorAll('[data-count]').forEach(n => { if (!reduced) countUp(n); });
    io.unobserve(e.target);
  });
}, {threshold:.08, rootMargin:'0px 0px -40px 0px'});

document.querySelectorAll('.rv, .cards, .addons, .incl').forEach(el => io.observe(el));
