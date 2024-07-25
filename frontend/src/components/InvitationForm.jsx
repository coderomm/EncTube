// src/components/InvitationForm.js
import { useState } from 'react';
import axiosInstance from '../utils/AxiosInstance';

const InvitationForm = () => {
    const [editorEmail, setEditorEmail] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axiosInstance.post('/invitation/sendInvitation', { editorEmail: editorEmail.trim() });
            setMessage(response.data);
            console.log('sendInvitation res: ', response)
        } catch (error) {
            setMessage('Failed to send invitation.');
            console.error(error);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-4">Invite Editor</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="email"
                        placeholder="Email"
                        value={editorEmail}
                        onChange={(e) => setEditorEmail(e.target.value)}
                        required
                        className="w-full mb-4 px-4 py-2 border rounded-lg"
                    />
                    <button type="submit" className="bg-blue-500 text-white w-full py-2 rounded-lg">
                        Send Invitation
                    </button>
                </form>
                {message && <p className='w-full text-center my-3 font-bold'>{message}</p>}
            </div>
        </div>
    );
};

export default InvitationForm;
