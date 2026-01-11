import React from 'react';
import styled from 'styled-components';
import GlobalStyle from './styles/GlobalStyle';
import { RouletteWheel } from './components/RouletteWheel';
import { Controls } from './components/Controls';

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 20px;
  background: #f0f2f5;
  min-height: 100vh;
`;

const Title = styled.h1`
  margin-bottom: 40px;
  color: #333;
  font-size: 2rem;
  font-weight: 900;
  text-align: center;
  
  span {
    color: #4ECDC4;
  }
`;

function App() {
  return (
    <>
      <GlobalStyle />
      <AppContainer>
        <Title>오늘 뭐 <span>먹지?</span></Title>
        <RouletteWheel />
        <Controls />
      </AppContainer>
    </>
  );
}

export default App;