import React from "react";
import type { Movie } from "../types";
import MovieCard from "./MovieCard";
import styles from "./GenreSection.module.css";

export default function GenreSection({ title, movies, targetId }: { title: string; movies: Movie[]; targetId: string }) {
  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <div>
          <p className={styles.kicker}>Anteprima genere</p>
          <h3 className={styles.title}>{title}</h3>
        </div>
        <div className={styles.actions}>
          <span className="badge">{movies.length} film</span>
          <a className={styles.cta} href={`#${targetId}`}>
            Tutti i film
          </a>
        </div>
      </div>
      <div className={styles.row}>
        {movies.map((movie) => (
          <div key={movie.id} className={styles.item}>
            <MovieCard movie={movie} />
          </div>
        ))}
      </div>
    </section>
  );
}
