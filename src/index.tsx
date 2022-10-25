import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.scss';
import App from './components/App';
import reportWebVitals from './reportWebVitals';
import {ErrorProvider} from "./contexts/Error.context";

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <ErrorProvider>
    <App />
  </ErrorProvider>
);

reportWebVitals();
