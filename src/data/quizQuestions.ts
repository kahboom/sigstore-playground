export interface Question {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export const QUIZ_QUESTIONS: Question[] = [
  {
    id: 1,
    question: "What is the main advantage of Sigstore's keyless signing?",
    options: [
      "It's faster than traditional signing",
      'No need to manage long-lived signing keys',
      'It uses stronger encryption',
      'It works offline',
    ],
    correctIndex: 1,
    explanation:
      'Keyless signing eliminates the need to securely store and rotate long-lived signing keys. Instead, you use your existing identity (via OIDC) to get short-lived certificates.',
    difficulty: 'easy',
  },
  {
    id: 2,
    question: 'What does Fulcio do in the Sigstore ecosystem?',
    options: [
      'Stores signatures in a transparency log',
      'Issues short-lived certificates based on OIDC identity',
      'Signs container images',
      'Provides OIDC authentication',
    ],
    correctIndex: 1,
    explanation:
      'Fulcio is a certificate authority that issues short-lived (~10 min) certificates after verifying your OIDC identity token. The certificate binds your identity to a public key.',
    difficulty: 'easy',
  },
  {
    id: 3,
    question: 'Why are Fulcio certificates short-lived?',
    options: [
      'To save storage space',
      'To reduce the impact of key compromise',
      'Because OIDC tokens expire quickly',
      'Both B and C are correct',
    ],
    correctIndex: 3,
    explanation:
      'Short-lived certificates (valid ~10 minutes) minimize the window for key compromise. They also align with OIDC token lifetimes, ensuring the identity verification is fresh.',
    difficulty: 'medium',
  },
  {
    id: 4,
    question: 'What type of data structure does Rekor use for integrity?',
    options: ['Blockchain', 'Merkle tree', 'Hash table', 'Linked list'],
    correctIndex: 1,
    explanation:
      "Rekor uses Merkle trees, the same technology used in Certificate Transparency logs. This allows for efficient proofs that entries haven't been tampered with.",
    difficulty: 'medium',
  },
  {
    id: 5,
    question:
      'What proof does a client receive from Rekor after submitting an entry?',
    options: [
      'A blockchain receipt',
      'An inclusion proof',
      'A signed timestamp only',
      'A verification token',
    ],
    correctIndex: 1,
    explanation:
      'Rekor returns an inclusion proof, which is a cryptographic proof that the entry was added to the Merkle tree. This allows offline verification that the entry exists in the log.',
    difficulty: 'hard',
  },
  {
    id: 6,
    question:
      'Which identity providers can be used with Sigstore keyless signing?',
    options: [
      'Only GitHub',
      'Only Google and Microsoft',
      'Any OIDC-compliant provider',
      'Only enterprise SSO providers',
    ],
    correctIndex: 2,
    explanation:
      'Sigstore supports any OIDC-compliant identity provider! This includes GitHub, Google, Microsoft, GitLab, and enterprise identity systems that support OIDC.',
    difficulty: 'easy',
  },
  {
    id: 7,
    question: "What is stored in Rekor's transparency log?",
    options: [
      'The actual software artifacts',
      'Signing metadata (signature, certificate, hash)',
      'User passwords',
      'Private keys',
    ],
    correctIndex: 1,
    explanation:
      'Rekor stores signing metadata: the signature, the certificate used, and a hash of the artifact. It does NOT store the actual artifact or any private keys!',
    difficulty: 'easy',
  },
  {
    id: 8,
    question:
      'How does a verifier confirm that a signature was created at a specific time?',
    options: [
      'By checking the file modification date',
      'By querying the Rekor transparency log for a timestamped entry',
      'By asking the signer directly',
      'Timestamps cannot be verified',
    ],
    correctIndex: 1,
    explanation:
      'Rekor entries include a signed timestamp from the log. Verifiers can check this timestamp to prove when the signing occurred, even after the short-lived certificate expires.',
    difficulty: 'medium',
  },
  {
    id: 9,
    question: 'What happens to the ephemeral private key after signing?',
    options: [
      "It's stored in a secure vault",
      "It's uploaded to Rekor",
      "It's discarded immediately",
      "It's sent to Fulcio for backup",
    ],
    correctIndex: 2,
    explanation:
      "The ephemeral private key is discarded immediately after signing. It's never stored anywhere, eliminating key management concerns and reducing attack surface.",
    difficulty: 'medium',
  },
  {
    id: 10,
    question: "What makes Rekor's log 'append-only'?",
    options: [
      'Legal requirements prevent deletion',
      'The Merkle tree structure makes tampering detectable',
      'Entries are encrypted',
      'Only certain users can write to it',
    ],
    correctIndex: 1,
    explanation:
      "Rekor uses a Merkle tree structure where each entry depends on previous entries. Modifying or deleting an entry would change the tree's root hash, making tampering immediately detectable.",
    difficulty: 'hard',
  },
];
