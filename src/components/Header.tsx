import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import styles from "./Header.module.css";

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

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
      <div className={styles.userSection}>
        <span className={styles.username}>
          {user?.username} ({user?.role === "admin" ? "Admin" : "User"})
        </span>
        <button className={styles.logoutBtn} onClick={handleLogout}>
          Logout
        </button>
      </div>
    </header>
  );
}
