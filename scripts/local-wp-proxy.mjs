#!/usr/bin/env node
/**
 * Local dev: static files + /api/wp/* proxy (use when not running vercel dev).
 * Usage: node scripts/local-wp-proxy.mjs [port]
 */
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const WP_BASE = "https://circleblox.wpengine.com/wp-json/wp/v2";
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
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    });
    res.end();
    return;
  }

  const url = new URL(req.url, `http://127.0.0.1:${PORT}`);

  if (url.pathname.startsWith("/api/wp/")) {
    const wpPath = url.pathname.replace(/^\/api\/wp\//, "");
    void proxyWp(req, res, wpPath, url.search);
    return;
  }

  let pathname = decodeURIComponent(url.pathname);
  if (pathname.endsWith("/")) pathname = `${pathname}index.html`;
  else if (pathname === "/") pathname = "/index.html";

  let filePath = path.join(ROOT, pathname);
  if (!path.extname(pathname)) {
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

server.listen(PORT, () => {
  console.log(`TheSidelineWeb dev server: http://127.0.0.1:${PORT}`);
  console.log(`WP proxy: http://127.0.0.1:${PORT}/api/wp/content?...`);
});
