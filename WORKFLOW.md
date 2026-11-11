# Bring Back Tasks for Canvas: Project Workflow

**Approach chosen: fork the original MIT-licensed code** and make it a free Edge extension.

The upstream code is cloned into this folder. Its git remote is named `upstream` and points to
`https://github.com/UseBetterCanvas/canvas-task-extension`. The latest upstream commit is `774a0fc` (Sep 2025).

---

## 1. Background (research, Nov 2026)

| Item | Finding |
|---|---|
| Original | **Tasks for Canvas** by Jeff Cheng. About 1M Chrome users, rated 4.8, also on Firefox. **Never listed on Edge Add-ons.** |
| Status | Folded into BetterCanvas, now **BetterCampus** (freemium, Pro costs $19/month). The simple, free tool is the gap we're filling. |
| License | MIT, © 2020 Jeffrey Cheng. We may fork, change and publish it, but **we must keep the copyright notice** in LICENSE. |
| Stack | TypeScript, React 17, styled-components, Webpack 5, Jest and Storybook. Manifest V3 for Chrome; Firefox uses MV2. |
| Edge publishing | Microsoft Partner Center registration is free and you can sign in with GitHub. Manifest V3 is required. Review takes up to about 7 business days. |

---

## 2. Code review findings: what must change before we publish

Found by reading `src/` (`npm` dependencies not installed yet).

### 🔴 Must fix (privacy, branding and store-policy issues)
| Where | What it does now | Change |
|---|---|---|
| `src/pages/Content/modules/hooks/useExperiment.ts` and `constants/index.ts` | On every Canvas load, fetches remote A/B-test config from `canvas-task-static.onrender.com/live.json`. Also generates and syncs a random `client_id`. | Remove the experiments system, or return an empty config. We don't control that server. |
| `src/pages/Background/index.ts` | On install, opens `tasksforcanvas.info/getting-started` (which now redirects to BetterCampus). Sets an uninstall URL that sends `client_id` and install time to their site. | Remove both, or point them to our own GitHub Pages site and send no IDs. |
| `src/manifest-chrome.json` | Name "Tasks for Canvas – now supporting Blackboard…", plus the original icon | New name, new icon, version reset to `0.1.0` (or keep 1.x) |
| `src/pages/Options/index.ts` and `index.html` | Links to the original Chrome and Firefox listings and `tasksforcanvas.info/support` | Our GitHub repo and issues page |
| `src/pages/Content/modules/constants/index.ts`, `modules/index.tsx`, `dynamic-settings`, `gradescope` | Links to `tasksforcanvas.info` and `github.com/jtcheng26/...` | Our links; keep a "based on Tasks for Canvas by Jeff Cheng" credit |
| `src/pages/Popup/index.html` | Loads Google Fonts from the network | Bundle the font locally, or use system fonts |
| `package.json` | name, homepage and repository point to the original | Our repo |

### 🟡 Review for Edge approval
- **Content script runs on `https://*/*` with `all_frames: true`.** This is because schools use custom domains. It works, but reviewers will ask about it. Options:
  1. Keep it, and explain in the submission that the extension detects Canvas, Blackboard and D2L on any school domain and does nothing elsewhere. This is the easiest path.
  2. Better privacy: ship with `*.instructure.com` and similar known domains, and add an "Add my school" button that uses `optional_host_permissions`. This is more work, but a good learning project.
- **`web_accessible_resources` exposes `options.html` to every site.** Check whether this is needed.
- **Gradescope plugin:** it scrapes gradescope.com. Decide whether to keep it for v1.

### 🟢 Fine as-is
- Permissions are just `storage`, which is minimal.
- Canvas data is fetched same-origin with the student's existing session. There's no backend and no API keys.

---

## 3. Phased workflow

### Phase 0: Get it building on your Mac
- [x] `npm ci`, which installs dependencies from the lockfile (2,165 packages; done Nov 9, 2026)
- [x] `npm run build`, which produces a `build/` folder. It works on Node 25.9 with no errors.
- [x] `npm test`. Baseline: **6 suites, 254 tests, all passing.**
- [x] Load in Edge: open `edge://extensions`, turn on **Developer mode**, click **Load unpacked**, and pick `build/`.
- [x] Open your Canvas dashboard and confirm the sidebar appears. It works, tested Nov 11, 2026 with the privacy cleanup build.
- **Learn:** npm, build tools, and loading unpacked extensions

### Phase 1: Make it ours (a GitHub fork)
- [x] Fork on GitHub: https://github.com/samfrazier/due-this-week
- [x] `origin` is your fork, and local `main` tracks `origin/main`. `upstream` is fetch-only, because pushing to it is disabled.
- [x] Name: **Due This Week**
- [ ] Update README: what it is, the credit to the original, and an "unofficial, not affiliated with Instructure" note
- **Learn:** git branches, remotes, upstream and fork, open-source etiquette

### Phase 2: Privacy and rebrand cleanup (the 🔴 list above)
Name chosen: **Due This Week**. Work is on branch `privacy-cleanup`.
- [x] Remove the remote experiments config and `client_id` (`useExperiment.ts`, `constants`, test mock)
- [x] Remove the install tab and uninstall-tracking URL (`Background/index.ts`). It now also deletes any old `client_id`.
- [x] Make `npm run build` fail loudly on compile errors (`utils/build.js`). Before, it silently kept the old build.
- [x] Rebrand: manifest name "Due This Week: To-Do Sidebar for Canvas LMS", v1.0.0, `package.json`, README with credits and disclaimer
- [x] Links: support goes to GitHub Issues, and the logo/title links to the repo until there's a store listing (`REPO_URL` / `SUPPORT_URL` in constants)
- [x] Custom-task marker: new tasks write "Created using Due This Week", and the old "Tasks for Canvas" marker is still recognized
- [x] Custom icon: artwork is in `store/icon-source.png` (512px, white background). `python3 utils/make-icons.py` makes the outer background transparent and writes icons 16/32/48/128, `store/logo-300.png`, and `store/icon-transparent-512.png`.
- [x] Replace Google Fonts in the popup and options with system fonts
- [ ] Internal `tfc-` CSS IDs and variables are kept on purpose (invisible to users, risky to rename)
- [ ] One branch and commit per item, so each change is easy to review
- [ ] Add a `src/manifest-edge.json` and a `npm run edge` build script, or reuse the Chrome manifest
- [ ] New icon (128px for the extension, 300×300 for the store)
- **Learn:** reading an unfamiliar codebase, extension APIs, safe refactoring

### Phase 3: Edge polish and fixes
- [ ] Test on Card View and List View dashboards, plus dark and high-contrast themes
- [ ] Triage the 46 open upstream issues and fix the ones that matter most
- [ ] Optional: the `optional_host_permissions` "Add my school" flow
- [ ] Optional: upgrade outdated dependencies (axios 0.21 has known security advisories)

### Phase 4: Publish to Edge Add-ons
- [ ] Register for a free Partner Center account (sign in with GitHub)
- [ ] `npm run build && npm run zip`, then upload `build.zip`
- [ ] Listing: description, 1280×800 screenshots, and a 300×300 logo
- [ ] Privacy policy on GitHub Pages ("collects no data; talks only to your school's LMS")
- [ ] Write a justification for each permission and the host match pattern
- [ ] Submit as **Hidden**, test the listing, then switch to **Public**

### Phase 5: Maintain and grow
- [ ] GitHub Actions: build, test and zip on each tag
- [ ] Watch `upstream` for useful fixes: `git fetch upstream`, then cherry-pick
- [ ] Optional: also publish to the Chrome Web Store ($5) and Firefox (free)

---

## 4. How we work each session
1. Pick the next unchecked item.
2. Brief explanation, then you make or follow the change with me.
3. Rebuild, reload at `edge://extensions`, and test on your real Canvas.
4. Commit with a clear message, then tick the box here.

---

## Sources
- Chrome Web Store listing: https://chromewebstore.google.com/detail/tasks-for-canvas/kabafodfnabokkkddjbnkgbcbmipdlmb
- Firefox listing: https://addons.mozilla.org/en-US/firefox/addon/tasks-for-canvas/
- Upstream code (MIT): https://github.com/UseBetterCanvas/canvas-task-extension
- BetterCampus (successor): https://bettercampus.com/
- Publish to Edge: https://learn.microsoft.com/en-us/microsoft-edge/extensions-chromium/publish/publish-extension
- Canvas Planner API: https://canvas.instructure.com/doc/api/planner.html
