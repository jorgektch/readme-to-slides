# Upstream fix — correct repository link for template copies

This is a **differential patch for `jorgektch/readme-to-slides`**, not for the neural-network workshop.
Replace the listed files in the template repository while preserving directory paths.

Files changed:

- `assets/js/config.mjs`: validated optional `presentation.repositoryUrl`, plus runtime repo detection precedence.
- `assets/js/app.mjs`: use configured canonical URL for local preview.
- `presentation.config.json`: canonical URL of the original template as an editable example.
- `tests/config.test.mjs`: regression coverage for local hosting, GitHub Pages and unsafe URLs.
- `tests/deck.spec.mjs`: assert repository URL from config rather than hardcoded template name.
- `docs/CUSTOMIZATION.md`: how to set the repository URL in copies.
- `README.md`: mention the required config field in Quick Start.

Order of precedence:
1. Remote README via `?url=` => remote README repository.
2. GitHub Pages => derive owner and repo from hostname/path.
3. Local preview / unknown host => configured `presentation.repositoryUrl`.
4. Existing legacy fallback when no configuration exists.

Important: This patch **does not automatically update repositories already created from the template**.
Those require applying the previously delivered fix or explicitly pulling the changed engine files.

Validation: run `node --test tests/*.test.mjs`; then `npm run test:e2e` under
GitHub Actions for the browser checks. Existing deck/theme/features remain unchanged.
