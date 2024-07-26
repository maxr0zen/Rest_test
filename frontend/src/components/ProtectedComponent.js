// src/components/ProtectedComponent.js
import React, { useEffect, useState } from 'react';
import api from '../api';
import '../styles/ProtectedComponent.css'; // Импортируем стили

const ProtectedComponent = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get('/protected-endpoint/');
        setData(response.data);
      } catch (error) {
        setError('Failed to fetch data!');
        console.error(error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="container">
      <h2>Protected Data</h2>
      {error && <p>{error}</p>}
      {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
    </div>
  );
};

export default ProtectedComponent;
