# DARK INFO

A premium dark-themed multi-tool web app — Number Lookup, Vehicle Lookup, Video Downloader, AI Image Generation, PAN to GST, and IFSC Lookup. Built with React + Vite + TypeScript + Tailwind CSS, with a tiny Express backend that proxies the upstream APIs.

All six tools are wired to **real, live APIs** — no mock data, no flaky public CORS proxies.

## Quick start

Requires Node.js 18+ (Node 20+ recommended).

```bash
npm install
npm run dev
```

This starts **both** processes via `concurrently`:

- `api`  — Express backend on `http://localhost:8787` (defined in `server.mjs`)
- `web`  — Vite dev server on `http://localhost:5173`

Open `http://localhost:5173` in your browser. Vite proxies `/api/*` calls to the backend automatically.

### Other commands

```bash
npm run build       # Production build → ./dist (static SPA)
npm start           # Run the backend + serve the built app via vite preview
npm run typecheck   # TypeScript type-check, no emit
```

## Why a backend?

Several upstream APIs either don't send CORS headers or block non-browser User-Agents (the InfinityFree-hosted vehicle host, for example, returns a JS bot-protection page if you hit it from `curl` or a public CORS proxy). The local Express server sits in the middle: the browser calls **your** server, your server forwards each request with a real Chrome User-Agent, and the JSON comes back clean. This also keeps your API key out of the browser bundle for the Number Lookup endpoint.

## Live APIs

The backend exposes one route per tool. All routes live in `server.mjs` and are easy to edit.

| Tool | Frontend calls | Backend forwards to |
|---|---|---|
| Number Lookup | `GET /api/lookups/number?phone=...` | `numberimfo.vishalboss.sbs/api.php` |
| Vehicle Lookup | `GET /api/lookups/vehicle?rc=...` | `echat.ct.ws/vehicle.php` |
| Video Downloader | `GET /api/lookups/video?url=...` | `tele-social.vercel.app/down` |
| PAN to GST | `GET /api/lookups/pan/{PAN}` | `razorpay.com/api/gstin/pan/...` |
| IFSC Lookup | (direct from browser) | `ifsc.razorpay.com/{IFSC}` (already CORS-enabled) |
| Image Generation | (direct `<img src>`) | `anshapiimgegn.vercel.app/api?imgp=...` (returns PNG bytes) |

### Number API key

The Number Lookup key lives in `server.mjs` (NOT the frontend bundle):

```js
const NUMBER_API_KEY = "vishal_434b2cfd059a";
```

Replace it with your own key when needed.

### Access key for Number Lookup tool

Number Lookup is gated behind a UI access key. The current key is `Jishan15` and lives in `src/pages/tool/NumberLookup.tsx`:

```ts
const ACCESS_KEY = "Jishan15";
```

The unlock state is stored in `sessionStorage` and clears when the tab closes.

## Project structure

```
dark-info/
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts             # Vite + /api proxy → localhost:8787
├── server.mjs                 # Express backend — proxies upstream APIs
├── components.json
└── src/
    ├── main.tsx
    ├── App.tsx
    ├── index.css
    ├── lib/
    │   ├── utils.ts
    │   └── mock-api.ts        # Frontend API client → calls /api/lookups/*
    ├── hooks/
    ├── components/
    │   ├── layout/
    │   └── ui/                # shadcn/ui primitives
    └── pages/
        ├── Home.tsx
        ├── not-found.tsx
        └── tool/
            ├── NumberLookup.tsx
            ├── VehicleLookup.tsx
            ├── VideoDownloader.tsx
            ├── ImageGeneration.tsx
            ├── PanToGst.tsx
            └── IfscLookup.tsx
```

## Deploying

The frontend builds to a static `./dist` folder. To deploy:

1. **Same-origin (recommended):** put `server.mjs` behind a reverse proxy (nginx, Caddy, or similar) on the same domain as the static `dist/`. The frontend uses relative `/api/...` paths so it just works.
2. **Separate hosts:** deploy `dist/` to any static host (Vercel, Netlify, Cloudflare Pages) and `server.mjs` to a Node host (Render, Railway, Fly). Then either:
   - configure your static host to proxy `/api/*` to the backend host, or
   - replace `const API_BASE = "/api/lookups";` in `src/lib/mock-api.ts` with your absolute backend URL and re-build.

## Tech stack

- **React 19** + **Vite 7**
- **TypeScript** strict mode
- **Tailwind CSS v4**
- **wouter** — routing
- **framer-motion** — animations
- **cmdk** — command palette
- **lucide-react** — icons
- **sonner** — toasts
- **shadcn/ui** + **Radix UI** primitives
- **Express** + **cors** + **concurrently** — backend & dev orchestration
