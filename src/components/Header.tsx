import { Component } from 'solid-js';
import './Header.css';

type View = 'journey' | 'explorer' | 'quiz';

interface HeaderProps {
  currentView: View;
  onViewChange: (view: View) => void;
}

export const Header: Component<HeaderProps> = (props) => {
  return (
    <header class="header">
      <div class="header-content">
        <div class="logo">
          <div class="logo-icon">
            <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="20" cy="20" r="18" stroke="url(#logoGradient)" stroke-width="2.5" />
              <path d="M20 8 L20 32 M12 14 L20 20 L28 14 M12 26 L20 20 L28 26" 
                    stroke="url(#logoGradient)" stroke-width="2" stroke-linecap="round" />
              <defs>
                <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stop-color="var(--accent-purple)" />
                  <stop offset="100%" stop-color="var(--accent-cyan)" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <div class="logo-text">
            <span class="logo-title">Sigstore</span>
            <span class="logo-subtitle">Playground</span>
          </div>
        </div>

        <nav class="nav">
          <button
            class={`nav-btn ${props.currentView === 'journey' ? 'active' : ''}`}
            onClick={() => props.onViewChange('journey')}
          >
            <span class="nav-icon">🚀</span>
            Signing Journey
          </button>
          <button
            class={`nav-btn ${props.currentView === 'explorer' ? 'active' : ''}`}
            onClick={() => props.onViewChange('explorer')}
          >
            <span class="nav-icon">🔍</span>
            Component Explorer
          </button>
          <button
            class={`nav-btn ${props.currentView === 'quiz' ? 'active' : ''}`}
            onClick={() => props.onViewChange('quiz')}
          >
            <span class="nav-icon">🧠</span>
            Test Your Knowledge
          </button>
        </nav>

        <a 
          href="https://docs.sigstore.dev" 
          target="_blank" 
          rel="noopener noreferrer"
          class="btn btn-secondary docs-link"
        >
          📚 Docs
        </a>
      </div>
    </header>
  );
};
