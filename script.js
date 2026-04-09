(() => {
  const STORAGE_KEY = "rt-theme";
  const root = document.documentElement;

  const toggleBtn = document.querySelector("[data-theme-toggle]");
  const themeIcon = document.querySelector("[data-theme-icon]");
  const navToggle = document.querySelector(".nav__toggle");
  const navLinks = document.querySelector("[data-nav-links]");

  function getPreferredTheme() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === "light" || saved === "dark") return saved;
    return window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  function applyTheme(theme) {
    const isDark = theme === "dark";
    root.classList.toggle("dark-mode", isDark);
    localStorage.setItem(STORAGE_KEY, theme);

    if (themeIcon) themeIcon.textContent = isDark ? "🌙" : "☀️";
    if (toggleBtn) toggleBtn.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
  }

  function closeMobileNav() {
    if (!navLinks || !navToggle) return;
    navLinks.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "Open menu");
  }

  // Init theme early
  applyTheme(getPreferredTheme());

  // Theme toggle
  toggleBtn?.addEventListener("click", () => {
    const isDark = root.classList.contains("dark-mode");
    applyTheme(isDark ? "light" : "dark");
  });

  // Keep in sync with system changes unless user set a preference explicitly.
  const mq = window.matchMedia?.("(prefers-color-scheme: dark)");
  mq?.addEventListener?.("change", (e) => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === "light" || saved === "dark") return;
    applyTheme(e.matches ? "dark" : "light");
  });

  // Mobile nav
  navToggle?.addEventListener("click", () => {
    if (!navLinks) return;
    const isOpen = navLinks.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
    navToggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
  });

  navLinks?.addEventListener("click", (e) => {
    const target = e.target;
    if (target instanceof HTMLAnchorElement && target.getAttribute("href")?.startsWith("#")) {
      closeMobileNav();
    }
  });

  // Escape closes mobile menu
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeMobileNav();
  });

  // Hardening: ensure certificate links open new tab and have rel set.
  document.querySelectorAll("[data-cert-link]").forEach((a) => {
    if (!(a instanceof HTMLAnchorElement)) return;
    a.target = "_blank";
    a.rel = "noreferrer noopener";
  });
})();

