const test = require('node:test');
const assert = require('node:assert/strict');

const data = require('../src/data.js');
const { createEngine, dayKey, addDays } = require('../src/engine.js');

const engine = createEngine({
  achievements: data.ACHIEVEMENTS,
  rewards: data.REWARDS,
  levelNames: data.LEVEL_NAMES,
  subjects: data.REVIEW_SUBJECTS,
});

const at = (day = 22, hour = 10) => new Date(2026, 10, day, hour, 0, 0);
const doc = (id, subject = '数学') => ({
  documentId: `数学/复习/${id}.html`,
  title: id,
  subject,
  at: at(),
});

function fresh() {
  return engine.defaultState('测试学员');
}

test('new state starts with a starter balance and no reading progress', () => {
  const state = fresh();
  const snapshot = engine.snapshot(state);
  assert.equal(snapshot.xp, 0);
  assert.equal(snapshot.coins, 30);
  assert.equal(snapshot.level.level, 1);
  assert.equal(snapshot.uniqueDocuments, 0);
  assert.deepEqual(snapshot.quests.progress, 0);
});

test('opening a document records an open but never grants reading XP', () => {
  const state = fresh();
  const result = engine.openDocument(state, doc('直线与圆'));
  assert.equal(result.ok, true);
  assert.equal(state.documents['数学/复习/直线与圆.html'].opens, 1);
  assert.equal(state.documents['数学/复习/直线与圆.html'].reads, 0);
  assert.equal(state.xp, 0);
  assert.deepEqual(result.effects, []);
});

test('completing a document grants first-read XP and the first achievement', () => {
  const state = fresh();
  const result = engine.completeDocument(state, doc('直线与圆'));
  assert.equal(result.ok, true);
  assert.equal(state.documents['数学/复习/直线与圆.html'].reads, 1);
  assert.equal(state.xp, 55, '15 XP read + 30 XP first daily read + 10 XP first achievement');
  assert.equal(state.coins, 47);
  assert.ok(state.achievements.first);
  assert.deepEqual(engine.daily(state).reads, ['数学/复习/直线与圆.html']);
});

test('re-reading increments the read count but not the first-read reward', () => {
  const state = fresh();
  engine.completeDocument(state, doc('直线与圆'));
  const afterFirst = state.xp;
  engine.completeDocument(state, doc('直线与圆'));
  assert.equal(state.documents['数学/复习/直线与圆.html'].reads, 2);
  assert.equal(state.xp, afterFirst);
});

test('two distinct documents complete the daily route only once', () => {
  const state = fresh();
  engine.completeDocument(state, doc('直线与圆'));
  engine.completeDocument(state, doc('圆锥曲线'));
  assert.equal(engine.quests(state).readOne, true);
  assert.equal(engine.quests(state).readTwo, true);
  assert.equal(state.xp, 95);
  assert.equal(state.coins, 59);

  const checked = engine.checkIn(state, { at: at() });
  assert.equal(checked.ok, true);
  assert.equal(state.xp, 155, 'adds check-in and the all-route bonus');
  assert.equal(state.coins, 84);
  assert.equal(engine.quests(state).allDone, true);

  const repeated = engine.checkIn(state, { at: at() });
  assert.equal(repeated.ok, false);
  assert.equal(state.xp, 155);
});

test('daily chest stays locked until all three quests are complete and opens once', () => {
  const state = fresh();
  engine.completeDocument(state, doc('直线与圆'));
  const locked = engine.openChest(state, { at: at() });
  assert.equal(locked.ok, false);
  assert.equal(locked.reason, 'chest-locked');

  engine.completeDocument(state, doc('圆锥曲线'));
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

test('five subjects unlock the subject-wide achievement', () => {
  const state = fresh();
  const subjects = ['语文', '数学', '物理', '化学', '生物'];
  subjects.forEach((subject, index) => {
    engine.completeDocument(state, {
      documentId: `${subject}/总览.html`,
      title: `${subject}总览`,
      subject,
      at: at(22, 9 + index),
    });
  });
  assert.equal(engine.metrics(state).subjectsSeen, 5);
  assert.ok(state.achievements.collector);
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

test('normalization rejects unknown subjects and de-duplicates daily reads', () => {
  const state = engine.normalize({
    xp: -10,
    coins: '12',
    documents: {
      '数学/圆锥曲线.html': { opens: '2', reads: '1', subject: '数学', title: '圆锥曲线' },
      '伪学科/坏资料.html': { reads: 99, subject: '伪学科' },
    },
    daily: {
      '2026-11-22': { reads: ['数学/圆锥曲线.html', '数学/圆锥曲线.html', '伪学科/坏资料.html'] },
      nonsense: { reads: ['数学/圆锥曲线.html'] },
    },
    profile: { name: '  ', theme: 'neon' },
  });
  assert.equal(state.xp, 0);
  assert.equal(state.coins, 12);
  assert.equal(state.documents['伪学科/坏资料.html'].subject, '');
  assert.deepEqual(state.daily['2026-11-22'].reads, ['数学/圆锥曲线.html', '伪学科/坏资料.html']);
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
