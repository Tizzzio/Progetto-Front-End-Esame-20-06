import React from "react";
import { createRoot } from "react-dom/client";
import { HashRouter } from "react-router-dom";
import { Provider } from "react-redux";
import App from "./App";
import "./styles/global.css";
import { store } from "./redux/store";
import { FavoritesProvider } from "./context/FavoritesContext";
import { ReviewsProvider } from "./context/ReviewsContext";
import { AuthProvider } from "./context/AuthContext";
import { WatchlistProvider } from "./context/WatchlistContext";

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <AuthProvider>
        <WatchlistProvider>
          <ReviewsProvider>
            <FavoritesProvider>
              <HashRouter>
                <App />
              </HashRouter>
            </FavoritesProvider>
          </ReviewsProvider>
        </WatchlistProvider>
      </AuthProvider>
    </Provider>
  </React.StrictMode>,
);
