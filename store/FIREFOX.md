# Firefox Add-ons (AMO): submission sheet

Developer Hub: https://addons.mozilla.org/developers/ (free; sign in with a Mozilla account).

| | |
|---|---|
| Add-on ID | `due-this-week@samfrazier.github.io` (in `src/manifest-firefox.json`) |
| Manifest | V3, Firefox 140+ (Android 142+) |
| Store URL | https://addons.mozilla.org/firefox/addon/due-this-week/ (slug chosen at submission) |

## Files to build
```bash
npm run package:firefox   # → due-this-week-firefox-<version>.zip  (the add-on)
npm run package:source    # → due-this-week-source-<version>.zip   (source code for reviewers; committed files only)
```
Check before uploading: `npx web-ext@10.8.0 lint --source-dir build` should show **0 errors**. Two `UNSAFE_VAR_ASSIGNMENT` warnings come from React DOM's own code (its `dangerouslySetInnerHTML` support, which we never use).

Test locally: `npx web-ext@10.8.0 run --source-dir build --start-url https://samfrazier.github.io/due-this-week/demo.html`

## Submission steps (first time)
1. **Submit a New Add-on** → *On this site* (listed on addons.mozilla.org).
2. Upload `due-this-week-firefox-<version>.zip`. Compatible with: **Firefox** (and **Firefox for Android** if offered).
3. **Source code:** answer **Yes** (the code is bundled with webpack) and upload `due-this-week-source-<version>.zip`.
4. Fill in the listing (below) and **Notes to reviewer**, then **Submit Version**.

## Listing

**Name:** Due This Week: To-do Sidebar (from the manifest)
**Add-on URL (slug):** `due-this-week`

**Summary** (250 characters max)
```
Free, private weekly to-do sidebar for Canvas and Blackboard: progress rings, one-click check-offs, a missed-assignment streak, and a "due Later" section. No accounts or tracking. Unofficial; not affiliated with Instructure.
```

**Description:** use the Chrome description in `store/CHROME.md`, with "Add the extension to Chrome" changed to "Add the extension to Firefox".

| Field | Value |
|---|---|
| Categories | **Other** (AMO has no Productivity or Education category) |
| Tags | canvas, school, homework, productivity, to-do |
| Support website | https://github.com/samfrazier/due-this-week/issues |
| Homepage | https://samfrazier.github.io/due-this-week/ |
| License | **MIT License** |
| Requires payment / experimental | No / No |
| Screenshots | `store/screenshots/` 1–6 (1280×800) |
| Icon | `store/logo-300.png` (or the manifest icon) |

**Privacy policy** (AMO asks for the text): paste the text of https://samfrazier.github.io/due-this-week/privacy.html, or this short version plus the link:
```
Due This Week does not collect, sell, or share your data. It has no accounts, no analytics, no ads, and no servers of its own. It reads your courses and assignments from your school's learning platform only inside your browser to show your to-do list, and sends requests only to that same site (and gradescope.com if you use the optional Gradescope integration). Settings are stored in your browser's extension storage. Full policy: https://samfrazier.github.io/due-this-week/privacy.html
```

## Notes to reviewer
```
No account or login is needed to test: install the add-on and open https://samfrazier.github.io/due-this-week/demo.html — the sidebar appears on the right with sample courses and assignments (progress rings, a sample 12-day streak, round check buttons, a "due Later" heading; click a heading to collapse it). The gear icon opens Settings.

Why the content script matches https://*/*: schools host Canvas and Blackboard on their own domains, so they can't be listed in advance. On other pages the script only checks whether the page is a supported LMS and stops. On a supported LMS it calls that same site's API with the user's existing session. Nothing is sent to the developer or third parties (data_collection_permissions: none). Permissions: storage only. No remote code.

Source code: the add-on is built with webpack from TypeScript/React. To reproduce:
1. Node.js 22 (npm 10), on macOS or Linux, with the `zip` command available.
2. Unzip the source archive, then run: npm ci
3. Run: npm run firefox
4. The add-on is in build/ (manifest.json at its root). It matches the uploaded package.

Linter notes: the two UNSAFE_VAR_ASSIGNMENT warnings are inside React DOM (react-dom production build, innerHTML support for dangerouslySetInnerHTML), which this add-on does not use.

Public repository: https://github.com/samfrazier/due-this-week
```
