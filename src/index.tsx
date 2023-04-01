import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./app/App";
import "./style/style.css";
import { ThemeProvider } from "styled-components";
import { theme } from "./app/Layout/theme";

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);

root.render(
  <ThemeProvider theme={theme}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </ThemeProvider>
);
