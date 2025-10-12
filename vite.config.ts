import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";

const githubPagesBase = "/integral-counselor-website/";

const shouldUseGitHubPagesBase = () => {
  if (process.env.DEPLOY_TARGET === "github-pages") {
    return true;
  }

  if (process.env.VITE_DEPLOY_TARGET === "github-pages") {
    return true;
  }

  return process.env.GITHUB_PAGES === "true";
};

export default defineConfig(async () => {
  const plugins = [react(), runtimeErrorOverlay()];

  const shouldLoadReplitPlugins =
    process.env.NODE_ENV !== "production" && process.env.REPL_ID !== undefined;

  if (shouldLoadReplitPlugins) {
    const [{ cartographer }, { devBanner }] = await Promise.all([
      import("@replit/vite-plugin-cartographer"),
      import("@replit/vite-plugin-dev-banner"),
    ]);

    plugins.push(cartographer(), devBanner());
  }

  return {
    base: shouldUseGitHubPagesBase() ? githubPagesBase : "/",
    plugins,
    resolve: {
      alias: {
        "@": path.resolve(import.meta.dirname, "client", "src"),
        "@shared": path.resolve(import.meta.dirname, "shared"),
        "@assets": path.resolve(import.meta.dirname, "attached_assets"),
      },
    },
    root: path.resolve(import.meta.dirname, "client"),
    build: {
      outDir: path.resolve(import.meta.dirname, "dist/public"),
      emptyOutDir: true,
    },
    server: {
      fs: {
        strict: true,
        deny: ["**/.*"],
      },
    },
  };
});
