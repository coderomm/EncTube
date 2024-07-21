// src/components/InvitationForm.js
import React, { useState } from 'react';
import axiosInstance from '../utils/AxiosInstance';

const InvitationForm = () => {
    const [editorEmail, setEditorEmail] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axiosInstance.post('/invitation/sendInvitation', { editorEmail });
            setMessage(response.data);
        } catch (error) {
            setMessage('Failed to send invitation.');
            console.error(error);
        }
    };

    return (
        <div>
            <h2>Invite Editor</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    placeholder="Editor Email"
                    value={editorEmail}
                    onChange={(e) => setEditorEmail(e.target.value)}
                    required
                />
                <button type="submit">Send Invitation</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default InvitationForm;
