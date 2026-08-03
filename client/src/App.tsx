import { Switch, Route, useLocation, Router } from "wouter";
import Home from "@/pages/Home";
import Terms from "@/pages/Terms";
import Privacy from "@/pages/Privacy";
import NotFound from "@/pages/not-found";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import "./i18n";

function LanguageRouter() {
  const [location] = useLocation();
  const { t, i18n } = useTranslation("common");

  useEffect(() => {
    const path = location.toLowerCase().split("?")[0];
    const isEnglishPath = path === "/en" || path.startsWith("/en/");

    if (isEnglishPath) {
      if (i18n.language !== "en") {
        i18n.changeLanguage("en");
      }
    } else {
      // Default to Hungarian for root path and any other path
      if (i18n.language !== "hu") {
        i18n.changeLanguage("hu");
      }
    }
  }, [location, i18n]);

  useEffect(() => {
    const path = location.toLowerCase().split("?")[0];
    const page =
      path.endsWith("/terms") || path === "/terms"
        ? "terms"
        : path.endsWith("/privacy") || path === "/privacy"
          ? "privacy"
          : path === "/" || path === "/en"
            ? "home"
            : "not_found";

    const localizedTitle = t(`meta.${page}.title`);
    const localizedDescription = t(`meta.${page}.description`);
    document.title = localizedTitle;
    const description = document.querySelector<HTMLMetaElement>(
      'meta[name="description"]',
    );
    description?.setAttribute("content", localizedDescription);
    document
      .querySelector<HTMLMetaElement>('meta[property="og:title"]')
      ?.setAttribute("content", localizedTitle);
    document
      .querySelector<HTMLMetaElement>('meta[property="og:description"]')
      ?.setAttribute("content", localizedDescription);
  }, [location, t, i18n.resolvedLanguage]);

  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/terms" component={Terms} />
      <Route path="/privacy" component={Privacy} />
      <Route path="/en/terms" component={Terms} />
      <Route path="/en/privacy" component={Privacy} />
      <Route path="/en" component={Home} />
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");
  const { t } = useTranslation("common");

  return (
    <>
      <a
        href="#main-content"
        className="fixed left-4 top-4 z-[200] -translate-y-24 rounded-md bg-background px-4 py-3 font-medium text-foreground shadow-lg ring-2 ring-primary transition-transform focus:translate-y-0"
      >
        {t("skip_to_content")}
      </a>
      <Router base={basePath === "" ? undefined : basePath}>
        <LanguageRouter />
      </Router>
    </>
  );
}

export default App;
