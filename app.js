/* SMJ 3D — visionneuse des assemblages SMJ (codes QR des plans, fichiers de job .smj3d).
   Aucune bibliothèque externe, aucun compte, rien envoyé sur Internet : tout reste sur le téléphone. */
"use strict";
const VERSION_APP = "1.0.3";

/* ================================================================ langues */
const TXT = {
  fr: {
    reglages: "Réglages", scanner: "Scanner un code QR", ouvrirFichier: "Ouvrir un fichier de job (.smj3d)",
    mesJobs: "Mes jobs", terminees: "Terminées",
    vide: "Aucune job pour l'instant. Scannez le code QR d'un plan d'assemblage SMJ.",
    viser: "Visez le code QR du plan", photo: "Prendre une photo", annuler: "Annuler",
    dansLaJob: "Dans la job", numeros: "Numéros", mesurer: "Mesurer", recentrer: "Recentrer",
    autoSuppr: "Supprimer du téléphone les jobs pas ouvertes depuis (jours)", jamais: "Jamais",
    unites: "Mesures", imperial: "mm + pieds-pouces",
    noteTerminees: "Une job marquée « Terminée » est supprimée du téléphone 7 jours plus tard.",
    notePrive: "SMJ 3D ne demande aucun compte et n'envoie rien sur Internet : les jobs restent sur ce téléphone.",
    aideTourner: "1 doigt : tourner · 2 doigts : zoomer et déplacer", aideMesurer: "Mesurer : touchez 2 points", angle: "Angle", aideAngle: "Angle : touchez 3 points, le 2e est le sommet",
    sommet: "Touchez le sommet de l'angle (2e point).", troisieme: "Touchez le 3e point.", pente: "pente", complement: "complément", pentePiece: "Pente de la pièce",
    jobComplete: "Job complète", assemblage: "Assemblage", toute: "Toute la job", pieces: "pièces",
    fois: "fois", ouvrir: "Ouvrir", terminee: "Terminée", reprendre: "Remettre en cours", supprimer: "Supprimer",
    confirmeSuppr: "Supprimer cette job du téléphone ?", ajoutee: "Ajoutée", vue: "Ouverte",
    pasCode: "Ce code ou ce fichier n'est pas un 3D SMJ.",
    pasCamera: "La caméra n'est pas disponible. Essayez « Prendre une photo ».",
    pasLecteur: "Ce téléphone ne sait pas lire les codes QR dans l'application. Mettez à jour Chrome et les services Google Play.",
    rienTrouve: "Aucun code QR SMJ trouvé sur la photo.",
    deuxiemePoint: "Touchez le 2e point (il s'accroche aux coins des pièces).",
    copies: n => `Cet assemblage est fait ${n} fois : les ${n} endroits sont en rouge dans la petite fenêtre.`,
    sansJob: "Petite fenêtre : la job en traits. Ouvrez le fichier de la job pour la voir au complet.",
    horiz: "horiz.", vert: "vert.", piece: "Pièce", sansTitre: "Sans titre", jobFichier: "fichier de job",
    suppAuto: n => `${n} job(s) supprimée(s) du téléphone (pas ouvertes depuis longtemps ou terminées).`,
    version: "Version", codesAsm: "assemblage(s)",
    telechargement: "Téléchargement de la job…", pasInternet: "Pas d'Internet : la job complète se télécharge une seule fois, ensuite elle reste sur le téléphone.", lienBrise: "Cette job n'est pas (ou plus) en ligne."
  },
  en: {
    reglages: "Settings", scanner: "Scan a QR code", ouvrirFichier: "Open a job file (.smj3d)",
    mesJobs: "My jobs", terminees: "Completed",
    vide: "No jobs yet. Scan the QR code of an SMJ assembly drawing.",
    viser: "Aim at the drawing's QR code", photo: "Take a photo", annuler: "Cancel",
    dansLaJob: "In the job", numeros: "Numbers", mesurer: "Measure", recentrer: "Recenter",
    autoSuppr: "Remove jobs from the phone when not opened for (days)", jamais: "Never",
    unites: "Measurements", imperial: "mm + feet-inches",
    noteTerminees: "A job marked “Completed” is removed from the phone 7 days later.",
    notePrive: "SMJ 3D needs no account and sends nothing over the Internet: jobs stay on this phone.",
    aideTourner: "1 finger: rotate · 2 fingers: zoom and pan", aideMesurer: "Measure: tap 2 points", angle: "Angle", aideAngle: "Angle: tap 3 points, the 2nd is the vertex",
    sommet: "Tap the vertex of the angle (2nd point).", troisieme: "Tap the 3rd point.", pente: "slope", complement: "complement", pentePiece: "Part slope",
    jobComplete: "Complete job", assemblage: "Assembly", toute: "Whole job", pieces: "parts",
    fois: "times", ouvrir: "Open", terminee: "Completed", reprendre: "Back in progress", supprimer: "Delete",
    confirmeSuppr: "Delete this job from the phone?", ajoutee: "Added", vue: "Opened",
    pasCode: "This code or file is not an SMJ 3D.",
    pasCamera: "The camera is not available. Try “Take a photo”.",
    pasLecteur: "This phone cannot read QR codes in the app. Update Chrome and Google Play services.",
    rienTrouve: "No SMJ QR code found in the photo.",
    deuxiemePoint: "Tap the 2nd point (it snaps to part corners).",
    copies: n => `This assembly is made ${n} times: the ${n} locations are red in the small window.`,
    sansJob: "Small window: the job as lines. Open the job file to see all of it.",
    horiz: "horiz.", vert: "vert.", piece: "Part", sansTitre: "Untitled", jobFichier: "job file",
    suppAuto: n => `${n} job(s) removed from the phone (not opened for a long time or completed).`,
    version: "Version", codesAsm: "assembly(ies)",
    telechargement: "Downloading the job…", pasInternet: "No Internet: the complete job downloads once, then it stays on the phone.", lienBrise: "This job is not (or no longer) online."
  }
};
const reglage = (k, d) => { try { const v = localStorage.getItem("smj3d." + k); return v === null ? d : v; } catch (e) { return d; } };
const garder = (k, v) => { try { localStorage.setItem("smj3d." + k, v); } catch (e) { /* rien */ } };
let LANGUE = reglage("langue", (navigator.language || "fr").toLowerCase().startsWith("fr") ? "fr" : "en");
const t = k => TXT[LANGUE][k];
const $ = id => document.getElementById(id);
function traduire(){
  document.documentElement.lang = LANGUE;
  document.querySelectorAll("[data-t]").forEach(e => { const v = t(e.dataset.t); if (typeof v === "string") e.textContent = v; });
  $("bLangue").textContent = LANGUE === "fr" ? "EN" : "FR";
  $("version").textContent = t("version") + " " + VERSION_APP;
}
function toast(m, ms){
  const e = $("toast"); e.textContent = m; e.hidden = false;
  clearTimeout(toast.h); toast.h = setTimeout(() => { e.hidden = true; }, ms || 3500);
}

/* ================================================================ lecture d'un code : SMJ1.<base64url(deflate brut(JSON))> */
async function lire(texte){
  const m = String(texte).match(/SMJ1\.([A-Za-z0-9_-]+)/);
  if (!m) throw new Error("pas SMJ");
  const b = m[1].replace(/-/g, "+").replace(/_/g, "/");
  const bin = atob(b + "===".slice((b.length + 3) % 4));
  const u = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) u[i] = bin.charCodeAt(i);
  const flux = new Blob([u]).stream().pipeThrough(new DecompressionStream("deflate-raw"));
  const J = JSON.parse(await new Response(flux).text());
  if (!J || !J.I || !J.F || !J.S) throw new Error("mauvais contenu");
  J.code = "SMJ1." + m[1];
  return J;
}

/* ================================================================ mémoire du téléphone (IndexedDB) */
const BD = {
  _db: null,
  ouvrir(){
    if (this._db) return Promise.resolve(this._db);
    return new Promise((ok, ko) => {
      const r = indexedDB.open("smj3d", 1);
      r.onupgradeneeded = () => r.result.createObjectStore("jobs", {keyPath: "id"});
      r.onsuccess = () => { this._db = r.result; ok(r.result); };
      r.onerror = () => ko(r.error);
    });
  },
  async tx(mode, f){
    const db = await this.ouvrir();
    return new Promise((ok, ko) => {
      const x = db.transaction("jobs", mode), s = x.objectStore("jobs");
      let res; const r = f(s); if (r) r.onsuccess = () => { res = r.result; };
      x.oncomplete = () => ok(res); x.onerror = () => ko(x.error);
    });
  },
  tous(){ return this.tx("readonly", s => s.getAll()); },
  get(id){ return this.tx("readonly", s => s.get(id)); },
  put(o){ return this.tx("readwrite", s => s.put(o)); },
  del(id){ return this.tx("readwrite", s => s.delete(id)); }
};
async function enregistrer(J){
  const id = J.t || t("sansTitre");
  const o = (await BD.get(id)) || {id, titre: id, job: null, asm: {}, ajoute: Date.now(), vu: Date.now(), finie: null};
  if (J.a) o.asm[J.a] = J.code; else o.job = J.code;
  o.vu = Date.now();
  await BD.put(o);
  return o;
}
async function menage(){
  const jours = +reglage("auto", "0"), now = Date.now(), J = 864e5;
  let n = 0;
  for (const o of await BD.tous()){
    if ((o.finie && now - o.finie > 7 * J) || (jours > 0 && now - o.vu > jours * J)){ await BD.del(o.id); n++; }
  }
  if (n) toast(t("suppAuto")(n), 5000);
}

/* ================================================================ écrans + bouton retour d'Android */
const ECRANS = ["ecranJobs", "ecranScan", "ecranVue", "ecranReglages"];
function montrer(id, histo){
  ECRANS.forEach(e => { $(e).hidden = e !== id; });
  if (id !== "ecranScan") arreterScan();
  if (id === "ecranJobs") afficherJobs();
  if (id === "ecranVue") { taille(); dessiner(); }
  if (histo && id !== "ecranJobs") history.pushState({e: id}, "");
}
window.addEventListener("popstate", () => montrer("ecranJobs"));

/* ================================================================ liste « Mes jobs » */
function fmtDate(ts){ try { return new Date(ts).toLocaleDateString(LANGUE === "fr" ? "fr-CA" : "en-CA"); } catch (e) { return ""; } }
const triNat = (a, b) => a.localeCompare(b, "fr", {numeric: true});
async function afficherJobs(){
  let L = [];
  try { L = await BD.tous(); } catch (e) { /* mémoire indisponible */ }
  L.sort((a, b) => b.vu - a.vu);
  const enCours = L.filter(o => !o.finie), finies = L.filter(o => o.finie);
  remplir($("listeJobs"), enCours); remplir($("listeTerminees"), finies);
  $("vide").hidden = L.length > 0; $("hTerminees").hidden = !finies.length;
}
function remplir(box, L){
  box.textContent = "";
  for (const o of L){
    const c = document.createElement("div"); c.className = "carteJob" + (o.finie ? " finie" : "");
    const h = document.createElement("div"); h.className = "haut";
    const tt = document.createElement("div"); tt.className = "t"; tt.textContent = o.titre;
    const s = document.createElement("div"); s.className = "s";
    const na = Object.keys(o.asm).length;
    s.textContent = (o.job ? t("jobComplete") + " · " : "") + (na ? na + " " + t("codesAsm") + " · " : "") + t("vue") + " " + fmtDate(o.vu);
    tt.append(s); h.append(tt);
    h.onclick = () => o.job ? ouvrirStocke(o, null) : ouvrirStocke(o, Object.keys(o.asm).sort(triNat)[0]);
    const a = document.createElement("div"); a.className = "asms";
    if (o.job){ const p = document.createElement("button"); p.type = "button"; p.className = "puce job"; p.textContent = t("jobComplete"); p.onclick = () => ouvrirStocke(o, null); a.append(p); }
    for (const n of Object.keys(o.asm).sort(triNat)){
      const p = document.createElement("button"); p.type = "button"; p.className = "puce"; p.textContent = n;
      p.onclick = () => ouvrirStocke(o, n); a.append(p);
    }
    const b = document.createElement("div"); b.className = "bas";
    const b1 = document.createElement("button"); b1.type = "button"; b1.textContent = o.finie ? t("reprendre") : t("terminee");
    b1.onclick = async () => { o.finie = o.finie ? null : Date.now(); o.vu = Date.now(); await BD.put(o); afficherJobs(); };
    const b2 = document.createElement("button"); b2.type = "button"; b2.textContent = t("supprimer");
    b2.onclick = async () => { if (confirm(t("confirmeSuppr") + "\n\n" + o.titre)){ await BD.del(o.id); afficherJobs(); } };
    b.append(b1, b2);
    c.append(h, a, b); box.append(c);
  }
}
async function ouvrirStocke(o, asm){
  try {
    o.vu = Date.now(); BD.put(o);
    const JOBo = o.job ? await lire(o.job) : null;
    if (asm && o.asm[asm]) await afficher(await lire(o.asm[asm]), JOBo);
    else if (JOBo) await afficher(JOBo, JOBo, asm || "");
  } catch (e) { toast(t("pasCode")); }
}
/* LIEN DE JOB (prototype 2026-11-26) : le code QR contient https://smj-app.github.io/#j=<id>.<clé>.
   Le fichier j/<id> sur le site est chiffré ; la clé est après le #, elle n'est jamais envoyée sur Internet. */
async function telechargerJob(id, cle64){
  const b = cle64.replace(/-/g, "+").replace(/_/g, "/"), kb = Uint8Array.from(atob(b + "===".slice((b.length + 3) % 4)), c => c.charCodeAt(0));
  const r = await fetch("j/" + id, {cache: "no-store"});
  if (!r.ok) throw new Error("introuvable");
  const tout = new Uint8Array(await r.arrayBuffer()), ct = tout.slice(0, -16), tag = tout.slice(-16);
  const k = await crypto.subtle.importKey("raw", kb, {name: "HMAC", hash: "SHA-256"}, false, ["sign"]);
  const te = new TextEncoder(), avec = (p, d) => { const o = new Uint8Array(p.length + d.length); o.set(p); o.set(d, p.length); return o; };
  const t2 = new Uint8Array(await crypto.subtle.sign("HMAC", k, avec(te.encode("smj-tag"), ct)));
  for (let i = 0; i < 16; i++) if (t2[i] !== tag[i]) throw new Error("mauvaise clé");
  const nb = Math.ceil(ct.length / 32), blocs = [];
  for (let i = 0; i < nb; i++){ const c = new Uint8Array(8); new DataView(c.buffer).setUint32(4, i); blocs.push(crypto.subtle.sign("HMAC", k, avec(te.encode("smj-flux"), c))); }
  const fl = await Promise.all(blocs), pt = new Uint8Array(ct.length);
  for (let i = 0; i < ct.length; i++) pt[i] = ct[i] ^ new Uint8Array(fl[i >> 5])[i & 31];
  let bin = ""; for (let i = 0; i < pt.length; i += 8192) bin += String.fromCharCode.apply(null, pt.subarray(i, i + 8192));
  return "SMJ1." + btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
async function ouvrirTexte(texte){
  const lien = String(texte).match(/[#&]j=([0-9a-f]{8,32})\.([A-Za-z0-9_-]{16,})/);
  if (lien){
    toast(t("telechargement"), 4000);
    try { texte = await telechargerJob(lien[1], lien[2]); $("toast").hidden = true; }
    catch (e) { toast(t(navigator.onLine === false ? "pasInternet" : "lienBrise"), 6000); return false; }
  }
  let J;
  try { J = await lire(texte); } catch (e) { toast(t("pasCode")); return false; }
  let o = null;
  try { o = await enregistrer(J); } catch (e) { /* mémoire pleine : on montre quand même */ }
  let JOBo = J.a ? null : J;
  if (J.a && o && o.job){ try { JOBo = await lire(o.job); } catch (e) { JOBo = null; } }
  await afficher(J, JOBo);
  return true;
}

/* ================================================================ scanner (caméra) */
let flux = null, detecteur = null, boucleScan = 0;
async function lecteur(){
  if (detecteur) return detecteur;
  if (!("BarcodeDetector" in window)) return null;
  try {
    const f = await BarcodeDetector.getSupportedFormats();
    if (!f.includes("qr_code")) return null;
  } catch (e) { /* certains navigateurs n'ont pas getSupportedFormats */ }
  detecteur = new BarcodeDetector({formats: ["qr_code"]});
  return detecteur;
}
async function scanner(){
  montrer("ecranScan", true);
  $("scanMsg").textContent = t("viser");
  const d = await lecteur();
  if (!d){ $("scanMsg").textContent = t("pasLecteur"); return; }
  try {
    flux = await navigator.mediaDevices.getUserMedia({video: {facingMode: {ideal: "environment"}, width: {ideal: 1920}, height: {ideal: 1080}}, audio: false});
  } catch (e) { $("scanMsg").textContent = t("pasCamera"); return; }
  const v = $("video"); v.srcObject = flux; await v.play().catch(() => {});
  const id = ++boucleScan;
  const tour = async () => {
    if (id !== boucleScan || !flux) return;
    try {
      if (v.readyState >= 2){
        const r = await d.detect(v);
        const bon = r.find(x => /SMJ1\.|[#&]j=/.test(x.rawValue || ""));
        if (bon && id === boucleScan){
          if (navigator.vibrate) navigator.vibrate(60);
          arreterScan(); history.replaceState({e: "ecranVue"}, "");
          await ouvrirTexte(bon.rawValue); return;
        }
      }
    } catch (e) { /* image pas prête */ }
    setTimeout(tour, 160);
  };
  tour();
}
function arreterScan(){
  boucleScan++;
  if (flux){ flux.getTracks().forEach(k => k.stop()); flux = null; }
  const v = $("video"); if (v) v.srcObject = null;
}
$("fPhoto").addEventListener("change", async e => {
  const f = e.target.files && e.target.files[0]; e.target.value = ""; if (!f) return;
  const d = await lecteur(); if (!d){ toast(t("pasLecteur")); return; }
  try {
    const im = await createImageBitmap(f);
    const r = await d.detect(im);
    const bon = r.find(x => /SMJ1\.|[#&]j=/.test(x.rawValue || ""));
    if (!bon){ toast(t("rienTrouve")); return; }
    arreterScan(); history.replaceState({e: "ecranVue"}, "");
    await ouvrirTexte(bon.rawValue);
  } catch (err) { toast(t("rienTrouve")); }
});
$("fJob").addEventListener("change", e => {
  const f = e.target.files && e.target.files[0]; e.target.value = ""; if (!f) return;
  const r = new FileReader(); r.onload = () => ouvrirTexte(String(r.result)); r.readAsText(f);
});

/* ================================================================ géométrie : prisme (section x longueur), bouts coupés comme dans SMJ */
function section(s){
  if (s.length === 3){
    const [cx, cy, r] = s.map(v => v / 10), P = [];
    for (let i = 0; i < 16; i++){ const a = i / 16 * Math.PI * 2; P.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]); }
    return P;
  }
  const P = [];
  for (let i = 0; i + 1 < s.length; i += 2) P.push([s[i] / 10, s[i + 1] / 10]);
  return P;
}
function trianguler(P){                     // oreilles (polygone simple, convexe ou non)
  const n = P.length, idx = [...Array(n).keys()], T = [];
  let A = 0; for (let i = 0; i < n; i++){ const a = P[i], b = P[(i + 1) % n]; A += a[0] * b[1] - b[0] * a[1]; }
  const sg = A >= 0 ? 1 : -1;
  const cr = (a, b, c) => (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0]);
  const dans = (p, a, b, c) => sg * cr(a, b, p) > 0 && sg * cr(b, c, p) > 0 && sg * cr(c, a, p) > 0;
  let garde = 0;
  while (idx.length > 3 && garde++ < 5000){
    let fait = false;
    for (let k = 0; k < idx.length; k++){
      const i0 = idx[(k + idx.length - 1) % idx.length], i1 = idx[k], i2 = idx[(k + 1) % idx.length];
      const a = P[i0], b = P[i1], c = P[i2];
      if (sg * cr(a, b, c) <= 1e-9) continue;
      if (idx.some(j => j !== i0 && j !== i1 && j !== i2 && dans(P[j], a, b, c))) continue;
      T.push([i0, i1, i2]); idx.splice(k, 1); fait = true; break;
    }
    if (!fait) break;
  }
  if (idx.length === 3) T.push([idx[0], idx[1], idx[2]]);
  else for (let k = 1; k + 1 < idx.length; k++) T.push([idx[0], idx[k], idx[k + 1]]);
  return T;
}
const cacheTri = new Map();
/* ajoute la pièce « it » (déplacée de dx, moins l'origine O) ; rend ses coins */
function solide(J, it, dx, O, out){
  const f = J.F[it[0]], s = J.S[f[0]], P = section(s), d = f[1];
  const c0 = f[2] ? [f[2][0] / 1e4, f[2][1] / 1e4] : null, c1 = f[3] ? [f[3][0] / 1e4, f[3][1] / 1e4] : null;
  const Z = [it[5], it[6], it[7]], X = [it[8], it[9], it[10]];
  const nz = Math.hypot(...Z) || 1, nx = Math.hypot(...X) || 1;
  for (let i = 0; i < 3; i++){ Z[i] /= nz; X[i] /= nx; }
  const Y = [Z[1] * X[2] - Z[2] * X[1], Z[2] * X[0] - Z[0] * X[2], Z[0] * X[1] - Z[1] * X[0]];
  const ox = it[2] + (dx ? dx[0] : 0) - O[0], oy = it[3] + (dx ? dx[1] : 0) - O[1], oz = it[4] + (dx ? dx[2] : 0) - O[2];
  const W = (x, y, z) => {
    let zz = z;
    if (c0 && d > 0) zz += (1 - z / d) * (c0[0] * x + c0[1] * y);
    if (c1 && d > 0) zz += (z / d) * (c1[0] * x + c1[1] * y);
    return [ox + X[0] * x + Y[0] * y + Z[0] * zz, oy + X[1] * x + Y[1] * y + Z[1] * zz, oz + X[2] * x + Y[2] * y + Z[2] * zz];
  };
  const n = P.length, bas = P.map(p => W(p[0], p[1], 0)), haut = P.map(p => W(p[0], p[1], d));
  const tri = (a, b, c) => {
    const ux = b[0] - a[0], uy = b[1] - a[1], uz = b[2] - a[2], vx = c[0] - a[0], vy = c[1] - a[1], vz = c[2] - a[2];
    let nx_ = uy * vz - uz * vy, ny_ = uz * vx - ux * vz, nz_ = ux * vy - uy * vx;
    const l = Math.hypot(nx_, ny_, nz_) || 1; nx_ /= l; ny_ /= l; nz_ /= l;
    out.p.push(a[0], a[1], a[2], b[0], b[1], b[2], c[0], c[1], c[2]);
    out.n.push(nx_, ny_, nz_, nx_, ny_, nz_, nx_, ny_, nz_);
    if (out.id) out.id.push(out.k[0], out.k[1], out.k[2], out.k[0], out.k[1], out.k[2], out.k[0], out.k[1], out.k[2]);
  };
  for (let i = 0; i < n; i++){ const j = (i + 1) % n; tri(bas[i], bas[j], haut[j]); tri(bas[i], haut[j], haut[i]); }
  const key = s.join(",");
  let T = cacheTri.get(key); if (!T){ T = trianguler(P); cacheTri.set(key, T); }
  for (const [a, b, c] of T){ tri(haut[a], haut[b], haut[c]); tri(bas[c], bas[b], bas[a]); }
  if (out.e){                                    // arêtes : les deux bouts + les coins vifs sur la longueur
    const L = (a, b) => out.e.push(a[0], a[1], a[2], b[0], b[1], b[2]);
    for (let i = 0; i < n; i++){ const j = (i + 1) % n; L(bas[i], bas[j]); L(haut[i], haut[j]); }
    if (s.length !== 3) for (let i = 0; i < n; i++){
      const a = P[(i + n - 1) % n], b = P[i], c = P[(i + 1) % n];
      const u = [b[0] - a[0], b[1] - a[1]], v = [c[0] - b[0], c[1] - b[1]];
      const cos = (u[0] * v[0] + u[1] * v[1]) / ((Math.hypot(...u) * Math.hypot(...v)) || 1);
      if (cos < 0.93) L(bas[i], haut[i]);
    }
  }
  return bas.concat(haut);
}

/* ================================================================ WebGL : un petit moteur 3D maison */
const cv = $("c");
const gl = cv.getContext("webgl", {antialias: true, alpha: false, preserveDrawingBuffer: false});
function prog(vs, fs){
  const sh = (ty, src) => { const s = gl.createShader(ty); gl.shaderSource(s, src); gl.compileShader(s); return s; };
  const p = gl.createProgram();
  gl.attachShader(p, sh(gl.VERTEX_SHADER, vs)); gl.attachShader(p, sh(gl.FRAGMENT_SHADER, fs)); gl.linkProgram(p);
  return p;
}
const PG = gl ? {
  face: prog(`attribute vec3 p;attribute vec3 n;uniform mat4 M;varying vec3 vn;void main(){vn=n;gl_Position=M*vec4(p,1.);}`,
             `precision mediump float;uniform vec3 col;uniform float a;uniform vec3 L;varying vec3 vn;
              void main(){vec3 n=normalize(vn);float d=abs(dot(n,L));float h=.5+.5*n.z;
              gl_FragColor=vec4(col*(.30+.55*d+.18*h),a);}`),
  ligne: prog(`attribute vec3 p;uniform mat4 M;void main(){gl_Position=M*vec4(p,1.);}`,
              `precision mediump float;uniform vec3 col;uniform float a;void main(){gl_FragColor=vec4(col,a);}`),
  choix: prog(`attribute vec3 p;attribute vec3 k;uniform mat4 M;varying vec3 vk;void main(){vk=k;gl_Position=M*vec4(p,1.);}`,
              `precision mediump float;varying vec3 vk;void main(){gl_FragColor=vec4(vk,1.);}`)
} : null;
function tampon(arr){ const b = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, b); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(arr), gl.STATIC_DRAW); return b; }
function lot(out, col, alpha){
  return {p: tampon(out.p), n: tampon(out.n), id: out.id ? tampon(out.id) : null, e: out.e && out.e.length ? tampon(out.e) : null,
          nv: out.p.length / 3, ne: out.e ? out.e.length / 3 : 0, col, a: alpha};
}
function libererLots(L){ for (const o of L) for (const k of ["p", "n", "id", "e"]) if (o[k]) gl.deleteBuffer(o[k]); }
const hex = h => [(h >> 16 & 255) / 255, (h >> 8 & 255) / 255, (h & 255) / 255];
const PAL = [0x4fb3ff, 0xf0a04b, 0x5fd08a, 0xe46f8f, 0xb49cff, 0x3fd1c9, 0xd9c45a, 0xff8a4c].map(hex);

/* matrices (colonnes) */
function persp(fy, as, n, f){ const q = 1 / Math.tan(fy / 2), r = 1 / (n - f); return [q / as, 0, 0, 0, 0, q, 0, 0, 0, 0, (n + f) * r, -1, 0, 0, 2 * n * f * r, 0]; }
function regard(e, c, u){
  let z = [e[0] - c[0], e[1] - c[1], e[2] - c[2]]; let l = Math.hypot(...z); z = z.map(v => v / l);
  let x = [u[1] * z[2] - u[2] * z[1], u[2] * z[0] - u[0] * z[2], u[0] * z[1] - u[1] * z[0]]; l = Math.hypot(...x) || 1; x = x.map(v => v / l);
  const y = [z[1] * x[2] - z[2] * x[1], z[2] * x[0] - z[0] * x[2], z[0] * x[1] - z[1] * x[0]];
  return [x[0], y[0], z[0], 0, x[1], y[1], z[1], 0, x[2], y[2], z[2], 0,
          -(x[0] * e[0] + x[1] * e[1] + x[2] * e[2]), -(y[0] * e[0] + y[1] * e[1] + y[2] * e[2]), -(z[0] * e[0] + z[1] * e[1] + z[2] * e[2]), 1];
}
function mul(a, b){ const o = new Array(16).fill(0); for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) for (let k = 0; k < 4; k++) o[j * 4 + i] += a[k * 4 + i] * b[j * 4 + k]; return o; }

/* caméra : orbite autour de la cible, Z en haut */
const CAM = {T: [0, 0, 0], D: 5000, yaw: Math.atan2(-1.25, 1), pitch: 0.47, fov: 35 * Math.PI / 180};
function oeil(c){ const cp = Math.cos(c.pitch); return [c.T[0] + c.D * cp * Math.cos(c.yaw), c.T[1] + c.D * cp * Math.sin(c.yaw), c.T[2] + c.D * Math.sin(c.pitch)]; }
function matrice(c, as){ return mul(persp(c.fov, as, c.D / 300, c.D * 40), regard(oeil(c), c.T, [0, 0, 1])); }
function projeter(M, p, W, H){
  const x = M[0] * p[0] + M[4] * p[1] + M[8] * p[2] + M[12], y = M[1] * p[0] + M[5] * p[1] + M[9] * p[2] + M[13];
  const w = M[3] * p[0] + M[7] * p[1] + M[11] * p[2] + M[15];
  if (w <= 1e-6) return null;
  return [(x / w * .5 + .5) * W, (1 - (y / w * .5 + .5)) * H];
}

/* ================================================================ ce qu'on regarde */
let VUE = null, JOB = null, O = [0, 0, 0];
let lots = [], fantomes = [], lotsMini = [], piecesL = [], etiqs = [];
const etat = {asm: "", ctx: true, num: true, mes: false, pts: []};
let miniOn = false, miniC = [0, 0, 0], miniR = 1000, miniZ = 1, miniRouge = [0, 0, 0], sphere = {c: [0, 0, 0], r: 1000};

async function afficher(J, jobOuvert, asmDansJob){
  VUE = J; JOB = jobOuvert && jobOuvert.t === J.t ? jobOuvert : (J.a ? null : J);
  etat.asm = asmDansJob || ""; etat.pts = []; etat.mes = false;
  O = J.I.length ? [J.I[0][2], J.I[0][3], J.I[0][4]] : [0, 0, 0];
  const tv = $("titreVue"); tv.textContent = "";
  const s = document.createElement("strong");
  const nc = (J.a && J.R && J.R.length) ? J.R.length + 1 : 1;
  s.textContent = J.a ? t("assemblage") + " " + J.a + (nc > 1 ? " (×" + nc + ")" : "") : t("jobComplete");
  tv.append(s, document.createTextNode(" · " + (J.t || t("sansTitre"))));
  remplirListe();
  montrer("ecranVue", !history.state || history.state.e !== "ecranVue");
  construire(); construireMini(); cadrer(); carte(null);
  $("bCtx").hidden = !(J.a && JOB);
  majBoutons();
  if (J.a && !JOB && (J.C || []).length) carteTexte(t("sansJob"));
  if (nc > 1) carteTexte(t("copies")(nc), true);
}
function remplirListe(){
  const sel = $("sel"); sel.textContent = "";
  if (!VUE.a){ const o = document.createElement("option"); o.value = ""; o.textContent = t("toute") + " (" + VUE.I.length + " " + t("pieces") + ")"; sel.append(o); }
  const noms = VUE.a ? [VUE.a] : [...new Set(VUE.A)].sort(triNat);
  for (const n of noms){ const o = document.createElement("option"); o.value = VUE.a ? "" : n; o.textContent = t("assemblage") + " " + n; sel.append(o); }
  sel.value = etat.asm; sel.hidden = !!VUE.a;
}
function construire(){
  libererLots(lots); libererLots(fantomes); lots = []; fantomes = []; piecesL = [];
  const J = VUE, cible = J.a || etat.asm;
  const avecJob = !!(J.a && etat.ctx && JOB && JOB.A.includes(J.a));
  const base = avecJob ? JOB : J;
  const parNom = {};
  base.I.forEach(it => { const nom = base.A[it[1]]; (parNom[nom] = parNom[nom] || []).push(it); });
  const gros = base.I.length > 600;
  let mn = [1e18, 1e18, 1e18], mx = [-1e18, -1e18, -1e18];
  for (const nom in parNom){
    const actif = !cible || nom === cible;
    const out = {p: [], n: [], id: actif ? [] : null, e: actif && !(gros && !cible) ? [] : null, k: [0, 0, 0]};
    for (const it of parNom[nom]){
      if (actif){ const q = piecesL.length + 1; out.k = [(q & 255) / 255, (q >> 8 & 255) / 255, (q >> 16 & 255) / 255]; }
      const coins = solide(base, it, null, O, out);
      if (actif){
        piecesL.push({J: base, it, coins, nom});
        for (const c of coins) for (let i = 0; i < 3; i++){ mn[i] = Math.min(mn[i], c[i]); mx[i] = Math.max(mx[i], c[i]); }
      }
    }
    const col = PAL[base.A.indexOf(nom) % PAL.length];
    if (actif) lots.push(lot(out, col, 1)); else fantomes.push(lot(out, [0.56, 0.63, 0.71], 0.10));
  }
  sphere = {c: mn.map((v, i) => (v + mx[i]) / 2), r: Math.max(200, Math.hypot(mx[0] - mn[0], mx[1] - mn[1], mx[2] - mn[2]) / 2)};
  // étiquettes : numéros des pièces, ou noms d'assemblages pour une grosse job entière
  const box = $("etiquettes"); box.textContent = ""; etiqs = [];
  const ajout = (txt, c, cls) => { const e = document.createElement("div"); e.className = "etq" + (cls ? " " + cls : ""); e.textContent = txt; box.append(e); etiqs.push({e, c}); };
  if (!cible && (gros || !etat.num)){
    const parA = {};
    for (const p of piecesL){ const a = parA[p.nom] = parA[p.nom] || [0, 0, 0, 0]; const c = centre(p.coins); a[0] += c[0]; a[1] += c[1]; a[2] += c[2]; a[3]++; }
    for (const n in parA){ const a = parA[n]; ajout(n, [a[0] / a[3], a[1] / a[3], a[2] / a[3]], "asm"); }
  } else {
    const vus = [];
    for (const p of piecesL){
      const mk = p.J.F[p.it[0]][4]; if (!mk) continue;
      const c = centre(p.coins);
      if (vus.some(v => v.mk === mk && Math.hypot(v.c[0] - c[0], v.c[1] - c[1], v.c[2] - c[2]) < 120)) continue;
      vus.push({mk, c}); ajout(mk, c);
    }
  }
  etiqs.forEach(q => { q.e.hidden = !(etat.num || !cible); });
  dessiner();
}
function centre(L){ const c = [0, 0, 0]; L.forEach(p => { c[0] += p[0]; c[1] += p[1]; c[2] += p[2]; }); return c.map(v => v / (L.length || 1)); }

/* PETITE FENÊTRE : toute la job en gris, l'assemblage (et ses copies) en rouge */
function construireMini(){
  libererLots(lotsMini); lotsMini = []; miniOn = false;
  const J = VUE; if (!J.a) { $("mini").hidden = true; return; }
  const rouge = {p: [], n: []}, gris = {p: [], n: []};
  let mn = [1e18, 1e18, 1e18], mx = [-1e18, -1e18, -1e18];
  const ag = cs => cs.forEach(c => { for (let i = 0; i < 3; i++){ mn[i] = Math.min(mn[i], c[i]); mx[i] = Math.max(mx[i], c[i]); } });
  if (JOB && JOB.A.includes(J.a)){
    JOB.I.forEach(it => ag(solide(JOB, it, null, O, JOB.A[it[1]] === J.a ? rouge : gris)));
  } else {
    const C = J.C || [], ln = {p: [], n: [], e: []};
    for (let i = 0; i + 5 < C.length; i += 6){
      const a = [C[i] * 10 - O[0], C[i + 1] * 10 - O[1], C[i + 2] * 10 - O[2]], b = [C[i + 3] * 10 - O[0], C[i + 4] * 10 - O[1], C[i + 5] * 10 - O[2]];
      ln.e.push(...a, ...b); ag([a, b]);
    }
    if (ln.e.length) lotsMini.push(Object.assign(lot(ln, [0.54, 0.58, 0.64], 1), {lignes: true}));
    for (const dx of [null].concat(J.R || [])) J.I.forEach(it => ag(solide(J, it, dx, O, rouge)));
  }
  if (rouge.p.length){ const R = rouge.p, c = [0, 0, 0]; for (let i = 0; i < R.length; i += 3){ c[0] += R[i]; c[1] += R[i + 1]; c[2] += R[i + 2]; } miniRouge = c.map(v => v / (R.length / 3)); }
  if (gris.p.length) lotsMini.push(lot(gris, [0.42, 0.46, 0.52], 1));
  if (rouge.p.length) lotsMini.push(Object.assign(lot(rouge, [1, 0.23, 0.23], 1), {plat: true}));
  miniC = mn.map((v, i) => (v + mx[i]) / 2); miniR = Math.max(300, Math.hypot(mx[0] - mn[0], mx[1] - mn[1], mx[2] - mn[2]) / 2);
  miniOn = lotsMini.length > 0; miniZ = 1; $("mini").classList.remove("grand");
  $("mini").hidden = !miniOn; $("miniNom").textContent = J.a;
}
function cadrer(){
  CAM.T = sphere.c.slice();
  const as = (cv.clientWidth || 1) / (cv.clientHeight || 1);
  const f = Math.min(CAM.fov, 2 * Math.atan(Math.tan(CAM.fov / 2) * as));
  CAM.D = sphere.r / Math.sin(f / 2) * 1.05;
  dessiner();
}

/* PETITE FENÊTRE AGRANDIE (Jean-Julien 2026-11-25) : toucher la petite fenêtre l'agrandit sur toute la vue ;
   1 doigt la tourne, 2 doigts zooment, toucher sans bouger (ou ×) la remet petite. */
(() => {
  const el = $("mini"), pts = new Map();
  let tap = null;
  const grand = on => { el.classList.toggle("grand", on); miniZ = 1; taille(); dessiner(); };
  $("miniFermer").addEventListener("click", e => { e.stopPropagation(); grand(false); });
  el.addEventListener("pointerdown", e => {
    if (e.target.id === "miniFermer") return;
    el.setPointerCapture(e.pointerId); pts.set(e.pointerId, {x: e.clientX, y: e.clientY});
    tap = pts.size === 1 ? {x: e.clientX, y: e.clientY, t: Date.now(), bouge: false} : null;
  });
  el.addEventListener("pointermove", e => {
    const d = pts.get(e.pointerId); if (!d || !el.classList.contains("grand")) return;
    const av = [...pts.values()].map(p => ({x: p.x, y: p.y}));
    d.x = e.clientX; d.y = e.clientY;
    if (tap && Math.hypot(e.clientX - tap.x, e.clientY - tap.y) > 7) tap.bouge = true;
    const P = [...pts.values()];
    if (P.length === 1){ CAM.yaw -= (P[0].x - av[0].x) * 0.008; CAM.pitch = Math.max(-1.52, Math.min(1.52, CAM.pitch + (P[0].y - av[0].y) * 0.008)); }
    else if (P.length >= 2){
      const d0 = Math.hypot(av[0].x - av[1].x, av[0].y - av[1].y), d1 = Math.hypot(P[0].x - P[1].x, P[0].y - P[1].y);
      if (d0 > 0 && d1 > 0) miniZ = Math.max(0.5, Math.min(30, miniZ * d1 / d0));
    }
    dessiner();
  });
  const fin = e => {
    const seul = pts.size === 1; pts.delete(e.pointerId);
    if (seul && tap && !tap.bouge && Date.now() - tap.t < 600) grand(!el.classList.contains("grand"));
    tap = null;
  };
  el.addEventListener("pointerup", fin);
  el.addEventListener("pointercancel", e => { pts.delete(e.pointerId); tap = null; });
  el.addEventListener("wheel", e => { if (!el.classList.contains("grand")) return; e.preventDefault(); miniZ = Math.max(0.5, Math.min(30, miniZ * Math.exp(-e.deltaY * 0.0012))); dessiner(); }, {passive: false});
})();

/* ================================================================ dessin */
let aDessiner = false;
function dessiner(){ if (!aDessiner){ aDessiner = true; requestAnimationFrame(rendu); } }
function taille(){
  const r = Math.min(2, window.devicePixelRatio || 1), w = cv.clientWidth, h = cv.clientHeight;
  if (w && h && (cv.width !== Math.round(w * r) || cv.height !== Math.round(h * r))){ cv.width = Math.round(w * r); cv.height = Math.round(h * r); }
  dessiner();
}
window.addEventListener("resize", taille);
function attrib(pg, nom, b){ const l = gl.getAttribLocation(pg, nom); if (l < 0) return; gl.bindBuffer(gl.ARRAY_BUFFER, b); gl.enableVertexAttribArray(l); gl.vertexAttribPointer(l, 3, gl.FLOAT, false, 0, 0); }
function sansAttrib(pg, nom){ const l = gl.getAttribLocation(pg, nom); if (l >= 0) gl.disableVertexAttribArray(l); }
function passe(M, L, lumiere, avecAretes, ghost){
  gl.useProgram(PG.face);
  gl.uniformMatrix4fv(gl.getUniformLocation(PG.face, "M"), false, M);
  gl.uniform3fv(gl.getUniformLocation(PG.face, "L"), lumiere);
  for (const o of L){
    if (o.lignes) continue;
    attrib(PG.face, "p", o.p); attrib(PG.face, "n", o.n);
    gl.uniform3fv(gl.getUniformLocation(PG.face, "col"), o.col);
    gl.uniform1f(gl.getUniformLocation(PG.face, "a"), o.a);
    gl.drawArrays(gl.TRIANGLES, 0, o.nv);
  }
  sansAttrib(PG.face, "n");
  if (!avecAretes) return;
  gl.useProgram(PG.ligne);
  gl.uniformMatrix4fv(gl.getUniformLocation(PG.ligne, "M"), false, M);
  for (const o of L){
    if (!o.e) continue;
    attrib(PG.ligne, "p", o.e);
    gl.uniform3fv(gl.getUniformLocation(PG.ligne, "col"), o.lignes ? o.col : [0.04, 0.05, 0.06]);
    gl.uniform1f(gl.getUniformLocation(PG.ligne, "a"), 1);
    gl.drawArrays(gl.LINES, 0, o.ne);
  }
}
function lumiereDe(c){ const e = oeil(c), d = [e[0] - c.T[0], e[1] - c.T[1], e[2] - c.T[2] + c.D * 0.6], l = Math.hypot(...d) || 1; return d.map(v => v / l); }
function rendu(){
  aDessiner = false;
  if (!gl || $("ecranVue").hidden) return;
  const W = cv.width, H = cv.height;
  gl.viewport(0, 0, W, H); gl.disable(gl.SCISSOR_TEST);
  gl.clearColor(0.078, 0.09, 0.11, 1); gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  const M = matrice(CAM, W / H);
  gl.enable(gl.DEPTH_TEST); gl.depthMask(true); gl.disable(gl.BLEND);
  gl.enable(gl.POLYGON_OFFSET_FILL); gl.polygonOffset(1, 1);
  passe(M, lots, lumiereDe(CAM), true);
  gl.disable(gl.POLYGON_OFFSET_FILL);
  if (fantomes.length){
    gl.enable(gl.BLEND); gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA); gl.depthMask(false);
    passe(M, fantomes, lumiereDe(CAM), false);
    gl.depthMask(true); gl.disable(gl.BLEND);
  }
  // petite fenêtre
  const el = $("mini");
  if (miniOn && !el.hidden){
    const r = el.getBoundingClientRect(), rc = cv.getBoundingClientRect(), k = W / rc.width;
    const x = Math.round((r.left - rc.left) * k), y = Math.round((rc.bottom - r.bottom) * k), w = Math.round(r.width * k), h = Math.round(r.height * k);
    gl.enable(gl.SCISSOR_TEST); gl.scissor(x, y, w, h); gl.viewport(x, y, w, h);
    gl.clearColor(0.05, 0.06, 0.075, 1); gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    const kz = 1 - 1 / miniZ;                     // en zoomant, on se rapproche de l'assemblage (rouge)
    const cm = {T: miniC.map((v, i) => v + (miniRouge[i] - v) * kz), yaw: CAM.yaw, pitch: CAM.pitch, fov: CAM.fov, D: 0};
    cm.D = miniR / Math.sin(Math.min(cm.fov, 2 * Math.atan(Math.tan(cm.fov / 2) * w / h)) / 2) * 1.02 / miniZ;
    const Mm = matrice(cm, w / h);
    passe(Mm, lotsMini.filter(o => !o.lignes), lumiereDe(cm), false);
    gl.useProgram(PG.ligne); gl.uniformMatrix4fv(gl.getUniformLocation(PG.ligne, "M"), false, Mm);
    for (const o of lotsMini) if (o.lignes){ attrib(PG.ligne, "p", o.e); gl.uniform3fv(gl.getUniformLocation(PG.ligne, "col"), o.col); gl.uniform1f(gl.getUniformLocation(PG.ligne, "a"), 1); gl.drawArrays(gl.LINES, 0, o.ne); }
    gl.disable(gl.SCISSOR_TEST); gl.viewport(0, 0, W, H);
  }
  // étiquettes et mesures (calques HTML / SVG au-dessus)
  const cw = cv.clientWidth, ch = cv.clientHeight;
  const pris = [];                                // une étiquette ne cache jamais une autre : celles de trop attendent le zoom
  for (const id of ["mini", "info"]){             // ni la petite fenêtre, ni les cartes d'info
    const el = $(id); if (el.hidden || !el.childElementCount && id === "info") continue;
    const r = el.getBoundingClientRect(), rc = cv.getBoundingClientRect();
    pris.push([r.left - rc.left, r.top - rc.top, r.right - rc.left, r.bottom - rc.top]);
  }
  for (const q of etiqs){
    if (q.e.hidden) continue;
    const s = projeter(M, q.c, cw, ch);
    if (q.w === undefined){ q.w = q.e.offsetWidth || 30; q.h = q.e.offsetHeight || 18; }
    const R = s && [s[0] - q.w / 2 - 2, s[1] - q.h / 2 - 2, s[0] + q.w / 2 + 2, s[1] + q.h / 2 + 2];
    if (!s || R[2] < 0 || R[0] > cw || R[3] < 0 || R[1] > ch || pris.some(p => R[0] < p[2] && R[2] > p[0] && R[1] < p[3] && R[3] > p[1])){
      q.e.style.visibility = "hidden"; continue;
    }
    pris.push(R);
    q.e.style.visibility = ""; q.e.style.transform = `translate(${s[0].toFixed(1)}px,${s[1].toFixed(1)}px) translate(-50%,-50%)`;
  }
  dessinerMesure(M, cw, ch);
}

/* ================================================================ toucher : tourner, zoomer, déplacer ; toucher une pièce */
const doigts = new Map();
let geste = null, tap = null;
cv.addEventListener("pointerdown", e => {
  cv.setPointerCapture(e.pointerId);
  doigts.set(e.pointerId, {x: e.clientX, y: e.clientY});
  tap = doigts.size === 1 ? {x: e.clientX, y: e.clientY, t: Date.now(), bouge: false} : null;
  geste = null;
});
cv.addEventListener("pointermove", e => {
  const d = doigts.get(e.pointerId); if (!d) return;
  const avant = [...doigts.values()].map(p => ({x: p.x, y: p.y}));
  d.x = e.clientX; d.y = e.clientY;
  if (tap && Math.hypot(e.clientX - tap.x, e.clientY - tap.y) > 7) tap.bouge = true;
  const P = [...doigts.values()];
  if (P.length === 1){
    const dx = P[0].x - avant[0].x, dy = P[0].y - avant[0].y;
    if (e.pointerType === "mouse" && (e.buttons & 2 || e.shiftKey)) pan(dx, dy);
    else { CAM.yaw -= dx * 0.008; CAM.pitch = Math.max(-1.52, Math.min(1.52, CAM.pitch + dy * 0.008)); }
  } else if (P.length >= 2){
    const m0 = [(avant[0].x + avant[1].x) / 2, (avant[0].y + avant[1].y) / 2], m1 = [(P[0].x + P[1].x) / 2, (P[0].y + P[1].y) / 2];
    const d0 = Math.hypot(avant[0].x - avant[1].x, avant[0].y - avant[1].y), d1 = Math.hypot(P[0].x - P[1].x, P[0].y - P[1].y);
    if (d0 > 0 && d1 > 0) CAM.D = Math.max(50, Math.min(5e6, CAM.D * d0 / d1));
    pan(m1[0] - m0[0], m1[1] - m0[1]);
  }
  dessiner();
});
function finDoigt(e){
  const seul = doigts.size === 1;
  doigts.delete(e.pointerId);
  if (seul && tap && !tap.bouge && Date.now() - tap.t < 600) toucher(e.clientX, e.clientY);
  tap = null;
}
cv.addEventListener("pointerup", finDoigt);
cv.addEventListener("pointercancel", e => { doigts.delete(e.pointerId); tap = null; });
cv.addEventListener("contextmenu", e => e.preventDefault());
cv.addEventListener("wheel", e => { e.preventDefault(); CAM.D = Math.max(50, Math.min(5e6, CAM.D * Math.exp(e.deltaY * 0.0012))); dessiner(); }, {passive: false});
function pan(dx, dy){
  const k = 2 * CAM.D * Math.tan(CAM.fov / 2) / (cv.clientHeight || 1);
  const e = oeil(CAM), z = [e[0] - CAM.T[0], e[1] - CAM.T[1], e[2] - CAM.T[2]], l = Math.hypot(...z);
  const zz = z.map(v => v / l), x = [-zz[1], zz[0], 0], lx = Math.hypot(...x) || 1; x[0] /= lx; x[1] /= lx;
  const y = [zz[1] * x[2] - zz[2] * x[1], zz[2] * x[0] - zz[0] * x[2], zz[0] * x[1] - zz[1] * x[0]];
  for (let i = 0; i < 3; i++) CAM.T[i] += (-dx * x[i] + dy * y[i]) * k;
}
let fbo = null;
function viser(cx, cy){                          // quelle pièce est sous le doigt (rendu des numéros en couleurs)
  if (!gl || !piecesL.length) return null;
  const W = cv.width, H = cv.height;
  if (!fbo || fbo.w !== W || fbo.h !== H){
    if (fbo){ gl.deleteFramebuffer(fbo.f); gl.deleteTexture(fbo.t); gl.deleteRenderbuffer(fbo.d); }
    const f = gl.createFramebuffer(), tx = gl.createTexture(), d = gl.createRenderbuffer();
    gl.bindTexture(gl.TEXTURE_2D, tx); gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, W, H, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.bindRenderbuffer(gl.RENDERBUFFER, d); gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, W, H);
    gl.bindFramebuffer(gl.FRAMEBUFFER, f);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tx, 0);
    gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, d);
    fbo = {f, t: tx, d, w: W, h: H};
  }
  gl.bindFramebuffer(gl.FRAMEBUFFER, fbo.f);
  gl.viewport(0, 0, W, H); gl.disable(gl.SCISSOR_TEST); gl.disable(gl.BLEND); gl.enable(gl.DEPTH_TEST); gl.depthMask(true);
  gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.useProgram(PG.choix);
  gl.uniformMatrix4fv(gl.getUniformLocation(PG.choix, "M"), false, matrice(CAM, W / H));
  for (const o of lots){ attrib(PG.choix, "p", o.p); attrib(PG.choix, "k", o.id); gl.drawArrays(gl.TRIANGLES, 0, o.nv); }
  sansAttrib(PG.choix, "k");
  const r = cv.getBoundingClientRect(), k = W / r.width, px = new Uint8Array(4);
  let best = 0;
  for (const [ox, oy] of [[0, 0], [-6, 0], [6, 0], [0, -6], [0, 6]]){        // un peu de tolérance au doigt
    gl.readPixels(Math.round((cx - r.left + ox) * k), Math.round(H - (cy - r.top + oy) * k), 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, px);
    const q = px[0] + px[1] * 256 + px[2] * 65536; if (q){ best = q; break; }
  }
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  dessiner();
  return best ? piecesL[best - 1] : null;
}
function toucher(cx, cy){
  const p = viser(cx, cy);
  if (etat.mes){ if (p) mesurer(p, cx, cy); return; }
  carte(p);
}

/* ================================================================ mesurer (accroché aux coins) */
function pieds(mm){
  const tt = Math.round(Math.abs(mm) / 25.4 * 16), pi = Math.floor(tt / 192), r = tt - pi * 192;
  const po = Math.floor(r / 16); let n = r % 16, d = 16;
  while (n && n % 2 === 0){ n /= 2; d /= 2; }
  return `${pi}'-${po}${n ? " " + n + "/" + d : ""}"`;
}
const imp = () => reglage("unites", "imp") === "imp";
function mesurer(p, cx, cy){
  const n = etat.mes === "a" ? 3 : 2;
  if (etat.pts.length >= n) etat.pts = [];
  const r = cv.getBoundingClientRect(), M = matrice(CAM, cv.width / cv.height);
  let best = null, bd = 1e9;
  for (const c of p.coins){
    const s = projeter(M, c, r.width, r.height); if (!s) continue;
    const dd = Math.hypot(s[0] - (cx - r.left), s[1] - (cy - r.top));
    if (dd < bd){ bd = dd; best = c; }
  }
  if (!best) return;
  etat.pts.push(best);
  if (n === 3){
    if (etat.pts.length === 3) carteAngle(angle3(etat.pts));
    else carteTexte(t(etat.pts.length === 1 ? "sommet" : "troisieme"));
  } else if (etat.pts.length === 2){
    const [a, b] = etat.pts, d = Math.hypot(b[0] - a[0], b[1] - a[1], b[2] - a[2]);
    carteMesure(d, Math.hypot(b[0] - a[0], b[1] - a[1]), Math.abs(b[2] - a[2]));
  } else carteTexte(t("deuxiemePoint"));
  dessiner();
}
/* ANGLE (Jean-Julien 2026-11-26) : 3 points accrochés aux coins, le 2e est le sommet */
function angle3(P){
  const [a, b, c] = P, u = [a[0] - b[0], a[1] - b[1], a[2] - b[2]], v = [c[0] - b[0], c[1] - b[1], c[2] - b[2]];
  const lu = Math.hypot(...u), lv = Math.hypot(...v); if (!lu || !lv) return 0;
  return Math.acos(Math.max(-1, Math.min(1, (u[0] * v[0] + u[1] * v[1] + u[2] * v[2]) / lu / lv))) * 180 / Math.PI;
}
const deg = x => (Math.round(x * 10) / 10).toFixed(1).replace(/\.0$/, "") + "°";
function dessinerMesure(M, cw, ch){
  const s = $("svgMes"); s.textContent = "";
  let lab = $("etqMes");
  if (!etat.pts.length){ if (lab) lab.remove(); return; }
  const NS = "http://www.w3.org/2000/svg", P = etat.pts.map(p => projeter(M, p, cw, ch));
  for (let i = 0; i + 1 < P.length; i++){
    if (!P[i] || !P[i + 1]) continue;
    const l = document.createElementNS(NS, "line");
    l.setAttribute("x1", P[i][0]); l.setAttribute("y1", P[i][1]); l.setAttribute("x2", P[i + 1][0]); l.setAttribute("y2", P[i + 1][1]);
    l.setAttribute("stroke", "#d67a3a"); l.setAttribute("stroke-width", "2.5"); s.append(l);
  }
  if (P.length === 3 && P[0] && P[1] && P[2]){     // petit arc au sommet
    const B = P[1], ang = q => Math.atan2(q[1] - B[1], q[0] - B[0]);
    let a0 = ang(P[0]), a1 = ang(P[2]), da = a1 - a0;
    while (da > Math.PI) da -= 2 * Math.PI; while (da < -Math.PI) da += 2 * Math.PI;
    const rr = Math.max(14, Math.min(34, Math.hypot(P[0][0] - B[0], P[0][1] - B[1]) / 3, Math.hypot(P[2][0] - B[0], P[2][1] - B[1]) / 3));
    const pa = document.createElementNS(NS, "path");
    pa.setAttribute("d", `M${B[0] + rr * Math.cos(a0)},${B[1] + rr * Math.sin(a0)} A${rr},${rr} 0 0 ${da > 0 ? 1 : 0} ${B[0] + rr * Math.cos(a0 + da)},${B[1] + rr * Math.sin(a0 + da)}`);
    pa.setAttribute("fill", "none"); pa.setAttribute("stroke", "#fff"); pa.setAttribute("stroke-width", "2"); s.append(pa);
  }
  for (const q of P){ if (!q) continue; const c = document.createElementNS(NS, "circle"); c.setAttribute("cx", q[0]); c.setAttribute("cy", q[1]); c.setAttribute("r", "6"); c.setAttribute("fill", "#d67a3a"); c.setAttribute("stroke", "#fff"); c.setAttribute("stroke-width", "1.5"); s.append(c); }
  if (etat.mes === "a" && P.length === 3 && P[0] && P[1] && P[2]){
    if (!lab){ lab = document.createElement("div"); lab.id = "etqMes"; lab.className = "etq mes"; $("etiquettes").append(lab); }
    lab.textContent = deg(angle3(etat.pts));
    const B = P[1], m = [(P[0][0] + P[2][0]) / 2 - B[0], (P[0][1] + P[2][1]) / 2 - B[1]], lm = Math.hypot(...m) || 1;
    lab.style.transform = `translate(${B[0] + m[0] / lm * 52}px,${B[1] + m[1] / lm * 52}px) translate(-50%,-50%)`;
  } else if (etat.mes !== "a" && P.length === 2 && P[0] && P[1]){
    if (!lab){ lab = document.createElement("div"); lab.id = "etqMes"; lab.className = "etq mes"; $("etiquettes").append(lab); }
    const [a, b] = etat.pts; lab.textContent = Math.round(Math.hypot(b[0] - a[0], b[1] - a[1], b[2] - a[2])) + " mm";
    lab.style.transform = `translate(${(P[0][0] + P[1][0]) / 2}px,${(P[0][1] + P[1][1]) / 2}px) translate(-50%,-140%)`;
  } else if (lab) lab.remove();
}

/* ================================================================ cartes d'info */
function boite(){ const b = $("info"); b.textContent = ""; return b; }
function carteTexte(x, ajouter){ const b = ajouter ? $("info") : boite(); const c = document.createElement("div"); c.className = "card"; c.textContent = x; b.append(c); }
function carte(p){
  const b = boite(); if (!p) return;
  const f = p.J.F[p.it[0]];
  const c = document.createElement("div"); c.className = "card";
  const mk = document.createElement("div"); mk.className = "mk"; mk.textContent = f[4] || "—";
  const l1 = document.createElement("div"); l1.className = "num";
  l1.textContent = (p.J.P[f[5]] || "") + " · " + Math.round(f[7]) + " mm" + (imp() ? " (" + pieds(f[7]) + ")" : "");
  const l2 = document.createElement("div"); l2.className = "lab"; l2.textContent = (f[6] || t("piece")) + " · " + t("assemblage").toLowerCase() + " " + p.nom;
  c.append(mk, l1);
  const pp = pentePiece(p.coins);
  if (pp !== null){ const l3 = document.createElement("div"); l3.className = "num"; l3.textContent = t("pentePiece") + " " + deg(pp); c.append(l3); }
  c.append(l2); b.append(c);
}
function carteMesure(d, dh, dv){
  const b = boite(), c = document.createElement("div"); c.className = "card";
  const a = document.createElement("div"); a.className = "mk"; a.textContent = Math.round(d) + " mm";
  const l = document.createElement("div"); l.className = "num";
  l.textContent = (imp() ? pieds(d) + " · " : "") + t("horiz") + " " + Math.round(dh) + " · " + t("vert") + " " + Math.round(dv)
    + " · " + t("pente") + " " + deg(Math.atan2(dv, dh) * 180 / Math.PI);
  c.append(a, l); b.append(c);
}
function carteAngle(A){
  const b = boite(), c = document.createElement("div"); c.className = "card";
  const a = document.createElement("div"); a.className = "mk"; a.textContent = deg(A);
  const l = document.createElement("div"); l.className = "num";
  l.textContent = t("complement") + " " + deg(Math.abs(90 - A)) + " · 180° − " + deg(A) + " = " + deg(180 - A);
  c.append(a, l); b.append(c);
}
/* pente d'une pièce allongée (limon, garde, poutre) par rapport à l'horizontale :
   axe principal des coins, puis la plus longue arête réelle parallèle à cet axe (pas la diagonale) */
function pentePiece(L){
  if (!L || L.length < 2 || L.length > 3000) return null;
  const c = centre(L), C = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
  for (const q of L){ const w = [q[0] - c[0], q[1] - c[1], q[2] - c[2]]; for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) C[i][j] += w[i] * w[j]; }
  let u = [1, 0.3, 0.2];
  for (let k = 0; k < 60; k++){ const v = [0, 1, 2].map(i => C[i][0] * u[0] + C[i][1] * u[1] + C[i][2] * u[2]), l = Math.hypot(...v); if (!l) return null; u = v.map(x => x / l); }
  let p0 = 1e18, p1 = -1e18, ep = 0;
  for (const q of L){
    const w = [q[0] - c[0], q[1] - c[1], q[2] - c[2]], s = w[0] * u[0] + w[1] * u[1] + w[2] * u[2];
    p0 = Math.min(p0, s); p1 = Math.max(p1, s); ep = Math.max(ep, Math.hypot(w[0] - s * u[0], w[1] - s * u[1], w[2] - s * u[2]));
  }
  const lg = p1 - p0;
  if (lg < 150 || ep * 2 * 2.5 > lg) return null;  // pas assez allongée pour qu'une pente veuille dire quelque chose
  // les vraies arêtes longues sont plusieurs à être parallèles (4 coins d'une plaque, tous les côtés d'un tube) :
  // on garde la direction sur laquelle le plus de paires de coins s'entendent, pas une diagonale isolée
  let K = [];
  const pas = Math.max(1, Math.floor(L.length / 300));
  for (let i = 0; i < L.length; i += pas) for (let j = i + 1; j < L.length; j += pas){
    const d = [L[j][0] - L[i][0], L[j][1] - L[i][1], L[j][2] - L[i][2]], l = Math.hypot(...d);
    if (l < 0.5 * lg) continue;
    let pr = (d[0] * u[0] + d[1] * u[1] + d[2] * u[2]) / l;
    if (Math.abs(pr) < Math.cos(6 * Math.PI / 180)) continue;
    const sg = pr < 0 ? -1 : 1; K.push({d: d.map(x => x * sg / l), l});
  }
  if (K.length > 500){ K.sort((x, y) => y.l - x.l); K = K.slice(0, 500); }
  const tol = Math.cos(0.15 * Math.PI / 180);
  let best = null, bv = 0, bl = 0;
  for (const k of K){
    let v = 0; for (const m of K) if (k.d[0] * m.d[0] + k.d[1] * m.d[1] + k.d[2] * m.d[2] > tol) v++;
    if (v > bv || (v === bv && k.l > bl)){ bv = v; bl = k.l; best = k.d; }
  }
  const a = bv >= 2 ? best : u;
  return Math.atan2(Math.abs(a[2]), Math.hypot(a[0], a[1])) * 180 / Math.PI;
}

/* ================================================================ boutons */
function majBoutons(){
  $("bNum").classList.toggle("on", etat.num); $("bMes").classList.toggle("on", etat.mes === "d"); $("bAng").classList.toggle("on", etat.mes === "a"); $("bCtx").classList.toggle("on", etat.ctx);
  $("aide").textContent = etat.mes === "a" ? t("aideAngle") : etat.mes ? t("aideMesurer") : t("aideTourner");
}
$("sel").onchange = e => { etat.asm = e.target.value; construire(); cadrer(); carte(null); };
$("bNum").onclick = () => { etat.num = !etat.num; construire(); majBoutons(); };
$("bMes").onclick = () => { etat.mes = etat.mes === "d" ? false : "d"; etat.pts = []; carte(null); majBoutons(); dessiner(); };
$("bAng").onclick = () => { etat.mes = etat.mes === "a" ? false : "a"; etat.pts = []; carte(null); majBoutons(); dessiner(); };
$("bCtx").onclick = () => { etat.ctx = !etat.ctx; construire(); cadrer(); majBoutons(); };
$("bFit").onclick = cadrer;
$("bScanner").onclick = scanner;
$("bFinScan").onclick = () => history.back();
$("bRetour").onclick = () => history.back();
$("bRetourR").onclick = () => history.back();
$("bReglages").onclick = () => montrer("ecranReglages", true);
$("bLangue").onclick = () => { LANGUE = LANGUE === "fr" ? "en" : "fr"; garder("langue", LANGUE); traduire(); afficherJobs(); };
$("sAuto").value = reglage("auto", "0"); $("sAuto").onchange = e => { garder("auto", e.target.value); menage(); };
$("sUnites").value = reglage("unites", "imp"); $("sUnites").onchange = e => garder("unites", e.target.value);

/* ================================================================ démarrage */
async function demarrer(){
  traduire();
  if (!gl) toast("WebGL ?", 8000);
  try { await menage(); } catch (e) { /* rien */ }
  montrer("ecranJobs");
  // un code dans l'adresse (…#SMJ1.xxx) ou un fichier partagé vers l'application (« Partager » > SMJ 3D)
  const h = decodeURIComponent(location.hash || "");
  if (/SMJ1\.|[#&]j=/.test(h)){ history.replaceState(null, "", location.pathname); await ouvrirTexte(h); return; }
  if (/partage=1/.test(location.search)){
    history.replaceState(null, "", location.pathname);
    try {
      const c = await caches.open("smj3d-partage"), r = await c.match("fichier");
      if (r){ await c.delete("fichier"); await ouvrirTexte(await r.text()); }
    } catch (e) { toast(t("pasCode")); }
  }
}
if ("serviceWorker" in navigator) navigator.serviceWorker.register("sw.js").catch(() => {});
demarrer();
