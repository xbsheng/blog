---
name: XBS 的技术博客
description: 克制的单栏技术博客：让代码、图表、公式无声地成为主角
colors:
  light-bg: "#fafafa"
  light-surface: "#ffffff"
  light-surface-2: "#ebebeb"
  light-text: "#171717"
  light-text-2: "#666666"
  light-text-3: "#6b6b6b"
  light-border: "#eaeaea"
  light-border-strong: "#d4d4d4"
  light-accent: "#0070f3"
  light-code-bg: "#ffffff"
  light-code-inline-bg: "#ebebeb"
  dark-bg: "#000000"
  dark-surface: "#0a0a0a"
  dark-surface-2: "#1f1f1f"
  dark-text: "#ededed"
  dark-text-2: "#a1a1a1"
  dark-text-3: "#8a8a8a"
  dark-border: "#333333"
  dark-border-strong: "#444444"
  dark-accent: "#3291ff"
  dark-code-bg: "#0a0a0a"
  dark-code-inline-bg: "#333333"
  warning-amber: "#d97706"
  warning-amber-deep: "#b45309"
typography:
  display:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif"
    fontSize: "clamp(1.75rem, 5vw, 2.5rem)"
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: "-0.02em"
  page-title:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif"
    fontSize: "clamp(1.5rem, 4vw, 2rem)"
    fontWeight: 600
    lineHeight: 1.35
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif"
    fontSize: "1.5rem"
    fontWeight: 600
    lineHeight: 1.45
    letterSpacing: "-0.015em"
  headline-2:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif"
    fontSize: "1.25rem"
    fontWeight: 600
    lineHeight: 1.45
    letterSpacing: "-0.015em"
  headline-3:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 600
    lineHeight: 1.45
    letterSpacing: "-0.015em"
  body:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.8
  ui:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.75
  meta:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 400
    lineHeight: 1.75
  label:
    fontFamily: "'JetBrains Mono Variable', ui-monospace, Menlo, Consolas, monospace"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.7
  chip:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif"
    fontSize: "0.78125rem"
    fontWeight: 400
    lineHeight: 1.6
rounded:
  focus-ring: "2px"
  xs: "4px"
  sm: "8px"
  md: "12px"
  pill: "999px"
spacing:
  col: "42rem"
  wide: "56rem"
  nav-h: "4rem"
components:
  tag-pill:
    backgroundColor: "{light-surface-2}"
    textColor: "{light-text-2}"
    rounded: "{rounded.pill}"
    padding: "1px 8px"
  callout-card:
    backgroundColor: "{light-surface}"
    textColor: "{light-text}"
    rounded: "{rounded.md}"
    padding: "14px 18px"
  image-zoom-bar:
    backgroundColor: "{light-surface}"
    textColor: "{light-text-2}"
    rounded: "{rounded.pill}"
    padding: "6px"
---

# Design System: XBS 的技术博客

## Overview

**Creative North Star: "静面工作台"**

这是一个把全部注意力让给内容的技术博客，视觉世界参照 Vercel Docs：浅灰白/纯黑双底、发丝线构成的层次、唯一的品牌蓝。视觉形态仍是用户选择的经典居中单栏博客（canon），工艺基准转向 Vercel Docs——黑白极净、600 字重紧字距标题、中性下划线链接、"加深式"悬停与选中语法。代码块（固定 One Dark 深色卡）、Mermaid 图表与 KaTeX 公式是内容的一等公民，界面本身保持安静。

**Key Characteristics:**
- 深浅双主题为第一公民：跟随系统 + 手动切换，`data-theme` 驱动，首帧前内联脚本防闪烁
- 层次只靠 1px 发丝边框与悬停底色，零阴影堆叠
- 强调色出现得越少越有效：链接 hover 与目录选中用"加深"，不用强调色
- 一个动效时刻：主题切换的 View Transitions 圆形揭示（尊重 prefers-reduced-motion）

## Colors

双主题各一套完整令牌，切换即整体换肤；任何组件颜色都必须来自主题令牌，不允许写死在组件里。

### Primary
- **Vercel 蓝（light-accent / dark-accent）** (#0070f3 / #3291ff): 选区、复制反馈、焦点环、时间轴圆点 hover、标签胶囊 hover、tip 提示框。出现频率 ≤10%，它的稀缺性就是它的作用。

### Secondary
- **警示琥珀（warning-amber）** (#d97706，暗色标题 #f0b254): **唯一声明的语义例外**——warning/caution 提示框专用。琥珀是跨文化的"注意"信号，除此之外不引入任何第二色相。

### Neutral
- **页面底** (#fafafa / #000000): 页面基底。浅色是 Vercel 式的灰白而非纯白，暗色是纯黑。
- **浮面** (#ffffff / #0a0a0a): 提示框、Mermaid 图表容器、命令面板、目录抽屉等"内容容器"，在灰白底上以白色微浮，在纯黑底上以 #0a0a0a 微浮。代码块是固定 One Dark 深色卡，不随页面换肤（见 Components）。
- **悬停灰** (#ebebeb / #1f1f1f): 列表行、导航项、标签胶囊的底色。
- **正文墨** (#171717 / #ededed): 标题与正文。
- **次级灰** (#666666 / #a1a1a1): 摘要、辅助说明。
- **弱化灰** (#6b6b6b / #8a8a8a): 日期、阅读时长等元数据（所有底色组合 ≥4.5:1）。
- **发丝线** (#eaeaea / #333333 及加深档 #d4d4d4 / #444444): 全部 1px 分割与容器描边。

### Named Rules
**单一声音规则。** 强调色只用于"可交互反馈"与"当前所在"，装饰性使用是被禁止的；时间轴圆点、404 数字等静态元素一律中性。一屏之内它的覆盖面积不超过一成。
**琥珀例外规则。** warning/caution 提示框允许使用琥珀作为语义色，这是系统里唯一被声明豁免的第二色相；新增颜色需求必须先回答"为什么琥珀例外规则不够用"。

## Typography

**Display/Body Font:** 系统 CJK 无衬线栈（-apple-system → PingFang SC → Microsoft YaHei）
**Label/Mono Font:** JetBrains Mono Variable（@fontsource-variable 自托管），仅用于代码与行内代码

**Character:** 系统字栈是已确认的品牌承诺——零加载成本、原生 CJK 渲染质感；JetBrains Mono 只在"这是代码/数据"的语境出现，绝不作为装饰性等宽使用。

### Hierarchy
- **Display** (600, clamp(1.75rem–2.5rem), 1.25, -0.02em): 首页问候语与文章大标题，全站最大字号。
- **Page Title** (600, clamp(1.5rem–2rem)): 归档/标签/搜索/关于等次级页标题。
- **Headline** (600, 1.5rem)：正文 h2；**Headline-2** (600, 1.25rem)：正文 h3；**Headline-3** (600, 1.0625rem)：正文 h4 与首页区块标题。
- **Body** (400, 1.0625rem/1.8): 正文，中英混排，最大行宽 42rem。
- **UI** (400, 1rem/1.75): 非正文区的界面文字（页头、hero 简介、空态说明）。
- **Meta** (400, 0.9375rem/1.75): 次级正文（摘要、表格、提示框正文、抽屉目录）。
- **Label** (400, 0.875rem, JetBrains Mono): 代码块；元数据行（日期/时长）为 0.8125rem 系统字 + tabular-nums。
- **Chip** (400, 0.78125rem/1.6): 标签胶囊。
- 唯一字阶例外：404 页的 "404" 数字为 4rem mono 中性色（装饰性数字，不参与正文层级）。

### Named Rules
**字重阶梯规则。** 层级靠 600/400 的字重与尺寸差表达；CJK 显示层字距下限 -0.02em，不使用拉丁显示体式的更紧字距（全角字形会碰撞）。
**中性链接规则。** 正文链接常态为正文色 + 34% 透明度下划线（Vercel 语法）；hover 只把下划线加深到实色，文字不变色、不转强调色。目录（大纲）选中态同理：前景色文字 + 1px 前景色竖线 + 600 字重，hover 加深；阅读进度条同为前景色。

## Layout

居中单栏：阅读列 `--w-col` 42rem，宽容器 `--w-wide` 56rem（搜索、首页区块头）；页面左右 padding 1.25rem。垂直节奏"标题上方留白大于下方"（prose h2 上边距 2.25em，h3 2em）。响应式：≤640px 收紧页头（站名即首页入口、隐藏"首页"导航项、标题超宽省略号）；≥80rem 文章页右侧浮出 15rem 宽目录栏（绝对定位于阅读列右外侧，不挤占正文）。

## Elevation & Depth

无阴影系统。层次由三层表达：1px 发丝线（容器边界）、悬停底色（可交互暗示）、`backdrop-filter` 磨砂（仅限吸顶页头一处）。阴影仅用于弹层：`--shadow-pop`（0 8px 30px rgba(0,0,0,.1)/.55）的消费者是移动端目录抽屉、目录悬浮按钮与 ⌘K 命令面板——普通页面元素不得使用。

### Named Rules
**发丝线规则。** 一切容器用 1px 边框划分，深度靠悬停底色表达；零偏移彩色光晕与宽软阴影不属于这个世界。
**弹层阴影规则。** `--shadow-pop` 是弹层专属：只有浮出正常文档流的表面（抽屉、下拉、模态）可以携带它。

## Shapes

圆角三档：容器 12px（`--radius`）、小控件与代码块 8px（`--radius-sm`，EC `borderRadius: '8px'`）、胶囊 999px（标签、hero 链接 pill）；另有 4px（行内代码、mark）与 2px（焦点环）两个微圆角档。图标语言统一为 24px 描边 SVG（stroke 2、圆头圆角），信息类图标不允许用 emoji 或字符代替。

## Components

### 文章列表行（PostRow）
- **Shape:** 8px 圆角，hover 时 surface-2 底色
- **层级:** 元数据行（日期 · 时长，tabular-nums）→ 标题（1.0625rem/600，hover 不变色）→ 两行截断摘要 → 标签胶囊
- **State:** hover 仅底色变化（Vercel 行悬停语法）；颜色过渡 0.2s

### 标签胶囊（TagPill）
- **Style:** surface-2 底 + 次级文字色，胶囊圆角
- **State:** hover 底色转 accent-soft、文字转强调色

### 提示框（Callout）
- **Shape:** 12px 圆角、1px 边框的浮面卡片，标题行 = 描边图标 + 单字标签
- **Variants:** note/tip（tip 的边框与标题染强调色）；warning/caution 用琥珀（见琥珀例外规则）
- **State:** 无交互态

### 代码块（Expressive Code）
- **Shape:** 10px 圆角、1px 边框（`#21252b`），标题栏显示文件名，右上角复制按钮
- **Theme:** 固定 One Dark（one-dark-pro）——明暗两种页面主题下都以深色卡片呈现，代码可读性不随页面换肤波动
- **Typography:** JetBrains Mono Variable，0.875rem（14px），行高 1.7；标题栏为系统无衬线 12px/500
- **能力:** `ins/del/mark` 行高亮、语法配色、横向滚动；标题栏文件名前带 vscode-icons 官方文件类型图标（内置 SVG，按文件名/扩展名映射；标题可带中文备注如 "model.py（节选）"，扩展名从右向左匹配）
- **配置位置:** 函数类选项必须在 `ec.config.mjs`（`<Code>` 组件要求可序列化）；修改后需删除 `node_modules/.astro` 再构建

### 页头
- **Style:** 吸顶 + `backdrop-filter` 磨砂，滚动 >8px 后浮现底部发丝线
- **Contents:** 站名（600，hover 变强调色）· 文字导航（当前项 aria-current 加粗）· 搜索图标 · 主题切换图标
- **Mobile:** ≤640px 隐藏"首页"项，站名省略号截断；全部可点击元素触控热区提升至 ≥44px（图标按钮视觉尺寸不变）

### 目录（桌面侧栏 + 移动抽屉）
- **Desktop (≥80rem):** 固定于阅读列右外侧（15rem 宽），长文阅读时始终可见；页头下缘有一条随整篇滚动进度从左向右填充的前景色阅读进度条（2px 全宽），目录标题旁显示百分比；超长目录自身滚动（thin scrollbar）
- **Mobile (<80rem):** 右下角 44px 悬浮按钮（描边图标 + 弹层阴影），点开底部抽屉（65dvh 上限、12px 顶角、遮罩 45% 黑），链接点击/遮罩/Escape 均关闭，打开时锁定页面滚动
- **State:** 当前章节 = 前景色文字 + 左侧 1px 前景色竖线 + 600 字重（Vercel "On this page" 语法）；hover 加深到前景色，不用强调色

### 命令面板（⌘K）
- **Trigger:** 任意页面 ⌘K / Ctrl-K 或页头搜索图标唤出；Esc / 遮罩关闭；打开时焦点入面板、Tab 圈闭、关闭归还
- **行为:** 空查询显示快捷入口（首页/归档/标签/关于/搜索页）；输入经 Pagefind JS API 即时检索文章（仅正文索引），↑↓ 选择、Enter 打开
- **Style:** 顶部 13vh 居中 36rem 卡片，浮面底 + 发丝边框 + 弹层阴影；激活项 surface-2 底 + 强调色标题

### 主题切换
- **Style:** 与搜索图标同尺寸的图标按钮（34px 网格居中）
- **Behavior:** View Transitions API 圆形揭示，从点击位置扩散（0.45s ease-out）；`prefers-reduced-motion` 下直接切换；切换后派发 `themechange` 事件驱动 Mermaid/giscus/代码块重绘

### 配图查看器（Image Zoom）
- **Trigger:** 点击正文配图打开（`cursor: zoom-in`，键盘 Enter/空格同等）；被链接包裹的图片除外；Esc / 遮罩空白 / 关闭按钮均退出，退出后锁定解除、焦点归还
- **Shape:** 原生 `<dialog>` 全屏模态，90% 黑遮罩；底部居中胶囊工具栏（浮面底 + 发丝边框 + 弹层阴影）
- **Toolbar:** 缩小 · 缩放读数（mono tabular-nums） · 放大 · 左旋 · 右旋 · 重置 · 关闭，统一 24px 描边图标
- **Behavior:** 滚轮/双指缩放（指针为锚点）、双击在适配与 2× 间切换、放大后可拖拽平移，旋转按 90° 步进且保持适配；缩放下限即适配、上限 8×；键盘 `+`/`-`/`0`/`R`/方向键
- **Load:** 打开时取 `srcset` 最大候选，加载期间淡入占位，关闭后回落 1×1 透明占位

## Do's and Don'ts

### Do:
- **Do** 所有颜色取自双主题令牌；新组件先定义 light/dark 两份值
- **Do** 图标使用统一的 24px 描边 SVG（stroke-width 2、圆头）
- **Do** 元数据数字使用 `font-variant-numeric: tabular-nums`
- **Do** 动效只用 0.2–0.45s 的 ease 过渡，且必须尊重 `prefers-reduced-motion`
- **Do** 日期格式保持 `YYYY-MM-DD`（locale 中立、等宽对齐）
- **Do** 代码块配置改动后删除 `node_modules/.astro` 再构建（内容层缓存）

### Don't:
- **Don't** 使用阴影制造层次（弹层组件出现前 `--shadow-pop` 不得启用）
- **Don't** 引入第二强调色；琥珀仅限 warning/caution 提示框
- **Don't** 正文链接默认使用强调色，链接 hover 也不变强调色——hover 只加深下划线/文字；目录选中 = 前景色 + 竖线
- **Don't** 用 emoji 或 Unicode 字符充当图标
- **Don't** 在强调色之外使用渐变、玻璃拟态、纹理贴图
- **Don't** 让 JS 异步决定首帧主题（内联脚本必须在 CSS 生效前写入 `data-theme`）
