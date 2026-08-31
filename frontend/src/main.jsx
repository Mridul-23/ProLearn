import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';

import { AuthProvider } from './context/AuthContext';
import { GeminiKeyProvider } from './context/GeminiKeyContext';
import { ChatProvider } from './context/ChatContext.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GeminiKeyProvider>
      <ChatProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </ChatProvider>
    </GeminiKeyProvider>
  </StrictMode>,
);
