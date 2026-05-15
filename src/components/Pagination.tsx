import React from "react";
import styles from "./Pagination.module.css";

export default function Pagination({ page, totalPages, onChange }: { page: number; totalPages: number; onChange: (p: number) => void }) {
  if (totalPages <= 1) return null;

  return (
    <div className={styles.container}>
      <button className={styles.button} onClick={() => onChange(page - 1)} disabled={page <= 1}>
        Prev
      </button>
      <div className={styles.count}>
        {page} / {totalPages}
      </div>
      <button className={styles.button} onClick={() => onChange(page + 1)} disabled={page >= totalPages}>
        Next
      </button>
    </div>
  );
}
