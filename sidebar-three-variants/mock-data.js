/**
 * G-Builder OS V1.0 · 侧边栏交互三版方案 · Mock 数据 + 接口契约
 *
 * 内容来源严格对齐 V1.0 脑图（XMind）：
 *   - 工作台                        ← 叶子型一级（顶部独立入口）
 *   - SCRM 销售工作台                ← 叶子型一级
 *   - 会话管理 → 线索分配 / 转人工      ← 分组型一级
 *   - Agent → AI 业务员 / AI 销冠      ← 分组型一级
 *   - 数据看板 → PM 看板 / 部门看板    ← 分组型一级
 *   - 数字资产 → 知识库 / 转人工        ← 分组型一级
 *   - 设置                          ← 叶子型一级
 *
 * 注意：XMind 节点上的圆圈数字（4 / 10 / 3 / 1 / 30）是开发评审的功能点数量
 *      标注，不参与设计，不渲染为侧边栏徽章 / 数字角标。
 */

export const apiContract = {
  /** 拉取当前用户可见的侧边栏导航树 */
  getSidebar: {
    method: 'GET',
    url: '/api/v1/os/navigation/sidebar',
    query: {
      userId: 'string · 当前用户 ID（从 session 取）',
      version: 'string · 客户端版本号',
    },
    response: {
      logo: 'LogoConfig',
      primary: 'NavLeaf · 工作台一级独立入口',
      items: 'NavNode[] · 其余 6 个一级节点',
      meta: '{ defaultActiveId: string }',
    },
  },

  /** 上报用户点击导航项 */
  reportClick: {
    method: 'POST',
    url: '/api/v1/os/navigation/click',
    body: {
      itemId: 'string',
      level: 'integer · 1 | 2',
      variant: 'NavVariant',
      timestamp: 'number',
    },
    response: { ok: 'boolean' },
  },

  /** 保存用户偏好（折叠分组列表、当前选用的交互形态） */
  savePreference: {
    method: 'PUT',
    url: '/api/v1/os/navigation/preference',
    body: {
      variant: 'NavVariant',
      collapsedGroupIds: 'string[]',
    },
    response: { ok: 'boolean' },
  },
};

export const enums = {
  /** 三种侧边栏交互形态 */
  navVariant: [
    { value: 'default', label: '默认全展开' },
    { value: 'grouped', label: '分组标题次级化' },
    { value: 'text', label: '纯文字无图标' },
  ],

  /** 一级节点类型 */
  nodeType: [
    { value: 'leaf', label: '叶子型一级 · 点击直接进入' },
    { value: 'group', label: '分组型一级 · 展开二级菜单' },
  ],
};

/** SVG 图标路径（Lucide 风格，stroke 1.75）— 仅 default / grouped 两版使用 */
export const iconPaths = {
  home: 'M3 11.5 12 4l9 7.5M5 10v9a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1v-9',
  message: 'M21 12a8.5 8.5 0 0 1-12.8 7.4L3 21l1.6-5.2A8.5 8.5 0 1 1 21 12z',
  conversation:
    'M14 9V5a3 3 0 0 0-3-3H4.5A2.5 2.5 0 0 0 2 4.5v10A2.5 2.5 0 0 0 4.5 17H7l2.5 3 2.5-3h2a3 3 0 0 0 3-3M8 7h3M8 11h3M20 22v-3a3 3 0 0 0-3-3h-2a3 3 0 0 0-3 3v3',
  sparkles:
    'M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1M12 8l1.5 2.5L16 12l-2.5 1.5L12 16l-1.5-2.5L8 12l2.5-1.5z',
  barChart: 'M4 19V10M10 19V4M16 19v-7M22 19H2',
  wallet:
    'M3 7a2 2 0 0 1 2-2h13a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7zM3 10h18M16 14h2',
  settings:
    'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm7.4-3a7.4 7.4 0 0 0-.1-1.3l2-1.6-2-3.5-2.4 1a7.4 7.4 0 0 0-2.2-1.3L14.4 3h-4l-.3 2.3a7.4 7.4 0 0 0-2.2 1.3l-2.4-1-2 3.5 2 1.6c-.1.5-.1.9-.1 1.3s0 .8.1 1.3l-2 1.6 2 3.5 2.4-1c.7.5 1.4.9 2.2 1.3l.3 2.3h4l.3-2.3c.8-.4 1.5-.8 2.2-1.3l2.4 1 2-3.5-2-1.6c.1-.5.1-.9.1-1.3z',
};

/** 完整侧边栏导航配置（严格对齐 G-Builder OS V1.0 脑图） */
export const navTree = {
  logo: {
    icon: 'home',
    title: 'G-Builder OS',
    subtitle: 'G-BUILDER OS · V1.0',
  },

  /** 工作台 = 顶部独立一级入口（与下方菜单视觉分离） */
  primary: {
    id: 'workbench',
    label: '工作台',
    icon: 'home',
    type: 'leaf',
    description: '日常入口 · 个人任务台',
  },

  /** 其余 6 个一级节点（按 XMind 顺序） */
  items: [
    {
      id: 'scrm-workbench',
      label: 'SCRM 销售工作台',
      icon: 'message',
      type: 'leaf',
    },
    {
      id: 'conversation',
      label: '会话管理',
      icon: 'conversation',
      type: 'group',
      children: [
        { id: 'conversation/lead-dispatch', label: '线索分配' },
        { id: 'conversation/human-handoff', label: '转人工' },
      ],
    },
    {
      id: 'agent',
      label: 'Agent',
      icon: 'sparkles',
      type: 'group',
      children: [
        { id: 'agent/ai-sales', label: 'AI 业务员' },
        { id: 'agent/ai-champion', label: 'AI 销冠' },
      ],
    },
    {
      id: 'dashboard',
      label: '数据看板',
      icon: 'barChart',
      type: 'group',
      children: [
        { id: 'dashboard/pm', label: 'PM 看板' },
        { id: 'dashboard/department', label: '部门看板' },
      ],
    },
    {
      id: 'digital-assets',
      label: '数字资产',
      icon: 'wallet',
      type: 'group',
      children: [
        { id: 'digital-assets/knowledge-base', label: '知识库' },
        { id: 'digital-assets/human-handoff', label: '转人工' },
      ],
    },
    {
      id: 'settings',
      label: '设置',
      icon: 'settings',
      type: 'leaf',
    },
  ],

  meta: {
    /** 默认选中的二级节点（用于演示 active 态） */
    defaultActiveId: 'dashboard/pm',
  },
};

/** 三个变体的元数据（入口页卡片 + 各 sidebar 页底部说明都用这份数据） */
export const variantMeta = [
  {
    id: 'default',
    index: 'A',
    title: '默认全展开',
    subtitle: '所有分组型一级默认展开二级',
    href: 'variant-default.html',
    highlights: [
      '分组型一级默认展开二级，叶子型一级直接点击进入',
      '展开 / 折叠的 chevron 仅在分组型一级出现',
      '一级带图标 + 文字，二级用缩进 + 左竖线表达层级',
    ],
  },
  {
    id: 'grouped',
    index: 'B',
    title: '分组标题次级化',
    subtitle: '一级字号更小，处于次级标题位置，永远展开不可折叠',
    href: 'variant-grouped.html',
    highlights: [
      '分组型一级（会话管理 / Agent / 数据看板 / 数字资产）降为小灰大写标题，不可点击',
      '二级菜单升为主导航项，承担实际跳转能力',
      '叶子型一级（工作台 / SCRM 销售工作台 / 设置）保留独立一级地位',
    ],
  },
  {
    id: 'text',
    index: 'C',
    title: '纯文字无图标',
    subtitle: '极简文字稿 · 用缩进与字重表达层级',
    href: 'variant-text.html',
    highlights: [
      '完全去掉图标，仅靠字号 / 字重 / 颜色 / 缩进表达',
      '一级 14px medium，二级 13px regular + 左侧 1px 引导线',
      '适合追求克制阅读体验的内部工具型场景',
    ],
  },
];
