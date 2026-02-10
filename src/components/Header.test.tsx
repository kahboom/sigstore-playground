import { render, screen } from '@solidjs/testing-library';
import { describe, it, expect, vi } from 'vitest';
import { Header } from './Header';

describe('Header', () => {
  it('renders the logo with title and subtitle', () => {
    const mockViewChange = vi.fn();
    render(() => (
      <Header currentView="journey" onViewChange={mockViewChange} />
    ));

    expect(screen.getByText('Sigstore')).toBeInTheDocument();
    expect(screen.getByText('Playground')).toBeInTheDocument();
  });

  it('renders all navigation buttons', () => {
    const mockViewChange = vi.fn();
    render(() => (
      <Header currentView="journey" onViewChange={mockViewChange} />
    ));

    expect(screen.getByText('Signing Journey')).toBeInTheDocument();
    expect(screen.getByText('Component Explorer')).toBeInTheDocument();
    expect(screen.getByText('Test Your Knowledge')).toBeInTheDocument();
  });

  it('renders GitHub link with Octocat icon', () => {
    const mockViewChange = vi.fn();
    render(() => (
      <Header currentView="journey" onViewChange={mockViewChange} />
    ));

    const githubLink = screen.getByLabelText('View on GitHub');
    expect(githubLink).toBeInTheDocument();
    expect(githubLink).toHaveAttribute(
      'href',
      'https://github.com/kahboom/sigstore-playground'
    );
    expect(githubLink.querySelector('svg')).toBeInTheDocument();
  });

  it('applies active class to current view button', () => {
    const mockViewChange = vi.fn();
    render(() => (
      <Header currentView="explorer" onViewChange={mockViewChange} />
    ));

    const explorerButton = screen.getByText('Component Explorer');
    expect(explorerButton).toHaveClass('active');
  });
});
