// src/services/installationService.js
import api from '../utils/api';

// Installation Record
export const getAllInstallationRecords = () => api.get('/api/v1/installation-records');
export const getInstallationRecordById = (id) => api.get(`/api/v1/installation-records/${id}`);
export const createInstallationRecord = (record) => api.post('/api/v1/installation-records', record);
export const updateInstallationRecord = (id, record) => api.put(`/api/v1/installation-records/${id}`, record);
export const deleteInstallationRecord = (id) => api.delete(`/api/v1/installation-records/${id}`);

// Installation Detail
export const getAllInstallationDetails = () => api.get('/api/v1/installation-details');
export const getInstallationDetailById = (id) => api.get(`/api/v1/installation-details/${id}`);
export const createInstallationDetail = (detail) => api.post('/api/v1/installation-details', detail);
export const updateInstallationDetail = (id, detail) => api.put(`/api/v1/installation-details/${id}`, detail);
export const deleteInstallationDetail = (id) => api.delete(`/api/v1/installation-details/${id}`);

// Installation Photo
export const getAllInstallationPhotos = () => api.get('/api/v1/installation-photos');
export const getInstallationPhotoById = (id) => api.get(`/api/v1/installation-photos/${id}`);
export const createInstallationPhoto = (photo) => api.post('/api/v1/installation-photos', photo);
export const deleteInstallationPhoto = (id) => api.delete(`/api/v1/installation-photos/${id}`);

// Installation Location
export const getAllLocations = () => api.get('/api/v1/locations');
export const getLocationById = (id) => api.get(`/api/v1/locations/${id}`);
export const createLocation = (location) => api.post('/api/v1/locations', location);
export const updateLocation = (id, location) => api.put(`/api/v1/locations/${id}`, location);
export const deleteLocation = (id) => api.delete(`/api/v1/locations/${id}`);

// Installation Request
export const getAllRequests = () => api.get('/api/v1/requests');
export const getRequestById = (id) => api.get(`/api/v1/requests/${id}`);
export const createRequest = (request) => api.post('/api/v1/requests', request);
export const updateRequest = (id, request) => {
    if (!id) {
        return Promise.reject(new Error('Invalid request ID'));
    }
    return api.put(`/api/v1/requests/${id}`, request);
};
export const deleteRequest = (id) => api.delete(`/api/v1/requests/${id}`);

// New function for checking request by mobile and password
export const checkRequest = (mobile, password) =>
    api.post('/api/v1/requests/check', null, { params: { mobile, password } })
        .then(response => {
            if (response.data && typeof response.data === 'object') {
                return response;
            } else {
                throw new Error('Invalid response data');
            }
        });