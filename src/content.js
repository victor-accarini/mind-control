const TIMEOUT = 300;
let listener = undefined;

const handleChanges = (mutations) => {
  console.log("handleChanges");
  const hasNewElements =
    mutations?.some(
      (mutation) => mutation.type === "childList" && mutation.addedNodes.length,
    ) || false;
  if (hasNewElements) {
    if (listener) {
      clearTimeout(listener);
    }

    listener = setTimeout(() => {
      filterContent();
      listener = undefined;
    }, TIMEOUT);
  }
};

function checkAllowedPath() {
  console.log("checkAllowedPath");
  if (observer) {
    observer.disconnect();
  }

  if (isYouTubeHome() || isYouTubeShortsPath()) {
    redirectToSubscription();
  } else {
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  }
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

function filterContent() {
  console.debug("Filtering content");

  const selectors = blockReelsAndButtons();
  replaceLinksToHome();

  if (isYouTubeWatchPath()) {
    selectors.elements = selectors.elements.concat(
      blockNonSubscribedVideos(),
      hideRecommendations(),
      hideComments(),
    );
  }

  console.log("selectors", selectors);
  // Remove filtered elements
  let elems = document.querySelectorAll(selectors.elements);
  elems.forEach((elem) => elem?.remove());
  elems = document.querySelectorAll(selectors.parents);
  elems.forEach((elem) => elem?.parentElement?.remove());
}

function redirectToSubscription() {
  window.location = "/feed/subscriptions";
}

function replaceLinksToHome() {
  document
    .querySelectorAll('*[href="/"]')
    .forEach((elem) => elem?.parentElement?.remove());
}

function blockReelsAndButtons() {
  const selectors = {
    elements: [
      "ytm-reel-shelf-renderer",
      "ytd-reel-shelf-renderer",
      "ytd-shorts",
      "shorts-page",
    ],
    parents: [
      ".pivot-shorts", // Shorts button - mobile
      ".pivot-w2w", // Home button - mobile
      "ytd-rich-shelf-renderer[is-shorts]",
      "ytd-guide-entry-renderer>a[href='/']", // Home button - desktop
      "ytd-guide-entry-renderer>a[title='Shorts']", // Shorts button - desktop
    ],
  };
  return selectors;
}

function blockNonSubscribedVideos() {
  let selectors = [];
  const notificationButton = document.getElementById(
    "notification-preference-toggle-button",
  );
  if (notificationButton?.hasAttribute("hidden")) {
    // Remove the main content, its simpler and easier
    selectors.push("#primary");
    selectors.push("ytd-watch-flexy");
  }
  const subscribeButton = document.querySelectorAll(".is-not-subscribed");
  if (subscribeButton.length) {
    selectors.push("#player-container-id");
    selectors.push("#player-container");
    selectors.push("#app");
  }
  return selectors;
}

function hideRecommendations() {
  return [
    "#related",
    ".ytp-modern-videowall-still",
    "ytm-item-section-renderer[section-identifier='related-items']",
    ".scwnr-content.single-column-watch-next-modern-panels",
  ];
}

function hideComments() {
  return [
    "#comments",
    "#chat-container",
    "yt-live-chat-renderer",
    "#teaser-carousel",
  ];
}

const observer = new MutationObserver(handleChanges);
window.addEventListener("popstate", checkAllowedPath);
window.setInterval(checkAllowedPath, TIMEOUT);
