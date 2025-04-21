// src/styles/GlobalStyle.jsx
import { createGlobalStyle } from "styled-components";
import "@fontsource/inter"; 

const GlobalStyle = createGlobalStyle`
  *, *::before, *::after {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html, body, #root {
    height: 100%;
    font-family: 'Inter', sans-serif;
    background-color: ${({ theme }) => theme.background};
    color: ${({ theme }) => theme.text};
    transition: all 0.3s ease-in-out;
  }

  button {
    font-family: inherit;
    cursor: pointer;
  }
`;

export default GlobalStyle;
