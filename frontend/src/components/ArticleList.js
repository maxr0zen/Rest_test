// src/components/ArticleList.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/ArticleList.css';

function ArticleList() {
  const [articles, setArticles] = useState([]);
  const [userRole, setUserRole] = useState(null);
  const [error, setError] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchArticlesAndUserRole = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          // User is logged in
          setIsLoggedIn(true);

          // Fetch articles
          const articlesResponse = await axios.get('http://localhost:8000/articles/', {
            headers: { 'Authorization': `Token ${token}` }
          });
          setArticles(articlesResponse.data);

          // Fetch current user role
          const userResponse = await axios.get('http://localhost:8000/user-id/', {
            headers: { 'Authorization': `Token ${token}` }
          });
          setUserRole(userResponse.data.role);
        } else {
          // User is not logged in
          setIsLoggedIn(false);
          const publicArticlesResponse = await axios.get('http://localhost:8000/articles/', {
            headers: {}
          });
          setArticles(publicArticlesResponse.data);
        }
      } catch (error) {
        setError('Error fetching articles');
        console.error('Error fetching articles', error);
      }
    };

    fetchArticlesAndUserRole();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    navigate('/');  // Redirect to the home page
  };

  return (
    <div>
      <h1>Article List</h1>
      {error && <p>{error}</p>}
      <ul>
        {articles.map(article => (
          <li key={article.id}>
            <a href={`/articles/${article.id}`}>{article.title}</a>
            <p>{article.content}</p>
            <p>{article.is_private ? 'Private' : 'Public'}</p>
          </li>
        ))}
      </ul>
      {isLoggedIn ? (
        <>
          <button onClick={handleLogout} className="logout-button">Logout</button>
          {userRole === 'author' && (
            <Link to="/articles/create" className="create-button">Create New Article</Link>
          )}
        </>
      ) : (
        <Link to="/login" className="login-button">Login</Link>
      )}
    </div>
  );
}

export default ArticleList;
