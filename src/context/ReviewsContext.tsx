import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { UserReview } from "../types";

type RatingsMap = Record<number, number>;

type ReviewsContextValue = {
  ratings: RatingsMap;
  reviews: UserReview[];
  setRating: (movieId: number, rating: number) => void;
  getRating: (movieId: number) => number | null;
  addReview: (movieId: number, payload: { author?: string; text: string; rating: number }) => void;
  getReviewsByMovie: (movieId: number) => UserReview[];
};

const STORAGE_KEY = "bingewatchers-reviews-v1";

const ReviewsContext = createContext<ReviewsContextValue | undefined>(undefined);

export function ReviewsProvider({ children }: { children: React.ReactNode }) {
  const [ratings, setRatings] = useState<RatingsMap>({});
  const [reviews, setReviews] = useState<UserReview[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as { ratings?: RatingsMap; reviews?: UserReview[] };
      if (parsed.ratings) setRatings(parsed.ratings);
      if (parsed.reviews) setReviews(parsed.reviews);
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ ratings, reviews }));
    } catch {}
  }, [ratings, reviews]);

  function setRating(movieId: number, rating: number) {
    const bounded = Math.max(1, Math.min(5, Math.round(rating)));
    setRatings((prev) => ({ ...prev, [movieId]: bounded }));
  }

  function getRating(movieId: number) {
    return ratings[movieId] ?? null;
  }

  function addReview(movieId: number, payload: { author?: string; text: string; rating: number }) {
    const text = payload.text.trim();
    if (!text) return;

    const newReview: UserReview = {
      id: `${movieId}-${Date.now()}`,
      movieId,
      author: payload.author?.trim() || "Tu",
      text,
      rating: Math.max(1, Math.min(5, Math.round(payload.rating))),
      createdAt: new Date().toISOString(),
    };

    setRating(movieId, newReview.rating);
    setReviews((prev) => [newReview, ...prev]);
  }

  function getReviewsByMovie(movieId: number) {
    return reviews.filter((review) => review.movieId === movieId);
  }

  const value = useMemo(() => ({ ratings, reviews, setRating, getRating, addReview, getReviewsByMovie }), [ratings, reviews]);

  return <ReviewsContext.Provider value={value}>{children}</ReviewsContext.Provider>;
}

export function useReviews() {
  const ctx = useContext(ReviewsContext);
  if (!ctx) throw new Error("useReviews must be used within ReviewsProvider");
  return ctx;
}
