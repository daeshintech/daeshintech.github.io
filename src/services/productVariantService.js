import api from '../utils/api';

export const getProductVariants = (productId) => api.get(`/api/v1/product-variants/by-product/${productId}`);
export const getProductVariant = (id) => api.get(`/api/v1/product-variants/${id}`);
export const createProductVariant = (productId, variant) => api.post('/api/v1/product-variants', { ...variant, productId });
export const updateProductVariant = (id, variant) => api.put(`/api/v1/product-variants/${id}`, variant);
export const deleteProductVariant = (id) => api.delete(`/api/v1/product-variants/${id}`);