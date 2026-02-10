import {
  Component,
  Show,
  JSX,
  onCleanup,
  createEffect,
} from 'solid-js';
import { Portal } from 'solid-js/web';
import { Motion, Presence } from 'solid-motionone';
import './FeedbackModal.css';

interface FeedbackModalProps {
  show: boolean;
  onClose: () => void;
  children: JSX.Element;
}

export const FeedbackModal: Component<FeedbackModalProps> = props => {
  let modalRef: HTMLDivElement | undefined;
  let previousActiveElement: HTMLElement | null = null;

  // Handle ESC key
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && props.show) {
      props.onClose();
    }
  };

  // Handle click outside
  const handleBackdropClick = (e: MouseEvent) => {
    if (e.target === e.currentTarget) {
      props.onClose();
    }
  };

  // Focus management
  createEffect(() => {
    if (props.show) {
      // Store currently focused element
      previousActiveElement = document.activeElement as HTMLElement;

      // Focus first input in modal after a brief delay for animation
      setTimeout(() => {
        const firstInput = modalRef?.querySelector(
          'input, textarea, button'
        ) as HTMLElement;
        firstInput?.focus();
      }, 100);

      // Add event listeners
      document.addEventListener('keydown', handleKeyDown);

      // Prevent body scroll
      document.body.style.overflow = 'hidden';
    } else {
      // Restore focus
      previousActiveElement?.focus();

      // Remove event listeners
      document.removeEventListener('keydown', handleKeyDown);

      // Restore body scroll
      document.body.style.overflow = '';
    }
  });

  onCleanup(() => {
    document.removeEventListener('keydown', handleKeyDown);
    document.body.style.overflow = '';
  });

  return (
    <Portal>
      <Presence>
        <Show when={props.show}>
          <Motion.div
            class="modal-backdrop"
            onClick={handleBackdropClick}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="feedback-modal-title"
          >
            <Motion.div
              ref={modalRef}
              class="modal-container"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={(e: MouseEvent) => e.stopPropagation()}
            >
              <div class="modal-card">
                <button
                  class="modal-close"
                  onClick={() => props.onClose()}
                  aria-label="Close feedback modal"
                  type="button"
                >
                  ✕
                </button>
                <div class="modal-content">{props.children}</div>
              </div>
            </Motion.div>
          </Motion.div>
        </Show>
      </Presence>
    </Portal>
  );
};
