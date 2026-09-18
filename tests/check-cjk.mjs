/* 临时：切到英文后，全量扫描 DOM 里残留的中文（文本节点 + 常用属性）。跑完即删。 */
import { chromium } from 'playwright-core';

const APP = 'file:///Users/liamqiu/WorkBuddy/2026-09-18-11-27-07/cover-forge/index.html';
const CJK = /[\u4e00-\u9fff\u3000-\u303f\uff00-\uffef]/;

const browser = await chromium.launch({ channel: 'chrome', headless: true });
const ctx = await browser.newContext({ viewport: { width: 1512, height: 950 } });
const page = await ctx.newPage();
await page.goto(APP);
await page.waitForTimeout(400);

await page.click('#btn-lang');
await page.waitForTimeout(500);

const found = await page.evaluate((src) => {
  const out = [];
  const re = new RegExp(src);
  const bad = (s) => re.test(s || '');

  // 1) 文本节点（只看“叶子级”元素，避免父容器重复计数）
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  const seen = new Set();
  while (walker.nextNode()) {
    const node = walker.currentNode;
    const txt = node.nodeValue || '';
    if (!bad(txt.trim())) continue;
    const el = node.parentElement;
    if (!el) continue;
    // 跳过脚本/样式
    if (['SCRIPT', 'STYLE'].includes(el.tagName)) continue;
    // 找一个能定位的描述
    let desc = el.tagName.toLowerCase();
    if (el.id) desc += '#' + el.id;
    else if (el.className && typeof el.className === 'string') desc += '.' + el.className.trim().split(/\s+/).join('.');
    const key = desc + '|' + txt.trim().slice(0, 60);
    if (seen.has(key)) continue;
    seen.add(key);
    out.push('[文本] ' + desc + ' → "' + txt.trim().slice(0, 80) + '"');
  }

  // 2) 属性
  const ATTRS = ['aria-label', 'title', 'placeholder', 'alt'];
  document.querySelectorAll('*').forEach((el) => {
    if (['SCRIPT', 'STYLE'].includes(el.tagName)) return;
    for (const a of ATTRS) {
      const v = el.getAttribute(a);
      if (bad(v)) {
        let desc = el.tagName.toLowerCase();
        if (el.id) desc += '#' + el.id;
        else if (el.className && typeof el.className === 'string') desc += '.' + el.className.trim().split(/\s+/).join('.');
        out.push('[' + a + '] ' + desc + ' → "' + v.slice(0, 80) + '"');
      }
    }
  });

  // 3) <title> 与 <meta description>
  if (bad(document.title)) out.push('[title] → "' + document.title + '"');
  const md = document.querySelector('meta[name="description"]');
  if (md && bad(md.getAttribute('content'))) out.push('[meta description] → "' + md.getAttribute('content') + '"');

  return out;
}, CJK.source);
// #btn-lang 显示对方语言的名字是正确行为（中文界面显示 EN、英文界面显示 中文）
const real = found.filter((f) => f.indexOf('button#btn-lang') === -1);
console.log('英文界面下残留中文：' + real.length + ' 处（另有语言切换按钮 1 处，属正确行为）');
real.forEach((f) => console.log('  ' + f));

await ctx.close();
await browser.close();
process.exit(found.length ? 1 : 0);
