import React, { useEffect, useState } from 'react';

const EventsPage = () => {
  const [username, setUsername] = useState('');
  const [role, setRole] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('access'); 
      if (!token) {
        console.error('No access token found');
        return;
      }

      try {
        const response = await fetch('http://127.0.0.1:8000/api/user/me/', {
          headers: {
            'Authorization': `Bearer ${token}`, 
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log("User data response:", data);

        setUsername(data.username);
        setRole(data.role);  
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  return (
    <div>
      <h2>{role === 'admin' ? `Welcome Admin ${username}!` : `Welcome User ${username}!`}</h2>
    </div>
  );
};

export default EventsPage;
