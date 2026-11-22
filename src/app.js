/* Zhiyu Study Camp — UI and interaction layer. */

"use strict";

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

const ICONS = {
  home: '<path d="M3 11l9-8 9 8"/><path d="M5 10v10h14V10M9 20v-6h6v6"/>',
  cards: '<rect x="5" y="4" width="14" height="17" rx="2"/><path d="M8 1h11a2 2 0 012 2v14M9 9h6M9 13h6M9 17h4"/>',
  calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01"/>',
  gift: '<rect x="3" y="8" width="18" height="13" rx="2"/><path d="M12 8v13M3 12h18M7.5 8C5 8 4 6.8 4 5.5S5 3 6.5 3C9 3 12 8 12 8M16.5 8C19 8 20 6.8 20 5.5S19 3 17.5 3C15 3 12 8 12 8"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c0-5 3-7 8-7s8 2 8 7"/>',
  flame: '<path d="M12 22c4 0 7-3 7-7 0-5-4-7-5-12-3 3-3 6-2 9-2-2-3-4-3-6-3 3-4 6-4 9 0 4 3 7 7 7z"/><path d="M12 22c-2 0-3-2-3-4 0-2 2-3 3-6 2 3 3 4 3 6 0 2-1 4-3 4z"/>',
  spark: '<path d="M12 2l2.6 7.4L22 12l-7.4 2.6L12 22l-2.6-7.4L2 12l7.4-2.6L12 2z"/>',
  coin: '<circle cx="12" cy="12" r="9"/><path d="M8 8c2 3 6 3 8 0M8 16c2-3 6-3 8 0M12 7v10"/>',
  check: '<path d="M5 12l4 4L19 6"/>',
  arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  shuffle: '<path d="M16 3h5v5M4 20L21 3M21 16v5h-5M15 15l6 6M4 4l5 5"/>',
  left: '<path d="M15 18l-6-6 6-6"/>',
  right: '<path d="M9 18l6-6-6-6"/>',
  close: '<path d="M6 6l12 12M18 6L6 18"/>',
  download: '<path d="M12 3v12M7 10l5 5 5-5M4 21h16"/>',
  upload: '<path d="M12 17V5M7 10l5-5 5 5M4 21h16"/>',
  trophy: '<path d="M8 4h8v5c0 4-2 6-4 6s-4-2-4-6V4zM8 6H4v2c0 3 2 4 5 4M16 6h4v2c0 3-2 4-5 4M12 15v4M8 21h8M9 19h6"/>',
  book: '<path d="M3 5c4-2 7-1 9 1v15c-2-2-5-3-9-1V5zM21 5c-4-2-7-1-9 1v15c2-2 5-3 9-1V5z"/>',
  leaf: '<path d="M20 4C10 4 4 9 4 16c0 3 2 5 5 5 8 0 11-8 11-17z"/><path d="M4 21c3-6 7-9 12-12"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5L19 19M19 5l-1.5 1.5M6.5 17.5L5 19"/>',
  moon: '<path d="M20 15c-7 2-12-3-10-10-5 2-7 8-4 13 3 4 10 4 14-3z"/>',
  cat: '<path d="M5 9L4 3l6 4h4l6-4-1 6c1 2 1 5 0 7-2 4-12 4-14 0-1-2-1-5 0-7z"/><path d="M8 13h.01M16 13h.01M10 17c1 1 3 1 4 0"/>',
  coffee: '<path d="M4 8h13v7c0 4-3 6-6 6s-7-2-7-6V8zM17 10h2c3 0 3 5 0 5h-2M7 3v2M11 3v2M15 3v2"/>',
  shield: '<path d="M12 3l8 3v6c0 5-3 8-8 10-5-2-8-5-8-10V6l8-3z"/><path d="M8 12l3 3 5-6"/>',
  frame: '<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="5"/><path d="M12 1v3M12 20v3M1 12h3M20 12h3M4 4l2 2M18 18l2 2M20 4l-2 2M6 18l-2 2"/>',
  feather: '<path d="M20 4c-7-2-14 4-14 10 0 3 2 5 5 5 7 0 10-9 9-15z"/><path d="M3 21L16 8M8 16h7M11 12V7"/>',
  refresh: '<path d="M20 6v5h-5M4 18v-5h5"/><path d="M6.1 9a7 7 0 0111.4-2.2L20 11M4 13l2.5 4.2A7 7 0 0017.9 15"/>',
};

function icon(name) {
  return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (ICONS[name] || ICONS.spark) + '</svg>';
}

function hydrateIcons(root = document) {
  $$('[data-icon]', root).forEach((element) => {
    element.innerHTML = icon(element.dataset.icon);
    element.style.display = 'contents';
  });
}

const { SUBJECTS, ACHIEVEMENTS, REWARDS } = ZYData;
const engine = ZYEngine.createEngine({
  achievements: ACHIEVEMENTS,
  rewards: REWARDS,
  levelNames: ZYData.LEVEL_NAMES,
  subjects: ZYData.REVIEW_SUBJECTS,
});
const store = ZYStorage.createStore(window.localStorage);
const today = () => ZYEngine.dayKey();
const dayOffset = (base, amount) => ZYEngine.addDays(base, amount);

let accounts = store.accounts();
let session = store.session();
let currentUser = session && accounts.some((account) => account.id === session) ? session : null;
let state = engine.normalize(store.loadProgress(currentUser));

let currentPage = 'dashboard';
let calendarCursor = new Date();
let confirmCallback = null;

const library = {
  tree: [],
  documents: new Map(),
  total: 0,
  ignored: 0,
  source: 'none',
  sourceName: '',
};
let expandedNodes = new Set();
let pendingDirectoryHandle = null;
let activeDocument = null;
let activeDocumentUrl = null;
let activeDocumentCompleted = false;
let activeReaderToken = null;
let readerTimer = null;
let readerStartedAt = 0;
let readerPeak = 0;

function save() {
  if (!store.saveProgress(currentUser, state)) {
    toast('保存失败', '浏览器存储空间可能不足，请先导出备份。');
  }
}

function formatDate(iso) {
  if (!iso) return '尚未读完';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '尚未读完';
  if (iso.slice(0, 10) === today()) {
    return `今天 ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
  }
  return `${date.getMonth() + 1}月${date.getDate()}日`;
}

function humanSize(bytes) {
  if (!bytes) return '';
  return bytes > 1048576 ? `${(bytes / 1048576).toFixed(1)} MB` : `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

function metrics() {
  return engine.metrics(state);
}

function readCount() {
  return engine.metrics(state).uniqueDocuments;
}

function toast(title, text = '', type = '') {
  const stack = $('#toast-stack');
  while (stack.children.length >= 3) stack.firstElementChild.remove();
  const element = document.createElement('div');
  element.className = `toast ${type}`;
  element.innerHTML = `${icon(type === 'reward' ? 'trophy' : 'check')}<div><strong>${esc(title)}</strong>${text ? `<p>${esc(text)}</p>` : ''}</div>`;
  stack.appendChild(element);
  setTimeout(() => {
    element.classList.add('out');
    setTimeout(() => element.remove(), 350);
  }, 3200);
}

function applyEffects(result, { render = true } = {}) {
  const effects = Array.isArray(result) ? result : (result && result.effects) || [];
  const info = effects.filter((effect) => effect.kind === 'info');
  const majors = effects.filter((effect) => effect.kind !== 'info');
  if (info.length) {
    info.slice(0, 2).forEach((effect) => toast(effect.title, effect.text || ''));
  } else {
    const priority = { level: 0, achievement: 1, reward: 2 };
    [...majors]
      .sort((a, b) => (priority[a.kind] ?? 3) - (priority[b.kind] ?? 3))
      .slice(0, 3)
      .forEach((effect) => {
        const detail = effect.text || [
          effect.xp ? `+${effect.xp} XP` : '',
          effect.coins ? `${effect.coins > 0 ? '+' : ''}${effect.coins} 叶币` : '',
        ].filter(Boolean).join(' · ');
        toast(effect.title, detail, 'reward');
      });
  }
  if (majors.some((effect) => effect.kind === 'achievement' || effect.kind === 'level')) celebrate();
  if (render) {
    save();
    renderAll();
  }
}

function celebrate() {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const canvas = $('#celebration');
  const context = canvas.getContext('2d');
  const dpr = devicePixelRatio || 1;
  canvas.width = innerWidth * dpr;
  canvas.height = innerHeight * dpr;
  context.scale(dpr, dpr);
  const colors = ['#ffc107', '#df8748', '#2ee66b', '#62b8ff', '#b366ff'];
  const particles = Array.from({ length: 55 }, () => ({
    x: innerWidth * 0.5 + (Math.random() - 0.5) * 140,
    y: innerHeight * 0.25,
    vx: (Math.random() - 0.5) * 8,
    vy: -Math.random() * 6 - 2,
    g: 0.16 + Math.random() * 0.08,
    r: 2 + Math.random() * 4,
    c: colors[Math.floor(Math.random() * colors.length)],
    a: 1,
  }));
  let frame = 0;
  function draw() {
    context.clearRect(0, 0, innerWidth, innerHeight);
    particles.forEach((particle) => {
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.vy += particle.g;
      particle.a -= 0.011;
      context.globalAlpha = Math.max(0, particle.a);
      context.fillStyle = particle.c;
      context.save();
      context.translate(particle.x, particle.y);
      context.rotate(frame * 0.04 + particle.x);
      context.fillRect(-particle.r, -particle.r, particle.r * 2, particle.r);
      context.restore();
    });
    if (frame++ < 95) requestAnimationFrame(draw);
    else context.clearRect(0, 0, innerWidth, innerHeight);
  }
  draw();
}

function openModal(id) {
  $('#' + id).classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal(id) {
  $('#' + id).classList.remove('open');
  if (!$('.modal-backdrop.open')) document.body.style.overflow = '';
}

function confirmAction(title, text, button, callback) {
  $('#confirm-title').textContent = title;
  $('#confirm-text').textContent = text;
  $('#confirm-action').textContent = button;
  confirmCallback = callback;
  openModal('confirm-modal');
}

function completeActions() {
  const result = engine.reconcile(state, { at: new Date() });
  applyEffects(result);
}

/* ── Local review library ─────────────────────────────────────────────── */

function setLibrarySource(title, status, mode) {
  $('#library-source-title').textContent = title || '资料库未连接';
  const badge = $('#library-source-status');
  badge.textContent = status;
  badge.classList.toggle('connected', mode === 'connected');
  library.source = mode;
  $('#pick-library').innerHTML = `${icon('upload')}${library.total ? '重新选择' : '连接资料库'}`;
  hydrateIcons($('#pick-library'));
}

function indexRecords(records, sourceName, mode = 'session') {
  const built = ZYLibrary.buildLibrary(records, ZYData.REVIEW_SUBJECTS);
  if (!built.total) {
    toast('没有找到复习资料', '请选择包含「语文 / 数学 / 物理 / 化学 / 生物」文件夹的上级目录。');
    return false;
  }
  library.tree = built.tree;
  library.documents = built.documents;
  library.total = built.total;
  library.ignored = built.ignored;
  library.sourceName = sourceName || '本机复习资料';
  expandedNodes = new Set(built.tree.map((subject) => subject.id));
  setLibrarySource(library.sourceName, `${built.total} 篇 · 已连接`, mode === 'persistent' ? 'connected' : 'session');
  $('#nav-library-count').textContent = String(built.total);
  renderLibrary();
  renderAll();
  toast('复习目录已建立', `已载入 ${built.total} 篇资料。只有从头读到尾才会记为读完。`);
  return true;
}

async function useDirectoryHandle(handle, requestPermission = false) {
  const permission = await ZYContentSource.handlePermission(handle, requestPermission);
  if (permission !== 'granted') {
    if (requestPermission) {
      pendingDirectoryHandle = null;
      setLibrarySource('资料库未连接', '未授权', 'none');
      toast('没有获得目录读取权限', '可以再次点击“连接资料库”选择其他文件夹。');
      return;
    }
    pendingDirectoryHandle = handle;
    setLibrarySource(`上次资料库 · ${handle.name || '本机文件'}`, '等待授权', 'pending');
    toast('需要重新授权', '点击“重新选择”恢复上次资料库的读取权限。');
    return;
  }
  setLibrarySource(handle.name || '本机复习资料', '正在建立目录…', 'loading');
  try {
    const records = await ZYContentSource.scanDirectoryHandle(handle);
    indexRecords(records, handle.name || '本机复习资料', 'persistent');
    pendingDirectoryHandle = null;
  } catch (error) {
    setLibrarySource('资料库连接失败', '错误', 'none');
    toast('无法读取资料库', error.message || '请重新选择文件夹。');
  }
}

async function restoreSavedLibrary() {
  if (!ZYContentSource.supportsDirectoryPicker()) return;
  const handle = await ZYContentSource.restoreHandle();
  if (!handle) return;
  pendingDirectoryHandle = handle;
  const permission = await ZYContentSource.handlePermission(handle, false);
  if (permission === 'granted') {
    await useDirectoryHandle(handle, false);
  } else {
    setLibrarySource(`上次资料库 · ${handle.name || '本机文件'}`, '点击恢复', 'pending');
  }
}

async function chooseLibrary() {
  if (pendingDirectoryHandle) {
    await useDirectoryHandle(pendingDirectoryHandle, true);
    return;
  }
  if (ZYContentSource.supportsDirectoryPicker()) {
    try {
      const picked = await ZYContentSource.pickDirectory();
      indexRecords(picked.records, picked.handle.name || '本机复习资料', 'persistent');
    } catch (error) {
      if (error && error.name === 'AbortError') return;
      toast('无法连接资料库', error.message || '请改用文件夹导入。');
    }
    return;
  }
  $('#library-folder-input').click();
}

function importFolderFiles(fileList) {
  const records = ZYContentSource.recordsFromFileList(fileList);
  if (!records.length) {
    toast('没有找到 HTML 文件', '请选择一个包含五科复习资料的文件夹。');
    return;
  }
  if (indexRecords(records, '本次导入 · ' + (fileList[0]?.webkitRelativePath?.split('/')[0] || '本机资料'), 'session')) {
    toast('提示', '普通文件夹导入在刷新后需要重新选择；Chrome / Edge 可使用持久目录连接。');
  }
  $('#library-folder-input').value = '';
}

function treeProgressMap() {
  const map = {};
  Object.entries(state.documents).forEach(([path, entry]) => { map[path] = entry; });
  return map;
}

function filterTreeByStatus(tree, status) {
  function visit(node) {
    const documents = node.documents.filter((doc) => {
      const read = Number(state.documents[doc.path]?.reads) > 0;
      return status === 'read' ? read : !read;
    });
    const children = node.children.map(visit).filter(Boolean);
    if (!documents.length && !children.length) return null;
    return { ...node, documents, children, count: documents.length + children.reduce((sum, child) => sum + child.count, 0) };
  }
  return tree.map(visit).filter(Boolean);
}

function renderLibrary() {
  const query = $('#library-search')?.value || '';
  const status = $('#read-filter')?.value || 'all';
  if (!library.total) {
    $('#library-count').textContent = '0 篇';
    $('#library-progress-label').textContent = '0 已读完';
    return;
  }
  let tree = query ? ZYLibrary.filterLibrary(library, query).tree : library.tree;
  if (status !== 'all') tree = filterTreeByStatus(tree, status);
  const totalVisible = tree.reduce((sum, subject) => sum + subject.count, 0);
  $('#library-count').textContent = `${totalVisible} 篇`;
  $('#library-progress-label').textContent = `${readCount()} 已读完`;
  const shouldOpenAll = Boolean(query);
  function renderNode(node, depth) {
    if (node.type === 'folder' || node.type === 'subject') {
      const nodeOpen = shouldOpenAll || expandedNodes.has(node.id);
      const documents = node.documents.map((doc) => {
        const entry = state.documents[doc.path];
        const isRead = Number(entry?.reads) > 0;
        const isCurrent = activeDocument?.path === doc.path;
        return `<button class="tree-doc ${isCurrent ? 'current' : ''}" data-doc-path="${esc(doc.path)}" style="--depth:${depth + 1}" title="${esc(doc.title)} · ${doc.badge}${entry?.reads ? ` · 已读 ${entry.reads} 次` : ''}"><span class="doc-dot ${isRead ? 'read' : ''}"></span><span class="tree-doc-title">${esc(doc.title)}</span><span class="tree-doc-badge">${esc(doc.badge)}</span></button>`;
      }).join('');
      const children = node.children.map((child) => renderNode(child, depth + 1)).join('');
      return `<details class="tree-group" data-node-id="${esc(node.id)}" ${nodeOpen ? 'open' : ''}><summary class="tree-group-summary" style="--depth:${depth}"><span class="tree-caret"></span><span class="tree-folder-icon"></span><span class="tree-group-name">${esc(node.name)}</span><span class="tree-group-count">${node.count}</span></summary><div class="tree-docs">${documents}${children}</div></details>`;
    }
    return '';
  }
  const html = tree.map((subject) => renderNode(subject, 0)).join('');
  $('#library-tree').innerHTML = html || `<div class="library-empty-tree"><strong>没有符合条件的篇目</strong><p>换一个关键词，或把筛选切回“全部篇目”。</p></div>`;
}

function findDocument(path) {
  return library.documents.get(path) || state.documents[path] || null;
}

async function openDocument(path) {
  const doc = findDocument(path);
  if (!doc) {
    toast('没有找到这篇资料', '请重新连接资料库后再试。');
    return;
  }
  if (!doc.file && !doc.handle) {
    toast('资料文件不可用', '请重新连接资料库，或重新选择文件夹。');
    return;
  }
  stopReaderTracking();
  if (activeDocumentUrl) URL.revokeObjectURL(activeDocumentUrl);
  activeDocumentUrl = null;
  activeDocument = doc;
  activeDocumentCompleted = false;
  activeReaderToken = globalThis.crypto?.randomUUID ? crypto.randomUUID() : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
  readerPeak = 0;
  const opened = engine.openDocument(state, {
    documentId: doc.path,
    title: doc.title,
    subject: doc.subject,
    at: new Date(),
  });
  save();
  $('#reader-empty').classList.add('hidden');
  $('#reader-active').classList.remove('hidden');
  $('.library-shell').classList.add('reading');
  $('#page-library').classList.add('reader-mode');
  $('#reader-breadcrumb').textContent = `${doc.subject}${doc.folderLabel ? ' / ' + doc.folderLabel : ''}`;
  $('#reader-title').textContent = doc.title;
  const previousReads = Number(state.documents[doc.path]?.reads) || 0;
  $('#reader-read-count').textContent = previousReads ? `已通读 ${previousReads} 次` : '未读完';
  $('#reader-read-count').classList.toggle('done', previousReads > 0);
  $('#reader-progress-fill').style.width = '0%';
  $('#reader-progress-text').textContent = '…';
  $('#reader-hint').textContent = '正在载入完整原文…';
  $('#reader-hint').classList.remove('done');
  $('#reader-blocked').classList.add('hidden');
  renderLibrary();

  try {
    const source = await ZYContentSource.readHtml(doc, { token: activeReaderToken });
    activeDocumentUrl = source.url;
    const frame = $('#reader-frame');
    frame.onload = () => {
      readerStartedAt = Date.now();
      const reads = Number(state.documents[doc.path]?.reads) || 0;
      $('#reader-hint').textContent = reads
        ? '重读会累计通读次数，但同一篇不会重复发放首次奖励。'
        : '从原文顶部开始，滚动到最后会自动记为读完。';
      $('#reader-progress-text').textContent = '0%';
      startReaderWatchdog();
    };
    frame.src = source.url;
    opened.effects.length && applyEffects(opened);
  } catch (error) {
    $('#reader-blocked').classList.remove('hidden');
    toast('无法打开资料', error.message || '请重新连接资料库。');
  }
}

function startReaderWatchdog() {
  if (readerTimer) clearTimeout(readerTimer);
  readerTimer = setTimeout(() => {
    if (!activeDocument || activeDocumentCompleted) return;
    $('#reader-blocked').classList.remove('hidden');
    $('#reader-hint').textContent = '没有收到滚动进度。请确认资料页面允许脚本运行。';
  }, 4500);
}

function handleReaderMessage(event) {
  if (!activeDocument || activeDocumentCompleted) return;
  if (event.source !== $('#reader-frame').contentWindow) return;
  const payload = event.data;
  if (!payload || payload.source !== 'zhiyu-reader' || payload.type !== 'progress') return;
  if (payload.token !== activeReaderToken) return;
  if (readerTimer) {
    clearTimeout(readerTimer);
    readerTimer = null;
  }
  $('#reader-blocked').classList.add('hidden');
  const ratio = Math.max(0, Math.min(1, Number(payload.ratio) || 0));
  const percent = Math.round(ratio * 100);
  readerPeak = Math.max(readerPeak, percent);
  $('#reader-progress-fill').style.width = `${percent}%`;
  $('#reader-progress-text').textContent = `${percent}%`;
  const noScrollRequired = payload.canScroll === false;
  const waitedEnough = Date.now() - readerStartedAt > (noScrollRequired ? 2800 : 900);
  if (waitedEnough && (ratio >= 0.985 || readerPeak >= 99)) {
    completeActiveDocument();
  }
}

function stopReaderTracking() {
  if (readerTimer) clearTimeout(readerTimer);
  readerTimer = null;
}

function completeActiveDocument() {
  if (!activeDocument || activeDocumentCompleted) return;
  activeDocumentCompleted = true;
  stopReaderTracking();
  $('#reader-progress-fill').style.width = '100%';
  $('#reader-progress-text').textContent = '100%';
  $('#reader-hint').textContent = '已从顶部读到最后，本次通读已记录。';
  $('#reader-hint').classList.add('done');
  const result = engine.completeDocument(state, {
    documentId: activeDocument.path,
    title: activeDocument.title,
    subject: activeDocument.subject,
    at: new Date(),
  });
  applyEffects(result);
  const reads = Number(state.documents[activeDocument.path]?.reads) || 1;
  $('#reader-read-count').textContent = `已通读 ${reads} 次`;
  $('#reader-read-count').classList.add('done');
  renderLibrary();
  celebrate();
}

function closeReader() {
  stopReaderTracking();
  if (activeDocumentUrl) URL.revokeObjectURL(activeDocumentUrl);
  activeDocumentUrl = null;
  activeDocument = null;
  activeDocumentCompleted = false;
  activeReaderToken = null;
  $('#reader-frame').onload = null;
  $('#reader-frame').src = 'about:blank';
  $('#reader-active').classList.add('hidden');
  $('#reader-empty').classList.remove('hidden');
  $('.library-shell').classList.remove('reading');
  $('#page-library').classList.remove('reader-mode');
  renderLibrary();
}

function randomDocument() {
  if (!library.total) {
    chooseLibrary();
    return;
  }
  const unread = [...library.documents.values()].filter((doc) => !(Number(state.documents[doc.path]?.reads) > 0));
  const pool = unread.length ? unread : [...library.documents.values()];
  const doc = pool[Math.floor(Math.random() * pool.length)];
  goPage('library');
  openDocument(doc.path);
}

/* ── Auth ─────────────────────────────────────────────────────────────── */

async function hashPassword(password, salt) {
  const text = salt + ':' + password;
  if (globalThis.crypto?.subtle) {
    const buffer = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
    return Array.from(new Uint8Array(buffer)).map((byte) => byte.toString(16).padStart(2, '0')).join('');
  }
  let hash = 2166136261;
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return 'local-' + (hash >>> 0).toString(16);
}

function randomSalt() {
  if (globalThis.crypto?.getRandomValues) {
    const bytes = new Uint8Array(16);
    crypto.getRandomValues(bytes);
    return Array.from(bytes).map((byte) => byte.toString(16).padStart(2, '0')).join('');
  }
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

function showFormError(form, message) {
  const error = $('.form-error', form);
  error.textContent = message;
  error.classList.add('show');
}

function clearFormErrors() {
  $$('.form-error').forEach((error) => {
    error.textContent = '';
    error.classList.remove('show');
  });
}

async function registerUser(event) {
  event.preventDefault();
  clearFormErrors();
  const form = event.currentTarget;
  const username = $('#register-username').value.trim();
  const password = $('#register-password').value;
  const confirmation = $('#register-confirm').value;
  if (username.length < 2 || username.length > 20) return showFormError(form, '用户名需要 2–20 个字符。');
  if (accounts.some((account) => account.username.toLowerCase() === username.toLowerCase())) return showFormError(form, '这个用户名已存在，可以直接登录。');
  if (password.length < 6) return showFormError(form, '密码至少需要 6 位。');
  if (password !== confirmation) return showFormError(form, '两次输入的密码不一致。');
  const button = $('button[type=submit]', form);
  button.disabled = true;
  try {
    const salt = randomSalt();
    const hash = await hashPassword(password, salt);
    const id = `u_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
    accounts.push({ id, username, salt, hash, createdAt: new Date().toISOString() });
    store.saveAccounts(accounts);
    state = engine.normalize(JSON.parse(JSON.stringify(state)));
    state.profile.name = username;
    currentUser = id;
    store.saveSession(currentUser);
    save();
    closeModal('auth-modal');
    form.reset();
    completeActions();
    toast('账号已创建', `当前访客进度已带入「${username}」的本机账号。`, 'reward');
    celebrate();
  } catch (error) {
    showFormError(form, '无法写入本机存储，请检查浏览器权限后重试。');
  } finally {
    button.disabled = false;
  }
}

async function loginUser(event) {
  event.preventDefault();
  clearFormErrors();
  const form = event.currentTarget;
  const username = $('#login-username').value.trim();
  const password = $('#login-password').value;
  const account = accounts.find((item) => item.username.toLowerCase() === username.toLowerCase());
  if (!account) return showFormError(form, '没有找到这个本机账号，请检查用户名或先注册。');
  const button = $('button[type=submit]', form);
  button.disabled = true;
  try {
    const hash = await hashPassword(password, account.salt);
    if (hash !== account.hash) return showFormError(form, '密码不正确，请重新输入。');
    currentUser = account.id;
    store.saveSession(currentUser);
    state = engine.normalize(store.loadProgress(currentUser));
    if (!state.profile.name || state.profile.name === '本机访客') state.profile.name = account.username;
    save();
    closeModal('auth-modal');
    form.reset();
    completeActions();
    toast('欢迎回来，' + account.username, '你的学习记录已恢复。');
  } catch (error) {
    showFormError(form, '读取账号时出现问题，请稍后重试。');
  } finally {
    button.disabled = false;
  }
}

function logout() {
  confirmAction('退出当前账号', '账号数据会保留在此浏览器中；退出后将返回独立的访客进度。', '退出账号', () => {
    currentUser = null;
    store.clearSession();
    state = engine.normalize(store.loadProgress(null));
    completeActions();
    toast('已退出账号', '现在使用的是本机访客模式。');
  });
}

function exportData() {
  const payload = {
    app: '知屿学习营地',
    version: 3,
    exportedAt: new Date().toISOString(),
    account: currentUser ? accounts.find((account) => account.id === currentUser)?.username : 'guest',
    data: state,
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `知屿学习备份-${today()}.json`;
  anchor.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  toast('备份已导出', '请妥善保存 JSON 文件，换设备或清理浏览器前都可以使用它。');
}

function importData(file) {
  if (!file) return;
  file.text().then((text) => {
    const parsed = JSON.parse(text);
    const data = parsed.data || parsed;
    if (!data || typeof data !== 'object' || !data.profile) throw new Error('invalid');
    confirmAction('导入学习备份', '导入会覆盖当前账号或访客的进度。建议先导出当前数据，再确认导入。', '确认导入', () => {
      state = engine.normalize(data);
      completeActions();
      toast('备份已导入', '阅读、打卡与奖励记录已经恢复。', 'reward');
    });
  }).catch(() => toast('无法导入这个文件', '请选择由知屿学习营地导出的有效 JSON 备份。'))
    .finally(() => { $('#import-file').value = ''; });
}

function resetCurrent() {
  confirmAction('清空当前学习进度', '这会删除当前账号或访客的全部通读、打卡、经验、兑换与成就记录，且无法撤销。请先导出备份。', '确认清空', () => {
    const name = currentUser ? accounts.find((account) => account.id === currentUser)?.username : '本机访客';
    state = engine.defaultState(name);
    completeActions();
    toast('当前进度已重置', '新的学习旅程可以开始了。');
  });
}

/* ── Rendering ────────────────────────────────────────────────────────── */

function goPage(page) {
  if (!$('#page-' + page)) page = 'dashboard';
  if (page !== 'library' && activeDocument) closeReader();
  currentPage = page;
  $$('.page').forEach((element) => element.classList.toggle('active', element.id === 'page-' + page));
  $$('[data-page]').forEach((button) => button.classList.toggle('active', button.dataset.page === page));
  const names = {
    dashboard: ['今日营地', 'TODAY / LEARNING CAMP'],
    library: ['复习图鉴', 'LIBRARY / REVIEW TRAIL'],
    checkin: ['打卡与数据', 'RHYTHM / ACTIVITY'],
    rewards: ['成长奖励', 'GROWTH / REWARDS'],
    profile: ['我的档案', 'PROFILE / LOCAL DATA'],
  };
  $('#page-title').textContent = names[page][0];
  $('#page-en').textContent = names[page][1];
  history.replaceState(null, '', '#' + page);
  window.scrollTo({ top: 0, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  if (page === 'library') renderLibrary();
  if (page === 'checkin') renderCalendar();
}

function renderHUD() {
  const lv = engine.levelInfo(state.xp);
  const snapshot = metrics();
  const total = library.total || 0;
  $('#hud-level').textContent = 'LV.' + lv.level;
  $('#hud-hp').textContent = Math.min(snapshot.streak, 7) + '/7';
  $('#hud-ap').textContent = total ? `${snapshot.uniqueDocuments}/${total}` : `${snapshot.uniqueDocuments}/—`;
  $('#hud-xp').textContent = Math.round(lv.percent) + '%';
  $('#hud-hp-fill').style.width = Math.min(100, snapshot.streak / 7 * 100) + '%';
  $('#hud-ap-fill').style.width = total ? snapshot.uniqueDocuments / total * 100 + '%' : '0%';
  $('#hud-xp-fill').style.width = lv.percent + '%';
}

function renderQuests() {
  const quests = engine.quests(state);
  const items = [
    { name: '今日打卡', sub: '为坚持盖章', done: quests.checkin, reward: '20 XP / 10 叶币' },
    { name: '精读一篇', sub: `今日已读完 ${Math.min(quests.reads, 1)} / 1 篇`, done: quests.readOne, reward: '30 XP / 10 叶币' },
    { name: '再读一篇', sub: `今日已读完 ${Math.min(quests.reads, 2)} / 2 篇`, done: quests.readTwo, reward: '25 XP / 8 叶币' },
  ];
  $('#quest-list').innerHTML = items.map((quest) => `<div class="quest ${quest.done ? 'done' : ''}"><div class="quest-check">${quest.done ? icon('check') : ''}</div><div class="quest-name">${quest.name}<span>${quest.sub}</span></div><div class="quest-reward">${quest.done ? '已入账' : quest.reward}</div></div>`).join('');
  $('#plan-status').textContent = quests.progress + ' / 3 完成';
  $('#daily-hint').textContent = quests.progress === 3
    ? '今日航线已全部完成，营地因你更明亮。'
    : quests.progress === 0
      ? '从目录里选一篇完整资料，慢慢读到底。'
      : `已经完成 ${quests.progress} 项，再读完一篇就很好。`;
}

function renderRecent() {
  const recent = Object.entries(state.documents)
    .filter(([, entry]) => entry.lastRead || entry.lastOpen)
    .sort(([, a], [, b]) => new Date(b.lastRead || b.lastOpen) - new Date(a.lastRead || a.lastOpen))
    .slice(0, 4);
  $('#recent-list').innerHTML = recent.length ? recent.map(([path, entry]) => {
    const doc = findDocument(path);
    const title = doc?.title || entry.title || path.split('/').at(-1)?.replace(/\.html?$/i, '') || '复习资料';
    const subject = doc?.subject || entry.subject || '复习';
    return `<div class="recent-item" data-doc-path="${esc(path)}" style="--subject:${SUBJECTS[subject] || '#ffc107'}"><span class="subject-line"></span><div><div class="recent-title">${esc(title)}</div><div class="recent-meta">${esc(subject)} · ${entry.reads ? `已通读 ${entry.reads} 次` : '已打开，尚未读完'}</div></div><span class="recent-time">${formatDate(entry.lastRead || entry.lastOpen)}</span></div>`;
  }).join('') : `<div class="empty">${icon('book')}还没有通读记录。进入复习目录，选一篇完整资料。</div>`;
}

function renderWeek() {
  const days = Array.from({ length: 7 }, (_, index) => dayOffset(today(), index - 6));
  const values = days.map((day) => state.daily[day]?.reads?.length || 0);
  const maximum = Math.max(...values, 1);
  $('#week-chart').innerHTML = days.map((day, index) => {
    const date = new Date(day + 'T12:00:00');
    return `<div class="day-bar ${day === today() ? 'today' : ''}"><b>${values[index]}</b><div class="bar-track"><div class="bar-fill" style="height:${values[index] ? Math.max(4, values[index] / maximum * 100) : 0}%"></div></div><span>${['日', '一', '二', '三', '四', '五', '六'][date.getDay()]}</span></div>`;
  }).join('');
}

function renderScene() {
  const lv = engine.levelInfo(state.xp).level;
  const quests = engine.quests(state);
  const chestOpen = Boolean(state.awarded[`chest:${today()}`]);
  const tier = quests.progress >= 3 ? 'gold' : quests.progress >= 2 ? 'iron' : 'wood';
  $('#scene-level').textContent = 'CAMP LV.' + lv;
  $('#scene-camp-name').textContent = lv >= 8 ? '深渊前哨' : lv >= 5 ? '星图营地' : lv >= 3 ? '火把营地' : '苔石营地';
  $('#scene-title').textContent = '拾光旅人';
  $('#scene-caption').textContent = chestOpen
    ? '今日战利品已收入行囊'
    : quests.progress === 3
      ? '宝箱已亮起，点击领取战利品'
      : state.checkins[today()]
        ? '营火已点亮，继续向知识深处走'
        : '点燃营火，开始今晚的探索';
  $('#chest-hint').textContent = chestOpen ? '今日宝箱 · 已开启' : `今日宝箱 · ${quests.progress} / 3 项委托 · ${tier === 'gold' ? '灿金' : tier === 'iron' ? '铁制' : '木制'}`;
  $('#scene-weather').textContent = state.checkins[today()] ? '营火已亮 · 宜继续下潜' : '夜色渐深 · 适合出发';
  $('#fire-outer').style.opacity = state.checkins[today()] ? '1' : '.22';
  $('#fire-inner').style.opacity = state.checkins[today()] ? '1' : '.18';
  const chest = $('#loot-chest');
  chest.classList.remove('tier-wood', 'tier-iron', 'tier-gold', 'opened');
  chest.classList.add(`tier-${tier}`);
  if (chestOpen) chest.classList.add('opened');
  chest.classList.toggle('ready', quests.progress === 3 && !chestOpen);
  $('#chest-glow').setAttribute('opacity', quests.progress === 3 && !chestOpen ? '.55' : '0');
  const companion = $('#companion-cat');
  if (companion) companion.style.display = state.rewards.fireflies ? '' : 'none';
  $('#scene-stars').innerHTML = Array.from({ length: Math.min(12, 5 + Math.floor(lv / 2)) }, (_, index) => `<circle cx="${28 + index * 41}" cy="${25 + (index % 4) * 19}" r="${index % 3 === 0 ? 2.5 : 1.7}" opacity="${.55 + (index % 3) * .15}"/>`).join('');
  $('#fireflies').innerHTML = state.rewards.fireflies
    ? Array.from({ length: Math.min(14, 5 + lv) }, (_, index) => `<circle cx="${45 + (index * 71) % 470}" cy="${110 + (index * 37) % 130}" r="${index % 3 === 0 ? 3 : 2}"><animate attributeName="opacity" values=".2;1;.2" dur="${2 + index % 4}s" repeatCount="indefinite"/></circle>`).join('')
    : '';
}

function renderCheckin() {
  const checked = Boolean(state.checkins[today()]);
  const snapshot = metrics();
  $('#checkin-title').textContent = checked ? '今日营火已点亮' : '今日尚未打卡';
  $('#checkin-copy').textContent = checked ? `已连续 ${snapshot.streak} 天。今天的坚持已经被认真保存。` : '读完一篇完整资料后，也别忘了为坚持盖章。';
  ['hero-checkin', 'main-checkin'].forEach((id) => {
    const button = $('#' + id);
    button.disabled = checked;
    button.innerHTML = icon('check') + (checked ? '今日已打卡' : id === 'hero-checkin' ? '完成打卡' : '打卡 · +20 XP +10 叶币');
  });
  $('#streak-current').textContent = snapshot.streak;
  $('#streak-total').textContent = snapshot.checkinDays;
  $('#streak-best').textContent = snapshot.bestStreak;
  $('#stat-best').innerHTML = snapshot.bestStreak + ' <small>天</small>';
  $('#streak-ring').style.setProperty('--streak-angle', Math.min(100, snapshot.streak / 7 * 100) + '%');
  $('#streak-heading').textContent = snapshot.streak >= 7 ? '一周星轨已连成' : snapshot.streak >= 3 ? '营火渐入佳境' : snapshot.streak >= 1 ? '连续第 ' + snapshot.streak + ' 天' : '从第一天开始';
  $('#streak-message').textContent = snapshot.streak >= 7
    ? '稳定比冲刺更难得，继续保持自己的节奏。'
    : snapshot.streak >= 3
      ? `再坚持 ${7 - snapshot.streak} 天，解锁「七日星轨」。`
      : snapshot.streak
        ? '每一次回来，都比从不开始更重要。'
        : '完成今日打卡，点亮第一盏营灯。';
  $('#overview-percent').textContent = library.total ? Math.round(snapshot.uniqueDocuments / library.total * 100) + '%' : '—';
  $('#overview-active').textContent = Array.from({ length: 7 }, (_, index) => dayOffset(today(), index - 6)).filter((day) => state.checkins[day] || state.daily[day]?.reads?.length).length + ' 天';
  $('#overview-mastered').textContent = (state.daily[today()]?.reads?.length || 0) + ' 篇';
  $('#overview-achievements').textContent = Object.keys(state.achievements).length + ' / ' + ACHIEVEMENTS.length;
}

function renderCalendar() {
  const year = calendarCursor.getFullYear();
  const month = calendarCursor.getMonth();
  $('#calendar-title').textContent = `${year} 年 ${month + 1} 月`;
  const first = new Date(year, month, 1);
  const start = (first.getDay() + 6) % 7;
  const days = new Date(year, month + 1, 0).getDate();
  const previousDays = new Date(year, month, 0).getDate();
  const cells = [];
  ['一', '二', '三', '四', '五', '六', '日'].forEach((weekday) => cells.push(`<div class="weekday">${weekday}</div>`));
  for (let index = 0; index < 42; index += 1) {
    let number;
    let other = false;
    let date;
    if (index < start) {
      number = previousDays - start + index + 1;
      other = true;
      date = dayOffset(`${year}-${String(month + 1).padStart(2, '0')}-01`, index - start);
    } else if (index - start + 1 > days) {
      number = index - start + 1 - days;
      other = true;
      date = dayOffset(`${year}-${String(month + 1).padStart(2, '0')}-${String(days).padStart(2, '0')}`, number);
    } else {
      number = index - start + 1;
      date = `${year}-${String(month + 1).padStart(2, '0')}-${String(number).padStart(2, '0')}`;
    }
    const classes = ['calendar-day', other ? 'other' : '', date === today() ? 'today' : '', state.checkins[date] ? 'checked' : '', state.daily[date]?.reads?.length ? 'has-activity' : ''].join(' ');
    cells.push(`<div class="${classes}" title="${date}${state.daily[date]?.reads?.length ? ` · 读完 ${state.daily[date].reads.length} 篇` : ''}">${number}</div>`);
  }
  $('#calendar-grid').innerHTML = cells.join('');
}

function librarySubjectStats() {
  const totals = Object.fromEntries(Object.keys(SUBJECTS).map((subject) => [subject, 0]));
  const reads = Object.fromEntries(Object.keys(SUBJECTS).map((subject) => [subject, 0]));
  function countNode(node) {
    if (node.type === 'subject') totals[node.name] = node.count;
    node.documents.forEach((doc) => { if (state.documents[doc.path]?.reads) reads[node.subject || doc.subject] += 1; });
    node.children.forEach(countNode);
  }
  library.tree.forEach(countNode);
  return { totals, reads };
}

function renderSubjects() {
  const stats = librarySubjectStats();
  $('#subject-progress').innerHTML = Object.keys(SUBJECTS).map((subject) => {
    const total = stats.totals[subject] || 0;
    const done = stats.reads[subject] || 0;
    const width = total ? done / total * 100 : 0;
    return `<div class="progress-row"><span>${subject}</span><div class="progress-track"><div class="progress-fill" style="--subject:${SUBJECTS[subject]};width:${width}%"></div></div><small>${done} / ${total || '—'}</small></div>`;
  }).join('');
}

function renderRewards() {
  $('#wallet-coins').textContent = state.coins;
  const lv = engine.levelInfo(state.xp);
  $('#level-name').textContent = `LV.${lv.level} · ${lv.name}`;
  $('#level-xp').textContent = state.xp + ' XP';
  $('#xp-fill').style.width = lv.percent + '%';
  $('#xp-current').textContent = `当前级 ${lv.current} / ${lv.needed} XP`;
  $('#xp-next').textContent = `再获 ${Math.max(0, lv.next - state.xp)} XP 升级`;
  $('#reward-grid').innerHTML = REWARDS.map((reward) => {
    const count = Number(state.rewards[reward.id] || 0);
    const owned = count > 0 && !reward.repeat;
    return `<article class="reward-card"><div class="reward-visual" style="--reward-bg:${reward.bg};--reward-color:${reward.color}"><span class="reward-kind">${reward.kind}</span>${icon(reward.icon)}</div><div class="reward-body"><h3>${reward.name}</h3><p>${reward.desc}</p><div class="reward-buy"><span class="price">${icon('coin')}${reward.cost}</span>${owned ? `<span class="owned">${icon('check')}已拥有</span>` : `<button class="button ghost small" data-redeem="${reward.id}">${count ? `再兑换 · 已有 ${count}` : '兑换'}</button>`}</div></div></article>`;
  }).join('');
  $('#achievement-grid').innerHTML = ACHIEVEMENTS.map((achievement) => {
    const value = engine.achievementValue(state, achievement);
    const done = Boolean(state.achievements[achievement.id]);
    return `<article class="achievement ${done ? 'unlocked' : 'locked'}"><span class="auto-tag">${done ? '已解锁' : '自动解锁'}</span><div class="achievement-icon">${icon(done ? 'trophy' : achievement.icon)}</div><h3>${achievement.name}</h3><p>${achievement.desc}</p><div class="progress-track"><div class="progress-fill" style="width:${Math.min(100, value / achievement.target * 100)}%"></div></div><div class="achievement-foot"><span>${Math.min(value, achievement.target)} / ${achievement.target}</span><span>+${achievement.xp} XP · +${achievement.coins} 叶币</span></div></article>`;
  }).join('');
}

function allRecords() {
  const transactions = state.transactions.map((entry) => ({ ...entry, kind: 'growth' }));
  const redemptions = state.redemptions.map((entry) => ({
    id: entry.id,
    ts: entry.ts,
    label: '兑换 · ' + entry.name,
    xp: 0,
    coins: -entry.cost,
    kind: 'redeem',
  }));
  return [...transactions, ...redemptions].sort((a, b) => new Date(b.ts) - new Date(a.ts));
}

function renderRecords() {
  const records = allRecords();
  const html = records.length
    ? records.slice(0, 80).map((record) => `<div class="record"><div class="record-icon">${icon(record.kind === 'redeem' ? 'gift' : 'spark')}</div><div><strong>${esc(record.label)}</strong><small>${formatDate(record.ts)} · ${new Date(record.ts).toLocaleDateString('zh-CN')}</small></div><div class="record-value">${record.xp ? `<div class="plus">+${record.xp} XP</div>` : ''}${record.coins ? `<div class="${record.coins > 0 ? 'plus' : 'minus'}">${record.coins > 0 ? '+' : ''}${record.coins} 叶币</div>` : ''}</div></div>`).join('')
    : `<div class="empty">${icon('spark')}成长记录会在这里出现。读完一篇完整的复习资料，就会有第一笔经验入账。</div>`;
  $('#full-records').innerHTML = html;
  $('#activity-records').innerHTML = records.length
    ? records.slice(0, 5).map((record) => `<div class="record"><div class="record-icon">${icon(record.kind === 'redeem' ? 'gift' : 'spark')}</div><div><strong>${esc(record.label)}</strong><small>${formatDate(record.ts)}</small></div><div class="record-value">${record.xp ? `<span class="plus">+${record.xp} XP</span>` : `<span class="${record.coins > 0 ? 'plus' : 'minus'}">${record.coins > 0 ? '+' : ''}${record.coins} 叶币</span>`}</div></div>`).join('')
    : `<div class="empty">${icon('spark')}暂无成长记录</div>`;
}

function renderProfile() {
  const lv = engine.levelInfo(state.xp);
  const snapshot = metrics();
  const name = state.profile.name || (currentUser ? accounts.find((account) => account.id === currentUser)?.username : '本机访客');
  $$('.avatar').forEach((avatar) => {
    avatar.textContent = (name || '知').slice(0, 1);
    avatar.classList.toggle('framed', Boolean(state.rewards.frame));
  });
  $('#side-name').textContent = currentUser ? name : '本机访客';
  $('#side-level').textContent = `LV.${lv.level} · ${lv.name}`;
  $('#profile-name').textContent = name;
  $('#profile-bio').textContent = state.profile.bio || '还没有写下学习签名';
  $('#profile-level').textContent = `LV.${lv.level} · ${lv.name}`;
  $('#profile-days').textContent = snapshot.checkinDays;
  $('#profile-mastered').textContent = snapshot.uniqueDocuments;
  $('#profile-honors').textContent = Object.keys(state.achievements).length;
  $('#display-name').value = name === '本机访客' ? '' : name;
  $('#profile-bio-input').value = state.profile.bio || '';
  $('#guest-callout').classList.toggle('hidden', Boolean(currentUser));
  $('#profile-account-btn').textContent = currentUser ? '退出当前账号' : '注册 / 登录本机账号';
  $$('.theme-option').forEach((button) => button.classList.toggle('active', button.dataset.theme === state.profile.theme));
  $('#dusk-option').disabled = !state.rewards.dusk;
  document.body.classList.toggle('dusk', state.profile.theme === 'dusk' && Boolean(state.rewards.dusk));
  $('#character-level').textContent = lv.level;
  $('#character-title').textContent = lv.name;
  const companionSlot = $('#companion-slot');
  if (companionSlot) {
    companionSlot.classList.toggle('locked', !state.rewards.fireflies);
    const label = $('small', companionSlot);
    if (label) label.textContent = state.rewards.fireflies ? '苔猫 · 已同行' : '苔猫 · 待解锁';
  }
}

function renderAll() {
  const snapshot = metrics();
  const current = engine.levelInfo(state.xp);
  const hour = new Date().getHours();
  const name = state.profile.name || '本机访客';
  $('#top-streak').textContent = snapshot.streak;
  $('#top-xp').textContent = state.xp + ' XP';
  $('#top-coins').textContent = state.coins;
  $('#stat-today').innerHTML = (state.daily[today()]?.reads?.length || 0) + ' <small>篇</small>';
  $('#stat-mastered').innerHTML = snapshot.uniqueDocuments + ` <small>${library.total ? '/ ' + library.total : '篇'}</small>`;
  $('#stat-views').innerHTML = snapshot.totalReads + ' <small>次</small>';
  $('#greeting').textContent = (hour < 11 ? '早上好' : hour < 14 ? '中午好' : hour < 18 ? '下午好' : '晚上好') + '，' + (currentUser ? name : '学习者') + '。';
  $('#date-day').textContent = String(new Date().getDate()).padStart(2, '0');
  $('#date-full').textContent = new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit' }).replaceAll('/', '.') + ' / ' + new Date().toLocaleDateString('zh-CN', { weekday: 'long' });
  renderHUD();
  renderQuests();
  renderRecent();
  renderWeek();
  renderScene();
  renderCheckin();
  renderCalendar();
  renderSubjects();
  renderRewards();
  renderRecords();
  renderProfile();
  renderLibrary();
  const picks = ['first', 'streak3', 'master5'];
  $('#mini-honors').innerHTML = picks.map((id) => {
    const achievement = ACHIEVEMENTS.find((entry) => entry.id === id);
    const unlocked = Boolean(state.achievements[id]);
    return `<div class="mini-honor ${unlocked ? 'unlocked' : ''}">${icon(unlocked ? 'trophy' : achievement.icon)}<span>${achievement.name}</span></div>`;
  }).join('');
  hydrateIcons(document);
}

/* ── Reward actions ───────────────────────────────────────────────────── */

function doCheckin() {
  const result = engine.checkIn(state, { at: new Date() });
  applyEffects(result);
  if (result.ok) celebrate();
}

function claimChest() {
  const result = engine.openChest(state, { at: new Date() });
  applyEffects(result);
  if (result.ok) celebrate();
}

function redeem(id) {
  const reward = REWARDS.find((entry) => entry.id === id);
  if (!reward) return;
  const count = Number(state.rewards[id] || 0);
  if (count && !reward.repeat) {
    toast('已经拥有这件奖励', '装扮已自动生效，无需重复兑换。');
    return;
  }
  if (state.coins < reward.cost) {
    toast('叶币还不够', `还差 ${reward.cost - state.coins} 叶币，完成今日航线可以继续积累。`);
    return;
  }
  confirmAction('兑换 ' + reward.name, `将使用 ${reward.cost} 叶币。${reward.id === 'break' ? '这是一份给自己的线下奖励，记得认真兑现。' : '兑换后立即生效。'}`, '确认兑换', () => {
    const result = engine.redeem(state, { rewardId: id, at: new Date() });
    applyEffects(result);
    if (result.ok) celebrate();
  });
}

/* ── Events ───────────────────────────────────────────────────────────── */

function bindEvents() {
  $$('[data-page]').forEach((button) => button.addEventListener('click', () => goPage(button.dataset.page)));
  $$('[data-go]').forEach((button) => button.addEventListener('click', () => goPage(button.dataset.go)));
  $('#account-button').addEventListener('click', () => currentUser ? goPage('profile') : openModal('auth-modal'));
  $('#callout-register').addEventListener('click', () => openModal('auth-modal'));
  $('#profile-account-btn').addEventListener('click', () => currentUser ? logout() : openModal('auth-modal'));

  $('#start-review').addEventListener('click', () => {
    goPage('library');
    if (!library.total) {
      toast('先连接你的复习资料库', '选择「高中校内」文件夹后，所有完整复习资料会出现在左侧目录。');
      return;
    }
    const firstUnread = [...library.documents.values()].find((doc) => !(Number(state.documents[doc.path]?.reads) > 0));
    if (firstUnread) openDocument(firstUnread.path);
  });
  $('#random-review').addEventListener('click', randomDocument);
  $('#pick-library').addEventListener('click', chooseLibrary);
  $$('.pick-library').filter((button) => button.id !== 'pick-library').forEach((button) => button.addEventListener('click', chooseLibrary));
  $('#library-folder-input').addEventListener('change', (event) => importFolderFiles(event.target.files));
  $('#import-library-files').addEventListener('click', () => $('#library-folder-input').click());
  $('#library-search').addEventListener('input', renderLibrary);
  $('#read-filter').addEventListener('change', renderLibrary);
  $('#expand-all').addEventListener('click', () => {
    const all = [];
    function collect(node) { all.push(node.id); node.children.forEach(collect); }
    library.tree.forEach(collect);
    expandedNodes = new Set(all);
    renderLibrary();
  });
  $('#collapse-all').addEventListener('click', () => {
    expandedNodes = new Set();
    renderLibrary();
  });
  $('#library-tree').addEventListener('click', (event) => {
    const summary = event.target.closest('summary');
    if (summary) {
      const details = summary.parentElement;
      setTimeout(() => {
        if (details.open) expandedNodes.add(details.dataset.nodeId);
        else expandedNodes.delete(details.dataset.nodeId);
      }, 0);
      return;
    }
    const doc = event.target.closest('[data-doc-path]');
    if (doc) openDocument(doc.dataset.docPath);
  });
  $('#recent-list').addEventListener('click', (event) => {
    const doc = event.target.closest('[data-doc-path]');
    if (!doc) return;
    goPage('library');
    openDocument(doc.dataset.docPath);
  });
  $('#close-reader').addEventListener('click', closeReader);
  window.addEventListener('message', handleReaderMessage);
  $('#reader-reload').addEventListener('click', () => {
    if (activeDocument) {
      const path = activeDocument.path;
      closeReader();
      openDocument(path);
    }
  });
  $('#loot-chest').addEventListener('click', claimChest);
  $('#loot-chest').addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      claimChest();
    }
  });
  $('#hero-checkin').addEventListener('click', doCheckin);
  $('#main-checkin').addEventListener('click', doCheckin);
  $('#prev-month').addEventListener('click', () => {
    calendarCursor.setMonth(calendarCursor.getMonth() - 1);
    renderCalendar();
  });
  $('#next-month').addEventListener('click', () => {
    calendarCursor.setMonth(calendarCursor.getMonth() + 1);
    renderCalendar();
  });
  $('#reward-grid').addEventListener('click', (event) => {
    const button = event.target.closest('[data-redeem]');
    if (button) redeem(button.dataset.redeem);
  });
  $$('[data-close]').forEach((button) => button.addEventListener('click', () => closeModal(button.dataset.close)));
  document.addEventListener('click', (event) => {
    const button = event.target.closest('[data-close]');
    if (button) closeModal(button.dataset.close);
  });
  $$('.modal-backdrop').forEach((backdrop) => backdrop.addEventListener('click', (event) => {
    if (event.target === backdrop) closeModal(backdrop.id);
  }));
  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;
    const open = $$('.modal-backdrop.open').pop();
    if (open) closeModal(open.id);
    else if (activeDocument) closeReader();
  });
  $('#confirm-action').addEventListener('click', () => {
    const callback = confirmCallback;
    confirmCallback = null;
    closeModal('confirm-modal');
    if (callback) callback();
  });
  $$('[data-auth]').forEach((button) => button.addEventListener('click', () => {
    clearFormErrors();
    $$('[data-auth]').forEach((item) => item.classList.toggle('active', item === button));
    $$('.auth-form').forEach((form) => form.classList.toggle('active', form.id === button.dataset.auth + '-form'));
  }));
  $('#login-form').addEventListener('submit', loginUser);
  $('#register-form').addEventListener('submit', registerUser);
  $('#save-profile').addEventListener('click', () => {
    state.profile.name = $('#display-name').value.trim() || (currentUser ? accounts.find((account) => account.id === currentUser)?.username : '本机访客');
    state.profile.bio = $('#profile-bio-input').value.trim();
    save();
    renderAll();
    toast('个人资料已保存', '称呼与签名已同步到营地。');
  });
  $$('[data-theme]').forEach((button) => button.addEventListener('click', () => {
    if (button.dataset.theme === 'dusk' && !state.rewards.dusk) {
      toast('尚未解锁暮色赤林', '可先在成长奖励中兑换此外观。');
      return;
    }
    state.profile.theme = button.dataset.theme;
    save();
    renderProfile();
  }));
  $('#export-data').addEventListener('click', exportData);
  $('#import-data').addEventListener('click', () => $('#import-file').click());
  $('#import-file').addEventListener('change', (event) => importData(event.target.files[0]));
  $('#reset-data').addEventListener('click', resetCurrent);
}

function esc(value) {
  return String(value ?? '').replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character]));
}

hydrateIcons();
bindEvents();
save();
renderAll();
goPage(location.hash.slice(1) || 'dashboard');
restoreSavedLibrary();
