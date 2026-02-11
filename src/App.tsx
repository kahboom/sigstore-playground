import { Component, createSignal, Show, lazy, Suspense } from 'solid-js';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { LoadingSkeleton } from './components/LoadingSkeleton';
import { FeedbackButton } from './components/FeedbackButton';
import { FeedbackModal } from './components/FeedbackModal';
import { Feedback } from './components/Feedback';

const SigningJourney = lazy(() => import('./components/SigningJourney'));
const ComponentExplorer = lazy(() => import('./components/ComponentExplorer'));
const Quiz = lazy(() => import('./components/Quiz'));
const AdvancedConcepts = lazy(() => import('./components/AdvancedConcepts'));

type View = 'journey' | 'explorer' | 'quiz' | 'advanced';

const App: Component = () => {
  const [currentView, setCurrentView] = createSignal<View>('journey');
  const [showFeedbackModal, setShowFeedbackModal] = createSignal(false);

  const handleFeedbackSuccess = () => {
    setShowFeedbackModal(false);
  };

  return (
    <div class="app">
      <div class="background-effects">
        <div class="gradient-orb orb-1" />
        <div class="gradient-orb orb-2" />
        <div class="gradient-orb orb-3" />
        <div class="grid-overlay" />
      </div>

      <Header currentView={currentView()} onViewChange={setCurrentView} />

      <main class="main-content">
        <Suspense fallback={<LoadingSkeleton />}>
          <Show when={currentView() === 'journey'}>
            <SigningJourney />
          </Show>
          <Show when={currentView() === 'explorer'}>
            <ComponentExplorer />
          </Show>
          <Show when={currentView() === 'quiz'}>
            <Quiz />
          </Show>
          <Show when={currentView() === 'advanced'}>
            <AdvancedConcepts />
          </Show>
        </Suspense>
      </main>

      <Footer onFeedbackClick={() => setShowFeedbackModal(true)} />

      <FeedbackButton onClick={() => setShowFeedbackModal(true)} />

      <FeedbackModal
        show={showFeedbackModal()}
        onClose={() => setShowFeedbackModal(false)}
      >
        <Feedback onSuccess={handleFeedbackSuccess} />
      </FeedbackModal>
    </div>
  );
};

export default App;
