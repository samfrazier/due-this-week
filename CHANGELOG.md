# Changelog

All notable changes to Due This Week. Versions follow [semantic versioning](https://semver.org/): fixes are 1.0.x, new features are 1.x.0.

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
