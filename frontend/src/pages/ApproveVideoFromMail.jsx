import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/AxiosInstance';

const ApproveVideoPage = () => {
    const { id } = useParams(); // This will get the video ID from the URL
    const [status, setStatus] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const approveVideo = async () => {
            try {
                const response = await axiosInstance.put(`/youtuber/approve/${id}`, { status: 'Approved' });
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
        navigate('/youtuber-dashboard');
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg drop-shadow-2xl w-full max-w-md text-center">
                <h2 className="text-2xl font-bold mb-4">Video Approval</h2>
                {status === 'success' ? (
                    <div>
                        <p className="text-green-600 mb-4">{message}</p>
                        <button onClick={handleRedirect} className="bg-green-500 text-white px-4 py-2 rounded">
                            Go to Dashboard
                        </button>
                    </div>
                ) : status === 'error' ? (
                    <div>
                        <p className="text-red-600 mb-4">{message}</p>
                        <button onClick={handleRedirect} className="bg-red-500 text-white px-4 py-2 rounded">
                            Go to Dashboard
                        </button>
                    </div>
                ) : (
                    <div>
                        <p>Processing your request...</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ApproveVideoPage;
