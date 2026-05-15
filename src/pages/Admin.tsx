import React from "react";
import { useAuth } from "../context/AuthContext";
import { useReviews } from "../context/ReviewsContext";
import styles from "./Admin.module.css";

export default function Admin() {
  const { user } = useAuth();
  const { reviews, deleteReview } = useReviews();

  if (user?.role !== "admin") {
    return (
      <section>
        <h2>Accesso Negato</h2>
        <p>Solo gli amministratori possono accedere a questa pagina.</p>
      </section>
    );
  }

  const totalReviews = reviews.length;
  const uniqueMovies = new Set(reviews.map((r) => r.movieId)).size;
  const averageRating = totalReviews > 0 ? (reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews).toFixed(1) : 0;

  return (
    <section>
      <h2>Admin Dashboard</h2>
      <p>Gestisci il contenuto e modera le reviews.</p>

      <div className={styles.statsContainer}>
        <div className={styles.statCard}>
          <h3>Reviews Totali</h3>
          <p className={styles.statValue}>{totalReviews}</p>
        </div>
        <div className={styles.statCard}>
          <h3>Film Recensiti</h3>
          <p className={styles.statValue}>{uniqueMovies}</p>
        </div>
        <div className={styles.statCard}>
          <h3>Rating Medio</h3>
          <p className={styles.statValue}>{averageRating} / 5</p>
        </div>
      </div>

      <div className="panel" style={{ marginTop: "28px" }}>
        <p className="badge" style={{ marginBottom: "8px" }}>
          Moderazione
        </p>
        <h3 style={{ margin: "0 0 16px 0" }}>Reviews da Moderare</h3>

        {reviews.length === 0 ? (
          <p>Nessuna review al momento.</p>
        ) : (
          <div className={styles.reviewsTable}>
            <table>
              <thead>
                <tr>
                  <th>Film</th>
                  <th>Autore</th>
                  <th>Rating</th>
                  <th>Testo</th>
                  <th>Data</th>
                  <th>Azioni</th>
                </tr>
              </thead>
              <tbody>
                {reviews.map((review) => (
                  <tr key={review.id}>
                    <td>Film #{review.movieId}</td>
                    <td>{review.author}</td>
                    <td>
                      <span className={styles.ratingBadge}>{review.rating}★</span>
                    </td>
                    <td className={styles.textCell}>{review.text.substring(0, 50)}...</td>
                    <td className={styles.dateCell}>{new Date(review.createdAt).toLocaleDateString()}</td>
                    <td>
                      <button onClick={() => deleteReview(review.id)} className={styles.deleteBtn}>
                        Elimina
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}
