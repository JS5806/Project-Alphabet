import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body {
    font-family: 'Noto Sans KR', sans-serif;
    background-color: #f4f4f8;
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
  }

  button {
    cursor: pointer;
    border: none;
    font-family: inherit;
  }
`;

export default GlobalStyle;