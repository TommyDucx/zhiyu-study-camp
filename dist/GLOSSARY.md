# 领域词汇

本文件定义知屿中稳定的领域概念。代码、测试、文档和后续架构讨论应使用这里的名字。

| 术语 | 定义 | 代码入口 |
| --- | --- | --- |
| **复习文档（Review Document）** | 用户本机的一篇完整复习 HTML。路径是它在进度中的稳定 ID。 | `records[]` → `documents` |
| **复习资料库（Review Library）** | 通过文件夹权限连接的完整复习文档集合。内容不进入公开仓库。 | `src/content-source.js` |
| **分层索引（Review Tree）** | 由文件路径生成的“学科 → 教材 / 专题 → 章节 → 文档”结构。 | `src/library.js` |
| **大纲视图（Outline View）** | 按学科分 tab、可逐级展开或收起的目录树；适合扫描和搜索。 | `renderLibrary()` |
| **星图视图（Constellation View）** | 每次只显示当前层级及直属子节点，以中心节点和连线呈现；点击分支逐层深入。 | `renderGraph()` |
| **图形层级（Graph Level）** | 星图当前的中心节点及其直接子节点；不写入学习进度。 | `graphTrail` |
| **内容来源（Content Source）** | 提供文件记录与读取能力的**适配器**；现有目录句柄和 FileList 两种。 | `ZYContentSource` |
| **学习引擎（Learning Engine）** | 负责通读、每日委托、宝箱、成就和兑换规则的深层**模块**。 | `src/engine.js` |
| **进度状态（Progress State）** | 某学习者的完整可序列化数据：XP、叶币、文档进度、打卡、流水、成就与兑换。 | `engine.defaultState()` |
| **打开（Open）** | 在阅读器中加载一篇文档。打开本身不产生任何奖励。 | `engine.openDocument()` |
| **完整通读（Full Read）** | 阅读器从文档顶部滚动到底部后上报的一次完成。只有它会触发阅读奖励。 | `engine.completeDocument()` |
| **每日航线（Daily Route）** | 每个本地自然日的三项委托：打卡、读完第一篇、读完第二篇。 | `engine.quests()` |
| **连续打卡（Streak）** | 从今天（或昨天）向前追溯的连续打卡天数。 | `engine.metrics()` |
| **叶币（Leaf Coin）** | 可用于奖励兑换的本机货币，只由学习行为和成就产生。 | `state.coins` |
| **奖励（Reward）** | 补给站中的装扮或自我奖励。一次性奖励只能拥有一次。 | `src/data.js` → `REWARDS` |
| **成就（Achievement）** | 由通读篇数、覆盖学科、连续天数或等级自动解锁的里程碑。 | `engine.evaluateAchievements()` |
| **营地（Camp）** | 首页对学习进度的视觉呈现：角色、营火、宝箱、等级与装扮。 | `src/app.js` |
| **本机账号（Local Account）** | 仅存在于当前浏览器中的学习者身份，用于隔离多人进度。 | `src/storage.js` |
| **进度仓储（Progress Repository）** | 存储**接缝**上的**适配器**，当前为 Web Storage。 | `src/storage.js` |
| **目录句柄（Directory Handle）** | File System Access 授予的读取权限句柄，保存在 IndexedDB，不包含文件内容。 | `restoreHandle()` |
| **单文件交付（Single-file Delivery）** | 将样式、目录、引擎、索引、内容适配器与 UI 内联为一个可离线启动的 HTML 外壳。 | `scripts/build.mjs` |
