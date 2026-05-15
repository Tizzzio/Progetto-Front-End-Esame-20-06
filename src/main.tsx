import React from "react";
import { createRoot } from "react-dom/client";
import { HashRouter } from "react-router-dom";
import App from "./App";
import "./styles/global.css";
import { FavoritesProvider } from "./context/FavoritesContext";
import { ReviewsProvider } from "./context/ReviewsContext";
import { AuthProvider } from "./context/AuthContext";

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider>
      <ReviewsProvider>
        <FavoritesProvider>
          <HashRouter>
            <App />
          </HashRouter>
        </FavoritesProvider>
      </ReviewsProvider>
    </AuthProvider>
  </React.StrictMode>,
);
