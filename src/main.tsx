import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';

import { AuthProvider } from '~/components/AuthProvider';
import { router } from '~/routes';

import '@fontsource/figtree/300-italic.css';
import '@fontsource/figtree/300.css';
import '@fontsource/figtree/400-italic.css';
import '@fontsource/figtree/400.css';
import '@fontsource/figtree/500-italic.css';
import '@fontsource/figtree/500.css';
import '~/style/index.scss';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>,
);