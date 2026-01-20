import { Component, createSignal, For, Show } from 'solid-js';
import { Motion, Presence } from 'solid-motionone';
import './Quiz.css';

interface Question {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

const QUESTIONS: Question[] = [
  {
    id: 1,
    question: "What is the main advantage of Sigstore's keyless signing?",
    options: [
      "It's faster than traditional signing",
      "No need to manage long-lived signing keys",
      "It uses stronger encryption",
      "It works offline"
    ],
    correctIndex: 1,
    explanation: "Keyless signing eliminates the need to securely store and rotate long-lived signing keys. Instead, you use your existing identity (via OIDC) to get short-lived certificates.",
    difficulty: 'easy'
  },
  {
    id: 2,
    question: "What does Fulcio do in the Sigstore ecosystem?",
    options: [
      "Stores signatures in a transparency log",
      "Issues short-lived certificates based on OIDC identity",
      "Signs container images",
      "Provides OIDC authentication"
    ],
    correctIndex: 1,
    explanation: "Fulcio is a certificate authority that issues short-lived (~10 min) certificates after verifying your OIDC identity token. The certificate binds your identity to a public key.",
    difficulty: 'easy'
  },
  {
    id: 3,
    question: "Why are Fulcio certificates short-lived?",
    options: [
      "To save storage space",
      "To reduce the impact of key compromise",
      "Because OIDC tokens expire quickly",
      "Both B and C are correct"
    ],
    correctIndex: 3,
    explanation: "Short-lived certificates (valid ~10 minutes) minimize the window for key compromise. They also align with OIDC token lifetimes, ensuring the identity verification is fresh.",
    difficulty: 'medium'
  },
  {
    id: 4,
    question: "What type of data structure does Rekor use for integrity?",
    options: [
      "Blockchain",
      "Merkle tree",
      "Hash table",
      "Linked list"
    ],
    correctIndex: 1,
    explanation: "Rekor uses Merkle trees, the same technology used in Certificate Transparency logs. This allows for efficient proofs that entries haven't been tampered with.",
    difficulty: 'medium'
  },
  {
    id: 5,
    question: "What proof does a client receive from Rekor after submitting an entry?",
    options: [
      "A blockchain receipt",
      "An inclusion proof",
      "A signed timestamp only",
      "A verification token"
    ],
    correctIndex: 1,
    explanation: "Rekor returns an inclusion proof, which is a cryptographic proof that the entry was added to the Merkle tree. This allows offline verification that the entry exists in the log.",
    difficulty: 'hard'
  },
  {
    id: 6,
    question: "Which identity providers can be used with Sigstore keyless signing?",
    options: [
      "Only GitHub",
      "Only Google and Microsoft",
      "Any OIDC-compliant provider",
      "Only enterprise SSO providers"
    ],
    correctIndex: 2,
    explanation: "Sigstore supports any OIDC-compliant identity provider! This includes GitHub, Google, Microsoft, GitLab, and enterprise identity systems that support OIDC.",
    difficulty: 'easy'
  },
  {
    id: 7,
    question: "What is stored in Rekor's transparency log?",
    options: [
      "The actual software artifacts",
      "Signing metadata (signature, certificate, hash)",
      "User passwords",
      "Private keys"
    ],
    correctIndex: 1,
    explanation: "Rekor stores signing metadata: the signature, the certificate used, and a hash of the artifact. It does NOT store the actual artifact or any private keys!",
    difficulty: 'easy'
  },
  {
    id: 8,
    question: "How does a verifier confirm that a signature was created at a specific time?",
    options: [
      "By checking the file modification date",
      "By querying the Rekor transparency log for a timestamped entry",
      "By asking the signer directly",
      "Timestamps cannot be verified"
    ],
    correctIndex: 1,
    explanation: "Rekor entries include a signed timestamp from the log. Verifiers can check this timestamp to prove when the signing occurred, even after the short-lived certificate expires.",
    difficulty: 'medium'
  },
  {
    id: 9,
    question: "What happens to the ephemeral private key after signing?",
    options: [
      "It's stored in a secure vault",
      "It's uploaded to Rekor",
      "It's discarded immediately",
      "It's sent to Fulcio for backup"
    ],
    correctIndex: 2,
    explanation: "The ephemeral private key is discarded immediately after signing. It's never stored anywhere, eliminating key management concerns and reducing attack surface.",
    difficulty: 'medium'
  },
  {
    id: 10,
    question: "What makes Rekor's log 'append-only'?",
    options: [
      "Legal requirements prevent deletion",
      "The Merkle tree structure makes tampering detectable",
      "Entries are encrypted",
      "Only certain users can write to it"
    ],
    correctIndex: 1,
    explanation: "Rekor uses a Merkle tree structure where each entry depends on previous entries. Modifying or deleting an entry would change the tree's root hash, making tampering immediately detectable.",
    difficulty: 'hard'
  },
];

export const Quiz: Component = () => {
  const [currentQuestion, setCurrentQuestion] = createSignal(0);
  const [selectedAnswer, setSelectedAnswer] = createSignal<number | null>(null);
  const [showExplanation, setShowExplanation] = createSignal(false);
  const [score, setScore] = createSignal(0);
  const [quizComplete, setQuizComplete] = createSignal(false);
  const [answeredQuestions, setAnsweredQuestions] = createSignal<Set<number>>(new Set());

  const question = () => QUESTIONS[currentQuestion()];
  
  const handleAnswer = (index: number) => {
    if (showExplanation()) return;
    
    setSelectedAnswer(index);
    setShowExplanation(true);
    
    if (index === question().correctIndex && !answeredQuestions().has(currentQuestion())) {
      setScore(s => s + 1);
    }
    setAnsweredQuestions(prev => new Set([...prev, currentQuestion()]));
  };

  const nextQuestion = () => {
    if (currentQuestion() < QUESTIONS.length - 1) {
      setCurrentQuestion(c => c + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      setQuizComplete(true);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setScore(0);
    setQuizComplete(false);
    setAnsweredQuestions(new Set<number>());
  };

  const getScoreEmoji = () => {
    const percentage = (score() / QUESTIONS.length) * 100;
    if (percentage === 100) return '🏆';
    if (percentage >= 80) return '🎉';
    if (percentage >= 60) return '👏';
    if (percentage >= 40) return '💪';
    return '📚';
  };

  const getScoreMessage = () => {
    const percentage = (score() / QUESTIONS.length) * 100;
    if (percentage === 100) return "Perfect score! You're a Sigstore expert!";
    if (percentage >= 80) return "Excellent! You really know your stuff!";
    if (percentage >= 60) return "Good job! You've got a solid understanding!";
    if (percentage >= 40) return "Not bad! Keep learning!";
    return "Time to study up! Try the Component Explorer!";
  };

  const getDifficultyColor = (difficulty: Question['difficulty']) => {
    switch (difficulty) {
      case 'easy': return 'var(--accent-green)';
      case 'medium': return 'var(--accent-orange)';
      case 'hard': return 'var(--accent-pink)';
    }
  };

  return (
    <div class="quiz">
      <div class="quiz-header">
        <h1 class="quiz-title">
          <span class="text-gradient">Test Your Knowledge</span>
        </h1>
        <p class="quiz-subtitle">
          How well do you understand Sigstore? Answer these questions to find out!
        </p>
      </div>

      <Show when={!quizComplete()} fallback={
        <Motion.div
          class="quiz-results glass-card"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
        >
          <div class="results-emoji">{getScoreEmoji()}</div>
          <h2 class="results-score">
            {score()} / {QUESTIONS.length}
          </h2>
          <p class="results-message">{getScoreMessage()}</p>
          
          <div class="results-breakdown">
            <div class="breakdown-bar">
              <div 
                class="breakdown-fill" 
                style={{ width: `${(score() / QUESTIONS.length) * 100}%` }}
              />
            </div>
            <span class="breakdown-percent">
              {Math.round((score() / QUESTIONS.length) * 100)}%
            </span>
          </div>

          <div class="results-actions">
            <button class="btn btn-primary" onClick={resetQuiz}>
              🔄 Try Again
            </button>
          </div>
        </Motion.div>
      }>
        {/* Progress Bar */}
        <div class="quiz-progress">
          <div class="progress-bar">
            <div 
              class="progress-fill" 
              style={{ width: `${((currentQuestion() + 1) / QUESTIONS.length) * 100}%` }}
            />
          </div>
          <span class="progress-text">
            Question {currentQuestion() + 1} of {QUESTIONS.length}
          </span>
        </div>

        {/* Question Card */}
        <Presence>
          <Motion.div
            class="question-card glass-card"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div class="question-header">
              <span 
                class="difficulty-badge"
                style={{ background: getDifficultyColor(question().difficulty) }}
              >
                {question().difficulty}
              </span>
              <span class="score-display">Score: {score()}</span>
            </div>

            <h2 class="question-text">{question().question}</h2>

            <div class="options-list">
              <For each={question().options}>
                {(option, index) => {
                  const isSelected = () => selectedAnswer() === index();
                  const isCorrect = () => index() === question().correctIndex;
                  const showResult = () => showExplanation();
                  
                  return (
                    <button
                      class={`option-btn ${isSelected() ? 'selected' : ''} ${
                        showResult() ? (isCorrect() ? 'correct' : isSelected() ? 'incorrect' : '') : ''
                      }`}
                      onClick={() => handleAnswer(index())}
                      disabled={showExplanation()}
                    >
                      <span class="option-letter">
                        {String.fromCharCode(65 + index())}
                      </span>
                      <span class="option-text">{option}</span>
                      <Show when={showResult() && isCorrect()}>
                        <span class="option-icon">✓</span>
                      </Show>
                      <Show when={showResult() && isSelected() && !isCorrect()}>
                        <span class="option-icon">✗</span>
                      </Show>
                    </button>
                  );
                }}
              </For>
            </div>

            {/* Explanation */}
            <Presence>
              <Show when={showExplanation()}>
                <Motion.div
                  class="explanation"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  transition={{ duration: 0.3 }}
                >
                  <div class={`explanation-card ${selectedAnswer() === question().correctIndex ? 'correct' : 'incorrect'}`}>
                    <div class="explanation-header">
                      {selectedAnswer() === question().correctIndex ? (
                        <span class="explanation-result correct">✓ Correct!</span>
                      ) : (
                        <span class="explanation-result incorrect">✗ Not quite...</span>
                      )}
                    </div>
                    <p class="explanation-text">{question().explanation}</p>
                  </div>
                  
                  <button class="btn btn-primary next-btn" onClick={nextQuestion}>
                    {currentQuestion() < QUESTIONS.length - 1 ? 'Next Question →' : 'See Results'}
                  </button>
                </Motion.div>
              </Show>
            </Presence>
          </Motion.div>
        </Presence>

        {/* Question Navigator */}
        <div class="question-nav">
          <For each={QUESTIONS}>
            {(q, index) => (
              <button
                class={`nav-dot ${currentQuestion() === index() ? 'active' : ''} ${
                  answeredQuestions().has(index()) ? 'answered' : ''
                }`}
                onClick={() => {
                  setCurrentQuestion(index());
                  setSelectedAnswer(null);
                  setShowExplanation(false);
                }}
                title={`Question ${index() + 1}`}
              />
            )}
          </For>
        </div>
      </Show>
    </div>
  );
};
