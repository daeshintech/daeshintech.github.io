import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import styled from 'styled-components';
import CategoryTree from './CategoryTree';
import CategoryForm from './CategoryForm';
import { getAllCategories, createCategory, updateCategory, deleteCategory } from '../../../services/categoryService';

const StyledContainer = styled(Container)`
  padding: 2rem;
  background-color: #f8f9fa;
  min-height: 100vh;
`;

const StyledCard = styled(Card)`
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  margin-bottom: 2rem;
`;

const StyledCardHeader = styled(Card.Header)`
  background-color: #007bff;
  color: white;
  font-weight: bold;
  padding: 1rem;
`;

const StyledCardBody = styled(Card.Body)`
  padding: 1.5rem;
`;

const CategoryManagement = () => {
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await getAllCategories();
            setCategories(response.data);
        } catch (error) {
            console.error('카테고리를 불러오는 데 실패했습니다:', error);
        }
    };

    const handleAddCategory = async (newCategory) => {
        try {
            await createCategory(newCategory);
            fetchCategories();
        } catch (error) {
            console.error('카테고리 추가에 실패했습니다:', error);
        }
    };

    const handleUpdateCategory = async (updatedCategory) => {
        try {
            await updateCategory(updatedCategory.id, updatedCategory);
            fetchCategories();
            setSelectedCategory(null);
            setIsEditing(false);
        } catch (error) {
            console.error('카테고리 수정에 실패했습니다:', error);
        }
    };

    const handleDeleteCategory = async (categoryId) => {
        try {
            await deleteCategory(categoryId);
            fetchCategories();
            setSelectedCategory(null);
            setIsEditing(false);
        } catch (error) {
            console.error('카테고리 삭제에 실패했습니다:', error);
        }
    };

    const handleMoveCategory = async (draggedId, targetId, direction = null) => {
        try {
            let updatedCategory;
            if (direction) {
                // 상/하 이동 로직
                const currentIndex = categories.findIndex(cat => cat.id === draggedId);
                const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
                if (newIndex >= 0 && newIndex < categories.length) {
                    const newParentId = categories[newIndex].parentId;
                    updatedCategory = { ...categories[currentIndex], parentId: newParentId };
                } else {
                    return; // 더 이상 이동할 수 없음
                }
            } else {
                // 드래그 앤 드롭 이동 로직
                updatedCategory = {
                    ...categories.find(cat => cat.id === draggedId),
                    parentId: targetId === 'root' ? null : targetId
                };
            }

            await updateCategory(draggedId, updatedCategory);
            fetchCategories();
        } catch (error) {
            console.error('카테고리 이동에 실패했습니다:', error);
        }
    };

    const handleSelectCategory = (category) => {
        setSelectedCategory(category);
        setIsEditing(true);
    };

    const handleCancelEdit = () => {
        setSelectedCategory(null);
        setIsEditing(false);
    };

    return (
        <DndProvider backend={HTML5Backend}>
            <StyledContainer fluid>
                <h2 className="text-center mb-4">카테고리 관리</h2>
                <Row>
                    <Col lg={6} className="mb-4">
                        <StyledCard>
                            <StyledCardHeader>카테고리 트리</StyledCardHeader>
                            <StyledCardBody>
                                <CategoryTree
                                    categories={categories}
                                    onSelectCategory={handleSelectCategory}
                                    onDeleteCategory={handleDeleteCategory}
                                    onMoveCategory={handleMoveCategory}
                                />
                            </StyledCardBody>
                        </StyledCard>
                    </Col>
                    <Col lg={6} className="mb-4">
                        <StyledCard>
                            <StyledCardHeader>
                                {isEditing ? '카테고리 수정' : '새 카테고리 추가'}
                            </StyledCardHeader>
                            <StyledCardBody>
                                <CategoryForm
                                    categories={categories}
                                    selectedCategory={selectedCategory}
                                    onAddCategory={handleAddCategory}
                                    onUpdateCategory={handleUpdateCategory}
                                    isEditing={isEditing}
                                />
                                {isEditing && (
                                    <Button variant="secondary" onClick={handleCancelEdit} className="mt-3">
                                        편집 취소
                                    </Button>
                                )}
                            </StyledCardBody>
                        </StyledCard>
                    </Col>
                </Row>
            </StyledContainer>
        </DndProvider>
    );
};

export default CategoryManagement;