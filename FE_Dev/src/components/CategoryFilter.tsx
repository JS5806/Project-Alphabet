import React from 'react';
import styled from 'styled-components';
import { Category } from '../types';

interface FilterProps {
  currentCategory: Category;
  onSelectCategory: (category: Category) => void;
  disabled: boolean;
}

const FilterContainer = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  justify-content: center;
  margin-bottom: 20px;
`;

const FilterButton = styled.button<{ $isActive: boolean }>`
  padding: 8px 16px;
  border-radius: 20px;
  background-color: ${(props) => (props.$isActive ? '#333' : '#fff')};
  color: ${(props) => (props.$isActive ? '#fff' : '#333')};
  border: 1px solid #ddd;
  transition: all 0.2s;
  font-weight: 500;

  &:hover {
    background-color: ${(props) => (props.$isActive ? '#333' : '#eee')};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const categories: Category[] = ['ALL', '한식', '중식', '일식', '양식', '분식'];

const CategoryFilter: React.FC<FilterProps> = ({ currentCategory, onSelectCategory, disabled }) => {
  return (
    <FilterContainer>
      {categories.map((cat) => (
        <FilterButton
          key={cat}
          $isActive={currentCategory === cat}
          onClick={() => onSelectCategory(cat)}
          disabled={disabled}
        >
          {cat}
        </FilterButton>
      ))}
    </FilterContainer>
  );
};

export default CategoryFilter;