import { FinalAssignment, Options } from '../types';
import JSONAssignmentDefaults from './defaults/assignmentDefaults.json';
import JSONOptionsDefaults from './defaults/optionsDefaults.json';

export const MAX_MARKED_ASSIGNMENTS = 400;

// D2L Brightspace support is paused until a tester confirms it works.
// The code is kept in plugins/brightspace; set this to true to turn it back on.
export const BRIGHTSPACE_ENABLED = false;

export const AssignmentDefaults = JSONAssignmentDefaults as FinalAssignment;
export const OptionsDefaults = JSONOptionsDefaults as Options;

// export const THEME_COLOR = '#ec412d';
export const THEME_COLOR = 'var(--ic-brand-global-nav-bgd)';
export const THEME_COLOR_LIGHT = 'rgba(199, 205, 209)';

export const CLIENT_ID_LENGTH = 9;

// Our project site (GitHub Pages). On this origin the sidebar runs in demo
// mode with sample data, and support links go to GitHub Issues.
export const HOME_WEBSITE = 'https://samfrazier.github.io';
export const REPO_URL = 'https://github.com/samfrazier/due-this-week';
export const SUPPORT_URL = REPO_URL + '/issues';

// Custom tasks are stored as Canvas Planner notes. The first line of the
// note's details marks it as ours. We still recognize the original extension's
// marker so tasks created with Tasks for Canvas keep working after switching.
export const CUSTOM_TASK_MARKER = 'Created using Due This Week';
export const CUSTOM_TASK_MARKERS = [
  CUSTOM_TASK_MARKER,
  'Created using Tasks for Canvas',
];

// for platforms that don't have dashboard colors by default
export const DEFAULT_DASHBOARD_COLORS = [
  '#4989F4',
  '#DC4B3F',
  '#7E57C2',
  '#1AA260',
  '#FFB300',
];
