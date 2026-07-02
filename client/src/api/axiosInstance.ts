import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:5000/api',
  withCredentials: true, // sends the HTTP-only cookie automatically
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;