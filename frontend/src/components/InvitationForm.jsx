import { useState } from 'react';
import axiosInstance from '../utils/AxiosInstance';
import { Link } from 'react-router-dom';

const InvitationForm = () => {
    const [editorEmail, setEditorEmail] = useState('omsharma9367@gmail.com');
    const [message, setMessage] = useState('');
    const [tokenLink, setTokenLink] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axiosInstance.post('/invitation/sendInvitation', { editorEmail: editorEmail.trim() });
            if (response.data.status === 200) {
                setMessage(response.data.message);
                setTokenLink(response.data.invitationLink);
            } else {
                alert('Failed to send invitation.');
                setMessage('Failed to send invitation.');
            }
            console.log('sendInvitation res: ', response);
        } catch (error) {
            setMessage('Failed to send invitation.');
            alert('Failed to send invitation.');
            console.error(error);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center flex-col bg-gray-100">
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
            {tokenLink && (
                <div className="bg-white p-8 rounded-lg shadow-md mt-3">
                    <Link to={tokenLink}>Click here to register as an editor from the token you generated now</Link>
                </div>
            )}
        </div>
    );
};

export default InvitationForm;
