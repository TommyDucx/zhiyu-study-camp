const test = require('node:test');
const assert = require('node:assert/strict');

const data = require('../src/data.js');
const { createEngine, dayKey, addDays } = require('../src/engine.js');

const engine = createEngine({
  cards: data.cards,
  achievements: data.ACHIEVEMENTS,
  rewards: data.REWARDS,
  levelNames: data.LEVEL_NAMES,
});

const at = (day = 22, hour = 10) => new Date(2026, 10, day, hour, 0, 0);

function fresh() {
  return engine.defaultState('测试学员');
}

test('new state starts with a starter balance and no progress', () => {
  const state = fresh();
  const snapshot = engine.snapshot(state);
  assert.equal(snapshot.xp, 0);
  assert.equal(snapshot.coins, 30);
  assert.equal(snapshot.level.level, 1);
  assert.equal(snapshot.mastered, 0);
  assert.deepEqual(snapshot.quests.progress, 0);
});

test('opening a card earns a one-time first-view reward but every view counts', () => {
  const state = fresh();
  const first = engine.openCard(state, { cardId: 'cn1', at: at() });
  assert.equal(first.ok, true);
  assert.equal(state.cards.cn1.views, 1);
  assert.equal(state.cards.cn1.status, 'learning');
  assert.equal(state.xp, 15, '5 XP first view + 10 XP first achievement');
  assert.equal(state.coins, 34);

  engine.openCard(state, { cardId: 'cn1', at: at() });
  assert.equal(state.cards.cn1.views, 2);
  assert.equal(state.xp, 15, 'first-view reward must not repeat');
  assert.equal(engine.daily(state).views.length, 1, 'daily quest counts unique cards');
});

test('three cards and one mastery complete the daily route exactly once', () => {
  const state = fresh();
  engine.openCard(state, { cardId: 'cn1', at: at() });
  engine.openCard(state, { cardId: 'ma1', at: at() });
  engine.openCard(state, { cardId: 'ph1', at: at() });
  const mastered = engine.setStatus(state, { cardId: 'cn1', status: 'mastered', at: at() });
  assert.equal(mastered.ok, true);
  assert.equal(state.xp, 95);
  assert.equal(state.coins, 58);

  const checked = engine.checkIn(state, { at: at() });
  assert.equal(checked.ok, true);
  assert.equal(state.xp, 155, 'includes check-in and the all-route bonus');
  assert.equal(state.coins, 83);
  assert.equal(engine.quests(state).allDone, true);

  const repeated = engine.checkIn(state, { at: at() });
  assert.equal(repeated.ok, false);
  assert.equal(state.xp, 155);
});

test('mastery bonus is permanent across later status changes', () => {
  const state = fresh();
  engine.openCard(state, { cardId: 'ma1', at: at() });
  engine.setStatus(state, { cardId: 'ma1', status: 'mastered', at: at() });
  const afterFirst = state.xp;
  engine.setStatus(state, { cardId: 'ma1', status: 'learning', at: at() });
  engine.setStatus(state, { cardId: 'ma1', status: 'mastered', at: at(23) });
  assert.equal(state.xp, afterFirst);
});

test('daily chest stays locked until all three quests are complete and opens once', () => {
  const state = fresh();
  engine.openCard(state, { cardId: 'cn1', at: at() });
  engine.openCard(state, { cardId: 'ma1', at: at() });
  engine.openCard(state, { cardId: 'ph1', at: at() });
  const locked = engine.openChest(state, { at: at() });
  assert.equal(locked.ok, false);
  assert.equal(locked.reason, 'chest-locked');

  engine.setStatus(state, { cardId: 'cn1', status: 'mastered', at: at() });
  engine.checkIn(state, { at: at() });
  const opened = engine.openChest(state, { at: at() });
  assert.equal(opened.ok, true);
  const after = state.xp;
  const again = engine.openChest(state, { at: at() });
  assert.equal(again.ok, false);
  assert.equal(state.xp, after);
});

test('streak is calculated across consecutive calendar days', () => {
  const state = fresh();
  engine.checkIn(state, { at: at(20) });
  engine.checkIn(state, { at: at(21) });
  engine.checkIn(state, { at: at(22) });
  assert.equal(engine.metrics(state).streak, 3);
  assert.equal(engine.metrics(state).bestStreak, 3);
  assert.ok(state.achievements.streak3, 'the 3-day achievement unlocks automatically');
});

test('rewards enforce balance, duplicate ownership and a repeatable item', () => {
  const state = fresh();
  state.coins = 500;
  const first = engine.redeem(state, { rewardId: 'frame', at: at() });
  assert.equal(first.ok, true);
  assert.equal(state.coins, 440);
  assert.equal(state.redemptions.length, 1);
  assert.equal(state.transactions[0].coins, -60);

  const duplicate = engine.redeem(state, { rewardId: 'frame', at: at() });
  assert.equal(duplicate.ok, false);
  assert.equal(duplicate.reason, 'already-owned');

  engine.redeem(state, { rewardId: 'break', at: at() });
  engine.redeem(state, { rewardId: 'break', at: at() });
  assert.equal(state.rewards.break, 2);

  state.coins = 0;
  const poor = engine.redeem(state, { rewardId: 'dusk', at: at() });
  assert.equal(poor.ok, false);
  assert.equal(poor.reason, 'insufficient-coins');
});

test('normalization rejects unknown ids and de-duplicates daily views', () => {
  const state = engine.normalize({
    xp: -10,
    coins: '12',
    cards: {
      cn1: { views: '3', status: 'mastered', lastView: '2026-11-22T00:00:00.000Z' },
      unknown: { views: 99, status: 'mastered' },
    },
    daily: {
      '2026-11-22': { views: ['cn1', 'cn1', 'unknown'], mastered: ['unknown', 'cn1'] },
      nonsense: { views: ['cn1'] },
    },
    profile: { name: '  ', theme: 'neon' },
  });
  assert.equal(state.xp, 0);
  assert.equal(state.coins, 12);
  assert.equal(Object.hasOwn(state.cards, 'unknown'), false);
  assert.deepEqual(state.daily['2026-11-22'].views, ['cn1']);
  assert.deepEqual(state.daily['2026-11-22'].mastered, ['cn1']);
  assert.equal(Object.hasOwn(state.daily, 'nonsense'), false);
  assert.equal(state.profile.name, '本机访客');
  assert.equal(state.profile.theme, 'paper');
});

test('levels use a quadratic curve and expose progress within the current level', () => {
  assert.equal(engine.levelInfo(99).level, 1);
  assert.equal(engine.levelInfo(100).level, 2);
  assert.equal(engine.levelInfo(300).level, 3);
  const info = engine.levelInfo(150);
  assert.equal(info.level, 2);
  assert.equal(info.current, 50);
  assert.equal(info.needed, 200);
  assert.equal(data.LEVEL_NAMES[0], '新芽');
});

test('dayKey is local-calendar based and addDays crosses month boundaries', () => {
  assert.equal(dayKey(new Date(2026, 10, 22, 23, 59)), '2026-11-22');
  assert.equal(addDays('2026-11-30', 1), '2026-12-01');
  assert.equal(addDays('2026-12-01', -1), '2026-11-30');
});
