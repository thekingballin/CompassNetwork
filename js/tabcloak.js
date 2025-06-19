const originalTitle = document.title;
const originalFavicon = document.querySelector("link[rel~='icon']").href;

const faviconMap = {
googleCloak: {
title: "Google",
icon: "https://www.google.com/favicon.ico",
},
youtubeCloak: {
title: "YouTube",
icon: "images/Tabcloaks/yt2.png",
},
desmosCloak: {
title: "Desmos",
icon: "images/Tabcloaks/desmos.png",
},
newtabCloak: {
title: "Newtab",
icon: "images/Tabcloaks/newtab.png",
},
};

function setFavicon(url) {
let link = document.querySelector("link[rel~='icon']");
if (!link) {
link = document.createElement("link");
link.rel = "icon";
document.head.appendChild(link);
}
link.href = `${url}?t=${Date.now()}`;
}

function applyCloak(cloakId) {
const data = faviconMap[cloakId];
if (data) {
document.title = data.title;
setFavicon(data.icon);
localStorage.setItem("tabCloak", cloakId);
}
}

function resetToDefault() {
document.title = originalTitle;
setFavicon(originalFavicon);
localStorage.removeItem("tabCloak");
const dropdown = document.getElementById("cloakSelect");
if (dropdown) dropdown.value = "";
}

document.addEventListener("DOMContentLoaded", () => {
const cloakSelect = document.getElementById("cloakSelect");
const resetBtn = document.getElementById("resetCloak");

if (cloakSelect) {
cloakSelect.addEventListener("change", () => {
const selected = cloakSelect.value;
if (selected) applyCloak(selected);
});
}

if (resetBtn) {
resetBtn.addEventListener("click", resetToDefault);
}

const savedCloak = localStorage.getItem("tabCloak");
if (savedCloak && faviconMap[savedCloak]) {
applyCloak(savedCloak);
if (cloakSelect) cloakSelect.value = savedCloak;
}
});