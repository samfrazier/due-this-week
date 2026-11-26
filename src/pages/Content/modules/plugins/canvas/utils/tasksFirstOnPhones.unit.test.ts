import {
  isStacked,
  keepTasksFirstOnPhones,
  STACKED_CLASS,
} from './tasksFirstOnPhones';

function rect(left: number, top: number, width: number, height: number) {
  return {
    left,
    top,
    width,
    height,
    right: left + width,
    bottom: top + height,
    x: left,
    y: top,
    toJSON: () => ({}),
  } as DOMRect;
}

describe('isStacked', () => {
  test('side by side (desktop, iPad landscape) is not stacked', () => {
    expect(isStacked(rect(0, 0, 900, 800), rect(900, 0, 310, 800))).toBe(false);
  });
  test('right column under the main column (phone) is stacked', () => {
    expect(isStacked(rect(0, 0, 400, 2000), rect(0, 2000, 400, 600))).toBe(
      true
    );
  });
  test('an empty right column under the main column is still stacked', () => {
    expect(isStacked(rect(0, 0, 400, 2000), rect(0, 2000, 400, 0))).toBe(true);
  });
  test('a hidden right column is not stacked', () => {
    expect(isStacked(rect(0, 0, 400, 2000), rect(0, 0, 0, 0))).toBe(false);
  });
});

describe('keepTasksFirstOnPhones', () => {
  let main: HTMLElement;
  let wrapper: HTMLElement;
  let wall: HTMLElement;
  let home: HTMLElement;
  let phone = true;

  beforeEach(() => {
    jest.useFakeTimers();
    // shaped like a real Canvas dashboard
    document.body.innerHTML = `
      <div id="main">
        <div id="not_right_side">
          <div id="dashboard">
            <div id="dashboard_header_container"><h1>Dashboard</h1></div>
            <div id="DashboardCard_Container">cards</div>
          </div>
        </div>
        <div id="right-side-wrapper">
          <div id="tfc-wall-rose"></div>
          <div id="tfc-wall-maria"></div>
          <aside id="right-side"></aside>
        </div>
      </div>`;
    main = document.getElementById('not_right_side') as HTMLElement;
    wrapper = document.getElementById('right-side-wrapper') as HTMLElement;
    wall = document.getElementById('tfc-wall-rose') as HTMLElement;
    home = document.getElementById('tfc-wall-maria') as HTMLElement;
    phone = true;
    main.getBoundingClientRect = () =>
      phone ? rect(0, 0, 400, 2000) : rect(0, 0, 900, 800);
    wrapper.getBoundingClientRect = () =>
      phone ? rect(0, 2000, 400, 600) : rect(900, 0, 310, 800);
  });

  afterEach(() => jest.useRealTimers());

  test('on a phone the sidebar moves under the Dashboard header, above the cards', () => {
    keepTasksFirstOnPhones(wall, home);
    const header = document.getElementById('dashboard_header_container');
    expect(header?.nextElementSibling).toBe(wall);
    expect(wall.nextElementSibling?.id).toBe('DashboardCard_Container');
    expect(wall.classList.contains(STACKED_CLASS)).toBe(true);
  });

  test('on a wide screen it stays in the right column', () => {
    phone = false;
    keepTasksFirstOnPhones(wall, home);
    expect(wall.parentElement).toBe(wrapper);
    expect(wall.nextElementSibling).toBe(home);
    expect(wall.classList.contains(STACKED_CLASS)).toBe(false);
  });

  test('turning an iPad to landscape puts it back in the right column', () => {
    keepTasksFirstOnPhones(wall, home);
    expect(wall.parentElement?.id).toBe('dashboard');
    phone = false;
    window.dispatchEvent(new Event('resize'));
    jest.advanceTimersByTime(200);
    expect(wall.nextElementSibling).toBe(home);
    expect(wall.classList.contains(STACKED_CLASS)).toBe(false);
  });

  test('without a Dashboard header it goes to the top of the main column', () => {
    document.getElementById('dashboard_header_container')?.remove();
    keepTasksFirstOnPhones(wall, home);
    expect(main.firstElementChild).toBe(wall);
  });

  test('does nothing on pages without a right column', () => {
    wrapper.remove();
    document.body.appendChild(wall);
    expect(() => keepTasksFirstOnPhones(wall, home)()).not.toThrow();
    expect(wall.parentElement).toBe(document.body);
  });
});
