import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://192.168.1.102:3000', // Updated to the active IP address of your machine
});

export default instance;


