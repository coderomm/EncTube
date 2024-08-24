import { useState, useEffect, useContext, useCallback } from 'react';
import { AuthContext } from '../context/AuthContext';
import axiosInstance from '../utils/AxiosInstance';
import { Link, Navigate } from 'react-router-dom';
import Loader from '../components/Loader';

function EditorsList() {
    const { user, loading } = useContext(AuthContext);
    const [editors, setEditors] = useState([]);
    const [error, setError] = useState('');
    const [fetching, setFetching] = useState(false);

    const handleFetchEditors = useCallback(async () => {
        setFetching(true);
        try {
            const response = await axiosInstance.get(`/channel/editors`);
            setEditors(response.data);
        } catch (error) {
            console.error('Error fetching editors:', error);
            setError('Error fetching editors');
        } finally {
            setFetching(false);
        }
    }, []);

    useEffect(() => {
        if (loading) {
            return <Loader />;
        }

        if (!user || user.role !== 'YouTuber') {
            return <Navigate to="/youtuber/login" />;
        } else {
            handleFetchEditors();
        }
    }, [user, loading, handleFetchEditors]);

    return (
        <div className="my-8 container mx-auto px-2 md:px-0">
            {error && <p className="bg-[#ff0000] p-4 py-2 rounded-lg shadow-md mb-4 text-white text-lg">{error} !!!</p>}

            <div className="bg-img text-white py-4 px-6 rounded-3xl drop-shadow-2xl mb-8">
                <div className="flex flex-col items-center md:items-start justify-center w-full gap-3">
                    <h2 className="text-3xl font-bold mb-2 flex items-center justify-start gap-2 tracking-wider">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-8">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                        </svg> Hey <span className='font-lowballBold'>{user.channelName} !</span>
                    </h2>
                    <div className="flex items-center justify-center gap-3 flex-wrap">
                        <Link to={'invite-editor'} className="brandBtn text-white hover:text-gray-200 px-5 py-2 rounded flex items-center justify-start gap-2 text-lg">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z" />
                            </svg> Invite Editor
                        </Link>
                    </div>
                </div>
            </div>

            <div className="bg-img text-white p-3 md:px-6 rounded-3xl drop-shadow-2xl min-h-[25vh]">
                <h2 className="text-2xl font-bold mb-4 flex items-center justify-start">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                    </svg>&nbsp;
                    <span className=''>Editors with Access:</span>&nbsp;{editors.length}
                </h2>
                <hr className="border-white border-1 mb-4"></hr>
                {fetching ? (
                    <p><Loader /></p>
                ) : editors.length > 0 && (
                    <div className="mt-4">
                        <ul className="text-white rounded-lg drop-shadow-2xl">
                            {editors.map((editor) => (
                                <div key={editor.editorId} className="flex flex-col md:flex-row justify-between bg-[#1d1d1d] mb-4 p-2 rounded-lg">
                                    <li className="">
                                        <p className='md:text-xl'><span className='text-[#999]'>- Editor name: </span><strong className=''>{editor.editorName}</strong></p>
                                        <p className='md:text-xl'><span className='text-[#999]'>- Mail @: </span>{editor.editorEmail}</p>
                                        <p className='md:text-xl'><span className='text-[#999]'>- Total Videos: </span>{editor.totalVideos}</p>
                                        <p className='md:text-xl'><span className='text-[#999]'>- Approved Videos: </span>{editor.approvedVideos}</p>
                                    </li>

                                </div>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
}

export default EditorsList;
