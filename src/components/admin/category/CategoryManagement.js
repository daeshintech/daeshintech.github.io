import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import CategoryTree from './CategoryTree';
import CategoryForm from './CategoryForm';
import { getAllCategories, createCategory, updateCategory, deleteCategory } from '../../../services/categoryService';

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
            <Container>
                <h2>카테고리 관리</h2>
                <Row>
                    <Col md={6}>
                        <CategoryTree
                            categories={categories}
                            onSelectCategory={handleSelectCategory}
                            onDeleteCategory={handleDeleteCategory}
                            onMoveCategory={handleMoveCategory}
                        />
                    </Col>
                    <Col md={6}>
                        <CategoryForm
                            categories={categories}
                            selectedCategory={selectedCategory}
                            onAddCategory={handleAddCategory}
                            onUpdateCategory={handleUpdateCategory}
                            isEditing={isEditing}
                        />
                        {isEditing && (
                            <Button variant="secondary" onClick={handleCancelEdit} className="mt-2">
                                편집 취소
                            </Button>
                        )}
                    </Col>
                </Row>
            </Container>
        </DndProvider>
    );
};

export default CategoryManagement;