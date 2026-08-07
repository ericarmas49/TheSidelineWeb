const WP_API = {
  baseUrl: "https://circleblox.wpengine.com/wp-json/wp/v2",
  perPage: 10,
};

const TOP_STORIES_CONTENT_CATEGORIES = "6256,6257,6258,6259,6260,11304";
const TOP_STORIES_PUBLICATION_TYPE_EXCLUDE = "6225,6218";
const TOP_STORIES_MIN_SCORE = 8.5;
const TOP_STORIES_PER_PAGE = 5;

/** club_tag id, slug, club CPT id (WordPress catalog) */
const CLUBS = {
  ARS: { name: "Arsenal", tagId: 1415, slug: "arsenal", cptId: 117 },
  AVL: { name: "Aston Villa", tagId: 1458, slug: "aston-villa", cptId: 150 },
  BOU: { name: "Bournemouth", tagId: 1492, slug: "bournemouth", cptId: 177 },
  BRE: { name: "Brentford", tagId: 1506, slug: "brentford", cptId: 184 },
  BHA: { name: "Brighton & Hove Albion", tagId: 12632, slug: "brighton-and-hove-albion", cptId: 8776 },
  CHE: { name: "Chelsea", tagId: 1530, slug: "chelsea", cptId: 193 },
  COV: { name: "Coventry City", tagId: 12633, slug: "coventry-city-fc", cptId: null },
  CRY: { name: "Crystal Palace", tagId: 1568, slug: "crystal-palace", cptId: 194 },
  EVE: { name: "Everton", tagId: 1582, slug: "everton", cptId: 201 },
  FUL: { name: "Fulham", tagId: 1598, slug: "fulham", cptId: 209 },
  HUL: { name: "Hull City", tagId: 12634, slug: "hull-city", cptId: 61061 },
  IPS: { name: "Ipswich Town", tagId: 1614, slug: "ipswich-town", cptId: 218 },
  LEE: { name: "Leeds United", tagId: 12631, slug: "leeds-united", cptId: 8767 },
  LFC: { name: "Liverpool", tagId: 1644, slug: "liverpool", cptId: 234 },
  MCI: { name: "Manchester City", tagId: 1676, slug: "manchester-city", cptId: 260 },
  MUN: { name: "Manchester United", tagId: 1711, slug: "manchester-united", cptId: 289 },
  NEW: { name: "Newcastle United", tagId: 1749, slug: "newcastle-united", cptId: 321 },
  NFO: { name: "Nottingham Forest", tagId: 1764, slug: "nottingham-forest", cptId: 329 },
  SUN: { name: "Sunderland", tagId: 12629, slug: "sunderland", cptId: 8765 },
  TOT: { name: "Tottenham Hotspur", tagId: 1795, slug: "tottenham-hotspur", cptId: 346 },
};

let publicationExcludesCache = null;

function getClub(clubCode) {
  return CLUBS[String(clubCode || "").toUpperCase()] || null;
}

function decodeHtml(value) {
  const el = document.createElement("textarea");
  el.innerHTML = value || "";
  return el.value;
}

function stripHtml(value) {
  const el = document.createElement("div");
  el.innerHTML = value || "";
  return (el.textContent || el.innerText || "").trim();
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function dedupeById(items) {
  const seen = new Set();
  return items.filter((item) => {
    if (!item?.id || seen.has(item.id)) return false;
    seen.add(item.id);
    return true;
  });
}

async function loadPublicationExcludes() {
  if (publicationExcludesCache) return publicationExcludesCache;

  const response = await fetch("club-publication-excludes.json");
  if (!response.ok) {
    throw new Error(`Failed to load publication excludes (${response.status})`);
  }

  publicationExcludesCache = await response.json();
  return publicationExcludesCache;
}

async function getPublicationTagExclude(tagId) {
  const map = await loadPublicationExcludes();
  return map[String(tagId)] || [];
}

function buildWpApiUrl(endpoint, params) {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value == null || value === "") return;
    query.set(key, String(value));
  });

  return `${WP_API.baseUrl}/${endpoint}?${query.toString()}`;
}

async function wpGet(endpoint, params) {
  const response = await fetch(buildWpApiUrl(endpoint, params));

  if (!response.ok) {
    throw new Error(`WordPress request failed (${response.status})`);
  }

  const data = await response.json();
  return Array.isArray(data) ? data : [];
}

function getPublisher(item) {
  const termGroups = item._embedded?.["wp:term"] || [];
  for (const group of termGroups) {
    const match = group.find((term) => term.taxonomy === "publication_tag");
    if (match?.name) return decodeHtml(match.name);
  }

  const metaPublication = String(item.meta?._content_publication || "").trim();
  if (metaPublication) return decodeHtml(metaPublication);

  const publication = item.publications?.[0];
  if (publication?.publication_title || publication?.name) {
    return decodeHtml(publication.publication_title || publication.name);
  }

  return "";
}

function getAuthor(item) {
  const meta = item.meta || {};
  return (
    meta.article_author ||
    meta._article_author ||
    meta._content_author ||
    item.authors?.[0]?.name ||
    ""
  );
}

function parseContentItem(item) {
  return {
    id: item.id,
    title: decodeHtml(item.title?.rendered || ""),
    image: item.meta?.image_url || item.meta?._original_image_url || "",
    publisher: getPublisher(item),
    author: getAuthor(item),
    date: item.date || "",
    link: item.meta?.source_url || item.meta?._original_url || item.link || "",
  };
}

function parseTopStoriesItem(item) {
  const meta = item.meta || {};
  const publisher = getPublisher(item);

  return {
    id: item.id,
    title: decodeHtml(item.title?.rendered || ""),
    excerpt: stripHtml(item.excerpt?.rendered || ""),
    publication: publisher,
    heroImageUrl: meta.image_url || meta.image_url_ts_thumb || "",
    listImageUrl: meta.image_url_ts_thumb || meta.image_url || "",
  };
}

function toTopStoriesFeed(items, clubCode, teamColor, teamAbbrev) {
  const normalized = items.slice(0, TOP_STORIES_PER_PAGE);

  return {
    items: normalized.map((item, index) => {
      const isFeatured = index === 0;
      const imageUrl = isFeatured ? item.heroImageUrl || item.listImageUrl : item.listImageUrl || item.heroImageUrl;

      return {
        id: String(item.id),
        layout: isFeatured ? "featured" : "row",
        title: item.title,
        excerpt: isFeatured ? item.excerpt : undefined,
        publicationTag: item.publication ? item.publication.toUpperCase() : undefined,
        imageUrl: imageUrl || null,
        teamColor,
        teamAbbrev,
      };
    }),
    seeMoreLabel: "See more",
  };
}

async function fetchTopStoriesContentQuery(scopeParams, minScore) {
  return wpGet("content", {
    ...scopeParams,
    content_category: TOP_STORIES_CONTENT_CATEGORIES,
    post_type: "content",
    orderby: "date",
    order: "desc",
    min_score: String(minScore),
    publication_type_exclude: TOP_STORIES_PUBLICATION_TYPE_EXCLUDE,
    per_page: String(TOP_STORIES_PER_PAGE),
    page: "1",
    _embed: "1",
    status: "publish",
  });
}

async function fetchTopStoriesRaw(clubCode) {
  const club = getClub(clubCode);
  if (!club) return [];

  const publicationTagExclude = await getPublicationTagExclude(club.tagId);
  const excludeParam =
    publicationTagExclude.length > 0 ? { publication_tag_exclude: publicationTagExclude.join(",") } : {};

  const scopeAttempts = [
    { club_tag: String(club.tagId) },
    { club_tag_slug: club.slug },
  ];

  let items = [];

  for (const scope of scopeAttempts) {
    items = await fetchTopStoriesContentQuery({ ...scope, ...excludeParam }, TOP_STORIES_MIN_SCORE);
    if (items.length > 0) break;
  }

  if (items.length < TOP_STORIES_PER_PAGE) {
    for (const scope of scopeAttempts) {
      const fillItems = await fetchTopStoriesContentQuery({ ...scope, ...excludeParam }, 0);
      items = dedupeById([...items, ...fillItems]);
      if (items.length >= TOP_STORIES_PER_PAGE) break;
    }
  }

  return items;
}

async function fetchTopStories(clubCode, options = {}) {
  const club = getClub(clubCode);
  if (!club) {
    throw new Error(`Unknown club code: ${clubCode}`);
  }

  const rawItems = await fetchTopStoriesRaw(clubCode);
  const parsed = rawItems.map(parseTopStoriesItem);

  return toTopStoriesFeed(
    parsed,
    clubCode,
    options.teamColor || "#374151",
    options.teamAbbrev || club.name.substring(0, 3).toUpperCase(),
  );
}

function buildContentUrl({ clubTag, perPage = WP_API.perPage } = {}) {
  const params = new URLSearchParams({
    per_page: String(perPage),
    _embed: "1",
  });

  if (clubTag) {
    params.set("club_tag", String(clubTag));
  }

  return `${WP_API.baseUrl}/content?${params.toString()}`;
}

async function fetchContent(options = {}) {
  const response = await fetch(buildContentUrl(options));

  if (!response.ok) {
    throw new Error(`Content request failed (${response.status})`);
  }

  const items = await response.json();
  return items.map(parseContentItem);
}

function getPodcastSeries(item) {
  const termGroups = item._embedded?.["wp:term"] || [];

  for (const group of termGroups) {
    const match = group.find((term) => term.taxonomy === "podcast_series");
    if (match?.name) return decodeHtml(match.name);
  }

  return decodeHtml(item.meta?.content_source_name || "");
}

function parsePodcastItem(item) {
  const meta = item.meta || {};

  return {
    id: item.id,
    title: decodeHtml(item.title?.rendered || ""),
    image: meta.episode_cover || "",
    series: getPodcastSeries(item),
    duration: meta._podcast_duration || "",
    date: meta._podcast_source_published_date || meta.episode_date || item.date || "",
    link: meta.podcast_player_source || meta.podcast_audio_url || item.link || "",
  };
}

function buildPodcastsUrl({ clubTagSlug, perPage = WP_API.perPage } = {}) {
  const params = new URLSearchParams({
    per_page: String(perPage),
    orderby: "date",
    order: "desc",
    _embed: "1",
  });

  if (clubTagSlug) {
    params.set("club_tag_slug", clubTagSlug);
  }

  return `${WP_API.baseUrl}/podcasts?${params.toString()}`;
}

async function fetchPodcasts(options = {}) {
  const response = await fetch(buildPodcastsUrl(options));

  if (!response.ok) {
    throw new Error(`Podcasts request failed (${response.status})`);
  }

  const items = await response.json();
  return items.map(parsePodcastItem);
}

function getVideoChannel(item) {
  const meta = item.meta || {};
  return decodeHtml(meta.video_channel || meta.content_source_name || "");
}

function parseVideoItem(item) {
  const meta = item.meta || {};

  return {
    id: item.id,
    title: decodeHtml(item.title?.rendered || ""),
    image: meta.video_thumbnail || "",
    channel: getVideoChannel(item),
    date: meta.video_published_date || item.date || "",
    link: meta.video_url || meta.video_embed_url || item.link || "",
  };
}

function buildVideosUrl({ clubTag, clubTagSlug, perPage = WP_API.perPage } = {}) {
  const params = new URLSearchParams({
    per_page: String(perPage),
    orderby: "date",
    order: "desc",
    _embed: "1",
  });

  if (clubTagSlug) {
    params.set("club_tag_slug", clubTagSlug);
  } else if (clubTag) {
    params.set("club_tag", String(clubTag));
  }

  return `${WP_API.baseUrl}/videos?${params.toString()}`;
}

async function fetchVideos(options = {}) {
  const response = await fetch(buildVideosUrl(options));

  if (!response.ok) {
    throw new Error(`Videos request failed (${response.status})`);
  }

  const items = await response.json();
  return items.map(parseVideoItem);
}

function formatVideoDate(value) {
  if (!value) return "";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function toVideosFeed(items) {
  return {
    videos: items.map((item) => ({
      id: String(item.id),
      title: item.title,
      channelName: item.channel || undefined,
      date: formatVideoDate(item.date),
      thumbnailUrl: item.image || null,
    })),
    seeMoreLabel: "See more",
  };
}

async function fetchVideosForClub(clubCode, options = {}) {
  const club = getClub(clubCode);
  if (!club) {
    throw new Error(`Unknown club code: ${clubCode}`);
  }

  const items = await fetchVideos({
    clubTagSlug: club.slug,
    perPage: options.perPage || 6,
  });

  return toVideosFeed(items);
}

function extractTweetEmbedBlockquote(embedCode) {
  if (!embedCode) return "";

  const match = String(embedCode).match(/<blockquote[\s\S]*?<\/blockquote>/i);
  return match ? match[0] : "";
}

function extractTweetStatusUrl(item) {
  const sources = [item.meta?._stm_embed_code, item.content?.rendered, item.link];

  for (const source of sources) {
    const match = String(source || "").match(/https?:\/\/(?:twitter\.com|x\.com)\/[A-Za-z0-9_]+\/status\/(\d+)/i);
    if (match) {
      return match[0].split("?")[0];
    }
  }

  return "";
}

function normalizeTweetEmbedBlockquote(blockquote, { theme = "dark", width = 310 } = {}) {
  if (!blockquote) return "";

  let html = blockquote
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/\sdata-theme="[^"]*"/gi, "")
    .replace(/\sdata-width="[^"]*"/gi, "");

  html = html.replace(
    /<blockquote/i,
    `<blockquote data-theme="${theme}" data-dnt="true" data-width="${width}"`,
  );

  return html;
}

function buildTweetEmbedMarkup(item) {
  const blockquote = extractTweetEmbedBlockquote(item.meta?._stm_embed_code);
  if (blockquote) {
    return normalizeTweetEmbedBlockquote(blockquote);
  }

  const tweetUrl = extractTweetStatusUrl(item);
  if (!tweetUrl) return "";

  return `<blockquote class="twitter-tweet" data-theme="dark" data-dnt="true" data-width="310"><a href="${escapeHtml(tweetUrl)}"></a></blockquote>`;
}

function parseTweetItem(item) {
  return {
    id: item.id,
    html: item.content?.rendered || "",
    embedHtml: buildTweetEmbedMarkup(item),
    tweetUrl: extractTweetStatusUrl(item),
  };
}

function buildTweetsUrl({ clubTag, clubTagSlug, perPage = 5 } = {}) {
  const params = new URLSearchParams({
    per_page: String(perPage),
    orderby: "date",
    order: "desc",
  });

  if (clubTag) {
    params.set("club_tag", String(clubTag));
  } else if (clubTagSlug) {
    params.set("club_tag_slug", clubTagSlug);
  }

  return `${WP_API.baseUrl}/stm_tweet?${params.toString()}`;
}

async function fetchTweets(options = {}) {
  const response = await fetch(buildTweetsUrl(options));

  if (!response.ok) {
    throw new Error(`Tweets request failed (${response.status})`);
  }

  const items = await response.json();
  return items.map(parseTweetItem);
}

function toSocialFeed(items) {
  return {
    tweets: items.map((item) => ({
      id: String(item.id),
      html: item.html,
      embedHtml: item.embedHtml,
      tweetUrl: item.tweetUrl,
    })),
  };
}

async function fetchSocialFeedForClub(clubCode, options = {}) {
  const club = getClub(clubCode);
  if (!club) {
    throw new Error(`Unknown club code: ${clubCode}`);
  }

  const perPage = options.perPage || 5;
  let items = await fetchTweets({ clubTag: club.tagId, perPage });

  if (!items.length) {
    items = await fetchTweets({ clubTagSlug: club.slug, perPage });
  }

  return toSocialFeed(items);
}

function getClubTagId(clubCode) {
  return getClub(clubCode)?.tagId ?? null;
}

function getClubTagSlug(clubCode) {
  return getClub(clubCode)?.slug ?? null;
}

function getClubCptId(clubCode) {
  return getClub(clubCode)?.cptId ?? null;
}

window.SideLineAPI = {
  WP_API,
  CLUBS,
  TOP_STORIES_CONTENT_CATEGORIES,
  fetchTopStories,
  fetchContent,
  fetchPodcasts,
  fetchVideos,
  fetchVideosForClub,
  fetchSocialFeedForClub,
  parseContentItem,
  parseTopStoriesItem,
  parsePodcastItem,
  parseVideoItem,
  parseTweetItem,
  getClub,
  getClubTagId,
  getClubTagSlug,
  getClubCptId,
  escapeHtml,
};
