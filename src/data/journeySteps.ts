export interface Step {
  id: number;
  title: string;
  description: string;
  component:
    | 'developer'
    | 'oidc'
    | 'fulcio'
    | 'artifact'
    | 'rekor'
    | 'verifier';
  details: string[];
  action: string;
}

export const JOURNEY_STEPS: Step[] = [
  {
    id: 1,
    title: 'Developer initiates signing',
    description:
      'You want to sign your software artifact to prove it came from you',
    component: 'developer',
    details: [
      'Developer runs `cosign sign` on their artifact',
      'Cosign generates an ephemeral key pair',
      'Private key is never stored permanently',
    ],
    action: '🔑 Generate Key Pair',
  },
  {
    id: 2,
    title: 'Authenticate with OIDC',
    description: 'Prove your identity using an existing identity provider',
    component: 'oidc',
    details: [
      'Developer authenticates via GitHub, Google, or other OIDC provider',
      'Receives an OIDC token proving identity',
      'No need to manage long-lived signing keys!',
    ],
    action: '🎫 Get OIDC Token',
  },
  {
    id: 3,
    title: 'Request certificate from Fulcio',
    description: 'Fulcio issues a short-lived signing certificate',
    component: 'fulcio',
    details: [
      'Cosign sends public key + OIDC token to Fulcio',
      'Fulcio verifies the OIDC token',
      'Issues a certificate valid for ~10 minutes',
      'Certificate binds your identity to your public key',
    ],
    action: '📜 Issue Certificate',
  },
  {
    id: 4,
    title: 'Sign the artifact',
    description: 'Create a cryptographic signature using the private key',
    component: 'artifact',
    details: [
      'Hash the artifact content',
      'Sign the hash with the ephemeral private key',
      'Attach the signature and certificate to the artifact',
    ],
    action: '✍️ Sign Artifact',
  },
  {
    id: 5,
    title: 'Record in Rekor transparency log',
    description: 'Create an immutable, timestamped record of the signing event',
    component: 'rekor',
    details: [
      'Signing event recorded in Rekor',
      "Entry is append-only (can't be deleted)",
      'Provides proof of when signing occurred',
      'Anyone can audit the transparency log',
    ],
    action: '📋 Log Entry',
  },
  {
    id: 6,
    title: 'Verification complete!',
    description: "Anyone can now verify your artifact's authenticity",
    component: 'verifier',
    details: [
      'Verifier runs `cosign verify`',
      'Checks signature against certificate',
      'Validates certificate chain to Fulcio',
      'Confirms entry exists in Rekor',
      '✅ Artifact is verified!',
    ],
    action: '✅ Verify',
  },
];
