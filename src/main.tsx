import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';

import { AuthProvider } from '~/components/AuthProvider';
import { router } from '~/routes';

import '@fontsource/jost/400.css'; // Normal
import '@fontsource/jost/500.css'; // Medium
import '@fontsource/jost/600.css'; // Semi-Bold
import '@fontsource/jost/700.css'; // Bold
import '@fontsource/libre-caslon-text/400.css'; // Normal
import '@fontsource/libre-caslon-text/700.css'; // Bold
import '~/style/index.scss';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>,
);