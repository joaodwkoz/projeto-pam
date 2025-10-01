import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const api = axios.create({
    baseURL: 'http://10.75.201.99:8000/api',
});

api.interceptors.request.use(async (config) => {
    const token = await AsyncStorage.getItem('token');

    if(token){
        config.headers['Authorization'] = `Bearer ${token}`;
    }

    return config;
}, error => {
    return Promise.reject(error);
});

export default api;