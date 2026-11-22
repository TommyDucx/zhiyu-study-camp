# 领域词汇

本文件定义知屿中稳定的领域概念。代码、测试、文档和后续架构讨论应使用这里的名字。

| 术语 | 定义 | 代码入口 |
| --- | --- | --- |
| **知识卡（Knowledge Card）** | 一张围绕单一知识点的学习单元，包含摘要、核心笔记、易错提醒、自测题与来源。 | `src/data.js` → `cards` |
| **内容目录（Content Catalog）** | 全部知识卡、成就定义、奖励定义与等级名称的只读集合。它是数据，不是业务规则的执行者。 | `src/data.js` |
| **学习引擎（Learning Engine）** | 负责所有学习状态迁移与奖励判定的深层**模块**：翻卡、掌握、打卡、开宝箱、兑换。 | `src/engine.js` |
| **进度状态（Progress State）** | 某一学习者的完整可序列化数据：XP、叶币、卡片进度、打卡、流水、成就与兑换记录。 | `engine.defaultState()` |
| **每日航线（Daily Route）** | 每个本地自然日的三项学习委托：打卡、查看三张不同卡、掌握至少一张卡。 | `engine.quests()` |
| **掌握（Mastery）** | 学习者主动将知识卡标记为“已经掌握”。首次掌握会永久记入该卡的进度。 | `engine.setStatus()` |
| **连续打卡（Streak）** | 从今天（或昨天）向前追溯的连续打卡天数。 | `engine.metrics()` |
| **叶币（Leaf Coin）** | 可用于奖励兑换的本机货币。只由学习行为和成就产生，不能直接购买。 | `state.coins` |
| **奖励（Reward）** | 补给站中的装扮或自我奖励。一次性奖励只能拥有一次，可重复奖励按次数记录。 | `src/data.js` → `REWARDS` |
| **成就（Achievement）** | 由结构化指标自动解锁的里程碑；解锁时自动发放 XP 与叶币。 | `engine.evaluateAchievements()` |
| **营地（Camp）** | 首页对学习进度的视觉呈现：等级、营火、宝箱与装饰都会随状态变化。 | `src/app.js` |
| **本机账号（Local Account）** | 仅存在于当前浏览器中的学习者身份，用于隔离多人的进度，不是服务端账号。 | `src/storage.js` |
| **进度仓储（Progress Repository）** | 位于存储**接缝**上的**适配器**，当前实现为 Web Storage；未来可替换为 IndexedDB 或同步后端。 | `src/storage.js` |
| **单文件交付（Single-file Delivery）** | 将样式、目录、引擎、仓储与 UI 内联为一个可离线打开的 HTML 文件。它是发布产物，不是编辑源。 | `scripts/build.mjs` |
