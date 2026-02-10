import { Component, createSignal, Show } from 'solid-js';
import './Feedback.css';

interface FeedbackProps {
  onSuccess?: () => void;
}

export const Feedback: Component<FeedbackProps> = props => {
  const [name, setName] = createSignal<string>('');
  const [email, setEmail] = createSignal<string>('');
  const [helpfulness, setHelpfulness] = createSignal<string>('');
  const [reason, setReason] = createSignal<string>('');
  const [comment, setComment] = createSignal<string>('');
  const [isSubmitting, setIsSubmitting] = createSignal(false);
  const [error, setError] = createSignal<string>('');

  const handleSubmit = async (e: Event) => {
    e.preventDefault();

    if (!name()) {
      setError('Please enter your name');
      return;
    }

    if (!email()) {
      setError('Please enter your email');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email())) {
      setError('Please enter a valid email address');
      return;
    }

    if (!helpfulness()) {
      setError('Please select whether this was helpful');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('form-name', 'feedback');
      formData.append('name', name());
      formData.append('email', email());
      formData.append('helpfulness', helpfulness());
      formData.append('reason', reason());
      formData.append('comment', comment());

      const response = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(
          formData as unknown as Record<string, string>
        ).toString(),
      });

      // Check if the response is actually a successful form submission
      // For Netlify Forms, a successful submission should not return HTML
      const contentType = response.headers.get('content-type');
      const isHtmlResponse = contentType?.includes('text/html');

      if (response.ok && !isHtmlResponse) {
        // Clear form
        setName('');
        setEmail('');
        setHelpfulness('');
        setReason('');
        setComment('');

        // Call success callback (will close modal)
        props.onSuccess?.();
      } else {
        setError(
          'Form submission is not properly configured. Please contact support.'
        );
      }
    } catch {
      setError('Failed to submit feedback. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div class="feedback">
      <div class="feedback-header">
        <h1 class="feedback-title" id="feedback-modal-title">
          <span class="text-gradient">Share Your Feedback</span>
        </h1>
        <p class="feedback-subtitle">
          Help us improve this learning experience by sharing your thoughts
        </p>
      </div>

      <form
        name="feedback"
        method="POST"
        data-netlify="true"
        netlify-honeypot="bot-field"
        onSubmit={handleSubmit}
        class="feedback-form"
      >
        <input type="hidden" name="form-name" value="feedback" />
        <p style={{ display: 'none' }}>
          <label>
            Don't fill this out if you're human: <input name="bot-field" />
          </label>
        </p>

        {/* Name Field */}
        <div class="form-group">
          <label class="form-label" for="name">
            Name
            <span class="required">*</span>
          </label>
          <input
            id="name"
            name="name"
            type="text"
            class="form-input"
            placeholder="Your name"
            value={name()}
            onInput={e => setName(e.currentTarget.value)}
          />
        </div>

        {/* Email Field */}
        <div class="form-group">
          <label class="form-label" for="email">
            Email
            <span class="required">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            class="form-input"
            placeholder="your.email@example.com"
            value={email()}
            onInput={e => setEmail(e.currentTarget.value)}
          />
        </div>

        {/* Question 1: Helpfulness */}
        <div class="form-group">
          <label class="form-label">
            Did you find this playground helpful?
            <span class="required">*</span>
          </label>
          <div class="radio-group">
            <label class="radio-option">
              <input
                type="radio"
                name="helpfulness"
                value="yes"
                checked={helpfulness() === 'yes'}
                onChange={() => setHelpfulness('yes')}
              />
              <span class="radio-label">Yes, very helpful!</span>
            </label>
            <label class="radio-option">
              <input
                type="radio"
                name="helpfulness"
                value="somewhat"
                checked={helpfulness() === 'somewhat'}
                onChange={() => setHelpfulness('somewhat')}
              />
              <span class="radio-label">Somewhat helpful</span>
            </label>
            <label class="radio-option">
              <input
                type="radio"
                name="helpfulness"
                value="no"
                checked={helpfulness() === 'no'}
                onChange={() => setHelpfulness('no')}
              />
              <span class="radio-label">Not really</span>
            </label>
          </div>
        </div>

        {/* Question 2: Reason for Learning */}
        <div class="form-group">
          <label class="form-label" for="reason">
            Why are you learning about Sigstore?
            <span class="optional">(optional)</span>
          </label>
          <textarea
            id="reason"
            name="reason"
            class="form-textarea"
            placeholder="e.g., For my job, personal project, security research, curiosity..."
            value={reason()}
            onInput={e => setReason(e.currentTarget.value)}
            rows={3}
          />
        </div>

        {/* Additional Comments */}
        <div class="form-group">
          <label class="form-label" for="comment">
            Additional Comments
            <span class="optional">(optional)</span>
          </label>
          <textarea
            id="comment"
            name="comment"
            class="form-textarea"
            placeholder="Any other feedback or suggestions..."
            value={comment()}
            onInput={e => setComment(e.currentTarget.value)}
            rows={4}
          />
        </div>

        <Show when={error()}>
          <div class="error-message">{error()}</div>
        </Show>

        <button
          type="submit"
          class="btn btn-primary submit-btn"
          disabled={isSubmitting()}
        >
          {isSubmitting() ? 'Submitting...' : 'Submit Feedback'}
        </button>
      </form>
    </div>
  );
};

export default Feedback;
