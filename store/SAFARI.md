# Safari (Mac App Store): build and submission sheet

Safari extensions ship inside a small Mac app. Ours lives in `safari/Due This Week/` and was made with Apple's `safari-web-extension-converter`.

| | |
|---|---|
| App name | Due This Week |
| Bundle ID (app) | `io.github.samfrazier.duethisweek` |
| Bundle ID (extension) | `io.github.samfrazier.duethisweek.Extension` |
| Platform | macOS 12 or newer (iPhone/iPad later) |
| Version | 1.1.0 (`MARKETING_VERSION` in the Xcode project) |
| Category | Productivity |

## How the Xcode project gets the extension
The project **references the files in `build/`**; it doesn't copy them. So always run `npm run build` first.
`npm run safari` does both, and then opens the app, for local testing (signed "to run locally" only).

To test an unsigned build: Safari → Settings → Advanced → **Show features for web developers**, then **Develop → Allow unsigned extensions** (Safari turns this off each time it quits).

Icons: `python3 utils/make-mac-icon.py` builds the Mac icon set and `store/mac-icon-1024.png` from `store/icon-transparent-512.png`.

## Releasing a version
1. Bump the version in `package.json` and the manifests (as for Edge), and `MARKETING_VERSION` in the Xcode project. Also raise `CURRENT_PROJECT_VERSION` (the build number) by 1 for every upload, even for the same version.
2. `npm run build`.
3. Open `safari/Due This Week/Due This Week.xcodeproj` in Xcode.

## First submission (one-time setup, done by the owner)
1. **Signing.** In Xcode, click the project → for **both** targets ("Due This Week" and "Due This Week Extension") → **Signing & Capabilities** → tick *Automatically manage signing* → choose your **Team**. Xcode registers both bundle IDs with Apple.
2. **Create the app record.** App Store Connect → **Apps → + → New App**:
   - Platform: **macOS**
   - Name: **Due This Week** (if taken, try *Due This Week – To-Do Sidebar*)
   - Primary language: English (U.S.)
   - Bundle ID: `io.github.samfrazier.duethisweek`
   - SKU: `duethisweek-mac`
3. **Upload a build.** In Xcode, select **Product → Archive**. When the Organizer opens, select **Distribute App → App Store Connect → Upload**. After processing (about 15 to 30 minutes), the build appears in App Store Connect.
4. **Fill in the listing** (below), choose the build, and click **Add for Review**.

## Listing text

**Subtitle** (30 characters max)
```
To-do sidebar for Canvas LMS
```

**Promotional text** (170 characters max; can change without review)
```
See everything due this week right on your Canvas dashboard. New: one-click check-offs, a streak for days without a missed assignment, and a "due Later" section.
```

**Description**
```
Due This Week adds a clean weekly to-do list and progress rings to your school's Canvas dashboard in Safari, so you can see everything due this week at a glance. It also works with Blackboard.

WHAT YOU GET
• A to-do list built from your real assignments, quizzes, discussions, and due dates
• Progress rings for each course, in your own dashboard colors
• Check items off with one click, or add your own custom tasks (with optional links and weekly repeats)
• A streak that counts the days since you last missed an assignment
• A "due Later" section for work due in the next two weeks, and headings you can collapse
• Day, three-day, week, or month views, plus a "rolling" view that starts today
• For teachers and TAs: an "ungraded" view showing submissions that still need grading
• Works in light and dark mode

PRIVATE BY DESIGN
• No accounts, no ads, no analytics, no tracking
• Talks only to your school's own website, using the login you already have
• Your assignments never leave your Mac
• Open source, so you can read exactly what it does

HOW TO USE
1. Open the Due This Week app once, then turn on the extension in Safari → Settings → Extensions.
2. Allow it on your school's Canvas website.
3. Open your Canvas dashboard. Your weekly to-do list appears in the right sidebar.

Due This Week is a free, open-source fork of "Tasks for Canvas" by Jeff Cheng (MIT License).

Due This Week is an unofficial extension and is not affiliated with, endorsed by, or sponsored by Instructure (Canvas) or Anthology (Blackboard). Canvas is a trademark of Instructure, Inc.
```

**Keywords** (100 characters max, comma-separated, no spaces needed)
```
canvas,to-do,assignments,homework,student,planner,school,blackboard,tracker,due dates,lms
```

| Field | Value |
|---|---|
| Support URL | https://github.com/samfrazier/due-this-week/issues |
| Marketing URL | https://samfrazier.github.io/due-this-week/ |
| Privacy Policy URL | https://samfrazier.github.io/due-this-week/privacy.html |
| Category | Productivity (secondary: Education) |
| Price | Free |
| Age rating | Answer "None" to every question → 4+ |
| Copyright | 2026 *your name* |

**Screenshots:** the Mac App Store accepts 1280×800, so the six files in `store/screenshots/` work as-is (sample data only).

**App Privacy** ("nutrition label"): choose **Data Not Collected**. The extension reads the student's assignments only inside Safari to display them, and sends nothing to the developer or anyone else.

## Notes for App Review
```
Due This Week is a Safari Web Extension; the app itself only explains how to turn the extension on.

To test without a school account:
1. Open the Due This Week app, then enable the extension in Safari → Settings → Extensions.
2. Allow it on samfrazier.github.io when Safari asks.
3. Open https://samfrazier.github.io/due-this-week/demo.html
The to-do sidebar appears on the right with sample courses and assignments: progress rings, a streak banner, round check buttons, and a "due Later" heading (click a heading to collapse it). The gear icon opens Settings.

On a real school site (Canvas LMS), the sidebar appears on the dashboard using the student's existing login. The extension requests access to https websites because every school hosts Canvas on its own domain; on other sites it does nothing.

No account, no data collection, no analytics, no remote code. Source: https://github.com/samfrazier/due-this-week
```

## To do before the first Safari release
- [ ] In Settings, the **Rate** button and logo link point to Edge Add-ons. Once the App Store link exists, show it in Safari instead (see `setStoreLinks()` in `src/pages/Options/index.ts`).
- [ ] Add the App Store badge to the README and website once the app is live.
