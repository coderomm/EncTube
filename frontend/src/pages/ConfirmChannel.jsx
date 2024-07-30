import { useEffect, useState } from 'react';
import axiosInstance from '../utils/AxiosInstance';
import { useNavigate, useSearchParams } from 'react-router-dom';

const ConfirmChannel = () => {
    const [searchParams] = useSearchParams();
    const [message, setMessage] = useState('');

    const token = searchParams.get('token');
    const email = searchParams.get('email');

    const navigate = useNavigate();

    const handleConfirm = async () => {
        try {
            const response = await axiosInstance.post('/invitation/confirmChannel', { token, email });
            console.log('confirmChannel response:', response)
            setMessage(response.data.message);
            navigate('/editor-dashboard');
        } catch (error) {
            setMessage('Failed to confirm channel.');
            console.error(error);
        }
    };

    useEffect(() => {
        handleConfirm();
    }, [token]);

    return (
        <div>
            <p>{message}</p>
        </div>
    );
};

export default ConfirmChannel;
