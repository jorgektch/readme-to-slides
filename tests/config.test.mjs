import test from 'node:test';
import assert from 'node:assert/strict';
import {
  titleFromSlug, normalizeConfig, resolveRemoteReadme,
  resolveLocalRepository, prepareRemoteMarkdown, safeHttpUrl
} from '../assets/js/config.mjs';

test('repo slugs produce readable titles', () => {
  assert.equal(titleFromSlug('mi-primer-mcp-desde-cero'), 'Mi primer MCP desde cero');
  assert.equal(titleFromSlug('readme-to-slides'), 'README to slides');
});

test('theme customization merges with defaults', () => {
  const config = normalizeConfig({theme:{colors:{accent:'#112233'}}, slides:{width:1440,autoSlideMs:12000}});
  assert.equal(config.theme.colors.accent, '#112233');
  assert.equal(config.theme.colors.background, '#0B1020');
  assert.equal(config.slides.width, 1440);
  assert.equal(config.slides.autoSlideMs, 12000);
  assert.equal(config.presenter.name, 'Jorge Jesús Quispe Villaverde');
});

test('invalid CSS values and slide dimensions fall back safely', () => {
  const config = normalizeConfig({
    theme:{colors:{accent:'url(javascript:alert(1))'}, fonts:{heading:'Poppins;display:none'}},
    slides:{width:-100, height:100000, transition:'rotate', markdown:'../private.md'}
  });
  assert.equal(config.theme.colors.accent, '#36E0C4');
  assert.equal(config.theme.fonts.heading, 'Poppins');
  assert.equal(config.slides.width, 1280);
  assert.equal(config.slides.transition, 'fade');
  assert.equal(config.slides.markdown, 'README.md');
});

test('GitHub blob links become raw README URLs', () => {
  const remote = resolveRemoteReadme('https://github.com/owner/repo/blob/main/README.md');
  assert.equal(remote.rawUrl, 'https://raw.githubusercontent.com/owner/repo/main/README.md');
  assert.equal(remote.repository, 'https://github.com/owner/repo');
  assert.equal(remote.slug, 'repo');
});

test('remote links reject non-GitHub sources and insecure protocols', () => {
  assert.throws(() => resolveRemoteReadme('http://github.com/a/b/blob/main/README.md'));
  assert.throws(() => resolveRemoteReadme('https://evil.test/repo/blob/main/README.md'));
  assert.equal(safeHttpUrl('javascript:alert(1)'), null);
});

test('local owner and repository derive from github.io hostname', () => {
  const actual = resolveLocalRepository({hostname:'someone.github.io',pathname:'/my-presentation/'});
  assert.equal(actual.repository, 'https://github.com/someone/my-presentation');
});

test('remote Markdown escapes HTML outside code fences', () => {
  const m = '# Demo\n<img src=x onerror=alert(1)>\n```html\n<b>code</b>\n```\n[unsafe](javascript:alert(1))';
  const sanitized = prepareRemoteMarkdown(m);
  assert.match(sanitized,/&lt;img/);
  assert.match(sanitized, /<b>code<\/b>/);
  assert.doesNotMatch(sanitized,/\]\(javascript:/);
});

test('navigation visibility configuration is validated and defaults to auto', () => {
  const defaults = normalizeConfig();
  assert.equal(defaults.slides.navigationVisibility, 'auto');
  assert.equal(defaults.slides.navigationHideDelayMs, 3000);
  assert.equal(defaults.slides.navigationRevealZonePx, 90);
  const custom = normalizeConfig({slides:{
    navigationVisibility:'always',navigationHideDelayMs:5000,navigationRevealZonePx:110
  }});
  assert.equal(custom.slides.navigationVisibility,'always');
  assert.equal(custom.slides.navigationHideDelayMs,5000);
  assert.equal(custom.slides.navigationRevealZonePx,110);
  const invalid = normalizeConfig({slides:{
    navigationVisibility:'hover', navigationHideDelayMs:1,
    navigationRevealZonePx:900
  }});
  assert.equal(invalid.slides.navigationVisibility,'auto');
  assert.equal(invalid.slides.navigationHideDelayMs,3000);
  assert.equal(invalid.slides.navigationRevealZonePx,90);
});
