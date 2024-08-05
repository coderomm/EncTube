import { useEffect, useState } from 'react';
import axiosInstance from '../utils/AxiosInstance';
import { useNavigate, useSearchParams } from 'react-router-dom';

const ConfirmChannel = () => {
    const [searchParams] = useSearchParams();
    const [message, setMessage] = useState('');
    const [status, setStatus] = useState(null);
    const token = searchParams.get('token');
    const email = searchParams.get('email');
    const navigate = useNavigate();

    const handleConfirm = async () => {
        try {
            const response = await axiosInstance.post('/invitation/confirmChannel', { token, email });
            if (response.status === 200) {
                setMessage(response.data.message);
                setStatus('success');
                setTimeout(() => {
                    navigate('/editor-dashboard');
                }, 2500);
            } else {
                setMessage(response.data.message);
                setStatus('error');
            }
        } catch (error) {
            setMessage('Failed to confirm channel.');
            setStatus('error');
            console.error(error);
        } finally {
            setMessage('');
            setStatus('');
        }
    };

    useEffect(() => {
        if (token && email) {
            handleConfirm();
        } else {
            setMessage('Invalid confirmation link.');
            setStatus('error');
        }
    }, [token, email]);

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="container mx-auto my-8 px-4 md:px-0">
                <div className="bg-white p-16 flex items-center justify-center flex-col text-center rounded-lg drop-shadow-2xl">
                    <h2 className="text-xl font-bold mb-4 flex items-center justify-between gap-2">
                        {status === 'success'
                            ? 'Hey Editor, your channel invitation is confirmed! 🎉'
                            : 'Hey Editor, your channel invitation is not confirmed !'}
                    </h2>
                    {status === 'success' && <p className="cursor-pointer text-green-600 underline font-semibold text-center flex items-center justify-center gap-2">{message} <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.633 10.25c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75a.75.75 0 0 1 .75-.75 2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282m0 0h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23H5.904m10.598-9.75H14.25M5.904 18.5c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 0 1-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 9.953 4.167 9.5 5 9.5h1.053c.472 0 .745.556.5.96a8.958 8.958 0 0 0-1.302 4.665c0 1.194.232 2.333.654 3.375Z" />
                    </svg>
                    </p>}
                    {status === 'error' && <p className="cursor-pointer text-red-600 underline font-semibold text-center flex items-center justify-center gap-2"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                    </svg>
                        {message}
                    </p>}
                </div>
            </div>
        </div>
    );
};

export default ConfirmChannel;
