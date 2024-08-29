import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import axiosInstance from '../utils/AxiosInstance';
import { Navigate } from 'react-router-dom';
import Loader from '../components/Loader';
import BackButton from '../components/BackButton';

function EditorsList() {
    const { user, loading } = useContext(AuthContext);
    const [editors, setEditors] = useState([]);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [fetching, setFetching] = useState(false);

    const fetchEditors = async () => {
        setFetching(true);
        try {
            const response = await axiosInstance.get('/youtuber/channel/editors');
            setEditors(response.data);
        } catch (error) {
            console.error('Error fetching channels editors:', error);
            setError('Error fetching editors');
        } finally {
            setFetching(false);
        }
    };

    useEffect(() => {
        if (loading) {
            return <Loader />;
        }

        if (!user || user.role !== 'YouTuber') {
            return <Navigate to="/youtuber/login" />;
        } else {
            console.log('user in EDitorList:', user)
            fetchEditors();
        }
    }, [user, loading]);

    const handleRemoveEditor = async (editorId) => {
        try {
            const response = await axiosInstance.delete('/youtuber/channel/editor/remove', {
                data: {
                    editorId: editorId
                }
            }
            );
            if (response.status === 200) {
                setMessage('Editor removed successfully');
                fetchEditors();
            }
        } catch (error) {
            console.error('Error removing editor:', error);
            setMessage('Failed to remove editor');
        } finally {
            setTimeout(() => {
                setMessage('')
            }, 3500)
        }
    };

    return (
        <section className="my-8 container mx-auto px-2 md:px-0">
            <BackButton />
            {error && <p className="bg-[#ff0000] p-4 py-2 rounded-lg shadow-md mb-4 text-white text-lg">{error}</p>}
            {message && <p className="bg-[#ff0000] p-4 py-2 rounded-lg shadow-md mb-4 text-white text-lg">{message}</p>}

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
                                <>
                                    <div key={editor.editorId} className="flex flex-col gap-3 md:flex-row justify-between mb-4 p-2 rounded-lg">
                                        <li>
                                            <p className='text-2xl tracking-wider'><span className='text-[#999] font-lowballRegular tracking-wider'>- Editor name : </span>{editor.editorName}</p>
                                            <p className='text-2xl tracking-wider'><span className='text-[#999] font-lowballRegular tracking-wider'>- Email address : </span>{editor.editorEmail}</p>
                                            <p className='text-2xl tracking-wider'><span className='text-[#999] font-lowballRegular tracking-wider'>- Videos added to platform : </span>{editor.totalVideos}</p>
                                            <p className='text-2xl tracking-wider'><span className='text-[#999] font-lowballRegular tracking-wider'>- Videos published to youtube : </span>{editor.approvedVideos}</p>
                                        </li>
                                        <button onClick={() => handleRemoveEditor(editor.editorId)} type='button' className='brandBtn flex items-center justify-center gap-3 py-2 px-5 md:h-16 rounded-full'>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M22 10.5h-6m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM4 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 10.374 21c-2.331 0-4.512-.645-6.374-1.766Z" />
                                            </svg> Remove Editor</button>
                                    </div>
                                    <hr className="border-[#1d1d1d] border-1 mb-4"></hr>
                                </>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </section>
    );
}

export default EditorsList;