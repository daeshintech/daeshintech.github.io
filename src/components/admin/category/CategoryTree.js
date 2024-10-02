import React, { useState } from 'react';
import { ListGroup, Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { useDrag, useDrop } from 'react-dnd';
import { FaFolder, FaFolderOpen, FaFile, FaArrowUp, FaArrowDown } from 'react-icons/fa';
import styled from 'styled-components';

const StyledListItem = styled(ListGroup.Item)`
    display: flex;
    align-items: center;
    padding: 10px;
    margin-bottom: 5px;
    background-color: ${props => props.isOver ? '#e9ecef' : 'white'};
    border-left: ${props => props.level > 0 ? `${props.level * 20}px solid #f8f9fa` : 'none'};
    transition: all 0.2s ease;
    &:hover {
        background-color: #f8f9fa;
    }
`;

const CategoryName = styled.span`
    margin-left: 10px;
    flex-grow: 1;
    cursor: pointer;
`;

const IconWrapper = styled.span`
    margin-right: 5px;
`;

const ChildrenCount = styled.span`
    font-size: 0.8em;
    color: #6c757d;
    margin-left: 5px;
`;

const ActionButton = styled(Button)`
    margin-left: 5px;
`;

const CategoryItem = ({ category, onSelect, onDelete, onMove, level = 0, parentId = null }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [{ isDragging }, drag] = useDrag({
        type: 'CATEGORY',
        item: { id: category.id, name: category.name, parentId },
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
        }),
    });

    const [{ isOver }, drop] = useDrop({
        accept: 'CATEGORY',
        drop: (item) => {
            if (item.id !== category.id && item.parentId !== category.id) {
                onMove(item.id, category.id);
            }
        },
        collect: (monitor) => ({
            isOver: !!monitor.isOver(),
        }),
    });

    const hasChildren = category.children && category.children.length > 0;

    const handleMoveUp = () => {
        onMove(category.id, parentId, 'up');
    };

    const handleMoveDown = () => {
        onMove(category.id, parentId, 'down');
    };

    return (
        <div ref={(node) => drag(drop(node))} style={{ opacity: isDragging ? 0.5 : 1 }}>
            <StyledListItem
                level={level}
                isOver={isOver}
            >
                <div style={{display: 'flex', alignItems: 'center', width: '100%'}}>
                    {hasChildren && (
                        <Button
                            variant="link"
                            onClick={() => setIsExpanded(!isExpanded)}
                            className="p-0 mr-2"
                        >
                            {isExpanded ? '▼' : '►'}
                        </Button>
                    )}
                    <IconWrapper>
                        {hasChildren ? (isExpanded ? <FaFolderOpen /> : <FaFolder />) : <FaFile />}
                    </IconWrapper>
                    <CategoryName onClick={() => onSelect(category)}>
                        {category.name}
                        {hasChildren && <ChildrenCount>({category.children.length})</ChildrenCount>}
                    </CategoryName>
                    <OverlayTrigger
                        placement="top"
                        overlay={<Tooltip>상위로 이동</Tooltip>}
                    >
                        <ActionButton variant="outline-secondary" size="sm" onClick={handleMoveUp}>
                            <FaArrowUp />
                        </ActionButton>
                    </OverlayTrigger>
                    <OverlayTrigger
                        placement="top"
                        overlay={<Tooltip>하위로 이동</Tooltip>}
                    >
                        <ActionButton variant="outline-secondary" size="sm" onClick={handleMoveDown}>
                            <FaArrowDown />
                        </ActionButton>
                    </OverlayTrigger>
                    <ActionButton variant="outline-danger" size="sm" onClick={() => onDelete(category.id)}>
                        삭제
                    </ActionButton>
                </div>
            </StyledListItem>
            {isExpanded && hasChildren && (
                <ListGroup>
                    {category.children.map(child => (
                        <CategoryItem
                            key={child.id}
                            category={child}
                            onSelect={onSelect}
                            onDelete={onDelete}
                            onMove={onMove}
                            level={level + 1}
                            parentId={category.id}
                        />
                    ))}
                </ListGroup>
            )}
        </div>
    );
};

const CategoryTree = ({ categories, onSelectCategory, onDeleteCategory, onMoveCategory }) => {
    const [, drop] = useDrop({
        accept: 'CATEGORY',
        drop: (item, monitor) => {
            if (!monitor.didDrop()) {
                onMoveCategory(item.id, null);  // Move to root
            }
        },
    });

    const buildCategoryTree = (categories) => {
        const categoryMap = {};
        categories.forEach(category => {
            categoryMap[category.id] = { ...category, children: [] };
        });

        const rootCategories = [];
        categories.forEach(category => {
            if (category.parentId) {
                categoryMap[category.parentId].children.push(categoryMap[category.id]);
            } else {
                rootCategories.push(categoryMap[category.id]);
            }
        });

        return rootCategories;
    };

    const categoryTree = buildCategoryTree(categories);

    return (
        <div ref={drop}>
            <ListGroup>
                {categoryTree.map(category => (
                    <CategoryItem
                        key={category.id}
                        category={category}
                        onSelect={onSelectCategory}
                        onDelete={onDeleteCategory}
                        onMove={onMoveCategory}
                    />
                ))}
            </ListGroup>
        </div>
    );
};

export default CategoryTree;