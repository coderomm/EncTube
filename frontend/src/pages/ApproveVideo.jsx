import { useState, useEffect, useContext } from 'react';
import axiosInstance from '../utils/AxiosInstance';
import { useParams, Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ApproveVideo = () => {
    const { id: id } = useParams();
    const { user, loading } = useContext(AuthContext);
    const [video, setVideo] = useState([]);
    const [message, setMessage] = useState('');
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        if (loading) {
            return <div>Loading...</div>
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
            }
        };
        fetchPendingVideo();
    }, [user, loading, id, uploading]);

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

    return (
        <div className="my-8 container mx-auto px-4 md:px-0">
            <div className="bg-white p-4 rounded-lg drop-shadow-2xl mb-4 flex items-center justify-between flex-wrap">
                <h2 className="text-2xl font-bold mb-2 flex items-center justify-start gap-2"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                </svg> {user.channelName} | <span className='text-xl text-sky-500'>{user.channelUrl}</span>
                </h2>
            </div>
            <div className="mb-4 grid grid-cols-1 gap-4">
                <div className="bg-white p-4 rounded-lg drop-shadow-2xl">
                    <div>
                        <div className="flex flex-col">
                            <label htmlFor=""></label>
                            <div className='text-md'></div>
                        </div>

                        <div className="flex">
                            <button
                                className={`btn text-white py-1 px-3 rounded bg-green-500 hover:bg-green-600 mr-2 ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                onClick={() => handleApprove(video._id)}
                                disabled={uploading}
                            >
                                Approve
                            </button>
                            <button
                                className={`btn text-white py-1 px-3 rounded bg-red-500 hover:bg-red-600 ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                onClick={() => handleReject(video._id)}
                                disabled={uploading}
                            >
                                Reject
                            </button>
                        </div>
                        {message && <p className="drop-shadow-2xl my-3 text-red-500 text-center">{message}</p>}
                    </div>
                </div>
            </div >
        </div >
    );
};

export default ApproveVideo;
