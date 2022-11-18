import React from 'react';
import { createRoot } from 'react-dom/client';
import { ToastContainer } from 'react-toastify';
import { AppContainer } from '@/todolist/containers/app.container';
import 'react-toastify/dist/ReactToastify.css';
import './style.css';

const App = AppContainer({});

export const run = () => {
  createRoot(document.getElementById('root') as HTMLElement).render(
    <>
      <ToastContainer theme="dark" />
      <App />
    </>,
  );
};
