# Olfia 网站文案清单 v0（现状，未修改）

- **来源：** GitHub `v3-design` 分支，提交 `f063bf7`（11/23 预览版，比线上网站多了 11/23 第一批改动）。
- **不包含：** The Olfia Edit 里的文章（标题、导语、正文、参考文献）。The Edit 页面本身的界面文字包含在内（第 8 节）。
- **用途：** 这一份只是"现在网站上写了什么"，一字未改，方便对照。修改版是另一份文件 `olfia-site-copy-v1-draft.md`。

## 怎么读

**层级：** `## 页面` → `### 分区` → 每一行是一个元素。每页开头先列一个结构图，表示从上到下的顺序。

**元素标签：**

| 标签 | 意思 |
|---|---|
| [Meta] | 浏览器标签页标题、搜索和分享时显示的文字 |
| [H1] [H2] [H3] [H4] | 一级到四级标题 |
| [Lead] | 标题旁边或下面的一句引导语 |
| [Body] | 正文段落 |
| [Button] / [Link] | 按钮 / 文字链接 |
| [Label] | 输入框或选项上方的小标签 |
| [Placeholder] | 输入框里浅色的示例字 |
| [Hint] | 小字提示 |
| [Option] | 可选项 |
| [Empty] | 还没有内容时显示的话 |
| [Toast] | 屏幕底部弹出又消失的提示条 |
| [Dialog] | 弹窗里的文字 |
| [Card] | 卡片里的文字 |
| [Error] | 出错提示 |
| [A11y] | 只有读屏软件会读的文字（看不见，但属于网站文字） |

**谁写的（只标确定的）：**
- **(T)** 你写的或你定的（品牌话、你的 Notion、你答复里定下的词）
- **(C)** Claude 写的草稿（你让我写，或我先写着等你改）
- 没标的：已经在网站上、来源混合或记不清，修改时一视同仁

`{…}` 表示这里会换成实际内容，比如 `{家族名}`。

---

## 0 全站通用

### 0.1 浏览器标题和分享信息 [Meta]
- 默认标题：`Olfia — For the rooms you live in, and the ones you imagine.`
- 各页标题格式：`{页面名} · Olfia`
- 页面名：My Page / Scent Atlas / Capture / Scent Card / The Olfia Edit / Gift card / Gifts / Scent quiz / Privacy / Rooms / Scentpedia
- 网站描述（搜索结果里那句）：`There’s more to a room than what you see. For the rooms you live in, and the ones you imagine.` (T)
- 分享卡片标题：`Olfia`
- 分享卡片描述：`Make your scent, create your rooms.` (T)
- 分享图片说明 [A11y]：`Olfia, with dried rose, orange, lavender, cedar, vanilla, cinnamon and linen on cream paper`
- [A11y] `Skip to content`

### 0.2 顶部导航
结构：Olfia 字标 ｜ 五个入口（各带子菜单）｜ 头像图标（My Page）

- 字标：`Olfia` [A11y] `Olfia, home`
- **Capture** (T)
  - `Record a scent`
  - `Scent cards`
- **Rooms** (T)
  - `Create an atmosphere`
  - `Fragrance matches`
- **Scent Atlas** (T)
  - 菜单顶部小字 [Hint]：`Your personal archive of scent.` (T)
  - `Fragrance shelf`
  - `Scent journals`
- **Discover** (T)
  - `Olfia · Gifts`
  - `Scentpedia`
- **The Edit** (T)（无子菜单）
- 头像图标 [A11y] `My Page` (T)
  - `Account`
  - `Settings`
- 手机菜单按钮 [A11y]：`Open menu` / `Close menu`

> 注意：导航里叫 Fragrance shelf / Scent journals / Fragrance matches / Scent cards，但对应页面里面的标签还叫旧名字（Calendar、Favorites、Tags & profile、My shelf、Matches this room），见第 4、5 节。

### 0.3 页脚
结构：字标块 ｜ Capture ｜ Rooms ｜ Scent Atlas ｜ Discover ｜ The Edit ｜ About Olfia → 邮件订阅 → 底栏

- 字标块
  - `Olfia`
  - [Body] `For the rooms you live in, and the ones you imagine.` (T)
  - 邮箱链接：你的 USC 邮箱
  - [A11y] `Instagram (coming soon)`、`小红书 (coming soon)`
- 五栏：同导航（见 0.2）
- **About Olfia**：`The Concept` / `How it Works` / `The Creator`
- 邮件订阅
  - [H] `Let the scent stay a little longer.` (C，你让我写的)
  - [Placeholder] `Email address`
  - [Button] `Count me in` (T)
  - 下拉 [Label]：`Where did you find Olfia?` (T)
  - [Option]：`Instagram` / `RedNote` / `Pinterest` / `A friend` / `Google` / `Somewhere else`
  - [Hint] `Occasional inspirations from Olfia. Unsubscribe anytime.` (T)
  - 成功：`You’re in. Welcome to Olfia.`
  - [Error] `That didn't go through. Please try again.`
- 底栏：`© 2026 Olfia` ｜ `Privacy` ｜ `A USC DSM596 capstone project`

### 0.4 右下角测试小窗（除了 /quiz 每页都有）
- 没做测试时
  - [Card] `Find your scent personality` (T，Notion 05)
  - [Button] `Take the quiz`
- 做过测试后
  - [Card] `{角色名}`，比如 `The Guardian`
  - [Button] `See your result`
- [A11y] `Scent personality quiz`、`Minimize`、`Close`

### 0.5 弹窗
**Mock 登录 / 注册**（只在加载了示例数据时出现）
- 字标：`Olfia`
- [H2] `Welcome back`（注册：`Create your account`）(C)
- [Label] `Email`、`Password`
- `Remember me` ｜ [Link] `Forgot password?`
  - 点了之后：`Resetting a password comes with real accounts.` (C)
- [Button] `Sign in`（注册：`Create account`）
- [Hint] `This is a preview: what you type here is not kept or sent.` (C)
- 分隔线：`or`
- [Button] `Continue with Google`
- 切换：`New to Olfia?` [Link] `Create an account` ／ `Already have an account?` [Link] `Sign in`
- 右半边图上的字：`Life, through scent.` (T)

**Olfia Plus 还没开放**
- [H2] `Olfia Plus isn’t open yet.` (C，11/21 文案草稿)
- [Body] `Leave your email and you’ll hear first.` (C)
- 下面是邮件订阅框（同 0.3，没有标题那句）

**存第三个房间时**
- [H2] `Your free plan keeps two rooms.` (C)
- 两张方案卡（同 10.6）
- [Button] `Replace a saved room` ｜ [Link] `Not now`
- 第二步
  - [H2] `Which room should this one replace?` (C)
  - 已存房间列表：`{房间名} · {你给它的名字}` + 日期
  - [Body] `The room you pick is deleted from this browser, and this one is saved in its place.` (C)
  - [Button] `Replace this room` ｜ [Link] `Back`

### 0.6 提示条 [Toast]（底部弹出）
- `Saved to your Scent Atlas` + 链接 `Open the Atlas` / `Open`
- `Sample pages added`（+ `Open Scent Atlas`）
- `Link copied` ｜ `The link couldn’t be copied` ｜ `Couldn’t copy the link.`
- `Couldn’t make the image. Try again?`
- `Image saved` ｜ `Scent Card saved` ｜ `Image saved — post it from your app` ｜ `Gift card saved`
- `Added to My shelf` ｜ `Added to your shelf` ｜ `Added to your shelf without the photo (the browser is full)`
- `Couldn’t save it in this browser.`
- `Signed out` ｜ `This browser is cleared`
- 统计开关：`This browser is marked as you. Its visits are not counted.` ／ `This browser counts as a visitor again.`

---

## 1 首页 `/`

结构：
```
01–02 首屏（左：文字；右：主视觉拼贴板）
  轮盘：Discover the Seven Scent Families
  The Edit：Discover Olfia’s Official Recommendations
  Gifts
  房间预设：Imagine a room, down to its scent
04 About Olfia（The Concept / How it Works / The Creator）
  结尾邀请：That scent you loved?
05 右下角测试小窗（见 0.4）
```
> 03 "The same room, a different feeling" 还没有做：现在轮盘和 The Edit 只是改了标题，没有放进 03 的结构里。

### 1.1 首屏
- [H1] `Life, through scent.` (T)
- [Lead] `A personal home fragrance platform that connects scent, space, and memory.` (T，你的定位句，Claude 缩成一行)
- 三行功能 (T)
  - `Capture` — `Keep a scent you noticed in the moment.`
  - `Rooms` — `Design your space with the ideal scent in mind.`
  - `Atlas` — `Your personal scent archive, full of memories.`
- [Button] `Start the capture` ｜ `Design your space` (T)
- 右边拼贴板上的手写字：`reading corner, by the window`
- [A11y] `Scent design board: tap a pinned reference to try it on the room sketch`；两张小图：`Bookshop photograph`、`Courtyard sketch`

### 1.2 轮盘
- [H2] `Discover the Seven Scent Families` (T)
- [Lead] `Turn the dial.` (T)
- 右边卡片（随转盘换）
  - [H3] `{家族名}`
  - [Body] `{家族一句话}`（7 条见第 7 节表格）
  - [Hint] `Sits next to {A} and {B}; neighbours layer well.`
  - [Button] `Try {家族名} in a room` ｜ [Link] `Read more`

### 1.3 The Edit
- [H2] `Discover Olfia’s Official Recommendations` (T)
- [Lead] `Culture, fragrance, and the art of living.`
- [Button] `Read the Edit`
- 三张最新文章卡（文章内容不在本清单）

### 1.4 Gifts
- [H2] `Gifts`
- [Lead] `A scent for your room, or someone else’s.` (C)
- [Button] `For me` ｜ `For someone`
- 三张礼物卡：`{品牌} · {类型}` / `{产品名}` / `{价格 · 容量}` 或 `In stores only` / `{家族}`

### 1.5 房间预设
- [H2] `Imagine a room, down to its scent` (T)
- [Lead] `Start from a room that is already set, then make it yours.`
- [Button] `Open Rooms`
- 三张预设卡 (C，11/10 你让我写的)
  - `Living room, late` — `A vanilla-clove candle, the record on side two, shoes kicked off.`
  - `Bedroom, morning` — `Bergamot mist from the diffuser, blinds half up, sheets still warm.`
  - `Study, afternoon` — `Cedar incense in slanting sun, a pencil tucked behind one ear.`

### 1.6 About Olfia（11/23 新加）
- [H2] `About Olfia`
- [Lead] `Make your scent, create your rooms.` (T)
- 左侧小目录：`The Concept` / `How it Works` / `The Creator`

**The Concept**
- [H3] `The Concept`
- 卡片一
  - `Scent is an afterimage.` (T)
  - [Body] `Like the soft shape that lingers after you look away, a scent outlasts its moment in a room and comes back as an impression. Olfia keeps that impression, so you can return to it.`
- 卡片二
  - `Olfactory, and utopia.`
  - [Body] `Utopia holds two old Greek words: eu-topos, a good place, and ou-topos, no place. Olfia is for both: the rooms you live in and the ones you only imagine.`

**How it Works**
- [H3] `How it Works`
- 循环图五个节点：`Discover` / `Rooms` / `Capture` / `Share` / `Scent Atlas`（中间）
- 每一步：大字 + 小字 + 链接

| 节点 | 大字 (T，品牌话) | 小字 | 链接 |
|---|---|---|---|
| Discover | There’s more to a room than what you see. | Learn the seven scent families, take the quiz, and find a scent to give. (C) | Open Scentpedia |
| Rooms | Imagine a room, down to its scent. | Design your space with the ideal scent in mind. (T) | Design your space |
| Capture | That scent you loved? Save it for later. | Keep a scent you noticed in the moment. (T) | Start the capture |
| Share | A little piece of your world, ready to share. | Turn a scent you kept into a card you can send. (C) | Make a Scent Card |
| Scent Atlas | Your rooms, ideas, and scent notes, all in one place. | Your personal scent archive, full of memories. (T) | Open your Scent Atlas |

- [H4] `Where the seven families come from` (C)
  - [Body] `Olfia’s seven families start from Michael Edwards’ Fragrance Wheel. Its four main families, Fresh, Floral, Amber and Woody, are the frame; Citrus & Fruit and Gourmand are split out the way home-fragrance shelves sort them.` (C，你笔记的英文版)
  - [Link] `Fragrances of the World`
- [H4] `Where new ideas come from` (C)
  - `The Olfia Edit` — `Culture, fragrance, and the art of living.`
  - `Olfia · Gifts` — `A scent for your room, or someone else’s.`

**The Creator**
- [H3] `The Creator`
- 头像位置（空）
- 信纸 (C)
  - 第一句（大字）：`I’m a graduate student at USC Annenberg, and Olfia is my capstone project.`
  - `It began with two habits of mine: paying attention to fragrance and how it shapes my wellbeing, and planning and looking back on the small rituals that make up my days.`
  - `Having lived in both China and the United States, I noticed how differently people scent their homes, their ceremonies and their seasons.`
  - `I’m drawn to aesthetics, modern art and cultural anthropology, and to botany, the environment, and what cultures around the world, including Indigenous communities, know about plants. They all lead me back to one question: how do we remember a place through its smell? Olfia is my answer in progress.`
  - 签名：`Tiffany Liu` ｜ [Link] `Say hello`

### 1.7 结尾邀请
- [H2] `That scent you loved? Save it for later.` (T)
- [Button] `Capture a scent`

---

## 2 Capture `/capture`（记录一个气味，9 步）

结构：进度条 → 一步一个问题 → 右侧明信片预览 → 保存

| 步 | 问题 [H2] | 选项 / 输入 |
|---|---|---|
| 1 | `Which season is it?` | Spring / Summer / Autumn / Winter |
| 2 | `What time of day?` | Morning / Afternoon / Evening / Night |
| 3 | `Where did you notice it?` | Living room / Bedroom / Study / Reading corner / Kitchen / Bathroom / Closet / Entryway / Balcony / Car / Office / Other |
| 4 | `What’s the occasion?` | Everyday / Date / Party / Meditation / Bath / Sleep / Work / Guests over / Cleaning day / Holiday |
| 5 | `What is the scent coming from?` | Candle / Diffuser / Incense / Room spray / Essential oil / Fragrance-free / none / Other |
| 6 | `What is it?` | 切换 `A product` / `Something I did`；产品：[Label] `Product` [Placeholder] `Brand or shop`，[Label] `Scent name` [Placeholder] `Cedar & Clove`；做的事：Open window / Simmer pot / Fresh flowers / Clean laundry / Baking / After rain / Other |
| 7 | `Which families does it belong to?` | [Hint] `Pick one or two`；[Lead] `We’ve picked the usual families for that. Change them if it smelled different.`；七个家族 |
| 8 | `How did it make you feel?` | [Hint] `Up to two`；Calm / Cozy / Focused / Nostalgic / Energized / Romantic / Melancholy / Playful / Grounded / Fresh start / Restless / Safe |
| 9 | `Keep it or let it go?` | `Loved it` / `Not for me`；[Label] `Name this moment`；[Label] `One line worth keeping` (optional) [Placeholder] `What it was like, or why you want to remember it`；[Label] `Tags` [Placeholder] `add your own` [Button] `Add` |

- 按钮：`Back` ｜ `Next` ｜ `Skip` ｜ 最后一步 `Save to Scent Atlas`
- 保存后：[Button] `Make a Scent Card from the last one`；[Toast] `Saved to your Scent Atlas` / `Open the Atlas`
- 右侧明信片：邮票上 `{家族名}` 或 `Olfia`；感受、名字、一句话、产品或来源、场合 · 时间、#标签、日期（都来自你填的内容）

---

## 3 Scent Card `/card`（做一张可以分享的卡片）

- [H1] `A little piece of your world, ready to share` (T，品牌话)
- [Label] `Template`：`Film` / `Instant` / `Postcard`
- [Label] `Size`：`9:16` / `3:4`
- [Label] `Color`（七个家族）
- 开关：`Stamp` / `Atmosphere`
- [Label] `Families`
- [Label] `Stickers`；[Hint] `Drag stickers to place them. Tap one to resize or rotate.`
- [Label] `Notes`
  - `One line` [Placeholder] `What was going on?`
  - `Room`；开关 `Show name`，[Label] `Name`；开关 `Show room` / `Show moment`；开关 `Show city`，[Label] `City`
- [Button] `Save image · {9:16}`（生成中：`Making image…`）
- 分享图标 [A11y]：`Share to Instagram` / `Pinterest` / `X`
- [Hint] `1080 px wide PNG`
- 底部：`Start from a page:` [Link] `Scent Atlas`
- 卡片上的固定字：`Olfia`、胶片边上 `olfia 400`、示例 `Cedar · Clove · Vanilla`、`Reading Corner`
- 分享标题：`My Scent Card`

---

## 4 Rooms `/rooms`（设计一个房间的气味）

结构：编辑器（左：物品抽屉；中：房间画面；右：设置）→ Your rooms → Matches this room

### 4.1 编辑器
- 抽屉标签：`Furniture` / `Scent` / `Materials`；[Hint] `Tap to add, then drag it into place.`
- 工具 [A11y]：`Undo` / `Redo`；开关 `Snap to floor`
- 选中物品工具 [A11y]：`Rotate` / `Flip` / `Bigger` / `Smaller` / `Bring to front` / `Send to back` / `Delete`
- 右侧设置
  - [Label] `Your name for it` [Placeholder] `rain, chapter three`
  - [Label] `Room`：`Reading Corner` / `Kitchen` / `Bathroom`
  - [Label] `Scent strength`：两端 `barely there` ↔ `fills the room`
  - [Label] `Time of day`：`Morning` / `Afternoon` / `Night`
  - 开关 `Window open`
  - [Label] `Scent families` [Hint] `up to 3`
  - [Hint] `Try adding {家族}`
  - [Button] `Save room`（编辑已存房间时：`Save changes`）｜ `Make a card`
- 物品名称（抽屉里每样东西的名字）见附录 B

### 4.2 Your rooms
- [H2] `Your rooms` ｜ [Button] `New room`
- 卡片：日期、房间名、你给的名字；第一张有 `Continue`
- [Empty] `Rooms you save land here.`

### 4.3 Matches this room（导航里叫 Fragrance matches）
- [H2] `Matches this room`
- 筛选 [Label] `When`：`Any time` / `Mornings` / `Evenings` / `Warm months` / `Cold months`
- 产品卡：品牌 · 类型、名字、价格容量或 `In stores only`、香调、时间（`Any time of day`）、季节（`All year`）、`Shares {家族} with this room`、[Link] `More like this`
- [Button] `Back to this room`
- [Empty] `Nothing matches that combination yet.`
- [Hint] `Links open the brand’s site. Olfia doesn’t sell products.`

---

## 5 Scent Atlas `/atlas`（你的个人档案）

- [H1] `Scent Atlas`
- [Lead] `Your rooms, ideas, and scent notes, all in one place.` (T)
- 文件夹标签：`Calendar` / `Favorites` / `Tags & profile` / `My shelf`（导航里写的是 Fragrance shelf、Scent journals）

### 5.1 Calendar（拼图日历）
- [A11y] `Previous month` / `Next month`；星期 `Sun`–`Sat`
- [Empty] `nothing pinned yet`（手写）
  - `Save a room or capture a scent, and it lands here as a page of the month.`
  - [Button] `Capture a scent` / `Make a room` / `See a sample`
- 某天没有：`nothing pinned this day` + [Link] `Capture a scent`
- 条目：`Rooms` 或 `Capture` · `{房间}`；`Star` / `Unstar`；[Button] `Open` / `Scent Card` / `Delete`
- 删除确认 [Dialog]：`Delete this page from your Scent Atlas?`

**Monthly record（月票根）**
- `Monthly record`；[Empty] `no stamps in {月份} yet` + `Capture a scent`
- `Most used`；`Families` / `Time of day` / `Tags`

### 5.2 Favorites
- 切换：`Starred rooms` / `Saved products`
- [Empty] `Star a room in the calendar to keep it here.`
- [Empty] `Products you capture land here.`；没名字的显示 `Unnamed`

### 5.3 Tags & profile
- [Empty] `Tags appear once you capture a scent.`

### 5.4 My shelf（加你常用的产品）
- [H2] `Add to my shelf`；切换 `Paste a link` / `Upload a photo`
- [Placeholder] `https://www.diptyqueparis.com/…`
- 照片：`Choose a photo of your bottle, candle or diffuser` / `Choose another photo`；[Button] `Skip the photo`
- 读链接结果：`Found it in Olfia's product list.` ／ `Read from the product page. Check the details below.` ／ `Read from the address. Check the details below.`
- 表单：`Name`（`Feu de Bois`）、`Brand`（`Diptyque`）、`Type`、`Families (up to two)`、`How you use it`（Every day / Mornings / Evenings / Weekends / Special occasions）、`A note (optional)`（`Two sprays in the hallway before guests arrive`）
- [Button] `Add to my shelf` ｜ `Cancel`；卡片上 `Open link` / `Remove`
- [Empty] `nothing on your shelf yet`
- [Error] `That doesn't look like a web address.` ／ `Please choose a photo.` ／ `That photo could not be opened. Try a JPEG or PNG.` ／ `Give it a name first.` ／ `This browser is out of space. Remove an item and try again.`
- [Dialog] `Remove this from your shelf?`

---

## 6 Gifts `/gifts` 和礼物卡 `/gifts/card`

### 6.1 Gifts
- [H1] `Gifts`
- 切换：`For me` / `For someone`
- For someone：[Label] `For` [Placeholder] `Their name`；`Their scent`（家族）
- For me：`From your quiz and your Scent Atlas` ／ `From your quiz` ／ `From your Scent Atlas` ／ `Your scent`；[Link] `Retake the quiz` ／ `Take the quiz`
- 礼物卡按钮：`Make a gift card`；图标 `Save to Scent Atlas` / `Saved to Scent Atlas`、`Save to My shelf` / `On My shelf`、`Make a Scent Card`、`Open on {品牌}'s site`；`In stores only`
- [Hint] `Links open the brand’s site. Olfia doesn’t sell products.` (C)

### 6.2 礼物卡
- 返回：`Gifts`
- 卡片：`For {名字}`（没填：`For you`）、`olfia.studio`
- 表单：`For`（`Their name`）、`Note`、`From`（`Your name`）
- [Link] `Open on {品牌}’s site`
- [Button] `Download image` ｜ `Share` ｜ `Copy link` ｜ `Save to Scent Atlas`

---

## 7 Scentpedia `/scentpedia`

结构：标题 → 测试区块 → 七个家族跳转 → 七张家族卡（每张：名字、一句话、香调、At home、材料图、小故事、试试链接）

- [H1] `Scentpedia` (T)
- [Lead] `Seven fragrance families, seven little stories.`

### 7.1 测试区块（同首页原来的测试区块）
- 没做过
  - [H2] `Which scent is you?`
  - [Lead] `Twenty questions about how you live. You get one of sixteen characters, the scent family that fits, and a room to start from.`
  - [Button] `Take the quiz`；[Hint] `About three minutes`
- 做过
  - [H2] `You are {角色名}.`
  - [Lead] `{角色那句话}`
  - [Button] `See your result`；[Link] `Design a room in this style`

### 7.2 家族卡（7 张）

每张的固定字：`At home:` ｜ [Link] `Try {家族名} in a room` ｜ 小故事按钮 `Read the little story` / `Show less` ｜ `Research sources`

| # | 家族 | 一句话（what） | 香调 | At home | 轮盘上的位置（只在代码里） | 材料图名 |
|---|---|---|---|---|---|---|
| 01 | Floral | The largest family in perfumery, built around flowers: from fresh-cut petals to soft, powdery blooms. | rose · jasmine · peony · orange blossom · iris | bedrooms and living rooms in spring and summer. | Floral, Soft Floral | dried rose, jasmine, peony |
| 02 | Gourmand | Scents you could almost eat. A younger family that grew popular in the 1990s. | vanilla · tonka · honey · coffee · caramel | cozy evenings; a little goes a long way in small rooms. | Not on the wheel; a home-fragrance shelf category | vanilla pod, honeycomb, coffee beans |
| 03 | Warm & Spicy | Called Amber on the fragrance wheel (once “Oriental”): resins, balsams and warm spices. | amber · cinnamon · clove · frankincense · tobacco | autumn and winter, layered over woods. | Amber, Soft Amber, Woody Amber | cinnamon, resin, clove |
| 04 | Woody & Earthy | Dry woods, mosses and roots. Often the base that makes a scent last. | cedar · sandalwood · vetiver · oakmoss · patchouli | reading corners, studies and living rooms. | Woods, Mossy Woods, Dry Woods | cedar ring, bark, moss |
| 05 | Green & Herbal | Crushed leaves, cut stems and kitchen herbs. Aromatic notes like lavender sit here too. | basil · tomato leaf · rosemary · lavender · green tea | kitchens and work desks; it cuts through cooking smells. | Green, Aromatic | fig leaf, rosemary, lavender |
| 06 | Citrus & Fruit | Bright notes pressed from peels, plus juicy fruit. They are the first to fade. | bergamot · lemon · blood orange · grapefruit · pear | mornings, entryways and kitchens. | Citrus; Fruity | orange slice, lemon peel, pear |
| 07 | Fresh & Clean | Water, air and clean laundry. Light, airy and easy to live with. | sea salt · rain · ozone · cotton · cucumber | bathrooms and entryways, any season. | Water | sea salt, linen, pebble |

### 7.3 七个小故事 (T，11/10 你给的)

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
- 筛选：`Topic`（`All topics`）、`Month`（`All dates`）
- [Empty] `No stories for this topic and month yet.`
- 侧栏：[H2] `Editor’s Picks` ｜ [H2] `In Season`

### 8.2 文章页（正文之外）
- 返回：`The Olfia Edit`
- 左栏：[H2] `Recreate This at Home`，[Link] `More in Gifts`
- 右栏：[H2] `Try This`，[Button] `Build This Room`
- 文末：`The take-home edit` ｜ [H2] `References` ｜ 分享 `Copy link` / `Pinterest` / `Share` ｜ [H2] `Keep reading`
- Scentpedia 小块：[Link] `Scentpedia`

---

## 9 测试 `/quiz`

### 9.1 开始和进行中
- [H1] `Which scent is you?`
- [Lead] `Twenty quick questions. Tap what feels right.`
- [Button] `Back` / `Next`

### 9.2 二十道题

| # | 题目 | 选项 |
|---|---|---|
| 1 | After a long week, you recharge with… | A night out / A quiet evening alone / One close friend, one couch |
| 2 | In a new city, you… | Ask strangers for tips / Wander alone with headphones / Plan the day around one good meal |
| 3 | Your phone is… | Always buzzing / On silent since forever |
| 4 | Walking into a room, you notice first… | How it looks / How it feels |
| 5 | The stories you love are… | About real people / About worlds that don’t exist |
| 6 | Instructions: you… | Read every step / Skim, then figure it out |
| 7 | A friend is upset. You first… | Ask what happened / Suggest what to do |
| 8 | Big choices come from… | Your head / Your gut |
| 9 | The compliment you keep… | “You’re so sharp” / “You’re so kind” |
| 10 | Your weekend is… | Planned by Thursday / Decided Saturday morning |
| 11 | Your desk is… | A clear surface / A creative mess |
| 12 | Deadlines | Done early / Done in the last hour, brilliantly |
| 13 | Pick a weather | First warm day of spring / Rain on the window / Golden autumn afternoon / Clear cold morning |
| 14 | Pick a texture | Linen / Worn leather / Velvet / Fresh-cut grass |
| 15 | Your comfort drink | Black coffee / Herbal tea / Hot chocolate / Sparkling water with lemon |
| 16 | Your ideal window view | The sea / A forest / A garden / An orchard |
| 17 | A smell that takes you back | A bakery / Fresh laundry / A bonfire / Flowers at a market |
| 18 | Pick a colour | Deep green / Warm brown / Pale blue / Blush pink / Bright orange / Amber / Caramel |
| 19 | Your idea of luxury | A quiet morning / A long dinner / Flowers delivered / A fireplace |
| 20 | Christmas smells like… | Pine / Cinnamon / Gingerbread / Oranges and cloves |

### 9.3 结果
- [H1] `You are {角色名}.`
- [Body] `Your scent is {家族}, with a second note of {家族}. It layers well with {家族}.`
- [Button] `Design a room in this style` ｜ `Save card` / `Share` ｜ [Link] `Take the quiz again`
- 结果卡上：`Olfia · {日期}`

### 9.4 十六个角色 (T：名字和那句话是你 11/8 定的)

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

---

## 10 My Page `/account`

结构：顶部卡片 → Your Scents at a Glance → My Preferences → Personal Info → Plans → Settings → 测试结果

### 10.1 顶部卡片
- [H1] `My Page`
- [Body] `Accounts come later. For now, everything lives in this browser.`
- 登录后（示例模式）：`Signed in for this preview.` [Link] `Sign out`
- 小标签：`{n} days recorded` / `{n} rooms` / `{n} captures`

### 10.2 Your Scents at a Glance
- [H2] `Your Scents at a Glance`
- 开关 `Sample data`；[Hint] `Showing sample pages until you save your own.`
- `Families, All Time` ｜ `Most used:`
- `How It Felt`（[Empty] `No emotions recorded yet.`）
- `Time of Day` ｜ `Product Types` ｜ `Your Tags`
- `Try Next`：`{家族} · next to {家族} on the wheel` ／ `{家族} and {家族} blend well`

### 10.3 My Preferences
- [H2] `My Preferences`
- `Preferred Scent Styles`（七个家族）｜ `Preferred Products`（Candle / Diffuser / Incense / Room spray / Essential oil / Fragrance-free / none）
- [Body] `You reach for {家族} scents at night and {家族} in the morning.`
- 像素画说明 [A11y]：`Pixel picture: a timber cabin among cedar trees at dusk, a candle in its window, mist from the chimney and an orange tree beside it`

### 10.4 Personal Info
- [H2] `Personal Info`
- `Username` / `Email` / `City, country`，[Placeholder] `Available with accounts`

### 10.5 Plans（11/23 新加，全部 C）
- [H2] `Plans`
- Free 卡：`Capture, Rooms and your Scent Atlas` / `Keep 2 rooms` / `Recommendations, each with its reason` ｜ `Your plan`
- Olfia Plus 卡：`Everything in Free` / `Keep as many rooms as you like` / `Photo View and saved Scent View settings` / `More Scent Card templates and stamps` ｜ [Button] `Join Olfia Plus`
- 对比表（Free ｜ Olfia Plus）

| 功能 | Free | Olfia Plus |
|---|---|---|
| Scent quiz | ✓ | ✓ |
| Capture and Scent Cards | ✓ | ✓ |
| Rooms you can keep | 2 | No limit |
| Scentpedia and The Olfia Edit | ✓ | ✓ |
| Recommendations, each with its reason | ✓ | ✓ |
| Monthly analysis and seasonal picks | ✓ | ✓ |
| Photo View: your room beside its collage | – | ✓ |
| Saved Scent View settings | – | ✓ |
| More Scent Card templates and stamps | – | ✓ |

- 常见问题
  - `When does Olfia Plus open?` — `It isn’t open yet. Leave your email and you’ll hear first.`
  - `Where is my Scent Atlas saved?` — `In this browser only, for now. Nothing goes to a server, and Export my data in Settings makes a copy.`
  - `Can I cancel anytime?` — `Nothing is charged today. When Olfia Plus opens, its terms will be shown before you join.`
- 价格：还没有（等你定）

### 10.6 Settings
- [H2] `Settings`
- [Body] `Entries are saved in this browser only.`
- [Button] `Load sample pages` / `Export my data` / `Clear this browser`
- [Dialog] `Clear every entry saved in this browser?`

### 10.7 测试结果
- 没做：[H2] `Which Scent Is You?`，[Lead] `Twenty questions about how you live. You get one of sixteen characters, the scent family that fits, and a room to start from.`，[Button] `Take the quiz`
- 做过：[H2] `You Are {角色名}.`，`Your scent is {家族}, with a second note of {家族}. It layers well with {家族}.`，[Button] `Design a room in this style`

---

## 11 Privacy `/privacy`
- [H1] `Your entries stay in your browser`
- [Lead] `Olfia has no accounts in this release. Everything you capture or build is stored only in this browser, on this device.`
- `What is stored:` your Capture entries, Rooms, and stars, under one local key. None of it is sent to a server.
- `Analytics:` Olfia uses Google Analytics to count visits and a few actions, such as finishing the quiz, saving a Scent Card or opening a product link. Google Analytics sets cookies to tell visits apart. The events carry codes such as a scent family, never what you type.
- `Without cookies:` for visitors in the EU, the UK and Switzerland, and for browsers that send Global Privacy Control or Do Not Track, analytics cookies stay off and Google receives only cookieless signals. Advertising features are off for everyone.
- `Email:` if you sign up, your email address goes to Kit, the service that sends Olfia's emails. Your answer to "Where did you find Olfia?" is counted in Google Analytics, not stored with your address. Every email has an unsubscribe link.
- `Google's part:` [Link] how Google uses information from sites that use its services. To opt out on every site, use the [Link] Google Analytics opt-out add-on.
- `Removing it:` clear this browser from your account page, or clear site data in your browser settings.
- （页面上可见）`TODO(Tiffany): review this note before launch.`

## 12 找不到页面（404）
- `404`
- [H1] `This room doesn’t exist (yet).`
- [Lead] `Try Rooms to imagine one, or Capture to keep a real one.`
- [Button] `Rooms` / `Capture`

---

## 附录 A 选项词表（多处共用）
- 房间：Living room / Bedroom / Study / Reading corner / Kitchen / Bathroom / Closet / Entryway / Balcony / Car / Office / Other
- 季节：Spring / Summer / Autumn / Winter
- 时间：Morning / Afternoon / Evening / Night（Rooms 里只有 Morning / Afternoon / Night）
- 场合：Everyday / Date / Party / Meditation / Bath / Sleep / Work / Guests over / Cleaning day / Holiday
- 感受：Calm / Cozy / Focused / Nostalgic / Energized / Romantic / Melancholy / Playful / Grounded / Fresh start / Restless / Safe
- 来源：Candle / Diffuser / Incense / Room spray / Essential oil / Fragrance-free / none / Other
- 做的事：Open window / Simmer pot / Fresh flowers / Clean laundry / Baking / After rain / Other
- 用法：Every day / Mornings / Evenings / Weekends / Special occasions
- 产品时间：Any time / Mornings / Evenings / Warm months / Cold months

## 附录 B Rooms 抽屉里的物品名
- 家具和摆设：Armchair, Lounge chair, Rocking chair, Slipper chair, Side table, Arc lamp, Plant, Rug, Painting, Small print, Cantilever chair, Bucket chair, Patterned chair, Low lounge chair, Folding chair, Clear folding chair, Leather sofa, Tulip table, Blue side table, Round table, Pedestal table, Bean coffee table, Steel desk, Floor lamp, Paper pendant, Globe lamp, Table lamp, Spring lamp, Wood bookcase, Arched shelf, Blue shelf, Modular shelf, Ivory shelf, Wave shelf, Chrome shelf, Open shelf, Wire shelf, Record cabinet, Carved cabinet, Platform bed, Mustard bed, Bouclé bed, Chrome bed, Rattan bed, Wave bed, Blue bed, Rust bed, Olive bed, Padded bed, Tube bed, Steel bed, Record player, Space-age stereo, Floor mirror, Face vase, Glass bowl, Sphere speaker, Black speaker, Round speaker, Glass cone, Ceramic pot, Floral cushion, Instant camera, Cassette, Iced coffee, Desk caddy, Old books, Books, Book stack, Green books, Notebooks, Open book, Open planner, Papers & pencil, Postcards, Letter bundle, Old papers, Envelopes, Photo box, Picnic basket, Strawberry cake
- 厨房和浴室：Kitchen counter, Tiled wall, Jar shelf, Kettle, Fruit bowl, Herb pots, Bathtub, Pedestal sink, Bath tiles, Round mirror, Towel rail, Bath mat, Soap dish, Bottles
- 香氛：Candle, Diffuser, Room spray, Incense, Oil burner, Simmer pot
- 材料：dried rose, jasmine, peony, vanilla pod, honeycomb, coffee beans, cinnamon, resin, clove, cedar ring, bark, moss, fig leaf, rosemary, lavender, orange slice, lemon peel, pear, sea salt, linen, pebble

## 附录 C 示例数据里的文字（只在 ?sample=on 时出现）
- 房间名字：rain, chapter three ／ first coffee ／ long bath ／ desk, late afternoon ／ sunday sheets ／ record on side two ／ orange peel simmer ／ a slow sunday ／ eucalyptus steam ／ first fire of the year ／ exam week
- 记录名字：Reading after work ／ First cold evening ／ Breakfast, window open ／ Window open after rain ／ Too smoky for sleep ／ Peonies from the market ／ Hotel lobby at home ／ First winter dinner ／ Sheets just off the line ／ Afternoon slump, three drops ／ Banana bread, second batch ／ Lights out ／ After the storm ／ Two sprays after the shower ／ Orange peel on the radiator ／ Movie night ／ Too sweet for the whole house ／ Pine trail, windows down ／ Lilies on the desk
- 一句话：The room smelled like a library with the lights low. ／ Orange peel, two cinnamon sticks, the radio on. ／ Lovely in the living room, too much by the bed. ／ Guests noticed it before they took their coats off. ／ The whole flat smelled like Sunday. ／ Chestnuts and smoke, a blanket for two.
- My shelf 备注：The one I light first. ／ Three drops before work. ／ Entryway, always on. ／ Sunday mornings only.
- 另外三个房间预设（写在代码里，示例房间用它们的布置，但这几句话目前网站上看不到）：Reading corner, night — A cedar candle burning low, one lamp on, a page folded down. ／ Kitchen, Sunday morning — Orange peel and cinnamon on a low simmer, the radio on quietly. ／ Bathroom, evening — A eucalyptus candle on the edge of the tub, the tap still running.
