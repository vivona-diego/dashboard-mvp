import axios from 'axios';

const baseURL = process.env.BASE_URL || 'https://bi-analytics-api-dcc2f4f408cd.herokuapp.com';

const api = axios.create({
    baseURL,
    timeout: 10000, 
    headers: {
        'Content-Type': 'application/json',
    }
});

export default api;