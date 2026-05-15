# Movie DB (Vite + React + TypeScript)

Breve progetto per l'esame che dimostra l'uso di React moderno: routing, gestione dello stato, chiamate asincrone e integrazione con API esterne.

Overview

- App per cercare film usando The Movie Database (TMDB).
- Visualizza risultati con paginazione, pagina dettaglio film e funzionalità di `Favorites` persistente in `localStorage`.

Features

- Ricerca film con paginazione.
- Visualizzazione dettaglio film (runtime, generi, overview).
- Aggiungi/rimuovi film dai preferiti (persistiti in `localStorage`).
- Routing con `react-router-dom`.

Tecnologie

- React 18 + TypeScript
- Vite (dev server / build)
- Axios per le chiamate HTTP
- TMDB API per dati film

Prerequisiti

- Node.js 16+ e npm/yarn installati
- Chiave API TMDB (registrati su https://www.themoviedb.org)

Impostazione ambiente

1. Clona o copia la cartella del progetto.
2. Crea un file `.env` nella root del progetto o copia `.env.example` e inserisci la tua chiave TMDB:

```
VITE_TMDB_KEY=your_tmdb_api_key_here
```

Installazione e avvio

Esegui i comandi seguenti nella cartella `movie-db`:

```bash
npm install
npm run dev
```

Apri `http://localhost:5173` (o la porta mostrata dal server) nel browser.

Script utili

- `npm run dev` — avvia il dev server (Vite).
- `npm run build` — build per produzione.
- `npm run preview` — avvia server per vedere la build locale.
- `npm run test` — esegue i test unitari con Vitest.

File importanti

- [movie-db/src/api/tmdb.ts](src/api/tmdb.ts) — wrapper per le chiamate a TMDB.
- [movie-db/src/context/FavoritesContext.tsx](src/context/FavoritesContext.tsx) — context per gestire i preferiti.
- [movie-db/src/pages/Search.tsx](src/pages/Search.tsx) — pagina di ricerca con paginazione.
- [movie-db/src/pages/MovieDetail.tsx](src/pages/MovieDetail.tsx) — dettaglio film.

Note di sviluppo

- Per Windows PowerShell usa i comandi mostrati sopra; se usi WSL o Git Bash i comandi sono equivalenti.
- La chiave TMDB viene letta da `import.meta.env.VITE_TMDB_KEY` — non committare il file `.env` in git.

License

- MIT
