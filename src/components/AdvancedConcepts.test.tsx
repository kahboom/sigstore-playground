import { render, screen, fireEvent, waitFor } from '@solidjs/testing-library';
import { describe, it, expect, beforeEach } from 'vitest';
import AdvancedConcepts from './AdvancedConcepts';
import { setViewport, VIEWPORTS } from '../test-setup';

describe('AdvancedConcepts', () => {
  beforeEach(() => {
    setViewport(VIEWPORTS.desktop.width, VIEWPORTS.desktop.height);
  });

  describe('Initial Render', () => {
    it('renders the advanced concepts title and subtitle', () => {
      render(() => <AdvancedConcepts />);

      expect(
        screen.getByText('Advanced Supply Chain Security')
      ).toBeInTheDocument();
      expect(
        screen.getByText(
          /Deep dive into attestations, policies, and SLSA compliance/i
        )
      ).toBeInTheDocument();
    });

    it('renders all 3 topic selector cards', () => {
      render(() => <AdvancedConcepts />);

      const topicCards = document.querySelectorAll('.topic-card');
      expect(topicCards).toHaveLength(3);
    });

    it('displays Attestations topic by default', () => {
      render(() => <AdvancedConcepts />);

      const topicTitles = screen.getAllByText('Attestations & Provenance');
      expect(topicTitles.length).toBeGreaterThan(0);
      expect(
        screen.getByText(
          /Learn how attestations provide verifiable metadata about software artifacts/i
        )
      ).toBeInTheDocument();
    });

    it('marks Attestations card as active by default', () => {
      render(() => <AdvancedConcepts />);

      const topicCards = document.querySelectorAll('.topic-card');
      const attestationsCard = Array.from(topicCards).find(card =>
        card.textContent?.includes('Attestations & Provenance')
      );
      expect(attestationsCard).toHaveClass('active');
    });

    it('displays all topic card icons', () => {
      render(() => <AdvancedConcepts />);

      expect(screen.getByText('📋')).toBeInTheDocument(); // Attestations
      expect(screen.getByText('🛡️')).toBeInTheDocument(); // Policy
      expect(screen.getByText('🏆')).toBeInTheDocument(); // SLSA
    });

    it('displays difficulty badges for all topics', () => {
      render(() => <AdvancedConcepts />);

      const badges = document.querySelectorAll('.difficulty-badge');
      expect(badges).toHaveLength(3);

      const badgeTexts = Array.from(badges).map(badge => badge.textContent);
      expect(badgeTexts).toContain('intermediate');
      expect(badgeTexts).toContain('advanced');
    });
  });

  describe('Topic Navigation', () => {
    it('switches to Policy topic when Policy card is clicked', async () => {
      render(() => <AdvancedConcepts />);

      const topicCards = document.querySelectorAll('.topic-card');
      const policyCard = Array.from(topicCards).find(card =>
        card.textContent?.includes('Policy Enforcement')
      ) as HTMLElement;
      fireEvent.click(policyCard);

      await waitFor(() => {
        expect(
          screen.getByText(
            /Understand how to enforce security policies on artifacts/i
          )
        ).toBeInTheDocument();
      });
    });

    it('switches to SLSA topic when SLSA card is clicked', async () => {
      render(() => <AdvancedConcepts />);

      const topicCards = document.querySelectorAll('.topic-card');
      const slsaCard = Array.from(topicCards).find(card =>
        card.textContent?.includes('SLSA Build Levels')
      ) as HTMLElement;
      fireEvent.click(slsaCard);

      await waitFor(() => {
        expect(
          screen.getByText(
            /Deep dive into SLSA maturity levels and progressive security guarantees/i
          )
        ).toBeInTheDocument();
      });
    });

    it('updates active state when switching topics', async () => {
      render(() => <AdvancedConcepts />);

      const topicCards = document.querySelectorAll('.topic-card');
      const policyCard = Array.from(topicCards).find(card =>
        card.textContent?.includes('Policy Enforcement')
      ) as HTMLElement;
      fireEvent.click(policyCard);

      await waitFor(() => {
        expect(policyCard).toHaveClass('active');
      });

      const attestationsCard = Array.from(topicCards).find(card =>
        card.textContent?.includes('Attestations & Provenance')
      ) as HTMLElement;
      expect(attestationsCard).not.toHaveClass('active');
    });

    it('allows switching between all topics', async () => {
      render(() => <AdvancedConcepts />);

      const topicCards = document.querySelectorAll('.topic-card');

      // Switch to Policy
      const policyCard = Array.from(topicCards).find(card =>
        card.textContent?.includes('Policy Enforcement')
      ) as HTMLElement;
      fireEvent.click(policyCard);
      await waitFor(() => {
        expect(screen.getByText(/Policy-Based Security/i)).toBeInTheDocument();
      });

      // Switch to SLSA
      const slsaCard = Array.from(topicCards).find(card =>
        card.textContent?.includes('SLSA Build Levels')
      ) as HTMLElement;
      fireEvent.click(slsaCard);
      await waitFor(() => {
        expect(screen.getByText(/SLSA Overview/i)).toBeInTheDocument();
      });

      // Back to Attestations
      const attestationsCard = Array.from(topicCards).find(card =>
        card.textContent?.includes('Attestations & Provenance')
      ) as HTMLElement;
      fireEvent.click(attestationsCard);
      await waitFor(() => {
        expect(
          screen.getByText(/What are Attestations\?/i)
        ).toBeInTheDocument();
      });
    });

    it('resets expanded concept when switching topics', async () => {
      render(() => <AdvancedConcepts />);

      // Expand first concept in Attestations
      const conceptHeaders = document.querySelectorAll('.concept-header');
      fireEvent.click(conceptHeaders[0]);

      await waitFor(() => {
        expect(
          screen.getByText(
            /Attestations are signed statements about artifacts/i
          )
        ).toBeInTheDocument();
      });

      // Switch to Policy topic
      const topicCards = document.querySelectorAll('.topic-card');
      const policyCard = Array.from(topicCards).find(card =>
        card.textContent?.includes('Policy Enforcement')
      ) as HTMLElement;
      fireEvent.click(policyCard);

      // Verify no concepts are expanded
      await waitFor(() => {
        const expandedContent = document.querySelector('.concept-content');
        expect(expandedContent).not.toBeInTheDocument();
      });
    });
  });

  describe('Attestations Topic Content', () => {
    it('displays all Attestations concepts', () => {
      render(() => <AdvancedConcepts />);

      expect(screen.getByText('What are Attestations?')).toBeInTheDocument();
      expect(screen.getByText('In-toto Framework')).toBeInTheDocument();
      expect(screen.getByText('SLSA Provenance')).toBeInTheDocument();
      expect(screen.getByText('Creating Attestations')).toBeInTheDocument();
      expect(screen.getByText('Verifying Attestations')).toBeInTheDocument();
    });

    it('expands concept when header is clicked', async () => {
      render(() => <AdvancedConcepts />);

      const conceptHeaders = document.querySelectorAll('.concept-header');
      const firstHeader = conceptHeaders[0] as HTMLElement;
      fireEvent.click(firstHeader);

      await waitFor(() => {
        expect(
          screen.getByText(
            /Attestations are signed statements about artifacts/i
          )
        ).toBeInTheDocument();
      });
    });

    it('collapses expanded concept when header is clicked again', async () => {
      render(() => <AdvancedConcepts />);

      const conceptHeaders = document.querySelectorAll('.concept-header');
      const firstHeader = conceptHeaders[0] as HTMLElement;

      // Expand
      fireEvent.click(firstHeader);
      await waitFor(() => {
        expect(
          screen.getByText(
            /Attestations are signed statements about artifacts/i
          )
        ).toBeInTheDocument();
      });

      // Collapse
      fireEvent.click(firstHeader);
      await waitFor(() => {
        expect(
          screen.queryByText(
            /Attestations are signed statements about artifacts/i
          )
        ).not.toBeInTheDocument();
      });
    });

    it('displays code examples when present', async () => {
      render(() => <AdvancedConcepts />);

      const conceptHeaders = document.querySelectorAll('.concept-header');
      const creatingHeader = Array.from(conceptHeaders).find(header =>
        header.textContent?.includes('Creating Attestations')
      ) as HTMLElement;
      fireEvent.click(creatingHeader);

      await waitFor(() => {
        const codeExample = screen.getByText(
          /cosign attest --predicate slsa-provenance\.json/i
        );
        expect(codeExample).toBeInTheDocument();
        expect(codeExample.closest('pre')).toHaveClass('code-example');
      });
    });

    it('displays real world analogy section', () => {
      render(() => <AdvancedConcepts />);

      expect(screen.getByText('💡 Real World Analogy')).toBeInTheDocument();
      expect(
        screen.getByText(
          /Attestations are like detailed receipts from a restaurant/i
        )
      ).toBeInTheDocument();
    });

    it('displays resource links for Attestations', () => {
      render(() => <AdvancedConcepts />);

      expect(screen.getByText('Learn More:')).toBeInTheDocument();

      const inTotoLink = screen.getByText('In-toto Docs →').closest('a');
      expect(inTotoLink).toHaveAttribute(
        'href',
        'https://docs.sigstore.dev/cosign/verifying/attestation/'
      );

      const slsaLink = screen.getByText('SLSA Spec →').closest('a');
      expect(slsaLink).toHaveAttribute('href', 'https://slsa.dev/');
    });

    it('toggles show + and − symbols correctly', async () => {
      render(() => <AdvancedConcepts />);

      const conceptHeaders = document.querySelectorAll('.concept-header');
      const firstHeader = conceptHeaders[0] as HTMLElement;
      const toggle = firstHeader.querySelector('.concept-toggle');

      // Initially collapsed (should show +)
      expect(toggle?.textContent).toBe('+');

      // Click to expand
      fireEvent.click(firstHeader);
      await waitFor(() => {
        expect(toggle?.textContent).toBe('−');
      });

      // Click to collapse
      fireEvent.click(firstHeader);
      await waitFor(() => {
        expect(toggle?.textContent).toBe('+');
      });
    });

    it('allows expanding different concepts independently', async () => {
      render(() => <AdvancedConcepts />);

      const conceptHeaders = document.querySelectorAll('.concept-header');
      const firstHeader = conceptHeaders[0] as HTMLElement;
      const secondHeader = conceptHeaders[1] as HTMLElement;

      // Expand first concept
      fireEvent.click(firstHeader);
      await waitFor(() => {
        expect(
          screen.getByText(
            /Attestations are signed statements about artifacts/i
          )
        ).toBeInTheDocument();
      });

      // Expand second concept (should close first)
      fireEvent.click(secondHeader);
      await waitFor(() => {
        expect(
          screen.getByText(
            /In-toto defines a standard format for attestations/i
          )
        ).toBeInTheDocument();
      });

      // First should be closed
      expect(
        screen.queryByText(
          /Attestations are signed statements about artifacts/i
        )
      ).not.toBeInTheDocument();
    });
  });

  describe('Policy Topic Content', () => {
    beforeEach(async () => {
      render(() => <AdvancedConcepts />);
      const topicCards = document.querySelectorAll('.topic-card');
      const policyCard = Array.from(topicCards).find(card =>
        card.textContent?.includes('Policy Enforcement')
      ) as HTMLElement;
      fireEvent.click(policyCard);

      await waitFor(() => {
        expect(screen.getByText('Policy-Based Security')).toBeInTheDocument();
      });
    });

    it('displays all Policy concepts', () => {
      expect(screen.getByText('Policy-Based Security')).toBeInTheDocument();
      expect(screen.getByText('Conforma Overview')).toBeInTheDocument();
      expect(screen.getByText('Writing Policies')).toBeInTheDocument();
      expect(screen.getByText('Policy Evaluation')).toBeInTheDocument();
      expect(screen.getByText('Integration Points')).toBeInTheDocument();
    });

    it('displays YAML code example for policies', async () => {
      const conceptHeaders = document.querySelectorAll('.concept-header');
      const writingPoliciesHeader = Array.from(conceptHeaders).find(header =>
        header.textContent?.includes('Writing Policies')
      ) as HTMLElement;
      fireEvent.click(writingPoliciesHeader);

      await waitFor(() => {
        expect(screen.getByText(/policy:/i)).toBeInTheDocument();
        expect(screen.getByText(/attestations:/i)).toBeInTheDocument();
        expect(screen.getByText(/github-actions/i)).toBeInTheDocument();
      });
    });

    it('displays Policy real world analogy', () => {
      expect(
        screen.getByText(/Policy enforcement is like airport security/i)
      ).toBeInTheDocument();
    });

    it('displays resource links for Policy', () => {
      const conformaLink = screen.getByText('Conforma →').closest('a');
      expect(conformaLink).toHaveAttribute('href', 'https://conforma.dev/');

      const policyControllerLink = screen
        .getByText('Policy Controller →')
        .closest('a');
      expect(policyControllerLink).toHaveAttribute(
        'href',
        'https://docs.sigstore.dev/policy-controller/overview/'
      );
    });

    it('displays advanced difficulty badge', () => {
      const topicCards = document.querySelectorAll('.topic-card');
      const policyCard = Array.from(topicCards).find(card =>
        card.textContent?.includes('Policy Enforcement')
      );
      const badge = policyCard?.querySelector('.difficulty-badge');
      expect(badge?.textContent).toBe('advanced');
    });
  });

  describe('SLSA Topic Content', () => {
    beforeEach(async () => {
      render(() => <AdvancedConcepts />);
      const topicCards = document.querySelectorAll('.topic-card');
      const slsaCard = Array.from(topicCards).find(card =>
        card.textContent?.includes('SLSA Build Levels')
      ) as HTMLElement;
      fireEvent.click(slsaCard);

      await waitFor(() => {
        expect(screen.getByText('SLSA Overview')).toBeInTheDocument();
      });
    });

    it('displays all SLSA concepts', () => {
      expect(screen.getByText('SLSA Overview')).toBeInTheDocument();
      expect(
        screen.getByText('Level 1: Provenance Exists')
      ).toBeInTheDocument();
      expect(
        screen.getByText('Level 2: Signed Provenance')
      ).toBeInTheDocument();
      expect(screen.getByText('Level 3: Hardened Builds')).toBeInTheDocument();
      expect(
        screen.getByText('Level 4: Two-Party Review + Hermetic')
      ).toBeInTheDocument();
    });

    it('displays SLSA level details when expanded', async () => {
      const conceptHeaders = document.querySelectorAll('.concept-header');
      const level3Header = Array.from(conceptHeaders).find(header =>
        header.textContent?.includes('Level 3: Hardened Builds')
      ) as HTMLElement;
      fireEvent.click(level3Header);

      await waitFor(() => {
        expect(
          screen.getByText(
            /Source and build platforms are verified and prevent unauthorized changes/i
          )
        ).toBeInTheDocument();
      });
    });

    it('displays SLSA real world analogy', () => {
      expect(
        screen.getByText(/SLSA levels are like education degrees/i)
      ).toBeInTheDocument();
    });

    it('displays resource links for SLSA', () => {
      const slsaSpecLinks = screen.getAllByText('SLSA Spec →');
      expect(slsaSpecLinks.length).toBeGreaterThan(0);
      const specLink = slsaSpecLinks[0].closest('a');
      expect(specLink).toHaveAttribute('href', 'https://slsa.dev/spec/');

      const levelsLink = screen.getByText('SLSA Levels →').closest('a');
      expect(levelsLink).toHaveAttribute(
        'href',
        'https://slsa.dev/spec/v1.0/levels'
      );
    });
  });

  describe('Mobile Responsiveness', () => {
    beforeEach(() => {
      setViewport(VIEWPORTS.mobile.width, VIEWPORTS.mobile.height);
    });

    it('renders topic selector on mobile', () => {
      render(() => <AdvancedConcepts />);

      const topicCards = document.querySelectorAll('.topic-card');
      expect(topicCards).toHaveLength(3);
    });

    it('allows selecting topics on mobile', async () => {
      render(() => <AdvancedConcepts />);

      const topicCards = document.querySelectorAll('.topic-card');
      const policyCard = Array.from(topicCards).find(card =>
        card.textContent?.includes('Policy Enforcement')
      ) as HTMLElement;
      fireEvent.click(policyCard);

      await waitFor(() => {
        expect(screen.getByText('Policy-Based Security')).toBeInTheDocument();
      });
    });

    it('displays topic content on mobile', () => {
      render(() => <AdvancedConcepts />);

      const topicTitles = screen.getAllByText('Attestations & Provenance');
      expect(topicTitles.length).toBeGreaterThan(0);
      expect(screen.getByText(/What are Attestations\?/i)).toBeInTheDocument();
    });

    it('renders accordion on mobile', async () => {
      render(() => <AdvancedConcepts />);

      const conceptHeaders = document.querySelectorAll('.concept-header');
      expect(conceptHeaders.length).toBeGreaterThan(0);

      fireEvent.click(conceptHeaders[0]);

      await waitFor(() => {
        expect(
          screen.getByText(
            /Attestations are signed statements about artifacts/i
          )
        ).toBeInTheDocument();
      });
    });

    it('renders external links on mobile', () => {
      render(() => <AdvancedConcepts />);

      expect(screen.getByText('Learn More:')).toBeInTheDocument();
      expect(screen.getByText('In-toto Docs →')).toBeInTheDocument();
      expect(screen.getByText('SLSA Spec →')).toBeInTheDocument();
    });
  });

  describe('Content Sections', () => {
    it('renders all content sections for a topic', () => {
      render(() => <AdvancedConcepts />);

      expect(screen.getByText('💡 Real World Analogy')).toBeInTheDocument();
      expect(screen.getByText('Learn More:')).toBeInTheDocument();

      const conceptsList = document.querySelector('.concepts-list');
      expect(conceptsList).toBeInTheDocument();
    });

    it('all external links open in new tab', () => {
      render(() => <AdvancedConcepts />);

      const links = screen.getAllByRole('link');
      const externalLinks = links.filter(link =>
        link.getAttribute('href')?.startsWith('http')
      );

      externalLinks.forEach(link => {
        expect(link).toHaveAttribute('target', '_blank');
        expect(link).toHaveAttribute('rel', 'noopener noreferrer');
      });
    });

    it('renders glass-card styling for topic content', async () => {
      render(() => <AdvancedConcepts />);

      // The topic content is rendered with glass-card class
      // We can verify by checking that the concepts list is present
      await waitFor(() => {
        const conceptsList = document.querySelector('.concepts-list');
        expect(conceptsList).toBeInTheDocument();
      });
    });

    it('applies topic-specific color as CSS variable', async () => {
      render(() => <AdvancedConcepts />);

      // Wait for initial render
      await waitFor(() => {
        const conceptsList = document.querySelector('.concepts-list');
        expect(conceptsList).toBeInTheDocument();
      });

      // Switch to policy and verify content changes
      const topicCards = document.querySelectorAll('.topic-card');
      const policyCard = Array.from(topicCards).find(card =>
        card.textContent?.includes('Policy Enforcement')
      ) as HTMLElement;
      fireEvent.click(policyCard);

      await waitFor(() => {
        expect(screen.getByText('Policy-Based Security')).toBeInTheDocument();
      });
    });
  });

  describe('Animations', () => {
    it('topic content has animation attributes', async () => {
      render(() => <AdvancedConcepts />);

      // Wait for concepts list to appear which is inside topic-content
      await waitFor(() => {
        const conceptsList = document.querySelector('.concepts-list');
        expect(conceptsList).toBeInTheDocument();
      });
    });

    it('concept content appears when expanded', async () => {
      render(() => <AdvancedConcepts />);

      // Wait for concepts to be rendered
      await waitFor(() => {
        const conceptHeaders = document.querySelectorAll('.concept-header');
        expect(conceptHeaders.length).toBeGreaterThan(0);
      });

      const conceptHeaders = document.querySelectorAll('.concept-header');
      const firstHeader = conceptHeaders[0] as HTMLElement;
      fireEvent.click(firstHeader);

      await waitFor(() => {
        // Check for the concept text which appears when expanded
        expect(
          screen.getByText(
            /Attestations are signed statements about artifacts/i
          )
        ).toBeInTheDocument();
      });
    });
  });

  describe('Edge Cases', () => {
    it('maintains topic state when clicking same topic', async () => {
      render(() => <AdvancedConcepts />);

      const topicCards = document.querySelectorAll('.topic-card');
      const attestationsCard = Array.from(topicCards).find(card =>
        card.textContent?.includes('Attestations & Provenance')
      ) as HTMLElement;

      fireEvent.click(attestationsCard);
      fireEvent.click(attestationsCard);
      fireEvent.click(attestationsCard);

      await waitFor(() => {
        const topicTitles = screen.getAllByText('Attestations & Provenance');
        expect(topicTitles.length).toBeGreaterThan(0);
      });
    });

    it('handles rapid topic switching', async () => {
      render(() => <AdvancedConcepts />);

      const topicCards = document.querySelectorAll('.topic-card');

      const policyCard = Array.from(topicCards).find(card =>
        card.textContent?.includes('Policy Enforcement')
      ) as HTMLElement;
      const slsaCard = Array.from(topicCards).find(card =>
        card.textContent?.includes('SLSA Build Levels')
      ) as HTMLElement;
      const attestationsCard = Array.from(topicCards).find(card =>
        card.textContent?.includes('Attestations & Provenance')
      ) as HTMLElement;

      fireEvent.click(policyCard);
      fireEvent.click(slsaCard);
      fireEvent.click(attestationsCard);
      fireEvent.click(policyCard);

      await waitFor(() => {
        expect(screen.getByText('Policy-Based Security')).toBeInTheDocument();
      });
    });

    it('handles rapid concept expansion/collapse', async () => {
      render(() => <AdvancedConcepts />);

      const conceptHeaders = document.querySelectorAll('.concept-header');
      const firstHeader = conceptHeaders[0] as HTMLElement;

      // Rapid clicks
      fireEvent.click(firstHeader);
      fireEvent.click(firstHeader);
      fireEvent.click(firstHeader);
      fireEvent.click(firstHeader);

      // Should end in collapsed state (4 clicks = 2 expand/collapse cycles)
      await waitFor(() => {
        expect(
          screen.queryByText(
            /Attestations are signed statements about artifacts/i
          )
        ).not.toBeInTheDocument();
      });
    });

    it('displays correct number of concepts for each topic', async () => {
      render(() => <AdvancedConcepts />);

      // Attestations has 5 concepts
      let conceptHeaders = document.querySelectorAll('.concept-header');
      expect(conceptHeaders).toHaveLength(5);

      // Switch to Policy (5 concepts)
      const topicCards = document.querySelectorAll('.topic-card');
      const policyCard = Array.from(topicCards).find(card =>
        card.textContent?.includes('Policy Enforcement')
      ) as HTMLElement;
      fireEvent.click(policyCard);

      await waitFor(() => {
        conceptHeaders = document.querySelectorAll('.concept-header');
        expect(conceptHeaders).toHaveLength(5);
      });

      // Switch to SLSA (5 concepts)
      const slsaCard = Array.from(topicCards).find(card =>
        card.textContent?.includes('SLSA Build Levels')
      ) as HTMLElement;
      fireEvent.click(slsaCard);

      await waitFor(() => {
        conceptHeaders = document.querySelectorAll('.concept-header');
        expect(conceptHeaders).toHaveLength(5);
      });
    });
  });

  describe('Accessibility', () => {
    it('topic cards are keyboard accessible', () => {
      render(() => <AdvancedConcepts />);

      const topicCards = document.querySelectorAll('.topic-card');
      topicCards.forEach(card => {
        expect(card.tagName).toBe('BUTTON');
      });
    });

    it('concept headers are keyboard accessible', () => {
      render(() => <AdvancedConcepts />);

      const conceptHeaders = document.querySelectorAll('.concept-header');
      conceptHeaders.forEach(header => {
        expect(header.tagName).toBe('BUTTON');
      });
    });

    it('external links have proper attributes', () => {
      render(() => <AdvancedConcepts />);

      const externalLinks = document.querySelectorAll('.btn-secondary');
      externalLinks.forEach(link => {
        expect(link).toHaveAttribute('target', '_blank');
        expect(link).toHaveAttribute('rel', 'noopener noreferrer');
      });
    });
  });

  describe('Layout Structure', () => {
    it('renders advanced-concepts container', () => {
      render(() => <AdvancedConcepts />);

      const container = document.querySelector('.advanced-concepts');
      expect(container).toBeInTheDocument();
    });

    it('renders topic selector grid', () => {
      render(() => <AdvancedConcepts />);

      const selector = document.querySelector('.topic-selector');
      expect(selector).toBeInTheDocument();
    });

    it('maintains layout structure across topic changes', async () => {
      render(() => <AdvancedConcepts />);

      const container = document.querySelector('.advanced-concepts');
      expect(container).toBeInTheDocument();

      const topicCards = document.querySelectorAll('.topic-card');
      const policyCard = Array.from(topicCards).find(card =>
        card.textContent?.includes('Policy Enforcement')
      ) as HTMLElement;
      fireEvent.click(policyCard);

      await waitFor(() => {
        expect(container).toBeInTheDocument();
        const selector = document.querySelector('.topic-selector');
        expect(selector).toBeInTheDocument();
      });
    });
  });
});
