/* MeritHall parent dashboard: data, rendering and actions. State persists in localStorage (key bp-dash-v1). */
(() => {
'use strict';
const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)], K = 'bp-dash-v1';
const IC = { cal: '<rect width="18" height="18" x="3" y="4" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>', ok: '<path d="M20 6 9 17l-5-5"/>', chart: '<path d="M3 3v18h18M19 9l-5 5-4-4-3 3"/>', wal: '<path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2"/><path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4"/>', home: '<path d="M15 21v-8h-6v8"/><path d="M3 10 12 3l9 7v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>', bell: '<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9M10.3 21a1.94 1.94 0 0 0 3.4 0"/>', user: '<circle cx="12" cy="8" r="5"/><path d="M20 21a8 8 0 0 0-16 0"/>', out: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>', clock: '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>', dl: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>', x: '<path d="M18 6 6 18M6 6l12 12"/>', pin: '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/>', msg: '<path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/>', vid: '<path d="m16 13 5.2 3.5a.5.5 0 0 0 .8-.4V7.9a.5.5 0 0 0-.8-.4L16 11"/><rect x="2" y="6" width="14" height="12" rx="2"/>' };
const ico = n => `<svg class="ig" viewBox="0 0 24 24" aria-hidden="true">${IC[n]}</svg>`;
const iso = o => { const d = new Date(); d.setHours(0, 0, 0, 0); d.setDate(d.getDate() + o); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); };
const ds = (s, o) => new Date(s + 'T00:00').toLocaleDateString('en-IN', o || { weekday: 'short', day: 'numeric', month: 'short' });
const tf = t => { const [h, m] = t.split(':'); return (h % 12 || 12) + ':' + m + (h < 12 ? ' AM' : ' PM'); };
const inr = v => '₹' + v.toLocaleString('en-IN'), avg = a => Math.round(a.reduce((x, y) => x + y, 0) / a.length);
const TUT = { Mathematics: 'Meera Raghavan', Science: 'Arjun Krishnan', English: 'Divya Sundar', 'Computer science': 'Karthik Venkat' };
const REM = { Mathematics: 'Strong in algebra. Practise word problems twice a week.', Science: 'Lab work is excellent. Keep revising diagrams.', English: 'Essay structure is improving. Read for 20 minutes daily.' };
const SLOTS = ['09:00', '11:00', '16:00', '17:30', '19:00'], FEE = 500;

const seed = () => {
  const S = { kid: 'a', kids: [{ id: 'a', n: 'Aarav', g: 'Grade 8' }, { id: 'd', n: 'Diya', g: 'Grade 5' }], ses: [], att: [], n: 50 };
  [['a', 'Mathematics', 1, '16:00', 'Centre'], ['a', 'Science', 3, '09:00', 'Centre'], ['a', 'English', 4, '17:30', 'Online'], ['a', 'Mathematics', 8, '16:00', 'Centre'], ['d', 'English', 2, '16:00', 'Centre'], ['d', 'Mathematics', 5, '11:00', 'Online'], ['d', 'Science', 9, '09:00', 'Centre']]
    .forEach((u, i) => S.ses.push({ id: i + 1, k: u[0], sub: u[1], d: iso(u[2]), t: u[3], mode: u[4], st: 'up' }));
  const sb = { a: ['Mathematics', 'Science', 'English'], d: ['English', 'Mathematics', 'Science'] };
  ['a', 'd'].forEach((k, j) => { for (let i = 1; i <= 14; i++) { const r = (i * 7 + j * 3) % 11; S.att.push({ k, d: iso(-i * 2), sub: sb[k][i % 3], s: r === 3 ? 'A' : r === 8 ? 'L' : 'P' }); } });
  S.sc = { a: { Mathematics: [68, 72, 75, 80, 84, 88], Science: [78, 82, 85, 84, 90, 92], English: [62, 66, 65, 70, 72, 76] }, d: { English: [80, 82, 85, 88, 87, 91], Mathematics: [70, 74, 72, 78, 81, 83], Science: [85, 84, 88, 90, 92, 94] } };
  S.inv = [{ id: 1, k: 'a', t: 'Standard plan, December', a: 4200, d: iso(10) }, { id: 2, k: 'd', t: 'Starter plan, December', a: 2500, d: iso(10) }, { id: 3, k: 'a', t: 'Standard plan, November', a: 4200, d: iso(-8), paid: iso(-9), m: 'UPI' }, { id: 4, k: 'd', t: 'Starter plan, November', a: 2500, d: iso(-8), paid: iso(-9), m: 'UPI' }, { id: 5, k: 'a', t: 'Standard plan, October', a: 4200, d: iso(-38), paid: iso(-40), m: 'Card' }];
  S.nt = [{ id: 1, t: 'Maths worksheet 4 is ready for Aarav.', r: 0 }, { id: 2, t: 'December fees are due in 10 days.', r: 0 }, { id: 3, t: 'Diya scored 91% in English.', r: 1 }];
  return S;
};
/* session guard + signed-in parent name */
let SES = null; try { SES = JSON.parse(localStorage.getItem('bp-session') || sessionStorage.getItem('bp-session')); } catch (e) { }
if (!SES) { SES = { name: 'Lakshmi Narayanan', email: 'parent@merithall.example', child: '' }; } /* open directly, no login required */
const FN = ((SES && SES.name) || 'Lakshmi').split(' ')[0];
let S; try { S = JSON.parse(localStorage.getItem(K)); } catch (e) { }
if (!S || !S.kids) S = seed();
const save = () => { try { localStorage.setItem(K, JSON.stringify(S)); } catch (e) { } };
const kid = () => S.kids.find(k => k.id === S.kid), id = () => ++S.n;
const note = t => { S.nt.unshift({ id: id(), t, r: 0 }); };
const mine = () => S.ses.filter(s => s.k === S.kid && s.st === 'up' && new Date(s.d + 'T' + s.t) >= new Date()).sort((a, b) => (a.d + a.t).localeCompare(b.d + b.t));
const rate = () => { const a = S.att.filter(x => x.k === S.kid); return a.length ? Math.round(a.filter(x => x.s !== 'A').length / a.length * 100) : 0; };
const lat = () => Object.values(S.sc[S.kid]).map(a => a.at(-1));
const grade = v => v >= 90 ? 'A+' : v >= 85 ? 'A' : v >= 80 ? 'A-' : v >= 75 ? 'B+' : v >= 70 ? 'B' : 'C';
const dl = (n, t) => { const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([t], { type: 'text/plain' })); a.download = n; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 500); };
const go = p => $(`.side [data-p=${p}]`).click();
const toast = m => window.toast && window.toast(m);

/* charts */
const ring = p => `<svg class="ring" viewBox="0 0 120 120" role="img" aria-label="${p}% attendance"><circle cx="60" cy="60" r="50"/><circle class="v" cx="60" cy="60" r="50" stroke-dasharray="${p * 3.1416} 314.16" transform="rotate(-90 60 60)"/><text x="60" y="68" text-anchor="middle">${p}%</text></svg>`;
const spark = a => { const w = 140, h = 44, mn = Math.min(...a) - 5, mx = Math.max(...a) + 5; return `<svg class="spark" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none" aria-hidden="true"><polyline points="${a.map((v, i) => `${i * w / (a.length - 1)},${h - (v - mn) / (mx - mn) * h}`).join(' ')}"/></svg>`; };
const chart = () => { const sc = S.sc[S.kid], ks = Object.keys(sc), W = 560, H = 220, x = i => 40 + i * (W - 60) / 5, y = v => H - 30 - (v - 50) * (H - 50) / 50;
  const g = [50, 60, 70, 80, 90, 100].map(v => `<line x1="40" x2="${W - 20}" y1="${y(v)}" y2="${y(v)}"/><text x="30" y="${y(v) + 4}" text-anchor="end">${v}</text>`).join('') + [0, 1, 2, 3, 4, 5].map(i => `<text x="${x(i)}" y="${H - 8}" text-anchor="middle">T${i + 1}</text>`).join('');
  const l = ks.map((k, j) => `<polyline class="c${j}" points="${sc[k].map((v, i) => x(i) + ',' + y(v)).join(' ')}"/>` + sc[k].map((v, i) => `<circle class="c${j}" cx="${x(i)}" cy="${y(v)}" r="4"><title>${k}, test ${i + 1}: ${v}%</title></circle>`).join('')).join('');
  return `<svg class="lc" viewBox="0 0 ${W} ${H}" role="img" aria-label="Test scores by subject">${g}${l}</svg><div class="lg">${ks.map((k, j) => `<span><i class="d c${j}"></i>${k}</span>`).join('')}</div>`; };

/* panels */
const kpi = (i, v, l) => `<div class="box2 kpi"><div class="ic">${ico(i)}</div><div><b>${v}</b><span>${l}</span></div></div>`;
const empty = (t, b, p) => `<div class="empty"><p>${t}</p><button class="btn btn-p" data-act="go" data-v="${p}">${b}</button></div>`;
const until = s => { const m = Math.round((new Date(s.d + 'T' + s.t) - Date.now()) / 6e4), d = Math.floor(m / 1440), h = Math.floor(m % 1440 / 60); return d ? `${d} day${d > 1 ? 's' : ''} ${h} h` : h ? `${h} h ${m % 60} min` : `${m} min`; };
const sesRow = s => `<li class="sr"><div class="dt2"><b>${ds(s.d, { day: 'numeric' })}</b><span>${ds(s.d, { month: 'short' })}</span></div><div><strong>${s.sub}</strong><small>${ds(s.d, { weekday: 'long' })}, ${tf(s.t)} · ${s.mode} · ${TUT[s.sub].split(' ')[0]}</small></div><div class="acts"><button class="btn btn-s sm" data-act="resch" data-v="${s.id}">Reschedule</button><button class="btn btn-s sm" data-act="cancel" data-v="${s.id}">Cancel</button></div></li>`;

const ov = () => { const u = mine(), n = u[0], due = S.inv.filter(i => !i.paid), tot = due.reduce((a, i) => a + i.a, 0), nd = due.map(i => i.d).sort()[0], av = avg(lat());
  const week = [0, 1, 2, 3, 4, 5, 6].map(o => { const d = iso(o), l = u.filter(s => s.d === d); return `<div class="wd${o ? '' : ' td'}"><b>${ds(d, { weekday: 'short' })}</b><span>${ds(d, { day: 'numeric' })}</span>${l.map(s => `<em>${tf(s.t)} ${{ Mathematics: 'Maths', Science: 'Sci', English: 'Eng', 'Computer science': 'CS' }[s.sub]}</em>`).join('') || '<small>Free</small>'}</div>`; }).join('');
  return `<div class="g4 kp">${kpi('cal', u.filter(s => s.d <= iso(6)).length, 'Sessions this week')}${kpi('ok', rate() + '%', 'Attendance')}${kpi('chart', grade(av) + ' (' + av + '%)', 'Average grade')}${kpi('wal', tot ? inr(tot) : 'Paid up', tot ? 'Due by ' + ds(nd) : 'No fees due')}</div>
  <div class="gm"><div class="box2"><h2>Next session</h2>${n ? `<h3>${n.sub} with ${TUT[n.sub]}</h3><p class="mu">${ds(n.d, { weekday: 'long', day: 'numeric', month: 'long' })}, ${tf(n.t)} · ${n.mode}</p><p class="cdn">${ico('clock')} Starts in ${until(n)}</p><div class="acts"><button class="btn btn-p" data-act="${n.mode === 'Online' ? 'join' : 'dir'}">${n.mode === 'Online' ? 'Join online class' : 'Get directions'}</button><button class="btn btn-s" data-act="resch" data-v="${n.id}">Reschedule</button></div>` : empty('No sessions booked for ' + kid().n + '.', 'Book a session', 'book')}</div>
  <div class="box2"><h2>Quick actions</h2><div class="qa"><button class="btn btn-p" data-act="go" data-v="book">Book a session</button><button class="btn btn-s" data-act="go" data-v="fees">${tot ? 'Pay ' + inr(tot) : 'View payments'}</button><button class="btn btn-s" data-act="rpt">Download term report</button></div></div></div>
  <div class="box2"><h2>Your week</h2><div class="wk">${week}</div></div>
  <div class="gm"><div class="box2"><h2>Test scores</h2>${chart()}</div><div class="box2"><h2>Coming up</h2>${u.length ? `<ul class="sl">${u.slice(0, 3).map(sesRow).join('')}</ul>` : empty('Nothing scheduled.', 'Book a session', 'book')}</div></div>`; };

const B = { sub: 'Mathematics', date: iso(1), time: null, mode: 'Centre', note: '', re: null, err: '' };
const taken = (d, t) => S.ses.some(s => s.k === S.kid && s.d === d && s.t === t && s.st === 'up' && s.id !== B.re);
const full = (d, t) => [...d + t].reduce((a, c) => a + c.charCodeAt(0), 0) % 5 === 0;
const past = (d, t) => new Date(d + 'T' + t) < new Date();
const chips = (a, cur, act) => a.map(v => `<button class="chip${v === cur ? ' on' : ''}" data-act="${act}" data-v="${v}" aria-pressed="${v === cur}">${v}</button>`).join('');
const book = () => { const u = S.ses.filter(s => s.k === S.kid && s.st === 'up' && new Date(s.d + 'T' + s.t) >= new Date()).sort((a, b) => (a.d + a.t).localeCompare(b.d + b.t));
  const days = Array.from({ length: 14 }, (_, o) => iso(o + (past(iso(0), '19:00') ? 1 : 0)));
  return `<div class="gm"><div class="box2 bf"><h3>1. Subject</h3><div class="chips">${chips(Object.keys(TUT), B.sub, 'bsub')}</div>
  <h3>2. Date</h3><div class="ds">${days.map(d => `<button class="dp${d === B.date ? ' on' : ''}" data-act="bdate" data-v="${d}" aria-pressed="${d === B.date}"><small>${ds(d, { weekday: 'short' })}</small><b>${ds(d, { day: 'numeric' })}</b><small>${ds(d, { month: 'short' })}</small></button>`).join('')}</div>
  <h3>3. Time</h3><div class="slots">${SLOTS.map(t => { const bad = full(B.date, t) || taken(B.date, t) || past(B.date, t); return `<button class="slot${B.time === t ? ' on' : ''}" ${bad ? 'disabled' : ''} data-act="btime" data-v="${t}">${tf(t)}${bad ? '<small>' + (taken(B.date, t) ? 'Booked' : 'Full') + '</small>' : ''}</button>`; }).join('')}</div>
  <h3>4. Where</h3><div class="chips">${chips(['Centre', 'Online'], B.mode, 'bmode')}</div><div class="fld${B.err === 'note' ? ' err' : ''}"><label for="bn">Note for the tutor (optional)</label><textarea id="bn" maxlength="200" placeholder="Topics to cover, doubts to clear">${B.note}</textarea><span class="em">Keep notes under 200 characters.</span></div></div>
  <aside class="box2 sum"><h2>${B.re ? 'Reschedule' : 'Summary'}</h2><dl><dt>Student</dt><dd>${kid().n}, ${kid().g}</dd><dt>Subject</dt><dd>${B.sub}</dd><dt>Tutor</dt><dd>${TUT[B.sub]}</dd><dt>When</dt><dd>${ds(B.date, { weekday: 'long', day: 'numeric', month: 'short' })}, ${B.time ? tf(B.time) : 'pick a time'}</dd><dt>Where</dt><dd>${B.mode === 'Centre' ? '45 Learners Road, Velachery' : 'Online link sent by email'}</dd><dt>Fee</dt><dd>${B.re ? 'No charge' : inr(FEE) + ' (added to fees)'}</dd></dl>${B.err === 'time' ? '<p class="er" role="alert">Pick a time slot to continue.</p>' : ''}<button class="btn btn-p btn-block" data-act="confirm">${B.re ? 'Confirm new time' : 'Confirm booking'}</button>${B.re ? '<button class="btn btn-s btn-block" data-act="nore">Keep original time</button>' : ''}<small class="mu">Free to cancel or reschedule up to 24 hours before.</small></aside></div>
  <h2 class="h2s">${kid().n}'s bookings</h2>${u.length ? `<div class="box2"><ul class="sl">${u.map(sesRow).join('')}</ul></div>` : empty('No upcoming sessions yet.', 'Pick a slot above', 'book')}`; };

const att = { f: 'all' };
const attn = () => { const a = S.att.filter(x => x.k === S.kid), c = s => a.filter(x => x.s === s).length, L = { P: 'Present', A: 'Absent', L: 'Late' }, T = { P: 'ok', A: 'bad', L: 'wait' }, u = mine();
  const subs = Object.keys(S.sc[S.kid]).map(s => { const x = a.filter(y => y.sub === s), p = x.length ? Math.round(x.filter(y => y.s !== 'A').length / x.length * 100) : 0; return `<div class="br"><span>${s}</span><div class="prog"><i style="width:${p}%"></i></div><b>${p}%</b></div>`; }).join('');
  const rows = a.filter(x => att.f === 'all' || x.s === att.f).sort((p, q) => q.d.localeCompare(p.d));
  return `<div class="gm"><div class="box2 rg">${ring(rate())}<div><h2>Attendance</h2><p class="mu">${a.length} sessions in the last month</p><ul class="cn"><li><span class="tag ok">Present</span> ${c('P')}</li><li><span class="tag wait">Late</span> ${c('L')}</li><li><span class="tag bad">Absent</span> ${c('A')}</li></ul></div></div><div class="box2"><h2>By subject</h2>${subs}</div></div>
  <div class="gm"><div class="box2"><div class="chips" role="group" aria-label="Filter attendance">${['all', 'P', 'L', 'A'].map(f => `<button class="chip${att.f === f ? ' on' : ''}" data-act="af" data-v="${f}">${f === 'all' ? 'All' : L[f]}</button>`).join('')}</div>
  <div class="tw"><table><thead><tr><th>Date</th><th>Class</th><th>Tutor</th><th>Status</th></tr></thead><tbody>${rows.map(r => `<tr><td>${ds(r.d)}</td><td>${r.sub}</td><td>${TUT[r.sub]}</td><td><span class="tag ${T[r.s]}">${L[r.s]}</span></td></tr>`).join('') || '<tr><td colspan="4">No records match this filter.</td></tr>'}</tbody></table></div></div>
  <form class="box2" id="rep" novalidate><h2>Report an absence</h2><p class="mu">Tell us ahead of time and the tutor will share the notes.</p>${u.length ? `<div class="fld"><label for="rs">Session</label><select id="rs">${u.map(s => `<option value="${s.id}">${ds(s.d)}, ${tf(s.t)} · ${s.sub}</option>`).join('')}</select></div><div class="fld"><label for="rr">Reason</label><textarea id="rr" maxlength="200"></textarea><span class="em">Add a short reason, at least 5 characters.</span></div><button class="btn btn-p btn-block" type="submit">Send absence note</button>` : empty('No upcoming sessions to report.', 'Book a session', 'book')}</form></div>`; };

const prog = () => { const sc = S.sc[S.kid], ks = Object.keys(sc), av = avg(lat());
  return `<div class="gm"><div class="box2"><h2>Overall</h2><div class="big"><b>${grade(av)}</b><span>${av}% average across ${ks.length} subjects</span></div><button class="btn btn-p btn-block" data-act="rpt">${ico('dl')} Download term report</button></div><div class="box2"><h2>Score trend</h2>${chart()}</div></div>
  <div class="g3">${ks.map(k => { const a = sc[k], d = a.at(-1) - a.at(-2); return `<div class="box2 sc"><div class="sh"><h3>${k}</h3><span class="tag ${d >= 0 ? 'ok' : 'bad'}">${d >= 0 ? '+' : ''}${d} pts</span></div><div class="big sm"><b>${a.at(-1)}%</b><span>Grade ${grade(a.at(-1))}</span></div>${spark(a)}<div class="prog"><i style="width:${a.at(-1)}%"></i></div><p class="mu"><strong>${TUT[k] || ''}:</strong> ${REM[k] || 'Steady progress this term.'}</p></div>`; }).join('')}</div>`; };

const fees = () => { const mi = S.inv.filter(i => !i.paid), pd = S.inv.filter(i => i.paid).sort((a, b) => b.paid.localeCompare(a.paid)), tot = mi.reduce((a, i) => a + i.a, 0), kn = k => S.kids.find(x => x.id === k).n;
  return `<div class="g4 kp">${kpi('wal', inr(tot), 'Total due')}${kpi('ok', inr(pd.reduce((a, i) => a + i.a, 0)), 'Paid so far')}${kpi('cal', mi.length ? ds(mi.map(i => i.d).sort()[0]) : 'None', 'Next due date')}${kpi('user', S.kids.length, 'Children enrolled')}</div>
  <div class="box2"><h2>Pending invoices</h2>${mi.length ? `<ul class="sl">${mi.map(i => `<li class="sr"><label class="ck"><input type="checkbox" name="inv" value="${i.id}" checked><span class="sr-t"><strong>${i.t}</strong><small>${kn(i.k)} · due ${ds(i.d)}${i.d < iso(0) ? ' · overdue' : ''}</small></span></label><b>${inr(i.a)}</b></li>`).join('')}</ul><div class="pb"><span>Selected: <b id="selT">${inr(tot)}</b></span><button class="btn btn-p" data-act="pay">Pay selected</button></div>` : empty('All fees are paid. Thank you.', 'Book a session', 'book')}</div>
  <div class="box2"><h2>Payment history</h2><div class="tw"><table><thead><tr><th>Paid on</th><th>Invoice</th><th>Student</th><th>Method</th><th>Amount</th><th>Receipt</th></tr></thead><tbody>${pd.map(i => `<tr><td>${ds(i.paid)}</td><td>${i.t}</td><td>${kn(i.k)}</td><td>${i.m}</td><td>${inr(i.a)}</td><td><button class="btn btn-s sm" data-act="rc" data-v="${i.id}">${ico('dl')} Receipt</button></td></tr>`).join('')}</tbody></table></div></div>`; };

/* header: child switcher, notifications */
const head = () => { $('#kids').innerHTML = S.kids.map(k => `<button class="kp2${k.id === S.kid ? ' on' : ''}" data-act="kid" data-v="${k.id}" aria-pressed="${k.id === S.kid}"><span class="av">${k.n[0]}</span><span><b>${k.n}</b><small>${k.g}</small></span></button>`).join('');
  const h = new Date().getHours(); $('#wel').textContent = `${h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening'}, ${FN}`; $('#sub').textContent = `Here is how ${kid().n} is doing this week.`;
  $('#dt').textContent = new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' });
  const n = mine()[0], due = S.inv.filter(i => !i.paid).reduce((a, i) => a + i.a, 0);
  $('#hs').innerHTML = `<div><small>Next session</small><b>${n ? ds(n.d, { weekday: 'short' }) + ' ' + tf(n.t) : 'None yet'}</b><span>${n ? n.sub : 'Book one now'}</span></div><div><small>Attendance</small><b>${rate()}%</b><span>last month</span></div><div><small>Fees due</small><b>${due ? inr(due) : 'Paid up'}</b><span>${due ? 'all children' : 'thank you'}</span></div>`;
  const un = S.nt.filter(n => !n.r).length, b = $('#nb'); b.textContent = un; b.hidden = !un;
  $('#nl').innerHTML = S.nt.slice(0, 6).map(n => `<li class="${n.r ? '' : 'un'}">${n.t}</li>`).join('') || '<li>You are all caught up.</li>'; };
const renderBook = () => { $('#book').innerHTML = '<h2>Book a session</h2>' + book(); };
const render = () => { head(); $('#overview').innerHTML = ov(); renderBook(); $('#attendance').innerHTML = attn(); $('#progress').innerHTML = prog(); $('#messages').innerHTML = msgs(); $('#fees').innerHTML = '<h2>Fees and payments</h2>' + fees(); save(); };

/* messages */
const esc = t => t.replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
if (!S.msg) { S.msg = { 'Meera Raghavan': [{ f: 't', t: 'Aarav did very well in the algebra test. Shall we add a word-problems session?' }], 'Arjun Krishnan': [{ f: 't', t: 'Please bring the lab notebook on Monday.' }], 'Divya Sundar': [{ f: 't', t: 'Diya wrote a lovely essay this week.' }], 'Karthik Venkat': [] }; S.mr = { 'Divya Sundar': 1 }; }
const M = { cur: 'Meera Raghavan' }, role = n => Object.entries(TUT).find(e => e[1] === n)[0];
const msgs = () => { const th = S.msg[M.cur];
  return `<h2>Messages</h2><div class="box2 chat"><ul class="ct2">${Object.keys(S.msg).map(n => { const l = S.msg[n].at(-1); return `<li><button class="${n === M.cur ? 'on' : ''}" data-act="th" data-v="${n}"><span class="av">${n[0]}</span><span><b>${n}</b><small>${role(n)} · ${l ? esc(l.t.slice(0, 30)) : 'No messages yet'}</small></span>${l && l.f === 't' && !S.mr[n] ? '<i class="dot" aria-label="Unread"></i>' : ''}</button></li>`; }).join('')}</ul>
  <div class="th"><div class="thh"><span class="av">${M.cur[0]}</span><div><b>${M.cur}</b><small class="mu">${role(M.cur)} tutor · replies within a day</small></div></div><div class="bub" id="bub">${th.map(m => `<p class="b ${m.f}">${esc(m.t)}</p>`).join('') || '<p class="mu">Say hello to start the conversation.</p>'}</div>
  <div class="chips">${['Can we reschedule?', 'How is ' + kid().n + ' doing?', 'Thank you'].map(q => `<button class="chip" data-act="qr" data-v="${q}">${q}</button>`).join('')}</div><form id="mf" novalidate><div class="fld"><input id="mi" maxlength="300" aria-label="Message" placeholder="Write a message"><span class="em">Type a message first.</span></div><button class="btn btn-p" type="submit">Send</button></form></div></div>`; };
const sendMsg = t => { const n = M.cur; S.msg[n].push({ f: 'p', t }); S.mr[n] = 1; $('#messages').innerHTML = msgs(); save(); $('#bub').scrollTop = 1e5;
  setTimeout(() => { S.msg[n].push({ f: 't', t: 'Thanks for your message. I will reply in detail after today\'s class.' }); S.mr[n] = M.cur === n ? 1 : 0; if (M.cur !== n) note(`New message from ${n}.`); render(); $('#bub') && ($('#bub').scrollTop = 1e5); }, 1300); };

/* payment modal */
const closeM = () => { $('.mdl')?.remove(); };
const openPay = (ids, m = 'UPI') => { closeM(); const L = S.inv.filter(i => ids.includes(i.id)), t = L.reduce((a, i) => a + i.a, 0), d = document.createElement('div'); d.className = 'mdl';
  d.innerHTML = `<div class="mc" role="dialog" aria-modal="true" aria-labelledby="mt"><button class="ibtn xb" data-act="mx" aria-label="Close payment">${ico('x')}</button><h2 id="mt">Pay ${inr(t)}</h2><p class="mu">${L.map(i => i.t).join(', ')}</p><div class="chips">${chips(['UPI', 'Card'], m, 'pm')}</div>
  <form id="pf" novalidate data-ids="${ids.join(',')}" data-m="${m}">${m === 'UPI' ? '<div class="fld"><label for="f1">UPI ID</label><input id="f1" placeholder="name@bank" autocomplete="off"><span class="em">Enter a valid UPI ID, like name@okbank.</span></div>' : '<div class="fld"><label for="f1">Name on card</label><input id="f1" autocomplete="cc-name"><span class="em">Enter the name on the card.</span></div><div class="fld"><label for="f2">Card number</label><input id="f2" inputmode="numeric" placeholder="1234 5678 9012 3456" autocomplete="cc-number"><span class="em">Enter a 16-digit card number.</span></div><div class="g2 tight"><div class="fld"><label for="f3">Expiry</label><input id="f3" placeholder="MM/YY"><span class="em">Use MM/YY, not in the past.</span></div><div class="fld"><label for="f4">CVV</label><input id="f4" inputmode="numeric" type="password" maxlength="4"><span class="em">Enter 3 or 4 digits.</span></div></div>'}<button class="btn btn-p btn-block" type="submit">Pay ${inr(t)}</button></form><p class="demo">Demo checkout. Connect Stripe, Razorpay or PayPal here. No card details are stored.</p></div>`;
  document.body.append(d); $('#f1', d).focus(); };
const receipt = i => dl(`receipt-MH-${i.id}.txt`, `MeritHall Tutoring Center\nReceipt MH-${i.id}\n\nInvoice: ${i.t}\nStudent: ${S.kids.find(k => k.id === i.k).n}\nAmount: ${inr(i.a)}\nPaid on: ${i.paid} via ${i.m}\n\nThank you.`);
const report = () => dl(`term-report-${kid().n}.txt`, `MeritHall term report\nStudent: ${kid().n}, ${kid().g}\nAttendance: ${rate()}%\nOverall: ${grade(avg(lat()))} (${avg(lat())}%)\n\n` + Object.entries(S.sc[S.kid]).map(([k, a]) => `${k}: ${a.at(-1)}% (${grade(a.at(-1))}). Tests: ${a.join(', ')}. ${REM[k] || ''}`).join('\n'));

/* actions */
const A = {
  go: v => go(v), kid: v => { S.kid = v; Object.assign(B, { time: null, re: null }); render(); },
  th: v => { M.cur = v; S.mr[v] = 1; render(); }, qr: v => { const i = $('#mi'); i.value = v; i.focus(); }, bsub: v => { B.sub = v; B.time = null; renderBook(); }, bdate: v => { B.date = v; B.time = null; renderBook(); }, btime: v => { B.time = v; B.err = ''; renderBook(); }, bmode: v => { B.mode = v; renderBook(); },
  nore: () => { B.re = null; renderBook(); },
  confirm: () => { if (!B.time) { B.err = 'time'; return renderBook(); } if (B.note.length > 200) { B.err = 'note'; return renderBook(); }
    if (B.re) { const s = S.ses.find(x => x.id === B.re); Object.assign(s, { sub: B.sub, d: B.date, t: B.time, mode: B.mode }); note(`${kid().n}'s session moved to ${ds(B.date)}, ${tf(B.time)}.`); toast('Session rescheduled.'); }
    else { S.ses.push({ id: id(), k: S.kid, sub: B.sub, d: B.date, t: B.time, mode: B.mode, st: 'up' }); S.inv.push({ id: id(), k: S.kid, t: `Extra session: ${B.sub}, ${ds(B.date)}`, a: FEE, d: iso(7) }); note(`Booked ${B.sub} for ${kid().n} on ${ds(B.date)}, ${tf(B.time)}.`); toast('Session booked. Confirmation sent to your email.'); }
    Object.assign(B, { time: null, note: '', re: null, err: '', date: iso(1) }); render(); },
  resch: v => { const s = S.ses.find(x => x.id === +v); Object.assign(B, { sub: s.sub, date: s.d > iso(0) ? s.d : iso(1), time: null, mode: s.mode, re: s.id }); renderBook(); go('book'); toast('Pick a new date and time.'); },
  cancel: v => { if (!confirm('Cancel this session?')) return; const s = S.ses.find(x => x.id === +v); s.st = 'x'; note(`Cancelled ${s.sub} on ${ds(s.d)}.`); toast('Session cancelled.'); render(); },
  af: v => { att.f = v; $('#attendance').innerHTML = attn(); },
  join: () => toast('Online class link placeholder. Add your Zoom or Meet URL here.'), dir: () => window.open('https://maps.google.com', '_blank', 'noopener'),
  rpt: report, rc: v => receipt(S.inv.find(i => i.id === +v)),
  pay: () => { const ids = $$('[name=inv]:checked').map(c => +c.value); ids.length ? openPay(ids) : toast('Select at least one invoice.'); },
  pm: v => { openPay($('#pf').dataset.ids.split(',').map(Number), v); }, mx: closeM,
  nread: () => { S.nt.forEach(n => n.r = 1); render(); }, reset: () => { localStorage.removeItem(K); location.reload(); }
};
document.addEventListener('click', e => {
  const b = e.target.closest('[data-act]'); if (b && A[b.dataset.act]) A[b.dataset.act](b.dataset.v);
  const w = e.target.closest('.dw'); $$('.dw.open').forEach(x => x !== w && x.classList.remove('open')); if (e.target.closest('.dw>.ibtn')) w.classList.toggle('open');
  if (e.target.classList.contains('mdl')) closeM(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') { closeM(); $$('.dw.open').forEach(x => x.classList.remove('open')); } });
document.addEventListener('change', e => {
  if (e.target.id === 'kidSel') { S.kid = e.target.value; Object.assign(B, { time: null, re: null }); render(); }
  if (e.target.name === 'inv') $('#selT').textContent = inr($$('[name=inv]:checked').reduce((a, c) => a + S.inv.find(i => i.id === +c.value).a, 0)); });
document.addEventListener('input', e => { if (e.target.id === 'bn') B.note = e.target.value; if (e.target.closest('.fld')) e.target.closest('.fld').classList.remove('err'); });
document.addEventListener('submit', e => { e.preventDefault(); const f = e.target;
  if (f.id === 'mf') { const i = $('#mi'), t = i.value.trim(); i.closest('.fld').classList.toggle('err', !t); if (t) sendMsg(esc(t).length ? t : ''); else i.focus(); }
  if (f.id === 'rep') { const r = $('#rr'), bad = r.value.trim().length < 5; r.closest('.fld').classList.toggle('err', bad); if (bad) return r.focus();
    const s = S.ses.find(x => x.id === +$('#rs').value); s.st = 'x'; S.att.unshift({ k: s.k, d: s.d, sub: s.sub, s: 'A' }); note(`Absence noted for ${s.sub} on ${ds(s.d)}.`); toast('Absence note sent to the tutor.'); render(); }
  if (f.id === 'pf') { const v = id => ($('#' + id, f) || {}).value || '', m = f.dataset.m, ex = v('f3').match(/^(0[1-9]|1[0-2])\/(\d\d)$/);
    const ok = m === 'UPI' ? { f1: /^[\w.-]{2,}@[a-z]{2,}$/i.test(v('f1')) } : { f1: v('f1').trim() !== '', f2: /^\d{16}$/.test(v('f2').replace(/\s/g, '')), f3: !!ex && new Date(2000 + +ex[2], +ex[1], 1) > new Date(), f4: /^\d{3,4}$/.test(v('f4')) };
    let bad = null; Object.entries(ok).forEach(([k, g]) => { $('#' + k, f).closest('.fld').classList.toggle('err', !g); if (!g && !bad) bad = k; }); if (bad) return $('#' + bad, f).focus();
    const btn = $('button[type=submit]', f), ids = f.dataset.ids.split(',').map(Number); btn.disabled = true; btn.textContent = 'Processing…';
    setTimeout(() => { const L = S.inv.filter(i => ids.includes(i.id)); L.forEach(i => { i.paid = iso(0); i.m = m; }); note(`Payment of ${inr(L.reduce((a, i) => a + i.a, 0))} received. Thank you.`); render();
      $('.mc').innerHTML = `<h2>Payment received</h2><p class="mu">${inr(L.reduce((a, i) => a + i.a, 0))} paid by ${m}. A receipt is in your payment history.</p><div class="acts"><button class="btn btn-p" data-act="mx">Done</button></div>`; }, 900); } });
$('#nAll')?.addEventListener('click', A.nread);
render();
$$('.pf .pn,.un2').forEach(x => x.textContent = FN); $('.pf .av').textContent = FN[0].toUpperCase();
document.addEventListener('click', e => { if (e.target.closest('a[href="login.html"],.out')) { localStorage.removeItem('bp-session'); sessionStorage.removeItem('bp-session'); } });
$$('[data-ic]').forEach(s => s.innerHTML = ico(s.dataset.ic));
})();
