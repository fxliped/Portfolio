import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";

// Drives sitemap + canonical + OG URLs. Cloudflare Pages gives you
// <project>.pages.dev on first deploy — set this to whatever it assigns.
// TODO: replace with your custom domain later; nothing else needs to change.
const SITE = "https://felipe-portfolio.pages.dev";

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
