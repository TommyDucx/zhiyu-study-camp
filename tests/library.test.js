const test = require('node:test');
const assert = require('node:assert/strict');
const library = require('../src/library.js');

test('paths are normalised from a selected parent folder to the subject root', () => {
  assert.equal(
    library.normalizePath('高中校内/化学/必修一/第1章/第1章-物质及其变化-知识点整理.html'),
    '化学/必修一/第1章/第1章-物质及其变化-知识点整理.html',
  );
  assert.equal(library.normalizePath('化学\\必修一\\总览.html'), '化学/必修一/总览.html');
});

test('only complete review HTML files are included', () => {
  assert.equal(library.isReviewHtml('化学/必修一/全书合订本（完整版）.html'), true);
  assert.equal(library.isReviewHtml('数学/直线与圆/示意图总览.html'), true);
  assert.equal(library.isReviewHtml('化学/必修一/原页总览.html'), false);
  assert.equal(library.isReviewHtml('物理/必修三/全书合订本（打印版）.html'), false);
  assert.equal(library.isReviewHtml('数学/圆锥曲线/绘图工具/_p1.html'), false);
  assert.equal(library.isReviewHtml('index.html'), false);
  assert.equal(library.isReviewHtml('README.md'), false);
});

test('title and folder labels are readable while retaining chapter numbers', () => {
  assert.equal(library.cleanDocumentTitle('第3章-水溶液中的离子反应与平衡-知识点整理.html'), '第3章 · 水溶液中的离子反应与平衡');
  assert.equal(library.cleanDocumentTitle('全书合订本（完整版）.html'), '全书合订本');
  assert.equal(library.cleanDocumentTitle('第1章-走近细胞·重点知识点速览.html'), '第1章 · 走近细胞');
  assert.equal(library.cleanFolderName('01-第1章-物质及其变化'), '第1章 · 物质及其变化');
});

test('tree groups subjects, books and chapters and counts every descendant', () => {
  const input = [
    '高中校内/化学/必修一/00-必修一总览.html',
    '高中校内/化学/必修一/01-第1章-物质及其变化/第1章-物质及其变化-知识点整理.html',
    '高中校内/化学/必修一/02-第2章-海水中的重要元素/第2章-海水中的重要元素-知识点整理.html',
    '高中校内/数学/圆锥曲线/圆锥曲线知识点整理.html',
    '高中校内/数学/圆锥曲线/示意图总览.html',
    '高中校内/数学/直线与圆/直线与圆知识点整理.html',
  ];
  const built = library.buildLibrary(input);
  assert.equal(built.total, 6);
  assert.deepEqual(built.tree.map((subject) => subject.name), ['数学', '化学']);
  const math = built.tree.find((subject) => subject.name === '数学');
  assert.equal(math.count, 3);
  const chemistry = built.tree.find((subject) => subject.name === '化学');
  assert.equal(chemistry.count, 3);
  const compulsoryOne = chemistry.children[0];
  assert.equal(compulsoryOne.name, '必修一');
  assert.equal(compulsoryOne.documents[0].title, '必修一总览');
  assert.equal(compulsoryOne.children[0].name, '第1章 · 物质及其变化');
  assert.equal(compulsoryOne.children[0].documents[0].badge, '完整');
  assert.equal(built.folders, 5);
});

test('duplicate paths collapse and irrelevant files are counted as ignored', () => {
  const built = library.buildLibrary([
    '数学/直线与圆/直线与圆知识点整理.html',
    '数学/直线与圆/直线与圆知识点整理.html',
    '数学/直线与圆/直线与圆知识点整理（打印版）.html',
    'README.html',
    '物理/必修三/原页总览.html',
  ]);
  assert.equal(built.total, 1);
  assert.equal(built.ignored, 3);
});

test('search keeps matching docs and their ancestor folders', () => {
  const built = library.buildLibrary([
    '化学/必修一/01-第1章-物质及其变化/第1章-物质及其变化-知识点整理.html',
    '化学/必修二/03-第7章-有机化合物/第7章-有机化合物-知识点整理.html',
    '生物/必修一/01-第1章-走近细胞/第1章-走近细胞-知识点整理.html',
  ]);
  const filtered = library.filterLibrary(built, '有机化合物');
  assert.equal(filtered.total, 1);
  assert.equal(filtered.tree.length, 1);
  assert.equal(filtered.tree[0].name, '化学');
  assert.equal(filtered.tree[0].children[0].name, '必修二');
  assert.deepEqual(
    library.collectDocumentIds(filtered.tree[0]),
    ['化学/必修二/03-第7章-有机化合物/第7章-有机化合物-知识点整理.html'],
  );
});

test('full book overviews sort before atlas pages at the same folder level', () => {
  const built = library.buildLibrary([
    '物理/必修三/示意图总览.html',
    '物理/必修三/全书合订本（完整版）.html',
    '物理/必修三/全书汇总（速览版）.html',
    '物理/必修三/00-必修三总览.html',
  ]);
  const documents = built.tree[0].children[0].documents.map((doc) => doc.badge);
  assert.deepEqual(documents, ['全书', '总览', '速览', '图谱']);
});
