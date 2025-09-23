import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { useServiceWorker } from './hooks/useServiceWorker';

// Composant principal avec Service Worker
const AppWithServiceWorker = () => {
  useServiceWorker();
  return <App />;
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppWithServiceWorker />
  </StrictMode>
);
