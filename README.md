# CoverForge

**Crop one image to any platform's cover ratio, resize it to platform pixels, and land under an exact file-size budget — entirely in your browser.**

[中文说明](README.zh-CN.md) · [Usage guide](USAGE.md) · [使用说明（中文，详细）](USAGE.zh-CN.md)

CoverForge is a single-page, zero-dependency web tool for one job: turn a photo or
screenshot into a cover that fits a specific platform. It crops to the ratio you
pick (always centre-cropped, never stretched), resizes to platform-ready pixels,
and compresses to a target file size such as 500 KB — using nothing but the native
Canvas API.

Aspect ratios, file-size budgets and page weight all have hard limits on real
platforms. This tool treats them as first-class inputs instead of something you
discover after uploading.

**Try it online: <https://zyphraxns.github.io/cover-forge/>** — or clone the repo and open `index.html`.
Hosting changes nothing: even on the web version, image processing stays on your device.

Open `index.html`. That is the whole installation.

---

## Features

**Upload — three ways**
- Click the drop zone (or focus it and press `Enter`)
- Drag a file anywhere onto the page
- Paste with `Ctrl+V` / `⌘V` (a screenshot works)

**Source inspection**
- File name, pixel dimensions, megapixels, reduced ratio (`16:9 · 1.778`),
  file size, format, and whether the image has an alpha channel
- A heads-up when the source is large (≥ 8 megapixels) that processing may take
  a moment

**Aspect ratios**
- 10 generic ratios: 16:9, 9:16, 1:1, 3:4, 4:3, 4:5, 5:4, 2:3, 3:2, 21:9
- 7 platform presets with recommended pixel sizes (see the table below)
- Custom ratio with decimals, e.g. `2.35 : 1`, validated inline

**Cropping**
- Always fills the target ratio (cover) — no distortion, no letterboxing
- Centre-cropped by default; drag inside the preview to move the crop, or use the
  3×3 focus grid
- Two preview views. **成片** shows the exact pixels you will download;
  **原图取景** shows the whole source with the crop box overlaid and everything
  outside it dimmed, so you can see what you are cutting away *before* you cut it
- Picking the 取景 step in the left rail jumps straight to the source view
- "Reset to centre", and a rule-of-thirds overlay you can toggle — in the source
  view the thirds align to the crop box, which is where they are actually useful
- Reports the crop rectangle and the horizontal / vertical slack in pixels

**Target file size**
- Unlimited (highest quality), 200 KB, 500 KB, 1 MB, 2 MB, or any custom value in
  KB / MB up to 50 MB
- Below 50 KB it warns that quality loss will be visible
- JPEG: binary search for the highest quality that fits, and only if the quality
  floor still overshoots does it downscale in steps — reported honestly either way
- PNG: described as what it is (lossless, size not controllable), with a one-click
  switch to JPEG when you want to hit the budget

**Output size**
- **Max available** (default) — never downscales on its own
- **Platform recommended** — the preset's pixel size in one click
- **Custom long edge** — 1920 / 1280 / 1080 / 800 quick values, or any value from
  16 to 10000, scaled proportionally

**Upscaling**
- When the requested output is larger than the cropped area, CoverForge upscales
  progressively (steps of at most 2×, high-quality smoothing) and tells you the
  factor: *"will be upscaled 4.80× — the extra detail is interpolated"*

**Export**
- JPG (auto quality, or a manual override) and PNG
- When a transparent source is exported as JPG, pick the background colour that
  fills the transparent areas (four swatches plus a colour picker)
- Pre-export panel: output pixels, ratio, format, target, predicted file size,
  encoding quality, resolution change, processing time, and whether the target
  was met
- Downloads as `<name>-<ratio>-<W>x<H>.<ext>` — e.g. `cover-16x9-1920x1080.jpg`
- Result toasts for success, information, warnings and errors — including an
  explicit warning if the file you just downloaded ended up over your target

**Interface**
- Dark studio theme: the image is the only bright thing on screen
- Three-column workspace on desktop, single column on narrow screens
- Keyboard operable with visible focus rings, `aria-live` toasts, a skip link,
  and `prefers-reduced-motion` support

---

## Platform presets

| Preset | Ratio | Recommended output |
|---|---|---|
| Bilibili video cover | 16:9 | 1920 × 1080 |
| YouTube thumbnail | 16:9 | 1280 × 720 |
| Douyin / Kuaishou / WeChat Channels | 9:16 | 1080 × 1920 |
| Xiaohongshu cover | 3:4 | 1080 × 1440 |
| Instagram post | 4:5 | 1080 × 1350 |
| Square / avatar | 1:1 | 1080 × 1080 |
| WeChat article header | 2.35:1 | 1175 × 500 |

Clicking a preset card applies its ratio only; clicking the **Apply** button on the
card applies the ratio *and* switches the output size to the recommended pixels.
A custom ratio always falls back to "Max available" so you never export at a
mismatched size by accident.

---

## Quick start

```bash
cd cover-forge
open index.html        # macOS
xdg-open index.html    # Linux
start index.html       # Windows
```

Or just double-click `index.html`.

- **No installation.** No package manager, no build step, no runtime dependencies.
- **No network.** One local stylesheet, one local script, an inline data-URI
  favicon, system font stacks. Nothing is fetched at runtime.
- **`file://` works.** `app.js` is intentionally a classic script inside an IIFE —
  under `file://`, `<script type="module">` is blocked by CORS, and CoverForge
  must not require a server.
- A local static server (`python3 -m http.server`) also works, but it is not
  needed.

### Privacy

Your image never leaves the device. There is no upload, no telemetry, no
analytics, no service worker and no external request of any kind — the test suite
asserts that zero non-`file://` requests are made. Everything happens in the
browser's own Canvas implementation, and closing the tab leaves nothing behind.

---

## How it works

**One canvas pipeline.** The crop rectangle is copied 1:1 into an offscreen
canvas, resampled to the output size, then encoded exactly once with
`canvas.toBlob`. The image is never re-encoded twice, so quality only degrades
once.

**Progressive resampling.** Upscales are performed in steps of at most 2× with
`imageSmoothingQuality = 'high'`, instead of one big interpolation jump. This
avoids the harsh aliasing that a single 5× upscale produces.

**Binary search for the file-size budget.** For a target size, CoverForge first
encodes at the quality floor (`0.40`) to test feasibility, then binary-searches
the highest JPEG quality between `0.40` and `0.95` that still fits the budget
(9 probes). Quality stays as high as the budget allows.

**Downscale only when quality has bottomed out.** If even `0.40` overshoots, the
required area is estimated from `√(target / floorBytes)`, the scale step is
clamped to 0.35–0.9, and the search restarts at the smaller resolution (at most 6
rounds). Fewer pixels look better than a mush of JPEG artifacts, so resolution is
sacrificed only after quality. If a target is genuinely unreachable, the smallest
achievable file is returned and labelled as such.

**The prediction is the file.** The "predicted file size" in the panel is the byte
length of the exact blob that the download button hands to your browser — there is
no separate estimation step, and the download waits for the current state to finish
rendering before it fires.

**No stale results.** Every state change goes through a serialized render queue
guarded by a monotonic job token, so rapid edits (dragging the crop, typing a
target) can never paint an outdated result.

**Cheap view switching.** The stage keeps a display-sized copy of the output, so
toggling between the two preview views never re-encodes anything — only the crop
box overlay is repositioned.

**Zero dependencies by design.** All logic lives in `app.js` (a classic script +
IIFE), all styling in `styles.css` (design tokens in `:root`, no magic values),
all markup in `index.html`. There is no framework, no bundler and no CDN.

---

## Browser support

Chrome / Edge 90+, Firefox 90+, Safari 15+. Requires Canvas 2D, `toBlob`, CSS
Grid, `aspect-ratio`, pointer events and the File API.

Notes:

- Decoding depends on the browser: JPG, PNG, WebP and GIF are safe everywhere;
  BMP and AVIF work where the browser can decode them natively.
- Animated GIF/WebP sources are loaded as a single still frame, and the export is
  always a still image.
- Very large sources (40 MP and up) are bound by browser canvas limits and can be
  slow; a warning appears above 8 MP.

---

## Project structure

```
cover-forge/
├── index.html          semantic markup, no inline style or script
├── styles.css          all styling; design tokens live in :root
├── app.js              all logic; classic script + IIFE
├── DESIGN.md           the design system (palette, type, spacing, motion)
├── README.md           this file
├── README.zh-CN.md     中文说明
├── USAGE.md            usage guide
├── USAGE.zh-CN.md      使用说明（中文）
├── CONTRIBUTING.md     how to contribute
├── LICENSE             MIT
└── tests/
    ├── qa.mjs          end-to-end checks driven by a real browser
    └── verify.mjs      independent adversarial verification (re-decodes the output)
```

---

## Development and testing

There is nothing to build. Edit the three files and reload the page.

The test suite drives a real browser, injects images programmatically, and
verifies the actual downloaded bytes — including JPEG/PNG magic bytes — rather
than assuming success.

```bash
cd tests
npm install playwright-core     # one time
node qa.mjs
```

Uses your installed Chrome (`channel: 'chrome'`), so no browser download is
required. The 43 checks cover: all three upload paths, ratio accuracy across all
10 generic ratios and all 7 presets, custom ratios and validation, target-size
compression (500 KB and 80 KB budgets, including achievement rate), the
unreachable-target path, upscaling correctness and honesty of the notice, JPG/PNG
output, PNG lossless semantics, prediction accuracy, error handling for
non-image and corrupt files, crop repositioning, zero external requests, and a
clean console.

Artifacts (report, screenshots, generated fixtures, captured downloads) are
written to `tests/output/`, which is gitignored.

### Independent verification

`tests/verify.mjs` is a second, deliberately adversarial suite that re-decodes the
downloaded files and reads the pixels back, instead of trusting the UI's own
numbers. It checks crop content and centre-positioning at pixel level, exact
byte-for-byte agreement between the predicted size and the download, transparency
semantics (PNG keeps alpha, JPG fills the chosen background), race conditions under
rapid setting changes, edge cases (1×1, 4×4, 8000×6000, 100:1 and 1:100 ratios,
selecting the same file twice), WebP/GIF/BMP sources, and cumulative console/network
cleanliness.

```bash
cd tests
node verify.mjs
```

Its report is written to `tests/output/VERIFY-REPORT.md`, with a durable copy kept at
`tests/output-verify/VERIFY-REPORT.md`. Its fixtures and captured downloads live under
`tests/output-verify/`, a separate root — `qa.mjs` wipes `tests/output/` when it
starts, so the two suites can be run in either order without destroying each other's
files. Both output roots are gitignored.

---

## Roadmap

- **Batch processing** — several images in one pass. Deliberately deferred: it
  would double the state and interface complexity of the single-image flow, which
  is the core use case. Planned, not rejected.
- **WebP and AVIF export** — for web publishing, where page weight matters more
  than JPEG compatibility.
- **Before / after comparison** — a draggable split view of the source crop and
  the compressed output, so quality loss can be judged by eye.
- More platform presets, and one-click bundles that export every size a single
  platform asks for.
- Move the encoding pipeline into a Web Worker so very large images never block
  the interface.

---

## Contributing

Issues and pull requests are welcome — see [CONTRIBUTING.md](CONTRIBUTING.md).

CoverForge has one hard rule: **it must stay a zero-dependency, zero-build,
offline-capable static page.** PRs that add a framework, a bundler, a CDN link or
a network request will be declined regardless of what they enable.

---

## License

[MIT](LICENSE) © 2026 liamqiu
