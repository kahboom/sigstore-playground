import { Component } from 'solid-js';
import './Footer.css';

export const Footer: Component = () => {
  return (
    <footer class="footer">
      <div class="footer-content">
        <div class="footer-main">
          <div class="footer-brand">
            <span class="footer-logo">✨</span>
            <span class="footer-text">
              Built to help you understand <strong>Sigstore</strong>
            </span>
          </div>
          
          <div class="footer-links">
            <a href="https://sigstore.dev" target="_blank" rel="noopener noreferrer">
              Sigstore.dev
            </a>
            <span class="divider">•</span>
            <a href="https://docs.sigstore.dev" target="_blank" rel="noopener noreferrer">
              Documentation
            </a>
            <span class="divider">•</span>
            <a href="https://github.com/sigstore" target="_blank" rel="noopener noreferrer">
              GitHub
            </a>
            <span class="divider">•</span>
            <a href="https://slack.sigstore.dev" target="_blank" rel="noopener noreferrer">
              Slack
            </a>
          </div>
        </div>
        
        <div class="footer-bottom">
          <p class="footer-note">
            🔐 Sigstore is a project under the <a href="https://openssf.org" target="_blank" rel="noopener noreferrer">Open Source Security Foundation (OpenSSF)</a>
          </p>
          <p class="footer-tech mono">
            Built with SolidJS + TypeScript + 💜
          </p>
          <p class="footer-disclaimer">
            Sigstore® and the Sigstore logo are trademarks of the Sigstore project. This project is unaffiliated and provided for educational purposes.
          </p>
        </div>
      </div>
    </footer>
  );
};
