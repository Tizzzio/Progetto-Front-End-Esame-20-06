import React, { useEffect, useMemo, useState } from "react";
import TrendingSection from "../components/TrendingSection";
import type { Movie } from "../types";
import { getPopularMovies, hasTmdbKey } from "../api/tmdb";
import { Link } from "react-router-dom";

const demoMovies: Movie[] = [
  { id: 1, title: "Inception", release_date: "2010-07-16", poster_path: null, overview: "A mind-bending sci-fi thriller." },
  { id: 2, title: "The Dark Knight", release_date: "2008-07-18", poster_path: null, overview: "Batman faces the Joker." },
  { id: 3, title: "Interstellar", release_date: "2014-11-07", poster_path: null, overview: "A journey through space and time." },
  { id: 4, title: "Pulp Fiction", release_date: "1994-10-14", poster_path: null, overview: "Crime stories intertwine in Los Angeles." },
  { id: 5, title: "The Matrix", release_date: "1999-03-31", poster_path: null, overview: "Reality is not what it seems." },
  { id: 6, title: "Fight Club", release_date: "1999-10-15", poster_path: null, overview: "An underground fight club changes everything." },
];

export default function Home() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    if (!hasTmdbKey) {
      setMovies(demoMovies);
      setError("Chiave TMDB non configurata: sto mostrando dei film demo.");
      setLoading(false);
      return () => {
        mounted = false;
      };
    }

    getPopularMovies()
      .then((data) => {
        if (!mounted) return;
        setMovies(data.results || []);
      })
      .catch(() => {
        if (!mounted) return;
        setMovies(demoMovies);
        setError("Impossibile caricare i film popolari: sto mostrando dei film demo.");
      })
      .finally(() => {
        if (!mounted) return;
        setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const heroSummary = useMemo(() => {
    if (movies.length === 0) return "Scopri i film per genere, vota le card e apri il dettaglio per recensioni e rating.";
    return `In evidenza: ${movies
      .slice(0, 3)
      .map((movie) => movie.title)
      .join(" • ")}`;
  }, [movies]);

  return (
    <section id="top">
      <h1>Movie DB</h1>
      <p>Film popolari, generi e recensioni in un’unica pagina.</p>
      <p className="badge">Card · rating · recensioni</p>
      <p>{heroSummary}</p>

      {loading && <p>Caricamento film popolari...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && movies.length > 0 && <TrendingSection movies={movies} />}

      {!loading && movies.length === 0 && <p>Nessun film disponibile al momento.</p>}

      <div className="panel" style={{ marginTop: "28px" }}>
        <p className="badge" style={{ marginBottom: "8px" }}>
          Generi
        </p>
        <h2 style={{ margin: 0 }}>Esplora i film per categoria</h2>
        <p style={{ marginBottom: "14px" }}>Sezione dedicata ai generi, separata dalla home.</p>
        <Link to="/genres" className="badge" style={{ textDecoration: "none" }}>
          Vai ai generi
        </Link>
      </div>
    </section>
  );
}
