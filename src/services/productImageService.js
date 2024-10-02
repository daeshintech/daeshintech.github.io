import api from '../utils/api';

export const getProductImages = (productId) => api.get(`/api/v1/product-images/by-product/${productId}`);
export const getProductImage = (id) => api.get(`/api/v1/product-images/${id}`);
export const uploadProductImage = (formData) => {
    return api.post('/api/v1/product-images', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
};
export const updateProductImage = (id, formData) => {
    return api.put(`/api/v1/product-images/${id}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
};
export const deleteProductImage = (id) => api.delete(`/api/v1/product-images/${id}`);
export const deleteAllProductImages = (productId) => api.delete(`/api/v1/product-images/by-product/${productId}`);