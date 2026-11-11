# Template portability and regression tests — v1.5.0

README to Slides is a reusable template, not a fixed demonstration deck. The
checks supplied in this version test the **engine** without requiring users to
preserve the demo's author, headings, Mermaid blocks, video, tables or sample
slides. A valid one-slide Markdown document is supported.

## New coverage

- A custom presentation title, presenter and color theme can pass CI.
- Broken Markdown assets, invalid JSON, duplicated Reveal slide IDs and
  an out-of-date configured repository link produce actionable diagnostics.
- Browser fixtures cover minimal slides, vertical navigation, reload, touch,
  Dark/Light/Auto themes, remote Markdown HTML escaping and relative links.
- Theme choices are stored per repository, not shared between different decks
  on the same `github.io` hostname.
- The updater refuses unknown engine files, changed local engine sources,
  invalid checksums, major-version breaks and configuration migrations.
- Remote README relative assets are rewritten only after Markdown is parsed,
  preserving Markdown code samples, internal anchors and absolute links.

## How to run

```bash
npm test
python tests/check_deck.py
python tests/test_quality_checker.py
python -m unittest discover -s tests -p test_engine_update.py
npm install
npx playwright install chromium
npm run test:e2e
```

The last two lines require browser dependencies and network access to external
CDNs; they're designed to run in GitHub Actions. This environment independently
verified DOM rewriting in Chromium, but did not run the complete CDN-backed deck.

## Adoption

Copy the v1.5.0 differential to the **source** `readme-to-slides` repository.
Existing cloned workshops must not replace their personal README or JSON config
with template demo files. See [docs/ENGINE_UPDATES.md](docs/ENGINE_UPDATES.md)
for safe one-time bootstrap and reviewable future updates.
