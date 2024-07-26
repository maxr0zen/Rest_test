// src/components/Logout.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Logout() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        await axios.post('http://localhost:8000/logout/', {}, {
          headers: { 'Authorization': `Token ${token}` }
        });
        // Удалите токен из localStorage
        localStorage.removeItem('token');
      }
      // Перенаправление на главную страницу
      navigate('/');
    } catch (error) {
      console.error('Error logging out', error);
    }
  };

  React.useEffect(() => {
    handleLogout();
  }, []);

  return (
    <div>
      <h1>Logging out...</h1>
    </div>
  );
}

export default Logout;
