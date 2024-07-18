import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const ApproveAction = () => {
  const [message, setMessage] = useState('');
  const location = useLocation();

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const action = query.get('action');
    const videoId = query.get('videoId');

    const handleAction = async () => {
      try {
        const response = await axios.put(`http://localhost:5000/api/videos/${videoId}`, { status: action }, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        setMessage(response.data);
      } catch (error) {
        setMessage('Error updating video status');
        console.error(error);
      }
    };

    if (action && videoId) {
      handleAction();
    } else {
      setMessage('Invalid action or video ID');
    }
  }, [location]);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Approve Action</h2>
      {message && <p>{message}</p>}
    </div>
  );
};

export default ApproveAction;
