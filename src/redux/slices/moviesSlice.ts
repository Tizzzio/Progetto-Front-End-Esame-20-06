import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { getPopularMovies } from "../../api/tmdb";
import type { Movie } from "../../types";

interface MoviesState {
  popular: Movie[];
  loading: boolean;
  error: string | null;
}

const initialState: MoviesState = {
  popular: [],
  loading: false,
  error: null,
};

export const fetchPopularMovies = createAsyncThunk("movies/fetchPopularMovies", async (page: number = 1) => {
  const data = await getPopularMovies(page);
  return data.results || [];
});

const moviesSlice = createSlice({
  name: "movies",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPopularMovies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPopularMovies.fulfilled, (state, action: PayloadAction<Movie[]>) => {
        state.loading = false;
        state.popular = action.payload;
      })
      .addCase(fetchPopularMovies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch movies";
      });
  },
});

export const { clearError } = moviesSlice.actions;
export default moviesSlice.reducer;
