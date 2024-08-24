import { useState, useEffect, useContext } from 'react';
import axiosInstance from '../utils/AxiosInstance';
import { useParams, Navigate, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Loader from '../components/Loader';

const ApproveVideo = () => {
    const { id: id } = useParams();
    const { user, loading } = useContext(AuthContext);
    const [video, setVideo] = useState({});
    const [message, setMessage] = useState('');
    const [uploading, setUploading] = useState(false);
    // const [rejecting, setRejecting] = useState(false);
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
                } else {
                    setMessage('Error fetching pending video');
                }
            } catch (message) {
                console.error('Error fetching pending video:', message);
                setMessage('Error fetching pending video');
            } finally {
                setTimeout(() => setMessage(''), 3000)
                setFetching(false)
            }
        };
        fetchPendingVideo();
    }, [user, loading, id, uploading]);

    if (fetching) {
        return <Loader />
    }
    const handleApprove = async (id) => {
        setUploading(true);
        try {
            const response = await axiosInstance.put(`/video/youtuber/approve/${id}`, { status: 'Approved' }, { withCredentials: true });
            if (response.status === 200) {
                setMessage('Video uploaded successfully');
                setTimeout(() => {
                    navigate("/youtuber/dashboard");
                }, 3500);
            }
        } catch (error) {
            console.error('Error uploading video:', error);
            setMessage('Error uploading video');
        } finally {
            setUploading(false);
        }
    };

    // const handleReject = async (id) => {
    //     setRejecting(true)
    //     try {
    //         await axiosInstance.put(`/video/youtuber/approve/${id}`, { status: 'Rejected' }, { withCredentials: true });
    //         setVideo('');
    //         setMessage('Video rejected successfully');
    //     } catch (error) {
    //         console.error('Error rejecting video:', error);
    //         setMessage('Error rejecting video');
    //     } finally {
    //         setRejecting(false)
    //     }
    // };

    // const videoPublishDate = new Date(video.publishAt).toLocaleString('en-IN', {
    //     timeZone: 'Asia/Kolkata',
    //     year: 'numeric',
    //     month: 'long',
    //     day: 'numeric',
    //     hour: '2-digit',
    //     minute: '2-digit',
    // });

    return (
        <div className="my-8 container mx-auto px-2 md:px-0">
            <div className="bg-img text-white py-4 px-6 rounded-3xl drop-shadow-2xl mb-8">
                <div className="flex flex-col items-center md:items-start justify-center w-full gap-3">
                    <h2 className="text-3xl font-bold mb-2 flex items-center justify-start gap-2 tracking-wider">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-8">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                        </svg> Hey <span className='font-lowballBold'>{user.channelName} !</span>
                    </h2>
                </div>
            </div>
            <div className="bg-img text-white p-2 md:p-6 rounded-3xl drop-shadow-2xl">                
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">🎬 Video Details
                </h2>
                <hr className="border-white border-1 mb-4"></hr>
                <div className="flex flex-col gap-3">
                    {video && (<>
                        <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-3">
                            <div className='flex flex-col gap-2 md:gap-4 flex-grow w-full'>
                                <div className="flex flex-col">
                                    <label className='label mt-4 mb-1 ms-1 font-lowballRegular text-xl tracking-wider'>Title</label>
                                    <div className='bg-[#1d1d1d] p-3 rounded text-xl'>{video.title}</div>
                                </div>
                                <div className="flex flex-col">
                                    <label className='label mt-4 mb-1 ms-1 font-lowballRegular text-xl tracking-wider'>Description</label>
                                    <div className='bg-[#1d1d1d] p-3 rounded text-xl'>{video.description}</div>
                                </div>
                                <div className="flex flex-col md:flex-row items-center justify-center gap-3">
                                    <div className="flex flex-col w-full">
                                        <label className='label mt-4 mb-1 ms-1 font-lowballRegular text-xl tracking-wider'>Tags</label>
                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {video.tags.map((tag, index) => (
                                                <span key={index} className="bg-[#1d1d1d] text-white px-4 py-1 rounded-full cursor-pointer">
                                                    {tag} &times;
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="flex flex-col w-full">
                                        <label className='label mt-4 mb-1 ms-1 font-lowballRegular text-xl tracking-wider'>Privacy</label>
                                        <div className='bg-[#1d1d1d] p-3 rounded text-xl'>{video.privacyStatus}</div>
                                    </div>
                                </div>
                                {/* {video.privacyStatus !== 'private' && (
                                <div className="flex flex-col">
                                    <label className='label mt-4 mb-1 ms-1 font-lowballRegular text-xl tracking-wider'>Publish At</label>
                                    <div className='bg-[#1d1d1d] p-3 rounded text-xl'>{videoPublishDate}</div>
                                </div>
                            )} */}
                                <div className="flex flex-col md:flex-row items-center justify-between gap-3">
                                    <div className="flex flex-col w-full">
                                        <label className='label mt-4 mb-1 ms-1 font-lowballRegular text-xl tracking-wider'>Thumbnail</label>
                                        <img src={video.thumbnailSignedUrl} className='w-full h-auto rounded-lg drop-shadow-2xl' alt={`${video.title} thumbnail`} />
                                    </div>
                                    <div className="flex flex-col w-full">
                                        <label className='label mt-4 mb-1 ms-1 font-lowballRegular text-xl tracking-wider'>Video</label>
                                        <video controls className='w-full h-auto m-auto rounded'>
                                            <source src={video.videoSignedUrl} type="video/mp4" />
                                            Your browser does not support the video tag.
                                        </video>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-2 mt-4">
                            <button type="submit" onClick={() => handleApprove(video._id)} className={`brandBtn drop-shadow-2xl text-white w-full py-2 rounded-lg flex items-center justify-center gap-2 ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`} disabled={uploading}>
                                {uploading ? 'Uploading ...' : 'Upload'}
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75Z" />
                                </svg>
                            </button>
                            {/* <button type="submit" onClick={() => handleReject(video._id)} className={`brandBtnOutline drop-shadow-2xl text-white w-full py-2 rounded-lg flex items-center justify-center gap-2 ${uploading || rejecting ? 'opacity-50 cursor-not-allowed' : ''}`} disabled={uploading || rejecting}>
                                {rejecting ? 'Rejecting ...' : 'Reject'}
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 0 0 5.636 5.636m12.728 12.728A9 9 0 0 1 5.636 5.636m12.728 12.728L5.636 5.636" />
                                </svg>
                            </button> */}
                        </div>
                    </>
                    )}
                    {message && <p className="bg-white text-[#ff0000] p-2 py-0 rounded-lg shadow-md my-4 text-lg text-center">{message}</p>}
                </div>
            </div>
        </div >
    );
};

export default ApproveVideo;
