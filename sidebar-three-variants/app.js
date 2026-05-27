/**
 * G-Builder OS V1.0 · 侧边栏三版方案 · 入口脚本
 *
 * 同一份脚本同时驱动 4 个页面：
 *   - index.html             → body[data-page="entry"]      渲染三张方案卡
 *   - variant-default.html   → body[data-page="sidebar"][data-variant="default"]
 *   - variant-grouped.html   → body[data-page="sidebar"][data-variant="grouped"]
 *   - variant-text.html      → body[data-page="sidebar"][data-variant="text"]
 *
 * 渲染数据来源严格对齐 XMind G-Builder OS V1.0 脑图（mock-data.js）。
 */

import { navTree, iconPaths, variantMeta } from './mock-data.js';

/* ============================================================
 * SVG 渲染工具
 * ============================================================ */

function iconSvg(name) {
  const path = iconPaths[name];
  if (!path) {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/></svg>';
  }
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${path}"/></svg>`;
}

function chevronDownSvg() {
  return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="6 9 12 15 18 9"/></svg>';
}

function arrowRightSvg() {
  return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="9 6 15 12 9 18"/></svg>';
}

function arrowLeftSvg() {
  return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="15 18 9 12 15 6"/></svg>';
}

/* ============================================================
 * 通用：根据 active id 在 navTree 中查找 label / 一级祖先
 * ============================================================ */

function findNodeById(id) {
  if (id === navTree.primary.id) {
    return { node: navTree.primary, parent: null };
  }
  for (const it of navTree.items) {
    if (it.id === id) return { node: it, parent: null };
    if (it.children) {
      for (const c of it.children) {
        if (c.id === id) return { node: c, parent: it };
      }
    }
  }
  return { node: null, parent: null };
}

/* ============================================================
 * 入口页（index.html）渲染
 * ============================================================ */

function mountEntryPage() {
  const root = document.querySelector('[data-role="entry-cards"]');
  if (!root) return;
  root.innerHTML = variantMeta.map(renderEntryCard).join('');
}

function renderEntryCard(meta) {
  return `
    <a class="entry-card" href="${meta.href}" data-variant="${meta.id}">
      <span class="entry-card__index">${meta.index}</span>
      <h2 class="entry-card__title">${meta.title}</h2>
      <p class="entry-card__subtitle">${meta.subtitle}</p>
      <ul class="entry-card__highlights">
        ${meta.highlights.map((h) => `<li>${h}</li>`).join('')}
      </ul>
      <span class="entry-card__cta">
        进入预览
        ${arrowRightSvg()}
      </span>
    </a>
  `;
}

/* ============================================================
 * Sidebar 页（variant-*.html）渲染
 * ============================================================ */

const state = {
  activeId: navTree.meta.defaultActiveId,
  collapsedGroupIds: new Set(),
  variant: 'default',
};

function mountSidebarPage() {
  const body = document.body;
  state.variant = body.dataset.variant || 'default';

  // grouped 变体：分组型一级降为分组标题、永远展开、不可折叠
  // text / default 变体：分组始终展开（无折叠态）
  // 任一变体都不需要预填 collapsedGroupIds

  renderShell();
  bindEvents();
}

function renderShell() {
  const sidebarHost = document.querySelector('[data-role="sidebar-host"]');
  const crumbHost = document.querySelector('[data-role="crumb-now"]');
  if (sidebarHost) sidebarHost.innerHTML = renderSidebar();
  if (crumbHost) crumbHost.textContent = getActiveLabel();
}

function renderSidebar() {
  const { logo, primary, items } = navTree;

  return `
    <aside class="sidebar sidebar--${state.variant}" data-role="sidebar" data-variant="${state.variant}">
      <div class="sidebar__logo">
        <span class="sidebar__logo-mark">${iconSvg(logo.icon)}</span>
        <div class="sidebar__logo-text">
          <span class="sidebar__logo-title">${logo.title}</span>
          <span class="sidebar__logo-sub">${logo.subtitle}</span>
        </div>
      </div>

      <div class="sidebar__body">
        ${renderPrimary(primary)}
        <div class="sidebar__divider" aria-hidden="true"></div>
        ${items.map(renderL1).join('')}
      </div>

      <div class="sidebar__footer">
        <span class="sidebar__footer-avatar">PM</span>
        <span class="sidebar__footer-text">
          <span class="sidebar__footer-name">王启明</span>
          <span class="sidebar__footer-role">PM · 海外项目部</span>
        </span>
      </div>
    </aside>
  `;
}

function renderPrimary(primary) {
  const isActive = state.activeId === primary.id;
  return `
    <button
      type="button"
      class="sidebar__primary ${isActive ? 'is-active' : ''}"
      data-role="nav-item"
      data-item-id="${primary.id}"
      data-level="1"
      data-type="leaf"
    >
      <span class="sidebar__primary-icon">${iconSvg(primary.icon)}</span>
      <span class="sidebar__primary-text">
        <span class="sidebar__primary-label">${primary.label}</span>
        <span class="sidebar__primary-desc">${primary.description}</span>
      </span>
      <span class="sidebar__primary-arrow">${arrowRightSvg()}</span>
    </button>
  `;
}

function renderL1(item) {
  if (item.type === 'leaf') {
    const isActive = state.activeId === item.id;
    return `
      <button
        type="button"
        class="nav-item nav-item--l1 ${isActive ? 'nav-item--active' : ''}"
        data-role="nav-item"
        data-item-id="${item.id}"
        data-level="1"
        data-type="leaf"
      >
        <span class="nav-item__icon">${iconSvg(item.icon)}</span>
        <span class="nav-item__label">${item.label}</span>
      </button>
    `;
  }

  // group 类型
  const collapsed = state.collapsedGroupIds.has(item.id);
  const hasActiveChild = item.children.some((c) => c.id === state.activeId);

  return `
    <section class="nav-group ${collapsed ? 'is-collapsed' : ''}" data-group-id="${item.id}">
      <button
        type="button"
        class="nav-item nav-item--l1 ${hasActiveChild && collapsed ? 'nav-item--active' : ''}"
        data-role="nav-item"
        data-item-id="${item.id}"
        data-level="1"
        data-type="group"
      >
        <span class="nav-item__icon">${iconSvg(item.icon)}</span>
        <span class="nav-item__label">${item.label}</span>
        <span class="nav-item__chev">${chevronDownSvg()}</span>
      </button>
      <div class="nav-group__items">
        ${item.children.map(renderL2).join('')}
      </div>
    </section>
  `;
}

function renderL2(child) {
  const isActive = state.activeId === child.id;
  return `
    <button
      type="button"
      class="nav-item nav-item--l2 ${isActive ? 'nav-item--active' : ''}"
      data-role="nav-item"
      data-item-id="${child.id}"
      data-level="2"
      data-type="leaf"
    >
      <span class="nav-item__label">${child.label}</span>
    </button>
  `;
}

/* ============================================================
 * 事件绑定（sidebar 页）
 * ============================================================ */

function bindEvents() {
  const host = document.querySelector('[data-role="sidebar-host"]');
  if (!host) return;

  host.addEventListener('click', (ev) => {
    const target = ev.target.closest('[data-role="nav-item"]');
    if (!target) return;

    const id = target.dataset.itemId;
    const level = target.dataset.level;
    const type = target.dataset.type;

    // grouped 变体：分组型一级降为不可点击的分组标题（CSS pointer-events: none 已拦截，此处冗余保险）
    if (state.variant === 'grouped' && level === '1' && type === 'group') {
      return;
    }

    // 其余情况：切换 active
    setActive(id);
  });
}

function setActive(id) {
  state.activeId = id;
  renderShell();
}

function getActiveLabel() {
  const { node } = findNodeById(state.activeId);
  return node ? node.label : '工作台';
}

/* ============================================================
 * 启动分发
 * ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  const page = document.body.dataset.page;
  if (page === 'entry') {
    mountEntryPage();
  } else if (page === 'sidebar') {
    mountSidebarPage();
  }
});
