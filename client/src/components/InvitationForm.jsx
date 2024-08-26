import { useState } from 'react';
import axiosInstance from '../utils/AxiosInstance';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const invitationSchema = z.object({
    editorEmail: z.string().email(),
});

const InvitationForm = () => {
    const [editorEmail, setEditorEmail] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [emailError, setEmailError] = useState('Empty email');
    const [correctEMail, setCorrectEMail] = useState(false);
    const navigate = useNavigate();

    const handleGoBack = () => {
        navigate(-1);
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationResult = invitationSchema.safeParse({ editorEmail });

        if (!validationResult.success) {
            setMessage('Please enter a valid email address');
            return;
        }

        try {
            setLoading(true);
            const response = await axiosInstance.post('/invitation/sendInvitation', { editorEmail: editorEmail.trim() });
            console.log('send email invite res:', response)
            setMessage(response.data);
        } catch (error) {
            setMessage('Failed to send invitation.');
            console.error(error);
        } finally {
            setLoading(false);
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
        <section className="min-h-[80vh] flex items-center justify-center my-8 container mx-auto px-4 md:px-0 bg-img rounded-3xl text-white">
            <div className="p-1 md:p-8 rounded-[30px] drop-shadow-2xl w-full md:w-2/3 lg:w-[50%] flex flex-col">
                <h2 className="text-2xl text-center font-bold mb-8 flex flex-col md:flex-row items-center justify-center gap-2 w-full">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-10">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                    </svg>
                    Enter the Editor&apos;s Email Address to Send an Invitation
                </h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="email"
                        placeholder="Email"
                        value={editorEmail}
                        onChange={handleEmailChange}
                        required
                        className="w-full px-4 py-2 mx-auto border rounded-lg bg-transparent text-lg"
                    />
                    {/* {emailError && <p className="text-white">{emailError}</p>} */}
                    <button type="submit" className={`brandBtn font-bold drop-shadow-2xl text-white w-full mx-auto py-2 mt-6 rounded-lg flex items-center justify-center gap-2 ${loading || !correctEMail ? 'opacity-50 cursor-not-allowed' : ''}`} disabled={loading || !correctEMail}>
                        { !correctEMail ? emailError : loading ? 'Sending ...' : 'Send Invitation'} <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z" />
                        </svg>
                    </button>
                    <p onClick={handleGoBack} className='cursor-pointer flex-1 my-3 underline font-semibold text-[#999999] transition-colors duration-200 ease-out text-center mx-auto block'>Go to dashboard</p>
                </form>
                {message && <p className='w-full text-center mt-1 text-white'>{message}</p>}
            </div>
        </section>
    );
};

export default InvitationForm;
