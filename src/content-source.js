/* Zhiyu Study Camp — local content source adapter.
 *
 * The full review library stays on the learner's disk. Chrome/Edge can grant
 * a persistent directory handle; other browsers fall back to a directory
 * input for the current session. Nothing here uploads content.
 */
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.ZYContentSource = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  const KNOWN_SUBJECTS = ['语文', '数学', '物理', '化学', '生物'];
  const SKIP_FOLDER = /^(?:_work|绘图工具|原稿备份|node_modules|\.git|\.workbuddy|pdf_pages|answer_pdf_pages|pdf_extract_work)$/;
  const DB_NAME = 'zhiyu-content-handle';
  const STORE = 'handles';
  const HANDLE_KEY = 'review-root';

  function supportsDirectoryPicker() {
    return typeof window !== 'undefined' && typeof window.showDirectoryPicker === 'function';
  }

  function isRelevantDirectory(name, prefix, rootName) {
    if (SKIP_FOLDER.test(name)) return false;
    if (KNOWN_SUBJECTS.includes(rootName) || KNOWN_SUBJECTS.includes(name)) return true;
    return prefix.some((part) => KNOWN_SUBJECTS.includes(part));
  }

  async function scanDirectoryHandle(handle) {
    const records = [];
    const rootName = handle.name || '';
    async function walk(current, prefix) {
      for await (const [name, child] of current.entries()) {
        if (child.kind === 'directory') {
          if (!isRelevantDirectory(name, prefix, rootName)) continue;
          await walk(child, [...prefix, name]);
          continue;
        }
        if (!name.toLowerCase().endsWith('.html') || name.startsWith('_')) continue;
        const file = await child.getFile();
        records.push({
          path: [...prefix, name].join('/'),
          size: file.size,
          lastModified: file.lastModified,
          handle: child,
        });
        if (records.length > 600) throw new Error('资料超过 600 篇，请选择单科文件夹。');
      }
    }
    await walk(handle, KNOWN_SUBJECTS.includes(rootName) ? [rootName] : []);
    return records;
  }

  function recordsFromFileList(files) {
    return [...files]
      .filter((file) => file.name.toLowerCase().endsWith('.html'))
      .map((file) => ({
        path: file.webkitRelativePath || file.name,
        size: file.size,
        lastModified: file.lastModified,
        file,
      }));
  }

  function readerBridge(token) {
    const safeToken = JSON.stringify(token);
    const inline = `(()=>{
      const token=${safeToken};
      function readingMetrics(){
        const doc=document.documentElement, body=document.body;
        const viewport=window.innerHeight||doc.clientHeight||1;
        const rootHeight=Math.max(doc.scrollHeight,body?body.scrollHeight:0);
        let ratio=rootHeight>viewport+40?Math.min(1,(window.scrollY+viewport)/rootHeight):0;
        let canScroll=rootHeight>viewport+40;
        const nodes=document.querySelectorAll('main,article,section,.content,.wrap,[style*="overflow"]');
        for(const node of nodes){
          const style=getComputedStyle(node);
          if(!/(auto|scroll)/.test(style.overflowY))continue;
          if(node.scrollHeight<=node.clientHeight+40)continue;
          if(node.clientWidth<viewport*.45)continue;
          if(node.scrollHeight<rootHeight*.45)continue;
          canScroll=true;
          ratio=Math.max(ratio,Math.min(1,(node.scrollTop+node.clientHeight)/node.scrollHeight));
        }
        return {ratio,canScroll};
      }
      let ticks=0;
      function report(){
        try{parent.postMessage({source:'zhiyu-reader',token,type:'progress',...readingMetrics()},'*')}catch(error){}
        ticks+=1;
        if(ticks>7200)clearInterval(timer);
      }
      const timer=setInterval(report,500);
      addEventListener('scroll',report,{passive:true,capture:true});
      addEventListener('resize',report,{passive:true});
      addEventListener('load',()=>{setTimeout(report,120);setTimeout(report,900)});
      report();
    })();`;
    return `<script data-zhiyu-reader-bridge>${inline}<\/script>`;
  }

  async function readHtml(entry, options = {}) {
    const file = entry.file || (entry.handle ? await entry.handle.getFile() : null);
    if (!file) throw new Error('无法读取这篇资料。');
    const bridge = options.token ? readerBridge(options.token) : '';
    const blob = new Blob([file, bridge], { type: 'text/html;charset=utf-8' });
    return { file, url: URL.createObjectURL(blob) };
  }

  function openHandleDatabase() {
    return new Promise((resolve, reject) => {
      if (!('indexedDB' in window)) return reject(new Error('IndexedDB unavailable'));
      const request = indexedDB.open(DB_NAME, 1);
      request.onupgradeneeded = () => {
        if (!request.result.objectStoreNames.contains(STORE)) {
          request.result.createObjectStore(STORE);
        }
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error || new Error('IndexedDB open failed'));
    });
  }

  async function rememberHandle(handle) {
    if (!handle || typeof handle.queryPermission !== 'function') return false;
    try {
      const db = await openHandleDatabase();
      await new Promise((resolve, reject) => {
        const tx = db.transaction(STORE, 'readwrite');
        tx.objectStore(STORE).put(handle, HANDLE_KEY);
        tx.oncomplete = resolve;
        tx.onerror = () => reject(tx.error);
      });
      db.close();
      return true;
    } catch (error) {
      return false;
    }
  }

  async function restoreHandle() {
    try {
      const db = await openHandleDatabase();
      const handle = await new Promise((resolve, reject) => {
        const tx = db.transaction(STORE, 'readonly');
        const req = tx.objectStore(STORE).get(HANDLE_KEY);
        req.onsuccess = () => resolve(req.result || null);
        req.onerror = () => reject(req.error);
      });
      db.close();
      return handle || null;
    } catch (error) {
      return null;
    }
  }

  async function handlePermission(handle, request = false) {
    if (!handle || typeof handle.queryPermission !== 'function') return 'denied';
    const options = { mode: 'read' };
    let status = await handle.queryPermission(options);
    if (status === 'prompt' && request && typeof handle.requestPermission === 'function') {
      status = await handle.requestPermission(options);
    }
    return status;
  }

  async function pickDirectory() {
    if (!supportsDirectoryPicker()) {
      throw new Error('当前浏览器不支持持久目录连接，请使用下方的文件夹导入。');
    }
    const handle = await window.showDirectoryPicker({ id: 'zhiyu-review-library', mode: 'read' });
    const permission = await handlePermission(handle, true);
    if (permission !== 'granted') throw new Error('需要读取权限才能建立复习目录。');
    await rememberHandle(handle);
    const records = await scanDirectoryHandle(handle);
    return { records, handle, persistent: true };
  }

  return Object.freeze({
    supportsDirectoryPicker,
    scanDirectoryHandle,
    recordsFromFileList,
    readHtml,
    readerBridge,
    rememberHandle,
    restoreHandle,
    handlePermission,
    pickDirectory,
  });
});
