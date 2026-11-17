// =====================================================================
//  SET IKON — SVG dilukis khas supaya rupa butang konsisten pada semua
//  peranti (emoji berbeza rupa antara Android, iPhone & Windows).
//  Ikon garis menggunakan currentColor; ikon "lencana" berwarna penuh.
// =====================================================================
const S = (d, extra = '') => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"${extra}>${d}</svg>`;

const LINE = {
  back: '<path d="M14.5 5 7.5 12l7 7"/><path d="M8 12h10"/>',
  close: '<path d="M6 6l12 12M18 6 6 18"/>',
  sound: '<path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z" fill="currentColor"/><path d="M15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11"/>',
  mute: '<path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z" fill="currentColor"/><path d="M16 9.5l5 5M21 9.5l-5 5"/>',
  play: '<path d="M8 5.5v13l10.5-6.5z" fill="currentColor"/>',
  replay: '<path d="M4.5 12a7.5 7.5 0 1 0 2.2-5.3"/><path d="M4 4.5v4.5h4.5"/>',
  next: '<path d="M9.5 5l7 7-7 7"/><path d="M16 12H6"/>',
  home: '<path d="M4 11.5 12 5l8 6.5"/><path d="M6.5 10v9h11v-9"/><path d="M10.5 19v-4.5h3V19"/>',
  map: '<path d="M3.5 6.5 9 4.5l6 2 5.5-2v13l-5.5 2-6-2-5.5 2z"/><path d="M9 4.5v13M15 6.5v13"/>',
  hint: '<path d="M9 17.5h6M10 20.5h4"/><path d="M12 3.5a5.8 5.8 0 0 0-3.4 10.5c.6.5.9 1 .9 1.7v.3h5v-.3c0-.7.3-1.2.9-1.7A5.8 5.8 0 0 0 12 3.5z"/>',
  check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
  lock: '<rect x="5" y="10.5" width="14" height="10" rx="2.5" fill="currentColor" stroke="none"/><path d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  grid: '<rect x="4" y="4" width="7" height="7" rx="2"/><rect x="13" y="4" width="7" height="7" rx="2"/><rect x="4" y="13" width="7" height="7" rx="2"/><rect x="13" y="13" width="7" height="7" rx="2"/>',
  user: '<circle cx="12" cy="8.5" r="4"/><path d="M4.5 20a7.5 7.5 0 0 1 15 0"/>',
  print: '<path d="M7 9V4h10v5"/><rect x="4" y="9" width="16" height="8" rx="2"/><path d="M7.5 14h9v6h-9z" fill="#fff"/>',
  trash: '<path d="M5 7h14M10 7V5h4v2M7 7l1 13h8l1-13"/>',
  brush: '<path d="M14.5 4.5l5 5-8 8-5-5z"/><path d="M6.5 12.5c-2 .5-3 2-3 4.5 0 1.5-.5 2.5-1 3 3 .5 6.5-.5 7.5-4"/>',
  eraser: '<path d="M4 15.5 13.5 6l5 5L9 20.5H5.5z"/><path d="M9 20.5h11"/>',
  arrowUp: '<path d="M12 19V5M5.5 11.5 12 5l6.5 6.5"/>',
  arrowDown: '<path d="M12 5v14M5.5 12.5 12 19l6.5-6.5"/>',
  arrowLeft: '<path d="M19 12H5M11.5 5.5 5 12l6.5 6.5"/>',
  arrowRight: '<path d="M5 12h14M12.5 5.5 19 12l-6.5 6.5"/>',
  gear: '<circle cx="12" cy="12" r="3.2"/><path d="M12 2.8v2.4M12 18.8v2.4M2.8 12h2.4M18.8 12h2.4M5.5 5.5l1.7 1.7M16.8 16.8l1.7 1.7M5.5 18.5l1.7-1.7M16.8 7.2l1.7-1.7"/>',
};

// Ikon berwarna (ilustrasi kecil)
const COLOR = {
  wau: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 1.5C9 5.5 6.5 6.2 2 7c3.4 2.2 6.5 3 9.6 4.3-3.4 1.2-6.4 2.8-8 6.3 3.6-1 6.4-1.2 8.4.4 2-1.6 4.8-1.4 8.4-.4-1.6-3.5-4.6-5.1-8-6.3C15.5 10 18.6 9.2 22 7c-4.5-.8-7-1.5-10-5.5z" fill="#fff6e6"/><path d="M12 4c-1.8 2.8-3.6 3.6-6 4.2 2.4 1.4 4.3 2 6 2.8 1.7-.8 3.6-1.4 6-2.8-2.4-.6-4.2-1.4-6-4.2z" fill="#f2a922"/><path d="M12 12.6c-2 1-3.8 2-5 3.8 2-.4 3.6-.3 5 .8 1.4-1.1 3-1.2 5-.8-1.2-1.8-3-2.8-5-3.8z" fill="#e2553f"/><path d="M12 18v4.5" stroke="#fff6e6" stroke-width="1.4" stroke-linecap="round"/></svg>',
  kain: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.5a2 2 0 0 1 2 2c0 1-1 1.4-2 2.2L3.5 12h17L12 6.7" fill="none" stroke="#fff6e6" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/><path d="M4 12h16l-1.5 9.5h-13z" fill="#fff6e6"/><path d="M4.4 15h15.2M4.9 18h14.2" stroke="#e2553f" stroke-width="1.4"/><path d="M8 12.5l1 1.5 1-1.5M14 12.5l1 1.5 1-1.5M11 15.5l1 1.5 1-1.5M6.5 18.6l1 1.4 1-1.4M15.5 18.6l1 1.4 1-1.4" stroke="#f2a922" stroke-width="1.1" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  star: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.6l2.9 5.9 6.5.9-4.7 4.6 1.1 6.5L12 17.4l-5.8 3.1 1.1-6.5L2.6 9.4l6.5-.9z" fill="#ffd23f" stroke="#f29b05" stroke-width="1.6" stroke-linejoin="round"/><path d="M9 9.5l1.5-.3" stroke="#fff6c9" stroke-width="1.6" stroke-linecap="round"/></svg>',
  coin: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9.5" fill="#ffc531" stroke="#e08a00" stroke-width="1.6"/><circle cx="12" cy="12" r="6.3" fill="none" stroke="#fff1b8" stroke-width="1.5"/><path d="M12 8.5l1.1 2.2 2.4.3-1.8 1.7.5 2.4-2.2-1.2-2.2 1.2.5-2.4-1.8-1.7 2.4-.3z" fill="#fff6d6"/></svg>',
  trophy: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 4h10v5a5 5 0 0 1-10 0z" fill="#ffc531" stroke="#e08a00" stroke-width="1.5"/><path d="M7 6H4.5a3 3 0 0 0 3 4M17 6h2.5a3 3 0 0 1-3 4" fill="none" stroke="#e08a00" stroke-width="1.5" stroke-linecap="round"/><path d="M10.5 13.5h3l.5 3.5h-4z" fill="#e8a317"/><rect x="7.5" y="17" width="9" height="3.5" rx="1.2" fill="#8d5cff"/><path d="M9.5 6.5v2.5" stroke="#fff3c4" stroke-width="1.5" stroke-linecap="round"/></svg>',
  medal: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 2.5h4l2 6H9zM17 2.5h-4l-2 6h4z" fill="#ff6b8b"/><circle cx="12" cy="15" r="6.3" fill="#ffc531" stroke="#e08a00" stroke-width="1.5"/><path d="M12 11.6l1 2 2.2.3-1.6 1.5.4 2.2-2-1.1-2 1.1.4-2.2-1.6-1.5 2.2-.3z" fill="#fff6d6"/></svg>',
  calendar: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="4.5" width="18" height="16.5" rx="3.5" fill="#fff"/><path d="M3 8a3.5 3.5 0 0 1 3.5-3.5h11A3.5 3.5 0 0 1 21 8v2H3z" fill="#e2553f"/><path d="M8 2.8v3.5M16 2.8v3.5" stroke="#3d3256" stroke-width="1.8" stroke-linecap="round"/><path d="M12 12.3l1.1 2.2 2.4.3-1.8 1.7.5 2.4-2.2-1.2-2.2 1.2.5-2.4-1.8-1.7 2.4-.3z" fill="#ffc531"/></svg>',
  wand: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 20 15 9" stroke="#3d3256" stroke-width="2.6" stroke-linecap="round"/><path d="M13.5 10.5 15 9" stroke="#fff" stroke-width="2.6" stroke-linecap="round"/><path d="M17 2.5l.9 2.1 2.1.9-2.1.9-.9 2.1-.9-2.1-2.1-.9 2.1-.9z" fill="#ffd23f"/><path d="M20.5 9.5l.5 1.1 1.1.5-1.1.5-.5 1.1-.5-1.1-1.1-.5 1.1-.5z" fill="#fff"/><path d="M9.5 3l.6 1.3 1.3.6-1.3.6-.6 1.3-.6-1.3-1.3-.6 1.3-.6z" fill="#fff"/></svg>',
  balloon: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.5a6.5 7 0 0 1 6.5 7c0 4.2-3.6 7.3-6.5 7.8-2.9-.5-6.5-3.6-6.5-7.8a6.5 7 0 0 1 6.5-7z" fill="#ff5d8f"/><path d="M8.7 6.5a3.5 3.5 0 0 1 2.3-1.7" stroke="#ffd0df" stroke-width="1.6" stroke-linecap="round"/><path d="M11 17.3h2l-1 1.4z" fill="#ff5d8f"/><path d="M12 18.7c-1 1.2.9 1.8-.2 3" fill="none" stroke="#fff" stroke-width="1.4" stroke-linecap="round"/></svg>',
  parent: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.8 19.5 5.6v5.6c0 4.8-3.1 8.4-7.5 10-4.4-1.6-7.5-5.2-7.5-10V5.6z" fill="#fff"/><path d="M12 9.2c1.4-2.3 5-1.3 4.6 1.4-.3 2.1-3.3 4-4.6 4.9-1.3-.9-4.3-2.8-4.6-4.9-.4-2.7 3.2-3.7 4.6-1.4z" fill="#ff5d8f"/></svg>',
  rocket: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.5c3.5 2.5 5 6.5 4 11.5H8C7 9 8.5 5 12 2.5z" fill="#fff"/><circle cx="12" cy="9" r="2" fill="#54a0ff"/><path d="M8 14l-3 3.5 3.5-.5zM16 14l3 3.5-3.5-.5z" fill="#ff5d5d"/><path d="M10 15.5h4l-2 5.5z" fill="#ffc531"/></svg>',
  paint: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3a9 9 0 1 0 0 18c1.4 0 1.9-1 1.5-2.2-.5-1.4.2-2.6 1.7-2.6H17a4 4 0 0 0 4-4A9 9 0 0 0 12 3z" fill="#fff"/><circle cx="7.5" cy="11" r="1.6" fill="#ff5d5d"/><circle cx="10" cy="7" r="1.6" fill="#ffc531"/><circle cx="14.5" cy="7" r="1.6" fill="#2fc77a"/><circle cx="17" cy="10.5" r="1.6" fill="#3d8bff"/></svg>',
};

// icon('back') -> elemen <span class="ic"> berisi SVG
export function icon(name, cls = '') {
  const s = document.createElement('span');
  s.className = `ic ${COLOR[name] ? 'ic-color' : ''} ${cls}`.trim();
  s.innerHTML = COLOR[name] || S(LINE[name] || LINE.grid);
  return s;
}
export const hasIcon = (name) => !!(COLOR[name] || LINE[name]);
