import { Component, createSignal, For, Show } from 'solid-js';
import { Motion, Presence } from 'solid-motionone';
import './ComponentExplorer.css';

interface SigstoreComponent {
  id: string;
  name: string;
  icon: string;
  color: string;
  tagline: string;
  description: string;
  keyPoints: string[];
  howItWorks: string[];
  realWorldAnalogy: string;
  funFact: string;
  links: { label: string; url: string }[];
}

const COMPONENTS: SigstoreComponent[] = [
  {
    id: 'cosign',
    name: 'Cosign',
    icon: '✍️',
    color: 'var(--accent-green)',
    tagline: 'The Signing Swiss Army Knife',
    description:
      "Cosign is the command-line tool that developers use to sign and verify container images and other artifacts. It's the user-facing part of Sigstore that ties everything together.",
    keyPoints: [
      'Signs container images, blobs, and OCI artifacts',
      'Supports keyless signing with OIDC',
      'Can also use traditional key-based signing',
      'Verifies signatures against policy',
    ],
    howItWorks: [
      'Developer runs cosign sign with their artifact',
      'Cosign generates an ephemeral key pair',
      'Requests a certificate from Fulcio',
      'Signs the artifact and uploads to Rekor',
      'Attaches signature to the container registry',
    ],
    realWorldAnalogy:
      "🖊️ Think of Cosign like a digital notary that helps you sign documents. You don't need to own the seal - it provides one for you based on your verified identity!",
    funFact:
      'Cosign can verify over 1 million signatures per second on modern hardware!',
    links: [
      { label: 'GitHub', url: 'https://github.com/sigstore/cosign' },
      { label: 'Docs', url: 'https://docs.sigstore.dev/cosign/overview/' },
    ],
  },
  {
    id: 'fulcio',
    name: 'Fulcio',
    icon: '📜',
    color: 'var(--accent-purple)',
    tagline: 'The Identity-Based Certificate Authority',
    description:
      'Fulcio is a free-to-use certificate authority that issues short-lived certificates based on OIDC identity tokens. No more managing long-lived signing keys!',
    keyPoints: [
      'Issues certificates valid for ~10 minutes',
      'Binds your OIDC identity to a public key',
      'Eliminates key management headaches',
      'Certificates are logged to a CT log',
    ],
    howItWorks: [
      'Receives OIDC token and public key from client',
      'Verifies the OIDC token with the provider',
      'Creates a certificate with identity in SAN field',
      'Signs with Fulcio intermediate CA',
      'Returns short-lived certificate to client',
    ],
    realWorldAnalogy:
      '🏛️ Fulcio is like a government office that issues temporary ID cards. You prove who you are (via Google, GitHub, etc.), and they give you a short-lived credential to sign with.',
    funFact:
      'Fulcio has issued millions of certificates since launch, all for free!',
    links: [
      { label: 'GitHub', url: 'https://github.com/sigstore/fulcio' },
      { label: 'Docs', url: 'https://docs.sigstore.dev/fulcio/overview/' },
    ],
  },
  {
    id: 'rekor',
    name: 'Rekor',
    icon: '📋',
    color: 'var(--accent-cyan)',
    tagline: 'The Immutable Transparency Log',
    description:
      'Rekor is a transparency log that stores signed metadata about software artifacts. It provides an append-only, tamper-evident record of all signing events.',
    keyPoints: [
      "Append-only log (entries can't be deleted)",
      'Provides timestamped proof of signing',
      'Publicly auditable by anyone',
      'Uses Merkle trees for integrity',
    ],
    howItWorks: [
      'Client submits signing metadata to Rekor',
      'Rekor validates and timestamps the entry',
      'Entry is added to the Merkle tree',
      'Client receives inclusion proof',
      'Anyone can query and verify entries',
    ],
    realWorldAnalogy:
      "📰 Rekor is like a newspaper that publishes all signatures. Once it's printed, everyone can see it, and you can't go back and change yesterday's edition!",
    funFact:
      'Rekor uses the same technology as Certificate Transparency logs used by web browsers!',
    links: [
      { label: 'GitHub', url: 'https://github.com/sigstore/rekor' },
      { label: 'Public Instance', url: 'https://rekor.sigstore.dev' },
    ],
  },
  {
    id: 'oidc',
    name: 'OIDC Providers',
    icon: '🔐',
    color: 'var(--accent-orange)',
    tagline: 'Your Existing Identity, Now for Signing',
    description:
      "OpenID Connect providers are the identity backbone of Sigstore's keyless signing. They let you use identities you already have instead of managing separate signing keys.",
    keyPoints: [
      'Use your GitHub, Google, or Microsoft identity',
      'No new accounts or keys to manage',
      'Workload identity for CI/CD systems',
      'Federation with enterprise identity',
    ],
    howItWorks: [
      'Developer authenticates with OIDC provider',
      'Provider issues an ID token with claims',
      'Token proves identity to Fulcio',
      'Identity is embedded in the certificate',
      'Verifiers can check who signed the artifact',
    ],
    realWorldAnalogy:
      '🎫 OIDC is like using your driver\'s license to prove your identity. You don\'t need a special "signing ID" - your existing verified identity works!',
    funFact:
      'GitHub Actions automatically provides OIDC tokens, making keyless signing seamless in CI/CD!',
    links: [
      { label: 'OIDC Spec', url: 'https://openid.net/connect/' },
      {
        label: 'Sigstore OIDC Docs',
        url: 'https://docs.sigstore.dev/cosign/openid_signing/',
      },
    ],
  },
];

export const ComponentExplorer: Component = () => {
  const [selectedComponent, setSelectedComponent] =
    createSignal<string>('cosign');

  const currentComponent = () =>
    COMPONENTS.find(c => c.id === selectedComponent());

  return (
    <div class="component-explorer">
      <div class="explorer-header">
        <h1 class="explorer-title">
          <span class="text-gradient">Component Explorer</span>
        </h1>
        <p class="explorer-subtitle">
          Deep dive into each piece of the Sigstore ecosystem. Click a component
          to learn more!
        </p>
      </div>

      {/* Component Selector */}
      <div class="component-selector">
        <For each={COMPONENTS}>
          {component => (
            <button
              class={`component-btn ${selectedComponent() === component.id ? 'active' : ''}`}
              onClick={() => setSelectedComponent(component.id)}
              style={{ '--component-color': component.color }}
            >
              <span class="component-btn-icon">{component.icon}</span>
              <span class="component-btn-name">{component.name}</span>
            </button>
          )}
        </For>
      </div>

      {/* Component Details */}
      <Presence exitBeforeEnter>
        <Show when={currentComponent()} keyed>
          {component => (
            <Motion.div
              class="component-details"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              style={{ '--component-color': component.color }}
            >
              {/* Header Section */}
              <div class="details-header">
                <div class="details-icon">{component.icon}</div>
                <div class="details-title-section">
                  <h2 class="details-name">{component.name}</h2>
                  <p class="details-tagline">{component.tagline}</p>
                </div>
              </div>

              <p class="details-description">{component.description}</p>

              {/* Main Content Grid */}
              <div class="details-grid">
                {/* Key Points */}
                <div class="details-card glass-card">
                  <h3 class="card-title">✨ Key Points</h3>
                  <ul class="card-list">
                    <For each={component.keyPoints}>
                      {point => <li>{point}</li>}
                    </For>
                  </ul>
                </div>

                {/* How It Works */}
                <div class="details-card glass-card">
                  <h3 class="card-title">⚙️ How It Works</h3>
                  <ol class="card-list numbered">
                    <For each={component.howItWorks}>
                      {(step, i) => (
                        <li>
                          <span class="step-num">{i() + 1}</span>
                          {step}
                        </li>
                      )}
                    </For>
                  </ol>
                </div>

                {/* Real World Analogy */}
                <div class="details-card glass-card analogy-card">
                  <h3 class="card-title">💡 Real World Analogy</h3>
                  <p class="analogy-text">{component.realWorldAnalogy}</p>
                </div>

                {/* Fun Fact */}
                <div class="details-card glass-card fun-fact-card">
                  <h3 class="card-title">🎉 Fun Fact</h3>
                  <p class="fun-fact-text">{component.funFact}</p>
                </div>
              </div>

              {/* Links */}
              <div class="details-links">
                <span class="links-label">Learn more:</span>
                <For each={component.links}>
                  {link => (
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      class="btn btn-secondary"
                    >
                      {link.label} →
                    </a>
                  )}
                </For>
              </div>
            </Motion.div>
          )}
        </Show>
      </Presence>

      {/* Interactive Diagram */}
      <div class="ecosystem-diagram glass-card">
        <h3 class="diagram-title">🔄 How They Work Together</h3>
        <div class="diagram-visual">
          <div class="diagram-node developer-node">
            <span class="node-icon">👩‍💻</span>
            <span class="node-label">Developer</span>
          </div>

          <div class="diagram-arrow">→</div>

          <div
            class={`diagram-node cosign-node ${selectedComponent() === 'cosign' ? 'highlighted' : ''}`}
            onClick={() => setSelectedComponent('cosign')}
          >
            <span class="node-icon">✍️</span>
            <span class="node-label">Cosign</span>
          </div>

          <div class="diagram-branches">
            <div class="branch-top">
              <div class="diagram-arrow vertical">↑</div>
              <div
                class={`diagram-node oidc-node ${selectedComponent() === 'oidc' ? 'highlighted' : ''}`}
                onClick={() => setSelectedComponent('oidc')}
              >
                <span class="node-icon">🔐</span>
                <span class="node-label">OIDC</span>
              </div>
            </div>

            <div class="branch-middle">
              <div class="diagram-arrow">→</div>
              <div
                class={`diagram-node fulcio-node ${selectedComponent() === 'fulcio' ? 'highlighted' : ''}`}
                onClick={() => setSelectedComponent('fulcio')}
              >
                <span class="node-icon">📜</span>
                <span class="node-label">Fulcio</span>
              </div>
            </div>

            <div class="branch-bottom">
              <div class="diagram-arrow vertical">↓</div>
              <div
                class={`diagram-node rekor-node ${selectedComponent() === 'rekor' ? 'highlighted' : ''}`}
                onClick={() => setSelectedComponent('rekor')}
              >
                <span class="node-icon">📋</span>
                <span class="node-label">Rekor</span>
              </div>
            </div>
          </div>

          <div class="diagram-arrow">→</div>

          <div class="diagram-node artifact-node">
            <span class="node-icon">📦</span>
            <span class="node-label">Signed Artifact</span>
          </div>
        </div>
      </div>
    </div>
  );
};
