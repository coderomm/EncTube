import { useState, useEffect } from 'react';
import axiosInstance from '../../utils/AxiosInstance';

function YouTuberDashboard() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPendingVideos = async () => {
      try {
        const response = await axiosInstance.get('/video/pending', { withCredentials: true });
        setVideos(response.data);
      } catch (error) {
        console.error('Error fetching pending videos:', error);
        setError('Error fetching pending videos');
      } finally {
        setLoading(false);
      }
    };

    fetchPendingVideos();
  }, []);

  const handleApprove = async (id) => {
    setLoading(true);
    try {
      await axiosInstance.put(`/video/${id}`, { status: 'Approved' }, { withCredentials: true });
      setVideos(videos.filter(video => video._id !== id));
    } catch (error) {
      console.error('Error approving video:', error);
      setError('Error approving video');
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async (id) => {
    setLoading(true);
    try {
      await axiosInstance.put(`/video/${id}`, { status: 'Rejected' }, { withCredentials: true });
      setVideos(videos.filter(video => video._id !== id));
    } catch (error) {
      console.error('Error rejecting video:', error);
      setError('Error rejecting video');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">Pending Videos</h1>
      {loading ? (
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
