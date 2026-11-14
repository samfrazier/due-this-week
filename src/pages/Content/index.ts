import {
  CanvasLMSEntrypoint,
  CanvasLMSConfig,
  InstallSettingsEntrypoint,
  isInstallSettings,
} from './modules/plugins/canvas';
import {
  isGradescope,
  GradescopeEntrypoint,
} from './modules/plugins/gradescope';
import {
  BlackboardEntrypoint,
  isBlackboard,
} from './modules/plugins/blackboard';
import {
  BrightspaceEntrypoint,
  isBrightspace,
} from './modules/plugins/brightspace';
import { BRIGHTSPACE_ENABLED } from './modules/constants';

/* 

Performance overhead on websites that aren't Canvas:

document.getElementById() is called once

*/
if (CanvasLMSConfig.isActive) {
  /*
  mutation observer waits for sidebar to load then injects content
  */

  console.log('Due This Week: Canvas detected');

  CanvasLMSEntrypoint();

  /* 
  Allow user to modify critical settings directly on the install page
  */
  if (isInstallSettings) {
    InstallSettingsEntrypoint();
  }
} else if (isGradescope) {
  console.log('Due This Week: Gradescope detected');

  GradescopeEntrypoint();
} else if (isBlackboard) {
  console.log('Due This Week: Blackboard detected');

  BlackboardEntrypoint();
} else if (BRIGHTSPACE_ENABLED && isBrightspace) {
  console.log('Due This Week: Brightspace detected');

  BrightspaceEntrypoint();
}
