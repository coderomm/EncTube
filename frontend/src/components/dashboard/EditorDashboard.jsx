import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import axiosInstance from '../../utils/AxiosInstance';
import { Navigate, useNavigate } from 'react-router-dom';

function EditorDashboard() {
    const { user, loading } = useContext(AuthContext);
    const [channels, setChannels] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        if (loading) {
            return <div>Loading...</div>;
        }

        if (!user || user.role !== 'Editor') {
            return <Navigate to="/login-editor" />;
        }
        const fetchChannels = async () => {
            try {
                const response = await axiosInstance.get('/editor/channels');
                console.log('fetchChannels res:', response)
                setChannels(response.data);
            } catch (error) {
                console.error('Error fetching channels:', error);
            }
        };

        fetchChannels();
    }, [user, loading]);

    const filteredChannels = channels.filter(channel =>
        channel.youtuber.channelName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSelectChannel = (channelId) => {
        navigate(`/editor/channel/${channelId}`);
    };

    return (
        <div className="min-h-screen bg-gray-100 p-4">
            <h1 className="text-3xl font-bold mb-4">Editor Dashboard</h1>
            <input
                type="text"
                placeholder="Search Channels..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-2 mb-4 border rounded"
            />
            {filteredChannels.map(channel => (  
                <>
                    <div key={channel._id} className="flex justify-between">
                        <div className="flex">
                            <div className="rounded-full h-12 w-12 bg-slate-200 flex justify-center mt-1 mr-2">
                                <div className="flex flex-col justify-center h-full text-xl">{channel.youtuber.channelName[0].toUpperCase()}</div>
                            </div>
                            <div className="flex flex-col justify-center h-ful">
                                <div className='font-bold'>{channel.youtuber.channelName} / {channel.youtuber.channelUrl}</div>
                            </div>
                        </div>
                        <div className="flex flex-col justify-center h-ful">
                            <button type="button" data-ChannelId={channel._id} onClick={() => handleSelectChannel(channel._id)} className="w-full text-[#163300] font-bold bg-[#9fe870] border border-[#9fe870] transition-colors duration-150 ease-in-out text-base rounded-full select-none py-2 px-4">Select Channel</button>
                        </div>
                    </div>
                </>
            ))}
        </div>
    );
}

export default EditorDashboard;
