// =============================================================================
// DARK INFO — Local backend
// =============================================================================
// Tiny Express server that proxies the upstream lookup APIs server-side, with
// a real browser User-Agent. This eliminates CORS errors in the browser AND
// bypasses the InfinityFree bot wall on the vehicle host (which only blocks
// requests with a non-browser UA).
//
// Run together with the Vite dev server using `npm run dev` (uses
// `concurrently`). Vite proxies `/api` calls to this server on PORT 8787.
// =============================================================================
import express from "express";
import cors from "cors";

const app = express();
const PORT = process.env.API_PORT ? Number(process.env.API_PORT) : 8787;

app.use(cors());
app.use(express.json());

const BROWSER_UA =
  "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

const NUMBER_API_KEY = "vishal_434b2cfd059a";

async function forward(targetUrl, init = {}) {
  return fetch(targetUrl, {
    ...init,
    headers: {
      "User-Agent": BROWSER_UA,
      Accept: "application/json,text/plain,*/*",
      ...(init.headers ?? {}),
    },
  });
}

app.get("/api/healthz", (_req, res) => {
  res.json({ status: "ok" });
});

// ---------- VEHICLE ----------
app.get("/api/lookups/vehicle", async (req, res) => {
  const rc = String(req.query.rc ?? "").trim().toUpperCase();
  if (!rc) return res.status(400).json({ error: "Missing 'rc' query parameter" });
  try {
    const upstream = await forward(
      `https://echat.ct.ws/vehicle.php?rcno=${encodeURIComponent(rc)}`,
    );
    const text = await upstream.text();
    if (!text.trim() || text.trim().startsWith("<")) {
      return res.status(502).json({ error: "Vehicle API returned non-JSON response" });
    }
    res.json(JSON.parse(text));
  } catch (err) {
    console.error("[vehicle]", err);
    res.status(502).json({ error: "Vehicle lookup failed" });
  }
});

// ---------- NUMBER ----------
app.get("/api/lookups/number", async (req, res) => {
  const phone = String(req.query.phone ?? "").trim();
  if (!phone) return res.status(400).json({ error: "Missing 'phone' query parameter" });
  try {
    const upstream = await forward(
      `https://numberimfo.vishalboss.sbs/api.php?number=${encodeURIComponent(
        phone,
      )}&key=${NUMBER_API_KEY}`,
    );
    res.json(await upstream.json());
  } catch (err) {
    console.error("[number]", err);
    res.status(502).json({ error: "Number lookup failed" });
  }
});

// ---------- PAN -> GST ----------
app.get("/api/lookups/pan/:pan", async (req, res) => {
  const pan = String(req.params.pan ?? "").trim().toUpperCase();
  if (!pan) return res.status(400).json({ error: "Missing 'pan' path parameter" });
  try {
    const upstream = await forward(
      `https://razorpay.com/api/gstin/pan/${encodeURIComponent(pan)}`,
    );
    res.json(await upstream.json());
  } catch (err) {
    console.error("[pan]", err);
    res.status(502).json({ error: "PAN lookup failed" });
  }
});

// ---------- VIDEO ----------
app.get("/api/lookups/video", async (req, res) => {
  const url = String(req.query.url ?? "").trim();
  if (!url) return res.status(400).json({ error: "Missing 'url' query parameter" });
  try {
    const upstream = await forward(
      `https://tele-social.vercel.app/down?url=${encodeURIComponent(url)}`,
    );
    res.json(await upstream.json());
  } catch (err) {
    console.error("[video]", err);
    res.status(502).json({ error: "Video lookup failed" });
  }
});

app.listen(PORT, () => {
  console.log(`[dark-info api] listening on http://localhost:${PORT}`);
});
