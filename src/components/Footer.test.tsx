import { render, screen } from '@solidjs/testing-library';
import { describe, it, expect, vi } from 'vitest';
import { Footer } from './Footer';
import { setViewport, VIEWPORTS } from '../test-setup';

describe('Footer', () => {
  describe('Initial Render', () => {
    it('renders all main footer links', () => {
      const mockFeedbackClick = vi.fn();
      render(() => <Footer onFeedbackClick={mockFeedbackClick} />);

      expect(screen.getByText('Sigstore.dev')).toBeInTheDocument();
      expect(screen.getByText('Documentation')).toBeInTheDocument();
      expect(screen.getByText('GitHub')).toBeInTheDocument();
      expect(screen.getByText('Slack')).toBeInTheDocument();
      expect(screen.getByText('Feedback')).toBeInTheDocument();
    });

    it('renders footer note about OpenSSF', () => {
      const mockFeedbackClick = vi.fn();
      render(() => <Footer onFeedbackClick={mockFeedbackClick} />);

      expect(
        screen.getByText(/Sigstore is a project under the/i)
      ).toBeInTheDocument();
      expect(
        screen.getByText('Open Source Security Foundation (OpenSSF)')
      ).toBeInTheDocument();
    });

    it('renders disclaimer', () => {
      const mockFeedbackClick = vi.fn();
      render(() => <Footer onFeedbackClick={mockFeedbackClick} />);

      expect(
        screen.getByText(/Sigstore® and the Sigstore logo are trademarks/i)
      ).toBeInTheDocument();
      expect(
        screen.getByText(
          /This project is unaffiliated and provided for educational purposes/i
        )
      ).toBeInTheDocument();
    });

    it('renders dividers between links', () => {
      const mockFeedbackClick = vi.fn();
      render(() => <Footer onFeedbackClick={mockFeedbackClick} />);

      const dividers = document.querySelectorAll('.divider');
      expect(dividers.length).toBe(4);
    });
  });

  describe('External Links', () => {
    it('Sigstore.dev link has correct URL', () => {
      const mockFeedbackClick = vi.fn();
      render(() => <Footer onFeedbackClick={mockFeedbackClick} />);

      const link = screen.getByText('Sigstore.dev').closest('a');
      expect(link).toHaveAttribute('href', 'https://sigstore.dev');
    });

    it('Documentation link has correct URL', () => {
      const mockFeedbackClick = vi.fn();
      render(() => <Footer onFeedbackClick={mockFeedbackClick} />);

      const link = screen.getByText('Documentation').closest('a');
      expect(link).toHaveAttribute('href', 'https://docs.sigstore.dev');
    });

    it('GitHub link has correct URL', () => {
      const mockFeedbackClick = vi.fn();
      render(() => <Footer onFeedbackClick={mockFeedbackClick} />);

      const link = screen.getByText('GitHub').closest('a');
      expect(link).toHaveAttribute('href', 'https://github.com/sigstore');
    });

    it('Slack link has correct URL', () => {
      const mockFeedbackClick = vi.fn();
      render(() => <Footer onFeedbackClick={mockFeedbackClick} />);

      const link = screen.getByText('Slack').closest('a');
      expect(link).toHaveAttribute('href', 'https://slack.sigstore.dev');
    });

    it('OpenSSF link has correct URL', () => {
      const mockFeedbackClick = vi.fn();
      render(() => <Footer onFeedbackClick={mockFeedbackClick} />);

      const link = screen
        .getByText('Open Source Security Foundation (OpenSSF)')
        .closest('a');
      expect(link).toHaveAttribute('href', 'https://openssf.org');
    });

    it('external links open in new tab', () => {
      const mockFeedbackClick = vi.fn();
      render(() => <Footer onFeedbackClick={mockFeedbackClick} />);

      const externalLinks = [
        screen.getByText('Sigstore.dev'),
        screen.getByText('Documentation'),
        screen.getByText('GitHub'),
        screen.getByText('Slack'),
      ];

      externalLinks.forEach(link => {
        const anchor = link.closest('a');
        expect(anchor).toHaveAttribute('target', '_blank');
        expect(anchor).toHaveAttribute('rel', 'noopener noreferrer');
      });
    });
  });

  describe('Feedback Link', () => {
    it('renders feedback link', () => {
      const mockFeedbackClick = vi.fn();
      render(() => <Footer onFeedbackClick={mockFeedbackClick} />);

      expect(screen.getByText('Feedback')).toBeInTheDocument();
    });

    it('feedback link calls onFeedbackClick when clicked', () => {
      const mockFeedbackClick = vi.fn();
      render(() => <Footer onFeedbackClick={mockFeedbackClick} />);

      const feedbackLink = screen.getByText('Feedback');
      feedbackLink.click();

      expect(mockFeedbackClick).toHaveBeenCalledTimes(1);
    });

    it('feedback link prevents default navigation', () => {
      const mockFeedbackClick = vi.fn();
      render(() => <Footer onFeedbackClick={mockFeedbackClick} />);

      const feedbackLink = screen.getByText('Feedback').closest('a');
      expect(feedbackLink).toHaveAttribute('href', '#');
    });

    it('feedback link has correct class', () => {
      const mockFeedbackClick = vi.fn();
      render(() => <Footer onFeedbackClick={mockFeedbackClick} />);

      const feedbackLink = screen.getByText('Feedback').closest('a');
      expect(feedbackLink).toHaveClass('feedback-link');
    });
  });

  describe('Layout Structure', () => {
    it('renders footer element', () => {
      const mockFeedbackClick = vi.fn();
      render(() => <Footer onFeedbackClick={mockFeedbackClick} />);

      const footer = document.querySelector('footer.footer');
      expect(footer).toBeInTheDocument();
    });

    it('renders footer content container', () => {
      const mockFeedbackClick = vi.fn();
      render(() => <Footer onFeedbackClick={mockFeedbackClick} />);

      const footerContent = document.querySelector('.footer-content');
      expect(footerContent).toBeInTheDocument();
    });

    it('renders footer main section', () => {
      const mockFeedbackClick = vi.fn();
      render(() => <Footer onFeedbackClick={mockFeedbackClick} />);

      const footerMain = document.querySelector('.footer-main');
      expect(footerMain).toBeInTheDocument();
    });

    it('renders footer bottom section', () => {
      const mockFeedbackClick = vi.fn();
      render(() => <Footer onFeedbackClick={mockFeedbackClick} />);

      const footerBottom = document.querySelector('.footer-bottom');
      expect(footerBottom).toBeInTheDocument();
    });

    it('renders footer links container', () => {
      const mockFeedbackClick = vi.fn();
      render(() => <Footer onFeedbackClick={mockFeedbackClick} />);

      const footerLinks = document.querySelector('.footer-links');
      expect(footerLinks).toBeInTheDocument();
    });
  });

  describe('Mobile Responsiveness', () => {
    it('renders all links on mobile', () => {
      const mockFeedbackClick = vi.fn();
      setViewport(VIEWPORTS.mobile.width, VIEWPORTS.mobile.height);
      render(() => <Footer onFeedbackClick={mockFeedbackClick} />);

      expect(screen.getByText('Sigstore.dev')).toBeInTheDocument();
      expect(screen.getByText('Documentation')).toBeInTheDocument();
      expect(screen.getByText('GitHub')).toBeInTheDocument();
      expect(screen.getByText('Slack')).toBeInTheDocument();
      expect(screen.getByText('Feedback')).toBeInTheDocument();
    });

    it('renders footer note on mobile', () => {
      const mockFeedbackClick = vi.fn();
      setViewport(VIEWPORTS.mobile.width, VIEWPORTS.mobile.height);
      render(() => <Footer onFeedbackClick={mockFeedbackClick} />);

      expect(
        screen.getByText(/Sigstore is a project under the/i)
      ).toBeInTheDocument();
    });

    it('renders disclaimer on mobile', () => {
      const mockFeedbackClick = vi.fn();
      setViewport(VIEWPORTS.mobile.width, VIEWPORTS.mobile.height);
      render(() => <Footer onFeedbackClick={mockFeedbackClick} />);

      expect(
        screen.getByText(/Sigstore® and the Sigstore logo are trademarks/i)
      ).toBeInTheDocument();
    });

    it('maintains link functionality on mobile', () => {
      const mockFeedbackClick = vi.fn();
      setViewport(VIEWPORTS.mobile.width, VIEWPORTS.mobile.height);
      render(() => <Footer onFeedbackClick={mockFeedbackClick} />);

      const link = screen.getByText('Documentation').closest('a');
      expect(link).toHaveAttribute('href', 'https://docs.sigstore.dev');
    });

    it('renders all sections on mobile', () => {
      const mockFeedbackClick = vi.fn();
      setViewport(VIEWPORTS.mobile.width, VIEWPORTS.mobile.height);
      render(() => <Footer onFeedbackClick={mockFeedbackClick} />);

      const footerMain = document.querySelector('.footer-main');
      const footerBottom = document.querySelector('.footer-bottom');

      expect(footerMain).toBeInTheDocument();
      expect(footerBottom).toBeInTheDocument();
    });

    it('feedback link works on mobile', () => {
      const mockFeedbackClick = vi.fn();
      setViewport(VIEWPORTS.mobile.width, VIEWPORTS.mobile.height);
      render(() => <Footer onFeedbackClick={mockFeedbackClick} />);

      const feedbackLink = screen.getByText('Feedback');
      feedbackLink.click();

      expect(mockFeedbackClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('Tablet Responsiveness', () => {
    it('renders correctly on tablet', () => {
      const mockFeedbackClick = vi.fn();
      setViewport(VIEWPORTS.tablet.width, VIEWPORTS.tablet.height);
      render(() => <Footer onFeedbackClick={mockFeedbackClick} />);

      expect(screen.getByText('Sigstore.dev')).toBeInTheDocument();
      expect(screen.getByText('Documentation')).toBeInTheDocument();
      expect(screen.getByText('GitHub')).toBeInTheDocument();
      expect(screen.getByText('Slack')).toBeInTheDocument();
      expect(screen.getByText('Feedback')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('all links are accessible', () => {
      const mockFeedbackClick = vi.fn();
      render(() => <Footer onFeedbackClick={mockFeedbackClick} />);

      const links = screen.getAllByRole('link');
      expect(links.length).toBe(6);

      links.forEach(link => {
        expect(link).toBeVisible();
        expect(link.getAttribute('href')).toBeTruthy();
      });
    });

    it('footer is a semantic footer element', () => {
      const mockFeedbackClick = vi.fn();
      render(() => <Footer onFeedbackClick={mockFeedbackClick} />);

      const footer = document.querySelector('footer');
      expect(footer).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('renders with no errors when re-rendered', () => {
      const mockViewChange = vi.fn();
      const { unmount } = render(() => (
        <Footer onViewChange={mockViewChange} />
      ));

      expect(screen.getByText('Sigstore.dev')).toBeInTheDocument();

      unmount();

      render(() => <Footer onViewChange={mockViewChange} />);
      expect(screen.getByText('Sigstore.dev')).toBeInTheDocument();
    });

    it('maintains structure with multiple renders', () => {
      const mockViewChange = vi.fn();
      const { unmount } = render(() => (
        <Footer onViewChange={mockViewChange} />
      ));
      unmount();

      render(() => <Footer onViewChange={mockViewChange} />);

      const footerLinks = document.querySelector('.footer-links');
      expect(footerLinks).toBeInTheDocument();

      const links = screen.getAllByRole('link');
      expect(links.length).toBe(6);
    });
  });
});
