import api from '../utils/api';

export const getProductImages = (productId) => api.get(`/api/v1/product-images/by-product/${productId}`);

export const getProductImage = (id) => api.get(`/api/v1/product-images/${id}`);

export const uploadProductImage = (productId, file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('productId', productId);
    return api.post('/api/v1/product-images', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
};

export const updateProductImage = (id, productId, file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('productId', productId);
    return api.put(`/api/v1/product-images/${id}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
};

export const deleteProductImage = (id) => api.delete(`/api/v1/product-images/${id}`);

export const deleteAllProductImages = (productId) => api.delete(`/api/v1/product-images/by-product/${productId}`);

export const getImageUrl = (filename) => {
    const baseUrl = api.defaults.baseURL.endsWith('/')
        ? api.defaults.baseURL.slice(0, -1)
        : api.defaults.baseURL;
    return `${baseUrl}/api/v1/product-images/file/${filename}`;
};