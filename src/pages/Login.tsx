import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth, type UserRole } from "../context/AuthContext";
import styles from "./Login.module.css";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [role, setRole] = useState<UserRole>("user");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!username.trim()) {
      setError("Inserisci un username");
      return;
    }

    login(username, "fake_password", role);
    navigate("/");
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginBox}>
        <h1>Movie DB Login</h1>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Inserisci username"
              className={styles.input}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="role">Ruolo:</label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value as UserRole)}
              className={styles.select}
            >
              <option value="user">Utente normale</option>
              <option value="admin">Amministratore</option>
            </select>
          </div>

          {error && <p className={styles.error}>{error}</p>}

          <button type="submit" className={styles.button}>
            Accedi
          </button>
        </form>

        <div className={styles.info}>
          <p><strong>Demo Login:</strong></p>
          <p>Username: qualsiasi testo</p>
          <p>Password: non richiesta (autenticazione fake)</p>
        </div>
      </div>
    </div>
  );
}
