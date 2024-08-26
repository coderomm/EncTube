import { useState, useEffect, useContext } from 'react';
import axiosInstance from '../utils/AxiosInstance';
import { useParams, Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Loader from '../components/Loader';
import BackButton from '../components/BackButton';

const AddVideo = () => {
    const { id: channelId } = useParams();
    const { user, loading } = useContext(AuthContext);
    const [channel, setChannel] = useState(null);
    const [videos, setVideos] = useState([]);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [tags, setTags] = useState([]);
    const [currentTag, setCurrentTag] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [defaultLanguage, setDefaultLanguage] = useState('en');
    const [privacyStatus, setPrivacyStatus] = useState('private');
    const [notifySubscribers, setNotifySubscribers] = useState(false);
    const [embeddable, setEmbeddable] = useState(false);
    const [license, setLicense] = useState('youtube');
    const [publicStatsViewable, setPublicStatsViewable] = useState(false);
    // const [publishAt, setPublishAt] = useState('');
    const [selfDeclaredMadeForKids, setSelfDeclaredMadeForKids] = useState(true);
    const [categories, setCategories] = useState([]);
    const [file, setFile] = useState(null);
    const [thumbnail, setThumbnail] = useState(null);
    const [going, setGoing] = useState(true);
    const [message, setMessage] = useState('');
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        if (loading) {
            return <Loader />
        }
        if (!loading && (!user || user.role !== 'Editor')) {
            return <Navigate to="/editor/login" />;
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

        const fetchPendingVideo = async () => {
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
                setCategories(response.data);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };
        fetchCategories();
        fetchChannelDetails();
        fetchPendingVideo();
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
        formData.append('tags', JSON.stringify(tags));
        formData.append('categoryId', categoryId);
        formData.append('defaultLanguage', defaultLanguage);
        formData.append('privacyStatus', privacyStatus);
        formData.append('license', license);
        if (privacyStatus !== 'private') {
            formData.append('publicStatsViewable', publicStatsViewable);
            // formData.append('publishAt', publishAt);
            formData.append('notifySubscribers', notifySubscribers);
            formData.append('embeddable', embeddable);
        }
        formData.append('file', file);
        formData.append('thumbnail', thumbnail);
        formData.append('channelId', channelId);
        formData.append('editorId', user.userId);
        try {
            const response = await axiosInstance.post('/video/editor/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setVideos([...videos, response.data]);
            setTitle('');
            setDescription('');
            setTags([]);
            setCategoryId('');
            setDefaultLanguage('');
            setPrivacyStatus('private');
            setNotifySubscribers(true);
            setEmbeddable(true);
            setLicense('youtube');
            setPublicStatsViewable(true);
            // setPublishAt('');
            setSelfDeclaredMadeForKids(false);
            setFile(null);
            setMessage('Video uploaded successfully!');
        } catch (message) {
            console.error('Error uploading video:', message);
            setMessage('Error uploading video');
        } finally {
            setUploading(false);
            setTimeout(() => {
                setMessage('')
            }, 3000)
        }
    };

    const handleTagInput = (e) => {
        const value = e.target.value;
        if (value.includes(',')) {
            const newTags = value.split(',').map(tag => tag.trim()).filter(tag => tag !== '');
            setTags([...tags, ...newTags]);
            setCurrentTag('');
        } else {
            setCurrentTag(value);
        }
    };

    const removeTag = (index) => {
        setTags(tags.filter((_, i) => i !== index));
    };

    if (going) {
        return <Loader />;
    }

    return (
        <section className="my-8 container mx-auto px-2 md:px-0">
            <BackButton/>
            {channel && (
                <div className="bg-img rounded-2xl text-white p-4 drop-shadow-2xl mb-4 flex flex-row items-center justify-center md:justify-start">
                    <h2 className="text-2xl font-lowballRegular tracking-widest md:mb-2 flex items-center justify-start gap-2"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    </svg>Channel - <nbsp></nbsp>
                    </h2>
                    <h3 className='text-2xl text-[#999] font-lowballBold tracking-wider'> {channel.youtuber.channelName}</h3>
                </div>
            )}
            {/* <hr className="border-white border-1 mb-4"></hr> */}
            <div className="mb-4 grid grid-cols-1 gap-4">
                <div className="bg-img rounded-2xl text-white p-4 drop-shadow-2xl">
                    <h2 className="text-2xl font-lowballRegular tracking-widest mb-1 flex items-center justify-start gap-2"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0M3.124 7.5A8.969 8.969 0 0 1 5.292 3m13.416 0a8.969 8.969 0 0 1 2.168 4.5" />
                    </svg> Awaiting Approval - {videos.length}</h2>
                    {videos.length > 0 ? <p className=" mb-4 text-lg tracking-wider text-[#999999]">These videos are currently under review and will be published once approved.</p> : ''}
                    {videos.length === 0 ? ('') : (
                        videos.map(video => (
                            <div key={video._id} className="bg-[#141414d1]bg-img rounded-2xl text-white ed-lgw-2xl mb-4">
                                <h3 className="text-xl tex-xl">Title: <span className='font-lowballRegular tracking-wider'> {video.title}</span></h3>
                                <p className="text-lg tex-xl">Added on: <span className='font-lowballRegular tracking-wider'>{new Date(video.createdAt).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    second: '2-digit'
                                })}</span></p>
                            </div>
                        ))
                    )}
                </div>
                <hr className="border-white border-1"></hr>
                <div className="bg-img rounded-2xl text-white p-4">
                    <form onSubmit={handleUpload}>
                        <h2 className="text-2xl font-lowballRegular tracking-widest mb-1">🎬 Add/Upload New Video</h2>
                        <p className=" mb-12 text-lg tracking-wider text-[#999999]">Upload your video and enter all the details for review, just like in YouTube Studio.</p>
                        <label className="label mt-4 mb-1 ms-1">Enter the title of the video</label>
                        <input
                            type="text"
                            placeholder="Title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            className="w-full mb-4 px-4 py-2 border rounded-lg bg-transparent"
                        />
                        <label className="label mt-4 mb-1 ms-1">Enter the description of the video</label>
                        <textarea
                            placeholder="Description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                            className="w-full mb-4 px-4 py-2 border rounded-lg bg-transparent"
                        ></textarea>
                        <label className="label mt-4 mb-1 ms-1">Upload a thumbnail of this video</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setThumbnail(e.target.files[0])}
                            required
                            className="w-full mb-4 px-4 py-2 border rounded-lg bg-transparent"
                        />
                        <label className="label mt-4 mb-1 ms-1" disabled={privacyStatus === 'private'}>Choose & upload the video</label>
                        <input
                            type="file"
                            onChange={(e) => setFile(e.target.files[0])}
                            required
                            className="w-full mb-4 px-4 py-2 border rounded-lg bg-transparent"
                        />
                        <p className="mt-4 mb-1 ms-1 text-2xl font-lowballRegular tracking-wider">Tags & Metadata -</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 md:gap-3">
                            <div className="flex flex-col items-start">
                                <label className="label mt-4 mb-1 ms-1">Enter tags seprated by comma (,)</label>
                                <input
                                    type="text"
                                    placeholder="Tags (comma separated)"
                                    value={currentTag}
                                    onChange={handleTagInput}
                                    className="w-full mb-4 px-4 py-2 border rounded-lg bg-transparent"
                                />
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {tags.map((tag, index) => (
                                        <span key={index} className="bg-gray-800 text-white px-2 py-1 rounded-full cursor-pointer" onClick={() => removeTag(index)}>
                                            {tag} &times;
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <div className="flex flex-col items-start">
                                <label className="label mt-4 mb-1 ms-1">Video language (selected &apos;en&apos; default)</label>
                                <input
                                    type="text"
                                    placeholder="Default Language (e.g., 'en')"
                                    value={defaultLanguage}
                                    disabled
                                    onChange={(e) => setDefaultLanguage(e.target.value)}
                                    className="w-full mb-4 px-4 py-2 border rounded-lg bg-transparent"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 md:gap-3">
                            <div className="flex flex-col items-start">
                                <label className="label mt-4 mb-1 ms-1">Choose category</label>
                                <select
                                    value={categoryId}
                                    onChange={(e) => setCategoryId(e.target.value)}
                                    required
                                    className="w-full mb-4 px-4 py-2 border rounded-lg bg-transparent"
                                >
                                    <option className='text-white bg-[#1d1d1d]' value="">Select a category</option>
                                    {categories.map(category => (
                                        <option className='text-white bg-[#1d1d1d]' key={category.id} value={category.id}>
                                            {category.title}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex flex-col items-start">
                                <label className="label mt-4 mb-1 ms-1">Choose visibility</label>
                                <select
                                    value={privacyStatus}
                                    onChange={(e) => {
                                        setPrivacyStatus(e.target.value)
                                        if (e.target.value === 'private') {
                                            setPublicStatsViewable(false);
                                            // setPublishAt('');
                                            setNotifySubscribers(false)
                                            setEmbeddable(false)
                                        }
                                    }}
                                    required
                                    className="w-full mb-4 px-4 py-2 border rounded-lg bg-transparent"
                                >
                                    <option className='text-white bg-[#1d1d1d]' value="private">Private</option>
                                    <option className='text-white bg-[#1d1d1d]' value="public">Public</option>
                                    <option className='text-white bg-[#1d1d1d]' value="unlisted">Unlisted</option>
                                </select>
                            </div>
                            <div className="flex flex-col items-start">
                                <label className="label mt-4 mb-1 ms-1">Choose license</label>
                                <select
                                    value={license}
                                    onChange={(e) => setLicense(e.target.value)}
                                    required
                                    className="w-full mb-4 px-4 py-2 border rounded-lg bg-transparent"
                                >
                                    <option className='text-white bg-[#1d1d1d]' value="youtube">YouTube License</option>
                                    <option className='text-white bg-[#1d1d1d]' value="creativeCommon">Creative Commons</option>
                                </select>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-4 md:gap-3">
                            <label className="flex items-center mb-4">
                                <input
                                    type="checkbox"
                                    checked={notifySubscribers}
                                    onChange={(e) => setNotifySubscribers(e.target.checked)}
                                    className="mr-2"
                                    disabled={privacyStatus === 'private'}
                                />
                                Notify Subscribers
                            </label>
                            <label className="flex items-center mb-4">
                                <input
                                    type="checkbox"
                                    checked={embeddable}
                                    onChange={(e) => setEmbeddable(e.target.checked)}
                                    className="mr-2"
                                    disabled={privacyStatus === 'private'}
                                />
                                Embeddable
                            </label>
                            <label className="flex items-center mb-4">
                                <input
                                    type="checkbox"
                                    checked={publicStatsViewable}
                                    onChange={(e) => setPublicStatsViewable(e.target.checked)}
                                    className="mr-2"
                                    disabled={privacyStatus === 'private'}
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
                        {/* <div className="grid grid-cols-1 md:grid-cols-3 md:gap-3">
                                <div className="flex flex-col items-start">
                                    <label className="label mt-4 mb-1 ms-1" disabled={privacyStatus === 'private'}>Select date & time to schedule</label>
                                    <input
                                        type="datetime-local"
                                        value={publishAt}
                                        onChange={(e) => setPublishAt(e.target.value)}
                                        className="w-full mb-4 px-4 py-2 border rounded-lg bg-white text-black"
                                        disabled={privacyStatus === 'private'}
                                    />
                                </div>
                            </div> */}
                        <button type="submit" className={`brandBtn font-lowballBold text-xl tracking-wider mt-6 drop-shadow-2xl text-white w-full py-2 rounded-lg flex items-center justify-center gap-2 ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`} disabled={uploading}>
                            {uploading ? 'Uploading ...' : 'Upload'}
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75Z" />
                            </svg>
                        </button>
                        {message && <p className="text-white shadow-md my-4 text-lg text-center">{message}</p>}
                    </form>
                </div>
            </div >
        </section >
    );
};

export default AddVideo;
