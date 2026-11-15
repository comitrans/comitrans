# CLAUDE.md

Guidance for AI agents working in this repo. Read [README.md](README.md) first: what the site is, how it is put together, and what each kind of change touches. This file holds what is not obvious from the code, and the rules that keep the site honest.

## What the site must stay true to

- **Only facts the owner has confirmed.** A transfer service is bought on trust, so the page never claims what is not known to be true: no invented prices, hours, guarantees, statistics or testimonials. A fact that is still a placeholder or a draft is listed in `todo` in [content/site.json](content/site.json), and the site stays unlaunched while the list is not empty. Adding a claim to the copy without confirmation means adding it to `todo` in the same commit.
- **Ćomi speaks, in the first person.** The business is one driver, and the copy says "vozim" and "I drive", never "we". In Serbian the visitor is addressed politely in the plural ("zakažite", "pošaljite"). An action keeps one name through the whole page: the button that says "Zakažite vožnju" leads to a section with that title.
- **The repo is public.** It holds nothing personal beyond what the page itself publishes, and the owner is Ćomi here, in commits and in comments. The email address is stored in parts and joined by the script, so it never stands whole in the page source; a test holds that.
- **Nothing leaves the page.** No analytics, no third-party requests, no cookies, and a content security policy (`POLICY` in [templates/document.js](templates/document.js)) that enforces it. Anything that would change this changes the policy and the privacy line in the footer in the same commit.

## Source vs generated

- Generated **and committed**, never hand-edited: the page of each language (`public/index.html`, `public/en/index.html`), `public/404.html`, `public/sitemap.xml`, `public/robots.txt` and `public/CNAME`. `npm run build` writes them from `templates/` and `content/`, and `tests/unit/build.test.js` compares them byte for byte, so a commit that touches a template or the content carries the regenerated pages.
- Rendered and committed: the link previews `public/og-<code>.png` (`npm run card`, which needs Chrome and oxipng) and the raster icons (`tools/icons.sh`, from `public/favicon.svg`). Re-render the cards after changing the headline, the hero scene or the palette, in the same commit.
- Fetched and committed: `public/fonts/`, by `tools/fetch-fonts.sh` at a pinned version.
- Everything else under `public/` is written by hand and served exactly as it is.

## Templates

- `html` in [templates/html.js](templates/html.js) escapes every interpolated value; markup passes through only as the result of another `html` or of `raw()`. `null`, `undefined` and booleans render as nothing, so an attribute that needs the text `true` or `false` takes `String(flag)`.
- Prettier formats the HTML inside `html` templates and formats the generated pages again, so whitespace in a template is never significant. Do not write markup that depends on it.
- A page carries no `style` attribute and no `<style>` element: the policy would drop them, and a test fails first. Geometry inside an SVG goes in attributes; a script may still set a custom property through the CSSOM.
- A section of the page is one module under `templates/sections/`, one stylesheet partial and, where it needs one, one script. It joins three lists, each in the order that matters there: the body in [templates/pages/home.js](templates/pages/home.js) (order on the page), `STYLES` in `templates/document.js` (the cascade), and [public/js/main.js](public/js/main.js) (the order the scripts start in).
- Every word is in `content/locales/`, every language-independent fact in `content/site.json`. Section ids are words too (`anchors`), so a link to a section is written `#${t.anchors.booking}`. A string a script needs travels in the page, as a data attribute or in the composer's JSON block, never as a literal in the module.
- What only works with JavaScript ships `hidden` and is revealed by its script. What the page says without it has to stand on its own: both directions of the airport steps and the plain contact links.

## Stylesheet

- The partials under `public/css/` are linked in name order, and that order is the cascade. Tokens live in `:root` in `01-base.css`.
- The sign is the one recurring component: `.sign` plus a plate modifier, sized in `em` so its font-size scales the whole plate. The plate colours follow the road-class convention the signs are borrowed from: green for the motorway (the airports), yellow for other towns, white for places in town, brown for sights, blue for services. A new sign takes one of these rather than a new colour.
- Amber is the single accent: the primary button, the indicator, a link on asphalt. If a view already has one, a second thing does not get it.
- A surface that is not paper sets `--focus` to a colour its focus ring shows up in.
- A value a script and the stylesheet both need is measured from the layout rather than written twice ([public/js/drive.js](public/js/drive.js) reads the lane marking's period this way).

### Motion

Everything that moves is part of the drive: the vehicle arrives, the route line's car crosses, the sign's rows turn, the plane leaves, the trip line follows the scroll, and the wheels turn while the hero scrolls past.

- Scroll is never taken over. Nothing pins, snaps or replays a timeline; the page scrolls as a page.
- What arrives does so once, when it is first seen. Its container carries `data-arrival`, [public/js/arrival.js](public/js/arrival.js) adds `.is-seen`, and the animation waits for that under `@media (scripting: enabled)`, so without scripting nothing waits.
- Text is never animated; a headline is readable the moment it paints.
- Nothing may run past the side of the page, even for a frame. A phone widens its layout to fit whatever does, so the page zooms out and its scroll position jumps, and the `overflow-x: clip` on `body` does not prevent it: overflow set on the body belongs to the viewport. A box moved there by a transform counts as much as one placed there. Whatever might cross the edge sits inside an element of its own that clips it.
- A movement is one sweep per animation. An easing applies between each pair of keyframes, so stages inside one animation brake at every keyframe; a second movement that overlaps the first is a second animation.
- `prefers-reduced-motion` gets the same page already arrived: one rule in `01-base.css` collapses every duration, and the scroll-driven wheels switch off in the script.
- A custom property a script writes every frame goes on the narrowest element that reads it (the trip line, the hero scene), never on the root.

## Scripts

- Native ES modules, no bundler. A module wires the page in the `init` it exports; `main.js` calls each once, the steppers first because the modules after them read the counts they hold.
- The modules that touch no document ([links.js](public/js/links.js), [message.js](public/js/message.js), [route.js](public/js/route.js), [language.js](public/js/language.js)) stay importable in bare Node. The unit tests import them, and so do the templates, so the links in the page and the links the composer builds come from one function.
- The policy sets `connect-src 'none'`, so `fetch` fails in the page by design.
- On a phone the viewport's height changes as the browser's toolbar shows and hides, most of all at the bottom of the page. A position worked out from the viewport's height takes the tallest it has been at the current width, or it moves under a page that stands still.

## Build & verify

- `npm run format:check && npm run lint && npm test` is what CI runs before it deploys. There is no build step for the scripts and stylesheets, so lint is the only check they get before a browser runs them.
- `npm run build` regenerates the pages; `node tools/build.js --check` only reports.
- Serve with `python3 -m http.server -d public`.
  - Modules and stylesheets are served as they are, so a browser can keep a stale one beside a fresh page and misbehave convincingly. The reliable read is a fresh origin: any `*.localhost` name reaches the same server with a cache of its own (`http://a1.localhost:8000`).
  - In a hidden or background browser pane, animations, `requestAnimationFrame` and `IntersectionObserver` callbacks do not advance, so the scroll-driven code does not run either. Read the state from the DOM rather than trusting what a screenshot caught.
  - Under phone emulation the layout widens with whatever runs past the side, so `scrollWidth` keeps matching `innerWidth` even then. Overflow shows as `innerWidth` moving off the screen's width.
  - GitHub Pages serves `404.html` for a missing address; the local server does not, so open `/404.html` to see it.
- The link the Viber button builds for a personal number is not officially documented, which is why the button also copies the message. It needs a test on a real phone whenever it changes.

## Images

- Never commit an image straight from a camera or a phone. Run it through `tools/optimize-image.sh` (presets in its header), which resizes, strips the metadata and encodes. Git keeps every version forever, and phone exports embed the coordinates of where they were taken.
- `public/img/` holds only what the page loads. Replace an image in place, keeping its filename.

## Conventions

- One concern per commit; split bundled diffs before committing. Subjects are single-line and imperative, with no prefixes.
- Everything committed reads as its final state, written once: code comments, docs, commit messages and the shape of history alike.
- Prose files are never manually line-wrapped.
- A user-facing change ships in every language, with its docs, in the same commit.
- Prettier owns js/css/html formatting (`.prettierrc`: printWidth 100, defaults otherwise). The version is pinned exactly because the output depends on it: bump it deliberately, reformat the tree in a dedicated commit, and list that commit in a `.git-blame-ignore-revs` file.
- Format only the staged files before each commit, then re-stage what Prettier changed:
  ```
  git diff --cached --name-only --diff-filter=ACMR | grep -E '\.(js|css|html)$' | xargs -r npx prettier --write
  ```

### Code comments

- **Default to no comment.** A comment earns its place only by recording a durable why the code cannot show: an invariant, a constraint, a trade-off someone would otherwise undo. Keep it generic enough that a routine change does not force an edit; do not name consumers or restate a value.
- **Describe the code as it is, not how it got here.** No "moved from", "was previously". The story of a change belongs in its commit message.
- **Peer items get peer prose.** Where parallel things sit together, comment them uniformly or not at all. A justification on one sibling marks it as special when it is only the most recent.
