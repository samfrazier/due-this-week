# Due This Week: Roadmap

> **Mission:** the forever-free, private to-do sidebar for every learning management system, in every major browser.

## Promises that don't change
- **Free forever.** No paid tiers, no ads, no "Pro" features.
- **Private by design.** No accounts, no analytics, no servers. It talks only to the student's own LMS.
- **Open source** under the MIT license, crediting the original Tasks for Canvas by Jeff Cheng.
- **Honest support claims.** We only say we support a platform after it's been tested on a real account.

Any feature that would break one of these promises is out of scope.

---

## Where we are (v1.0.0, Nov 2026)
| Area | Status |
|---|---|
| Microsoft Edge | ✅ [Published on Edge Add-ons](https://microsoftedge.microsoft.com/addons/detail/nmdnkggpmjibggdmfkfohljgahbemckc) |
| Canvas LMS | ✅ Tested on a real account (Card View dashboard); 262 automated tests |
| Blackboard | ⚠️ Code inherited from upstream (Jan 2025), **untested here, 0 tests**. Upstream issues #154 and #170 report it "failed to load". |
| D2L Brightspace | ⏸️ **Paused (Nov 2026).** Switched off (`BRIGHTSPACE_ENABLED = false`) and removed from the supported list until we find a D2L tester. The upstream code is kept. |
| Gradescope (add-on to Canvas) | ⚠️ Inherited, untested here |
| Automated checks on GitHub | ⚠️ The workflow is updated, but **Actions must be turned on** in the repo once |

---

## v1.0.1: polish (ready on branch `settings-feedback`)
- [x] Settings uses the logo's blue (`#0079EE`) instead of the old red
- [x] Feedback section: **Rate on Edge Add-ons**, plus **Report a bug or suggest a feature** (GitHub forms that ask which LMS and browser)
- [x] Settings logo links to the store listing
- [x] Removed the upstream auto-publish workflow (it targeted the original author's Chrome listing and email)
- [x] CI updated to Node 20/22 with type check, build, lint, and tests
- [ ] Turn on GitHub Actions for the repo (owner, one click)
- [ ] Bump the version to 1.0.1, `npm run package`, upload under **Packages** in Partner Center

---

## Track A: verify Blackboard and D2L (v1.1)
> **D2L is paused** until a tester is found: no D2L work until then. Blackboard continues.
Goal: move them from ⚠️ to ✅ honestly. Blackboard and D2L generally need a school account, so we need help.

1. **Find testers.** Ask friends or classmates at Blackboard and D2L schools, and post in student communities. The bug form already asks which LMS people use.
2. **First-look checklist** for each tester: does the sidebar appear, do the assignments match, do mark complete and New Task work. Note the dashboard version (Blackboard *Learn Original* vs *Ultra*, D2L theme).
3. **Debug export (privacy-safe).** Add a hidden "Copy diagnostics" button that copies only *structure* (which API endpoints answered, field names, counts, error messages) and **never** names, titles, or grades. Testers paste it into an issue.
4. **Fixture tests.** Turn that structure into anonymized sample data and write tests like Canvas's, so Blackboard and D2L stay working.
5. **Fix what's broken** (starting with upstream #154 and #170).
6. **Demo pages** for Blackboard and D2L (like `docs/demo.html`) for screenshots and store reviewers.
7. Only then update the README, listing and website to say "verified".

## Track B: more browsers (v1.2)
One codebase, one manifest per browser, released together.

| Store | Cost to publish | Work needed | Covers |
|---|---|---|---|
| **Chrome Web Store** | $5 one-time developer fee | Same zip as Edge, plus a listing (reuse ours) | Chrome, and installable in Brave, Vivaldi and Arc |
| **Firefox Add-ons** | Free | `manifest-firefox.json` is still MV2; move it to MV3, test `npm run firefox`, add a Firefox build to `npm run package` | Firefox, Zen and other Firefox-based browsers |
| **Opera Add-ons** | Free | Same zip as Chrome | Opera, Opera GX |
| **Safari** | $99/year Apple Developer Program | Convert with Xcode's Safari web extension converter, test on Mac and iPad | Safari (Mac and iPad); upstream issues #103 and #164 asked for this |

To-dos for this track:
- Settings should pick the right "Rate" link per browser (`setStoreLinks` in `src/pages/Options/index.ts` already has a spot for this)
- Update the README badges, website buttons and privacy policy wording ("browser provider" sync)
- Consider moving the build to a cross-browser framework (e.g., WXT) if the per-browser differences grow

## Track C: more learning platforms (v1.3+)
Build in this order, based on demand from the feedback form:
1. **Moodle.** Very widely used and open source; public demo sites make testing easier.
2. **Schoology.** Common in K–12.
3. **Google Classroom.** Popular, but its official API needs OAuth sign-in, which may conflict with "no accounts and no servers". Research a page-based approach first.

Each new platform follows the Track A recipe: tester → fixtures and tests → demo page → "verified".

## Track D: quality and care (ongoing)
- **Monthly dependency check.** Run `npm audit`, update only to versions **at least 2 weeks old**, and keep runtime vulnerabilities at 0.
- **Canvas UI watch.** Canvas changes its pages often. Re-test the dashboard views (Card, List, Recent Activity, course page) at the start of each semester.
- **Accessibility** (upstream #135): keyboard navigation and screen-reader labels in the sidebar and Settings.
- **Languages.** Move UI text to `_locales/` so the extension can be translated (Spanish first).
- **Feature ideas from upstream** worth considering: editing custom tasks (#148), a two-week view (#175), hiding specific courses (#156), tooltips on the rings (#143).

## How we release
1. Work on a branch, then open a PR. CI must pass.
2. Bump the version in `package.json` and both manifests (semantic versioning: fixes → 1.0.x, features → 1.x.0).
3. `npm run package`, then upload to each store.
4. Tag the release on GitHub with short release notes.
