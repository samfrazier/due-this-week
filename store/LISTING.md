# Edge Add-ons submission: copy and paste sheet

Everything to enter in **Partner Center → Edge → Create new extension**, in the order the pages appear.
Requirements were checked against Microsoft's "Publish a Microsoft Edge extension" guide (updated Sep 2026).

**Before submitting:** GitHub Pages must be on (repo **Settings → Pages → Deploy from a branch → `main` / `/docs`**), so these URLs work:

- Website: https://samfrazier.github.io/due-this-week/
- Privacy policy: https://samfrazier.github.io/due-this-week/privacy.html
- Live demo: https://samfrazier.github.io/due-this-week/demo.html

---

## 1. Package
Upload **`due-this-week-<version>.zip`** (for example `due-this-week-1.1.0.zip`), made with `npm run package`. It's built from a clean `npm run build`, with `manifest.json` at the root of the zip.

## 2. Availability
- **Visibility:** `Hidden` for the first submission. You can check the live listing through its URL, then switch to `Public`. (Or choose `Public` right away.)
- **Markets:** All markets (the default)

## 3. Properties
| Field | Value |
|---|---|
| Category | **Productivity** (choose **Education** if it's offered) |
| Website | https://samfrazier.github.io/due-this-week/ |
| Support contact | https://github.com/samfrazier/due-this-week/issues |
| Mature content | Unchecked |

## 4. Privacy

**Single purpose description**
> Shows students and teachers a weekly to-do list and progress chart of their course assignments in the sidebar of their school's learning management system dashboard (Canvas LMS or Blackboard).

**Permission justification**

`storage`
> Saves the user's display settings (week start day, time period, theme color, which panels to show) and, if the optional Gradescope integration is used, a local cache of Gradescope assignments so they can be shown on the dashboard. No data is sent anywhere.

Host permission / content script on `https://*/*`
> Schools host their learning management systems on their own custom domains (for example canvas.myschool.edu or learn.school.edu), so the extension can't list them in advance. The content script runs on https pages only to check whether the page is a supported LMS dashboard (Canvas, Blackboard, or Gradescope). On any other site it does nothing else and stops right away. On a supported LMS it calls that same site's API with the user's existing session to read their assignments and to save "mark complete" and custom tasks back to their own account. It never sends data to the developer or any third party, and it injects no styles into non-LMS pages.

**Are you using remote code?**
> **No, I am not using remote code.** All JavaScript is bundled in the package (Manifest V3). It loads no remote scripts, fonts, or configuration.

**Data usage**
- *What user data do you plan to collect?* Leave every box **unchecked**. The extension reads course and assignment data only inside the user's browser to display it, and never transmits it to the developer or any third party.
  - (If Partner Center's wording counts data that's *handled locally* as "collected", tick **Website content** and **Personally identifiable information** to be safe, and the privacy policy still applies.)
- *Certifications:* tick all three. We don't sell data, don't use it for unrelated purposes, and don't use it for creditworthiness or lending.

**Privacy policy URL**
> https://samfrazier.github.io/due-this-week/privacy.html

## 5. Store listing (English)

**Extension name** and **short description** come from `manifest.json` automatically:
- Name: *Due This Week: To-Do Sidebar for Canvas LMS*
- Short description: *Free, private weekly to-do sidebar for Canvas and Blackboard. Unofficial; not affiliated with Instructure.*

**Description** (must be 250+ characters; this one is about 1,900)
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
1. Install the extension.
2. Open your Canvas (or Blackboard) dashboard.
3. Your weekly to-do list appears in the right sidebar. Click the gear icon to change settings.

Want to try it first? Open the live demo with sample data:
https://samfrazier.github.io/due-this-week/demo.html

Due This Week is a free, open-source fork of the "Tasks for Canvas" extension by Jeff Cheng (MIT License), with tracking removed and updated for Microsoft Edge.

Due This Week is an unofficial extension and is not affiliated with, endorsed by, or sponsored by Instructure (Canvas), Anthology (Blackboard), or Gradescope. Canvas is a trademark of Instructure, Inc.

Source code and support: https://github.com/samfrazier/due-this-week
```

**Extension logo:** `store/logo-300.png` (300×300)

**Screenshots** (optional, up to 6, **1280×800** or 640×480). Ready in `store/screenshots/`, all 1280×800 with sample data only, so no real student information appears. Upload them in this order (for an update, delete the old ones in Partner Center first):
1. `1-dashboard.png`: the sidebar on a Canvas-style dashboard, with the streak banner
2. `2-sidebar-closeup.png`: streak, circle check buttons, and the "due Later" heading, up close
3. `3-new-task.png`: adding a custom task (date, link, weekly repeat, course)
4. `4-completed.png`: the Completed tab
5. `5-settings.png`: Settings, including the new "Show streak" and "Use circle check buttons" options
6. `6-dark-mode.png`: the sidebar in dark mode

These were made by rendering the real built extension code (demo mode, default settings) in headless Microsoft Edge.

**Search terms** (at most 7 terms and 21 words in total, each at most 30 characters)
```
canvas
to-do list
assignments
student planner
homework tracker
blackboard
study planner
```

## Updates: notes for certification

### 1.1.0
```
Update 1.0.1 → 1.1.0: new sidebar features. No new permissions.

New:
- Round "check off" buttons on each task card (the previous icon remains available in Settings).
- A streak banner on Canvas: the number of days since the student last missed an assignment. It is computed locally in the browser from the student's own Canvas planner (same school site and same API the sidebar already uses). Nothing is sent to the developer or any third party. It can be turned off in Settings ("Show streak").
- A "due Later" heading, and the to-do list now also shows work due in the next two weeks.
- Task-list headings can be collapsed; the collapsed state is saved in chrome.storage.local on the device.

Changed:
- D2L Brightspace support is paused: removed from the description and the sidebar no longer runs on D2L pages.

Permissions are unchanged ("storage" only). No remote code, analytics, or external requests.

To test: open https://samfrazier.github.io/due-this-week/demo.html with the extension installed. The demo shows a sample 12-day streak, round check buttons, and a "due Later" heading; click a heading to collapse it. The new options are at the toolbar icon → Settings ("Show streak", "Use circle check buttons").
```

### 1.0.1
```
Update 1.0.0 → 1.0.1: small visual update to the Settings page only.

Changes:
- Settings page accent color changed from red to the extension's brand blue.
- Added a "Feedback" section at the bottom of Settings with two links: the extension's Edge Add-ons listing (to leave a rating) and the GitHub issues page (bug reports and feature ideas).
- The Settings logo/title now links to the Edge Add-ons listing.
- Internal code names for the Blackboard, Brightspace, and Gradescope integrations corrected (no behavior change).

No changes to permissions (still "storage" only), the content script's behavior, data handling, or the privacy policy. No remote code.

To test: open the toolbar icon → Settings (or the gear icon in the sidebar on https://samfrazier.github.io/due-this-week/demo.html) and scroll to the bottom to see the Feedback section.
```

## 6. Notes for certification (first submission, 1.0.0)
```
No account or login is needed to test.

The extension adds a to-do sidebar to learning management system (LMS) dashboards. Because schools host Canvas on their own domains, the content script matches https://*/* and exits immediately on any page that isn't a supported LMS.

To test with sample data (no Canvas account needed):
1. Install the extension.
2. Open https://samfrazier.github.io/due-this-week/demo.html
3. The "Due This Week" sidebar appears on the right with sample courses and assignments. You can switch weeks with the arrows, filter by course with the rings, switch tabs (Unfinished / Completed / Announcements), mark items complete, and create a custom task with "New Task". On this demo page nothing is saved or sent anywhere.
4. Click the gear icon next to "Tasks" (or the toolbar icon → Settings) to open the settings page.

On a real Canvas site (e.g., a free account at https://canvas.instructure.com), the sidebar appears on the Dashboard with the user's actual assignments.

Permissions: "storage" only, for settings. No remote code, analytics, or external requests. Requests go only to the LMS site the user is on (and gradescope.com if the optional Gradescope integration is used).

Source code: https://github.com/samfrazier/due-this-week
```
