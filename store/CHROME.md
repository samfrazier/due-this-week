# Chrome Web Store: submission sheet

Chrome uses the **same zip as Edge** (`npm run package` → `due-this-week-<version>.zip`, Manifest V3).
Developer Dashboard: https://chrome.google.com/webstore/devconsole (one-time $5 registration).

## Order of steps (first submission)
1. Register as a developer ($5, done by the owner).
2. **Add new item** → upload `due-this-week-1.1.0.zip`. This creates a draft and gives the item its **ID** (32 letters).
3. Send the ID to Claude, who adds the Chrome Web Store link to Settings (`src/pages/Options/storeLinks.ts`) and rebuilds the zip.
4. In the draft, **Package → Upload new package** with the rebuilt zip.
5. Fill in **Store listing**, **Privacy**, and **Distribution** (below), then **Submit for review**.

---

## Store listing

**Description** (paste as is)
```
Due This Week adds a clean weekly to-do list and progress chart to your school dashboard, so you can see everything due this week at a glance. It works with Canvas LMS and Blackboard.

WHAT YOU GET
• A to-do list built from your real assignments, quizzes, discussions, and due dates
• Progress rings for each course, in your own dashboard colors
• Check items off with one click, or add your own custom tasks (with optional links and weekly repeats)
• A streak that counts the days since you last missed an assignment (Canvas), so you can keep it going
• A "due Later" section for work due in the next two weeks, and headings you can collapse
• Day, three-day, week, or month views, plus a "rolling" view that starts today
• Overdue and missing work, so nothing slips through the cracks
• Optional Gradescope integration that adds your Gradescope assignments to the list
• For teachers and TAs: an "ungraded" view showing submissions that still need grading
• Dark-mode friendly, with confetti when you finish everything (you can turn it off)

PRIVATE BY DESIGN
• No accounts, no ads, no analytics, no tracking
• Talks only to your school's own website, using the login you already have
• Your assignments never leave your browser
• Open source, so you can read exactly what it does

HOW TO USE
1. Add the extension to Chrome.
2. Open your Canvas (or Blackboard) dashboard.
3. Your weekly to-do list appears in the right sidebar. Click the gear icon to change settings.

Want to try it first? Open the live demo with sample data:
https://samfrazier.github.io/due-this-week/demo.html

Due This Week is a free, open-source fork of the "Tasks for Canvas" extension by Jeff Cheng (MIT License), with tracking removed.

Due This Week is an unofficial extension and is not affiliated with, endorsed by, or sponsored by Instructure (Canvas), Anthology (Blackboard), or Gradescope. Canvas is a trademark of Instructure, Inc.

Source code and support: https://github.com/samfrazier/due-this-week
```

| Field | Value |
|---|---|
| Category | **Productivity → Workflow & Planning** (or **Education** if you prefer) |
| Language | English |
| Store icon (128×128) | `build/icon-128.png` (after `npm run build`) |
| Small promo tile (440×280, required) | `store/chrome-promo-440x280.png` (source: `store/chrome-promo-tile.html`) |
| Marquee promo tile (1400×560) | optional, skip |
| Screenshots (1280×800, **max 5**) | `store/screenshots/` 1, 2, 3, 5, 6 (skip 4-completed) |
| Official URL | leave empty (needs a verified domain) |
| Homepage URL | https://samfrazier.github.io/due-this-week/ |
| Support URL | https://github.com/samfrazier/due-this-week/issues |
| Mature content | No |

## Privacy (the "Privacy practices" tab)

**Single purpose description**
```
Shows students and teachers a weekly to-do list and progress chart of their course assignments in the sidebar of their school's learning management system dashboard (Canvas LMS or Blackboard).
```

**Permission justification: `storage`**
```
Saves the user's display settings (week start day, time period, theme color, which panels to show), which headings they collapsed, and, if the optional Gradescope integration is used, a local cache of Gradescope assignments so they can be shown on the dashboard. No data is sent anywhere.
```

**Host permission justification** (the content script runs on `https://*/*`)
```
Schools host their learning management systems on their own custom domains (for example canvas.myschool.edu or learn.school.edu), so the extension can't list them in advance. The content script runs on https pages only to check whether the page is a supported LMS dashboard (Canvas, Blackboard, or Gradescope). On any other site it does nothing else and stops right away. On a supported LMS it calls that same site's API with the user's existing session to read their assignments and to save "mark complete" and custom tasks back to their own account. It never sends data to the developer or any third party, and it injects no styles into non-LMS pages.
```

**Are you using remote code?** → **No, I am not using remote code.**
```
All JavaScript is bundled in the package (Manifest V3). It loads no remote scripts, fonts, or configuration.
```

**Data usage:** leave every "collect" box **unchecked**. The extension reads course and assignment data only inside the user's browser to display it and never transmits it to the developer or any third party. Tick all three certifications (not sold, not used for unrelated purposes, not used for creditworthiness or lending).

**Privacy policy URL:** https://samfrazier.github.io/due-this-week/privacy.html

## Distribution
- Payments: **Free**
- Visibility: **Public**
- Regions: **All regions**

## Test instructions (if the dashboard asks)
```
No account or login is needed. Install the extension and open https://samfrazier.github.io/due-this-week/demo.html — the sidebar appears on the right with sample courses and assignments (progress rings, a sample 12-day streak, round check buttons, and a "due Later" heading; click a heading to collapse it). The gear icon opens Settings. On a real school Canvas site the sidebar appears on the dashboard with the user's own assignments.
```
