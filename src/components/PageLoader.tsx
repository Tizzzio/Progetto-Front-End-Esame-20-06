import React from "react";
import styles from "./PageLoader.module.css";

export default function PageLoader({ label = "Caricamento..." }: { label?: string }) {
  return (
    <div className={styles.wrap} aria-live="polite" aria-busy="true">
      <div className={styles.spinner} />
      <p className={styles.label}>{label}</p>
      <div className={styles.skeletons}>
        <span />
        <span />
        <span />
      </div>
    </div>
  );
}
