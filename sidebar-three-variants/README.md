# G-Builder OS · 侧边栏交互三版方案 demo

> 来源：[scrm-2-prd](../) · 内置 demo · 用于评审 G-Builder OS V1.0 侧边栏的三种交互形态。

## 在线访问

- 入口（三版方案对比）：<https://bananaco123.github.io/scrm-2-prd/sidebar-three-variants/>
- 方案 A · 默认全展开：<https://bananaco123.github.io/scrm-2-prd/sidebar-three-variants/variant-default.html>
- 方案 B · 分组标题次级化：<https://bananaco123.github.io/scrm-2-prd/sidebar-three-variants/variant-grouped.html>
- 方案 C · 纯文字无图标：<https://bananaco123.github.io/scrm-2-prd/sidebar-three-variants/variant-text.html>

## 内容来源

严格对齐 G-Builder OS V1.0 XMind 脑图，共 7 个一级、8 个二级节点：

| 一级（类型） | 二级 |
|---|---|
| 工作台（叶子 · 顶部独立卡片） | — |
| SCRM 销售工作台（叶子） | — |
| 会话管理（分组） | 线索分配 / 转人工 |
| Agent（分组） | AI 业务员 / AI 销冠 |
| 数据看板（分组） | PM 看板 / 部门看板 |
| 数字资产（分组） | 知识库 / 转人工 |
| 设置（叶子） | — |

XMind 节点上的圆圈数字（功能点数量）为开发评审标注，不参与设计。

## 三版差异

| 方案 | 一级菜单形态 | 二级菜单形态 | 折叠行为 |
|---|---|---|---|
| A · 默认全展开 | 14px 带图标，分组型一级带 chevron | 缩进 + 左侧 tree line | 永远展开 |
| B · 分组标题次级化 | **分组型一级降为 11px 灰色大写小标题**，叶子型一级保留 14px 图标 | 升为 14px 主导航项 | 永远展开，不可折叠 |
| C · 纯文字无图标 | 14px 无图标 + 字重 / 颜色表达层级 | 13px 缩进 + 左侧 tree line | 永远展开 |

## 视觉规范

- 主色 `#1A4D8F`（GB 深科技蓝）
- 卡片圆角 `rounded-xl` 12px
- 字体栈 `PingFang SC, Microsoft YaHei, Segoe UI, Inter`
- Sidebar 宽度 256px / TopBar 高度 56px
- 完整规范见：`skills/Web Coding/references/GB营销平台OS-UI规范.md`

## 工程结构

```
sidebar-three-variants/
├── index.html              # 入口卡片页（方案对比）
├── variant-default.html    # 方案 A
├── variant-grouped.html    # 方案 B
├── variant-text.html       # 方案 C
├── app.js                  # ES Module · 渲染 + 交互
├── styles.css              # 视觉变量 + 三版差异化样式
├── mock-data.js            # apiContract + enums + navTree
└── components/
    └── sidebar.html         # UI 设计师独立编辑副本
```
