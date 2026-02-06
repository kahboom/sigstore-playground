import { render, screen, fireEvent } from '@solidjs/testing-library';
import { describe, it, expect, beforeEach } from 'vitest';
import { ComponentExplorer } from './ComponentExplorer';
import { setViewport, VIEWPORTS } from '../test-setup';

describe('ComponentExplorer', () => {
  beforeEach(() => {
    setViewport(VIEWPORTS.desktop.width, VIEWPORTS.desktop.height);
  });

  describe('Initial Render', () => {
    it('renders the explorer title and subtitle', () => {
      render(() => <ComponentExplorer />);

      expect(screen.getByText('Component Explorer')).toBeInTheDocument();
      expect(screen.getByText(/Deep dive into each piece of the Sigstore ecosystem/i)).toBeInTheDocument();
    });

    it('renders all 4 component selector buttons', () => {
      render(() => <ComponentExplorer />);

      const buttons = document.querySelectorAll('.component-btn');
      expect(buttons).toHaveLength(4);
    });

    it('displays Cosign component by default', () => {
      render(() => <ComponentExplorer />);

      expect(screen.getByText('The Signing Swiss Army Knife')).toBeInTheDocument();
      expect(screen.getByText(/Cosign is the command-line tool/i)).toBeInTheDocument();
    });

    it('marks Cosign button as active by default', () => {
      render(() => <ComponentExplorer />);

      const buttons = document.querySelectorAll('.component-btn');
      const cosignButton = Array.from(buttons).find(btn => btn.textContent?.includes('Cosign'));
      expect(cosignButton).toHaveClass('active');
    });
  });

  describe('Component Navigation', () => {
    it('switches to Fulcio when Fulcio button is clicked', () => {
      render(() => <ComponentExplorer />);

      const buttons = document.querySelectorAll('.component-btn');
      const fulcioButton = Array.from(buttons).find(btn => btn.textContent?.includes('Fulcio')) as HTMLElement;
      fireEvent.click(fulcioButton!);

      expect(screen.getByText('The Identity-Based Certificate Authority')).toBeInTheDocument();
      expect(screen.getByText(/Fulcio is a free-to-use certificate authority/i)).toBeInTheDocument();
    });

    it('switches to Rekor when Rekor button is clicked', () => {
      render(() => <ComponentExplorer />);

      const buttons = document.querySelectorAll('.component-btn');
      const rekorButton = Array.from(buttons).find(btn => btn.textContent?.includes('Rekor')) as HTMLElement;
      fireEvent.click(rekorButton!);

      expect(screen.getByText('The Immutable Transparency Log')).toBeInTheDocument();
      expect(screen.getByText(/Rekor is a transparency log/i)).toBeInTheDocument();
    });

    it('switches to OIDC when OIDC Providers button is clicked', () => {
      render(() => <ComponentExplorer />);

      const buttons = document.querySelectorAll('.component-btn');
      const oidcButton = Array.from(buttons).find(btn => btn.textContent?.includes('OIDC Providers')) as HTMLElement;
      fireEvent.click(oidcButton!);

      expect(screen.getByText('Your Existing Identity, Now for Signing')).toBeInTheDocument();
      expect(screen.getByText(/OpenID Connect providers/i)).toBeInTheDocument();
    });

    it('updates active state when switching components', () => {
      render(() => <ComponentExplorer />);

      const buttons = document.querySelectorAll('.component-btn');
      const fulcioButton = Array.from(buttons).find(btn => btn.textContent?.includes('Fulcio')) as HTMLElement;
      fireEvent.click(fulcioButton!);

      expect(fulcioButton).toHaveClass('active');

      const cosignButton = Array.from(buttons).find(btn => btn.textContent?.includes('Cosign')) as HTMLElement;
      expect(cosignButton).not.toHaveClass('active');
    });

    it('allows switching between all components', () => {
      render(() => <ComponentExplorer />);

      const buttons = document.querySelectorAll('.component-btn');
      
      // Switch through all components
      const fulcioButton = Array.from(buttons).find(btn => btn.textContent?.includes('Fulcio')) as HTMLElement;
      fireEvent.click(fulcioButton!);
      expect(screen.getByText('The Identity-Based Certificate Authority')).toBeInTheDocument();

      const rekorButton = Array.from(buttons).find(btn => btn.textContent?.includes('Rekor')) as HTMLElement;
      fireEvent.click(rekorButton!);
      expect(screen.getByText('The Immutable Transparency Log')).toBeInTheDocument();

      const oidcButton = Array.from(buttons).find(btn => btn.textContent?.includes('OIDC Providers')) as HTMLElement;
      fireEvent.click(oidcButton!);
      expect(screen.getByText('Your Existing Identity, Now for Signing')).toBeInTheDocument();

      const cosignButton = Array.from(buttons).find(btn => btn.textContent?.includes('Cosign')) as HTMLElement;
      fireEvent.click(cosignButton!);
      expect(screen.getByText('The Signing Swiss Army Knife')).toBeInTheDocument();
    });
  });

  describe('Cosign Component Content', () => {
    it('displays Cosign key points', () => {
      render(() => <ComponentExplorer />);

      expect(screen.getByText(/Signs container images, blobs, and OCI artifacts/i)).toBeInTheDocument();
      expect(screen.getByText(/Supports keyless signing with OIDC/i)).toBeInTheDocument();
      expect(screen.getByText(/Can also use traditional key-based signing/i)).toBeInTheDocument();
    });

    it('displays Cosign how it works steps', () => {
      render(() => <ComponentExplorer />);

      expect(screen.getByText(/Developer runs cosign sign/i)).toBeInTheDocument();
      expect(screen.getByText(/Cosign generates an ephemeral key pair/i)).toBeInTheDocument();
      expect(screen.getByText(/Requests a certificate from Fulcio/i)).toBeInTheDocument();
    });

    it('displays Cosign real world analogy', () => {
      render(() => <ComponentExplorer />);

      expect(screen.getByText(/Think of Cosign like a digital notary/i)).toBeInTheDocument();
    });
  });

  describe('Fulcio Component Content', () => {
    beforeEach(() => {
      render(() => <ComponentExplorer />);
      const buttons = document.querySelectorAll('.component-btn');
      const fulcioButton = Array.from(buttons).find(btn => btn.textContent?.includes('Fulcio')) as HTMLElement;
      fireEvent.click(fulcioButton!);
    });

    it('displays Fulcio key points', () => {
      expect(screen.getByText(/Issues certificates valid for ~10 minutes/i)).toBeInTheDocument();
      expect(screen.getByText(/Binds your OIDC identity to a public key/i)).toBeInTheDocument();
      expect(screen.getByText(/Eliminates key management headaches/i)).toBeInTheDocument();
    });

    it('displays Fulcio how it works steps', () => {
      expect(screen.getByText(/Receives OIDC token and public key/i)).toBeInTheDocument();
      expect(screen.getByText(/Verifies the OIDC token with the provider/i)).toBeInTheDocument();
      expect(screen.getByText(/Creates a certificate with identity in SAN field/i)).toBeInTheDocument();
    });

    it('displays Fulcio analogy', () => {
      expect(screen.getByText(/Fulcio is like a government office/i)).toBeInTheDocument();
    });

    it('displays Fulcio external links', () => {
      const githubLink = screen.getByText('GitHub →').closest('a');
      expect(githubLink).toHaveAttribute('href', 'https://github.com/sigstore/fulcio');
    });
  });

  describe('Rekor Component Content', () => {
    beforeEach(() => {
      render(() => <ComponentExplorer />);
      const buttons = document.querySelectorAll('.component-btn');
      const rekorButton = Array.from(buttons).find(btn => btn.textContent?.includes('Rekor')) as HTMLElement;
      fireEvent.click(rekorButton!);
    });

    it('displays Rekor key points', () => {
      expect(screen.getByText(/Append-only log/i)).toBeInTheDocument();
      expect(screen.getByText(/Provides timestamped proof of signing/i)).toBeInTheDocument();
      expect(screen.getByText(/Publicly auditable by anyone/i)).toBeInTheDocument();
      expect(screen.getByText(/Uses Merkle trees for integrity/i)).toBeInTheDocument();
    });

    it('displays Rekor how it works steps', () => {
      expect(screen.getByText(/Client submits signing metadata to Rekor/i)).toBeInTheDocument();
      expect(screen.getByText(/Rekor validates and timestamps the entry/i)).toBeInTheDocument();
      expect(screen.getByText(/Entry is added to the Merkle tree/i)).toBeInTheDocument();
    });

    it('displays Rekor analogy', () => {
      expect(screen.getByText(/Rekor is like a newspaper/i)).toBeInTheDocument();
    });

    it('displays Rekor public instance link', () => {
      const publicLink = screen.getByText('Public Instance →').closest('a');
      expect(publicLink).toHaveAttribute('href', 'https://rekor.sigstore.dev');
    });
  });

  describe('OIDC Component Content', () => {
    beforeEach(() => {
      render(() => <ComponentExplorer />);
      const buttons = document.querySelectorAll('.component-btn');
      const oidcButton = Array.from(buttons).find(btn => btn.textContent?.includes('OIDC Providers')) as HTMLElement;
      fireEvent.click(oidcButton!);
    });

    it('displays OIDC key points', () => {
      expect(screen.getByText(/Use your GitHub, Google, or Microsoft identity/i)).toBeInTheDocument();
      expect(screen.getByText(/No new accounts or keys to manage/i)).toBeInTheDocument();
      expect(screen.getByText(/Workload identity for CI\/CD systems/i)).toBeInTheDocument();
    });

    it('displays OIDC how it works steps', () => {
      expect(screen.getByText(/Developer authenticates with OIDC provider/i)).toBeInTheDocument();
      expect(screen.getByText(/Provider issues an ID token with claims/i)).toBeInTheDocument();
      expect(screen.getByText(/Token proves identity to Fulcio/i)).toBeInTheDocument();
    });
  });

  describe('Interactive Diagram', () => {
    it('renders the ecosystem diagram', () => {
      render(() => <ComponentExplorer />);

      expect(screen.getByText('🔄 How They Work Together')).toBeInTheDocument();
      expect(screen.getByText('Developer')).toBeInTheDocument();
      expect(screen.getByText('Signed Artifact')).toBeInTheDocument();
    });
  });

  describe('Mobile Responsiveness', () => {
    beforeEach(() => {
      setViewport(VIEWPORTS.mobile.width, VIEWPORTS.mobile.height);
    });

    it('renders component selector on mobile', () => {
      render(() => <ComponentExplorer />);

      const buttons = document.querySelectorAll('.component-btn');
      expect(buttons.length).toBe(4);
    });

    it('allows selecting components on mobile', () => {
      render(() => <ComponentExplorer />);

      const buttons = document.querySelectorAll('.component-btn');
      const fulcioButton = Array.from(buttons).find(btn => btn.textContent?.includes('Fulcio')) as HTMLElement;
      fireEvent.click(fulcioButton!);

      expect(screen.getByText('The Identity-Based Certificate Authority')).toBeInTheDocument();
    });

    it('displays component content on mobile', () => {
      render(() => <ComponentExplorer />);

      expect(screen.getByText('The Signing Swiss Army Knife')).toBeInTheDocument();
      expect(screen.getByText(/Cosign is the command-line tool/i)).toBeInTheDocument();
    });

    it('shows key points section on mobile', () => {
      render(() => <ComponentExplorer />);

      expect(screen.getByText('✨ Key Points')).toBeInTheDocument();
    });

    it('shows how it works section on mobile', () => {
      render(() => <ComponentExplorer />);

      expect(screen.getByText('⚙️ How It Works')).toBeInTheDocument();
    });

    it('displays diagram on mobile', () => {
      render(() => <ComponentExplorer />);

      expect(screen.getByText('🔄 How They Work Together')).toBeInTheDocument();
    });

    it('renders external links on mobile', () => {
      render(() => <ComponentExplorer />);

      expect(screen.getByText('Learn more:')).toBeInTheDocument();
      expect(screen.getByText('GitHub →')).toBeInTheDocument();
    });
  });

  describe('Content Sections', () => {
    it('renders all card sections for a component', () => {
      render(() => <ComponentExplorer />);

      expect(screen.getByText('✨ Key Points')).toBeInTheDocument();
      expect(screen.getByText('⚙️ How It Works')).toBeInTheDocument();
      expect(screen.getByText('💡 Real World Analogy')).toBeInTheDocument();
      expect(screen.getByText('🎉 Fun Fact')).toBeInTheDocument();
    });

    it('displays numbered steps in How It Works section', () => {
      render(() => <ComponentExplorer />);

      const numberedItems = document.querySelectorAll('.step-num');
      expect(numberedItems.length).toBeGreaterThan(0);
    });

    it('displays Learn more links section', () => {
      render(() => <ComponentExplorer />);

      expect(screen.getByText('Learn more:')).toBeInTheDocument();
    });

    it('all external links open in new tab', () => {
      render(() => <ComponentExplorer />);

      const links = screen.getAllByRole('link');
      const externalLinks = links.filter(link => 
        link.getAttribute('href')?.startsWith('http')
      );

      externalLinks.forEach(link => {
        expect(link).toHaveAttribute('target', '_blank');
        expect(link).toHaveAttribute('rel', 'noopener noreferrer');
      });
    });
  });

  describe('Edge Cases', () => {
    it('maintains component state when clicking same component', () => {
      render(() => <ComponentExplorer />);

      const buttons = document.querySelectorAll('.component-btn');
      const cosignButton = Array.from(buttons).find(btn => btn.textContent?.includes('Cosign')) as HTMLElement;
      
      // Click Cosign multiple times
      fireEvent.click(cosignButton!);
      fireEvent.click(cosignButton!);
      fireEvent.click(cosignButton!);

      // Should still show Cosign content
      expect(screen.getByText('The Signing Swiss Army Knife')).toBeInTheDocument();
    });

    it('handles rapid component switching', () => {
      render(() => <ComponentExplorer />);

      const buttons = document.querySelectorAll('.component-btn');
      
      // Rapidly switch between components
      const fulcioButton = Array.from(buttons).find(btn => btn.textContent?.includes('Fulcio')) as HTMLElement;
      const rekorButton = Array.from(buttons).find(btn => btn.textContent?.includes('Rekor')) as HTMLElement;
      const oidcButton = Array.from(buttons).find(btn => btn.textContent?.includes('OIDC Providers')) as HTMLElement;
      const cosignButton = Array.from(buttons).find(btn => btn.textContent?.includes('Cosign')) as HTMLElement;
      
      fireEvent.click(fulcioButton!);
      fireEvent.click(rekorButton!);
      fireEvent.click(oidcButton!);
      fireEvent.click(cosignButton!);

      // Should end on Cosign
      expect(screen.getByText('The Signing Swiss Army Knife')).toBeInTheDocument();
    });
  });
});
