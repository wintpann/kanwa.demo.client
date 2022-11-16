import React from 'react';
import { createRoot } from 'react-dom/client';
import { work } from '@/app';

const App = () => <div>{work}</div>;

createRoot(document.getElementById('root') as HTMLElement).render(<App />);
