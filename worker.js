// =============================================================================
// DARK INFO — Cloudflare Worker backend
// =============================================================================
// Drop-in replacement for server.mjs, rewritten for the Workers runtime.
// Deploy with:  npx wrangler deploy
//
// Routes
//   GET /api/healthz
//   GET /api/lookups/vehicle?rc=...
//   GET /api/lookups/number?phone=...
//   GET /api/lookups/pan/:pan
//   GET /api/lookups/video?url=...
//
// Secrets (set via `npx wrangler secret put NUMBER_API_KEY`)
//   NUMBER_API_KEY  — key for numberimfo.vishalboss.sbs
// =============================================================================

const BROWSER_UA =
  "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...CORS, "Content-Type": "application/json" },
  });
}

async function forward(url) {
  return fetch(url, {
    headers: {
      "User-Agent": BROWSER_UA,
      Accept: "application/json,text/plain,*/*",
    },
  });
}

export default {
  async fetch(request, env) {
    // Pre-flight
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: CORS });
    }

    const { pathname, searchParams } = new URL(request.url);

    // ── Health ────────────────────────────────────────────────────────────────
    if (pathname === "/api/healthz") {
      return json({ status: "ok" });
    }

    // ── Vehicle ───────────────────────────────────────────────────────────────
    if (pathname === "/api/lookups/vehicle") {
      const rc = (searchParams.get("rc") ?? "").trim().toUpperCase();
      if (!rc) return json({ error: "Missing 'rc' query parameter" }, 400);
      try {
        const res = await forward(
          `https://echat.ct.ws/vehicle.php?rcno=${encodeURIComponent(rc)}`
        );
        const text = await res.text();
        if (!text.trim() || text.trim().startsWith("<")) {
          return json({ error: "Vehicle API returned non-JSON response" }, 502);
        }
        return json(JSON.parse(text));
      } catch (err) {
        console.error("[vehicle]", err);
        return json({ error: "Vehicle lookup failed" }, 502);
      }
    }

    // ── Number ────────────────────────────────────────────────────────────────
    if (pathname === "/api/lookups/number") {
      const phone = (searchParams.get("phone") ?? "").trim();
      if (!phone) return json({ error: "Missing 'phone' query parameter" }, 400);
      // Key comes from a Wrangler secret; falls back to the default for local dev.
      const key = env.NUMBER_API_KEY ?? "vishal_434b2cfd059a";
      try {
        const res = await forward(
          `https://numberimfo.vishalboss.sbs/api.php?number=${encodeURIComponent(phone)}&key=${key}`
        );
        return json(await res.json());
      } catch (err) {
        console.error("[number]", err);
        return json({ error: "Number lookup failed" }, 502);
      }
    }

    // ── PAN → GST  (/api/lookups/pan/:pan) ───────────────────────────────────
    const panMatch = pathname.match(/^\/api\/lookups\/pan\/([^/]+)$/);
    if (panMatch) {
      const pan = decodeURIComponent(panMatch[1]).toUpperCase();
      try {
        const res = await forward(
          `https://razorpay.com/api/gstin/pan/${encodeURIComponent(pan)}`
        );
        return json(await res.json());
      } catch (err) {
        console.error("[pan]", err);
        return json({ error: "PAN lookup failed" }, 502);
      }
    }

    // ── Image Generation ──────────────────────────────────────────────────────
    if (pathname === "/api/lookups/image") {
      const imgp = (searchParams.get("imgp") ?? "").trim();
      if (!imgp) return json({ error: "Missing 'imgp' query parameter" }, 400);
      try {
        const apiUrl = `https://anshapiimgegn.vercel.app/api?imgp=${encodeURIComponent(imgp)}&t=${Date.now()}`;
        const res = await forward(apiUrl);
        const blob = await res.arrayBuffer();
        return new Response(blob, {
          status: 200,
          headers: {
            ...CORS,
            "Content-Type": res.headers.get("Content-Type") || "image/jpeg",
          },
        });
      } catch (err) {
        console.error("[image]", err);
        return json({ error: "Image generation failed" }, 502);
      }
    }

    // ── Video ─────────────────────────────────────────────────────────────────
    if (pathname === "/api/lookups/video") {
      const url = (searchParams.get("url") ?? "").trim();
      if (!url) return json({ error: "Missing 'url' query parameter" }, 400);
      try {
        const res = await forward(
          `https://tele-social.vercel.app/down?url=${encodeURIComponent(url)}`
        );
        return json(await res.json());
      } catch (err) {
        console.error("[video]", err);
        return json({ error: "Video lookup failed" }, 502);
      }
    }

    return json({ error: "Not found" }, 404);
  },
};
