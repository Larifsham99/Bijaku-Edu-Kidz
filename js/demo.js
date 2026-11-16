// Mod demo (dibuka dengan ?demo dalam URL) — digunakan oleh halaman jualan.
// Demo menggunakan storan berasingan dan hanya membuka beberapa level pertama setiap mod.
export const DEMO = typeof location !== 'undefined' && new URLSearchParams(location.search).has('demo');
export const DEMO_MAX = 3;
export const SALES_URL = 'jualan/#harga';
export const demoLocked = (level) => DEMO && level > DEMO_MAX;
