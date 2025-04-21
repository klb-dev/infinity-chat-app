// src/components/Root.jsx
import React, { useState } from "react";
import App from "../App";
import GlobalStyle from "../styles/GlobalStyle";
import { ThemeProvider } from "styled-components";
import { lightTheme, darkTheme } from "../styles/themes";
import AuthProvider from "./AuthProvider"; // ✅ This must wrap App

const Root = () => {
  const [isDarkMode, setIsDarkMode] = useState(true);

  return (
    <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
      <GlobalStyle />
      <AuthProvider>
        <App toggleTheme={() => setIsDarkMode(!isDarkMode)} isDarkMode={isDarkMode} />
      </AuthProvider>
    </ThemeProvider>
  );
};

export default Root;

