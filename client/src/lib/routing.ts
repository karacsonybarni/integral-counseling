export const PENDING_SCROLL_KEY = "pending-scroll-target";

export function getLocalizedPath(path: string, language: string) {
  const normalizedPath = path === "" ? "/" : path;
  const pathWithoutLanguagePrefix =
    normalizedPath === "/en"
      ? "/"
      : normalizedPath.startsWith("/en/")
        ? normalizedPath.slice(3)
        : normalizedPath;

  if (language === "en") {
    return pathWithoutLanguagePrefix === "/"
      ? "/en"
      : `/en${pathWithoutLanguagePrefix}`;
  }

  return pathWithoutLanguagePrefix;
}

export function scrollToSection(target: string) {
  if (typeof document === "undefined") {
    return;
  }

  const section = document.getElementById(target);
  if (section) {
    section.scrollIntoView({ behavior: getPreferredScrollBehavior() });
    return;
  }

  requestAnimationFrame(() => {
    const retrySection = document.getElementById(target);
    retrySection?.scrollIntoView({ behavior: getPreferredScrollBehavior() });
  });
}

function getPreferredScrollBehavior(): ScrollBehavior {
  if (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    return "auto";
  }

  return "smooth";
}

export function storePendingScrollTarget(target: string) {
  if (typeof window === "undefined") {
    return;
  }

  window.sessionStorage.setItem(PENDING_SCROLL_KEY, target);
}

export function consumePendingScrollTarget() {
  if (typeof window === "undefined") {
    return null;
  }

  const target = window.sessionStorage.getItem(PENDING_SCROLL_KEY);
  if (!target) {
    return null;
  }

  window.sessionStorage.removeItem(PENDING_SCROLL_KEY);
  return target;
}
