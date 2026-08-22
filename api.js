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

/** stm_tweet club_tag taxonomy slugs when they differ from CLUBS.slug */
const CLUB_TAG_TAXONOMY_SLUG_OVERRIDES = {
  BHA: "brighton-hove-albion",
  COV: "coventry-city",
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

function toTopStoriesFeed(items, clubCode, teamColor, teamAbbrev, limit = TOP_STORIES_PER_PAGE) {
  const normalized = items.slice(0, limit);

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

async function fetchTopStoriesContentQuery(scopeParams, minScore, perPage = TOP_STORIES_PER_PAGE) {
  return wpGet("content", {
    ...scopeParams,
    content_category: TOP_STORIES_CONTENT_CATEGORIES,
    post_type: "content",
    orderby: "date",
    order: "desc",
    min_score: String(minScore),
    publication_type_exclude: TOP_STORIES_PUBLICATION_TYPE_EXCLUDE,
    per_page: String(perPage),
    page: "1",
    _embed: "1",
    status: "publish",
  });
}

async function fetchTopStoriesRaw(clubCode, { limit = TOP_STORIES_PER_PAGE } = {}) {
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
    items = await fetchTopStoriesContentQuery({ ...scope, ...excludeParam }, TOP_STORIES_MIN_SCORE, limit);
    if (items.length > 0) break;
  }

  if (items.length < limit) {
    for (const scope of scopeAttempts) {
      const fillItems = await fetchTopStoriesContentQuery({ ...scope, ...excludeParam }, 0, limit);
      items = dedupeById([...items, ...fillItems]);
      if (items.length >= limit) break;
    }
  }

  return items;
}

async function fetchTopStories(clubCode, options = {}) {
  const club = getClub(clubCode);
  if (!club) {
    throw new Error(`Unknown club code: ${clubCode}`);
  }

  const limit = options.limit || TOP_STORIES_PER_PAGE;
  const rawItems = await fetchTopStoriesRaw(clubCode, { limit });
  const parsed = rawItems.map(parseTopStoriesItem);

  return toTopStoriesFeed(
    parsed,
    clubCode,
    options.teamColor || "#374151",
    options.teamAbbrev || club.name.substring(0, 3).toUpperCase(),
    limit,
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

function formatPodcastDate(value) {
  if (!value) return "";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function toPodcastsFeed(items) {
  return {
    sectionTitle: "Recent Podcasts",
    episodes: items.map((item) => ({
      id: String(item.id),
      title: item.title,
      coverUrl: item.image || null,
      seriesName: item.series || undefined,
      duration: item.duration || undefined,
      date: formatPodcastDate(item.date),
    })),
    seeMoreLabel: "See more",
  };
}

async function fetchPodcastsForClub(clubCode, options = {}) {
  const club = getClub(clubCode);
  if (!club) {
    throw new Error(`Unknown club code: ${clubCode}`);
  }

  const items = await fetchPodcasts({
    clubTagSlug: club.slug,
    perPage: options.perPage || 4,
  });

  return toPodcastsFeed(items);
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

const SOCIAL_STORY_MAX_ACCOUNTS = 4;
const SOCIAL_STORY_MAX_TWEETS_PER_USER = 5;
const SOCIAL_STORY_TWEET_LIMIT = 5;

function getClubTagTaxonomySlug(clubCode) {
  const club = getClub(clubCode);
  if (!club) return null;

  const normalizedCode = String(clubCode || "").toUpperCase();
  return CLUB_TAG_TAXONOMY_SLUG_OVERRIDES[normalizedCode] || club.slug;
}

function getSocialFeedUsername(post) {
  const meta = post.meta || {};

  if (meta._social_feed_x_username) {
    return meta._social_feed_x_username.replace(/^@/, "").trim().toLowerCase();
  }

  const url = post.source_url || meta._social_feed_source_url;
  if (!url) return null;

  const match = String(url).match(/(?:twitter\.com|x\.com)\/([^/?#]+)/i);
  if (!match) return null;

  const segment = match[1].replace(/^@/, "").trim().toLowerCase();
  if (!segment || segment === "i" || segment === "intent" || segment === "share") {
    return null;
  }

  return segment;
}

function getSocialFeedContentScore(post) {
  const raw = post.content_score ?? post.meta?._social_feed_content_score ?? 0;
  const score = Number(raw);
  return Number.isFinite(score) ? score : 0;
}

function getSocialFeedAccountLabel(post, username) {
  const rendered = post.title?.rendered || "";
  const label = decodeHtml(stripHtml(rendered)).replace(/^X\s*[–—-]\s*/i, "").trim();
  return label || `@${username}`;
}

function rankClubSocialAccounts(posts) {
  const byUser = new Map();

  for (const post of posts) {
    const username = getSocialFeedUsername(post);
    if (!username) continue;

    const score = getSocialFeedContentScore(post);
    const label = getSocialFeedAccountLabel(post, username);
    const url = post.source_url || post.meta?._social_feed_source_url || `https://x.com/${username}`;
    const previous = byUser.get(username);

    if (!previous || score > previous.score) {
      byUser.set(username, { username, label, url, score });
    }
  }

  return [...byUser.values()].sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return a.label.localeCompare(b.label);
  });
}

async function fetchSocialFeedPostsByClubSlug(clubTagSlug) {
  const posts = [];
  let page = 1;

  while (page <= 5) {
    const batch = await wpGet("social_feed", {
      club_tag_slug: clubTagSlug,
      per_page: "100",
      page: String(page),
      orderby: "date",
      order: "desc",
      status: "publish",
      _embed: "1",
    });

    if (!batch.length) break;

    posts.push(...batch);

    if (batch.length < 100) break;
    page += 1;
  }

  return posts;
}

function buildXTweetUrl(tweet) {
  const username = tweet.source_username || tweet.sourceUsername || "";
  if (username) {
    return `https://twitter.com/${username}/status/${tweet.id}`;
  }

  return `https://twitter.com/i/web/status/${tweet.id}`;
}

function buildXTweetEmbedMarkup(tweetUrl) {
  if (!tweetUrl) return "";

  return `<blockquote class="twitter-tweet" data-theme="dark" data-dnt="true" data-width="390"><a href="${escapeHtml(tweetUrl)}"></a></blockquote>`;
}

function formatXTweetHtml(tweet) {
  const text = String(tweet.text || "").trim();
  if (!text) return "";

  const escaped = escapeHtml(text).replace(/\n/g, "<br>");
  const username = tweet.source_username || tweet.sourceUsername || "";
  const handle = username ? `@${escapeHtml(username)}` : "";

  return `
    <div class="stm-tweet-content">
      <p>${escaped}</p>
      ${handle ? `<p class="stm-tweet-meta">${handle}</p>` : ""}
    </div>
  `.trim();
}

function mapXTweetToFeedItem(tweet) {
  const tweetUrl = buildXTweetUrl(tweet);

  return {
    id: String(tweet.id),
    html: formatXTweetHtml(tweet),
    embedHtml: buildXTweetEmbedMarkup(tweetUrl),
    tweetUrl,
    createdAt: tweet.created_at || "",
  };
}

function mapProfileFallbackToFeedItem(account) {
  const profileUrl = account.url || `https://x.com/${account.username}`;

  return {
    id: `profile-${account.username}`,
    html: `
      <div class="sl-club-story-tweet-profile">
        <a href="${escapeHtml(profileUrl)}" target="_blank" rel="noopener noreferrer">
          <strong>${escapeHtml(account.label)}</strong>
          <span>@${escapeHtml(account.username)}</span>
        </a>
      </div>
    `.trim(),
    embedHtml: "",
    tweetUrl: profileUrl,
    isProfileFallback: true,
  };
}

async function fetchXTweetsViaProxy(username, maxResults = SOCIAL_STORY_MAX_TWEETS_PER_USER) {
  const params = new URLSearchParams({
    username,
    max_results: String(maxResults),
  });

  const response = await fetch(`/api/x/tweets?${params}`);
  if (!response.ok) return [];

  const data = await response.json();
  if (Array.isArray(data)) return data;
  if (Array.isArray(data.tweets)) return data.tweets;
  return [];
}

async function fetchClubSocialTweets(accounts, { maxAccounts, maxPerUser, limit }) {
  const topAccounts = accounts.slice(0, maxAccounts);
  if (!topAccounts.length) return [];

  const results = await Promise.all(
    topAccounts.map(async (account) => {
      const tweets = await fetchXTweetsViaProxy(account.username, maxPerUser);
      return tweets.map((tweet) =>
        mapXTweetToFeedItem({
          ...tweet,
          source_username: tweet.source_username || account.username,
        }),
      );
    }),
  );

  const seen = new Set();
  const merged = results
    .flat()
    .filter((tweet) => {
      if (seen.has(tweet.id)) return false;
      seen.add(tweet.id);
      return true;
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return merged.slice(0, limit);
}

function toSocialFeed(tweets) {
  return {
    tweets: tweets.map((tweet) => ({
      id: String(tweet.id),
      html: tweet.html,
      embedHtml: tweet.embedHtml,
      tweetUrl: tweet.tweetUrl,
      isProfileFallback: Boolean(tweet.isProfileFallback),
    })),
  };
}

async function fetchSocialFeedForClub(clubCode, options = {}) {
  const club = getClub(clubCode);
  if (!club) {
    throw new Error(`Unknown club code: ${clubCode}`);
  }

  const clubTagSlug = getClubTagTaxonomySlug(clubCode);
  if (!clubTagSlug) {
    return toSocialFeed([]);
  }

  const limit = options.perPage || SOCIAL_STORY_TWEET_LIMIT;
  const maxAccounts = options.maxAccounts || SOCIAL_STORY_MAX_ACCOUNTS;
  const maxPerUser = options.maxTweetsPerUser || SOCIAL_STORY_MAX_TWEETS_PER_USER;

  const posts = await fetchSocialFeedPostsByClubSlug(clubTagSlug);
  const accounts = rankClubSocialAccounts(posts);

  let tweets = await fetchClubSocialTweets(accounts, { maxAccounts, maxPerUser, limit });

  if (!tweets.length && accounts.length) {
    tweets = accounts.slice(0, limit).map(mapProfileFallbackToFeedItem);
  }

  return toSocialFeed(tweets);
}

function getClubTagId(clubCode) {
  return getClub(clubCode)?.tagId ?? null;
}

function getClubTagSlug(clubCode) {
  return getClub(clubCode)?.slug ?? null;
}

function getClubTagTaxonomySlugForClub(clubCode) {
  return getClubTagTaxonomySlug(clubCode);
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
  fetchPodcastsForClub,
  fetchVideos,
  fetchVideosForClub,
  fetchSocialFeedForClub,
  parseContentItem,
  parseTopStoriesItem,
  parsePodcastItem,
  parseVideoItem,
  getClub,
  getClubTagId,
  getClubTagSlug,
  getClubTagTaxonomySlugForClub,
  getClubCptId,
  escapeHtml,
};
