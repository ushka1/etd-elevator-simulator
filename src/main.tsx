import React from 'react';
import ReactDOM from 'react-dom/client';

import App from './App.tsx';
import './assets/css/index.css';
import './config/axios';

async function enableMocking() {
  if (process.env.NODE_ENV !== 'development') {
    return;
  }

  const { worker } = await import('./mocks/browser');
  return worker.start({
    onUnhandledRequest: 'bypass',
  });
}

enableMocking().then(() => {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
});

console.log(import.meta.env.VITE_MY_ENV);
