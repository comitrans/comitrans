import { sitemap } from "./document.js";
import { home } from "./pages/home.js";

const up = (path) => "../".repeat(path.split("/").filter(Boolean).length);

function contextFor(site, strings, locale) {
  return {
    site,
    strings,
    locale,
    t: strings[locale.code],
    root: up(locale.path),
    url: `${site.origin}/${locale.path}`,
  };
}

export function render({ site, strings }) {
  const files = {};
  for (const locale of site.locales)
    files[`${locale.path}index.html`] = String(home(contextFor(site, strings, locale)));
  files["sitemap.xml"] = sitemap(site);
  files["robots.txt"] = `User-agent: *\nAllow: /\nSitemap: ${site.origin}/sitemap.xml\n`;
  files["CNAME"] = `${new URL(site.origin).host}\n`;
  return files;
}
