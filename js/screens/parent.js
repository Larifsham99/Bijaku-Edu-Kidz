// Ruang Ibu Bapa: dashboard perkembangan, penilaian kemahiran, rekod aktiviti & tetapan
import { h, emo, fmtTime, todayKey, toast } from '../ui.js';
import { go } from '../nav.js';
import { getState, profile, settings, save, flush, levelsDone, totalLevelsDone, totalPlaySeconds, mastery, MASTERY_LABEL, addProfile, deleteProfile, updateProfile, switchProfile, resetProfileProgress, exportData, highestUnlocked } from '../store.js';
import { MODE_LIST, MODES, ALL_SKILLS } from '../modes/index.js';
import { AVATARS } from '../data/content.js';
import { parentGate, parentOkRecently, lockParent, avatarEl, confirmBox } from './shared.js';
import { speak, voiceInfo, startMusic, stopMusic, sfx } from '../audio.js';

const TABS = [['ringkasan', '📊 Ringkasan'], ['kemahiran', '🎯 Kemahiran'], ['aktiviti', '📅 Aktiviti'], ['tetapan', '⚙️ Tetapan'], ['profil', '👧 Profil']];

export function parentScreen(tab = 'ringkasan') {
  const scr = h('div', { class: 'screen parent' });
  if (!parentOkRecently()) {
    scr.appendChild(h('div', { class: 'topbar' }, h('button', { class: 'btn-round', type: 'button', 'aria-label': 'Kembali', onclick: () => go('/') }, '⬅️'), h('div', { class: 'title' }, 'Ruang Ibu Bapa'), h('div', { class: 'spacer' })));
    scr.appendChild(h('div', { class: 'panel center' }, h('div', { class: 'emo', style: { fontSize: '60px' } }, '🔒'), h('p', {}, 'Ruang ini dilindungi. Sila jawab soalan pengesahan.'), h('button', { class: 'btn', type: 'button', onclick: () => parentGate(() => go('/ibubapa/' + tab)) }, 'Buka')));
    setTimeout(() => parentGate(() => go('/ibubapa/' + tab)), 50);
    return scr;
  }
  const st = getState();
  const p = profile();
  scr.appendChild(h('div', { class: 'topbar' },
    h('button', { class: 'btn-round', type: 'button', 'aria-label': 'Keluar', onclick: () => { lockParent(); go('/'); } }, '⬅️'),
    h('div', { class: 'title' }, '👨‍👩‍👧 Ruang Ibu Bapa'),
    h('div', { class: 'spacer' })));
  if (st.profiles.length > 1) {
    const sel = h('select', { 'aria-label': 'Pilih anak', style: { fontSize: '17px', padding: '8px 12px', borderRadius: '12px' } }, st.profiles.map((x) => h('option', { value: x.id, selected: x.id === st.currentId }, `${x.name} (${x.age} tahun)`)));
    sel.addEventListener('change', () => { switchProfile(sel.value); go('/ibubapa/' + tab); });
    scr.appendChild(h('div', { class: 'row-wrap' }, h('b', {}, 'Profil anak:'), sel));
  }
  scr.appendChild(h('div', { class: 'tabs' }, TABS.map(([id, n]) => h('button', { class: tab === id ? 'on' : '', type: 'button', onclick: () => go('/ibubapa/' + id) }, n))));
  if (!p) { scr.appendChild(profilTab()); return scr; }
  const body = { ringkasan: ringkasanTab, kemahiran: kemahiranTab, aktiviti: aktivitiTab, tetapan: tetapanTab, profil: profilTab }[tab] || ringkasanTab;
  scr.appendChild(body(p));
  return scr;
}

function modeStats(p) {
  return MODE_LIST.map((m) => {
    const sk = Object.keys(m.skills).map((id) => p.skills[id]);
    const tried = sk.filter((s) => s && s.rounds);
    const acc = tried.length ? tried.reduce((a, s) => a + s.firstTry / s.rounds, 0) / tried.length : null;
    const lv = tried.length ? Math.round(tried.reduce((a, s) => a + mastery(s), 0) / Object.keys(m.skills).length) : 0;
    return { m, done: levelsDone(p, m.id), plays: p.modes[m.id]?.plays || 0, time: p.modes[m.id]?.time || 0, acc, lv };
  });
}

export function recommendations(p, n = 5) {
  const rec = [];
  ALL_SKILLS.forEach((s) => {
    const d = p.skills[s.id];
    const lv = mastery(d);
    if (settings().disabledModes.includes(s.mode)) return;
    if (lv === 1 || lv === 2) rec.push({ ...s, lv, acc: d.firstTry / d.rounds, why: lv === 1 ? 'Sedang belajar — perlukan lebih latihan' : 'Hampir menguasai — sedikit latihan lagi' });
  });
  rec.sort((a, b) => a.lv - b.lv || a.acc - b.acc);
  // tambah mod yang belum dicuba
  MODE_LIST.forEach((m) => { if (!settings().disabledModes.includes(m.id) && !levelsDone(p, m.id)) rec.push({ id: m.id, n: `Cuba ${m.n}`, mode: m.id, lv: 0, why: 'Belum dicuba' }); });
  return rec.slice(0, n);
}

function ringkasanTab(p) {
  const ms = modeStats(p);
  const top = [...ms].sort((a, b) => b.plays - a.plays || b.time - a.time)[0];
  const allSkills = ALL_SKILLS.map((s) => ({ ...s, lv: mastery(p.skills[s.id]) }));
  const mastered = allSkills.filter((s) => s.lv === 3);
  const wrap = h('div', { style: { display: 'flex', flexDirection: 'column', gap: '12px' } });
  wrap.appendChild(h('div', { class: 'panel', style: { display: 'flex', gap: '14px', alignItems: 'center', flexWrap: 'wrap' } }, avatarEl(p),
    h('div', {}, h('div', { style: { fontSize: '24px', fontWeight: 800 } }, p.name), h('div', { class: 'muted' }, `Umur ${p.age} tahun · mula bermain ${new Date(p.createdAt).toLocaleDateString('ms-MY')}`))));
  wrap.appendChild(h('div', { class: 'panel' }, h('h3', {}, 'Ringkasan'), h('div', { class: 'kv' },
    h('div', {}, h('b', {}, fmtTime(totalPlaySeconds(p))), h('span', {}, 'Jumlah masa bermain')),
    h('div', {}, h('b', {}, fmtTime(p.activity[todayKey()]?.time || 0)), h('span', {}, 'Masa bermain hari ini')),
    h('div', {}, h('b', {}, `${totalLevelsDone(p)} / 750`), h('span', {}, 'Level selesai')),
    h('div', {}, h('b', {}, top && top.plays ? `${top.m.e} ${top.m.n}` : '—'), h('span', {}, 'Mod paling kerap dimainkan')),
    h('div', {}, h('b', {}, `${p.stars} ⭐`), h('span', {}, 'Bintang')),
    h('div', {}, h('b', {}, `${p.coins} 🪙`), h('span', {}, 'Syiling')),
    h('div', {}, h('b', {}, `${p.trophies.length} 🏆`), h('span', {}, 'Trofi')),
    h('div', {}, h('b', {}, `${mastered.length} / ${ALL_SKILLS.length}`), h('span', {}, 'Kemahiran dikuasai')),
    h('div', {}, h('b', {}, `${p.streak.count} hari`), h('span', {}, 'Bermain berturut-turut')))));
  const rec = recommendations(p);
  wrap.appendChild(h('div', { class: 'panel' }, h('h3', {}, '💡 Cadangan permainan'),
    rec.length ? h('div', { class: 'rec-list' }, rec.map((r) => {
      const m = MODES[r.mode];
      return h('button', { type: 'button', onclick: () => { lockParent(); go(`/main/${m.id}/${highestUnlocked(p, m.id)}`); } }, `${m.e} ${r.n} — `, h('span', { class: 'muted' }, r.why), ' ▶');
    })) : h('p', { class: 'muted' }, 'Mainkan beberapa level dahulu untuk mendapat cadangan.')));
  wrap.appendChild(h('div', { class: 'panel', style: { overflowX: 'auto' } }, h('h3', {}, 'Pencapaian setiap kategori'),
    h('table', { class: 'table' }, h('thead', {}, h('tr', {}, h('th', {}, 'Mod'), h('th', {}, 'Level'), h('th', {}, 'Ketepatan'), h('th', {}, 'Masa'), h('th', {}, 'Tahap'))),
      h('tbody', {}, ms.map((s) => h('tr', {},
        h('td', {}, `${s.m.e} ${s.m.n}`),
        h('td', {}, `${s.done}/50`, h('div', { class: 'lvl-bar', style: { width: '80px' } }, h('i', { style: { width: `${s.done * 2}%` } }))),
        h('td', {}, s.acc === null ? '—' : `${Math.round(s.acc * 100)}%`),
        h('td', {}, s.time ? fmtTime(s.time) : '—'),
        h('td', {}, h('span', { class: `mbadge mb${s.done || s.acc !== null ? Math.max(1, s.lv) : 0}` }, MASTERY_LABEL[s.done || s.acc !== null ? Math.max(1, s.lv) : 0]))))))));
  return wrap;
}

function kemahiranTab(p) {
  const wrap = h('div', { style: { display: 'flex', flexDirection: 'column', gap: '12px' } });
  const all = ALL_SKILLS.map((s) => ({ ...s, d: p.skills[s.id], lv: mastery(p.skills[s.id]) }));
  const mastered = all.filter((s) => s.lv === 3), need = all.filter((s) => s.lv === 1 || s.lv === 2);
  wrap.appendChild(h('div', { class: 'panel' }, h('h3', {}, '✅ Kemahiran yang sudah dikuasai'),
    mastered.length ? h('div', { class: 'row-wrap', style: { justifyContent: 'flex-start' } }, mastered.map((s) => h('span', { class: 'mbadge mb3' }, `${MODES[s.mode].e} ${s.n}`))) : h('p', { class: 'muted' }, 'Belum ada lagi — teruskan bermain!')));
  wrap.appendChild(h('div', { class: 'panel' }, h('h3', {}, '📌 Kemahiran yang memerlukan latihan'),
    need.length ? h('div', { class: 'row-wrap', style: { justifyContent: 'flex-start' } }, need.map((s) => h('span', { class: `mbadge mb${s.lv}` }, `${MODES[s.mode].e} ${s.n}`))) : h('p', { class: 'muted' }, 'Tiada buat masa ini.')));
  wrap.appendChild(h('div', { class: 'panel muted', style: { fontSize: '14px' } },
    'Penilaian berdasarkan: ketepatan jawapan pada cubaan pertama, bilangan cubaan, masa menyelesaikan, dan prestasi 10 pusingan terkini. ',
    'Tahap: Belum dicuba → Sedang belajar → Hampir menguasai (≥60%, ≥3 pusingan) → Telah menguasai (≥85%, ≥6 pusingan).'));
  MODE_LIST.forEach((m) => {
    wrap.appendChild(h('div', { class: 'panel', style: { overflowX: 'auto' } }, h('h3', {}, `${m.e} ${m.n}`),
      h('table', { class: 'table' }, h('thead', {}, h('tr', {}, h('th', {}, 'Kemahiran'), h('th', {}, 'Tahap'), h('th', {}, 'Ketepatan'), h('th', {}, 'Purata cubaan'), h('th', {}, 'Purata masa'), h('th', {}, 'Pusingan'))),
        h('tbody', {}, Object.entries(m.skills).map(([id, n]) => {
          const d = p.skills[id], lv = mastery(d);
          return h('tr', {}, h('td', {}, n), h('td', {}, h('span', { class: `mbadge mb${lv}` }, MASTERY_LABEL[lv])),
            h('td', {}, d ? `${Math.round((d.firstTry / d.rounds) * 100)}%` : '—'),
            h('td', {}, d ? (d.attempts / d.rounds).toFixed(1) : '—'),
            h('td', {}, d ? `${Math.round(d.time / d.rounds)} s` : '—'),
            h('td', {}, d ? d.rounds : 0));
        })))));
  });
  return wrap;
}

function aktivitiTab(p) {
  const wrap = h('div', { style: { display: 'flex', flexDirection: 'column', gap: '12px' } });
  const days = Array.from({ length: 7 }, (_, i) => { const d = new Date(); d.setDate(d.getDate() - (6 - i)); return d; });
  const data = days.map((d) => ({ d, k: todayKey(d), a: p.activity[todayKey(d)] || { time: 0, levels: 0, rounds: 0 } }));
  const max = Math.max(60, ...data.map((x) => x.a.time));
  const dn = ['Ahd', 'Isn', 'Sel', 'Rab', 'Kha', 'Jum', 'Sab'];
  wrap.appendChild(h('div', { class: 'panel' }, h('h3', {}, 'Masa bermain 7 hari terakhir'),
    h('div', { class: 'bars' }, data.map((x) => h('div', { class: 'bar' }, h('span', {}, x.a.time ? `${Math.round(x.a.time / 60)}m` : ''), h('i', { style: { height: `${(x.a.time / max) * 100}%` } }), h('span', {}, dn[x.d.getDay()]))))));
  wrap.appendChild(h('div', { class: 'panel', style: { overflowX: 'auto' } }, h('h3', {}, 'Rekod harian'),
    h('table', { class: 'table' }, h('thead', {}, h('tr', {}, h('th', {}, 'Tarikh'), h('th', {}, 'Masa'), h('th', {}, 'Level'), h('th', {}, 'Pusingan'), h('th', {}, 'Cabaran harian'))),
      h('tbody', {}, [...data].reverse().map((x) => h('tr', {}, h('td', {}, x.d.toLocaleDateString('ms-MY', { weekday: 'short', day: 'numeric', month: 'short' })), h('td', {}, fmtTime(x.a.time)), h('td', {}, x.a.levels), h('td', {}, x.a.rounds), h('td', {}, `${p.daily[x.k]?.done?.length || 0}/5`)))))));
  // mingguan (4 minggu)
  const weeks = Array.from({ length: 4 }, (_, w) => {
    let time = 0, levels = 0, rounds = 0;
    for (let i = 0; i < 7; i++) { const d = new Date(); d.setDate(d.getDate() - (w * 7 + i)); const a = p.activity[todayKey(d)]; if (a) { time += a.time; levels += a.levels; rounds += a.rounds; } }
    return { w, time, levels, rounds };
  });
  wrap.appendChild(h('div', { class: 'panel', style: { overflowX: 'auto' } }, h('h3', {}, 'Rekod mingguan'),
    h('table', { class: 'table' }, h('thead', {}, h('tr', {}, h('th', {}, 'Minggu'), h('th', {}, 'Masa'), h('th', {}, 'Level'), h('th', {}, 'Pusingan'))),
      h('tbody', {}, weeks.map((x) => h('tr', {}, h('td', {}, x.w === 0 ? '7 hari lepas' : `${x.w * 7 + 1}–${x.w * 7 + 7} hari lepas`), h('td', {}, fmtTime(x.time)), h('td', {}, x.levels), h('td', {}, x.rounds)))))));
  return wrap;
}

function toggle(label, on, onChange, sub = '') {
  const b = h('button', { class: `switch ${on ? 'on' : ''}`, type: 'button', role: 'switch', 'aria-checked': String(on), 'aria-label': label });
  b.addEventListener('click', () => { on = !on; b.classList.toggle('on', on); b.setAttribute('aria-checked', String(on)); onChange(on); });
  return h('div', { class: 'toggle-row' }, h('div', {}, label, sub ? h('div', { class: 'muted', style: { fontSize: '13px' } }, sub) : null), b);
}

function tetapanTab() {
  const s = settings();
  const wrap = h('div', { style: { display: 'flex', flexDirection: 'column', gap: '12px' } });
  const sel = (opts, val, onCh) => { const e = h('select', { style: { fontSize: '16px', padding: '8px', borderRadius: '10px' } }, opts.map(([v, n]) => h('option', { value: v, selected: String(v) === String(val) }, n))); e.addEventListener('change', () => onCh(e.value)); return e; };
  wrap.appendChild(h('div', { class: 'panel' }, h('h3', {}, '⏰ Had masa bermain'),
    h('div', { class: 'toggle-row' }, h('div', {}, 'Had masa sehari', h('div', { class: 'muted', style: { fontSize: '13px' } }, 'Apabila tamat, anak akan diminta berehat.')),
      sel([[0, 'Tiada had'], [10, '10 minit'], [15, '15 minit'], [20, '20 minit'], [30, '30 minit'], [45, '45 minit'], [60, '1 jam'], [90, '1 jam 30 minit']], s.timeLimit, (v) => { s.timeLimit = +v; save(); toast('Disimpan', 'good', '✅'); }))));
  wrap.appendChild(h('div', { class: 'panel' }, h('h3', {}, '🔊 Bunyi & suara'),
    toggle('Kesan bunyi', s.sound, (v) => { s.sound = v; save(); }),
    toggle('Muzik latar', s.music, (v) => { s.music = v; save(); v ? startMusic() : stopMusic(); }),
    toggle('Suara arahan (Bahasa Melayu)', s.voice, (v) => { s.voice = v; save(); }, voiceInfo()),
    h('div', { class: 'toggle-row' }, h('div', {}, 'Kelajuan suara'), sel([[0.7, 'Perlahan'], [0.9, 'Biasa'], [1.05, 'Laju']], s.voiceRate, (v) => { s.voiceRate = +v; save(); speak('Mari kita cari huruf A!'); })),
    h('div', { class: 'row-wrap', style: { justifyContent: 'flex-start', marginTop: '8px' } }, h('button', { class: 'btn small blue', type: 'button', onclick: () => speak('Bagus! Kamu berjaya! Hebat! Kamu semakin bijak!') }, '▶ Uji suara'), h('button', { class: 'btn small ghost', type: 'button', onclick: () => sfx.win() }, '▶ Uji bunyi'))));
  wrap.appendChild(h('div', { class: 'panel' }, h('h3', {}, '🌐 Bahasa'),
    h('div', { class: 'toggle-row' }, h('div', {}, 'Bahasa permainan', h('div', { class: 'muted', style: { fontSize: '13px' } }, 'Dwibahasa memaparkan dan menyebut nama objek dalam Bahasa Inggeris juga.')),
      sel([['ms', 'Bahasa Melayu'], ['dual', 'Dwibahasa (BM + English)']], s.lang, (v) => { s.lang = v; save(); toast('Disimpan', 'good', '✅'); }))));
  wrap.appendChild(h('div', { class: 'panel' }, h('h3', {}, '🔐 Akses aplikasi'),
    toggle('Kedai kostum perlu kebenaran ibu bapa', s.lockShop, (v) => { s.lockShop = v; save(); }, 'Syiling hanya mata wang permainan. Tiada pembelian wang sebenar dalam aplikasi ini.'),
    h('div', { class: 'muted', style: { fontSize: '14px', margin: '10px 0 4px' } }, 'Mod permainan yang dibenarkan:'),
    ...MODE_LIST.map((m) => toggle(`${m.e} ${m.n}`, !s.disabledModes.includes(m.id), (v) => { s.disabledModes = v ? s.disabledModes.filter((x) => x !== m.id) : [...s.disabledModes, m.id]; save(); }))));
  wrap.appendChild(h('div', { class: 'panel' }, h('h3', {}, '💾 Data'),
    h('p', { class: 'muted', style: { fontSize: '14px' } }, 'Semua kemajuan disimpan secara automatik dalam peranti ini sahaja (IndexedDB). Tiada data dihantar ke internet.'),
    h('div', { class: 'row-wrap', style: { justifyContent: 'flex-start' } },
      h('button', { class: 'btn small blue', type: 'button', onclick: () => {
        flush();
        const blob = new Blob([exportData()], { type: 'application/json' });
        const a = h('a', { href: URL.createObjectURL(blob), download: `dunia-cilik-sandaran-${todayKey()}.json` });
        document.body.appendChild(a); a.click(); a.remove();
      } }, '⬇ Simpan sandaran'),
      (() => {
        const inp = h('input', { type: 'file', accept: 'application/json', style: { display: 'none' } });
        inp.addEventListener('change', async () => {
          const f = inp.files[0]; if (!f) return;
          try {
            const data = JSON.parse(await f.text());
            if (!data.profiles || !data.settings) throw new Error('format');
            confirmBox('Pulihkan sandaran? Data semasa akan diganti.', () => {
              const st = getState();
              st.profiles = data.profiles; st.settings = { ...st.settings, ...data.settings }; st.currentId = data.currentId || data.profiles[0]?.id || null;
              save(); flush(); toast('Sandaran dipulihkan', 'good', '✅'); go('/ibubapa/ringkasan');
            });
          } catch { toast('Fail sandaran tidak sah', 'try', '⚠️'); }
        });
        return h('span', {}, inp, h('button', { class: 'btn small ghost', type: 'button', onclick: () => inp.click() }, '⬆ Pulihkan sandaran'));
      })())));
  return wrap;
}

function profileForm(initial, onSave, title) {
  let av = initial.avatar || 'mimi';
  const name = h('input', { type: 'text', maxlength: '16', value: initial.name || '', 'aria-label': 'Nama' });
  const age = h('select', {}, [3, 4, 5, 6].map((a) => h('option', { value: a, selected: a === (initial.age || 4) }, `${a} tahun`)));
  const avs = h('div', { class: 'row-wrap', style: { justifyContent: 'flex-start' } });
  const drawAv = () => avs.replaceChildren(...AVATARS.filter((a) => a.cost === 0 || (initial.owned?.avatars || []).includes(a.id)).map((a) => h('button', { class: `coll-item ${a.id === av ? 'on' : ''}`, type: 'button', style: { padding: '6px' }, onclick: () => { av = a.id; drawAv(); } }, h('span', { class: 'emo', style: { fontSize: '34px' } }, a.e))));
  drawAv();
  return h('div', { class: 'panel', style: { display: 'flex', flexDirection: 'column', gap: '10px' } }, h('h3', {}, title),
    h('div', { class: 'field' }, h('label', {}, 'Nama anak'), name),
    h('div', { class: 'field' }, h('label', {}, 'Umur'), age),
    h('div', { class: 'field' }, h('label', {}, 'Avatar'), avs),
    h('div', {}, h('button', { class: 'btn small green', type: 'button', onclick: () => { if (!name.value.trim()) { toast('Sila isi nama', 'try', '✏️'); return; } onSave({ name: name.value.trim(), age: +age.value, avatar: av }); } }, 'Simpan')));
}

function profilTab() {
  const st = getState();
  const wrap = h('div', { style: { display: 'flex', flexDirection: 'column', gap: '12px' } });
  wrap.appendChild(h('div', { class: 'panel muted', style: { fontSize: '14px' } }, 'Hanya nama panggilan dan umur disimpan — tiada maklumat peribadi lain dikumpul.'));
  st.profiles.forEach((p) => {
    wrap.appendChild(h('div', { class: 'panel', style: { display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' } },
      avatarEl(p),
      h('div', { style: { flex: 1, minWidth: '160px' } }, h('div', { style: { fontWeight: 800, fontSize: '20px' } }, p.name, p.id === st.currentId ? ' (aktif)' : ''), h('div', { class: 'muted' }, `${p.age} tahun · ${totalLevelsDone(p)} level · ⭐ ${p.stars}`)),
      h('div', { class: 'row-wrap' },
        p.id !== st.currentId ? h('button', { class: 'btn small blue', type: 'button', onclick: () => { switchProfile(p.id); go('/ibubapa/profil'); } }, 'Guna') : null,
        h('button', { class: 'btn small ghost', type: 'button', onclick: () => { const f = profileForm(p, (d) => { updateProfile(p.id, d); toast('Disimpan', 'good', '✅'); go('/ibubapa/profil'); }, `Sunting ${p.name}`); wrap.prepend(f); f.scrollIntoView({ behavior: 'smooth' }); } }, 'Sunting'),
        h('button', { class: 'btn small ghost', type: 'button', onclick: () => confirmBox(`Set semula semua kemajuan ${p.name}?`, () => { resetProfileProgress(p.id); toast('Kemajuan diset semula', 'good', '🔄'); go('/ibubapa/profil'); }, { emoji: '🔄' }) }, 'Set semula'),
        h('button', { class: 'btn small red', type: 'button', onclick: () => confirmBox(`Padam profil ${p.name}? Tindakan ini tidak boleh dibatalkan.`, () => { deleteProfile(p.id); go(getState().profiles.length ? '/ibubapa/profil' : '/'); }, { emoji: '🗑️', yes: 'Padam' }) }, 'Padam'))));
  });
  wrap.appendChild(profileForm({}, (d) => { addProfile(d); toast(`Profil ${d.name} ditambah`, 'good', '🎉'); go('/ibubapa/profil'); }, '➕ Tambah profil anak'));
  return wrap;
}
