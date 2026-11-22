/* Zhiyu Study Camp — learning engine.
 *
 * A DOM-free, storage-free module. The app talks to this module through a
 * small interface: openCard, setStatus, checkIn, openChest, redeem, snapshot.
 * All XP, coins, quests, achievements and level rules live behind that seam.
 */
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.ZYEngine = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  const VERSION = 2;
  const STATUSES = new Set(['unseen', 'learning', 'mastered']);
  const METRICS = new Set(['uniqueCards', 'subjectsSeen', 'mastered', 'streakPeak', 'level']);
  const DATE_KEY = /^\d{4}-\d{2}-\d{2}$/;

  function pad(value) {
    return String(value).padStart(2, '0');
  }

  function toDate(value) {
    const date = value instanceof Date ? value : new Date(value);
    return Number.isNaN(date.getTime()) ? new Date() : date;
  }

  function dayKey(value = new Date()) {
    const date = toDate(value);
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
  }

  function addDays(base, amount) {
    const date = new Date(`${base}T12:00:00`);
    date.setDate(date.getDate() + amount);
    return dayKey(date);
  }

  function asObject(value) {
    return value && typeof value === 'object' && !Array.isArray(value) ? value : {};
  }

  function asArray(value) {
    return Array.isArray(value) ? value : [];
  }

  function uniqueKnown(values, knownIds) {
    return [...new Set(asArray(values).filter((value) => knownIds.has(value)))];
  }

  function createEngine(config) {
    const cards = asArray(config && config.cards);
    const achievements = asArray(config && config.achievements);
    const rewards = asArray(config && config.rewards);
    const levels = asArray(config && config.levelNames);
    if (!cards.length) throw new Error('Learning engine needs at least one card.');
    if (!levels.length) throw new Error('Learning engine needs level names.');

    const cardIds = new Set(cards.map((card) => card.id));
    const achievementIds = new Set(achievements.map((achievement) => achievement.id));
    const rewardsById = new Map(rewards.map((reward) => [reward.id, reward]));
    if (cardIds.size !== cards.length) throw new Error('Duplicate card id.');
    if (achievementIds.size !== achievements.length) throw new Error('Duplicate achievement id.');
    if (rewardsById.size !== rewards.length) throw new Error('Duplicate reward id.');
    for (const achievement of achievements) {
      if (!METRICS.has(achievement.metric)) {
        throw new Error(`Unknown achievement metric: ${achievement.metric}`);
      }
    }

    function defaultState(profileName = '本机访客') {
      return {
        version: VERSION,
        xp: 0,
        coins: 30,
        cards: {},
        checkins: {},
        daily: {},
        achievements: {},
        awarded: {},
        rewards: {},
        redemptions: [],
        transactions: [],
        profile: {
          name: profileName,
          bio: '把零散的学习，慢慢连成自己的星图。',
          theme: 'paper',
        },
        createdAt: new Date().toISOString(),
        lastLevel: 1,
      };
    }

    function normalize(raw) {
      const base = defaultState();
      if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return base;
      const state = { ...base, ...raw };
      state.version = VERSION;
      state.xp = Math.max(0, Number(state.xp) || 0);
      state.coins = Math.max(0, Number(state.coins) || 0);
      state.cards = {};
      for (const [id, value] of Object.entries(asObject(raw.cards))) {
        if (!cardIds.has(id)) continue;
        const card = asObject(value);
        state.cards[id] = {
          views: Math.max(0, Number(card.views) || 0),
          status: STATUSES.has(card.status) ? card.status : 'unseen',
          lastView: typeof card.lastView === 'string' ? card.lastView : null,
          ...(typeof card.masteredAt === 'string' ? { masteredAt: card.masteredAt } : {}),
        };
      }
      state.checkins = {};
      for (const [day, value] of Object.entries(asObject(raw.checkins))) {
        if (!DATE_KEY.test(day)) continue;
        state.checkins[day] = { ts: asObject(value).ts || new Date().toISOString() };
      }
      state.daily = {};
      for (const [day, value] of Object.entries(asObject(raw.daily))) {
        if (!DATE_KEY.test(day)) continue;
        const entry = asObject(value);
        state.daily[day] = {
          views: uniqueKnown(entry.views, cardIds),
          mastered: uniqueKnown(entry.mastered, cardIds),
        };
      }
      state.achievements = {};
      for (const id of achievementIds) {
        if (typeof asObject(raw.achievements)[id] === 'string') {
          state.achievements[id] = raw.achievements[id];
        }
      }
      state.awarded = {};
      for (const [key, value] of Object.entries(asObject(raw.awarded))) {
        if (typeof value === 'string') state.awarded[key] = value;
      }
      state.rewards = {};
      for (const [id, value] of Object.entries(asObject(raw.rewards))) {
        if (rewardsById.has(id)) state.rewards[id] = Math.max(0, Number(value) || 0);
      }
      state.redemptions = asArray(raw.redemptions)
        .filter((entry) => entry && typeof entry === 'object')
        .slice(0, 120)
        .map((entry) => ({
          id: String(entry.id || ''),
          rewardId: String(entry.rewardId || ''),
          name: String(entry.name || ''),
          cost: Math.max(0, Number(entry.cost) || 0),
          ts: String(entry.ts || new Date().toISOString()),
        }));
      state.transactions = asArray(raw.transactions)
        .filter((entry) => entry && typeof entry === 'object')
        .slice(0, 240)
        .map((entry) => ({
          id: String(entry.id || ''),
          ts: String(entry.ts || new Date().toISOString()),
          label: String(entry.label || ''),
          xp: Number(entry.xp) || 0,
          coins: Number(entry.coins) || 0,
          balance: Number(entry.balance) || 0,
        }));
      const safeProfile = asObject(raw.profile);
      const displayName = String(safeProfile.name || '').trim().slice(0, 20) || base.profile.name;
      state.profile = {
        ...base.profile,
        ...safeProfile,
        name: displayName,
        bio: String(safeProfile.bio || base.profile.bio).slice(0, 80),
        theme: safeProfile.theme === 'dusk' ? 'dusk' : 'paper',
      };
      state.createdAt = typeof raw.createdAt === 'string' ? raw.createdAt : base.createdAt;
      state.lastLevel = Math.max(1, Math.floor(Number(raw.lastLevel) || 1));
      return state;
    }

    function everyDay(state) {
      return asObject(state.daily);
    }

    function daily(state, day = dayKey()) {
      state.daily = asObject(state.daily);
      if (!state.daily[day]) state.daily[day] = { views: [], mastered: [] };
      state.daily[day].views = asArray(state.daily[day].views);
      state.daily[day].mastered = asArray(state.daily[day].mastered);
      return state.daily[day];
    }

    function levelInfo(xp) {
      let level = 1;
      while (xp >= 50 * level * (level + 1) && level < 99) level += 1;
      const start = 50 * level * (level - 1);
      const next = 50 * level * (level + 1);
      return {
        level,
        start,
        next,
        current: xp - start,
        needed: next - start,
        percent: Math.min(100, ((xp - start) / (next - start)) * 100),
        name: levels[Math.min(level - 1, levels.length - 1)],
      };
    }

    function currentStreak(state, day = dayKey()) {
      let cursor = state.checkins[day] ? day : addDays(day, -1);
      let count = 0;
      while (state.checkins[cursor]) {
        count += 1;
        cursor = addDays(cursor, -1);
      }
      return count;
    }

    function bestStreak(state) {
      const days = Object.keys(state.checkins).sort();
      let best = 0;
      let run = 0;
      let previous = null;
      for (const day of days) {
        run = previous && addDays(previous, 1) === day ? run + 1 : 1;
        best = Math.max(best, run);
        previous = day;
      }
      return best;
    }

    function metrics(state) {
      const values = Object.values(state.cards);
      const viewedIds = Object.keys(state.cards).filter((id) => state.cards[id].views > 0);
      const subjectsSeen = new Set(
        viewedIds.map((id) => cards.find((card) => card.id === id)?.subject).filter(Boolean)
      ).size;
      const mastered = values.filter((card) => card.status === 'mastered').length;
      const totalViews = values.reduce((sum, card) => sum + (Number(card.views) || 0), 0);
      return {
        uniqueCards: viewedIds.length,
        subjectsSeen,
        mastered,
        totalViews,
        streak: currentStreak(state),
        bestStreak: bestStreak(state),
        checkinDays: Object.keys(state.checkins).length,
      };
    }

    function quests(state, day = dayKey()) {
      const entry = daily(state, day);
      return {
        checkin: Boolean(state.checkins[day]),
        views: entry.views.length,
        mastered: entry.mastered.length,
        reviewDone: entry.views.length >= 3,
        masterDone: entry.mastered.length >= 1,
        allDone:
          Boolean(state.checkins[day]) && entry.views.length >= 3 && entry.mastered.length >= 1,
        progress: [
          Boolean(state.checkins[day]),
          entry.views.length >= 3,
          entry.mastered.length >= 1,
        ].filter(Boolean).length,
      };
    }

    function achievementValue(state, achievement) {
      const snapshot = metrics(state);
      switch (achievement.metric) {
        case 'uniqueCards':
          return snapshot.uniqueCards;
        case 'subjectsSeen':
          return snapshot.subjectsSeen;
        case 'mastered':
          return snapshot.mastered;
        case 'streakPeak':
          return Math.max(snapshot.streak, snapshot.bestStreak);
        case 'level':
          return levelInfo(state.xp).level;
        default:
          return 0;
      }
    }

    function transaction(state, label, xp, coins, at) {
      state.transactions = asArray(state.transactions);
      state.transactions.unshift({
        id: `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`,
        ts: toDate(at).toISOString(),
        label,
        xp,
        coins,
        balance: state.coins,
      });
      state.transactions = state.transactions.slice(0, 240);
    }

    function grant(state, key, xp, coins, label, at, effects) {
      if (state.awarded[key]) return false;
      state.awarded[key] = toDate(at).toISOString();
      state.xp += xp;
      state.coins += coins;
      transaction(state, label, xp, coins, at);
      if (effects) effects.push({ kind: 'reward', title: label, xp, coins });
      return true;
    }

    function evaluateAchievements(state, at, effects) {
      for (const achievement of achievements) {
        if (state.achievements[achievement.id]) continue;
        if (achievementValue(state, achievement) < achievement.target) continue;
        state.achievements[achievement.id] = toDate(at).toISOString();
        grant(state, `achievement:${achievement.id}`, achievement.xp, achievement.coins,
          `解锁成就 · ${achievement.name}`, at, null);
        if (effects) {
          effects.push({
            kind: 'achievement',
            title: `解锁成就 · ${achievement.name}`,
            text: `+${achievement.xp} XP · +${achievement.coins} 叶币`,
            xp: achievement.xp,
            coins: achievement.coins,
          });
        }
      }
    }

    function evaluateLevel(state, effects) {
      const info = levelInfo(state.xp);
      if (info.level <= (state.lastLevel || 1)) return;
      state.lastLevel = info.level;
      if (effects) {
        effects.push({
          kind: 'level',
          title: `营地升至 LV.${info.level}`,
          text: `获得新称号「${info.name}」，继续向下一座岛屿出发。`,
        });
      }
    }

    function settleDaily(state, at, effects) {
      const day = dayKey(at);
      const entry = daily(state, day);
      if (entry.views.length >= 3) {
        grant(state, `quest:views:${day}`, 30, 10, '今日航线 · 博览三张', at, effects);
      }
      if (entry.mastered.length >= 1) {
        grant(state, `quest:master:${day}`, 25, 8, '今日航线 · 攻克一点', at, effects);
      }
      if (state.checkins[day] && entry.views.length >= 3 && entry.mastered.length >= 1) {
        grant(state, `quest:all:${day}`, 40, 15, '今日全航线完成', at, effects);
      }
      evaluateAchievements(state, at, effects);
      evaluateLevel(state, effects);
    }

    function result(ok, effects, reason) {
      return { ok, effects: effects || [], reason };
    }

    function openCard(state, options) {
      const cardId = options && options.cardId;
      const at = toDate(options && options.at);
      if (!cardIds.has(cardId)) {
        return result(false, [{ kind: 'info', title: '知识卡不存在', text: '这张卡可能已从内容目录移除。' }], 'unknown-card');
      }
      const card = cards.find((entry) => entry.id === cardId);
      const effects = [];
      if (!state.cards[cardId]) {
        state.cards[cardId] = { views: 0, status: 'unseen', lastView: null };
      }
      const progress = state.cards[cardId];
      progress.views += 1;
      progress.lastView = at.toISOString();
      if (progress.status === 'unseen') progress.status = 'learning';
      const entry = daily(state, dayKey(at));
      if (!entry.views.includes(cardId)) entry.views.push(cardId);
      grant(state, `first-view:${cardId}`, 5, 1, `新知识已点亮 · ${card.title}`, at, effects);
      settleDaily(state, at, effects);
      return result(true, effects);
    }

    function setStatus(state, options) {
      const cardId = options && options.cardId;
      const status = options && options.status;
      const at = toDate(options && options.at);
      if (!cardIds.has(cardId)) {
        return result(false, [{ kind: 'info', title: '知识卡不存在', text: '这张卡可能已从内容目录移除。' }], 'unknown-card');
      }
      if (!STATUSES.has(status)) {
        return result(false, [{ kind: 'info', title: '未知的掌握状态', text: '请选择一个有效状态。' }], 'unknown-status');
      }
      const card = cards.find((entry) => entry.id === cardId);
      const effects = [];
      if (!state.cards[cardId]) {
        state.cards[cardId] = { views: 0, status: 'unseen', lastView: null };
      }
      const progress = state.cards[cardId];
      const firstMastery = status === 'mastered' && !progress.masteredAt;
      progress.status = status;
      if (status === 'mastered') {
        progress.masteredAt = progress.masteredAt || at.toISOString();
        if (firstMastery) {
          const entry = daily(state, dayKey(at));
          if (!entry.mastered.includes(cardId)) entry.mastered.push(cardId);
          grant(state, `mastered:${cardId}`, 15, 4, `掌握新知识 · ${card.title}`, at, effects);
          settleDaily(state, at, effects);
        }
      }
      return result(true, effects);
    }

    function checkIn(state, options) {
      const at = toDate(options && options.at);
      const day = dayKey(at);
      if (state.checkins[day]) {
        return result(false, [{ kind: 'info', title: '今天已经打过卡', text: '明天再来，让营火继续亮着。' }], 'already-checked-in');
      }
      const effects = [];
      state.checkins[day] = { ts: at.toISOString() };
      grant(state, `checkin:${day}`, 20, 10, '今日打卡成功', at, effects);
      settleDaily(state, at, effects);
      return result(true, effects);
    }

    function openChest(state, options) {
      const at = toDate(options && options.at);
      const day = dayKey(at);
      const current = quests(state, day);
      if (current.progress < 3) {
        return result(false, [{
          kind: 'info',
          title: '宝箱还没有响应',
          text: `完成今日航线上的全部 3 项委托后，宝箱就会亮起。还差 ${3 - current.progress} 项。`,
        }], 'chest-locked');
      }
      const effects = [];
      const awarded = grant(state, `chest:${day}`, 20, 10, '开启今日战利品宝箱', at, effects);
      if (!awarded) {
        return result(false, [{ kind: 'info', title: '今日宝箱已经开过', text: '里面的战利品已经收入账中，明天再战。' }], 'chest-opened');
      }
      evaluateAchievements(state, at, effects);
      evaluateLevel(state, effects);
      return result(true, effects);
    }

    function redeem(state, options) {
      const reward = rewardsById.get(options && options.rewardId);
      const at = toDate(options && options.at);
      if (!reward) {
        return result(false, [{ kind: 'info', title: '奖励不存在', text: '这件奖励已从补给站下架。' }], 'unknown-reward');
      }
      const count = Number(state.rewards[reward.id] || 0);
      if (count && !reward.repeat) {
        return result(false, [{ kind: 'info', title: '已经拥有这件奖励', text: '装扮已自动生效，无需重复兑换。' }], 'already-owned');
      }
      if (state.coins < reward.cost) {
        return result(false, [{
          kind: 'info',
          title: '叶币还不够',
          text: `还差 ${reward.cost - state.coins} 叶币，完成今日航线可以继续积累。`,
        }], 'insufficient-coins');
      }
      state.coins -= reward.cost;
      state.rewards[reward.id] = count + 1;
      state.redemptions = asArray(state.redemptions);
      state.redemptions.unshift({
        id: `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`,
        rewardId: reward.id,
        name: reward.name,
        cost: reward.cost,
        ts: at.toISOString(),
      });
      state.redemptions = state.redemptions.slice(0, 120);
      transaction(state, `兑换 · ${reward.name}`, 0, -reward.cost, at);
      const effects = [{
        kind: 'reward',
        title: `兑换成功 · ${reward.name}`,
        text: reward.id === 'break' ? '现在，去兑现一次认真的休息吧。' : '新装扮已经送入营地。',
        xp: 0,
        coins: -reward.cost,
      }];
      evaluateAchievements(state, at, effects);
      evaluateLevel(state, effects);
      return result(true, effects);
    }

    function reconcile(state, options) {
      const at = toDate(options && options.at);
      const effects = [];
      evaluateAchievements(state, at, effects);
      evaluateLevel(state, effects);
      return result(true, effects);
    }

    function snapshot(state) {
      const info = levelInfo(state.xp);
      const computed = metrics(state);
      return {
        ...computed,
        level: info,
        xp: state.xp,
        coins: state.coins,
        quests: quests(state),
        achievements: Object.fromEntries(
          achievements.map((achievement) => {
            const value = achievementValue(state, achievement);
            return [achievement.id, {
              value,
              target: achievement.target,
              unlocked: Boolean(state.achievements[achievement.id]),
            }];
          })
        ),
      };
    }

    return Object.freeze({
      version: VERSION,
      defaultState,
      normalize,
      daily,
      quests,
      levelInfo,
      metrics,
      achievementValue,
      currentStreak,
      bestStreak,
      openCard,
      setStatus,
      checkIn,
      openChest,
      redeem,
      reconcile,
      snapshot,
    });
  }

  return Object.freeze({ createEngine, dayKey, addDays });
});
