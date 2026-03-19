import axios from 'axios';

const baseURL =
  process.env.NEXT_PUBLIC_BASE_URL || 'https://saasanalytic.fleetcostcare.com/';

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
