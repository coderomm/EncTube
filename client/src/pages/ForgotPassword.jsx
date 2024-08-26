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
            console.log('forgot pwd res:',response)
            setMessage(response.data);
        } catch (error) {
            console.error('Error in sending reset mail')
        } finally {
            setLoading(false);
            setTimeout(() => {
                setEmail('')
                setMessage('')
            }, 3000)
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center my-8 container mx-auto px-4 md:px-0 bg-img rounded-3xl text-white">
            <div className="p-3 md:p-8 rounded-[30px] drop-shadow-2xl w-full md:w-2/3 lg:w-[35%]">
                <h2 className="text-3xl text-center tracking-wider font-lowballRegular">Forgot Your Password</h2>
                <p className="text-base font-semibold underline mb-8 text-center">Don&apos;t worry</p>
                <form onSubmit={handleForgotPassword}>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        required
                        className="w-full mb-4 px-5 border rounded-lg border-[#3f3f3f] bg-transparent h-14 outline-none"
                    />
                    <button type="submit" className={`brandBtn text-white w-full py-2 rounded-lg flex items-center justify-center gap-2 ${loading ? 'cursor-not-allowed' : ''}`} disabled={loading}>
                        {loading ? 'Processing...' : 'Send Reset Link'} <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
                        </svg>
                    </button>
                    {message && <p className="text-white my-2 text-center">{message}</p>}
                    <div className="flex flex-col md:flex-row items-center flex-wrap mt-3">
                        <Link to={'/editor/signup'} className='flex-1 md:my-3 underline text-[#999] hover:text-white transition-colors duration-200 ease-out text-center mx-auto block'>Don&apos;t have account?</Link>
                        <Link to={'/editor/login'} className='flex-1 md:my-3 underline text-[#999] hover:text-white transition-colors duration-200 ease-out text-center mx-auto block'>Already have an account?</Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ForgotPassword;
