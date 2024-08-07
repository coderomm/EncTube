import { useState } from 'react';
import axiosInstance from '../utils/AxiosInstance';
import { Link } from 'react-router-dom';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleForgotPassword = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axiosInstance.post('/editor/forgot-password', { email });
            setMessage(response.data);
        } catch (error) {
            setMessage('Error in sending reset link');
        } finally {
            setLoading(false);
            setTimeout(() => {
                setEmail('')
                setMessage('')
            }, 3000)
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center my-8 container mx-auto px-4 md:px-0">
            <div className="bg-white p-8 rounded-lg drop-shadow-2xl w-full md:w-2/3 lg:w-[35%]">
                <h2 className="text-2xl font-bold text-center">Forgot Your Password</h2>
                <p className="text-base font-semibold underline mb-8 text-center">Don&apos;t worry</p>
                <form onSubmit={handleForgotPassword}>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        required
                        className="w-full mb-4 px-4 py-2 border rounded-lg"
                    />
                    <button type="submit" className={`bg-gray-800 text-white w-full py-2 rounded-lg flex items-center justify-center gap-2 ${loading ? 'cursor-not-allowed' : ''}`} disabled={loading}>
                        {loading ? 'Processing...' : 'Send Reset Link'} <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
                        </svg>
                    </button>
                    {message && <p className="text-red-600 my-2 text-center">{message}</p>}
                    <div className="flex items-center flex-wrap mt-3">
                        <Link to={'/editor/signup'} className='flex-1 my-3 underline font-semibold text-indigo-600 hover:text-indigo-500 text-center mx-auto block'>Don&apos;t have account?</Link>
                        <Link to={'/editor/login'} className='flex-1 my-3 underline font-semibold text-indigo-600 hover:text-indigo-500 text-center mx-auto block'>Already have an account?</Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ForgotPassword;
