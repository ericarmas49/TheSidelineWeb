const WP_BASE = "https://circleblox.wpengine.com/wp-json/wp/v2";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.status(204).end();
    return;
  }

  if (req.method !== "GET") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const pathParts = req.query.path;
  const wpPath = Array.isArray(pathParts) ? pathParts.join("/") : String(pathParts || "");

  if (!wpPath) {
    res.status(400).json({ error: "Missing WordPress API path" });
    return;
  }

  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(req.query)) {
    if (key === "path") continue;
    if (value == null) continue;
    params.set(key, Array.isArray(value) ? value.join(",") : String(value));
  }

  const wpUrl = `${WP_BASE}/${wpPath}?${params.toString()}`;

  try {
    const wpResponse = await fetch(wpUrl, {
      headers: { Accept: "application/json" },
    });
    const body = await wpResponse.text();

    res.status(wpResponse.status);
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate=300");
    res.send(body);
  } catch (error) {
    res.status(502).json({
      error: "WordPress proxy request failed",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
