import React, { useState, useCallback, useRef } from "react";
import SearchBar from "../components/SearchBar";
import { searchMovies } from "../api/tmdb";
import type { Movie } from "../types";
import MovieCard from "../components/MovieCard";
import Pagination from "../components/Pagination";

export default function Search() {
  const [results, setResults] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [query, setQuery] = useState("");

  const topRef = useRef<HTMLElement | null>(null);
  const scrollPending = useRef(false);

  const doSearch = useCallback(async (q: string, p = 1) => {
    setLoading(true);
    setError(null);
    try {
      const data = await searchMovies(q, p);
      setResults(data.results || []);
      setTotalPages(data.total_pages || 1);
      setPage(p);
      setQuery(q);
    } catch (err) {
      setError("Errore durante la ricerca");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSearch = useCallback(
    (q: string) => {
      void doSearch(q, 1);
    },
    [doSearch],
  );

  function handlePageChange(p: number) {
    if (!query) return;
    const next = Math.max(1, Math.min(totalPages, p));
    scrollPending.current = true;
    void doSearch(query, next);
  }

  React.useEffect(() => {
    if (!scrollPending.current) return;
    scrollPending.current = false;
    if (!topRef.current) return;
    // Wait for DOM update, then smooth scroll
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        const rect = topRef.current!.getBoundingClientRect();
        const target = window.scrollY + rect.top - 80;
        window.scrollTo({ top: Math.max(0, target), behavior: "smooth" });
      }),
    );
  }, [results, page]);

  return (
    <section ref={topRef}>
      <h2>Search</h2>
      <p>Cerca un titolo e assegna il tuo rating direttamente dalle card.</p>
      <SearchBar onSearch={handleSearch} />
      {loading && <p>Caricamento...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {!loading && !error && results.length === 0 && query && <p>Nessun risultato per "{query}"</p>}

      <div className="grid">
        {results.map((r) => (
          <MovieCard key={r.id} movie={r} />
        ))}
      </div>

      <Pagination page={page} totalPages={totalPages} onChange={handlePageChange} />
    </section>
  );
}
