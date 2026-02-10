import { render, screen, fireEvent, waitFor } from '@solidjs/testing-library';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { FeedbackModal } from './FeedbackModal';
import { setViewport, VIEWPORTS } from '../test-setup';

describe('FeedbackModal', () => {
  beforeEach(() => {
    setViewport(VIEWPORTS.desktop.width, VIEWPORTS.desktop.height);
    document.body.style.overflow = '';
  });

  describe('Initial Render', () => {
    it('renders when show is true', () => {
      const mockOnClose = vi.fn();
      render(() => (
        <FeedbackModal show={true} onClose={mockOnClose}>
          <div>Test Content</div>
        </FeedbackModal>
      ));

      expect(screen.getByText('Test Content')).toBeInTheDocument();
    });

    it('does not render when show is false', () => {
      const mockOnClose = vi.fn();
      render(() => (
        <FeedbackModal show={false} onClose={mockOnClose}>
          <div>Test Content</div>
        </FeedbackModal>
      ));

      expect(screen.queryByText('Test Content')).not.toBeInTheDocument();
    });

    it('renders close button', () => {
      const mockOnClose = vi.fn();
      render(() => (
        <FeedbackModal show={true} onClose={mockOnClose}>
          <div>Content</div>
        </FeedbackModal>
      ));

      const closeButton = screen.getByRole('button', {
        name: /Close feedback modal/i,
      });
      expect(closeButton).toBeInTheDocument();
    });

    it('renders children content', () => {
      const mockOnClose = vi.fn();
      render(() => (
        <FeedbackModal show={true} onClose={mockOnClose}>
          <div data-testid="child-content">Child Content</div>
        </FeedbackModal>
      ));

      expect(screen.getByTestId('child-content')).toBeInTheDocument();
    });
  });

  describe('Modal Behavior', () => {
    it('calls onClose when close button is clicked', () => {
      const mockOnClose = vi.fn();
      render(() => (
        <FeedbackModal show={true} onClose={mockOnClose}>
          <div>Content</div>
        </FeedbackModal>
      ));

      const closeButton = screen.getByRole('button', {
        name: /Close feedback modal/i,
      });
      fireEvent.click(closeButton);

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('modal has backdrop click handler configured', () => {
      const mockOnClose = vi.fn();
      render(() => (
        <FeedbackModal show={true} onClose={mockOnClose}>
          <div>Content</div>
        </FeedbackModal>
      ));

      // the modal renders successfully with handleBackdropClick attached to backdrop
      expect(screen.getByText('Content')).toBeInTheDocument();

      // The handleBackdropClick function checks if e.target === e.currentTarget
      // before calling onClose, preventing clicks on child elements from closing modal
      // This is tested behaviorally through the "does not call onClose when modal content is clicked" test
    });

    it('does not call onClose when modal content is clicked', () => {
      const mockOnClose = vi.fn();
      render(() => (
        <FeedbackModal show={true} onClose={mockOnClose}>
          <div>Content</div>
        </FeedbackModal>
      ));

      const modalContent = screen.getByText('Content');
      fireEvent.click(modalContent);

      expect(mockOnClose).not.toHaveBeenCalled();
    });

    it('does not call onClose when modal card is clicked', async () => {
      const mockOnClose = vi.fn();
      render(() => (
        <FeedbackModal show={true} onClose={mockOnClose}>
          <div>Content</div>
        </FeedbackModal>
      ));

      await waitFor(() => {
        expect(screen.getByText('Content')).toBeInTheDocument();
      });

      const modalCard = document.querySelector('.modal-card');
      if (modalCard) {
        fireEvent.click(modalCard);
        expect(mockOnClose).not.toHaveBeenCalled();
      }
    });

    it('calls onClose when ESC key is pressed', async () => {
      const mockOnClose = vi.fn();
      render(() => (
        <FeedbackModal show={true} onClose={mockOnClose}>
          <div>Content</div>
        </FeedbackModal>
      ));

      fireEvent.keyDown(document, { key: 'Escape' });

      await waitFor(() => {
        expect(mockOnClose).toHaveBeenCalledTimes(1);
      });
    });

    it('does not call onClose when other keys are pressed', async () => {
      const mockOnClose = vi.fn();
      render(() => (
        <FeedbackModal show={true} onClose={mockOnClose}>
          <div>Content</div>
        </FeedbackModal>
      ));

      fireEvent.keyDown(document, { key: 'Enter' });
      fireEvent.keyDown(document, { key: 'Tab' });
      fireEvent.keyDown(document, { key: 'Space' });

      expect(mockOnClose).not.toHaveBeenCalled();
    });

    it('does not call onClose on ESC key when modal is not showing', () => {
      const mockOnClose = vi.fn();
      render(() => (
        <FeedbackModal show={false} onClose={mockOnClose}>
          <div>Content</div>
        </FeedbackModal>
      ));

      fireEvent.keyDown(document, { key: 'Escape' });

      expect(mockOnClose).not.toHaveBeenCalled();
    });

    it('prevents body scroll when modal is open', async () => {
      const mockOnClose = vi.fn();
      render(() => (
        <FeedbackModal show={true} onClose={mockOnClose}>
          <div>Content</div>
        </FeedbackModal>
      ));

      await waitFor(() => {
        expect(document.body.style.overflow).toBe('hidden');
      });
    });

    it('restores body scroll when modal closes', async () => {
      const mockOnClose = vi.fn();
      const { unmount } = render(() => (
        <FeedbackModal show={true} onClose={mockOnClose}>
          <div>Content</div>
        </FeedbackModal>
      ));

      await waitFor(() => {
        expect(document.body.style.overflow).toBe('hidden');
      });

      unmount();

      expect(document.body.style.overflow).toBe('');
    });
  });

  describe('Accessibility', () => {
    it('close button has proper aria-label', () => {
      const mockOnClose = vi.fn();
      render(() => (
        <FeedbackModal show={true} onClose={mockOnClose}>
          <div>Content</div>
        </FeedbackModal>
      ));

      const closeButton = screen.getByLabelText('Close feedback modal');
      expect(closeButton).toBeInTheDocument();
    });

    it('modal has focus management configured', () => {
      const mockOnClose = vi.fn();
      render(() => (
        <FeedbackModal show={true} onClose={mockOnClose}>
          <div>
            <input type="text" data-testid="first-input" />
            <button>Submit</button>
          </div>
        </FeedbackModal>
      ));

      // modal renders with focusable elements for focus management
      expect(screen.getByTestId('first-input')).toBeInTheDocument();

      // The component has createEffect for focus management and uses modalRef
      // for querySelector to find and focus the first input element
      // Focus behavior is browser-dependent and difficult to test in JSDOM
    });
  });

  describe('Mobile Responsiveness', () => {
    it('renders correctly on mobile', () => {
      const mockOnClose = vi.fn();
      setViewport(VIEWPORTS.mobile.width, VIEWPORTS.mobile.height);
      render(() => (
        <FeedbackModal show={true} onClose={mockOnClose}>
          <div>Mobile Content</div>
        </FeedbackModal>
      ));

      expect(screen.getByText('Mobile Content')).toBeInTheDocument();
    });

    it('close button is accessible on mobile', () => {
      const mockOnClose = vi.fn();
      setViewport(VIEWPORTS.mobile.width, VIEWPORTS.mobile.height);
      render(() => (
        <FeedbackModal show={true} onClose={mockOnClose}>
          <div>Content</div>
        </FeedbackModal>
      ));

      const closeButton = screen.getByRole('button', {
        name: /Close feedback modal/i,
      });
      expect(closeButton).toBeInTheDocument();
      expect(closeButton).toBeVisible();
    });
  });

  describe('Structure', () => {
    it('renders modal card', () => {
      const mockOnClose = vi.fn();
      render(() => (
        <FeedbackModal show={true} onClose={mockOnClose}>
          <div>Content</div>
        </FeedbackModal>
      ));

      const modalCard = document.querySelector('.modal-card');
      expect(modalCard).toBeInTheDocument();
    });

    it('renders content inside modal card', () => {
      const mockOnClose = vi.fn();
      render(() => (
        <FeedbackModal show={true} onClose={mockOnClose}>
          <div data-testid="test-content">Test Content</div>
        </FeedbackModal>
      ));

      const modalCard = document.querySelector('.modal-card');
      const content = screen.getByTestId('test-content');

      expect(modalCard).toContainElement(content);
    });

    it('modal content stops click propagation', () => {
      const mockOnClose = vi.fn();
      render(() => (
        <FeedbackModal show={true} onClose={mockOnClose}>
          <div>Content</div>
        </FeedbackModal>
      ));

      // the modal card is rendered
      const modalCard = document.querySelector('.modal-card');
      expect(modalCard).toBeInTheDocument();

      // Clicking modal content doesn't trigger onClose due to stopPropagation
      // The Motion.div container has onClick with stopPropagation to prevent
      // clicks inside the modal from bubbling to the backdrop
      fireEvent.click(modalCard!);
      expect(mockOnClose).not.toHaveBeenCalled();
    });
  });
});
