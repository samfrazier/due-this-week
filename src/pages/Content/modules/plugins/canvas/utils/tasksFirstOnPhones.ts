/*
  On narrow screens (phones, iPad in portrait) Canvas stacks its right column
  (#right-side-wrapper, where the sidebar lives) underneath the course cards,
  so students had to scroll past every card to reach their tasks.

  When Canvas has stacked the columns, move the sidebar to the top of the main
  column (under the "Dashboard" header when there is one). When the screen is
  wide again (for example an iPad turned to landscape), put it back.

  We measure the page instead of guessing a screen width, so this follows
  whatever breakpoint each school's Canvas uses.
*/

export const STACKED_CLASS = 'tfc-tasks-first';

/**
 * True when `right` is drawn below `main` rather than beside it. Side by side,
 * the right column starts where the main column ends; stacked, it starts at
 * the same left edge. (Comparing left edges still works when the right column
 * is empty and has no height.)
 */
export function isStacked(main: DOMRect, right: DOMRect): boolean {
  if (right.width === 0 || main.width === 0) return false; // hidden
  return right.left < main.right - 1;
}

/* Canvas's main column is the element just before #right-side-wrapper
   (#not_right_side on real Canvas). */
function mainColumn(rightWrapper: HTMLElement): HTMLElement | null {
  const prev = rightWrapper.previousElementSibling;
  return prev instanceof HTMLElement ? prev : null;
}

/** Where the sidebar goes when stacked: under the dashboard header, else first. */
function placeAtTop(wall: HTMLElement, main: HTMLElement) {
  const header = main.querySelector('#dashboard_header_container');
  if (header && header.parentElement) {
    if (header.nextElementSibling !== wall)
      header.parentElement.insertBefore(wall, header.nextElementSibling);
  } else if (main.firstElementChild !== wall) {
    main.insertBefore(wall, main.firstElementChild);
  }
}

/**
 * Keeps `wall` (the sidebar) above the course cards whenever Canvas stacks
 * its columns. `home` is where the sidebar normally lives (#right-side).
 * Returns a function that re-checks the layout (also run on resize).
 */
export function keepTasksFirstOnPhones(
  wall: HTMLElement,
  home: HTMLElement
): () => void {
  const rightWrapper = document.getElementById('right-side-wrapper');
  if (!rightWrapper) return () => undefined;

  const update = () => {
    const main = mainColumn(rightWrapper);
    if (!main || !home.isConnected) return;
    const stacked = isStacked(
      main.getBoundingClientRect(),
      rightWrapper.getBoundingClientRect()
    );
    if (stacked) {
      placeAtTop(wall, main);
      wall.classList.add(STACKED_CLASS);
    } else if (wall.nextElementSibling !== home) {
      home.parentElement?.insertBefore(wall, home);
      wall.classList.remove(STACKED_CLASS);
    }
  };

  let pending = false;
  const onResize = () => {
    if (pending) return;
    pending = true;
    setTimeout(() => {
      pending = false;
      update();
    }, 150);
  };

  update();
  window.addEventListener('resize', onResize);
  window.addEventListener('orientationchange', onResize);
  return update;
}
