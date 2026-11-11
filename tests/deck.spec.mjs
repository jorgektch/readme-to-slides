import {test,expect} from '@playwright/test';

test('loads README slides, styles, controls and diagrams',async ({page}) => {
  await page.goto('/',{waitUntil:'domcontentloaded'});
  await page.waitForFunction(() => window.slideReady === true, null, {timeout:45000});
  const count = await page.locator('.reveal .slides section').count();
  expect(count).toBeGreaterThan(12);
  await expect(page.locator('.cover-title')).toHaveText('README to Slides');
  await expect(page.locator('[data-config="email"]').first()).toHaveText('jorgektch@gmail.com');
  await expect(page.locator('#nav-repository')).toHaveAttribute('href','https://github.com/jorgektch/readme-to-slides');
  const diagrams = await page.evaluate(() => window.slideDiagnostics);
  expect(diagrams.detected).toBeGreaterThanOrEqual(3);
  expect(diagrams.errors).toEqual([]);
  expect(diagrams.rendered).toBe(diagrams.detected);
});

test('horizontal and vertical toolbar navigation works',async ({page}) => {
  await page.goto('/',{waitUntil:'domcontentloaded'});
  await page.waitForFunction(() => window.slideReady === true, null, {timeout:45000});
  // Programmatic navigation positions the first vertical stack at its parent slide.
  const indices = await page.evaluate(() => {
    const nested = [...document.querySelectorAll('.reveal .slides section.stack')][0];
    const {h,v} = Reveal.getIndices(nested);
    Reveal.slide(h,0);
    return {h,v};
  });
  await expect(page.locator('#nav-down')).toBeEnabled();
  await page.locator('#nav-down').click();
  expect(await page.evaluate(() => Reveal.getIndices().v)).toBe(1);
  await page.locator('#nav-up').click();
  expect(await page.evaluate(() => Reveal.getIndices().v)).toBe(0);
  await page.locator('#nav-next').click();
  expect(await page.evaluate(() => Reveal.getIndices().h)).toBe(indices.h+1);
});


test('theme toggle cycles dark, light and auto; updates colors and diagrams',async ({page}) => {
  await page.goto('/',{waitUntil:'domcontentloaded'});
  await page.waitForFunction(() => window.slideReady === true, null, {timeout:45000});
  const toggle=page.locator('#nav-theme');
  await expect(toggle).toBeVisible();
  await expect(page.locator('html')).toHaveAttribute('data-deck-theme','dark');
  await toggle.click();
  await expect(page.locator('html')).toHaveAttribute('data-deck-theme','light');
  await expect(page.locator('.cover-card')).toHaveCSS('background-color','rgb(247, 250, 252)');
  await page.waitForFunction(() => window.slideDiagnostics.rendered === window.slideDiagnostics.detected,null,{timeout:45000});
  await toggle.click();
  await expect(page.locator('html')).toHaveAttribute('data-theme-choice','auto');
  await toggle.click();
  await expect(page.locator('html')).toHaveAttribute('data-deck-theme','dark');
});

test('video URL becomes native video player on the relevant slide',async ({page}) => {
  await page.goto('/',{waitUntil:'domcontentloaded'});
  await page.waitForFunction(() => window.slideReady === true, null, {timeout:45000});
  const indices = await page.evaluate(() => {
    const slide=Reveal.getSlides().find(s => s.textContent.includes('Videos: un enlace Markdown, un reproductor'));
    if (!slide) throw new Error('Video slide is missing');
    const {h,v}=Reveal.getIndices(slide);
    Reveal.slide(h,v);
    return {h,v};
  });
  expect(indices.h).toBeGreaterThan(0);
  const video=page.locator('.slide-video video').first();
  await expect(video).toHaveAttribute('controls','');
  await expect(video).toHaveAttribute('src',/flower\.mp4/);
  await expect(page.locator('.slide-video figcaption a')).toHaveAttribute('href',/flower\.mp4/);
});
