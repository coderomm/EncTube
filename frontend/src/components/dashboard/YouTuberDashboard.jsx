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
    <div className="my-8 container mx-auto px-4 md:px-0">
      {error && <p className="bg-white p-4 rounded-lg shadow-md mb-4 text-red-600">{error}</p>}
      {message && <p className="bg-white p-4 rounded-lg shadow-md mb-4 text-green-600">{message}</p>}
      <div className="bg-white p-4 rounded-lg drop-shadow-2xl mb-4 flex items-center justify-between flex-wrap">
        <h2 className="text-2xl font-bold mb-2 flex items-center justify-start gap-2"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
        </svg> {user.channelName} | <span className='text-xl text-sky-500'>{user.channelUrl}</span>
        </h2>
        <Link to={'invite-editor'} className="bg-gray-800 text-white hover:text-gray-200 px-3 py-2 rounded  flex items-center justify-start gap-2">Invite Editor <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z" />
        </svg>
        </Link>
      </div>

      <div className="bg-white p-4 rounded-lg drop-shadow-2xl">
        <h2 className="text-2xl font-bold mb-4">Pending Videos: {videos.length}</h2>
        <hr className="border-black border-1 mb-4"></hr>
        {fetching ? (
          <p>Loading...</p>
        ) : (
          videos.map(video => (
            <div key={video._id} className="bg-white p-4 rounded-lg drop-shadow-2xl mb-4">
              <h3 className="text-xl font-bold">{video.title}</h3>
              <p className='mb-3'>{video.description}</p>
              <button
                className={`btn text-white py-1 px-3 rounded bg-green-500 hover:bg-green-600 mr-2 ${processing ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={() => handleApprove(video._id)}
                disabled={processing}
              >
                Approve
              </button>
              <button
                className={`btn text-white py-1 px-3 rounded bg-red-500 hover:bg-red-600 ${processing ? 'opacity-50 cursor-not-allowed' : ''}`}
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
