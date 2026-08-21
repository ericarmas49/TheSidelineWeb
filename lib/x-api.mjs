/**
 * Server-side X API v2 helpers (used by /api/x/tweets).
 */

function mapMedia(json) {
  const media = json.includes?.media || [];
  const byKey = new Map(media.map((item) => [item.media_key, item]));

  return (json.data || []).map((tweet) => {
    const mediaKeys = tweet.attachments?.media_keys || [];
    const tweetMedia = mediaKeys
      .map((key) => byKey.get(key))
      .filter(Boolean)
      .map((item) => ({
        type: item.type,
        url: item.url,
        preview_url: item.preview_image_url,
        width: item.width,
        height: item.height,
      }));

    return {
      id: String(tweet.id),
      text: tweet.text || tweet.note_tweet?.text || "",
      created_at: tweet.created_at || "",
      media: tweetMedia.length ? tweetMedia : undefined,
    };
  });
}

export async function fetchXTweetsForUsername(username, { maxResults = 10, bearerToken } = {}) {
  const clean = String(username || "")
    .replace(/^@/, "")
    .trim();

  if (!clean || !bearerToken) {
    return [];
  }

  const userResponse = await fetch(
    `https://api.twitter.com/2/users/by/username/${encodeURIComponent(clean)}`,
    {
      headers: { Authorization: `Bearer ${bearerToken}` },
    },
  );

  if (!userResponse.ok) {
    return [];
  }

  const userJson = await userResponse.json();
  const userId = userJson.data?.id;
  if (!userId) {
    return [];
  }

  const params = new URLSearchParams({
    max_results: String(Math.max(5, Math.min(maxResults, 10))),
    "tweet.fields": "created_at,text,attachments,note_tweet",
    expansions: "attachments.media_keys",
    "media.fields": "type,url,preview_image_url,width,height",
    exclude: "retweets,replies",
  });

  const tweetResponse = await fetch(
    `https://api.twitter.com/2/users/${userId}/tweets?${params}`,
    {
      headers: { Authorization: `Bearer ${bearerToken}` },
    },
  );

  if (!tweetResponse.ok) {
    return [];
  }

  const tweetJson = await tweetResponse.json();
  return mapMedia(tweetJson).map((tweet) => ({
    ...tweet,
    source_username: clean,
  }));
}
