import { render, screen, fireEvent, waitFor } from '@solidjs/testing-library';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Feedback } from './Feedback';
import { setViewport, VIEWPORTS } from '../test-setup';

describe('Feedback', () => {
  beforeEach(() => {
    setViewport(VIEWPORTS.desktop.width, VIEWPORTS.desktop.height);
    // Mock fetch for form submission
    globalThis.fetch = vi.fn();
  });

  describe('Initial Render', () => {
    it('renders the feedback title and subtitle', () => {
      const mockOnSuccess = vi.fn();
      render(() => <Feedback onSuccess={mockOnSuccess} />);

      expect(screen.getByText('Share Your Feedback')).toBeInTheDocument();
      expect(
        screen.getByText(
          /Help us improve this learning experience by sharing your thoughts/i
        )
      ).toBeInTheDocument();
    });

    it('displays the form with all required fields', () => {
      const mockOnSuccess = vi.fn();
      render(() => <Feedback onSuccess={mockOnSuccess} />);

      expect(screen.getByLabelText(/Name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
      expect(
        screen.getByText(/Did you find this playground helpful\?/i)
      ).toBeInTheDocument();
      expect(
        screen.getByText(/Why are you learning about Sigstore\?/i)
      ).toBeInTheDocument();
      expect(screen.getByLabelText(/Additional Comments/i)).toBeInTheDocument();
    });

    it('renders all radio button options', () => {
      const mockOnSuccess = vi.fn();
      render(() => <Feedback onSuccess={mockOnSuccess} />);

      expect(screen.getByText('Yes, very helpful!')).toBeInTheDocument();
      expect(screen.getByText('Somewhat helpful')).toBeInTheDocument();
      expect(screen.getByText('Not really')).toBeInTheDocument();
    });

    it('displays required indicators', () => {
      const mockOnSuccess = vi.fn();
      render(() => <Feedback onSuccess={mockOnSuccess} />);

      const requiredIndicators = screen.getAllByText('*');
      expect(requiredIndicators.length).toBeGreaterThanOrEqual(2); // name, email
    });

    it('displays optional indicators', () => {
      const mockOnSuccess = vi.fn();
      render(() => <Feedback onSuccess={mockOnSuccess} />);

      const optionalIndicators = screen.getAllByText('(optional)');
      expect(optionalIndicators.length).toBe(3); // helpfulness, reason, and comment fields
    });
  });

  describe('Netlify Integration', () => {
    it('form has netlify attributes', () => {
      const mockOnSuccess = vi.fn();
      render(() => <Feedback onSuccess={mockOnSuccess} />);

      const form = document.querySelector('form[name="feedback"]');
      expect(form).toBeInTheDocument();
      expect(form?.getAttribute('data-netlify')).toBe('true');
    });

    it('form has hidden form-name field', () => {
      const mockOnSuccess = vi.fn();
      render(() => <Feedback onSuccess={mockOnSuccess} />);

      const hiddenInput = document.querySelector(
        'input[name="form-name"][value="feedback"]'
      );
      expect(hiddenInput).toBeInTheDocument();
    });

    it('form has honeypot field', () => {
      const mockOnSuccess = vi.fn();
      render(() => <Feedback onSuccess={mockOnSuccess} />);

      const honeypot = document.querySelector('input[name="bot-field"]');
      expect(honeypot).toBeInTheDocument();
    });
  });

  describe('Form Validation', () => {
    it('shows error when submitting without name', async () => {
      const mockOnSuccess = vi.fn();
      render(() => <Feedback onSuccess={mockOnSuccess} />);

      const submitButton = screen.getByRole('button', {
        name: /Submit Feedback/i,
      });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/Please enter your name/i)).toBeInTheDocument();
      });

      expect(mockOnSuccess).not.toHaveBeenCalled();
    });

    it('shows error when submitting without email', async () => {
      const mockOnSuccess = vi.fn();
      render(() => <Feedback onSuccess={mockOnSuccess} />);

      const nameInput = screen.getByPlaceholderText(/Your name/i);
      fireEvent.input(nameInput, { target: { value: 'John Doe' } });

      const submitButton = screen.getByRole('button', {
        name: /Submit Feedback/i,
      });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(
          screen.getByText(/Please enter your email/i)
        ).toBeInTheDocument();
      });

      expect(mockOnSuccess).not.toHaveBeenCalled();
    });

    it('submits successfully without helpfulness selection (optional field)', async () => {
      const mockOnSuccess = vi.fn();
      (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        headers: {
          get: () => 'application/json',
        },
      });

      render(() => <Feedback onSuccess={mockOnSuccess} />);

      const nameInput = screen.getByPlaceholderText(/Your name/i);
      fireEvent.input(nameInput, { target: { value: 'John Doe' } });

      const emailInput = screen.getByPlaceholderText(
        /your\.email@example\.com/i
      );
      fireEvent.input(emailInput, { target: { value: 'john@example.com' } });

      const submitButton = screen.getByRole('button', {
        name: /Submit Feedback/i,
      });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockOnSuccess).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('Form Submission', () => {
    it('calls onSuccess after successful submission', async () => {
      const mockOnSuccess = vi.fn();
      (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        headers: {
          get: () => 'application/json',
        },
      });

      render(() => <Feedback onSuccess={mockOnSuccess} />);

      const nameInput = screen.getByPlaceholderText(/Your name/i);
      fireEvent.input(nameInput, { target: { value: 'John Doe' } });

      const emailInput = screen.getByPlaceholderText(
        /your\.email@example\.com/i
      );
      fireEvent.input(emailInput, { target: { value: 'john@example.com' } });

      const yesOption = screen.getByLabelText('Yes, very helpful!');
      fireEvent.click(yesOption);

      const submitButton = screen.getByRole('button', {
        name: /Submit Feedback/i,
      });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockOnSuccess).toHaveBeenCalledTimes(1);
      });
    });

    it('clears form fields after successful submission', async () => {
      const mockOnSuccess = vi.fn();
      (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        headers: {
          get: () => 'application/json',
        },
      });

      render(() => <Feedback onSuccess={mockOnSuccess} />);

      const nameInput = screen.getByPlaceholderText(
        /Your name/i
      ) as HTMLInputElement;
      fireEvent.input(nameInput, { target: { value: 'John Doe' } });

      const emailInput = screen.getByPlaceholderText(
        /your\.email@example\.com/i
      ) as HTMLInputElement;
      fireEvent.input(emailInput, { target: { value: 'john@example.com' } });

      const yesOption = screen.getByLabelText('Yes, very helpful!');
      fireEvent.click(yesOption);

      const reasonTextarea = screen.getByPlaceholderText(
        /For my job, personal project, security research, curiosity\.\.\./i
      ) as HTMLTextAreaElement;
      fireEvent.input(reasonTextarea, { target: { value: 'Testing purpose' } });

      const submitButton = screen.getByRole('button', {
        name: /Submit Feedback/i,
      });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockOnSuccess).toHaveBeenCalled();
      });

      // Form fields should be cleared
      await waitFor(() => {
        expect(nameInput.value).toBe('');
        expect(emailInput.value).toBe('');
        expect(reasonTextarea.value).toBe('');
      });
    });

    it('submits all form data to fetch', async () => {
      const mockOnSuccess = vi.fn();
      const mockFetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        headers: {
          get: () => 'application/json',
        },
      });
      globalThis.fetch = mockFetch;

      render(() => <Feedback onSuccess={mockOnSuccess} />);

      fireEvent.input(screen.getByPlaceholderText(/Your name/i), {
        target: { value: 'John Doe' },
      });
      fireEvent.input(
        screen.getByPlaceholderText(/your\.email@example\.com/i),
        {
          target: { value: 'john@example.com' },
        }
      );
      fireEvent.click(screen.getByLabelText('Yes, very helpful!'));
      fireEvent.input(
        screen.getByPlaceholderText(
          /For my job, personal project, security research, curiosity\.\.\./i
        ),
        { target: { value: 'Work project' } }
      );
      fireEvent.input(
        screen.getByPlaceholderText(/Any other feedback or suggestions\.\.\./i),
        { target: { value: 'Great app!' } }
      );

      fireEvent.click(screen.getByRole('button', { name: /Submit Feedback/i }));

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalled();
      });

      const fetchCall = mockFetch.mock.calls[0];
      const body = fetchCall[1].body;

      expect(body).toContain('form-name=feedback');
      expect(body).toContain('name=John+Doe');
      expect(body).toContain('email=john%40example.com');
      expect(body).toContain('helpfulness=yes');
      expect(body).toContain('reason=Work+project');
      expect(body).toContain('comment=Great+app%21');
    });

    it('shows error on fetch failure', async () => {
      const mockOnSuccess = vi.fn();
      (globalThis.fetch as ReturnType<typeof vi.fn>).mockRejectedValueOnce(
        new Error('Network error')
      );

      render(() => <Feedback onSuccess={mockOnSuccess} />);

      fireEvent.input(screen.getByPlaceholderText(/Your name/i), {
        target: { value: 'John Doe' },
      });
      fireEvent.input(
        screen.getByPlaceholderText(/your\.email@example\.com/i),
        {
          target: { value: 'john@example.com' },
        }
      );
      fireEvent.click(screen.getByLabelText('Yes, very helpful!'));

      fireEvent.click(screen.getByRole('button', { name: /Submit Feedback/i }));

      await waitFor(() => {
        expect(
          screen.getByText(/Failed to submit feedback. Please try again./i)
        ).toBeInTheDocument();
      });

      expect(mockOnSuccess).not.toHaveBeenCalled();
    });

    it('disables submit button while submitting', async () => {
      const mockOnSuccess = vi.fn();
      (globalThis.fetch as ReturnType<typeof vi.fn>).mockImplementation(
        () =>
          new Promise(resolve =>
            setTimeout(
              () =>
                resolve({
                  ok: true,
                  headers: { get: () => 'application/json' },
                }),
              100
            )
          )
      );

      render(() => <Feedback onSuccess={mockOnSuccess} />);

      fireEvent.input(screen.getByPlaceholderText(/Your name/i), {
        target: { value: 'John Doe' },
      });
      fireEvent.input(
        screen.getByPlaceholderText(/your\.email@example\.com/i),
        {
          target: { value: 'john@example.com' },
        }
      );
      fireEvent.click(screen.getByLabelText('Yes, very helpful!'));

      const submitButton = screen.getByRole('button', {
        name: /Submit Feedback/i,
      });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(submitButton).toBeDisabled();
        expect(submitButton.textContent).toBe('Submitting...');
      });

      await waitFor(() => {
        expect(mockOnSuccess).toHaveBeenCalled();
      });
    });
  });

  describe('Accessibility', () => {
    it('form has proper semantic structure', () => {
      const mockOnSuccess = vi.fn();
      render(() => <Feedback onSuccess={mockOnSuccess} />);

      const form = document.querySelector('form[name="feedback"]');
      expect(form).toBeInTheDocument();

      const heading = screen.getByText('Share Your Feedback');
      expect(heading.tagName).toBe('SPAN');
      expect(heading.parentElement?.tagName).toBe('H1');
    });

    it('title has ID for aria-labelledby', () => {
      const mockOnSuccess = vi.fn();
      render(() => <Feedback onSuccess={mockOnSuccess} />);

      const title = document.getElementById('feedback-modal-title');
      expect(title).toBeInTheDocument();
    });
  });

  describe('Mobile Responsiveness', () => {
    it('renders correctly on mobile', () => {
      const mockOnSuccess = vi.fn();
      setViewport(VIEWPORTS.mobile.width, VIEWPORTS.mobile.height);
      render(() => <Feedback onSuccess={mockOnSuccess} />);

      expect(screen.getByText('Share Your Feedback')).toBeInTheDocument();
      expect(screen.getByLabelText(/Name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /Submit Feedback/i })
      ).toBeInTheDocument();
    });
  });
});
