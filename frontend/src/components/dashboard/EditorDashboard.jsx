import { useState, useEffect, useContext, useCallback, useMemo } from 'react';
import { AuthContext } from '../../context/AuthContext';
import axiosInstance from '../../utils/AxiosInstance';
import { Navigate, useNavigate } from 'react-router-dom';
import Loader from '../Loader';

function EditorDashboard() {
    const { user, loading } = useContext(AuthContext);
    const [channels, setChannels] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const fetchChannels = useCallback(async () => {
        try {
            const response = await axiosInstance.get('/editor/channels');
            setChannels(response.data);
        } catch (error) {
            console.error('Error fetching channels:', error);
            setError('Error fetching channels');
        }
    }, []);

    useEffect(() => {
        if (!loading && user && user.role === 'Editor') {
            fetchChannels();
        }
    }, [loading, user, fetchChannels]);

    const filteredChannels = useMemo(() => {
        return channels.filter(channel =>
            channel.youtuber.channelName.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [channels, searchTerm]);

    const handleSelectChannel = (channelId) => {
        navigate(`/editor/channel/${channelId}`);
    };

    if (loading) {
        return <Loader />;
    }

    if (!loading && (!user || user.role !== 'Editor')) {
        return <Navigate to="/login-editor" />;
    }

    return (
        <section className="my-8 container mx-auto px-4 md:px-0 bg-img text-white rounded-3xl">
            <div className="p-4 rounded-lg drop-shadow-2xl text-white">
                <h1 className="text-3xl font-bold mb-4">Editor Dashboard</h1>
                <input
                    type="text"
                    placeholder="Search Channels..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full p-2 mb-4 border rounded drop-shadow-xl bg-transparent"
                />
                {error && <p className="text-red-600">{error}</p>}
                <hr className="border-black border-1 mb-4"></hr>

                {filteredChannels.map(channel => (
                    <div key={channel._id} className="flex justify-between bg-[#141414d1] p-3 rounded-xl">
                        <div className="flex">
                            <div className="rounded-full h-12 w-12 bg-[#999] flex justify-center mt-1 mr-2">
                                <div className="flex flex-col justify-center h-full text-xl">{channel.youtuber.channelName[0].toUpperCase()}</div>
                            </div>
                            <div className="flex flex-col justify-center h-ful">
                                <div className='font-bold'>{channel.youtuber.channelName} / {channel.youtuber.channelUrl}</div>
                            </div>
                        </div>
                        <div className="flex flex-col justify-center h-ful">
                            <button type="button" onClick={() => handleSelectChannel(channel._id)} className="brandBtn font-lowballBold text-xl tracking-wider drop-shadow-2xl text-white w-full py-2 px-3 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-900">Select <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.042 21.672 13.684 16.6m0 0-2.51 2.225.569-9.47 5.227 7.917-3.286-.672ZM12 2.25V4.5m5.834.166-1.591 1.591M20.25 10.5H18M7.757 14.743l-1.59 1.59M6 10.5H3.75m4.007-4.243-1.59-1.59" />
                            </svg>
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}

export default EditorDashboard;
