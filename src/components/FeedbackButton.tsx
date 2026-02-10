import { Component } from 'solid-js';
import './FeedbackButton.css';

interface FeedbackButtonProps {
  onClick: () => void;
}

export const FeedbackButton: Component<FeedbackButtonProps> = props => {
  return (
    <button
      class="feedback-button"
      onClick={() => props.onClick()}
      aria-label="Open feedback form"
      type="button"
    >
      <svg
        class="feedback-icon"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
      <span class="feedback-text">Feedback</span>
    </button>
  );
};
