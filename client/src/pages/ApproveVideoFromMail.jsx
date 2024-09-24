import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/AxiosInstance';
import Loader from '../components/Loader';
import { toast } from 'sonner';

const ApproveVideoFromMail = () => {
    const { id } = useParams();
    const [status, setStatus] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const approveVideo = async () => {
            try {
                const response = await axiosInstance.put(`/video/youtuber/approve/${id}`, { status: 'Approved' });
                console.log('Response:', response); // Log the full response
                if (response.status === 200) {
                    setStatus('success');
                    toast.success('Video approved and published successfully! 🎉');
                } else {
                    setStatus('error');
                    toast.error('Failed to approve video.');
                }
            } catch (error) {
                console.error('Error during video approval:', error); // Log the error
                setStatus('error');
                toast.error('An error occurred while approving the video.');
            }
        };

        approveVideo();
    }, [id]);

    const handleRedirect = () => {
        navigate('/youtuber/dashboard');
    };

    return (
        <div className="min-h-[50vh] my-8 mx-auto px-4 md:px-0 bg-img text-white rounded-3xl container flex items-center justify-center">
            <div className="p-8 rounded-[30px] drop-shadow-2xl w-full md:w-2/3 lg:w-[35%]">
                <h2 className="text-3xl md:text-4xl mb-8 text-center tracking-wider font-lowballRegular text-white">🎬 Video Approval</h2>
                {status === 'success' ? (
                    <div className='flex items-center flex-col'>
                        <button onClick={handleRedirect} className="brandBtn mt-6 px-4 py-2 rounded flex items-center justify-between gap-3">
                            Go to Dashboard <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                            </svg>
                        </button>
                    </div>
                ) : status === 'error' ? (
                    <div className='flex items-center flex-col'>
                        <button onClick={handleRedirect} className="brandBtn mt-6 px-4 py-2 rounded flex items-center justify-between gap-3">
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
