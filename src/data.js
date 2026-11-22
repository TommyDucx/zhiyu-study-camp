/* Zhiyu Study Camp — game catalog.
 *
 * Review-document discovery belongs to src/library.js. This file only holds
 * the stable game vocabulary: subject colours, level names, achievements and
 * reward definitions.
 */
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.ZYData = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  const SUBJECTS = Object.freeze({
    语文: '#f0a36b',
    数学: '#62b8ff',
    物理: '#69d9a0',
    化学: '#ffc94d',
    生物: '#8bdc75',
  });

  const LEVEL_NAMES = Object.freeze([
    '新芽', '识途者', '求知旅人', '星图绘手', '思维工匠',
    '博闻向导', '知境守望', '万象贤者',
  ]);

  const ACHIEVEMENTS = Object.freeze([
    {
      id: 'first', name: '初次点灯', desc: '完整读完第 1 篇复习资料',
      icon: 'spark', metric: 'documents', target: 1, xp: 10, coins: 3,
    },
    {
      id: 'explorer', name: '五篇小径', desc: '累计完整读完 5 篇复习资料',
      icon: 'book', metric: 'documents', target: 5, xp: 30, coins: 10,
    },
    {
      id: 'collector', name: '五科巡游', desc: '五个学科都至少读完 1 篇',
      icon: 'cards', metric: 'subjectsSeen', target: 5, xp: 35, coins: 12,
    },
    {
      id: 'master5', name: '十五篇精读', desc: '累计完整读完 15 篇复习资料',
      icon: 'trophy', metric: 'documents', target: 15, xp: 50, coins: 20,
    },
    {
      id: 'master15', name: '半百卷宗', desc: '累计完整读完 50 篇复习资料',
      icon: 'shield', metric: 'documents', target: 50, xp: 100, coins: 40,
    },
    {
      id: 'streak3', name: '三日营火', desc: '连续打卡达到 3 天',
      icon: 'flame', metric: 'streakPeak', target: 3, xp: 40, coins: 15,
    },
    {
      id: 'streak7', name: '七日星轨', desc: '连续打卡达到 7 天',
      icon: 'calendar', metric: 'streakPeak', target: 7, xp: 100, coins: 35,
    },
    {
      id: 'level5', name: '营地远行家', desc: '学习者等级达到 LV.5',
      icon: 'shield', metric: 'level', target: 5, xp: 80, coins: 30,
    },
  ]);

  const REWARDS = Object.freeze([
    {
      id: 'frame', name: '松林头像框', desc: '为营地头像添上一圈金色描边，兑换后立即生效。',
      cost: 60, icon: 'frame', kind: '营地装扮', bg: '#2d2b22', color: '#ffd568',
    },
    {
      id: 'dusk', name: '暮色赤林外观', desc: '解锁暖红暮色主题，可在“我的档案”随时切换。',
      cost: 120, icon: 'moon', kind: '营地装扮', bg: '#2b2430', color: '#c99cff',
    },
    {
      id: 'fireflies', name: '苔猫与萤火', desc: '让一只苔猫伙伴常驻营地，夜里还有萤火虫随行。',
      cost: 160, icon: 'cat', kind: '营地伙伴', bg: '#1e2c26', color: '#83e6a5',
    },
    {
      id: 'break', name: '一杯认真奖励', desc: '用 200 叶币提醒自己：完成阶段目标后，认真休息一次。',
      cost: 200, icon: 'coffee', kind: '自我奖励', bg: '#2b211e', color: '#ffad78', repeat: true,
    },
  ]);

  return Object.freeze({
    SUBJECTS,
    LEVEL_NAMES,
    ACHIEVEMENTS,
    REWARDS,
    REVIEW_SUBJECTS: Object.freeze(Object.keys(SUBJECTS)),
  });
});
