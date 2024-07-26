// src/components/ArticleEdit.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/ArticleEdit.css'

function ArticleEdit() {
  const { id } = useParams();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/articles/${id}/`);
        setTitle(response.data.title);
        setContent(response.data.content);
      } catch (error) {
        console.error('Error fetching article', error);
      }
    };

    fetchArticle();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:8000/articles/${id}/edit/`, { title, content }, {
        headers: { 'Authorization': `Token ${localStorage.getItem('token')}` }
      });
      navigate(`/articles/${id}`);
    } catch (error) {
      console.error('Error updating article', error);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:8000/articles/${id}/delete/`, {
        headers: { 'Authorization': `Token ${localStorage.getItem('token')}` }
      });
      navigate('/'); // Redirect после успешного удаления
    } catch (error) {
      console.error('Error deleting article', error);
    }
  };

  return (
    <div>
      <h1>Edit Article</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>
        <div>
          <label>Content</label>
          <textarea value={content} onChange={(e) => setContent(e.target.value)} required />
        </div>
        <button type="submit">Update</button>
        <button type="button" onClick={handleDelete}>Delete</button>
      </form>
    </div>
  );
}

export default ArticleEdit;
