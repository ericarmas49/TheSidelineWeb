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

function bootAnimations() {
  if (prefersReducedMotion || !window.gsap || !window.ScrollTrigger) {
    document.documentElement.classList.add("no-motion");
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  gsap.set("[data-section]", { opacity: 1 });

  gsap.from(".sl-header-inner", {
    y: -24,
    opacity: 0,
    duration: 0.8,
    ease: "power2.out",
  });

  gsap
    .timeline({ defaults: { ease: "power3.out" } })
    .from(".hero h1", { y: 34, opacity: 0, duration: 0.95 })
    .from(".hero-copy > h2.sl-hero-subheading", { y: 26, opacity: 0, duration: 0.8 }, "-=0.45")
    .from("#sl-hero-app-store", { y: 22, opacity: 0, duration: 0.75 }, "-=0.35")
    .from(".sl-hero-qr", { scale: 0.82, opacity: 0, duration: 0.65 }, "-=0.55")
    .from(".sl-hero-phone-inner", { y: 20, opacity: 0, duration: 0.85 }, "-=0.8");

  gsap.utils
    .toArray(
      ".section-heading, .sl-benefits-title, .sl-benefit-card, .sl-cta-home-inner, .sl-footer",
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
  bootFeaturesIntroPin();
  rebuildMobileScrollPins();
}

const FEATURES_INTRO_SCROLL_STEPS = [
  { id: "credibility", enterFrom: null },
  { id: "personalization", enterFrom: "right" },
  { id: "filters", enterFrom: "left" },
];

const FEATURES_INTRO_SEGMENT_WEIGHTS = {
  introHold: 0.2,
  introExit: 0.55,
  stepFade: 0.55,
  stepHold: 0.25,
  stepExit: 0.55,
};

const FEATURES_INTRO_PHONE_ENTER_OFFSET = 120;
const FEATURES_INTRO_PHONE_ENTER_ROTATION = 14;

function buildFeaturesIntroPinSegments() {
  const segments = [
    { key: "introHold", viewports: FEATURES_INTRO_SEGMENT_WEIGHTS.introHold },
    { key: "introExit", viewports: FEATURES_INTRO_SEGMENT_WEIGHTS.introExit },
  ];

  FEATURES_INTRO_SCROLL_STEPS.forEach((step, index) => {
    segments.push({ key: `${step.id}Fade`, viewports: FEATURES_INTRO_SEGMENT_WEIGHTS.stepFade, stepId: step.id });
    segments.push({ key: `${step.id}Hold`, viewports: FEATURES_INTRO_SEGMENT_WEIGHTS.stepHold, stepId: step.id });
    if (index < FEATURES_INTRO_SCROLL_STEPS.length - 1) {
      segments.push({ key: `${step.id}Exit`, viewports: FEATURES_INTRO_SEGMENT_WEIGHTS.stepExit, stepId: step.id });
    }
  });

  return segments;
}

const FEATURES_INTRO_PIN_SEGMENTS = buildFeaturesIntroPinSegments();

function getFeaturesIntroPinSegment(progress) {
  const totalViewports = FEATURES_INTRO_PIN_SEGMENTS.reduce((sum, segment) => sum + segment.viewports, 0);
  let accumulated = 0;

  for (const segment of FEATURES_INTRO_PIN_SEGMENTS) {
    const segmentStart = accumulated / totalViewports;
    accumulated += segment.viewports;
    const segmentEnd = accumulated / totalViewports;

    if (progress <= segmentEnd) {
      const span = segmentEnd - segmentStart || 1;
      const local = (progress - segmentStart) / span;
      return { ...segment, local: Math.max(0, Math.min(1, local)) };
    }
  }

  const lastSegment = FEATURES_INTRO_PIN_SEGMENTS[FEATURES_INTRO_PIN_SEGMENTS.length - 1];
  return { ...lastSegment, local: 1 };
}

function getFeaturesIntroPinTotalViewports() {
  return FEATURES_INTRO_PIN_SEGMENTS.reduce((sum, segment) => sum + segment.viewports, 0);
}

function getFeaturesIntroPhoneEnterOffset(direction) {
  if (direction === "right") {
    return { x: FEATURES_INTRO_PHONE_ENTER_OFFSET, rotation: FEATURES_INTRO_PHONE_ENTER_ROTATION };
  }
  if (direction === "left") {
    return { x: -FEATURES_INTRO_PHONE_ENTER_OFFSET, rotation: -FEATURES_INTRO_PHONE_ENTER_ROTATION };
  }
  return { x: 0, rotation: 0 };
}

let featuresIntroPinController = null;

function bootFeaturesIntroPin() {
  if (prefersReducedMotion || !window.gsap || !window.ScrollTrigger) return;

  const wrap = document.querySelector("#sl-features-intro");
  const pinShell = document.querySelector("#sl-features-intro-pin-shell");
  const intro = document.querySelector("#sl-features-intro-copy");
  const mobileQuery = window.matchMedia("(max-width: 980px)");

  const stepTexts = Object.fromEntries(
    FEATURES_INTRO_SCROLL_STEPS.map((step) => [
      step.id,
      wrap?.querySelector(`.sl-features-step-text[data-feature-step="${step.id}"]`) ?? null,
    ]),
  );

  const stepPhones = Object.fromEntries(
    FEATURES_INTRO_SCROLL_STEPS.map((step) => [
      step.id,
      wrap?.querySelector(`.sl-features-step-phone[data-feature-step="${step.id}"] .sl-features-intro-phone`) ?? null,
    ]),
  );

  function setStepTextState(
    textEl,
    { alpha = 0, yPercent = 0, visible = false, hidden = true } = {},
  ) {
    if (!textEl) return;

    gsap.set(textEl, { autoAlpha: alpha, yPercent, y: 0 });
    textEl.classList.toggle("is-features-intro-text-visible", visible);
    textEl.setAttribute("aria-hidden", hidden ? "true" : "false");
  }

  function setStepPhoneState(phoneEl, { alpha = 0, x = 0, rotation = 0 } = {}) {
    if (!phoneEl) return;

    gsap.set(phoneEl, { autoAlpha: alpha, x, rotation });
  }

  function hideAllStepTexts() {
    FEATURES_INTRO_SCROLL_STEPS.forEach((step) => {
      setStepTextState(stepTexts[step.id], { alpha: 0, yPercent: 0, visible: false, hidden: true });
    });
  }

  function resetStepPhonesForMobile() {
    FEATURES_INTRO_SCROLL_STEPS.forEach((step, index) => {
      const phone = stepPhones[step.id];
      if (index === 0) {
        setStepPhoneState(phone, { alpha: 1, x: 0, rotation: 0 });
        return;
      }

      const enter = getFeaturesIntroPhoneEnterOffset(step.enterFrom);
      setStepPhoneState(phone, { alpha: 0, x: enter.x, rotation: enter.rotation });
    });
  }

  function setIntroLayoutHidden(hidden) {
    if (!intro) return;

    intro.style.position = hidden ? "absolute" : "";
    intro.style.inset = hidden ? "0 0 auto 0" : "";
    intro.style.width = hidden ? "100%" : "";
  }

  function resetLayers() {
    if (!intro) return;

    setIntroLayoutHidden(false);
    wrap?.classList.remove("is-features-intro-steps-active");
    gsap.set(intro, { autoAlpha: 1, yPercent: 0, y: 0, clearProps: "transform" });
    intro.removeAttribute("aria-hidden");
    hideAllStepTexts();
    resetStepPhonesForMobile();
  }

  function destroyFeaturesIntroScroll() {
    featuresIntroPinController?.timeline?.scrollTrigger?.kill();
    featuresIntroPinController?.timeline?.kill();
    featuresIntroPinController = null;
    wrap?.classList.remove("is-features-intro-pin-active");
    wrap?.classList.remove("is-features-intro-steps-active");
  }

  function getStepIndex(stepId) {
    return FEATURES_INTRO_SCROLL_STEPS.findIndex((step) => step.id === stepId);
  }

  function applyPhoneTransition(currentStep, nextStep, progress) {
    if (!currentStep) return;

    const currentPhone = stepPhones[currentStep.id];
    const nextPhone = nextStep ? stepPhones[nextStep.id] : null;
    const nextEnter = nextStep ? getFeaturesIntroPhoneEnterOffset(nextStep.enterFrom) : { x: 0, rotation: 0 };
    const currentExit = getFeaturesIntroPhoneEnterOffset(
      currentStep.enterFrom === "right" ? "left" : currentStep.enterFrom === "left" ? "right" : "left",
    );

    if (currentPhone) {
      setStepPhoneState(currentPhone, {
        alpha: nextPhone ? 1 - progress : 1,
        x: (currentExit.x / 3) * progress,
        rotation: (currentExit.rotation / 2) * progress,
      });
    }

    if (nextPhone) {
      setStepPhoneState(nextPhone, {
        alpha: progress,
        x: nextEnter.x * (1 - progress),
        rotation: nextEnter.rotation * (1 - progress),
      });
    }
  }

  function syncFeaturesIntroLayers(progress) {
    if (!intro || !mobileQuery.matches) return;

    const { key, local, stepId } = getFeaturesIntroPinSegment(progress);
    const isIntroPhase = key === "introHold" || key === "introExit";
    wrap?.classList.toggle("is-features-intro-steps-active", !isIntroPhase);

    if (key === "introHold") {
      gsap.set(intro, { yPercent: 0, autoAlpha: 1 });
      intro.removeAttribute("aria-hidden");
      hideAllStepTexts();
      resetStepPhonesForMobile();
      return;
    }

    if (key === "introExit") {
      setIntroLayoutHidden(true);
      gsap.set(intro, { yPercent: -100 * local, autoAlpha: 1 - local });
      intro.setAttribute("aria-hidden", local > 0.5 ? "true" : "false");
      hideAllStepTexts();
      resetStepPhonesForMobile();
      return;
    }

    gsap.set(intro, { yPercent: -100, autoAlpha: 0 });
    intro.setAttribute("aria-hidden", "true");
    setIntroLayoutHidden(true);

    if (key.endsWith("Fade")) {
      hideAllStepTexts();
      setStepTextState(stepTexts[stepId], {
        alpha: local,
        yPercent: 0,
        visible: local > 0,
        hidden: local <= 0,
      });

      const stepIndex = getStepIndex(stepId);
      const previousStep = stepIndex > 0 ? FEATURES_INTRO_SCROLL_STEPS[stepIndex - 1] : null;
      const currentStep = FEATURES_INTRO_SCROLL_STEPS[stepIndex];

      if (previousStep) {
        FEATURES_INTRO_SCROLL_STEPS.forEach((step) => {
          if (step.id === currentStep.id) {
            setStepPhoneState(stepPhones[step.id], { alpha: 1, x: 0, rotation: 0 });
            return;
          }
          const enter = getFeaturesIntroPhoneEnterOffset(step.enterFrom);
          setStepPhoneState(stepPhones[step.id], { alpha: 0, x: enter.x, rotation: enter.rotation });
        });
      } else if (currentStep) {
        setStepPhoneState(stepPhones[currentStep.id], { alpha: 1, x: 0, rotation: 0 });
        FEATURES_INTRO_SCROLL_STEPS.forEach((step, index) => {
          if (index === stepIndex) return;
          const enter = getFeaturesIntroPhoneEnterOffset(step.enterFrom);
          setStepPhoneState(stepPhones[step.id], { alpha: 0, x: enter.x, rotation: enter.rotation });
        });
      }
      return;
    }

    if (key.endsWith("Hold")) {
      hideAllStepTexts();
      setStepTextState(stepTexts[stepId], { alpha: 1, yPercent: 0, visible: true, hidden: false });

      FEATURES_INTRO_SCROLL_STEPS.forEach((step) => {
        if (step.id === stepId) {
          setStepPhoneState(stepPhones[step.id], { alpha: 1, x: 0, rotation: 0 });
          return;
        }
        const enter = getFeaturesIntroPhoneEnterOffset(step.enterFrom);
        setStepPhoneState(stepPhones[step.id], { alpha: 0, x: enter.x, rotation: enter.rotation });
      });
      return;
    }

    if (key.endsWith("Exit")) {
      hideAllStepTexts();
      setStepTextState(stepTexts[stepId], {
        alpha: 1 - local,
        yPercent: -100 * local,
        visible: local < 1,
        hidden: local >= 0.5,
      });

      const stepIndex = getStepIndex(stepId);
      const currentStep = FEATURES_INTRO_SCROLL_STEPS[stepIndex];
      const nextStep = FEATURES_INTRO_SCROLL_STEPS[stepIndex + 1] ?? null;

      if (nextStep) {
        const phoneProgress = Math.min(1, local * 1.25);
        applyPhoneTransition(currentStep, nextStep, phoneProgress);
        return;
      }

      FEATURES_INTRO_SCROLL_STEPS.forEach((step) => {
        if (step.id === stepId) {
          setStepPhoneState(stepPhones[step.id], { alpha: 1, x: 0, rotation: 0 });
          return;
        }
        const enter = getFeaturesIntroPhoneEnterOffset(step.enterFrom);
        setStepPhoneState(stepPhones[step.id], { alpha: 0, x: enter.x, rotation: enter.rotation });
      });
    }
  }

  function buildFeaturesIntroScroll() {
    destroyFeaturesIntroScroll();
    resetLayers();

    if (!mobileQuery.matches || !wrap || !pinShell || !intro) {
      return;
    }

    syncFeaturesIntroLayers(0);

    const animationViewports = getFeaturesIntroPinTotalViewports();

    const timeline = gsap.timeline({
    scrollTrigger: {
        id: "features-intro-scroll",
        trigger: wrap,
      start: "top top",
        end: () => `+=${window.innerHeight * animationViewports}`,
        pin: pinShell,
        pinSpacing: true,
      scrub: true,
        anticipatePin: 0,
        invalidateOnRefresh: true,
        onToggle(self) {
          wrap.classList.toggle("is-features-intro-pin-active", self.isActive);

          if (!self.isActive && self.direction < 0) {
            resetLayers();
            return;
          }

          if (self.isActive) {
            syncFeaturesIntroLayers(self.progress);
          }
        },
        onUpdate(self) {
          syncFeaturesIntroLayers(self.progress);
        },
    },
  });

    timeline.to({}, { duration: 1 });

    featuresIntroPinController = { timeline, rebuild: buildFeaturesIntroScroll };
  }

  featuresIntroPinController = { rebuild: buildFeaturesIntroScroll };
}

function rebuildMobileScrollPins() {
  if (prefersReducedMotion || !window.gsap || !window.ScrollTrigger) return;

  clubSelectorPinController?.buildClubScroll?.();
  featuresIntroPinController?.rebuild?.();
  ScrollTrigger.refresh(true);
}

function bootHeroVideo() {
  const video = document.querySelector("#sl-hero-video");

  if (!video || prefersReducedMotion) return;

  video.defaultMuted = true;
  video.muted = true;
  video.playsInline = true;

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
  function updateTime() {
    const label = new Date().toLocaleTimeString(undefined, {
      hour: "numeric",
      minute: "2-digit",
    });

    document.querySelectorAll(".sl-phone-status-time").forEach((timeEl) => {
      timeEl.textContent = label;
    });
  }

  updateTime();
  window.setInterval(updateTime, 30000);
}

function buildPhoneStatusBarMarkup() {
  return `
    <div class="sl-phone-status-bar" aria-hidden="true">
      <time class="sl-phone-status-time">9:41</time>
      <div class="sl-phone-status-icons">
        <svg class="sl-phone-status-icon sl-phone-status-signal" viewBox="0 0 18 12" focusable="false">
          <rect x="0" y="8" width="3" height="4" rx="0.5" fill="currentColor" />
          <rect x="5" y="5.5" width="3" height="6.5" rx="0.5" fill="currentColor" />
          <rect x="10" y="3" width="3" height="9" rx="0.5" fill="currentColor" />
          <rect x="15" y="0.5" width="3" height="11.5" rx="0.5" fill="currentColor" opacity="0.35" />
        </svg>
        <svg class="sl-phone-status-icon sl-phone-status-wifi" viewBox="0 0 16 12" focusable="false">
          <path fill="currentColor" d="M8 11.2a1.1 1.1 0 1 0 0-2.2 1.1 1.1 0 0 0 0 2.2Zm-3.1-2.3a4.6 4.6 0 0 1 6.2 0l.9-.9a5.9 5.9 0 0 0-8 0l.9.9Zm-2.5-2.4a8.2 8.2 0 0 1 11 0l.9-.9a9.5 9.5 0 0 0-12.8 0l.9.9Z" />
        </svg>
        <svg class="sl-phone-status-icon sl-phone-status-battery" viewBox="0 0 27 13" focusable="false">
          <rect x="0.75" y="0.75" width="21.5" height="11.5" rx="3" fill="none" stroke="currentColor" stroke-width="1.5" opacity="0.55" />
          <rect x="2.5" y="2.5" width="16.5" height="8" rx="1.5" fill="currentColor" />
          <rect x="23.5" y="4.25" width="2.25" height="4.5" rx="1" fill="currentColor" opacity="0.55" />
        </svg>
      </div>
    </div>
  `;
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

function renderClubSelectorTeams() {
  const grid = document.querySelector("#teams-grid");

  if (!grid) return;

  grid.innerHTML = CLUB_SELECTOR_TEAMS.map(
    (team) => `
      <button
        type="button"
        class="sl-app-team-card"
        id="team-card-${team.code.toLowerCase()}"
        data-club="${team.code}"
        aria-pressed="false"
        aria-label="${team.name}"
      >
        <span class="sl-app-team-logo-wrap">
          <img class="sl-app-team-logo" src="${team.logo}" alt="" width="50" height="50" loading="lazy" />
        </span>
        <span class="sl-app-team-name">${team.name}</span>
        <span class="sl-app-team-selected-indicator" aria-hidden="true">
          <img src="logos/Favorite-Icon-Filled.png" alt="" width="24" height="24" />
        </span>
      </button>
    `,
  ).join("");
}

function computeClubAppScale(availableWidth, availableHeight) {
  if (availableWidth <= 0 || availableHeight <= 0) return 1;

  return Math.min(
    availableWidth / CLUB_SELECTOR_APP.width,
    availableHeight / CLUB_SELECTOR_APP.height,
  );
}

function getScalerAvailableSize(scaler) {
  if (!scaler) return { width: 0, height: 0 };

  const width = scaler.clientWidth;
  const height = scaler.clientHeight;
  if (width > 0 && height > 0) {
    return { width, height };
  }

  const parent = scaler.parentElement;
  if (!parent) return { width: 0, height: 0 };

  const statusBar = parent.querySelector(":scope > .sl-phone-status-bar");
  const statusBarHeight = statusBar?.getBoundingClientRect().height ?? 0;

  return {
    width: parent.clientWidth,
    height: Math.max(0, parent.clientHeight - statusBarHeight),
  };
}

function applyClubAppScale(scaler, viewport, availableWidth, availableHeight) {
  if (!scaler || !viewport) return;

  const scale = computeClubAppScale(availableWidth, availableHeight);
  viewport.style.setProperty("--sl-app-scale", String(scale));
  scaler.style.height = `${CLUB_SELECTOR_APP.height * scale}px`;
}

function syncClubSelectorAppViewport() {
  const scaler = document.querySelector("#sl-club-selector-app-scaler");
  const viewport = document.querySelector("#sl-club-selector-app-viewport");

  if (!scaler || !viewport) return;

  const { width, height } = getScalerAvailableSize(scaler);
  applyClubAppScale(scaler, viewport, width, height);
}

function syncClubStoryPhoneScaleForScreen(screen) {
  const scaler = screen.querySelector(".sl-club-story-app-scaler");
  const viewport = screen.querySelector(".sl-app-home-viewport");

  if (!scaler || !viewport) return;

  const { width, height } = getScalerAvailableSize(scaler);
  applyClubAppScale(scaler, viewport, width, height);
}

function syncClubSelectorPhoneScales() {
  syncClubSelectorAppViewport();

  const storyScreen = document.querySelector(".sl-club-selector-story-phone-screen[data-club-story-feed]");
  if (storyScreen) {
    syncClubStoryPhoneScaleForScreen(storyScreen);
  }
}

function bootClubSelectorAppViewport() {
  const sync = () => syncClubSelectorAppViewport();
  sync();

  const sharedPhone = document.querySelector("#sl-club-selector-shared-phone");
  const screen = document.querySelector(".sl-club-selector-pick-screen");
  const scaler = document.querySelector("#sl-club-selector-app-scaler");

  if (window.ResizeObserver) {
    const observer = new ResizeObserver(sync);
    if (sharedPhone) observer.observe(sharedPhone);
    if (screen) observer.observe(screen);
    if (scaler) observer.observe(scaler);
    return;
  }

  window.addEventListener("resize", sync);
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

const CLUB_STORY_FEED_SECTION_COUNT = 3;
const CLUB_STORY_SOCIAL_STEP_INDEX = 3;
const CLUB_STORY_STEP_COUNT = 4;

function getStorySocialProgressThreshold(stepCount = CLUB_STORY_STEP_COUNT) {
  return (stepCount - 1) / stepCount;
}

function getStoryStepProgressSpan(stepCount = CLUB_STORY_STEP_COUNT) {
  return 1 / stepCount;
}

function getStoryProgressAnchorForStep(stepIndex) {
  if (stepIndex >= CLUB_STORY_SOCIAL_STEP_INDEX) {
    return getStorySocialProgressThreshold();
  }

  return stepIndex / CLUB_STORY_STEP_COUNT;
}

function getStoryStepFromStoryProgress(storyProgress) {
  const socialThreshold = getStorySocialProgressThreshold();

  if (storyProgress >= socialThreshold - 0.001) {
    return CLUB_STORY_SOCIAL_STEP_INDEX;
  }

  const stepSpan = getStoryStepProgressSpan();
  return Math.min(CLUB_STORY_FEED_SECTION_COUNT - 1, Math.floor(storyProgress / stepSpan));
}

function getFeedScrollTopForStoryProgress(feed, storyProgress) {
  const socialThreshold = getStorySocialProgressThreshold();
  const clampedProgress = Math.min(socialThreshold, Math.max(0, storyProgress));
  const sections = [...feed.querySelectorAll("[data-club-story-section]")];
  const maxScroll = Math.max(0, feed.scrollHeight - feed.clientHeight);

  if (!sections.length || maxScroll <= 0) return 0;
  if (clampedProgress <= 0) return 0;
  if (clampedProgress >= socialThreshold) return maxScroll;

  const stepSpan = getStoryStepProgressSpan();
  const stepFloat = clampedProgress / stepSpan;
  const stepIndex = Math.min(CLUB_STORY_FEED_SECTION_COUNT - 1, Math.floor(stepFloat));
  const stepLocalProgress = Math.min(1, Math.max(0, stepFloat - stepIndex));
  const sectionStart = getSectionTopInFeed(sections[stepIndex], feed);
  const sectionEnd =
    stepIndex < sections.length - 1 ? getSectionTopInFeed(sections[stepIndex + 1], feed) : maxScroll;

  return sectionStart + stepLocalProgress * (sectionEnd - sectionStart);
}

function getCurrentStoryProgressFromPage() {
  const trigger = clubStoryPhoneScroll.getScrollTrigger?.();
  const pickProgressCap = clubStoryPhoneScroll.getPickProgressCap?.();
  if (!trigger || typeof pickProgressCap !== "number") return 0;

  return Math.min(1, Math.max(0, (trigger.progress - pickProgressCap) / (1 - pickProgressCap)));
}

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
  sectionTitle: "Recent Podcasts",
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
    sectionTitle: "Recent Podcasts",
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
    sectionTitle: "Recent Podcasts",
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

const EMPTY_VIDEOS_FEED = {
  videos: [],
  seeMoreLabel: "See more",
};

function getVideosFeedForClub(code) {
  if (code && videosCache[code]) {
    return videosCache[code];
  }

  return EMPTY_VIDEOS_FEED;
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

const EMPTY_SOCIAL_FEED = {
  tweets: [],
};

function getSocialFeedForClub(code) {
  if (code && socialFeedCache[code]) {
    return socialFeedCache[code];
  }

  return EMPTY_SOCIAL_FEED;
}

function buildSocialFeedLoadingMarkup() {
  return `
    <div class="sl-club-story-feed-img sl-club-story-feed-img--social sl-club-story-feed-img--loading" data-testid="club-story-social-feed-loading">
      <div class="sl-app-top-stories-loading" aria-live="polite">
        <span class="sl-app-top-stories-loading-spinner" aria-hidden="true"></span>
        <span class="sl-app-top-stories-loading-text">Loading social posts…</span>
      </div>
    </div>
  `;
}

function buildTweetArticleMarkup(tweet) {
  if (tweet.embedHtml) {
    return `
      <article class="sl-club-story-tweet sl-club-story-tweet--embed" data-tweet-id="${escapeHtml(tweet.id)}">
        <div class="sl-club-story-tweet-embed">${tweet.embedHtml}</div>
      </article>
    `;
  }

  return `
    <article class="sl-club-story-tweet" data-tweet-id="${escapeHtml(tweet.id)}">
      <div class="sl-club-story-tweet-body">${tweet.html}</div>
    </article>
  `;
}

function buildSocialFeedMarkup(feed) {
  const tweets = feed.tweets.map((tweet) => buildTweetArticleMarkup(tweet)).join("");

  return `
    <div class="sl-club-story-feed-img sl-club-story-feed-img--social" data-testid="club-story-social-feed">
      ${tweets}
    </div>
  `;
}

let twitterWidgetsLoader = null;

function loadTwitterWidgetsScript() {
  if (window.twttr?.widgets) {
    return Promise.resolve(window.twttr);
  }

  if (twitterWidgetsLoader) {
    return twitterWidgetsLoader;
  }

  twitterWidgetsLoader = new Promise((resolve, reject) => {
    const existing = document.querySelector('script[src*="platform.twitter.com/widgets.js"]');
    if (existing) {
      if (window.twttr?.widgets) {
        resolve(window.twttr);
        return;
      }

      existing.addEventListener("load", () => resolve(window.twttr));
      existing.addEventListener("error", reject);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://platform.twitter.com/widgets.js";
    script.async = true;
    script.charset = "utf-8";
    script.onload = () => resolve(window.twttr);
    script.onerror = reject;
    document.head.appendChild(script);
  });

  return twitterWidgetsLoader;
}

async function hydrateClubStoryTwitterEmbeds(root) {
  const container =
    root ||
    getClubStorySocialStage()?.querySelector("[data-testid='club-story-social-feed']") ||
    getClubStorySocialStage();

  if (!container) return;

  const blockquotes = container.querySelectorAll("blockquote.twitter-tweet");
  if (!blockquotes.length) return;

  try {
    const twttr = await loadTwitterWidgetsScript();
    await twttr.widgets.load(container);

    if (clubStoryPhoneScroll.socialActive) {
      const syncAfterEmbeds = () => {
        if (clubStoryPhoneScroll.socialTransitionRunning) return;
        syncSocialStageScrollFromStoryProgress(getCurrentStoryProgressFromPage());
      };

      window.requestAnimationFrame(syncAfterEmbeds);
      window.setTimeout(syncAfterEmbeds, 400);
      window.setTimeout(syncAfterEmbeds, 1200);
    }
  } catch (error) {
    console.warn("Twitter embed hydration failed:", error);
  }
}

function buildVideosLoadingMarkup() {
  return `
    <section class="sl-app-videos-feed sl-app-videos-feed--loading" id="content-section-film-room" data-testid="film-room-content" aria-label="film-room-content">
      <h2 class="sl-app-videos-section-title" id="film-room-title" data-testid="film-room-title">Latest Videos</h2>
      <div class="sl-app-top-stories-loading" data-testid="film-room-loading" aria-live="polite">
        <span class="sl-app-top-stories-loading-spinner" aria-hidden="true"></span>
        <span class="sl-app-top-stories-loading-text">Loading videos…</span>
      </div>
    </section>
  `;
}

function buildVideosFeedMarkup(feed) {
  return `
    <section class="sl-app-videos-feed" id="content-section-film-room" data-testid="film-room-content" aria-label="film-room-content">
      <h2 class="sl-app-videos-section-title" id="film-room-title" data-testid="film-room-title">Latest Videos</h2>
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

async function loadSocialFeedForClub(code) {
  if (!code || !window.SideLineAPI?.fetchSocialFeedForClub) return;

  socialFeedLoadingCode = code;
  updateClubStorySocialStage(code);

  try {
    const feed = await window.SideLineAPI.fetchSocialFeedForClub(code, { perPage: 5 });
    socialFeedCache[code] = feed;
  } catch (error) {
    console.warn("Social feed fetch failed:", error);
  } finally {
    if (socialFeedLoadingCode === code) {
      socialFeedLoadingCode = null;
    }
    updateClubStorySocialStage(code);
  }
}

async function loadVideosForClub(code) {
  if (!code || !window.SideLineAPI?.fetchVideosForClub) return;

  videosLoadingCode = code;
  updateClubStoryFeedSection(2, code);

  try {
    const feed = await window.SideLineAPI.fetchVideosForClub(code, { perPage: 6 });
    videosCache[code] = feed;
  } catch (error) {
    console.warn("Videos fetch failed:", error);
  } finally {
    if (videosLoadingCode === code) {
      videosLoadingCode = null;
    }
    updateClubStoryFeedSection(2, code);
  }
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
  updateClubStoryFeedSection(0, code);

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
    updateClubStoryFeedSection(0, code);
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
    if (videosLoadingCode === clubCode) {
      return buildVideosLoadingMarkup();
    }

    return buildVideosFeedMarkup(getVideosFeedForClub(clubCode));
  }

  if (stepIndex === 3) {
    if (socialFeedLoadingCode === clubCode) {
      return buildSocialFeedLoadingMarkup();
    }

    return buildSocialFeedMarkup(getSocialFeedForClub(clubCode));
  }

  return "";
}

function buildCombinedClubStoryFeedMarkup(clubCode) {
  return Array.from({ length: CLUB_STORY_FEED_SECTION_COUNT }, (_, sectionIndex) => {
    return `
      <div class="sl-club-story-feed-section" data-club-story-section="${sectionIndex}">
        ${buildClubStoryFeedBodyMarkup(sectionIndex, clubCode)}
      </div>
    `;
  }).join("");
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

function buildClubStoryPhoneMarkup(clubCode = clubSelectorState.selectedCode) {
  const clubPrimary = getClubPrimaryColor(clubCode);

  return `
    ${buildPhoneStatusBarMarkup()}
    <div class="sl-app-scaler sl-club-story-app-scaler">
      <div class="sl-app-viewport sl-app-home-viewport" style="--club-primary: ${clubPrimary}">
        <div class="sl-app-home-screen">
          ${buildHomeChromeMarkup("trending")}
          <div class="sl-app-home-content">
            <div class="sl-app-home-feed" data-club-story-feed-scroll>
              ${buildCombinedClubStoryFeedMarkup(clubCode)}
            </div>
            <div class="sl-app-home-social-stage" data-club-story-social-stage hidden>
              ${buildClubStoryFeedBodyMarkup(CLUB_STORY_SOCIAL_STEP_INDEX, clubCode)}
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="sl-club-story-phone-shield" aria-hidden="true"></div>
  `;
}

function getClubStoryPhoneFeed() {
  return document.querySelector(
    ".sl-club-selector-story-phone-screen[data-club-story-feed] [data-club-story-feed-scroll]",
  );
}

function getClubStorySocialStage() {
  return document.querySelector(
    ".sl-club-selector-story-phone-screen[data-club-story-feed] [data-club-story-social-stage]",
  );
}

function getClubStoryPhoneRoot() {
  return document.querySelector(".sl-club-selector-story-phone-screen[data-club-story-feed]");
}

function setHomeFeedToggle(activeMode) {
  const root = getClubStoryPhoneRoot();
  if (!root) return;

  const newsButton = root.querySelector('[data-testid="home-filter-row-toggle-trending"]');
  const socialButton = root.querySelector('[data-testid="home-filter-row-toggle-for-me"]');

  newsButton?.classList.toggle("is-active", activeMode === "trending");
  socialButton?.classList.toggle("is-active", activeMode === "social");
}

function animateHomeFeedToggleToSocial() {
  const root = getClubStoryPhoneRoot();
  const toggleContainer = root?.querySelector('[data-testid="home-filter-row-toggle-container"]');
  toggleContainer?.classList.add("is-switching");
  setHomeFeedToggle("social");
  window.setTimeout(() => {
    toggleContainer?.classList.remove("is-switching");
  }, 320);
}

function animateHomeFeedToggleToNews() {
  const root = getClubStoryPhoneRoot();
  const toggleContainer = root?.querySelector('[data-testid="home-filter-row-toggle-container"]');
  toggleContainer?.classList.add("is-switching");
  setHomeFeedToggle("trending");
  window.setTimeout(() => {
    toggleContainer?.classList.remove("is-switching");
  }, 320);
}

function updateClubStorySocialStage(clubCode = clubSelectorState.selectedCode) {
  const stage = getClubStorySocialStage();
  if (!stage) return;

  stage.innerHTML = buildClubStoryFeedBodyMarkup(CLUB_STORY_SOCIAL_STEP_INDEX, clubCode);
  window.requestAnimationFrame(() => {
    void hydrateClubStoryTwitterEmbeds(stage);
  });
}

function updateClubStoryFeedSection(sectionIndex, clubCode = clubSelectorState.selectedCode) {
  const feed = getClubStoryPhoneFeed();
  if (!feed) {
    renderClubStoryPhoneFeed(clubCode);
    return;
  }

  const section = feed.querySelector(`[data-club-story-section="${sectionIndex}"]`);
  if (!section) {
    renderClubStoryPhoneFeed(clubCode);
    return;
  }

  section.innerHTML = buildClubStoryFeedBodyMarkup(sectionIndex, clubCode);
}

function renderClubStoryPhoneFeed(clubCode = clubSelectorState.selectedCode, { preserveScroll = true } = {}) {
  const screen = document.querySelector(".sl-club-selector-story-phone-screen[data-club-story-feed]");
  if (!screen) return;

  const feed = getClubStoryPhoneFeed();
  const scrollTop = preserveScroll ? (feed?.scrollTop ?? 0) : 0;

  screen.dataset.clubStoryFeed = "combined";
  screen.innerHTML = buildClubStoryPhoneMarkup(clubCode);
  const storyStatusTime = screen.querySelector(".sl-phone-status-time");
  if (storyStatusTime) {
    storyStatusTime.textContent = new Date().toLocaleTimeString(undefined, {
      hour: "numeric",
      minute: "2-digit",
    });
  }
  syncClubStoryPhoneScaleForScreen(screen);

  const nextFeed = getClubStoryPhoneFeed();
  if (nextFeed) {
    nextFeed.scrollTop = scrollTop;
    if (!preserveScroll) {
      resetClubStoryPhoneScrollState();
    }
  }

  window.requestAnimationFrame(() => {
    syncClubStoryPhoneScaleForScreen(screen);
    initClubStoryPhoneFeedScroll();
  });
}

function refreshTopStoriesPhoneFeed(clubCode = clubSelectorState.selectedCode) {
  void loadTopStoriesForClub(clubCode);
}

function refreshPodcastsPhoneFeed(clubCode = clubSelectorState.selectedCode) {
  updateClubStoryFeedSection(1, clubCode);
}

function refreshVideosPhoneFeed(clubCode = clubSelectorState.selectedCode) {
  void loadVideosForClub(clubCode);
}

function refreshSocialPhoneFeed(clubCode = clubSelectorState.selectedCode) {
  void loadSocialFeedForClub(clubCode);
}

function renderClubStoryPhoneSteps() {
  renderClubStoryPhoneFeed();
}

const clubStoryPhoneScroll = {
  observer: null,
  syncStep: null,
  suppressPhoneFeedScrollSync: false,
  socialActive: false,
  socialTransitionRunning: false,
  socialTransitionCleanup: null,
  socialTransitionToken: 0,
  socialTransitionCooldownUntil: 0,
  socialScrollAnchorProgress: null,
  pendingFeedStep: null,
  getScrollTrigger: null,
  getPickProgressCap: null,
  boundFeed: null,
  boundSocialStage: null,
};

const SOCIAL_TRANSITION_MS = 1100;
const SOCIAL_TRANSITION_COOLDOWN_MS = 400;

function isSocialTransitionLocked() {
  return (
    clubStoryPhoneScroll.socialTransitionRunning ||
    Date.now() < clubStoryPhoneScroll.socialTransitionCooldownUntil
  );
}

function startSocialTransitionToken() {
  clubStoryPhoneScroll.socialTransitionToken += 1;
  return clubStoryPhoneScroll.socialTransitionToken;
}

function isActiveSocialTransitionToken(token) {
  return token === clubStoryPhoneScroll.socialTransitionToken;
}

function endSocialTransition() {
  clubStoryPhoneScroll.socialTransitionRunning = false;
  clubStoryPhoneScroll.socialTransitionCooldownUntil = Date.now() + SOCIAL_TRANSITION_COOLDOWN_MS;
  clearClubStorySocialTransitionTimers();
}

function prepareSocialTransitionElements(feed, stage) {
  if (feed) {
    feed.hidden = false;
    feed.style.opacity = "";
    feed.classList.remove("is-fading-out", "is-fading-in", "is-fading-in-active");
  }

  if (stage) {
    stage.style.opacity = "";
    stage.classList.remove("is-fading-out", "is-entering");
  }
}
function clearClubStorySocialTransitionTimers() {
  clubStoryPhoneScroll.socialTransitionCleanup?.();
  clubStoryPhoneScroll.socialTransitionCleanup = null;
}

function resetClubStorySocialView() {
  startSocialTransitionToken();
  clearClubStorySocialTransitionTimers();
  clubStoryPhoneScroll.socialActive = false;
  clubStoryPhoneScroll.socialTransitionRunning = false;
  clubStoryPhoneScroll.socialTransitionCooldownUntil = 0;

  const feed = getClubStoryPhoneFeed();
  const stage = getClubStorySocialStage();
  prepareSocialTransitionElements(feed, stage);

  if (feed) {
    feed.hidden = false;
  }

  if (stage) {
    stage.hidden = true;
    stage.classList.remove("is-visible");
  }

  clubStoryPhoneScroll.pendingFeedStep = null;
  clubStoryPhoneScroll.socialScrollAnchorProgress = null;
  setHomeFeedToggle("trending");
}

function finishSocialToVideosTransition(feed, stage, { fadeInFeed = false } = {}) {
  stage.hidden = true;
  stage.classList.remove("is-fading-out", "is-visible", "is-entering");
  stage.style.opacity = "";

  const maxScroll = Math.max(0, feed.scrollHeight - feed.clientHeight);
  feed.scrollTop = maxScroll;
  feed.hidden = false;
  feed.classList.remove("is-fading-out");

  if (fadeInFeed) {
    feed.classList.add("is-fading-in");
    window.requestAnimationFrame(() => {
      feed.classList.add("is-fading-in-active");
    });
    window.setTimeout(() => {
      feed.classList.remove("is-fading-in", "is-fading-in-active");
    }, SOCIAL_TRANSITION_MS);
  } else {
    feed.classList.remove("is-fading-in", "is-fading-in-active");
  }

  clubStoryPhoneScroll.socialActive = false;
  endSocialTransition();
  clubStoryPhoneScroll.syncStep?.(2);

  const pendingStep = clubStoryPhoneScroll.pendingFeedStep;
  clubStoryPhoneScroll.pendingFeedStep = null;

  if (typeof pendingStep === "number") {
    window.requestAnimationFrame(() => {
      scrollPhoneFeedToStep(pendingStep);
    });
  }
}

function runSocialToVideosTransition({ skipAnimation = false, animated = true, force = false } = {}) {
  if (clubStoryPhoneScroll.socialTransitionRunning) return;

  if (!clubStoryPhoneScroll.socialActive) {
    return;
  }

  if (!force && isSocialTransitionLocked()) {
    return;
  }

  const feed = getClubStoryPhoneFeed();
  const stage = getClubStorySocialStage();
  if (!feed || !stage) {
    resetClubStorySocialView();
    return;
  }

  const transitionToken = startSocialTransitionToken();
  clearClubStorySocialTransitionTimers();
  prepareSocialTransitionElements(feed, stage);

  if (skipAnimation || prefersReducedMotion || !animated) {
    setHomeFeedToggle("trending");
    finishSocialToVideosTransition(feed, stage);
    return;
  }

  clubStoryPhoneScroll.socialTransitionRunning = true;
  stage.hidden = false;
  stage.classList.add("is-visible");

  let transitionFinished = false;

  const finishTransition = () => {
    if (transitionFinished || !isActiveSocialTransitionToken(transitionToken)) return;
    if (!clubStoryPhoneScroll.socialTransitionRunning) return;

    transitionFinished = true;
    finishSocialToVideosTransition(feed, stage, { fadeInFeed: true });
  };

  const onStageFadeComplete = (event) => {
    if (event.propertyName !== "opacity") return;
    finishTransition();
  };

  stage.addEventListener("transitionend", onStageFadeComplete);

  const toggleTimer = window.setTimeout(() => {
    if (isActiveSocialTransitionToken(transitionToken)) {
      animateHomeFeedToggleToNews();
    }
  }, 800);
  const fallbackTimer = window.setTimeout(finishTransition, SOCIAL_TRANSITION_MS);

  clubStoryPhoneScroll.socialTransitionCleanup = () => {
    stage.removeEventListener("transitionend", onStageFadeComplete);
    window.clearTimeout(toggleTimer);
    window.clearTimeout(fallbackTimer);
  };

  window.requestAnimationFrame(() => {
    if (!isActiveSocialTransitionToken(transitionToken)) return;
    stage.classList.add("is-fading-out");
  });
}

function deactivateClubStorySocialView(options = {}) {
  runSocialToVideosTransition({ ...options, force: true });
}

function finishClubStorySocialTransition(feed, stage, { fadeInStage = false } = {}) {
  feed.hidden = true;
  feed.classList.remove("is-fading-out", "is-fading-in", "is-fading-in-active");
  feed.style.opacity = "";
  stage.hidden = false;
  stage.classList.remove("is-fading-out");
  stage.scrollTop = 0;

  if (fadeInStage) {
    stage.classList.add("is-entering");
    window.requestAnimationFrame(() => {
      stage.classList.add("is-visible");
      void hydrateClubStoryTwitterEmbeds(stage);
    });
    window.setTimeout(() => {
      stage.classList.remove("is-entering");
    }, SOCIAL_TRANSITION_MS);
  } else {
    stage.classList.add("is-visible");
    void hydrateClubStoryTwitterEmbeds(stage);
  }

  clubStoryPhoneScroll.socialActive = true;
  endSocialTransition();
  beginClubStorySocialScrollAnchor(getCurrentStoryProgressFromPage());
}

function runVideosToSocialTransition({ skipAnimation = false, animated = true, force = false } = {}) {
  if (clubStoryPhoneScroll.socialActive) {
    clubStoryPhoneScroll.syncStep?.(CLUB_STORY_SOCIAL_STEP_INDEX);
    return;
  }

  if (clubStoryPhoneScroll.socialTransitionRunning) return;

  if (!force && isSocialTransitionLocked()) {
    return;
  }

  const feed = getClubStoryPhoneFeed();
  const stage = getClubStorySocialStage();
  const clubCode = clubSelectorState.selectedCode;
  if (!feed || !stage || !clubCode) return;

  const transitionToken = startSocialTransitionToken();
  clubStoryPhoneScroll.socialTransitionRunning = true;
  clubStoryPhoneScroll.syncStep?.(CLUB_STORY_SOCIAL_STEP_INDEX);
  beginClubStorySocialScrollAnchor(getCurrentStoryProgressFromPage());
  void loadSocialFeedForClub(clubCode);
  updateClubStorySocialStage(clubCode);

  const maxScroll = Math.max(0, feed.scrollHeight - feed.clientHeight);
  feed.scrollTop = maxScroll;
  prepareSocialTransitionElements(feed, stage);
  stage.hidden = true;
  stage.classList.remove("is-visible");

  if (skipAnimation || prefersReducedMotion || !animated) {
    setHomeFeedToggle("social");
    finishClubStorySocialTransition(feed, stage);
    return;
  }

  let transitionFinished = false;

  const finishTransition = () => {
    if (transitionFinished || !isActiveSocialTransitionToken(transitionToken)) return;
    if (!clubStoryPhoneScroll.socialTransitionRunning) return;

    transitionFinished = true;
    finishClubStorySocialTransition(feed, stage, { fadeInStage: true });
  };

  const onFeedFadeComplete = (event) => {
    if (event.propertyName !== "opacity") return;
    finishTransition();
  };

  feed.addEventListener("transitionend", onFeedFadeComplete);

  const toggleTimer = window.setTimeout(() => {
    if (isActiveSocialTransitionToken(transitionToken)) {
      animateHomeFeedToggleToSocial();
    }
  }, 800);
  const fallbackTimer = window.setTimeout(finishTransition, SOCIAL_TRANSITION_MS);

  clubStoryPhoneScroll.socialTransitionCleanup = () => {
    feed.removeEventListener("transitionend", onFeedFadeComplete);
    window.clearTimeout(toggleTimer);
    window.clearTimeout(fallbackTimer);
  };

  window.requestAnimationFrame(() => {
    if (!isActiveSocialTransitionToken(transitionToken)) return;
    feed.classList.add("is-fading-out");
  });
}

function resetClubStoryPhoneScrollState() {
  clubStoryPhoneScroll.suppressPhoneFeedScrollSync = false;
  resetClubStorySocialView();
}

function setClubStoryPhoneFeedScrollTop(feed, scrollTop) {
  if (!feed) return;

  clubStoryPhoneScroll.suppressPhoneFeedScrollSync = true;
  feed.scrollTop = scrollTop;
  window.requestAnimationFrame(() => {
    clubStoryPhoneScroll.suppressPhoneFeedScrollSync = false;
  });
}

function setClubStorySocialStageScrollTop(stage, scrollTop) {
  if (!stage) return;

  clubStoryPhoneScroll.suppressPhoneFeedScrollSync = true;
  stage.scrollTop = scrollTop;
  window.requestAnimationFrame(() => {
    clubStoryPhoneScroll.suppressPhoneFeedScrollSync = false;
  });
}

function syncSocialStageScrollFromStoryProgress(storyProgress) {
  if (clubStoryPhoneScroll.socialTransitionRunning) return;

  const stage = getClubStorySocialStage();
  if (!stage || !clubStoryPhoneScroll.socialActive) return;

  const maxScroll = Math.max(0, stage.scrollHeight - stage.clientHeight);
  if (maxScroll <= 0) return;

  const anchorProgress =
    typeof clubStoryPhoneScroll.socialScrollAnchorProgress === "number"
      ? clubStoryPhoneScroll.socialScrollAnchorProgress
      : getStorySocialProgressThreshold() + 0.02;
  const scrollRange = Math.max(0.001, 1 - anchorProgress);
  const relativeProgress = Math.min(1, Math.max(0, (storyProgress - anchorProgress) / scrollRange));
  const targetScrollTop = relativeProgress * maxScroll;

  setClubStorySocialStageScrollTop(stage, targetScrollTop);
}

function beginClubStorySocialScrollAnchor(storyProgress = getCurrentStoryProgressFromPage()) {
  clubStoryPhoneScroll.socialScrollAnchorProgress = storyProgress;

  const stage = getClubStorySocialStage();
  if (stage) {
    stage.scrollTop = 0;
  }
}

function getSectionTopInFeed(section, feed) {
  if (!section || !feed || !feed.contains(section)) return 0;

  let top = 0;

  for (const child of feed.children) {
    if (child === section) break;
    top += child.offsetHeight;
  }

  return Math.max(0, top);
}

function getStoryProgressForStep(stepIndex) {
  return getStoryProgressAnchorForStep(stepIndex);
}

function getStoryStepFromFeedScroll(feed) {
  const sections = [...feed.querySelectorAll("[data-club-story-section]")];
  if (!sections.length) return 0;

  const scrollTop = feed.scrollTop;
  let stepIndex = 0;

  sections.forEach((section, index) => {
    if (scrollTop >= getSectionTopInFeed(section, feed) - 4) {
      stepIndex = index;
    }
  });

  return stepIndex;
}

function scrollPhoneFeedToStep(stepIndex) {
  if (stepIndex >= CLUB_STORY_SOCIAL_STEP_INDEX) {
    runVideosToSocialTransition({ skipAnimation: prefersReducedMotion, animated: true, force: true });
    return 0;
  }

  if (clubStoryPhoneScroll.socialActive) {
    clubStoryPhoneScroll.pendingFeedStep = stepIndex;
    runSocialToVideosTransition({ skipAnimation: prefersReducedMotion, animated: true, force: true });
    return 0;
  }

  if (clubStoryPhoneScroll.socialTransitionRunning) {
    return 0;
  }

  const feed = getClubStoryPhoneFeed();
  const section = feed?.querySelector(`[data-club-story-section="${stepIndex}"]`);
  if (!feed || !section) return 0;

  const targetTop = getSectionTopInFeed(section, feed);
  setClubStoryPhoneFeedScrollTop(feed, targetTop);
  clubStoryPhoneScroll.syncStep?.(stepIndex);

  return targetTop;
}

function syncPhoneFeedScrollFromStoryProgress(storyProgress) {
  const feed = getClubStoryPhoneFeed();
  if (!feed) return;

  if (clubStoryPhoneScroll.socialTransitionRunning) {
    return;
  }

  const socialThreshold = getStorySocialProgressThreshold();
  const socialEnterProgress = socialThreshold + 0.02;
  const socialExitProgress = socialThreshold - 0.08;

  if (storyProgress >= socialEnterProgress) {
    if (!clubStoryPhoneScroll.socialActive) {
      runVideosToSocialTransition({ skipAnimation: prefersReducedMotion, animated: true });
    } else {
      clubStoryPhoneScroll.syncStep?.(CLUB_STORY_SOCIAL_STEP_INDEX);
      syncSocialStageScrollFromStoryProgress(storyProgress);
    }
    return;
  }

  if (clubStoryPhoneScroll.socialActive && storyProgress < socialExitProgress) {
    runSocialToVideosTransition({ skipAnimation: prefersReducedMotion, animated: true });
    return;
  }

  if (isSocialTransitionLocked()) {
    return;
  }

  const targetScrollTop = getFeedScrollTopForStoryProgress(feed, storyProgress);

  setClubStoryPhoneFeedScrollTop(feed, targetScrollTop);
  clubStoryPhoneScroll.syncStep?.(getStoryStepFromStoryProgress(storyProgress));
}

function destroyClubStoryPhoneFeedScroll() {
  clubStoryPhoneScroll.observer?.disconnect();
  clubStoryPhoneScroll.observer = null;

  clubStoryPhoneScroll.boundFeed = null;
  clubStoryPhoneScroll.boundSocialStage = null;
}

function initClubStoryPhoneFeedScroll() {
  destroyClubStoryPhoneFeedScroll();

  const feed = getClubStoryPhoneFeed();
  if (!feed) return;

  const sections = [...feed.querySelectorAll("[data-club-story-section]")];
  if (!sections.length) return;

  clubStoryPhoneScroll.observer = new IntersectionObserver(
    (entries) => {
      if (clubStoryPhoneScroll.suppressPhoneFeedScrollSync || !clubSelectorState.storyUnlocked) return;

      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (!visible) return;

      const stepIndex = Number.parseInt(visible.target.dataset.clubStorySection, 10);
      if (Number.isNaN(stepIndex)) return;

      clubStoryPhoneScroll.syncStep?.(stepIndex);
    },
    {
      root: feed,
      threshold: [0, 0.15, 0.3, 0.45, 0.6, 0.75, 0.9, 1],
      rootMargin: "-10% 0px -58% 0px",
    },
  );

  sections.forEach((section) => clubStoryPhoneScroll.observer.observe(section));

  clubStoryPhoneScroll.boundFeed = feed;
  clubStoryPhoneScroll.boundSocialStage = getClubStorySocialStage();
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
  const storyScreen = document.querySelector(".sl-club-selector-story-phone-screen[data-club-story-feed]");
  if (!storyScreen) return;

  const sync = () => syncClubStoryPhoneScaleForScreen(storyScreen);
  sync();

  if (window.ResizeObserver) {
    const observer = new ResizeObserver(sync);
    observer.observe(storyScreen);

    const sharedPhone = document.querySelector("#sl-club-selector-shared-phone");
    if (sharedPhone) observer.observe(sharedPhone);
  }
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
  autoPickOfferShown: false,
  autoPickRunning: false,
  autoPickTimer: null,
  autoPickStepTimer: null,
  currentStoryStep: 0,
  headlines: [],
};

const topStoriesCache = {};
let topStoriesLoadingCode = null;

const videosCache = {};
let videosLoadingCode = null;

const socialFeedCache = {};
let socialFeedLoadingCode = null;

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
  refreshSocialPhoneFeed(code);
  applyClubPrimaryColor(code);

  clubSelectorState.headlines = CLUB_STORY_HEADLINE_BUILDERS.map((buildHeadline) => buildHeadline(name));

  const headline = document.querySelector("#sl-club-story-headline");
  if (headline) {
    headline.textContent =
      clubSelectorState.headlines[clubSelectorState.currentStoryStep] || clubSelectorState.headlines[0] || "";
  }
}

function hideAutoPickOffer() {
  const autoEl = document.querySelector("#sl-club-selector-pick-arrow-auto");
  if (!autoEl) return;

  autoEl.hidden = true;
  autoEl.classList.remove("is-visible");
}

function clearRandomizerHighlights() {
  document.querySelectorAll(".sl-app-team-card.is-randomizer-highlight").forEach((card) => {
    card.classList.remove("is-randomizer-highlight");
  });
}

function cancelAutoPickSequence({ resetOffer = true } = {}) {
  if (clubSelectorState.autoPickTimer) {
    window.clearTimeout(clubSelectorState.autoPickTimer);
    clubSelectorState.autoPickTimer = null;
  }

  if (clubSelectorState.autoPickStepTimer) {
    window.clearTimeout(clubSelectorState.autoPickStepTimer);
    clubSelectorState.autoPickStepTimer = null;
  }

  clubSelectorState.autoPickRunning = false;
  clearRandomizerHighlights();

  if (resetOffer) {
    clubSelectorState.autoPickOfferShown = false;
    hideAutoPickOffer();
  }
}

function selectClubCard(card, onClubSelected) {
  if (!card || clubSelectorState.transitioning || clubSelectorState.storyUnlocked) return;

  cancelAutoPickSequence();

  const grid = document.querySelector("#teams-grid");
  const nextButton = document.querySelector("#sl-club-selector-next-button");

  grid?.querySelectorAll(".sl-app-team-card").forEach((button) => {
    const isSelected = button === card;
    button.classList.toggle("selected", isSelected);
    button.setAttribute("aria-pressed", isSelected ? "true" : "false");
  });

  if (nextButton) {
    nextButton.disabled = false;
    nextButton.removeAttribute("aria-disabled");
  }

  clubSelectorState.selectedCode = card.dataset.club;
  updateClubStoryHeadlines(clubSelectorState.selectedCode);

  if (onClubSelected) {
    window.setTimeout(() => onClubSelected(), 450);
  }
}

function buildRandomizerSequence(cards, count) {
  const pool = [...cards];
  const sequence = [];

  while (sequence.length < count && pool.length) {
    const index = Math.floor(Math.random() * pool.length);
    sequence.push(pool.splice(index, 1)[0]);
  }

  return sequence;
}

function runClubRandomizer(onClubSelected) {
  const grid = document.querySelector("#teams-grid");
  const cards = [...(grid?.querySelectorAll(".sl-app-team-card") || [])];

  if (!cards.length || clubSelectorState.selectedCode || clubSelectorState.storyUnlocked) {
    clubSelectorState.autoPickRunning = false;
    return;
  }

  clubSelectorState.autoPickRunning = true;

  const finalizeRandomPick = () => {
    clearRandomizerHighlights();
    const finalCard = cards[Math.floor(Math.random() * cards.length)];
    clubSelectorState.autoPickRunning = false;
    selectClubCard(finalCard, onClubSelected);
  };

  if (prefersReducedMotion) {
    finalizeRandomPick();
    return;
  }

  const highlightCount = 5 + Math.floor(Math.random() * 2);
  const sequence = buildRandomizerSequence(cards, highlightCount);
  const stepMs = 380;
  let stepIndex = 0;

  const showNextHighlight = () => {
    if (clubSelectorState.selectedCode || clubSelectorState.storyUnlocked) {
      cancelAutoPickSequence();
      return;
    }

    clearRandomizerHighlights();

    if (stepIndex >= sequence.length) {
      clubSelectorState.autoPickStepTimer = window.setTimeout(finalizeRandomPick, stepMs);
      return;
    }

    sequence[stepIndex].classList.add("is-randomizer-highlight");
    stepIndex += 1;
    clubSelectorState.autoPickStepTimer = window.setTimeout(showNextHighlight, stepMs);
  };

  showNextHighlight();
}

function beginAutoPickSequence(onClubSelected) {
  if (
    clubSelectorState.autoPickOfferShown ||
    clubSelectorState.autoPickRunning ||
    clubSelectorState.selectedCode ||
    clubSelectorState.storyUnlocked ||
    clubSelectorState.transitioning
  ) {
    return;
  }

  clubSelectorState.autoPickOfferShown = true;

  const autoEl = document.querySelector("#sl-club-selector-pick-arrow-auto");
  if (autoEl) {
    autoEl.removeAttribute("hidden");
    autoEl.hidden = false;
    autoEl.classList.add("is-visible");
  }

  clubSelectorState.autoPickTimer = window.setTimeout(() => {
    clubSelectorState.autoPickTimer = null;
    runClubRandomizer(onClubSelected);
  }, 2000);
}

function bootClubSelectorAutoPickScroll(onClubSelected) {
  const pickStage = document.querySelector(".sl-club-selector-pick-stage");
  if (!pickStage) return;

  pickStage.addEventListener(
    "wheel",
    (event) => {
      if (event.deltaY <= 0) return;
      if (
        !clubSelectorState.arrowShown ||
        clubSelectorState.autoPickOfferShown ||
        clubSelectorState.autoPickRunning ||
        clubSelectorState.selectedCode ||
        clubSelectorState.storyUnlocked ||
        clubSelectorState.transitioning
      ) {
        return;
      }

      beginAutoPickSequence(onClubSelected);
    },
    { passive: true },
  );
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
  const grid = document.querySelector("#teams-grid");

  if (!grid) return;

  grid.addEventListener("click", (event) => {
    const card = event.target.closest(".sl-app-team-card");
    if (!card) return;

    selectClubCard(card, onClubSelected);
  });
}

function bootClubSelectorStory() {
  const wrap = document.querySelector("#sl-club-selector");
  const pinShell = document.querySelector("#sl-club-selector-pin-shell");
  const panel = document.querySelector("#sl-club-selector-panel");
  const pickPhase = document.querySelector("#sl-club-selector-phase-pick");
  const storyPhase = document.querySelector("#sl-club-selector-phase-story");
  const heading = document.querySelector("#sl-club-selector-heading");
  const arrow = document.querySelector("#sl-club-selector-pick-arrow");
  const sharedPhone = document.querySelector("#sl-club-selector-shared-phone");
  const pickSpacer = document.querySelector("#sl-club-selector-pick-phone-spacer");
  const storySlot = document.querySelector("#sl-club-selector-story-phone-slot");
  const textWrap = document.querySelector("#sl-club-selector-text-wrap");
  const pickScreenLayer = document.querySelector(".sl-club-selector-screen-pick");
  const storyScreenLayer = document.querySelector(".sl-club-selector-screen-story");

  if (!wrap || !pinShell || !panel || !pickPhase || !storyPhase || !sharedPhone || !pickSpacer || !storySlot) {
    return;
  }

  const stepperItems = [...document.querySelectorAll(".sl-club-story-stepper-item")];
  const storyHeadline = document.querySelector("#sl-club-story-headline");
  const changeClubButton = document.querySelector("#sl-club-story-change-club");

  const STORY_STEP_COUNT = stepperItems.length || 4;

  const PICK_SCROLL_VIEWPORTS = 0.5;
  const STORY_SCROLL_VIEWPORTS = 3;
  const TOTAL_SCROLL_VIEWPORTS = PICK_SCROLL_VIEWPORTS + STORY_SCROLL_VIEWPORTS;
  const PICK_HOLD = PICK_SCROLL_VIEWPORTS;
  const STEP_HOLD = STORY_SCROLL_VIEWPORTS / STORY_STEP_COUNT;
  const PICK_PROGRESS_CAP = PICK_SCROLL_VIEWPORTS / TOTAL_SCROLL_VIEWPORTS;
  const PHONE_SLIDE_DURATION = 0.85;

  let clubScrollTrigger = null;
  let clubTimeline = null;
  let isClampingScroll = false;

  const PHONE_BODY_HEIGHT_RATIO = 163.4 / 78;

  function getRelativeRect(element, container) {
    const elementRect = element.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();

    return {
      left: elementRect.left - containerRect.left,
      top: elementRect.top - containerRect.top,
      width: elementRect.width,
      height: elementRect.height,
    };
  }

  function getSharedPhoneTargetSize(target) {
    if (!target) return { width: 0, height: 0 };

    let width = target.offsetWidth;
    let height = target.offsetHeight;

    if (width < 1 && height > 0) {
      width = height / PHONE_BODY_HEIGHT_RATIO;
    }

    if (height < 1 && width > 0) {
      height = width * PHONE_BODY_HEIGHT_RATIO;
    }

    if (width < 1 || height < 1) {
      const fallbackTarget = pickSpacer?.offsetWidth > 0 ? pickSpacer : target;
      width = fallbackTarget.offsetWidth;
      height = fallbackTarget.offsetHeight;

      if (height < 1 && width > 0) {
        height = width * PHONE_BODY_HEIGHT_RATIO;
      }
    }

    return { width, height };
  }

  function positionSharedPhoneAt(target) {
    if (!target) return;

    const rect = getRelativeRect(target, panel);
    const size = getSharedPhoneTargetSize(target);

    if (size.width > 0) rect.width = size.width;
    if (size.height > 0) rect.height = size.height;

    if (window.gsap) {
      gsap.set(sharedPhone, rect);
    } else {
      Object.assign(sharedPhone.style, {
        left: `${rect.left}px`,
        top: `${rect.top}px`,
        width: `${rect.width}px`,
        height: `${rect.height}px`,
      });
    }

    window.requestAnimationFrame(() => {
      syncClubSelectorPhoneScales();
    });
  }

  function positionSharedPhoneAtPick() {
    positionSharedPhoneAt(pickSpacer);
  }

  function positionSharedPhoneAtStory() {
    positionSharedPhoneAt(storySlot);
  }

  function setPhoneScreenMode(mode) {
    const isStory = mode === "story";

    pickScreenLayer?.classList.toggle("is-active", !isStory);
    if (pickScreenLayer) pickScreenLayer.hidden = isStory;
    storyScreenLayer?.classList.toggle("is-active", isStory);
    if (storyScreenLayer) storyScreenLayer.hidden = !isStory;
    sharedPhone.classList.toggle("is-interactive", !isStory);
  }

  function setStoryStep(index) {
    const stepIndex = Math.max(0, Math.min(STORY_STEP_COUNT - 1, index));
    clubSelectorState.currentStoryStep = stepIndex;

    if (storyHeadline && clubSelectorState.headlines[stepIndex]) {
      storyHeadline.textContent = clubSelectorState.headlines[stepIndex];
    }

    const useSingleMobileStepper = window.matchMedia("(max-width: 980px)").matches;

    stepperItems.forEach((item, itemIndex) => {
      const isActive = itemIndex === stepIndex;
      item.classList.toggle("is-active", isActive);
      const trigger = item.querySelector(".sl-club-story-stepper-trigger");
      trigger?.setAttribute("aria-current", isActive ? "step" : "false");

      if (useSingleMobileStepper) {
        item.setAttribute("aria-hidden", isActive ? "false" : "true");
      } else {
        item.removeAttribute("aria-hidden");
      }
    });
  }

  clubStoryPhoneScroll.syncStep = setStoryStep;

  function scrollToStoryStep(stepIndex) {
    if (!clubSelectorState.storyUnlocked) return;

    const step = Math.max(0, Math.min(STORY_STEP_COUNT - 1, stepIndex));
    scrollPhoneFeedToStep(step);
    setStoryStep(step);

    const trigger = clubScrollTrigger || ScrollTrigger.getById("club-selector-scroll");

    if (!trigger || !window.gsap || prefersReducedMotion) return;

    clubStoryPhoneScroll.suppressPhoneFeedScrollSync = true;
    const storyProgress = getStoryProgressForStep(step);
    const totalProgress = PICK_PROGRESS_CAP + storyProgress * (1 - PICK_PROGRESS_CAP);
    trigger.scroll(trigger.start + (trigger.end - trigger.start) * totalProgress);

    window.setTimeout(() => {
      clubStoryPhoneScroll.suppressPhoneFeedScrollSync = false;
    }, prefersReducedMotion ? 0 : 400);
  }

  function bootClubStoryStepper() {
    stepperItems.forEach((item) => {
      const step = Number.parseInt(item.dataset.clubStoryStep, 10);
      if (Number.isNaN(step)) return;

      item.querySelector(".sl-club-story-stepper-trigger")?.addEventListener("click", () => {
        scrollToStoryStep(step);
      });
    });
  }

  function resetToPickPhase() {
    if (clubSelectorState.transitioning) return;

    const runReset = () => {
      cancelAutoPickSequence();
      clubSelectorState.storyUnlocked = false;
      clubSelectorState.selectedCode = null;
      clubSelectorState.transitioning = false;
      clubSelectorState.currentStoryStep = 0;

      document.querySelectorAll(".sl-app-team-card").forEach((card) => {
        card.classList.remove("selected");
        card.setAttribute("aria-pressed", "false");
      });

      const nextButton = document.querySelector("#sl-club-selector-next-button");
      if (nextButton) {
        nextButton.disabled = true;
        nextButton.setAttribute("aria-disabled", "true");
      }

      panel.classList.remove("is-story-active");
      storyPhase.hidden = true;
      storyPhase.setAttribute("aria-hidden", "true");
      pickPhase.hidden = false;
      pickPhase.classList.add("is-active");
      pickPhase.setAttribute("aria-hidden", "false");
      arrow?.classList.remove("is-visible");
      clubSelectorState.arrowShown = false;

      setPhoneScreenMode("pick");
      positionSharedPhoneAtPick();
      syncClubSelectorPhoneScales();

      if (window.gsap) {
        gsap.set(storyPhase, { opacity: 0, visibility: "hidden", pointerEvents: "none" });
        gsap.set(pickPhase, { opacity: 1, visibility: "visible" });
        gsap.set([heading, arrow], { opacity: 1, visibility: "visible" });
        gsap.set(textWrap, { opacity: 0 });
      }

      clubSelectorState.headlines = [];
      if (storyHeadline) storyHeadline.textContent = "";
      applyClubPrimaryColor(null);
      setStoryStep(0);
      resetClubStoryPhoneScrollState();
      renderClubStoryPhoneFeed(clubSelectorState.selectedCode, { preserveScroll: false });

      const trigger = ScrollTrigger.getById("club-selector-scroll");
      if (trigger) {
        trigger.scroll(trigger.start);
      }
    };

    if (prefersReducedMotion || !window.gsap || !clubSelectorState.storyUnlocked) {
      runReset();
      return;
    }

    clubSelectorState.transitioning = true;
    const startRect = getRelativeRect(sharedPhone, panel);

    gsap
      .timeline({
        onComplete() {
          runReset();
        },
      })
      .to(textWrap, { opacity: 0, duration: 0.3, ease: "power1.inOut" })
      .call(() => {
        gsap.set(sharedPhone, {
          left: startRect.left,
          top: startRect.top,
          width: startRect.width,
          height: startRect.height,
        });

        panel.classList.remove("is-story-active");
        pickPhase.hidden = false;
        pickPhase.classList.add("is-active");
        pickPhase.setAttribute("aria-hidden", "false");
        gsap.set(storyPhase, { opacity: 0, visibility: "hidden", pointerEvents: "none" });
        gsap.set([heading, arrow], { opacity: 0, visibility: "visible" });
      })
      .to(
        sharedPhone,
        {
          left: () => getRelativeRect(pickSpacer, panel).left,
          top: () => getRelativeRect(pickSpacer, panel).top,
          duration: PHONE_SLIDE_DURATION,
          ease: "power2.inOut",
        },
        ">0.05",
      )
      .call(() => setPhoneScreenMode("pick"), null, ">")
      .to([heading, arrow], { opacity: 1, duration: 0.35, ease: "power2.out" }, "<0.05");
  }

  function destroyClubScroll() {
    clubScrollTrigger?.kill();
    clubScrollTrigger = null;
    clubTimeline?.kill();
    clubTimeline = null;
  }

  function showStoryPhase() {
    storyPhase.hidden = false;
    storyPhase.setAttribute("aria-hidden", "false");
    panel.classList.add("is-story-active");

    if (window.gsap) {
      gsap.set(storyPhase, { opacity: 1, visibility: "visible", pointerEvents: "auto" });
      gsap.set(textWrap, { opacity: 1 });
    } else {
      storyPhase.style.opacity = "1";
      storyPhase.style.visibility = "visible";
      storyPhase.style.pointerEvents = "auto";
      if (textWrap) textWrap.style.opacity = "1";
    }

    setPhoneScreenMode("story");
    positionSharedPhoneAtStory();
    setStoryStep(clubSelectorState.currentStoryStep);
    initClubStoryPhoneFeedScroll();
  }

  function clampToPickPhase(self) {
    if (clubSelectorState.storyUnlocked || isClampingScroll || clubSelectorState.autoPickRunning) return;

    const scrollAttemptThreshold = PICK_PROGRESS_CAP * 0.75;
    if (!clubSelectorState.selectedCode && self.progress > scrollAttemptThreshold) {
      showClubSelectorPickArrow();
    }

    if (self.progress <= PICK_PROGRESS_CAP) return;

    if (!clubSelectorState.selectedCode) {
      showClubSelectorPickArrow();

      if (clubSelectorState.arrowShown && !clubSelectorState.autoPickOfferShown) {
        beginAutoPickSequence(transitionToStory);
      }
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

    gsap.set(storyPhase, { opacity: 0, visibility: "hidden", pointerEvents: "none" });
    gsap.set(pickPhase, { opacity: 1, visibility: "visible" });
    gsap.set(textWrap, { opacity: 0 });
    panel.classList.remove("is-story-active");
    pickPhase.hidden = false;
    pickPhase.setAttribute("aria-hidden", "false");
    setPhoneScreenMode("pick");
    positionSharedPhoneAtPick();

    clubTimeline = gsap.timeline({
      defaults: { ease: "power1.inOut" },
      scrollTrigger: {
        id: "club-selector-scroll",
        trigger: wrap,
        start: "top top",
        endTrigger: "#sl-features-intro",
        end: "top top",
        pin: pinShell,
        pinSpacing: true,
        scrub: true,
        anticipatePin: 0,
        invalidateOnRefresh: true,
        onUpdate(self) {
          clampToPickPhase(self);

          if (!clubSelectorState.storyUnlocked) return;

          const storyProgress = Math.max(0, (self.progress - PICK_PROGRESS_CAP) / (1 - PICK_PROGRESS_CAP));
          syncPhoneFeedScrollFromStoryProgress(storyProgress);
        },
        onLeaveBack() {
          if (clubSelectorState.storyUnlocked) {
            panel.classList.add("is-story-active");
          }
        },
      },
    });

    clubScrollTrigger = clubTimeline.scrollTrigger;
    clubStoryPhoneScroll.getScrollTrigger = () => clubScrollTrigger;
    clubStoryPhoneScroll.getPickProgressCap = () => PICK_PROGRESS_CAP;

    clubTimeline.to({}, { duration: PICK_HOLD });

    for (let index = 0; index < STORY_STEP_COUNT; index += 1) {
      clubTimeline.to({}, { duration: STEP_HOLD });
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
      if (window.gsap) {
        gsap.set([heading, arrow], { opacity: 0 });
      } else {
        if (heading) heading.style.opacity = "0";
        if (arrow) arrow.style.opacity = "0";
      }

      storyPhase.hidden = false;
      setPhoneScreenMode("story");
      renderClubStoryPhoneFeed(clubSelectorState.selectedCode, { preserveScroll: false });
      positionSharedPhoneAtStory();
      finishStoryTransition();
      return;
    }

    storyPhase.hidden = false;
    gsap.set(storyPhase, { opacity: 0, visibility: "hidden", pointerEvents: "none" });

    const storyRect = getRelativeRect(storySlot, panel);
    const storySize = getSharedPhoneTargetSize(storySlot);
    if (storySize.width > 0) storyRect.width = storySize.width;
    if (storySize.height > 0) storyRect.height = storySize.height;

    gsap
      .timeline({
        onComplete: finishStoryTransition,
      })
      .to([heading, arrow], { opacity: 0, duration: 0.4, ease: "power1.inOut" })
      .to(
        sharedPhone,
        {
          left: storyRect.left,
          top: storyRect.top,
          width: storyRect.width,
          height: storyRect.height,
          duration: PHONE_SLIDE_DURATION,
          ease: "power2.inOut",
        },
        0.15,
      )
      .call(() => {
        setPhoneScreenMode("story");
        renderClubStoryPhoneFeed(clubSelectorState.selectedCode, { preserveScroll: false });
      })
      .set(storyPhase, { visibility: "visible", pointerEvents: "auto" })
      .to(storyPhase, { opacity: 1, duration: 0.2, ease: "power1.inOut" }, "<")
      .to(textWrap, { opacity: 1, duration: 0.35, ease: "power2.out" }, "<0.05");
  }

  positionSharedPhoneAtPick();
  window.addEventListener("resize", () => {
    if (clubSelectorState.transitioning) return;

    if (clubSelectorState.storyUnlocked) {
      positionSharedPhoneAtStory();
      syncClubSelectorPhoneScales();
      return;
    }

    positionSharedPhoneAtPick();
    syncClubSelectorPhoneScales();
  });

  changeClubButton?.addEventListener("click", resetToPickPhase);
  bootClubStoryStepper();
  bootClubSelectorAutoPickScroll(transitionToStory);

  bootClubSelectorPickArrowHint();
  bootClubSelectorTeamPicker(transitionToStory);

  clubSelectorPinController = {
    buildClubScroll,
    refreshOnResize() {
      syncClubSelectorPhoneScales();
      const wasUnlocked = clubSelectorState.storyUnlocked;
      buildClubScroll();
      featuresIntroPinController?.rebuild?.();
      if (wasUnlocked) {
        clubSelectorState.storyUnlocked = true;
        showStoryPhase();
      } else {
        positionSharedPhoneAtPick();
      }
      ScrollTrigger.refresh(true);
    },
  };
}

function bootClubSelectorStoryPin() {
  if (prefersReducedMotion || !window.gsap || !window.ScrollTrigger) return;

  window.addEventListener("resize", () => {
    clubSelectorPinController?.refreshOnResize();
  });
}

bootCtaLogoGrid();
bootHeroVideo();
bootHeroPhoneStatusBar();
renderClubSelectorTeams();
bootClubSelectorAppViewport();
renderClubStoryPhoneSteps();
bootClubStoryPhoneViewports();
bootClubSelectorStory();
bootAnimations();

window.addEventListener("load", () => {
  syncClubSelectorPhoneScales();
  clubSelectorPinController?.refreshOnResize();
  if (window.ScrollTrigger) {
    ScrollTrigger.refresh(true);
  }
});
