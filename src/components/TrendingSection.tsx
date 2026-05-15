import React from "react";
import type { Movie } from "../types";
import MovieCard from "./MovieCard";
import styles from "./TrendingSection.module.css";

export default function TrendingSection({ movies }: { movies: Movie[] }) {
  return (
    <section className={`${styles.section} panel`}>
      <div className={styles.header}>
        <div>
          <p className={styles.kicker}>In tendenza</p>
          <h2 className={styles.title}>Film più visti</h2>
        </div>
        <span className="badge">2 righe · scroll</span>
      </div>

      <div className={styles.grid}>
        {movies.map((movie) => (
          <div key={movie.id} className={styles.item}>
            <MovieCard movie={movie} />
          </div>
        ))}
      </div>
    </section>
  );
}
