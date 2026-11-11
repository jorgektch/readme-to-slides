# Upgrade notes — README to Slides v1.1

This package is intended to replace and extend the files in `jorgektch/readme-to-slides`.

## Upload steps

1. Download and extract the ZIP.
2. Copy the files **with their folder structure** into your repository root. Replace existing `README.md`, `index.html`, and `assets/theme.css`; add the new files and directories.
3. **Optional cleanup:** remove the old `assets/icons/` directory (`github.svg`, `instagram.svg`, `linkedin.svg`, `mail.svg`, `tiktok.svg`), because the viewer now uses Font Awesome via CDN. These SVGs are not in the ZIP and are not required.
4. Commit the changes; allow GitHub Actions and GitHub Pages to complete.
5. Open `https://jorgektch.github.io/readme-to-slides/` and confirm the cover, at least one Mermaid diagram, navigation, and Repo link.

## What changed

- New MIT `LICENSE`, `SECURITY.md`, `CONTRIBUTING.md`, and setup documentation.
- New `presentation.config.json` for talk metadata, presenter's public contact details, theme, fonts, dimensions, automatic durations and controls.
- Split the application into `assets/js/app.mjs` and pure helpers in `assets/js/config.mjs`.
- Rewritten `README.md` into a coherent presentation of the tool itself with Quick Start, intended audiences, architecture, tables, code, photos, diagrams, constraints, and exercises.
- New illustrative design preview at `assets/images/preview.png`.
- Automated checks in `.github/workflows/quality.yml`, Node unit tests, static checks, and optional Playwright browser tests.

## Compatibility

- GitHub Pages still publishes from `main` / `/(root)`; no build step is required for the live presentation.
- The author information remains Jorge Jesús Quispe Villaverde by default, as requested.
- CDN-hosted runtime libraries and fonts require internet access. CI browser tests also depend on those CDN assets.
- JSON personalization updates the rendered presentation; visible fallback author information in the GitHub README needs editing there as well if someone forks the project.
