"""Dependency-free static checks for the documentation-as-slides template."""
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
readme = (ROOT / 'README.md').read_text(encoding='utf-8')
config = json.loads((ROOT / 'presentation.config.json').read_text(encoding='utf-8'))
index = (ROOT / 'index.html').read_text(encoding='utf-8')
app = (ROOT / 'assets/js/app.mjs').read_text(encoding='utf-8')

assert config['presentation']['title']
assert config['presenter']['name'] == 'Jorge Jesús Quispe Villaverde'
assert (ROOT / 'LICENSE').exists()
assert (ROOT / 'assets/images/preview.png').exists()
assert '<h1' in readme and 'README to Slides' in readme
assert 'Quick Start' in readme and 'Use this template' in readme
assert len(re.findall(r'^---$',readme,re.M)) >= 12, 'At least 12 presentation sections required'
assert len(re.findall(r'^--$',readme,re.M)) >= 1, 'Vertical slide example required'
assert len(re.findall(r'^```mermaid\s*$',readme,re.M)) >= 3, 'Mermaid diagrams missing'
assert len(re.findall(r'^```(?:python|javascript|json|bash)\s*$',readme,re.M)) >= 3
assert '| :---' in readme, 'Tables required'
assert 'Note:' in readme, 'Presenter notes missing'
assert 'data-markdown' in index and 'assets/js/app.mjs' in index
assert 'Reveal.left()' in app and 'Reveal.right()' in app
assert 'routes.up' in app and 'routes.down' in app
for path in re.findall(r'(?:src|href)="(assets/[^"?#]+)"', readme + index):
    assert (ROOT / path).exists(), f'Missing local asset: {path}'
print('OK: configuration, README slide patterns, diagrams, links and local assets')

# v1.2: video examples, theme settings, docs and pure modules.
assert config['theme']['mode'] in ('dark','light','auto')
assert config['theme']['lightColors']['background'].startswith('#')
assert config['media']['embedVideoLinks'] is True
assert 'Video: clip MP4' in readme
assert 'Tres maneras de elegir el tema' in readme
assert 'id="nav-theme"' in index
assert 'parseVideoUrl' in app and 'activeThemeName' in app
assert (ROOT / 'assets/js/media.mjs').exists()
assert (ROOT / 'assets/js/theme.mjs').exists()
assert (ROOT / 'docs/MEDIA_AND_THEMES.md').exists()
print('OK: v1.2 light/dark/auto themes and video embed guide')


# v1.4 — shareable URL hash, safe video sizing and table readability.
assert 'id="markdown-slides"' not in index, 'Duplicate Markdown loader ID breaks Reveal URL hashes'
assert 'data-deck-source="readme"' in index
assert 'data-deck-source=' in app and "hash: true" in app
assert config['slides']['autoFitContent'] is True
assert (ROOT / 'assets/js/fit.mjs').exists()
assert 'Configuración esencial' in readme and 'Configuración avanzada' in readme
assert 'Qué valores puedes parametrizar' not in readme, 'Oversized table must be split'
assert 'theme.mode' in readme and 'auto' in readme
print('OK: v1.4 hash recovery, slide fitting and split configuration tables')
