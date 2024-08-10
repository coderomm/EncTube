import { useState, useEffect, useContext } from 'react';
import axiosInstance from '../utils/AxiosInstance';
import { useParams, Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Loader from '../components/Loader';

const ApproveVideo = () => {
    const { id: id } = useParams();
    const { user, loading } = useContext(AuthContext);
    const [video, setVideo] = useState([]);
    const [message, setMessage] = useState('');
    const [uploading, setUploading] = useState(false);
    const [fetching, setFetching] = useState(true);

    useEffect(() => {
        if (loading) {
            return <Loader />
        }
        if (!loading && (!user || user.role !== 'YouTuber')) {
            return <Navigate to="/youtuber/login" />;
        }

        const fetchPendingVideo = async () => {
            try {
                const response = await axiosInstance.get(`/video/youtuber/pending/${id}`);
                if (response.status === 200) {
                    setVideo(response.data);
                } else {
                    setMessage('Error fetching pending video');
                }
            } catch (message) {
                console.error('Error fetching pending video:', message);
                setMessage('Error fetching pending video');
            } finally {
                setTimeout(() => setMessage(''), 3000)
                setFetching(false)
            }
        };
        fetchPendingVideo();
    }, [user, loading, id, uploading]);

    if (fetching) {
        return <Loader />
    }

    const handleApprove = async (id) => {
        setUploading(true);
        try {
            await axiosInstance.put(`/video/youtuber/approve/${id}`, { status: 'Approved' }, { withCredentials: true });
            setVideo('');
            setMessage('Video approved successfully');
        } catch (error) {
            console.error('Error approving video:', error);
            setMessage('Error approving video');
        } finally {
            setUploading(false);
        }
    };

    const handleReject = async (id) => {
        setUploading(true);
        try {
            await axiosInstance.put(`/video/youtuber/approve/${id}`, { status: 'Rejected' }, { withCredentials: true });
            setVideo('');
            setMessage('Video rejected successfully');
        } catch (error) {
            console.error('Error rejecting video:', error);
            setMessage('Error rejecting video');
        } finally {
            setUploading(false);
        }
    };

    const videoPublishDate = new Date(video.publishAt).toLocaleString('en-IN', {
        timeZone: 'Asia/Kolkata',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });

    return (
        <div className="my-8 container mx-auto px-4 md:px-0">
            <div className="bg-white p-4 rounded-lg drop-shadow-2xl mb-4 flex items-center justify-between flex-wrap">
                <h2 className="text-2xl font-bold mb-2 flex items-center justify-start gap-2"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                </svg> {user.channelName} | <span className='text-xl text-sky-500'>{user.channelUrl}</span>
                </h2>
            </div>
            <div className="bg-white p-6 rounded-lg drop-shadow-2xl border border-gray-200">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <span className="text-gray-700">Video Details</span>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                    </svg>
                </h2>
                <hr className="border-gray-300 mb-4" />
                <div className="flex flex-col gap-3">
                    <div className="flex flex-col md:flex-row items-start justify-between gap-3">
                        <div className='flex flex-col gap-4 flex-grow'>
                            <div className="flex flex-col">
                                <label className='font-bold text-gray-700'>Title</label>
                                <div className='text-md text-gray-600'>{video.title}</div>
                            </div>
                            <div className="flex flex-col">
                                <label className='font-bold text-gray-700'>Description</label>
                                <div className='text-md text-gray-600'>{video.description}</div>
                            </div>
                            <div className="flex flex-col">
                                <label className='font-bold text-gray-700'>Tags</label>
                                <div className='text-md text-gray-600'>{video.tags.join(', ')}</div>
                            </div>
                            <div className="flex flex-col">
                                <label className='font-bold text-gray-700'>Privacy</label>
                                <div className='text-md text-gray-600'>{video.privacyStatus}</div>
                            </div>
                            {video.privacyStatus !== 'private' && (
                                <div className="flex flex-col">
                                    <label className='font-bold text-gray-700'>Publish At</label>
                                    <div className='text-md text-gray-600'>{videoPublishDate}</div>
                                </div>
                            )}
                        </div>
                        <div className="rounded-lg drop-shadow-2xl flex-grow flex mx-auto">
                            <video controls className='w-60 h-auto m-auto rounded'>
                                <source src={video.signedUrl} type="video/mp4" />
                                Your browser does not support the video tag.
                            </video>
                        </div>
                    </div>
                    <div className="flex gap-2 mt-4">
                        <button type="submit" onClick={() => handleApprove(video._id)} className={`bg-gray-800 drop-shadow-2xl text-white w-full py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-900 ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`} disabled={uploading}>
                            {uploading ? 'Uploading ...' : 'Upload'}
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75Z" />
                            </svg>
                        </button>
                        <button type="submit" onClick={() => handleReject(video._id)} className={`bg-red-500 drop-shadow-2xl text-white w-full py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-red-600 ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`} disabled={uploading}>
                            {uploading ? 'Rejecting ...' : 'Reject'}
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 0 0 5.636 5.636m12.728 12.728A9 9 0 0 1 5.636 5.636m12.728 12.728L5.636 5.636" />
                            </svg>
                        </button>
                    </div>
                    {message && <p className="mt-4 text-red-500 text-center">{message}</p>}
                </div>
            </div>
        </div >
    );
};

export default ApproveVideo;
