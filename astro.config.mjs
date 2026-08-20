import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";

// Drives sitemap + canonical + OG URLs, so it must match the deployed origin
// exactly — a stale value here is why a shared link shows a blank preview card.
// Cloudflare's newer Workers deploys hand out <project>.<account>.workers.dev
// rather than the older <project>.pages.dev. Swap in a custom domain later;
// nothing else needs to change.
const SITE = "https://felipe-duenas.duenasfd.workers.dev";

export default defineConfig({
  site: SITE,
  integrations: [mdx(), sitemap()],
  vite: { plugins: [tailwindcss()] },
  markdown: {
    // Dual themes emit --shiki-dark vars alongside the light colours, so code
    // blocks follow the theme toggle without a second highlight pass.
    shikiConfig: {
      themes: { light: "github-light", dark: "github-dark" },
      wrap: true,
    },
  },
});
