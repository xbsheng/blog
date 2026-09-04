---
name: XBS 的技术博客
description: 克制的单栏技术博客：让代码、图表、公式无声地成为主角
colors:
  paper-bg: "#fafaf9"
  paper-surface: "#ffffff"
  paper-surface-2: "#f2f2f0"
  paper-text: "#1b1b1f"
  paper-text-2: "#56565c"
  paper-text-3: "#6f6f75"
  paper-border: "#e5e5e2"
  paper-border-strong: "#d4d4d0"
  paper-accent: "#5b49d6"
  paper-code-bg: "#f6f6f4"
  night-bg: "#131316"
  night-surface: "#1a1a1f"
  night-surface-2: "#222228"
  night-text: "#e4e3e8"
  night-text-2: "#a2a2ab"
  night-text-3: "#85858e"
  night-border: "#2a2a31"
  night-border-strong: "#3a3a42"
  night-accent: "#a89bf8"
  night-code-bg: "#1c1c22"
  warning-amber: "#d97706"
typography:
  display:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif"
    fontSize: "clamp(1.6rem, 4.5vw, 2.1rem)"
    fontWeight: 700
    lineHeight: 1.35
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif"
    fontSize: "1.375rem"
    fontWeight: 650
    lineHeight: 1.45
    letterSpacing: "-0.015em"
  body:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.85
  label:
    fontFamily: "'JetBrains Mono Variable', ui-monospace, Menlo, Consolas, monospace"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.7
rounded:
  sm: "8px"
  md: "12px"
  code: "10px"
  pill: "999px"
spacing:
  col: "42rem"
  wide: "56rem"
  nav-h: "4rem"
components:
  tag-pill:
    backgroundColor: "{paper-surface-2}"
    textColor: "{paper-text-2}"
    rounded: "{rounded.pill}"
    padding: "1px 8px"
  callout-card:
    backgroundColor: "{paper-surface}"
    textColor: "{paper-text-1}"
    rounded: "{rounded.md}"
    padding: "14px 18px"
---

# Design System: XBS 的技术博客

## Overview

**Creative North Star: "安静的实验室"**

这是一个把全部注意力让给内容的技术博客：近单色的纸白/深灰双底、1px 发丝线构成的层次、唯一的紫罗兰强调色。视觉世界是"经典博客形态做到位"（用户在方向决策中明确选择的 canon），工艺基准 antfu.me——克制、精确、无装饰性杂音。代码块（vitesse 双主题）、Mermaid 图表与 KaTeX 公式是内容的一等公民，界面本身越安静越好。

**Key Characteristics:**
- 深浅双主题为第一公民：跟随系统 + 手动切换，`data-theme` 驱动，首帧前内联脚本防闪烁
- 层次只靠 1px 边框与悬停底色，零阴影堆叠
- 强调色出现得越少越有效
- 一个动效时刻：主题切换的 View Transitions 圆形揭示（尊重 prefers-reduced-motion）

## Colors

双主题各一套完整令牌，切换即整体换肤；任何组件颜色都必须来自主题令牌，不允许写死在组件里。

### Primary
- **实验紫（paper-accent / night-accent）** (#5b49d6 / #a89bf8): 链接、当前导航、目录高亮、选区、复制反馈。出现频率 ≤10%，它的稀缺性就是它的作用。

### Secondary
- **警示琥珀（warning-amber）** (#d97706，暗色标题 #f0b254): **唯一声明的语义例外**——warning/caution 提示框专用。琥珀是跨文化的"注意"信号，把它染成紫色会削弱警示功能；除此之外不引入任何第二色相。

### Neutral
- **纸底 / 夜底** (#fafaf9 / #131316): 页面基底。
- **浮面** (#ffffff / #1a1a1f): 提示框、代码块、卡片等"内容容器"。
- **悬停灰** (#f2f2f0 / #222228): 列表行、导航项的 hover 底色。
- **正文墨** (#1b1b1f / #e4e3e8): 标题与正文。
- **次级灰** (#56565c / #a2a2ab): 摘要、辅助说明。
- **弱化灰** (#6f6f75 / #85858e): 日期、阅读时长等元数据（不小于 4.5:1 对比度）。
- **发丝线** (#e5e5e2 / #2a2a31 及加深档): 全部 1px 分割与容器描边。

### Named Rules
**单一声音规则。** 强调色只用于"可交互"与"当前所在"，装饰性使用是被禁止的；一屏之内它的覆盖面积不超过一成。
**琥珀例外规则。** warning/caution 提示框允许使用琥珀作为语义色，这是系统里唯一被声明豁免的第二色相；新增颜色需求必须先回答"为什么琥珀例外规则不够用"。

## Typography

**Display/Body Font:** 系统 CJK 无衬线栈（-apple-system → PingFang SC → Microsoft YaHei）
**Label/Mono Font:** JetBrains Mono Variable（@fontsource-variable 自托管），仅用于代码与行内代码

**Character:** 系统字栈是 antfu.me 工艺基准的一部分——零加载成本、原生渲染质感；JetBrains Mono 只在"这是代码/数据"的语境出现，绝不作为装饰性等宽使用。

### Hierarchy
- **Display** (700, clamp(1.6rem–2.1rem), 1.35, -0.02em): 首页问候语与文章大标题，全站最大字号。
- **Headline** (650, 1.375rem/1.125rem): 正文 h2/h3，靠字号与字重区分层级。
- **Body** (400, 1.0625rem/1.85): 正文，中英混排，最大行宽 42rem。
- **Meta/Label** (tabular-nums, 0.8125–0.875rem): 日期、阅读时长用等宽数字对齐。

### Named Rules
**字重阶梯规则。** 层级靠 650/600/400 的字重与尺寸差表达，禁止用颜色深浅以外的花招制造层级。

## Layout

居中单栏：阅读列 `--w-col` 42rem，宽容器 `--w-wide` 56rem（搜索、首页区块头）；页面左右 padding 1.25rem。垂直节奏"标题上方留白大于下方"（prose h2 上边距 2.25em，h3 2em）。响应式：≤640px 收紧页头（站名即首页入口、隐藏"首页"导航项、标题超宽省略号）；≥80rem 文章页右侧浮出 15rem 宽目录栏（绝对定位于阅读列右外侧，不挤占正文）。

## Elevation & Depth

无阴影系统。层次由三层表达：1px 发丝线（容器边界）、悬停底色（可交互暗示）、`backdrop-filter` 磨砂（仅限吸顶页头一处）。`--shadow-pop` 令牌已定义但当前无消费者——新增弹层/下拉前不得启用。

### Named Rules
**发丝线规则。** 一切容器用 1px 边框划分，深度靠悬停底色表达；零偏移彩色光晕与宽软阴影不属于这个世界。

## Shapes

圆角三档：容器 12px（`--radius`）、小控件 8px（`--radius-sm`）、代码块 10px（EC 配置）、胶囊 999px（标签、hero 链接 pill）。图标语言统一为 24px 描边 SVG（stroke 2、圆头圆角），信息类图标（太阳/月亮/放大镜/RSS/邮箱/提示框）不允许用 emoji 或字符代替。

## Components

### 文章列表行（PostRow）
- **Shape:** 12px 圆角，hover 时 surface-2 底色
- **层级:** 元数据行（日期 · 时长，tabular-nums）→ 标题（1.0625rem/600，hover 变强调色）→ 两行截断摘要 → 标签胶囊
- **State:** hover 仅底色变化；标题颜色过渡 0.2s

### 标签胶囊（TagPill）
- **Style:** surface-2 底 + 次级文字色，胶囊圆角
- **State:** hover 底色转 accent-soft、文字转强调色

### 提示框（Callout）
- **Shape:** 12px 圆角、1px 边框的浮面卡片，标题行 = 描边图标 + 单字标签
- **Variants:** note/tip（tip 的边框与标题染强调色）；warning/caution 用琥珀（见琥珀例外规则）
- **State:** 无交互态

### 代码块（Expressive Code）
- **Shape:** 10px 圆角、1px 边框，标题栏显示文件名，右上角复制按钮
- **Theme:** vitesse-light / vitesse-dark，经 `themeCssSelector` 绑定站点 `data-theme`，随主题换肤
- **能力:** `ins/del/mark` 行高亮、语法配色、横向滚动

### 页头
- **Style:** 吸顶 + `backdrop-filter` 磨砂，滚动 >8px 后浮现底部发丝线
- **Contents:** 站名（粗体，hover 变强调色）· 文字导航（当前项 aria-current 加粗）· 搜索图标 · 主题切换图标
- **Mobile:** ≤640px 隐藏"首页"项，站名省略号截断

### 主题切换
- **Style:** 与搜索图标同尺寸的图标按钮（34px 网格居中）
- **Behavior:** View Transitions API 圆形揭示，从点击位置扩散（0.45s ease-out）；`prefers-reduced-motion` 下直接切换；切换后派发 `themechange` 事件驱动 Mermaid/giscus 重绘

## Do's and Don'ts

### Do:
- **Do** 所有颜色取自双主题令牌；新组件先定义 light/dark 两份值
- **Do** 图标使用统一的 24px 描边 SVG（stroke-width 2、圆头）
- **Do** 元数据数字使用 `font-variant-numeric: tabular-nums`
- **Do** 动效只用 0.2–0.45s 的 ease 过渡，且必须尊重 `prefers-reduced-motion`
- **Do** 日期格式保持 `YYYY-MM-DD`（locale 中立、等宽对齐）

### Don't:
- **Don't** 使用阴影制造层次（弹层组件出现前 `--shadow-pop` 不得启用）
- **Don't** 引入第二强调色；琥珀仅限 warning/caution 提示框
- **Don't** 用 emoji 或 Unicode 字符充当图标
- **Don't** 在强调色之外使用渐变、玻璃拟态、纹理贴图
- **Don't** 让 JS 异步决定首帧主题（内联脚本必须在 CSS 生效前写入 `data-theme`）
