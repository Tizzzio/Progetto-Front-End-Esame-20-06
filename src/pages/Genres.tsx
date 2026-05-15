import React, { useEffect, useMemo, useState } from "react";
import { getMovieGenres, getMoviesByGenre, hasTmdbKey } from "../api/tmdb";
import GenreFullSection from "../components/GenreFullSection";
import GenresSidebar from "../components/GenresSidebar";
import PageLoader from "../components/PageLoader";
import type { Genre, Movie } from "../types";
import styles from "./Genres.module.css";

const demoGenres = ["Action", "Drama", "Science Fiction", "Thriller", "Adventure", "Comedy", "Horror", "Romance", "Animation", "Crime"];
const demoMovies: Movie[] = [
  { id: 1, title: "Inception", release_date: "2010-07-16", poster_path: null, overview: "A mind-bending sci-fi thriller." },
  { id: 2, title: "The Dark Knight", release_date: "2008-07-18", poster_path: null, overview: "Batman faces the Joker." },
  { id: 3, title: "Interstellar", release_date: "2014-11-07", poster_path: null, overview: "A journey through space and time." },
  { id: 4, title: "Pulp Fiction", release_date: "1994-10-14", poster_path: null, overview: "Crime stories intertwine in Los Angeles." },
  { id: 5, title: "The Matrix", release_date: "1999-03-31", poster_path: null, overview: "Reality is not what it seems." },
  { id: 6, title: "Fight Club", release_date: "1999-10-15", poster_path: null, overview: "An underground fight club changes everything." },
];

const demoGenreMap: Record<string, Movie[]> = {
  Action: [demoMovies[1], demoMovies[4], demoMovies[0], demoMovies[2], demoMovies[5], demoMovies[3]],
  Drama: [demoMovies[3], demoMovies[5], demoMovies[0], demoMovies[1], demoMovies[2], demoMovies[4]],
  "Science Fiction": [demoMovies[0], demoMovies[2], demoMovies[4], demoMovies[5], demoMovies[1], demoMovies[3]],
  Thriller: [demoMovies[1], demoMovies[0], demoMovies[5], demoMovies[4], demoMovies[3], demoMovies[2]],
  Adventure: [demoMovies[2], demoMovies[0], demoMovies[4], demoMovies[1], demoMovies[5], demoMovies[3]],
  Comedy: [demoMovies[3], demoMovies[4], demoMovies[5], demoMovies[0], demoMovies[1], demoMovies[2]],
  Horror: [demoMovies[5], demoMovies[1], demoMovies[0], demoMovies[2], demoMovies[3], demoMovies[4]],
  Romance: [demoMovies[3], demoMovies[0], demoMovies[2], demoMovies[4], demoMovies[5], demoMovies[1]],
  Animation: [demoMovies[0], demoMovies[2], demoMovies[3], demoMovies[4], demoMovies[5], demoMovies[1]],
  Crime: [demoMovies[4], demoMovies[3], demoMovies[1], demoMovies[5], demoMovies[0], demoMovies[2]],
};

type GenreOption = { key: string; id: number; name: string };

function uniqueById(movies: Movie[]) {
  return Array.from(new Map(movies.map((movie) => [movie.id, movie])).values());
}

function genreSlug(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

export default function Genres() {
  const [genreOptions, setGenreOptions] = useState<GenreOption[]>([]);
  const [moviesByGenre, setMoviesByGenre] = useState<Record<string, Movie[]>>({});
  const [selectedGenreKey, setSelectedGenreKey] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [sortMode, setSortMode] = useState<"alpha" | "count-desc" | "count-asc">("alpha");
  const [loading, setLoading] = useState(true);
  const [loadingSelected, setLoadingSelected] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function load() {
      const mappedDemo = demoGenres.map((name, index) => ({ key: name, id: index + 1, name }));

      if (!hasTmdbKey) {
        if (!mounted) return;
        setGenreOptions(mappedDemo);
        setLoading(false);
        return;
      }

      const available = await getMovieGenres().catch(() => []);
      const selected = (available.length ? available : []).filter((genre: Genre) => demoGenres.includes(genre.name));
      const mapped = selected.length ? selected.map((genre) => ({ key: genre.name, id: genre.id, name: genre.name })) : mappedDemo;

      if (!mounted) return;
      setGenreOptions(mapped);
      setLoading(false);
    }

    load().catch(() => {
      if (!mounted) return;
      setGenreOptions(demoGenres.map((name, index) => ({ key: name, id: index + 1, name })));
      setLoading(false);
    });

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!selectedGenreKey) return;
    if (moviesByGenre[selectedGenreKey]) return;

    const selected = genreOptions.find((genre) => genre.key === selectedGenreKey);
    if (!selected) return;
    const selectedGenre = selected;

    let mounted = true;
    setLoadingSelected(true);

    async function loadSelectedGenre() {
      if (!hasTmdbKey) {
        const fallback = demoGenreMap[selectedGenre.name] || demoMovies.slice(0, 15);
        if (!mounted) return;
        setMoviesByGenre((prev) => ({ ...prev, [selectedGenre.key]: fallback }));
        setLoadingSelected(false);
        return;
      }

      try {
        const [pageOne, pageTwo, pageThree] = await Promise.all([
          getMoviesByGenre(selectedGenre.id, 1),
          getMoviesByGenre(selectedGenre.id, 2),
          getMoviesByGenre(selectedGenre.id, 3),
        ]);
        const merged = uniqueById([...(pageOne.results || []), ...(pageTwo.results || []), ...(pageThree.results || [])]);
        if (!mounted) return;
        setMoviesByGenre((prev) => ({ ...prev, [selectedGenre.key]: merged.slice(0, 45) }));
      } catch {
        if (!mounted) return;
        const fallback = demoGenreMap[selectedGenre.name] || demoMovies.slice(0, 15);
        setMoviesByGenre((prev) => ({ ...prev, [selectedGenre.key]: fallback }));
      } finally {
        if (mounted) setLoadingSelected(false);
      }
    }

    loadSelectedGenre().catch(() => {
      if (!mounted) return;
      setLoadingSelected(false);
    });

    return () => {
      mounted = false;
    };
  }, [selectedGenreKey, genreOptions, moviesByGenre]);

  const summary = useMemo(() => {
    const names = genreOptions.map((genre) => genre.name);
    if (names.length === 0) return "Sezioni dedicate ai principali generi.";
    return `Generi disponibili: ${names.join(" · ")}`;
  }, [genreOptions]);

  const filteredGenres = useMemo(() => {
    const search = query.trim().toLowerCase();
    const entries = genreOptions.filter((genre) => (search ? genre.name.toLowerCase().includes(search) : true));

    const sorted = [...entries];
    if (sortMode === "alpha") {
      sorted.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortMode === "count-desc") {
      sorted.sort((a, b) => (moviesByGenre[b.key]?.length || 0) - (moviesByGenre[a.key]?.length || 0) || a.name.localeCompare(b.name));
    } else {
      sorted.sort((a, b) => (moviesByGenre[a.key]?.length || 0) - (moviesByGenre[b.key]?.length || 0) || a.name.localeCompare(b.name));
    }

    return sorted;
  }, [query, genreOptions, sortMode, moviesByGenre]);

  const sidebarItems = useMemo(
    () =>
      filteredGenres.map((genre) => ({
        key: genre.key,
        label: genre.name,
        count: moviesByGenre[genre.key]?.length,
        active: selectedGenreKey === genre.key,
      })),
    [filteredGenres, moviesByGenre, selectedGenreKey],
  );

  const selectedGenre = useMemo(() => genreOptions.find((genre) => genre.key === selectedGenreKey) || null, [genreOptions, selectedGenreKey]);
  const selectedMovies = selectedGenre ? moviesByGenre[selectedGenre.key] || [] : [];

  return (
    <section>
      <h1 id="top">Generi</h1>
      <p className={styles.summary}>Collezione completa per categoria.</p>
      <p className="badge">Seleziona un genere dalla sidebar</p>
      <p>{summary}</p>

      {!loading && (
        <div className={styles.page}>
          <div className={styles.mobileOnly}>
            <div className={`panel ${styles.headerCard}`}>
              <p className="badge" style={{ marginBottom: "8px" }}>
                Filtri e sezioni
              </p>
              <p style={{ marginBottom: 0 }}>Usa la sidebar per cercare e scegliere un genere.</p>
            </div>
          </div>

          <GenresSidebar
            query={query}
            onQueryChange={setQuery}
            sortMode={sortMode}
            onSortModeChange={setSortMode}
            items={sidebarItems}
            onSelect={setSelectedGenreKey}
          />

          <div className={styles.content}>
            {!selectedGenre && (
              <div className="panel">
                <p className="badge">Seleziona un genere</p>
                <p style={{ marginBottom: 0 }}>Nessun film viene mostrato finché non scegli una categoria dalla sidebar.</p>
              </div>
            )}

            {selectedGenre && loadingSelected && <PageLoader label={`Caricamento ${selectedGenre.name}...`} />}

            {selectedGenre && !loadingSelected && selectedMovies.length > 0 && (
              <GenreFullSection id={genreSlug(selectedGenre.name)} title={selectedGenre.name} movies={selectedMovies} />
            )}

            {selectedGenre && !loadingSelected && selectedMovies.length === 0 && (
              <div className="panel">
                <p className="badge">Nessun film</p>
                <p style={{ marginBottom: 0 }}>Non ci sono film disponibili per il genere selezionato.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {loading && <PageLoader label="Caricamento generi..." />}
    </section>
  );
}
