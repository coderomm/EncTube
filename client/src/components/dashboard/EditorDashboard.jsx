import { useState, useEffect, useContext, useCallback, useMemo } from 'react';
import { AuthContext } from '../../context/AuthContext';
import axiosInstance from '../../utils/AxiosInstance';
import { Navigate, useNavigate } from 'react-router-dom';
import Loader from '../Loader';

function EditorDashboard() {
    const { user, loading } = useContext(AuthContext);
    const [youtubeChannels, setYoutubeChannels] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const fetchChannels = useCallback(async () => {
        try {
            const response = await axiosInstance.get('/editor/channels');
            setYoutubeChannels(response.data);
        } catch (error) {
            console.error('Error fetching youtube channels:', error);
            setError('Error fetching youtube channels');
        }
    }, []);

    useEffect(() => {
        if (!loading && user && user.role === 'Editor') {
            fetchChannels();
        }
    }, [loading, user, fetchChannels]);

    const filteredChannels = useMemo(() => {
        return youtubeChannels.filter(youtuberChannel =>
            youtuberChannel.channelName.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [youtubeChannels, searchTerm]);

    const handleSelectChannel = (id) => {
        navigate(`/editor/channel/${id}`);
    };

    if (loading) {
        return <Loader />;
    }

    if (!user || user.role !== 'Editor') {
        return <Navigate to="/editor/login" replace />;
    }

    return (
        <section className="my-8 container mx-auto px-2 md:px-0">
            <div className="bg-img text-white py-4 px-2 md:px-6 rounded-3xl drop-shadow-2xl mb-8">
                <div className="flex flex-col items-center md:items-start justify-center w-full gap-3">
                    <h2 className="text-3xl font-lowballBold mb-2 flex items-center justify-start gap-2 tracking-wider">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-8">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                        </svg> Hey {user.userName}
                    </h2>
                </div>
            </div>

            <div className="bg-img text-white py-4 px-3 md:p-6 rounded-3xl drop-shadow-2xl min-h-[25vh]">
                <h2 className="text-2xl font-bold mb-4">🎬 <span className=''>Channels you have access</span></h2>
                <hr className="border-white border-1 mb-4"></hr>
                <input
                    type="text"
                    placeholder="Search Channels..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full p-2 mb-4 border rounded drop-shadow-xl bg-transparent"
                />
                {error && <p className="text-red-600">{error}</p>}
                <hr className="border-black border-1 mb-4"></hr>

                {filteredChannels.map(youtuberChannel => (
                    <div key={youtuberChannel._id} className="flex flex-col gap-5 md:gap-1 md:flex-row md:justify-between bg-[#141414d1] p-3 rounded-xl">
                        <div className="flex">
                            <div className="rounded-full w-16 h-1w-16 flex justify-center mt-1 mr-3">
                                <img className='w-full rounded-full' src={youtuberChannel.channelLogo}></img>
                            </div>
                            <div className="flex flex-col justify-center">
                                <h3 className='text-xl font-lowballRegular tracking-wider'>{youtuberChannel.channelName}</h3>
                                <p className='font-lowballRegular tracking-wider'>{youtuberChannel.channelUrl}</p>
                            </div>
                        </div>
                        <div className="flex flex-col justify-center">
                            <button type="button" onClick={() => handleSelectChannel(youtuberChannel._id)} className="brandBtn font-lowballBold text-xl tracking-wider drop-shadow-2xl text-white w-full py-1 md:py-2 px-4 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-900">Select <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.042 21.672 13.684 16.6m0 0-2.51 2.225.569-9.47 5.227 7.917-3.286-.672ZM12 2.25V4.5m5.834.166-1.591 1.591M20.25 10.5H18M7.757 14.743l-1.59 1.59M6 10.5H3.75m4.007-4.243-1.59-1.59" />
                            </svg>
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </section >
    )
}

export default EditorDashboard;
