import React from 'react';
import { Table, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSortUp, faSortDown } from '@fortawesome/free-solid-svg-icons';

const ProductList = ({ products, categories, onProductSelect, onDelete, onSort, sortField, sortDirection }) => {
    const getCategoryName = (categoryId) => {
        const category = categories.find(cat => cat.id === categoryId);
        return category ? category.name : '카테고리 없음';
    };

    const renderSortIcon = (field) => {
        return sortField === field
            ? sortDirection === 'asc'
                ? <FontAwesomeIcon icon={faSortUp} />
                : <FontAwesomeIcon icon={faSortDown} />
            : null;
    };

    return (
        <Table striped bordered hover responsive>
            <thead>
            <tr>
                <th onClick={() => onSort('name')} style={{ cursor: 'pointer' }}>
                    이름 {renderSortIcon('name')}
                </th>
                <th onClick={() => onSort('categoryId')} style={{ cursor: 'pointer' }}>
                    카테고리 {renderSortIcon('categoryId')}
                </th>
                <th>동작</th>
            </tr>
            </thead>
            <tbody>
            {products.map(product => (
                <tr key={product.id}>
                    <td>{product.name}</td>
                    <td>{getCategoryName(product.categoryId)}</td>
                    <td>
                        <Button variant="info" onClick={() => onProductSelect(product)} className="mr-2">
                            편집
                        </Button>
                        <Button variant="danger" onClick={() => {
                            if (window.confirm('이 제품을 삭제하시겠습니까?')) {
                                onDelete(product.id);
                            }
                        }}>
                            삭제
                        </Button>
                    </td>
                </tr>
            ))}
            </tbody>
        </Table>
    );
};

export default ProductList;