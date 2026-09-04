# Surface Brief: 首页（及全站框架）

## Scope & Visitor Mode

- Scope：全站框架（页头/页脚/主题系统）+ 首页（hero、最近文章列表）
- Visitor mode：**Read**——访客带着具体问题到达，需要快速判断"值不值得读"，然后顺畅读完

## Audience / Job / Action / Proof

- 受众：中文互联网的开发者与计算机专业学生（桌面为主，移动端来自分享链接）
- Job：10 秒内知道作者是谁、写什么方向；找到最新文章入口；订阅或收藏
- Action：点进文章（主）、RSS 订阅、GitHub 关注
- Proof：真实文章列表（标题/日期/标签/阅读时长），无任何虚构运营数据

## Constraints

- 深浅双主题（跟随系统 + 手动切换 + View Transitions 圆形揭示），无首屏闪烁
- 视觉方向：用户明确选择"类目标准"，工艺基准 antfu.me（克制、近单色 + 单一紫罗兰强调色、系统字栈 + JetBrains Mono）
- 代码/图表/公式是内容一等公民，但界面本身保持安静

## Chosen Direction & Memorable Moment

- 方向：经典居中单栏博客（FORM: canon，用户决策页主动选择）
- Memorable moment：主题切换的圆形揭示动画（从按钮位置扩散），以及 vitesse 双主题代码块与站点主题的联动

## Unresolved Decisions

- 正式站名/作者名（占位 XBS，集中在 src/config.ts）
- giscus 仓库配置（占位，评论位显示配置引导）
- 部署域名（astro.config.mjs 的 site）
