import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle specific error cases
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      return Promise.reject(
        new Error(
          error.response.data?.message ||
          `Error ${error.response.status}: ${error.response.statusText}`
        )
      );
    } else if (error.request) {
      // The request was made but no response was received
      return Promise.reject(new Error('Network error - please check your connection'));
    } else {
      // Something happened in setting up the request that triggered an Error
      return Promise.reject(new Error('Request setup error'));
    }
  }
);

const medicineApi = {
  getAll: () => apiClient.get('/medicines'),
  create: (data) => apiClient.post('/medicines', data),
  update: (id, data) => apiClient.patch(`/medicines/${id}`, data),
  delete: (id) => apiClient.delete(`/medicines/${id}`),
};

const authApi = {
  login: (credentials) => apiClient.post('/auth/login', credentials),
  register: (userData) => apiClient.post('/auth/signup', userData),
};

const requestApi = {
  create: (data) => apiClient.post('/requests', data),
  getReceived: () => apiClient.get('/requests/received'),
  getMade: () => apiClient.get('/requests/made'),
  respond: (id, status) => apiClient.patch(`/requests/${id}/respond`, { status }),
  cancel: (id) => apiClient.patch(`/requests/${id}/cancel`),
};

export { medicineApi, authApi, requestApi };
export default {
  medicine: medicineApi,
  auth: authApi,
  request: requestApi
};