import React from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import CircleCheck, { CIRCLE_CHECK_DELAY_MS } from './CircleCheck';
import HeadingGroup from '../task-list/components/HeadingGroup';

jest.useFakeTimers();

describe('CircleCheck', () => {
  test('fills right away, then marks complete after a short delay', () => {
    const onToggle = jest.fn();
    render(
      <CircleCheck
        color="#123456"
        complete={false}
        name="Essay"
        onToggle={onToggle}
      />
    );
    const button = screen.getByRole('button', {
      name: 'Mark Essay as complete',
    });
    expect(button).toHaveAttribute('aria-pressed', 'false');
    fireEvent.click(button);
    expect(button).toHaveAttribute('aria-pressed', 'true');
    expect(onToggle).not.toHaveBeenCalled();
    act(() => {
      jest.advanceTimersByTime(CIRCLE_CHECK_DELAY_MS);
    });
    expect(onToggle).toHaveBeenCalledTimes(1);
  });

  test('ignores a double click while pending', () => {
    const onToggle = jest.fn();
    render(
      <CircleCheck
        color="#000"
        complete={false}
        name="Quiz"
        onToggle={onToggle}
      />
    );
    const button = screen.getByRole('button');
    fireEvent.click(button);
    fireEvent.click(button);
    act(() => {
      jest.advanceTimersByTime(CIRCLE_CHECK_DELAY_MS * 2);
    });
    expect(onToggle).toHaveBeenCalledTimes(1);
  });

  test('a completed item offers to undo', () => {
    render(
      <CircleCheck color="#000" complete name="Lab" onToggle={jest.fn()} />
    );
    const button = screen.getByRole('button', {
      name: 'Mark Lab as not complete',
    });
    expect(button).toHaveAttribute('aria-pressed', 'true');
  });
});

describe('HeadingGroup', () => {
  const state = { height: 24, opacity: 1 };

  test('expanded heading has no count', () => {
    render(<HeadingGroup count={5} heading="Later" transitionState={state} />);
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-expanded', 'true');
    expect(button).toHaveTextContent(/^due Later$/);
  });

  test('collapsed heading shows the count and toggles by key', () => {
    const onToggle = jest.fn();
    render(
      <HeadingGroup
        collapsed
        count={5}
        heading="Later"
        onToggle={onToggle}
        toggleKey="Unfinished:Later"
        transitionState={state}
      />
    );
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-expanded', 'false');
    expect(button).toHaveTextContent('due Later (5)');
    fireEvent.click(button);
    expect(onToggle).toHaveBeenCalledWith('Unfinished:Later');
  });

  test('Overdue has no "due" prefix', () => {
    render(<HeadingGroup heading="Overdue" transitionState={state} />);
    expect(screen.getByRole('button')).toHaveTextContent(/^Overdue$/);
  });
});

describe('classic CheckIcon', () => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const CheckIcon = require('../../icons/check').default;

  test('is a real button with a descriptive label', () => {
    const onClick = jest.fn();
    render(<CheckIcon checkStyle="Check" name="Essay" onClick={onClick} />);
    const button = screen.getByRole('button', {
      name: 'Mark as Complete: Essay',
    });
    expect(button).toHaveAttribute('type', 'button');
    fireEvent.click(button);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  test('a custom label replaces the default', () => {
    render(<CheckIcon checkStyle="X" label="Close" onClick={jest.fn()} />);
    expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument();
  });
});
