// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client'; // Импортируйте `react-dom/client`
import './index.css';
import App from './App';
import { UserProvider } from './contexts/UserContext'; // Убедитесь, что импорт правильный

const root = ReactDOM.createRoot(document.getElementById('root')); // Создайте корневой элемент
root.render(
  <React.StrictMode>
    <UserProvider>
      <App />
    </UserProvider>
  </React.StrictMode>
);
