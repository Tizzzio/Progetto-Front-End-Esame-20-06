import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import styles from "./Profile.module.css";

interface Suggestion {
  id: string;
  title: string;
  message: string;
  timestamp: string;
}

export default function Profile() {
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);
  const [suggestions, setSuggestions] = useState<Suggestion[]>(() => {
    const stored = localStorage.getItem("site_suggestions");
    return stored ? JSON.parse(stored) : [];
  });

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!title.trim()) newErrors.title = "Il titolo è obbligatorio";
    if (title.length > 80) newErrors.title = "Il titolo non può superare 80 caratteri";
    if (!message.trim()) newErrors.message = "Il messaggio è obbligatorio";
    if (message.length > 500) newErrors.message = "Il messaggio non può superare 500 caratteri";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === "title") setTitle(value);
    if (name === "message") setMessage(value);
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(false);

    if (!validateForm()) return;

    const newSuggestion: Suggestion = {
      id: `sug_${Date.now()}`,
      title,
      message,
      timestamp: new Date().toLocaleString("it-IT"),
    };

    const updated = [...suggestions, newSuggestion];
    setSuggestions(updated);
    localStorage.setItem("site_suggestions", JSON.stringify(updated));

    setTitle("");
    setMessage("");
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  const handleDelete = (id: string) => {
    const updated = suggestions.filter((s) => s.id !== id);
    setSuggestions(updated);
    localStorage.setItem("site_suggestions", JSON.stringify(updated));
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1>Consigli per il sito</h1>
        <p className={styles.subtitle}>Aiutaci a migliorare! Condividi i tuoi suggerimenti.</p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="title">Titolo del consiglio *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={title}
              onChange={handleChange}
              placeholder="Es: Aggiungere filtri più avanzati"
              maxLength={80}
              className={errors.title ? styles.inputError : ""}
            />
            <small>{title.length}/80</small>
            {errors.title && <span className={styles.error}>{errors.title}</span>}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="message">Il tuo consiglio * ({message.length}/500)</label>
            <textarea
              id="message"
              name="message"
              value={message}
              onChange={handleChange}
              placeholder="Descrivi il tuo suggerimento in dettaglio..."
              rows={4}
              maxLength={500}
              className={errors.message ? styles.textareaError : ""}
            />
            {errors.message && <span className={styles.error}>{errors.message}</span>}
          </div>

          {success && <p className={styles.success}>Grazie per il tuo suggerimento!</p>}

          <button type="submit" className={styles.submitBtn}>
            Invia Consiglio
          </button>
        </form>
      </div>

      <div className={styles.card}>
        <h2>I tuoi suggerimenti ({suggestions.length})</h2>
        {suggestions.length === 0 ? (
          <p className={styles.empty}>Nessun suggerimento ancora. Sii il primo!</p>
        ) : (
          <div className={styles.suggestionsList}>
            {suggestions.map((sug) => (
              <div key={sug.id} className={styles.suggestionItem}>
                <h4>{sug.title}</h4>
                <p>{sug.message}</p>
                <div className={styles.suggestionFooter}>
                  <small>{sug.timestamp}</small>
                  <button className={styles.deleteBtn} onClick={() => handleDelete(sug.id)}>
                    Elimina
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
