/**
 * Application entry point. Wires global providers around the App:
 *   ToastProvider → WalletProvider (wallet needs toast for notifications).
 */
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from '@/App';
import { ToastProvider } from '@/context/ToastContext';
import { WalletProvider } from '@/context/WalletContext';
import { Analytics } from '@vercel/analytics/react';
import '@/index.css';

const rootEl = document.getElementById('root');
if (!rootEl) throw new Error('Root element #root not found');

createRoot(rootEl).render(
  <StrictMode>
    <ToastProvider>
      <WalletProvider>
        <App />
        <Analytics />
      </WalletProvider>
    </ToastProvider>
  </StrictMode>
);
