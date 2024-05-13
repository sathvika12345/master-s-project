import axios from 'axios';
import AsyncStorage from "@react-native-async-storage/async-storage";

const API = axios.create({
  baseURL: 'http://localhost:3001', // Update this URL with your backend URL
});

// Add interceptors for token verification
API.interceptors.request.use((req) => {
  const token = AsyncStorage.getItem('token');
  
req.headers.Authorization = token;
  return req;
});

// Define API functions
const api = {
  // Example POST request for creating a user
  createUser: (userData) => API.post('/user', userData,{
    timeout: 30000
  }),

  login: (loginData) => API.post('/login', loginData,{
    timeout: 30000
  }),

  getProjectsByUserId:(userId)=>API.get(`/projects/${userId}`),

  uploadProject:(projectData)=>API.post('/project', projectData),

  uploadfile:(fileData)=>API.post('/file/upload', fileData),

  // Example GET request for getting projects
  getProjects: () => API.get('/projects'),

  // Example DELETE request for deleting projects
  deleteProject: (projectId) => API.delete(`/projects/${projectId}`),

  searchProjects:(searchQuery) => API.get(`/search_project`,{ params: { query: searchQuery } }),

  fetchProjects: () => API.get(`/projects`),

  likeProject:(projectId, userId) => API.patch(`/project/like/${projectId}/${userId}`),
};

export default api;
