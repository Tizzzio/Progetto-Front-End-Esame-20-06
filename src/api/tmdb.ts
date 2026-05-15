import axios from "axios";
import type { Genre, TmdbReview, TmdbVideo } from "../types";

const apiKey = import.meta.env.VITE_TMDB_KEY || "";
export const hasTmdbKey = Boolean(apiKey);

const api = axios.create({ baseURL: "https://api.themoviedb.org/3" });

export async function searchMovies(query: string, page = 1) {
  const res = await api.get("/search/movie", {
    params: { api_key: apiKey, query, page, include_adult: false },
  });
  return res.data;
}

export async function getPopularMovies(page = 1) {
  const res = await api.get("/movie/popular", {
    params: { api_key: apiKey, page },
  });
  return res.data;
}

export async function getMovieGenres(): Promise<Genre[]> {
  const res = await api.get("/genre/movie/list", {
    params: { api_key: apiKey },
  });
  return res.data.genres || [];
}

export async function getMoviesByGenre(genreId: number, page = 1) {
  const res = await api.get("/discover/movie", {
    params: {
      api_key: apiKey,
      with_genres: genreId,
      page,
      include_adult: false,
      sort_by: "popularity.desc",
    },
  });
  return res.data;
}

export async function getMovie(id: string | number) {
  const res = await api.get(`/movie/${id}`, {
    params: { api_key: apiKey, append_to_response: "credits,images" },
  });
  return res.data;
}

export async function getMovieReviews(id: string | number, page = 1): Promise<{ results: TmdbReview[]; total_pages: number }> {
  const res = await api.get(`/movie/${id}/reviews`, {
    params: { api_key: apiKey, page },
  });
  return res.data;
}

export async function getMovieVideos(id: string | number): Promise<TmdbVideo[]> {
  const res = await api.get(`/movie/${id}/videos`, {
    params: { api_key: apiKey },
  });
  return res.data.results || [];
}

export function posterUrl(path: string | null, size = "w342") {
  if (!path) return "";
  return `https://image.tmdb.org/t/p/${size}${path}`;
}
