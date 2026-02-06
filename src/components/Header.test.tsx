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

  it('renders GitHub link', () => {
    const mockViewChange = vi.fn();
    render(() => (
      <Header currentView="journey" onViewChange={mockViewChange} />
    ));

    const githubLink = screen.getByText('GitHub');
    expect(githubLink).toBeInTheDocument();
    expect(githubLink.closest('a')).toHaveAttribute(
      'href',
      'https://github.com/kahboom/sigstore-playground'
    );
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
