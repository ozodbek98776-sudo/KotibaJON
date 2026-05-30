import { chromium } from 'playwright';
import { mkdirSync } from 'fs';
mkdirSync('C:/Temp/ss', { recursive: true });
(async () => {
  const b = await chromium.launch({ headless: true });
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
  const p = await ctx.newPage();
  await p.goto('https://kotibajon.vercel.app/register', { waitUntil: 'networkidle', timeout: 30000 });
  await p.waitForTimeout(1000);
  await p.screenshot({ path: 'C:/Temp/ss/vercel-register.png' });
  await p.goto('https://kotibajon.vercel.app/login', { waitUntil: 'networkidle', timeout: 30000 });
  await p.waitForTimeout(1000);
  await p.screenshot({ path: 'C:/Temp/ss/vercel-login.png' });
  console.log('Done');
  await b.close();
})();
