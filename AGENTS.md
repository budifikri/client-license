# AGENTS.md

## Run And Verify

- `npm start` is the only built-in full-stack run command. It runs `tsc -b && vite build && node server.cjs`, then serves both the built React app and Express API from `PORT` (default `3001`).
- `npm run dev` is Vite-only. There is no Vite proxy in `vite.config.ts`, so relative browser requests such as `/api/system-data` from `src/App.tsx` will fail unless another server is handling them.
- `npm run server` starts Express only. Build first if you need the UI, because `server.cjs` serves `dist/`.
- There is no test script or CI workflow in this repo. Use `npm run lint` and `npm run build` as the normal verification pair.

## Environment And Ports

- `PORT` is shared by both Vite (`vite.config.ts`) and Express (`server.cjs`). Do not expect `npm run dev` and `npm run server` to coexist on the same `.env` without changing ports.
- Client-side remote API calls use `VITE_URL_API` in `src/App.tsx`.
- Server-side heartbeat calls use `URL_API` and `COMPUTER_ID` in `server.cjs`; they are separate from the `VITE_*` variables.

## Architecture

- This is a single-package app, not a monorepo.
- React entrypoint: `src/main.tsx`.
- Most frontend behavior lives in one large component: `src/App.tsx`.
- Express entrypoint: `server.cjs`. It serves `dist/`, exposes local API routes, and posts a heartbeat to `${URL_API}/api/devices/heartbeat` every 10 seconds after startup.

## Repo-Specific Gotchas

- `src/utils/registryUtils.cjs` is what the server imports. Despite the README text, the current file does not use the Windows `reg` command; it returns OS data via Node `os` and its read/write/check helpers depend on `localStorage`, which is unavailable in Node. Treat README and CHANGELOG claims about real Windows registry operations as stale unless you re-verify them in code.
- Tailwind is configured in CSS (`src/index.css`) via `@import "tailwindcss"`; `tailwind.config.js.backup` is not active config.
