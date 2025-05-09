// src/api/userService.js
import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5050/api';

const token = localStorage.getItem('token');

const axiosInstance = axios.create({
  baseURL: `${BASE_URL}/users`,
  headers: {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  },
});

export const userService = {
  getAllUsers: () => axiosInstance.get('/'),
  createUser: (userData) => axiosInstance.post('/', userData),
  deleteUser: (id) => axiosInstance.delete(`/${id}`),
};
