/* MeritHall auth: accounts + sessions in the browser (demo). Swap for a real backend before launch. */
(() => {
'use strict';
const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)], UK = 'bp-users', SK = 'bp-session';
const users = () => { try { return JSON.parse(localStorage.getItem(UK)) || []; } catch (e) { return []; } }, put = a => { try { localStorage.setItem(UK, JSON.stringify(a)); } catch (e) { } };
const hash = async p => { try { const b = await crypto.subtle.digest('SHA-256', new TextEncoder().encode('bp:' + p)); return [...new Uint8Array(b)].map(x => x.toString(16).padStart(2, '0')).join(''); } catch (e) { return 'x' + btoa(unescape(encodeURIComponent(p))); } };
const DEMO = { name: 'Lakshmi Narayanan', email: 'parent@merithall.example', demo: 'Parent@123' };
const find = e => users().find(u => u.email === e.toLowerCase()) || (e.toLowerCase() === DEMO.email ? DEMO : null);
const toast = m => window.toast && window.toast(m);
const say = (t, ok, id = 'ab') => { const a = document.getElementById(id); if (!a) return; a.hidden = !t; a.textContent = t || ''; a.classList.toggle('ok', !!ok); };
const start = (u, keep) => { const s = JSON.stringify({ name: u.name, email: u.email, child: u.child || '' }); try { (keep ? localStorage : sessionStorage).setItem(SK, s); (keep ? sessionStorage : localStorage).removeItem(SK); } catch (e) { } setTimeout(() => location.href = 'dashboard.html', 800); };
/* run [input, passes, message] checks; show errors, return first failing input */
const run = list => { let first = null; list.forEach(([i, ok, m]) => { const f = i.closest('.fld'); f.classList.toggle('err', !ok); i.setAttribute('aria-invalid', !ok); if (!ok) { const em = $('.em', f); if (em && m) em.textContent = m; first = first || i; } }); return first; };
const EM = /^\S+@\S+\.\S+$/, strong = p => p.length >= 8 && /[A-Za-z]/.test(p) && /\d/.test(p);
document.addEventListener('input', e => { const f = e.target.closest('.fld'); if (f) { f.classList.remove('err'); e.target.removeAttribute('aria-invalid'); } say(''); });
const busy = (f, on, t) => { const b = $('button[type=submit]:not([hidden])', f); if (b) { b.disabled = on; if (t) b.dataset.t = b.dataset.t || b.textContent, b.textContent = on ? t : b.dataset.t; } };

/* social sign-in (demo): replace with your OAuth provider */
$$('[data-social]').forEach(b => b.addEventListener('click', () => { toast(`Signed in with ${b.dataset.social} (demo).`); start({ name: DEMO.name, email: DEMO.email }, true); }));

/* login */
$('#lf')?.addEventListener('submit', async e => { e.preventDefault(); const em = $('#em'), pw = $('#pw');
  const bad = run([[em, EM.test(em.value.trim()), 'Enter a valid email, like name@example.com.'], [pw, pw.value.length >= 8, 'Password must be at least 8 characters.']]); if (bad) return bad.focus();
  busy(e.target, true, 'Logging in…'); const u = find(em.value.trim()), ok = u && (u.demo ? pw.value === u.demo : u.h === await hash(pw.value)); busy(e.target, false);
  if (!ok) return say('Email or password is incorrect. Check them or reset your password.');
  say('Welcome back. Opening your dashboard…', true); start(u, $('#rm').checked); });

/* view switch (login <-> reset) */
$$('[data-view]').forEach(b => b.addEventListener('click', () => { $$('.vw').forEach(v => v.hidden = v.id !== b.dataset.view); say(''); say('', 0, 'ab2'); $('.vw:not([hidden]) input')?.focus(); }));

/* reset password (two steps) */
let target = null;
$('#rf')?.addEventListener('submit', async e => { e.preventDefault(); const A = 'ab2';
  if (!target) { const re = $('#re'); if (run([[re, EM.test(re.value.trim()), 'Enter a valid email, like name@example.com.']])) return re.focus();
    const u = find(re.value.trim()); if (!u) return say('We could not find an account with that email.', 0, A); if (u.demo) return say('The demo account password cannot be changed.', 0, A);
    target = u.email; $('#rs1').hidden = true; $('#rs2').hidden = false; say('Account found. Choose a new password.', 1, A); return $('#np').focus(); }
  const a = $('#np'), b = $('#np2'), bad = run([[a, strong(a.value), 'Use 8+ characters with letters and a number.'], [b, b.value === a.value && b.value !== '', 'Passwords do not match.']]); if (bad) return bad.focus();
  const all = users(), u = all.find(x => x.email === target); u.h = await hash(a.value); put(all); target = null; e.target.reset(); $('#rs1').hidden = false; $('#rs2').hidden = true;
  $('#vReset').hidden = true; $('#vLogin').hidden = false; say('Password updated. Log in with your new password.', 1); });

/* signup */
const stg = $('#stg'); $('#pw')?.addEventListener('input', e => { const p = e.target.value, s = p ? 1 + (p.length >= 8) + (/[A-Z]/.test(p) && /[a-z]/.test(p)) + (/\d/.test(p) && /[^A-Za-z0-9]/.test(p)) : 0; if (stg) { stg.dataset.s = s; $('#stl').textContent = ['Use 8+ characters with letters and a number.', 'Weak password', 'Fair password', 'Good password', 'Strong password'][s]; } });
$('#sf')?.addEventListener('submit', async e => { e.preventDefault(); const g = id => $('#' + id), v = id => g(id).value.trim(), em = v('em').toLowerCase();
  const bad = run([[g('fn'), v('fn').length > 0, 'Enter your first name.'], [g('ln'), v('ln').length > 0, 'Enter your last name.'], [g('em'), EM.test(em), 'Enter a valid email, like name@example.com.'],
    [g('ph'), /^(\+91)?[6-9]\d{9}$/.test(v('ph').replace(/[\s-]/g, '')), 'Enter a valid 10-digit mobile number.'],
    [g('cn'), v('cn').length > 0, "Enter your child's name."], [g('cg'), !!g('cg').value, "Choose your child's grade."], [g('pw'), strong(g('pw').value), 'Use 8+ characters with letters and a number.'], [g('pw2'), g('pw2').value === g('pw').value && g('pw2').value !== '', 'Passwords do not match.'], [g('tc'), g('tc').checked, 'Accept the terms to continue.']]);
  if (bad) return bad.focus();
  if (find(em)) { g('em').closest('.fld').classList.add('err'); $('.em', g('em').closest('.fld')).textContent = 'An account with this email already exists.'; say('This email is already registered. Log in instead.'); return g('em').focus(); }
  busy(e.target, true, 'Creating account…'); const all = users(); const u = { name: v('fn') + ' ' + v('ln'), email: em, phone: v('ph'), child: v('cn'), grade: g('cg').value, h: await hash(g('pw').value) }; all.push(u); put(all);
  say('Account created. Opening your dashboard…', true); toast('Welcome to MeritHall, ' + v('fn') + '.'); start(u, true); });
})();
