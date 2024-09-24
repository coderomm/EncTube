import { useState, useEffect, useContext, useCallback } from 'react';
import { AuthContext } from '../../context/AuthContext';
import axiosInstance from '../../utils/AxiosInstance';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import Loader from '../Loader';
import { toast } from 'sonner';

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
      toast.error('Error fetching pending videos');
      if (error.response && error.response.status === 403) {
        setError('Your account is no longer active.');
        toast.error('Your account is no longer active.')
        AuthContext.logout();
      } else {
        setError('Error fetching pending videos');
        toast.error('Error fetching pending videos')
      }
    } finally {
      setFetching(false);
      setTimeout(() => {
        setMessage('')
      }, 3000)
    }
  }, []);

  useEffect(() => {
    if (loading) {
      return <Loader />;
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
    <section className="my-8 container mx-auto px-2 md:px-0">
      {error && <p className="bg-red-600 p-4 rounded-lg shadow-md mb-4 text-white">{error}</p>}
      {message && <p className="bg-green-600 p-4 rounded-lg shadow-md mb-4 text-white">{message}</p>}

      <div className="bg-img rounded-3xl text-white px-2 py-4 md:p-12 drop-shadow-2xl mb-8">
        <div className="flex flex-col items-center md:items-start justify-center w-full gap-3">
          <div className="font-lowballBold tracking-wider md:mb-2 flex flex-col gap-2">
            <h2 className='font-bold text-2xl flex items-center justify-start gap-2'>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
              </svg> Hey Welcome
            </h2>
            <div className="flex">
              <div className="rounded-full w-16 h-1w-16 flex justify-center mt-1 mr-3">
                <img className='w-full rounded-full' src={user.channelLogo}></img>
              </div>
              <div className="flex flex-col justify-center">
                <h3 className='text-xl font-lowballRegular tracking-wider'>{user.channelName}</h3>
                <p className='font-lowballRegular tracking-wider'>{user.channelUrl}</p>
              </div>
            </div>
          </div>
          <div className="w-full md:w-auto px-3 sm:px-10 md:px-1 flex items-center justify-center gap-3 flex-nowrap md:flex-wrap">
            <Link to={'invite-editor'} className="brandBtn w-full md:w-auto text-white hover:text-gray-200 px-1 py-2 md:px-5 md:py-2 rounded flex items-center justify-center gap-2 text-lg">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z" />
              </svg> Invite Editor
            </Link>
            <Link to={'/youtuber/all-editors'} className="brandBtnOutline w-full md:w-auto text-white hover:text-gray-200 px-1 py-2 md:px-5 md:py-2 rounded flex items-center justify-center gap-2 text-lg">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
              </svg> View Editors
            </Link>
          </div>
        </div>
      </div>

      <div className="bg-img rounded-3xl text-white px-2 py-4 md:p-12 drop-shadow-2xl min-h-[25vh]">
        <h2 className="text-2xl font-bold mb-4">🎬 <span className=''>Pending Videos:</span> {videos.length}</h2>
        <hr className="border-white border-1 mb-4"></hr>
        {fetching ? (
          <Loader />
        ) : (
          videos.map(video => (
            <div key={video._id} className="bg-[#141414d1] text-white p-4 rounded-lg drop-shadow-2xl mb-4">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
                <div className="">
                  <h3 className="text-2xl md:text-xl mb-3"><span className='font-lowballRegular tracking-wider'>Title:</span> {video.title}</h3>
                  <p className="text-2xl md:text-xl mb-3"><span className='font-lowballRegular tracking-wider'>Added by:</span> {video.editor.username}</p>
                  <p className="text-2xl md:text-xl mb-3"><span className='font-lowballRegular tracking-wider'>Added on:</span> {new Date(video.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit'
                  })}</p>
                </div>
                <button type="button" onClick={() => handleSelectVideo(video._id)} className="w-full md:w-auto brandBtn drop-shadow-2xl text-white py-2 px-4 md:px-5 md:py-2 mt-2 rounded flex items-center justify-center gap-2 text-lg">
                  Select
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.042 21.672 13.684 16.6m0 0-2.51 2.225.569-9.47 5.227 7.917-3.286-.672ZM12 2.25V4.5m5.834.166-1.591 1.591M20.25 10.5H18M7.757 14.743l-1.59 1.59M6 10.5H3.75m4.007-4.243-1.59-1.59" />
                  </svg>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}

export default YouTuberDashboard;
