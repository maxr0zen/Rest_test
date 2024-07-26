// src/api.js
import axios from 'axios';
import './App.css'

const api = axios.create({
  baseURL: 'http://localhost:8000/',
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Token ${token}`;
  }
  return config;
}, error => {
  return Promise.reject(error);
});

export default api;
