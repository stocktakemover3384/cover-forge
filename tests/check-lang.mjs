/* 临时：验证英文切换（跑完即删） */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright-core';

const here = path.dirname(fileURLToPath(import.meta.url));
const APP = 'file://' + path.resolve(here, '..', 'index.html');
const tmp = path.join(here, '_en-fix');
fs.rmSync(tmp, { recursive: true, force: true });
fs.mkdirSync(tmp, { recursive: true });

const browser = await chromium.launch({ channel: 'chrome', headless: true });
const c0 = await browser.newContext();
const p0 = await c0.newPage();
await p0.goto('about:blank');
const b64 = await p0.evaluate(async () => {
  const c = document.createElement('canvas');
  c.width = 2000; c.height = 1200;
  const g = c.getContext('2d');
  const gr = g.createLinearGradient(0, 0, 2000, 1200);
  gr.addColorStop(0, '#1e3a5f'); gr.addColorStop(1, '#e8a33d');
  g.fillStyle = gr; g.fillRect(0, 0, 2000, 1200);
  g.fillStyle = '#0b0d10'; g.font = '120px sans-serif'; g.textBaseline = 'middle';
  g.fillText('EN CHECK', 80, 600);
  const b = await new Promise((r) => c.toBlob(r, 'image/jpeg', 0.9));
  const u8 = new Uint8Array(await b.arrayBuffer());
  let s = ''; for (let i = 0; i < u8.length; i++) s += String.fromCharCode(u8[i]);
  return btoa(s);
});
await c0.close();
fs.writeFileSync(path.join(tmp, 'en-src.jpg'), Buffer.from(b64, 'base64'));

const logs = [];
const foreign = [];
const ctx = await browser.newContext({ viewport: { width: 1512, height: 950 }, acceptDownloads: true });
const page = await ctx.newPage();
page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') logs.push(m.type() + ': ' + m.text()); });
page.on('pageerror', (e) => logs.push('PAGEERROR: ' + e.message));
page.on('request', (r) => { const u = new URL(r.url()); if (u.protocol === 'http:' || u.protocol === 'https:') foreign.push(u.href); });

const out = [];
const chk = (n, ok, d) => out.push(`[${ok ? 'PASS' : 'FAIL'}] ${n} — ${d}`);
const idle = () => page.waitForFunction(() => {
  const b = document.getElementById('stage-busy');
  return b && b.hidden === true && document.getElementById('sm-actual').textContent.indexOf('计算中') === -1;
}, null, { timeout: 120000, polling: 100 });

await page.goto(APP);
chk('默认为中文', (await page.title()).indexOf('封面工坊') > -1, await page.title());

await page.click('#btn-lang');
await page.waitForTimeout(400);
chk('切换后 <title> 变英文', (await page.title()).indexOf('CoverForge —') === 0, await page.title());
chk('切换后 html[lang]=en', (await page.evaluate(() => document.documentElement.lang)) === 'en', await page.evaluate(() => document.documentElement.lang));
chk('按钮变为「中文」', (await page.textContent('#btn-lang')) === '中文', await page.textContent('#btn-lang'));

const probes = [
  ['.brand__tag', 'Forge one image'],
  ['.privacy-badge span', 'On-device'],
  ['#h-source', '01 · Source'],
  ['#dropzone .dropzone__title', 'Drop an image'],
  ['#source-info .kv__row:nth-of-type(1) dt', 'File name'],
  ['#btn-change-file', 'Change image'],
  ['#readout .readout__item:nth-of-type(1) .readout__label', 'Output size'],
  ['#panel-ratio .panel__body h3:nth-of-type(1)', 'Common ratios'],
  ['#size-modes .chip[data-mode="max"] .chip__main', 'Maximum available'],
  ['#lbl-format', 'Format'],
  ['#summary-list .summary__row:nth-of-type(1) dt', 'Output size'],
  ['.stage-empty__title', 'Nothing loaded yet']
];
for (const [sel, want] of probes) {
  const got = (await page.textContent(sel)).trim();
  chk('英文文案 ' + sel, got === want || got.indexOf(want) === 0, `「${got}」`);
}

// 预设名与 aria 也应已刷新
const presetName = await page.textContent('#platform-presets .preset:nth-of-type(1) .preset__name');
chk('平台预设名为英文', /Bilibili cover/.test(presetName), presetName);
const presetAria = await page.getAttribute('#platform-presets .preset[data-id="wechat"]', 'aria-label');
chk('预设 aria-label 为英文', /WeChat article header · ratio/.test(presetAria), presetAria);

// 英文下完整走一遍：上传 → 比例 → 目标体积 → 下载
await page.setInputFiles('#file-input', path.join(tmp, 'en-src.jpg'));
await idle();
await page.click('#generic-ratios .chip[data-rw="16"][data-rh="9"]');
await idle();
await page.click('#size-presets .chip:text-is("500 KB")');
await idle();
chk('英文下正常渲染', /×/.test(await page.textContent('#sm-dims')), await page.textContent('#sm-dims'));
chk('英文下达标判定', /Target met/i.test(await page.textContent('#sm-verdict')), (await page.textContent('#sm-verdict')).trim());

const [dl] = await Promise.all([
  page.waitForEvent('download', { timeout: 90000 }),
  page.click('#btn-download')
]);
const dest = path.join(tmp, dl.suggestedFilename());
await dl.saveAs(dest);
const buf = fs.readFileSync(dest);
chk('英文下可导出有效 JPG', buf[0] === 0xff && buf[1] === 0xd8 && buf.length > 1024, `${buf.length} B · ${dl.suggestedFilename()}`);

// 刷新后应记住英文
await page.reload();
await page.waitForTimeout(500);
chk('刷新后仍为英文（localStorage 记住）', (await page.evaluate(() => document.documentElement.lang)) === 'en', await page.title());

chk('全程无第三方网络请求', foreign.length === 0, foreign.length ? foreign.slice(0, 2).join(', ') : '0');
chk('无 console error/warning 与未捕获异常', logs.length === 0, logs.length ? logs.slice(0, 3).join(' | ') : '0');

await ctx.close();
await browser.close();
fs.rmSync(tmp, { recursive: true, force: true });
console.log(out.join('\n'));
const failed = out.filter((l) => l.startsWith('[FAIL]')).length;
console.log(`\n英文切换验证：${out.length - failed}/${out.length} 通过`);
process.exit(failed ? 1 : 0);
