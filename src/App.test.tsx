import { render, screen, fireEvent } from '@solidjs/testing-library';
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

    it('displays Signing Journey view by default', () => {
      render(() => <App />);

      expect(
        screen.getByText(/The Sigstore Signing Journey/i)
      ).toBeInTheDocument();
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
    it('switches to Component Explorer when explorer button is clicked', () => {
      render(() => <App />);

      const buttons = screen.getAllByRole('button');
      const explorerButton = buttons.find(
        btn =>
          btn.textContent === 'Component Explorer' &&
          btn.classList.contains('nav-btn')
      );
      fireEvent.click(explorerButton!);

      expect(
        screen.getByText(/Deep dive into each piece of the Sigstore ecosystem/i)
      ).toBeInTheDocument();
    });

    it('switches to Quiz when quiz button is clicked', () => {
      render(() => <App />);

      const buttons = document.querySelectorAll('.nav-btn');
      const quizButton = Array.from(buttons).find(
        btn => btn.textContent === 'Test Your Knowledge'
      ) as HTMLElement;
      fireEvent.click(quizButton!);

      expect(
        screen.getByText(/How well do you understand Sigstore/i)
      ).toBeInTheDocument();
    });

    it('switches back to Signing Journey from another view', () => {
      render(() => <App />);

      const buttons = document.querySelectorAll('.nav-btn');

      // Navigate to explorer
      const explorerButton = Array.from(buttons).find(
        btn => btn.textContent === 'Component Explorer'
      ) as HTMLElement;
      fireEvent.click(explorerButton!);
      expect(
        screen.getByText('The Signing Swiss Army Knife')
      ).toBeInTheDocument();

      // Navigate back to journey
      const journeyButton = Array.from(buttons).find(
        btn => btn.textContent === 'Signing Journey'
      ) as HTMLElement;
      fireEvent.click(journeyButton!);
      expect(
        screen.getByText(/The Sigstore Signing Journey/i)
      ).toBeInTheDocument();
    });

    it('allows navigating between all three views', () => {
      render(() => <App />);

      // Journey (default)
      expect(
        screen.getByText(/The Sigstore Signing Journey/i)
      ).toBeInTheDocument();

      const buttons = document.querySelectorAll('.nav-btn');

      // To Explorer
      const explorerButton = Array.from(buttons).find(
        btn => btn.textContent === 'Component Explorer'
      ) as HTMLElement;
      fireEvent.click(explorerButton!);
      expect(
        screen.getByText('The Signing Swiss Army Knife')
      ).toBeInTheDocument();

      // To Quiz
      const quizButton = Array.from(buttons).find(
        btn => btn.textContent === 'Test Your Knowledge'
      ) as HTMLElement;
      fireEvent.click(quizButton!);
      expect(
        screen.getByText(/How well do you understand Sigstore/i)
      ).toBeInTheDocument();

      // Back to Journey
      const journeyButton = Array.from(buttons).find(
        btn => btn.textContent === 'Signing Journey'
      ) as HTMLElement;
      fireEvent.click(journeyButton!);
      expect(
        screen.getByText(/The Sigstore Signing Journey/i)
      ).toBeInTheDocument();
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
    it('renders only one view at a time', () => {
      render(() => <App />);

      // Should show journey
      expect(
        screen.getByText(/The Sigstore Signing Journey/i)
      ).toBeInTheDocument();

      // Should not show explorer or quiz content
      expect(
        screen.queryByText('The Signing Swiss Army Knife')
      ).not.toBeInTheDocument();
      expect(
        screen.queryByText(/How well do you understand Sigstore/i)
      ).not.toBeInTheDocument();
    });

    it('unmounts previous view when switching', () => {
      render(() => <App />);

      // Start on journey
      expect(
        screen.getByText(/The Sigstore Signing Journey/i)
      ).toBeInTheDocument();

      // Switch to explorer
      const buttons = document.querySelectorAll('.nav-btn');
      const explorerButton = Array.from(buttons).find(
        btn => btn.textContent === 'Component Explorer'
      ) as HTMLElement;
      fireEvent.click(explorerButton!);

      // Journey should be unmounted
      expect(
        screen.queryByText(/The Sigstore Signing Journey/i)
      ).not.toBeInTheDocument();
    });
  });

  describe('Mobile Responsiveness', () => {
    it('renders all views on mobile', () => {
      setViewport(VIEWPORTS.mobile.width, VIEWPORTS.mobile.height);
      render(() => <App />);

      // Journey by default
      expect(
        screen.getByText(/The Sigstore Signing Journey/i)
      ).toBeInTheDocument();

      const buttons = document.querySelectorAll('.nav-btn');

      // Switch to explorer
      const explorerButton = Array.from(buttons).find(
        btn => btn.textContent === 'Component Explorer'
      ) as HTMLElement;
      fireEvent.click(explorerButton!);
      expect(
        screen.getByText('The Signing Swiss Army Knife')
      ).toBeInTheDocument();

      // Switch to quiz
      const quizButton = Array.from(buttons).find(
        btn => btn.textContent === 'Test Your Knowledge'
      ) as HTMLElement;
      fireEvent.click(quizButton!);
      expect(
        screen.getByText(/How well do you understand Sigstore/i)
      ).toBeInTheDocument();
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
    it('handles rapid view switching', () => {
      render(() => <App />);

      const buttons = document.querySelectorAll('.nav-btn');

      // Rapidly switch between views
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

      // Should end on Explorer
      expect(
        screen.getByText('The Signing Swiss Army Knife')
      ).toBeInTheDocument();
    });

    it('maintains view state after clicking same view button', () => {
      render(() => <App />);

      const buttons = document.querySelectorAll('.nav-btn');
      const journeyButton = Array.from(buttons).find(
        btn => btn.textContent === 'Signing Journey'
      ) as HTMLElement;

      // Click same button multiple times
      fireEvent.click(journeyButton!);
      fireEvent.click(journeyButton!);

      // Should still show journey
      expect(
        screen.getByText(/The Sigstore Signing Journey/i)
      ).toBeInTheDocument();
    });
  });
});
