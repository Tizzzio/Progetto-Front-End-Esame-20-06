import React, { useEffect, useRef, useState } from "react";
import styles from "./SearchBar.module.css";
export default function SearchBar({ onSearch, debounceMs = 500 }: { onSearch: (q: string) => void; debounceMs?: number }) {
  const [q, setQ] = useState("");
  const timer = useRef<number | null>(null);

  function submit(e?: React.FormEvent) {
    e?.preventDefault();
    if (!q.trim()) return;
    onSearch(q.trim());
  }

  useEffect(() => {
    if (timer.current) window.clearTimeout(timer.current);
    if (!q.trim()) return;
    timer.current = window.setTimeout(() => onSearch(q.trim()), debounceMs);
    return () => {
      if (timer.current) window.clearTimeout(timer.current);
    };
  }, [q, debounceMs, onSearch]);

  return (
    <form onSubmit={submit} className={styles.form}>
      <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Cerca un film..." className={styles.input} />
      <button type="submit" className={styles.button}>
        Cerca
      </button>
    </form>
  );
}
