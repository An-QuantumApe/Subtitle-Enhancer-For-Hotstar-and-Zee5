
let styleEl;

const defaults = {
  size: 45,
  position: 0,
  lineHeight: 1.8,
  bold: true,
  outline: true
};

function applySettings(settings) {
  if (!styleEl) {
    styleEl = document.createElement("style");
    styleEl.id = "subtitle-enhancer-style";
    document.head.appendChild(styleEl);
  }

  const outline = settings.outline ? `
    text-shadow:
      -1px -1px 0 #000,
       1px -1px 0 #000,
      -1px  1px 0 #000,
       1px  1px 0 #000 !important;
  ` : "";

  styleEl.textContent = `
    .vjs-text-track-cue {
      transform: translateY(${settings.position}px) !important;
    }

    .vjs-text-track-cue div,
    .shaka-text-container span,
    .shaka-text-container div {
      font-size: ${settings.size}px !important;
      font-weight: ${settings.bold ? 700 : 400} !important;
      line-height: ${settings.lineHeight} !important;
      ${outline}
    }

    .shaka-text-container > div {
      transform: translate(-50%, ${settings.position}px) !important;
    }

    .shaka-text-container,
    .shaka-text-container div,
    .shaka-text-container span {
      background: transparent !important;
      background-color: transparent !important;
      box-shadow: none !important;
    }
  `;
}

let pending = false;
function refreshSubtitles() {
  if (pending) return;
  pending = true;

  requestAnimationFrame(() => {
    document.querySelectorAll(".vjs-text-track-cue > div").forEach(el => {
      el.style.setProperty("background", "transparent", "important");
      el.style.setProperty("background-color", "transparent", "important");
    });

    document.querySelectorAll(".shaka-text-container, .shaka-text-container div, .shaka-text-container span").forEach(el => {
      el.style.setProperty("background", "transparent", "important");
      el.style.setProperty("background-color", "transparent", "important");
      el.style.setProperty("box-shadow", "none", "important");
    });

    pending = false;
  });
}

function watchContainers() {
  const attach = () => {
    const zee5 = document.querySelector(".vjs-text-track-display");
    const hotstar = document.querySelector(".shaka-text-container");

    if (zee5 && !zee5.dataset.subtitleEnhancer) {
      zee5.dataset.subtitleEnhancer = "1";
      new MutationObserver(refreshSubtitles).observe(zee5, { childList: true, subtree: true });
    }

    if (hotstar && !hotstar.dataset.subtitleEnhancer) {
      hotstar.dataset.subtitleEnhancer = "1";
      new MutationObserver(refreshSubtitles).observe(hotstar, { childList: true, subtree: true, attributes: true });
    }
  };

  attach();
  setInterval(attach, 3000);
}

chrome.storage.sync.get(defaults, applySettings);
chrome.storage.onChanged.addListener(() => chrome.storage.sync.get(defaults, applySettings));

watchContainers();
refreshSubtitles();
