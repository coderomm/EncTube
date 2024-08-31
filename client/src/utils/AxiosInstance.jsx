import axios from 'axios';

// const baseURL='http://localhost:5000/api/v1';
// const baseURL='https://enctube.onrender.com/api/v1';
const baseURL='https://youlayer.tech/api/v1';

const axiosInstance = axios.create({
    baseURL: baseURL,
    headers: {
        'Content-Type': 'application/json'
    },
    withCredentials: true,
});

export default axiosInstance;