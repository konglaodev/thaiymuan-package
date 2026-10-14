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

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    tabs.forEach(t => {
      const on = t === tab;
      t.setAttribute('aria-selected', on);
      const pane = document.getElementById(t.getAttribute('aria-controls'));
      pane.hidden = !on;
      if (on) {                                   // ເຮັດໃຫ້ card ຂຶ້ນເປັນລຳດັບໃໝ່
        pane.classList.remove('in');
        void pane.offsetWidth;                    // restart transition
        requestAnimationFrame(() => pane.classList.add('in'));
      }
    });
    moveIndicator();
  });
});
moveIndicator();
addEventListener('resize', moveIndicator, {passive:true});
if (document.fonts && document.fonts.ready) document.fonts.ready.then(moveIndicator);

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
    const done = () => toast('ຄັດລອກເບີແລ້ວ · ' + PHONE_DISPLAY);
    const fail = () => toast('ເບີໂທ: ' + PHONE_DISPLAY);
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(PHONE_DISPLAY).then(done).catch(fail);
    } else { fail(); }
  });
});

// ປຸ່ມແພັກເກັດ → WhatsApp ພ້ອມຂໍ້ມູນແພັກເກັດທີ່ເລືອກ
const WA_NUMBER = '8562055959236';

document.querySelectorAll('.pane .card').forEach(card => {
  const btn = card.querySelector('a.btn');
  if (!btn) return;

  const type  = card.closest('.pane').id === 'pane-video' ? 'ຖ່າຍວິດີໂອ' : 'ຖ່າຍຮູບ';
  const name  = card.querySelector('h3').textContent.trim();
  const price = card.querySelector('.price b').textContent.trim();
  const hours = [...card.querySelectorAll('.hours span')].map(h => h.textContent.trim()).join(' ແລະ ');
  const was  = card.querySelector('.price s');
  const save = card.querySelector('.save');

  const msg = [
    'ສະບາຍດີ Thaiymuan Production',
    '',
    'ຂ້ອຍສົນໃຈແພັກເກັດນີ້:',
    'ປະເພດ: ' + type,
    'ແພັກເກັດ: ' + name,
    'ເວລາ: ' + hours,
    'ລາຄາ: ' + price + ' ฿',
    ...(was ? ['ລາຄາປົກກະຕິ: ' + was.textContent.trim() + ' (' + save.textContent.trim() + ')'] : []),
    '',
    'ຢາກສອບຖາມມື້ວ່າງ ແລະ ລາຍລະອຽດເພີ່ມເຕີມ'
  ].join('\n');

  btn.href = 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(msg);
  btn.target = '_blank';
  btn.rel = 'noopener';
});

// Facebook page timeline — ໂຫຼດເມື່ອ scroll ມາເຖິງເທົ່ານັ້ນ (ບໍ່ຖ່ວງການເປີດໜ້າ)
const FB_PAGE = 'https://www.facebook.com/thaiymuan';
const fbWrap = document.getElementById('fbWrap');
let fbW = 0;

function fbLoad(){
  const w = Math.max(180, Math.min(500, Math.floor(fbWrap.clientWidth)));
  if (w === fbW) return;                       // ຂະໜາດເທົ່າເກົ່າ → ບໍ່ຕ້ອງໂຫຼດຄືນ
  fbW = w;
  const src = 'https://www.facebook.com/plugins/page.php'
    + '?href=' + encodeURIComponent(FB_PAGE)
    + '&tabs=timeline&width=' + w + '&height=720'
    + '&small_header=true&adapt_container_width=true&hide_cover=false&show_facepile=false';
  let f = fbWrap.querySelector('iframe');
  if (!f){
    f = document.createElement('iframe');
    f.title = 'Facebook — ຖ່າຍມ່ວນ Thaiymuan';
    f.loading = 'lazy';
    f.setAttribute('scrolling','no');
    f.setAttribute('frameborder','0');
    f.allow = 'encrypted-media';
    f.addEventListener('load', () => fbWrap.classList.add('loaded'));
    fbWrap.appendChild(f);
  }
  f.width = w; f.height = 720; f.src = src;
  fbWrap.style.minHeight = '720px';
}

if (fbWrap){
  new IntersectionObserver((es, ob) => {
    if (es[0].isIntersecting){ fbLoad(); ob.disconnect(); }
  }, {rootMargin:'300px'}).observe(fbWrap);

  let fbT;
  addEventListener('resize', () => {
    clearTimeout(fbT);
    fbT = setTimeout(() => { if (fbWrap.querySelector('iframe')) fbLoad(); }, 400);
  }, {passive:true});
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
