import axios from 'axios';

// const devBaseURL='http://localhost:5000/api/v1';
const proBaseURL='https://yt-vdo-manager.onrender.com/api/v1';

const axiosInstance = axios.create({
    baseURL: proBaseURL,
    headers: {
        'Content-Type': 'application/json'
    },
    withCredentials: true,
});

export default axiosInstance;