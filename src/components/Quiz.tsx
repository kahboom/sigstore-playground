import { Component, createSignal, For, Show } from 'solid-js';
import { Motion, Presence } from 'solid-motionone';
import { QUIZ_QUESTIONS, type Question } from '../data/quizQuestions';
import './Quiz.css';

export const Quiz: Component = () => {
  const [currentQuestion, setCurrentQuestion] = createSignal(0);
  const [selectedAnswer, setSelectedAnswer] = createSignal<number | null>(null);
  const [showExplanation, setShowExplanation] = createSignal(false);
  const [score, setScore] = createSignal(0);
  const [quizComplete, setQuizComplete] = createSignal(false);
  const [answeredQuestions, setAnsweredQuestions] = createSignal<Set<number>>(
    new Set()
  );

  const question = () => QUIZ_QUESTIONS[currentQuestion()];

  const handleAnswer = (index: number) => {
    if (showExplanation()) return;

    setSelectedAnswer(index);
    setShowExplanation(true);

    if (
      index === question().correctIndex &&
      !answeredQuestions().has(currentQuestion())
    ) {
      setScore(s => s + 1);
    }
    setAnsweredQuestions(prev => new Set([...prev, currentQuestion()]));
  };

  const nextQuestion = () => {
    if (currentQuestion() < QUIZ_QUESTIONS.length - 1) {
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
    const percentage = (score() / QUIZ_QUESTIONS.length) * 100;
    if (percentage === 100) return '🏆';
    if (percentage >= 80) return '🎉';
    if (percentage >= 60) return '👏';
    if (percentage >= 40) return '💪';
    return '📚';
  };

  const getScoreMessage = () => {
    const percentage = (score() / QUIZ_QUESTIONS.length) * 100;
    if (percentage === 100) return "Perfect score! You're a Sigstore expert!";
    if (percentage >= 80) return 'Excellent! You really know your stuff!';
    if (percentage >= 60) return "Good job! You've got a solid understanding!";
    if (percentage >= 40) return 'Not bad! Keep learning!';
    return 'Time to study up! Try the Component Explorer!';
  };

  const getDifficultyColor = (difficulty: Question['difficulty']) => {
    switch (difficulty) {
      case 'easy':
        return 'var(--accent-green)';
      case 'medium':
        return 'var(--accent-orange)';
      case 'hard':
        return 'var(--accent-pink)';
    }
  };

  return (
    <div class="quiz">
      <div class="quiz-header">
        <h1 class="quiz-title">
          <span class="text-gradient">Test Your Knowledge</span>
        </h1>
        <p class="quiz-subtitle">
          How well do you understand Sigstore? Answer these questions to find
          out!
        </p>
      </div>

      <Show
        when={!quizComplete()}
        fallback={
          <Motion.div
            class="quiz-results glass-card"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            <div class="results-emoji">{getScoreEmoji()}</div>
            <h2 class="results-score">
              {score()} / {QUIZ_QUESTIONS.length}
            </h2>
            <p class="results-message">{getScoreMessage()}</p>

            <div class="results-breakdown">
              <div class="breakdown-bar">
                <div
                  class="breakdown-fill"
                  style={{
                    width: `${(score() / QUIZ_QUESTIONS.length) * 100}%`,
                  }}
                />
              </div>
              <span class="breakdown-percent">
                {Math.round((score() / QUIZ_QUESTIONS.length) * 100)}%
              </span>
            </div>

            <div class="results-actions">
              <button class="btn btn-primary" onClick={resetQuiz}>
                🔄 Try Again
              </button>
            </div>
          </Motion.div>
        }
      >
        {/* Progress Bar */}
        <div class="quiz-progress">
          <div class="progress-bar">
            <div
              class="progress-fill"
              style={{
                width: `${((currentQuestion() + 1) / QUIZ_QUESTIONS.length) * 100}%`,
              }}
            />
          </div>
          <span class="progress-text">
            Question {currentQuestion() + 1} of {QUIZ_QUESTIONS.length}
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
                style={{
                  background: getDifficultyColor(question().difficulty),
                }}
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
                        showResult()
                          ? isCorrect()
                            ? 'correct'
                            : isSelected()
                              ? 'incorrect'
                              : ''
                          : ''
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
                  <div
                    class={`explanation-card ${selectedAnswer() === question().correctIndex ? 'correct' : 'incorrect'}`}
                  >
                    <div class="explanation-header">
                      {selectedAnswer() === question().correctIndex ? (
                        <span class="explanation-result correct">
                          ✓ Correct!
                        </span>
                      ) : (
                        <span class="explanation-result incorrect">
                          ✗ Not quite...
                        </span>
                      )}
                    </div>
                    <p class="explanation-text">{question().explanation}</p>
                  </div>

                  <button
                    class="btn btn-primary next-btn"
                    onClick={nextQuestion}
                  >
                    {currentQuestion() < QUIZ_QUESTIONS.length - 1
                      ? 'Next Question →'
                      : 'See Results'}
                  </button>
                </Motion.div>
              </Show>
            </Presence>
          </Motion.div>
        </Presence>

        {/* Question Navigator */}
        <div class="question-nav">
          <For each={QUIZ_QUESTIONS}>
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

export default Quiz;
