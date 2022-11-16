import React from 'react';
import { createRoot } from 'react-dom/client';

const App = () => <div>works</div>;

createRoot(document.getElementById('root') as HTMLElement).render(<App />);
