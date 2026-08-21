#!/usr/bin/env node
/**
 * Local dev: static files + /api/wp/* proxy (use when not running vercel dev).
 * Usage: node scripts/local-wp-proxy.mjs [port]
 */
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { fetchXTweetsForUsername } from "../lib/x-api.mjs";
import { getXBearerToken } from "../lib/x-env.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

function loadEnvFile() {
  const envPath = path.join(ROOT, ".env");
  if (!fs.existsSync(envPath)) return;

  const content = fs.readFileSync(envPath, "utf8");
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const separator = trimmed.indexOf("=");
    if (separator === -1) continue;

    const key = trimmed.slice(0, separator).trim();
    let value = trimmed.slice(separator + 1).trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    if (!(key in process.env)) {
      process.env[key] = value;
    }
  }
}

loadEnvFile();
const WP_BASE = "https://circleblox.wpengine.com/wp-json/wp/v2";
const WP_CONTACT_URL = "https://circleblox.wpengine.com/wp-json/sideline/v1/contact";
const PORT = Number(process.argv[2]) || 8080;

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".mp4": "video/mp4",
  ".mov": "video/quicktime",
  ".webm": "video/webm",
};

function sendJson(res, status, payload) {
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
  });
  res.end(JSON.stringify(payload));
}

async function proxyContact(req, res) {
  try {
    const chunks = [];
    for await (const chunk of req) {
      chunks.push(chunk);
    }

    const rawBody = Buffer.concat(chunks).toString("utf8");
    const payload = rawBody ? JSON.parse(rawBody) : {};
    const { name, email, message } = payload;

    if (!String(name || "").trim() || !String(email || "").trim() || !String(message || "").trim()) {
      sendJson(res, 400, { error: "Name, email, and message are required." });
      return;
    }

    const wpResponse = await fetch(WP_CONTACT_URL, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: String(name).trim(),
        email: String(email).trim(),
        message: String(message).trim(),
      }),
    });

    const body = await wpResponse.json().catch(() => ({}));
    sendJson(res, wpResponse.status, body);
  } catch (error) {
    sendJson(res, 502, {
      error: "Failed to send message.",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

async function proxyXTweets(_req, res, searchParams) {
  const username = String(searchParams.get("username") || "")
    .replace(/^@/, "")
    .trim();
  const maxResults = Number.parseInt(String(searchParams.get("max_results") || "10"), 10);
  const bearerToken = getXBearerToken();

  if (!username) {
    sendJson(res, 400, { error: "username is required" });
    return;
  }

  if (!bearerToken) {
    sendJson(res, 503, { error: "X API not configured", tweets: [] });
    return;
  }

  try {
    const tweets = await fetchXTweetsForUsername(username, {
      maxResults: Number.isNaN(maxResults) ? 10 : maxResults,
      bearerToken,
    });
    sendJson(res, 200, tweets);
  } catch (error) {
    sendJson(res, 502, {
      error: "X API request failed",
      message: error instanceof Error ? error.message : "Unknown error",
      tweets: [],
    });
  }
}

async function proxyWp(req, res, wpPath, search) {
  const wpUrl = `${WP_BASE}/${wpPath}${search}`;
  try {
    const wpResponse = await fetch(wpUrl, { headers: { Accept: "application/json" } });
    const body = await wpResponse.text();
    res.writeHead(wpResponse.status, {
      "Content-Type": "application/json; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "s-maxage=60, stale-while-revalidate=300",
    });
    res.end(body);
  } catch (error) {
    sendJson(res, 502, {
      error: "WordPress proxy request failed",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

function serveStatic(req, res, filePath) {
  fs.stat(filePath, (statErr, stats) => {
    if (statErr || !stats.isFile()) {
      res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("Not found");
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME[ext] || "application/octet-stream";
    const total = stats.size;
    const range = req.headers.range;

    if (range) {
      const match = /^bytes=(\d*)-(\d*)$/.exec(range);
      if (!match) {
        res.writeHead(416, { "Content-Type": "text/plain; charset=utf-8" });
        res.end("Range Not Satisfiable");
        return;
      }

      const start = match[1] ? Number(match[1]) : 0;
      const end = match[2] ? Number(match[2]) : total - 1;

      if (Number.isNaN(start) || Number.isNaN(end) || start >= total || end >= total || start > end) {
        res.writeHead(416, {
          "Content-Type": "text/plain; charset=utf-8",
          "Content-Range": `bytes */${total}`,
        });
        res.end("Range Not Satisfiable");
        return;
      }

      res.writeHead(206, {
        "Content-Type": contentType,
        "Content-Length": end - start + 1,
        "Content-Range": `bytes ${start}-${end}/${total}`,
        "Accept-Ranges": "bytes",
      });
      fs.createReadStream(filePath, { start, end }).pipe(res);
      return;
    }

    res.writeHead(200, {
      "Content-Type": contentType,
      "Content-Length": total,
      "Accept-Ranges": "bytes",
    });
    fs.createReadStream(filePath).pipe(res);
  });
}

const server = http.createServer((req, res) => {
  if (req.method === "OPTIONS") {
    res.writeHead(204, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    });
    res.end();
    return;
  }

  const url = new URL(req.url, `http://127.0.0.1:${PORT}`);

  if (url.pathname === "/api/contact" && req.method === "POST") {
    void proxyContact(req, res);
    return;
  }

  if (url.pathname === "/api/x/tweets" && req.method === "GET") {
    void proxyXTweets(req, res, url.searchParams);
    return;
  }

  if (url.pathname.startsWith("/api/wp/")) {
    const wpPath = url.pathname.replace(/^\/api\/wp\//, "");
    void proxyWp(req, res, wpPath, url.search);
    return;
  }

  const pathname = decodeURIComponent(url.pathname).replace(/\/+$/, "") || "/";
  let filePath = path.join(ROOT, pathname === "/" ? "index.html" : pathname.replace(/^\//, ""));

  if (!path.extname(filePath)) {
    const indexPath = path.join(filePath, "index.html");
    if (fs.existsSync(indexPath) && fs.statSync(indexPath).isFile()) {
      filePath = indexPath;
    }
  }

  if (!filePath.startsWith(ROOT)) {
    res.writeHead(403, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Forbidden");
    return;
  }

  serveStatic(req, res, filePath);
});

function startServer(port) {
  server.removeAllListeners("listening");
  server.removeAllListeners("error");

  server.once("error", (error) => {
    if (error.code === "EADDRINUSE" && port < 8099) {
      console.warn(`Port ${port} is in use, trying ${port + 1}...`);
      startServer(port + 1);
      return;
    }

    throw error;
  });

  server.listen(port, () => {
    console.log(`TheSidelineWeb dev server: http://127.0.0.1:${port}`);
    console.log(`WP proxy: http://127.0.0.1:${port}/api/wp/content?...`);
    console.log(`X API proxy: http://127.0.0.1:${port}/api/x/tweets?username=...`);
    console.log(`Contact API: http://127.0.0.1:${port}/api/contact`);
  });
}

startServer(PORT);
