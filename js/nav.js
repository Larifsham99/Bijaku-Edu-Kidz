// Navigasi berasaskan hash (butang "kembali" Android berfungsi)
export function go(path) {
  if (location.hash === '#' + path) dispatchEvent(new HashChangeEvent('hashchange'));
  else location.hash = path;
}
