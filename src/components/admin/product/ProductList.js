import React from 'react';
import { Table, Button, Pagination } from 'react-bootstrap';
import { FaEdit, FaTrash, FaSortUp, FaSortDown } from 'react-icons/fa';

const ProductList = ({ products, categories, onProductSelect, onDelete, onSort, sortField, sortDirection, currentPage, totalPages, onPageChange }) => {
    const getCategoryName = (categoryId) => {
        const category = categories.find(cat => cat.id === categoryId);
        return category ? category.name : '카테고리 없음';
    };

    const renderSortIcon = (field) => {
        if (sortField === field) {
            return sortDirection === 'asc' ? <FaSortUp /> : <FaSortDown />;
        }
        return null;
    };

    const renderPagination = () => {
        let items = [];
        for (let number = 1; number <= totalPages; number++) {
            items.push(
                <Pagination.Item key={number} active={number === currentPage} onClick={() => onPageChange(number)}>
                    {number}
                </Pagination.Item>,
            );
        }
        return <Pagination>{items}</Pagination>;
    };

    return (
        <div>
            <Table striped bordered hover responsive className="align-middle">
                <thead>
                <tr>
                    <th onClick={() => onSort('name')} style={{ cursor: 'pointer' }}>
                        이름 {renderSortIcon('name')}
                    </th>
                    <th onClick={() => onSort('categoryId')} style={{ cursor: 'pointer' }}>
                        카테고리 {renderSortIcon('categoryId')}
                    </th>
                    <th className="text-center">동작</th>
                </tr>
                </thead>
                <tbody>
                {products.map(product => (
                    <tr key={product.id}>
                        <td>{product.name}</td>
                        <td>{getCategoryName(product.categoryId)}</td>
                        <td className="text-center">
                            <Button variant="outline-primary" onClick={() => onProductSelect(product)} className="me-2">
                                <FaEdit /> 편집
                            </Button>
                            <Button variant="outline-danger" onClick={() => {
                                if (window.confirm('이 제품을 삭제하시겠습니까?')) {
                                    onDelete(product.id);
                                }
                            }}>
                                <FaTrash /> 삭제
                            </Button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </Table>
            <div className="d-flex justify-content-center mt-4">
                {renderPagination()}
            </div>
        </div>
    );
};

export default ProductList;