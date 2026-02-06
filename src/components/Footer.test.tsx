import { render, screen } from '@solidjs/testing-library';
import { describe, it, expect } from 'vitest';
import { Footer } from './Footer';
import { setViewport, VIEWPORTS } from '../test-setup';

describe('Footer', () => {
  describe('Initial Render', () => {
    it('renders all main footer links', () => {
      render(() => <Footer />);

      expect(screen.getByText('Sigstore.dev')).toBeInTheDocument();
      expect(screen.getByText('Documentation')).toBeInTheDocument();
      expect(screen.getByText('GitHub')).toBeInTheDocument();
      expect(screen.getByText('Slack')).toBeInTheDocument();
    });

    it('renders footer note about OpenSSF', () => {
      render(() => <Footer />);

      expect(screen.getByText(/Sigstore is a project under the/i)).toBeInTheDocument();
      expect(screen.getByText('Open Source Security Foundation (OpenSSF)')).toBeInTheDocument();
    });

    it('renders disclaimer', () => {
      render(() => <Footer />);

      expect(screen.getByText(/Sigstore® and the Sigstore logo are trademarks/i)).toBeInTheDocument();
      expect(screen.getByText(/This project is unaffiliated and provided for educational purposes/i)).toBeInTheDocument();
    });

    it('renders dividers between links', () => {
      render(() => <Footer />);

      const dividers = document.querySelectorAll('.divider');
      expect(dividers.length).toBe(3);
    });
  });

  describe('External Links', () => {
    it('Sigstore.dev link has correct URL', () => {
      render(() => <Footer />);

      const link = screen.getByText('Sigstore.dev').closest('a');
      expect(link).toHaveAttribute('href', 'https://sigstore.dev');
    });

    it('Documentation link has correct URL', () => {
      render(() => <Footer />);

      const link = screen.getByText('Documentation').closest('a');
      expect(link).toHaveAttribute('href', 'https://docs.sigstore.dev');
    });

    it('GitHub link has correct URL', () => {
      render(() => <Footer />);

      const link = screen.getByText('GitHub').closest('a');
      expect(link).toHaveAttribute('href', 'https://github.com/sigstore');
    });

    it('Slack link has correct URL', () => {
      render(() => <Footer />);

      const link = screen.getByText('Slack').closest('a');
      expect(link).toHaveAttribute('href', 'https://slack.sigstore.dev');
    });

    it('OpenSSF link has correct URL', () => {
      render(() => <Footer />);

      const link = screen.getByText('Open Source Security Foundation (OpenSSF)').closest('a');
      expect(link).toHaveAttribute('href', 'https://openssf.org');
    });

    it('all external links open in new tab', () => {
      render(() => <Footer />);

      const links = screen.getAllByRole('link');
      
      links.forEach(link => {
        expect(link).toHaveAttribute('target', '_blank');
        expect(link).toHaveAttribute('rel', 'noopener noreferrer');
      });
    });
  });

  describe('Layout Structure', () => {
    it('renders footer element', () => {
      render(() => <Footer />);

      const footer = document.querySelector('footer.footer');
      expect(footer).toBeInTheDocument();
    });

    it('renders footer content container', () => {
      render(() => <Footer />);

      const footerContent = document.querySelector('.footer-content');
      expect(footerContent).toBeInTheDocument();
    });

    it('renders footer main section', () => {
      render(() => <Footer />);

      const footerMain = document.querySelector('.footer-main');
      expect(footerMain).toBeInTheDocument();
    });

    it('renders footer bottom section', () => {
      render(() => <Footer />);

      const footerBottom = document.querySelector('.footer-bottom');
      expect(footerBottom).toBeInTheDocument();
    });

    it('renders footer links container', () => {
      render(() => <Footer />);

      const footerLinks = document.querySelector('.footer-links');
      expect(footerLinks).toBeInTheDocument();
    });
  });

  describe('Mobile Responsiveness', () => {
    it('renders all links on mobile', () => {
      setViewport(VIEWPORTS.mobile.width, VIEWPORTS.mobile.height);
      render(() => <Footer />);

      expect(screen.getByText('Sigstore.dev')).toBeInTheDocument();
      expect(screen.getByText('Documentation')).toBeInTheDocument();
      expect(screen.getByText('GitHub')).toBeInTheDocument();
      expect(screen.getByText('Slack')).toBeInTheDocument();
    });

    it('renders footer note on mobile', () => {
      setViewport(VIEWPORTS.mobile.width, VIEWPORTS.mobile.height);
      render(() => <Footer />);

      expect(screen.getByText(/Sigstore is a project under the/i)).toBeInTheDocument();
    });

    it('renders disclaimer on mobile', () => {
      setViewport(VIEWPORTS.mobile.width, VIEWPORTS.mobile.height);
      render(() => <Footer />);

      expect(screen.getByText(/Sigstore® and the Sigstore logo are trademarks/i)).toBeInTheDocument();
    });

    it('maintains link functionality on mobile', () => {
      setViewport(VIEWPORTS.mobile.width, VIEWPORTS.mobile.height);
      render(() => <Footer />);

      const link = screen.getByText('Documentation').closest('a');
      expect(link).toHaveAttribute('href', 'https://docs.sigstore.dev');
    });

    it('renders all sections on mobile', () => {
      setViewport(VIEWPORTS.mobile.width, VIEWPORTS.mobile.height);
      render(() => <Footer />);

      const footerMain = document.querySelector('.footer-main');
      const footerBottom = document.querySelector('.footer-bottom');

      expect(footerMain).toBeInTheDocument();
      expect(footerBottom).toBeInTheDocument();
    });
  });

  describe('Tablet Responsiveness', () => {
    it('renders correctly on tablet', () => {
      setViewport(VIEWPORTS.tablet.width, VIEWPORTS.tablet.height);
      render(() => <Footer />);

      expect(screen.getByText('Sigstore.dev')).toBeInTheDocument();
      expect(screen.getByText('Documentation')).toBeInTheDocument();
      expect(screen.getByText('GitHub')).toBeInTheDocument();
      expect(screen.getByText('Slack')).toBeInTheDocument();
    });
  });

  describe('Content Styling', () => {
  describe('Accessibility', () => {
    it('all links are accessible', () => {
      render(() => <Footer />);

      const links = screen.getAllByRole('link');
      expect(links.length).toBe(5);

      links.forEach(link => {
        expect(link).toBeVisible();
        expect(link.getAttribute('href')).toBeTruthy();
      });
    });

    it('footer is a semantic footer element', () => {
      render(() => <Footer />);

      const footer = document.querySelector('footer');
      expect(footer).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('renders with no errors when re-rendered', () => {
      const { unmount } = render(() => <Footer />);

      expect(screen.getByText('Sigstore.dev')).toBeInTheDocument();

      unmount();

      render(() => <Footer />);
      expect(screen.getByText('Sigstore.dev')).toBeInTheDocument();
    });

    it('maintains structure with multiple renders', () => {
      const { unmount } = render(() => <Footer />);
      unmount();

      render(() => <Footer />);

      const footerLinks = document.querySelector('.footer-links');
      expect(footerLinks).toBeInTheDocument();
      
      const links = screen.getAllByRole('link');
      expect(links.length).toBe(5);
    });
  });
});
