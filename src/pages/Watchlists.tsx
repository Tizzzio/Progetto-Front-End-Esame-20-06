import React, { useState } from "react";
import { useWatchlists } from "../context/WatchlistContext";
import styles from "./Watchlists.module.css";

export default function Watchlists() {
  const { watchlists, addWatchlist, deleteWatchlist } = useWatchlists();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) newErrors.name = "Il nome della lista è obbligatorio";
    if (name.length > 50) newErrors.name = "Il nome non può superare 50 caratteri";
    if (description.length > 300) newErrors.description = "La descrizione non può superare 300 caratteri";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name: fieldName, value } = e.target;
    if (fieldName === "name") setName(value);
    if (fieldName === "description") setDescription(value);
    setErrors((prev) => ({ ...prev, [fieldName]: "" }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(false);

    if (!validateForm()) return;

    addWatchlist({ name, description, movieIds: [] });
    setName("");
    setDescription("");
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  const handleDelete = (id: string) => {
    if (confirm("Sei sicuro di voler eliminare questa lista?")) {
      deleteWatchlist(id);
    }
  };

  return (
    <div className={styles.container}>
      <h1>Le Mie Watchlist</h1>

      <div className={styles.formCard}>
        <h2>Crea una nuova lista</h2>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="name">Nome lista *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={name}
              onChange={handleChange}
              placeholder="Es: I miei film horror preferiti"
              maxLength={50}
              className={errors.name ? styles.inputError : ""}
            />
            <small>{name.length}/50</small>
            {errors.name && <span className={styles.error}>{errors.name}</span>}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="description">Descrizione ({description.length}/300)</label>
            <textarea
              id="description"
              name="description"
              value={description}
              onChange={handleChange}
              placeholder="Descrivi il tema o lo scopo della lista..."
              rows={3}
              maxLength={300}
              className={errors.description ? styles.textareaError : ""}
            />
            {errors.description && <span className={styles.error}>{errors.description}</span>}
          </div>

          {success && <p className={styles.success}>Lista creata con successo!</p>}

          <button type="submit" className={styles.submitBtn}>
            Crea Lista
          </button>
        </form>
      </div>

      <div className={styles.listCard}>
        <h2>Tue liste ({watchlists.length})</h2>
        {watchlists.length === 0 ? (
          <p className={styles.empty}>Nessuna lista creata. Inizia a crearne una!</p>
        ) : (
          <ul className={styles.list}>
            {watchlists.map((wl) => (
              <li key={wl.id} className={styles.listItem}>
                <div className={styles.listInfo}>
                  <h3>{wl.name}</h3>
                  {wl.description && <p>{wl.description}</p>}
                  <small>{wl.movieIds.length} film nella lista</small>
                </div>
                <button className={styles.deleteBtn} onClick={() => handleDelete(wl.id)}>
                  Elimina
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
