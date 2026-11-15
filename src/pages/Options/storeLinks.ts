/* Which store this copy of the extension came from, so Settings can link to
   the right listing (logo, title, and the "Rate" button). */

export interface StoreInfo {
  name: 'edge' | 'safari' | 'chrome';
  url: string; // the listing
  rateURL: string; // where to leave a rating
  rateLabel: string;
}

export const EDGE_STORE: StoreInfo = {
  name: 'edge',
  url: 'https://microsoftedge.microsoft.com/addons/detail/nmdnkggpmjibggdmfkfohljgahbemckc',
  rateURL:
    'https://microsoftedge.microsoft.com/addons/detail/nmdnkggpmjibggdmfkfohljgahbemckc',
  rateLabel: 'Rate on Edge Add-ons',
};

export const SAFARI_STORE: StoreInfo = {
  name: 'safari',
  url: 'https://apps.apple.com/app/id6834720024',
  rateURL: 'https://apps.apple.com/app/id6834720024?action=write-review',
  rateLabel: 'Rate on the App Store',
};

export const CHROME_STORE: StoreInfo = {
  name: 'chrome',
  url: 'https://chromewebstore.google.com/detail/ipbbmlolhahkemkecomlmmhhopfahmnb',
  rateURL:
    'https://chromewebstore.google.com/detail/ipbbmlolhahkemkecomlmmhhopfahmnb/reviews',
  rateLabel: 'Rate on the Chrome Web Store',
};

/* Safari extension pages use the safari-web-extension: scheme. Edge says
   "Edg/" in its user agent; other Chromium browsers (Chrome, Brave, Opera,
   Vivaldi) install from the Chrome Web Store. The Safari user-agent check is
   a fallback (Chrome and Edge also say "Safari" in theirs). */
export function detectStore(protocol: string, userAgent: string): StoreInfo {
  if (protocol === 'safari-web-extension:') return SAFARI_STORE;
  if (/Edg\//.test(userAgent)) return EDGE_STORE;
  if (/(Chrome|Chromium|CriOS)\//.test(userAgent)) return CHROME_STORE;
  if (/Safari\//.test(userAgent)) return SAFARI_STORE;
  return EDGE_STORE;
}
