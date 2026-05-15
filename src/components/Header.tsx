import React from "react";
import { Link } from "react-router-dom";
import styles from "./Header.module.css";

export default function Header() {
  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        <Link className={styles.link} to="/">
          Home
        </Link>
        <Link className={styles.link} to="/search">
          Search
        </Link>
        <Link className={styles.link} to="/genres">
          Generi
        </Link>
        <Link className={styles.link} to="/favorites">
          Favorites
        </Link>
      </nav>
    </header>
  );
}
