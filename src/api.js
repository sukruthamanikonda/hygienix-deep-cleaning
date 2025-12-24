export const API_BASE = process.env.REACT_APP_API_BASE_URL ||
    ((process.env.NODE_ENV === 'production')
        ? 'https://hygienix-deep-cleaning.onrender.com/api'
        : 'http://localhost:5001/api');
