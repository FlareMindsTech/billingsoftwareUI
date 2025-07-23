import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

import AppRoutes from './Routes/AppRoutes';
import { AuthProvider } from './context/Authcontext';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  </React.StrictMode>
);
