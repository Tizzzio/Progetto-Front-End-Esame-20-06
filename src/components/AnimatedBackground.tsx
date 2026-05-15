import React from "react";
import styles from "./AnimatedBackground.module.css";

const particles = Array.from({ length: 28 }, (_, i) => {
  const left = (i * 9.2) % 100;
  const top = (i * 13.7) % 100;
  const size = 3 + (i % 5);
  const duration = 11 + (i % 6);
  const delay = -(i % 13);

  return {
    id: i,
    style: {
      left: `${left}%`,
      top: `${top}%`,
      width: `${size}px`,
      height: `${size}px`,
      animationDuration: `${duration}s`,
      animationDelay: `${delay}s`,
    } as React.CSSProperties,
  };
});

export default function AnimatedBackground() {
  return (
    <div className={styles.background} aria-hidden="true">
      <div className={styles.noise} />
      <div className={`${styles.blob} ${styles.blobA}`} />
      <div className={`${styles.blob} ${styles.blobB}`} />
      <div className={`${styles.blob} ${styles.blobC}`} />
      <div className={styles.glowGrid} />
      <div className={styles.particles}>
        {particles.map((particle) => (
          <span key={particle.id} className={styles.particle} style={particle.style} />
        ))}
      </div>
    </div>
  );
}
