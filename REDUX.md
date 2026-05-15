# Redux State Management Integration

## Overview

Questo progetto utilizza **Redux Toolkit** (con Redux Thunk integrato) per la gestione dello stato globale. Redux fornisce un modo centralizzato e prevedibile di gestire lo stato applicativo, specialmente per operazioni asincrone.

## Architettura Redux

### Store (`src/redux/store.ts`)

Lo store è il contenitore centrale dello stato dell'applicazione:

```typescript
import { configureStore } from "@reduxjs/toolkit";
import moviesReducer from "./slices/moviesSlice";
import searchReducer from "./slices/searchSlice";

export const store = configureStore({
  reducer: {
    movies: moviesReducer,
    search: searchReducer,
  },
});
```

### Slices

Un **Slice** è una raccolta di azioni e reducer per una parte specifica dello stato.

#### 1. **Movies Slice** (`src/redux/slices/moviesSlice.ts`)

Gestisce lo stato dei film popolari caricati da TMDB:

- **State**: `popular` (array di film), `loading` (bool), `error` (string | null)
- **Azioni Asincrone**:
  - `fetchPopularMovies(page)` - Carica i film popolari da TMDB usando Redux Thunk
- **Ciclo di vita**:
  - `pending` - Imposta `loading = true`
  - `fulfilled` - Salva i risultati, imposta `loading = false`
  - `rejected` - Salva l'errore, imposta `loading = false`

**Utilizzo in Home.tsx**:

```typescript
const dispatch = useAppDispatch();
const { popular: movies, loading, error } = useAppSelector((state) => state.movies);

useEffect(() => {
  dispatch(fetchPopularMovies(1));
}, [dispatch]);
```

#### 2. **Search Slice** (`src/redux/slices/searchSlice.ts`)

Gestisce lo stato della ricerca di film:

- **State**: `query` (string), `results` (array di film), `loading`, `error`, `currentPage`, `totalPages`
- **Azioni Asincrone**:
  - `fetchSearchResults({ query, page })` - Ricerca film usando Redux Thunk
- **Azioni Sincrone**:
  - `clearSearch()` - Azzera lo stato di ricerca

**Utilizzo in Search.tsx**:

```typescript
const dispatch = useAppDispatch();
const { results, loading, error, query, currentPage, totalPages } = useAppSelector((state) => state.search);

const handleSearch = (q: string) => {
  dispatch(fetchSearchResults({ query: q, page: 1 }));
};
```

### Custom Hooks (`src/redux/hooks.ts`)

Fornisce hook tipizzati per usare Redux con TypeScript:

```typescript
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
```

Questo assicura che `dispatch` e `useSelector` siano correttamente tipizzati in tutta l'applicazione.

## Redux Thunk (Azioni Asincrone)

Redux Toolkit include Redux Thunk per gestire operazioni asincrone:

```typescript
export const fetchPopularMovies = createAsyncThunk("movies/fetchPopularMovies", async (page: number = 1) => {
  const data = await getPopularMovies(page);
  return data.results || [];
});
```

**Ciclo di vita di un'azione asincrona**:

1. **Pending**: Inizio dell'operazione asincrona
2. **Fulfilled**: Completamento con successo
3. **Rejected**: Errore durante l'operazione

Questi stati vengono gestiti negli `extraReducers`.

## Integration con React

### Provider Setup (`src/main.tsx`)

Il Redux Provider avvolge tutta l'applicazione:

```typescript
import { Provider } from "react-redux";
import { store } from "./redux/store";

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      {/* App Components */}
    </Provider>
  </React.StrictMode>,
);
```

### Utilizzo nei Componenti

```typescript
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { fetchPopularMovies } from "../redux/slices/moviesSlice";

export default function MyComponent() {
  const dispatch = useAppDispatch();
  const { movies, loading } = useAppSelector((state) => state.movies);

  useEffect(() => {
    dispatch(fetchPopularMovies(1));
  }, [dispatch]);

  return (
    <div>
      {loading ? <p>Loading...</p> : <MovieList movies={movies} />}
    </div>
  );
}
```

## Vantaggi di Redux

1. **Single Source of Truth**: Uno stato globale centralizzato
2. **Prevedibilità**: Cambio di stato deterministico attraverso azioni
3. **Debugging**: Time-travel debugging con Redux DevTools
4. **Asincronia**: Gestione elegante di operazioni async con Thunk
5. **Scalabilità**: Facile aggiungere nuovi slice per nuove funzionalità

## Aggiungere una Nuova Slice

### 1. Creare il Slice

```typescript
// src/redux/slices/genresSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchGenres = createAsyncThunk("genres/fetchGenres", async () => {
  const data = await getGenres();
  return data.genres || [];
});

const genresSlice = createSlice({
  name: "genres",
  initialState: { list: [], loading: false, error: null },
  extraReducers: (builder) => {
    builder
      .addCase(fetchGenres.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchGenres.fulfilled, (state, action) => {
        state.list = action.payload;
        state.loading = false;
      })
      .addCase(fetchGenres.rejected, (state, action) => {
        state.error = action.error.message;
        state.loading = false;
      });
  },
});

export default genresSlice.reducer;
```

### 2. Aggiungere al Store

```typescript
// src/redux/store.ts
import genresReducer from "./slices/genresSlice";

export const store = configureStore({
  reducer: {
    movies: moviesReducer,
    search: searchReducer,
    genres: genresReducer, // ← Nuovo
  },
});
```

### 3. Usare nel Componente

```typescript
const genres = useAppSelector((state) => state.genres.list);
dispatch(fetchGenres());
```

## Verificazione dell'Implementazione

- ✅ Redux Toolkit installato e configurato
- ✅ Store centralizzato con múltiple slices
- ✅ Redux Thunk per azioni asincrone integrato
- ✅ Custom hooks per TypeScript
- ✅ Home.tsx e Search.tsx usano Redux
- ✅ Build passa con successo (141 moduli)
- ✅ Supporta dev server locale e build di produzione
