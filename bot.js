import { chromium } from 'playwright';
import fetch from 'node-fetch';

const URL = process.env.TARGET_URL;
const WEBHOOK = process.env.WEBHOOK_URL;

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  await page.goto(URL, { waitUntil: "networkidle" });

  const text = await page.evaluate(() => {
    return document.body.innerText
      .replace(/\n{3,}/g, "\n\n")
      .slice(0, 1800);
  });

  await fetch(WEBHOOK, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      content: `[페르노스 · 백야 자동 갱신]\n\n${text}`
    })
  });

  await browser.close();
})();
