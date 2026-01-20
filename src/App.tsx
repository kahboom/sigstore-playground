import { Component, createSignal, Show } from 'solid-js';
import { Header } from './components/Header';
import { SigningJourney } from './components/SigningJourney';
import { ComponentExplorer } from './components/ComponentExplorer';
import { Quiz } from './components/Quiz';
import { Footer } from './components/Footer';

type View = 'journey' | 'explorer' | 'quiz';

const App: Component = () => {
  const [currentView, setCurrentView] = createSignal<View>('journey');

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
        <Show when={currentView() === 'journey'}>
          <SigningJourney />
        </Show>
        <Show when={currentView() === 'explorer'}>
          <ComponentExplorer />
        </Show>
        <Show when={currentView() === 'quiz'}>
          <Quiz />
        </Show>
      </main>
      
      <Footer />
    </div>
  );
};

export default App;
