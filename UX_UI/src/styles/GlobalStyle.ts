import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    background-color: #F8F9FA;
    color: #333;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    display: flex;
    justify-content: center;
    min-height: 100vh;
  }

  #root {
    width: 100%;
    max-width: 480px; /* 모바일 뷰포트 제한 */
    background-color: white;
    box-shadow: 0 0 20px rgba(0,0,0,0.05);
    min-height: 100vh;
    position: relative;
    overflow-x: hidden;
  }
`;

export default GlobalStyle;