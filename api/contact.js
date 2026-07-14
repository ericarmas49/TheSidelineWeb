const WP_CONTACT_URL = "https://circleblox.wpengine.com/wp-json/sideline/v1/contact";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.status(204).end();
    return;
  }

  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const { name, email, message } = req.body || {};

  if (!String(name || "").trim() || !String(email || "").trim() || !String(message || "").trim()) {
    res.status(400).json({ error: "Name, email, and message are required." });
    return;
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).trim())) {
    res.status(400).json({ error: "Please enter a valid email address." });
    return;
  }

  try {
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

    if (!wpResponse.ok) {
      res.status(wpResponse.status).json(body);
      return;
    }

    res.status(200).json(body);
  } catch (error) {
    res.status(502).json({
      error: "Failed to send message.",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
