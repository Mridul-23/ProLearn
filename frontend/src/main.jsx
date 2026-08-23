import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';

import { AuthProvider } from './context/AuthContext';
import { GeminiKeyProvider } from './context/GeminiKeyContext';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GeminiKeyProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </GeminiKeyProvider>
  </StrictMode>,
);