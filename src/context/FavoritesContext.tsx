import React, { createContext, useContext, useEffect, useState } from "react";
import type { Movie } from "../types";

type FavoritesCtx = {
  favorites: Movie[];
  toggleFavorite: (m: Movie) => void;
  isFavorite: (id: number) => boolean;
};

const FavoritesContext = createContext<FavoritesCtx | undefined>(undefined);

const STORAGE_KEY = "bingewatchers-favorites";

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<Movie[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
    } catch {}
  }, [favorites]);

  function toggleFavorite(m: Movie) {
    setFavorites((prev) => {
      const exists = prev.find((p) => p.id === m.id);
      if (exists) return prev.filter((p) => p.id !== m.id);
      return [m, ...prev];
    });
  }

  function isFavorite(id: number) {
    return favorites.some((f) => f.id === id);
  }

  return <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite }}>{children}</FavoritesContext.Provider>;
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error("useFavorites must be used within FavoritesProvider");
  return ctx;
}
