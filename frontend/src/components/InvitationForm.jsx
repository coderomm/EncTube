import { useState } from 'react';
import axiosInstance from '../utils/AxiosInstance';
import { z } from 'zod';

const invitationSchema = z.object({
    editorEmail: z.string().email(),
});

const InvitationForm = () => {
    const [editorEmail, setEditorEmail] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

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
            setMessage(response.data);
        } catch (error) {
            setMessage('Failed to send invitation.');
            console.error(error);
        } finally {
            setLoading(false);
            setTimeout(() => setMessage(''), 3000);
        }
    };

    return (
        <div className="min-h-screen container mx-auto my-8 px-4 md:px-0">
            <div className="bg-white p-4 rounded-lg drop-shadow-2xl">
                <h2 className="text-2xl font-bold mb-4 flex items-center justify-start gap-2"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                </svg>Enter Editor Mail</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="email"
                        placeholder="Email"
                        value={editorEmail}
                        onChange={(e) => setEditorEmail(e.target.value)}
                        required
                        className="w-full mb-4 px-4 py-2 border rounded-lg"
                    />
                    <button type="submit" className={`bg-gray-800 drop-shadow-2xl text-white w-full py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-900 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`} disabled={loading}>
                        {loading ? 'Sending ...' : 'Send Invitation'} <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z" />
                        </svg>
                    </button>
                </form>
                {message && <p className='w-full text-center my-3 font-bold'>{message}</p>}
            </div>
        </div>
    );
};

export default InvitationForm;
