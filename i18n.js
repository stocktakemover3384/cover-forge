/* ============================================================================
 * CoverForge · i18n.js — 中英双语文案表
 *
 * 设计取舍：
 * 1. **默认 zh-CN**，且 zh 的值与界面 originally hard-coded 的文案逐字一致 ——
 *    这样既有测试（qa.mjs 43 项 / verify.mjs 46 项）在默认语言下断言不变。
 * 2. **不自动探测 navigator.language**：自动化测试的 Chromium 多为 en-US 环境，
 *    自动切换会让默认视图变成英文、进而打破既有断言。改为手动切换 + 记住选择。
 * 3. 界面文案全部内联在 index.html 里（JS 未执行时也是完整中文），
 *    这里用「CSS 选择器 → 文案键」的表来覆盖，避免在 HTML 里撒几百个 data 属性。
 * 4. 只写 localStorage 一个键（coverforge.lang），不写任何其他数据。
 * ========================================================================= */
(function () {
  'use strict';

  var KEY = 'coverforge.lang';

  var STRINGS = {
    'zh-CN': {
      /* ── 顶栏 / 全局 ── */
      'doc.title': 'CoverForge 封面工坊 · 本地封面尺寸处理工具',
      'doc.desc': '在浏览器本地把一张图裁成各平台封面尺寸，并按目标文件大小压缩。零上传、零依赖、离线可用。',
      'skip': '跳到设置',
      'brand.zh': '封面工坊',
      'brand.tag': '把一张图，锻成各平台的封面尺寸',
      'privacy': '本地处理 · 不联网',
      'privacy.title': '所有处理都在你的浏览器本地完成，图片不会离开这台设备',
      'reset.all': '重置',
      'lang.switch': 'EN',
      'lang.switch.title': 'Switch to English',

      /* ── 拖拽遮罩 ── */
      'veil.title': '松开即可载入',
      'veil.sub': '支持 JPG · PNG · WebP · GIF · BMP',

      /* ── 步骤条 ── */
      'step.source': '素材', 'step.ratio': '比例', 'step.target': '体积',
      'step.output': '尺寸', 'step.crop': '取景', 'step.export': '导出',

      /* ── 面板标题 ── */
      'h.source': '01 · 素材', 'h.ratio': '02 · 画面比例', 'h.target': '03 · 目标文件大小',
      'h.output': '04 · 输出尺寸', 'h.crop': '05 · 取景', 'h.export': '06 · 导出',
      'h.stage': '成片预览', 'h.summary': '导出前信息',

      /* ── 上传 ── */
      'drop.title': '拖入图片',
      'drop.sub': '点击选择 · 拖拽到页面任意位置 · <kbd>⌘</kbd><kbd>V</kbd> 粘贴',
      'drop.aria': '选择或投放一张图片，也可以粘贴剪贴板图片',
      'kv.name': '文件名', 'kv.dims': '尺寸', 'kv.mp': '像素量', 'kv.ratio': '比例',
      'kv.size': '文件大小', 'kv.format': '格式', 'kv.alpha': '透明通道',
      'flag.large': '大尺寸图片 · 处理可能需要数秒',
      'btn.change': '换一张图片',

      /* ── 舞台 ── */
      'view.aria': '预览视图', 'view.crop': '成片', 'view.source': '原图取景',
      'btn.thirds': '三分线', 'btn.recenter': '重置居中',
      'ro.dims': '输出尺寸', 'ro.ratio': '比例', 'ro.size': '预估体积', 'ro.target': '目标',
      'focus.label': '取景焦点',
      'hint.crop': '在框内拖动可调整取景焦点',
      'hint.source': '拖动裁剪框，决定保留原图的哪一块',

      /* ── 比例 ── */
      'ratio.generic': '通用比例', 'ratio.platform': '平台预设', 'ratio.custom': '自定义比例',
      'ratio.hint': '支持小数，例如 <span class="mono">2.35 : 1</span>',
      'ratio.err.positive': '比例的两个数值都必须大于 0，例如 2.35 : 1。',
      'ratio.err.range': '单个数值请控制在 0 – 100 之间。',
      'btn.apply': '套用',
      'btn.apply.aria': '套用 {name} 比例与推荐尺寸',
      'chip.aria': '画面比例 {w} 比 {h}',

      /* ── 目标体积 ── */
      'size.custom': '自定义目标',
      'size.hint': '上限 50 MB。留空 = 不限大小，使用最高画质。',
      'size.err.positive': '请输入大于 0 的数值。',
      'size.err.max': '目标不能超过 50 MB（当前 {mb} MB）。',
      'flag.tiny': '目标偏小，画质损失可能较明显。',
      'flag.png': 'PNG 是无损格式，无法用质量参数控制体积。',
      'btn.switchJpg': '改为 JPG 以达到目标大小',
      'size.unlimited': '不限',

      /* ── 输出尺寸 ── */
      'mode.max': '最大可用', 'mode.max.meta': '按原图可用像素',
      'mode.preset': '平台推荐', 'mode.edge': '自定义长边', 'mode.edge.meta': '按长边等比',
      'edge.label': '长边像素',
      'edge.err': '长边像素需在 16 – 10000 之间。',

      /* ── 导出 ── */
      'fmt.label': '格式',
      'fmt.hint.jpg': 'JPG 体积小、适合照片；透明区域会按所选背景色填充。',
      'fmt.hint.png': 'PNG 无损、保留透明通道，但体积不可控（无法用质量参数压缩）。',
      'bg.label': '填充背景色',
      'bg.hint': '原图含透明通道，转 JPG 时透明区域会填充此颜色。',
      'q.label': '手动覆盖 JPG 质量',
      'q.hint': '拖到最左 = 由目标文件大小自动决定质量。',
      'q.auto': '自动',

      /* ── 取景说明 ── */
      'crop.lead': '自动居中裁剪，永远填满目标比例、不留黑边。需要保留边缘内容时，在舞台里直接调整取景—— 「成片」视图拖动图片、「原图取景」视图拖动裁剪框，两者等价；也可以用九宫格焦点按钮微调。',
      'summary.lead': '下列数值全部取自同一份即将下载的文件 —— <strong>「预估文件大小」不是估算，而是它的真实字节数</strong>。',
      'focus.center': '居中 · 50% / 50%',
      'focus.at': '焦点 {x}% / {y}%',

      /* ── 导出前信息 ── */
      'sm.dims': '输出尺寸', 'sm.ratio': '画面比例', 'sm.format': '格式',
      'sm.target': '目标体积', 'sm.actual': '预估文件大小', 'sm.quality': '编码质量',
      'sm.scale': '分辨率变化', 'sm.time': '处理耗时', 'sm.verdict': '目标达成',
      'sm.target.unlimited': '不限（最高画质）',
      'sm.quality.lossless': '无损（PNG）',
      'sm.quality.manual': '{q}%（手动指定）',
      'sm.quality.auto': '{q}%（自动匹配体积）',
      'sm.quality.fixed': '{q}%（固定高画质）',
      'sm.scale.up': '放大 {n}×', 'sm.scale.down': '缩小 {n}×', 'sm.scale.same': '原始分辨率',
      'sm.scale.shrunk': '{s} → 体积优化再降至 {w} × {h}',
      'sm.verdict.none': '未设置目标 · 使用最高画质',
      'sm.verdict.ok': '\u2705 达标 · 用掉目标的 {p}%',
      'sm.verdict.miss': '\u26a0 未达标 · 超出 {d}',
      'sm.foot.empty': '载入一张图片后，这里会列出导出前的全部参数。',

      /* ── 标志位 ── */
      'flag.upscale': '将放大 {n}×（原始像素不足，多出的细节由插值生成，画质可能下降）',
      'flag.downscale': '已按你指定的输出尺寸缩小到原图可用分辨率的 {p}%。',

      /* ── 状态 ── */
      'status.idle': '待载入', 'status.busy': '处理中', 'status.ready': '已就绪',
      'status.wait': '待处理', 'status.hit': '目标达成', 'status.miss': '未达标',

      /* ── 处理中提示 ── */
      'busy.working': '正在处理…',
      'busy.crop': '正在裁切画面…', 'busy.resample': '正在重采样…',
      'busy.compress': '正在压缩到目标体积…', 'busy.png': '正在编码 PNG…',
      'busy.jpg': '正在编码 JPG…', 'busy.manual': '正在按指定质量编码…',
      'busy.read': '正在读取图片…', 'busy.decode': '正在解码像素…',

      /* ── 输出区 ── */
      'dl.label': '下载 {ext} · {w} × {h}',
      'dl.label.idle': '下载封面',
      'dl.note.idle': '先载入一张图片',
      'dl.note.unlimited': '{ext} · {size} · 未限制体积',
      'dl.note.target': '{ext} · {size} · 目标 {target} · {state}',
      'dl.state.hit': '达标', 'dl.state.miss': '未达标',

      /* ── Toast ── */
      'toast.load.title': '素材已载入',
      'toast.load.msg': '{w} × {h} px · {size} · {alpha}',
      'alpha.yes': '含透明通道', 'alpha.no': '无透明通道',
      'toast.notImage.title': '无法载入这张素材',
      'toast.notImage.msg': '「{name}」不是支持的图片格式。请使用 JPG / PNG / WebP / GIF / BMP 图片。',
      'toast.decode.title': '图片解码失败',
      'toast.decode.msg': '「{name}」无法被浏览器解码：文件可能已损坏，或使用了不支持的图片编码。',
      'toast.exported.title': '封面已导出',
      'toast.exported.msg': '{name} · {size} · {tail} · 耗时 {sec} s',
      'tail.unlimited': '未限制体积',
      'tail.hit': '已达成目标 {target}',
      'tail.miss': '超出目标 {target}',
      'toast.miss.title': '未达到目标体积',
      'toast.miss.msg': '当前 {size}，目标 {target}。{advice}',
      'advice.png': 'PNG 是无损格式，无法用质量参数压缩，可改用 JPG。',
      'advice.jpg': '可尝试更小的输出尺寸，或改用 PNG 保留无损画质。',
      'toast.encodeFail.title': '处理失败',
      'toast.encodeFail.msg': '浏览器无法完成本次编码：{err}。请换一张图片或降低目标尺寸后重试。',
      'toast.exportFail.title': '导出失败',
      'toast.exportFail.msg': '生成文件时出错：{err}',
      'toast.close': '关闭提示',

      /* ── 脚注 ── */
      'note.bgfill': '原图含透明通道，透明区域已填充背景色 {color}。',
      'note.pngOver': 'PNG 为无损格式，无法用质量参数控制体积，当前超出目标 {d}。点上方「改为 JPG」即可达标。',
      'note.unreachable': '该目标过小，已压到当前可达的最小体积 {size}。',
      'note.upscaled': '输出由裁切区 {cw} × {ch} 放大 {n} 倍生成，非原始像素。',
      'note.shrunk': '为贴近目标体积，分辨率已由 {ow} × {oh} 优化到 {w} × {h}。',
      'note.privacy': '全部处理在本机浏览器完成，图片不会离开这台设备。',

      /* ── 其他值 ── */
      'value.unknown': '未知', 'value.yes': '有', 'value.no': '无',
      'dims.px': '{w} × {h} px',
      'crop.rect': '{w} × {h} @ ({x}, {y})',
      'crop.gap': '{n} px',

      /* ── 平台预设 ── */
      'group.landscape': '视频横版', 'group.vertical': '视频竖版',
      'group.social': '图文社交', 'group.square': '方图 / 头像', 'group.article': '文章头图',
      'preset.bilibili': 'Bilibili 视频封面', 'preset.youtube': 'YouTube 缩略图',
      'preset.douyin': '抖音 / 快手 / 视频号', 'preset.xiaohongshu': '小红书封面',
      'preset.instagram': 'Instagram 帖子', 'preset.square': '方图 / 头像',
      'preset.wechat': '公众号头图',
      'preset.aria': '{name} · 比例 {r} · 推荐 {w} × {h}',

      /* ── 无障碍标签 ── */
      'aria.rail': '素材与流程', 'aria.stage': '裁剪与预览', 'aria.inspector': '输出设置',
      'aria.steps': '处理流程',
      'aria.canvas': '成片预览画布',
      'aria.crop.aria': '取景焦点九宫格',
      'aria.fg.tl': '左上', 'aria.fg.tc': '上中', 'aria.fg.tr': '右上',
      'aria.fg.ml': '左中', 'aria.fg.mc': '正中', 'aria.fg.mr': '右中',
      'aria.fg.bl': '左下', 'aria.fg.bc': '下中', 'aria.fg.br': '右下',
      'aria.sw.white': '白色', 'aria.sw.black': '近黑', 'aria.sw.cream': '米白', 'aria.sw.ember': '品牌橙',

      /* ── 空态 ── */
      'empty.title': '还没有素材',
      'empty.sub': '点这里选择一张图片，也可以把图片拖到页面任意位置，或按 ⌘V 粘贴。',
      'empty.aria': '选择一张图片，也可以把图片拖到页面任意位置或粘贴剪贴板图片',
      'aria.swatches': '背景色快捷色板',

      /* ── 其余静态控件（首版遗漏，截图反馈补齐）── */
      'crop.rect.label': '裁切区域', 'crop.gapx.label': '横向余量', 'crop.gapy.label': '纵向余量',
      'ratio.generic.aria': '通用画面比例',
      'ratio.w.aria': '自定义比例宽度', 'ratio.h.aria': '自定义比例高度',
      'size.presets.aria': '目标文件大小预设',
      'size.value.aria': '自定义目标数值', 'size.unit.aria': '目标大小单位',
      'mode.aria': '输出尺寸策略',
      'edge.presets.aria': '长边像素快捷值', 'edge.input.aria': '自定义长边像素',
      'bg.color.aria': 'JPG 填充背景色'
    },

    'en': {
      /* ── Top bar / global ── */
      'doc.title': 'CoverForge — resize and compress cover images, entirely offline',
      'doc.desc': 'Crop one image to any platform cover ratio and compress it to an exact file size budget — in your browser, with nothing uploaded.',
      'skip': 'Skip to settings',
      'brand.zh': 'Cover Studio',
      'brand.tag': 'Forge one image into the cover size every platform wants',
      'privacy': 'On-device · no upload',
      'privacy.title': 'Everything runs in your browser. Your image never leaves this device.',
      'reset.all': 'Reset',
      'lang.switch': '中文',
      'lang.switch.title': 'Switch to Chinese',

      /* ── Drag veil ── */
      'veil.title': 'Release to load',
      'veil.sub': 'JPG · PNG · WebP · GIF · BMP',

      /* ── Steps ── */
      'step.source': 'Source', 'step.ratio': 'Ratio', 'step.target': 'Size',
      'step.output': 'Pixels', 'step.crop': 'Framing', 'step.export': 'Export',

      /* ── Panel headings ── */
      'h.source': '01 · Source', 'h.ratio': '02 · Aspect ratio', 'h.target': '03 · Target file size',
      'h.output': '04 · Output size', 'h.crop': '05 · Framing', 'h.export': '06 · Export',
      'h.stage': 'Result preview', 'h.summary': 'Before you export',

      /* ── Upload ── */
      'drop.title': 'Drop an image here',
      'drop.sub': 'Click to choose · drop anywhere on the page · <kbd>⌘</kbd><kbd>V</kbd> to paste',
      'drop.aria': 'Choose or drop an image, or paste one from the clipboard',
      'kv.name': 'File name', 'kv.dims': 'Dimensions', 'kv.mp': 'Megapixels', 'kv.ratio': 'Ratio',
      'kv.size': 'File size', 'kv.format': 'Format', 'kv.alpha': 'Alpha channel',
      'flag.large': 'Large image · processing may take a few seconds',
      'btn.change': 'Change image',

      /* ── Stage ── */
      'view.aria': 'Preview view', 'view.crop': 'Result', 'view.source': 'Framing',
      'btn.thirds': 'Thirds', 'btn.recenter': 'Re-centre',
      'ro.dims': 'Output size', 'ro.ratio': 'Ratio', 'ro.size': 'Est. size', 'ro.target': 'Target',
      'focus.label': 'Focus point',
      'hint.crop': 'Drag inside the frame to move the crop',
      'hint.source': 'Drag the crop box to choose which part to keep',

      /* ── Ratio ── */
      'ratio.generic': 'Common ratios', 'ratio.platform': 'Platform presets', 'ratio.custom': 'Custom ratio',
      'ratio.hint': 'Decimals allowed, e.g. <span class="mono">2.35 : 1</span>',
      'ratio.err.positive': 'Both values must be greater than 0, e.g. 2.35 : 1.',
      'ratio.err.range': 'Each value must be between 0 and 100.',
      'btn.apply': 'Apply',
      'btn.apply.aria': 'Apply {name} ratio and its recommended size',
      'chip.aria': 'Aspect ratio {w} to {h}',

      /* ── Target size ── */
      'size.custom': 'Custom target',
      'size.hint': 'Maximum 50 MB. Leave empty for no limit (highest quality).',
      'size.err.positive': 'Enter a value greater than 0.',
      'size.err.max': 'Target cannot exceed 50 MB (currently {mb} MB).',
      'flag.tiny': 'Target is very small — visible quality loss is likely.',
      'flag.png': 'PNG is lossless, so its size cannot be controlled by a quality setting.',
      'btn.switchJpg': 'Switch to JPG to hit the target size',
      'size.unlimited': 'No limit',

      /* ── Output size ── */
      'mode.max': 'Maximum available', 'mode.max.meta': 'Full pixels from the source',
      'mode.preset': 'Platform preset', 'mode.edge': 'Custom long edge', 'mode.edge.meta': 'Scale to long edge',
      'edge.label': 'Long edge (px)',
      'edge.err': 'Long edge must be between 16 and 10000.',

      /* ── Export ── */
      'fmt.label': 'Format',
      'fmt.hint.jpg': 'JPG is small and good for photos; transparent areas are filled with the chosen background colour.',
      'fmt.hint.png': 'PNG is lossless and keeps transparency, but its size cannot be controlled by a quality setting.',
      'bg.label': 'Background colour',
      'bg.hint': 'The source has transparency. Transparent areas are filled with this colour when exporting JPG.',
      'q.label': 'Override JPG quality',
      'q.hint': 'All the way left = quality is set automatically from the target file size.',

      'q.auto': 'Auto',

      /* ── Framing copy ── */
      'crop.lead': 'Always centre-cropped to fill the target ratio with no letterboxing. To keep a specific edge, adjust the framing right on the stage — drag the image in the Result view, or drag the crop box in the Framing view; both do the same thing. The 3×3 focus buttons work too.',
      'summary.lead': 'Every number below comes from the exact file you are about to download — <strong>the estimated size is not an estimate, it is that file\'s real byte count</strong>.',
      'focus.center': 'Centred · 50% / 50%',
      'focus.at': 'Focus {x}% / {y}%',

      /* ── Pre-export panel ── */
      'sm.dims': 'Output size', 'sm.ratio': 'Aspect ratio', 'sm.format': 'Format',
      'sm.target': 'Target size', 'sm.actual': 'Estimated file size', 'sm.quality': 'Encode quality',
      'sm.scale': 'Resolution change', 'sm.time': 'Processing time', 'sm.verdict': 'Target met',
      'sm.target.unlimited': 'No limit (highest quality)',
      'sm.quality.lossless': 'Lossless (PNG)',
      'sm.quality.manual': '{q}% (set manually)',
      'sm.quality.auto': '{q}% (matched to target size)',
      'sm.quality.fixed': '{q}% (fixed high quality)',
      'sm.scale.up': 'Upscaled {n}×', 'sm.scale.down': 'Downscaled {n}×', 'sm.scale.same': 'Native resolution',
      'sm.scale.shrunk': '{s} → reduced further to {w} × {h} for the size budget',
      'sm.verdict.none': 'No target set · highest quality',
      'sm.verdict.ok': '\u2705 Target met · using {p}% of the budget',
      'sm.verdict.miss': '\u26a0 Target missed · over by {d}',
      'sm.foot.empty': 'Load an image and every export parameter appears here.',

      /* ── Flags ── */
      'flag.upscale': 'Upscaling {n}× — the source lacks pixels, so the extra detail is interpolated and sharpness may suffer.',
      'flag.downscale': 'Reduced to {p}% of the source\u2019s available resolution, as requested by your output size.',

      /* ── Status ── */
      'status.idle': 'Waiting for an image', 'status.busy': 'Working', 'status.ready': 'Ready',
      'status.wait': 'Not processed yet', 'status.hit': 'Target met', 'status.miss': 'Target missed',

      /* ── Busy labels ── */
      'busy.crop': 'Cropping…', 'busy.resample': 'Resampling…',
      'busy.compress': 'Compressing to the target size…', 'busy.png': 'Encoding PNG…',
      'busy.jpg': 'Encoding JPG…', 'busy.manual': 'Encoding at the chosen quality…',
      'busy.read': 'Reading the image…', 'busy.decode': 'Decoding pixels…',

      /* ── Download ── */
      'dl.label': 'Download {ext} · {w} × {h}',
      'dl.label.idle': 'Download cover',
      'dl.note.idle': 'Load an image first',
      'dl.note.unlimited': '{ext} · {size} · no size limit',
      'dl.note.target': '{ext} · {size} · target {target} · {state}',
      'dl.state.hit': 'target met', 'dl.state.miss': 'target missed',

      /* ── Toasts ── */
      'toast.load.title': 'Image loaded',
      'toast.load.msg': '{w} × {h} px · {size} · {alpha}',
      'alpha.yes': 'has alpha', 'alpha.no': 'no alpha',
      'toast.notImage.title': 'Cannot load this file',
      'toast.notImage.msg': '\u201c{name}\u201d is not a supported image. Use JPG / PNG / WebP / GIF / BMP.',
      'toast.decode.title': 'Could not decode the image',
      'toast.decode.msg': '\u201c{name}\u201d could not be decoded: the file may be corrupt or use an unsupported encoding.',
      'toast.exported.title': 'Cover exported',
      'toast.exported.msg': '{name} · {size} · {tail} · {sec} s',
      'tail.unlimited': 'no size limit',
      'tail.hit': 'target {target} met',
      'tail.miss': 'over target {target}',
      'toast.miss.title': 'Target size not met',
      'toast.miss.msg': 'Currently {size}, target {target}. {advice}',
      'advice.png': 'PNG is lossless and cannot be compressed by a quality setting — try JPG instead.',
      'advice.jpg': 'Try a smaller output size, or use PNG to keep it lossless.',
      'toast.encodeFail.title': 'Processing failed',
      'toast.encodeFail.msg': 'The browser could not finish encoding: {err}. Try another image or a smaller target size.',
      'toast.exportFail.title': 'Export failed',
      'toast.exportFail.msg': 'Something went wrong while writing the file: {err}',
      'toast.close': 'Dismiss',

      /* ── Footnotes ── */
      'note.bgfill': 'The source has transparency; transparent areas were filled with {color}.',
      'note.pngOver': 'PNG is lossless and cannot be compressed by a quality setting — currently over target by {d}. Use \u201cSwitch to JPG\u201d above to meet it.',
      'note.unreachable': 'That target is too small; this is the smallest size reachable: {size}.',
      'note.upscaled': 'The output was upscaled {n}× from a {cw} × {ch} crop, so it is not native pixels.',
      'note.shrunk': 'To get closer to the target size, resolution was reduced from {ow} × {oh} to {w} × {h}.',
      'note.privacy': 'Everything happened in your browser. The image never left this device.',

      /* ── Values ── */
      'value.unknown': 'Unknown', 'value.yes': 'Yes', 'value.no': 'No',
      'dims.px': '{w} × {h} px',
      'crop.rect': '{w} × {h} @ ({x}, {y})',
      'crop.gap': '{n} px',

      /* ── Platform presets ── */
      'group.landscape': 'Landscape video', 'group.vertical': 'Vertical video',
      'group.social': 'Social feed', 'group.square': 'Square / avatar', 'group.article': 'Article header',
      'preset.bilibili': 'Bilibili cover', 'preset.youtube': 'YouTube thumbnail',
      'preset.douyin': 'Douyin / Kuaishou / WeChat Channels', 'preset.xiaohongshu': 'Xiaohongshu (RED) cover',
      'preset.instagram': 'Instagram post', 'preset.square': 'Square / avatar',
      'preset.wechat': 'WeChat article header',
      'preset.aria': '{name} · ratio {r} · recommended {w} × {h}',

      /* ── ARIA labels ── */
      'aria.rail': 'Source and workflow', 'aria.stage': 'Crop and preview', 'aria.inspector': 'Output settings',
      'aria.steps': 'Workflow',
      'aria.canvas': 'Preview canvas of the final result',
      'aria.crop.aria': 'Framing focus grid',
      'aria.fg.tl': 'Top left', 'aria.fg.tc': 'Top centre', 'aria.fg.tr': 'Top right',
      'aria.fg.ml': 'Middle left', 'aria.fg.mc': 'Centre', 'aria.fg.mr': 'Middle right',
      'aria.fg.bl': 'Bottom left', 'aria.fg.bc': 'Bottom centre', 'aria.fg.br': 'Bottom right',
      'aria.sw.white': 'White', 'aria.sw.black': 'Near black', 'aria.sw.cream': 'Cream', 'aria.sw.ember': 'Brand orange',

      /* ── Empty state ── */
      'empty.title': 'Nothing loaded yet',
      'empty.sub': 'Click here to pick an image, drop one anywhere on the page, or press \u2318V to paste.',
      'empty.aria': 'Pick an image, drop one anywhere on the page, or paste from the clipboard',
      'aria.swatches': 'Quick background swatches',

      /* ── Remaining static controls (missed in v1, reported via screenshots) ── */
      'crop.rect.label': 'Crop area', 'crop.gapx.label': 'Horizontal slack', 'crop.gapy.label': 'Vertical slack',
      'ratio.generic.aria': 'Common aspect ratios',
      'ratio.w.aria': 'Custom ratio width', 'ratio.h.aria': 'Custom ratio height',
      'size.presets.aria': 'Target file size presets',
      'size.value.aria': 'Custom target value', 'size.unit.aria': 'Target size unit',
      'mode.aria': 'Output size strategy',
      'edge.presets.aria': 'Long-edge quick values', 'edge.input.aria': 'Custom long edge in pixels',
      'bg.color.aria': 'JPG background fill colour',
      'busy.working': 'Working…'
    }
  };

  /* ── 选择器 → 文案键 映射（改文案不用动 HTML）───────────────────────── */
  /* 每项：{ sel, key }             → 覆盖 textContent
           { sel, key, html: true } → 覆盖 innerHTML（含 <kbd>/<strong> 等子元素）
           { sel, key, attr: 'x' }  → 覆盖属性 x（aria-label / title / placeholder） */
  var DOM = [
    { sel: '.skip-link', key: 'skip' },
    { sel: '.brand__zh', key: 'brand.zh' },
    { sel: '.brand__tag', key: 'brand.tag' },
    { sel: '.privacy-badge', key: 'privacy.title', attr: 'title' },
    { sel: '.privacy-badge span', key: 'privacy' },
    { sel: '#btn-reset-all', key: 'reset.all' },
    { sel: '.veil__title', key: 'veil.title' },
    { sel: '.veil__sub', key: 'veil.sub' },

    { sel: '.steps__item[data-step="source"] .steps__label', key: 'step.source' },
    { sel: '.steps__item[data-step="ratio"] .steps__label', key: 'step.ratio' },
    { sel: '.steps__item[data-step="target"] .steps__label', key: 'step.target' },
    { sel: '.steps__item[data-step="output"] .steps__label', key: 'step.output' },
    { sel: '.steps__item[data-step="crop"] .steps__label', key: 'step.crop' },
    { sel: '.steps__item[data-step="export"] .steps__label', key: 'step.export' },
    { sel: '.steps', key: 'aria.steps', attr: 'aria-label' },

    { sel: '#h-source', key: 'h.source' }, { sel: '#h-ratio', key: 'h.ratio' },
    { sel: '#h-target', key: 'h.target' }, { sel: '#h-output', key: 'h.output' },
    { sel: '#h-crop', key: 'h.crop' }, { sel: '#h-export', key: 'h.export' },
    { sel: '#h-stage', key: 'h.stage' }, { sel: '#h-summary', key: 'h.summary' },

    { sel: '#dropzone', key: 'drop.aria', attr: 'aria-label' },
    { sel: '#dropzone .dropzone__title', key: 'drop.title' },
    { sel: '#dropzone .dropzone__sub', key: 'drop.sub', html: true },

    { sel: '#source-info .kv__row:nth-of-type(1) dt', key: 'kv.name' },
    { sel: '#source-info .kv__row:nth-of-type(2) dt', key: 'kv.dims' },
    { sel: '#source-info .kv__row:nth-of-type(3) dt', key: 'kv.mp' },
    { sel: '#source-info .kv__row:nth-of-type(4) dt', key: 'kv.ratio' },
    { sel: '#source-info .kv__row:nth-of-type(5) dt', key: 'kv.size' },
    { sel: '#source-info .kv__row:nth-of-type(6) dt', key: 'kv.format' },
    { sel: '#source-info .kv__row:nth-of-type(7) dt', key: 'kv.alpha' },
    { sel: '#flag-large', key: 'flag.large' },
    { sel: '#btn-change-file', key: 'btn.change' },

    { sel: '#view-mode', key: 'view.aria', attr: 'aria-label' },
    { sel: '#view-mode .segmented__btn[data-view="crop"]', key: 'view.crop' },
    { sel: '#view-mode .segmented__btn[data-view="source"]', key: 'view.source' },
    { sel: '#btn-toggle-grid', key: 'btn.thirds' },
    { sel: '#btn-reset-crop', key: 'btn.recenter' },
    { sel: '#stage-canvas', key: 'aria.canvas', attr: 'aria-label' },

    { sel: '#readout .readout__item:nth-of-type(1) .readout__label', key: 'ro.dims' },
    { sel: '#readout .readout__item:nth-of-type(3) .readout__label', key: 'ro.ratio' },
    { sel: '#readout .readout__item:nth-of-type(5) .readout__label', key: 'ro.size' },
    { sel: '#readout .readout__item:nth-of-type(7) .readout__label', key: 'ro.target' },

    { sel: '#panel-crop-controls .mini-label', key: 'focus.label' },
    { sel: '#focus-grid', key: 'aria.crop.aria', attr: 'aria-label' },
    { sel: '.focus-grid__cell[data-fx="0"][data-fy="0"]', key: 'aria.fg.tl', attr: 'aria-label' },
    { sel: '.focus-grid__cell[data-fx="0.5"][data-fy="0"]', key: 'aria.fg.tc', attr: 'aria-label' },
    { sel: '.focus-grid__cell[data-fx="1"][data-fy="0"]', key: 'aria.fg.tr', attr: 'aria-label' },
    { sel: '.focus-grid__cell[data-fx="0"][data-fy="0.5"]', key: 'aria.fg.ml', attr: 'aria-label' },
    { sel: '.focus-grid__cell[data-fx="0.5"][data-fy="0.5"]', key: 'aria.fg.mc', attr: 'aria-label' },
    { sel: '.focus-grid__cell[data-fx="1"][data-fy="0.5"]', key: 'aria.fg.mr', attr: 'aria-label' },
    { sel: '.focus-grid__cell[data-fx="0"][data-fy="1"]', key: 'aria.fg.bl', attr: 'aria-label' },
    { sel: '.focus-grid__cell[data-fx="0.5"][data-fy="1"]', key: 'aria.fg.bc', attr: 'aria-label' },
    { sel: '.focus-grid__cell[data-fx="1"][data-fy="1"]', key: 'aria.fg.br', attr: 'aria-label' },

    { sel: '#panel-ratio .panel__body h3:nth-of-type(1)', key: 'ratio.generic' },
    { sel: '#panel-ratio .panel__body h3:nth-of-type(2)', key: 'ratio.platform' },
    { sel: '#panel-ratio .panel__body h3:nth-of-type(3)', key: 'ratio.custom' },
    { sel: '.ratio-custom .field__hint', key: 'ratio.hint', html: true },

    { sel: '#panel-target .mini-label', key: 'size.custom' },
    { sel: '#panel-target .field__hint', key: 'size.hint' },
    { sel: '#flag-tiny', key: 'flag.tiny' },
    { sel: '#flag-png-text', key: 'flag.png' },
    { sel: '#btn-switch-jpg', key: 'btn.switchJpg' },

    { sel: '#size-modes .chip[data-mode="max"] .chip__main', key: 'mode.max' },
    { sel: '#size-modes .chip[data-mode="max"] .chip__meta', key: 'mode.max.meta' },
    { sel: '#size-modes .chip[data-mode="preset"] .chip__main', key: 'mode.preset' },
    { sel: '#size-modes .chip[data-mode="edge"] .chip__main', key: 'mode.edge' },
    { sel: '#size-modes .chip[data-mode="edge"] .chip__meta', key: 'mode.edge.meta' },
    { sel: '#edge-field .mini-label', key: 'edge.label' },

    { sel: '#lbl-format', key: 'fmt.label' },
    { sel: '#bg-field .mini-label', key: 'bg.label' },
    { sel: '#bg-field .field__hint', key: 'bg.hint' },
    { sel: '#quality-field .mini-label', key: 'q.label' },
    { sel: '#quality-hint', key: 'q.hint' },
    { sel: '#bg-swatches', key: 'aria.swatches', attr: 'aria-label' },
    { sel: '.swatch[data-color="#ffffff"]', key: 'aria.sw.white', attr: 'aria-label' },
    { sel: '.swatch[data-color="#0A0C0F"]', key: 'aria.sw.black', attr: 'aria-label' },
    { sel: '.swatch[data-color="#F2F1EC"]', key: 'aria.sw.cream', attr: 'aria-label' },
    { sel: '.swatch[data-color="#FF7A33"]', key: 'aria.sw.ember', attr: 'aria-label' },

    { sel: '#panel-crop .panel__lead', key: 'crop.lead' },
    { sel: '#panel-summary .panel__lead', key: 'summary.lead', html: true },
    { sel: '#summary-list .summary__row:nth-of-type(1) dt', key: 'sm.dims' },
    { sel: '#summary-list .summary__row:nth-of-type(2) dt', key: 'sm.ratio' },
    { sel: '#summary-list .summary__row:nth-of-type(3) dt', key: 'sm.format' },
    { sel: '#summary-list .summary__row:nth-of-type(4) dt', key: 'sm.target' },
    { sel: '#summary-list .summary__row:nth-of-type(5) dt', key: 'sm.actual' },
    { sel: '#summary-list .summary__row:nth-of-type(6) dt', key: 'sm.quality' },
    { sel: '#summary-list .summary__row:nth-of-type(7) dt', key: 'sm.scale' },
    { sel: '#summary-list .summary__row:nth-of-type(8) dt', key: 'sm.time' },
    { sel: '#summary-list .summary__row:nth-of-type(9) dt', key: 'sm.verdict' },

    { sel: '#btn-apply-ratio', key: 'btn.apply' },
    { sel: '#btn-apply-size', key: 'btn.apply' },
    { sel: '#format-hint', key: 'fmt.hint.jpg' },
    { sel: '#busy-text', key: 'busy.working' },
    { sel: '#stage-hint-text', key: 'hint.crop' },
    { sel: '#focus-readout', key: 'focus.center' },
    { sel: '#stage-empty', key: 'empty.aria', attr: 'aria-label' },
    { sel: '#generic-ratios', key: 'ratio.generic.aria', attr: 'aria-label' },
    { sel: '#ratio-w', key: 'ratio.w.aria', attr: 'aria-label' },
    { sel: '#ratio-h', key: 'ratio.h.aria', attr: 'aria-label' },
    { sel: '#size-presets', key: 'size.presets.aria', attr: 'aria-label' },
    { sel: '#size-value', key: 'size.value.aria', attr: 'aria-label' },
    { sel: '#size-unit', key: 'size.unit.aria', attr: 'aria-label' },
    { sel: '#size-modes', key: 'mode.aria', attr: 'aria-label' },
    { sel: '#edge-presets', key: 'edge.presets.aria', attr: 'aria-label' },
    { sel: '#edge-input', key: 'edge.input.aria', attr: 'aria-label' },
    { sel: '#bg-color', key: 'bg.color.aria', attr: 'aria-label' },
    { sel: '#crop-info .kv__row:nth-of-type(1) dt', key: 'crop.rect.label' },
    { sel: '#crop-info .kv__row:nth-of-type(2) dt', key: 'crop.gapx.label' },
    { sel: '#crop-info .kv__row:nth-of-type(3) dt', key: 'crop.gapy.label' },

    { sel: '.stage-empty__title', key: 'empty.title' },
    { sel: '.stage-empty__sub', key: 'empty.sub' },

    { sel: '.rail', key: 'aria.rail', attr: 'aria-label' },
    { sel: '.stage-col', key: 'aria.stage', attr: 'aria-label' },
    { sel: '.inspector', key: 'aria.inspector', attr: 'aria-label' }
  ];

  var current = 'zh-CN';

  function detect() {
    try {
      var v = localStorage.getItem(KEY);
      if (v && STRINGS[v]) return v;
    } catch (e) { /* 隐私模式下 localStorage 不可用，退回默认 */ }
    return 'zh-CN';
  }

  function t(key, vars) {
    var table = STRINGS[current] || STRINGS['zh-CN'];
    var s = table[key];
    if (s === undefined) s = (STRINGS['zh-CN'][key] !== undefined ? STRINGS['zh-CN'][key] : key);
    if (vars) {
      Object.keys(vars).forEach(function (k) {
        s = s.split('{' + k + '}').join(String(vars[k]));
      });
    }
    return s;
  }

  function applyDOM() {
    DOM.forEach(function (m) {
      var node;
      try { node = document.querySelector(m.sel); } catch (e) { return; }
      if (!node) return;
      var val = t(m.key);
      if (m.attr) node.setAttribute(m.attr, val);
      else if (m.html) node.innerHTML = val;
      else node.textContent = val;
    });
    document.documentElement.lang = current === 'en' ? 'en' : 'zh-CN';
    document.title = t('doc.title');
    var meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute('content', t('doc.desc'));

    var btn = document.getElementById('btn-lang');
    if (btn) {
      btn.textContent = t('lang.switch');
      btn.setAttribute('title', t('lang.switch.title'));
      btn.setAttribute('aria-label', t('lang.switch.title'));
    }
  }

  function setLang(lang) {
    if (!STRINGS[lang]) return;
    current = lang;
    try { localStorage.setItem(KEY, lang); } catch (e) { /* 忽略：不持久化也能用 */ }
    applyDOM();
    if (window.CoverForge && window.CoverForge.onLangChange) window.CoverForge.onLangChange(lang);
  }

  current = detect();

  window.CF = {
    t: t,
    // tr 是 app.js 里用的别名：因为 app.js 内部有多处局部变量叫 t（例如
    // paintStatus 里的 `const t = S.targetBytes`），用同名会触发 TDZ 报错。
    tr: t,
    setLang: setLang,
    toggleLang: function () { setLang(current === 'en' ? 'zh-CN' : 'en'); },
    getLang: function () { return current; },
    applyDOM: applyDOM,
    LANGS: Object.keys(STRINGS)
  };
})();
