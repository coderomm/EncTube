import { useContext, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import axiosInstance from '../../utils/AxiosInstance';
import { AuthContext } from '../../context/AuthContext';

function EditorDashboard() {
    const { user, loading } = useContext(AuthContext);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [file, setFile] = useState(null);
    const [loading2, setLoading2] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (loading) {
            return <div>Loading...</div>;
        }

        if (!user || user.role !== 'Editor') {
            return <Navigate to="/login-editor" />;
        }
    }, [user, loading]);

    const handleUpload = async () => {
        setLoading2(true);
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
            setLoading2(false);
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
                    <button className="bg-blue-500 text-white w-full py-2 rounded-lg" onClick={handleUpload} disabled={loading2}>
                        {loading2 ? 'Uploading...' : 'Upload'}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default EditorDashboard;
