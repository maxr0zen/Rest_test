// src/components/ArticleDetail.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link, useNavigate } from 'react-router-dom';
import '../styles/ArticleDetail.css';

function ArticleDetail() {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [userId, setUserId] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('You need to be logged in to view this page.');
          return;
        }

        // Fetch article details
        const response = await axios.get(`http://localhost:8000/articles/${id}/`, {
          headers: { 'Authorization': `Token ${token}` }
        });
        setArticle(response.data);

        // Fetch current user ID
        const userResponse = await axios.get('http://localhost:8000/user-id/', {
          headers: { 'Authorization': `Token ${token}` }
        });
        setUserId(userResponse.data.user_id);
      } catch (error) {
        setError('Error fetching article');
        console.error('Error fetching article', error);
      }
    };

    fetchArticle();
  }, [id]);

  if (error) return <div>{error}</div>;
  if (!article) return <div>Loading...</div>;

  const handleBackToList = () => {
    navigate('/');
  };

  return (
    <div>
      <h1>{article.title}</h1>
      <p>{article.content}</p>
      <p>{article.is_private ? 'Private' : 'Public'}</p>
      {article.author === userId && (
        <Link to={`/articles/${id}/edit`} className="edit-button">Edit</Link>
      )}
      <button onClick={handleBackToList} className="back-button">Back to List</button>
    </div>
  );
}

export default ArticleDetail;
