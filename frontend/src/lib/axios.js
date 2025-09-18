import axios from 'axios';

export const axiosInstance = axios.create({
  baseURL: 'http://localhost:3000/api', // Replace with your actual backend URL
  withCredentials: true, // If using cookies/sessions for auth
});
