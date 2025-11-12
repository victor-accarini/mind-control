let settings = {
  debug: false,
};

let observer;

// Cross-browser storage abstraction
// Firefox supports browser.storage.sync, Safari only supports browser.storage.local
const storageAPI = browser.storage.sync || browser.storage.local;

function loadSettings() {
  storageAPI.get(["youtubeFilterSettings"], (result) => {
    if (result.youtubeFilterSettings) {
      settings = { ...settings, ...result.youtubeFilterSettings };
    }
    console.debug("Settings loaded:", settings);
    initializeFilter();
  });
}

function initializeFilter() {
  if (isYouTubeDomain()) {
    console.debug(
      "Initializing filter on YouTube domain:",
      window.location.hostname,
    );
    observePageChanges();
    filterContent();
  } else {
    console.debug("Not a YouTube domain, skipping initialization");
  }
}

function isYouTubeDomain() {
  return window.location.hostname.includes("youtube");
}
function isYouTubeShortsPath() {
  return window.location.pathname.includes("/shorts");
}
function isYouTubeWatchPath() {
  return window.location.pathname.includes("/watch");
}
function isYouTubeHome() {
  return window.location.pathname === "/";
}

function observePageChanges() {
  if (observer) {
    observer.disconnect();
  }

  observer = new MutationObserver((mutations) => {
    let shouldFilter = false;
    mutations.forEach((mutation) => {
      if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
        shouldFilter = true;
      }
    });

    if (shouldFilter) {
      setTimeout(filterContent, 100);
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
}

function filterContent() {
  console.debug("Filtering content with settings:", settings);

  if (isYouTubeHome()) {
    redirectToSubscription();
  }

  if (isYouTubeShortsPath()) {
    redirectToSubscription();
  }

  if (isYouTubeWatchPath()) {
    blockNonSubscribedVideos();
    hideRecommendations();
    hideComments();
  }

  blockReelsAndButtons();
  replaceLinksToHome();
}

function redirectToSubscription() {
  window.location.pathname = "/feed/subscriptions";
}

function replaceLinksToHome() {
  document
    .querySelectorAll('*[href="/"]')
    .forEach((elem) => elem?.setAttribute("href", "/feed/subscriptions"));
}

function blockReelsAndButtons() {
  const reelsElements = document.querySelectorAll(["ytm-reel-shelf-renderer"]);
  reelsElements.forEach((elem) => elem?.remove());
  document
    .querySelectorAll([
      ".pivot-shorts", // Shorts button - mobile
      ".pivot-w2w", // Home button - mobile
      "ytd-guide-entry-renderer>a[href='/']", // Home button - desktop
      "ytd-guide-entry-renderer>a[title='Shorts']", // Shorts button - desktop
    ])
    .forEach((elem) => elem?.parentElement?.remove());
}

function blockNonSubscribedVideos() {
  const notificationButton = document.getElementById(
    "notification-preference-toggle-button",
  );
  if (notificationButton?.hasAttribute("hidden")) {
    // Remove the main content, since looking for specific elements is
    // difficult due to them being loaded at different times
    const content = document.getElementById("primary");
    content?.remove();
  }
  const subscribeButton = document.querySelectorAll(".is-not-subscribed");
  if (subscribeButton.length) {
    document.getElementById("player-container-id")?.remove();
    document.getElementById("app")?.remove();
  }
}

function hideRecommendations() {
  const recommendedSection = document.getElementById("related");
  recommendedSection?.remove();
  const relatedVideos = document.querySelectorAll([
    ".ytp-modern-videowall-still",
    "ytm-item-section-renderer[section-identifier='related-items']",
    ".scwnr-content.single-column-watch-next-modern-panels",
  ]);
  relatedVideos.forEach((elem) => elem?.remove());
}

function hideComments() {
  const commentsSection = document.getElementById("comments");
  commentsSection?.remove();
}

// Listen for storage changes (works with both sync and local storage)
storageAPI.onChanged.addListener((changes) => {
  if (changes.youtubeFilterSettings) {
    settings = { ...settings, ...changes.youtubeFilterSettings.newValue };
    console.debug("Settings changed:", settings);
    filterContent();
  }
});

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", loadSettings);
} else {
  loadSettings();
}
