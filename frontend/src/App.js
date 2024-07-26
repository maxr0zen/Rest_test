// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import ProtectedComponent from './components/ProtectedComponent';
import UserId from './components/UserId';
import Logout from './components/Logout';
import ArticleList from './components/ArticleList';
import ArticleDetail from './components/ArticleDetail';
import ArticleCreate from './components/ArticleCreate';
import ArticleEdit from './components/ArticleEdit';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/protected" element={<ProtectedComponent />} />
        <Route path="/user-id" element={<UserId />} />
        <Route path="/" element={<ArticleList />} />
        <Route path="/articles/:id" element={<ArticleDetail />} />
        <Route
          path="/articles/create"
          element={
            <PrivateRoute>
              <ArticleCreate />
            </PrivateRoute>
          }
        />
        <Route
          path="/articles/:id/edit"
          element={
            <PrivateRoute>
              <ArticleEdit />
            </PrivateRoute>
          }
        />
        <Route path="/logout" element={<Logout />} />
      </Routes>
    </Router>
  );
}

export default App;
