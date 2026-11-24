# Olfia 网站文案 v1 · Editorial & UX Copy Draft

- 基准：`olfia-site-copy-v0-current.md`（v3-design, f063bf7）。原文件保留不变。
- 范围：全站 §0–12、附录 A–C；不含 The Edit 文章正文、标题及文章参考文献。
- 状态：已确认方向后的英文文案稿，尚未部署。文案不是功能实现。
- 阅读：每个页面沿用原结构及元素标签；`{…}` 为原有动态变量。`[NEW COPY]` 为新增文字；`[NEW UI]` 为开发指令，不展示给用户；`[RESEARCH SOURCES]` 为研究出处；`[VERIFY]` 为部署前需技术确认事项。原有 (T)/(C) 标记仅用于 v0 溯源，本稿不再混用。
- 实施原则：保留路由、数据键、选项映射、quiz 计分与产品逻辑。仅改显示文字；新增区块另行实现。涉及本地存储、推荐、分享及订阅的陈述以实际实现为准。
- 英文采用美式拼写；标题及专名使用固定大小写，操作按钮采用 sentence case。

---

## 0 全站通用

### 0.1 浏览器标题和分享信息 [Meta]
- 默认标题：`Olfia — For the rooms you live in, and the ones you imagine.`
- 各页标题格式：`{页面名} · Olfia`
- 页面名：My Page / Scent Atlas / Capture / Scent Card / The Olfia Edit / Gift Card / Gifts / Scent Quiz / Privacy / Rooms / Scentpedia
- 网站描述（搜索结果里那句）：`Explore fragrance families, design room atmospheres, and keep a personal scent journal with Olfia, a home fragrance platform.`
- 分享卡片标题：`Olfia`
- 分享卡片描述：`Make your scent, create your rooms.`
- 分享图片说明 [A11y]：`Olfia, with dried rose, orange, lavender, cedar, vanilla, cinnamon and linen on cream paper`
- [A11y] `Skip to content`

### 0.2 顶部导航
结构：Olfia 字标 ｜ 五个入口（各带子菜单）｜ 头像图标（My Page）

- 字标：`Olfia` [A11y] `Olfia, home`
- **Capture**
  - `Capture a scent`
  - `Scent Cards`
- **Rooms**
  - `Create an atmosphere`
  - `Fragrance Matches`
- **Scent Atlas**
  - 菜单顶部小字 [Hint]：`Your personal archive of scent.`
  - `Fragrance Shelf`
  - `Scent Journal`
- **Discover**
  - `Olfia · Gifts`
  - `Scentpedia`
- **The Edit**（无子菜单）
- 头像图标 [A11y] `My Page`
  - `Account`
  - `Settings`
- 手机菜单按钮 [A11y]：`Open menu` / `Close menu`

> [NEW UI] 同步导航与页面标签；保持旧路由、锚点及数据键。

### 0.3 页脚
结构：字标块 ｜ Capture ｜ Rooms ｜ Scent Atlas ｜ Discover ｜ The Edit ｜ About Olfia → 邮件订阅 → 底栏

- 字标块
  - `Olfia`
  - [Body] `For the rooms you live in, and the ones you imagine.`
  - 邮箱链接：你的 USC 邮箱
  - [A11y] `Instagram (coming soon)`、`小红书 (coming soon)`
- 五栏：同导航（见 0.2）
- **About Olfia**：`The Concept` / `How it Works` / `The Creator`
- 邮件订阅
  - [H] `A little more to discover.`
  - [Body] [NEW COPY] `Stay in touch for news and inspiration from Olfia.`
  - [Placeholder] `Email address`
  - [Button] `Count me in`
  - 下拉 [Label]：`Where did you find Olfia?`
  - [Option]：`Instagram` / `RedNote` / `Pinterest` / `A friend` / `Google` / `Somewhere else`
  - [Hint] `Occasional notes from Olfia. Unsubscribe anytime.`
  - 成功：`You’re in. Welcome to Olfia.`
  - [Error] `We couldn’t save your subscription. Please try again.`
- 底栏：`© 2026 Olfia` ｜ `Privacy` ｜ `A USC DSM596 capstone project`

### 0.4 右下角测试小窗（除了 /quiz 每页都有）
- 没做测试时
  - [Card] `Find your scent personality`
  - [Button] `Take the quiz`
- 做过测试后
  - [Card] `{角色名}`，比如 `The Guardian`
  - [Button] `See your result`
- [A11y] `Scent personality quiz`、`Minimize quiz panel`、`Close quiz panel`

### 0.5 弹窗
**Mock 登录 / 注册**（只在加载了示例数据时出现）
- 字标：`Olfia`
- [H2] `Welcome back`（注册：`Create your account`）
- [Label] `Email`、`Password`
- `Remember me` ｜ [Link] `Forgot password?`
  - 点了之后：`Password reset will be available when accounts launch.`
- [Button] `Sign in`（注册：`Create account`）
- [Hint] `This is a sign-in preview. Your email and password are not saved or sent.`
- 分隔线：`or`
- [Button] `Continue with Google`
- 切换：`New to Olfia?` [Link] `Create an account` ／ `Already have an account?` [Link] `Sign in`
- 右半边图上的字：`Life, through scent.`

**Olfia Plus 还没开放**
- [H2] `Olfia Plus isn’t open yet.`
- [Body] `Leave your email to receive updates about the launch.`
- 下面是邮件订阅框（同 0.3，没有标题那句）

**存第三个房间时**
- [H2] `You can save up to two rooms on the free plan.`
- 两张方案卡（同 10.5）
- [Button] `Replace a saved room` ｜ [Link] `Not now`
- 第二步
  - [H2] `Which room should this one replace?`
  - 已存房间列表：`{房间名} · {你给它的名字}` + 日期
  - [Body] `The selected room will be removed from this browser and replaced with your new room.`
  - [Button] `Replace this room` ｜ [Link] `Back`

### 0.6 提示条 [Toast]（底部弹出）
- `Saved to your Scent Atlas` + 链接 `Open Scent Atlas` / `Open`（空间受限时）
- `Sample pages added to your Scent Atlas`（+ `Open Scent Atlas`）
- `Link copied` ｜ `Couldn’t copy the link. Try again.`（两种错误共用）
- `Couldn’t create the image. Please try again.`
- `Image saved` ｜ `Scent Card saved` ｜ `Image saved. Open your social app to share it.` ｜ `Gift card saved`
- `Added to your Fragrance Shelf`（两种成功状态共用） ｜ `Fragrance saved without its photo. Your browser storage is full.`
- `Couldn’t save this entry in your browser. Try freeing up storage and saving again.`
- `Signed out` ｜ `Local data cleared`
- 统计开关：`Visits from this browser are excluded from analytics.` ／ `Visits from this browser are included in analytics again.`

---

## 1 首页 `/`

结构：
```
01–02 首屏（左：文字；右：主视觉拼贴板）
  轮盘：Discover the Seven Scent Families
  The Olfia Edit
  Gifts
  房间预设：Imagine a room, down to its scent
04 About Olfia（The Concept / How it Works / The Creator）
  结尾邀请：That scent you loved?
05 右下角测试小窗（见 0.4）
```
> [IMPLEMENTATION NOTE] v0 中尚未实现的 “The same room, a different feeling” 不在本轮开发范围；保留现有首页顺序。

### 1.1 首屏
- [H1] `Life, through scent.`
- [Lead] `A personal home fragrance platform to explore scents, design room atmospheres, and document your sensory experiences.`
- 三行功能
  - `Capture` — `Record the scents you encounter in everyday life.`
  - `Rooms` — `Explore fragrance and design your ideal room atmosphere.`
  - `Scent Atlas` — `Your personal archive of scents, spaces, and memories.`
- [Button] `Capture a scent` ｜ `Design your space`
- 右边拼贴板上的手写字：`reading corner, by the window`
- [A11y] `Scent design board: select a pinned reference to try it on the room sketch`；两张小图：`Bookshop photograph`、`Courtyard sketch`

### 1.2 轮盘
- [H2] `Discover the Seven Scent Families`
- [Lead] `Turn the dial, explore the fragrance wheel.`
- [NEW UI] 右侧知识卡随当前家族切换；删除相邻家族自动搭配断言。保留原七家族、轮盘交互、Rooms 及 Scentpedia 跳转。采用短描述、可扫描信息和可展开 Recipe；手机端纵向排版。
- [H3] `{家族名}`
- [Label] `Signature notes` / `At home` / `Scent pairing` / `Your first scent recipe`
- [Hint] [NEW COPY] `Start with one fragrance. To explore a pairing, look for a product containing both notes, or try separately used products one at a time according to their directions. Keep the scent gentle, and stop if it feels overwhelming.`
- [Button] `Try {家族名} in a room` ｜ [Link] `Explore in Scentpedia`
- [NEW COPY] 下列每一家族为独立知识卡。Recipe 是编辑示范，不是精油配方、固定比例或已验证效果。

#### Floral
- [Body] `Petal-like · Dewy · Powdery. Flowers can feel like crisp petals, a full bouquet, or a powdery cosmetic accord.`
- [Label] Signature notes: `Rose, jasmine, peony, orange blossom, iris`
- [Body] At home: `Think of flowers on a dining table, a spring garden, or a powdery dressing room. Choose a fresh floral for a lighter impression or iris for a more velvety one.`
- [Body] Scent pairing: `Bergamot gives rose a crisp opening; soft woods offer a warmer background.`
- [H4] `Flowers by the window`
- [Label] `Main scent: Rose` / `Accent: Bergamot`
- [Body] `Try a rose-led fragrance with a trace of citrus. Notice whether the rose feels more like freshly cut flowers or a sweeter bouquet.`
- [RESEARCH SOURCES] R2, R3, R9, R10 (pairing perception); application is Olfia editorial guidance.

#### Gourmand
- [Body] `Toasted · Creamy · Sweet. Food-inspired notes evoke roasted coffee, caramel, and creamy desserts.`
- [Label] Signature notes: `Vanilla, tonka, honey, coffee, caramel`
- [Body] At home: `Explore food-like aromas in a living room or dining nook; roasted notes can feel quite different from sugary ones.`
- [Body] Scent pairing: `Coffee brings roasted bitterness to vanilla; cedar can introduce a drier contrast.`
- [H4] `Sunday coffee`
- [Label] `Main scent: Vanilla` / `Accent: Coffee`
- [Body] `Look for a vanilla-and-coffee candle or diffuser. Start gently and see whether the toasted note balances the sweetness.`
- [RESEARCH SOURCES] R2, R4, R9, R10 (pairing perception); application is Olfia editorial guidance.

#### Warm & Spicy
- [Body] `Resinous · Spiced · Balsamic. Resins and spices range from sweet amber to dry incense and clove.`
- [Label] Signature notes: `Amber, cinnamon, clove, frankincense, tobacco`
- [Body] At home: `Try resinous or spiced notes on an autumn evening, in a sitting room, or around a seasonal gathering.`
- [Body] Scent pairing: `Cedar gives amber a dry backbone; orange peel can lighten a dense spice impression.`
- [H4] `The first cold evening`
- [Label] `Main scent: Amber` / `Accent: Cedar`
- [Body] `Choose an amber-led fragrance with a dry wood accent. Compare it with a sweeter vanilla amber to learn which kind of warmth you prefer.`
- [RESEARCH SOURCES] R1, R2, R9, R10 (pairing perception); application is Olfia editorial guidance.

#### Woody & Earthy
- [Body] `Dry · Mossy · Smoky · Creamy. From pencil shavings to forest soil, wood-like scents vary in dryness and depth.`
- [Label] Signature notes: `Cedar, sandalwood, vetiver, oakmoss, patchouli`
- [Body] At home: `Try crisp cedar in a study, softer sandalwood in a bedroom, or vetiver when you want a more earthy character.`
- [Body] Scent pairing: `Bergamot brings contrast; amber adds warmth; green herbs can echo the forest-like quality.`
- [H4] `An afternoon in the study`
- [Label] `Main scent: Cedar` / `Accent: Bergamot`
- [Body] `Try a cedar-based product with a subtle citrus accent. Notice how the bright opening changes the impression of dry wood.`
- [RESEARCH SOURCES] R1, R5, R6, R9, R10 (pairing perception); application is Olfia editorial guidance.

#### Green & Herbal
- [Body] `Leafy · Aromatic · Bitter. Leaves, stems, and aromatic herbs bring distinct botanical impressions.`
- [Label] Signature notes: `Basil, tomato leaf, rosemary, lavender, green tea`
- [Body] At home: `Think of herbs on a kitchen windowsill or a green tea note beside a desk. A leafy fragrance can feel quite different from a floral herb.`
- [Body] Scent pairing: `Lemon emphasizes the brisk side of rosemary; soft woods give green notes a more grounded character.`
- [H4] `Herbs on the windowsill`
- [Label] `Main scent: Rosemary` / `Accent: Lemon`
- [Body] `Look for a rosemary-and-lemon fragrance or compare the two scents separately. Decide whether you prefer the herbal or citrus character to lead.`
- [RESEARCH SOURCES] R7, R9, R10 (pairing perception); application is Olfia editorial guidance.

#### Citrus & Fruit
- [Body] `Zesty · Juicy · Tart. Peel-like brightness and juicy fruit offer different kinds of freshness.`
- [Label] Signature notes: `Bergamot, lemon, blood orange, grapefruit, pear`
- [Body] At home: `Try bright citrus in an entryway or kitchen; consider a softer pear note when you want a less sharp fruit impression.`
- [Body] Scent pairing: `Green tea offers a leafy contrast to grapefruit; floral notes can soften a tart fruit profile.`
- [H4] `Windows open, morning`
- [Label] `Main scent: Grapefruit` / `Accent: Green tea`
- [Body] `Try a grapefruit-led fragrance with a tea-like accent. Compare it with a sweeter fruit fragrance and notice the difference in character.`
- [RESEARCH SOURCES] R1, R7, R9, R10 (pairing perception); application is Olfia editorial guidance.

#### Fresh & Clean
- [Body] `Airy · Watery · Linen-like. Aquatic and fabric-inspired accords evoke water, air, and freshly washed textiles.`
- [Label] Signature notes: `Sea salt, rain, ozone, cotton, cucumber`
- [Body] At home: `Explore a water-like scent in a bathroom or a fabric-inspired accord near freshly washed linens.`
- [Body] Scent pairing: `Lavender brings an herbal-floral accent to a cotton accord; citrus can make aquatic scents feel brighter.`
- [H4] `Fresh sheets, afternoon sun`
- [Label] `Main scent: Cotton accord` / `Accent: Lavender`
- [Body] `Choose a cotton-and-lavender home fragrance. Notice whether it reminds you more of fabric, flowers, or the air around an open window.`
- [RESEARCH SOURCES] R7, R8, R9, R10 (pairing perception); application is Olfia editorial guidance.

### 1.3 The Edit
- [H2] `The Olfia Edit`
- [Lead] `Culture, fragrance, and the art of living.`
- [Body] [NEW COPY] `Stories about familiar ingredients, the places we inhabit, and the traditions and habits that shape our sensory lives.`
- [Button] `Explore the Edit`
- 三张最新文章卡（文章内容不在本清单）

### 1.4 Gifts
- [H2] `Gifts`
- [Lead] `Find a fragrance for yourself or someone you have in mind.`
- [Button] `For myself` ｜ `For someone else`
- 三张礼物卡：`{品牌} · {类型}` / `{产品名}` / `{价格 · 容量}` 或 `Available in stores only` / `{家族}`

### 1.5 房间预设
- [H2] `Imagine a room, down to its scent.`
- [Lead] `Begin with a room we’ve put together. Change its objects and fragrance to suit the way you want to live.`
- [Button] `Explore Rooms`
- 三张预设卡
  - `Living room, late` — `A vanilla-clove candle, the record on side two, shoes kicked off after the last guest has left.`
  - `Bedroom, morning` — `A trace of bergamot from the diffuser, blinds half up, sheets still warm.`
  - `Study, afternoon` — `Cedar incense in slanting sun, an unfinished sketch, a pencil tucked behind one ear.`

### 1.6 About Olfia
- [H2] `About Olfia`
- [Lead] `Make your scent, create your rooms.`
- 左侧小目录：`The Concept` / `How it Works` / `The Creator`

**The Concept**
- [H3] `The Concept`
- [NEW UI] 扩展现有两张卡为四个独立 editorial sections；支持每段正文、图片/拼贴和可展开的 Research Notes。保留锚点；不要把研究编号显示进消费者正文。

#### 01 · Scent & Memory
- [H4] `Scent is an afterimage.`
- [Body] Think of a smell you recognize before you remember where you know it from. It might be the soap in a childhood bathroom, the paper in a bookstore, or the particular combination of cooking and laundry that made a place feel like home. Sometimes a familiar scent brings an entire scene to mind, including details that were never especially important at the time.
- [Body] Research on autobiographical memory has explored how odors can serve as cues to personal experiences, often with a striking emotional quality. The associations are individual: the same fragrance can recall very different things for different people. This is what the afterimage means to Olfia. An experience may be over, but an impression of it remains.
- [Body] Capture and Scent Atlas give that impression a place to live in words and images. A short note about where you were and how a scent felt can be enough to return to it later.
- [RESEARCH SOURCES] R11, R12. Afterimage is a brand metaphor, not a scientific equivalence.

#### 02 · Scent & Space
- [H4] `Olfactory, and utopia.`
- [Body] The name Olfia brings together olfactory, our sense of smell, and utopia, a word that plays on the idea of a good place and a place that does not exist. It holds two kinds of rooms in mind: the ones we live in, and the ones we are still imagining.
- [Body] Interior design tends to begin with the things we can see: furniture, color, texture, light. Yet a place also has an atmosphere shaped by what happens in it, from cooking to an open window and the scents we bring indoors. Researchers use the term smellscape to describe the olfactory character of an environment as it is experienced in context.
- [Body] Rooms is a playful way to consider this often overlooked dimension of a space. Try arranging familiar objects alongside fragrance families and different times of day. The design is an invitation to imagine an atmosphere and then explore what might work in your own home.
- [RESEARCH SOURCES] R13, R14. Rooms is conceptual design, not physical scent simulation.

#### 03 · Scent & Everyday Life [NEW COPY]
- [H4] `The art of everyday living.`
- [Body] A pot of coffee before work, sheets drying by the window, a handful of herbs on the kitchen counter. Many of the things that make a day feel distinctly ours happen without much ceremony. Fragrance is already woven into these activities, whether or not we think of ourselves as people who collect perfumes or buy scented candles.
- [Body] The idea of everyday aesthetics encourages us to pay attention to how ordinary objects, actions, and surroundings shape our experience. A home can be carefully arranged one day and full of the traces of cooking, work, or visitors the next. Both are part of its character.
- [Body] Olfia invites you to notice these changes and experiment with them. Keep a scent you enjoy, make a note about one you would rather avoid, or imagine something different for tomorrow. Your own experiences are the starting point.
- [RESEARCH SOURCES] R15, R16.

#### 04 · Scent & Culture [NEW COPY]
- [H4] `The worlds we know by scent.`
- [Body] The smell of a home tells us something about its inhabitants. It might come from what they cook, the plants they keep, the products they use to wash their clothes, or the materials they use during a celebration. These associations are learned through particular places, families, and communities. What feels familiar to one person may be entirely new to another.
- [Body] Scent also carries histories that are easy to overlook. Heritage researchers have investigated the smell of historic libraries, documenting the ways people describe old books alongside analysis of the materials themselves. Other work explores how walking through a place with attention to smell can reveal aspects of its cultural history.
- [Body] Scentpedia and The Olfia Edit grow out of this curiosity. By exploring the plants, ingredients, and traditions behind fragrance, we can better appreciate where our everyday scents come from and the many meanings people give them.
- [RESEARCH SOURCES] R13, R17, R18.

**How it Works**
- [H3] `How it Works`
- [H4] [NEW COPY] `Make yourself at home.`
- [Lead] `Start with something you’re curious about, a scent you want to remember, or a room you’ve been imagining.`
- [NEW UI] 删除环形图、中心节点、箭头和步骤编号；使用五个独立图文入口。桌面交错图文（现有拼贴素材或真实 UI 局部截图），移动端纵向；每个 CTA 独立，不暗示必经流程。

| 功能标签 | [H4] | [Body] | [Link] |
|---|---|---|---|
| Discover | Curious about a scent? | Get to know fragrance families, discover unfamiliar ingredients, and explore the stories behind the things we smell. | Explore Scentpedia |
| Rooms | Imagine a place of your own. | Arrange furniture and materials, choose fragrance families, and explore how time of day and an open window might change the atmosphere you imagine. | Design your space |
| Capture | Remember how it smelled. | Keep a record of a scent you encountered, where you were, what you were doing, and how it made you feel. | Capture a scent |
| Share | Send a piece of your world. | Turn a saved scent or room into a personal visual card to keep or share with someone. | Make a Scent Card |
| Scent Atlas | Watch your collection grow. | Revisit your room designs, scent notes, and fragrance shelf. See what you have collected as your interests and routines change. | Open your Scent Atlas |

- [H4] `Where the seven families come from`
- [Body] `Olfia adapts Michael Edwards’ Fragrance Wheel, which organizes perfume into related scent families, for the world of home fragrance. We group floral, amber and woody profiles alongside green and herbal, citrus and fruit, and fresh and clean scents; gourmand has its own category for edible associations. The categories overlap, so use them as a vocabulary for exploration. You can see the connections to Edwards’ wheel in Scentpedia.`
- [Link] `Fragrances of the World` / `Explore Scentpedia`
- [RESEARCH SOURCES] R1, R2, R19.
- [H4] `Where new ideas come from`
  - `The Olfia Edit` — `Culture, fragrance, and the art of living.`
  - `Olfia · Gifts` — `Find a fragrance for yourself or someone you have in mind.`

**The Creator**
- [H3] `The Creator`
- 头像位置（沿用）
- [Body] 信纸：

I’m a graduate student at USC Annenberg, and Olfia is my capstone project. It began with two habits of mine: paying attention to fragrance and the way it shapes my everyday experience, and finding ways to document and reflect on the small rituals that make up my days. I wanted to bring those two things together in a space that would make exploring fragrance feel both personal and approachable.

Having lived in China and the United States, I have also become interested in the different ways people scent their homes, mark the seasons, and use fragrant materials in celebrations and ceremonies. I find it fascinating that a smell can feel so familiar to one person and hold an entirely different association for someone else. Our experiences of fragrance are shaped by the places we have lived and by the people and cultures we encounter.

My interests in aesthetics, modern art, and cultural anthropology have led me to think about fragrance as part of a larger sensory experience. I am equally curious about botany, the environment, and the knowledge that different communities, including Indigenous communities, have developed about plants. These interests often meet in the seemingly ordinary materials used to scent a room. There is so much to learn about where they come from, how they are used, and the stories they carry.

Olfia is my way of making room for that curiosity. I hope it can become a place where people feel comfortable experimenting with the atmosphere of their homes, learning something unexpected about familiar scents, and keeping the experiences they want to remember. It is still a work in progress, and I hope the people who use it will find their own ways of making it meaningful.

- 签名：`Tiffany Liu` ｜ [Link] `Say hello`
- [VERIFY] Creator letter is based on v0's stated experiences and interests; creator approves first-person wording before publication.

### 1.7 结尾邀请
- [H2] `That scent you loved? Save it for later.`
- [Button] `Capture a scent`

---

## 2 Capture `/capture`（记录一个气味，9 步）

结构：进度条 → 一步一个问题 → 右侧明信片预览 → 保存

- [Lead] [NEW COPY] `Record a scent from today or a moment you still remember. Use Skip when you’re unsure about a detail.`
- [Hint] [NEW COPY] Step 9: `You can save scents you loved and ones you would rather avoid.`
- [NEW UI] Use the lead at the start and the hint at step 9 only; retain the nine-step flow and all existing options and values.

| 步 | 问题 [H2] | 选项 / 输入 |
|---|---|---|
| 1 | `What season was it?` | Spring / Summer / Autumn / Winter |
| 2 | `When did you notice it?` | Morning / Afternoon / Evening / Night |
| 3 | `Where did you notice it?` | Living room / Bedroom / Study / Reading corner / Kitchen / Bathroom / Closet / Entryway / Balcony / Car / Office / Other |
| 4 | `What was happening at the time?` | Everyday / Date / Party / Meditation / Bath / Sleep / Work / Guests over / Cleaning day / Holiday |
| 5 | `Where did the scent come from?` | Candle / Diffuser / Incense / Room spray / Essential oil / Fragrance-free / No specific source / Other |
| 6 | `Tell us more about the source.` | 切换 `A product` / `Something I did`；产品：[Label] `Brand or shop` [Placeholder] `e.g. Diptyque`，[Label] `Scent name` [Placeholder] `Cedar & Clove`；做的事：Open window / Simmer pot / Fresh flowers / Clean laundry / Baking / After rain / Other |
| 7 | `Which fragrance families describe it?` | [Hint] `Choose up to two`；[Lead] `We’ve suggested some families based on your source. Choose the ones that match what you smelled.`；七个家族 |
| 8 | `How did it make you feel?` | [Hint] `Choose up to two`；Calm / Cozy / Focused / Nostalgic / Energized / Romantic / Melancholy / Playful / Grounded / Fresh start / Restless / Safe |
| 9 | `How did you like the scent?` | `Loved it` / `Not for me`；[Label] `Name this moment` [Placeholder] `Sunday morning, windows open`；[Label] `A note to remember` (optional) [Placeholder] `Coffee on the table, rain drifting in through the window…`；[Label] `Tags` [Placeholder] `e.g. rainy day, reading` [Button] `Add` |

- 按钮：`Back` ｜ `Next` ｜ `Skip` ｜ 最后一步 `Save to Scent Atlas`
- 保存后：[Button] `Make a Scent Card from this entry`；[Toast] `Saved to your Scent Atlas` / `Open Scent Atlas`
- 右侧明信片：邮票上 `{家族名}` 或 `Olfia`；感受、名字、一句话、产品或来源、场合 · 时间、#标签、日期（都来自你填的内容）

---

## 3 Scent Card `/card`（做一张可以分享的卡片）

- [H1] `A little piece of your world, ready to share.`
- [Lead] [NEW COPY] `Give a scent memory or room design a visual form. Make a card to keep for yourself or share with someone.`
- [Label] `Template`：`Film` / `Instant` / `Postcard`
- [Label] `Aspect ratio`：`9:16` / `3:4`
- [Label] `Color`（七个家族）
- 开关：`Stamp` / `Atmosphere`
- [Label] `Families`
- [Label] `Stickers`；[Hint] `Drag a sticker to place it. Select it to resize or rotate.`
- [Label] `Notes`
  - `One line` [Placeholder] `What do you remember about this moment?`
  - `Room`；开关 `Show name`，[Label] `Name`；开关 `Show room` / `Show moment`；开关 `Show city`，[Label] `City`
- [Button] `Save image · {9:16}`（生成中：`Creating image…`）
- 分享图标 [A11y]：`Share to Instagram` / `Share to Pinterest` / `Share to X`
- [Hint] `PNG · 1080 px wide`
- 底部：`Start with a saved entry:` [Link] `Scent Atlas`
- 卡片上的固定字：`Olfia`、胶片边上 `olfia 400`、示例 `Cedar · Clove · Vanilla`、`Reading Corner`
- 分享标题：`My Scent Card`

---

## 4 Rooms `/rooms`（设计一个房间的气味）

结构：编辑器（左：物品抽屉；中：房间画面；右：设置）→ Your rooms → Fragrance Matches

### 4.1 编辑器
- [H1] [NEW COPY] `Imagine a room, down to its scent.`
- [Lead] [NEW COPY] `A room changes with its light, objects, and fragrance. Arrange a space and experiment with the atmosphere you would like to create.`
- [NEW UI] Add a compact intro above the editor, not inside its working canvas.
- [Hint] [NEW COPY] `Scent strength represents your imagined atmosphere, rather than a measured concentration.`
- 抽屉标签：`Furniture` / `Scent` / `Materials`；[Hint] `Select an object to add it, then drag it into place.`
- 工具 [A11y]：`Undo` / `Redo`；开关 `Snap to floor`
- 选中物品工具 [A11y]：`Rotate` / `Flip` / `Increase size` / `Decrease size` / `Bring to front` / `Send to back` / `Delete`
- 右侧设置
  - [Label] `Name your room` [Placeholder] `rain, chapter three`
  - [Label] `Room`：`Reading Corner` / `Kitchen` / `Bathroom`
  - [Label] `Scent strength`：两端 `barely there` ↔ `fills the room`
  - [Label] `Time of day`：`Morning` / `Afternoon` / `Night`
  - 开关 `Window open`
  - [Label] `Scent families` [Hint] `Choose up to three`
  - [Hint] `Explore {家族} as an additional scent.`
  - [Button] `Save room`（编辑已存房间时：`Save changes`）｜ `Make a card`
- 物品名称（抽屉里每样东西的名字）见附录 B

### 4.2 Your rooms
- [H2] `Your rooms` ｜ [Button] `New room`
- 卡片：日期、房间名、你给的名字；第一张有 `Continue`
- [Empty] `Save a room to keep your design here and return to it whenever you like.`

### 4.3 Fragrance Matches
- [H2] `Fragrance Matches`
- [Lead] [NEW COPY] `Explore products with fragrance families in common with your room. Use the match as a starting point, then consider how the product smells to you.`
- 筛选 [Label] `When`：`Any time` / `Mornings` / `Evenings` / `Warm months` / `Cold months`
- 产品卡：品牌 · 类型、名字、价格容量或 `Available in stores only`、香调、时间（`Any time of day`）、季节（`All year`）、`Shares the {家族} scent family with your design.`、[Link] `Explore similar fragrances`
- [Button] `Back to this room`
- [Empty] `No fragrances match these selections yet. Try another time filter or scent family.`
- [Hint] `Product links take you to the brand’s website. Olfia does not sell fragrances.`

---

## 5 Scent Atlas `/atlas`（你的个人档案）

- [H1] `Scent Atlas`
- [Lead] `Your rooms, ideas, and scent notes, all in one place.`
- [Body] [NEW COPY] `As your collection grows, revisit familiar scents, rediscover details from past days, and notice how your records change with the seasons.`
- 文件夹标签：`Scent Journal` / `Favorites` / `My Scentprint` / `Fragrance Shelf`

### 5.1 Scent Journal（拼图日历）
- [A11y] `Previous month` / `Next month`；星期 `Sun`–`Sat`
- [Empty] `Your journal is waiting for its first entry.`（手写）
  - `Capture a scent or save a room to start collecting pages in your monthly journal.`
  - [Button] `Capture a scent` / `Design a room` / `See a sample`
- 某天没有：`No entries for this day.` + [Link] `Capture a scent`
- 条目：`Rooms` 或 `Capture` · `{房间}`；`Star` / `Unstar`；[Button] `Open` / `Scent Card` / `Delete`
- 删除确认 [Dialog]：`Delete this entry from your Scent Atlas?`

**Monthly record（月票根）**
- `Monthly record`；[Empty] `No entries recorded in {月份} yet.` + `Capture a scent`
- `Most recorded`；`Families` / `Time of day` / `Tags`

### 5.2 Favorites
- 切换：`Starred rooms` / `Saved products`
- [Empty] `Star a room in your Scent Journal to find it here again.`
- [Empty] `Fragrances recorded in Capture will appear here.`；没名字的显示 `Unnamed fragrance`

### 5.3 My Scentprint
- [H2] [NEW COPY] `My Scentprint`
- [Lead] [NEW COPY] `A closer look at the details you’ve collected. Revisit the tags that connect your scent notes and make your archive easier to explore.`
- [NEW UI] Rename display tab only; show existing tags and profile data. Do not introduce new analytics or infer preferences unless implemented.
- [Empty] `Add tags when you capture a scent to start building your personal index.`

### 5.4 Fragrance Shelf（加你常用的产品）
- [Lead] [NEW COPY] `Keep the fragrances you own or use in one place, with a note about when and how you enjoy them.`
- [H2] `Add to your Fragrance Shelf`；切换 `Paste a link` / `Upload a photo`
- [Placeholder] `https://www.diptyqueparis.com/…`
- 照片：`Choose a photo of your bottle, candle or diffuser` / `Choose another photo`；[Button] `Skip photo`
- 读链接结果：`Found a match in Olfia’s fragrance catalog.` ／ `We found details on the product page. Review them before saving.` ／ `We found possible details from the link. Check them before saving.`
- 表单：`Fragrance name`（`Feu de Bois`）、`Brand`（`Diptyque`）、`Type`、`Scent families (up to two)`、`How you use it`（Every day / Mornings / Evenings / Weekends / Special occasions）、`A note (optional)`（`Two sprays in the hallway before guests arrive`）
- [Button] `Add to your Fragrance Shelf` ｜ `Cancel`；卡片上 `View product` / `Remove`
- [Empty] `Start a collection of the fragrances you use.`
- [Error] `Enter a valid website address.` ／ `Choose a photo to continue, or skip it.` ／ `We couldn’t open that photo. Try a JPEG or PNG file.` ／ `Enter a fragrance name before saving.` ／ `Your browser storage is full. Remove an item and try again.`
- [Dialog] `Remove this fragrance from your Fragrance Shelf?`

---

## 6 Gifts `/gifts` 和礼物卡 `/gifts/card`

### 6.1 Gifts
- [H1] `Gifts`
- [Lead] [NEW COPY] `A fragrance can be a way to think about someone’s home, their habits, and the things they enjoy.`
- [Body] [NEW COPY] For myself: `Explore a new fragrance inspired by your scent preferences or the atmosphere you want to create.`
- [Body] [NEW COPY] For someone else: `Think about the spaces they enjoy and the scents they might like. Choose a family to begin exploring.`
- 切换：`For myself` / `For someone else`
- For someone：[Label] `Recipient` [Placeholder] `Their name`；`Fragrance families they might like`（家族）
- For me：`Inspired by your quiz result and Scent Atlas` ／ `Inspired by your quiz result` ／ `Inspired by your Scent Atlas` ／ `Choose a scent family`；[Link] `Retake the quiz` ／ `Take the quiz`
- 礼物卡按钮：`Make a gift card`；图标 `Save to Scent Atlas` / `Saved to Scent Atlas`、`Save to Fragrance Shelf` / `On your Fragrance Shelf`、`Make a Scent Card`、`View on {品牌}’s website`；`Available in stores only`
- [Hint] `Product links take you to the brand’s website. Olfia does not sell fragrances.`

### 6.2 礼物卡
- [Lead] [NEW COPY] `Make a personal card with a fragrance in mind, and add a few words for the person you’re thinking of.`
- 返回：`Gifts`
- 卡片：`For {名字}`（没填：`For you`）、`olfia.studio`
- 表单：`To`（`Their name`）、`Note`、`From`（`Your name`）
- [Link] `View on {品牌}’s website`
- [Button] `Save image` ｜ `Share` ｜ `Copy link` ｜ `Save to Scent Atlas`

---

## 7 Scentpedia `/scentpedia`

结构：标题 → 测试区块 → 七个家族跳转 → 七张家族卡（每张：名字、一句话、香调、At home、材料图、小故事、试试链接）

- [H1] `Scentpedia`
- [Lead] `Get to know seven fragrance families through their ingredients, their character, and the stories behind them.`

### 7.1 测试区块（同首页原来的测试区块）
- 没做过
  - [H2] `Which scent feels like you?`
  - [Lead] `Twenty questions about your habits and sensory preferences. Meet one of sixteen scent characters, discover fragrance families to explore, and find a room to start with.`
  - [Button] `Take the quiz`；[Hint] `About three minutes`
- 做过
  - [H2] `You are {角色名}.`
  - [Lead] `{角色那句话}`
  - [Button] `See your result`；[Link] `Design a room in this style`

### 7.2 七大家族 · Family Guide
- [NEW UI] 每个家族展示约 180–220 英文词的独立介绍，分三段；保留材料图、原有香调数组和跳转。可折叠长文，但默认显示首段及明确的继续阅读入口。Little Story 为独立文章，见 7.3。
- [Label] `Signature notes` / `On the fragrance wheel` / `At home` / `Scent recipe`
- [Link] `Try {家族名} in a room` / `Read the little story` / `Show less` / `Research sources`
- [NEW COPY] [Body] `Fragrance families give us a language for describing scents. Olfia adapts Michael Edwards’ wheel for the home; our seven categories can overlap. A note describes an impression and may be an accord rather than a literal ingredient. Try them as a starting point for discovering what you enjoy.`
- [NEW UI] 引用 §1.2 的同一套 recipe 数据，避免两页不一致；下列家族正文与首页知识卡分别维护。
#### 01 · Floral
- [H3] `Floral`
- [Lead] `Petal-like · Dewy · Powdery`
- [Label] Signature notes: `Rose, jasmine, peony, orange blossom, iris`
- [Label] On the fragrance wheel: `Floral, Soft Floral`
- [Body] [NEW COPY]

A floral fragrance can bring to mind a single flower, a garden in full bloom, or the powdery scent of a dressing table. The differences lie in the qualities of the flowers and in the materials that surround them. Rose can be fresh and almost green or rich and honeyed; jasmine and orange blossom often have a fuller white-floral character. Peony tends to suggest a delicate bouquet, while iris introduces a dry, powdery impression that feels quite unlike freshly cut petals.

On Michael Edwards’ wheel, Olfia's Floral family is closest to Floral and Soft Floral. The latter offers a useful way to understand the distinction between a recognizable bouquet and a softer, more abstract floral impression. A floral composition can also move toward Floral Amber when warmer materials become more prominent. A named flower on a label may describe a reconstructed accord, so it does not necessarily tell you which botanical extracts are present.

For the home, begin by choosing which floral character appeals to you. A rose-led fragrance with bergamot might evoke flowers beside an open window, while a powdery iris accord could suit a more intimate dressing area. Try smelling both before choosing a product. The contrast is a good way to develop your own vocabulary for floral fragrances.

- [Body] At home: `Think of flowers on a dining table, a spring garden, or a powdery dressing room. Choose a fresh floral for a lighter impression or iris for a more velvety one.`
- [Link] `Try Floral in a room`
- 材料图名（沿用现有资源）：dried rose, jasmine, peony
- [RESEARCH SOURCES] R2, R3, R9, R19 (classification), R10 (mixture perception). See §13; home examples are editorial suggestions.

#### 02 · Gourmand
- [H3] `Gourmand`
- [Lead] `Toasted · Creamy · Sweet`
- [Label] Signature notes: `Vanilla, tonka, honey, coffee, caramel`
- [Label] On the fragrance wheel: `Olfia category; overlaps Amber and Fruity`
- [Body] [NEW COPY]

What makes a fragrance smell like dessert? Gourmand scents borrow their vocabulary from the kitchen: the caramelized edge of sugar, roasted coffee beans, vanilla cream, honey, and the almond-like sweetness of tonka. Some suggest a bakery, others a cup of coffee or a piece of dark chocolate. Their appeal often comes from the recognition of a familiar food rather than a literal recreation of its flavor.

Gourmand became particularly prominent in modern perfumery after the success of Mugler's Angel. It is not a dedicated segment on Michael Edwards’ classic wheel, although its sweet and rich qualities often intersect with Amber, and fruit-led compositions may sit elsewhere. Olfia treats Gourmand as a separate family because edible associations are an especially useful distinction when choosing fragrance for the home. Vanilla can appear in either an amber or a gourmand product; the overall impression matters more than a single note.

Begin by deciding whether you prefer creamy sweetness, toasted bitterness, or something more like caramel. In a sitting room, coffee and vanilla can suggest a slow breakfast; near a dining table, a more subtle scent may be preferable to an intense dessert accord. Look for a product that pairs vanilla with coffee or dry wood and compare it with a sweeter alternative.

- [Body] At home: `Explore food-like aromas in a living room or dining nook; roasted notes can feel quite different from sugary ones.`
- [Link] `Try Gourmand in a room`
- 材料图名（沿用现有资源）：vanilla pod, honeycomb, coffee beans
- [RESEARCH SOURCES] R2, R4, R9, R19 (classification), R10 (mixture perception). See §13; home examples are editorial suggestions.

#### 03 · Warm & Spicy
- [H3] `Warm & Spicy`
- [Lead] `Resinous · Spiced · Balsamic`
- [Label] Signature notes: `Amber, cinnamon, clove, frankincense, tobacco`
- [Label] On the fragrance wheel: `Soft Amber, Amber, Woody Amber`
- [Body] [NEW COPY]

Warm & Spicy brings together several kinds of aromatic warmth. Cinnamon and clove are immediately recognizable as spices, while frankincense has a resinous character that can feel dry or smoky. Tobacco accords may suggest dried leaves or a darker sweetness. Amber in perfumery generally refers to a constructed scent impression, commonly involving sweet or balsamic materials, rather than the smell of a piece of fossilized resin.

Olfia draws this family mainly from the Amber region of Michael Edwards’ Fragrance Wheel, including Soft Amber, Amber, and Woody Amber. The differences are worth noticing: an incense-like scent can have a much drier character than a sweet balsamic amber, while a wood-led composition adds another dimension of depth. This helps explain why two products described as warm might feel entirely different when you smell them.

In a living room, think about what kind of warmth you want to introduce. An amber-and-cedar fragrance can suggest polished wood and a late evening indoors; an orange-and-clove accord recalls a more seasonal, festive atmosphere. If you are new to richer scents, choose a gentle product and try it for a short period according to its directions. The most useful first comparison is between a sweet amber and a drier, spiced or resinous fragrance.

- [Body] At home: `Try resinous or spiced notes on an autumn evening, in a sitting room, or around a seasonal gathering.`
- [Link] `Try Warm & Spicy in a room`
- 材料图名（沿用现有资源）：cinnamon, resin, clove
- [RESEARCH SOURCES] R1, R2, R9, R19 (classification), R10 (mixture perception). See §13; home examples are editorial suggestions.

#### 04 · Woody & Earthy
- [H3] `Woody & Earthy`
- [Lead] `Dry · Mossy · Smoky · Creamy`
- [Label] Signature notes: `Cedar, sandalwood, vetiver, oakmoss, patchouli`
- [Label] On the fragrance wheel: `Woods, Mossy Woods, Dry Woods`
- [Body] [NEW COPY]

Think of freshly sharpened pencils, a wooden cabinet, or damp ground beneath a forest canopy. Woody and earthy fragrances encompass a range of textures, from the dry character of cedar to the creamy softness of sandalwood and the grassy, sometimes smoky quality of vetiver. Oakmoss and patchouli bring earthier impressions that can suggest vegetation and soil rather than timber alone.

Within Michael Edwards’ Fragrance Wheel, Olfia's Woody & Earthy family draws primarily from Woods, Mossy Woods, and Dry Woods. Mossy compositions can connect earthy notes with brighter facets, while dry styles may evoke smoke, leather, or a more austere wood character. The classification gives you a way to compare different interpretations of a forest-like scent, even when the ingredient lists have little in common.

At home, consider the quality of wood you enjoy. Cedar can complement the association of paper, books, and furniture in a study. Sandalwood may appeal when you want a softer impression in a bedroom, while vetiver can introduce a less sweet, more earthy character. For a first experiment, seek a cedar fragrance with a bergamot accent; the citrus brings a brighter contrast. Alternatively, compare sandalwood with vanilla or amber to discover whether you prefer a warmer, sweeter direction. Notice which version feels most at home in your own space.

- [Body] At home: `Try crisp cedar in a study, softer sandalwood in a bedroom, or vetiver when you want a more earthy character.`
- [Link] `Try Woody & Earthy in a room`
- 材料图名（沿用现有资源）：cedar ring, bark, moss
- [RESEARCH SOURCES] R1, R5, R6, R9, R19 (classification), R10 (mixture perception). See §13; home examples are editorial suggestions.

#### 05 · Green & Herbal
- [H3] `Green & Herbal`
- [Lead] `Leafy · Aromatic · Bitter`
- [Label] Signature notes: `Basil, tomato leaf, rosemary, lavender, green tea`
- [Label] On the fragrance wheel: `Green, Aromatic`
- [Body] [NEW COPY]

Imagine snapping a stem, rubbing rosemary between your fingers, or walking past tomato plants on a warm afternoon. Green fragrances often recall leaves, stems, grasses, and vegetation, whereas herbal and aromatic notes can bring the distinctive sharpness of kitchen herbs. Lavender has a floral side as well as its recognizable herbal character. Green tea may feel delicate and leafy, while tomato leaf can suggest something much more bitter and alive.

The Green and Aromatic areas of Michael Edwards’ Fragrance Wheel help explain why these scents belong together in Olfia, despite their variety. A leaf-like fragrance can overlap with floral or woody notes, and an aromatic composition can include citrus or spices. Olfia uses a single Green & Herbal category to make these botanical impressions easier to explore in a home context.

Try beginning with an actual herb you recognize, then look for that note in a home fragrance. A rosemary-and-lemon composition might remind you of a kitchen windowsill, while green tea and soft wood offer a different direction for a desk or reading corner. Compare a fresh leafy scent with a lavender-led one and notice which side of the family you enjoy. You may discover that the smell of a plant in its natural setting and its interpretation in a fragrance are quite different experiences.

- [Body] At home: `Think of herbs on a kitchen windowsill or a green tea note beside a desk. A leafy fragrance can feel quite different from a floral herb.`
- [Link] `Try Green & Herbal in a room`
- 材料图名（沿用现有资源）：fig leaf, rosemary, lavender
- [RESEARCH SOURCES] R7, R9, R19 (classification), R10 (mixture perception). See §13; home examples are editorial suggestions.

#### 06 · Citrus & Fruit
- [H3] `Citrus & Fruit`
- [Lead] `Zesty · Juicy · Tart`
- [Label] Signature notes: `Bergamot, lemon, blood orange, grapefruit, pear`
- [Label] On the fragrance wheel: `Citrus, Fruity`
- [Body] [NEW COPY]

There is a difference between the sharp scent released when you peel a lemon and the softer, watery sweetness of a ripe pear. Citrus & Fruit brings both kinds of impressions together. Bergamot has a distinctive aromatic brightness; grapefruit can have a tart edge, blood orange can feel juicier, and lemon often suggests a more direct zest. Fruit accords extend that vocabulary beyond citrus peels into softer, sometimes almost jam-like territory.

On Michael Edwards’ Fragrance Wheel, Citrus and Fruity are distinct areas within the broader fresh region. Olfia groups them because both offer familiar references for someone learning to describe scents at home. Citrus materials are often used to give a fragrance a bright opening, while fruit impressions can be constructed in many different ways. A citrus-led room fragrance may change over time as other notes emerge; its duration also depends on how the product is made and used.

For a first comparison, try smelling a piece of citrus peel and a ripe fruit. Then explore home fragrances that recall each. Grapefruit with green tea might appeal in an entryway or at the start of a day, whereas pear with a floral accent may suggest a softer atmosphere. Look beyond the fruit name on a label and ask whether the scent feels tart, juicy, sweet, or dry to you.

- [Body] At home: `Try bright citrus in an entryway or kitchen; consider a softer pear note when you want a less sharp fruit impression.`
- [Link] `Try Citrus & Fruit in a room`
- 材料图名（沿用现有资源）：orange slice, lemon peel, pear
- [RESEARCH SOURCES] R1, R7, R9, R19 (classification), R10 (mixture perception). See §13; home examples are editorial suggestions.

#### 07 · Fresh & Clean
- [H3] `Fresh & Clean`
- [Lead] `Airy · Watery · Linen-like`
- [Label] Signature notes: `Sea salt, rain, ozone, cotton, cucumber`
- [Label] On the fragrance wheel: `Water; overlaps other fresh and soft profiles`
- [Body] [NEW COPY]

Fresh & Clean is a family built around impressions that can be difficult to name: air after rain, water near the coast, or a stack of just-washed sheets. Aquatic and ozonic notes suggest water and open air, while laundry-inspired accords often have a soft, musky character. Cotton and sea salt on a fragrance label are usually sensory associations; the product is evoking an experience rather than necessarily containing those materials as its source of scent.

The Water area of Michael Edwards’ wheel is the closest starting point for Olfia's Fresh & Clean family. Other clean-smelling fragrances can overlap with Soft Floral, Citrus, or aromatic profiles. Olfia groups water-like and textile-inspired impressions together to help people distinguish this kind of freshness from the zest of a lemon or the greenness of a leaf. The categories remain flexible because the character of a complete fragrance depends on the composition.

At home, explore which kind of freshness you actually prefer. A marine accord might remind you of a coastal walk, whereas a cotton-and-lavender fragrance could recall fresh bedding. Try comparing these two directions in a bathroom or entryway, using products as directed. A clean-smelling fragrance is an aesthetic choice; it does not clean the air or replace ventilation. Sometimes the most pleasant option is simply an open window and no added scent.

- [Body] At home: `Explore a water-like scent in a bathroom or a fabric-inspired accord near freshly washed linens.`
- [Link] `Try Fresh & Clean in a room`
- 材料图名（沿用现有资源）：sea salt, linen, pebble
- [RESEARCH SOURCES] R7, R8, R9, R19 (classification), R10 (mixture perception). See §13; home examples are editorial suggestions.

### 7.3 七个小故事

**Floral — A Garden That Takes Its Time**
Not every floral scent comes from a flower. Rose and jasmine have long been prized for their fragrant petals, while peony, celebrated in Chinese culture as the “king of flowers,” is often recreated as a delicate perfume accord. Orange blossom has adorned wedding bouquets for centuries, symbolizing both innocence and fertility. And iris holds the loveliest secret: its soft, powdery scent comes not from the petals, but from underground rhizomes that require years of aging. Together, these flowers reveal something unexpected about floral perfumery. The freshest impression of a garden can take years of cultivation, patient extraction, and a little imagination to create.
来源：The Perfume Society — Iris / Orange Blossom / Peony

**Gourmand — The Dessert That Changed Perfumery**
For centuries, perfume was expected to smell like flowers, woods, or spices—not dessert. That changed in 1992, when Mugler's *Angel* helped launch the gourmand fragrance movement with an unapologetically sweet blend of caramelized notes, honey, and vanilla. Its secret was partly chemistry: ethyl maltol, an aroma molecule reminiscent of cotton candy and caramel. Today, perfumers build on that delicious idea with roasted coffee, golden honey, and tonka bean, whose natural coumarin gives off hints of vanilla, almond, and warm hay. What makes gourmand fragrances fascinating is that their sweetness isn't necessarily about food. It's about making something invisible feel familiar, comforting, and almost edible.
来源：Mugler — Angel; The Perfume Society — Tonka Bean; Osmetheca — History of the Gourmand Family

**Warm & Spicy — A Little History of Warmth**
Long before scented candles, people perfumed their surroundings with smoke. Frankincense, a resin harvested from Boswellia trees, traveled along ancient trade routes and burned in temples and ceremonies. Cinnamon bark and dried clove buds brought warmth from the spice trade, while tobacco, introduced to Europe from the Americas, eventually contributed its sweet, earthy character to perfumery. Amber ties these materials together, though the amber of perfume is usually a constructed accord rather than a substance extracted from fossilized resin. It is a blend of warmth, sweetness, and depth. Perhaps that's why these scents feel so familiar in winter: they bring centuries of ritual, trade, and gathering into a single room.
来源：The Perfume Society — Frankincense / Cinnamon / Tobacco; Missouri Botanical Garden — Smelling the Bouquet (PDF)

**Woody & Earthy — The Forest Isn't All Wood**
Some of perfumery's most beloved woody scents don't actually come from trees. Cedar gives us the dry, familiar smell of pencil shavings, while sandalwood offers a creamy softness and has long been used in Indian spiritual traditions. But vetiver's smoky earthiness comes from the roots of a grass, oakmoss is a lichen growing on tree bark, and patchouli belongs to the mint family. In the nineteenth century, patchouli leaves even traveled tucked between imported shawls, leaving a distinctive scent that became fashionable in Europe. Together, these materials recreate an entire forest—from sun-warmed timber to damp earth. Their deeper, slower-evaporating aromas also help a fragrance linger long after its brighter notes disappear.
来源：The Perfume Society — Patchouli / Oakmoss / Sandalwood / Cedarwood & Vetiver

**Green & Herbal — The Scent of Something Growing**
Before a tomato becomes a tomato, its leaves already have a scent: sharp, green, and slightly bitter. Crush one between your fingers and you'll understand the appeal of herbal perfumery. Basil brings a peppery freshness once celebrated in Arabic perfumery, while rosemary, used in the historic fragrance Hungary Water, adds a brisk, almost camphor-like edge. Lavender contributes a softer, floral-herbal character, and green tea offers a delicate, leafy impression, often recreated through carefully blended aroma molecules. Unlike sweet florals or warm woods, these scents seem to capture plants in the middle of living—freshly cut, gently bruised, or steeping in a cup. A garden, with all its imperfect freshness, brought indoors.
来源：The Perfume Society — Tomato Leaf / Basil / Rosemary; Missouri Botanical Garden — Aromatic Fragrance Materials (PDF)

**Citrus & Fruit — A Brief Moment of Sunshine**
The sparkle of a citrus fragrance begins in the peel. Bergamot, cultivated along the coast of Calabria, lends its distinctive aroma to Earl Grey tea. Lemon brings a sharper zest, while blood orange adds a juicy, almost raspberry-like sweetness. Grapefruit has a surprisingly recent history: a hybrid of pomelo and sweet orange, it emerged in the Caribbean centuries after many other citrus fruits were already cultivated. Pear, meanwhile, contributes a softer, watery fruitiness that balances their brightness. Together, they make some of perfumery's most fleeting top notes. Their aromatic molecules evaporate relatively quickly, which explains why a citrus fragrance can feel like the first burst of morning light: vivid, uplifting, and impossible to hold onto forever.
来源：Missouri Botanical Garden — Bergamot and Citrus Perfumery (PDF); The Perfume Society — Blood Orange / Grapefruit / Pear & Citrus

**Fresh & Clean — Can You Bottle the Air After Rain?**
What does clean actually smell like? Surprisingly, many things we associate with freshness have little scent of their own. Sea salt isn't responsible for the full smell of the ocean, and cotton doesn't naturally smell like freshly washed sheets. Perfumers create these impressions by combining aroma molecules: airy ozonic notes, soft laundry-like musks, and watery cucumber accords. Rain brings another fascinating clue. Its familiar earthy smell, known as petrichor, is partly associated with geosmin, a compound produced by soil microorganisms. In the 1990s, marine aroma molecules such as Calone helped popularize a new generation of aquatic fragrances. Freshness, it turns out, isn't one particular smell. It's a carefully constructed memory of water, air, and open space.
来源：Chemistry — Occurrence of Marine Ingredients in Fragrance; Osmetheca — Marine and Aquatic Fragrance Family; The Perfume Society — Fragrance Ingredients

---

## 8 The Olfia Edit `/edit`（只列界面文字）

### 8.1 栏目首页
- 报头小字：`Culture, fragrance, and the art of living.`
- [H1] `The Olfia Edit`
- [Lead] [NEW COPY] `An ongoing collection of stories about fragrance and the worlds it opens up. We explore familiar materials, the cultural meanings of scent, and the ways people use fragrance to shape their surroundings and express themselves.`
- 筛选：`Topic`（`All topics`）、`Month`（`All months`）
- [Empty] `No stories match these filters. Try another topic or month.`
- 侧栏：[H2] `Editor’s Picks` ｜ [H2] `In Season`

### 8.2 文章页（正文之外）
- 返回：`The Olfia Edit`
- 左栏：[H2] `Recreate This at Home`，[Link] `More in Gifts`
- 右栏：[H2] `Imagine the room`，[Button] `Build this room`
- 文末：`The Take-Home Edit` ｜ [H2] `References` ｜ 分享 `Copy link` / `Pinterest` / `Share` ｜ [H2] `Keep reading`
- Scentpedia 小块：[Link] `Scentpedia`

---

## 9 测试 `/quiz`

### 9.1 开始和进行中
- [H1] `Which scent feels like you?`
- [Lead] `Twenty questions about everyday life and the things you enjoy. Choose the answer that feels most like you.`
- [Hint] [NEW COPY] `This is a playful guide to fragrance discovery. There are no right or wrong answers.`
- [Button] `Back` / `Next`

### 9.2 二十道题

| # | 题目 | 选项 |
|---|---|---|
| 1 | At the end of a long week, how do you like to recharge? | A night out / A quiet evening alone / One close friend, one couch |
| 2 | When you arrive in a new city, what do you do? | Ask strangers for tips / Wander alone with headphones / Plan the day around one good meal |
| 3 | What is your phone usually like? | Always buzzing / On silent since forever |
| 4 | When you walk into a room, what do you notice first? | How it looks / How it feels |
| 5 | Which kinds of stories draw you in? | About real people / About worlds that don’t exist |
| 6 | When you have instructions to follow, what do you do? | Read every step / Skim, then figure it out |
| 7 | A friend is upset. What is your first instinct? | Ask what happened / Suggest what to do |
| 8 | When making a big decision, what do you tend to trust? | Your head / Your gut |
| 9 | Which compliment stays with you? | “You’re so sharp” / “You’re so kind” |
| 10 | How do your weekends usually unfold? | Planned by Thursday / Decided Saturday morning |
| 11 | What does your desk usually look like? | A clear surface / A creative mess |
| 12 | How do you usually handle deadlines? | Done early / Done in the last hour, brilliantly |
| 13 | Which kind of weather feels most like you? | First warm day of spring / Rain on the window / Golden autumn afternoon / Clear cold morning |
| 14 | Which texture are you drawn to? | Linen / Worn leather / Velvet / Fresh-cut grass |
| 15 | What is your go-to comfort drink? | Black coffee / Herbal tea / Hot chocolate / Sparkling water with lemon |
| 16 | What would you like to see from your window? | The sea / A forest / A garden / An orchard |
| 17 | Which smell takes you back? | A bakery / Fresh laundry / A bonfire / Flowers at a market |
| 18 | Which color are you drawn to? | Deep green / Warm brown / Pale blue / Blush pink / Bright orange / Amber / Caramel |
| 19 | What feels like luxury to you? | A quiet morning / A long dinner / Flowers delivered / A fireplace |
| 20 | Which scent reminds you most of Christmas? | Pine / Cinnamon / Gingerbread / Oranges and cloves |

### 9.3 结果
- [H1] `You are {角色名}.`
- [Body] `Your result suggests {家族}, with {家族} as a secondary family. For another scent direction, explore {家族}.`
- [Button] `Design a room in this style` ｜ `Save card` / `Share` ｜ [Link] `Take the quiz again`
- 结果卡上：`Olfia · {日期}`

### 9.4 十六个角色（保留原名称、映射及 signature quote）

| 代码 | 名字 | 家族 | 联想香调 | 那句话 |
|---|---|---|---|---|
| ESFJ | The Nurturer | floral | soft florals, musk | You always find a way to make people feel at home. |
| INFJ | The Empath | floral | rose, iris, powdery notes | You notice when someone gets quiet, even in a crowded room. |
| ISFJ | The Devotee | spicy | amber, vanilla, warm woods | You hold on to the little things that remind you of someone. |
| ENFP | The Romantic | floral | peony, rose, white florals | You remember places by the people you shared them with. |
| ESFP | The Harmonist | green | tea, lavender, clean musk | You know how to make a room feel a little more peaceful. |
| ISFP | The Muse | floral | violet, iris, delicate florals | You see beauty in things other people might overlook. |
| ISTJ | The Guardian | woody | sandalwood, cedar, amber | People feel a little safer knowing you’re there. |
| ENFJ | The Altruist | citrus | neroli, green florals | You think about what others might need before they ask. |
| INFP | The Idealist | green | fig, soft woods, iris | You can picture a better world, even in the smallest things. |
| INTJ | The Strategist | woody | vetiver, oakmoss, dry cedar | You notice the details that make everything fall into place. |
| INTP | The Thinker | fresh | incense, paper, green tea | You enjoy the kind of quiet that gives your thoughts room to wander. |
| ENTJ | The Director | spicy | saffron, leather, amber | You have a way of knowing what needs to happen next. |
| ENTP | The Spark | citrus | bergamot, pink pepper, bright woods | You make ordinary days feel a little less ordinary. |
| ESTJ | The Steward | green | lavender, nutmeg, fougère | You take care of things because you believe they’re worth keeping. |
| ISTP | The Maker | gourmand | coffee, smoke, leather | You like leaving things a little better than you found them. |
| ESTP | The Adventurer | spicy | clove, pink pepper, fireplace | You feel most like yourself when there’s something new to discover. |

### 9.5 角色结果扩写 [NEW COPY]
- [NEW UI] 结果页在原角色名、signature quote、家族和香调下新增一个可阅读的 `Your scent personality` 区块；每个角色独立文案，按原 MBTI key 绑定；不改变映射、卡片模板或 scoring。文字使用探索性语言，不宣称心理测量有效性。
- [Hint] `Your result is an invitation to explore, not a fixed definition of your personality or preferences.`

#### ESFJ · The Nurturer
- [Body] You tend to notice the things that make a gathering feel welcoming: a chair pulled up to the table, flowers in a familiar vase, or a room ready for someone to arrive. In Olfia’s fragrance world, soft florals and musk suggest that kind of approachable warmth. Try a gentle floral bouquet with a fabric-like softness, something that can accompany conversation without becoming its center. Imagine a living room prepared for an unhurried visit, with flowers on the table and a fragrance that feels as familiar as the people around you.

#### INFJ · The Empath
- [Body] You may be drawn to the quieter details of a place, including the changes in atmosphere that are hard to explain. Rose and powdery iris offer two sides of the floral family: an expressive bloom and a more inward, velvety impression. Explore them in a fragrance that feels close and personal. Imagine a reading corner with a notebook, a lamp, and flowers that have been sitting there for a few days. It is a space where you can notice your own thoughts and allow the day to settle at its own pace.

#### ISFJ · The Devotee
- [Body] Familiar objects can hold a great deal of meaning for you, from a photograph tucked into a book to something a friend once gave you. Amber, vanilla, and warm woods evoke the comfort of things that have become part of a routine. Try a softly spiced or resinous fragrance with a wooden accent, rather than choosing sweetness alone. Imagine an evening at home with a favorite blanket, a small collection of keepsakes, and a familiar scent you can return to whenever you want the room to feel like your own.

#### ENFP · The Romantic
- [Body] A place may become special to you because of the people and stories that fill it. In Olfia’s fragrance world, peony, rose, and white florals express the variety of those associations, from the brightness of a new bouquet to the fuller scent of a garden in bloom. Experiment with a floral fragrance that feels expressive and a little unexpected. Imagine a room with postcards from friends, fresh flowers, and an open window. Let the atmosphere change with the day, rather than trying to keep everything exactly as it was.

#### ESFP · The Harmonist
- [Body] You may enjoy the immediate pleasure of being in a place that feels good to you: daylight on the table, music in the background, and the freedom to rearrange things as the mood changes. Green tea, lavender, and clean musk suggest a fresh, open atmosphere with a softer edge. Try a tea-led fragrance or an aromatic floral to explore the balance. Imagine a living room that is ready for whatever the day brings, from an afternoon alone to a spontaneous visit, with a scent that leaves room for both.

#### ISFP · The Muse
- [Body] The texture of a ceramic cup, a faded color, or the way light falls across a page might capture your attention before anything else does. Violet, iris, and delicate floral impressions offer a similarly nuanced kind of expression. Look for a fragrance whose character you enjoy discovering slowly, rather than choosing by the name of the flower alone. Imagine a small creative corner with drawing materials, a few objects collected over time, and a powdery floral scent. Let the room reflect your taste without needing to explain it to anyone.

#### ISTJ · The Guardian
- [Body] A familiar routine or a well-kept room can provide a reassuring sense of continuity. Sandalwood, cedar, and amber offer a range of wood-led impressions, from dry and structured to warm and smooth. Explore a fragrance that feels dependable enough to become part of a regular routine. Imagine a study or entryway where everything has a place: a table for your keys, a lamp you turn on at the end of the day, and a familiar cedar note. The details you keep can give the space a character of its own.

#### ENFJ · The Altruist
- [Body] You may enjoy creating an atmosphere that takes other people into account, whether you are welcoming a guest or sharing a meal. Neroli and green florals offer a bright botanical direction within Olfia’s citrus-linked fragrance world. Explore a fresh, gently floral fragrance that feels inviting without taking over the room. Imagine a kitchen or dining area with the windows open, a few stems in a vase, and space for conversation. When sharing a space, ask others what scents they enjoy and leave room for their preferences, too.

#### INFP · The Idealist
- [Body] You may find yourself imagining how an ordinary place could become something more personal, even through a small change. Fig, soft woods, and iris suggest green landscapes, textured surfaces, and a gentler floral character. Explore a leafy fragrance with a soft woody accent, or compare it with a more powdery interpretation. Imagine a corner with plants, books, and objects that remind you of places you hope to visit. The scent can be another detail in that imagined world, one you can experiment with as your idea of the space evolves.

#### INTJ · The Strategist
- [Body] You may appreciate a space whose details feel considered, where the objects on a desk and the arrangement of the room support the way you work. Dry cedar, vetiver, and oakmoss offer contrasting woody textures: crisp, grassy, and earthy. Try a cedar-led fragrance with a restrained green accent to see which kind of depth you enjoy. Imagine a study with a well-used wooden desk, a few deliberately chosen objects, and a scent that becomes part of your working rhythm. There is plenty of room to experiment without changing everything at once.

#### INTP · The Thinker
- [Body] An unhurried stretch of time can make room for a new idea, a book, or a question you did not expect to spend the afternoon exploring. Paper-like accords, green tea, and incense associations suggest the quiet character of a personal library. Within your fresh scent result, try the lighter tea-like direction first, then explore how a dry aromatic or incense-like note changes it. Imagine a desk by the window, open books, and a fragrance you can notice without interrupting what you are doing. Give yourself time to compare impressions.

#### ENTJ · The Director
- [Body] You may enjoy shaping a room with a clear purpose in mind, choosing the objects and atmosphere that suit what you want to do there. Saffron, leather, and amber suggest a bold, textured fragrance direction, with a balance of spice, dryness, and warmth. Explore a spiced amber whose character remains distinctive even at a gentle intensity. Imagine a workspace with a strong silhouette, a few well-chosen materials, and a fragrance that feels appropriate to the pace of your day. Adjust the atmosphere as your priorities change rather than treating it as fixed.

#### ENTP · The Spark
- [Body] An unexpected combination can be the most interesting part of an ordinary day. Bergamot, pink pepper, and bright woods suggest a fragrance with a lively opening and a more textured background. Try comparing a crisp citrus scent with one that introduces a spicy or woody accent, and see what surprises you. Imagine a room with a changing collection of prints, objects from different places, and a fragrance that invites another experiment. You can use Rooms to try a new idea whenever you want, then keep the ones you find yourself returning to.

#### ESTJ · The Steward
- [Body] You may take pleasure in looking after the things that make everyday life run smoothly, including the spaces and objects you use most often. Lavender, nutmeg, and a fougère-style accord offer a botanical direction with aromatic and lightly spiced qualities. Try a fragrance that gives a familiar room a consistent character without making it overpowering. Imagine an entryway with a place for everything, a few plants, and an aromatic scent you associate with coming home. A small, well-chosen adjustment can be just as satisfying as a complete redesign.

#### ISTP · The Maker
- [Body] The materials themselves may be the most compelling part of a room: the feel of leather, a wooden surface that has been worked by hand, or the smell of coffee nearby. Coffee, smoke, and leather associations introduce a less sugary side to your gourmand result. Try a roasted coffee fragrance with a dry accent and compare it with creamy vanilla. Imagine a practical workbench or studio where familiar tools and unfinished projects have their own character. Choose a fragrance the same way you might choose a material, by exploring what it actually feels like in use.

#### ESTP · The Adventurer
- [Body] A new place, an unexpected plan, or the prospect of trying something different may be what draws your attention. Clove, pink pepper, and a fireplace-like accord suggest an expressive, spiced direction with both bright and smoky facets. Explore a fragrance that combines a brisk spice with a warmer background, then try a completely different interpretation. Imagine a living room ready for an evening with friends, with a few objects that recall past adventures. The scents you choose can change with the occasion, and your Atlas can keep a record of the discoveries.

---

## 10 My Page `/account`

结构：顶部卡片 → Your Scents at a Glance → My Preferences → Personal Info → Plans → Settings → 测试结果

### 10.1 顶部卡片
- [H1] `My Page`
- [Body] `Personal accounts are not available yet. Your saved entries stay in this browser.`
- 登录后（示例模式）：`You’re signed in to the account preview.` [Link] `Sign out`
- 小标签：`{n} days recorded` / `{n} rooms` / `{n} captures`

### 10.2 Your Scents at a Glance
- [H2] `Your Scents at a Glance`
- [Lead] [NEW COPY] `A summary of the scents and settings you’ve recorded so far. Your most recorded family may be different from your favorite.`
- 开关 `Sample data`；[Hint] `You’re viewing sample pages. Your own saved entries will appear as you add them.`
- `Most Recorded Scent Families` ｜ `Most recorded:`
- `Feelings You Recorded`（[Empty] `No feelings recorded yet.`）
- `Time of Day` ｜ `Fragrance Formats` ｜ `Your Tags`
- `Something New to Explore`：`Explore {家族} alongside {家族} on the wheel` ／ `Explore {家族} and {家族} for a new scent direction`

### 10.3 My Preferences
- [H2] `My Preferences`
- `Preferred Scent Families`（七个家族）｜ `Preferred Products`（Candle / Diffuser / Incense / Room spray / Essential oil / Fragrance-free / No specific source）
- [Body] `Your records feature {家族} at night and {家族} in the morning.`
- 像素画说明 [A11y]：`Pixel picture: a timber cabin among cedar trees at dusk, a candle in its window, mist from the chimney and an orange tree beside it`

### 10.4 Personal Info
- [H2] `Personal Info`
- `Username` / `Email` / `City, country`，[Placeholder] `Available when accounts launch`

### 10.5 Plans
- [H2] `Plans`
- [Lead] [NEW COPY] `Explore Olfia for free today. Olfia Plus is planned for people who want to keep more room designs and personalize their visual collection.`
- [Hint] [NEW COPY] `Olfia Plus is not available yet. The features below describe the planned offering.`
- Free 卡：`Capture, Rooms and your Scent Atlas` / `Save up to two rooms` / `Fragrance recommendations with matching reasons` ｜ `Your plan`
- Olfia Plus 卡（planned）：`Everything in Free` / `Save unlimited rooms` / `Photo View and saved Scent View settings` / `More Scent Card templates and stamps` ｜ [Button] `Join the waitlist`
- 对比表（Free ｜ Olfia Plus · Planned）

| 功能 | Free | Olfia Plus |
|---|---|---|
| Scent quiz | ✓ | ✓ |
| Capture and Scent Cards | ✓ | ✓ |
| Rooms you can keep | 2 | No limit |
| Scentpedia and The Olfia Edit | ✓ | ✓ |
| Fragrance recommendations with matching reasons | ✓ | ✓ |
| Monthly analysis and seasonal picks | ✓ | ✓ |
| Photo View: your room beside its collage | – | ✓ |
| Saved Scent View settings | – | ✓ |
| More Scent Card templates and stamps | – | ✓ |

- 常见问题
  - `When does Olfia Plus open?` — `It isn’t open yet. Leave your email to receive updates about the launch.`
  - `Where is my Scent Atlas saved?` — `Your Atlas entries are stored in this browser. Use Export my data in Settings to download a copy.`
  - `Will I be charged for joining the waitlist?` — `Joining the waitlist does not start a paid subscription. Pricing and subscription terms will be available before you join Plus.`
- 价格：还没有（等你定）

### 10.6 Settings
- [H2] `Settings`
- [Body] `Your entries are stored in this browser. Export a copy before clearing site data or switching devices.`
- [Button] `Load sample pages` / `Export my data` / `Clear this browser`
- [Dialog] `Clear all your locally saved Olfia data? Export a copy first if you want to keep it.`

### 10.7 测试结果
- 没做：[H2] `Which scent feels like you?`，[Lead] `Twenty questions about your habits and sensory preferences. Meet one of sixteen scent characters, discover fragrance families to explore, and find a room to start with.`，[Button] `Take the quiz`
- 做过：[H2] `You are {角色名}.`，`Your result suggests {家族}, with {家族} as a secondary family. For another scent direction, explore {家族}.`，[Button] `Design a room in this style`

---

## 11 Privacy `/privacy`
- [H1] `Privacy at Olfia`
- [Lead] `Your personal scent entries are stored locally in this version of Olfia. Here is how your saved records, website analytics, and email subscriptions are handled.`
- [H2] `Your saved entries`
- [Body] `Olfia does not currently offer personal accounts. Your Capture entries, room designs, and starred entries are saved in this browser, on this device. They are not uploaded as personal records to an Olfia server.`
- [H2] `Website analytics`
- [Body] `Olfia uses Google Analytics to understand visits and selected actions, such as completing the quiz, saving a Scent Card, or opening a product link. Analytics may use cookies to distinguish visits. Events include categories such as a fragrance family rather than the text you enter.`
- [H2] `Cookie preferences and signals`
- [Body] `For visitors in the EU, the UK and Switzerland, and for browsers that send Global Privacy Control or Do Not Track signals, analytics cookies remain off and Google receives cookieless signals. Advertising features are disabled for all visitors.`
- [H2] `Email subscriptions`
- [Body] `If you subscribe, your email address is sent to Kit, the service Olfia uses to send emails. Your answer to “Where did you find Olfia?” is counted in Google Analytics and is not stored with your email address. You can unsubscribe using the link in any email.`
- [H2] `Google Analytics and your choices`
- [Link] `How Google uses information from sites that use its services` / `Google Analytics opt-out add-on`
- [H2] `Exporting or removing your saved data`
- [Body] `Use Export my data in Settings to keep a copy of your local entries. To remove them, choose Clear this browser in Settings or clear Olfia’s site data through your browser settings.`
- [VERIFY — INTERNAL, launch blocker] Developer must verify each paragraph against the actual release: storage inventory (Shelf, quiz, preferences, cards and gifts), image storage and product-link fetching, exact GA payloads, consent and region logic, GPC/DNT handling, third-party network requests, Kit source field handling, export and deletion scope. Do not publish unverified claims; no legal compliance assessment performed. Remove v0 public TODO; keep this checklist internal. Update any affected text in mock login, settings, plans, and toasts as well.

## 12 找不到页面（404）
- `404`
- [H1] `This room doesn’t exist (yet).`
- [Lead] `Head to Rooms to imagine a space, or Capture to record a scent from your day.`
- [Button] `Rooms` / `Capture`

---

## 附录 A 选项词表（多处共用）
- 房间：Living room / Bedroom / Study / Reading corner / Kitchen / Bathroom / Closet / Entryway / Balcony / Car / Office / Other
- 季节：Spring / Summer / Autumn / Winter
- 时间：Morning / Afternoon / Evening / Night（Rooms 里只有 Morning / Afternoon / Night）
- 场合：Everyday / Date / Party / Meditation / Bath / Sleep / Work / Guests over / Cleaning day / Holiday
- 感受：Calm / Cozy / Focused / Nostalgic / Energized / Romantic / Melancholy / Playful / Grounded / Fresh start / Restless / Safe
- 来源：Candle / Diffuser / Incense / Room spray / Essential oil / Fragrance-free / No specific source / Other
- 做的事：Open window / Simmer pot / Fresh flowers / Clean laundry / Baking / After rain / Other
- 用法：Every day / Mornings / Evenings / Weekends / Special occasions
- 产品时间：Any time / Mornings / Evenings / Warm months / Cold months

## 附录 B Rooms 抽屉里的物品名
- [IMPLEMENTATION NOTE] 保留可识别的现有 asset labels；只调整显示拼写，勿更改资源名或 ID。
- 家具和摆设：Armchair, Lounge chair, Rocking chair, Slipper chair, Side table, Arc lamp, Plant, Rug, Painting, Small print, Cantilever chair, Bucket chair, Patterned chair, Low lounge chair, Folding chair, Clear folding chair, Leather sofa, Tulip table, Blue side table, Round table, Pedestal table, Bean coffee table, Steel desk, Floor lamp, Paper pendant, Globe lamp, Table lamp, Spring lamp, Wooden bookcase, Arched shelf, Blue shelf, Modular shelf, Ivory shelf, Wave shelf, Chrome shelf, Open shelf, Wire shelf, Record cabinet, Carved cabinet, Platform bed, Mustard bed, Bouclé bed, Chrome bed, Rattan bed, Wave bed, Blue bed, Rust bed, Olive bed, Padded bed, Tube bed, Steel bed, Record player, Space-age stereo, Floor mirror, Face vase, Glass bowl, Sphere speaker, Black speaker, Round speaker, Glass cone, Ceramic pot, Floral cushion, Instant camera, Cassette, Iced coffee, Desk organizer, Old books, Books, Book stack, Green books, Notebooks, Open book, Open planner, Papers and pencil, Postcards, Letter bundle, Old papers, Envelopes, Photo box, Picnic basket, Strawberry cake
- 厨房和浴室：Kitchen counter, Tiled wall, Jar shelf, Kettle, Fruit bowl, Potted herbs, Bathtub, Pedestal sink, Bath tiles, Round mirror, Towel rail, Bath mat, Soap dish, Bottles
- 香氛：Candle, Diffuser, Room spray, Incense, Oil burner, Simmer pot
- 材料：dried rose, jasmine, peony, vanilla pod, honeycomb, coffee beans, cinnamon, resin, clove, cedar ring, bark, moss, fig leaf, rosemary, lavender, orange slice, lemon peel, pear, sea salt, linen, pebble

## 附录 C 示例数据里的文字（只在 ?sample=on 时出现）
- [NEW COPY] 可选择新增以下虚构记录；保持已有 seed ID 与统计数据不变，新增需单独增加 seed record 并填写真实字段映射，不能只加孤立文字。
- 房间名字：rain, chapter three ／ first coffee ／ long bath ／ desk, late afternoon ／ sunday sheets ／ record on side two ／ orange peel simmer ／ a slow sunday ／ eucalyptus steam ／ first fire of the year ／ exam week
- 记录名字：Reading after work ／ First cold evening ／ Breakfast, window open ／ Window open after rain ／ Too smoky for sleep ／ Peonies from the market ／ Hotel lobby at home ／ First winter dinner ／ Sheets just off the line ／ Afternoon slump, three drops ／ Banana bread, second batch ／ Lights out ／ After the storm ／ Two sprays after the shower ／ Orange peel on the radiator ／ Movie night ／ Too sweet for the whole house ／ Pine trail, windows down ／ Lilies on the desk
- 一句话：The room smelled like a library with the lights low. ／ Orange peel, two cinnamon sticks, the radio on. ／ Lovely in the living room, too much by the bed. ／ Guests noticed it before they took their coats off. ／ The whole flat smelled like Sunday. ／ Chestnuts and smoke, a blanket for two.
- Fragrance Shelf 备注：The one I light first. ／ Three drops before work. ／ Entryway, always on. ／ Sunday mornings only.
- 另外三个房间预设（写在代码里，示例房间用它们的布置，但这几句话目前网站上看不到）：Reading corner, night — A cedar candle burning low, one lamp on, a page folded down. ／ Kitchen, Sunday morning — Orange peel and cinnamon on a low simmer, the radio on quietly. ／ Bathroom, evening — A eucalyptus candle on the edge of the tub, the tap still running.

- [NEW COPY] 可选记录：`Tomato leaves in July` — `The green, slightly bitter smell of tomato leaves on my hands.` / `After everyone left` — `Orange peel, the remains of dinner, and the faint scent of cedar in the living room.` / `Secondhand bookshop` — `Old paper, dusty shelves, and the faint smell of wood.` / `Laundry on the balcony` — `Clean cotton warmed by the afternoon sun.` / `Too much lavender` — `I liked it at first, but after an hour I wanted the window open.` / `Dinner before the guests` — `Lemon zest on the cutting board, rosemary on my fingers.`

---

## 13 Research Notes & Sources（新增；可供 About / Scentpedia 的折叠来源区使用）

以下链接为本轮新增知识的资料。研究结论与 Olfia 编辑建议区分；原七篇 Little Stories 原样保留，原来源标注未作全面事实复核。Research sources 用链接标题和作者呈现，不展示 R 编号给消费者。

| ID | Source | Supports |
|---|---|---|
| R1 | Michael Edwards, [Fragrances of the World: Fragrance Families](https://ffonline.fragrancesoftheworld.com/Families) | Wheel framework; official classification |
| R2 | The Perfume Society, [Fragrance Families](https://perfumesociety.org/discover-perfume/an-introduction/fragrance-families/) | Industry vocabulary and alternative taxonomy |
| R3 | The Perfume Society, [Floral](https://perfumesociety.org/fragrance-families/floral/) | Floral styles and notes |
| R4 | The Perfume Society, [Gourmand](https://perfumesociety.org/fragrance-families/gourmand/) | Edible notes and Angel context |
| R5 | The Perfume Society, [Woody](https://perfumesociety.org/fragrance-families/woody/) | Woody variations |
| R6 | The Perfume Society, [Woody fresh](https://perfumesociety.org/fragrance-families/woody/fresh/) | Citrus–wood combinations in perfumery |
| R7 | The Perfume Society, [Fresh](https://perfumesociety.org/fragrance-families/fresh/) and [Fresh green](https://perfumesociety.org/fragrance-families/Fresh/green/) | Fresh, green, aromatic, citrus and fruit vocabulary |
| R8 | The Perfume Society, [Fresh aquatic](https://perfumesociety.org/fragrance-families/fresh/aquatic/) | Aquatic, ozonic and linen-like accords |
| R9 | The Perfume Society, [Ingredients](https://perfumesociety.org/discover-perfume/an-introduction/ingredients/) | Ingredient and accord descriptions (reference index) |
| R10 | Thomas-Danguin et al. (2014), [The perception of odor objects in everyday life: a review on the processing of odor mixtures](https://pmc.ncbi.nlm.nih.gov/articles/PMC4040494/) | Perception depends on mixture and relative intensity; does not validate individual home recipes |
| R11 | [An in-depth review of the methods, findings, and theories associated with odor-evoked autobiographical memory](https://pubmed.ncbi.nlm.nih.gov/30406397/) | Memory cues and variability |
| R12 | Herz & Schooler (2002), [A naturalistic study of autobiographical memories evoked by olfactory and visual cues](https://pubmed.ncbi.nlm.nih.gov/11868193/) | Emotional and evocative qualities of odor-cued memories |
| R13 | [Methodologies for smellwalks and scentwalks—a critical review](https://academic.oup.com/chemse/article/doi/10.1093/chemse/bjae005/7607202) | Smellscape, culture and place |
| R14 | Henshaw, V., [Urban Smellscapes: Understanding and Designing City Smell Environments](https://www.routledge.com/Urban-Smellscapes-Understanding-and-Designing-City-Smell-Environments/Henshaw/p/book/9780415662062) | Sensory environments and design |
| R15 | Saito, Y. (2007), [Everyday Aesthetics](https://academic.oup.com/book/7389) | Ordinary objects, activities and aesthetic experience |
| R16 | [Aesthetics of the Everyday](https://plato.stanford.edu/entries/aesthetics-of-everyday/) | Everyday aesthetics and attention to positive and negative experience |
| R17 | Bembibre & Strlič (2017), [Smell of heritage: a framework for the identification, analysis and archival of historic odours](https://discovery.ucl.ac.uk/id/eprint/1554653/) | Historic library smell and archival methods |
| R18 | Bembibre & Strlič, [From Smelly Buildings to the Scented Past: An Overview of Olfactory Heritage](https://pubmed.ncbi.nlm.nih.gov/35153887/) | Cultural and interdisciplinary olfactory heritage |
| R19 | Zarzo & Stanton (2009), [Understanding the underlying dimensions in perfumers’ odor perception space as a basis for developing meaningful odor maps](https://pubmed.ncbi.nlm.nih.gov/19304614/); Zarzo (2015), [A Sensory 3D Map of the Odor Description Space](https://pubmed.ncbi.nlm.nih.gov/25847969/) | Similarities and differences among odor descriptions; categories are not sharp boundaries |

**Editorial distinction:** Olfia’s recipes, room suggestions, sensory associations and quiz profiles are original editorial examples. Neither the wheel nor the cited studies establish universal preferences, mood effects, safety or successful layering in a particular home. Use finished products as directed; choose ventilation and no added fragrance when appropriate. No new product recommendation algorithm is implied.
