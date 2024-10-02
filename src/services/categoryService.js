// src/services/categoryService.js
import api from '../utils/api';

export const getAllCategories = () => api.get('/api/v1/categories');
export const getCategoryById = (id) => api.get(`/api/v1/categories/${id}`);
export const createCategory = (category) => api.post('/api/v1/categories', category);
export const updateCategory = (id, category) => api.put(`/api/v1/categories/${id}`, category);
export const deleteCategory = (id) => api.delete(`/api/v1/categories/${id}`);
export const getRootCategories = () => api.get('/api/v1/categories/root');
export const getCategoriesByParentId = (parentId) => api.get(`/api/v1/categories/${parentId}/subcategories`);
export const getAllDescendants = (id) => api.get(`/api/v1/categories/${id}/descendants`);
export const getCategoryByName = (name) => api.get('/api/v1/categories/byName', { params: { name } });
export const getCategoriesByDepth = (depth) => api.get('/api/v1/categories/byDepth', { params: { depth } });
export const searchCategories = (keyword) => api.get('/api/v1/categories/search', { params: { keyword } });