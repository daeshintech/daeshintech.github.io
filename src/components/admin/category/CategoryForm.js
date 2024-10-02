import React, { useState, useEffect } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import styled from 'styled-components';

const StyledForm = styled(Form)`
    background-color: #f8f9fa;
    padding: 20px;
    border-radius: 5px;
    box-shadow: 0 0 10px rgba(0,0,0,0.1);
`;

const FormTitle = styled.h3`
    margin-bottom: 20px;
`;

const CategoryForm = ({ categories, selectedCategory, onAddCategory, onUpdateCategory, isEditing }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [parentId, setParentId] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (selectedCategory) {
            setName(selectedCategory.name);
            setDescription(selectedCategory.description || '');
            setParentId(selectedCategory.parentId || '');
        } else {
            setName('');
            setDescription('');
            setParentId('');
        }
        setError('');
    }, [selectedCategory]);

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        if (!name.trim()) {
            setError('카테고리 이름은 필수입니다.');
            return;
        }

        const categoryData = {
            name: name.trim(),
            description: description.trim() || null,
            parentId: parentId || null
        };

        if (isEditing) {
            onUpdateCategory({ ...selectedCategory, ...categoryData });
        } else {
            onAddCategory(categoryData);
        }

        // 폼 초기화
        setName('');
        setDescription('');
        setParentId('');
    };

    return (
        <StyledForm onSubmit={handleSubmit}>
            <FormTitle>{isEditing ? '카테고리 수정' : '새 카테고리 추가'}</FormTitle>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form.Group className="mb-3">
                <Form.Label>카테고리 이름</Form.Label>
                <Form.Control
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>설명</Form.Label>
                <Form.Control
                    as="textarea"
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>상위 카테고리</Form.Label>
                <Form.Select
                    value={parentId}
                    onChange={(e) => setParentId(e.target.value)}
                >
                    <option value="">루트 카테고리</option>
                    {categories
                        .filter(cat => cat.id !== selectedCategory?.id)
                        .map((category) => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))
                    }
                </Form.Select>
            </Form.Group>

            <Button variant="primary" type="submit">
                {isEditing ? '카테고리 수정' : '카테고리 추가'}
            </Button>
        </StyledForm>
    );
};

export default CategoryForm;