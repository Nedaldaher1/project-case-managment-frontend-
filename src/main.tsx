import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './context/userContext';
import { QueryClientProvider } from 'react-query';
import queryClient from '@/services/queryClient';
import { Toaster } from 'react-hot-toast';
import { AbilityProvider } from '@/context/AbilityContext';
import ReduxProvider from './context/darkModeProvider';
import '@/index.css';
import App from '@/app';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ReduxProvider>
      <QueryClientProvider client={queryClient}>
        <Router>
          <AuthProvider>
            <AbilityProvider >
              <Toaster />
              <App />
            </AbilityProvider>
          </AuthProvider>
        </Router>
      </QueryClientProvider>
    </ReduxProvider>
  </StrictMode>
);