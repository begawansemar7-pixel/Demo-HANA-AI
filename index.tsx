import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { LanguageProvider } from './contexts/LanguageContext';
import { AuthProvider } from './contexts/AuthContext';
import { BasketProvider } from './contexts/BasketContext';
import { SearchProvider } from './contexts/SearchContext';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <LanguageProvider>
      <AuthProvider>
        <BasketProvider>
          <SearchProvider>
            <App />
          </SearchProvider>
        </BasketProvider>
      </AuthProvider>
    </LanguageProvider>
  </React.StrictMode>
);