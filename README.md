# Ćomitrans

The website of Ćomitrans, a private transfer service in Novi Sad: airport transfers first, and intercity rides, events, day trips and small cargo beside them. It is served at [comitrans.net](https://comitrans.net/) in Serbian, with English under `/en/`.

The site is one page per language. It speaks in road signs, because that is what the road to the airport looks like, and the page is itself the trip: a thin line under the header carries a car from Novi Sad to the airport as the visitor scrolls.

There is no server. A visitor fills in a trip and the page writes the message; they send it themselves through WhatsApp, Viber, mail or a phone call. Nothing typed into the page is transmitted anywhere, there are no cookies and no third-party requests, and a content security policy holds the page to that.

## Running it

The served site is plain HTML, CSS and JavaScript modules with no runtime dependencies.

```
python3 -m http.server -d public
```

then open http://localhost:8000. `public/` is the site: what you serve locally is byte-for-byte what GitHub Pages deploys, and nothing outside it is ever served.

The tooling (the page generator, the linter, the formatter) needs Node:

```
npm ci
```

## How it is put together

The pages are generated, so that two languages are one set of markup rather than two copies of it. The generated files are committed, and a test fails when they fall behind their sources.

| Piece | Where |
| --- | --- |
| The facts: phone, routes, distances, prices, launch state | `content/site.json` |
| The words, one file per language | `content/locales/` |
| The markup: one module per section of the page | `templates/` |
| The site as served: generated pages, stylesheets, scripts, fonts, icons | `public/` |
| The generator and the asset scripts | `tools/` |
| The checks | `tests/unit/` |

`node tools/build.js` (or `npm run build`) renders `templates/` and `content/` into `public/`: the page of each language, `404.html`, `sitemap.xml`, `robots.txt` and `CNAME`.

## Changing things

| To change | Edit | Then |
| --- | --- | --- |
| A phone number, a price, a distance, a route | `content/site.json`, and the route's name in every locale | `npm run build` |
| Wording | `content/locales/*.json`, every language in the same change | `npm run build` |
| The look | the partials under `public/css/` | nothing: they are served as they are |
| The headline, the hero scene or the palette | as above | `npm run build`, then `npm run card` for the link previews |

Commit the sources and the regenerated pages together.

### Adding a language

1. Copy `content/locales/en.json` to the new language's code and translate every value. The keys and the list lengths stay the same; a test compares them.
2. Add an entry to `locales` in `content/site.json`: its code, its `lang` and `hreflang`, the path it is served under, its label and name, and the browser languages it should be offered to.
3. `npm run build` and `npm run card`. The language switch, the alternates in the page head and the sitemap follow from the entry.

### The photo

The vehicle in the hero is drawn. When a cutout photo exists, run it through `tools/optimize-image.sh` into `public/img/` and name it in `content/site.json`:

```json
"heroPhoto": { "src": "img/hero.webp", "width": 1600, "height": 800 }
```

It takes the drawing's place and drives in the same way.

## Launching

`content/site.json` carries `launched` and a `todo` list of facts that are still placeholders or unconfirmed. While `launched` is false every page shows a preview ribbon and asks search engines not to index it, so the site can be deployed and shown around before it is true.

To launch: settle each item in `todo` and remove it, set `launched` to `true`, and rebuild. A test refuses a launch with anything left on the list.

## Checks

```
npm run format:check && npm run lint && npm test
```

which is what CI runs on every push, before it deploys.

## Hosting

[.github/workflows/ci.yml](.github/workflows/ci.yml) deploys `public/` to GitHub Pages from `main` once the checks pass. The domain is set in the repository's Pages settings; `public/CNAME` is generated from `origin` in `content/site.json`.

With the domain's DNS at Cloudflare, add the records unproxied first: GitHub can only issue its certificate while the name resolves straight to it. Once Enforce HTTPS is on, the proxy can be turned on with SSL mode Full (strict).

The page's content security policy allows scripts from the site's own origin only. Anything Cloudflare or another service would inject from elsewhere, an analytics beacon for one, will be blocked until the policy in `templates/document.js` names it.

## Rights

The site's code, text and artwork are not licensed for reuse. The Sofia Sans typefaces under `public/fonts/` are distributed under the SIL Open Font License, included beside them.
