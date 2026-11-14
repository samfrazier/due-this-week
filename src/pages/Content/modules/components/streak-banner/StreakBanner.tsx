import React from 'react';
import styled from 'styled-components';
import { StreakResult, STREAK_LOOKBACK_DAYS } from '../../utils/streak';

type BannerState = 'active' | 'warning' | 'start';

const Banner = styled.div<{ $state: BannerState; $dark: boolean }>`
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 8px 0 2px 0;
  padding: 8px 10px;
  border-radius: 6px;
  box-sizing: border-box;
  width: 100%;
  background-color: ${(p) =>
    p.$state === 'warning'
      ? p.$dark
        ? 'rgba(245, 158, 11, 0.16)'
        : '#fff7e6'
      : p.$dark
      ? 'var(--tfc-dark-mode-bg-primary)'
      : '#f5f6f7'};
  border: 1px solid
    ${(p) =>
      p.$state === 'warning'
        ? p.$dark
          ? 'rgba(245, 158, 11, 0.5)'
          : '#f5c26b'
        : 'transparent'};
`;

const IconWrap = styled.div<{ $color: string }>`
  flex-shrink: 0;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${(p) => p.$color};
  background-color: rgba(127, 127, 127, 0.12);
`;

const Text = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 0;
`;

const Title = styled.div<{ $dark: boolean }>`
  font-weight: 700;
  font-size: 13px;
  color: ${(p) =>
    p.$dark
      ? 'var(--tfc-dark-mode-text-primary)'
      : 'var(--ic-brand-font-color-dark)'};
`;

const Subtitle = styled.div<{ $state: BannerState; $dark: boolean }>`
  font-size: 11px;
  color: ${(p) =>
    p.$state === 'warning'
      ? p.$dark
        ? '#fbbf24'
        : '#9a5b00'
      : p.$dark
      ? 'var(--tfc-dark-mode-text-secondary)'
      : '#4c5860'};
`;

const CalendarCheck = (
  <svg
    aria-hidden="true"
    fill="none"
    focusable="false"
    height="18"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="2"
    viewBox="0 0 24 24"
    width="18"
  >
    <rect height="17" rx="2.5" width="18" x="3" y="4.5" />
    <path d="M3 9.5h18M8 2.5v4M16 2.5v4M8.5 15l2.5 2.5 4.5-5" />
  </svg>
);

const WARNING_COLOR = '#d97706';

function fmtSince(d: Date): string {
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

interface StreakBannerProps {
  streak: StreakResult;
  dueToday: number;
  color: string;
  dark?: boolean;
}

export default function StreakBanner({
  streak,
  dueToday,
  color,
  dark = false,
}: StreakBannerProps): JSX.Element {
  const state: BannerState =
    streak.days <= 0 ? 'start' : dueToday > 0 ? 'warning' : 'active';

  const dayText = streak.capped
    ? `${STREAK_LOOKBACK_DAYS}+ day streak`
    : `${streak.days}-day streak`;

  let title = dayText;
  let subtitle = streak.capped
    ? 'No missed assignments this semester'
    : streak.since
    ? `No missed assignments since ${fmtSince(streak.since)}`
    : '';
  if (state === 'start') {
    title = 'Start a streak';
    subtitle = 'Turn in your next assignment to begin';
  } else if (state === 'warning') {
    subtitle = `${dueToday} due today`;
  }

  return (
    <Banner $dark={dark} $state={state} role="status">
      <IconWrap
        $color={
          state === 'warning'
            ? WARNING_COLOR
            : dark // Canvas's theme color is usually too dark to see on a dark page
            ? 'var(--tfc-dark-mode-text-primary)'
            : color
        }
      >
        {CalendarCheck}
      </IconWrap>
      <Text>
        <Title $dark={dark}>{title}</Title>
        <Subtitle $dark={dark} $state={state}>
          {subtitle}
        </Subtitle>
      </Text>
    </Banner>
  );
}
