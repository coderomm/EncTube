import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const ApproveVideos = () => {
  const [videos, setVideos] = useState([]);
  const [message, setMessage] = useState('');
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchPendingVideos = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/videos/pending', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        setVideos(response.data);
      } catch (error) {
        setMessage('Error fetching videos');
        console.error(error);
      }
    };
    fetchPendingVideos();
  }, []);

  const handleAction = async (videoId, status) => {
    try {
      const response = await axios.put(`http://localhost:5000/api/videos/${videoId}`, { status }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setMessage(response.data);
      setVideos(videos.filter(video => video._id !== videoId));
    } catch (error) {
      setMessage('Error updating video status');
      console.error(error);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Approve Videos</h2>
      {message && <p>{message}</p>}
      {videos.map(video => (
        <div key={video._id} className="mb-4 p-4 border">
          <h3 className="text-xl font-bold">{video.title}</h3>
          <p>{video.description}</p>
          <button
            onClick={() => handleAction(video._id, 'Approved')}
            className="bg-green-500 text-white p-2 rounded mr-2"
          >
            Approve
          </button>
          <button
            onClick={() => handleAction(video._id, 'Rejected')}
            className="bg-red-500 text-white p-2 rounded mr-2"
          >
            Reject
          </button>
          <button
            onClick={() => handleAction(video._id, 'Hold')}
            className="bg-yellow-500 text-white p-2 rounded"
          >
            Hold
          </button>
        </div>
      ))}
    </div>
  );
};

export default ApproveVideos;