  // src/components/UserId.js
  import React, { useState, useEffect } from 'react';
  import axios from 'axios';

  const UserId = () => {
    const [userId, setUserId] = useState(null);
    const [message, setMessage] = useState('');

    useEffect(() => {
      const fetchUserId = async () => {
        try {
          const token = localStorage.getItem('token');
          alert(token)
          if (!token) {
            setMessage('You are not logged in');
            return;
          }

          const response = await axios.get('http://localhost:8000/user-id/', {
            headers: {
              'Authorization': `Token ${token}`
            }
          });
          setUserId(response.data.user_id);
        } catch (error) {
          setMessage('You are not logged in');
          console.error(error);
        }
      };

      fetchUserId();
    }, []);

    return (
      <div>
        {userId ? <p>Your user ID is: {userId}</p> : <p>{message}</p>}
      </div>
    );
  };

  export default UserId;
