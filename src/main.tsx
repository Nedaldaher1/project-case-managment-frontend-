import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom'; // استيراد Router
import { AuthProvider } from './context/userContext';
import { QueryClientProvider } from 'react-query';
import queryClient from '@/services/queryClient'; // استيراد queryClient
import { Toaster } from 'react-hot-toast';

import '@/index.css';
import App from '@/app';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <Router> {/* إضافة Router هنا */}
        <AuthProvider>
          <Toaster />
          <App />
        </AuthProvider>
      </Router>
    </QueryClientProvider>
  </StrictMode>
);

