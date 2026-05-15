import React from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import AnimatedBackground from "./components/AnimatedBackground";
import Home from "./pages/Home";
import Genres from "./pages/GenresPage";
import Search from "./pages/Search";
import MovieDetail from "./pages/MovieDetail";
import Favorites from "./pages/Favorites";

export default function App() {
  return (
    <div style={{ position: "relative", minHeight: "100vh", isolation: "isolate" }}>
      <AnimatedBackground />
      <Header />
      <main style={{ position: "relative", zIndex: 1 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/genres" element={<Genres />} />
          <Route path="/search" element={<Search />} />
          <Route path="/movie/:id" element={<MovieDetail />} />
          <Route path="/favorites" element={<Favorites />} />
        </Routes>
      </main>
    </div>
  );
}
