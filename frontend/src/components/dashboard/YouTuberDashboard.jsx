import { useState, useEffect, useContext, useCallback } from 'react';
import { AuthContext } from '../../context/AuthContext';
import axiosInstance from '../../utils/AxiosInstance';
import { Link, Navigate } from 'react-router-dom';

function YouTuberDashboard() {
  const { user, loading } = useContext(AuthContext);
  const [videos, setVideos] = useState([]);
  const [error, setError] = useState('');
  const [processing, setProcessing] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [message, setMessage] = useState('');

  const fetchPendingVideos = useCallback(async () => {
    setFetching(true);
    try {
      const response = await axiosInstance.get(`/video/youtuber/pending`);
      setVideos(response.data);
    } catch (error) {
      console.error('Error fetching pending videos:', error);
      setError('Error fetching pending videos');
    } finally {
      setFetching(false);
    }
  }, []);

  useEffect(() => {
    if (loading) {
      return;
    }

    if (!user || user.role !== 'YouTuber') {
      return <Navigate to="/login-youtuber" />;
    } else {
      fetchPendingVideos();
    }
  }, [user, loading, fetchPendingVideos]);

  const handleApprove = async (id) => {
    setProcessing(true);
    try {
      await axiosInstance.put(`/video/${id}`, { status: 'Approved' }, { withCredentials: true });
      setVideos((prevVideos) => prevVideos.filter(video => video._id !== id));
      setMessage('Video approved successfully');
    } catch (error) {
      console.error('Error approving video:', error);
      setError('Error approving video');
    } finally {
      setProcessing(false);
    }
  };

  const handleReject = async (id) => {
    setProcessing(true);
    try {
      await axiosInstance.put(`/video/${id}`, { status: 'Rejected' }, { withCredentials: true });
      setVideos((prevVideos) => prevVideos.filter(video => video._id !== id));
      setMessage('Video rejected successfully');
    } catch (error) {
      console.error('Error rejecting video:', error);
      setError('Error rejecting video');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="my-8 container mx-auto">
      {error && <p className="bg-white p-4 rounded-lg shadow-md mb-4 text-red-600">{error}</p>}
      {message && <p className="bg-white p-4 rounded-lg shadow-md mb-4 text-green-600">{message}</p>}
      <div className="bg-white p-4 rounded-lg shadow-md mb-4 flex items-center justify-between flex-wrap">
        <h2 className="text-2xl font-bold">{user.channelName} | {user.channelUrl}</h2>
        <Link to={'invite-editor'} className="bg-gray-800 text-white hover:text-gray-200 px-3 py-2 rounded">Invite Editor</Link>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-md mt-4">
        <h1 className="text-2xl mb-4 flex justify-start items-center gap-3">Pending Videos:
          <label className='rounded-full flex items-center justify-center w-8 h-8 bg-sky-500 text-white'>{videos.length}</label>
        </h1>
        {fetching ? (
          <p>Loading...</p>
        ) : (
          videos.map(video => (
            <div key={video._id} className="mb-4 p-4 border rounded">
              <h2 className="text-xl mb-1">Title: {video.title}</h2>
              <p className="mb-2">Description: {video.description}</p>
              <button
                className={`btn py-1 text-white bg-green-500 hover:bg-green-600 mr-2 ${processing ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={() => handleApprove(video._id)}
                disabled={processing}
              >
                Approve
              </button>
              <button
                className={`btn py-1 text-white bg-red-500 hover:bg-red-600 ${processing ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={() => handleReject(video._id)}
                disabled={processing}
              >
                Reject
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default YouTuberDashboard;
