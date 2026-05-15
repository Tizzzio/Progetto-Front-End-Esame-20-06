import React, { useState } from "react";
import styles from "./Support.module.css";

interface ContactMessage {
  id: string;
  email: string;
  subject: string;
  message: string;
  timestamp: string;
  status: "pending" | "replied";
}

export default function Support() {
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);
  const [messages, setMessages] = useState<ContactMessage[]>(() => {
    const stored = localStorage.getItem("support_messages");
    return stored ? JSON.parse(stored) : [];
  });

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!email.includes("@")) newErrors.email = "Email non valida";
    if (!subject.trim()) newErrors.subject = "L'argomento è obbligatorio";
    if (subject.length > 100) newErrors.subject = "L'argomento non può superare 100 caratteri";
    if (!message.trim()) newErrors.message = "Il messaggio è obbligatorio";
    if (message.length > 1000) newErrors.message = "Il messaggio non può superare 1000 caratteri";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === "email") setEmail(value);
    if (name === "subject") setSubject(value);
    if (name === "message") setMessage(value);
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(false);

    if (!validateForm()) return;

    const newMessage: ContactMessage = {
      id: `msg_${Date.now()}`,
      email,
      subject,
      message,
      timestamp: new Date().toLocaleString("it-IT"),
      status: "pending",
    };

    const updated = [...messages, newMessage];
    setMessages(updated);
    localStorage.setItem("support_messages", JSON.stringify(updated));

    setEmail("");
    setSubject("");
    setMessage("");
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  const handleDeleteMessage = (id: string) => {
    const updated = messages.filter((msg) => msg.id !== id);
    setMessages(updated);
    localStorage.setItem("support_messages", JSON.stringify(updated));
  };

  return (
    <div className={styles.container}>
      <h1>Centro di supporto</h1>

      <div className={styles.formCard}>
        <h2>Contattaci</h2>
        <p className={styles.subtitle}>Hai una domanda o un problema? Scrivici!</p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="email">Email *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={handleChange}
              placeholder="La tua email"
              className={errors.email ? styles.inputError : ""}
            />
            {errors.email && <span className={styles.error}>{errors.email}</span>}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="subject">Argomento *</label>
            <input
              type="text"
              id="subject"
              name="subject"
              value={subject}
              onChange={handleChange}
              placeholder="Es: Problemi di login"
              maxLength={100}
              className={errors.subject ? styles.inputError : ""}
            />
            <small>{subject.length}/100</small>
            {errors.subject && <span className={styles.error}>{errors.subject}</span>}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="message">Messaggio * ({message.length}/1000)</label>
            <textarea
              id="message"
              name="message"
              value={message}
              onChange={handleChange}
              placeholder="Descrivi il tuo problema o la tua domanda in dettaglio..."
              rows={5}
              maxLength={1000}
              className={errors.message ? styles.textareaError : ""}
            />
            {errors.message && <span className={styles.error}>{errors.message}</span>}
          </div>

          {success && <p className={styles.success}>Messaggio inviato! Ti contatteremo presto.</p>}

          <button type="submit" className={styles.submitBtn}>
            Invia Messaggio
          </button>
        </form>
      </div>

      <div className={styles.messagesCard}>
        <h2>I tuoi messaggi ({messages.length})</h2>
        {messages.length === 0 ? (
          <p className={styles.empty}>Nessun messaggio inviato ancora.</p>
        ) : (
          <div className={styles.messagesList}>
            {messages.map((msg) => (
              <div key={msg.id} className={`${styles.messageItem} ${styles[msg.status]}`}>
                <div className={styles.messageHead}>
                  <h4>{msg.subject}</h4>
                  <span className={styles.status}>{msg.status === "pending" ? "In sospeso" : "Risposto"}</span>
                </div>
                <p className={styles.messageEmail}>{msg.email}</p>
                <p className={styles.messageText}>{msg.message}</p>
                <div className={styles.messageFooter}>
                  <small>{msg.timestamp}</small>
                  <button className={styles.deleteBtn} onClick={() => handleDeleteMessage(msg.id)}>
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
