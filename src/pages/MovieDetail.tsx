import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getMovie, getMovieReviews, getMovieVideos, posterUrl } from "../api/tmdb";
import type { MovieDetail as MD, TmdbReview, TmdbVideo } from "../types";
import { useFavorites } from "../context/FavoritesContext";
import { useReviews } from "../context/ReviewsContext";
import styles from "./MovieDetail.module.css";
import StarRating from "../components/StarRating";

export default function MovieDetail() {
  const { id } = useParams();
  const [movie, setMovie] = useState<MD | null>(null);
  const [trailer, setTrailer] = useState<TmdbVideo | null>(null);
  const [tmdbReviews, setTmdbReviews] = useState<TmdbReview[]>([]);
  const [reviewText, setReviewText] = useState("");
  const [author, setAuthor] = useState("");
  const [draftRating, setDraftRating] = useState(4);
  const [loading, setLoading] = useState(false);
  const { toggleFavorite, isFavorite } = useFavorites();
  const { getRating, setRating, addReview, getReviewsByMovie } = useReviews();

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    getMovie(id)
      .then((data) => setMovie(data))
      .catch(() => {})
      .finally(() => setLoading(false));

    getMovieVideos(id)
      .then((videos) => {
        const trailerVideo =
          videos.find((video) => video.site === "YouTube" && video.type === "Trailer" && video.official) ||
          videos.find((video) => video.site === "YouTube" && video.type === "Trailer") ||
          videos.find((video) => video.site === "YouTube") ||
          null;
        setTrailer(trailerVideo);
      })
      .catch(() => setTrailer(null));

    getMovieReviews(id)
      .then((data) => setTmdbReviews(data.results || []))
      .catch(() => setTmdbReviews([]));
  }, [id]);

  if (loading) return <p>Caricamento...</p>;
  if (!movie) return <p>Film non trovato.</p>;

  const localRating = getRating(movie.id) ?? Math.round((movie.vote_average || 0) / 2);
  const localReviews = getReviewsByMovie(movie.id);

  function submitReview(e: React.FormEvent) {
    e.preventDefault();
    if (movie) {
      addReview(movie.id, { author, text: reviewText, rating: draftRating });
      setReviewText("");
      setAuthor("");
      setDraftRating(4);
    }
  }

  return (
    <section>
      <h2>{movie.title}</h2>
      <div className={styles.wrap}>
        {movie.poster_path && <img className={styles.poster} src={posterUrl(movie.poster_path, "w342")} alt={movie.title} />}
        <div className={styles.right}>
          <div className={styles.stats}>
            <span className="badge">TMDB: {(movie.vote_average || 0).toFixed(1)} / 10</span>
            <span className="badge">Durata: {movie.runtime || "N/D"} min</span>
            <span className="badge">Genere: {movie.genres?.map((g) => g.name).join(", ") || "N/D"}</span>
          </div>

          <p>{movie.overview}</p>

          <div className="panel">
            <p className={styles.small}>Il tuo rating</p>
            <StarRating value={localRating} onChange={(value) => setRating(movie.id, value)} />
          </div>

          <div className={styles.action}>
            <button className={styles.button} onClick={() => toggleFavorite(movie)}>
              {isFavorite(movie.id) ? "Rimuovi dai preferiti" : "Aggiungi ai preferiti"}
            </button>
          </div>

          <form className={`${styles.reviewForm} panel`} onSubmit={submitReview}>
            <p className={styles.small}>Scrivi una recensione</p>
            <input className={styles.input} value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="Il tuo nome (opzionale)" />
            <textarea
              className={styles.textarea}
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="Cosa ne pensi di questo film?"
            />
            <StarRating value={draftRating} onChange={setDraftRating} />
            <button className={styles.button} type="submit">
              Pubblica recensione
            </button>
          </form>
        </div>
      </div>

      <div className={styles.trailerWrap}>
        <div className={styles.trailerHeader}>
          <h3 className={styles.trailerTitle}>Trailer</h3>
          {trailer && <span className="badge">YouTube</span>}
        </div>
        {trailer ? (
          <iframe
            className={styles.trailerFrame}
            src={`https://www.youtube.com/embed/${trailer.key}`}
            title={`${movie.title} trailer`}
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        ) : (
          <p className={styles.trailerEmpty}>Trailer non disponibile.</p>
        )}
      </div>

      <div className={styles.reviews}>
        <h3>Recensioni utenti ({localReviews.length})</h3>
        {localReviews.length === 0 && <p>Nessuna recensione utente ancora.</p>}
        {localReviews.map((review) => (
          <article key={review.id} className={styles.reviewCard}>
            <div className={styles.reviewHead}>
              <span className={styles.reviewAuthor}>{review.author}</span>
              <StarRating value={review.rating} size="sm" />
            </div>
            <p className={styles.reviewText}>{review.text}</p>
          </article>
        ))}

        <h3>Recensioni TMDB ({tmdbReviews.length})</h3>
        {tmdbReviews.length === 0 && <p>Nessuna recensione TMDB disponibile.</p>}
        {tmdbReviews.slice(0, 5).map((review) => (
          <article key={review.id} className={styles.reviewCard}>
            <div className={styles.reviewHead}>
              <span className={styles.reviewAuthor}>{review.author}</span>
              <StarRating value={(review.author_details?.rating || 0) / 2} size="sm" />
            </div>
            <p className={styles.reviewText}>{review.content.slice(0, 280)}...</p>
          </article>
        ))}
      </div>
    </section>
  );
}
