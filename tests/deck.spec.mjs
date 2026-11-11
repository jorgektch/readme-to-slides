import {test,expect} from '@playwright/test';

test('loads README slides, styles, controls and diagrams',async ({page}) => {
  await page.goto('/',{waitUntil:'domcontentloaded'});
  await page.waitForFunction(() => window.slideReady === true, null, {timeout:45000});
  const count = await page.locator('.reveal .slides section').count();
  expect(count).toBeGreaterThan(12);
  await expect(page.locator('.cover-title')).toHaveText('README to Slides');
  await expect(page.locator('[data-config="email"]').first()).toHaveText('jorgektch@gmail.com');
  // Do not hardcode the template's repository: this test is copied with the template.
  // GitHub Pages detects its own repo automatically; localhost uses the configured URL.
  const settings = await (await page.request.get('/presentation.config.json')).json();
  await expect(page.locator('#nav-repository')).toHaveAttribute('href', settings.presentation.repositoryUrl);
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
  await page.mouse.move(1200, 690); // reveal the hidden-by-default toolbar
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
  await page.mouse.move(1200, 690); // reveal the hidden-by-default toolbar
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

test('automatic navigation hides while slide counter stays visible and reveals on proximity',async ({page}) => {
  await page.goto('/',{waitUntil:'domcontentloaded'});
  await page.waitForFunction(() => window.slideReady === true, null, {timeout:45000});
  const navigation=page.locator('#deck-navigation');
  const counter=page.locator('#deck-counter');
  await page.mouse.move(80,100);
  await expect(navigation).not.toHaveClass(/is-visible/, {timeout:6500});
  await expect(counter).toBeVisible();
  const size=page.viewportSize();
  await page.mouse.move(size.width-55,size.height-30);
  await expect(navigation).toHaveClass(/is-visible/);
  await expect(counter).toBeVisible();
  await page.locator('#nav-next').focus();
  await page.mouse.move(80,100);
  await expect(navigation).toHaveClass(/is-visible/);
  // Mouse clicks must not leave buttons focused and prevent auto-hide forever.
  await page.locator('#nav-next').click();
  await page.mouse.move(80,100);
  await expect(navigation).not.toHaveClass(/is-visible/, {timeout:6500});
});

test('touch devices can reveal and dismiss toolbar without hiding counter',async ({browser}) => {
  const context=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
  const page=await context.newPage();
  try {
    await page.goto('/',{waitUntil:'domcontentloaded'});
    await page.waitForFunction(() => window.slideReady === true, null, {timeout:45000});
    const trigger=page.locator('#nav-reveal-trigger');
    const nav=page.locator('#deck-navigation');
    const counter=page.locator('#deck-counter');
    await expect(trigger).toBeVisible();
    await expect(counter).toBeVisible();
    await page.waitForTimeout(3100);
    await trigger.tap();
    await expect(nav).toHaveClass(/is-visible/);
    await expect(trigger).toHaveAttribute('aria-expanded','true');
    await trigger.tap();
    await expect(nav).not.toHaveClass(/is-visible/);
    await expect(counter).toBeVisible();
  } finally {await context.close();}
});


test('slide URL is numeric and F5 restores horizontal and vertical position',async ({page}) => {
  await page.goto('/',{waitUntil:'domcontentloaded'});
  await page.waitForFunction(() => window.slideReady === true, null, {timeout:45000});
  const indices=await page.evaluate(() => {
    const stack=document.querySelector('.reveal .slides section.stack');
    if (!stack) throw Error('Missing vertical stack');
    const {h}=Reveal.getIndices(stack);
    Reveal.slide(h,1);
    return Reveal.getIndices();
  });
  await expect.poll(() => page.evaluate(() => location.hash)).toMatch(/^#\/\d+\/1$/);
  const previous=await page.evaluate(() => location.hash);
  await page.reload({waitUntil:'domcontentloaded'});
  await page.waitForFunction(() => window.slideReady === true, null, {timeout:45000});
  expect(await page.evaluate(() => Reveal.getIndices().h)).toBe(indices.h);
  expect(await page.evaluate(() => Reveal.getIndices().v)).toBe(1);
  expect(await page.evaluate(() => location.hash)).toBe(previous);
});

test('video and table content stay within virtual slide bounds',async ({page}) => {
  await page.goto('/',{waitUntil:'domcontentloaded'});
  await page.waitForFunction(() => window.slideReady === true, null, {timeout:45000});
  const cases=['Videos: un enlace Markdown, un reproductor','Configuración esencial','Configuración avanzada'];
  for (const label of cases) {
    const result=await page.evaluate(label => {
      const slide=Reveal.getSlides().find(s => s.textContent.includes(label));
      if(!slide) throw Error(`Missing slide: ${label}`);
      const {h,v}=Reveal.getIndices(slide);
      Reveal.slide(h,v);
      window.slideFitController.run();
      return {actual:slide.scrollHeight,limit:Reveal.getConfig().height,
        mode:window.slideFitDiagnostics.last.mode};
    },label);
    expect(result.actual).toBeLessThanOrEqual(result.limit);
    expect(result.mode).not.toBe('overflow');
  }
});
