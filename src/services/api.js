/**
 * StoryBox Admin API Service
 * Production-ready API integration with all endpoints
 * Base URL: https://king-prawn-app-ewizm.ondigitalocean.app/api/v1
 */

import { apiCall, apiCallFormData } from './apiConfig';

// ==================== DASHBOARD API ====================
export const dashboardAPI = {
  // GET /dashboard/info - Get Dashboard Statistics
  getDashboardInfo: () => apiCall('/dashboard/info', 'GET'),
};

// ==================== AUTHENTICATION API ====================
export const authAPI = {
  // POST /dashboard/auth/login - Employee Login
  login: (credentials) => apiCall('/dashboard/auth/login', 'POST', credentials),
  
  // POST /dashboard/auth/forget-password - Forget Password
  forgetPassword: (data) => apiCall('/dashboard/auth/forget-password', 'POST', data),
  
  // POST /dashboard/auth/reset-password - Reset Password
  resetPassword: (data) => apiCall('/dashboard/auth/reset-password', 'POST', data),
};

// ==================== PROFILE API ====================
export const profileAPI = {
  // GET /dashboard/profile - Get Profile Data
  getProfile: () => apiCall('/dashboard/profile', 'GET'),
  
  // PUT /dashboard/profile - Update Profile Data
  updateProfile: (data) => apiCall('/dashboard/profile', 'PUT', data),
  
  // PATCH /dashboard/profile/change-password - Change Password
  changePassword: (data) => apiCall('/dashboard/profile/change-password', 'PATCH', data),
  
  // POST /dashboard/profile/picture/presign - Get Profile Picture Upload URL
  getProfilePictureUploadUrl: (data) => apiCall('/dashboard/profile/picture/presign', 'POST', data),
  
  // PATCH /dashboard/profile/picture - Save Profile Picture
  saveProfilePicture: (data) => apiCall('/dashboard/profile/picture', 'PATCH', data),
};

// ==================== EMPLOYEE API ====================
export const employeeAPI = {
  // POST /dashboard/employee/create - Create New Employee
  createEmployee: (data) => apiCall('/dashboard/employee/create', 'POST', data),
  
  // GET /dashboard/employee - Get All Employees
  getAllEmployees: (params) => {
    const queryString = params ? `?${new URLSearchParams(params)}` : '';
    return apiCall(`/dashboard/employee${queryString}`, 'GET');
  },
  
  // PUT /dashboard/employee - Edit Employee Details
  updateEmployee: (data) => apiCall('/dashboard/employee', 'PUT', data),
  
  // DELETE /dashboard/employee - Remove Employee
  deleteEmployee: (employeeId) => apiCall(`/dashboard/employee?id=${employeeId}`, 'DELETE'),
  
  // PATCH /dashboard/employee/permission - Change Permission
  changePermission: (data) => apiCall('/dashboard/employee/permission', 'PATCH', data),
};

// ==================== USERS API ====================
export const usersAPI = {
  // GET /dashboard/users - Get All Users
  getAllUsers: (params) => {
    const queryString = params ? `?${new URLSearchParams(params)}` : '';
    return apiCall(`/dashboard/users${queryString}`, 'GET');
  },
  
  // GET /dashboard/users/:id - Get User Profile
  getUserProfile: (userId) => apiCall(`/dashboard/users/${userId}`, 'GET'),
  
  // PATCH /dashboard/users/permissions - Change User Permission
  changeUserPermission: (data) => apiCall('/dashboard/users/permissions', 'PATCH', data),
};

// ==================== CATEGORY API ====================
export const categoryAPI = {
  // POST /dashboard/category/create - Create New Category
  createCategory: (data) => apiCall('/dashboard/category/create', 'POST', data),
  
  // GET /dashboard/category - Get All Categories
  getAllCategories: (params) => {
    const queryString = params ? `?${new URLSearchParams(params)}` : '';
    return apiCall(`/dashboard/category${queryString}`, 'GET');
  },
  
  // GET /dashboard/category/:id - Get Category Details
  getCategoryDetails: (categoryId) => apiCall(`/dashboard/category/${categoryId}`, 'GET'),
  
  // PUT /dashboard/category - Update Category
  updateCategory: (data) => apiCall('/dashboard/category', 'PUT', data),
  
  // DELETE /dashboard/category/:id - Delete Category
  deleteCategory: (categoryId) => apiCall(`/dashboard/category/${categoryId}`, 'DELETE'),
};

// ==================== VIDEO SERIES API ====================
export const seriesAPI = {
  // POST /dashboard/videoSeries - Create New Series
  createSeries: (data) => apiCall('/dashboard/videoSeries', 'POST', data),
  
  // GET /dashboard/videoSeries - Get All Series
  getAllSeries: (params) => {
    const queryString = params ? `?${new URLSearchParams(params)}` : '';
    return apiCall(`/dashboard/videoSeries${queryString}`, 'GET');
  },
  
  // GET /dashboard/videoSeries/:id - Get Series Details
  getSeriesDetails: (seriesId) => apiCall(`/dashboard/videoSeries/${seriesId}`, 'GET'),
  
  // PUT /dashboard/videoSeries - Update Series
  updateSeries: (data) => apiCall('/dashboard/videoSeries', 'PUT', data),
  
  // DELETE /dashboard/videoSeries/:id - Delete Series
  deleteSeries: (seriesId) => apiCall(`/dashboard/videoSeries/${seriesId}`, 'DELETE'),
};

// ==================== EPISODES API ====================
export const episodesAPI = {
  // POST /dashboard/episode - Add New Episode
  createEpisode: (data) => apiCall('/dashboard/episode', 'POST', data),
  
  // GET /dashboard/episode - Get All Episodes of a Series
  getAllEpisodes: (params) => {
    const queryString = params ? `?${new URLSearchParams(params)}` : '';
    return apiCall(`/dashboard/episode${queryString}`, 'GET');
  },
  
  // GET /dashboard/episode/:id - Get Episode Details
  getEpisodeDetails: (episodeId) => apiCall(`/dashboard/episode/${episodeId}`, 'GET'),
  
  // PUT /dashboard/episode - Update Episode
  updateEpisode: (data) => apiCall('/dashboard/episode', 'PUT', data),
  
  // DELETE /dashboard/episode/:id - Delete Episode
  deleteEpisode: (episodeId) => apiCall(`/dashboard/episode/${episodeId}`, 'DELETE'),
};

// ==================== FILE UPLOAD API ====================
export const uploadAPI = {
  // Upload file with FormData
  uploadFile: (formData) => apiCallFormData('/upload', 'POST', formData),
  
  // Upload image
  uploadImage: (formData) => apiCallFormData('/upload/image', 'POST', formData),
  
  // Upload video
  uploadVideo: (formData) => apiCallFormData('/upload/video', 'POST', formData),
};

// Export all APIs as a single object
const API = {
  dashboard: dashboardAPI,
  auth: authAPI,
  profile: profileAPI,
  employee: employeeAPI,
  users: usersAPI,
  category: categoryAPI,
  series: seriesAPI,
  episodes: episodesAPI,
  upload: uploadAPI,
};

export default API;
