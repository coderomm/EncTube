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
    const [tags, setTags] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [defaultLanguage, setDefaultLanguage] = useState('');
    const [privacyStatus, setPrivacyStatus] = useState('private');
    const [notifySubscribers, setNotifySubscribers] = useState(true);
    const [embeddable, setEmbeddable] = useState(true);
    const [license, setLicense] = useState('youtube');
    const [publicStatsViewable, setPublicStatsViewable] = useState(true);
    const [publishAt, setPublishAt] = useState('');
    const [selfDeclaredMadeForKids, setSelfDeclaredMadeForKids] = useState(false);
    const [categories, setCategories] = useState([]);
    const [file, setFile] = useState(null);
    const [going, setGoing] = useState(true);
    const [message, setMessage] = useState('');
    const [uploading, setUploading] = useState(false);

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
            } catch (message) {
                console.error('Error fetching channel details:', message);
                setMessage('Error fetching channel details');
            }
        };

        const fetchPendingVideos = async () => {
            try {
                const response = await axiosInstance.get(`/video/editor/pending?channelId=${channelId}`);
                setVideos(response.data);
            } catch (message) {
                console.error('Error fetching pending videos:', message);
                setMessage('Error fetching pending videos');
            } finally {
                setGoing(false);
            }
        };

        const fetchCategories = async () => {
            try {
                const response = await axiosInstance.get('/youtube/categories');
                console.log('fetchCategories res:', response)
                setCategories(response.data);
            } catch (message) {
                console.error('Error fetching categories:', message);
            }
        };
        fetchCategories();
        fetchChannelDetails();
        fetchPendingVideos();
    }, [user, loading, channelId, uploading]);

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!title || !description || !categoryId || !file) {
            setMessage('Please fill all required fields and select a file to upload.');
            return;
        }
        setUploading(true);
        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('tags', tags.split(',').map(tag => tag.trim()));
        formData.append('categoryId', categoryId);
        formData.append('defaultLanguage', defaultLanguage);
        formData.append('privacyStatus', privacyStatus);
        formData.append('notifySubscribers', notifySubscribers);
        formData.append('embeddable', embeddable);
        formData.append('license', license);
        formData.append('publicStatsViewable', publicStatsViewable);
        formData.append('publishAt', publishAt);
        formData.append('selfDeclaredMadeForKids', selfDeclaredMadeForKids);
        formData.append('file', file);
        formData.append('channelId', channelId);
        formData.append('editorId', user.userId);
        try {
            const response = await axiosInstance.post('/video/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setVideos([...videos, response.data]);
            setTitle('');
            setDescription('');
            setTags('');
            setCategoryId('');
            setDefaultLanguage('');
            setPrivacyStatus('private');
            setNotifySubscribers(true);
            setEmbeddable(true);
            setLicense('youtube');
            setPublicStatsViewable(true);
            setPublishAt('');
            setSelfDeclaredMadeForKids(false);
            setFile(null);
            setMessage('Video uploaded successfully!');
        } catch (message) {
            console.error('Error uploading video:', message);
            setMessage('Error uploading video');
        } finally {
            setUploading(false);
            setMessage('');
        }
    };

    if (going) {
        return <div>Loading...</div>;
    }

    return (
        <div className="my-8 container mx-auto px-4 md:px-0">
            {message && <p className="bg-white p-4 rounded-lg drop-shadow-2xl mb-4 text-red-600">{message}</p>}
            {channel && (
                <div className="bg-white p-4 rounded-lg drop-shadow-2xl mb-4 sm:flex items-center justify-start ">
                    <h2 className="text-2xl font-bold mb-2 flex items-center justify-start gap-2"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    </svg>Channel - <nbsp></nbsp>
                    </h2>
                    <h3 className='text-xl font-bold'> {channel.youtuber.channelName} | <span className='text-xl text-sky-500'>{channel.youtuber.channelUrl}</span></h3>
                </div>
            )}
            <div className="mb-4">
                <div className="grid grid-cols-1 gap-4">
                    <div className="bg-white p-4 rounded-lg drop-shadow-2xl">
                        <h2 className="text-2xl font-bold mb-4">Pending Videos: {videos.length}</h2>
                        <hr className="border-black border-1"></hr>
                        {videos.length === 0 ? ('') : (
                            videos.map((video) => (
                                <div key={video._id} className="bg-white p-4 rounded-lg drop-shadow-2xl mb-4">
                                    <h3 className="text-xl font-bold">{video.title}</h3>
                                    <p>{video.description}</p>
                                </div>
                            ))
                        )}
                    </div>
                    <div className="bg-white p-4 rounded-lg drop-shadow-2xl">
                        <form onSubmit={handleUpload}>
                            <h2 className="text-2xl font-bold mb-4">Enter video data...</h2>
                            <input
                                type="text"
                                placeholder="Title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                                className="w-full mb-4 px-4 py-2 border rounded-lg"
                            />
                            <textarea
                                placeholder="Description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                required
                                className="w-full mb-4 px-4 py-2 border rounded-lg"
                            ></textarea>
                            <input
                                type="text"
                                placeholder="Tags (comma separated)"
                                value={tags}
                                onChange={(e) => setTags(e.target.value)}
                                className="w-full mb-4 px-4 py-2 border rounded-lg"
                            />
                            <input
                                type="text"
                                placeholder="Default Language (e.g., 'en')"
                                value={defaultLanguage}
                                onChange={(e) => setDefaultLanguage(e.target.value)}
                                className="w-full mb-4 px-4 py-2 border rounded-lg"
                            />
                            <div className="grid grid-cols-1 md:grid-cols-2 md:gap-3">
                                <select
                                    value={categoryId}
                                    onChange={(e) => setCategoryId(e.target.value)}
                                    required
                                    className="w-full mb-4 px-4 py-2 border rounded-lg"
                                >
                                    <option value="">Select Category</option>
                                    {categories.map(category => (
                                        <option key={category.id} value={category.id}>
                                            {category.title}
                                        </option>
                                    ))}
                                </select>
                                <select
                                    value={privacyStatus}
                                    onChange={(e) => setPrivacyStatus(e.target.value)}
                                    required
                                    className="w-full mb-4 px-4 py-2 border rounded-lg"
                                >
                                    <option value="private">Private</option>
                                    <option value="public">Public</option>
                                    <option value="unlisted">Unlisted</option>
                                </select>
                            </div>
                            <select
                                value={license}
                                onChange={(e) => setLicense(e.target.value)}
                                required
                                className="w-full mb-4 px-4 py-2 border rounded-lg"
                            >
                                <option value="youtube">YouTube License</option>
                                <option value="creativeCommon">Creative Commons</option>
                            </select>
                            <div className="grid grid-cols-1 md:grid-cols-4 md:gap-3">
                                <label className="flex items-center mb-4">
                                    <input
                                        type="checkbox"
                                        checked={notifySubscribers}
                                        onChange={(e) => setNotifySubscribers(e.target.checked)}
                                        className="mr-2"
                                    />
                                    Notify Subscribers
                                </label>
                                <label className="flex items-center mb-4">
                                    <input
                                        type="checkbox"
                                        checked={embeddable}
                                        onChange={(e) => setEmbeddable(e.target.checked)}
                                        className="mr-2"
                                    />
                                    Embeddable
                                </label>
                                <label className="flex items-center mb-4">
                                    <input
                                        type="checkbox"
                                        checked={publicStatsViewable}
                                        onChange={(e) => setPublicStatsViewable(e.target.checked)}
                                        className="mr-2"
                                    />
                                    Public Stats Viewable
                                </label>
                                <label className="flex items-center mb-4">
                                    <input
                                        type="checkbox"
                                        checked={selfDeclaredMadeForKids}
                                        onChange={(e) => setSelfDeclaredMadeForKids(e.target.checked)}
                                        className="mr-2"
                                    />
                                    Made for Kids
                                </label>
                            </div>
                            <input
                                type="datetime-local"
                                value={publishAt}
                                onChange={(e) => setPublishAt(e.target.value)}
                                className="w-full mb-4 px-4 py-2 border rounded-lg"
                            />
                            <input
                                type="file"
                                onChange={(e) => setFile(e.target.files[0])}
                                required
                                className="w-full mb-4 px-4 py-2 border rounded-lg"
                            />
                            <button type="submit" className={`bg-gray-800 drop-shadow-2xl text-white w-full py-2 rounded-lg flex items-center justify-center gap-2 border-none hover:bg-gray-900 ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`} disabled={uploading}>
                                {uploading ? 'Uploading ...' : 'Upload'}
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
                                </svg>
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div >
    );
};

export default ChannelDetails;
