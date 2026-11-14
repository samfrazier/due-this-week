import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

// How long the filled circle shows before the card moves to the other tab.
export const CIRCLE_CHECK_DELAY_MS = 350;

const CircleButton = styled.button<{ $color: string; $filled: boolean }>`
  flex-shrink: 0;
  width: 18px;
  height: 18px;
  margin: 0;
  padding: 0;
  border-radius: 50%;
  border: 2px solid ${(props) => props.$color};
  background-color: ${(props) =>
    props.$filled ? props.$color : 'transparent'};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.15s ease, transform 0.15s ease;
  svg {
    opacity: ${(props) => (props.$filled ? 1 : 0)};
    stroke: ${(props) => (props.$filled ? '#fff' : props.$color)};
    transition: opacity 0.15s ease;
  }
  &:hover svg,
  &:focus-visible svg {
    opacity: ${(props) => (props.$filled ? 1 : 0.6)};
  }
  &:active {
    transform: scale(0.9);
  }
  &:focus-visible {
    outline: 2px solid ${(props) => props.$color};
    outline-offset: 2px;
  }
  @media (prefers-reduced-motion: reduce) {
    transition: none;
    svg {
      transition: none;
    }
    &:active {
      transform: none;
    }
  }
`;

interface CircleCheckProps {
  color: string;
  complete: boolean;
  name: string;
  onToggle: () => void;
}

/*
  Round "mark complete" button on the right side of a task card.
  Clicking fills (or empties) the circle right away, then calls onToggle
  a moment later so the change is visible before the card animates away.
*/
export default function CircleCheck({
  color,
  complete,
  name,
  onToggle,
}: CircleCheckProps): JSX.Element {
  const [filled, setFilled] = useState(complete);
  const timer = useRef<number>();

  useEffect(() => setFilled(complete), [complete]);
  useEffect(() => () => window.clearTimeout(timer.current), []);

  function handleClick(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    e.stopPropagation();
    if (timer.current) return; // ignore double clicks while pending
    setFilled(!complete);
    timer.current = window.setTimeout(() => {
      timer.current = undefined;
      onToggle();
    }, CIRCLE_CHECK_DELAY_MS);
  }

  const label = complete
    ? `Mark ${name} as not complete`
    : `Mark ${name} as complete`;

  return (
    <CircleButton
      $color={color}
      $filled={filled}
      aria-label={label}
      aria-pressed={filled}
      onClick={handleClick}
      title={complete ? 'Mark as incomplete' : 'Mark as complete'}
      type="button"
    >
      <svg
        aria-hidden="true"
        fill="none"
        focusable="false"
        height="10"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.2"
        viewBox="0 0 12 12"
        width="10"
      >
        <path d="M2.5 6.3 L5 8.6 L9.5 3.6" />
      </svg>
    </CircleButton>
  );
}
