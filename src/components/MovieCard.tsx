import React from "react";
import { Link } from "react-router-dom";
import type { Movie } from "../types";
import { posterUrl } from "../api/tmdb";
import { useFavorites } from "../context/FavoritesContext";
import { useReviews } from "../context/ReviewsContext";
import styles from "./MovieCard.module.css";
import StarRating from "./StarRating";

export default function MovieCard({ movie }: { movie: Movie }) {
  const { toggleFavorite, isFavorite } = useFavorites();
  const { getRating, setRating } = useReviews();
  const fav = isFavorite(movie.id);
  const userRating = getRating(movie.id);
  const tmdbRating = movie.vote_average ? Math.round(movie.vote_average / 2) : 0;
  const displayRating = userRating ?? tmdbRating;

  return (
    <article className={styles.card}>
      <Link to={`/movie/${movie.id}`} style={{ textDecoration: "none", color: "inherit" }}>
        <div className={styles.poster}>
          {movie.poster_path ? (
            <img src={posterUrl(movie.poster_path)} alt={movie.title} className={styles.img} />
          ) : (
            <div style={{ padding: 16 }}>{movie.title}</div>
          )}
        </div>
      </Link>
      <div className={styles.body}>
        <div className={styles.meta}>
          <div className={styles.title}>{movie.title}</div>
          <div className={styles.year}>{movie.release_date?.slice(0, 4)}</div>
          <StarRating value={displayRating} onChange={(value) => setRating(movie.id, value)} size="sm" />
          <div className={styles.rating}>TMDB: {(movie.vote_average || 0).toFixed(1)} / 10</div>
        </div>
        <button onClick={() => toggleFavorite(movie)} className={styles.favButton}>
          {fav ? "♥" : "♡"}
        </button>
      </div>
    </article>
  );
}
