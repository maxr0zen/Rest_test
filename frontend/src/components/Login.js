// src/components/Login.js
import React, { useState } from 'react';
import axios from 'axios';
import '../styles/Login.css';
import {useNavigate} from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate(); // Хук для навигации

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/login/', { email, password });
      const { token } = response.data;
      localStorage.setItem('token', token); // Сохраняем токен в localStorage
      setMessage('Login successful!');
      navigate('/'); // Перенаправляем на главную страницу после успешного входа
    } catch (error) {
      setMessage('Login failed!');
      console.error('Login error:', error.response.data);
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label>Email:</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div>
          <label>Password:</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <button type="submit">Login</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default Login;
