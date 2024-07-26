// src/contexts/UserContext.js
import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
          const response = await axios.get('http://localhost:8000/user-id/', {
            headers: {
              'Authorization': `Token ${storedToken}`
            }
          });
          setToken(storedToken);
          setUserId(response.data.user_id);
        }
      } catch (error) {
        console.error('Error fetching user ID', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserId();
  }, []);

  return (
    <UserContext.Provider value={{ token, userId, loading }}>
      {children}
    </UserContext.Provider>
  );
};
