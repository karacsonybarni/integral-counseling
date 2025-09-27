import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/Home";
import NotFound from "@/pages/not-found";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import "./i18n";

function LanguageRouter() {
  const [location] = useLocation();
  const { i18n } = useTranslation();

  useEffect(() => {
    const path = location.toLowerCase();
    if (path.startsWith('/en')) {
      if (i18n.language !== 'en') {
        i18n.changeLanguage('en');
      }
    } else {
      // Default to Hungarian for root path and any other path
      if (i18n.language !== 'hu') {
        i18n.changeLanguage('hu');
      }
    }
  }, [location, i18n]);

  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/en" component={Home} />
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <LanguageRouter />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
