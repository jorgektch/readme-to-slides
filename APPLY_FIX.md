# README to Slides v1.5.0 — GitHub Actions regression fix

This is a **test/documentation-only** differential, based on the published `main` version on 2026-11-11. It changes no runtime presentation engine files and does not modify `engine-release.json` or the v1.5.0 version number.

## Cause of both failures

1. The mobile navigation starts visible for a brief introductory hint, but may have hidden by the time the test reaches it. The old Playwright test always expected the first tap to expand the menu, instead of verifying a toggle of the current state. The revised test uses a long hide delay to avoid racing the timer and verifies both transitions.
2. The remote README fixture omitted blank lines around the `---` slide separator. Reveal.js's configured separator requires lines surrounding the marker. Consequently, the simulated README was parsed as **one slide**; the `---` became a Setext heading underline, and the expected fenced code was no longer in a `<pre>` block. The relative URL resolver itself passed its assertions.

## What changed

- `tests/deck.spec.mjs`: verify mobile touch toggles from whichever visibility state the toolbar currently has, without racing the auto-hide timer; add proper blank lines to the remote README fixture; assert that two slides and the fenced code block exist, without creating an unsafe link.
- `docs/CUSTOMIZATION.md`: document the blank-line requirement around slide separators.

## Apply

1. Extract the ZIP in the **root** of `jorgektch/readme-to-slides`, preserving paths.
2. Replace `tests/deck.spec.mjs` and `docs/CUSTOMIZATION.md`.
3. Run `npm run test:e2e` locally (with dependencies) or push and verify GitHub Actions.
4. Do **not** modify the release manifest or update the version: no engine file changed.

The fix also leaves the end-user UI unchanged; no user-owned Markdown, themes, or navigation behavior is overwritten.
