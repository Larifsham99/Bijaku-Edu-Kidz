// =====================================================================
//  KAMERA (ringan): dibuka hanya apabila diminta, ditutup serta-merta.
//  Resolusi rendah untuk menjimatkan bateri & CPU. Tiada muat naik.
// =====================================================================
import { settings } from './store.js';

export const cameraAllowed = () => settings().camera !== false;
export const cameraSupported = () => !!(typeof navigator !== 'undefined' && navigator.mediaDevices?.getUserMedia && window.isSecureContext !== false);

export async function openCamera(facing = 'user', size = 480) {
  if (!cameraAllowed()) throw Object.assign(new Error('dikunci'), { code: 'locked' });
  if (!cameraSupported()) throw Object.assign(new Error('tiada'), { code: 'none' });
  try {
    return await navigator.mediaDevices.getUserMedia({ audio: false, video: { facingMode: { ideal: facing }, width: { ideal: size }, height: { ideal: Math.round(size * 0.75) }, frameRate: { ideal: 24, max: 30 } } });
  } catch (e) {
    throw Object.assign(new Error(e?.name || 'gagal'), { code: e?.name === 'NotAllowedError' ? 'denied' : 'none' });
  }
}
export function stopCamera(stream) { try { stream?.getTracks().forEach((t) => t.stop()); } catch { /* */ } }

// mesej mesra kanak-kanak / ibu bapa
export function cameraMessage(code) {
  return code === 'locked' ? 'Kamera ditutup oleh ibu bapa.'
    : code === 'denied' ? 'Kamera belum dibenarkan. Minta ibu atau ayah tekan "Benarkan".'
      : 'Kamera tidak dapat dibuka pada peranti ini.';
}

// kurangkan bateri: hentikan kamera apabila aplikasi disembunyikan
export function autoPause(stream, onResume) {
  const h = () => { if (document.hidden) stopCamera(stream()); else onResume?.(); };
  document.addEventListener('visibilitychange', h);
  return () => document.removeEventListener('visibilitychange', h);
}
