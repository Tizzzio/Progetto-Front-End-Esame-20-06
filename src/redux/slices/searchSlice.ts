import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { searchMovies } from "../../api/tmdb";
import type { Movie } from "../../types";

interface SearchState {
  query: string;
  results: Movie[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
}

const initialState: SearchState = {
  query: "",
  results: [],
  loading: false,
  error: null,
  currentPage: 1,
  totalPages: 1,
};

export const fetchSearchResults = createAsyncThunk("search/fetchSearchResults", async ({ query, page }: { query: string; page: number }) => {
  const data = await searchMovies(query, page);
  return { results: data.results || [], query, page, totalPages: data.total_pages || 1 };
});

const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    clearSearch: (state) => {
      state.query = "";
      state.results = [];
      state.currentPage = 1;
      state.totalPages = 1;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSearchResults.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSearchResults.fulfilled, (state, action) => {
        state.loading = false;
        state.results = action.payload.results;
        state.query = action.payload.query;
        state.currentPage = action.payload.page;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(fetchSearchResults.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to search movies";
      });
  },
});

export const { clearSearch } = searchSlice.actions;
export default searchSlice.reducer;
