import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/AxiosInstance';
import Loader from '../components/Loader';

const ApproveVideoFromMail = () => {
    const { id } = useParams();
    const [status, setStatus] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const approveVideo = async () => {
            try {
                const response = await axiosInstance.put(`/video/youtuber/approve/${id}`, { status: 'Approved' });
                if (response.status === 200) {
                    setStatus('success');
                    setMessage('Video approved and published successfully! 🎉');
                } else {
                    setStatus('error');
                    setMessage('Failed to approve video.');
                }
            } catch (error) {
                setStatus('error');
                setMessage('An error occurred while approving the video.');
            }
        };

        approveVideo();
    }, [id]);

    const handleRedirect = () => {
        navigate('/youtuber/dashboard');
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center my-8 container mx-auto px-4 md:px-0">
            <div className="bg-white p-8 rounded-lg drop-shadow-2xl w-full max-w-md text-center">
                <h2 className="text-2xl font-bold mb-4">Video Approval</h2>
                {status === 'success' ? (
                    <div className='flex items-center flex-col'>
                        <p className="text-gray-800 mb-4">{message}</p>
                        <button onClick={handleRedirect} className="bg-green-500 text-white px-4 py-2 rounded flex items-center justify-between gap-3">
                            Go to Dashboard <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                            </svg>
                        </button>
                    </div>
                ) : status === 'error' ? (
                    <div className='flex items-center flex-col'>
                        <p className="text-red-800 mb-4">{message}</p>
                        <button onClick={handleRedirect} className="bg-red-500 text-white px-4 py-2 rounded flex items-center justify-between gap-3">
                            Go to Dashboard <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                            </svg>
                        </button>
                    </div>
                ) : (
                    <Loader />
                )}
            </div>
        </div>
    );
};

export default ApproveVideoFromMail;
