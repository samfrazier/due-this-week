/*
 * Due This Week: background service worker.
 *
 * Upstream used this file to open the original author's website on install
 * and to set an uninstall URL that sent the install time and a random client
 * ID to that site. We removed both, so the extension makes no requests except
 * to the user's own LMS.
 *
 * The file is kept because manifest.json registers it as the service worker.
 * Future background logic (for example, a badge count) can go here.
 */

// Clean up the tracking ID that older upstream versions stored, in case
// someone's synced settings carry it over.
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.remove(['client_id', 'install_time']);
});

// The sidebar's ⚙️ button asks us to open Settings. Content scripts can't
// call openOptionsPage() themselves.
chrome.runtime.onMessage.addListener((message) => {
  if (message && message.type === 'open-options') {
    chrome.runtime.openOptionsPage();
  }
});
