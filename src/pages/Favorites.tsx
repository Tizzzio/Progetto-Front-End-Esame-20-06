import React from "react";
import { useFavorites } from "../context/FavoritesContext";
import MovieCard from "../components/MovieCard";
import styles from "./Favorites.module.css";

export default function Favorites() {
  const { favorites } = useFavorites();

  return (
    <section>
      <h2>Favorites</h2>
      <p>Film salvati e rating personali.</p>
      {favorites.length === 0 ? (
        <p className={styles.empty}>Non hai ancora aggiunto film ai preferiti.</p>
      ) : (
        <div className="grid">
          {favorites.map((f) => (
            <MovieCard key={f.id} movie={f} />
          ))}
        </div>
      )}
    </section>
  );
}
