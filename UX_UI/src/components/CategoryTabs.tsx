import React from 'react';
import styled from 'styled-components';
import { Category } from '../types';

interface CategoryTabsProps {
  selectedCategory: Category;
  onSelect: (category: Category) => void;
}

const TabContainer = styled.div`
  display: flex;
  overflow-x: auto;
  padding: 15px;
  gap: 10px;
  background-color: #fff;
  border-bottom: 1px solid #eee;
  
  /* 스크롤바 숨김 (모바일 UX) */
  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
`;

const TabButton = styled.button<{ $active: boolean }>`
  padding: 8px 16px;
  border-radius: 20px;
  border: none;
  background-color: ${({ $active }) => ($active ? '#333' : '#F0F0F0')};
  color: ${({ $active }) => ($active ? '#fff' : '#666')};
  font-weight: 600;
  font-size: 14px;
  white-space: nowrap;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${({ $active }) => ($active ? '#333' : '#E0E0E0')};
  }
`;

const categories: Category[] = ['All', 'Korean', 'Chinese', 'Japanese', 'Western'];

const CategoryTabs: React.FC<CategoryTabsProps> = ({ selectedCategory, onSelect }) => {
  return (
    <TabContainer>
      {categories.map((cat) => (
        <TabButton
          key={cat}
          $active={selectedCategory === cat}
          onClick={() => onSelect(cat)}
        >
          {cat === 'All' ? '전체' : cat}
        </TabButton>
      ))}
    </TabContainer>
  );
};

export default CategoryTabs;