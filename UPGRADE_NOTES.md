# Upgrade notes — README to Slides v1.2: Multimedia & Themes

This is a **differential package** built against `jorgektch/readme-to-slides` main at the v1.1 revision (README blob `3333c2b1`).

## Apply

1. Extract the ZIP.
2. Copy files and folders **preserving their paths** to the repository root; replace existing files where prompted.
3. Commit and push. No dependency installation or build step is needed for GitHub Pages.
4. Open `https://jorgektch.github.io/readme-to-slides/` and verify: a dark cover, video example, theme button cycling dark / light / auto, and readable Mermaid diagrams in both themes.
5. Inspect Actions to confirm the checks pass.

## Replaced files

- `README.md` — multimedia and theme demonstration slides and instructions
- `index.html` — theme toggle button
- `presentation.config.json` — theme presets and media settings
- `assets/js/config.mjs` — new config validation and defaults
- `assets/js/app.mjs` — theme state, video embedding, paused/unloaded players, Mermaid re-theming
- `assets/theme.css` — fully themed slide surfaces and responsive player
- `docs/CUSTOMIZATION.md`, `docs/ARCHITECTURE.md`, `UPGRADE_NOTES.md`
- `package.json`, `tests/check_deck.py`, `tests/deck.spec.mjs`

## New files

- `assets/js/theme.mjs`
- `assets/js/media.mjs`
- `docs/MEDIA_AND_THEMES.md`
- `tests/theme-media.test.mjs`

## Defaults and intentional limits

- Dark Mode remains default; original creator name, email, handle and social media stay unchanged.
- No video is set to autoplay by default. Video providers must allow embedding.
- The HTML from remote README mode is still escaped; video links themselves are converted only for recognized formats and hosts.
- Browser remembers a visitor's manually selected theme in localStorage; remove the localStorage key `readme-to-slides.theme-choice.v1` to honor the repository's configured default again.
- If you use a hardcoded `data-background-color` on custom slides, it intentionally overrides the theme for that slide.

## v1.3 — Contextual navigation

Replace the updated files preserving their relative paths. Add
`assets/js/navigation.mjs`, `docs/NAVIGATION.md` and
`tests/navigation.test.mjs`. New options are placed in
`presentation.config.json` under `slides`:

- `navigationVisibility: "auto"` (or `"always"` for the old v1.2 behavior)
- `navigationHideDelayMs: 3000`
- `navigationRevealZonePx: 90`

The bottom-left counter remains fixed, independent of the toolbar. In `auto`
mode, desktop users reveal controls by moving to the bottom-right corner, and
mobile users use a compact ellipsis button. Do not delete your existing contact
or theme settings when updating a customized configuration; merge these three
new fields instead.
