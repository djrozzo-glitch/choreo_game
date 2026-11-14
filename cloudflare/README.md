# EVERYBODY DANCES — short-link API

Static game: https://djrozzo-glitch.github.io/choreo_game/

## Cloudflare setup

1. In Cloudflare, open **Workers & Pages → KV** and create a namespace named `EVERYBODY_DANCES`. Copy its namespace ID.
2. Edit `cloudflare/wrangler.toml` and replace `REPLACE_WITH_YOUR_KV_NAMESPACE_ID`.
3. From the `cloudflare` folder run `npx wrangler login`, then `npx wrangler deploy`. Alternatively, create a Worker in the Cloudflare dashboard, paste `worker.js`, and bind your KV namespace under **Settings → Bindings** with the variable name `DANCES`.
4. Copy your deployed Worker URL, e.g. `https://everybody-dances-links.YOUR-SUBDOMAIN.workers.dev`.
5. Set the constant `DANCE_API_BASE` in the game's root `index.html` to that URL, without a trailing slash, and deploy GitHub Pages.

The short URL is `WORKER_URL/d/ID`; it redirects to GitHub Pages with `?dance=ID&api=WORKER_URL`, and the game fetches the stored choreography. The Worker supports `POST /api/dances` and `GET /api/dances/:id`. Entries expire after one year.

Notes: No login, public unlisted links, no edit/delete API. Origin restriction and payload validation reduce accidental abuse but are **not** robust anti-spam protection; for a public launch, add Cloudflare Turnstile and/or rate limiting. KV has eventual consistency, so a freshly created link may take a moment to become visible in another region. Do not store private information in dance data.
