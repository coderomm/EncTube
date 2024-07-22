import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/AxiosInstance';
import { AuthContext } from '../../context/AuthContext';

function EditorDashboard() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleUpload = async () => {
        setLoading(true);
        setError('');
        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('file', file);

        try {
            await axiosInstance.post('/vdo/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                withCredentials: true
            });
            alert('Video uploaded successfully, waiting for approval');
            setTitle('');
            setDescription('');
            setFile(null);
        } catch (error) {
            console.error('Error uploading video:', error);
            setError('Failed to upload video');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen p-4">
            <h1 className="text-2xl mb-4">Upload Video</h1>
            <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Title"
                className="input mb-2"
            />
            <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Description"
                className="input mb-2"
            />
            <input
                type="file"
                onChange={e => setFile(e.target.files[0])}
                className="input mb-2"
            />
            {error && <p className="text-red-600 mb-2">{error}</p>}
            <button className="btn" onClick={handleUpload} disabled={loading}>
                {loading ? 'Uploading...' : 'Upload'}
            </button>
        </div>
    );
}

export default EditorDashboard;
