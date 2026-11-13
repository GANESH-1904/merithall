/* MeritHall – shared behaviour (header, footer, theme, RTL, forms) */
(() => {
  'use strict';
  const I = (n, c = 'icn') => `<img class="${c}" src="images/${n}.png" alt="" aria-hidden="true">`;

  /* Brand icons (inline SVG, crisp at any size, theme-aware via currentColor) */
  const S = (d, x = '') => `<svg viewBox="0 0 24 24" aria-hidden="true" class="bi" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${d}${x}</svg>`;
  const BR = {
    instagram: S('<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/>', '<circle cx="17.5" cy="6.5" r=".9" fill="currentColor" stroke="none"/>'),
    facebook: S('<path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>'),
    x: S('<path d="M4 4h4l12 16h-4z"/><path d="M20 4l-7.5 7.5M4 20l7.5-7.5"/>'),
    youtube: S('<path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/><path d="m10 15 5-3-5-3z"/>'),
    linkedin: S('<path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/>'),
    whatsapp: S('<path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21"/><path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1a5 5 0 0 0 5 5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1"/>'),
    google: '<svg viewBox="0 0 48 48" aria-hidden="true" class="bi bi-c"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg>',
    apple: '<svg viewBox="0 0 24 24" aria-hidden="true" class="bi" fill="currentColor"><path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"/></svg>',
    rtl: S('<path d="M3 6h12M3 12h18M3 18h12"/><path d="m18 4 3 2-3 2" />')
  };
  window.bpBrand = BR;
  document.querySelectorAll('[data-brand]').forEach(e => { e.insertAdjacentHTML('afterbegin', BR[e.dataset.brand] || ''); });
  const page = document.body.dataset.page || '';
  const root = document.documentElement;

  /* Theme + RTL (saved, with system preference detection) */
  const saved = localStorage.getItem('bp-theme');
  root.dataset.theme = saved || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  root.dir = localStorage.getItem('bp-dir') || 'ltr';
  const syncIcon = () => document.querySelectorAll('[data-theme-btn] img').forEach(i => i.src = `images/${root.dataset.theme === 'dark' ? 'moon' : 'sun'}.png`);
  document.addEventListener('click', e => {
    if (e.target.closest('[data-theme-btn]')) { root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark'; localStorage.setItem('bp-theme', root.dataset.theme); syncIcon(); }
    if (e.target.closest('[data-rtl-btn]')) { root.dir = root.dir === 'rtl' ? 'ltr' : 'rtl'; localStorage.setItem('bp-dir', root.dir); }
  });
  window.bpToolButtons = () => `<button class="ibtn" data-theme-btn aria-label="Toggle dark mode"><img src="images/sun.png" alt=""></button><button class="ibtn" data-rtl-btn aria-label="Toggle right-to-left layout" >RTL</button>`;
  document.querySelectorAll('[data-tools]').forEach(t => t.innerHTML = bpToolButtons());

  /* Header */
  const links = [['about.html', 'About', 'about'], ['subjects.html', 'Subjects', 'subjects'], ['tutors.html', 'Tutors', 'tutors'], ['batches.html', 'Batches', 'batches'], ['services.html', 'Services', 'services'], ['contact.html', 'Contact', 'contact'], ['dashboard.html', 'Dashboard', 'dashboard']];
  const hdr = document.getElementById('site-header');
  if (hdr) hdr.innerHTML = `<header class="bar"><div class="wrap">
    <a class="brand" href="index.html"><img src="images/logo.png" alt="MeritHall logo"><span><b>Merit<i>Hall</i></b><small>Tutoring Center</small></span></a>
    <button class="ibtn burger" aria-label="Open menu" aria-expanded="false" id="burger"><span style="font-size:1.4rem">&#9776;</span></button>
    <ul class="nav" id="nav">
      <li id="homeLi"><button class="nl ${page.startsWith('home') ? 'on' : ''}" aria-haspopup="true" aria-expanded="false">Home ${I('chevron')}</button>
        <div class="sub"><a href="index.html">Home 1 &middot; Classic</a><a href="home2.html">Home 2 &middot; Premium</a></div></li>
      ${links.map(l => `<li><a href="${l[0]}" class="${page === l[2] ? 'on' : ''}">${l[1]}</a></li>`).join('')}
      
    </ul>
    <div class="tools">${bpToolButtons()}<a class="btn btn-p" href="login.html">Login</a></div></div></header>`;
  const burger = document.getElementById('burger'), nav = document.getElementById('nav'), hl = document.getElementById('homeLi');
  burger?.addEventListener('click', () => { const o = nav.classList.toggle('open'); burger.setAttribute('aria-expanded', o); });
  hl?.querySelector('button').addEventListener('click', e => { e.stopPropagation(); const o = hl.classList.toggle('open'); e.currentTarget.setAttribute('aria-expanded', o); });
  document.addEventListener('click', () => hl?.classList.remove('open'));

  /* Footer */
  const ft = document.getElementById('site-footer');
  if (ft) ft.innerHTML = `<footer class="foot"><div class="wrap">
    <div class="nl-row"><div><h3>The weekly study brief</h3><p>Study tips, exam dates and new batches. Once a week, no spam.</p></div>
      <form id="newsForm" novalidate><input type="email" placeholder="you@example.com" aria-label="Email address" required><button class="btn btn-p" type="submit">Subscribe</button></form></div>
    <div class="fcols">
      <div><a class="brand" href="index.html"><img src="images/logo.png" alt="MeritHall logo" style="width:64px;height:64px"><span><b>Merit<i>Hall</i></b><small>Tutoring Center</small></span></a>
        <p class="tg">Where every learner grows.</p><p class="about">Expert tutors and structured batches for school students in grades 1&ndash;12. Learn with purpose in Chennai.</p>
        <h4 style="margin-top:24px;margin-bottom:0">Follow us</h4>
        <div class="soc">${[['instagram','Instagram'],['facebook','Facebook'],['x','X'],['youtube','YouTube'],['linkedin','LinkedIn'],['whatsapp','WhatsApp']].map(n => `<a href="#" class="s-${n[0]}" aria-label="${n[1]}" title="${n[1]}">${BR[n[0]]}</a>`).join('')}</div></div>
      <div><h4>Explore</h4><ul>${[['index.html', 'Home'], ['about.html', 'About'], ['subjects.html', 'Subjects'], ['tutors.html', 'Tutors'], ['batches.html', 'Batches'], ['services.html', 'Services'], ['home2.html', 'Premium programme'], ['contact.html', 'Contact']].map(l => `<li><a href="${l[0]}">${l[1]}</a></li>`).join('')}</ul></div>
      <div><h4>Parent care</h4><ul>${[['signup.html', 'Enrol a child'], ['contact.html#trial', 'Book a free trial'], ['login.html', 'Log in'], ['dashboard.html', 'Parent dashboard'], ['services.html#fees', 'Fees &amp; plans'], ['services.html#calculator', 'Fee calculator'], ['batches.html', 'Find a batch'], ['index.html#reviews', 'Reviews']].map(l => `<li><a href="${l[0]}">${l[1]}</a></li>`).join('')}</ul></div>
      <div><h4>Find the center</h4><ul class="ct">
        <li><span class="dot" id="dot"></span><a href="batches.html" id="openTxt">Closed now &middot; see timings</a></li>
        <li>${I('pin-m')}<span>45 Learners Road, Velachery, Chennai, Tamil Nadu, India</span></li>
        <li>${I('mail-m')}<a href="mailto:hello@merithall.example">hello@merithall.example</a></li>
        <li>${I('phone-m')}<a href="tel:+919876543210">+91 98765 43210</a></li>
        <li>${I('clock-m')}<span>Mon&ndash;Fri 3 PM &ndash; 8 PM &middot; Sat&ndash;Sun 8 AM &ndash; 6 PM</span></li>
        <li>${I('send-m')}<a href="https://maps.google.com" target="_blank" rel="noopener">Get directions</a></li></ul></div></div>
    <div class="legal"><span>&copy; 2026 MeritHall Tutoring Center. All rights reserved.</span><nav><a href="coming-soon.html">Launch preview</a><a href="#">Privacy</a><a href="#">Terms</a></nav></div></div></footer>
    <button class="totop" id="totop" aria-label="Back to top"><img src="images/up.png" alt=""></button>`;
  /* Open / closed status (IST hours from the footer) */
  const dot = document.getElementById('dot');
  if (dot) { const n = new Date(), d = n.getDay(), h = n.getHours() + n.getMinutes() / 60, wk = d > 0 && d < 6;
    const open = wk ? h >= 15 && h < 20 : h >= 8 && h < 18; dot.classList.toggle('open', open);
    document.getElementById('openTxt').innerHTML = open ? 'Open now &middot; see timings' : 'Closed now &middot; see timings'; }
  const tt = document.getElementById('totop');
  tt?.addEventListener('click', () => scrollTo({ top: 0, behavior: 'smooth' }));
  addEventListener('scroll', () => tt?.classList.toggle('show', scrollY > 400), { passive: true });
  syncIcon();

  /* Tap states for cards (hover is unavailable on touch) */
  document.addEventListener('click', e => { const c = e.target.closest('.card'); document.querySelectorAll('.card.tap').forEach(x => x !== c && x.classList.remove('tap')); if (c && matchMedia('(hover:none)').matches) c.classList.toggle('tap'); });

  /* Form validation */
  const rules = { required: v => v.trim() !== '', email: v => /^\S+@\S+\.\S+$/.test(v), phone: v => /^[+\d][\d\s-]{7,}$/.test(v), min8: v => v.length >= 8 };
  const msgs = { required: 'This field is required.', email: 'Enter a valid email, like name@example.com.', phone: 'Enter a valid phone number.', min8: 'Use at least 8 characters.' };
  function check(f) { let ok = true;
    f.querySelectorAll('[data-v]').forEach(i => { const fld = i.closest('.fld'); const em = fld?.querySelector('.em');
      const bad = i.dataset.v.split(' ').find(r => !(r === 'required' ? rules.required(i.value) : (i.value === '' || rules[r](i.value))));
      fld?.classList.toggle('err', !!bad); if (bad && em) em.textContent = msgs[bad]; if (bad) ok = false; });
    return ok; }
  document.querySelectorAll('form[data-validate]').forEach(f => { f.noValidate = true;
    f.addEventListener('submit', e => { e.preventDefault(); if (check(f)) { if (f.dataset.go) location.href = f.dataset.go; else { toast(f.dataset.ok || 'Saved.'); f.reset(); } } });
    f.addEventListener('input', e => e.target.closest('.fld')?.classList.remove('err')); });
  document.getElementById('newsForm')?.addEventListener('submit', e => { e.preventDefault(); const i = e.target.querySelector('input'); if (rules.email(i.value)) { toast('Subscribed. See you next week.'); i.value = ''; } else { toast('Enter a valid email address.'); i.focus(); } });
  document.querySelectorAll('.pw button').forEach(b => b.addEventListener('click', () => { const i = b.parentElement.querySelector('input'); i.type = i.type === 'password' ? 'text' : 'password'; }));
  window.toast = m => { let t = document.getElementById('toast'); if (!t) { t = document.createElement('div'); t.id = 'toast'; t.className = 'toast'; t.setAttribute('role', 'status'); document.body.append(t); } t.textContent = m; t.classList.add('show'); setTimeout(() => t.classList.remove('show'), 2800); };

  /* Filter chips */
  document.querySelectorAll('[data-filter]').forEach(g => g.addEventListener('click', e => { const c = e.target.closest('.chip'); if (!c) return;
    g.querySelectorAll('.chip').forEach(x => x.classList.toggle('on', x === c));
    document.querySelectorAll(g.dataset.filter).forEach(el => el.hidden = !(c.dataset.k === 'all' || el.dataset.k.split(' ').includes(c.dataset.k))); }));

  /* Dashboard panels */
  const side = document.querySelector('.side');
  if (side) { const show = id => { document.querySelectorAll('.pan').forEach(p => p.classList.toggle('on', p.id === id)); side.querySelectorAll('button[data-p]').forEach(b => b.classList.toggle('on', b.dataset.p === id)); };
    side.addEventListener('click', e => { const b = e.target.closest('button[data-p]'); if (b) { show(b.dataset.p); history.replaceState(null, '', '#' + b.dataset.p); } });
    show(location.hash.slice(1) || 'overview');
    document.querySelectorAll('.slot').forEach(s => s.addEventListener('click', () => { document.querySelectorAll('.slot').forEach(x => x.classList.remove('on')); s.classList.add('on'); document.getElementById('picked').textContent = s.dataset.t; }));
    document.getElementById('payBtn')?.addEventListener('click', () => toast('Payment placeholder – connect Stripe or PayPal here.')); }
})();

/* ===== v2: motion (scroll progress, reveal, counters, header shrink) ===== */
(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const bar = document.querySelector('.bar');
  const pr = document.createElement('div'); pr.id = 'prog'; document.body.prepend(pr);
  const onScroll = () => { const h = document.documentElement.scrollHeight - innerHeight; pr.style.transform = `scaleX(${h > 0 ? scrollY / h : 0})`; bar?.classList.toggle('scrolled', scrollY > 30); };
  addEventListener('scroll', onScroll, { passive: true }); onScroll();
  /* Reveal sections as they enter the viewport (staggered inside grids) */
  const targets = document.querySelectorAll('main .head, main .card, main .stats>div, main .split>*, main .tw, main .faq details, main .cta .box, main .tl li, main .tabs, main .tp.on, main .strip, main .out');
  targets.forEach((el, i) => { el.classList.add('rv'); const sib = [...el.parentElement.children].indexOf(el); el.style.setProperty('--d', (Math.min(sib, 5) * 0.08) + 's'); });
  if (reduce || !('IntersectionObserver' in window)) targets.forEach(e => e.classList.add('in'));
  else { const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .12 });
    targets.forEach(t => io.observe(t)); }
  /* Count-up numbers */
  const count = el => { const m = el.textContent.match(/^([^\d+-]*)([\d,.]+)(.*)$/); if (!m) return; const end = parseFloat(m[2].replace(/,/g, '')), dec = (m[2].split('.')[1] || '').length, t0 = performance.now();
    const step = t => { const k = Math.min((t - t0) / 1400, 1), v = end * (1 - Math.pow(1 - k, 3)); el.textContent = m[1] + v.toLocaleString('en-US', { minimumFractionDigits: dec, maximumFractionDigits: dec }) + m[3]; if (k < 1) requestAnimationFrame(step); }; requestAnimationFrame(step); };
  const nums = document.querySelectorAll('.stats b');
  if (!reduce && 'IntersectionObserver' in window) { const io2 = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { count(e.target); io2.unobserve(e.target); } }), { threshold: .6 }); nums.forEach(n => io2.observe(n)); }
})();

/* ===== v3: batch finder + ?g= grade filter on batches page ===== */
(() => {
  document.getElementById('finder')?.addEventListener('submit', e => { e.preventDefault(); location.href = 'batches.html?g=' + document.getElementById('fg').value; });
  const g = new URLSearchParams(location.search).get('g');
  if (g) document.querySelector(`[data-filter] .chip[data-k="${g}"]`)?.click();
})();

/* ===== v4: icons, tabs, countdown, progress, planner, comparison bars ===== */
(() => {
  const P = {users:'<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>',
  target:'<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>',
  message:'<path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/>',
  clock:'<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
  award:'<circle cx="12" cy="8" r="6"/><path d="M15.48 12.89 17 22l-5-3-5 3 1.52-9.11"/>',
  calendar:'<rect width="18" height="18" x="3" y="4" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
  book:'<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2zM22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>',
  rocket:'<path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09zM12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2zM9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/>',
  bell:'<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9M10.3 21a1.94 1.94 0 0 0 3.4 0"/>',
  pin:'<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/>',mail:'<rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>',
  star:'<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>',check:'<path d="M20 6 9 17l-5-5"/>',minus:'<path d="M5 12h14"/>',
  shield:'<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/>',
  chart:'<path d="M3 3v18h18M19 9l-5 5-4-4-3 3"/>',
  video:'<path d="m16 13 5.22 3.48a.5.5 0 0 0 .78-.41V7.93a.5.5 0 0 0-.78-.41L16 11"/><rect x="2" y="6" width="14" height="12" rx="2"/>',
  file:'<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7zM14 2v4a2 2 0 0 0 2 2h4M10 13h4M10 17h4"/>',
  laptop:'<rect width="18" height="12" x="3" y="4" rx="2"/><path d="M2 20h20"/>',
  phone:'<rect width="14" height="20" x="5" y="2" rx="2"/><path d="M12 18h.01"/>',
  bulb:'<path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5M9 18h6M10 22h4"/>',
  pencil:'<path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5z"/>'};
  window.bpIcons = (r = document) => r.querySelectorAll('[data-i]:empty').forEach(e => { e.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true">${P[e.dataset.i] || ''}</svg>`; });
  bpIcons();

  /* Tabs (grade programmes) */
  document.querySelectorAll('[data-tabs]').forEach(g => { const tabs = [...g.querySelectorAll('[role=tab]')], panes = [...g.querySelectorAll('.tp')];
    const go = t => { tabs.forEach((x, i) => { const on = x === t; x.classList.toggle('on', on); x.setAttribute('aria-selected', on); x.tabIndex = on ? 0 : -1; panes[i].classList.toggle('on', on); }); t.focus(); };
    tabs.forEach((t, i) => { t.addEventListener('click', () => go(t));
      t.addEventListener('keydown', e => { const k = { ArrowRight: 1, ArrowLeft: -1 }[e.key]; if (k) { e.preventDefault(); go(tabs[(i + k + tabs.length) % tabs.length]); } }); }); });

  /* Countdown + launch progress */
  document.querySelectorAll('[data-launch]').forEach(c => { const end = new Date(c.dataset.launch).getTime(), set = (k, v) => { const e = c.querySelector(`[data-u=${k}]`); if (e) e.textContent = String(v).padStart(2, '0'); };
    const tick = () => { let s = Math.max(0, Math.floor((end - Date.now()) / 1000)); set('d', Math.floor(s / 86400)); set('h', Math.floor(s % 86400 / 3600)); set('m', Math.floor(s % 3600 / 60)); set('s', s % 60); };
    tick(); setInterval(tick, 1000); });
  requestAnimationFrame(() => setTimeout(() => document.querySelectorAll('.prg i').forEach(i => i.style.width = i.dataset.w), 300));

  /* Study-plan builder (Home 2) */
  const pf = document.getElementById('plan'), po = document.getElementById('planOut');
  if (pf && po) { const S = { '6-8': 2, '9-10': 3, '11-12': 4 }, M = { marks: 1, board: 2, compete: 3 };
    const draw = () => { const g = pf.pg.value, o = pf.pgo.value, s = S[g] + (o === 'compete' ? 1 : 0), t = M[o], plan = o === 'compete' ? 'Mentor Elite' : g === '6-8' ? 'Mentor Lite' : 'Mentor Plus';
      po.innerHTML = `<div class="mk"><div><b>${s}</b><span>Mentor sessions a week</span></div><div><b>${t}</b><span>Mock tests a term</span></div><div><b>${s * 2 + 2}h</b><span>Study hours a week</span></div></div><p>Suggested plan: <strong>${plan}</strong>, with a diagnostic test in week one and a mentor call every month.</p><a class="btn btn-p btn-block" href="contact.html#trial">Book a free diagnostic</a>`; };
    pf.addEventListener('change', draw); draw(); }

  /* Comparison bars animate when visible */
  const cm = document.querySelectorAll('.cmp');
  if ('IntersectionObserver' in window) { const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .3 }); cm.forEach(c => io.observe(c)); } else cm.forEach(c => c.classList.add('in'));
})();

/* Image fallback: hide broken remote images so the tinted placeholder shows */
document.querySelectorAll('img[src^="http"]').forEach(i => { const bad = () => { i.style.visibility = 'hidden'; }; i.addEventListener('error', bad); if (i.complete && i.naturalWidth === 0) bad(); });

/* Subject finder (Subjects page) */
(() => { const f = document.getElementById('find'), o = document.getElementById('findOut'); if (!f || !o) return;
  const D = { '1-5': ['English', 'Mathematics', 'Social studies', 'Study skills'], '6-8': ['Mathematics', 'Science', 'English', 'Computer science', 'Social studies', 'Study skills'], '9-10': ['Mathematics', 'Science', 'English', 'Computer science', 'Social studies', 'Study skills'], '11-12': ['Mathematics', 'Science', 'Computer science', 'Study skills'] };
  const draw = () => { const g = f.fg.value, L = D[g]; o.innerHTML = `<p>Grades ${g.replace('-', '&ndash;')} can join <strong>${L.length} subjects</strong>:</p><div class="tags">${L.map(x => `<span class="tag">${x}</span>`).join('')}</div><a class="btn btn-p" href="contact.html#trial">Book a free demo class</a>`; };
  f.addEventListener('change', draw); draw(); })();

/* Tutor matcher (Tutors page) */
(() => { const f = document.getElementById('tm'), o = document.getElementById('tmOut'); if (!f || !o) return;
  const D = { maths: ['Meera Raghavan', 'women/44', 'Algebra feels simple', 'Grades 6–12'], science: ['Arjun Krishnan', 'men/32', 'Experiments that stick', 'Grades 6–10'], english: ['Divya Sundar', 'women/65', 'Stories build readers', 'Grades 1–8'], coding: ['Karthik Venkat', 'men/75', 'Projects to show off', 'Grades 8–12'], social: ['Sandhya Rao', 'women/52', 'History as a story', 'Grades 1–10'], study: ['Pooja Venkatesh', 'women/81', 'Learn how to learn', 'All grades'] };
  const draw = () => { const [n, p, t, g] = D[f.ts.value]; o.innerHTML = `<img src="https://randomuser.me/api/portraits/${p}.jpg" alt="Portrait of ${n}" width="96" height="96" style="width:96px;height:96px;border-radius:50%;object-fit:cover;border:3px solid var(--bd)"><span class="tgl">${t}</span><h3>${n}</h3><div class="tags"><span class="tag">${g}</span></div><a class="btn btn-p" href="contact.html#trial">Book a demo with ${n.split(' ')[0]}</a>`; };
  f.addEventListener('change', draw); draw(); })();

/* Fee calculator (Services page) */
(() => { const f = document.getElementById('fee'), o = document.getElementById('feeOut'); if (!f || !o) return;
  const G = { 1: 1250, 2: 2500, 3: 3450, 4: 4200, 5: 5000, 6: 5700 }, M = n => n <= 3 ? 7800 : 7800 + (n - 3) * 2000, inr = v => '₹' + Math.round(v).toLocaleString('en-IN');
  const draw = () => { const n = +f.fs.value, mentor = f.fp.value === 'mentor', base = mentor ? M(n) : G[n], sib = [0, .1, .15][+f.fb.value], term = f.fm.value === 'termly' ? .05 : 0, tot = base * (1 - sib) * (1 - term), save = base - tot,
      plan = mentor ? 'Premium' : n <= 2 ? 'Starter' : 'Standard';
    o.innerHTML = `<span class="tgl">Your estimate</span><strong class="pr">${inr(tot)}<span>/month</span></strong><p>${save > 0 ? `You save <strong>${inr(save)}</strong> a month. ` : ''}Closest plan: <strong>${plan}</strong>.</p><a class="btn btn-p btn-block" href="signup.html">Start with ${plan}</a>`; };
  f.addEventListener('change', draw); draw(); })();

/* Open-now badge, today's hours and copy buttons (Contact page) */
(() => { const ist = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' })), d = ist.getDay(), mins = ist.getHours() * 60 + ist.getMinutes();
  const H = day => day >= 1 && day <= 5 ? [900, 1200] : [480, 1080], fmt = v => { const h = Math.floor(v / 60); return (h % 12 || 12) + (h < 12 ? ' AM' : ' PM'); };
  document.querySelectorAll('tr[data-d]').forEach(r => r.classList.toggle('today', +r.dataset.d === d));
  const t = document.getElementById('openNow'); if (t) { const [o, c] = H(d), open = mins >= o && mins < c;
    t.textContent = open ? `Open now, closes ${fmt(c)}` : mins < o ? `Closed, opens today at ${fmt(o)}` : `Closed, opens tomorrow at ${fmt(H((d + 1) % 7)[0])}`; t.classList.add(open ? 'on-now' : 'off-now'); }
  document.querySelectorAll('[data-copy]').forEach(b => b.addEventListener('click', async () => { const old = b.textContent; try { await navigator.clipboard.writeText(b.dataset.copy); b.textContent = 'Copied'; } catch (e) { b.textContent = 'Press Ctrl+C to copy'; } setTimeout(() => { b.textContent = old; }, 1800); })); })();

/* ===== v8: card spotlight, hero tilt, scroll ring ===== */
(() => {
  const fine = matchMedia('(hover:hover)').matches, reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (fine && !reduce) {
    document.addEventListener('pointermove', e => { const c = e.target.closest?.('.card'); if (!c) return; const r = c.getBoundingClientRect(); c.style.setProperty('--mx', (e.clientX - r.left) + 'px'); c.style.setProperty('--my', (e.clientY - r.top) + 'px'); }, { passive: true });
    const hm = document.querySelector('.hm .ph');
    if (hm) { const box = hm.parentElement;
      box.addEventListener('pointermove', e => { const r = box.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5; hm.style.setProperty('--ry', (x * 8) + 'deg'); hm.style.setProperty('--rx', (-y * 8) + 'deg'); });
      box.addEventListener('pointerleave', () => { hm.style.setProperty('--ry', '0deg'); hm.style.setProperty('--rx', '0deg'); }); }
  }
  const tt = document.getElementById('totop');
  const ring = () => { const h = document.documentElement.scrollHeight - innerHeight; tt?.style.setProperty('--pg', h > 0 ? Math.round(scrollY / h * 100) : 0); };
  addEventListener('scroll', ring, { passive: true }); ring();
})();
