// src/services/productService.js
import api from '../utils/api';

export const getProducts = (page = 1, size = 10) =>
    api.get('/api/v1/products', { params: { page, size } });

export const getProduct = (id) =>
    api.get(`/api/v1/products/${id}`);

export const createProduct = (product) =>
    api.post('/api/v1/products', product);

export const updateProduct = (id, product) =>
    api.put(`/api/v1/products/${id}`, product);

export const deleteProduct = (id) =>
    api.delete(`/api/v1/products/${id}`);

export const getSortedAndSearchedProducts = (keyword, categoryId, sortField, sortDirection, page = 1, size = 10) =>
    api.get('/api/v1/products/search', {
        params: {
            keyword,
            categoryId,
            sort: `${sortField},${sortDirection}`,
            page,
            size
        }
    });
