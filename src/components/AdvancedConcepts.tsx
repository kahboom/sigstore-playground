import { Component, createSignal, For, Show } from 'solid-js';
import { Motion, Presence } from 'solid-motionone';
import './AdvancedConcepts.css';

interface AdvancedTopic {
  id: string;
  title: string;
  icon: string;
  color: string;
  difficulty: 'intermediate' | 'advanced';
  description: string;
  concepts: {
    title: string;
    content: string;
    codeExample?: string;
  }[];
  realWorld: string;
  resources: { label: string; url: string }[];
}

const TOPICS: AdvancedTopic[] = [
  {
    id: 'attestations',
    title: 'Attestations & Provenance',
    icon: '📋',
    color: 'var(--accent-orange)',
    difficulty: 'intermediate',
    description:
      'Learn how attestations provide verifiable metadata about software artifacts, enabling policy-based verification and supply chain security.',
    concepts: [
      {
        title: 'What are Attestations?',
        content:
          'Attestations are signed statements about artifacts that provide verifiable claims about how they were built, what materials were used, and who created them. Unlike signatures that only prove "who signed this", attestations answer "how was this built?"',
      },
      {
        title: 'In-toto Framework',
        content:
          'In-toto defines a standard format for attestations using a subject (the artifact) and a predicate (type-specific claims). It uses DSSE (Dead Simple Signing Envelope) to prevent signature wrapping attacks.',
      },
      {
        title: 'SLSA Provenance',
        content:
          'SLSA provenance describes where, when, and how an artifact was built. It includes builder identity, source repository, build parameters, and materials (dependencies). This enables verification of supply chain integrity.',
      },
      {
        title: 'Creating Attestations',
        content:
          'Use Cosign to create and sign attestations. The attestation is formatted as an in-toto statement, signed using the same keyless flow as artifacts, and stored in the registry or Rekor.',
        codeExample:
          'cosign attest --predicate slsa-provenance.json --key cosign.key image:tag',
      },
      {
        title: 'Verifying Attestations',
        content:
          'Verification checks both the signature validity and the attestation content. Policy engines can then validate that the claims meet your security requirements (approved builders, SLSA levels, etc.).',
        codeExample:
          'cosign verify-attestation --key cosign.pub --type slsaprovenance image:tag',
      },
    ],
    realWorld:
      '🧾 Attestations are like detailed receipts from a restaurant. They don\'t just say "you ate here"—they list every ingredient, who the chef was, what temperature the food was cooked at, and when it was prepared. Later, if someone gets sick, you can trace exactly what went into that meal.',
    resources: [
      {
        label: 'In-toto Docs',
        url: 'https://docs.sigstore.dev/cosign/verifying/attestation/',
      },
      { label: 'SLSA Spec', url: 'https://slsa.dev/' },
    ],
  },
  {
    id: 'policy',
    title: 'Policy Enforcement',
    icon: '🛡️',
    color: 'var(--accent-pink)',
    difficulty: 'advanced',
    description:
      'Understand how to enforce security policies on artifacts using tools like Conforma to validate attestations and ensure compliance.',
    concepts: [
      {
        title: 'Policy-Based Security',
        content:
          'Move from "is it signed?" to "does it meet our requirements?" Policy enforcement validates that signed artifacts comply with organizational security standards, checking builder identity, dependencies, SLSA levels, and more.',
      },
      {
        title: 'Conforma Overview',
        content:
          'Conforma validates artifacts against declarative policies defined in YAML. It retrieves attestations, verifies signatures using Cosign, and checks that claims match your policy requirements. Violations produce human-readable reports.',
      },
      {
        title: 'Writing Policies',
        content:
          'Policies define allowed builders, required SLSA levels, approved materials, and other constraints. They can be versioned in git and enforced at CI/CD, deploy-time, or as release gates.',
        codeExample: `policy:
  attestations:
    - type: slsaprovenance
      requirements:
        builder: github-actions
        slsa_level: 3`,
      },
      {
        title: 'Policy Evaluation',
        content:
          'Conforma retrieves attestations from the registry or Rekor, validates their signatures, and checks claims against policy. It reports pass/fail with detailed explanations of which requirements were met or violated.',
      },
      {
        title: 'Integration Points',
        content:
          'Policies can be enforced in multiple places: CI/CD pipelines (block merges), deploy-time (prevent deployment), admission controllers (Kubernetes), or release gates (artifact promotion).',
      },
    ],
    realWorld:
      '🛂 Policy enforcement is like airport security. Your signed artifact is your passport (proves who you are), but TSA (policy engine) still checks you against the no-fly list, scans your bags, and enforces travel rules before letting you board the plane.',
    resources: [
      { label: 'Conforma', url: 'https://conforma.dev/' },
      {
        label: 'Policy Controller',
        url: 'https://docs.sigstore.dev/policy-controller/overview/',
      },
    ],
  },
  {
    id: 'slsa-levels',
    title: 'SLSA Build Levels',
    icon: '🏆',
    color: 'var(--accent-green)',
    difficulty: 'advanced',
    description:
      'Deep dive into SLSA maturity levels and progressive security guarantees for software supply chains.',
    concepts: [
      {
        title: 'SLSA Overview',
        content:
          'Supply chain Levels for Software Artifacts (SLSA) defines progressive security levels from basic documentation to hermetic, reviewed builds. Each level builds on the previous one with stronger guarantees.',
      },
      {
        title: 'Level 1: Provenance Exists',
        content:
          "Basic documentation that a build occurred. The provenance describes the build but provides no integrity guarantees. Anyone can create provenance, so it can't be trusted without verification.",
      },
      {
        title: 'Level 2: Signed Provenance',
        content:
          'Provenance is signed by the build service, preventing tampering after creation. This enables policy enforcement and audit trails. Most automated build systems achieve this level easily.',
      },
      {
        title: 'Level 3: Hardened Builds',
        content:
          'Source and build platforms are verified and prevent unauthorized changes. Provenance must include all build parameters and be non-falsifiable. Prevents many supply chain attacks.',
      },
      {
        title: 'Level 4: Two-Party Review + Hermetic',
        content:
          'Highest level requiring all changes to be reviewed by two trusted persons and builds to be fully hermetic (isolated, no network access). Extremely difficult to achieve but provides strongest guarantees.',
      },
    ],
    realWorld:
      "🎓 SLSA levels are like education degrees: high school diploma (L1 - you graduated), bachelor's (L2 - verified by accredited institution), master's (L3 - specialized work verified), PhD (L4 - peer-reviewed original research).",
    resources: [
      { label: 'SLSA Spec', url: 'https://slsa.dev/spec/' },
      { label: 'SLSA Levels', url: 'https://slsa.dev/spec/v1.0/levels' },
    ],
  },
];

export const AdvancedConcepts: Component = () => {
  const [selectedTopic, setSelectedTopic] =
    createSignal<string>('attestations');
  const [expandedConcept, setExpandedConcept] = createSignal<number | null>(
    null
  );

  const currentTopic = () => TOPICS.find(t => t.id === selectedTopic());

  return (
    <div class="advanced-concepts">
      <div class="advanced-header">
        <h1 class="advanced-title">
          <span class="text-gradient">Advanced Supply Chain Security</span>
        </h1>
        <p class="advanced-subtitle">
          Deep dive into attestations, policies, and SLSA compliance
        </p>
      </div>

      {/* Topic Selector */}
      <div class="topic-selector">
        <For each={TOPICS}>
          {topic => (
            <button
              class={`topic-card ${selectedTopic() === topic.id ? 'active' : ''}`}
              onClick={() => {
                setSelectedTopic(topic.id);
                setExpandedConcept(null);
              }}
              style={{ '--topic-color': topic.color }}
            >
              <span
                class="difficulty-badge"
                style={{ background: topic.color }}
              >
                {topic.difficulty}
              </span>
              <div class="topic-icon">{topic.icon}</div>
              <h3 class="topic-name">{topic.title}</h3>
            </button>
          )}
        </For>
      </div>

      {/* Topic Content */}
      <Presence exitBeforeEnter>
        <Show when={currentTopic()} keyed>
          {topic => (
            <Motion.div
              class="topic-content glass-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              style={{ '--topic-color': topic.color }}
            >
              <h2 class="topic-title">{topic.title}</h2>
              <p class="topic-description">{topic.description}</p>

              {/* Concept Accordion */}
              <div class="concepts-list">
                <For each={topic.concepts}>
                  {(concept, index) => (
                    <div class="concept-item">
                      <button
                        class="concept-header"
                        onClick={() =>
                          setExpandedConcept(
                            expandedConcept() === index() ? null : index()
                          )
                        }
                      >
                        <h4 class="concept-title">{concept.title}</h4>
                        <span class="concept-toggle">
                          {expandedConcept() === index() ? '−' : '+'}
                        </span>
                      </button>
                      <Show when={expandedConcept() === index()}>
                        <Motion.div
                          class="concept-content"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          transition={{ duration: 0.3 }}
                        >
                          <p class="concept-text">{concept.content}</p>
                          <Show when={concept.codeExample}>
                            <pre class="code-example mono">
                              {concept.codeExample}
                            </pre>
                          </Show>
                        </Motion.div>
                      </Show>
                    </div>
                  )}
                </For>
              </div>

              {/* Real World Analogy */}
              <div class="topic-section analogy-section">
                <h4 class="section-title">💡 Real World Analogy</h4>
                <p class="section-text">{topic.realWorld}</p>
              </div>

              {/* Resources */}
              <div class="topic-resources">
                <span class="resources-label">Learn More:</span>
                <For each={topic.resources}>
                  {resource => (
                    <a
                      href={resource.url}
                      class="btn btn-secondary"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {resource.label} →
                    </a>
                  )}
                </For>
              </div>
            </Motion.div>
          )}
        </Show>
      </Presence>
    </div>
  );
};

export default AdvancedConcepts;
