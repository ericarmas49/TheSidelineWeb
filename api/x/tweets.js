import { fetchXTweetsForUsername } from "../../lib/x-api.mjs";
import { getXBearerToken } from "../../lib/x-env.mjs";

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

  const username = String(req.query.username || "")
    .replace(/^@/, "")
    .trim();

  if (!username) {
    res.status(400).json({ error: "username is required" });
    return;
  }

  const bearerToken = getXBearerToken();
  if (!bearerToken) {
    res.status(503).json({
      error: "X API not configured",
      tweets: [],
    });
    return;
  }

  const maxResults = Number.parseInt(String(req.query.max_results || "10"), 10);

  try {
    const tweets = await fetchXTweetsForUsername(username, {
      maxResults: Number.isNaN(maxResults) ? 10 : maxResults,
      bearerToken,
    });

    res.status(200);
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.setHeader("Cache-Control", "s-maxage=120, stale-while-revalidate=600");
    res.json(tweets);
  } catch (error) {
    res.status(502).json({
      error: "X API request failed",
      message: error instanceof Error ? error.message : "Unknown error",
      tweets: [],
    });
  }
}
