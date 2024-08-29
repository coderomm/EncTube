import { useContext, useEffect, useState } from 'react';
import axiosInstance from '../utils/AxiosInstance';
import { z } from 'zod';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Loader from './Loader';
import BackButton from './BackButton';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const invitationSchema = z.object({
    editorEmail: z.string().email(),
});

const InvitationForm = () => {
    const { user, loading } = useContext(AuthContext);
    const [editorEmail, setEditorEmail] = useState('');
    const [message, setMessage] = useState('');
    const [loading2, setLoading2] = useState(false);
    const [emailError, setEmailError] = useState('Empty email');
    const [correctEMail, setCorrectEMail] = useState(false);

    useEffect(() => {
        if (loading) {
            return <Loader />;
        }

        if (!user || user.role !== 'YouTuber') {
            return <Navigate to="/youtuber/login" />;
        }
    }, [user, loading]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationResult = invitationSchema.safeParse({ editorEmail });

        if (!validationResult.success) {
            setMessage('Please enter a valid email address');
            return;
        }

        try {
            setLoading2(true);
            const response = await axiosInstance.post('/youtuber/channel/editor/add', { editorEmail: editorEmail.trim() });
            console.log('send email invite res:', response)
            setMessage(response.data);
        } catch (error) {
            setMessage('Failed to send invitation.');
            console.error(error);
        } finally {
            setLoading2(false);
            setEditorEmail('');
            setTimeout(() => setMessage(''), 3000);
        }
    };

    const handleEmailChange = (e) => {
        const email = e.target.value;
        setEditorEmail(email);

        if (email === '') {
            setEmailError('Empty email');
            setCorrectEMail(false);
        } else if (!emailRegex.test(email)) {
            setEmailError('Invalid email');
            setCorrectEMail(false);
        } else {
            setEmailError('');
            setCorrectEMail(true);
        }
    };

    return (
        <section className="my-8 container mx-auto px-2 md:px-0">
            <BackButton />
            <div className="bg-img rounded-3xl text-white py-4 px-2 md:px-6 drop-shadow-2xl mb-8">
                <div className="flex flex-col items-center justify-center w-full gap-3">
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
                </div>
            </div>

            <div className="bg-img rounded-3xl text-white p-4 sm:p-12 md:p-8 md:py-16 drop-shadow-2xl flex items-center justify-center">
                <div className="w-full flex flex-col">
                    <h2 className="text-2xl text-center font-bold mb-8 flex flex-col md:flex-row items-center justify-center gap-2 w-full">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-10">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                        </svg>
                        Enter the Editor&apos;s Email Address to Send an Invitation
                    </h2>
                    <form className='text-center' onSubmit={handleSubmit}>
                        <input
                            type="email"
                            placeholder="Email"
                            value={editorEmail}
                            onChange={handleEmailChange}
                            required
                            className="max-w-[500px] w-full px-4 py-2 mx-auto border rounded-lg bg-transparent text-lg"
                        />
                        {/* {emailError && <p className="text-white">{emailError}</p>} */}
                        <button type="submit" className={`brandBtn font-bold drop-shadow-2xl text-white max-w-[500px] w-full mx-auto py-2 mt-6 rounded-lg flex items-center justify-center gap-2 ${loading2 || !correctEMail ? 'opacity-50 cursor-not-allowed' : ''}`} disabled={loading2 || !correctEMail}>
                            {!correctEMail ? emailError : loading2 ? 'Sending ...' : 'Send Invitation'} <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z" />
                            </svg>
                        </button>
                    </form>
                    {message && <p className='w-full text-center mt-1 text-white'>{message}</p>}
                </div>
            </div>
        </section>
    );
};

export default InvitationForm;
