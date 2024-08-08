import { useState, useEffect, useContext, useCallback } from 'react';
import { AuthContext } from '../../context/AuthContext';
import axiosInstance from '../../utils/AxiosInstance';
import { Link, Navigate, useNavigate } from 'react-router-dom';

function YouTuberDashboard() {
  const { user, loading } = useContext(AuthContext);
  const [videos, setVideos] = useState([]);
  const [error, setError] = useState('');
  const [fetching, setFetching] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

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
      setTimeout(() => {
        setMessage('')
      }, 3000)
    }
  }, []);

  useEffect(() => {
    if (loading) {
      return;
    }

    if (!user || user.role !== 'YouTuber') {
      return <Navigate to="/youtuber/login" />;
    } else {
      fetchPendingVideos();
    }
  }, [user, loading, fetchPendingVideos]);

  const handleSelectVideo = (videoId) => {
    navigate(`/youtuber/video/${videoId}`);
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
              <button type="button" onClick={() => handleSelectVideo(video._id)} className="bg-gray-800 drop-shadow-2xl text-white w-auto py-1 px-4 mt-2 rounded flex items-center justify-center gap-2 hover:bg-gray-900">Select <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.042 21.672 13.684 16.6m0 0-2.51 2.225.569-9.47 5.227 7.917-3.286-.672ZM12 2.25V4.5m5.834.166-1.591 1.591M20.25 10.5H18M7.757 14.743l-1.59 1.59M6 10.5H3.75m4.007-4.243-1.59-1.59" />
              </svg>
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default YouTuberDashboard;
