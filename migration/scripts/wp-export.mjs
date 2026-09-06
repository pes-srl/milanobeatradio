// Logs into wp-admin with Playwright, then fetches the WXR export directly
// over HTTP with the session cookies (more robust than waiting for a browser download).
import { chromium } from '/Users/mirkodgz/.npm/_npx/e41f203b7505f1fb/node_modules/playwright/index.mjs';
import fs from 'node:fs';
import path from 'node:path';

const BASE = 'https://milanobeatradio.it';
const OUT = path.resolve('migration/export.xml');
const { WP_USER, WP_PASS } = process.env;
if (!WP_USER || !WP_PASS) throw new Error('WP_USER / WP_PASS missing');

const browser = await chromium.launch({ headless: true });
const ctx = await browser.newContext({ userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Safari/537.36' });
const page = await ctx.newPage();

console.log('→ login');
await page.goto(`${BASE}/wp-login.php`, { waitUntil: 'domcontentloaded' });
await page.fill('#user_login', WP_USER);
await page.fill('#user_pass', WP_PASS);
await Promise.all([page.waitForNavigation({ waitUntil: 'domcontentloaded' }), page.click('#wp-submit')]);
if (page.url().includes('wp-login.php')) throw new Error('login failed: ' + page.url());
console.log('✓ logged in');

console.log('→ GET export.php?download=true&content=all');
const t0 = Date.now();
const res = await ctx.request.get(`${BASE}/wp-admin/export.php?download=true&content=all`, { timeout: 600_000 });
console.log('status', res.status(), res.headers()['content-type'], res.headers()['content-disposition'] ?? '(no disposition)', `${((Date.now()-t0)/1000).toFixed(1)}s`);
const body = await res.body();
fs.writeFileSync(OUT, body);
console.log(`✓ saved ${OUT} (${(body.length / 1024 / 1024).toFixed(2)} MB)`);
await browser.close();
