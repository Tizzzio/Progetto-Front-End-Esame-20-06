import React from "react";
import styles from "./StarRating.module.css";

type StarRatingProps = {
  value: number;
  onChange?: (value: number) => void;
  size?: "sm" | "md";
};

export default function StarRating({ value, onChange, size = "md" }: StarRatingProps) {
  const rounded = Math.max(0, Math.min(5, Math.round(value)));

  return (
    <div className={`${styles.wrap} ${styles[size]}`}>
      {[1, 2, 3, 4, 5].map((star) => {
        const active = star <= rounded;
        return (
          <button
            key={star}
            type="button"
            className={`${styles.star} ${active ? styles.active : ""}`}
            onClick={() => onChange?.(star)}
            disabled={!onChange}
            aria-label={`Vota ${star} stelle`}
          >
            ★
          </button>
        );
      })}
    </div>
  );
}
