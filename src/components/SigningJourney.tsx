import { Component, createSignal, For, Show, createEffect, onMount } from 'solid-js';
import { Motion, Presence } from 'solid-motionone';
import './SigningJourney.css';

interface Step {
  id: number;
  title: string;
  description: string;
  component: 'developer' | 'oidc' | 'fulcio' | 'artifact' | 'rekor' | 'verifier';
  details: string[];
  action: string;
}

const STEPS: Step[] = [
  {
    id: 1,
    title: "Developer initiates signing",
    description: "You want to sign your software artifact to prove it came from you",
    component: 'developer',
    details: [
      "Developer runs `cosign sign` on their artifact",
      "Cosign generates an ephemeral key pair",
      "Private key is never stored permanently",
    ],
    action: "🔑 Generate Key Pair"
  },
  {
    id: 2,
    title: "Authenticate with OIDC",
    description: "Prove your identity using an existing identity provider",
    component: 'oidc',
    details: [
      "Developer authenticates via GitHub, Google, or other OIDC provider",
      "Receives an OIDC token proving identity",
      "No need to manage long-lived signing keys!",
    ],
    action: "🎫 Get OIDC Token"
  },
  {
    id: 3,
    title: "Request certificate from Fulcio",
    description: "Fulcio issues a short-lived signing certificate",
    component: 'fulcio',
    details: [
      "Cosign sends public key + OIDC token to Fulcio",
      "Fulcio verifies the OIDC token",
      "Issues a certificate valid for ~10 minutes",
      "Certificate binds your identity to your public key",
    ],
    action: "📜 Issue Certificate"
  },
  {
    id: 4,
    title: "Sign the artifact",
    description: "Create a cryptographic signature using the private key",
    component: 'artifact',
    details: [
      "Hash the artifact content",
      "Sign the hash with the ephemeral private key",
      "Attach the signature and certificate to the artifact",
    ],
    action: "✍️ Sign Artifact"
  },
  {
    id: 5,
    title: "Record in Rekor transparency log",
    description: "Create an immutable, timestamped record of the signing event",
    component: 'rekor',
    details: [
      "Signing event recorded in Rekor",
      "Entry is append-only (can't be deleted)",
      "Provides proof of when signing occurred",
      "Anyone can audit the transparency log",
    ],
    action: "📋 Log Entry"
  },
  {
    id: 6,
    title: "Verification complete!",
    description: "Anyone can now verify your artifact's authenticity",
    component: 'verifier',
    details: [
      "Verifier runs `cosign verify`",
      "Checks signature against certificate",
      "Validates certificate chain to Fulcio",
      "Confirms entry exists in Rekor",
      "✅ Artifact is verified!",
    ],
    action: "✅ Verify"
  }
];

export const SigningJourney: Component = () => {
  const [currentStep, setCurrentStep] = createSignal(0);
  const [isPlaying, setIsPlaying] = createSignal(false);
  const [completedSteps, setCompletedSteps] = createSignal<Set<number>>(new Set());
  const [showParticles, setShowParticles] = createSignal(false);
  const [artifactHash, setArtifactHash] = createSignal('');
  
  const generateHash = () => {
    const chars = '0123456789abcdef';
    let hash = '';
    for (let i = 0; i < 64; i++) {
      hash += chars[Math.floor(Math.random() * chars.length)];
    }
    return hash;
  };

  onMount(() => {
    setArtifactHash(generateHash());
  });

  const advanceStep = () => {
    const current = currentStep();
    if (current < STEPS.length) {
      setCompletedSteps(prev => new Set([...prev, current]));
      setShowParticles(true);
      setTimeout(() => setShowParticles(false), 1000);
      
      if (current < STEPS.length - 1) {
        // Delay before advancing to let the user see the success state
        setTimeout(() => setCurrentStep(current + 1), 1200);
      }
    }
  };

  const resetJourney = () => {
    setCurrentStep(0);
    setCompletedSteps(new Set<number>());
    setArtifactHash(generateHash());
    setIsPlaying(false);
  };

  const playJourney = async () => {
    setIsPlaying(true);
    resetJourney();
    
    for (let i = 0; i < STEPS.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 2000));
      if (!isPlaying()) break;
      advanceStep();
    }
    setIsPlaying(false);
  };

  const getComponentIcon = (component: Step['component']) => {
    const icons = {
      developer: '👩‍💻',
      oidc: '🔐',
      fulcio: '📜',
      artifact: '📦',
      rekor: '📋',
      verifier: '✅'
    };
    return icons[component];
  };

  const step = () => STEPS[currentStep()];

  return (
    <div class="signing-journey">
      <div class="journey-header">
        <div class="journey-title-section">
          <h1 class="journey-title">
            <span class="text-gradient">The Sigstore Signing Journey</span>
          </h1>
          <p class="journey-subtitle">
            Watch how keyless signing works, step by step. Click through or hit play!
          </p>
        </div>
        
        <div class="journey-controls">
          <button 
            class="btn btn-primary" 
            onClick={isPlaying() ? () => setIsPlaying(false) : playJourney}
          >
            {isPlaying() ? '⏸ Pause' : '▶️ Auto Play'}
          </button>
          <button class="btn btn-secondary" onClick={resetJourney}>
            🔄 Reset
          </button>
        </div>
      </div>

      {/* Visual Flow Diagram */}
      <div class="flow-container">
        <div class="flow-diagram">
          <For each={STEPS}>
            {(s, index) => (
              <div 
                class={`flow-node ${currentStep() === index() ? 'active' : ''} ${completedSteps().has(index()) ? 'completed' : ''}`}
                onClick={() => setCurrentStep(index())}
              >
                <div class="flow-node-icon">
                  {getComponentIcon(s.component)}
                </div>
                <div class="flow-node-connector" />
                <span class="flow-node-label">{s.title.split(' ')[0]}</span>
              </div>
            )}
          </For>
        </div>
      </div>

      {/* Main Content Area */}
      <div class="journey-content">
        {/* Left Side - Visual Animation */}
        <div class="journey-visual">
          <Presence>
            <Show when={step()}>
              <Motion.div
                class="visual-container"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
              >
                <ComponentVisual 
                  component={step()!.component} 
                  isActive={true}
                  isCompleted={completedSteps().has(currentStep())}
                  artifactHash={artifactHash()}
                />
              </Motion.div>
            </Show>
          </Presence>
          
          {/* Particle effect on step completion */}
          <Show when={showParticles()}>
            <div class="particles">
              <For each={Array(12).fill(0)}>
                {(_, i) => (
                  <div 
                    class="particle" 
                    style={{ 
                      '--angle': `${i() * 30}deg`,
                      '--delay': `${i() * 0.05}s`
                    }} 
                  />
                )}
              </For>
            </div>
          </Show>
        </div>

        {/* Right Side - Step Details */}
        <div class="journey-details">
          <Presence>
            <Show when={step()}>
              <Motion.div
                class="step-card glass-card"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div class="step-header">
                  <span class="step-number">Step {step()!.id} of {STEPS.length}</span>
                  <span class={`step-badge ${step()!.component}`}>
                    {getComponentIcon(step()!.component)} {step()!.component.toUpperCase()}
                  </span>
                </div>
                
                <h2 class="step-title">{step()!.title}</h2>
                <p class="step-description">{step()!.description}</p>
                
                <div class="step-details">
                  <h4>What happens:</h4>
                  <ul>
                    <For each={step()!.details}>
                      {(detail, i) => (
                        <Motion.li
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i() * 0.1 }}
                        >
                          {detail}
                        </Motion.li>
                      )}
                    </For>
                  </ul>
                </div>

                <div class="step-actions">
                  <button 
                    class="btn btn-primary action-btn"
                    onClick={advanceStep}
                    disabled={currentStep() === STEPS.length - 1 && completedSteps().has(STEPS.length - 1)}
                  >
                    {completedSteps().has(currentStep()) ? '✓ Done' : step()!.action}
                  </button>
                  
                  <div class="step-nav">
                    <button 
                      class="btn btn-ghost"
                      onClick={() => setCurrentStep(Math.max(0, currentStep() - 1))}
                      disabled={currentStep() === 0}
                    >
                      ← Previous
                    </button>
                    <button 
                      class="btn btn-ghost"
                      onClick={() => setCurrentStep(Math.min(STEPS.length - 1, currentStep() + 1))}
                      disabled={currentStep() === STEPS.length - 1}
                    >
                      Next →
                    </button>
                  </div>
                </div>
              </Motion.div>
            </Show>
          </Presence>
        </div>
      </div>

      {/* Artifact Preview */}
      <div class="artifact-preview glass-card">
        <div class="artifact-header">
          <span class="artifact-icon">📦</span>
          <span class="artifact-name">my-awesome-software-v1.0.0.tar.gz</span>
        </div>
        <div class="artifact-hash mono">
          <span class="hash-label">SHA256:</span>
          <span class="hash-value">{artifactHash()}</span>
        </div>
        <div class="artifact-status">
          <Show when={completedSteps().has(STEPS.length - 1)} fallback={
            <span class="status-pending">⏳ Awaiting signature...</span>
          }>
            <span class="status-signed">✅ Signed & Verified!</span>
          </Show>
        </div>
      </div>
    </div>
  );
};

// Sub-component for visual representations
interface ComponentVisualProps {
  component: Step['component'];
  isActive: boolean;
  isCompleted: boolean;
  artifactHash: string;
}

const ComponentVisual: Component<ComponentVisualProps> = (props) => {
  const visuals: Record<Step['component'], () => any> = {
    developer: () => (
      <div class="visual-developer">
        <div class="terminal">
          <div class="terminal-header">
            <span class="terminal-dot red" />
            <span class="terminal-dot yellow" />
            <span class="terminal-dot green" />
            <span class="terminal-title">Terminal</span>
          </div>
          <div class="terminal-body mono">
            <div class="terminal-line">
              <span class="prompt">$</span> cosign sign my-image:latest
            </div>
            <Show when={props.isCompleted}>
              <div class="terminal-line output">
                Generating ephemeral key pair...
              </div>
              <div class="terminal-line output success">
                ✓ Key pair generated
              </div>
            </Show>
          </div>
        </div>
        <div class="key-animation">
          <div class="key-icon">🔑</div>
          <div class="key-label">Ephemeral Keys</div>
        </div>
      </div>
    ),
    
    oidc: () => (
      <div class="visual-oidc">
        <div class="oidc-providers">
          <div class="oidc-provider github">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
            </svg>
            <span>GitHub</span>
          </div>
          <div class="oidc-provider google">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            <span>Google</span>
          </div>
        </div>
        <div class="oidc-flow">
          <div class="oidc-arrow">→</div>
          <div class="oidc-token">
            <span class="token-icon">🎫</span>
            <span class="token-label">OIDC Token</span>
          </div>
        </div>
      </div>
    ),
    
    fulcio: () => (
      <div class="visual-fulcio">
        <div class="fulcio-server">
          <div class="server-icon">🏛️</div>
          <div class="server-name">Fulcio CA</div>
        </div>
        <div class="certificate-animation">
          <div class="cert-icon">📜</div>
          <div class="cert-details mono">
            <div>Subject: user@example.com</div>
            <div>Issuer: Fulcio Intermediate</div>
            <div>Valid: 10 minutes</div>
          </div>
        </div>
      </div>
    ),
    
    artifact: () => (
      <div class="visual-artifact">
        <div class="artifact-box">
          <div class="artifact-icon">📦</div>
          <div class="artifact-label">Artifact</div>
        </div>
        <div class="signing-process">
          <div class="sign-arrow">+</div>
          <div class="signature-block">
            <span class="sig-icon">✍️</span>
            <span class="sig-label">Signature</span>
          </div>
        </div>
        <div class="hash-display mono">
          {props.artifactHash.slice(0, 16)}...
        </div>
      </div>
    ),
    
    rekor: () => (
      <div class="visual-rekor">
        <div class="log-entries">
          <div class="log-entry">
            <span class="entry-hash mono">{props.artifactHash.slice(0, 8)}...</span>
            <span class="entry-time">2 min ago</span>
          </div>
          <div class="log-entry">
            <span class="entry-hash mono">a7b3c9d1...</span>
            <span class="entry-time">5 min ago</span>
          </div>
          <div class="log-entry highlight">
            <span class="entry-hash mono">{props.artifactHash.slice(0, 8)}...</span>
            <span class="entry-time">NOW ✨</span>
          </div>
        </div>
        <div class="rekor-label">
          <span>📋</span> Rekor Transparency Log
        </div>
      </div>
    ),
    
    verifier: () => (
      <div class="visual-verifier">
        <div class="verify-checklist">
          <div class="check-item done">
            <span class="check-icon">✅</span>
            <span>Signature valid</span>
          </div>
          <div class="check-item done">
            <span class="check-icon">✅</span>
            <span>Certificate chain valid</span>
          </div>
          <div class="check-item done">
            <span class="check-icon">✅</span>
            <span>Rekor entry found</span>
          </div>
          <div class="check-item done">
            <span class="check-icon">✅</span>
            <span>Timestamp verified</span>
          </div>
        </div>
        <div class="verified-badge">
          <span class="badge-icon">🎉</span>
          <span class="badge-text">Verified!</span>
        </div>
      </div>
    )
  };

  return (
    <div class={`component-visual ${props.component}`}>
      {visuals[props.component]()}
    </div>
  );
};
