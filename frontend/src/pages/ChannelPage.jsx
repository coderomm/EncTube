import { useState, useEffect, useContext } from 'react';
import axiosInstance from '../utils/AxiosInstance';
import { useParams, Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ChannelDetails = () => {
    const { id: channelId } = useParams();
    const { user, loading } = useContext(AuthContext);
    const [channel, setChannel] = useState(null);
    const [videos, setVideos] = useState([]);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [file, setFile] = useState(null);
    const [flow, setFlow] = useState(true);
    const [error, setError] = useState('');
    const [vdoUploading, setVdoUploading] = useState(false);

    useEffect(() => {
        if (loading) {
            return <div>Loading...</div>
        }
        if (!loading && (!user || user.role !== 'Editor')) {
            return <Navigate to="/login-editor" />;
        }

        const fetchChannelDetails = async () => {
            try {
                const response = await axiosInstance.get(`/channel/${channelId}`);
                setChannel(response.data);
            } catch (error) {
                console.error('Error fetching channel details:', error);
                setError('Error fetching channel details');
            }
        };

        const fetchPendingVideos = async () => {
            try {
                const response = await axiosInstance.get(`/video/editor/pending?channelId=${channelId}`);
                console.log('fetchPendingVideos res:', response)
                setVideos(response.data);
            } catch (error) {
                console.error('Error fetching pending videos:', error);
                setError('Error fetching pending videos');
            } finally {
                setFlow(false);
            }
        };

        fetchChannelDetails();
        fetchPendingVideos();
    }, [user, loading, channelId, vdoUploading]);

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!title || !description || !file) {
            setError('Please fill all fields and select a file to upload.');
            return;
        }
        const formData = new FormData();
        formData.append('file', file);
        formData.append('title', title);
        formData.append('description', description);
        formData.append('channelId', channelId);
        formData.append('editorId', user.userId);
        setVdoUploading(true);
        try {
            const response = await axiosInstance.post('/video/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            console.log('vdo upload res:', response)
            setVideos([...videos, response.data]);
            setTitle('');
            setDescription('');
            setFile(null);
            alert('Video uploaded successfully');
        } catch (error) {
            console.error('Error uploading video:', error);
            setError('Error uploading video');
        } finally {
            setVdoUploading(false);
        }
    };

    if (flow) {
        return <div>Loading...</div>;
    }

    return (
        <div className="my-8 container mx-auto">
            {error && <p className="bg-white p-4 rounded-lg shadow-md mb-4 text-red-600">{error}</p>}
            {channel && (
                <div className="bg-white p-4 rounded-lg shadow-md mb-4">
                    <h2 className="text-2xl font-bold mb-2">Channel - {channel.youtuber.channelName} | <span className='text-xl text-sky-500'>{channel.youtuber.channelUrl}</span></h2>
                </div>
            )}
            <div className="bg-white rounded-lg shadow-md mb-4 container mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white p-6 rounded shadow">
                        <h2 className="text-2xl font-bold mb-4">Pending Videos: {videos.length}</h2>
                        <hr className="border-black border-1"></hr>
                        {videos.length === 0 ? ('') : (
                            videos.map((video) => (
                                <div key={video._id} className="bg-white p-4 rounded-lg shadow-md mb-4">
                                    <h3 className="text-xl font-bold">{video.title}</h3>
                                    <p>{video.description}</p>
                                </div>
                            ))
                        )}
                    </div>
                    <div className="bg-white p-6 rounded shadow">

                        <form className="bg-white p-4 rounded-lg shadow-md" onSubmit={handleUpload}>
                            <h2 className="text-2xl font-bold mb-4">Upload Video</h2>
                            <input
                                type="text"
                                placeholder="Title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                                className="w-full p-2 mb-4 border rounded"
                            />
                            <textarea
                                placeholder="Description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                required
                                className="w-full p-2 mb-4 border rounded"
                            ></textarea>
                            <input
                                type="file"
                                onChange={(e) => setFile(e.target.files[0])}
                                required
                                className="w-full p-2 mb-4 border rounded"
                            />
                            <button type="submit" className="bg-gray-800 text-white w-full py-2 rounded-lg" disabled={vdoUploading}>
                                {vdoUploading ? 'Uploading Video ...' : 'Upload Video'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChannelDetails;
