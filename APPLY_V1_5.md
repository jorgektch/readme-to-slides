# Apply README to Slides v1.5.0 (Issues #1 and #2)

**Target repository:** `jorgektch/readme-to-slides` — the original template.
**Baseline:** latest main with the `presentation.repositoryUrl` fix.
**Type:** differential package: only changed/new files, not a complete fork.

## Apply

1. Unzip at the root of `jorgektch/readme-to-slides`, preserving folders.
2. Review the diff: `README.md` contains a **documentation-only** addition;
   the existing slides, author and presentation style remain in place.
3. Commit: `feat: resolve remote README assets and enable safe engine update PRs`.
4. Run tests and inspect the **validate** and **browser** GitHub Actions jobs.
5. **Publish a GitHub Release named `v1.5.0` from that exact commit.** A Git tag
   alone does not activate automatic update detection. Do not create the
   release from a different commit because the SHA-256 manifest must match.
6. Read `docs/ENGINE_UPDATES.md` for adoption into existing or new template
   copies. It remains opt-in; new copies have update checks disabled.

## Feature status

- **Issue #1:** implemented in `assets/js/remote-assets.mjs`; Markdown DOM
  images, videos and links are resolved to their source GitHub repository.
- **Issue #2:** implemented as a safe framework; future updates require
  published GitHub Releases, optional Actions variable/permission, passing
  tests and explicit PR review before merge.

## Safeguards

- Never writes `README.md`, `presentation.config.json`, `index.html`, datasets,
  custom media, project tests, or documents during engine update PRs.
- Refuses local engine modifications, incompatible major versions, changes to
  config schema, unknown release paths and invalid SHA-256 checksums.
- Does not auto-merge or push to `main`.
- A release needing new HTML markup must be marked as a manual migration.

## Existing workshop repositories

These files are prepared for the **upstream template**. Do not upload this ZIP
unchanged into an existing workshop because its demo `README.md` would replace
that workshop's content. To bootstrap an existing workshop, first compare and
manually update its engine files to the v1.5 baseline, then copy only the
`engine-release.json`, `tools/`, update workflow and update guide. Preserve
that workshop's own JSON and README.

## Validation performed

- 49 JavaScript unit tests passed.
- 9 offline updater tests passed.
- 11 template portability/static QA tests passed.
- Static deck and JSON validation passed.
- Chromium offline DOM resource rewriting smoke test passed.
- Full CDN-backed Playwright E2E suite was **not** run in this environment;
  the included GitHub Actions workflow will execute it after upload.
