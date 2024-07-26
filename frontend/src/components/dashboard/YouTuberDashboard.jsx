import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import axiosInstance from '../../utils/AxiosInstance';
import { Link, Navigate } from 'react-router-dom';

function YouTuberDashboard() {
  const [videos, setVideos] = useState([]);
  const [error, setError] = useState('');
  const { user, loading } = useContext(AuthContext);
  const [loading2 , setLoading2] = useState(false);

  useEffect(() => {
    if (loading) {
      return <div>Loading...</div>;
    }
  
    if (!user || user.role !== 'YouTuber') {
      return <Navigate to="/login-youtuber" />;
    }else {
      fetchPendingVideos();
    }
  }, [user,loading]);

  const fetchPendingVideos = async () => {
    setLoading2(true);
    try {
      const response = await axiosInstance.get('/vdo/videos/pending');
      setVideos(response.data);
    } catch (error) {
      console.error('Error fetching pending videos:', error);
      setError('Error fetching pending videos');
    } finally {
      setLoading2(false);
    }
  };

  const handleApprove = async (id) => {
    setLoading2(true);
    try {
      await axiosInstance.put(`/vdo/video/${id}`, { status: 'Approved' }, { withCredentials: true });
      setVideos(videos.filter(video => video._id !== id));
    } catch (error) {
      console.error('Error approving video:', error);
      setError('Error approving video');
    } finally {
      setLoading2(false);
    }
  };

  const handleReject = async (id) => {
    setLoading2(true);
    try {
      await axiosInstance.put(`/vdo/video/${id}`, { status: 'Rejected' }, { withCredentials: true });
      setVideos(videos.filter(video => video._id !== id));
    } catch (error) {
      console.error('Error rejecting video:', error);
      setError('Error rejecting video');
    } finally {
      setLoading2(false);
    }
  };

  return (
    <div className="p-4">
      <Link to={'invite-editor'} className="bg-gray-800 text-white hover:text-gray-200 px-3 py-2 rounded">Invite Editor</Link>
      <div className="my-4 h-0.5 w-full bg-black"></div>
      <h1 className="text-2xl mb-4">Pending Videos</h1>
      {loading2 ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : videos.length === 0 ? (
        <p>No pending videos</p>
      ) : (
        videos.map(video => (
          <div key={video._id} className="mb-4 p-4 border rounded">
            <h2 className="text-xl mb-2">{video.title}</h2>
            <p className="mb-2">{video.description}</p>
            <button className="btn mr-2" onClick={() => handleApprove(video._id)}>Approve</button>
            <button className="btn bg-red-600 hover:bg-red-700" onClick={() => handleReject(video._id)}>Reject</button>
          </div>
        ))
      )}
    </div>
  );
}

export default YouTuberDashboard;
