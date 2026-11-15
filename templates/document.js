import { html, raw } from "./html.js";

// The site's promise in enforceable form: nothing typed into the page has anywhere to go.
const POLICY = [
  "default-src 'self'",
  "img-src 'self' data:",
  "connect-src 'none'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'none'",
].join("; ");

// Link order is the cascade: a partial joins this list where its rules belong.
const STYLES = [
  "01-base",
  "02-layout",
  "03-signs",
  "04-header",
  "05-hero",
  "06-airport",
  "07-routes",
  "08-rides",
  "09-vehicle",
  "10-about",
  "11-booking",
  "12-footer",
];

// The subsets every page draws from on first paint.
const FONTS = [
  "sofia-sans-extra-condensed-latin",
  "sofia-sans-extra-condensed-latin-ext",
  "sofia-sans-latin",
  "sofia-sans-latin-ext",
];

const pageUrl = (site, locale) => `${site.origin}/${locale.path}`;

function alternates({ site }) {
  const fallback = site.locales.find(({ code }) => code === site.fallbackLocale);
  return [
    ...site.locales.map((locale) => ({ hreflang: locale.hreflang, href: pageUrl(site, locale) })),
    { hreflang: "x-default", href: pageUrl(site, fallback) },
  ];
}

function business({ site, t, url }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${site.origin}/#business`,
    name: site.brand,
    description: t.meta.description,
    url,
    telephone: site.contact.phone.e164,
    areaServed: { "@type": "City", name: t.places["novi-sad"] },
    address: {
      "@type": "PostalAddress",
      addressLocality: t.places["novi-sad"],
      addressCountry: "RS",
    },
  };
  return raw(JSON.stringify(data).replaceAll("<", "\\u003c"));
}

function indexing(context) {
  const { site, locale, t, url } = context;
  return html`
    <link rel="canonical" href="${url}" />
    ${alternates(context).map(
      ({ hreflang, href }) => html`<link rel="alternate" hreflang="${hreflang}" href="${href}" />`,
    )}
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="${site.brand}" />
    <meta property="og:url" content="${url}" />
    <meta property="og:title" content="${t.meta.ogTitle}" />
    <meta property="og:description" content="${t.meta.description}" />
    <meta property="og:image" content="${site.origin}/og-${locale.code}.png" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="${t.meta.ogAlt}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta property="og:locale" content="${locale.ogLocale}" />
    ${site.locales
      .filter((other) => other !== locale)
      .map((other) => html`<meta property="og:locale:alternate" content="${other.ogLocale}" />`)}
    <script type="application/ld+json">
      ${business(context)}
    </script>
  `;
}

export function page(context, { title, description, body, indexed = true, styles = [] }) {
  const { site, locale, root } = context;
  return html`<!doctype html>
    <html lang="${locale.lang}">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta http-equiv="Content-Security-Policy" content="${POLICY}" />
        <meta name="color-scheme" content="light" />
        <meta name="theme-color" content="#f5f6f2" />
        <link rel="icon" href="${root}favicon.svg" type="image/svg+xml" />
        <link rel="icon" href="${root}favicon-48.png" sizes="48x48" />
        <link rel="apple-touch-icon" href="${root}apple-touch-icon.png" />
        <title>${title}</title>
        <meta name="description" content="${description}" />
        ${site.launched && indexed ? null : html`<meta name="robots" content="noindex" />`}
        ${indexed ? indexing(context) : null}
        ${FONTS.map(
          (font) =>
            html`<link
              rel="preload"
              as="font"
              type="font/woff2"
              href="${root}fonts/${font}.woff2"
              crossorigin
            />`,
        )}
        ${[...STYLES, ...styles].map(
          (name) => html`<link rel="stylesheet" href="${root}css/${name}.css" />`,
        )}
        <script type="module" src="${root}js/main.js"></script>
      </head>
      <body
        data-locale="${locale.code}"
        data-fallback="${site.fallbackLocale}"
        data-speakers="${locale.speakers.join(" ")}"
      >
        ${body}
      </body>
    </html>`;
}

export function sitemap(site) {
  const links = alternates({ site })
    .map(
      ({ hreflang, href }) =>
        `    <xhtml:link rel="alternate" hreflang="${hreflang}" href="${href}" />\n`,
    )
    .join("");
  const urls = site.locales
    .map((locale) => `  <url>\n    <loc>${pageUrl(site, locale)}</loc>\n${links}  </url>\n`)
    .join("");
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls}</urlset>
`;
}
