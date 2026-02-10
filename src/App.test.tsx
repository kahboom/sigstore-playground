import { render, screen, fireEvent, waitFor } from '@solidjs/testing-library';
import { describe, it, expect } from 'vitest';
import App from './App';
import { setViewport, VIEWPORTS } from './test-setup';

describe('App', () => {
  describe('Initial Render', () => {
    it('renders the header', () => {
      render(() => <App />);

      expect(screen.getByText('Sigstore')).toBeInTheDocument();
      expect(screen.getByText('Playground')).toBeInTheDocument();
    });

    it('renders the footer', () => {
      render(() => <App />);

      expect(screen.getByText('Sigstore.dev')).toBeInTheDocument();
    });

    it('displays Signing Journey view by default', async () => {
      render(() => <App />);

      await waitFor(() => {
        expect(
          screen.getByText(/The Sigstore Signing Journey/i)
        ).toBeInTheDocument();
      });
    });

    it('renders background effects', () => {
      render(() => <App />);

      const gradientOrbs = document.querySelectorAll('.gradient-orb');
      expect(gradientOrbs.length).toBe(3);

      const gridOverlay = document.querySelector('.grid-overlay');
      expect(gridOverlay).toBeInTheDocument();
    });
  });

  describe('View Navigation', () => {
    it('switches to Component Explorer when explorer button is clicked', async () => {
      render(() => <App />);

      const buttons = screen.getAllByRole('button');
      const explorerButton = buttons.find(
        btn =>
          btn.textContent === 'Component Explorer' &&
          btn.classList.contains('nav-btn')
      );
      fireEvent.click(explorerButton!);

      await waitFor(() => {
        expect(
          screen.getByText(
            /Deep dive into each piece of the Sigstore ecosystem/i
          )
        ).toBeInTheDocument();
      });
    });

    it('switches to Quiz when quiz button is clicked', async () => {
      render(() => <App />);

      const buttons = document.querySelectorAll('.nav-btn');
      const quizButton = Array.from(buttons).find(
        btn => btn.textContent === 'Test Your Knowledge'
      ) as HTMLElement;
      fireEvent.click(quizButton!);

      await waitFor(() => {
        expect(
          screen.getByText(/How well do you understand Sigstore/i)
        ).toBeInTheDocument();
      });
    });

    it('switches back to Signing Journey from another view', async () => {
      render(() => <App />);

      const buttons = document.querySelectorAll('.nav-btn');

      // Navigate to explorer
      const explorerButton = Array.from(buttons).find(
        btn => btn.textContent === 'Component Explorer'
      ) as HTMLElement;
      fireEvent.click(explorerButton!);
      await waitFor(() => {
        expect(
          screen.getByText('The Signing Swiss Army Knife')
        ).toBeInTheDocument();
      });

      // navigate back to journey
      const journeyButton = Array.from(buttons).find(
        btn => btn.textContent === 'Signing Journey'
      ) as HTMLElement;
      fireEvent.click(journeyButton!);
      await waitFor(() => {
        expect(
          screen.getByText(/The Sigstore Signing Journey/i)
        ).toBeInTheDocument();
      });
    });

    it('allows navigating between all four views', async () => {
      render(() => <App />);

      // journey (default)
      await waitFor(() => {
        expect(
          screen.getByText(/The Sigstore Signing Journey/i)
        ).toBeInTheDocument();
      });

      const buttons = document.querySelectorAll('.nav-btn');

      // to explorer
      const explorerButton = Array.from(buttons).find(
        btn => btn.textContent === 'Component Explorer'
      ) as HTMLElement;
      fireEvent.click(explorerButton!);
      await waitFor(() => {
        expect(
          screen.getByText('The Signing Swiss Army Knife')
        ).toBeInTheDocument();
      });

      // to quiz
      const quizButton = Array.from(buttons).find(
        btn => btn.textContent === 'Test Your Knowledge'
      ) as HTMLElement;
      fireEvent.click(quizButton!);
      await waitFor(() => {
        expect(
          screen.getByText(/How well do you understand Sigstore/i)
        ).toBeInTheDocument();
      });

      // back to journey
      const journeyButton = Array.from(buttons).find(
        btn => btn.textContent === 'Signing Journey'
      ) as HTMLElement;
      fireEvent.click(journeyButton!);
      await waitFor(() => {
        expect(
          screen.getByText(/The Sigstore Signing Journey/i)
        ).toBeInTheDocument();
      });
    });
  });

  describe('Header Integration', () => {
    it('passes correct currentView prop to Header', () => {
      render(() => <App />);

      const buttons = document.querySelectorAll('.nav-btn');
      const journeyButton = Array.from(buttons).find(
        btn => btn.textContent === 'Signing Journey'
      ) as HTMLElement;
      expect(journeyButton).toHaveClass('active');
    });

    it('updates header active state when view changes', () => {
      render(() => <App />);

      const buttons = document.querySelectorAll('.nav-btn');
      const explorerButton = Array.from(buttons).find(
        btn => btn.textContent === 'Component Explorer'
      ) as HTMLElement;
      fireEvent.click(explorerButton!);

      expect(explorerButton).toHaveClass('active');

      const journeyButton = Array.from(buttons).find(
        btn => btn.textContent === 'Signing Journey'
      ) as HTMLElement;
      expect(journeyButton).not.toHaveClass('active');
    });

    it('maintains header visibility across view changes', () => {
      render(() => <App />);

      expect(screen.getByText('Sigstore')).toBeInTheDocument();

      const buttons = document.querySelectorAll('.nav-btn');

      const explorerButton = Array.from(buttons).find(
        btn => btn.textContent === 'Component Explorer'
      ) as HTMLElement;
      fireEvent.click(explorerButton!);
      expect(screen.getByText('Sigstore')).toBeInTheDocument();

      const quizButton = Array.from(buttons).find(
        btn => btn.textContent === 'Test Your Knowledge'
      ) as HTMLElement;
      fireEvent.click(quizButton!);
      expect(screen.getByText('Sigstore')).toBeInTheDocument();
    });
  });

  describe('Footer Integration', () => {
    it('maintains footer visibility across view changes', () => {
      render(() => <App />);

      expect(screen.getByText('Sigstore.dev')).toBeInTheDocument();

      const buttons = document.querySelectorAll('.nav-btn');

      const explorerButton = Array.from(buttons).find(
        btn => btn.textContent === 'Component Explorer'
      ) as HTMLElement;
      fireEvent.click(explorerButton!);
      expect(screen.getByText('Sigstore.dev')).toBeInTheDocument();

      const quizButton = Array.from(buttons).find(
        btn => btn.textContent === 'Test Your Knowledge'
      ) as HTMLElement;
      fireEvent.click(quizButton!);
      expect(screen.getByText('Sigstore.dev')).toBeInTheDocument();
    });
  });

  describe('View Rendering', () => {
    it('renders only one view at a time', async () => {
      render(() => <App />);

      // should show journey
      await waitFor(() => {
        expect(
          screen.getByText(/The Sigstore Signing Journey/i)
        ).toBeInTheDocument();
      });

      // should not show explorer or quiz content
      expect(
        screen.queryByText('The Signing Swiss Army Knife')
      ).not.toBeInTheDocument();
      expect(
        screen.queryByText(/How well do you understand Sigstore/i)
      ).not.toBeInTheDocument();
    });

    it('unmounts previous view when switching', async () => {
      render(() => <App />);

      // start on journey
      await waitFor(() => {
        expect(
          screen.getByText(/The Sigstore Signing Journey/i)
        ).toBeInTheDocument();
      });

      // switch to explorer
      const buttons = document.querySelectorAll('.nav-btn');
      const explorerButton = Array.from(buttons).find(
        btn => btn.textContent === 'Component Explorer'
      ) as HTMLElement;
      fireEvent.click(explorerButton!);

      // journey should be unmounted
      await waitFor(() => {
        expect(
          screen.queryByText(/The Sigstore Signing Journey/i)
        ).not.toBeInTheDocument();
      });
    });
  });

  describe('Mobile Responsiveness', () => {
    it('renders all views on mobile', async () => {
      setViewport(VIEWPORTS.mobile.width, VIEWPORTS.mobile.height);
      render(() => <App />);

      // journey by default
      await waitFor(() => {
        expect(
          screen.getByText(/The Sigstore Signing Journey/i)
        ).toBeInTheDocument();
      });

      const buttons = document.querySelectorAll('.nav-btn');

      // switch to explorer
      const explorerButton = Array.from(buttons).find(
        btn => btn.textContent === 'Component Explorer'
      ) as HTMLElement;
      fireEvent.click(explorerButton!);
      await waitFor(() => {
        expect(
          screen.getByText('The Signing Swiss Army Knife')
        ).toBeInTheDocument();
      });

      // switch to quiz
      const quizButton = Array.from(buttons).find(
        btn => btn.textContent === 'Test Your Knowledge'
      ) as HTMLElement;
      fireEvent.click(quizButton!);
      await waitFor(() => {
        expect(
          screen.getByText(/How well do you understand Sigstore/i)
        ).toBeInTheDocument();
      });
    });

    it('maintains header functionality on mobile', () => {
      setViewport(VIEWPORTS.mobile.width, VIEWPORTS.mobile.height);
      render(() => <App />);

      const buttons = document.querySelectorAll('.nav-btn');
      const explorerButton = Array.from(buttons).find(
        btn => btn.textContent === 'Component Explorer'
      ) as HTMLElement;
      fireEvent.click(explorerButton!);

      expect(explorerButton).toHaveClass('active');
    });

    it('renders background effects on mobile', () => {
      setViewport(VIEWPORTS.mobile.width, VIEWPORTS.mobile.height);
      render(() => <App />);

      const backgroundEffects = document.querySelector('.background-effects');
      expect(backgroundEffects).toBeInTheDocument();
    });
  });

  describe('Layout Structure', () => {
    it('renders main-content container', () => {
      render(() => <App />);

      const mainContent = document.querySelector('.main-content');
      expect(mainContent).toBeInTheDocument();
    });

    it('renders app container', () => {
      render(() => <App />);

      const appContainer = document.querySelector('.app');
      expect(appContainer).toBeInTheDocument();
    });

    it('maintains layout structure across view changes', () => {
      render(() => <App />);

      const mainContent = document.querySelector('.main-content');
      expect(mainContent).toBeInTheDocument();

      const buttons = document.querySelectorAll('.nav-btn');

      const explorerButton = Array.from(buttons).find(
        btn => btn.textContent === 'Component Explorer'
      ) as HTMLElement;
      fireEvent.click(explorerButton!);
      expect(mainContent).toBeInTheDocument();

      const quizButton = Array.from(buttons).find(
        btn => btn.textContent === 'Test Your Knowledge'
      ) as HTMLElement;
      fireEvent.click(quizButton!);
      expect(mainContent).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('handles rapid view switching', async () => {
      render(() => <App />);

      const buttons = document.querySelectorAll('.nav-btn');

      // rapidly switch between views
      const explorerButton = Array.from(buttons).find(
        btn => btn.textContent === 'Component Explorer'
      ) as HTMLElement;
      const quizButton = Array.from(buttons).find(
        btn => btn.textContent === 'Test Your Knowledge'
      ) as HTMLElement;
      const journeyButton = Array.from(buttons).find(
        btn => btn.textContent === 'Signing Journey'
      ) as HTMLElement;

      fireEvent.click(explorerButton!);
      fireEvent.click(quizButton!);
      fireEvent.click(journeyButton!);
      fireEvent.click(explorerButton!);

      // should end on explorer
      await waitFor(() => {
        expect(
          screen.getByText('The Signing Swiss Army Knife')
        ).toBeInTheDocument();
      });
    });

    it('maintains view state after clicking same view button', async () => {
      render(() => <App />);

      const buttons = document.querySelectorAll('.nav-btn');
      const journeyButton = Array.from(buttons).find(
        btn => btn.textContent === 'Signing Journey'
      ) as HTMLElement;

      // click same button multiple times
      fireEvent.click(journeyButton!);
      fireEvent.click(journeyButton!);

      // should still show journey
      await waitFor(() => {
        expect(
          screen.getByText(/The Sigstore Signing Journey/i)
        ).toBeInTheDocument();
      });
    });
  });

  describe('Feedback System', () => {
    beforeEach(() => {
      // mock fetch for feedback form
      globalThis.fetch = vi.fn();
    });

    it('renders FeedbackButton', () => {
      render(() => <App />);

      const feedbackButton = screen.getByLabelText(/Open feedback form/i);
      expect(feedbackButton).toBeInTheDocument();
    });

    it('feedback modal is initially hidden', () => {
      render(() => <App />);

      expect(screen.queryByText('Share Your Feedback')).not.toBeInTheDocument();
    });

    it('opens feedback modal when FeedbackButton is clicked', async () => {
      render(() => <App />);

      const feedbackButton = screen.getByLabelText(/Open feedback form/i);
      fireEvent.click(feedbackButton);

      await waitFor(() => {
        expect(screen.getByText('Share Your Feedback')).toBeInTheDocument();
      });
    });

    it('opens feedback modal when footer feedback link is clicked', async () => {
      render(() => <App />);

      const feedbackLink = document.querySelector('.feedback-link');
      expect(feedbackLink).toBeInTheDocument();
      fireEvent.click(feedbackLink!);

      await waitFor(() => {
        expect(screen.getByText('Share Your Feedback')).toBeInTheDocument();
      });
    });

    it('closes feedback modal when close button is clicked', async () => {
      render(() => <App />);

      // open modal
      const feedbackButton = screen.getByLabelText(/Open feedback form/i);
      fireEvent.click(feedbackButton);

      await waitFor(() => {
        expect(screen.getByText('Share Your Feedback')).toBeInTheDocument();
      });

      // close modal
      const closeButton = screen.getByRole('button', {
        name: /Close feedback modal/i,
      });
      fireEvent.click(closeButton);

      await waitFor(() => {
        expect(
          screen.queryByText('Share Your Feedback')
        ).not.toBeInTheDocument();
      });
    });

    it('closes feedback modal after successful form submission', async () => {
      (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        headers: {
          get: () => 'application/json',
        },
      });

      render(() => <App />);

      // open modal
      const feedbackButton = screen.getByLabelText(/Open feedback form/i);
      fireEvent.click(feedbackButton);

      await waitFor(() => {
        expect(screen.getByText('Share Your Feedback')).toBeInTheDocument();
      });

      // fill and submit form
      fireEvent.input(screen.getByPlaceholderText(/Your name/i), {
        target: { value: 'John Doe' },
      });
      fireEvent.input(
        screen.getByPlaceholderText(/your\.email@example\.com/i),
        {
          target: { value: 'john@example.com' },
        }
      );
      fireEvent.click(screen.getByRole('button', { name: /Submit Feedback/i }));

      // modal should close after successful submission
      await waitFor(() => {
        expect(
          screen.queryByText('Share Your Feedback')
        ).not.toBeInTheDocument();
      });
    });

    it('keeps modal open if form submission fails', async () => {
      (globalThis.fetch as ReturnType<typeof vi.fn>).mockRejectedValueOnce(
        new Error('Network error')
      );

      render(() => <App />);

      // open modal
      const feedbackButton = screen.getByLabelText(/Open feedback form/i);
      fireEvent.click(feedbackButton);

      await waitFor(() => {
        expect(screen.getByText('Share Your Feedback')).toBeInTheDocument();
      });

      // fill and submit form
      fireEvent.input(screen.getByPlaceholderText(/Your name/i), {
        target: { value: 'John Doe' },
      });
      fireEvent.input(
        screen.getByPlaceholderText(/your\.email@example\.com/i),
        {
          target: { value: 'john@example.com' },
        }
      );
      fireEvent.click(screen.getByRole('button', { name: /Submit Feedback/i }));

      // modal should stay open and show error
      await waitFor(() => {
        expect(screen.getByText('Share Your Feedback')).toBeInTheDocument();
        expect(
          screen.getByText(/Failed to submit feedback. Please try again./i)
        ).toBeInTheDocument();
      });
    });

    it('feedback button remains visible across view changes', () => {
      render(() => <App />);

      // check on journey view
      expect(screen.getByLabelText(/Open feedback form/i)).toBeInTheDocument();

      const buttons = document.querySelectorAll('.nav-btn');

      // check on explorer view
      const explorerButton = Array.from(buttons).find(
        btn => btn.textContent === 'Component Explorer'
      ) as HTMLElement;
      fireEvent.click(explorerButton!);
      expect(screen.getByLabelText(/Open feedback form/i)).toBeInTheDocument();

      // check on quiz view
      const quizButton = Array.from(buttons).find(
        btn => btn.textContent === 'Test Your Knowledge'
      ) as HTMLElement;
      fireEvent.click(quizButton!);
      expect(screen.getByLabelText(/Open feedback form/i)).toBeInTheDocument();
    });
  });
});
