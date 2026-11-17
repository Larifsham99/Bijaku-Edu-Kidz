// =====================================================================
//  PANGKALAN DATA — IndexedDB (utama) + localStorage (sandaran)
//  Semua kemajuan disimpan secara automatik dan kekal walaupun aplikasi ditutup.
// =====================================================================
import { todayKey } from './ui.js';
import { DEMO } from './demo.js';

const DB_NAME = DEMO ? 'dunia-cilik-demo' : 'dunia-cilik';
const STORE = 'kv';
const LS_KEY = DEMO ? 'dunia-cilik-demo-v1' : 'dunia-cilik-state-v1';
const VERSION = 1;

let db = null;
let state = null;
let saveTimer = null;
const listeners = new Set();

function openDb() {
  return new Promise((resolve) => {
    try {
      if (!('indexedDB' in self)) return resolve(null);
      const req = indexedDB.open(DB_NAME, VERSION);
      req.onupgradeneeded = () => req.result.createObjectStore(STORE);
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => resolve(null);
      req.onblocked = () => resolve(null);
    } catch { resolve(null); }
  });
}
function idbGet(key) {
  return new Promise((resolve) => {
    if (!db) return resolve(undefined);
    try {
      const r = db.transaction(STORE, 'readonly').objectStore(STORE).get(key);
      r.onsuccess = () => resolve(r.result);
      r.onerror = () => resolve(undefined);
    } catch { resolve(undefined); }
  });
}
function idbSet(key, val) {
  return new Promise((resolve) => {
    if (!db) return resolve(false);
    try {
      const tx = db.transaction(STORE, 'readwrite');
      tx.objectStore(STORE).put(val, key);
      tx.oncomplete = () => resolve(true);
      tx.onerror = () => resolve(false);
    } catch { resolve(false); }
  });
}

export function defaultSettings() {
  return {
    sound: true, music: false, voice: true, voiceRate: 0.9, vibrate: true,
    voiceStyle: 'lembut', // gaya suara: lembut (keibuan) / biasa / ceria
    voiceName: '', // kosong = pilih suara wanita terbaik secara automatik
    islamic: true, // ucapan Islamik: Bismillah, Alhamdulillah, Insya-Allah
    lang: 'ms', // 'ms' atau 'dual' (BM + English)
    timeLimit: 0, // minit sehari, 0 = tiada had
    disabledModes: [],
    lockShop: false,
    parentPin: '',
  };
}

export function newProfile({ name, age, avatar }) {
  return {
    id: 'p' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
    name: name || 'Cilik', age: age || 4, avatar: avatar || 'mimi',
    createdAt: Date.now(),
    stars: 0, coins: 0, totalStarsEarned: 0,
    modes: {}, // modeId -> { done: {lvl: stars}, plays: n, time: s }
    skills: {}, // skillId -> { rounds, firstTry, attempts, time, last }
    owned: { avatars: ['mimi', 'bobo', 'coco', 'dino', 'lala'], costumes: ['none', 'anone'], themes: ['taman', 'klasik'] },
    theme: 'taman',
    wear: { hat: 'none', acc: 'anone' },
    stickers: [], trophies: [], certs: [], badges: [],
    daily: {}, // dateKey -> { done: [idx], rewarded: bool }
    activity: {}, // dateKey -> { time: s, levels: n, rounds: n }
    freeplay: 0,
    streak: { last: '', count: 0 },
    extraTime: {}, // dateKey -> minit tambahan diberi ibu bapa
  };
}

function freshState() {
  return { v: 1, settings: defaultSettings(), profiles: [], currentId: null };
}

export async function initStore() {
  db = await openDb();
  // Minta pelayar tidak memadam data aplikasi apabila storan peranti hampir penuh
  try { if (navigator.storage?.persist) navigator.storage.persist(); } catch { /* tidak disokong */ }
  // Ambil salinan paling baharu antara IndexedDB dan localStorage (sandaran berganda)
  const fromIdb = await idbGet('state');
  let fromLs = null;
  try { const raw = localStorage.getItem(LS_KEY); if (raw) fromLs = JSON.parse(raw); } catch { /* rosak: abaikan */ }
  const valid = (x) => x && typeof x === 'object' && x.v && Array.isArray(x.profiles);
  let loaded = [fromIdb, fromLs].filter(valid).sort((a, b) => (b.savedAt || 0) - (a.savedAt || 0))[0] || null;
  state = loaded && loaded.v ? loaded : freshState();
  state.settings = { ...defaultSettings(), ...(state.settings || {}) };
  state.profiles = (state.profiles || []).map((p) => ({ ...newProfile({}), ...p, id: p.id }));
  if (!state.profiles.find((p) => p.id === state.currentId)) state.currentId = state.profiles[0]?.id || null;
  // Simpan apabila tab disembunyikan / ditutup
  addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden') flush(); });
  addEventListener('pagehide', flush);
  return state;
}

export function getState() { return state; }
export function settings() { return state.settings; }
export function profile() { return state.profiles.find((p) => p.id === state.currentId) || null; }

export function save() {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(flush, 250);
  listeners.forEach((fn) => fn());
}
export function flush() {
  clearTimeout(saveTimer);
  if (!state) return;
  state.savedAt = Date.now();
  const snapshot = JSON.parse(JSON.stringify(state));
  idbSet('state', snapshot);
  try { localStorage.setItem(LS_KEY, JSON.stringify(snapshot)); } catch { /* storan penuh */ }
}
export function onChange(fn) { listeners.add(fn); return () => listeners.delete(fn); }

export function addProfile(data) {
  const p = newProfile(data);
  state.profiles.push(p);
  state.currentId = p.id;
  save();
  return p;
}
export function switchProfile(id) { state.currentId = id; save(); }
export function deleteProfile(id) {
  state.profiles = state.profiles.filter((p) => p.id !== id);
  if (state.currentId === id) state.currentId = state.profiles[0]?.id || null;
  save();
}
export function updateProfile(id, patch) {
  const p = state.profiles.find((x) => x.id === id);
  if (p) Object.assign(p, patch);
  save();
}

// ---------- kemajuan ----------
export function modeProg(p, modeId) {
  if (!p.modes[modeId]) p.modes[modeId] = { done: {}, plays: 0, time: 0 };
  return p.modes[modeId];
}
export function levelsDone(p, modeId) { return Object.keys(p.modes[modeId]?.done || {}).length; }
export function highestUnlocked(p, modeId) {
  const done = p.modes[modeId]?.done || {};
  let n = 1;
  while (done[n] !== undefined && n < 50) n++;
  return n;
}
export function isUnlocked(p, modeId, level) {
  if (level === 1) return true;
  return (p.modes[modeId]?.done || {})[level - 1] !== undefined;
}
export function totalLevelsDone(p) { return Object.values(p.modes).reduce((s, m) => s + Object.keys(m.done || {}).length, 0); }

// Tahap keseluruhan pemain berdasarkan jumlah bintang yang pernah dikumpul
export function playerLevel(p) {
  const xp = p.totalStarsEarned || 0;
  let lvl = 1, need = 20, acc = 0;
  while (xp >= acc + need) { acc += need; lvl++; need = 20 + (lvl - 1) * 10; }
  return { lvl, into: xp - acc, need };
}

export function recordSkill(p, skill, { firstTry, attempts, time }) {
  if (!skill) return;
  const s = p.skills[skill] || (p.skills[skill] = { rounds: 0, firstTry: 0, attempts: 0, time: 0, last: 0, recent: [] });
  s.rounds++;
  if (firstTry) s.firstTry++;
  s.attempts += attempts;
  s.time += time;
  s.last = Date.now();
  s.recent = [...(s.recent || []), firstTry ? 1 : 0].slice(-10);
}

// Tahap penguasaan: 0 Belum dicuba, 1 Sedang belajar, 2 Hampir menguasai, 3 Telah menguasai
export function mastery(s) {
  if (!s || !s.rounds) return 0;
  const recent = s.recent && s.recent.length ? s.recent : [];
  const accAll = s.firstTry / s.rounds;
  const accRecent = recent.length ? recent.reduce((a, b) => a + b, 0) / recent.length : accAll;
  const acc = recent.length >= 4 ? accRecent * 0.7 + accAll * 0.3 : accAll;
  if (s.rounds >= 6 && acc >= 0.85) return 3;
  if (s.rounds >= 3 && acc >= 0.6) return 2;
  return 1;
}
export const MASTERY_LABEL = ['Belum dicuba', 'Sedang belajar', 'Hampir menguasai', 'Telah menguasai'];

export function addActivity(p, { time = 0, levels = 0, rounds = 0 } = {}) {
  const k = todayKey();
  const a = p.activity[k] || (p.activity[k] = { time: 0, levels: 0, rounds: 0 });
  a.time += time; a.levels += levels; a.rounds += rounds;
  // kira hari berturut-turut
  if (p.streak.last !== k) {
    const y = new Date(); y.setDate(y.getDate() - 1);
    p.streak.count = p.streak.last === todayKey(y) ? p.streak.count + 1 : 1;
    p.streak.last = k;
  }
}
export function todayPlaySeconds(p) { return p.activity[todayKey()]?.time || 0; }
export function totalPlaySeconds(p) { return Object.values(p.activity).reduce((s, a) => s + (a.time || 0), 0); }

export function exportData() { return JSON.stringify(state, null, 2); }
export function resetProfileProgress(id) {
  const p = state.profiles.find((x) => x.id === id);
  if (!p) return;
  const fresh = newProfile({ name: p.name, age: p.age, avatar: p.avatar });
  Object.assign(p, { ...fresh, id: p.id, createdAt: p.createdAt });
  save();
}
