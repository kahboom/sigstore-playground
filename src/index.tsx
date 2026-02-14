/* @refresh reload */
import { render } from 'solid-js/web';
import App from './App';
import './styles/global.css';

// Update document title for development mode
if (import.meta.env.DEV) {
  document.title = '[DEV] Sigstore Playground';
}

const root = document.getElementById('root');

if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
  throw new Error('Root element not found.');
}

render(() => <App />, root!);
