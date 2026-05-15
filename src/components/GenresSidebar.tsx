import React from "react";
import styles from "./GenresSidebar.module.css";

type Props = {
  query: string;
  onQueryChange: (value: string) => void;
  sortMode: "alpha" | "count-desc" | "count-asc";
  onSortModeChange: (value: "alpha" | "count-desc" | "count-asc") => void;
  items: { key: string; label: string; count?: number; active?: boolean }[];
  onSelect: (key: string) => void;
};

export default function GenresSidebar({ query, onQueryChange, sortMode, onSortModeChange, items, onSelect }: Props) {
  return (
    <aside className={`${styles.sidebar} panel`}>
      <div className={styles.section}>
        <p className={styles.kicker}>Filtri</p>
        <label className={styles.label} htmlFor="genre-search">
          Cerca genere
        </label>
        <input
          id="genre-search"
          className={styles.input}
          type="text"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Action, Drama..."
        />

        <label className={styles.label} htmlFor="genre-sort">
          Ordina per
        </label>
        <select id="genre-sort" className={styles.select} value={sortMode} onChange={(e) => onSortModeChange(e.target.value as Props["sortMode"])}>
          <option value="alpha">A-Z</option>
          <option value="count-desc">Più film</option>
          <option value="count-asc">Meno film</option>
        </select>
      </div>

      <div className={styles.section}>
        <p className={styles.kicker}>Sezioni</p>
        <div className={styles.links}>
          {items.length === 0 ? (
            <span className={styles.empty}>Nessuna corrispondenza</span>
          ) : (
            items.map((item) => (
              <button
                key={item.key}
                type="button"
                className={`${styles.link} ${item.active ? styles.active : ""}`}
                onClick={() => onSelect(item.key)}
              >
                <span>{item.label}</span>
              </button>
            ))
          )}
        </div>
      </div>
    </aside>
  );
}
