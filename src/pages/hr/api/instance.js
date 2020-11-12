import axios from 'axios';

const instance = axios.create({
  baseURL: process.env.base_url,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default instance;
