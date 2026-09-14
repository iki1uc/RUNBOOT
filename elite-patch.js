/* ═══════════════════════════════════════════════════════════════
   ELITE-PATCH · für UNIVERSAL-DETECTOR
   Logisch machbar:
     1. Schwarm-Modus (BroadcastChannel)
     2. Cross-Tab Sync (Storage Event)
     3. Pfad-Fingerabdruck (deterministisch)
     4. FL76 Alarm (Verschärfung)
     5. Geister-Spur (81 Werte visualisiert)
   Nur markiert (TMP-Zeichen, easter egg):
     6. 6×6 Kreuz → ◇ tmp
     7. 512-Byte-Seele → ◇ tmp
     8. FFT Spektrum → ◇ tmp
   ═══════════════════════════════════════════════════════════════ */
(() => {
"use strict";

if (window.__ELITE_PATCH__) return;
window.__ELITE_PATCH__ = true;

/* ─── State ──────────────────────────────────────────────── */
const E = {
  id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2),
  type: 'UNKNOWN',
  subtype: 'ROOT',
  level: 'GUEST',
  peers: new Map(),
  lastFL: 76,
  flSamples: new Array(81).fill(76),
  flIndex: 0,
  alarmActive: false,
  fingerprint: null,
  bc: null,
  ui: null,
};

/* ─── 1 · SCHWARM-MODUS (BroadcastChannel) ───────────────── */
try {
  E.bc = new BroadcastChannel('universal-detector-swarm');
  E.bc.onmessage = (ev) => {
    const d = ev.data;
    if (!d || !d.type) return;
    if (d.id === E.id) return;

    if (d.type === 'whoami') {
      // Peer meldet sich — antworte
      E.bc.postMessage({
        type: 'here',
        id: E.id, peerType: E.type, peerSub: E.subtype,
        level: E.level, ts: Date.now(),
      });
      E.peers.set(d.id, {
        id: d.id, peerType: d.peerType, peerSub: d.peerSub,
        level: d.level, ts: Date.now(), fresh: true,
      });
      log(`◈ SCHWARM · peer entdeckt · ${d.peerType}/${d.peerSub}`, 'ok');
      renderPeers();
    }
    else if (d.type === 'here') {
      E.peers.set(d.id, {
        id: d.id, peerType: d.peerType, peerSub: d.peerSub,
        level: d.level, ts: Date.now(), fresh: true,
      });
      renderPeers();
    }
    else if (d.type === 'login') {
      // Anderer Tab hat sich eingeloggt
      E.level = d.level;
      log(`→ AUTH-SYNC · ${d.user} · von anderem Tab`, 'adm');
      renderPeers();
    }
    else if (d.type === 'reset') {
      log(`→ RESET-SYNC · von anderem Tab`, 'warn');
      setTimeout(() => location.reload(), 400);
    }
  };
  // Wer sind wir?
  E.bc.postMessage({
    type: 'whoami',
    id: E.id, peerType: E.type, peerSub: E.subtype, level: E.level,
  });
  log('◈ SCHWARM-MODUS aktiv', 'ok');
} catch (err) {
  // BroadcastChannel nicht verfügbar — egal
}

/* ─── 2 · CROSS-TAB SYNC (Storage) ───────────────────────── */
window.addEventListener('storage', (ev) => {
  if (!ev.key || !ev.key.startsWith('universal:')) return;
  const k = ev.key.replace('universal:', '');
  log(`→ SYNC · ${k} von anderem Tab`, 'info');
  if (k === 'level') {
    E.level = ev.newValue || 'GUEST';
    renderPeers();
  }
});
function syncStorage(k, v) {
  try { localStorage.setItem('universal:' + k, String(v)); } catch(_) {}
}

/* ─── 3 · PFAD-FINGERABDRUCK ─────────────────────────────── */
function fingerprint(path) {
  let h = 5381;
  for (const c of path) h = ((h << 5) + h) + c.charCodeAt(0);
  h = h >>> 0;
  const glyphs = '◈◉◆◇▦▤⚡▣◍∘∙∿△▽∠∴';
  const out = [];
  for (let row = 0; row < 8; row++) {
    let line = '';
    for (let col = 0; col < 8; col++) {
      h = (h * 1103515245 + 12345) >>> 0;
      line += glyphs[h % glyphs.length] + ' ';
    }
    out.push(line.trim());
  }
  return out;
}

/* ─── 4 · FL76 ALARM ─────────────────────────────────────── */
function checkFL(ms) {
  E.lastFL = ms;
  E.flSamples[E.flIndex] = ms;
  E.flIndex = (E.flIndex + 1) % E.flSamples.length;

  const isOutside = ms > 120 || ms < 40;
  if (isOutside && !E.alarmActive) {
    E.alarmActive = true;
    document.body.style.filter = 'saturate(1.6) contrast(1.08)';
    document.body.style.transition = 'filter .6s';
    log(`⚠️ FL76=${Math.round(ms)}ms · außerhalb Kaiser-Fenster (60–90)`, 'err');
  } else if (!isOutside && E.alarmActive) {
    E.alarmActive = false;
    document.body.style.filter = '';
    log(`✓ FL76=${Math.round(ms)}ms · zurück im Kaiser-Fenster`, 'ok');
  }
}

/* ─── 5 · GEISTER-SPUR (Canvas) ──────────────────────────── */
function drawGhostTrail() {
  const c = document.getElementById('elite-ghost-trail');
  if (!c) return;
  const ctx = c.getContext('2d');
  const W = c.width = c.clientWidth * 2;
  const H = c.height = 60;
  ctx.clearRect(0, 0, W, H);
  ctx.lineWidth = 1.4;

  const min = 0, max = 200;
  const stepX = W / E.flSamples.length;

  ctx.strokeStyle = 'rgba(255,138,42,0.15)';
  ctx.beginPath();
  for (let y = 60; y <= 90; y += 15) {
    const py = H - ((y - min) / (max - min)) * H;
    ctx.moveTo(0, py); ctx.lineTo(W, py);
  }
  ctx.stroke();

  ctx.strokeStyle = '#ff8a2a';
  ctx.shadowColor = '#ff8a2a';
  ctx.shadowBlur = 6;
  ctx.beginPath();
  for (let i = 0; i < E.flSamples.length; i++) {
    const idx = (E.flIndex + i) % E.flSamples.length;
    const v = E.flSamples[idx];
    const x = i * stepX;
    const y = H - ((v - min) / (max - min)) * H;
    if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  }
  ctx.stroke();
  ctx.shadowBlur = 0;
}

/* ─── UI · Overlays ──────────────────────────────────────── */
function buildUI() {
  if (document.getElementById('elite-patch')) return;

  const css = document.createElement('style');
  css.textContent = `
    #elite-patch {
      position: fixed; top: 40px; right: 12px; z-index: 9998;
      width: 260px; font-family: 'JetBrains Mono', Consolas, monospace;
      font-size: 10px; color: #c8d8e8; pointer-events: auto;
    }
    #elite-patch .panel {
      background: rgba(10,14,28,.94); border: 1px solid rgba(140,160,220,.12);
      border-left: 3px solid #ff8a2a; border-radius: 6px;
      padding: 8px 10px; margin-bottom: 6px;
      box-shadow: 0 0 20px rgba(255,138,42,.06);
      backdrop-filter: blur(6px);
    }
    #elite-patch h4 {
      font-size: 9px; letter-spacing: 1.8px; text-transform: uppercase;
      color: #ff8a2a; margin: 0 0 6px 0; padding-bottom: 4px;
      border-bottom: 1px solid rgba(140,160,220,.08);
      display: flex; justify-content: space-between; align-items: center;
    }
    #elite-patch h4 .badge {
      font-size: 8px; padding: 1px 5px; border-radius: 3px;
      background: rgba(255,138,42,.12); color: #ff8a2a;
      letter-spacing: .5px;
    }
    #elite-patch .peer {
      display: flex; justify-content: space-between; align-items: center;
      padding: 3px 6px; margin: 2px 0;
      background: rgba(0,0,0,.4); border-left: 2px solid #5fc8ff;
      border-radius: 3px; font-size: 10px;
      transition: opacity .3s;
    }
    #elite-patch .peer.self { border-left-color: #ff8a2a; }
    #elite-patch .peer.stale { opacity: .35; }
    #elite-patch .peer .dot {
      width: 5px; height: 5px; border-radius: 50%;
      background: #7ce0a8; box-shadow: 0 0 5px #7ce0a8;
      display: inline-block; margin-right: 5px;
    }
    #elite-patch .peer .lvl { font-size: 8.5px; color: #5a7288; }
    #elite-patch .fp {
      font-size: 10px; line-height: 1.3; color: #8cf0d0;
      letter-spacing: 1px; white-space: pre; padding: 3px 0;
      text-shadow: 0 0 6px rgba(140,240,208,.3);
    }
    #elite-patch .tmp {
      display: inline-block; padding: 1px 5px; margin: 1px 2px 0 0;
      background: rgba(90,114,136,.15); color: #5a7288;
      border: 1px dashed rgba(90,114,136,.4);
      border-radius: 3px; font-size: 8.5px; letter-spacing: .8px;
      cursor: help;
    }
    #elite-patch .tmp:hover { color: #ffcc44; border-color: rgba(255,204,68,.5); }
    #elite-ghost-trail {
      width: 100%; height: 30px; display: block;
      margin-top: 4px; border-radius: 3px;
      background: rgba(0,0,0,.35);
    }
    @media (max-width: 900px) { #elite-patch { display: none; } }
  `;
  document.head.appendChild(css);

  const wrap = document.createElement('div');
  wrap.id = 'elite-patch';
  wrap.innerHTML = `
    <div class="panel" id="ep-swarm">
      <h4>◈ SCHWARM <span class="badge" id="ep-peer-count">1 / 1</span></h4>
      <div id="ep-peers"></div>
    </div>
    <div class="panel">
      <h4>◈ PFAD-FINGERABDRUCK <span class="badge" id="ep-fp-badge">◇</span></h4>
      <div class="fp" id="ep-fp">— — — — — — — —</div>
      <div style="font-size:8.5px;color:#5a7288;margin-top:4px;font-style:italic;">
        <span id="ep-fp-path">/root</span>
      </div>
    </div>
    <div class="panel">
      <h4>◈ GEISTER-SPUR · FL76 <span class="badge" id="ep-fl-badge">76ms</span></h4>
      <canvas id="elite-ghost-trail"></canvas>
      <div style="font-size:8.5px;color:#5a7288;margin-top:3px;">
        81 ticks · Kaiser-Fenster 60–90ms
      </div>
    </div>
    <div class="panel">
      <h4>◈ TMP · SCHLUMMERND <span class="badge">egg</span></h4>
      <div style="font-size:9px;line-height:1.5;">
        <span class="tmp" title="6×6 Kreuz · FL76 − 2 = 74 = Ecken-Summe · nicht aktiviert">◇ 6×6-kreuz</span>
        <span class="tmp" title="512-byte seele · fetch self · blockiert bei file://">◇ mbr-seele</span>
        <span class="tmp" title="FFT tick-spektrum · 60/120/180Hz signaturen">◇ fft-tick</span>
        <span class="tmp" title="shared-worker sandbox · OPFS root">◇ opfs-root</span>
      </div>
    </div>
  `;
  document.body.appendChild(wrap);
  E.ui = wrap;
}

/* ─── Render ─────────────────────────────────────────────── */
function renderPeers() {
  const el = document.getElementById('ep-peers');
  const cnt = document.getElementById('ep-peer-count');
  if (!el) return;

  const now = Date.now();
  const list = [];
  // Self
  list.push({
    id: E.id, peerType: E.type, peerSub: E.subtype, level: E.level,
    ts: now, fresh: true, self: true,
  });
  for (const p of E.peers.values()) {
    p.fresh = (now - p.ts) < 12000;
    list.push(p);
  }
  // Sortiere: self zuerst, dann frische
  list.sort((a, b) => (b.self ? 1 : 0) - (a.self ? 1 : 0) ||
                      (b.fresh ? 1 : 0) - (a.fresh ? 1 : 0));

  el.innerHTML = list.map(p => `
    <div class="peer ${p.self ? 'self' : ''} ${p.fresh ? '' : 'stale'}">
      <span><span class="dot"></span>${p.peerType}/${p.peerSub}</span>
      <span class="lvl">${p.self ? '·self·' : p.level}</span>
    </div>
  `).join('');
  cnt.textContent = `${list.filter(p => p.fresh).length} / ${list.length}`;
}

function renderFingerprint() {
  const path = location.pathname + location.href;
  const fp = fingerprint(path);
  const el = document.getElementById('ep-fp');
  const pathEl = document.getElementById('ep-fp-path');
  if (el) el.textContent = fp.join('\n');
  if (pathEl) pathEl.textContent = location.pathname || '/';
  E.fingerprint = fp;
}

function log(msg, cls = '') {
  // Wenn das Original-System eine Log-Funktion hat, nutzen wir sie.
  // Sonst eigene Mini-Log über console + kleines Popup.
  console.log(`%c[ELITE] ${msg}`,
    cls === 'ok' ? 'color:#7ce0a8' :
    cls === 'warn' ? 'color:#ffcc44' :
    cls === 'err' ? 'color:#ff5a7a' :
    cls === 'adm' ? 'color:#ff4d6d;font-weight:bold' :
    'color:#5fc8ff');
}

/* ─── Hook in den Original-Loop ──────────────────────────── */
function startLoop() {
  let lastT = performance.now();
  function loop(now) {
    const dt = now - lastT;
    lastT = now;
    checkFL(dt);
    drawGhostTrail();

    const flBadge = document.getElementById('ep-fl-badge');
    if (flBadge) {
      flBadge.textContent = Math.round(E.lastFL) + 'ms';
      flBadge.style.background = E.alarmActive
        ? 'rgba(255,90,122,.15)'
        : 'rgba(255,138,42,.12)';
      flBadge.style.color = E.alarmActive ? '#ff5a7a' : '#ff8a2a';
    }
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
}

/* ─── Peer-Aging ─────────────────────────────────────────── */
setInterval(() => {
  const now = Date.now();
  for (const [id, p] of E.peers) {
    if (now - p.ts > 15000) E.peers.delete(id);
  }
  renderPeers();
}, 5000);

/* ─── Heartbeat ──────────────────────────────────────────── */
setInterval(() => {
  if (E.bc) {
    try {
      E.bc.postMessage({
        type: 'here',
        id: E.id, peerType: E.type, peerSub: E.subtype,
        level: E.level, ts: Date.now(),
      });
    } catch(_) {}
  }
}, 6000);

/* ─── Detect-Type-Hook ───────────────────────────────────── */
// Versuche den Typ vom Original zu übernehmen (aus window.RAM oder DOM)
setTimeout(() => {
  try {
    const title = document.title || '';
    const m = title.match(/·\s*([A-Z0-9]+)\s*·/);
    if (m) { E.type = m[1]; }
    else if (window.RAM && window.RAM.type) E.type = window.RAM.type;
    else if (location.pathname.includes('/CPU/')) E.type = 'CPU';
    else if (location.pathname.includes('/GPU/')) E.type = 'GPU';
    else if (location.pathname.includes('/ROM/')) E.type = 'ROM';
    else if (location.pathname.includes('/HDF/')) E.type = 'HDF';
    else if (location.pathname.includes('/TMP/')) E.type = 'TMP';
    else E.type = 'RAM';
  } catch(_) { E.type = 'RAM'; }

  renderFingerprint();
  renderPeers();
  // Broadcast, dass wir da sind
  if (E.bc) {
    try {
      E.bc.postMessage({
        type: 'whoami',
        id: E.id, peerType: E.type, peerSub: E.subtype, level: E.level,
      });
    } catch(_) {}
  }
  log(`◈ ELITE-PATCH bereit · ich sitze in ${E.type}`, 'ok');
}, 800);

/* ─── Reset-Sync-Hook ────────────────────────────────────── */
window.ELITE_RESET = () => {
  if (E.bc) {
    try { E.bc.postMessage({ type: 'reset', id: E.id }); } catch(_) {}
  }
  setTimeout(() => location.reload(), 100);
};

/* ─── Login-Sync-Hook ────────────────────────────────────── */
window.ELITE_LOGIN = (user, level) => {
  E.level = level || 'GUEST';
  syncStorage('level', E.level);
  if (E.bc) {
    try {
      E.bc.postMessage({ type: 'login', id: E.id, user, level: E.level });
    } catch(_) {}
  }
  log(`◈ ELITE LOGIN-SYNC · ${user} · ${E.level}`, 'adm');
  renderPeers();
};

/* ─── Init ───────────────────────────────────────────────── */
buildUI();
startLoop();
renderFingerprint();
renderPeers();

// Public API
window.ELITE = {
  state: () => ({
    id: E.id, type: E.type, level: E.level,
    peers: Array.from(E.peers.values()),
    fl: E.lastFL, alarm: E.alarmActive,
    fingerprint: E.fingerprint,
  }),
  reset: () => window.ELITE_RESET(),
  login: (u, l) => window.ELITE_LOGIN(u, l),
  fingerprint: (path) => fingerprint(path || location.pathname),
  broadcast: (msg) => { if (E.bc) try { E.bc.postMessage(msg); } catch(_) {} },
};

console.log('%c◈ ELITE-PATCH aktiv', 'color:#ff8a2a;font-weight:bold;font-size:12px;');
console.log('→ ELITE.state() · ELITE.reset() · ELITE.login(user, level) · ELITE.fingerprint()');
})();
