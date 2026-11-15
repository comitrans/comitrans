// Render the social cards: one per language -> public/og-<code>.png (1200x630).
//
// Run after changing the headline, the hero scene or the palette, and commit
// the cards with that change. Only the compressed PNG is kept.
//
// Usage:
//   node tools/card.js
//
// Requires: Google Chrome, oxipng.
import { execFileSync } from "node:child_process";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

import { card } from "../templates/card.js";
import { loadContent } from "../templates/content.js";

const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

const site = new URL("../public/", import.meta.url);
const { site: facts, strings } = loadContent();
const scratch = mkdtempSync(join(tmpdir(), "card-"));

try {
  for (const locale of facts.locales) {
    const page = join(scratch, `${locale.code}.html`);
    const image = fileURLToPath(new URL(`og-${locale.code}.png`, site));
    const context = { site: facts, locale, t: strings[locale.code], root: site.href };
    writeFileSync(page, String(card(context, site.href)));
    execFileSync(
      CHROME,
      [
        "--headless",
        "--disable-gpu",
        "--hide-scrollbars",
        "--force-device-scale-factor=1",
        "--window-size=1200,630",
        "--virtual-time-budget=4000",
        `--screenshot=${image}`,
        pathToFileURL(page).href,
      ],
      { stdio: "ignore" },
    );
    execFileSync("oxipng", ["-o", "2", "--strip", "safe", image], { stdio: "ignore" });
    console.log(`wrote  public/og-${locale.code}.png`);
  }
} finally {
  rmSync(scratch, { recursive: true });
}
