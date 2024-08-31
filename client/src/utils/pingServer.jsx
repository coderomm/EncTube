// src/utils/pingServer.jsx

import axiosInstance from './AxiosInstance';

const pingServer = () => {
    // const baseURL='http://localhost:5000/api/v1';
    const baseURL = 'https://youlayer.tech/api/v1';

    axiosInstance.get(`${baseURL}/ping/healthcheck`)
        .then(response => {
            console.log('Ping successful:', response.data.message);
        })
        .catch(error => {
            console.error('Error pinging server:', error);
        });
};

export default pingServer;
