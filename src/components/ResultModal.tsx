import React from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu } from '../types';

interface ResultModalProps {
  isVisible: boolean;
  selectedMenu: Menu | null;
  onConfirm: () => void;
  onRetry: () => void;
}

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  padding: 20px;
`;

const ModalContent = styled(motion.div)`
  background: white;
  padding: 30px;
  border-radius: 20px;
  text-align: center;
  width: 100%;
  max-width: 320px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.2);
`;

const Title = styled.h2`
  margin-bottom: 10px;
  color: #333;
  font-size: 1.2rem;
`;

const MenuName = styled.h1`
  font-size: 2rem;
  color: #ff4757;
  margin-bottom: 30px;
  font-weight: 800;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  justify-content: center;
`;

const ActionButton = styled.button<{ variant?: 'primary' | 'secondary' }>`
  flex: 1;
  padding: 12px 0;
  border-radius: 12px;
  font-weight: 600;
  font-size: 1rem;
  transition: opacity 0.2s;

  background-color: ${(props) => (props.variant === 'primary' ? '#ff4757' : '#f1f2f6')};
  color: ${(props) => (props.variant === 'primary' ? '#fff' : '#57606f')};

  &:active {
    opacity: 0.8;
  }
`;

const ResultModal: React.FC<ResultModalProps> = ({ isVisible, selectedMenu, onConfirm, onRetry }) => {
  return (
    <AnimatePresence>
      {isVisible && selectedMenu && (
        <Overlay
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <ModalContent
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            <Title>오늘의 추천 메뉴 🎉</Title>
            <MenuName>{selectedMenu.name}</MenuName>
            <ButtonGroup>
              <ActionButton variant="secondary" onClick={onRetry}>
                다시 돌리기
              </ActionButton>
              <ActionButton variant="primary" onClick={onConfirm}>
                식사 확정
              </ActionButton>
            </ButtonGroup>
          </ModalContent>
        </Overlay>
      )}
    </AnimatePresence>
  );
};

export default ResultModal;