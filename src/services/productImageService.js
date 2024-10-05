import api from '../utils/api';

export const getProductImages = (productId) => api.get(`/api/v1/product-images/by-product/${productId}`);
export const getProductImage = (id) => api.get(`/api/v1/product-images/${id}`);
export const uploadProductImage = (productId, file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('productId', productId);
    return api.post('/api/v1/product-images', formData);
};
export const updateProductImage = (id, productId, file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('productId', productId);
    return api.put(`/api/v1/product-images/${id}`, formData);
};
export const deleteProductImage = (id) => api.delete(`/api/v1/product-images/${id}`);
export const deleteAllProductImages = (productId) => api.delete(`/api/v1/product-images/by-product/${productId}`);

// 새로운 함수 추가
export const getImageUrl = (filename) => `${api.defaults.baseURL}api/v1/product-images/file/${filename}`;