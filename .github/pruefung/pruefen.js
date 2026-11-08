// Prüft turi-explains-ai.html („Turi erklärt KI“), ai-under-the-hood.html („KI unter der Haube“) und die Startseite
// index.html (GitHub Pages) so, wie es CLAUDE.md verlangt.
// Aufruf im Repository-Ordner: node .github/pruefung/pruefen.js [Datei]
// (TURI_SEITEN=turi, haube oder start prüft nur eine der Seiten; mehrere mit Komma)
// Beendet sich mit Code 1, wenn ein Problem gefunden wurde.
const {chromium, devices} = require('playwright');
const path = require('path');
const fs = require('fs');
const os = require('os');

const DATEI = path.resolve(process.argv[2] || 'turi-explains-ai.html');
const URL = 'file://' + DATEI;
const HAUBE = path.resolve(path.dirname(DATEI), 'ai-under-the-hood.html');
const HAUBE_URL = 'file://' + HAUBE;
const SEITEN = (process.env.TURI_SEITEN || 'turi,haube,start').split(',');
const START = path.resolve(path.dirname(DATEI), 'index.html');
const ALLE = ['de', 'en', 'fr', 'it', 'es', 'nl'];
// Für schnelle Proben vor Ort: TURI_SPRACHEN=de,fr node .github/pruefung/pruefen.js
const SPRACHEN = process.env.TURI_SPRACHEN ? process.env.TURI_SPRACHEN.split(',') : ALLE;
const GERAETE = [
  ['Desktop', {viewport: {width: 1280, height: 900}}],
  ['iPad hoch', devices['iPad (gen 7)']],
  ['iPad quer', devices['iPad Pro 11 landscape']],
  ['Handy', devices['iPhone 13']],
];
// Wörter, die nur in deutschem Text vorkommen (Suche nach deutschen Textresten).
// Nicht aufnehmen: Wörter, die es auch in anderen Sprachen gibt (z. B. „das“ im Spanischen, „die“ im Niederländischen).
const DEUTSCH = /\b(und|nicht|ist|der|mit|auf|für|wird|sind|eine|Weiter|Zurück|Aufgabe|Schnipsel|Landkarte)\b/;
// Ausnahmen bei der Tippflächen-Höhe: Links im Fließtext und Wörter auf der Landkarte
const KLEIN_ERLAUBT = 'a, .mw';


// Sprachpakete gegeneinander prüfen (läuft in der Seite)
function pruefePakete() {
  const errs = [];
  const E = (l, m) => errs.push(l + ': ' + m);
  const ref = TURI_LANG.de;
  function tokenizer(L) {
    function splitWord(w) {
      const k = w.toLowerCase(), sp = L.splits[k];
      if (sp) { let i = 0; return sp.map(p => { const s = w.slice(i, i + p.length); i += p.length; return s; }); }
      if (w.length <= 7) return [w];
      for (const s of L.suffix) if (k.endsWith(s) && w.length - s.length >= 4) return [...splitWord(w.slice(0, -s.length)), w.slice(-s.length)];
      const m = Math.ceil(w.length / 2);
      return [w.slice(0, m), ...splitWord(w.slice(m))];
    }
    return t => {
      const out = [];
      for (const m of t.matchAll(/\s*([\p{L}\p{N}]+|[^\s\p{L}\p{N}])/gu)) (/[\p{L}\p{N}]/u.test(m[1]) ? splitWord(m[1]) : [m[1]]).forEach(p => out.push(p));
      return out;
    };
  }
  function form(a, b, pfad, l) {
    if (typeof a !== typeof b) { E(l, `${pfad}: Typ ${typeof b} statt ${typeof a}`); return; }
    if (Array.isArray(a)) {
      if (!Array.isArray(b)) { E(l, pfad + ': keine Liste'); return; }
      const fest = !/^(presets\.\d+\.(next|gen)|splits|suffix|cheese|feel\.\d+\.n|probes\.\d+\.(c|ctx)|presets\.\d+\.gen\.\d+)/.test(pfad);
      if (fest && a.length !== b.length) E(l, `${pfad}: Länge ${b.length} statt ${a.length}`);
      if (fest) a.forEach((x, i) => { if (b[i] !== undefined && typeof x === 'object' && x) form(x, b[i], pfad + '.' + i, l); });
      return;
    }
    if (a && typeof a === 'object') {
      if (/^(splits|presets\.\d+\.attw|bank\.\d+\.w)$/.test(pfad)) return;
      for (const k of Object.keys(a)) { if (!(k in b)) E(l, (pfad ? pfad + '.' : '') + k + ' fehlt'); else form(a[k], b[k], pfad ? pfad + '.' + k : k, l); }
      for (const k of Object.keys(b)) if (!(k in a)) E(l, (pfad ? pfad + '.' : '') + k + ' zusätzlich');
    }
  }
  for (const [l, L] of Object.entries(TURI_LANG)) {
    if (l !== 'de') form(ref, L, '', l);
    const tok = tokenizer(L);
    L.presets.forEach((p, i) => {
      const t = tok(p.text);
      for (const k of Object.keys(p.attw)) if (!t.includes(k)) E(l, `Anfrage ${i}: Gewicht für „${k}“, Tokens sind ${JSON.stringify(t)}`);
      const g = p.gen;
      if (g[g.length - 1][0][0] !== L.end) E(l, `Anfrage ${i}: letzte Runde endet nicht mit ${L.end}`);
    });
    L.bank.forEach((b, i) => {
      const t = tok(b.t);
      if (t[t.length - 1] !== L.amb) E(l, `bank ${i}: letztes Token „${t[t.length - 1]}“ statt „${L.amb}“`);
      if (b.w) for (const k of Object.keys(b.w)) if (!t.slice(0, -1).includes(k)) E(l, `bank ${i}: Gewicht für „${k}“, Tokens sind ${JSON.stringify(t)}`);
    });
    if (L.st.length !== document.querySelectorAll('.step').length) E(l, 'Anzahl der Stationsnamen (st) passt nicht zu den Stationen');
  }
  return {sprachen: Object.keys(TURI_LANG), errs};
}

// Alle Knöpfe, Regler und Eingabefelder der aktuellen Station einmal bedienen
async function bediene(p) {
  await p.evaluate(() => {
    for (const r of document.querySelectorAll('#content input[type=range]')) {
      r.value = r.max; r.dispatchEvent(new Event('input', {bubbles: true})); r.dispatchEvent(new Event('change', {bubbles: true}));
    }
    for (const t of document.querySelectorAll('#content input[type=text], #content input:not([type]), #content textarea')) {
      t.value = 'Hallo Turi 123'; t.dispatchEvent(new Event('input', {bubbles: true}));
    }
  });
  for (let i = 0; i < 120; i++) {
    const weiter = await p.evaluate(i => {
      const b = [...document.querySelectorAll('#content button')].filter(b => b.offsetParent && !b.disabled)[i];
      if (!b) return false;
      b.click();
      return true;
    }, i);
    if (!weiter) break;
  }
  await p.keyboard.press('Escape');
  await p.waitForTimeout(150);
}

// Geht zu Station i. Beim Tippen kommt der Klick leicht verzögert an; deshalb wird gewartet, bis entweder
// das Fenster „Moment mal!“ erscheint (dann „Trotzdem weiter“) oder die Station wirklich gewechselt hat.
async function zuStation(p, i, tippen) {
  const sel = `.step[data-s="${i}"]`;
  const da = () => p.waitForFunction(i => document.querySelector('.step[aria-current]')?.dataset.s === String(i), i, {timeout: 10000});
  // Unter hoher Last (viele Prüfungen gleichzeitig) kommt ein Tippen manchmal nicht an, etwa während die Seite noch scrollt.
  // Dann bis zu dreimal tippen; funktioniert Tippen wirklich nicht, schlägt die Prüfung trotzdem fehl.
  for (let versuch = 1; ; versuch++) {
    if (tippen) await p.tap(sel); else await p.click(sel);
    try {
      await p.waitForFunction(i => !document.getElementById('hint').hidden || document.querySelector('.step[aria-current]')?.dataset.s === String(i), i, {timeout: 5000});
      break;
    } catch (e) { if (versuch >= 3) throw e; }
  }
  if (await p.isVisible('#hintGo')) { if (tippen) await p.tap('#hintGo'); else await p.click('#hintGo'); }
  await da();
  await p.waitForTimeout(100);
  await ruhe(p);
}

// Wartet, bis Einblend-Animationen fertig sind, damit Größen und Abstände nicht mitten in der Bewegung gemessen werden
// (endlose Animationen wie Turis Blinzeln werden nicht abgewartet, höchstens 3 Sekunden)
async function ruhe(p) {
  await p.evaluate(() => Promise.race([
    Promise.all(document.getAnimations()
      .filter(a => a.playState === 'running' && Number.isFinite(a.effect?.getComputedTiming().endTime))
      .map(a => a.finished.catch(() => {}))),
    new Promise(r => setTimeout(r, 3000)),
  ]));
}

// Eine Sprache auf einem Gerät prüfen
async function pruefeSeite(browser, lang, geraet, opt, melde) {
  const wo = `${lang} ${geraet}`;
  const ctx = await browser.newContext({...opt});
  await ctx.route(/^(https?|wss?|ftp):/, r => { melde(wo, 'Anfrage ins Internet: ' + r.request().url()); r.abort(); });
  const p = await ctx.newPage();
  p.on('pageerror', e => melde(wo, 'JavaScript-Fehler: ' + e.message));
  await p.goto(URL + '?lang=' + lang);
  await p.waitForTimeout(300);

  const htmlLang = await p.evaluate(() => document.documentElement.lang);
  if (htmlLang !== lang) melde(wo, `Seite meldet Sprache „${htmlLang}“`);
  if (await p.$('#nojs')) melde(wo, 'Hinweis #nojs wurde nicht entfernt');

  if (geraet === 'Desktop' && lang === SPRACHEN[0]) {
    const {sprachen, errs} = await p.evaluate(pruefePakete);
    if (sprachen.join() !== ALLE.join()) melde('Sprachpakete', 'vorhanden sind ' + sprachen.join(', '));
    errs.forEach(e => melde('Sprachpakete', e));
  }

  const tippen = geraet !== 'Desktop';
  const breite = await p.evaluate(() => innerWidth);
  const n = await p.$$eval('.step', s => s.length);
  if (n < 1) melde(wo, 'keine Stationen gefunden');
  for (let i = 0; i < n; i++) {
    const st = `Station ${i + 1}`;
    await zuStation(p, i, tippen);
    if (geraet === 'Desktop') await bediene(p);
    await zuStation(p, i, tippen);

    const sw = await p.evaluate(() => document.documentElement.scrollWidth);
    if (sw > breite + 1) melde(`${wo} ${st}`, `läuft horizontal über (${sw} px statt ${breite} px)`);

    if (geraet.startsWith('iPad')) {
      const klein = await p.$$eval('button, input, select, [role=button]', (els, erlaubt) => els
        .filter(e => e.offsetParent && !e.matches(erlaubt) && e.type !== 'hidden')
        .map(e => [e, e.getBoundingClientRect()])
        .filter(([, r]) => r.width > 0 && r.height < 44)
        .map(([e, r]) => `${e.tagName.toLowerCase()}${e.id ? '#' + e.id : ''}${e.className ? '.' + String(e.className).trim().split(/\s+/).join('.') : ''} (${Math.round(r.height)} px)`), KLEIN_ERLAUBT);
      [...new Set(klein)].forEach(k => melde(`${wo} ${st}`, 'Tippfläche niedriger als 44 px: ' + k));
    }

    if (lang !== 'de' && geraet === 'Desktop') {
      const text = await p.evaluate(() => document.body.innerText);
      for (const zeile of text.split('\n')) {
        const m = zeile.match(DEUTSCH);
        if (m) melde(`${wo} ${st}`, `deutscher Textrest? „${m[0]}“ in „${zeile.trim().slice(0, 80)}“`);
      }
    }
  }
  await ctx.close();
}

// Hinweis für Vorschaufenster ohne JavaScript prüfen
async function pruefeOhneJs(browser, geraet, opt, melde) {
  const wo = `ohne JavaScript ${geraet}`;
  const ctx = await browser.newContext({...opt, javaScriptEnabled: false});
  await ctx.route(/^(https?|wss?|ftp):/, r => { melde(wo, 'Anfrage ins Internet: ' + r.request().url()); r.abort(); });
  const p = await ctx.newPage();
  await p.goto(URL);
  const r = await p.evaluate(() => {
    const n = document.getElementById('nojs'), w = document.querySelector('.wrap');
    return {
      hinweis: !!n && getComputedStyle(n).display !== 'none' && n.getBoundingClientRect().height > 0,
      seite: !!w && getComputedStyle(w).display !== 'none',
      sw: document.documentElement.scrollWidth, b: innerWidth,
    };
  });
  if (!r.hinweis) melde(wo, 'Hinweis #nojs ist nicht sichtbar');
  if (r.seite) melde(wo, 'die eigentliche Seite ist nicht ausgeblendet');
  if (r.sw > r.b + 1) melde(wo, `läuft horizontal über (${r.sw} px statt ${r.b} px)`);
  await ctx.close();
}

// ---------- KI unter der Haube ----------

// Sprachpakete HAUBE_LANG gegeneinander prüfen (läuft in der Seite). Listen, deren Länge je Sprache abweichen darf:
// Tokenizer-Regeln, Satzpaare, Tokens und Gewichte im Aufmerksamkeits-Labor.
function pruefeHaubePakete() {
  const errs = [], ref = HAUBE_LANG.de;
  const frei = /(^|\.)(rules|rulesOther|splits|suffix)(\.|$)|variants\.\d+\.(toks|focus|note)/;
  function form(a, b, pfad, l) {
    if (frei.test(pfad)) return;
    if (typeof a !== typeof b) { errs.push(`${l}: ${pfad}: Typ ${typeof b} statt ${typeof a}`); return; }
    if (Array.isArray(a)) {
      if (!Array.isArray(b)) { errs.push(`${l}: ${pfad}: keine Liste`); return; }
      if (a.length !== b.length) errs.push(`${l}: ${pfad}: Länge ${b.length} statt ${a.length}`);
      a.forEach((x, i) => { if (b[i] !== undefined && typeof x === 'object' && x) form(x, b[i], pfad + '.' + i, l); });
      return;
    }
    if (a && typeof a === 'object') {
      for (const k of Object.keys(a)) { if (!(k in b)) errs.push(`${l}: ${pfad ? pfad + '.' : ''}${k} fehlt`); else form(a[k], b[k], pfad ? pfad + '.' + k : k, l); }
      for (const k of Object.keys(b)) if (!(k in a)) errs.push(`${l}: ${pfad ? pfad + '.' : ''}${k} zusätzlich`);
    }
  }
  for (const [l, L] of Object.entries(HAUBE_LANG)) {
    if (l !== 'de') form(ref, L, '', l);
    // Stationen gleich aufgebaut (gleiche id, gleiche Art von Labor), Wahrscheinlichkeiten ergeben 100 %
    L.stations.forEach((s, i) => {
      if (ref.stations[i] && (s.id !== ref.stations[i].id || s.lab.type !== ref.stations[i].lab.type)) errs.push(`${l}: Station ${i + 1} weicht ab (${s.id})`);
      if (s.lab.type === 'confidence') s.lab.prompts.forEach((p, k) => { const sum = p.opts.reduce((a, o) => a + o[1], 0); if (Math.abs(sum - 1) > .011) errs.push(`${l}: ${s.id} Frage ${k + 1}: Summe ${sum}`); });
      if (s.lab.type === 'bias') s.lab.prompts.forEach((p, k) => [1, 2].forEach(j => { const sum = p.names.reduce((a, n) => a + n[j], 0); if (Math.abs(sum - 1) > .011) errs.push(`${l}: ${s.id} Satz ${k + 1}: Summe ${sum}`); }));
      // Wortkarte: Jedes Rätsel (A − B + C) muss genau auf einem Wort der Karte landen
      if (s.lab.type === 'map') for (const r of s.lab.riddles || []) {
        const g = w => s.lab.words.find(x => x[0] === w), [A, B, C] = r.calc.map(g);
        if (!A || !B || !C) { errs.push(`${l}: Wortkarte: ${r.calc.filter(w => !g(w)).join(', ')} fehlt auf der Karte`); continue; }
        const x = A[1] - B[1] + C[1], y = A[2] - B[2] + C[2], z = A[3] - B[3] + C[3];
        if (!s.lab.words.some(w => w[1] === x && w[2] === y && !r.calc.includes(w[0]))) errs.push(`${l}: Wortkarte: Rätsel ${r.calc.join(', ')} führt auf (${x} | ${y}), dort liegt kein Wort`);
        // auch in der 3D-Ansicht (dritte Koordinate z) muss das Rätsel genau aufgehen
        if (!s.lab.words.some(w => w[1] === x && w[2] === y && w[3] === z && !r.calc.includes(w[0]))) errs.push(`${l}: Wortkarte 3D: Rätsel ${r.calc.join(', ')} führt auf (${x} | ${y} | ${z}), dort liegt kein Wort`);
      }
      if (s.lab.type === 'attention') s.lab.variants.forEach((v, k) => { if (!(v.start in v.focus)) errs.push(`${l}: Aufmerksamkeit Variante ${k + 1}: Startwort ohne Gewichte`); });
    });
  }
  return {sprachen: Object.keys(HAUBE_LANG), errs};
}

async function pruefeHaube(browser, lang, geraet, opt, melde) {
  const wo = `Haube ${lang} ${geraet}`;
  const ctx = await browser.newContext({...opt, acceptDownloads: true});
  await ctx.route(/^(https?|wss?|ftp):/, r => { melde(wo, 'Anfrage ins Internet: ' + r.request().url()); r.abort(); });
  const p = await ctx.newPage();
  p.on('pageerror', e => melde(wo, 'JavaScript-Fehler: ' + e.message));
  await p.goto(HAUBE_URL + '?lang=' + lang);
  await p.addStyleTag({content: 'html{scroll-behavior:auto!important}'});
  await p.waitForTimeout(300);
  const htmlLang = await p.evaluate(() => document.documentElement.lang);
  if (htmlLang !== lang) { melde(wo, `Sprache ${lang} fehlt (Seite zeigt „${htmlLang}“)`); await ctx.close(); return; }
  if (await p.$('#nojs')) melde(wo, 'Hinweis #nojs wurde nicht entfernt');
  if (geraet === 'Desktop' && lang === SPRACHEN[0]) {
    const {sprachen, errs} = await p.evaluate(pruefeHaubePakete);
    if (sprachen.join() !== ALLE.join()) melde('Haube Sprachpakete', 'vorhanden sind nur ' + sprachen.join(', '));
    errs.forEach(e => melde('Haube Sprachpakete', e));
  }
  // Die Seite hat mehrere Ansichten in einer Datei: Übersicht, je Station eine eigene Ansicht, Abschluss (Quiz und PDF).
  // Jede Ansicht wird über ihre Adresse (#id) aufgerufen und geprüft.
  const karten = await p.$$eval('.card', c => c.length);
  if (karten < 14) melde(wo, `Übersicht zeigt nur ${karten} Karten`);
  const ansichten = ['', ...await p.evaluate(() => HAUBE_LANG.de.stations.map(s => s.id)), 'abschluss'];
  for (const v of ansichten) {
    const wo2 = `${wo} ${v ? '#' + v : 'Übersicht'}`;
    if (v) {
      await p.evaluate(v => { location.hash = v; }, v);
      try { await p.waitForFunction(v => !!document.querySelector(v === 'abschluss' ? '#quiz' : '#' + v), v, {timeout: 5000}); }
      catch (e) { melde(wo2, 'Ansicht erscheint nicht'); continue; }
    }
    // Alle Regler bewegen, Text eingeben und jeden Knopf in Labor und Quiz einmal drücken
    await p.evaluate(() => {
      for (const r of document.querySelectorAll('.lab input[type=range]')) { r.value = r.min; r.dispatchEvent(new Event('input')); }
      for (const t of document.querySelectorAll('.lab textarea')) { t.value = 'Hallo 123'; t.dispatchEvent(new Event('input')); }
    });
    const anzahl = await p.$$eval('.lab button, .quiz button', b => b.length);
    for (let i = 0; i < anzahl; i++) await p.evaluate(i => { const b = [...document.querySelectorAll('.lab button, .quiz button')][i]; if (b && !b.disabled && !b.hidden) b.click(); }, i);
    await p.evaluate(() => document.querySelectorAll('details.hood').forEach(d => d.open = true));
    await p.waitForTimeout(250);
    const breite = await p.evaluate(() => [document.documentElement.scrollWidth, innerWidth]);
    if (breite[0] > breite[1] + 1) melde(wo2, `läuft horizontal über (${breite[0]} px statt ${breite[1]} px)`);
    if (geraet.startsWith('iPad')) {
      const klein = await p.$$eval('button, a, input, select, summary, textarea', els => els
        .filter(e => e.offsetParent && !e.matches('.mw') && !e.closest('p, footer, li, dd'))
        .map(e => [e, e.getBoundingClientRect()]).filter(([, r]) => r.width > 0 && r.height < 44)
        .map(([e, r]) => `${e.tagName.toLowerCase()}${e.id ? '#' + e.id : ''}.${String(e.className).trim().split(/\s+/).join('.')} (${Math.round(r.height)} px)`));
      [...new Set(klein)].forEach(k => melde(wo2, 'Tippfläche niedriger als 44 px: ' + k));
      // Wörter auf der Wortkarte dürfen sich nicht überlappen und nicht über den Rand ragen (dafür die 2D-Ansicht zeigen)
      await p.evaluate(() => { const t = document.querySelector('.lab [id$="-3d"][aria-pressed="true"]'); if (t) t.click(); });
      const lap = await p.$$eval('.map .mw', bs => { if (!bs.length) return []; const M = bs[0].closest('.map').getBoundingClientRect(), r = bs.map(b => [b.textContent, b.getBoundingClientRect()]), o = [];
        r.forEach(([w, a], i) => { if (a.left < M.left || a.right > M.right) o.push('Rand ' + w); r.slice(i + 1).forEach(([v, c]) => { if (a.left < c.right - 2 && c.left < a.right - 2 && a.top < c.bottom - 2 && c.top < a.bottom - 2) o.push(w + '/' + v); }); }); return o; });
      lap.forEach(x => melde(wo2, 'Wortkarte überlappt: ' + x));
    }
    if (lang !== 'de' && geraet === 'Desktop') {
      const text = await p.evaluate(() => { const c = document.querySelector('#app').cloneNode(true); c.querySelectorAll('.pair, footer, .langbar').forEach(e => e.remove()); return c.innerText; });
      for (const zeile of text.split('\n')) { const m = zeile.match(DEUTSCH); if (m) melde(wo2, `deutscher Textrest? „${m[0]}“ in „${zeile.trim().slice(0, 80)}“`); }
    }
    if (v === 'abschluss' && geraet === 'Desktop') {
      // Spickzettel als PDF: Datei entsteht, beginnt mit %PDF, eine Seite
      const [dl] = await Promise.all([p.waitForEvent('download', {timeout: 10000}), p.click('#pdf')]);
      const pfad = path.join(os.tmpdir(), `haube-${lang}-${process.pid}.pdf`); await dl.saveAs(pfad);
      const pdf = fs.readFileSync(pfad, 'latin1'); fs.unlinkSync(pfad);
      if (!pdf.startsWith('%PDF-') || !pdf.includes('%%EOF')) melde(wo2, 'Spickzettel-PDF ist kaputt');
      if ((pdf.match(/\/Type \/Page\b/g) || []).length !== 1) melde(wo2, 'Spickzettel-PDF hat nicht genau eine Seite');
    }
  }
  await ctx.close();
}

async function pruefeHaubeOhneJs(browser, geraet, opt, melde) {
  const wo = `Haube ohne JavaScript ${geraet}`;
  const ctx = await browser.newContext({...opt, javaScriptEnabled: false});
  await ctx.route(/^(https?|wss?|ftp):/, r => { melde(wo, 'Anfrage ins Internet: ' + r.request().url()); r.abort(); });
  const p = await ctx.newPage(); await p.goto(HAUBE_URL);
  const r = await p.evaluate(() => { const n = document.getElementById('nojs'), a = document.getElementById('app');
    return {hinweis: !!n && getComputedStyle(n).display !== 'none', seite: !!a && getComputedStyle(a).display !== 'none', sw: document.documentElement.scrollWidth, b: innerWidth}; });
  if (!r.hinweis) melde(wo, 'Hinweis #nojs ist nicht sichtbar');
  if (r.seite) melde(wo, 'die eigentliche Seite ist nicht ausgeblendet');
  if (r.sw > r.b + 1) melde(wo, `läuft horizontal über (${r.sw} px statt ${r.b} px)`);
  await ctx.close();
}

// Startseite (index.html): beide Seiten verlinkt, Sprachpakete vollständig, kein Überlauf, keine Anfragen ins Internet
async function pruefeStart(browser, lang, geraet, opt, melde) {
  const wo = `Startseite ${lang} ${geraet}`;
  const ctx = await browser.newContext({...opt});
  await ctx.route(/^(https?|wss?|ftp):/, r => { melde(wo, 'Anfrage ins Internet: ' + r.request().url()); r.abort(); });
  const p = await ctx.newPage();
  p.on('pageerror', e => melde(wo, 'JavaScript-Fehler: ' + e.message));
  await p.goto('file://' + START + '?lang=' + lang);
  await p.waitForTimeout(200);
  const r = await p.evaluate(() => {
    const ref = Object.keys(INDEX_LANG.de).sort().join();
    return {lang: document.documentElement.lang, sw: document.documentElement.scrollWidth, b: innerWidth,
      pakete: Object.entries(INDEX_LANG).filter(([, L]) => Object.keys(L).sort().join() !== ref).map(([l]) => l),
      ziele: [...document.querySelectorAll('a.go')].map(a => a.getAttribute('href')).filter(h => !/^https?:/.test(h)),
      text: [...document.querySelectorAll('[data-k]')].map(e => e.textContent).join(' ')};
  });
  if (r.lang !== lang) melde(wo, `Seite meldet Sprache „${r.lang}“`);
  if (r.pakete.length) melde(wo, 'Sprachpakete mit anderen Schlüsseln als Deutsch: ' + r.pakete.join(', '));
  if (r.sw > r.b + 1) melde(wo, `läuft horizontal über (${r.sw} px statt ${r.b} px)`);
  for (const h of ['turi-explains-ai.html', 'ai-under-the-hood.html'])
    if (!r.ziele.includes(h + '?lang=' + lang)) melde(wo, `kein Link auf ${h}?lang=${lang}`);
  for (const h of r.ziele) if (!fs.existsSync(path.resolve(path.dirname(START), h.split('?')[0]))) melde(wo, 'Link auf fehlende Datei: ' + h);
  if (lang !== 'de') { const m = r.text.match(DEUTSCH); if (m) melde(wo, `deutscher Textrest „${m[0]}“`); }
  if (geraet.startsWith('iPad')) {
    const klein = await p.$$eval('button, a', els => els.filter(e => e.offsetParent && !e.closest('p, footer, li'))
      .map(e => [e, e.getBoundingClientRect()]).filter(([, b]) => b.width > 0 && b.height < 44)
      .map(([e, b]) => `${e.tagName.toLowerCase()} „${e.textContent.trim()}“ (${Math.round(b.height)} px)`));
    [...new Set(klein)].forEach(k => melde(wo, 'Tippfläche niedriger als 44 px: ' + k));
  }
  await ctx.close();
}

// Startseite ohne JavaScript: Der deutsche Text steht fest im HTML, die Links funktionieren auch so
async function pruefeStartOhneJs(browser, geraet, opt, melde) {
  const wo = `Startseite ohne JavaScript ${geraet}`;
  const ctx = await browser.newContext({...opt, javaScriptEnabled: false});
  await ctx.route(/^(https?|wss?|ftp):/, r => { melde(wo, 'Anfrage ins Internet: ' + r.request().url()); r.abort(); });
  const p = await ctx.newPage(); await p.goto('file://' + START);
  const r = await p.evaluate(() => ({links: document.querySelectorAll('a.go[href$=".html"]').length, h1: document.querySelector('h1')?.textContent || '',
    sw: document.documentElement.scrollWidth, b: innerWidth}));
  if (r.links < 2) melde(wo, 'Links auf die beiden Seiten fehlen');
  if (!r.h1.trim()) melde(wo, 'Überschrift fehlt');
  if (r.sw > r.b + 1) melde(wo, `läuft horizontal über (${r.sw} px statt ${r.b} px)`);
  await ctx.close();
}

(async () => {
  const browser = await chromium.launch();

  // Alle Prüfungen laufen gleichzeitig in mehreren Browser-Fenstern (so viele wie Prozessorkerne,
  // änderbar mit TURI_PARALLEL). Jede Prüfung sammelt ihre Probleme getrennt; ausgegeben wird in fester Reihenfolge.
  const turi = SEITEN.includes('turi'), haube = SEITEN.includes('haube') && fs.existsSync(HAUBE), start = SEITEN.includes('start') && fs.existsSync(START);
  const auftraege = [
    ...(turi ? SPRACHEN.flatMap(lang => GERAETE.map(([geraet, opt]) => ({name: `${lang} ${geraet}`, schwer: geraet === 'Desktop', los: melde => pruefeSeite(browser, lang, geraet, opt, melde)}))) : []),
    ...(turi ? GERAETE.map(([geraet, opt]) => ({name: `ohne JavaScript ${geraet}`, schwer: false, los: melde => pruefeOhneJs(browser, geraet, opt, melde)})) : []),
    ...(haube ? SPRACHEN.flatMap(lang => GERAETE.map(([geraet, opt]) => ({name: `Haube ${lang} ${geraet}`, schwer: geraet === 'Desktop', los: melde => pruefeHaube(browser, lang, geraet, opt, melde)}))) : []),
    ...(haube ? GERAETE.map(([geraet, opt]) => ({name: `Haube ohne JavaScript ${geraet}`, schwer: false, los: melde => pruefeHaubeOhneJs(browser, geraet, opt, melde)})) : []),
    ...(start ? SPRACHEN.flatMap(lang => GERAETE.map(([geraet, opt]) => ({name: `Startseite ${lang} ${geraet}`, schwer: false, los: melde => pruefeStart(browser, lang, geraet, opt, melde)}))) : []),
    ...(start ? GERAETE.map(([geraet, opt]) => ({name: `Startseite ohne JavaScript ${geraet}`, schwer: false, los: melde => pruefeStartOhneJs(browser, geraet, opt, melde)})) : []),
  ];
  const ergebnisse = auftraege.map(() => []);
  // Die aufwendigen Desktop-Prüfungen (alle Knöpfe bedienen) zuerst starten, damit am Ende keine allein übrig bleibt
  const reihenfolge = auftraege.map((a, i) => i).sort((a, b) => auftraege[b].schwer - auftraege[a].schwer);
  const parallel = Math.max(1, Number(process.env.TURI_PARALLEL) || os.cpus().length);
  let naechster = 0;
  await Promise.all(Array.from({length: Math.min(parallel, auftraege.length)}, async () => {
    while (naechster < reihenfolge.length) {
      const i = reihenfolge[naechster++];
      const melde = (wo, was) => ergebnisse[i].push(`${wo}: ${was}`);
      // Bleibt eine Prüfung hängen, wird das gemeldet und die anderen laufen weiter
      try { await auftraege[i].los(melde); } catch (e) { melde(auftraege[i].name, 'Prüfung abgebrochen: ' + String(e.message).split('\n')[0]); }
    }
  }));
  await browser.close();
  const probleme = ergebnisse.flat();

  const ergebnis = probleme.length
    ? `❌ ${probleme.length} Problem(e) gefunden:\n\n` + probleme.map(x => '- ' + x).join('\n')
    : `✅ Alles in Ordnung: ${[turi && '„Turi erklärt KI“', haube && '„KI unter der Haube“', start && 'die Startseite'].filter(Boolean).join(', ')} in ${SPRACHEN.length} Sprachen auf ${GERAETE.length} Geräten, alle Stationen, ohne JavaScript-Fehler, ohne Anfragen ins Internet, ohne Überlauf; Hinweis ohne JavaScript sichtbar.`;
  console.log(ergebnis);
  if (process.env.GITHUB_STEP_SUMMARY) fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, '## Prüfung der Lernseiten\n\n' + ergebnis + '\n');
  process.exit(probleme.length ? 1 : 0);
})().catch(e => { console.error('Die Prüfung ist abgebrochen:', e); process.exit(1); });
