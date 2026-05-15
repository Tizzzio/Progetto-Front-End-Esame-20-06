import React, { useCallback, useRef } from "react";
import SearchBar from "../components/SearchBar";
import type { Movie } from "../types";
import MovieCard from "../components/MovieCard";
import Pagination from "../components/Pagination";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { fetchSearchResults } from "../redux/slices/searchSlice";

export default function Search() {
  const dispatch = useAppDispatch();
  const { results, loading, error, query, currentPage, totalPages } = useAppSelector((state) => state.search);
  const topRef = useRef<HTMLElement | null>(null);
  const scrollPending = useRef(false);

  const handleSearch = useCallback(
    (q: string) => {
      void dispatch(fetchSearchResults({ query: q, page: 1 }));
    },
    [dispatch],
  );

  function handlePageChange(p: number) {
    if (!query) return;
    scrollPending.current = true;
    void dispatch(fetchSearchResults({ query, page: p }));
  }

  React.useEffect(() => {
    if (!scrollPending.current) return;
    scrollPending.current = false;
    if (!topRef.current) return;
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        const rect = topRef.current!.getBoundingClientRect();
        const target = window.scrollY + rect.top - 80;
        window.scrollTo({ top: Math.max(0, target), behavior: "smooth" });
      }),
    );
  }, [results, currentPage]);

  return (
    <section ref={topRef}>
      <h2>Search</h2>
      <p>Cerca un titolo e assegna il tuo rating direttamente dalle card.</p>
      <SearchBar onSearch={handleSearch} />
      {loading && <p>Caricamento...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {!loading && !error && results.length === 0 && query && <p>Nessun risultato per "{query}"</p>}

      <div className="grid">
        {results.map((r: Movie) => (
          <MovieCard key={r.id} movie={r} />
        ))}
      </div>

      <Pagination page={currentPage} totalPages={totalPages} onChange={handlePageChange} />
    </section>
  );
}
