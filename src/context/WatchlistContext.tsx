import React, { createContext, useState } from "react";

export interface Watchlist {
  id: string;
  name: string;
  description: string;
  movieIds: number[];
  createdAt: string;
}

interface WatchlistContextType {
  watchlists: Watchlist[];
  addWatchlist: (watchlist: Omit<Watchlist, "id" | "createdAt">) => void;
  deleteWatchlist: (id: string) => void;
  addMovieToWatchlist: (watchlistId: string, movieId: number) => void;
  removeMovieFromWatchlist: (watchlistId: string, movieId: number) => void;
}

const WatchlistContext = createContext<WatchlistContextType | undefined>(undefined);

export const WatchlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [watchlists, setWatchlists] = useState<Watchlist[]>(() => {
    const stored = localStorage.getItem("watchlists");
    return stored ? JSON.parse(stored) : [];
  });

  const addWatchlist = (watchlist: Omit<Watchlist, "id" | "createdAt">) => {
    const newWatchlist: Watchlist = {
      ...watchlist,
      id: `wl_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    const updated = [...watchlists, newWatchlist];
    setWatchlists(updated);
    localStorage.setItem("watchlists", JSON.stringify(updated));
  };

  const deleteWatchlist = (id: string) => {
    const updated = watchlists.filter((wl) => wl.id !== id);
    setWatchlists(updated);
    localStorage.setItem("watchlists", JSON.stringify(updated));
  };

  const addMovieToWatchlist = (watchlistId: string, movieId: number) => {
    const updated = watchlists.map((wl) => {
      if (wl.id === watchlistId && !wl.movieIds.includes(movieId)) {
        return { ...wl, movieIds: [...wl.movieIds, movieId] };
      }
      return wl;
    });
    setWatchlists(updated);
    localStorage.setItem("watchlists", JSON.stringify(updated));
  };

  const removeMovieFromWatchlist = (watchlistId: string, movieId: number) => {
    const updated = watchlists.map((wl) => {
      if (wl.id === watchlistId) {
        return { ...wl, movieIds: wl.movieIds.filter((id) => id !== movieId) };
      }
      return wl;
    });
    setWatchlists(updated);
    localStorage.setItem("watchlists", JSON.stringify(updated));
  };

  return (
    <WatchlistContext.Provider value={{ watchlists, addWatchlist, deleteWatchlist, addMovieToWatchlist, removeMovieFromWatchlist }}>
      {children}
    </WatchlistContext.Provider>
  );
};

export const useWatchlists = () => {
  const context = React.useContext(WatchlistContext);
  if (!context) {
    throw new Error("useWatchlists must be used within WatchlistProvider");
  }
  return context;
};
