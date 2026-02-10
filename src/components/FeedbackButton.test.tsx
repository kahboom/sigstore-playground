import { render, screen, fireEvent } from '@solidjs/testing-library';
import { describe, it, expect, vi } from 'vitest';
import { FeedbackButton } from './FeedbackButton';
import { setViewport, VIEWPORTS } from '../test-setup';

describe('FeedbackButton', () => {
  describe('Initial Render', () => {
    it('renders the button', () => {
      const mockOnClick = vi.fn();
      render(() => <FeedbackButton onClick={mockOnClick} />);

      const button = screen.getByRole('button', {
        name: /Open feedback form/i,
      });
      expect(button).toBeInTheDocument();
    });

    it('displays feedback text', () => {
      const mockOnClick = vi.fn();
      render(() => <FeedbackButton onClick={mockOnClick} />);

      expect(screen.getByText('Feedback')).toBeInTheDocument();
    });

    it('renders feedback icon', () => {
      const mockOnClick = vi.fn();
      render(() => <FeedbackButton onClick={mockOnClick} />);

      const icon = document.querySelector('.feedback-icon');
      expect(icon).toBeInTheDocument();
    });

    it('has feedback-button class', () => {
      const mockOnClick = vi.fn();
      render(() => <FeedbackButton onClick={mockOnClick} />);

      const button = screen.getByRole('button');
      expect(button).toHaveClass('feedback-button');
    });
  });

  describe('Button Behavior', () => {
    it('calls onClick when clicked', () => {
      const mockOnClick = vi.fn();
      render(() => <FeedbackButton onClick={mockOnClick} />);

      const button = screen.getByRole('button', {
        name: /Open feedback form/i,
      });
      fireEvent.click(button);

      expect(mockOnClick).toHaveBeenCalledTimes(1);
    });

    it('can be clicked multiple times', () => {
      const mockOnClick = vi.fn();
      render(() => <FeedbackButton onClick={mockOnClick} />);

      const button = screen.getByRole('button');
      fireEvent.click(button);
      fireEvent.click(button);
      fireEvent.click(button);

      expect(mockOnClick).toHaveBeenCalledTimes(3);
    });
  });

  describe('Accessibility', () => {
    it('is keyboard accessible', () => {
      const mockOnClick = vi.fn();
      render(() => <FeedbackButton onClick={mockOnClick} />);

      const button = screen.getByRole('button');
      expect(button.tagName).toBe('BUTTON');
    });

    it('has proper aria-label', () => {
      const mockOnClick = vi.fn();
      render(() => <FeedbackButton onClick={mockOnClick} />);

      const button = screen.getByLabelText('Open feedback form');
      expect(button).toBeInTheDocument();
    });

    it('has explicit button type', () => {
      const mockOnClick = vi.fn();
      render(() => <FeedbackButton onClick={mockOnClick} />);

      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('type', 'button');
    });
  });

  describe('Mobile Responsiveness', () => {
    it('renders on mobile', () => {
      const mockOnClick = vi.fn();
      setViewport(VIEWPORTS.mobile.width, VIEWPORTS.mobile.height);
      render(() => <FeedbackButton onClick={mockOnClick} />);

      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
    });

    it('is clickable on mobile', () => {
      const mockOnClick = vi.fn();
      setViewport(VIEWPORTS.mobile.width, VIEWPORTS.mobile.height);
      render(() => <FeedbackButton onClick={mockOnClick} />);

      const button = screen.getByRole('button');
      fireEvent.click(button);

      expect(mockOnClick).toHaveBeenCalledTimes(1);
    });

    it('icon is visible on mobile', () => {
      const mockOnClick = vi.fn();
      setViewport(VIEWPORTS.mobile.width, VIEWPORTS.mobile.height);
      render(() => <FeedbackButton onClick={mockOnClick} />);

      const icon = document.querySelector('.feedback-icon');
      expect(icon).toBeInTheDocument();
    });
  });

  describe('Tablet Responsiveness', () => {
    it('renders on tablet', () => {
      const mockOnClick = vi.fn();
      setViewport(VIEWPORTS.tablet.width, VIEWPORTS.tablet.height);
      render(() => <FeedbackButton onClick={mockOnClick} />);

      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
      expect(screen.getByText('Feedback')).toBeInTheDocument();
    });
  });

  describe('Desktop Rendering', () => {
    it('shows text on desktop', () => {
      const mockOnClick = vi.fn();
      setViewport(VIEWPORTS.desktop.width, VIEWPORTS.desktop.height);
      render(() => <FeedbackButton onClick={mockOnClick} />);

      expect(screen.getByText('Feedback')).toBeInTheDocument();
    });

    it('shows icon on desktop', () => {
      const mockOnClick = vi.fn();
      setViewport(VIEWPORTS.desktop.width, VIEWPORTS.desktop.height);
      render(() => <FeedbackButton onClick={mockOnClick} />);

      const icon = document.querySelector('.feedback-icon');
      expect(icon).toBeInTheDocument();
    });
  });

  describe('Structure', () => {
    it('contains icon and text elements', () => {
      const mockOnClick = vi.fn();
      render(() => <FeedbackButton onClick={mockOnClick} />);

      const button = screen.getByRole('button');
      const icon = button.querySelector('.feedback-icon');
      const text = button.querySelector('.feedback-text');

      expect(icon).toBeInTheDocument();
      expect(text).toBeInTheDocument();
      expect(text?.textContent).toBe('Feedback');
    });
  });
});
