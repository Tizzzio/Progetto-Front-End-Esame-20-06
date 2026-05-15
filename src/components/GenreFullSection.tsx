import React from "react";
import type { Movie } from "../types";
import MovieCard from "./MovieCard";
import styles from "./GenreFullSection.module.css";

export default function GenreFullSection({ id, title, movies }: { id: string; title: string; movies: Movie[] }) {
  return (
    <section id={id} className={`${styles.section} panel`}>
      <div className={styles.header}>
        <div>
          <p className={styles.kicker}>Sezione completa</p>
          <h3 className={styles.title}>{title}</h3>
        </div>
        <a className={styles.back} href="#top">
          Torna su
        </a>
      </div>

      <div className="grid">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </section>
  );
}
