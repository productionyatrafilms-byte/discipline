const btnEn = document.querySelector(".english");
const btnHi = document.querySelector(".hindi");
const btnGu = document.querySelector(".gujrati");

const pageLinks = document.querySelectorAll(".pages a");
const buttons = [btnEn, btnHi, btnGu].filter(Boolean);

const LANG_KEY = "selectedLanguage";
const DEFAULT_LANG = "English";

let translations = {};

function getSavedLanguage() {
  return localStorage.getItem(LANG_KEY) || DEFAULT_LANG;
}

function getButtonByLanguage(lang) {
  if (lang === "Hindi") return btnHi;
  if (lang === "Gujarati") return btnGu;
  return btnEn;
}

function setActiveButton(activeBtn) {
  buttons.forEach((btn) => btn.classList.remove("active"));
  if (activeBtn) activeBtn.classList.add("active");
}

function setActivePage(clickedLink = null) {
  pageLinks.forEach((link) => link.classList.remove("active"));

  if (clickedLink) {
    clickedLink.classList.add("active");
    return;
  }

  const currentPage = window.location.pathname.split("/").pop();

  pageLinks.forEach((link) => {
    const linkPath = link.getAttribute("href");
    if (linkPath === currentPage) {
      link.classList.add("active");
    }
  });
}

function applyLanguage(lang) {
  const langData = translations[lang];
  if (!langData) return;

  document.documentElement.lang = lang;

  if (lang === "Hindi") {
    document.body.setAttribute("data-lang", "hi");
  } else if (lang === "Gujarati") {
    document.body.setAttribute("data-lang", "gu");
  } else {
    document.body.setAttribute("data-lang", "en");
  }

  document.querySelectorAll("[data-lang-key]").forEach((el) => {
    const key = el.getAttribute("data-lang-key");

    if (langData[key] !== undefined) {
      el.innerHTML = String(langData[key]).replace(/\n/g, "<br>");
    }
  });

  localStorage.setItem(LANG_KEY, lang);
  setActiveButton(getButtonByLanguage(lang));

  document.body.classList.add("lang-ready");
}

async function loadTranslations() {
  const savedLang = getSavedLanguage();

  setActiveButton(getButtonByLanguage(savedLang));

  try {
    const res = await fetch("./assets/json/data.json", { cache: "no-store" });
    translations = await res.json();

    applyLanguage(savedLang);
  } catch (error) {
    console.error("Error loading translations:", error);
    applyLanguage(DEFAULT_LANG);
  }

  setActivePage();
}

function initLanguageButtons() {
  btnEn?.addEventListener("click", () => {
    applyLanguage("English");
  });

  btnHi?.addEventListener("click", () => {
    applyLanguage("Hindi");
  });

  btnGu?.addEventListener("click", () => {
    applyLanguage("Gujarati");
  });
}

function initPageLinks() {
  pageLinks.forEach((link) => {
    link.addEventListener("click", function () {
      setActivePage(this);
    });
  });
}

function initPageFade() {
  requestAnimationFrame(() => {
    document.body.classList.add("page-ready");
  });

  const fadeLinks = document.querySelectorAll('a[href$=".html"]');

  fadeLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      const href = this.getAttribute("href");

      if (!href || href.startsWith("#")) return;

      e.preventDefault();

      document.body.classList.remove("page-ready");
      document.body.classList.add("page-fade-out");

      setTimeout(() => {
        window.location.href = href;
      }, 500);
    });
  });
}

function showLandscapeMessage() {
  if (window.innerWidth <= 768 && window.innerHeight > window.innerWidth) {
    alert("For better experience, watch in landscape mode.");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  document.body.setAttribute(
    "data-lang",
    getSavedLanguage() === "Hindi"
      ? "hi"
      : getSavedLanguage() === "Gujarati"
      ? "gu"
      : "en"
  );

  loadTranslations();
  initLanguageButtons();
  initPageLinks();
  initPageFade();
  showLandscapeMessage();
});

window.addEventListener("load", () => {
  document.body.classList.add("curtain-loaded");
});