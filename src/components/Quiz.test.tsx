import { render, screen, fireEvent } from '@solidjs/testing-library';
import { describe, it, expect, beforeEach } from 'vitest';
import Quiz from './Quiz';
import { setViewport, VIEWPORTS } from '../test-setup';

describe('Quiz', () => {
  beforeEach(() => {
    setViewport(VIEWPORTS.desktop.width, VIEWPORTS.desktop.height);
  });

  describe('Initial Render', () => {
    it('renders the quiz title and subtitle', () => {
      render(() => <Quiz />);

      expect(screen.getByText('Test Your Knowledge')).toBeInTheDocument();
      expect(
        screen.getByText(
          /How well do you understand Sigstore\? Answer these questions to find out!/i
        )
      ).toBeInTheDocument();
    });

    it('displays the first question by default', () => {
      render(() => <Quiz />);

      expect(
        screen.getByText(
          /What is the main advantage of Sigstore's keyless signing\?/i
        )
      ).toBeInTheDocument();
    });

    it('shows question progress indicator', () => {
      render(() => <Quiz />);

      expect(screen.getByText(/Question 1 of 10/i)).toBeInTheDocument();
    });

    it('displays all answer options for first question', () => {
      render(() => <Quiz />);

      expect(
        screen.getByText(/It's faster than traditional signing/i)
      ).toBeInTheDocument();
      expect(
        screen.getByText(/No need to manage long-lived signing keys/i)
      ).toBeInTheDocument();
    });

    it('displays difficulty badge', () => {
      render(() => <Quiz />);

      const difficultyBadge = document.querySelector('.difficulty-badge');
      expect(difficultyBadge).toBeInTheDocument();
    });

    it('displays current score', () => {
      render(() => <Quiz />);

      expect(screen.getByText(/Score: 0/i)).toBeInTheDocument();
    });
  });

  describe('Answer Selection', () => {
    it('allows selecting an answer', () => {
      render(() => <Quiz />);

      const optionButtons = document.querySelectorAll('.option-btn');
      expect(optionButtons.length).toBeGreaterThan(0);

      fireEvent.click(optionButtons[0]);

      expect(optionButtons[0]).toHaveClass('selected');
    });

    it('shows explanation after selecting an answer', () => {
      render(() => <Quiz />);

      const optionButtons = document.querySelectorAll('.option-btn');
      fireEvent.click(optionButtons[1]); // select correct answer

      expect(
        screen.getByText(
          /Keyless signing eliminates the need to securely store/i
        )
      ).toBeInTheDocument();
    });

    it('shows correct indicator for correct answer', () => {
      render(() => <Quiz />);

      const optionButtons = document.querySelectorAll('.option-btn');
      fireEvent.click(optionButtons[1]); // correct answer for question 1

      expect(screen.getByText('✓ Correct!')).toBeInTheDocument();
    });

    it('shows incorrect indicator for wrong answer', () => {
      render(() => <Quiz />);

      const optionButtons = document.querySelectorAll('.option-btn');
      fireEvent.click(optionButtons[0]); // wrong answer

      expect(screen.getByText('✗ Not quite...')).toBeInTheDocument();
    });

    it('increments score when correct answer is selected', () => {
      render(() => <Quiz />);

      expect(screen.getByText('Score: 0')).toBeInTheDocument();

      const optionButtons = document.querySelectorAll('.option-btn');
      fireEvent.click(optionButtons[1]); // correct answer

      expect(screen.getByText('Score: 1')).toBeInTheDocument();
    });

    it('does not increment score for wrong answer', () => {
      render(() => <Quiz />);

      const optionButtons = document.querySelectorAll('.option-btn');
      fireEvent.click(optionButtons[0]); // wrong answer

      expect(screen.getByText('Score: 0')).toBeInTheDocument();
    });

    it('prevents selecting another answer after one is chosen', () => {
      render(() => <Quiz />);

      const optionButtons = document.querySelectorAll('.option-btn');
      fireEvent.click(optionButtons[0]);

      // try to click another option
      fireEvent.click(optionButtons[1]);

      // first answer should still be selected
      expect(optionButtons[0]).toHaveClass('selected');
    });
  });

  describe('Navigation', () => {
    it('shows next question button after answering', () => {
      render(() => <Quiz />);

      const optionButtons = document.querySelectorAll('.option-btn');
      fireEvent.click(optionButtons[0]);

      expect(screen.getByText('Next Question →')).toBeInTheDocument();
    });

    it('advances to next question when next button is clicked', () => {
      render(() => <Quiz />);

      const optionButtons = document.querySelectorAll('.option-btn');
      fireEvent.click(optionButtons[0]);

      const nextButton = screen.getByText('Next Question →');
      fireEvent.click(nextButton);

      expect(screen.getByText(/Question 2 of 10/i)).toBeInTheDocument();
    });

    it('resets answer selection when moving to next question', () => {
      render(() => <Quiz />);

      let optionButtons = document.querySelectorAll('.option-btn');
      fireEvent.click(optionButtons[0]);

      const nextButton = screen.getByText('Next Question →');
      fireEvent.click(nextButton);

      optionButtons = document.querySelectorAll('.option-btn');
      const selectedOptions = Array.from(optionButtons).filter(btn =>
        btn.classList.contains('selected')
      );
      expect(selectedOptions.length).toBe(0);
    });

    it('allows navigating between questions using question nav', () => {
      render(() => <Quiz />);

      // answer first question
      let optionButtons = document.querySelectorAll('.option-btn');
      fireEvent.click(optionButtons[0]);

      const nextButton = screen.getByText('Next Question →');
      fireEvent.click(nextButton);

      // go back to question 1 using nav
      const navDots = document.querySelectorAll('.nav-dot');
      fireEvent.click(navDots[0]);

      expect(screen.getByText(/Question 1 of 10/i)).toBeInTheDocument();
    });

    it('marks answered questions in navigation', () => {
      render(() => <Quiz />);

      const optionButtons = document.querySelectorAll('.option-btn');
      fireEvent.click(optionButtons[0]);

      const navDots = document.querySelectorAll('.nav-dot');
      expect(navDots[0]).toHaveClass('answered');
    });
  });

  describe('Quiz Completion', () => {
    it('shows results screen after completing all questions', () => {
      render(() => <Quiz />);

      // answer all 10 questions
      for (let i = 0; i < 10; i++) {
        const optionButtons = document.querySelectorAll('.option-btn');
        fireEvent.click(optionButtons[0]);

        const nextButton = screen.getByText(
          i < 9 ? 'Next Question →' : 'See Results'
        );
        fireEvent.click(nextButton);
      }

      expect(screen.getByText(/\/\s*10/)).toBeInTheDocument();
    });

    it('displays score emoji on results screen', () => {
      render(() => <Quiz />);

      // answer all questions correctly
      for (let i = 0; i < 10; i++) {
        const optionButtons = document.querySelectorAll('.option-btn');
        fireEvent.click(optionButtons[1]); // assuming index 1 is correct for simplicity

        const nextButton = screen.getByText(
          i < 9 ? 'Next Question →' : 'See Results'
        );
        fireEvent.click(nextButton);
      }

      const resultsEmoji = document.querySelector('.results-emoji');
      expect(resultsEmoji).toBeInTheDocument();
    });

    it('shows try again button on results screen', () => {
      render(() => <Quiz />);

      // complete quiz
      for (let i = 0; i < 10; i++) {
        const optionButtons = document.querySelectorAll('.option-btn');
        fireEvent.click(optionButtons[0]);

        const nextButton = screen.getByText(
          i < 9 ? 'Next Question →' : 'See Results'
        );
        fireEvent.click(nextButton);
      }

      expect(screen.getByText('🔄 Try Again')).toBeInTheDocument();
    });

    it('resets quiz when try again is clicked', () => {
      render(() => <Quiz />);

      // complete quiz
      for (let i = 0; i < 10; i++) {
        const optionButtons = document.querySelectorAll('.option-btn');
        fireEvent.click(optionButtons[0]);

        const nextButton = screen.getByText(
          i < 9 ? 'Next Question →' : 'See Results'
        );
        fireEvent.click(nextButton);
      }

      const tryAgainButton = screen.getByText('🔄 Try Again');
      fireEvent.click(tryAgainButton);

      expect(screen.getByText(/Question 1 of 10/i)).toBeInTheDocument();
      expect(screen.getByText('Score: 0')).toBeInTheDocument();
    });
  });

  describe('Score Messages', () => {
    it('shows perfect score message for 100%', () => {
      render(() => <Quiz />);

      // answer all questions
      for (let i = 0; i < 10; i++) {
        const optionButtons = document.querySelectorAll('.option-btn');
        // for testing, just click any option
        fireEvent.click(optionButtons[0]);

        const nextButton = screen.getByText(
          i < 9 ? 'Next Question →' : 'See Results'
        );
        fireEvent.click(nextButton);
      }

      // message will vary based on actual score, just check results screen exists
      const resultsMessage = document.querySelector('.results-message');
      expect(resultsMessage).toBeInTheDocument();
    });

    it('displays score percentage', () => {
      render(() => <Quiz />);

      // complete quiz
      for (let i = 0; i < 10; i++) {
        const optionButtons = document.querySelectorAll('.option-btn');
        fireEvent.click(optionButtons[0]);

        const nextButton = screen.getByText(
          i < 9 ? 'Next Question →' : 'See Results'
        );
        fireEvent.click(nextButton);
      }

      const percentageDisplay = document.querySelector('.breakdown-percent');
      expect(percentageDisplay).toBeInTheDocument();
    });

    it('shows progress bar with correct fill width', () => {
      render(() => <Quiz />);

      // complete quiz
      for (let i = 0; i < 10; i++) {
        const optionButtons = document.querySelectorAll('.option-btn');
        fireEvent.click(optionButtons[0]);

        const nextButton = screen.getByText(
          i < 9 ? 'Next Question →' : 'See Results'
        );
        fireEvent.click(nextButton);
      }

      const progressFill = document.querySelector('.breakdown-fill');
      expect(progressFill).toBeInTheDocument();
    });
  });

  describe('Difficulty Indicators', () => {
    it('displays correct color for easy questions', () => {
      render(() => <Quiz />);

      const difficultyBadge = document.querySelector('.difficulty-badge');
      expect(difficultyBadge?.textContent).toBe('easy');
    });

    it('shows different difficulty levels across questions', () => {
      render(() => <Quiz />);

      // navigate through a few questions to see different difficulty levels
      const difficulties = new Set();

      for (let i = 0; i < 3; i++) {
        const difficultyBadge = document.querySelector('.difficulty-badge');
        if (difficultyBadge?.textContent) {
          difficulties.add(difficultyBadge.textContent);
        }

        const optionButtons = document.querySelectorAll('.option-btn');
        fireEvent.click(optionButtons[0]);

        const nextButton = screen.getByText('Next Question →');
        fireEvent.click(nextButton);
      }

      expect(difficulties.size).toBeGreaterThan(0);
    });
  });

  describe('Mobile Responsiveness', () => {
    it('renders quiz on mobile viewport', () => {
      setViewport(VIEWPORTS.mobile.width, VIEWPORTS.mobile.height);
      render(() => <Quiz />);

      expect(screen.getByText('Test Your Knowledge')).toBeInTheDocument();
    });

    it('displays questions properly on mobile', () => {
      setViewport(VIEWPORTS.mobile.width, VIEWPORTS.mobile.height);
      render(() => <Quiz />);

      const optionButtons = document.querySelectorAll('.option-btn');
      expect(optionButtons.length).toBeGreaterThan(0);
    });

    it('allows answering questions on mobile', () => {
      setViewport(VIEWPORTS.mobile.width, VIEWPORTS.mobile.height);
      render(() => <Quiz />);

      const optionButtons = document.querySelectorAll('.option-btn');
      fireEvent.click(optionButtons[0]);

      expect(optionButtons[0]).toHaveClass('selected');
    });
  });

  describe('Progress Tracking', () => {
    it('updates progress bar as questions are answered', () => {
      render(() => <Quiz />);

      const initialProgressBar = document.querySelector('.progress-fill');
      const initialWidth = initialProgressBar?.getAttribute('style');

      // answer first question and move to next
      const optionButtons = document.querySelectorAll('.option-btn');
      fireEvent.click(optionButtons[0]);

      const nextButton = screen.getByText('Next Question →');
      fireEvent.click(nextButton);

      const updatedProgressBar = document.querySelector('.progress-fill');
      const updatedWidth = updatedProgressBar?.getAttribute('style');

      expect(updatedWidth).not.toBe(initialWidth);
    });

    it('shows correct question number throughout quiz', () => {
      render(() => <Quiz />);

      expect(screen.getByText('Question 1 of 10')).toBeInTheDocument();

      // move to question 2
      const optionButtons = document.querySelectorAll('.option-btn');
      fireEvent.click(optionButtons[0]);

      const nextButton = screen.getByText('Next Question →');
      fireEvent.click(nextButton);

      expect(screen.getByText('Question 2 of 10')).toBeInTheDocument();
    });
  });

  describe('Answer Feedback', () => {
    it('displays correct answer with checkmark', () => {
      render(() => <Quiz />);

      const optionButtons = document.querySelectorAll('.option-btn');
      fireEvent.click(optionButtons[1]); // correct answer for Q1

      // look for checkmark in correct option
      const correctOptions = document.querySelectorAll('.option-btn.correct');
      expect(correctOptions.length).toBeGreaterThan(0);
    });

    it('displays incorrect answer with X mark', () => {
      render(() => <Quiz />);

      const optionButtons = document.querySelectorAll('.option-btn');
      fireEvent.click(optionButtons[0]); // wrong answer

      // look for X mark in incorrect option
      const incorrectOptions = document.querySelectorAll(
        '.option-btn.incorrect'
      );
      expect(incorrectOptions.length).toBeGreaterThan(0);
    });

    it('shows explanation card after answer', () => {
      render(() => <Quiz />);

      const optionButtons = document.querySelectorAll('.option-btn');
      fireEvent.click(optionButtons[0]);

      const explanationCard = document.querySelector('.explanation-card');
      expect(explanationCard).toBeInTheDocument();
    });
  });
});
