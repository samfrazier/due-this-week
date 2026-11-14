# Changelog

All notable changes to Due This Week. Versions follow [semantic versioning](https://semver.org/): fixes are 1.0.x, new features are 1.x.0.

## 1.1.0 (November 2026)
### Added
- **Circle check buttons.** Click the circle in the course color on any card to check it off; click it again on the Completed tab to undo. The classic icon is still available in Settings (*Use circle check buttons*).
- **Streak banner (Canvas).** Counts the days in a row since you last missed an assignment. Only work Canvas marks *missing* breaks it; late, excused, checked-off items, and custom tasks never do. Looks back about one semester ("120+ days" beyond that), always counts all your courses, and turns amber when something is still due today. Computed entirely in your browser. Turn it off in Settings (*Show streak*).
- **"due Later" heading.** Overdue, Today, Tomorrow, 2 days, and 3 days are unchanged; anything 4 or more days out is grouped under *due Later*. When viewing the current period, the list also shows work due in the next 14 days (the progress rings still count only the selected period).
- **Collapsible headings.** Click any heading to hide or show its group; a collapsed heading shows its count, e.g. *due Later (5)*. Remembered per device.

### Changed
- **Shorter name:** *Due This Week: To-do Sidebar* (was *Due This Week: To-Do Sidebar for Canvas LMS*), because Safari allows at most 40 characters.
- **D2L Brightspace is paused.** It's no longer listed as supported and the sidebar no longer appears on D2L until a tester can confirm it works.
- The classic check icon and the New Task close button are now real buttons, so they work with the keyboard and screen readers.

### Internal
- No new permissions (still `storage` only) and no new data leaves the browser. The streak reads the student's own Canvas planner from the school's site, like the rest of the sidebar.

## 1.0.1 (November 2026)
### Changed
- **Settings now uses the Due This Week blue** (`#0079EE`) instead of the old red, matching the logo
- The Settings logo and title link to the Edge Add-ons listing

### Added
- **Feedback section** in Settings: *Rate on Edge Add-ons* and *Report a bug or suggest a feature* (GitHub forms that ask which learning platform and browser you use)

### Internal
- Blackboard, Brightspace, and Gradescope integrations are named correctly in code (previously all labeled "Demo")
- No changes to permissions, data handling, or the sidebar itself

## 1.0.0 (November 2026)
First release on Microsoft Edge Add-ons, forked from [Tasks for Canvas](https://github.com/UseBetterCanvas/canvas-task-extension) by Jeff Cheng (MIT).
- New name, logo, and branding
- **Privacy:** removed remote A/B-test config, the per-user ID, and install/uninstall tracking. The extension talks only to your LMS.
- **No more restyling other sites:** the date picker's styles load only while it's open (upstream #159, #160)
- **Security:** axios 1.21.0 and pinned safe versions of lodash, follow-redirects, and @babel/runtime (0 known runtime vulnerabilities)
- Websites can no longer detect the extension (no web-accessible resources)
- Fixed: progress ring showed 0% for fully graded TA assignments (upstream #173)
- Fixed: broken course-color help link (upstream #174)
- System fonts instead of Google Fonts
- Custom tasks from the original extension still work
