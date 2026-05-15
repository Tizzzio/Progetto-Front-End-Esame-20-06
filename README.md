# BingeWatchers (Vite + React + TypeScript)

App full-featured per l'esame che dimostra React moderno, autenticazione, gestione dello stato centralizzata con Redux, routing dinamico e integrazione con The Movie Database (TMDB) API.

## Overview

- Ricerca film con paginazione e filtri per genere
- Autenticazione con ruoli differenziati (User/Admin)
- Gestione preferiti e watchlist personali
- Sistema di review e rating per i film
- Dashboard admin per la moderazione
- Integrazione Redux con Thunk per azioni asincrone
- 4 form validati per diverse funzionalità
- Persistenza dati in localStorage

## Features

### Autenticazione e Ruoli

- Login system (fake authentication, localStorage-based)
- Supporto per 2 ruoli: **User** e **Admin**
- Admin vede sezioni aggiuntive (Admin Panel) con accesso a strumenti di moderazione
- Logout e sessione persistente

### Film e Ricerca

- Ricerca film in tempo reale con paginazione
- Visualizzazione di film popolari nella home
- Pagina dettaglio film con runtime, generi, overview
- Rating stellare interattivo per ogni film
- Organizzazione film per genere

### Funzionalità Utente

- **Favorites**: Salva film preferiti (persistito in localStorage)
- **Watchlist**: Crea liste personalizzate di film da guardare
- **Reviews**: Lascia recensioni e rating sui film
- **Profilo**: Sezione per suggerimenti e feedback
- **Support**: Form di contatto per segnalazioni

### Admin Dashboard

- Visualizzazione di tutte le reviews con statistiche
- Moderazione: possibilità di eliminare reviews inappropriate
- Stats: numero totale reviews, film recensiti, rating medio
- Tabella gestionale con filtering e azioni batch

### State Management

- **Redux Toolkit** per gestione stato globale
- **Redux Thunk** per azioni asincrone (caricamento dati TMDB)
- **Context API** per autenticazione, watchlist, reviews, favorites
- Sincronizzazione stato tra browser tab via localStorage

### Form Validati

1. **Review Form** - Valida author, text e rating
2. **Watchlist Form** - Nome e descrizione della lista
3. **Suggestions Form** - Raccoglie feedback miglioramenti
4. **Support Form** - Contatti con email e subject

## Tecnologie

- React 18 + TypeScript (ES2020)
- Vite 5.4 (build tool)
- Redux Toolkit + Redux Thunk (state management)
- React Router v6 (routing con HashRouter per GitHub Pages)
- Axios (HTTP client)
- Vitest (testing)
- TMDB API (dati film)
- CSS Modules (styling)

## Architettura

```
src/
├── api/              # TMDB API wrapper
├── components/       # Componenti riusabili
├── context/          # Auth, Favorites, Reviews, Watchlist contexts
├── redux/            # Redux store, slices, hooks
│   ├── slices/       # moviesSlice, searchSlice
│   ├── store.ts
│   └── hooks.ts
├── pages/            # Pagine (Home, Search, Admin, etc.)
├── styles/           # CSS globali
└── App.tsx
```

## Rotte

- `/login` - Login (non protetto)
- `/` - Home con film popolari (protetto)
- `/search` - Ricerca film (protetto)
- `/genres` - Film per genere (protetto)
- `/movie/:id` - Dettaglio film (protetto)
- `/favorites` - Film preferiti (protetto)
- `/watchlists` - Gestione watchlist (protetto)
- `/profile` - Suggerimenti miglioramenti (protetto)
- `/support` - Form contatti (protetto)
- `/admin` - Admin Dashboard (protetto, solo admin)

## Prerequisiti

- Node.js 16+
- Chiave API TMDB da https://www.themoviedb.org

## Installazione

```bash
# 1. Clona il repository
git clone https://github.com/Tizzzio/Progetto-Front-End-Esame-20-06.git
cd Progetto-Front-End-Esame-20-06/movie-db

# 2. Installa dipendenze
npm install

# 3. Crea file .env
cp .env.example .env
# Modifica .env con la tua chiave TMDB
```

## Avvio

```bash
# Dev server
npm run dev

# Build produzione
npm run build

# Test
npm run test

# Deploy su GitHub Pages
npm run deploy
```

## Login di Test

- **Username**: qualsiasi valore
- **Ruolo**: Scegli tra "User" o "Amministratore"
- **Password**: non richiesta (fake auth)

Esempio: username `test`, role `Admin` per accedere al Admin Panel.

## Configurazione Redux

Lo store centralizza lo stato dei film e delle ricerche tramite Redux Thunk:

- `moviesSlice` - Gestisce film popolari caricati da TMDB
- `searchSlice` - Gestisce risultati ricerca con paginazione

Custom hooks `useAppDispatch` e `useAppSelector` forniscono type safety.

## Build e Deploy

Il progetto è configurato per GitHub Pages:

- Base path: `/Progetto-Front-End-Esame-20-06/`
- Routing: HashRouter per evitare 404
- Deploy: `npm run deploy` pubblica su gh-pages branch
- Live: https://tizzzio.github.io/Progetto-Front-End-Esame-20-06/

## Licenza

MIT
