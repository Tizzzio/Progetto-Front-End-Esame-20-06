export interface Movie {
  id: number;
  title: string;
  overview?: string;
  poster_path?: string | null;
  release_date?: string;
  vote_average?: number;
}

export interface MovieDetail extends Movie {
  runtime?: number;
  genres?: { id: number; name: string }[];
}

export interface Genre {
  id: number;
  name: string;
}

export interface UserReview {
  id: string;
  movieId: number;
  author: string;
  text: string;
  rating: number;
  createdAt: string;
}

export interface TmdbReview {
  id: string;
  author: string;
  content: string;
  created_at: string;
  author_details?: {
    rating?: number | null;
  };
}

export interface TmdbVideo {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
  official: boolean;
  published_at?: string;
}
