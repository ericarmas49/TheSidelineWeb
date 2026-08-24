const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if ("scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}

function resetPageScrollPosition() {
  window.scrollTo(0, 0);
}

resetPageScrollPosition();

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

function bootSpectatorCarousel() {
  const track = document.querySelector("#sl-spectator-track");
  const dots = document.querySelector("#sl-spectator-dots");
  const prevButton = document.querySelector("#sl-spectator-prev");
  const nextButton = document.querySelector("#sl-spectator-next");

  if (!track || !dots) return;

  const dotButtons = [...dots.querySelectorAll(".sl-spectator-dot")];
  const mobileQuery = window.matchMedia("(max-width: 980px)");

  if (dotButtons.length === 0) return;

  let scrollRaf = 0;
  let isLoopJumping = false;
  let realCards = [...track.querySelectorAll(".sl-spectator-card:not(.sl-spectator-card-clone)")];
  let slideElements = realCards;

  function removeLoopClones() {
    track.querySelectorAll(".sl-spectator-card-clone").forEach((clone) => clone.remove());
    slideElements = realCards;
  }

  function setupLoopClones() {
    removeLoopClones();

    const grid = track.querySelector(".sl-spectator-grid");
    if (!grid || !mobileQuery.matches || realCards.length < 2) {
      slideElements = realCards;
      return;
    }

    const firstClone = realCards[0].cloneNode(true);
    const lastClone = realCards[realCards.length - 1].cloneNode(true);

    [firstClone, lastClone].forEach((clone) => {
      clone.classList.add("sl-spectator-card-clone");
      clone.setAttribute("aria-hidden", "true");
      clone.querySelectorAll("[id]").forEach((el) => el.removeAttribute("id"));
    });

    grid.insertBefore(lastClone, realCards[0]);
    grid.appendChild(firstClone);
    slideElements = [...grid.querySelectorAll(".sl-spectator-card")];
  }

  function getRawIndex() {
    const trackRect = track.getBoundingClientRect();
    const trackCenter = trackRect.left + trackRect.width / 2;
    let closestIndex = 0;
    let closestDistance = Infinity;

    slideElements.forEach((slide, index) => {
      const slideRect = slide.getBoundingClientRect();
      const slideCenter = slideRect.left + slideRect.width / 2;
      const distance = Math.abs(slideCenter - trackCenter);

      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = index;
      }
    });

    return closestIndex;
  }

  function getRealIndex(rawIndex = getRawIndex()) {
    if (!mobileQuery.matches || realCards.length < 2) {
      return Math.min(Math.max(rawIndex, 0), realCards.length - 1);
    }

    if (rawIndex === 0) return realCards.length - 1;
    if (rawIndex === slideElements.length - 1) return 0;
    return rawIndex - 1;
  }

  function updateControls(index = getRealIndex()) {
    dotButtons.forEach((dot, dotIndex) => {
      const isActive = dotIndex === index;
      dot.classList.toggle("is-active", isActive);
      dot.setAttribute("aria-selected", isActive ? "true" : "false");
    });
  }

  function getScrollOffsetForSlide(slide) {
    return slide.offsetLeft - (track.clientWidth - slide.offsetWidth) / 2;
  }

  function jumpToRawIndex(rawIndex) {
    const slide = slideElements[rawIndex];
    if (!slide) return;

    isLoopJumping = true;
    track.style.scrollSnapType = "none";
    track.style.scrollBehavior = "auto";
    track.scrollLeft = getScrollOffsetForSlide(slide);
    track.style.removeProperty("scroll-snap-type");
    track.style.removeProperty("scroll-behavior");
    updateControls(getRealIndex(rawIndex));

    window.requestAnimationFrame(() => {
      isLoopJumping = false;
    });
  }

  function scrollToRawIndex(rawIndex, smooth = true) {
    const slide = slideElements[rawIndex];
    if (!slide || isLoopJumping) return;

    track.scrollTo({
      left: getScrollOffsetForSlide(slide),
      behavior: smooth && !prefersReducedMotion ? "smooth" : "auto",
    });
    updateControls(getRealIndex(rawIndex));
  }

  function scrollToRealIndex(realIndex, smooth = true) {
    const count = realCards.length;
    if (count === 0) return;

    if (!mobileQuery.matches || count < 2) {
      scrollToRawIndex(realIndex, smooth);
      return;
    }

    const currentReal = getRealIndex();
    if (currentReal === realIndex) return;

    const forward = (realIndex - currentReal + count) % count;
    const backward = (currentReal - realIndex + count) % count;
    const currentRaw = getRawIndex();

    if (forward <= backward) {
      scrollToRawIndex(currentRaw + forward, smooth);
      return;
    }

    scrollToRawIndex(currentRaw - backward, smooth);
  }

  function stepBy(delta, smooth = true) {
    if (!mobileQuery.matches || realCards.length < 2) {
      const nextReal =
        (getRealIndex() + delta + realCards.length) % Math.max(realCards.length, 1);
      scrollToRealIndex(nextReal, smooth);
      return;
    }

    const nextRaw = getRawIndex() + delta;
    if (nextRaw >= 0 && nextRaw < slideElements.length) {
      scrollToRawIndex(nextRaw, smooth);
    }
  }

  function maybeJumpLoopEnds() {
    if (!mobileQuery.matches || realCards.length < 2 || isLoopJumping) return;

    const rawIndex = getRawIndex();

    if (rawIndex === 0) {
      jumpToRawIndex(slideElements.length - 2);
      return;
    }

    if (rawIndex === slideElements.length - 1) {
      jumpToRawIndex(1);
      return;
    }

    updateControls(getRealIndex(rawIndex));
  }

  function syncCarouselMode() {
    const isMobile = mobileQuery.matches;
    dots.hidden = !isMobile;
    if (prevButton) prevButton.hidden = !isMobile;
    if (nextButton) nextButton.hidden = !isMobile;

    realCards = [...track.querySelectorAll(".sl-spectator-card:not(.sl-spectator-card-clone)")];

    if (!isMobile) {
      removeLoopClones();
      track.scrollLeft = 0;
      updateControls(0);
      return;
    }

    setupLoopClones();
    jumpToRawIndex(realCards.length >= 2 ? 1 : 0);
    updateControls(0);
  }

  dotButtons.forEach((dot, index) => {
    dot.addEventListener("click", () => scrollToRealIndex(index));
  });

  prevButton?.addEventListener("click", () => stepBy(-1));
  nextButton?.addEventListener("click", () => stepBy(1));

  track.addEventListener(
    "scroll",
    () => {
      if (!mobileQuery.matches || isLoopJumping) return;

      cancelAnimationFrame(scrollRaf);
      scrollRaf = window.requestAnimationFrame(() => {
        updateControls(getRealIndex());
      });
    },
    { passive: true },
  );

  if ("onscrollend" in track) {
    track.addEventListener("scrollend", maybeJumpLoopEnds);
  } else {
    let loopJumpTimeout = 0;
    track.addEventListener(
      "scroll",
      () => {
        if (!mobileQuery.matches || isLoopJumping) return;

        window.clearTimeout(loopJumpTimeout);
        loopJumpTimeout = window.setTimeout(
          maybeJumpLoopEnds,
          prefersReducedMotion ? 0 : 120,
        );
      },
      { passive: true },
    );
  }

  mobileQuery.addEventListener("change", syncCarouselMode);
  syncCarouselMode();
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
    .from(".sl-hero-downloads .sl-store-badge", { y: 22, opacity: 0, duration: 0.75, stagger: 0.1 }, "-=0.35")
    .from(".sl-hero-qr", { scale: 0.82, opacity: 0, duration: 0.65 }, "-=0.55")
    .from(".sl-hero-phone-inner", { y: 20, opacity: 0, duration: 0.85 }, "-=0.8");

  gsap.utils
    .toArray(
      ".section-heading, .sl-benefits-title, .sl-benefit-card, .sl-spectator-title, .sl-spectator-carousel, .sl-cta-home-inner, .sl-footer",
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

const FEATURES_INTRO_PHONE_ENTER_OFFSET = 120;
const FEATURES_INTRO_PHONE_ENTER_ROTATION = 14;
const FEATURES_INTRO_DESKTOP_PHONE_ENTER_Y = 50;
const FEATURES_INTRO_DESKTOP_PHONE_EXIT_X = -400;
const FEATURES_INTRO_DESKTOP_PHONE_EXIT_FADE_END = 0.68;
const FEATURES_INTRO_MOBILE_PIN_VIEWPORTS = 3.5;
const FEATURES_INTRO_DESKTOP_PIN_VIEWPORTS = 3;
const FEATURES_INTRO_END_HOLD_RATIO = 0.38;
const FEATURES_INTRO_MOBILE_STEP_COUNT = 1 + FEATURES_INTRO_SCROLL_STEPS.length;
const FEATURES_INTRO_DESKTOP_STEP_COUNT = FEATURES_INTRO_SCROLL_STEPS.length;

function buildFeaturesIntroSnapValues(stepCount) {
  if (stepCount <= 1) return [0];

  const activeRange = 1 - FEATURES_INTRO_END_HOLD_RATIO;

  return Array.from({ length: stepCount }, (_, index) => {
    if (stepCount === 1) return 0;
    return (index / (stepCount - 1)) * activeRange;
  });
}

function getFeaturesIntroStepFromProgress(progress, snapValues) {
  if (!snapValues?.length) return 0;
  if (snapValues.length === 1) return 0;

  const lastIndex = snapValues.length - 1;
  const lastSnap = snapValues[lastIndex];

  if (progress >= lastSnap - 0.001) {
    return lastIndex;
  }

  for (let index = lastIndex - 1; index >= 0; index -= 1) {
    const threshold = (snapValues[index] + snapValues[index + 1]) / 2;
    if (progress >= threshold) {
      return index + 1;
    }
  }

  return 0;
}

function getFeaturesIntroSnapProgress(stepIndex, snapValues) {
  if (!snapValues?.length) return 0;

  return snapValues[Math.max(0, Math.min(snapValues.length - 1, stepIndex))] ?? 0;
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

const featuresIntroState = {
  mobileStepIndex: 0,
  desktopStepIndex: 0,
  isAnimating: false,
};

let featuresIntroPinController = null;
let featuresIntroMobileController = null;
let featuresIntroDesktopController = null;
let featuresIntroBreakpointQuery = null;

function bootFeaturesIntroPin() {
  if (prefersReducedMotion || !window.gsap || !window.ScrollTrigger) return;

  bootFeaturesIntroMobilePin();
  bootFeaturesIntroDesktopPin();

  if (!featuresIntroBreakpointQuery) {
    featuresIntroBreakpointQuery = window.matchMedia("(min-width: 981px)");
    featuresIntroBreakpointQuery.addEventListener("change", () => {
      featuresIntroPinController?.rebuild?.();
      ScrollTrigger.refresh(true);
    });
  }

  featuresIntroPinController = {
    rebuild() {
      const savedMobileStep = featuresIntroState.mobileStepIndex;
      const savedDesktopStep = featuresIntroState.desktopStepIndex;

      featuresIntroMobileController?.rebuild?.();
      featuresIntroDesktopController?.rebuild?.();

      featuresIntroState.mobileStepIndex = savedMobileStep;
      featuresIntroState.desktopStepIndex = savedDesktopStep;

      featuresIntroMobileController?.applyStep?.(savedMobileStep, { animate: false });
      featuresIntroDesktopController?.applyStep?.(savedDesktopStep, { animate: false });
    },
  };
}

function bootFeaturesIntroDesktopPin() {
  if (prefersReducedMotion || !window.gsap || !window.ScrollTrigger) return;

  const wrap = document.querySelector("#sl-features-intro");
  const pinShell = document.querySelector("#sl-features-intro-pin-shell");
  const intro = document.querySelector("#sl-features-intro-copy");
  const desktopQuery = window.matchMedia("(min-width: 981px)");
  const snapProgressValues = buildFeaturesIntroSnapValues(FEATURES_INTRO_DESKTOP_STEP_COUNT);

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

  let desktopScrollTrigger = null;

  function setStepTextState(textEl, { alpha = 0, visible = false, hidden = true, x = 0, y = 0 } = {}) {
    if (!textEl) return;

    gsap.set(textEl, { autoAlpha: alpha, x, y, yPercent: 0 });
    textEl.classList.toggle("is-features-intro-text-visible", visible);
    textEl.setAttribute("aria-hidden", hidden ? "true" : "false");
  }

  function setStepPhoneState(phoneEl, { alpha = 0, x = 0, y = 0, rotation = 0 } = {}) {
    if (!phoneEl) return;

    gsap.set(phoneEl, { autoAlpha: alpha, x, y, rotation });
  }

  function hideAllStepTexts() {
    FEATURES_INTRO_SCROLL_STEPS.forEach((step) => {
      setStepTextState(stepTexts[step.id], { alpha: 0, visible: false, hidden: true });
    });
  }

  function setDesktopPhoneHidden(phoneEl) {
    setStepPhoneState(phoneEl, {
      alpha: 0,
      x: 0,
      y: FEATURES_INTRO_DESKTOP_PHONE_ENTER_Y,
      rotation: 0,
    });
  }

  function setDesktopPhoneVisible(phoneEl) {
    setStepPhoneState(phoneEl, { alpha: 1, x: 0, y: 0, rotation: 0 });
  }

  function setDesktopTextHidden(textEl) {
    setStepTextState(textEl, { alpha: 0, visible: false, hidden: true });
  }

  function setDesktopTextVisible(textEl) {
    setStepTextState(textEl, { alpha: 1, visible: true, hidden: false, x: 0, y: 0 });
  }

  function setDesktopStepVisible(step) {
    setDesktopPhoneVisible(stepPhones[step.id]);
    setDesktopTextVisible(stepTexts[step.id]);
  }

  function setDesktopStepHidden(step) {
    setDesktopPhoneHidden(stepPhones[step.id]);
    setDesktopTextHidden(stepTexts[step.id]);
  }

  function applyDesktopStepInstant(stepIndex) {
    if (!intro) return;

    gsap.set(intro, { autoAlpha: 1, yPercent: 0, clearProps: "transform" });
    intro.removeAttribute("aria-hidden");
    hideAllStepTexts();

    FEATURES_INTRO_SCROLL_STEPS.forEach((step, index) => {
      if (index === stepIndex) {
        setDesktopStepVisible(step);
        return;
      }

      setDesktopStepHidden(step);
    });
  }

  function getDesktopPhoneEnterProgress(progress) {
    const enterDelay = FEATURES_INTRO_DESKTOP_PHONE_EXIT_FADE_END * 0.7;
    if (progress <= enterDelay) return 0;

    return Math.min(1, (progress - enterDelay) / (1 - enterDelay));
  }

  function applyDesktopStepTransition(currentStep, nextStep, progress) {
    if (!currentStep) return;

    const currentPhone = stepPhones[currentStep.id];
    const currentText = stepTexts[currentStep.id];
    const nextPhone = nextStep ? stepPhones[nextStep.id] : null;
    const nextText = nextStep ? stepTexts[nextStep.id] : null;
    const exitMoveT = progress;
    const exitFadeT = Math.min(1, progress / FEATURES_INTRO_DESKTOP_PHONE_EXIT_FADE_END);
    const enterT = getDesktopPhoneEnterProgress(progress);

    if (currentPhone) {
      setStepPhoneState(currentPhone, {
        alpha: nextPhone ? 1 - exitFadeT : 1,
        x: FEATURES_INTRO_DESKTOP_PHONE_EXIT_X * exitMoveT,
        y: 0,
        rotation: 0,
      });
    }

    if (currentText) {
      setStepTextState(currentText, {
        alpha: nextText ? 1 - exitFadeT : 1,
        visible: !nextText || exitFadeT < 1,
        hidden: nextText ? exitFadeT >= 0.5 : false,
      });
    }

    if (nextPhone) {
      setStepPhoneState(nextPhone, {
        alpha: enterT,
        x: 0,
        y: FEATURES_INTRO_DESKTOP_PHONE_ENTER_Y * (1 - enterT),
        rotation: 0,
      });
    }

    if (nextText) {
      setStepTextState(nextText, {
        alpha: enterT,
        visible: enterT > 0,
        hidden: enterT <= 0,
      });
    }
  }

  function resetDesktopLayers() {
    featuresIntroState.desktopStepIndex = 0;
    applyDesktopStepInstant(0);
  }

  function destroyFeaturesIntroDesktopScroll() {
    desktopScrollTrigger?.kill();
    desktopScrollTrigger = null;
    featuresIntroDesktopController = null;
    wrap?.classList.remove("is-features-intro-desktop-pin-active");
  }

  function scrollDesktopToStep(stepIndex) {
    if (!desktopScrollTrigger || prefersReducedMotion) return;

    scrollDesktopToProgress(getFeaturesIntroSnapProgress(stepIndex, snapProgressValues));
  }

  function scrollDesktopToProgress(progress) {
    if (!desktopScrollTrigger || prefersReducedMotion) return;

    const clampedProgress = Math.max(0, Math.min(1, progress));
    desktopScrollTrigger.scroll(
      desktopScrollTrigger.start + (desktopScrollTrigger.end - desktopScrollTrigger.start) * clampedProgress,
    );
  }

  function animateDesktopStepChange(fromIndex, toIndex) {
    if (fromIndex === toIndex || featuresIntroState.isAnimating) {
      applyDesktopStepInstant(toIndex);
      return;
    }

    if (Math.abs(toIndex - fromIndex) !== 1 || prefersReducedMotion) {
      applyDesktopStepInstant(toIndex);
      return;
    }

    const fromStep = FEATURES_INTRO_SCROLL_STEPS[fromIndex];
    const toStep = FEATURES_INTRO_SCROLL_STEPS[toIndex];
    const proxy = { progress: 0 };

    featuresIntroState.isAnimating = true;

    gsap.timeline({
      onComplete() {
        applyDesktopStepInstant(toIndex);
        featuresIntroState.isAnimating = false;
      },
    }).to(proxy, {
      progress: 1,
      duration: 0.65,
      ease: "power1.inOut",
      onUpdate() {
        applyDesktopStepTransition(fromStep, toStep, proxy.progress);
      },
    });
  }

  function applyDesktopStep(stepIndex, { animate = false } = {}) {
    if (!desktopQuery.matches || !intro) return;

    const step = Math.max(0, Math.min(FEATURES_INTRO_DESKTOP_STEP_COUNT - 1, stepIndex));
    const previousStep = featuresIntroState.desktopStepIndex;

    if (animate && previousStep !== step) {
      animateDesktopStepChange(previousStep, step);
    } else {
      applyDesktopStepInstant(step);
    }

    featuresIntroState.desktopStepIndex = step;
  }

  function syncDesktopStepFromScroll(self) {
    if (!desktopQuery.matches || featuresIntroState.isAnimating) return;

    const step = getFeaturesIntroStepFromProgress(self.progress, snapProgressValues);

    if (step === featuresIntroState.desktopStepIndex) return;

    const previousStep = featuresIntroState.desktopStepIndex;
    featuresIntroState.desktopStepIndex = step;

    if (Math.abs(step - previousStep) === 1 && !prefersReducedMotion) {
      animateDesktopStepChange(previousStep, step);
      return;
    }

    applyDesktopStepInstant(step);
  }

  function buildFeaturesIntroDesktopScroll() {
    destroyFeaturesIntroDesktopScroll();
    resetDesktopLayers();

    if (!desktopQuery.matches || !wrap || !pinShell || !intro) {
      featuresIntroDesktopController = { rebuild: buildFeaturesIntroDesktopScroll, applyStep: applyDesktopStep, scrollToStep: scrollDesktopToStep };
      return;
    }

    applyDesktopStep(featuresIntroState.desktopStepIndex, { animate: false });

    desktopScrollTrigger = ScrollTrigger.create({
      id: "features-intro-desktop-scroll",
      trigger: wrap,
      start: "top top",
      end: () => `+=${window.innerHeight * FEATURES_INTRO_DESKTOP_PIN_VIEWPORTS}`,
      pin: pinShell,
      pinSpacing: true,
      anticipatePin: 0,
      invalidateOnRefresh: true,
      snap: {
        snapTo(progress) {
          return nearestClubSelectorSnap(progress, snapProgressValues);
        },
        duration: { min: 0.15, max: 0.5 },
        delay: 0.08,
        ease: "power1.inOut",
      },
      onToggle(self) {
        wrap.classList.toggle("is-features-intro-desktop-pin-active", self.isActive);

        if (!self.isActive && self.direction < 0) {
          resetDesktopLayers();
        }
      },
      onUpdate: syncDesktopStepFromScroll,
      onSnapComplete: syncDesktopStepFromScroll,
    });

    featuresIntroDesktopController = {
      scrollTrigger: desktopScrollTrigger,
      rebuild: buildFeaturesIntroDesktopScroll,
      applyStep: applyDesktopStep,
      scrollToStep: scrollDesktopToStep,
    };
  }

  featuresIntroDesktopController = {
    rebuild: buildFeaturesIntroDesktopScroll,
    applyStep: applyDesktopStep,
    scrollToStep: scrollDesktopToStep,
  };
}

function bootFeaturesIntroMobilePin() {
  if (prefersReducedMotion || !window.gsap || !window.ScrollTrigger) return;

  const wrap = document.querySelector("#sl-features-intro");
  const pinShell = document.querySelector("#sl-features-intro-pin-shell");
  const intro = document.querySelector("#sl-features-intro-copy");
  const mobileQuery = window.matchMedia("(max-width: 980px)");
  const snapProgressValues = buildFeaturesIntroSnapValues(FEATURES_INTRO_MOBILE_STEP_COUNT);

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

  const stepPhoneLayers = Object.fromEntries(
    FEATURES_INTRO_SCROLL_STEPS.map((step) => [
      step.id,
      wrap?.querySelector(`.sl-features-step-phone[data-feature-step="${step.id}"]`) ?? null,
    ]),
  );

  let mobileScrollTrigger = null;

  function resetMobilePhoneShells() {
    Object.values(stepPhones).forEach((phone) => {
      if (!phone) return;
      gsap.set(phone, { x: 0, y: 0, rotation: 0, clearProps: "transform" });
    });
  }

  function resetMobilePhoneLayers() {
    Object.values(stepPhoneLayers).forEach((layer) => {
      if (!layer) return;
      gsap.set(layer, { clearProps: "opacity,visibility,transform" });
    });
  }

  function setStepTextState(
    textEl,
    { alpha = 0, yPercent = 0, visible = false, hidden = true } = {},
  ) {
    if (!textEl) return;

    gsap.set(textEl, { autoAlpha: alpha, yPercent, y: 0 });
    textEl.classList.toggle("is-features-intro-text-visible", visible);
    textEl.setAttribute("aria-hidden", hidden ? "true" : "false");
  }

  function setStepPhoneState(phoneEl, layerEl, { alpha = 0, x = 0, rotation = 0 } = {}) {
    if (layerEl) {
      layerEl.setAttribute("aria-hidden", alpha > 0 ? "false" : "true");
    }

    if (!phoneEl) return;

    gsap.set(phoneEl, { autoAlpha: alpha, x, y: 0, rotation });
  }

  function hideAllStepTexts() {
    FEATURES_INTRO_SCROLL_STEPS.forEach((step) => {
      setStepTextState(stepTexts[step.id], { alpha: 0, yPercent: 0, visible: false, hidden: true });
    });
  }

  function resetStepPhonesForMobile() {
    resetMobilePhoneLayers();
    resetMobilePhoneShells();

    FEATURES_INTRO_SCROLL_STEPS.forEach((step, index) => {
      const phone = stepPhones[step.id];
      const layer = stepPhoneLayers[step.id];
      if (index === 0) {
        setStepPhoneState(phone, layer, { alpha: 1, x: 0, rotation: 0 });
        return;
      }

      const enter = getFeaturesIntroPhoneEnterOffset(step.enterFrom);
      setStepPhoneState(phone, layer, { alpha: 0, x: enter.x, rotation: enter.rotation });
    });
  }

  function setIntroLayoutHidden(hidden) {
    if (!intro) return;

    intro.style.position = hidden ? "absolute" : "";
    intro.style.inset = hidden ? "0 0 auto 0" : "";
    intro.style.width = hidden ? "100%" : "";
  }

  function applyMobileIntroStep() {
    wrap?.classList.remove("is-features-intro-steps-active");
    setIntroLayoutHidden(false);
    gsap.set(intro, { yPercent: 0, autoAlpha: 1, y: 0, clearProps: "transform" });
    intro.removeAttribute("aria-hidden");
    hideAllStepTexts();
    resetStepPhonesForMobile();
  }

  function applyMobileFeatureStep(featureIndex) {
    const step = FEATURES_INTRO_SCROLL_STEPS[featureIndex];
    if (!step) return;

    wrap?.classList.add("is-features-intro-steps-active");
    setIntroLayoutHidden(true);
    gsap.set(intro, { yPercent: -100, autoAlpha: 0 });
    intro.setAttribute("aria-hidden", "true");
    hideAllStepTexts();
    setStepTextState(stepTexts[step.id], { alpha: 1, yPercent: 0, visible: true, hidden: false });

    FEATURES_INTRO_SCROLL_STEPS.forEach((entry, index) => {
      const phone = stepPhones[entry.id];
      const layer = stepPhoneLayers[entry.id];
      if (index === featureIndex) {
        setStepPhoneState(phone, layer, { alpha: 1, x: 0, rotation: 0 });
        return;
      }

      const enter = getFeaturesIntroPhoneEnterOffset(entry.enterFrom);
      setStepPhoneState(phone, layer, { alpha: 0, x: enter.x, rotation: enter.rotation });
    });
  }

  function applyMobileStepInstant(stepIndex) {
    if (stepIndex <= 0) {
      applyMobileIntroStep();
      return;
    }

    applyMobileFeatureStep(stepIndex - 1);
  }

  function applyPhoneTransition(currentStep, nextStep, progress) {
    if (!currentStep) return;

    const currentPhone = stepPhones[currentStep.id];
    const nextPhone = nextStep ? stepPhones[nextStep.id] : null;
    const currentLayer = stepPhoneLayers[currentStep.id];
    const nextLayer = nextStep ? stepPhoneLayers[nextStep.id] : null;
    const nextEnter = nextStep ? getFeaturesIntroPhoneEnterOffset(nextStep.enterFrom) : { x: 0, rotation: 0 };
    const currentExit = getFeaturesIntroPhoneEnterOffset(
      currentStep.enterFrom === "right" ? "left" : currentStep.enterFrom === "left" ? "right" : "left",
    );

    if (currentPhone) {
      setStepPhoneState(currentPhone, currentLayer, {
        alpha: nextPhone ? 1 - progress : 1,
        x: (currentExit.x / 3) * progress,
        rotation: (currentExit.rotation / 2) * progress,
      });
    }

    if (nextPhone) {
      setStepPhoneState(nextPhone, nextLayer, {
        alpha: progress,
        x: nextEnter.x * (1 - progress),
        rotation: nextEnter.rotation * (1 - progress),
      });
    }
  }

  function animateMobileStepChange(fromIndex, toIndex) {
    if (fromIndex === toIndex || featuresIntroState.isAnimating) {
      applyMobileStepInstant(toIndex);
      return;
    }

    if (Math.abs(toIndex - fromIndex) !== 1 || prefersReducedMotion) {
      applyMobileStepInstant(toIndex);
      return;
    }

    featuresIntroState.isAnimating = true;

    if (fromIndex === 0 && toIndex === 1) {
      const firstStep = FEATURES_INTRO_SCROLL_STEPS[0];

      wrap?.classList.add("is-features-intro-steps-active");
      setIntroLayoutHidden(true);
      hideAllStepTexts();

      gsap.timeline({
        onComplete() {
          applyMobileStepInstant(toIndex);
          featuresIntroState.isAnimating = false;
        },
      })
        .to(intro, { yPercent: -100, autoAlpha: 0, duration: 0.5, ease: "power1.inOut" })
        .call(() => {
          intro.setAttribute("aria-hidden", "true");
        })
        .fromTo(
          stepTexts[firstStep.id],
          { autoAlpha: 0, yPercent: 0 },
          { autoAlpha: 1, yPercent: 0, duration: 0.45, ease: "power2.out" },
          "-=0.2",
        );

      return;
    }

    if (fromIndex === 1 && toIndex === 0) {
      gsap.timeline({
        onComplete() {
          applyMobileStepInstant(toIndex);
          featuresIntroState.isAnimating = false;
        },
      })
        .to(intro, { yPercent: 0, autoAlpha: 1, duration: 0.45, ease: "power2.out" })
        .call(() => {
          intro.removeAttribute("aria-hidden");
          wrap?.classList.remove("is-features-intro-steps-active");
          setIntroLayoutHidden(false);
          hideAllStepTexts();
          resetStepPhonesForMobile();
        });

      return;
    }

    const fromStep = FEATURES_INTRO_SCROLL_STEPS[fromIndex - 1];
    const toStep = FEATURES_INTRO_SCROLL_STEPS[toIndex - 1];
    const fromText = stepTexts[fromStep.id];
    const toText = stepTexts[toStep.id];
    const proxy = { progress: 0 };

    wrap?.classList.add("is-features-intro-steps-active");
    setIntroLayoutHidden(true);
    gsap.set(intro, { yPercent: -100, autoAlpha: 0 });
    intro.setAttribute("aria-hidden", "true");

    gsap.timeline({
      onComplete() {
        applyMobileStepInstant(toIndex);
        featuresIntroState.isAnimating = false;
      },
    })
      .to(fromText, { autoAlpha: 0, yPercent: -100, duration: 0.35, ease: "power1.inOut" })
      .fromTo(
        toText,
        { autoAlpha: 0, yPercent: 0 },
        { autoAlpha: 1, yPercent: 0, duration: 0.35, ease: "power2.out" },
        "-=0.15",
      )
      .to(
        proxy,
        {
          progress: 1,
          duration: 0.55,
          ease: "power1.inOut",
          onUpdate() {
            applyPhoneTransition(fromStep, toStep, Math.min(1, proxy.progress * 1.25));
          },
        },
        0,
      );
  }

  function applyMobileStep(stepIndex, { animate = false } = {}) {
    if (!mobileQuery.matches || !intro) return;

    const step = Math.max(0, Math.min(FEATURES_INTRO_MOBILE_STEP_COUNT - 1, stepIndex));
    const previousStep = featuresIntroState.mobileStepIndex;

    if (animate && previousStep !== step) {
      animateMobileStepChange(previousStep, step);
    } else {
      applyMobileStepInstant(step);
    }

    featuresIntroState.mobileStepIndex = step;
  }

  function resetLayers() {
    featuresIntroState.mobileStepIndex = 0;
    applyMobileIntroStep();
  }

  function destroyFeaturesIntroScroll() {
    mobileScrollTrigger?.kill();
    mobileScrollTrigger = null;
    featuresIntroMobileController = null;
    wrap?.classList.remove("is-features-intro-pin-active");
    wrap?.classList.remove("is-features-intro-steps-active");
  }

  function scrollMobileToStep(stepIndex) {
    if (!mobileScrollTrigger || prefersReducedMotion) return;

    scrollMobileToProgress(getFeaturesIntroSnapProgress(stepIndex, snapProgressValues));
  }

  function scrollMobileToProgress(progress) {
    if (!mobileScrollTrigger || prefersReducedMotion) return;

    const clampedProgress = Math.max(0, Math.min(1, progress));
    mobileScrollTrigger.scroll(
      mobileScrollTrigger.start + (mobileScrollTrigger.end - mobileScrollTrigger.start) * clampedProgress,
    );
  }

  function syncMobileStepFromScroll(self) {
    if (!mobileQuery.matches || featuresIntroState.isAnimating) return;

    const step = getFeaturesIntroStepFromProgress(self.progress, snapProgressValues);

    if (step === featuresIntroState.mobileStepIndex) return;

    const previousStep = featuresIntroState.mobileStepIndex;
    featuresIntroState.mobileStepIndex = step;

    if (Math.abs(step - previousStep) === 1 && !prefersReducedMotion) {
      animateMobileStepChange(previousStep, step);
      return;
    }

    applyMobileStepInstant(step);
  }

  function buildFeaturesIntroScroll() {
    destroyFeaturesIntroScroll();
    resetLayers();
    resetMobilePhoneLayers();
    resetMobilePhoneShells();

    if (!mobileQuery.matches || !wrap || !pinShell || !intro) {
      featuresIntroMobileController = { rebuild: buildFeaturesIntroScroll, applyStep: applyMobileStep, scrollToStep: scrollMobileToStep };
      return;
    }

    applyMobileStep(featuresIntroState.mobileStepIndex, { animate: false });

    mobileScrollTrigger = ScrollTrigger.create({
      id: "features-intro-scroll",
      trigger: wrap,
      start: "top top",
      end: () => `+=${window.innerHeight * FEATURES_INTRO_MOBILE_PIN_VIEWPORTS}`,
      pin: pinShell,
      pinSpacing: true,
      anticipatePin: 0,
      invalidateOnRefresh: true,
      snap: {
        snapTo(progress) {
          return nearestClubSelectorSnap(progress, snapProgressValues);
        },
        duration: { min: 0.15, max: 0.5 },
        delay: 0.08,
        ease: "power1.inOut",
      },
      onToggle(self) {
        wrap.classList.toggle("is-features-intro-pin-active", self.isActive);

        if (!self.isActive && self.direction < 0) {
          resetLayers();
        }
      },
      onUpdate: syncMobileStepFromScroll,
      onSnapComplete: syncMobileStepFromScroll,
    });

    featuresIntroMobileController = {
      scrollTrigger: mobileScrollTrigger,
      rebuild: buildFeaturesIntroScroll,
      applyStep: applyMobileStep,
      scrollToStep: scrollMobileToStep,
    };
  }

  featuresIntroMobileController = {
    rebuild: buildFeaturesIntroScroll,
    applyStep: applyMobileStep,
    scrollToStep: scrollMobileToStep,
  };
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

function buildPhoneStatusBarMarkup({ state = "" } = {}) {
  const stateClass = state ? ` is-${state}-state` : "";

  return `
    <div class="sl-phone-status-bar${stateClass}" aria-hidden="true">
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

const CLUB_SELECTOR_STORY_APP = {
  width: 390,
  height: 702,
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

function computeClubAppScale(availableWidth, availableHeight, fit = "contain") {
  if (availableWidth <= 0 || availableHeight <= 0) return 1;

  const scaleX = availableWidth / CLUB_SELECTOR_APP.width;
  const scaleY = availableHeight / CLUB_SELECTOR_APP.height;

  return fit === "cover" ? Math.max(scaleX, scaleY) : Math.min(scaleX, scaleY);
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

function getClubStoryPhoneScalerSize(screen) {
  const scaler = screen?.querySelector(".sl-club-story-app-scaler");
  if (!scaler || !screen) return { width: 0, height: 0 };

  const rect = scaler.getBoundingClientRect();
  if (rect.width > 1 && rect.height > 1) {
    return { width: rect.width, height: rect.height };
  }

  const screenRect = screen.getBoundingClientRect();
  if (screenRect.width <= 0 || screenRect.height <= 0) {
    return { width: 0, height: 0 };
  }

  const styles = getComputedStyle(screen);
  const safeTopMatch = styles.getPropertyValue("--phone-safe-top").trim().match(/^([\d.]+)%$/);
  const safeBottomMatch = styles.getPropertyValue("--phone-safe-bottom").trim().match(/^([\d.]+)%$/);
  const safeTop = safeTopMatch ? Number.parseFloat(safeTopMatch[1]) : 7.5;
  const safeBottom = safeBottomMatch ? Number.parseFloat(safeBottomMatch[1]) : 5.5;
  const safeTopPx = (safeTop / 100) * screenRect.height;
  const safeBottomPx = (safeBottom / 100) * screenRect.height;

  return {
    width: screenRect.width,
    height: Math.max(0, screenRect.height - safeTopPx - safeBottomPx),
  };
}

function getClubSelectorAppScaleFit() {
  return window.matchMedia("(max-width: 980px)").matches ? "cover" : "contain";
}

function applyClubAppScale(scaler, viewport, availableWidth, availableHeight, fit = "contain") {
  if (!scaler || !viewport) return;

  const scale = computeClubAppScale(availableWidth, availableHeight, fit);
  viewport.style.setProperty("--sl-app-scale", String(scale));

  if (fit === "cover") {
    scaler.style.height = "100%";
  } else {
    scaler.style.height = `${CLUB_SELECTOR_APP.height * scale}px`;
  }
}

function applyStoryPhoneScale(scaler, viewport, availableWidth, availableHeight) {
  if (!scaler || !viewport || availableWidth <= 0) return;

  const scale = availableWidth / CLUB_SELECTOR_STORY_APP.width;
  const slot = scaler.querySelector(".sl-club-story-app-scale-slot");
  const screen = scaler.closest(".sl-club-selector-story-phone-screen");
  const designHeight =
    availableHeight > 0 ? availableHeight / scale : CLUB_SELECTOR_STORY_APP.height;

  viewport.style.setProperty("--sl-app-scale", String(scale));
  viewport.style.height = `${designHeight}px`;
  viewport.style.left = "0px";

  if (screen) {
    screen.style.setProperty("--sl-app-scale", String(scale));
  }

  if (slot) {
    slot.style.width = "100%";
    slot.style.height = "100%";
  }

  scaler.style.removeProperty("height");
  scaler.style.removeProperty("width");
}

function syncClubSelectorAppViewport() {
  const scaler = document.querySelector("#sl-club-selector-app-scaler");
  const viewport = document.querySelector("#sl-club-selector-app-viewport");

  if (!scaler || !viewport) return;

  const { width, height } = getScalerAvailableSize(scaler);
  applyClubAppScale(scaler, viewport, width, height, getClubSelectorAppScaleFit());
}

function scheduleStoryPhoneScaleSync(screen, attempts = 3) {
  if (!screen || attempts <= 0) return;

  syncClubStoryPhoneScaleForScreen(screen);

  if (attempts > 1) {
    window.requestAnimationFrame(() => {
      syncClubStoryPhoneScaleForScreen(screen);
      window.setTimeout(() => scheduleStoryPhoneScaleSync(screen, attempts - 1), 100);
    });
  }
}

function syncClubStoryPhoneScaleForScreen(screen) {
  const scaler = screen?.querySelector(".sl-club-story-app-scaler");
  const viewport = screen?.querySelector(".sl-app-home-viewport");

  if (!scaler || !viewport) return;

  const { width, height } = getClubStoryPhoneScalerSize(screen);
  if (width <= 1 || height <= 1) {
    window.requestAnimationFrame(() => syncClubStoryPhoneScaleForScreen(screen));
    return;
  }

  applyStoryPhoneScale(scaler, viewport, width, height);
}

function syncClubSelectorPhoneScales() {
  syncClubSelectorAppViewport();

  const storyScreen = document.querySelector(".sl-club-selector-story-phone-screen[data-club-story-feed]");
  if (storyScreen) {
    syncClubStoryPhoneScaleForScreen(storyScreen);
  }
}

function bootClubSelectorAppViewport() {
  const sync = () => syncClubSelectorPhoneScales();
  sync();

  const sharedPhone = document.querySelector("#sl-club-selector-shared-phone");
  const pickScreen = document.querySelector(".sl-club-selector-pick-screen");
  const storyScreen = document.querySelector(".sl-club-selector-story-phone-screen[data-club-story-feed]");
  const pickScaler = document.querySelector("#sl-club-selector-app-scaler");
  const storyScaler = storyScreen?.querySelector(".sl-club-story-app-scaler");

  if (window.ResizeObserver) {
    const observer = new ResizeObserver(sync);
    if (sharedPhone) observer.observe(sharedPhone);
    if (pickScreen) observer.observe(pickScreen);
    if (storyScreen) observer.observe(storyScreen);
    if (pickScaler) observer.observe(pickScaler);
    if (storyScaler) observer.observe(storyScaler);
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
const CLUB_STORY_LIVE_STEP_INDEX = 0;
const STORY_PHONE_TOP_STORIES_LIMIT = 8;
const STORY_PHONE_PODCASTS_LIMIT = 8;
const STORY_PHONE_VIDEOS_LIMIT = 7;

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
  if (!clubSelectorState.storyUnlocked) return 0;

  return getClubSelectorStoryStepProgress(clubSelectorState.currentStoryStep);
}

const CLUB_SELECTOR_PICK_SCROLL_VIEWPORTS = 0.5;
const CLUB_SELECTOR_STORY_SCROLL_VIEWPORTS = 3;
const CLUB_SELECTOR_TOTAL_SCROLL_VIEWPORTS =
  CLUB_SELECTOR_PICK_SCROLL_VIEWPORTS + CLUB_SELECTOR_STORY_SCROLL_VIEWPORTS;
const CLUB_SELECTOR_PICK_PROGRESS_CAP =
  CLUB_SELECTOR_PICK_SCROLL_VIEWPORTS / CLUB_SELECTOR_TOTAL_SCROLL_VIEWPORTS;

function getClubSelectorStoryProgressSpan(stepCount = CLUB_STORY_STEP_COUNT) {
  return (1 - CLUB_SELECTOR_PICK_PROGRESS_CAP) / stepCount;
}

function getClubSelectorStoryStepProgress(stepIndex, stepCount = CLUB_STORY_STEP_COUNT) {
  return CLUB_SELECTOR_PICK_PROGRESS_CAP + getClubSelectorStoryProgressSpan(stepCount) * stepIndex;
}

function getClubSelectorStoryStepFromProgress(progress, stepCount = CLUB_STORY_STEP_COUNT) {
  if (progress < CLUB_SELECTOR_PICK_PROGRESS_CAP) return 0;

  let bestStep = 0;
  let bestDistance = Infinity;

  for (let index = 0; index < stepCount; index += 1) {
    const stepProgress = getClubSelectorStoryStepProgress(index, stepCount);
    const distance = Math.abs(progress - stepProgress);

    if (distance < bestDistance) {
      bestDistance = distance;
      bestStep = index;
    }
  }

  return bestStep;
}

function nearestClubSelectorSnap(progress, snapValues) {
  return snapValues.reduce((nearest, value) =>
    Math.abs(value - progress) < Math.abs(nearest - progress) ? value : nearest,
  );
}

function buildClubSelectorSnapValues(stepCount = CLUB_STORY_STEP_COUNT) {
  const values = [0];

  for (let index = 0; index < stepCount; index += 1) {
    values.push(getClubSelectorStoryStepProgress(index, stepCount));
  }

  return values;
}

const CLUB_STORY_APP_ASSETS = {
  profile: "assets/app/Profile-Icon-1.png",
  logo: "assets/app/Sideline-Logo-White.png",
  sidebar: "assets/app/Sidebar-Icon.png",
  filter: "assets/app/Filter-Icon.png",
  search: "assets/app/Search-Icon.png",
  footerHome: "assets/app/Home-Icon-Selected.png",
  footerMatches: "assets/app/Matches-Icon.png",
  footerAlerts: "assets/app/Notification-Icon.png",
  footerMore: "assets/app/More-Icon.png",
};

function buildAppFooterIconMarkup(src) {
  return `<img class="sl-app-home-footer-icon" src="${src}" alt="" width="35" height="24" aria-hidden="true" />`;
}

const APP_FOOTER_HOME_ICON = buildAppFooterIconMarkup(CLUB_STORY_APP_ASSETS.footerHome);
const APP_FOOTER_MATCHES_ICON = buildAppFooterIconMarkup(CLUB_STORY_APP_ASSETS.footerMatches);
const APP_FOOTER_ALERTS_ICON = buildAppFooterIconMarkup(CLUB_STORY_APP_ASSETS.footerAlerts);
const APP_FOOTER_MORE_ICON = buildAppFooterIconMarkup(CLUB_STORY_APP_ASSETS.footerMore);

const APP_FOOTER_CLUB_ICON = `<span class="sl-app-home-footer-club-mark">S</span>`;

function buildAppFooterNavigationMarkup() {
  return `
    <div class="sl-app-home-footer" id="app-footer-navigation" data-testid="app-footer-navigation" aria-hidden="true">
      <div class="sl-app-home-footer-inner">
        <div class="sl-app-home-footer-item is-active" data-testid="app-footer-nav-home">
          <div class="sl-app-home-footer-icon-wrap" data-testid="footer-nav-home">
            ${APP_FOOTER_HOME_ICON}
          </div>
          <span class="sl-app-home-footer-label">HOME</span>
        </div>
        <div class="sl-app-home-footer-item" data-testid="app-footer-nav-matches">
          <div class="sl-app-home-footer-icon-wrap" data-testid="footer-nav-matches">
            ${APP_FOOTER_MATCHES_ICON}
          </div>
          <span class="sl-app-home-footer-label">MATCHES</span>
        </div>
        <div class="sl-app-home-footer-item sl-app-home-footer-item--club" data-testid="app-footer-nav-club">
          <div class="sl-app-home-footer-club-badge" data-testid="footer-nav-club">
            ${APP_FOOTER_CLUB_ICON}
          </div>
          <span class="sl-app-home-footer-label">CLUB</span>
        </div>
        <div class="sl-app-home-footer-item" data-testid="app-footer-nav-messages">
          <div class="sl-app-home-footer-icon-wrap" data-testid="footer-nav-alerts">
            ${APP_FOOTER_ALERTS_ICON}
          </div>
          <span class="sl-app-home-footer-label">ALERTS</span>
        </div>
        <div class="sl-app-home-footer-item" data-testid="app-footer-nav-more">
          <div class="sl-app-home-footer-icon-wrap" data-testid="footer-nav-more">
            ${APP_FOOTER_MORE_ICON}
          </div>
          <span class="sl-app-home-footer-label">MORE</span>
        </div>
      </div>
    </div>
  `;
}

const PODCAST_HEADSET_ICON = `<svg class="sl-app-podcast-headset-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="M12 1a9 9 0 0 0-9 9v7c0 1.66 1.34 3 3 3h1v-8H5a7 7 0 0 1 14 0h-2v8h1c1.66 0 3-1.34 3-3v-7a9 9 0 0 0-9-9zm-3 17h6v2H9v-2z"/></svg>`;

const PODCAST_PLAY_ICON = `<svg class="sl-app-podcast-play-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="M8 5v14l11-7z"/></svg>`;

const PODCAST_MIC_ICON = `<svg class="sl-app-podcast-mic-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="M12 14a3 3 0 0 0 3-3V5a3 3 0 1 0-6 0v6a3 3 0 0 0 3 3zm5-3a5 5 0 0 1-10 0H5a7 7 0 0 0 6 6.92V21h2v-3.08A7 7 0 0 0 19 11h-2z"/></svg>`;

function buildPodcastsLoadingMarkup() {
  return `
    <section class="sl-app-podcasts-feed sl-app-podcasts-feed--loading" id="content-section-recent-episodes" data-testid="recent-episodes-section" aria-label="recent-episodes-section">
      <div class="sl-app-top-stories-loading" data-testid="recent-episodes-loading" aria-live="polite">
        <span class="sl-app-top-stories-loading-spinner" aria-hidden="true"></span>
        <span class="sl-app-top-stories-loading-text">Loading podcasts…</span>
      </div>
    </section>
  `;
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
  if (tweet.isProfileFallback) {
    return `
      <article class="sl-club-story-tweet sl-club-story-tweet--profile" data-tweet-id="${escapeHtml(tweet.id)}">
        <div class="sl-club-story-tweet-body">${tweet.html}</div>
      </article>
    `;
  }

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
    await twttr.widgets.load(container, { width: 390 });

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

async function loadPodcastsForClub(code) {
  if (!code || !window.SideLineAPI?.fetchPodcastsForClub) return;
  if (podcastsLoadingCode === code || code in podcastsCache) return;

  podcastsLoadingCode = code;
  updateClubStoryFeedSection(1, code);

  try {
    const feed = await window.SideLineAPI.fetchPodcastsForClub(code, { perPage: STORY_PHONE_PODCASTS_LIMIT });
    if (feed.episodes?.length) {
      podcastsCache[code] = feed;
    }
  } catch (error) {
    console.warn("Podcasts fetch failed:", error);
  } finally {
    if (podcastsLoadingCode === code) {
      podcastsLoadingCode = null;
    }
    if (!(code in podcastsCache)) {
      podcastsCache[code] = { sectionTitle: "Recent Podcasts", episodes: [], seeMoreLabel: "See more" };
    }
    updateClubStoryFeedSection(1, code);
  }
}

async function loadSocialFeedForClub(code) {
  if (!code || !window.SideLineAPI?.fetchSocialFeedForClub) return;

  const cacheKey = getSocialFeedCacheKey(code);
  if (socialFeedLoadingCode === code || cacheKey in socialFeedCache) return;

  socialFeedLoadingCode = code;
  updateClubStorySocialStage(code);

  try {
    const feed = await window.SideLineAPI.fetchSocialFeedForClub(code, { perPage: 5, minTweets: 2 });
    socialFeedCache[cacheKey] = feed;
  } catch (error) {
    console.warn("Social feed fetch failed:", error);
  } finally {
    if (socialFeedLoadingCode === code) {
      socialFeedLoadingCode = null;
    }
    if (!(cacheKey in socialFeedCache)) {
      socialFeedCache[cacheKey] = { tweets: [] };
    }
    updateClubStorySocialStage(code);
  }
}

async function loadVideosForClub(code) {
  if (!code || !window.SideLineAPI?.fetchVideosForClub) return;
  if (videosLoadingCode === code || code in videosCache) return;

  videosLoadingCode = code;
  updateClubStoryFeedSection(2, code);

  try {
    const feed = await window.SideLineAPI.fetchVideosForClub(code, { perPage: STORY_PHONE_VIDEOS_LIMIT });
    videosCache[code] = feed;
  } catch (error) {
    console.warn("Videos fetch failed:", error);
  } finally {
    if (videosLoadingCode === code) {
      videosLoadingCode = null;
    }
    if (!(code in videosCache)) {
      videosCache[code] = { videos: [], seeMoreLabel: "See more" };
    }
    updateClubStoryFeedSection(2, code);
  }
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
  if (topStoriesLoadingCode === code || code in topStoriesCache) return;

  topStoriesLoadingCode = code;
  updateClubStoryFeedSection(0, code);

  try {
    const feed = await window.SideLineAPI.fetchTopStories(code, {
      teamColor: getClubPrimaryColor(code),
      teamAbbrev: getTopStoriesTeamAbbrev(code),
      limit: STORY_PHONE_TOP_STORIES_LIMIT,
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
    if (!(code in topStoriesCache)) {
      topStoriesCache[code] = { items: [], seeMoreLabel: "See more" };
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
    if (topStoriesLoadingCode === clubCode || !(clubCode && clubCode in topStoriesCache)) {
      return buildTopStoriesLoadingMarkup();
    }

    return buildTopStoriesFeedMarkup(topStoriesCache[clubCode]);
  }

  if (stepIndex === 1) {
    if (podcastsLoadingCode === clubCode || !(clubCode && clubCode in podcastsCache)) {
      return buildPodcastsLoadingMarkup();
    }

    return buildPodcastsFeedMarkup(podcastsCache[clubCode]);
  }

  if (stepIndex === 2) {
    if (videosLoadingCode === clubCode || !(clubCode && clubCode in videosCache)) {
      return buildVideosLoadingMarkup();
    }

    return buildVideosFeedMarkup(videosCache[clubCode]);
  }

  if (stepIndex === 3) {
    const cacheKey = getSocialFeedCacheKey(clubCode);
    if (socialFeedLoadingCode === clubCode || !(clubCode && cacheKey in socialFeedCache)) {
      return buildSocialFeedLoadingMarkup();
    }

    return buildSocialFeedMarkup(socialFeedCache[cacheKey]);
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
    ${buildPhoneStatusBarMarkup({ state: "story" })}
    <div class="sl-app-scaler sl-club-story-app-scaler">
      <div class="sl-club-story-app-scale-slot">
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
    </div>
    ${buildAppFooterNavigationMarkup()}
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
    scheduleStoryPhoneScaleSync(getClubStoryPhoneRoot());
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

  scheduleStoryPhoneScaleSync(getClubStoryPhoneRoot());
}

function renderClubStoryPhoneFeed(
  clubCode = clubSelectorState.selectedCode,
  { preserveScroll = true, enableFeedScroll = false } = {},
) {
  const screen = document.querySelector(".sl-club-selector-story-phone-screen[data-club-story-feed]");
  if (!screen) return;

  const feed = getClubStoryPhoneFeed();
  const scrollTop = preserveScroll ? (feed?.scrollTop ?? 0) : 0;

  screen.dataset.clubStoryFeed = "combined";
  screen.dataset.liveStep = String(clubSelectorState.currentStoryStep ?? CLUB_STORY_LIVE_STEP_INDEX);
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

  scheduleStoryPhoneScaleSync(screen);
  syncStoryPhoneLiveView(clubSelectorState.currentStoryStep ?? CLUB_STORY_LIVE_STEP_INDEX);
  prefetchAllStoryPhoneFeeds(clubCode);
  window.requestAnimationFrame(() => {
    destroyClubStoryPhoneFeedScroll();

    const feedEl = getClubStoryPhoneFeed();
    if (feedEl) {
      feedEl.scrollTop = 0;
    }

    if (enableFeedScroll) {
      initClubStoryPhoneFeedScroll();
    }
  });
}

function ensureStoryPhoneFeed(clubCode = clubSelectorState.selectedCode) {
  if (!clubCode) return;

  const screen = getClubStoryPhoneRoot();
  if (!screen?.innerHTML.trim() || screen.dataset.clubStoryFeed !== "combined") {
    renderClubStoryPhoneFeed(clubCode, { preserveScroll: false });
    return;
  }

  syncStoryPhoneLiveView(clubSelectorState.currentStoryStep ?? CLUB_STORY_LIVE_STEP_INDEX);
}

function syncStoryPhoneLiveView(stepIndex) {
  const screen = getClubStoryPhoneRoot();
  if (!screen) return;

  const normalizedStep = Math.max(0, Math.min(CLUB_STORY_STEP_COUNT - 1, stepIndex));
  screen.dataset.liveStep = String(normalizedStep);

  const feed = getClubStoryPhoneFeed();
  const stage = getClubStorySocialStage();
  const isSocialStep = normalizedStep === CLUB_STORY_SOCIAL_STEP_INDEX;

  clubStoryPhoneScroll.socialActive = isSocialStep;
  clubStoryPhoneScroll.pendingFeedStep = null;

  if (feed) {
    feed.hidden = isSocialStep;
    feed.style.opacity = "";
    feed.classList.remove("is-fading-out", "is-fading-in", "is-fading-in-active");
    feed.scrollTop = 0;
  }

  if (stage) {
    stage.hidden = !isSocialStep;
    stage.style.opacity = "";
    stage.classList.toggle("is-visible", isSocialStep);
    stage.classList.remove("is-fading-out", "is-entering");
  }

  setHomeFeedToggle(isSocialStep ? "social" : "trending");
}

function ensureStoryPhoneFeedForStep(
  stepIndex,
  clubCode = clubSelectorState.selectedCode,
) {
  if (!clubCode) return;

  ensureStoryPhoneFeed(clubCode);
  syncStoryPhoneLiveView(stepIndex);
  prefetchAllStoryPhoneFeeds(clubCode);
  scheduleStoryPhoneScaleSync(getClubStoryPhoneRoot());
}

let storyPhonePrefetchClubCode = null;

function prefetchAllStoryPhoneFeeds(clubCode = clubSelectorState.selectedCode) {
  if (!clubCode) return;
  if (storyPhonePrefetchClubCode === clubCode) return;

  storyPhonePrefetchClubCode = clubCode;

  void loadTopStoriesForClub(clubCode);
  void loadPodcastsForClub(clubCode);
  void loadVideosForClub(clubCode);
  void loadSocialFeedForClub(clubCode);
}

function refreshTopStoriesPhoneFeed(clubCode = clubSelectorState.selectedCode) {
  void loadTopStoriesForClub(clubCode);
}

function refreshPodcastsPhoneFeed(clubCode = clubSelectorState.selectedCode) {
  void loadPodcastsForClub(clubCode);
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
  document.querySelector("#sl-club-selector-app-viewport")?.style.setProperty("--club-primary", hex);

  document.querySelectorAll(".sl-app-home-viewport").forEach((viewport) => {
    viewport.style.setProperty("--club-primary", hex);
  });
}

function bootClubStoryPhoneViewports() {
  const storyScreen = document.querySelector(".sl-club-selector-story-phone-screen[data-club-story-feed]");
  if (!storyScreen) return;

  const sync = () => syncClubStoryPhoneScaleForScreen(storyScreen);
  sync();
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
  currentStoryStep: 0,
  headlines: [],
};

const topStoriesCache = {};
let topStoriesLoadingCode = null;

const podcastsCache = {};
let podcastsLoadingCode = null;

const videosCache = {};
let videosLoadingCode = null;

const socialFeedCache = {};
let socialFeedLoadingCode = null;
const SOCIAL_FEED_CACHE_VERSION = 4;

function getSocialFeedCacheKey(code) {
  return `${code}:v${SOCIAL_FEED_CACHE_VERSION}`;
}

let clubSelectorPinController = null;

function getClubHeadlineName(code) {
  if (CLUB_HEADLINE_NAMES[code]) return CLUB_HEADLINE_NAMES[code];

  const team = CLUB_SELECTOR_TEAMS.find((entry) => entry.code === code);
  return (team?.name || "YOUR CLUB").toUpperCase();
}

function updateClubStoryHeadlines(code) {
  const name = getClubHeadlineName(code);

  applyClubPrimaryColor(code);

  clubSelectorState.headlines = CLUB_STORY_HEADLINE_BUILDERS.map((buildHeadline) => buildHeadline(name));

  const headline = document.querySelector("#sl-club-story-headline");
  if (headline) {
    headline.textContent =
      clubSelectorState.headlines[clubSelectorState.currentStoryStep] || clubSelectorState.headlines[0] || "";
  }
}

function syncStoryVisualFromStoryProgress(storyProgress) {
  clubStoryPhoneScroll.syncStep?.(getClubSelectorStoryStepFromProgress(storyProgress));
}

function hideAutoPickOffer() {
  const autoEl = document.querySelector("#sl-club-selector-pick-arrow-auto");
  if (!autoEl) return;

  autoEl.hidden = true;
  autoEl.classList.remove("is-visible");
}

function cancelAutoPickOffer() {
  clubSelectorState.autoPickOfferShown = false;
  hideAutoPickOffer();
}

function fadeSharedPhoneOut({ duration = 0.45 } = {}) {
  const sharedPhone = document.querySelector("#sl-club-selector-shared-phone");
  if (!sharedPhone) return;

  sharedPhone.classList.remove("is-interactive");

  if (prefersReducedMotion || !window.gsap) {
    sharedPhone.style.opacity = "0";
    sharedPhone.style.visibility = "hidden";
    return;
  }

  gsap.killTweensOf(sharedPhone);
  gsap.to(sharedPhone, { autoAlpha: 0, duration, ease: "power2.inOut" });
}

function selectClubCard(card, onClubSelected) {
  if (!card || clubSelectorState.transitioning || clubSelectorState.storyUnlocked) return;

  cancelAutoPickOffer();

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
  fadeSharedPhoneOut();

  if (onClubSelected) {
    window.setTimeout(() => onClubSelected(), 450);
  }
}

function showAutoPickOffer() {
  if (
    clubSelectorState.autoPickOfferShown ||
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
}

function bootClubSelectorAutoPickScroll() {
  const pickStage = document.querySelector(".sl-club-selector-pick-stage");
  if (!pickStage) return;

  pickStage.addEventListener(
    "wheel",
    (event) => {
      if (event.deltaY <= 0) return;
      if (
        !clubSelectorState.arrowShown ||
        clubSelectorState.autoPickOfferShown ||
        clubSelectorState.selectedCode ||
        clubSelectorState.storyUnlocked ||
        clubSelectorState.transitioning
      ) {
        return;
      }

      showAutoPickOffer();
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
  const storyPhoneSlot = document.querySelector("#sl-club-selector-story-phone-slot-marker");
  const storyVisual = document.querySelector("#sl-club-story-visual");
  const textWrap = document.querySelector("#sl-club-selector-text-wrap");
  const pickScreenLayer = document.querySelector(".sl-club-selector-screen-pick");
  const storyScreenLayer = document.querySelector("#sl-club-selector-screen-story");

  if (
    !wrap ||
    !pinShell ||
    !panel ||
    !pickPhase ||
    !storyPhase ||
    !sharedPhone ||
    !pickSpacer ||
    !storyPhoneSlot ||
    !storyVisual
  ) {
    return;
  }

  const stepperItems = [...document.querySelectorAll(".sl-club-story-stepper-item")];
  const storyVisualSteps = [...document.querySelectorAll(".sl-club-story-visual-step")];
  const storyHeadline = document.querySelector("#sl-club-story-headline");
  const changeClubButton = document.querySelector("#sl-club-story-change-club");

  const STORY_STEP_COUNT = stepperItems.length || 4;
  const snapProgressValues = buildClubSelectorSnapValues(STORY_STEP_COUNT);
  const storySnapProgressValues = snapProgressValues.slice(1);
  const PICK_PROGRESS_CAP = CLUB_SELECTOR_PICK_PROGRESS_CAP;

  let clubScrollTrigger = null;
  let isClampingScroll = false;
  let isProgrammaticStoryStepScroll = false;
  let programmaticStoryStepTarget = null;

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

  function setPickPhoneInteractive(isInteractive) {
    sharedPhone.classList.toggle("is-interactive", isInteractive);
  }

  function setSharedPhoneVisible(visible) {
    sharedPhone.hidden = !visible;

    if (window.gsap) {
      gsap.set(sharedPhone, { autoAlpha: visible ? 1 : 0 });
    } else {
      sharedPhone.style.opacity = visible ? "1" : "0";
      sharedPhone.style.visibility = visible ? "visible" : "hidden";
    }
  }

  function setStoryVisualVisible(visible) {
    storyVisual.setAttribute("aria-hidden", visible ? "false" : "true");

    if (window.gsap) {
      gsap.set(storyVisual, { autoAlpha: visible ? 1 : 0 });
    } else {
      storyVisual.style.opacity = visible ? "1" : "0";
      storyVisual.style.visibility = visible ? "visible" : "hidden";
    }
  }

  function setStoryPhoneLayerActive(isActive) {
    pickScreenLayer?.classList.toggle("is-active", !isActive);
    storyScreenLayer?.classList.toggle("is-active", isActive);

    if (storyScreenLayer) {
      storyScreenLayer.hidden = !isActive;
      storyScreenLayer.setAttribute("aria-hidden", isActive ? "false" : "true");
    }

    const storyScreen = getClubStoryPhoneRoot();
    if (storyScreen) {
      storyScreen.dataset.liveStep = isActive ? String(clubSelectorState.currentStoryStep) : "";
    }
  }

  function syncStoryStepVisual(stepIndex) {
    if (!clubSelectorState.storyUnlocked) return;

    setStoryVisualVisible(false);
    setStoryPhoneLayerActive(true);
    setSharedPhoneVisible(true);
    setPickPhoneInteractive(false);
    positionSharedPhoneAt(storyPhoneSlot);
    ensureStoryPhoneFeedForStep(stepIndex, clubSelectorState.selectedCode);

    window.requestAnimationFrame(() => {
      syncClubSelectorPhoneScales();
      scheduleStoryPhoneScaleSync(getClubStoryPhoneRoot());
    });
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

    storyVisualSteps.forEach((step, stepVisualIndex) => {
      const isActive = stepVisualIndex === stepIndex;
      step.classList.toggle("is-active", isActive);
      step.hidden = !isActive;
    });

    syncStoryStepVisual(stepIndex);
  }

  clubStoryPhoneScroll.syncStep = setStoryStep;

  function scrollClubSelectorToProgress(progress) {
    const trigger = clubScrollTrigger || ScrollTrigger.getById("club-selector-scroll");
    if (!trigger || prefersReducedMotion) return;

    const clampedProgress = Math.max(0, Math.min(1, progress));
    trigger.scroll(trigger.start + (trigger.end - trigger.start) * clampedProgress);
  }

  function scrollToStoryStep(stepIndex) {
    if (!clubSelectorState.storyUnlocked) return;

    const step = Math.max(0, Math.min(STORY_STEP_COUNT - 1, stepIndex));
    isProgrammaticStoryStepScroll = true;
    programmaticStoryStepTarget = step;
    setStoryStep(step);
    scrollClubSelectorToProgress(getClubSelectorStoryStepProgress(step, STORY_STEP_COUNT));

    if (prefersReducedMotion || !window.gsap || !clubScrollTrigger) {
      clearProgrammaticStoryStepScroll();
    }
  }

  function clearProgrammaticStoryStepScroll() {
    isProgrammaticStoryStepScroll = false;
    programmaticStoryStepTarget = null;
  }

  function isProgrammaticStoryStepScrollComplete(self) {
    if (!isProgrammaticStoryStepScroll || programmaticStoryStepTarget === null) return false;

    const targetProgress = getClubSelectorStoryStepProgress(programmaticStoryStepTarget, STORY_STEP_COUNT);
    return Math.abs(self.progress - targetProgress) <= 0.015;
  }

  function clampClubScrollProgress(self, maxProgress) {
    if (self.progress <= maxProgress) return;

    isClampingScroll = true;
    self.scroll(self.start + (self.end - self.start) * maxProgress);
    window.requestAnimationFrame(() => {
      isClampingScroll = false;
    });
  }

  function syncClubSelectorStepFromScroll(self) {
    if (isProgrammaticStoryStepScroll) {
      if (isProgrammaticStoryStepScrollComplete(self)) {
        clearProgrammaticStoryStepScroll();
      }
      return;
    }

    const step = getClubSelectorStoryStepFromProgress(self.progress, STORY_STEP_COUNT);

    if (step !== clubSelectorState.currentStoryStep) {
      setStoryStep(step);
    }
  }

  function handleClubScrollUpdate(self) {
    if (clubSelectorState.transitioning || isClampingScroll) return;

    if (!clubSelectorState.storyUnlocked) {
      const scrollAttemptThreshold = PICK_PROGRESS_CAP * 0.75;

      if (!clubSelectorState.selectedCode && self.progress > scrollAttemptThreshold) {
        showClubSelectorPickArrow();
      }

      if (self.progress <= PICK_PROGRESS_CAP) return;

      if (!clubSelectorState.selectedCode) {
        showClubSelectorPickArrow();

        if (clubSelectorState.arrowShown && !clubSelectorState.autoPickOfferShown) {
          showAutoPickOffer();
        }
      }

      clampClubScrollProgress(self, PICK_PROGRESS_CAP);
      return;
    }

    const minStoryProgress = getClubSelectorStoryStepProgress(0, STORY_STEP_COUNT);

    if (self.progress < minStoryProgress) {
      clampClubScrollProgress(self, minStoryProgress);
      return;
    }

    syncClubSelectorStepFromScroll(self);
  }

  function applyPickPhaseVisuals() {
    panel.classList.remove("is-story-active");
    storyPhase.hidden = true;
    storyPhase.setAttribute("aria-hidden", "true");
    pickPhase.hidden = false;
    pickPhase.classList.add("is-active");
    pickPhase.setAttribute("aria-hidden", "false");

    setStoryVisualVisible(false);
    setSharedPhoneVisible(true);
    setPickPhoneInteractive(true);
    setStoryPhoneLayerActive(false);
    positionSharedPhoneAtPick();

    if (window.gsap) {
      gsap.set(storyPhase, { opacity: 0, visibility: "hidden", pointerEvents: "none" });
      gsap.set(pickPhase, { opacity: 1, visibility: "visible" });
      gsap.set(textWrap, { opacity: 0 });
      gsap.set(storyVisual, { autoAlpha: 0 });
    }
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
      cancelAutoPickOffer();
      clubSelectorState.storyUnlocked = false;
      clubSelectorState.selectedCode = null;
      clubSelectorState.transitioning = false;
      clubSelectorState.currentStoryStep = 0;
      storyPhonePrefetchClubCode = null;

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

      setStoryVisualVisible(false);
      setSharedPhoneVisible(true);
      setPickPhoneInteractive(true);
      setStoryPhoneLayerActive(false);
      positionSharedPhoneAtPick();
      destroyClubStoryPhoneFeedScroll();
      syncClubSelectorAppViewport();

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

    gsap
      .timeline({
        onComplete() {
          runReset();
        },
      })
      .to(textWrap, { opacity: 0, duration: 0.3, ease: "power1.inOut" })
      .to(storyVisual, { autoAlpha: 0, duration: 0.3, ease: "power1.inOut" }, "<")
      .call(() => {
        panel.classList.remove("is-story-active");
        pickPhase.hidden = false;
        pickPhase.classList.add("is-active");
        pickPhase.setAttribute("aria-hidden", "false");
        gsap.set(storyPhase, { opacity: 0, visibility: "hidden", pointerEvents: "none" });
        gsap.set([heading, arrow], { opacity: 0, visibility: "visible" });
      })
      .call(() => {
        setSharedPhoneVisible(true);
        positionSharedPhoneAtPick();
      })
      .to([heading, arrow], { opacity: 1, duration: 0.35, ease: "power2.out" }, "<0.05");
  }

  function destroyClubScroll() {
    clubScrollTrigger?.kill();
    clubScrollTrigger = null;
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

    setPickPhoneInteractive(false);
    setStoryStep(clubSelectorState.currentStoryStep);
  }

  function buildClubScroll() {
    if (!window.gsap || !window.ScrollTrigger || prefersReducedMotion) return;

    destroyClubScroll();

    if (clubSelectorState.storyUnlocked) {
      showStoryPhase();
      setStoryStep(clubSelectorState.currentStoryStep);
    } else {
      applyPickPhaseVisuals();
    }

    clubScrollTrigger = ScrollTrigger.create({
      id: "club-selector-scroll",
      trigger: wrap,
      start: "top top",
      endTrigger: "#sl-features-intro",
      end: "top top",
      pin: pinShell,
      pinSpacing: true,
      anticipatePin: 0,
      invalidateOnRefresh: true,
      snap: {
        snapTo(progress) {
          if (!clubSelectorState.storyUnlocked) {
            return progress > PICK_PROGRESS_CAP * 0.5 ? PICK_PROGRESS_CAP : 0;
          }

          return nearestClubSelectorSnap(progress, storySnapProgressValues);
        },
        duration: { min: 0.15, max: 0.5 },
        delay: 0.08,
        ease: "power1.inOut",
      },
      onUpdate: handleClubScrollUpdate,
      onSnapComplete(self) {
        if (clubSelectorState.storyUnlocked) {
          if (isProgrammaticStoryStepScroll) {
            clearProgrammaticStoryStepScroll();
          }
          syncClubSelectorStepFromScroll(self);
        }
      },
      onLeaveBack() {
        if (clubSelectorState.storyUnlocked) {
          panel.classList.add("is-story-active");
        }
      },
    });

    clubStoryPhoneScroll.getScrollTrigger = () => clubScrollTrigger;
    clubStoryPhoneScroll.getPickProgressCap = () => PICK_PROGRESS_CAP;
    clubStoryPhoneScroll.getStoryStepProgress = (stepIndex) =>
      getClubSelectorStoryStepProgress(stepIndex, STORY_STEP_COUNT);
  }

  function finishStoryTransition() {
    clubSelectorState.storyUnlocked = true;
    clubSelectorState.transitioning = false;
    showStoryPhase();
    scrollToStoryStep(0);
  }

  function transitionToStory() {
    if (clubSelectorState.storyUnlocked || clubSelectorState.transitioning) return;
    if (!clubSelectorState.selectedCode) return;

    clubSelectorState.transitioning = true;
    setPickPhoneInteractive(false);

    if (prefersReducedMotion || !window.gsap) {
      if (window.gsap) {
        gsap.set([heading, arrow], { opacity: 0 });
        gsap.set(sharedPhone, { autoAlpha: 0 });
      } else {
        if (heading) heading.style.opacity = "0";
        if (arrow) arrow.style.opacity = "0";
      }

      storyPhase.hidden = false;
      renderClubStoryPhoneFeed(clubSelectorState.selectedCode, { preserveScroll: false });
      finishStoryTransition();
      return;
    }

    storyPhase.hidden = false;
    gsap.set(storyPhase, { opacity: 0, visibility: "hidden", pointerEvents: "none" });
    gsap.set(storyVisual, { autoAlpha: 0 });
    gsap.set(textWrap, { opacity: 0 });
    gsap.set(sharedPhone, { autoAlpha: 0 });

    gsap
      .timeline({
        onComplete: finishStoryTransition,
      })
      .to([heading, arrow], { opacity: 0, duration: 0.35, ease: "power1.inOut" })
      .call(() => {
        renderClubStoryPhoneFeed(clubSelectorState.selectedCode, { preserveScroll: false });
        setStoryPhoneLayerActive(true);
        positionSharedPhoneAt(storyPhoneSlot);
        syncClubSelectorPhoneScales();
      })
      .set(storyPhase, { visibility: "visible", pointerEvents: "auto" })
      .to(storyPhase, { opacity: 1, duration: 0.25, ease: "power1.inOut" })
      .to(textWrap, { opacity: 1, duration: 0.4, ease: "power2.out" }, "<0.08")
      .to(sharedPhone, { autoAlpha: 1, duration: 0.5, ease: "power2.out" }, "<0.12");
  }

  setStoryVisualVisible(false);
  positionSharedPhoneAtPick();

  window.addEventListener("resize", () => {
    if (clubSelectorState.transitioning) return;

    if (clubSelectorState.storyUnlocked) {
      syncStoryStepVisual(clubSelectorState.currentStoryStep);
      syncClubSelectorPhoneScales();
      return;
    }

    positionSharedPhoneAtPick();
    syncClubSelectorAppViewport();
  });

  changeClubButton?.addEventListener("click", resetToPickPhase);
  bootClubStoryStepper();
  bootClubSelectorAutoPickScroll();

  bootClubSelectorPickArrowHint();
  bootClubSelectorTeamPicker(transitionToStory);
  bootClubStoryPhoneViewports();

  clubSelectorPinController = {
    buildClubScroll,
    refreshOnResize() {
      const savedStep = clubSelectorState.currentStoryStep;
      const wasUnlocked = clubSelectorState.storyUnlocked;

      syncClubSelectorAppViewport();
      buildClubScroll();
      featuresIntroPinController?.rebuild?.();

      if (wasUnlocked) {
        clubSelectorState.storyUnlocked = true;
        showStoryPhase();
        scrollToStoryStep(savedStep);
      } else {
        applyPickPhaseVisuals();
      }

      ScrollTrigger.refresh(true);
    },
  };
}

let clubSelectorResizeTimer = null;

function bootClubSelectorStoryPin() {
  if (prefersReducedMotion || !window.gsap || !window.ScrollTrigger) return;

  window.addEventListener("resize", () => {
    if (clubSelectorResizeTimer) {
      window.clearTimeout(clubSelectorResizeTimer);
    }

    clubSelectorResizeTimer = window.setTimeout(() => {
      clubSelectorResizeTimer = null;
      clubSelectorPinController?.refreshOnResize?.();
    }, 150);
  });
}

bootCtaLogoGrid();
bootSpectatorCarousel();
bootHeroVideo();
bootHeroPhoneStatusBar();
renderClubSelectorTeams();
bootClubSelectorAppViewport();
bootClubSelectorStory();
bootAnimations();

window.addEventListener("pageshow", (event) => {
  if (event.persisted) return;
  resetPageScrollPosition();
});

window.addEventListener("load", () => {
  resetPageScrollPosition();
  syncClubSelectorAppViewport();
  clubSelectorPinController?.refreshOnResize?.();

  if (window.ScrollTrigger) {
    ScrollTrigger.refresh(true);
  }

  resetPageScrollPosition();
});
