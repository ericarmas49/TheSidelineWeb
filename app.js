const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const CTA_LOGO_CODES = [
  "ars",
  "avl",
  "bou",
  "bre",
  "bha",
  "che",
  "cov",
  "cry",
  "eve",
  "ful",
  "lee",
  "lfc",
  "mci",
  "mun",
  "new",
  "nfo",
  "sun",
  "tot",
  "whu",
  "wol",
];

function buildCtaLogoGridMarkup() {
  return CTA_LOGO_CODES.map(
    (code) =>
      `<div class="sl-cta-logo-cell"><img src="logos/${code}.png" alt="" loading="lazy" width="72" height="72" /></div>`,
  ).join("");
}

function bootCtaLogoGrid() {
  const grid = document.querySelector("#sl-cta-logo-grid");

  if (!grid) return;

  grid.innerHTML = buildCtaLogoGridMarkup();
}

function bootFeaturePhoneEntrances() {
  if (prefersReducedMotion) return;

  const PHONE_ENTER_DELAY_MS = 400;
  const phoneSelectors = [
    "#sl-features-stage .sl-feature-phone",
    "#sl-personalization .sl-feature-phone",
    "#sl-filters .sl-feature-phone",
  ];

  phoneSelectors.forEach((selector) => {
    const phone = document.querySelector(selector);
    if (!phone) return;

    phone.classList.add("is-phone-enter-pending");

    const revealPhone = () => {
      phone.classList.remove("is-phone-enter-pending");

      if (window.gsap) {
        gsap.fromTo(
          phone,
          { autoAlpha: 0, y: 56 },
          { autoAlpha: 1, y: 0, duration: 1, ease: "power3.out", delay: 0.05 },
        );
        return;
      }

      phone.classList.add("is-phone-enter-revealed");
    };

    if (!("IntersectionObserver" in window)) {
      revealPhone();
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting || entry.intersectionRatio < 0.35) return;
          observer.disconnect();
          window.setTimeout(revealPhone, PHONE_ENTER_DELAY_MS);
        });
      },
      { root: null, threshold: [0, 0.35, 0.5], rootMargin: "0px 0px -15% 0px" },
    );

    observer.observe(phone);
  });
}

function bootAnimations() {
  if (prefersReducedMotion || !window.gsap || !window.ScrollTrigger) {
    document.documentElement.classList.add("no-motion");
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  gsap.set("[data-section]", { opacity: 1 });

  gsap.from(".site-header", {
    y: -24,
    opacity: 0,
    duration: 0.8,
    ease: "power2.out",
  });

  gsap
    .timeline({ defaults: { ease: "power3.out" } })
    .from(".hero h1", { y: 34, opacity: 0, duration: 0.95 })
    .from(".hero-copy > p", { y: 26, opacity: 0, duration: 0.8 }, "-=0.45")
    .from("#sl-hero-app-store, #sl-hero-google-play", { y: 22, opacity: 0, duration: 0.75, stagger: 0.08 }, "-=0.35")
    .from(".sl-hero-qr", { scale: 0.82, opacity: 0, duration: 0.65 }, "-=0.55")
    .from(".sl-hero-phone-inner", { y: 20, opacity: 0, duration: 0.85 }, "-=0.8");

  gsap.utils
    .toArray(
      ".section-heading, #sl-features-intro, .sl-benefits-title, .sl-benefit-card, .sl-cta-home-copy, .sl-footer",
    )
    .forEach((el) => {
      gsap.from(el, {
        y: 42,
        opacity: 0,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: el,
          start: "top 84%",
        },
      });
    });

  bootClubSelectorStoryPin();
}

function bootHeroVideo() {
  const video = document.querySelector("#sl-hero-video");

  if (!video || prefersReducedMotion) return;

  video.defaultMuted = true;
  video.muted = true;

  function attemptPlay() {
    const playAttempt = video.play();
    if (playAttempt) {
      playAttempt.catch(() => {});
    }
  }

  if (video.readyState >= 2) {
    attemptPlay();
    return;
  }

  video.addEventListener("loadeddata", attemptPlay, { once: true });
  video.addEventListener("canplay", attemptPlay, { once: true });
  attemptPlay();
}

function bootHeroPhoneStatusBar() {
  const timeEls = document.querySelectorAll(".sl-phone-status-time");

  if (!timeEls.length) return;

  function updateTime() {
    const label = new Date().toLocaleTimeString(undefined, {
      hour: "numeric",
      minute: "2-digit",
    });

    timeEls.forEach((timeEl) => {
      timeEl.textContent = label;
    });
  }

  updateTime();
  window.setInterval(updateTime, 30000);
}

const CLUB_SELECTOR_APP = {
  width: 390,
  height: 754,
};

const CLUB_SELECTOR_TEAMS = [
  { code: "ARS", name: "Arsenal", logo: "logos/ars.png" },
  { code: "AVL", name: "Aston Villa", logo: "logos/avl.png" },
  { code: "BOU", name: "Bournemouth", logo: "logos/bou.png" },
  { code: "BRE", name: "Brentford", logo: "logos/bre.png" },
  { code: "BHA", name: "Brighton", logo: "logos/bha.png" },
  { code: "CHE", name: "Chelsea", logo: "logos/che.png" },
  { code: "COV", name: "Coventry City", logo: "logos/cov.png" },
  { code: "CRY", name: "C Palace", logo: "logos/cry.png" },
  { code: "EVE", name: "Everton", logo: "logos/eve.png" },
  { code: "FUL", name: "Fulham", logo: "logos/ful.png" },
  { code: "HUL", name: "Hull City", logo: "https://cdn.sportmonks.com/images/soccer/teams/22/22.png" },
  { code: "IPS", name: "Ipswich Town", logo: "https://cdn.sportmonks.com/images/soccer/teams/20/116.png" },
  { code: "LEE", name: "Leeds", logo: "logos/lee.png" },
  { code: "LFC", name: "Liverpool", logo: "logos/lfc.png" },
  { code: "MCI", name: "Man City", logo: "logos/mci.png" },
  { code: "MUN", name: "Man Utd", logo: "logos/mun.png" },
  { code: "NEW", name: "Newcastle", logo: "logos/new.png" },
  { code: "NFO", name: "Forest", logo: "logos/nfo.png" },
  { code: "SUN", name: "Sunderland", logo: "logos/sun.png" },
  { code: "TOT", name: "Spurs", logo: "logos/tot.png" },
];

function renderClubSelectorPickHotspots() {
  const hotspots = document.querySelector("#sl-club-selector-pick-hotspots");

  if (!hotspots) return;

  hotspots.innerHTML = CLUB_SELECTOR_TEAMS.map(
    (team) => `
      <button
        type="button"
        class="sl-club-selector-pick-hotspot"
        data-club="${team.code}"
        aria-label="${team.name}"
        aria-pressed="false"
      ></button>
    `,
  ).join("");
}

const CLUB_PRIMARY_COLORS = {
  ARS: "#EC0024",
  AVL: "#670e36",
  BOU: "#000000",
  BRE: "#D20000",
  BHA: "#0057B8",
  CHE: "#034694",
  COV: "#62b5e5",
  CRY: "#1B458F",
  EVE: "#003399",
  FUL: "#000000",
  HUL: "#000000",
  IPS: "#0333a0",
  LEE: "#1D428A",
  LFC: "#C8102E",
  MCI: "#6CABDD",
  MUN: "#DA291C",
  NEW: "#241F20",
  NFO: "#DD0000",
  SUN: "#EB172C",
  TOT: "#132257",
};

const CLUB_STORY_FEED_IMAGES = [
  null,
  null,
  null,
  "screenshots/club-selector-social-posts.png",
];

const CLUB_STORY_FEED_MODES = ["trending", "trending", "trending", "for-me"];

const CLUB_STORY_APP_ASSETS = {
  profile: "assets/app/Profile-Icon-1.png",
  logo: "assets/app/Sideline-Logo-White.png",
  sidebar: "assets/app/Sidebar-Icon.png",
  filter: "assets/app/Filter-Icon.png",
  search: "assets/app/Search-Icon.png",
};

const TOP_STORIES_SAMPLE_FEED = {
  items: [
    {
      id: "1",
      layout: "featured",
      publicationTag: "DAILY MAIL SPORT",
      title:
        "England facing defensive crisis with Reece James and Jarell Quansah to miss last-32 clash with DR Congo – as Thomas Tuchel vows to entertain the kids in early kick-off",
      excerpt:
        "England faces a defensive crisis with Reece James and Jarell Quansah missing the clash against DR Congo. Manager Thomas Tuchel aims to entertain the kids during the early kick-off.",
      imageUrl:
        "https://wsrv.nl/?url=https%3A%2F%2Fi.dailymail.com%2F1s%2F2026%2F06%2F30%2F23%2F109705833-0-image-a-30_1782859501425.jpg&w=860&h=400&fit=cover&output=jpg&q=75",
    },
    {
      id: "2",
      layout: "row",
      publicationTag: "BBC SPORT",
      title: "Rosenior nears management return at Paris FC",
      imageUrl:
        "https://ichef.bbci.co.uk/ace/standard/240/cpsprodpb/757d/live/747765b0-7081-11f1-a866-abbad6b6b076.jpg",
    },
    {
      id: "3",
      layout: "row",
      publicationTag: "ESPN FC",
      title: "Chelsea avoid hefty UEFA fine for overspending",
      imageUrl:
        "https://a1.espncdn.com/combiner/i?img=%2Fphoto%2F2025%2F1227%2Fr1594038_1296x729_16-9.jpg&w=200&h=200&scale=crop&cquality=80&location=origin",
    },
    {
      id: "4",
      layout: "row",
      publicationTag: "BBC SPORT",
      title: "PSG set Barcola price – Wednesday's gossip",
      imageUrl:
        "https://ichef.bbci.co.uk/ace/standard/240/cpsprodpb/0b76/live/f85e4820-74bf-11f1-8e1d-bbbb1017d210.png",
    },
    {
      id: "5",
      layout: "row",
      publicationTag: "THE GUARDIAN",
      title: "Newcastle, Chelsea and Aston Villa fined for breaching European financial rules",
      imageUrl: null,
      teamColor: "#374151",
      teamAbbrev: "NEW",
    },
  ],
  seeMoreLabel: "See more",
};

const PODCAST_HEADSET_ICON = `<svg class="sl-app-podcast-headset-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="M12 1a9 9 0 0 0-9 9v7c0 1.66 1.34 3 3 3h1v-8H5a7 7 0 0 1 14 0h-2v8h1c1.66 0 3-1.34 3-3v-7a9 9 0 0 0-9-9zm-3 17h6v2H9v-2z"/></svg>`;

const PODCAST_PLAY_ICON = `<svg class="sl-app-podcast-play-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="M8 5v14l11-7z"/></svg>`;

const PODCAST_MIC_ICON = `<svg class="sl-app-podcast-mic-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="M12 14a3 3 0 0 0 3-3V5a3 3 0 1 0-6 0v6a3 3 0 0 0 3 3zm5-3a5 5 0 0 1-10 0H5a7 7 0 0 0 6 6.92V21h2v-3.08A7 7 0 0 0 19 11h-2z"/></svg>`;

const PODCASTS_SAMPLE_FEED = {
  sectionTitle: "Recent Episodes",
  episodes: [
    {
      id: "94453",
      seriesName: "THE ATHLETIC FC PODCAST",
      title: "Germany hit new low + Ornstein transfer latest",
      duration: "42 min",
      date: "30 Jun 2026",
      coverUrl:
        "https://wsrv.nl/?url=https%3A%2F%2Fassets.pippa.io%2Fshows%2F6818be7d1d28d62313ac8ef3%2F1782819293273-501a24b7-7c4d-4bf6-b1a1-f2197331b6a1.jpeg&w=240&h=240&fit=cover&output=jpg&q=75",
    },
    {
      id: "93507",
      seriesName: "OUTSPOKEN WITH WHITE AND JORDAN",
      title: "Steve Clarke Out, Maresca In At Manchester City & AJ vs Fury Preview",
      duration: "50 min",
      date: "29 Jun 2026",
      coverUrl:
        "https://wsrv.nl/?url=https%3A%2F%2Fassets.pippa.io%2Fshows%2F61ba21f51a8cbe75bb3cf280%2F1668780831114-f276576b8d075757da08daea3cd783e3.jpeg&w=240&h=240&fit=cover&output=jpg&q=75",
    },
    {
      id: "93398",
      seriesName: "THE REDMEN TV - LIVERPOOL FC PODCAST",
      title: "Liverpool Fans REACT to WILD Chelsea statement on Man City's new boss Enzo Maresca!",
      duration: "11 min",
      date: "29 Jun 2026",
      coverUrl:
        "https://wsrv.nl/?url=https%3A%2F%2Fassets.pippa.io%2Fshows%2F611e92b606c05e0b50f40b2b%2F1747049635661-c32e5f61-402f-48b9-ab63-645732a3de6b.jpeg&w=240&h=240&fit=cover&output=jpg&q=75",
    },
    {
      id: "92934",
      seriesName: "FOOTBALL DAILY",
      title: "World Cup: César Azpilicueta on Yamal, Dechamps & Tuchel",
      duration: "31 min",
      date: "29 Jun 2026",
      coverUrl:
        "https://wsrv.nl/?url=http%3A%2F%2Fichef.bbci.co.uk%2Fimages%2Fic%2F3000x3000%2Fp0ntgrn4.jpg&w=240&h=240&fit=cover&output=jpg&q=75",
    },
    {
      id: "88887",
      seriesName: "OUTSPOKEN WITH WHITE AND JORDAN",
      title: "Scotland On The Brink and John Terry's England Verdict!",
      duration: "58 min",
      date: "25 Jun 2026",
      coverUrl:
        "https://wsrv.nl/?url=https%3A%2F%2Fassets.pippa.io%2Fshows%2F61ba21f51a8cbe75bb3cf280%2F1668780831114-f276576b8d075757da08daea3cd783e3.jpeg&w=240&h=240&fit=cover&output=jpg&q=75",
    },
    {
      id: "85915",
      seriesName: "STRAIGHT OUTTA COBHAM: THE ATHLETIC FC'S CHELSEA SHOW",
      title: "Midfield Audit: What's happening with Enzo Fernandez?",
      duration: "1 hr 1 min",
      date: "24 Jun 2026",
      coverUrl:
        "https://wsrv.nl/?url=https%3A%2F%2Fassets.pippa.io%2Fshows%2F681ccb505acb8b715f1f1330%2Fshow-cover.png&w=240&h=240&fit=cover&output=jpg&q=75",
    },
    {
      id: "82586",
      seriesName: "THE ATHLETIC FC PODCAST",
      title: "How far can Pochettino take the USA?",
      duration: "39 min",
      date: "20 Jun 2026",
      coverUrl:
        "https://wsrv.nl/?url=https%3A%2F%2Fassets.pippa.io%2Fshows%2F6818be7d1d28d62313ac8ef3%2F1780908531790-dc4761a0-ffde-45cc-a794-1639ef472007.jpeg&w=240&h=240&fit=cover&output=jpg&q=75",
    },
    {
      id: "81054",
      seriesName: "CHELSEA FANCAST",
      title: "Went To Mow Kingsmeadow #215 Season Review",
      duration: "54 min",
      date: "18 Jun 2026",
      coverUrl:
        "https://wsrv.nl/?url=https%3A%2F%2Fassets.pippa.io%2Fshows%2F60f6ee7ca2587e6950f4a5aa%2F1781815333404-861623cc-f0f5-4535-87d0-ef43b7543d26.jpeg&w=240&h=240&fit=cover&output=jpg&q=75",
    },
  ],
  seeMoreLabel: "See more",
};

const PODCASTS_FEED_BY_CLUB = {
  LFC: {
    sectionTitle: "Recent Episodes",
    episodes: [
      {
        id: "94622",
        seriesName: "THE REDMEN TV - LIVERPOOL FC PODCAST",
        title: "Liverpool's Academy Transfer Plans | Expert Insight w/Lewis Bower",
        duration: "8 min",
        date: "30 Jun 2026",
        coverUrl:
          "https://wsrv.nl/?url=https%3A%2F%2Fassets.pippa.io%2Fshows%2F611e92b606c05e0b50f40b2b%2F1747049635661-c32e5f61-402f-48b9-ab63-645732a3de6b.jpeg&w=240&h=240&fit=cover&output=jpg&q=75",
        teamColor: "#C8102E",
      },
      {
        id: "94410",
        seriesName: "THE REDMEN TV - LIVERPOOL FC PODCAST",
        title: "Should Liverpool Pay £116m for Bradley Barcola!? | Transfer News Update",
        duration: "29 min",
        date: "30 Jun 2026",
        coverUrl:
          "https://wsrv.nl/?url=https%3A%2F%2Fassets.pippa.io%2Fshows%2F611e92b606c05e0b50f40b2b%2F1747049635661-c32e5f61-402f-48b9-ab63-645732a3de6b.jpeg&w=240&h=240&fit=cover&output=jpg&q=75",
        teamColor: "#C8102E",
      },
      {
        id: "94342",
        seriesName: "THE REDMEN TV - LIVERPOOL FC PODCAST",
        title: "Liverpool's Winger Transfer Targets List Revealed! | Redmen Bite",
        duration: "10 min",
        date: "30 Jun 2026",
        coverUrl:
          "https://wsrv.nl/?url=https%3A%2F%2Fassets.pippa.io%2Fshows%2F611e92b606c05e0b50f40b2b%2F1747049635661-c32e5f61-402f-48b9-ab63-645732a3de6b.jpeg&w=240&h=240&fit=cover&output=jpg&q=75",
        teamColor: "#C8102E",
      },
      {
        id: "93398",
        seriesName: "THE REDMEN TV - LIVERPOOL FC PODCAST",
        title: "Liverpool Fans REACT to WILD Chelsea statement on Man City's new boss Enzo Maresca!",
        duration: "11 min",
        date: "29 Jun 2026",
        coverUrl:
          "https://wsrv.nl/?url=https%3A%2F%2Fassets.pippa.io%2Fshows%2F611e92b606c05e0b50f40b2b%2F1747049635661-c32e5f61-402f-48b9-ab63-645732a3de6b.jpeg&w=240&h=240&fit=cover&output=jpg&q=75",
        teamColor: "#C8102E",
      },
      {
        id: "92934",
        seriesName: "FOOTBALL DAILY",
        title: "World Cup: César Azpilicueta on Yamal, Dechamps & Tuchel",
        duration: "31 min",
        date: "29 Jun 2026",
        coverUrl:
          "https://wsrv.nl/?url=http%3A%2F%2Fichef.bbci.co.uk%2Fimages%2Fic%2F3000x3000%2Fp0ntgrn4.jpg&w=240&h=240&fit=cover&output=jpg&q=75",
      },
    ],
    seeMoreLabel: "See more",
  },
  ARS: {
    sectionTitle: "Recent Episodes",
    episodes: [
      {
        id: "93508",
        seriesName: "ARSEBLOG ARSECAST, THE ARSENAL PODCAST",
        title: "Arsecast Extra Episode 701 – 29.06.2026",
        duration: "1 hr 23 min",
        date: "29 Jun 2026",
        coverUrl:
          "https://wsrv.nl/?url=https%3A%2F%2Fassets.pippa.io%2Fshows%2F611fb7e9480472b028143f16%2F1780557453985-71cd2f99-ed13-4a7b-b8ec-dbb1ddc5c195.jpeg&w=240&h=240&fit=cover&output=jpg&q=75",
        teamColor: "#EC0024",
      },
      {
        id: "71429",
        seriesName: "ARSEBLOG ARSECAST, THE ARSENAL PODCAST",
        title: "Arsenal Women Arsecast Episode 168: Have you ever had it blue?",
        duration: "49 min",
        date: "4 Jun 2026",
        coverUrl:
          "https://wsrv.nl/?url=https%3A%2F%2Fassets.pippa.io%2Fshows%2F611fb7e9480472b028143f16%2F1780557453985-71cd2f99-ed13-4a7b-b8ec-dbb1ddc5c195.jpeg&w=240&h=240&fit=cover&output=jpg&q=75",
        teamColor: "#EC0024",
      },
      ...PODCASTS_SAMPLE_FEED.episodes.slice(0, 3),
    ],
    seeMoreLabel: "See more",
  },
};

function getPodcastsFeedForClub(code) {
  if (code && PODCASTS_FEED_BY_CLUB[code]) {
    return PODCASTS_FEED_BY_CLUB[code];
  }

  return PODCASTS_SAMPLE_FEED;
}

function buildPodcastCoverMarkup(episode) {
  const placeholderColor = escapeHtml(episode.teamColor || "#374151");
  const id = escapeHtml(episode.id);

  if (episode.coverUrl) {
    return `<img class="sl-app-podcast-cover" src="${escapeHtml(episode.coverUrl)}" alt="" loading="lazy" data-testid="recent-episodes-episode-${id}-cover-image" />`;
  }

  return `<div class="sl-app-podcast-cover-placeholder" style="background-color: ${placeholderColor}">${PODCAST_MIC_ICON}</div>`;
}

function buildPodcastEpisodeMarkup(episode) {
  const id = escapeHtml(episode.id);
  const series = episode.seriesName
    ? `<div class="sl-app-podcast-series" data-testid="recent-episodes-episode-${id}-media-source-text">${escapeHtml(episode.seriesName)}</div>`
    : "";
  const duration =
    episode.duration && episode.duration !== "—"
      ? `<div class="sl-app-podcast-duration" data-testid="recent-episodes-episode-${id}-duration">
          ${PODCAST_HEADSET_ICON}
          <span class="sl-app-podcast-duration-text" data-testid="recent-episodes-episode-${id}-duration-text">${escapeHtml(episode.duration)}</span>
        </div>`
      : "";
  const date = episode.date
    ? `<time class="sl-app-podcast-date" data-testid="recent-episodes-episode-${id}-date">${escapeHtml(episode.date)}</time>`
    : "";
  const meta = duration || date ? `<div class="sl-app-podcast-meta" data-testid="recent-episodes-episode-${id}-metadata">${duration}${date}</div>` : "";

  return `
    <article class="sl-app-podcast-episode" id="recent-episodes-episode-${id}" data-testid="recent-episodes-episode-${id}">
      <div class="sl-app-podcast-cover-wrap" data-testid="recent-episodes-episode-${id}-cover-art">
        ${buildPodcastCoverMarkup(episode)}
        <div class="sl-app-podcast-play-overlay" data-testid="recent-episodes-episode-${id}-play-button-overlay" aria-hidden="true">
          <span class="sl-app-podcast-play-button" data-testid="recent-episodes-episode-${id}-play-button">${PODCAST_PLAY_ICON}</span>
        </div>
      </div>
      <div class="sl-app-podcast-body" data-testid="recent-episodes-episode-${id}-content">
        ${series}
        <h3 class="sl-app-podcast-title" data-testid="recent-episodes-episode-${id}-title">${escapeHtml(decodeHtmlEntities(episode.title))}</h3>
        ${meta}
      </div>
    </article>
  `;
}

function buildPodcastsFeedMarkup(feed) {
  const title = feed.sectionTitle
    ? `<h2 class="sl-app-podcasts-section-title" id="recent-episodes-title" data-testid="recent-episodes-title">${escapeHtml(feed.sectionTitle)}</h2>`
    : "";

  return `
    <section class="sl-app-podcasts-feed" id="content-section-recent-episodes" data-testid="recent-episodes-section" aria-label="recent-episodes-section">
      ${title}
      <div class="sl-app-podcasts-list" id="recent-episodes-container" data-testid="recent-episodes-container">
        ${feed.episodes.map((episode) => buildPodcastEpisodeMarkup(episode)).join("")}
      </div>
      <div class="sl-app-podcasts-see-more-row" data-testid="recent-episodes-see-more-row">
        <span class="sl-app-podcasts-see-more" data-testid="recent-episodes-see-more">${escapeHtml(feed.seeMoreLabel || "See more")}</span>
      </div>
    </section>
  `;
}

const VIDEO_PLAY_ICON = `<svg class="sl-app-video-play-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="#FFFFFF" d="M8 5v14l11-7z"/></svg>`;

const VIDEO_CAM_ICON = `<svg class="sl-app-video-cam-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><rect x="2" y="6" width="14" height="12" rx="2" stroke="#FFFFFF" stroke-width="2" fill="none"/><path stroke="#FFFFFF" stroke-width="2" fill="none" d="M16 10l6-3v10l-6-3z"/></svg>`;

const VIDEOS_SAMPLE_FEED = {
  videos: [
    {
      id: "88101",
      title: "Arsenal transfer targets ranked — who should Arteta sign next?",
      channelName: "AFTV",
      date: "30 Jun 2026",
      thumbnailUrl: "https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg",
    },
    {
      id: "88102",
      title: "Every Arsenal pre-season moment you might have missed",
      channelName: "AFTV",
      date: "29 Jun 2026",
      thumbnailUrl: "https://img.youtube.com/vi/ScMzIvxBSi4/hqdefault.jpg",
    },
    {
      id: "88103",
      title: "Is this Arsenal's best starting XI for the new season?",
      channelName: "AFTV",
      date: "28 Jun 2026",
      thumbnailUrl: "https://img.youtube.com/vi/jNQXAC9IVRw/hqdefault.jpg",
    },
    {
      id: "77201",
      title: "Liverpool's midfield rebuild — who fits Slot's system?",
      channelName: "THE ANFIELD WRAP",
      date: "30 Jun 2026",
      thumbnailUrl: "https://img.youtube.com/vi/9bZkp7q19f0/hqdefault.jpg",
    },
    {
      id: "77202",
      title: "Should Liverpool pay the asking price for Bradley Barcola?",
      channelName: "THE ANFIELD WRAP",
      date: "29 Jun 2026",
      thumbnailUrl: "https://img.youtube.com/vi/kJQP7kiw5Fk/hqdefault.jpg",
    },
    {
      id: "77203",
      title: "Premier League financial rules explained in five minutes",
      channelName: "SKY SPORTS PL",
      date: "27 Jun 2026",
      thumbnailUrl: null,
      teamColor: "#132257",
    },
  ],
  seeMoreLabel: "See more",
};

const VIDEOS_FEED_BY_CLUB = {
  ARS: {
    videos: VIDEOS_SAMPLE_FEED.videos.filter((video) => video.id.startsWith("881")),
    seeMoreLabel: "See more",
  },
  LFC: {
    videos: [
      VIDEOS_SAMPLE_FEED.videos[3],
      VIDEOS_SAMPLE_FEED.videos[4],
      {
        id: "77204",
        title: "Liverpool's Academy Transfer Plans | Expert Insight",
        channelName: "THE ANFIELD WRAP",
        date: "30 Jun 2026",
        thumbnailUrl: "https://img.youtube.com/vi/9bZkp7q19f0/hqdefault.jpg",
      },
      {
        id: "77205",
        title: "Slot's first summer window — grades for every Liverpool signing",
        channelName: "THE ANFIELD WRAP",
        date: "28 Jun 2026",
        thumbnailUrl: "https://img.youtube.com/vi/kJQP7kiw5Fk/hqdefault.jpg",
      },
      VIDEOS_SAMPLE_FEED.videos[5],
      {
        id: "77206",
        title: "Every angle on Liverpool's pre-season friendly win",
        channelName: "THE ANFIELD WRAP",
        date: "26 Jun 2026",
        thumbnailUrl: "https://img.youtube.com/vi/ScMzIvxBSi4/hqdefault.jpg",
      },
    ],
    seeMoreLabel: "See more",
  },
};

function getVideosFeedForClub(code) {
  if (code && VIDEOS_FEED_BY_CLUB[code]) {
    return VIDEOS_FEED_BY_CLUB[code];
  }

  return VIDEOS_SAMPLE_FEED;
}

function buildVideoThumbMarkup(video) {
  const placeholderColor = escapeHtml(video.teamColor || "#4B5563");

  if (video.thumbnailUrl) {
    return `<img class="sl-app-video-thumb" src="${escapeHtml(video.thumbnailUrl)}" alt="" loading="lazy" />`;
  }

  return `<div class="sl-app-video-thumb-placeholder" style="background-color: ${placeholderColor}">${VIDEO_CAM_ICON}</div>`;
}

function buildVideoCardMarkup(video) {
  const id = escapeHtml(video.id);
  const channel = video.channelName
    ? `<div class="sl-app-video-channel" data-testid="film-room-video-${id}-channel-name">${escapeHtml(video.channelName)}</div>`
    : "";
  const date = video.date
    ? `<time class="sl-app-video-date" data-testid="film-room-video-${id}-date">${escapeHtml(video.date)}</time>`
    : "";

  return `
    <article class="sl-app-video-card" id="film-room-video-${id}" data-testid="film-room-video-${id}">
      <div class="sl-app-video-thumb-wrap" data-testid="film-room-video-${id}-thumbnail">
        ${buildVideoThumbMarkup(video)}
        <div class="sl-app-video-play-overlay" aria-hidden="true">
          ${VIDEO_PLAY_ICON}
        </div>
      </div>
      <div class="sl-app-video-body">
        <h3 class="sl-app-video-title" data-testid="film-room-video-${id}-title">${escapeHtml(decodeHtmlEntities(video.title))}</h3>
        ${channel}
        ${date}
      </div>
    </article>
  `;
}

function buildVideosFeedMarkup(feed) {
  return `
    <section class="sl-app-videos-feed" id="content-section-film-room" data-testid="film-room-content" aria-label="film-room-content">
      <div class="sl-app-film-room-videos" id="film-room-latest-videos-container" data-testid="film-room-latest-videos-container">
        ${feed.videos.map((video) => buildVideoCardMarkup(video)).join("")}
      </div>
      <div class="sl-app-videos-see-more-row" data-testid="film-room-see-more-row">
        <span class="sl-app-videos-see-more" data-testid="film-room-see-more">${escapeHtml(feed.seeMoreLabel || "See more")}</span>
      </div>
    </section>
  `;
}

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function decodeHtmlEntities(text) {
  const textarea = document.createElement("textarea");
  textarea.innerHTML = text;
  return textarea.value;
}

function getTopStoriesFeedForClub(code) {
  if (code && topStoriesCache[code]) {
    return topStoriesCache[code];
  }

  return TOP_STORIES_SAMPLE_FEED;
}

function getTopStoriesTeamAbbrev(code) {
  const headline = getClubHeadlineName(code);
  return headline.substring(0, 3).toUpperCase();
}

function buildTopStoriesLoadingMarkup() {
  return `
    <section class="sl-app-top-stories sl-app-top-stories--loading" id="top-stories-section" data-testid="top-stories-section" aria-label="top-stories-section">
      <div class="sl-app-top-stories-loading" data-testid="top-stories-loading" aria-live="polite">
        <span class="sl-app-top-stories-loading-spinner" aria-hidden="true"></span>
        <span class="sl-app-top-stories-loading-text">Loading top stories…</span>
      </div>
    </section>
  `;
}

async function loadTopStoriesForClub(code) {
  if (!code || !window.SideLineAPI?.fetchTopStories) return;

  topStoriesLoadingCode = code;
  renderClubStoryPhoneStep(0, code);

  try {
    const feed = await window.SideLineAPI.fetchTopStories(code, {
      teamColor: getClubPrimaryColor(code),
      teamAbbrev: getTopStoriesTeamAbbrev(code),
    });

    if (feed.items?.length) {
      topStoriesCache[code] = feed;
    }
  } catch (error) {
    console.warn("Top stories fetch failed:", error);
  } finally {
    if (topStoriesLoadingCode === code) {
      topStoriesLoadingCode = null;
    }
    renderClubStoryPhoneStep(0, code);
  }
}

function buildTopStoryImageMarkup(item, variant) {
  const placeholderLabel = escapeHtml(item.teamAbbrev || item.team || "—");
  const placeholderColor = escapeHtml(item.teamColor || "#374151");

  if (item.imageUrl) {
    const alt = variant === "featured" ? "featured-content-image" : "";
    return `<img src="${escapeHtml(item.imageUrl)}" alt="${alt}" loading="lazy" />`;
  }

  return `<div class="sl-app-top-story-image-placeholder" style="background-color: ${placeholderColor}">${placeholderLabel}</div>`;
}

function buildTopStoriesFeaturedMarkup(item) {
  const publication = item.publicationTag
    ? `<div class="sl-app-top-story-publication-tag" data-testid="featured-content-publication-tag">${escapeHtml(item.publicationTag)}</div>`
    : "";
  const excerpt = item.excerpt
    ? `<p class="sl-app-top-story-featured-excerpt">${escapeHtml(decodeHtmlEntities(item.excerpt))}</p>`
    : "";

  return `
    <article class="sl-app-top-story-featured" id="top-story-item-1" data-testid="top-story-item-1">
      <div class="sl-app-top-story-featured-image-wrap" data-testid="featured-content-image-wrapper">
        <div class="sl-app-top-story-featured-image" id="featured-content-image" data-testid="featured-content-image">
          ${buildTopStoryImageMarkup(item, "featured")}
        </div>
      </div>
      ${publication}
      <h3 class="sl-app-top-story-featured-title">${escapeHtml(decodeHtmlEntities(item.title))}</h3>
      ${excerpt}
    </article>
  `;
}

function buildTopStoriesRowMarkup(item, index, isFirstRow) {
  const publication = item.publicationTag
    ? `<div class="sl-app-top-story-publication-tag" data-testid="top-story-item-${index}-publication-tag">${escapeHtml(item.publicationTag)}</div>`
    : "";
  const rowClass = isFirstRow ? " sl-app-top-story-row--first" : "";

  return `
    <article class="sl-app-top-story-row${rowClass}" id="top-story-item-${index}" data-testid="top-story-item-${index}">
      <div class="sl-app-top-story-row-thumb" id="top-story-item-${index}-thumbnail" data-testid="top-story-item-${index}-thumbnail">
        ${buildTopStoryImageMarkup(item, "row")}
      </div>
      <div class="sl-app-top-story-row-content" id="top-story-item-${index}-content" data-testid="top-story-item-${index}-content">
        ${publication}
        <h4 class="sl-app-top-story-row-title">${escapeHtml(decodeHtmlEntities(item.title))}</h4>
      </div>
    </article>
  `;
}

function buildTopStoriesFeedMarkup(feed) {
  const featured = feed.items.find((item) => item.layout === "featured");
  const rows = feed.items.filter((item) => item.layout === "row");

  return `
    <section class="sl-app-top-stories" id="top-stories-section" data-testid="top-stories-section" aria-label="top-stories-section">
      ${
        featured
          ? `<div id="top-stories-featured-wrapper" data-testid="top-stories-featured-wrapper" aria-label="top-stories-featured-wrapper">
        ${buildTopStoriesFeaturedMarkup(featured)}
      </div>`
          : ""
      }
      ${
        rows.length
          ? `<div class="sl-app-top-stories-more" id="top-stories-more-container" data-testid="top-stories-more-container" aria-label="top-stories-more-container">
        ${rows.map((item, rowIndex) => buildTopStoriesRowMarkup(item, rowIndex + 2, rowIndex === 0)).join("")}
        <div class="sl-app-top-stories-see-more-row" data-testid="top-stories-see-more-row">
          <span class="sl-app-top-stories-see-more" data-testid="top-stories-see-more">${escapeHtml(feed.seeMoreLabel || "See more")}</span>
        </div>
      </div>`
          : ""
      }
    </section>
  `;
}

function buildClubStoryFeedBodyMarkup(stepIndex, clubCode) {
  if (stepIndex === 0) {
    if (topStoriesLoadingCode === clubCode) {
      return buildTopStoriesLoadingMarkup();
    }

    return buildTopStoriesFeedMarkup(getTopStoriesFeedForClub(clubCode));
  }

  if (stepIndex === 1) {
    return buildPodcastsFeedMarkup(getPodcastsFeedForClub(clubCode));
  }

  if (stepIndex === 2) {
    return buildVideosFeedMarkup(getVideosFeedForClub(clubCode));
  }

  const imgSrc = CLUB_STORY_FEED_IMAGES[stepIndex];
  const socialFeed = CLUB_STORY_FEED_MODES[stepIndex] === "for-me";

  return `<img class="sl-club-story-feed-img${socialFeed ? " sl-club-story-feed-img--social" : ""}" src="${imgSrc}" alt="" loading="lazy" />`;
}

function buildHomeChromeMarkup(feedMode) {
  const newsActive = feedMode === "trending";
  const { profile, logo, sidebar, filter, search } = CLUB_STORY_APP_ASSETS;

  return `
    <div class="sl-app-home-chrome" id="home-chrome" data-testid="home-chrome">
      <div class="sl-app-home-header" id="home-header" data-testid="home-header">
        <button type="button" class="sl-app-home-profile-button" id="home-header-profile-button" data-testid="home-header-profile-button" aria-label="Profile">
          <img class="sl-app-home-profile-avatar" id="home-header-profile-avatar" data-testid="home-header-profile-avatar" src="${profile}" alt="" width="36" height="36" />
        </button>
        <div class="sl-app-home-logo-wrap" id="home-header-logo-container" data-testid="home-header-logo-container">
          <img class="sl-app-home-logo" id="home-header-logo" data-testid="home-header-logo" src="${logo}" alt="SideLine" width="180" height="50" />
        </div>
        <button type="button" class="sl-app-home-action-button" id="home-header-action-button" data-testid="home-header-action-button" aria-label="Open club landing">
          <img class="sl-app-home-action-icon" src="${sidebar}" alt="" width="24" height="24" />
        </button>
      </div>
      <div class="sl-app-home-filter-row" id="home-filter-row" data-testid="home-filter-row">
        <button type="button" class="sl-app-home-filter-button" id="home-filter-row-filter-button" data-testid="home-filter-row-filter-button" aria-label="Feed filters" disabled aria-disabled="true">
          <img src="${filter}" alt="" width="20" height="20" />
        </button>
        <div class="sl-app-home-toggle-container" id="home-filter-row-toggle-container" data-testid="home-filter-row-toggle-container">
          <button type="button" class="sl-app-home-toggle-pill${newsActive ? " is-active" : ""}" id="home-filter-row-toggle-trending" data-testid="home-filter-row-toggle-trending">News</button>
          <button type="button" class="sl-app-home-toggle-pill${newsActive ? "" : " is-active"}" id="home-filter-row-toggle-for-me" data-testid="home-filter-row-toggle-for-me">Social</button>
        </div>
        <button type="button" class="sl-app-home-search-button" id="home-filter-row-search-button" data-testid="home-filter-row-search-button" aria-label="Search">
          <img src="${search}" alt="" width="20" height="20" />
        </button>
      </div>
    </div>
  `;
}

function buildClubStoryPhoneMarkup(stepIndex, clubCode = clubSelectorState.selectedCode) {
  const feedMode = CLUB_STORY_FEED_MODES[stepIndex];
  const clubPrimary = getClubPrimaryColor(clubCode);

  return `
    <div class="sl-app-scaler sl-club-story-app-scaler">
      <div class="sl-app-viewport sl-app-home-viewport" style="--club-primary: ${clubPrimary}">
        <div class="sl-app-home-screen">
          ${buildHomeChromeMarkup(feedMode)}
          <div class="sl-app-home-feed">
            ${buildClubStoryFeedBodyMarkup(stepIndex, clubCode)}
          </div>
        </div>
      </div>
    </div>
  `;
}

function syncClubStoryPhoneScaleForScreen(screen) {
  const scaler = screen.querySelector(".sl-club-story-app-scaler");
  const viewport = screen.querySelector(".sl-app-home-viewport");

  if (!scaler || !viewport) return;

  const availableWidth = screen.clientWidth;
  const availableHeight = screen.clientHeight;
  const scale = Math.min(
    availableWidth / CLUB_SELECTOR_APP.width,
    availableHeight / CLUB_SELECTOR_APP.height,
  );

  viewport.style.setProperty("--sl-app-scale", String(scale));
  scaler.style.height = `${CLUB_SELECTOR_APP.height * scale}px`;
}

function renderClubStoryPhoneStep(stepIndex, clubCode = clubSelectorState.selectedCode) {
  const screen = document.querySelector(`.sl-club-story-phone-screen[data-club-story-feed="${stepIndex}"]`);
  if (!screen) return;

  screen.innerHTML = buildClubStoryPhoneMarkup(stepIndex, clubCode);
  syncClubStoryPhoneScaleForScreen(screen);
}

function refreshTopStoriesPhoneFeed(clubCode = clubSelectorState.selectedCode) {
  void loadTopStoriesForClub(clubCode);
}

function refreshPodcastsPhoneFeed(clubCode = clubSelectorState.selectedCode) {
  renderClubStoryPhoneStep(1, clubCode);
}

function refreshVideosPhoneFeed(clubCode = clubSelectorState.selectedCode) {
  renderClubStoryPhoneStep(2, clubCode);
}

function renderClubStoryPhoneSteps() {
  document.querySelectorAll(".sl-club-story-phone-screen[data-club-story-feed]").forEach((screen) => {
    const stepIndex = Number(screen.dataset.clubStoryFeed);
    if (Number.isNaN(stepIndex)) return;
    renderClubStoryPhoneStep(stepIndex);
  });
}

function getClubPrimaryColor(code) {
  return CLUB_PRIMARY_COLORS[code] || "#212121";
}

function applyClubPrimaryColor(code) {
  const hex = getClubPrimaryColor(code);

  document.documentElement.style.setProperty("--club-primary", hex);
  document.querySelector(".sl-club-selector-panel")?.style.setProperty("--club-primary", hex);

  document.querySelectorAll(".sl-app-home-viewport").forEach((viewport) => {
    viewport.style.setProperty("--club-primary", hex);
  });
}

function bootClubStoryPhoneViewports() {
  document.querySelectorAll(".sl-club-story-phone-screen").forEach((screen) => {
    syncClubStoryPhoneScaleForScreen(screen);

    if (window.ResizeObserver) {
      const observer = new ResizeObserver(() => syncClubStoryPhoneScaleForScreen(screen));
      observer.observe(screen);
    }
  });
}

const CLUB_HEADLINE_NAMES = {
  ARS: "ARSENAL",
  AVL: "VILLA",
  BOU: "BOURNEMOUTH",
  BRE: "BRENTFORD",
  BHA: "BRIGHTON",
  CHE: "CHELSEA",
  COV: "COVENTRY",
  CRY: "PALACE",
  EVE: "EVERTON",
  FUL: "FULHAM",
  HUL: "HULL",
  IPS: "IPSWICH",
  LEE: "LEEDS",
  LFC: "LIVERPOOL",
  MCI: "MAN CITY",
  MUN: "MAN UTD",
  NEW: "NEWCASTLE",
  NFO: "FOREST",
  SUN: "SUNDERLAND",
  TOT: "SPURS",
};

const CLUB_STORY_HEADLINE_BUILDERS = [
  (name) => `UNRIVALED COVERAGE FROM TRUSTED ${name} SOURCES`,
  (name) => `GO DEEPER WITH LEADING VOICES TALKING ${name}`,
  (name) => `RELIVE EVERY ${name} MOMENT FROM EVERY ANGLE`,
  (name) => `EVERY REACTION. EVERY ${name} PERSPECTIVE.`,
];

const clubSelectorState = {
  selectedCode: null,
  storyUnlocked: false,
  transitioning: false,
  arrowShown: false,
};

const topStoriesCache = {};
let topStoriesLoadingCode = null;

let clubSelectorPinController = null;

function getClubHeadlineName(code) {
  if (CLUB_HEADLINE_NAMES[code]) return CLUB_HEADLINE_NAMES[code];

  const team = CLUB_SELECTOR_TEAMS.find((entry) => entry.code === code);
  return (team?.name || "YOUR CLUB").toUpperCase();
}

function updateClubStoryHeadlines(code) {
  const name = getClubHeadlineName(code);

  refreshTopStoriesPhoneFeed(code);
  refreshPodcastsPhoneFeed(code);
  refreshVideosPhoneFeed(code);
  applyClubPrimaryColor(code);

  CLUB_STORY_HEADLINE_BUILDERS.forEach((buildHeadline, index) => {
    const headline = document.querySelector(`#sl-club-story-headline-${index}`);
    if (headline) headline.textContent = buildHeadline(name);
  });
}

function showClubSelectorPickArrow() {
  if (
    clubSelectorState.arrowShown ||
    clubSelectorState.storyUnlocked ||
    clubSelectorState.selectedCode
  ) {
    return;
  }

  const arrow = document.querySelector("#sl-club-selector-pick-arrow");
  if (!arrow) return;

  clubSelectorState.arrowShown = true;
  arrow.classList.add("is-visible");
  arrow.setAttribute("aria-hidden", "false");

  const path = arrow.querySelector(".sl-club-selector-pick-arrow-path");
  const head = arrow.querySelector(".sl-club-selector-pick-arrow-head");

  if (!path) return;

  if (prefersReducedMotion) {
    path.style.strokeDashoffset = "0";
    if (head) head.style.opacity = "1";
    return;
  }

  const pathLength = path.getTotalLength();
  path.style.strokeDasharray = `${pathLength}`;
  path.style.strokeDashoffset = `${pathLength}`;

  if (head) {
    head.style.opacity = "0";
  }

  if (window.gsap) {
    gsap.to(path, {
      strokeDashoffset: 0,
      duration: 1.05,
      ease: "power2.out",
      delay: 0.12,
    });
    if (head) {
      gsap.to(head, { opacity: 1, duration: 0.25, delay: 0.95 });
    }
    return;
  }

  path.style.transition = "stroke-dashoffset 1s ease";
  window.requestAnimationFrame(() => {
    path.style.strokeDashoffset = "0";
    if (head) {
      window.setTimeout(() => {
        head.style.opacity = "1";
      }, 900);
    }
  });
}

function bootClubSelectorPickArrowHint() {
  const panel = document.querySelector("#sl-club-selector-panel");
  if (!panel) return;

  let viewportTimer = null;
  let panelInView = false;

  const observer = new IntersectionObserver(
    (entries) => {
      panelInView = entries.some((entry) => entry.isIntersecting && entry.intersectionRatio >= 0.35);

      if (!panelInView) {
        if (viewportTimer) {
          window.clearTimeout(viewportTimer);
          viewportTimer = null;
        }
        return;
      }

      if (
        viewportTimer ||
        clubSelectorState.arrowShown ||
        clubSelectorState.storyUnlocked ||
        clubSelectorState.selectedCode
      ) {
        return;
      }

      viewportTimer = window.setTimeout(() => {
        viewportTimer = null;
        if (
          panelInView &&
          !clubSelectorState.selectedCode &&
          !clubSelectorState.storyUnlocked &&
          !clubSelectorState.arrowShown
        ) {
          showClubSelectorPickArrow();
        }
      }, 2000);
    },
    { threshold: [0, 0.35, 0.6] },
  );

  observer.observe(panel);
}

function bootClubSelectorTeamPicker(onClubSelected) {
  const hotspots = document.querySelector("#sl-club-selector-pick-hotspots");

  if (!hotspots) return;

  hotspots.addEventListener("click", (event) => {
    const hotspot = event.target.closest(".sl-club-selector-pick-hotspot");

    if (!hotspot) return;

    hotspots.querySelectorAll(".sl-club-selector-pick-hotspot").forEach((button) => {
      const isSelected = button === hotspot;
      button.classList.toggle("is-selected", isSelected);
      button.setAttribute("aria-pressed", isSelected ? "true" : "false");
    });

    clubSelectorState.selectedCode = hotspot.dataset.club;
    updateClubStoryHeadlines(clubSelectorState.selectedCode);
    window.setTimeout(() => onClubSelected(), 450);
  });
}

function bootClubSelectorStory() {
  const wrap = document.querySelector("#sl-club-selector");
  const pinShell = document.querySelector("#sl-club-selector-pin-shell");
  const panel = document.querySelector("#sl-club-selector-panel");
  const pickPhase = document.querySelector("#sl-club-selector-phase-pick");
  const storyPhase = document.querySelector("#sl-club-selector-phase-story");
  const arrow = document.querySelector("#sl-club-selector-pick-arrow");

  if (!wrap || !pinShell || !panel || !pickPhase || !storyPhase) return;

  const textSteps = [...document.querySelectorAll(".sl-club-story-text-step")];
  const phoneSteps = [...document.querySelectorAll(".sl-club-story-phone-step")];

  const PICK_HOLD = 0.5;
  const STEP_HOLD = 0.5;
  const STORY_TRANSITION = 0.375;
  const PICK_SCROLL_VIEWPORTS = 0.5;
  const STORY_SCROLL_VIEWPORTS = 2;
  const TOTAL_SCROLL_VIEWPORTS = PICK_SCROLL_VIEWPORTS + STORY_SCROLL_VIEWPORTS;
  const PICK_PROGRESS_CAP = PICK_SCROLL_VIEWPORTS / TOTAL_SCROLL_VIEWPORTS;

  let clubScrollTrigger = null;
  let clubTimeline = null;
  let isClampingScroll = false;

  function setStoryStep(index) {
    textSteps.forEach((step, stepIndex) => {
      const isActive = stepIndex === index;
      step.classList.toggle("is-active", isActive);
      step.setAttribute("aria-hidden", isActive ? "false" : "true");
    });
    phoneSteps.forEach((step, stepIndex) => {
      const isActive = stepIndex === index;
      step.classList.toggle("is-active", isActive);
      step.setAttribute("aria-hidden", isActive ? "false" : "true");
    });
  }

  function destroyClubScroll() {
    clubScrollTrigger?.kill();
    clubScrollTrigger = null;
    clubTimeline?.kill();
    clubTimeline = null;
  }

  function hidePickPhase() {
    pickPhase.classList.remove("is-active");
    pickPhase.hidden = true;
    pickPhase.setAttribute("aria-hidden", "true");
    arrow?.classList.remove("is-visible");

    if (window.gsap) {
      gsap.set([pickPhase, arrow], { clearProps: "opacity,visibility" });
    }
  }

  function showStoryPhase() {
    storyPhase.hidden = false;
    storyPhase.setAttribute("aria-hidden", "false");
    panel.classList.add("is-story-active");
    hidePickPhase();

    if (window.gsap) {
      gsap.set(storyPhase, { opacity: 1, visibility: "visible" });
      gsap.set(textSteps, { opacity: 0 });
      gsap.set(phoneSteps, { opacity: 0 });
      gsap.set(textSteps[0], { opacity: 1 });
      gsap.set(phoneSteps[0], { opacity: 1 });
    }

    setStoryStep(0);
  }

  function clampToPickPhase(self) {
    if (clubSelectorState.storyUnlocked || isClampingScroll) return;

    const scrollAttemptThreshold = PICK_PROGRESS_CAP * 0.75;
    if (!clubSelectorState.selectedCode && self.progress > scrollAttemptThreshold) {
      showClubSelectorPickArrow();
    }

    if (self.progress <= PICK_PROGRESS_CAP) return;

    if (!clubSelectorState.selectedCode) {
      showClubSelectorPickArrow();
    }

    isClampingScroll = true;
    self.scroll(self.start + (self.end - self.start) * PICK_PROGRESS_CAP);
    window.requestAnimationFrame(() => {
      isClampingScroll = false;
    });
  }

  function buildClubScroll() {
    if (!window.gsap || !window.ScrollTrigger || prefersReducedMotion) return;

    destroyClubScroll();

    gsap.set(storyPhase, { opacity: 0, visibility: "hidden" });
    gsap.set(pickPhase, { opacity: 1, visibility: "visible" });
    gsap.set(textSteps, { opacity: 0 });
    gsap.set(phoneSteps, { opacity: 0 });
    panel.classList.remove("is-story-active");
    pickPhase.hidden = false;
    pickPhase.setAttribute("aria-hidden", "false");

    clubTimeline = gsap.timeline({
      defaults: { ease: "power1.inOut" },
      scrollTrigger: {
        id: "club-selector-scroll",
        trigger: wrap,
        start: "top top",
        end: () => `+=${window.innerHeight * TOTAL_SCROLL_VIEWPORTS}`,
        pin: pinShell,
        pinSpacing: true,
        scrub: 0.65,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate(self) {
          clampToPickPhase(self);

          if (!clubSelectorState.storyUnlocked) return;

          const storyProgress = Math.max(0, (self.progress - PICK_PROGRESS_CAP) / (1 - PICK_PROGRESS_CAP));
          const stepIndex = Math.min(
            textSteps.length - 1,
            Math.max(0, Math.floor(storyProgress * textSteps.length)),
          );
          setStoryStep(stepIndex);
        },
        onLeaveBack() {
          if (clubSelectorState.storyUnlocked) {
            hidePickPhase();
            panel.classList.add("is-story-active");
          }
        },
      },
    });

    clubScrollTrigger = clubTimeline.scrollTrigger;

    clubTimeline.to({}, { duration: PICK_HOLD });

    clubTimeline.to({}, { duration: STEP_HOLD });

    for (let index = 1; index < textSteps.length; index += 1) {
      clubTimeline
        .to(textSteps[index - 1], { opacity: 0, duration: STORY_TRANSITION })
        .to(phoneSteps[index - 1], { opacity: 0, duration: STORY_TRANSITION }, "<")
        .to(textSteps[index], { opacity: 1, duration: STORY_TRANSITION }, "<")
        .to(phoneSteps[index], { opacity: 1, duration: STORY_TRANSITION }, "<")
        .to({}, { duration: STEP_HOLD });
    }
  }

  function finishStoryTransition() {
    clubSelectorState.storyUnlocked = true;
    clubSelectorState.transitioning = false;
    showStoryPhase();
  }

  function transitionToStory() {
    if (clubSelectorState.storyUnlocked || clubSelectorState.transitioning) return;
    if (!clubSelectorState.selectedCode) return;

    clubSelectorState.transitioning = true;

    if (prefersReducedMotion || !window.gsap) {
      finishStoryTransition();
      return;
    }

    gsap
      .timeline({
        onComplete: finishStoryTransition,
      })
      .to([pickPhase, arrow], { opacity: 0, duration: 0.5, ease: "power1.inOut" })
      .fromTo(
        storyPhase,
        { opacity: 0, visibility: "hidden" },
        { opacity: 1, visibility: "visible", duration: 1, ease: "power2.out" },
        "<",
      );
  }

  bootClubSelectorPickArrowHint();
  bootClubSelectorTeamPicker(transitionToStory);

  clubSelectorPinController = {
    buildClubScroll,
    refreshOnResize() {
      const wasUnlocked = clubSelectorState.storyUnlocked;
      buildClubScroll();
      if (wasUnlocked) {
        clubSelectorState.storyUnlocked = true;
        showStoryPhase();
      }
      ScrollTrigger.refresh(true);
    },
  };
}

function bootClubSelectorStoryPin() {
  if (prefersReducedMotion || !window.gsap || !window.ScrollTrigger) return;

  clubSelectorPinController?.buildClubScroll();

  window.addEventListener("resize", () => {
    clubSelectorPinController?.refreshOnResize();
  });
}

bootCtaLogoGrid();
bootHeroVideo();
bootHeroPhoneStatusBar();
renderClubSelectorPickHotspots();
renderClubStoryPhoneSteps();
bootClubStoryPhoneViewports();
bootClubSelectorStory();
bootAnimations();
bootFeaturePhoneEntrances();

window.addEventListener("load", () => {
  if (prefersReducedMotion || !window.ScrollTrigger) return;
  ScrollTrigger.refresh();
});
