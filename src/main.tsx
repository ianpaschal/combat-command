import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { ConvexAuthProvider } from '@convex-dev/auth/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ConvexReactClient } from 'convex/react';
import { registerLocale } from 'i18n-iso-countries';
import countriesEn from 'i18n-iso-countries/langs/en.json';

import { AuthProvider } from '~/components/AuthProvider';
import { ThemeProvider } from '~/components/ThemeProvider';
import { ToastProvider } from '~/components/ToastProvider';
import { router } from '~/routes';

import '@fontsource/figtree/300.css';
import '@fontsource/figtree/400.css';
import '@fontsource/figtree/500.css';
import '@fontsource/figtree/600.css';
import '@fontsource/figtree/700.css';
import '~/style/index.scss';

registerLocale(countriesEn);

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL as string);

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ConvexAuthProvider client={convex}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <ToastProvider>
            <AuthProvider>
              <RouterProvider router={router} future={{ v7_startTransition: true }} />
            </AuthProvider>
          </ToastProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </ConvexAuthProvider>
  </React.StrictMode>,
);
