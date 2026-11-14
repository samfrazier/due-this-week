import { detectStore, EDGE_STORE, SAFARI_STORE } from './storeLinks';

const EDGE_UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0';
const CHROME_UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36';
const SAFARI_UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Safari/605.1.15';

test('Safari extension pages link to the App Store', () => {
  expect(detectStore('safari-web-extension:', SAFARI_UA)).toBe(SAFARI_STORE);
  expect(detectStore('safari-web-extension:', '')).toBe(SAFARI_STORE);
});

test('Safari user agent links to the App Store even without the scheme', () => {
  expect(detectStore('https:', SAFARI_UA)).toBe(SAFARI_STORE);
});

test('Edge and Chrome link to Edge Add-ons', () => {
  expect(detectStore('chrome-extension:', EDGE_UA)).toBe(EDGE_STORE);
  expect(detectStore('chrome-extension:', CHROME_UA)).toBe(EDGE_STORE);
});

test('App Store links use the app id', () => {
  expect(SAFARI_STORE.url).toBe('https://apps.apple.com/app/id6834720024');
  expect(SAFARI_STORE.rateURL).toContain('action=write-review');
  expect(SAFARI_STORE.rateLabel).toBe('Rate on the App Store');
});
