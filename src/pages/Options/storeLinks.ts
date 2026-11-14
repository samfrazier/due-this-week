/* Which store this copy of the extension came from, so Settings can link to
   the right listing (logo, title, and the "Rate" button). */

export interface StoreInfo {
  name: 'edge' | 'safari';
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

/* Safari extension pages use the safari-web-extension: scheme. The user-agent
   check is a fallback (Chrome and Edge also say "Safari" in theirs). */
export function detectStore(protocol: string, userAgent: string): StoreInfo {
  if (protocol === 'safari-web-extension:') return SAFARI_STORE;
  const isSafari =
    /Safari\//.test(userAgent) &&
    !/(Chrome|Chromium|CriOS|Edg|OPR)\//.test(userAgent);
  return isSafari ? SAFARI_STORE : EDGE_STORE;
}
