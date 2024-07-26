// src/components/ArticleCreate.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/ArticleCreate.css'

const ArticleCreate = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleCreate = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    try {
      await axios.post(
        'http://localhost:8000/articles/create/',
        { title, content, is_private: isPrivate }, // Не передаем author
        { headers: { Authorization: `Token ${token}` } }
      );
      setMessage('Article created successfully!');
      navigate('/');  // Перенаправление на домашнюю или другую страницу
    } catch (error) {
      setMessage('Failed to create article');
      console.error('Create article error:', error.response ? error.response.data : error);
    }
  };

  return (
    <div>
      <h2>Create Article</h2>
      <form onSubmit={handleCreate}>
        <div>
          <label>Title:</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>
        <div>
          <label>Content:</label>
          <textarea value={content} onChange={(e) => setContent(e.target.value)} required />
        </div>
        <div>
          <label>
            Private:
            <input type="checkbox" checked={isPrivate} onChange={() => setIsPrivate(!isPrivate)} />
          </label>
        </div>
        <button type="submit">Create Article</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default ArticleCreate;
