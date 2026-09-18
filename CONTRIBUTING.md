# Contributing to CoverForge

Thanks for taking the time to look at this. CoverForge is small on purpose, so most
contributions are also small: a preset, a validation message, a test case, a
documentation fix.

---

## The one hard rule

**CoverForge must stay a zero-dependency, zero-build, offline-capable static page.**

That means: no framework, no bundler, no transpiler, no CDN link, no package
manager in the shipped app, no minified sources, no network request at runtime —
not even a font or an icon. All logic lives in `app.js`, all styling in
`styles.css`, all markup in `index.html`.

PRs that break this will be declined, regardless of what they enable. If a feature
seems to require a dependency, describe the problem in an issue first and we will
look for a native solution together — `canvas.toBlob` and the Canvas 2D API get
further than most people expect.

Two related invariants:

- **No network path.** Nothing about a user's image may leave the device. Do not add
  `fetch`, `XMLHttpRequest`, `WebSocket`, `sendBeacon`, a service worker, or any
  remote asset. There is no analytics and there will not be.
- **`file://` must keep working.** `app.js` is a classic script wrapped in an IIFE
  precisely because `<script type="module">` is blocked by CORS under `file://`.
  Do not convert it to a module, and do not add `import`/`export` to it.

## Interface language

The interface is **bilingual: Simplified Chinese (default) and English**. All
user-facing strings live in `i18n.js` under `STRINGS['zh-CN']` and `STRINGS['en']`;
`zh-CN` is the default and the Chinese text inline in `index.html` is the fallback
shown before scripts run.

Three rules keep this maintainable:

1. **The `zh-CN` value must match the inline text in `index.html` exactly.** The
   dictionary is the single source of truth for wording; the HTML copy exists only
   as a no-JavaScript fallback. `tests/check-dict.mjs` enforces this.
2. **The English UI must contain no Chinese.** `tests/check-cjk.mjs` walks every
   text node and the common ARIA attributes after switching to English.
3. Tone over flourish. Plain, specific, and honest about trade-offs — no marketing
   filler, and never a claim the code cannot back up. Same rule in both languages.

When you add or change a user-facing string:

- add the key to **both** tables in `i18n.js`;
- if it is static HTML, also add a `{ sel, key }` entry to the `DOM` map in
  `i18n.js` (or let the JS that already writes that node handle it);
- strings that are built at runtime must go through `tr(...)`, **not** a literal —
  and never name that helper `t`, which collides with locals such as
  `const t = S.targetBytes` in `paintStatus`.

```bash
cd tests
node check-cjk.mjs    # English UI must be free of Chinese
node check-dict.mjs   # zh dictionary must match the inline HTML
node check-lang.mjs   # full pass in English: render, compress, download, persist
```

---

## Repository layout

```
index.html      semantic markup, no inline style or inline script
styles.css      all styling; every value comes from a token in :root
app.js          all logic; classic script + IIFE
DESIGN.md       the design system (palette, type scale, spacing, motion)
README.md / README.zh-CN.md   project overview (keep both in sync)
USAGE.md / USAGE.zh-CN.md     user guides (keep both in sync)
tests/qa.mjs    end-to-end checks driven by a real browser
```

One file per concern. Do not split `app.js` into modules, and do not add a fourth
runtime file.

## Getting set up

There is nothing to install:

```bash
open index.html        # macOS  (xdg-open / start on Linux / Windows)
```

Edit, save, reload. That is the whole development loop.

If you prefer `http://`, a local static server works too and changes nothing:

```bash
python3 -m http.server 8000
```

### Running the tests

```bash
cd tests
npm install playwright-core     # one time
node qa.mjs
```

The suite launches your installed Chrome (`channel: 'chrome'`), so there is no
browser download. It injects images programmatically, drives the real UI, and
verifies the actual downloaded bytes — including JPEG/PNG magic bytes — instead of
assuming success. It exits non-zero on failure.

Output goes to `tests/output/` (report, screenshots, generated fixtures, captured
downloads) and is gitignored. Nothing is written into the shipped folder.

`tests/verify.mjs` is a second, adversarial suite that re-decodes the downloaded
files and reads the pixels back instead of trusting the UI's own numbers. Run it too
when you touch the crop geometry, the encoder, or transparency handling:

```bash
cd tests
node verify.mjs
```

It writes its fixtures and downloads into `tests/output-verify/`, a separate root from
`qa.mjs`'s `tests/output/`, so the two suites can be run in either order without either
run destroying the other's artifacts. Both roots are gitignored.

Three smaller checks guard the bilingual interface (see **Interface language** above):

```bash
cd tests
node check-cjk.mjs    # the English UI must contain no Chinese
node check-dict.mjs   # the zh dictionary must match the text inline in index.html
node check-lang.mjs   # a full pass in English: upload, crop, compress, download
```

**Behaviour changes need test coverage.** Please add or update cases in
`tests/qa.mjs`. Two things are worth knowing about the suite:

- It is organised into numbered groups (`1 · 上传路径` "Upload paths" … `11 · 离线性与稳定性` "Privacy & stability" — the group labels inside `qa.mjs` are in Chinese) with
  stable case IDs (`3.2`, `5.1`, …). Add cases inside the matching group, and use a
  new ID rather than renumbering existing ones.
- Case `11.1` asserts that **zero** non-`file://` requests occur during a full
  session. If your change makes it fail, your change is the problem.

---

## Common contributions

### Adding a platform preset

Presets are data, in `PLATFORM_GROUPS` in `app.js`:

```js
{
  name: tr('group.landscape'),            // group heading, rendered in order — keys live in i18n.js
  items: [
    { id: 'bilibili',                     // unique, stable; used for selection state
      name: tr('preset.bilibili'),        // shown on the card — keys live in i18n.js
      w: 16, h: 9,                        // aspect ratio (decimals allowed)
      pw: 1920, ph: 1080 }                // recommended output pixels
  ]
}
```

Checklist for a new preset:

1. `id` is unique — it is what marks the card as selected.
2. The ratio is either one of `GENERIC_RATIOS` or decimal-acceptable (e.g. `2.35:1`).
   A preset whose ratio has no matching generic chip still works; the chip row
   simply shows nothing as active, which is fine.
3. `pw × ph` matches `w : h` (the card displays both, and they must agree).
4. Verify the recommended size against the platform's current documentation — this
   file should not propagate stale numbers.
5. Add the preset to the tables in `README.md`, `README.zh-CN.md`, `USAGE.md` and
   `USAGE.zh-CN.md`.
6. Add a case to group `2 · 比例裁剪` ("Aspect ratio") asserting the output ratio accuracy.

### Adding a target-size preset

Presets live in `SIZE_CHIPS` in `app.js`:

```js
{ label: '500 KB', bytes: 500 * 1024 }   // label is display text, bytes is the value
{ label: tr('size.unlimited'), bytes: null }   // null means unlimited — keys live in i18n.js
```

Keep no more than a handful of chips — the panel must stay scannable, and arbitrary
values are already covered by the custom input. A tighter warning threshold than
`TINY_TARGET_BYTES` (50 KB) is not a preset matter; open an issue first.

### Changing UI behaviour

- Every state change must go through `invalidate()` so the serialized render
  pipeline and its job token can guard against stale paints. Do not call
  `render()` directly from an event handler.
- Keep the "prediction is the file" guarantee: the number shown in **Before you export** must
  keep coming from the byte length of the blob that will be downloaded. Never
  introduce a separate estimate.
- Anything the user might be surprised by must be stated in the interface, not
  hidden: upscaling factors, resolution reduction, PNG's uncontrollable size,
  unreachable targets. See the flags in section `03 · 目标文件大小` ("Target file size") and
  `04 · 输出尺寸` ("Output size") for the existing pattern.
- Respect `[hidden]`: `styles.css` relies on a global `[hidden] { display: none
  !important }` rule to make the attribute reliable against `display: flex/grid`.
  Do not fight it per-component.

### Styling

- Every colour, size, radius, duration and easing must come from a token in
  `:root`. No magic values in component rules.
- The dark studio theme is intentional: the image is the only bright thing on the
  screen. Do not add a light theme or a brightness that competes with the preview.
- Keep the responsive breakpoints working (`1279px` → 2 columns, `900px` → 1 column,
  `768px` → compact). Check the narrow layout before opening a PR.
- Do not remove focus styles. `:focus:not(:focus-visible)` is used on purpose so
  pointer users do not see rings while keyboard users do.

### Accessibility

Please keep the following true, and say so in your PR if you touched the affected
markup:

- Every interactive control is reachable by `Tab` and operable with the keyboard.
- Toggles expose state (`aria-pressed`), including the ratio, size, format, preview-view
  and mode chips.
- The preview canvas carries a role and a label.
- Toasts are announced through a polite live region.
- `prefers-reduced-motion` disables the animations.
- New text must have readable contrast against its surface.

---

## Reporting a bug

A useful report includes:

1. Browser and version, and operating system.
2. The source image's characteristics: dimensions, file size, format, and whether it
   has transparency. (A big image and a small one take completely different code
   paths.)
3. The exact output settings: ratio, output-size strategy, target size, format.
4. Expected result vs. actual result.
5. A screenshot of the **Before you export** panel, which contains most of the diagnostic data.
6. Any console errors (open DevTools → Console).

If the issue is about a file size that does not match the panel, please include both
numbers — a difference under 1 KB is display rounding, but a large difference is a
real bug.

## Requesting a feature

Check the Roadmap section of the README first. Batch processing, WebP/AVIF export,
before/after comparison, preset bundles and a Web Worker pipeline are already
planned — those are prioritisation discussions, not new ideas.

Things that will not be accepted, for the record: an upload path, analytics, a
server component, a build step, a framework, or an output whose size cannot be
predicted.

## Pull request checklist

- [ ] `open index.html` works, and the flow upload → ratio → target size → crop →
      export still works end to end in a fresh tab.
- [ ] `cd tests && node qa.mjs` passes, and new behaviour has a case.
- [ ] The console is clean (no errors, no warnings).
- [ ] No new network request of any kind.
- [ ] Both languages of any affected doc were updated (`README*`, `USAGE*`).
- [ ] If you touched a user-facing string: `node check-cjk.mjs`, `node check-dict.mjs`
      and `node check-lang.mjs` all pass, and the string exists in **both** tables of
      `i18n.js`.
- [ ] No new dependency, build step or CDN link.
- [ ] Keyboard operation and focus visibility still work.
- [ ] The narrow layout was checked.

Commit messages: imperative, one line, optional body. A conventional prefix helps
(`feat:`, `fix:`, `docs:`, `test:`, `style:`, `chore:`), for example
`feat: add 2:1 preset for banner covers`.

## Code of conduct

Keep it professional and on topic. Critique code, not people. Harassment, personal
attacks and discriminatory language are not welcome here, and maintainers may close
or remove anything that crosses that line.

## License of contributions

CoverForge is released under the [MIT License](LICENSE) © 2026 liamqiu. By
submitting a pull request you agree that your contribution is licensed under the
same terms.
