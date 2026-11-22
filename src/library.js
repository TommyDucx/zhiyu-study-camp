/* Zhiyu Study Camp — review-library index.
 *
 * Pure helpers turn file paths into a stable, progressively disclosed tree.
 * No DOM, no file reading, no storage.
 */
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.ZYLibrary = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  const KNOWN_SUBJECTS = ['语文', '数学', '物理', '化学', '生物'];
  const SKIPPED_FOLDERS = new Set([
    '_work', '绘图工具', '原稿备份', 'node_modules', '.git', '.workbuddy',
    'pdf_pages', 'answer_pdf_pages', 'pdf_extract_work',
  ]);
  const SKIPPED_FILE = /(?:打印版|原页总览|讲义原页|无插图版|\.obsidian)/;
  const NATURAL = { numeric: true, sensitivity: 'base' };

  function normalizePath(value) {
    const parts = String(value || '')
      .replaceAll('\\', '/')
      .split('/')
      .filter((part) => part && part !== '.');
    const subjectAt = parts.findIndex((part) => KNOWN_SUBJECTS.includes(part));
    return (subjectAt >= 0 ? parts.slice(subjectAt) : parts).join('/');
  }

  function isReviewHtml(value) {
    const path = normalizePath(value);
    if (!path.toLowerCase().endsWith('.html')) return false;
    const parts = path.split('/');
    if (parts.some((part) => SKIPPED_FOLDERS.has(part))) return false;
    const name = parts.at(-1);
    if (!name || name.startsWith('_') || SKIPPED_FILE.test(name)) return false;
    if (name.startsWith('.')) return false;
    return KNOWN_SUBJECTS.includes(parts[0]) && parts.length >= 2;
  }

  function fileVariant(name) {
    if (name.includes('全书合订本')) return { badge: '全书', priority: 20 };
    if (name.includes('全书汇总')) return { badge: '速览', priority: 30 };
    if (name.includes('示意图总览')) return { badge: '图谱', priority: 40 };
    if (name.includes('重点知识速记')) return { badge: '速记', priority: 35 };
    if (name.includes('重点知识点速览')) return { badge: '速览', priority: 10 };
    if (name.includes('知识点整理')) return { badge: '完整', priority: 0 };
    if (name.includes('总览')) return { badge: '总览', priority: 25 };
    return { badge: '专题', priority: 15 };
  }

  function cleanDocumentTitle(fileName) {
    return String(fileName || '')
      .replace(/\.html?$/i, '')
      .replace(/（完整版）|（速览版）/g, '')
      .replace(/·重点知识点速览/g, '')
      .replace(/-知识点整理$/g, '')
      .replace(/^\d+[-_]\s*/, '')
      .replace(/^第(\d+)章[-·]/g, '第$1章 · ')
      .replaceAll('-', ' · ')
      .trim();
  }

  function cleanFolderName(name) {
    return String(name)
      .replace(/^\d+[-_]\s*/, '')
      .replace(/^第(\d+)章[-·]/g, '第$1章 · ')
      .replaceAll('-', ' · ')
      .trim();
  }

  function docRecord(path, extras = {}) {
    const normalized = normalizePath(path);
    const parts = normalized.split('/');
    const fileName = parts.at(-1);
    const variant = fileVariant(fileName);
    return {
      path: normalized,
      name: fileName,
      title: cleanDocumentTitle(fileName),
      subject: parts[0],
      folderPath: parts.slice(1, -1).join('/'),
      folderLabel: parts.slice(1, -1).map(cleanFolderName).join(' / '),
      badge: variant.badge,
      priority: variant.priority,
      size: Math.max(0, Number(extras.size) || 0),
      lastModified: Number(extras.lastModified) || 0,
      sourceId: extras.sourceId || '',
      file: extras.file || null,
      handle: extras.handle || null,
    };
  }

  function sortDocuments(a, b) {
    if (a.priority !== b.priority) return a.priority - b.priority;
    return a.title.localeCompare(b.title, 'zh-Hans-CN', NATURAL);
  }

  function folderNode(name, id) {
    return {
      type: 'folder',
      id,
      name: cleanFolderName(name),
      rawName: name,
      children: [],
      documents: [],
      count: 0,
    };
  }

  function countFolders(node) {
    return node.children.length + node.children.reduce((sum, child) => sum + countFolders(child), 0);
  }

  function tally(node) {
    node.count = node.documents.length;
    for (const child of node.children) node.count += tally(child);
    node.children.sort((a, b) => a.rawName.localeCompare(b.rawName, 'zh-Hans-CN', NATURAL));
    node.documents.sort(sortDocuments);
    return node.count;
  }

  function buildLibrary(inputFiles, subjects = KNOWN_SUBJECTS) {
    const roots = new Map(subjects.map((subject) => [
      subject,
      { type: 'subject', id: subject, name: subject, subject, children: [], documents: [], count: 0 },
    ]));
    const documents = new Map();
    let ignored = 0;

    for (const input of Array.isArray(inputFiles) ? inputFiles : []) {
      const path = normalizePath(typeof input === 'string' ? input : input.path);
      if (!isReviewHtml(path)) {
        ignored += 1;
        continue;
      }
      const record = docRecord(path, input);
      if (documents.has(record.path)) continue;
      documents.set(record.path, record);
      const parts = record.path.split('/');
      const root = roots.get(record.subject);
      if (!root) {
        ignored += 1;
        continue;
      }
      let node = root;
      for (const folder of parts.slice(1, -1)) {
        let child = node.children.find((item) => item.rawName === folder);
        if (!child) {
          child = folderNode(folder, `${node.id}/${folder}`);
          node.children.push(child);
        }
        node = child;
      }
      node.documents.push(record);
    }

    const tree = [...roots.values()].filter((root) => {
      tally(root);
      return root.count > 0;
    });
    return {
      tree,
      documents,
      total: documents.size,
      ignored,
      folders: tree.reduce((sum, subject) => sum + countFolders(subject), 0),
    };
  }

  function filterLibrary(library, query, status = 'all') {
    const needle = String(query || '').trim().toLowerCase();
    function visit(node) {
      const docs = node.documents.filter((doc) => {
        const matches = !needle || `${doc.title} ${doc.path}`.toLowerCase().includes(needle);
        if (!matches) return false;
        return true;
      });
      const children = node.children.map(visit).filter(Boolean);
      if (!docs.length && !children.length) return null;
      return {
        ...node,
        documents: docs,
        children,
        count: docs.length + children.reduce((sum, child) => sum + child.count, 0),
      };
    }
    const tree = library.tree.map(visit).filter(Boolean);
    return {
      tree,
      total: tree.reduce((sum, subject) => sum + subject.count, 0),
      documents: library.documents,
    };
  }

  function collectDocumentIds(node, target = []) {
    node.documents.forEach((doc) => target.push(doc.path));
    node.children.forEach((child) => collectDocumentIds(child, target));
    return target;
  }

  return Object.freeze({
    KNOWN_SUBJECTS,
    normalizePath,
    isReviewHtml,
    cleanDocumentTitle,
    cleanFolderName,
    buildLibrary,
    filterLibrary,
    collectDocumentIds,
    sortDocuments,
  });
});
