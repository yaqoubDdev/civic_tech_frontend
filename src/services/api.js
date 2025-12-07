import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Helper function to capitalize category names
const capitalizeCategory = (category) => {
  const categoryMap = {
    water: 'Water',
    roads: 'Roads',
    power: 'Power',
    waste: 'Waste',
  };
  return categoryMap[category?.toLowerCase()] || category;
};

/**
 * Create a new report
 * @param {Object} reportData - Report data from frontend
 * @returns {Promise} Created report
 */
export const createReport = async (reportData) => {
  try {
    const formData = new FormData();
    
    // Prepare data object (without photos)
    const dataToSend = {
      title: reportData.title || undefined,
      description: reportData.description || undefined,
      type: reportData.type,
      category: capitalizeCategory(reportData.category),
      location: {
        lat: reportData.location[0],
        lng: reportData.location[1],
        address: reportData.address || '',
      },
    };
    
    // Append JSON data as string
    formData.append('data', JSON.stringify(dataToSend));
    
    // Append image file if exists
    if (reportData.photos && reportData.photos.length > 0 && reportData.photos[0]) {
      formData.append('image', reportData.photos[0]);
    }

    const response = await api.post('/reports', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error creating report:', error);
    throw error;
  }
};

/**
 * Get all reports with optional filters
 * @param {Object} filters - Optional filters (status, owner)
 * @returns {Promise} Array of reports
 */
export const getReports = async (filters = {}) => {
  try {
    const params = {};
    if (filters.status) params.status = filters.status;
    if (filters.owner) params.owner = filters.owner;

    const response = await api.get('/reports', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching reports:', error);
    throw error;
  }
};

/**
 * Upvote a report
 * @param {string} reportId - Report ID
 * @returns {Promise} Updated report
 */
export const upvoteReport = async (reportId) => {
  try {
    const response = await api.patch(`/reports/${reportId}/upvote`);
    return response.data;
  } catch (error) {
    console.error('Error upvoting report:', error);
    throw error;
  }
};

/**
 * Update report status
 * @param {string} reportId - Report ID
 * @param {string} status - New status
 * @returns {Promise} Updated report
 */
export const updateReportStatus = async (reportId, status) => {
  try {
    const response = await api.patch(`/reports/${reportId}/status`, { status });
    return response.data;
  } catch (error) {
    console.error('Error updating report status:', error);
    throw error;
  }
};

export default api;
