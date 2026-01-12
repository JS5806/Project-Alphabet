import React from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  message: string;
}

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalBox = styled(motion.div)`
  background: white;
  padding: 24px;
  border-radius: 16px;
  width: 80%;
  max-width: 320px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  text-align: center;
`;

const Title = styled.h3`
  margin-bottom: 12px;
  font-size: 18px;
  color: #333;
`;

const Description = styled.p`
  margin-bottom: 24px;
  font-size: 14px;
  color: #666;
  line-height: 1.5;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  justify-content: center;
`;

const Button = styled.button<{ $variant: 'primary' | 'secondary' }>`
  padding: 10px 20px;
  border-radius: 8px;
  border: none;
  font-weight: 600;
  cursor: pointer;
  flex: 1;
  
  background-color: ${({ $variant }) => ($variant === 'primary' ? '#FF6B6B' : '#E0E0E0')};
  color: ${({ $variant }) => ($variant === 'primary' ? 'white' : '#333')};

  &:active {
    opacity: 0.9;
  }
`;

const ConfirmModal: React.FC<ConfirmModalProps> = ({ isOpen, onClose, onConfirm, message }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <Overlay
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose} // 배경 클릭 시 닫기
        >
          <ModalBox
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            onClick={(e) => e.stopPropagation()} // 내부 클릭 전파 방지
          >
            <Title>확인</Title>
            <Description>{message}</Description>
            <ButtonGroup>
              <Button $variant="secondary" onClick={onClose}>취소</Button>
              <Button $variant="primary" onClick={onConfirm}>초기화</Button>
            </ButtonGroup>
          </ModalBox>
        </Overlay>
      )}
    </AnimatePresence>
  );
};

export default ConfirmModal;