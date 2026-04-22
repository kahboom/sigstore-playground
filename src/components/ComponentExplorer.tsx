import { Component, createSignal, For, Show } from 'solid-js';
import { Motion, Presence } from 'solid-motionone';
import {
  SIGSTORE_COMPONENTS,
  type SigstoreComponent,
} from '../data/sigstoreComponents';
import './ComponentExplorer.css';

function renderComponentIcon(component: SigstoreComponent) {
  return component.iconImage ? (
    <img src={component.iconImage} alt={component.name} />
  ) : (
    component.icon
  );
}

function sigstoreComponentById(id: SigstoreComponent['id']): SigstoreComponent {
  const c = SIGSTORE_COMPONENTS.find(x => x.id === id);
  if (!c) {
    throw new Error(`Unknown Sigstore component: ${id}`);
  }
  return c;
}

export const ComponentExplorer: Component = () => {
  const [selectedComponent, setSelectedComponent] =
    createSignal<string>('cosign');

  const currentComponent = () =>
    SIGSTORE_COMPONENTS.find(c => c.id === selectedComponent());

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
        <For each={SIGSTORE_COMPONENTS}>
          {component => (
            <button
              class={`component-btn ${selectedComponent() === component.id ? 'active' : ''}`}
              onClick={() => setSelectedComponent(component.id)}
              style={{ '--component-color': component.color }}
            >
              <span class="component-btn-icon">
                {renderComponentIcon(component)}
              </span>
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
                <div class="details-icon">{renderComponentIcon(component)}</div>
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
            <span class="node-icon">
              {renderComponentIcon(sigstoreComponentById('cosign'))}
            </span>
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
                <span class="node-icon">
                  {renderComponentIcon(sigstoreComponentById('fulcio'))}
                </span>
                <span class="node-label">Fulcio</span>
              </div>
            </div>

            <div class="branch-bottom">
              <div class="diagram-arrow vertical">↓</div>
              <div
                class={`diagram-node rekor-node ${selectedComponent() === 'rekor' ? 'highlighted' : ''}`}
                onClick={() => setSelectedComponent('rekor')}
              >
                <span class="node-icon">
                  {renderComponentIcon(sigstoreComponentById('rekor'))}
                </span>
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

export default ComponentExplorer;
