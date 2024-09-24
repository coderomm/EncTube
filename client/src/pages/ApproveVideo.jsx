import { useState, useEffect, useContext } from 'react';
import axiosInstance from '../utils/AxiosInstance';
import { useParams, Navigate, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Loader from '../components/Loader';
import BackButton from '../components/BackButton';
import { toast } from 'sonner';

const ApproveVideo = () => {
    const { id: id } = useParams();
    const { user, loading } = useContext(AuthContext);
    const [video, setVideo] = useState({});
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [tags, setTags] = useState([]);
    const [currentTag, setCurrentTag] = useState('');
    const [privacyStatus, setPrivacyStatus] = useState('');
    // const [message, setMessage] = useState('');
    const [uploading, setUploading] = useState(false);
    const [rejecting, setRejecting] = useState(false);
    const [fetching, setFetching] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        if (loading) {
            return <Loader />
        }
        if (!loading && (!user || user.role !== 'YouTuber')) {
            return <Navigate to="/youtuber/login" />;
        }

        const fetchPendingVideo = async () => {
            try {
                const response = await axiosInstance.get(`/video/youtuber/pending/${id}`);
                if (response.status === 200) {
                    setVideo(response.data);
                    setVideo(response.data);
                    setTitle(response.data.title);
                    setDescription(response.data.description);
                    setTags(response.data.tags);
                    setPrivacyStatus(response.data.privacyStatus);
                } else {
                    toast.error('Error fetching pending video');
                }
            } catch (message) {
                console.error('Error fetching pending video:', message);
                toast.error('Error fetching pending video');
            } finally {
                setFetching(false)
            }
        };
        fetchPendingVideo();
    }, [user, loading, id]);

    if (fetching) {
        return <Loader />
    }
    const handleApprove = async (id) => {
        setUploading(true);
        try {
            const response = await axiosInstance.put(`/video/youtuber/approve/${id}`, {
                status: 'Approved',
                title,
                description,
                tags,
                privacyStatus,
            });
            if (response.status === 200) {
                toast.success('Video uploaded successfully');
                setTimeout(() => {
                    navigate("/youtuber/dashboard");
                }, 3500);
            }
        } catch (error) {
            console.error('Error uploading video:', error);
            toast.error('Error uploading video');
        } finally {
            setUploading(false);
            setTimeout(() => {
                navigate('/youtuber/dashboard');
            }, 3500)
        }
    };

    const handleReject = async (id) => {
        setRejecting(true)
        try {
            const response = await axiosInstance.put(`/video/youtuber/approve/${id}`, { status: 'Rejected' });
            console.log('vdo reject res:', response)
            setVideo('');
            toast.success('Video removed successfully');
        } catch (error) {
            console.error('Error rejecting video:', error);
            toast.error('Error rejecting video');
        } finally {
            setRejecting(false)
            setTimeout(() => {
                navigate('/youtuber/dashboard');
            }, 3500)
        }
    };

    const handleTagInput = (e) => {
        const value = e.target.value;
        if (value.includes(',')) {
            const newTags = value.split(',').map(tag => tag.trim()).filter(tag => tag !== '');
            setTags([...tags, ...newTags]);
            setCurrentTag('');
        }
        else {
            setCurrentTag(value);
        }
    };

    const removeTag = (index) => {
        setTags(tags.filter((_, i) => i !== index));
    };

    return (
        <section className="my-8 container mx-auto px-2 md:px-0">
            <BackButton />
            <div className="bg-img rounded-3xl text-white py-4 px-2 md:px-6 drop-shadow-2xl mb-8">
                <div className="flex flex-col items-center justify-center w-full gap-3">
                    <div className="font-lowballBold tracking-wider md:mb-2 flex flex-col gap-2">
                        <h2 className='font-bold text-2xl flex items-center justify-start gap-2'>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-8">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                            </svg> Hey Welcome
                        </h2>
                        <div className="flex">
                            <div className="rounded-full w-16 h-1w-16 flex justify-center mt-1 mr-3">
                                <img className='w-full rounded-full' src={user.channelLogo}></img>
                            </div>
                            <div className="flex flex-col justify-center">
                                <h3 className='text-xl font-lowballRegular tracking-wider'>{user.channelName}</h3>
                                <p className='font-lowballRegular tracking-wider'>{user.channelUrl}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-img text-white p-2 py-6 md:p-12 rounded-3xl drop-shadow-2xl">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">🎬 Video Details</h2>
                <p className=" mb-12 text-lg tracking-wider text-[#999999]">Feel free to make edits before publishing it to your channel.</p>
                <hr className="border-white border-1 mb-4"></hr>
                <div className="flex flex-col gap-3">
                    {video && (<>
                        <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-3">
                            <div className='flex flex-col gap-2 md:gap-4 flex-grow w-full'>
                                <div className="relative mt-4 mb-1">
                                    <label htmlFor="title" className="label mt-4 mb-1 ms-1 font-lowballRegular text-xl tracking-wider">
                                        Title (required)
                                    </label>
                                    <textarea
                                        id="title"
                                        placeholder="Add a title that describe video"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        required
                                        className="w-full px-3 py-5 border rounded bg-transparent border-gray-500 focus:ring-0 peer text-gray-100 resize-none overflow-hidden h-36 md:h-24 lg:h-12 lg:py-0 lg:pt-2 text-xl"
                                        minLength={1}
                                        maxLength={100}
                                        rows={3}
                                    ></textarea>
                                    <span className="absolute bottom-2 right-4 text-gray-400 text-sm">{title.length}/100</span>
                                </div>
                                <div className="relative mt-4 mb-1">
                                    <label className="label mt-4 mb-1 ms-1 font-lowballRegular text-xl tracking-wider">Description</label>
                                    <textarea
                                        placeholder="Write description about video"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        required
                                        minLength={1}
                                        maxLength={5000}
                                        className="w-full px-3 py-5 border rounded bg-transparent border-gray-500 focus:ring-0 peer text-gray-100 resize-none h-96 lg:py-4 text-xl"
                                    ></textarea>
                                    <span className="absolute bottom-2 right-4 text-gray-400 text-sm">{description.length}/5000</span>
                                </div>
                                <div className="flex flex-col md:flex-row items-start justify-center gap-3">
                                    <div className="flex flex-col w-full gap-3">
                                        <div className="flex flex-col w-full">
                                            <label className='label mt-4 mb-1 ms-1 font-lowballRegular text-xl tracking-wider'>Tags</label>
                                            <input
                                                type="text"
                                                placeholder="Tags (comma separated)"
                                                value={currentTag}
                                                onChange={handleTagInput}
                                                className="bg-transparent border p-3 rounded text-xl border-gray-500"
                                            />
                                        </div>
                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {tags.map((tag, index) => (
                                                <span key={index} className="bg-gray-500 text-white px-4 py-1 rounded-full cursor-pointer" onClick={() => removeTag(index)}>
                                                    {tag} &times;
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="flex flex-col w-full">
                                        <label className='label mt-4 mb-1 ms-1 font-lowballRegular text-xl tracking-wider'>Privacy</label>
                                        <select
                                            value={privacyStatus}
                                            onChange={(e) => setPrivacyStatus(e.target.value)}
                                            required
                                            className="bg-transparent border p-3 rounded text-xl border-gray-500"
                                        >
                                            <option className='text-white bg-[#1d1d1d]' value="private">Private</option>
                                            <option className='text-white bg-[#1d1d1d]' value="public">Public</option>
                                            <option className='text-white bg-[#1d1d1d]' value="unlisted">Unlisted</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="flex flex-col md:flex-row items-center justify-between gap-3">
                                    <div className="flex flex-col w-full">
                                        <label className='label mt-4 mb-1 ms-1 font-lowballRegular text-xl tracking-wider'>Thumbnail</label>
                                        <img src={video.thumbnailSignedUrl} className='border-gray-500 w-full h-auto rounded drop-shadow-2xl' alt={`${video.title} thumbnail`} />
                                    </div>
                                    <div className="flex flex-col w-full">
                                        <label className='label mt-4 mb-1 ms-1 font-lowballRegular text-xl tracking-wider'>Video</label>
                                        <video controls className='border-gray-500 w-full h-auto m-auto rounded'>
                                            <source src={video.videoSignedUrl} type="video/mp4" />
                                            Your browser does not support the video tag.
                                        </video>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-2 mt-4">
                            <button type="submit" onClick={() => handleApprove(video._id)} className={`brandBtn drop-shadow-2xl text-white w-full py-2 rounded flex items-center justify-center gap-2 ${uploading || rejecting ? 'opacity-50 cursor-not-allowed' : ''}`} disabled={uploading || rejecting}>
                                {uploading ? 'Uploading ...' : 'Upload'}
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75Z" />
                                </svg>
                            </button>
                            <button type="submit" onClick={() => handleReject(video._id)} className={`brandBtnOutline drop-shadow-2xl text-white w-full py-2 rounded flex items-center justify-center gap-2 ${uploading || rejecting ? 'opacity-50 cursor-not-allowed' : ''}`} disabled={uploading || rejecting}>
                                {rejecting ? 'Rejecting ...' : 'Reject'}
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 0 0 5.636 5.636m12.728 12.728A9 9 0 0 1 5.636 5.636m12.728 12.728L5.636 5.636" />
                                </svg>
                            </button>
                        </div>
                    </>
                    )}
                </div>
            </div>
        </section >
    );
};

export default ApproveVideo;
