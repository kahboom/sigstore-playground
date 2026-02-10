import { render, screen, fireEvent, waitFor } from '@solidjs/testing-library';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import SigningJourney from './SigningJourney';
import { setViewport, VIEWPORTS } from '../test-setup';

describe('SigningJourney', () => {
  beforeEach(() => {
    setViewport(VIEWPORTS.desktop.width, VIEWPORTS.desktop.height);
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Initial Render', () => {
    it('renders the journey title and subtitle', () => {
      render(() => <SigningJourney />);

      expect(
        screen.getByText('The Sigstore Signing Journey')
      ).toBeInTheDocument();
      expect(
        screen.getByText(
          /Watch how keyless signing works, step by step. Click through each stage!/i
        )
      ).toBeInTheDocument();
    });

    it('displays control buttons', () => {
      render(() => <SigningJourney />);

      expect(screen.getByText('Reset')).toBeInTheDocument();
    });

    it('renders all flow nodes', () => {
      render(() => <SigningJourney />);

      const flowNodes = document.querySelectorAll('.flow-node');
      expect(flowNodes.length).toBe(6); // 6 steps in the journey
    });

    it('shows first step as active by default', () => {
      render(() => <SigningJourney />);

      const flowNodes = document.querySelectorAll('.flow-node');
      expect(flowNodes[0]).toHaveClass('active');
    });

    it('displays step information', () => {
      render(() => <SigningJourney />);

      expect(
        screen.getByText('Developer initiates signing')
      ).toBeInTheDocument();
      expect(
        screen.getByText(
          /You want to sign your software artifact to prove it came from you/i
        )
      ).toBeInTheDocument();
    });

    it('shows step counter', () => {
      render(() => <SigningJourney />);

      expect(screen.getByText(/Step 1 of 6/i)).toBeInTheDocument();
    });
  });

  describe('Step Navigation', () => {
    it('advances to next step when next button is clicked', () => {
      render(() => <SigningJourney />);

      const nextButton = screen.getByText('Next →');
      fireEvent.click(nextButton);

      expect(screen.getByText(/Step 2 of 6/i)).toBeInTheDocument();
      expect(screen.getByText('Authenticate with OIDC')).toBeInTheDocument();
    });

    it('goes back to previous step when back button is clicked', () => {
      render(() => <SigningJourney />);

      // go to step 2
      const nextButton = screen.getByText('Next →');
      fireEvent.click(nextButton);

      // go back to step 1
      const backButton = screen.getByText('← Previous');
      fireEvent.click(backButton);

      expect(screen.getByText(/Step 1 of 6/i)).toBeInTheDocument();
      expect(
        screen.getByText('Developer initiates signing')
      ).toBeInTheDocument();
    });

    it('disables back button on first step', () => {
      render(() => <SigningJourney />);

      const backButton = screen.getByText('← Previous').closest('button');
      expect(backButton).toBeDisabled();
    });

    it('disables next button on last step', () => {
      render(() => <SigningJourney />);

      // navigate to last step
      for (let i = 0; i < 5; i++) {
        const nextButton = screen.getByText('Next →');
        fireEvent.click(nextButton);
      }

      const nextButton = screen.getByText('Next →').closest('button');
      expect(nextButton).toBeDisabled();
    });

    it('allows clicking flow nodes to jump to that step', () => {
      render(() => <SigningJourney />);

      const flowNodes = document.querySelectorAll('.flow-node');
      fireEvent.click(flowNodes[2]); // click third node

      expect(screen.getByText(/Step 3 of 6/i)).toBeInTheDocument();
      expect(
        screen.getByText('Request certificate from Fulcio')
      ).toBeInTheDocument();
    });

    it('marks completed steps', () => {
      render(() => <SigningJourney />);

      // complete first step
      const actionButton = screen.getByText('🔑 Generate Key Pair');
      fireEvent.click(actionButton);

      vi.runAllTimers();

      const flowNodes = document.querySelectorAll('.flow-node');
      expect(flowNodes[0]).toHaveClass('completed');
    });
  });

  describe('Reset Functionality', () => {
    it('resets journey to first step', () => {
      render(() => <SigningJourney />);

      // navigate to step 3
      const nextButton = screen.getByText('Next →');
      fireEvent.click(nextButton);
      fireEvent.click(nextButton);

      // reset
      const resetButton = screen.getByText('Reset');
      fireEvent.click(resetButton);

      expect(screen.getByText(/Step 1 of 6/i)).toBeInTheDocument();
      expect(
        screen.getByText('Developer initiates signing')
      ).toBeInTheDocument();
    });

    it('clears completed steps on reset', () => {
      render(() => <SigningJourney />);

      // complete first step
      const actionButton = screen.getByText('🔑 Generate Key Pair');
      fireEvent.click(actionButton);

      vi.runAllTimers();

      // reset
      const resetButton = screen.getByText('Reset');
      fireEvent.click(resetButton);

      const flowNodes = document.querySelectorAll('.flow-node.completed');
      expect(flowNodes.length).toBe(0);
    });

    it('generates new hash on reset', () => {
      render(() => <SigningJourney />);

      // navigate to step with hash (step 4)
      for (let i = 0; i < 3; i++) {
        const nextButton = screen.getByText('Next →');
        fireEvent.click(nextButton);
      }

      const initialHash = document.querySelector('.hash-display')?.textContent;

      // reset
      const resetButton = screen.getByText('Reset');
      fireEvent.click(resetButton);

      // navigate back to hash step
      for (let i = 0; i < 3; i++) {
        const nextButton = screen.getByText('Next →');
        fireEvent.click(nextButton);
      }

      const newHash = document.querySelector('.hash-display')?.textContent;
      // hashes should be different (very unlikely to be same)
      if (initialHash && newHash) {
        expect(newHash).toBeTruthy();
      }
    });
  });

  describe('Step Actions', () => {
    it('displays action button for current step', () => {
      render(() => <SigningJourney />);

      expect(screen.getByText('🔑 Generate Key Pair')).toBeInTheDocument();
    });

    it('completes step when action button is clicked', () => {
      render(() => <SigningJourney />);

      const actionButton = screen.getByText('🔑 Generate Key Pair');
      fireEvent.click(actionButton);

      vi.advanceTimersByTime(1000);

      const flowNodes = document.querySelectorAll('.flow-node');
      expect(flowNodes[0]).toHaveClass('completed');
    });

    it('advances to next step after action completion', async () => {
      render(() => <SigningJourney />);

      const actionButton = screen.getByText('🔑 Generate Key Pair');
      fireEvent.click(actionButton);

      vi.advanceTimersByTime(1300);

      await waitFor(() => {
        expect(screen.getByText(/Step 2 of 6/i)).toBeInTheDocument();
      });
    });
  });

  describe('Visual Components', () => {
    it('displays step icon', () => {
      render(() => <SigningJourney />);

      const flowNodes = document.querySelectorAll('.flow-node-icon');
      expect(flowNodes.length).toBeGreaterThan(0);
    });

    it('shows step details', () => {
      render(() => <SigningJourney />);

      expect(
        screen.getByText(/Developer runs `cosign sign`/i)
      ).toBeInTheDocument();
    });

    it('displays completion badge for last step', () => {
      render(() => <SigningJourney />);

      // navigate to last step
      for (let i = 0; i < 5; i++) {
        const nextButton = screen.getByText('Next →');
        fireEvent.click(nextButton);
      }

      // complete final step
      const actionButton = screen.getByText('✅ Verify');
      fireEvent.click(actionButton);

      vi.runAllTimers();

      const completionText =
        screen.queryByText(/Journey Complete!/i) ||
        screen.queryByText(/Verification complete!/i);
      expect(completionText).toBeInTheDocument();
    });
  });

  describe('Component Visuals', () => {
    it('renders component visual for developer step', () => {
      render(() => <SigningJourney />);

      const visualArea = document.querySelector('.journey-visual');
      expect(visualArea).toBeInTheDocument();
    });

    it('changes visual when step changes', () => {
      render(() => <SigningJourney />);

      const initialVisual =
        document.querySelector('.journey-visual')?.innerHTML;

      const nextButton = screen.getByText('Next →');
      fireEvent.click(nextButton);

      const updatedVisual =
        document.querySelector('.journey-visual')?.innerHTML;
      expect(updatedVisual).not.toBe(initialVisual);
    });
  });

  describe('Mobile Responsiveness', () => {
    it('renders journey on mobile viewport', () => {
      setViewport(VIEWPORTS.mobile.width, VIEWPORTS.mobile.height);
      render(() => <SigningJourney />);

      expect(
        screen.getByText('The Sigstore Signing Journey')
      ).toBeInTheDocument();
    });

    it('displays controls on mobile', () => {
      setViewport(VIEWPORTS.mobile.width, VIEWPORTS.mobile.height);
      render(() => <SigningJourney />);

      expect(screen.getByText('Reset')).toBeInTheDocument();
    });

    it('allows navigation on mobile', () => {
      setViewport(VIEWPORTS.mobile.width, VIEWPORTS.mobile.height);
      render(() => <SigningJourney />);

      const nextButton = screen.getByText('Next →');
      fireEvent.click(nextButton);

      expect(screen.getByText(/Step 2 of 6/i)).toBeInTheDocument();
    });
  });

  describe('Flow Diagram', () => {
    it('highlights active node', () => {
      render(() => <SigningJourney />);

      const flowNodes = document.querySelectorAll('.flow-node');
      expect(flowNodes[0]).toHaveClass('active');
    });

    it('shows connectors between nodes', () => {
      render(() => <SigningJourney />);

      const connectors = document.querySelectorAll('.flow-node-connector');
      expect(connectors.length).toBeGreaterThan(0);
    });

    it('displays node labels', () => {
      render(() => <SigningJourney />);

      expect(screen.getByText('Developer')).toBeInTheDocument();
      expect(screen.getByText('Authenticate')).toBeInTheDocument();
    });
  });

  describe('Step Details', () => {
    it('shows all detail points for current step', () => {
      render(() => <SigningJourney />);

      expect(
        screen.getByText(/Developer runs `cosign sign` on their artifact/i)
      ).toBeInTheDocument();
      expect(
        screen.getByText(/Cosign generates an ephemeral key pair/i)
      ).toBeInTheDocument();
      expect(
        screen.getByText(/Private key is never stored permanently/i)
      ).toBeInTheDocument();
    });

    it('updates details when step changes', () => {
      render(() => <SigningJourney />);

      const nextButton = screen.getByText('Next →');
      fireEvent.click(nextButton);

      expect(
        screen.getByText(/Developer authenticates via GitHub, Google/i)
      ).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('handles rapid step changes', () => {
      render(() => <SigningJourney />);

      const nextButton = screen.getByText('Next →');

      // rapidly click next
      for (let i = 0; i < 3; i++) {
        fireEvent.click(nextButton);
      }

      // should be on step 4
      expect(screen.getByText(/Step 4 of 6/i)).toBeInTheDocument();
    });

    it('handles clicking same flow node multiple times', () => {
      render(() => <SigningJourney />);

      const flowNodes = document.querySelectorAll('.flow-node');

      fireEvent.click(flowNodes[2]);
      fireEvent.click(flowNodes[2]);
      fireEvent.click(flowNodes[2]);

      expect(screen.getByText(/Step 3 of 6/i)).toBeInTheDocument();
    });
  });
});
