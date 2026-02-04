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
  {
    id: 11,
    question: "What is an attestation?",
    options: [
      "Metadata that describes how an artifact was built",
      "A type of cryptographic signature",
      "A container image format",
      "A signing key"
    ],
    correctIndex: 0,
    explanation: "An attestation is signed metadata that provides verifiable claims about an artifact, such as how it was built, what dependencies it used, and who created it.",
    difficulty: 'easy'
  },
  {
    id: 12,
    question: "What does Conforma do?",
    options: [
      "Signs container images",
      "Enforces policies on artifacts based on attestations",
      "Provides OIDC authentication",
      "Stores transparency logs"
    ],
    correctIndex: 1,
    explanation: "Conforma is a policy enforcement tool that validates artifacts against defined security policies, checking their provenance and attestations to ensure they meet requirements.",
    difficulty: 'easy'
  },
  {
    id: 13,
    question: "What format does Cosign use for attestations?",
    options: [
      "JWT (JSON Web Token)",
      "in-toto with DSSE signing",
      "PGP/GPG",
      "X.509 certificates only"
    ],
    correctIndex: 1,
    explanation: "Cosign uses the in-toto attestation framework with DSSE (Dead Simple Signing Envelope) format, providing a standardized way to express claims about software artifacts.",
    difficulty: 'easy'
  },
  {
    id: 14,
    question: "What is SLSA provenance?",
    options: [
      "A type of encryption algorithm",
      "Verifiable information about where, when, and how an artifact was produced",
      "A blockchain for tracking builds",
      "A container registry protocol"
    ],
    correctIndex: 1,
    explanation: "SLSA provenance is detailed, verifiable metadata about the build process, including builder identity, materials used, and build parameters. It enables verification of supply chain integrity.",
    difficulty: 'medium'
  },
  {
    id: 15,
    question: "What is a predicate in an in-toto attestation?",
    options: [
      "The signature algorithm used",
      "The type-specific claims about the subject (e.g., SLSA provenance, SBOM)",
      "The subject artifact being described",
      "The person who signed the attestation"
    ],
    correctIndex: 1,
    explanation: "A predicate is the payload of an attestation containing type-specific claims. For example, a SLSA provenance predicate describes the build process, while an SBOM predicate lists dependencies.",
    difficulty: 'medium'
  },
  {
    id: 16,
    question: "How does policy enforcement differ from signature verification?",
    options: [
      "Policy checks the content of attestations; signature verification checks authenticity",
      "They are the same thing",
      "Policy is faster than verification",
      "Policy doesn't use cryptography"
    ],
    correctIndex: 0,
    explanation: "Signature verification proves the attestation is authentic and untampered. Policy enforcement checks if the verified attestation's claims meet your security requirements (e.g., built from approved source, no high-severity vulnerabilities).",
    difficulty: 'medium'
  },
  {
    id: 17,
    question: "Where are attestations stored after signing?",
    options: [
      "Only locally on the developer's machine",
      "In the container registry alongside the image and/or in Rekor",
      "Only in Rekor transparency log",
      "In a separate attestation server"
    ],
    correctIndex: 1,
    explanation: "Attestations can be stored in the container registry as OCI artifacts attached to the image, and/or recorded in Rekor for transparency. This allows verifiers to retrieve them later.",
    difficulty: 'medium'
  },
  {
    id: 18,
    question: "What are SLSA Build Levels?",
    options: [
      "Different encryption strengths",
      "Progressive security guarantees about the build process (L1-L4)",
      "Container image size categories",
      "Types of signing keys"
    ],
    correctIndex: 1,
    explanation: "SLSA defines four build levels with increasing security guarantees: L1 (build provenance exists), L2 (signed provenance), L3 (hardened builds, source/build platform verified), L4 (two-party review, hermetic builds).",
    difficulty: 'hard'
  },
  {
    id: 19,
    question: "What is DSSE and why is it used?",
    options: [
      "A new signing algorithm; faster than RSA",
      "Dead Simple Signing Envelope; prevents signature wrapping attacks",
      "A container runtime; more secure than Docker",
      "A key management system; integrates with HSMs"
    ],
    correctIndex: 1,
    explanation: "DSSE (Dead Simple Signing Envelope) is a simple, foolproof standard for signing arbitrary data. It was created to prevent signature confusion/wrapping attacks that plagued earlier formats like JWS.",
    difficulty: 'hard'
  },
  {
    id: 20,
    question: "How does Conforma validate SLSA compliance?",
    options: [
      "It runs static analysis on source code",
      "It checks if attestations exist and match policy requirements (builder, materials, etc.)",
      "It re-runs the build to verify reproducibility",
      "It only checks signature validity"
    ],
    correctIndex: 1,
    explanation: "Conforma validates SLSA compliance by retrieving attestations, verifying signatures, and then checking if the attestation claims (builder identity, materials, build type) match the defined policy requirements.",
    difficulty: 'hard'
  },
];
