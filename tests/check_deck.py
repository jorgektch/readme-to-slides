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
