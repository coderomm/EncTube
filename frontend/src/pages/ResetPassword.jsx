import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/AxiosInstance';

const ResetPassword = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get('token');

    const handleResetPassword = async (e) => {
        e.preventDefault();
        if (password.length < 6 || confirmPassword.length < 6) {
            setMessage('Passwords must be of at list 6 characters.');
            return;
        }
        if (password !== confirmPassword) {
            setMessage('Passwords do not match');
            return;
        }
        setLoading(true);
        try {
            const response = await axiosInstance.post('/editor/reset-password', { token, password });
            if (response.status === 200) {
                setMessage('Password reset successful!');
                navigate('/editor/login');
            } else {
                setMessage('Error in resetting password');
            }
        } catch (error) {
            setMessage('Error in resetting password');
        } finally {
            setLoading(false);
            setTimeout(() => setMessage(''), 1500)
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center my-8 container mx-auto px-4 md:px-0">
            <div className="bg-white p-8 rounded-lg drop-shadow-2xl w-full md:w-2/3 lg:w-[35%]">
            <h2 className="text-2xl font-bold text-center">Update Password</h2>
            <p className="text-base font-semibold underline mb-8 text-center">Reset your password here...</p>
                <form onSubmit={handleResetPassword}>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="New Password"
                        required
                        className="w-full mb-4 px-4 py-2 border rounded-lg"
                    />
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm New Password"
                        required
                        className="w-full mb-4 px-4 py-2 border rounded-lg"
                    />
                    <button type="submit" className={`bg-gray-800 text-white w-full py-2 rounded-lg flex items-center justify-center gap-2 ${loading ? 'cursor-not-allowed' : ''}`} disabled={loading}>
                        {loading ? 'Processing...' : 'Reset Password'} <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                        </svg>
                    </button>
                    {message && <p className="text-red-600 my-2 text-center">{message}</p>}
                </form>
            </div>
        </div>
    );
};

export default ResetPassword;
