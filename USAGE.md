# CoverForge — Usage Guide

[Detailed guide in Chinese](USAGE.zh-CN.md) · [README](README.md)

Everything in CoverForge happens locally, in one page, with no installation and no
network access. This guide walks through the whole flow: open → upload → choose a
ratio → set a budget → adjust the crop → export.

---

## 1. Open the app

**Option zero — use the hosted build: <https://zyphraxns.github.io/cover-forge/>** (GitHub Pages).
It is equivalent to running it locally: image processing still happens on your device
and is never uploaded. Handy when you want to share a link or use it on a machine
without the files.

Double-click `index.html`. That is it.

- **The interface is bilingual (中文 / English).** Use the **EN** button in the top bar to
  switch; the choice is remembered on this device. This guide documents the English
  labels — if you keep the Chinese interface, read `USAGE.zh-CN.md` instead.

- Nothing to install. No package manager, no build step, no dependencies.
- `file://` works. `app.js` is a classic script inside an IIFE on purpose:
  `<script type="module">` is blocked by CORS under `file://`, and CoverForge must
  not require a server.
- No network access is used at all. The page loads a local stylesheet, a local
  script and a data-URI favicon.
- A local static server also works if you prefer one, but it is not needed:

  ```bash
  python3 -m http.server 8000   # then open http://localhost:8000/
  ```

- **The settings column scrolls on its own.** In the three-column desktop layout
  (window width ≥ 1280 px) the right-hand column is height-capped to the viewport and
  scrolls internally — the six panels together are much taller than the screen, so
  scroll *inside* that column to reach **06 · Export** and **Before you export**. Narrower windows switch
  to a stacked layout where the whole page scrolls instead.

## 2. Upload an image

Three equivalent ways:

| Method | How |
|---|---|
| Click | Click the **drop zone** in the left rail (or focus it and press `Enter` / `Space`) |
| Drag | Drag a file onto **anywhere on the page** — a drop overlay appears ("Release to load"), release to load |
| Paste | Press `Ctrl`+`V` / `⌘`+`V` — a screenshot from your clipboard works directly |

- Only the **first** file is used if you drop several.
- If a non-image file is dropped, an error toast explains what is supported. If an
  image cannot be decoded, you get a second, different error — never a silent
  failure.
- Supported: JPG, PNG, WebP, GIF, BMP (and AVIF where the browser can decode it).
  Animated GIF/WebP sources load as a single still frame.
- Loading a new image replaces the current one. Use **Change image** or the **Reset**
  button (top right) instead of reloading the page.

The left panel then lists the source: file name, pixel dimensions, megapixels,
reduced ratio, file size, format and whether an alpha channel was detected. Above
8 megapixels a note appears that processing may take a moment.

## 3. Choose a ratio

**Generic ratios** — click any chip: 16:9, 9:16, 1:1, 3:4, 4:3, 4:5, 5:4, 2:3, 3:2, 21:9.

**Platform presets** — 7 presets in 5 groups, each showing its ratio and
recommended pixels:

| Preset | Ratio | Recommended output |
|---|---|---|
| Bilibili video cover | 16:9 | 1920 × 1080 |
| YouTube thumbnail | 16:9 | 1280 × 720 |
| Douyin / Kuaishou / WeChat Channels | 9:16 | 1080 × 1920 |
| Xiaohongshu cover | 3:4 | 1080 × 1440 |
| Instagram post | 4:5 | 1080 × 1350 |
| Square / avatar | 1:1 | 1080 × 1080 |
| WeChat article header | 2.35:1 | 1175 × 500 |

Two different clicks, two different results:

- Click the **card body** → applies the **ratio only**. Your current output-size
  strategy is left alone.
- Click the **Apply** button on the card → applies the ratio **and** switches the
  output size to that preset's recommended pixels.

**Custom ratio** — type both numbers (each between 0 and 100, decimals allowed,
e.g. `2.35 : 1`) and press `Enter` or **Apply**. Invalid values are rejected inline
instead of failing silently.

Changing the ratio (generic chip or custom) resets the output size to
**Max available**, because a preset's recommended pixels no longer match the new
ratio.

## 4. Set a target file size

- Quick chips: **No limit** (unlimited, highest quality), **200 KB**, **500 KB**,
  **1 MB**, **2 MB**.
- Custom: type a number, pick **KB** or **MB**, then press `Enter` or **Apply**.
  Typing also applies automatically about 0.4 s after you stop.
- Leaving the field empty means **unlimited**.
- The maximum accepted target is **50 MB**; larger values are rejected with a
  message.
- Below **50 KB** the app warns that quality loss will be clearly visible — it does
  not stop you, it just tells the truth first.

> Switching between **KB** and **MB** immediately re-evaluates the value you typed, so
> `2` + `MB` means 2 MB right away. If the conversion pushes the target over 50 MB
> (for example you pick "500 KB" and then switch the unit to MB, which reads as
> 500 MB), an inline error appears at once and disappears as soon as you lower the
> number. Picking a preset also sets the input and unit to match.

The rule the compression follows is: keep the resolution, lower the JPEG quality as
far as it needs to go (down to 0.40) — and only if quality has bottomed out and the
file is still too big, reduce the resolution. Details in
"How the prediction works" below.

## 5. Adjust the crop

CoverForge always **covers** the target ratio by centre-cropping: the image fills the
frame, is never stretched, and never gets black bars.

### Pick a preview view first

The preview header has a view switch: `Result` / `Framing`.

| View | What it shows | When to use it |
|---|---|---|
| **Result** (default) | The cropped, compressed result — the frame ratio equals the output ratio. | Judging the finished cover. |
| **Framing** | The **whole source image** (frame ratio equals the source ratio) with a crop box on top and everything outside it dimmed. The box carries a tag showing the output pixels. | Deciding which part to keep, and confirming you are not cropping anything important away. |

Only showing the result leaves one question unanswered: what is being thrown away?
The source view answers it, which is the only reliable way to avoid cropping a head
out of frame. Picking the Framing step in the left rail switches you to this view and
scrolls to the stage.

### Moving the crop

Drag inside the preview (mouse, touch or pen — pointer events underneath).

The two views deliberately behave like mirror images:

| View | What you drag | Hint text |
|---|---|---|
| Result | The **image**, so the crop window moves the opposite way (like most crop tools) | "Drag inside the frame to move the crop" |
| Framing | The **crop box**, which moves with your finger | "Drag the crop box to choose which part to keep" |

- Dragging only does something when there is slack — if the source already matches the
  target ratio exactly, the frame is locked and the hint is hidden.
- In the Result view the drag redraws on the fly without re-encoding, so it stays
  responsive; encoding happens on release. In the source view the box and the readouts
  follow your finger the same way.
- `Esc` cancels a drag in progress.
- **3×3 focus grid** — nine buttons for the corners, edge midpoints and centre. The
  keyboard-friendly equivalent of dragging, working in both views.
- **Re-centre** — back to a centred crop.
- **Thirds** — toggles the rule-of-thirds overlay (a framing aid only; it is never
  exported). In the source view the thirds align to the crop box, which is the only
  place they mean anything.
- The Framing panel reports the crop rectangle (`W × H @ (x, y)`) and the horizontal /
  vertical slack in pixels, so you know how much room you actually have.

## 6. Choose the output size

| Strategy | What it does | When to use it |
|---|---|---|
| **Maximum available** (default) | Output = the full crop area. Never downscales on its own. | You want maximum quality and have no pixel requirement. |
| **Platform preset** | Uses the applied preset's pixel size (e.g. 1920 × 1080). | You want exactly what the platform asks for. Enabled once a platform preset has been applied. |
| **Custom long edge** | Scales so the longer side equals your value (16–10000; quick values 1920 / 1280 / 1080 / 800). | An internal guideline, a CMS limit, or a website hero image. |

If the requested output is smaller than the crop, a note tells you the result is a
percentage of the available resolution. If it is larger, CoverForge upscales
progressively and says so, including the factor:

> Upscaling 4.80× — the source lacks pixels, so the extra detail is interpolated and sharpness may suffer.

That notice is not decoration — an upscaled cover is genuinely softer than the
original. Choose a smaller output size if you can.

Note that **Maximum available** means "do not downscale voluntarily"; if you have also set a
target file size that cannot be met at full resolution, the compression step will
reduce the resolution anyway, and the Resolution change row will show it.

## 7. Choose the export format and background colour

- **JPG** — small files, ideal for photos. Quality is decided automatically from
  your target size. Dragging the **Override JPG quality** slider overrides that: 0 % on
  the left means "automatic"; anything above it forces that quality and the target
  size is no longer enforced.
- **PNG** — lossless, keeps transparency, but the size cannot be controlled by any
  quality parameter. If you set a target while PNG is selected, the app says so and
  offers a one-click **Switch to JPG** button.
- **Fill colour** appears only when the source has an alpha channel and you are
  exporting JPG: transparent pixels get filled with the chosen colour. Four presets
  (white, near-black, off-white, brand orange) plus a full colour picker. If your
  original had transparent corners, this is what they will look like.

## 8. Read the pre-export panel

Everything you need to decide before downloading. The panel's own lead sentence is
worth reading once: all of these numbers come from the single file that is about to
be downloaded — **Estimated file size** is not an estimate, it is that file's real byte count.

| Row | Meaning |
|---|---|
| Output size | Final pixel dimensions of the exported file |
| Aspect ratio | The ratio you chose plus its decimal value |
| Format | JPG or PNG |
| Target size | Your budget, or No limit (highest quality) |
| Estimated file size | The size of the file you are about to download |
| Encode quality | `n% (matched to target size)` with a target, `n% (fixed high quality)` (0.92) when the target is unlimited, `n% (set manually)` for a manual override, or `Lossless (PNG)` |
| Resolution change | Native resolution / Upscaled n× / Downscaled n×, plus a further reduction if the size search had to downscale |
| Processing time | Wall-clock time for the last render |
| Target met | ✅ Target met · used n% of the budget — or ⚠ Target missed · over by X |

**Why the predicted size is trustworthy:** the number is the byte length of the very
blob that the download button hands to your browser, and the panel says so. There is
no separate estimation step, and clicking download waits for the current settings to
finish rendering first. The displayed value is rounded (0.1 KB granularity below
1 MB), so it can differ from the exact byte count by less than a kilobyte — the file
itself is the same one the panel measured.

**Target missed** means exactly one of these:

1. The target is below what the format can physically reach — PNG is lossless, so no
   quality setting helps. Switch to JPG.
2. The target is so small that even the lowest quality and the smallest sensible
   resolution overshoot it. The app then gives you the smallest file it can produce
   and says so in the footnote.
3. You set a manual JPEG quality, which takes precedence over the target.

The footnote under the panel also records whether transparency was filled, whether
the resolution was reduced to hit the budget, and whether the output was upscaled.

## 9. Understand the notices

| Notice | Where | What it means |
|---|---|---|
| Upscale notice | Output size panel, and Resolution change | The output is larger than your crop, so detail is interpolated. The factor is shown honestly. |
| PNG lossless notice | Target file size panel | You set a target while exporting PNG; size cannot be controlled by quality. One-click switch to JPG is offered. |
| Quality-risk notice | Target file size panel, when the target is under 50 KB | Such a small budget will visibly cost quality. |
| Over-target warning | A toast after the download finishes, only if the file exceeded your target | Tells you the actual size, the target, and what to try — switch to JPG, pick a smaller output size, or accept the weight. |

None of these block you. They exist so that you find out before exporting — or at the
very latest the moment the file lands — and not after you have uploaded it somewhere.

## 10. Download

Click **Download cover**. The button label always states the format and the exact output
pixels, e.g. *Download JPG · 1920 × 1080*.

File naming: `<original name without extension>-<ratio>-<width>x<height>.<ext>`

- `my photo.jpg` at 16:9 → `my-photo-16x9-1920x1080.jpg`
- `cover.png` at 2.35:1 → `cover-2.35x1-1175x500.jpg`
- Spaces and characters that are illegal in file names become `-`; the name is
  otherwise preserved.

A confirmation toast repeats the file name, the final size, whether the target was
met, and how long the render took.

If the downloaded file exceeds your target, a second, warning-styled toast follows
immediately — titled "Target size not met", quoting the real size and the target, and
suggesting what to try (switch to JPG, or pick a smaller output size). It blocks
nothing; it just makes sure you do not walk away believing the budget was met.

## 11. FAQ

**Why can't PNG be compressed to my target size?**
PNG is a lossless format — there is no quality knob, only pixel count and palette
tricks. A lossless image cannot be made arbitrarily small. Choose JPG (the panel
offers a one-click switch) if the budget matters more than perfect pixels.

**Why is the output not the original resolution after compressing?**
Because quality has a floor. CoverForge searches JPEG quality between 0.40 and 0.95
first; only if the lowest quality still exceeds the budget does it reduce the
resolution. That order is deliberate: a slightly smaller sharp image beats a
full-size one smeared with JPEG artifacts. If a target cannot be reached at all, the
smallest achievable file is returned and labelled "target missed".

**Why does the image look worse after upscaling?**
Upscaling cannot invent detail. The extra pixels are interpolated, so the result is
softer than the original — that is physics, not a bug. Prefer a smaller output size,
or start from a larger source.

**I dragged a file in and nothing happened.**
Check that it is an image (JPG / PNG / WebP / GIF / BMP). Non-images are rejected
with an explanatory toast. If the file is an image but cannot be decoded (truncated
download, unusual encoder), you get a decode error instead. Also make sure you
released the file over the page — the overlay appears while a valid file is held
over it.

**Pasting does nothing.**
The paste handler ignores the event while the cursor is inside a text or number
field, because there it belongs to the field. Click an empty area of the page first.
Also make sure the clipboard actually contains image data: copying a file in your
file manager often puts only a path on the clipboard, which no browser can read as an
image. Copying an image in a browser, or taking a screenshot, works.

**Processing a big image takes a few seconds.**
That is the price of a real search: a single resolution can need about a dozen JPEG
encodes (one feasibility probe at the quality floor, one at the ceiling, then nine
binary-search probes), and up to six resolutions may be tried before the budget is
met. A 12-megapixel source is a lot of pixels to encode repeatedly. The Processing time row
shows the actual time, and the interface stays responsive — a "Working" indicator
appears over the preview while it works. Starting from a smaller source, or picking
a lower output resolution, is the fastest fix.

**Is my image uploaded anywhere?**
No. There is no upload path in the code at all: no `fetch`, no `XMLHttpRequest`, no
WebSocket, no service worker, no external resource. Files are read with the local
File API and processed with the browser's own canvas. The test suite asserts that
zero non-`file://` requests are made during a full session.

**Why does the file I downloaded differ in size from the predicted number?**
Only by display rounding — the panel rounds to 0.1 KB below 1 MB (2 decimals above),
and the file itself is the exact blob it measured. Differences are well under a
kilobyte.

**Will an animated GIF stay animated?**
No. The source is loaded as a single frame, and the export is always a still image.

**My phone photo appeared rotated — is that handled?**
Modern browsers apply EXIF orientation while decoding, so portrait photos from
phones are normally handled correctly. If an image does show up rotated, correct it
in another tool first — CoverForge rotates nothing.

**The download warned that the target was not met. What now?**
Three possible causes: you are exporting PNG (lossless, so nothing compresses it);
the target is so small that even the quality floor and the smallest sensible
resolution overshoot it; or you set a manual JPEG quality, which takes precedence
over the target. The warning itself suggests the fix — switch to JPG for the size, or
pick a lower output size (see "Read the pre-export panel").

**I cannot see what is being cropped away.**
That is what the Result view shows by default: only the result. Switch the preview to
**Framing** and you get the whole source with the crop box on top, everything outside
dimmed, and the box draggable. Picking the Framing step in the left rail switches to it
automatically.

## 12. Browser notes

| Browser | Notes |
|---|---|
| Chrome / Edge 90+ | Reference environment; the test suite runs here. |
| Safari 15+ | Works. `aspect-ratio` and CSS Grid are required. JPEG encoding on Safari is handled by the system encoder, so final byte counts may differ slightly from Chrome. |
| Firefox 90+ | Works. Canvas encoding is performed by the platform; outputs can differ by a few percent from Chrome for the same settings. |
| Mobile browsers | Layout collapses to a single column and dragging uses pointer events. Very large images may hit memory limits on phones. |

Absolute sizes are not guaranteed to be byte-identical across browsers, because
`canvas.toBlob` delegates to each platform's image encoder. The target-size search
always measures the real encoder's output, so the result still lands under your
budget on every browser.

## 13. Keyboard and accessibility

- `Tab` reaches every control; focus rings are visible.
- The drop zone opens the file picker with `Enter` or `Space`.
- `Enter` applies custom ratio and target-size values.
- Preset cards respond to `Enter` / `Space` (ratio only — use the card's Apply button
  for ratio plus recommended pixels); the focus grid is a group of labelled buttons.
- The preview view switch, **Thirds** and **Re-centre** controls are in the preview header.
- `Esc` cancels a drag in progress and dismisses the drag overlay.
- Toasts are announced politely; a skip link jumps to the settings column.
- `prefers-reduced-motion` disables the animations.
