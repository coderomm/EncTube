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
        <div className="min-h-screen flex items-center justify-center flex-col bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-4">Upload Video</h2>
                <form>
                    <input
                        type="text"
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        placeholder="Title"
                        className="w-full mb-4 px-4 py-2 border rounded-lg"
                    />
                    <textarea
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        placeholder="Description"
                        className="w-full mb-4 px-4 py-2 border rounded-lg"
                    />
                    <input
                        type="file"
                        onChange={e => setFile(e.target.files[0])}
                        className="w-full mb-4 px-4 py-2 border rounded-lg"
                    />
                    {error && <p className="text-red-600 mb-2">{error}</p>}
                    <button className="bg-blue-500 text-white w-full py-2 rounded-lg" onClick={handleUpload} disabled={loading}>
                        {loading ? 'Uploading...' : 'Upload'}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default EditorDashboard;
