import { translations } from "./translations.js";

const LANGS = Object.keys(translations);
const STORAGE_KEY = "lang";

/* ---------- 1. Language switch ---------- */

function readStoredLang() {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

function storeLang(lang) {
  try {
    localStorage.setItem(STORAGE_KEY, lang);
  } catch {
    /* storage blocked — the choice just won't persist */
  }
}

function initialLang() {
  const stored = readStoredLang();
  if (LANGS.includes(stored)) return stored;
  return (navigator.language || "").toLowerCase().startsWith("it") ? "it" : "en";
}

function t(lang, key) {
  return translations[lang][key] ?? translations.en[key];
}

function applyLang(lang) {
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const value = t(lang, el.dataset.i18n);
    if (value !== undefined) el.textContent = value;
  });

  // data-i18n-attr="aria-label:key;title:other.key"
  document.querySelectorAll("[data-i18n-attr]").forEach((el) => {
    el.dataset.i18nAttr.split(";").forEach((pair) => {
      const [attr, key] = pair.split(":").map((s) => s.trim());
      const value = t(lang, key);
      if (attr && value !== undefined) el.setAttribute(attr, value);
    });
  });

  document.documentElement.lang = lang;
  document.querySelectorAll("[data-lang]").forEach((btn) => {
    btn.setAttribute("aria-pressed", String(btn.dataset.lang === lang));
  });
}

function initLanguage() {
  applyLang(initialLang());
  document.querySelectorAll("[data-lang]").forEach((btn) => {
    btn.addEventListener("click", () => {
      applyLang(btn.dataset.lang);
      storeLang(btn.dataset.lang);
    });
  });
}

/* ---------- 2. Scroll reveal ---------- */

function initReveal() {
  const targets = document.querySelectorAll("[data-reveal]");
  if (!("IntersectionObserver" in window)) {
    targets.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  // Stagger siblings inside each list so items cascade in
  document.querySelectorAll("[data-stagger]").forEach((list) => {
    [...list.children].forEach((item, i) => {
      const target = item.matches("[data-reveal]") ? item : item.querySelector("[data-reveal]");
      target?.style.setProperty("--stagger", i % 3);
    });
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { rootMargin: "0px 0px -10% 0px", threshold: 0.1 }
  );
  targets.forEach((el) => observer.observe(el));
}

/* ---------- 3. Nav scroll-spy ---------- */

function initScrollSpy() {
  if (!("IntersectionObserver" in window)) return;
  const links = new Map(
    [...document.querySelectorAll(".site-nav a[href^='#']")].map((a) => [a.hash.slice(1), a])
  );

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        links.forEach((a, id) => {
          if (id === entry.target.id) a.setAttribute("aria-current", "location");
          else a.removeAttribute("aria-current");
        });
      });
    },
    // A section is "current" while it crosses the middle of the viewport
    { rootMargin: "-50% 0px -50% 0px" }
  );

  document.querySelectorAll("main section[id]").forEach((section) => observer.observe(section));
}

/* ---------- 4. Mobile menu ---------- */

function initMenu() {
  const pill = document.querySelector(".nav-pill");
  const button = pill?.querySelector(".menu-btn");
  if (!button) return;

  const setOpen = (open) => {
    pill.classList.toggle("is-open", open);
    button.setAttribute("aria-expanded", String(open));
  };

  button.addEventListener("click", () => setOpen(!pill.classList.contains("is-open")));
  pill.querySelectorAll(".site-nav a").forEach((a) => a.addEventListener("click", () => setOpen(false)));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && pill.classList.contains("is-open")) {
      setOpen(false);
      button.focus();
    }
  });
  document.addEventListener("click", (e) => {
    if (!pill.contains(e.target)) setOpen(false);
  });
}

/* ---------- 5. Testimonial carousel ---------- */

function initCarousel() {
  const track = document.querySelector(".quote-track");
  const prev = document.querySelector(".carousel-prev");
  const next = document.querySelector(".carousel-next");
  if (!track || !prev || !next) return;

  const step = () => {
    const item = track.firstElementChild;
    const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
    return item ? item.getBoundingClientRect().width + gap : track.clientWidth;
  };

  const update = () => {
    const max = track.scrollWidth - track.clientWidth - 1;
    prev.disabled = track.scrollLeft <= 0;
    next.disabled = track.scrollLeft >= max;
  };

  prev.addEventListener("click", () => track.scrollBy({ left: -step(), behavior: "smooth" }));
  next.addEventListener("click", () => track.scrollBy({ left: step(), behavior: "smooth" }));
  track.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", update);
  update();
}

initLanguage();
initReveal();
initScrollSpy();
initMenu();
initCarousel();
