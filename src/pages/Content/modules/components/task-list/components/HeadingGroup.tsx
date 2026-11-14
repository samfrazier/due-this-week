import React from 'react';
import styled from 'styled-components';
import { AnimatedProps, TransitionState } from '../../task-card/TaskCard';

const HeadingContainer = styled.div.attrs((props: AnimatedProps) => ({
  style: {
    height: props.opacity ? 24 * props.opacity : 0,
    opacity: props.opacity ? props.opacity * props.opacity : 0,
  },
}))<AnimatedProps>`
  width: 100%;
  padding-bottom: 1px;
  color: #6c757c;
  font-size: small;
  vertical-align: bottom;

  display: flex;
  flex-direction: row;
`;

const HeadingButton = styled.button`
  align-self: flex-end;
  display: inline-flex;
  align-items: center;
  gap: 3px;
  margin: 0;
  padding: 0 4px 0 0;
  border: none;
  border-radius: 3px;
  background: none;
  color: inherit;
  font: inherit;
  line-height: inherit;
  text-align: left;
  cursor: pointer;
  &:hover strong {
    text-decoration: underline;
  }
  &:focus-visible {
    outline: 2px solid currentColor;
    outline-offset: 1px;
  }
`;

const Chevron = styled.svg<{ $expanded: boolean }>`
  width: 10px;
  height: 10px;
  flex-shrink: 0;
  transform: rotate(${(props) => (props.$expanded ? '0deg' : '-90deg')});
  transition: transform 0.15s ease;
  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

const NO_DUE_LABEL = new Set([
  'Overdue',
  'Graded',
  'Ungraded',
  'Needs Grading',
  'Seen',
  'Unread',
]);

interface HeadingGroupProps {
  heading: string;
  transitionState: TransitionState;
  collapsed?: boolean;
  count?: number;
  onToggle?: (key: string) => void;
  toggleKey?: string;
}
export default function HeadingGroup({
  heading,
  transitionState,
  collapsed = false,
  count,
  onToggle,
  toggleKey,
}: HeadingGroupProps): JSX.Element {
  function handleClick() {
    if (onToggle) onToggle(toggleKey ?? heading);
  }
  const dueText = 'due';
  const countText = collapsed && count !== undefined ? ` (${count})` : '';
  return (
    <HeadingContainer
      height={transitionState ? transitionState.height : 5}
      key={heading}
      opacity={transitionState ? transitionState.opacity : 1}
    >
      <HeadingButton
        aria-expanded={!collapsed}
        onClick={handleClick}
        type="button"
      >
        <Chevron
          $expanded={!collapsed}
          aria-hidden="true"
          focusable="false"
          viewBox="0 0 10 10"
        >
          <path
            d="M2 3.5 L5 6.5 L8 3.5"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.6"
          />
        </Chevron>
        <span>
          {!NO_DUE_LABEL.has(heading) ? `${dueText} ` : ''}
          <strong>{heading}</strong>
          {countText}
        </span>
      </HeadingButton>
    </HeadingContainer>
  );
}
