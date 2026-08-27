/* ============================================
   肯尼亚咖啡豆种植系统 - 智能问答
   基于本地知识库的咖啡种植问答系统
   支持中英斯三语（跟随 coffee_lang）
   ============================================ */

const CoffeeChatBot = {

  lang: localStorage.getItem('coffee_lang') || 'zh',

  /** 知识库（每个条目 keywords 为命中关键词，answer 中文 / answerEn 英文） */
  knowledgeBase: [
    // ===== 文档新增：发展历史 =====
    {
      keywords: ['历史', '发展史', '起源', '由来', '引入', '传教士', '殖民', '咖啡法案', 'history', 'origin', 'colonial', 'missionary', 'how it started'],
      answer: `📜 **肯尼亚咖啡发展历史**

**引入起源**：19世纪末，法国传教士将咖啡树苗带入肯尼亚，最早在内罗毕周边布拉地区小规模试种；20世纪初英国殖民者大规模推广，引入波旁老品种，建立庄园化种植体系。

**制度奠基**：1933年肯尼亚颁布《咖啡法案》，1934年正式成立内罗毕咖啡交易所（NCE），确立每周固定拍卖规则，这套交易制度沿用至今，是肯尼亚咖啡品质管控的核心基石。

**品种改良**：上世纪30年代斯科特实验室选育出SL28、SL34两大传奇主力品种，奠定肯尼亚标志性明亮果酸风味；后期为对抗咖啡浆果病，培育Ruiru11、Batian抗病品种。

**现代产业**：肯尼亚独立后保留合作社小农模式，咖啡成为国家第二大农产品出口创汇作物，年产量约6.5万吨阿拉比卡生豆，占全球阿拉比卡产量1.8%，以精品水洗豆享誉全球。`,
      answerEn: `📜 **History of Kenyan Coffee**

**Origin & Introduction**: In the late 19th century, French missionaries brought coffee seedlings to Kenya, first trialed on a small scale in the Bura area around Nairobi. In the early 20th century, British colonists promoted it widely, introduced the old Bourbon varieties, and established estate-based cultivation systems.

**Institutional Foundation**: In 1933, Kenya enacted the *Coffee Act*, and in 1934 the Nairobi Coffee Exchange (NCE) was formally established, setting the weekly auction rules that still govern the industry today — the cornerstone of Kenya's quality control.

**Variety Improvement**: In the 1930s, Scott Laboratories bred the legendary SL28 and SL34 varieties, establishing Kenya's signature bright, fruity acidity. Later, to fight Coffee Berry Disease, the resistant varieties Ruiru 11 and Batian were developed.

**Modern Industry**: After independence, Kenya kept its cooperative smallholder model. Coffee became the country's second-largest agricultural export, producing about 65,000 tonnes of Arabica green beans a year (~1.8% of global Arabica), world-famous for its specialty washed beans.`
    },

    // ===== 文档新增：种植环境 =====
    {
      keywords: ['种植环境', '生长环境', '先天环境', '大裂谷', '火山土', '红壤', '赤道', 'environment', 'rift valley', 'volcanic soil'],
      answer: `⛰️ **肯尼亚咖啡先天种植环境**

**地理位置与海拔**：坐落于赤道附近东非大裂谷两侧，核心种植带海拔1400–2200米，顶级产区集中在1700–1900米高海拔。高海拔昼夜温差大，咖啡果实成熟速度放缓，风味物质、有机酸、糖分充分积累，是浓郁果酸的底层基础。

**土壤与气候**：火山风化红壤土，富含磷、钾、矿物质，透气性极强；一年两次雨季（4-6月、10-12月），光照充足但不暴晒，当地普遍采用遮荫树种植法（香蕉树、合欢树遮阴），降低果树胁迫、提升果实甜度与复杂度。

**选址红线**：海拔低于1300米种植的咖啡豆风味寡淡、酸度疲软，基本归入商业豆。`,
      answerEn: `⛰️ **Kenya's Natural Growing Environment**

**Location & Altitude**: Kenya lies along the eastern branch of the East African Rift Valley near the equator. The core growing belt sits at 1,400–2,200 m, with top estates at 1,700–1,900 m. High altitude means large day-night temperature swings, slowing cherry ripening so flavor compounds, organic acids and sugars fully accumulate — the foundation of Kenya's intense fruit acidity.

**Soil & Climate**: Volcanically weathered red laterite (Nitisols), rich in phosphorus, potassium and minerals with excellent aeration. Kenya has two rainy seasons (April–June and October–December), ample but not scorching sun. Shade-tree planting (banana and acacia) is common, reducing tree stress and boosting sweetness and complexity.

**Hard limit**: Coffee grown below 1,300 m tends to taste flat with weak acidity and is generally graded as commercial.`
    },

    // ===== 文档新增：六大产区 =====
    {
      keywords: ['产区', '涅里', 'nyeri', '基安布', 'kirinyaga', '穆兰加', 'muranga', '恩布', 'embu', '梅鲁', 'meru', '锡卡', 'thika', '哪里产', '产区排名', 'regions', 'growing areas', 'best region'],
      answer: `🗺️ **肯尼亚六大核心精品产区（按品质排名）**

全部环绕肯尼亚山与阿伯德尔山脉，裂谷微气候决定风味差异：

1. **涅里 Nyeri（王者产区）**：公认肯尼亚TOP1产区，火山土壤最肥沃，SL28占比最高。风味：黑醋栗、百香果、红酒般尖锐明亮果酸，酒体饱满，尾韵悠长干净，拍卖会溢价最高。

2. **基安布 Kirinyaga**：紧邻涅里，风格接近，酸度稍柔和，增加水蜜桃、柑橘调性，性价比极高。

3. **穆兰加 Murang'a**：降雨量偏大，SL34品种居多，核果、焦糖、巧克力尾韵更突出，均衡度拉满。

4. **恩布 Embu**：热带水果调性更强，芒果、菠萝蜜甜感，酸度活泼柔和，新手友好型肯尼亚豆。

5. **梅鲁 Meru**：海拔跨度大，批次差异明显，低海拔批次草本感略重，高海拔批次莓果风味突出。

6. **锡卡 Thika**：商业化批量产区，多为合作社大宗拼配，多用于拼配豆，精品批次较少。`,
      answerEn: `🗺️ **Kenya's Six Core Specialty Regions (by quality)**

All lie around Mount Kenya and the Aberdare Range; the Rift microclimate shapes each profile:

1. **Nyeri (the King)**: Kenya's undisputed No.1 region — the most fertile volcanic soil and the highest share of SL28. Flavor: blackcurrant, passion fruit, sharp wine-like bright acidity, full body, long clean finish; commands the highest auction premiums.

2. **Kirinyaga**: Adjacent to Nyeri with a similar profile, slightly softer acidity plus peach and citrus notes — excellent value.

3. **Murang'a**: Higher rainfall, mostly SL34; stone fruit, caramel and chocolate finish with superb balance.

4. **Embu**: Stronger tropical fruit character — mango, jackfruit sweetness, lively gentle acidity; a beginner-friendly Kenya coffee.

5. **Meru**: Wide altitude range means varied lots; lower-altitude lots have mild herbal notes while high-altitude lots excel in berry flavors.

6. **Thika**: A commercial bulk region, mostly cooperative commodity blends used for blending; few specialty lots.`
    },

    // ===== 文档新增：双重水洗处理法 =====
    {
      keywords: ['双重水洗', '双水洗', '水洗', '处理法', '发酵', '浸泡', '果胶', '高架床', '晾晒', 'washed', 'double washed', 'double-washed', 'fermentation', 'soaking', 'processing'],
      answer: `💧 **肯尼亚独创：双重水洗（深度浸泡水洗）处理法**

这是肯尼亚咖啡区别于所有非洲水洗豆的核心工艺壁垒，95%以上咖啡豆采用这套标准流程，直接决定极致干净的酸质。

**完整步骤**：
1. **脱果肉**：鲜果送入机械脱皮机，剥离果皮果肉，保留带果胶的羊皮纸豆；同时按密度初步分选剔除空心豆。
2. **第一次干发酵**：羊皮纸豆放入水池自然发酵24–48小时，分解大部分果胶。
3. **初次冲洗**：流水冲掉溶解果胶。
4. **二次水下浸泡（肯尼亚独有）**：放入清水池完全浸没浸泡12–72小时，彻底剥离残留微量果胶，这一步就是"双重水洗"的关键。
5. **高架床慢速干燥**：平铺在镂空高架晾晒床（离地隔绝地面湿气），每日多次翻动，历时7–10天缓慢风干，最终含水率严格控制在11%–12%，杜绝霉菌、土味。

**口感结果**：果胶残留几乎为零，酸质纯净无杂味、明亮通透、果汁感突出，没有普通水洗豆的沉闷发酵味，酸与甜分离度极高。`,
      answerEn: `💧 **Kenya's Signature: Double Washed (Deep-Soak) Processing**

This is Kenya's core processing advantage that sets it apart from all other African washed coffees — over 95% of beans follow this standard flow, which directly delivers the ultra-clean acidity.

**Full steps**:
1. **Depulping**: Fresh cherries go through a mechanical pulper to strip skin and pulp, keeping parchment coffee with mucilage; density sorting removes hollow beans.
2. **First dry fermentation**: Parchment beans ferment in tanks for 24–48 hours, breaking down most of the mucilage.
3. **First wash**: Running water rinses off dissolved mucilage.
4. **Second underwater soak (Kenya's unique step)**: Beans are fully submerged in clean water for 12–72 hours to strip the last traces of mucilage — this is the "double washing" key.
5. **Slow drying on raised beds**: Beans are spread on elevated mesh beds (off the ground to avoid humidity), turned several times daily, and air-dried slowly for 7–10 days to a strict moisture content of 11%–12%, preventing mold and earthy taints.

**Result in cup**: almost zero mucilage residue — pure, bright, juicy acidity with no dull fermentation taste, and a very high separation between acidity and sweetness.`
    },

    // ===== 文档新增：官方等级 =====
    {
      keywords: ['等级', '分级', 'aa', 'ab', 'pb', '圆豆', 'peaberry', '象豆', '筛网', 'grade', 'grading', 'screen', 'bean size'],
      answer: `🏷️ **肯尼亚咖啡豆官方等级（按颗粒大小）**

肯尼亚纯以生豆筛网孔径（1/64英寸）分级，等级≠绝对风味好坏，仅代表豆子大小与烘焙受热均匀度，AB级优质合作社批次风味可以超越普通AA级。

- **AA级（Screen 18，7.2mm以上）**：占总产量20%–25%，拍卖最高价等级。最大颗粒高密度豆子，仅高海拔慢熟果实产出，酸度最立体，黑醋栗、红酒、百香果复杂度拉满；AA TOP为再杯测筛选的顶级批次，精品咖啡店主流单品。
- **AB级（Screen 15–17，6.0–6.8mm）**：占总产量40%–50%，出口体量最大的等级，性价比之王。风味无限接近AA，酸度稍内敛，桃子、柑橘甜感更直观，烘焙容错率更高。
- **PB级（Peaberry圆豆/公豆）**：约10%。樱桃内部两颗种子只发育成功1颗，挤压成完整圆形单豆。密度极高，风味高度浓缩，果酸更炸裂，稀缺溢价高于AA。
- **E级（象豆）**：畸形连体豆，物理瑕疵豆，风味不稳定，极少单独售卖。
- **C级**：小颗粒豆（14–15目），风味单薄，用于商用拼配、速溶原料。
- **TT/T级**：碎豆、薄片豆、残缺豆，工业最低等级。
- **MH/ML级**：发霉豆、虫蛀豆、异色瑕疵豆，直接废弃禁止出口。

**选购一句话**：日常喝选AB级高性价比；追求极致果香红酒酸选AA TOP；玩特色浓缩风味选PB圆豆。`,
      answerEn: `🏷️ **Kenyan Coffee Official Grades (by bean size)**

Kenya grades purely by screen size (1/64 inch apertures). Grade ≠ absolute quality — it only reflects bean size and roasting evenness; a top AB cooperative lot can beat an ordinary AA.

- **AA (Screen 18, 7.2mm+)**: 20–25% of output, the highest auction price tier. Largest high-density beans from slow-ripening high-altitude cherries — most structured acidity with full blackcurrant, red wine and passion fruit complexity. "AA TOP" is the cupped cream of the crop, a staple for specialty coffee shops.
- **AB (Screen 15–17, 6.0–6.8mm)**: 40–50% of output, Kenya's biggest export volume — the value king. Flavor is very close to AA with slightly softer acidity, more direct peach and citrus sweetness, and higher roast tolerance.
- **PB (Peaberry)**: ~10%. Only one of the two seeds in a cherry develops, forming a round single bean. Very dense, highly concentrated flavor, even more explosive acidity — rarer and pricier than AA.
- **E (Elephant bean)**: malformed fused beans, physical defects, unstable flavor, rarely sold alone.
- **C**: smaller beans (Screen 14–15), thin flavor, used for commercial blends and instant coffee.
- **TT/T**: broken and flaky beans, the lowest industrial grade.
- **MH/ML**: moldy, insect-damaged or off-color defective beans — discarded and banned from export.

**Buying tip**: AB for everyday value; AA TOP for ultimate fruity red-wine acidity; PB for distinctive concentrated espresso.`
    },

    // ===== 文档新增：烘焙与冲煮 =====
    {
      keywords: ['烘焙', '烘培', '浅烘', '中烘', '深烘', '冲煮', '手冲', '虹吸', '冷萃', '意式', '怎么冲', '如何冲', 'roast', 'roasting', 'brew', 'brewing', 'pour over', 'siphon', 'cold brew', 'espresso'],
      answer: `🔥 **肯尼亚咖啡烘焙与冲煮指南**

**风味轮**：磷酸感明亮果酸（西柚、青柠）；核心水果香气黑醋栗、黑莓、百香果（SL28主导）、水蜜桃、李子、杏（SL34主导）；次级紫罗兰花香、红酒发酵感、焦糖、红糖；酒体中等到中高，余韵回甘持久。

**烘焙建议**：
- ☀️ **浅度烘焙（首选）**：城市浅烘/肉桂烘，完整释放果酸与莓果香气，手冲最佳；
- 🌤️ **中浅烘焙**：弱化刺激酸度，焦糖甜感上升，适合美式、冷萃；
- ⛅ **中度烘焙**：果酸收敛，巧克力、坚果浮现，用作意式拼配基底；
- ❌ **不建议深烘**：深烘会毁掉肯尼亚最核心的明亮水果酸，只剩焦苦味。

**推荐冲煮方式**：
1. 🥇 **手冲（V60/锥形滤杯）**：最能展现果汁层次感；
2. 🥈 **虹吸壶**：放大红酒发酵复杂度；
3. 🥉 **冷萃**：酸度柔和化，莓果甜感突出；
4. 辅助：意式浓缩（中浅烘做SOE），酸甜浓缩炸裂。`,
      answerEn: `🔥 **Kenya Coffee Roasting & Brewing Guide**

**Flavor wheel**: phosphoric bright fruit acidity (grapefruit, lime); core fruit of blackcurrant, blackberry, passion fruit (SL28-led), peach, plum, apricot (SL34-led); secondary violet florals, red-wine fermentation, caramel, brown sugar; medium to medium-full body with a long sweet finish.

**Roasting advice**:
- ☀️ **Light roast (best)**: City or cinnamon roast — fully releases the fruit acidity and berry aromas; ideal for pour-over.
- 🌤️ **Light-medium**: tones down sharp acidity, more caramel sweetness — great for Americanos and cold brew.
- ⛅ **Medium**: acidity recedes, chocolate and nut notes appear — good espresso blend base.
- ❌ **Avoid dark roast**: it destroys Kenya's signature bright fruit acidity, leaving only bitterness.

**Brewing recommendations**:
1. 🥇 **Pour-over (V60/cone dripper)** — best for showing the juicy layers.
2. 🥈 **Siphon** — amplifies the red-wine fermentation complexity.
3. 🥉 **Cold brew** — softer acidity, pronounced berry sweetness.
4. Also: espresso (light-medium SOE) for an intense sweet-sour shot.`
    },

    // ===== 文档新增：NCE 拍卖 =====
    {
      keywords: ['拍卖', '交易所', 'nce', '内罗毕', '竞拍', '交易', 'auction', 'exchange', 'price', 'trading'],
      answer: `🏛️ **内罗毕咖啡交易所（NCE）拍卖商业模式**

**强制规则**：所有出口级生豆法律规定必须通过NCE每周二公开拍卖，禁止私下大批量直接出口，这是殖民时期延续的管控制度。

**拍卖流程**：合作社/庄园完成加工 → 批次编号、标注产区+等级+处理厂 → 统一杯测打分公示 → 持证全球贸易商现场竞价 → 价高者获得批次，价格全程透明。

**体系优势**：
- ✅ **品质倒逼**：差批次拍卖价格极低，倒逼合作社严控采摘、处理工艺；
- ✅ **完整溯源**：每一批豆子可反向追溯到具体合作社、水洗厂，精品溯源体系完善；

**局限性**：流程繁琐、中间环节成本偏高，小农最终到手利润占出口总价比例偏低，也是肯尼亚咖啡产业长期存在的痛点。`,
      answerEn: `🏛️ **Nairobi Coffee Exchange (NCE) Auction Model**

**Mandatory rule**: By law, all export-grade green beans must be sold through the NCE public auction every Tuesday — private bulk exports are banned. This is a regulatory system inherited from the colonial era.

**Auction flow**: cooperatives/estates finish processing → lots are numbered with region, grade and factory → public cupping scores are published → licensed global traders bid live → highest bidder wins, with fully transparent pricing.

**Strengths**:
- ✅ **Quality pressure**: bad lots fetch very low prices, forcing cooperatives to strictly control picking and processing.
- ✅ **Full traceability**: every lot can be traced back to a specific cooperative and washing station — a mature specialty traceability system.

**Limitations**: cumbersome process and high middle-man costs mean smallholders' final share of the export price is low — a long-standing pain point in Kenya's coffee industry.`
    },

    // ===== 文档新增：种植经营模式 =====
    {
      keywords: ['合作社', '庄园', '小农', '经营模式', '种植模式', 'cooperative', 'estate', 'smallholder', 'farm model'],
      answer: `🏘️ **肯尼亚两种种植经营模式**

**1. 小农合作社模式（占总产量70%）**
全国约80万户小农户，单户咖啡种植土地＜5英亩，自发组建590个农业合作社。农户采摘鲜果24小时内统一送到合作社中央水洗处理厂集中加工、分级、杯测，利润按产量分红，是肯尼亚最核心的生产架构。

**2. 大型私人庄园模式（占总产量30%）**
共计2694个规模化庄园，独立拥有处理设备，管控全流程，批次稳定性更强，多直接以庄园名在交易所拍卖，溯源清晰度最高。

**采收规则**：主采收季每年10月—次年2月；仅人工全红果采摘，剔除青果、过熟腐烂果，严格要求采摘后24小时内送入处理厂，避免果肉发酵过度产生杂味。`,
      answerEn: `🏘️ **Kenya's Two Cultivation & Business Models**

**1. Smallholder cooperative model (70% of output)**
About 800,000 smallholder families, each with under 5 acres of coffee, have formed 590 agricultural cooperatives. Farmers deliver fresh cherries to the cooperative's central washing station within 24 hours for centralized processing, grading and cupping; profits are shared by delivered weight. This is Kenya's core production structure.

**2. Large private estate model (30% of output)**
There are 2,694 large-scale estates with their own processing equipment and full process control, giving more consistent lots. They often auction directly under the estate name with the clearest traceability.

**Harvest rules**: Main harvest runs from October to February; only ripe red cherries are hand-picked — green, overripe and rotten cherries are rejected — and cherries must reach the factory within 24 hours to avoid off-flavors from over-fermentation.`
    },

    // ===== 文档新增：品种详解（替代原品种条目） =====
    {
      keywords: ['品种', 'sl28', 'sl34', 'ruiru', 'batian', 'k7', '什么品种', '品种选择', '选种', '品种对比', 'variety', 'varieties', 'cultivar'],
      answer: `🌿 **肯尼亚全部咖啡品种详解（风味+优缺点）**

**1. SL28（肯尼亚灵魂品种，精品主力）**
- 选育来源：坦桑尼亚耐旱老种选育，苏丹/埃塞俄比亚血统；
- 风味：炸裂级磷酸果酸，黑醋栗、黑莓、百香果、红酒发酵感，花香浓郁，中高酒体，层次感极强；
- 短板：产量偏低，极易感染咖啡浆果病、不耐涝，种植成本高；
- 主产区：涅里、基安布等高海拔少雨区域。

**2. SL34（平衡百搭品种）**
- 选育来源：法国传教士波旁变种选育；
- 风味：酸度比SL28柔和圆润，核果（李子、桃子）、焦糖、轻微巧克力，酒体更厚重，甜感更直接；
- 优势：耐多雨潮湿环境、抗病性优于SL28，产量更高；
- 主产区：穆兰加、恩布等多雨产区，市面绝大多数AB等级拼配豆为SL28+SL34混合。

**3. Ruiru 11（抗病改良商业化品种）**
官方育种对抗病害的杂交品种，大幅降低种植损耗；风味干净顺滑，但莓果尖锐果酸大幅弱化，柑橘、坚果调性为主，多用于商业大宗豆，精品市场认可度低。

**4. Batian（新一代抗病品种）**
Ruiru11升级版，杯测表现优于前者，保留部分水果酸甜，目前正在逐步替代老旧病弱果树，未来会成为量产主力。

**5. K7（小众品种）**
锡卡产区小范围种植，酸度偏低，草本、焦糖风味，仅作为拼配辅助豆使用。

💡 **补充**：市面上标注"肯尼亚AA"几乎都是SL28与SL34按比例混合批次。`,
      answerEn: `🌿 **Kenya's Coffee Varieties (flavor + pros/cons)**

**1. SL28 (Kenya's soul variety, specialty mainstay)**
- Origin: bred from a drought-tolerant old Tanzanian stock; Sudanese/Ethiopian heritage.
- Flavor: explosive phosphoric fruit acidity — blackcurrant, blackberry, passion fruit and red-wine fermentation notes, rich florals, medium-full body, intense complexity.
- Weaknesses: low yield, highly susceptible to Coffee Berry Disease, dislikes waterlogging, high growing cost.
- Main regions: Nyeri, Kirinyaga and other high, drier areas.

**2. SL34 (balanced, all-round variety)**
- Origin: selected from French missionaries' Bourbon mutation.
- Flavor: softer, rounder acidity than SL28 — stone fruit (plum, peach), caramel, light chocolate; heavier body and more direct sweetness.
- Strengths: tolerates rainy humid conditions, more disease resistant than SL28, higher yield.
- Main regions: wetter areas like Murang'a and Embu; most commercial AB blends are SL28+SL34 mixes.

**3. Ruiru 11 (disease-resistant commercial variety)**
An official hybrid bred against disease, greatly reducing crop losses. Clean and smooth, but the sharp berry acidity is much muted — citrus and nut notes dominate; used mostly for commercial beans, low specialty-market acceptance.

**4. Batian (next-generation resistant variety)**
An upgrade of Ruiru 11 with better cupping scores and some fruity sweet-sour notes. It is gradually replacing old, weak, disease-prone trees and will become a future volume mainstay.

**5. K7 (niche variety)**
Grown on a small scale in Thika; low acidity with herbal and caramel notes, used only as a blending filler.

💡 **Note**: Most beans labeled "Kenya AA" on the market are actually proportional SL28 + SL34 blends.`
    },

    // ===== 文档新增：种植管理建议 =====
    {
      keywords: ['选址', '定植', '株距', '行距', '育苗', '扦插', '苗圃', '排水', '梯田', '遮荫树', '种植建议', '怎么种', '如何种植', '栽种', '混种', 'planting', 'seedling', 'spacing', 'drainage', 'terrace', 'shade tree'],
      answer: `🌱 **肯尼亚咖啡种植管理建议**

**1. 海拔选址核心原则**
- 精品级：锁定1700–2100m坡地，昼夜温差大，风味物质积累充足；
- 量产商业级：1400–1700m平缓地块，兼顾产量与抗病性；
- 严禁选址：海拔＜1300m低洼谷地（风味寡淡、积水烂根）、风口陡坡、排水不畅黏土地。

**2. 土壤筛选与改良**
- 优先原生火山红壤土，疏松透气、排水强；板结则混入腐熟牛粪、木屑、枯枝落叶；
- 土壤pH维持5.0–6.0微酸性最佳，肯尼亚本地火山土基本达标；
- 全园提前开挖排水沟，坡地做等高梯田种植，雨季防止根系积水（SL28极怕涝）。

**3. 遮荫树配套种植（重中之重）**
- 推荐：香蕉树、银合欢、本土合欢树，每8–10株咖啡树配1棵遮荫树；
- 遮荫度控制在30%–40%，避免赤道强光灼伤、减缓旱季蒸发，落叶还能还田；
- 不要过度遮荫，遮光超过50%会导致结果量下降、果酸不足。

**4. 品种科学搭配**
- 精品高价路线：SL28为主（70%）+ SL34为辅（30%），高海拔干爽坡地种SL28，多雨地块种SL34；
- 稳产低风险路线：Batian抗病杂交品种为主，少量Ruiru11，管理粗放也能稳定产出；
- 不要单一种植老品种，SL28成片极易爆发传染病害，混种可降低全园绝收风险。

**5. 育苗与定植**
- SL28/SL34种子播种育苗，苗圃遮光培育6–8个月，苗高40cm以上移栽；Batian/Ruiru11扦插育苗，成活率更高；
- 标准行距2m×株距1.5m，每亩约220株，保证通风透光。

**6. 年度修剪方案（旱季操作）**
- 控制树高1.8–2m，方便人工采摘；
- 剪掉内膛交叉枝、下垂弱枝、病虫枯枝、徒长旺枝；
- 每株保留4–6根健壮结果主干，养分集中供给挂果枝条。

**7. 水肥管理**
- 雨季生长期（4-6月、10-12月）追肥2次，旱季只施一次底肥；
- 优先有机肥（腐熟牛粪、羊粪、秸秆堆肥），规模化庄园可少量补充磷钾复合肥；
- 严控氮肥过量：氮多会枝叶徒长、果实酸度下降、抗病变弱；
- 旱季引水滴灌只浇根部，不要喷淋叶片（叶面潮湿易诱发锈病）。

**8. 病虫害绿色防控（核心痛点）**
最大减产元凶：咖啡浆果病CBD、咖啡锈病。
- 修剪提升通风透光，降低湿度；及时摘除树上病果、落地烂果深埋；
- 老品种逐年淘汰替换为Batian抗病品种，构建"老精品树+抗病稳产树"复合园；
- 精品出口严格限制化学农药，优先生物防治，否则拍卖直接降级。

**9. 采收与加工联动**
- 只采全红果，青果、过熟发黑果、虫蛀果单独分拣；
- 鲜果24小时内送入水洗处理厂，避免高温堆捂发酵产生土味、腐味；
- 不同地块、不同品种分开加工，SL28单独处理更容易打出AA高等级批次。

**10. 规模化顶层建议**
- 合作社抱团统一加工、送检、拍卖，降低加工成本、提高成交价；
- 分批栽种规避气候风险，穿插少量果树对冲咖啡减产与价格波动；
- 每片地块登记品种、海拔、采收日期、处理厂编号，做好批次溯源拉高溢价。

**极简总结**：海拔1700m以上+火山土+30%遮荫是好咖啡基础；想卖高价种SL28/SL34，求稳产抗病选Batian；多剪枝、多通风、少氮肥、严控积水；全红果采摘+24小时进厂双重水洗锁定AA/PB高等级；小农抱团合作社统一拍卖提升收益。`,
      answerEn: `🌱 **Kenya Coffee Farming Recommendations**

**1. Altitude site selection**
- Specialty: 1,700–2,100 m slopes — large diurnal swings build up flavor.
- Commercial: 1,400–1,700 m gentler land, balancing yield and disease resistance.
- Avoid: valleys below 1,300 m (flat flavor, root rot), windy steep slopes, poorly drained clay.

**2. Soil selection & amendment**
- Prefer native volcanic red soil (loose, well-drained); if compacted, mix in well-rotted manure, sawdust and leaf litter.
- Keep soil pH at 5.0–6.0 (slightly acidic); local volcanic soil is usually fine.
- Dig drainage ditches early; build contour terraces on slopes to prevent root waterlogging (SL28 hates wet feet).

**3. Shade-tree planting (critical)**
- Recommended: banana, leucaena, local acacia — one shade tree per 8–10 coffee trees.
- Keep shade at 30–40% to protect against equatorial sun and reduce dry-season evaporation; falling leaves return nutrients.
- Don't over-shade: above 50% shade cuts yield and fruit acidity.

**4. Variety mix**
- Specialty route: 70% SL28 + 30% SL34 — SL28 on high dry slopes, SL34 on wetter plots.
- Stable, low-risk route: disease-resistant Batian with a little Ruiru 11 — robust even under low management.
- Never monocrop old varieties; dense SL28 blocks easily erupt with disease — mixed planting cuts whole-farm risk.

**5. Nursery & planting**
- SL28/SL34: seed-grown in shaded nurseries for 6–8 months, transplant at 40 cm+; Batian/Ruiru 11: cuttings for higher survival.
- Standard spacing 2 m × 1.5 m (~220 trees/acre) for airflow and light.

**6. Annual pruning (dry season)**
- Cap tree height at 1.8–2 m for easy hand picking.
- Remove inward crossing branches, drooping weak wood, diseased/dead wood and vigorous water shoots.
- Keep 4–6 strong fruiting stems per tree to concentrate nutrients.

**7. Water & fertilizer**
- Top-dress twice in the rainy growing seasons (Apr–Jun, Oct–Dec); one base dressing in the dry season.
- Prefer organic manure (cattle/goat manure, straw compost); large estates may add small amounts of PK compound fertilizer.
- Strictly limit nitrogen — excess N causes lush growth, lower acidity and weaker disease resistance.
- In dry spells, drip-irrigate only the root zone; never spray leaves (wet foliage triggers rust).

**8. Green pest & disease control (key pain point)**
Biggest yield killers: Coffee Berry Disease (CBD) and leaf rust.
- Prune for ventilation and lower humidity; pick and bury diseased/fallen cherries promptly.
- Gradually replace old varieties with resistant Batian — build a "old specialty + resistant" composite farm.
- Specialty exports strictly limit chemical pesticides; favor biocontrol, or auction grades drop.

**9. Harvest & processing linkage**
- Pick only fully red cherries; sort out green, overripe and insect-damaged ones.
- Deliver to the washing station within 24 hours to avoid earthy/fermented off-flavors.
- Process different plots/varieties separately; separate SL28 lots more easily earn AA grades.

**10. Scale-up & risk advice**
- Cooperatives process, test and auction together — lower cost, higher prices.
- Plant in batches over years to hedge climate risk; interplant some fruit trees as income buffer.
- Log variety, altitude, harvest date and factory code per block for traceability and premium pricing.

**In one line**: 1,700 m+ altitude + volcanic soil + 30% shade = good coffee; SL28/SL34 for premium prices, Batian for stable yields; prune more, ventilate more, use less nitrogen, control waterlogging; pick all-red cherries, double-wash within 24 hours for AA/PB grades; smallholders unite in cooperatives to maximize income.`
    },

    // ===== 原有：施肥相关 =====
    {
      keywords: ['施肥', '肥料', '用什么肥', '施肥时间', '施肥量', '氮肥', '磷肥', '钾肥', '复合肥', '有机肥', '营养'],
      answer: `☕ **肯尼亚咖啡施肥指南**

**施肥原则**：肯尼亚咖啡种植以"少量多次"为原则，结合土壤检测结果精准施肥。

**主要肥料类型**：
- 🌱 **氮肥(N)**：促进枝叶生长，推荐硫酸铵(酸性土)或尿素。每年每公顷150-250kg纯氮。分2-3次施用。
- 🌿 **磷肥(P)**：促进根系和花果发育，用过磷酸钙。每公顷40-80kg P₂O₅。
- 🪵 **钾肥(K)**：提高抗病性和品质，用硫酸钾。每公顷100-200kg K₂O。
- 🐄 **有机肥**：腐熟牛粪或咖啡果皮堆肥，每公顷5-15吨。

**施肥时间**：
- 雨季开始时（3-4月长雨季，10-11月短雨季）
- 开花前和果实膨大期各追肥一次
- 避免旱季施肥（根系无法吸收）`,
      answerEn: `☕ **Kenya Coffee Fertilization Guide**

**Principle**: "Little and often", combined with soil test results for precision application.

**Main fertilizers**:
- 🌱 **Nitrogen (N)**: promotes vegetative growth — ammonium sulfate (acidic soils) or urea; 150–250 kg pure N per hectare per year, split into 2–3 applications.
- 🌿 **Phosphorus (P)**: roots, flowers and fruit — superphosphate; 40–80 kg P₂O₅/ha.
- 🪵 **Potassium (K)**: disease resistance and quality — potassium sulfate; 100–200 kg K₂O/ha.
- 🐄 **Organic**: well-rotted cattle manure or coffee pulp compost; 5–15 t/ha.

**Timing**:
- At the start of the rains (Mar–Apr long rains, Oct–Nov short rains).
- One top-dressing before flowering and one at fruit expansion.
- Avoid fertilizing in the dry season (roots cannot take it up).`
    },
    // ===== 原有：修剪相关 =====
    {
      keywords: ['修剪', '剪枝', '整形', '修枝', '树形', '主干', '什么时候修剪', '如何修剪'],
      answer: `✂️ **肯尼亚咖啡修剪技术指南**

**修剪季节**：
- 🌿 **主修剪季：1月-3月**（主要收获后）
- 🌿 **次修剪季：6月-8月**（次要修剪）

**修剪方法**：

1️⃣ **单干制 (Single Stem)**：
- 保留一个主干，每年培养新结果枝
- 适合密植和高产管理
- 需要较多人工管理

2️⃣ **多干制 (Multiple Stem)**：
- 保留2-3个主干，轮换更新
- 肯尼亚最常用的方式
- 每5-7年轮换主干

**修剪步骤**：
1. 先去除病枝、枯枝、虫害枝
2. 剪除交叉枝、过密枝
3. 控制树高在2-2.5米便于采摘
4. 保持树冠通风透光
5. 修剪后涂抹保护剂防感染

**修剪工具**：修枝剪、手锯，工具需消毒。`,
      answerEn: `✂️ **Kenya Coffee Pruning Guide**

**Pruning seasons**:
- 🌿 **Main pruning: Jan–Mar** (after the main harvest).
- 🌿 **Secondary pruning: Jun–Aug** (light pruning).

**Methods**:

1️⃣ **Single stem**:
- Keep one main stem and grow new fruiting wood each year.
- Suits dense planting and high-yield management.
- Requires more labor.

2️⃣ **Multiple stem**:
- Keep 2–3 stems and rotate/renew them.
- The most common system in Kenya.
- Renew stems every 5–7 years.

**Steps**:
1. Remove diseased, dead and pest-damaged branches first.
2. Cut crossing and overcrowded branches.
3. Keep tree height at 2–2.5 m for easy picking.
4. Maintain an open, airy canopy.
5. Apply a protectant after cuts to prevent infection.

**Tools**: secateurs and hand saws — sterilize them between trees.`
    },
    // ===== 原有：病虫害相关 =====
    {
      keywords: ['病虫害', '病害', '虫害', '叶锈病', '果小蠹', '炭疽病', '褐斑病', '根腐病', '线虫', '防治', '农药', '杀菌', '杀虫'],
      answer: `🐛 **肯尼亚咖啡主要病虫害及防治**

**🦠 主要病害**：

| 病害 | 症状 | 防治方法 |
|------|------|----------|
| **咖啡叶锈病** | 叶背橙黄色粉状孢子 | 铜基杀菌剂，抗病品种(Ruiru 11) |
| **咖啡浆果病(CBD)** | 果实褐变腐烂 | 铜基杀菌剂，及时摘除病果 |
| **褐斑病** | 叶片圆形褐斑 | 苯并咪唑类杀菌剂 |
| **根腐病** | 根部腐烂，萎蔫 | 改善排水，甲霜灵灌根 |

**🐜 主要虫害**：

| 虫害 | 危害 | 防治方法 |
|------|------|----------|
| **咖啡果小蠹** | 钻入果实危害 | 诱捕器+Bb真菌生物防治 |
| **咖啡潜叶蛾** | 幼虫潜食叶片 | 阿维菌素，黄色粘虫板 |
| **根结线虫** | 根系结瘤，生长不良 | 抗性砧木，土壤消毒 |

**🔑 综合防治(IPM)原则**：
1. 优先使用抗性品种（如Batian、Ruiru 11）
2. 加强田间管理，改善通风透光
3. 生物防治优先，化学防治为辅
4. 定期巡查，早发现早处理`,
      answerEn: `🐛 **Major Kenyan Coffee Pests & Diseases**

**🦠 Main diseases**:

| Disease | Symptoms | Control |
|------|------|----------|
| **Leaf Rust** | Orange-yellow spores under leaves | Copper fungicides; resistant varieties (Ruiru 11) |
| **Coffee Berry Disease (CBD)** | Brown rotting berries | Copper fungicides; remove diseased berries promptly |
| **Brown Blotch** | Round brown leaf spots | Benzimidazole fungicides |
| **Root Rot** | Rotted roots, wilting | Improve drainage; metalaxyl drench |

**🐜 Main pests**:

| Pest | Damage | Control |
|------|------|----------|
| **Coffee Berry Borer** | Borers into berries | Traps + Beauveria bassiana biocontrol |
| **Coffee Leaf Miner** | Larvae mine leaves | Abamectin; yellow sticky traps |
| **Root-Knot Nematode** | Root galls, poor growth | Resistant rootstocks; soil fumigation |

**🔑 IPM principles**:
1. Prioritize resistant varieties (Batian, Ruiru 11).
2. Improve field hygiene and canopy ventilation.
3. Biocontrol first, chemicals as a supplement.
4. Scout regularly — find and treat early.`
    },
    // ===== 原有：土壤pH =====
    {
      keywords: ['ph', 'pH', '酸碱', '酸度', '土壤酸', '石灰', '酸性', '碱性'],
      answer: `🌱 **肯尼亚咖啡适宜土壤pH**

**最佳pH范围：5.3 - 6.0**（微酸性）

肯尼亚咖啡种植区的火山土(Nitisols)通常呈微酸性，非常适合咖啡种植。

**pH调节方法**：

📉 **pH过低(<5.0) — 太酸**：
- 施用农用石灰(CaCO₃)，0.5-2吨/公顷
- 分2次施用，雨季前4-6周施入
- 也可使用白云石粉(Dolomite)补充镁

📈 **pH过高(>6.5) — 偏碱**：
- 施用硫磺粉(200-400kg/公顷)
- 使用酸性肥料如硫酸铵
- 增施有机质

⚠️ 注意：pH调节需循序渐进，每次调整不超过0.5个单位。`,
      answerEn: `🌱 **Ideal Soil pH for Kenya Coffee**

**Best range: 5.3–6.0** (slightly acidic).

Kenya's volcanic soils (Nitisols) are naturally slightly acidic — perfect for coffee.

**Adjusting pH**:

📉 **Too low (<5.0) — too acidic**:
- Apply agricultural lime (CaCO₃), 0.5–2 t/ha.
- Split into 2 applications, 4–6 weeks before the rains.
- Dolomite can also supply magnesium.

📈 **Too high (>6.5) — too alkaline**:
- Apply sulfur powder (200–400 kg/ha).
- Use acidifying fertilizers like ammonium sulfate.
- Add organic matter.

⚠️ Adjust gradually — change pH by no more than 0.5 units per application.`
    },
    // ===== 原有：灌溉 =====
    {
      keywords: ['灌溉', '浇水', '水分', '干旱', '滴灌', '灌水', '水管理', '缺水'],
      answer: `💧 **肯尼亚咖啡灌溉管理**

**咖啡需水规律**：
- 开花期：需要充足水分促进开花
- 果实膨大期：需水量最大
- 成熟期：适度控水有利于品质

**灌溉方式**：
- 🎯 **滴灌**（推荐）：节水高效，精准供水
- 🌧️ **微喷灌**：可同时调节小气候湿度
- ⚠️ 避免大水漫灌（浪费水资源，易传播病害）

**灌溉量参考**：
- 旱季：每周30-50mm（相当于每株20-40升）
- 雨季：根据降雨量调整，通常不需灌溉
- 土壤湿度最好保持在田间持水量的60-70%

**节水技巧**：
1. 覆盖地膜或有机覆盖物减少蒸发
2. 种植遮阴树降低蒸腾
3. 安装土壤湿度传感器精准灌溉
4. 收集雨水用于补充灌溉`,
      answerEn: `💧 **Kenya Coffee Irrigation Management**

**Water needs by stage**:
- Flowering: adequate water to promote blooming.
- Fruit expansion: peak water demand.
- Maturation: mild water stress improves quality.

**Irrigation methods**:
- 🎯 **Drip** (recommended): water-efficient, precise.
- 🌧️ **Micro-sprinkler**: can also adjust microclimate humidity.
- ⚠️ Avoid flood irrigation (wastes water, spreads disease).

**Rates**:
- Dry season: 30–50 mm/week (≈20–40 L per tree).
- Rainy season: usually no irrigation needed.
- Keep soil moisture around 60–70% of field capacity.

**Water-saving tips**:
1. Mulch to reduce evaporation.
2. Plant shade trees to lower transpiration.
3. Use soil moisture sensors for precision irrigation.
4. Harvest rainwater for supplementary irrigation.`
    },
    // ===== 原有：海拔 =====
    {
      keywords: ['海拔', '高度', '地形', '山坡', '种植高度'],
      answer: `⛰️ **肯尼亚咖啡种植海拔**

**最佳海拔范围：1400 - 2000米**

肯尼亚高品质咖啡几乎都种植在高海拔地区，海拔是影响咖啡品质的关键因素。

| 海拔 | 特点 |
|------|------|
| < 1000m | 品质一般，病害风险高 |
| 1000-1400m | 中等品质，适合抗病品种 |
| 1400-1700m | 优质咖啡产区 |
| 1700-2000m | 精品咖啡，风味最复杂 |
| > 2000m | 生长缓慢，霜冻风险 |

**高海拔对咖啡的影响**：
✅ 优点：昼夜温差大，果实成熟慢，风味物质积累多，酸度明亮
❌ 缺点：生长周期长，产量较低，霜冻风险

**肯尼亚主要产区海拔**：
- Nyeri：1600-1800m
- Kirinyaga：1500-1800m
- Murang'a：1350-1650m
- Kiambu：1500-1800m`,
      answerEn: `⛰️ **Kenya Coffee Altitude**

**Best range: 1,400–2,000 m**

Almost all high-quality Kenyan coffee is grown at altitude — the single biggest factor in cup quality.

| Altitude | Characteristics |
|------|------|
| < 1,000 m | Ordinary quality, high disease risk |
| 1,000–1,400 m | Medium quality, suited to resistant varieties |
| 1,400–1,700 m | Quality growing zone |
| 1,700–2,000 m | Specialty coffee, most complex flavor |
| > 2,000 m | Slow growth, frost risk |

**Effects of high altitude**:
✅ Wide day-night swings, slow ripening, more flavor accumulation, bright acidity.
❌ Longer cycle, lower yield, frost risk.

**Main regions by altitude**:
- Nyeri: 1,600–1,800 m
- Kirinyaga: 1,500–1,800 m
- Murang'a: 1,350–1,650 m
- Kiambu: 1,500–1,800 m`
    },
    // ===== 原有：收获 =====
    {
      keywords: ['收获', '采摘', '采收', '成熟', '加工', '处理', '水洗', '日晒', '什么时候摘'],
      answer: `🍒 **肯尼亚咖啡收获与加工**

**收获季节**：
- 🌿 **主收获季：10月-12月**（长雨季后的果实）
- 🌿 **次收获季（Fly Crop）：5月-7月**（短雨季后的果实）

**采摘标准**：
- 只采摘完全成熟的红色樱桃（Red Cherry）
- 手工采摘，避免采摘青果或过熟果
- 成熟度判断：果实呈深红色，手感饱满

**加工方式**：

1️⃣ **水洗处理（Kenya Washed）** — 肯尼亚主流方式
- 浮选 → 脱皮 → 发酵36-48小时 → 水洗 → 浸泡 → 干燥
- 特点：干净明亮，酸度突出，风味清晰
- 这是肯尼亚咖啡闻名世界的处理法

2️⃣ **日晒处理（Natural）**
- 整果晾晒2-4周
- 特点：果味浓郁，口感厚重

**品质管控**：
- 采摘后8小时内进行加工
- 发酵温度控制在20-25°C
- 含水量降至10-12%后入库`,
      answerEn: `🍒 **Kenya Coffee Harvesting & Processing**

**Harvest seasons**:
- 🌿 **Main crop: Oct–Dec** (after the long rains).
- 🌿 **Fly crop: May–Jul** (after the short rains).

**Picking standard**:
- Pick only fully ripe red cherries.
- Hand-pick; avoid green or overripe cherries.
- Ripeness check: deep red, plump feel.

**Processing**:

1️⃣ **Washed (Kenya Washed)** — Kenya's mainstream method
- Float sorting → depulping → fermentation 36–48h → washing → soaking → drying.
- Clean, bright, pronounced acidity, clear flavor — the method that made Kenya famous.

2️⃣ **Natural (sun-dried)**
- Whole cherries dried for 2–4 weeks.
- Fruity, heavy body.

**Quality control**:
- Process within 8 hours of picking.
- Keep fermentation at 20–25°C.
- Dry to 10–12% moisture before storage.`
    },
    // ===== 原有：遮阴 =====
    {
      keywords: ['遮阴', '荫蔽', '遮阳', '遮光', '遮阴树', '间作'],
      answer: `🌳 **肯尼亚咖啡遮阴管理**

**遮阴对咖啡的益处**：
- 🌡️ 降低温度2-4°C，减少高温胁迫
- 💧 减少土壤水分蒸发
- 🍂 落叶提供有机质
- 🌿 减少杂草生长
- 🐦 增加生物多样性

**推荐遮阴树种**：
- Grevillea robusta（银桦）— 肯尼亚最常用
- Albizia spp.（合欢树）
- Macadamia（澳洲坚果）— 兼有经济价值
- 香蕉树 — 临时遮阴+经济收入

**遮阴度管理**：
- 低海拔(<1400m)：40-60%遮阴
- 中海拔(1400-1700m)：20-40%遮阴
- 高海拔(>1700m)：0-20%遮阴或全日照

⚠️ 过度遮阴会降低产量，需根据海拔和品种调整。`,
      answerEn: `🌳 **Shade Management for Kenya Coffee**

**Benefits of shade**:
- 🌡️ Lowers temperature 2–4°C, reducing heat stress.
- 💧 Reduces soil moisture evaporation.
- 🍂 Leaf litter adds organic matter.
- 🌿 Suppresses weeds.
- 🐦 Increases biodiversity.

**Recommended shade trees**:
- *Grevillea robusta* (silky oak) — most common in Kenya.
- *Albizia* spp. (acacia).
- Macadamia — also provides income.
- Banana trees — temporary shade + income.

**Shade levels**:
- Low altitude (<1,400 m): 40–60% shade.
- Mid altitude (1,400–1,700 m): 20–40% shade.
- High altitude (>1,700 m): 0–20% shade or full sun.

⚠️ Over-shading lowers yield — adjust by altitude and variety.`
    },
    // ===== 原有：气候 =====
    {
      keywords: ['气候', '温度', '降雨', '湿度', '日照', '天气', '季节', '雨季', '旱季'],
      answer: `🌤️ **肯尼亚咖啡种植气候条件**

**肯尼亚气候特点**：
- 🌧️ **长雨季(Long Rains)**：3月-5月
- ☀️ **凉旱季**：6月-9月
- 🌧️ **短雨季(Short Rains)**：10月-12月
- ☀️ **热旱季**：1月-2月

**咖啡生长理想条件**：

| 指标 | 理想范围 | 肯尼亚实际情况 |
|------|----------|----------------|
| 温度 | 15-24°C | 大部分产区在此范围 |
| 年降雨量 | 1000-2000mm | 1000-1800mm（双雨季）|
| 海拔 | 1400-2000m | 主要产区在此范围 |
| 土壤 | 火山土，微酸性 | 红火山土(Nitisols) |
| 相对湿度 | 60-80% | 70-85% |

**气候变化应对**：
- 气温上升 → 向更高海拔迁移
- 降雨不规律 → 建设灌溉设施
- 极端天气 → 种植遮阴树防护`,
      answerEn: `🌤️ **Climate for Kenyan Coffee**

**Kenya's climate pattern**:
- 🌧️ **Long rains**: Mar–May.
- ☀️ **Cool dry**: Jun–Sep.
- 🌧️ **Short rains**: Oct–Dec.
- ☀️ **Hot dry**: Jan–Feb.

**Ideal growing conditions**:

| Factor | Ideal | Kenya actual |
|------|----------|----------------|
| Temperature | 15–24°C | most regions within range |
| Annual rainfall | 1,000–2,000 mm | 1,000–1,800 mm (bimodal) |
| Altitude | 1,400–2,000 m | main regions in range |
| Soil | volcanic, slightly acidic | red Nitisols |
| Relative humidity | 60–80% | 70–85% |

**Climate adaptation**:
- Rising temperatures → move to higher altitude.
- Erratic rainfall → build irrigation.
- Extreme weather → plant shade trees.`
    },

    // ===== 新增：症状诊断 - 叶片发黄/落叶/枯梢 =====
    {
      keywords: ['黄叶', '叶子黄', '叶片发黄', '落叶', '掉叶', '叶尖焦', '叶边焦', '枯梢', '生长缓慢', '长势差', '叶片斑点', 'yellow leaf', 'yellow leaves', 'leaves yellow', 'leaf yellowing', 'leaf drop', 'dropping leaves', 'chlorosis', 'wilting'],
      answer: `🩺 **咖啡树叶片发黄/落叶/枯梢诊断**

**1. 老叶均匀黄化、叶脉仍绿**
- 典型原因：缺氮或缺镁。
- 对策：追施腐熟有机肥+少量尿素或硫酸镁；避免一次性大量灌水导致养分淋失。

**2. 新叶黄白、叶脉失绿**
- 典型原因：缺铁/锰（高pH或排水不良时更易发生）。
- 对策：叶面喷施0.2%硫酸亚铁或螯合铁，同时改良排水。

**3. 叶尖、叶缘焦枯**
- 典型原因：肥害（氮肥或钾肥过量）、盐渍化，或旱季强烈日晒灼伤。
- 对策：检查施肥量，增加灌溉淋盐；低海拔地块补种遮荫树。

**4. 叶片出现锈色斑点并大量落叶**
- 典型原因：咖啡叶锈病或褐斑病。
- 对策：及时清除病叶深埋，喷施铜基杀菌剂；老品种逐步替换为Batian/Ruiru11。

**5. 全株萎蔫、枝条回枯**
- 典型原因：根腐病（积水）、线虫危害或天牛蛀干。
- 对策：挖开根部检查，改善排水；严重时换抗病砧木或移除病株。

**快速自检口诀**：老叶黄看氮镁，新叶黄看铁锰，叶尖焦看肥/旱/晒，斑点落叶看病害，萎蔫回枯查根系。`,
      answerEn: `🩺 **Diagnosing Yellow Leaves / Leaf Drop / Die-back**

**1. Older leaves evenly yellow, veins stay green**
- Likely cause: nitrogen or magnesium deficiency.
- Fix: apply well-rotted manure plus a little urea or magnesium sulfate; avoid heavy irrigation that leaches nutrients.

**2. New leaves yellow-white with green veins**
- Likely cause: iron/manganese deficiency (common when pH is high or drainage is poor).
- Fix: foliar spray 0.2% ferrous sulfate or chelated iron; improve drainage.

**3. Leaf tip / edge scorch**
- Likely cause: fertilizer burn (excess N/K), salinity, or strong dry-season sunscald.
- Fix: review fertilizer rates, leach salts with irrigation; plant shade trees in low-altitude plots.

**4. Rust-colored spots and heavy leaf fall**
- Likely cause: coffee leaf rust or brown blotch.
- Fix: remove and bury infected leaves, spray copper fungicide; gradually replace old varieties with Batian/Ruiru 11.

**5. Whole tree wilting, branches dying back**
- Likely cause: root rot (waterlogging), nematodes or stem borers.
- Fix: expose roots and inspect, improve drainage; in severe cases replant on resistant rootstock or remove the tree.

**Quick check**: old leaves → N/Mg; new leaves → Fe/Mn; tips scorched → fertilizer/drought/sun; spots → disease; wilting → roots.`
    },

    // ===== 新增：不开花/不结果/落花落果 =====
    {
      keywords: ['不开花', '不结果', '落果', '掉果', '落花', '花少', '挂果少', '产量低', 'no flower', 'no fruit', 'fruit drop', 'flower drop', 'low yield'],
      answer: `🌸 **咖啡树不开花、不结果、落花落果原因与对策**

**常见原因**：
1. **花芽分化期干旱胁迫不足**
   - 咖啡需要旱季适度缺水才能诱导花芽分化；如果全年灌水太勤，树体只长叶不开花。
   - 对策：主花期前2个月适度控水，模拟自然旱季。

2. **氮素过量**
   - 枝叶徒长、荫蔽严重，营养生长压倒生殖生长。
   - 对策：减少氮肥，增施磷钾肥，修剪改善透光。

3. **授粉不良**
   - 咖啡可自花授粉，但蜜蜂等传粉昆虫能显著提高坐果率；遮荫过密或农药滥用会驱赶昆虫。
   - 对策：保留适量遮荫，花期避免喷施杀虫剂。

4. **落花落果**
   - 花后2–4周幼果脱落多因：水分剧烈波动（旱后暴雨）、缺硼/钙、病害（CBD早期侵染）、虫害（果小蠹）。
   - 对策：稳定灌溉，花期补硼钙叶面肥，及时防治浆果病和果小蠹。

5. **树龄与修剪问题**
   - 老树（>25年）产量自然下降；多年未更新主干会导致结果部位外移。
   - 对策：逐步回缩更新主干，或补种抗病高产品种。

**综合管理**：控水促花、减氮增磷钾、保叶保果、防虫防病，是实现稳产高产的四大关键。`,
      answerEn: `🌸 **Why Coffee Trees Don't Flower, Don't Fruit, or Drop Flowers/Fruit**

**Common causes**:
1. **Insufficient dry-season stress**
   - Coffee needs a mild water deficit to induce flower bud initiation; over-irrigation keeps the tree vegetative.
   - Fix: reduce irrigation 2 months before the main flowering to mimic the natural dry season.

2. **Excess nitrogen**
   - Lush leafy growth suppresses flowering/fruiting.
   - Fix: cut N, increase P and K, prune for light penetration.

3. **Poor pollination**
   - Coffee is self-fertile, but bees improve fruit set. Dense shade or pesticide misuse drives pollinators away.
   - Fix: maintain moderate shade; avoid insecticides during bloom.

4. **Flower/fruit drop**
   - Young fruit often drop 2–4 weeks after flowering due to sharp water swings (drought followed by heavy rain), boron/calcium deficiency, CBD early infection, or berry borer.
   - Fix: steady irrigation, foliar B/Ca at bloom, control CBD and berry borer.

5. **Tree age and pruning**
   - Old trees (>25 years) naturally decline; unrenewed stems bear fruit only at the tips.
   - Fix: gradually rejuvenate stems or replant with resistant, high-yielding varieties.

**Key management**: controlled water stress, lower N/higher P+K, protect leaves and fruit, control pests/diseases.`
    },

    // ===== 新增：储存/保鲜/运输/保质期 =====
    {
      keywords: ['储存', '保存', '保鲜', '仓储', '生豆', '保质期', '运输', '水分', '发霉', '仓库', 'storage', 'preserve', 'green bean', 'shelf life', 'shipping', 'warehouse', 'mold'],
      answer: `📦 **肯尼亚咖啡豆储存、保鲜与运输要点**

**生豆储存黄金法则**：
- **含水率**：必须控制在10%–12%，超过12.5%极易霉变、产生陈味。
- **温度**：理想12–20°C，避免温度剧烈波动导致冷凝水。
- **湿度**：相对湿度≤60%，仓库需通风防潮，地面垫高10–15cm。
- **光照**：避光保存，紫外线会加速油脂氧化和风味劣化。

**包装建议**：
- 短期（3个月内）：干净编织袋+内衬食品级塑料袋，扎口防潮。
- 长期（6个月以上）：真空袋或充氮袋，优先用GrainPro等防护袋，隔绝氧气与异味。

**运输注意**：
- 避免与香料、化肥、化学品同舱，咖啡极易吸味。
- 海运需确认集装箱干燥、无异味；可在集装箱内放置干燥剂。
- 到达目的地后尽快入库，避免露天暴晒或雨淋。

**熟豆/咖啡粉保存**：
- 熟豆最佳赏味期：烘焙后2–30天；需单向排气阀铝箔袋密封，避光阴凉处。
- 咖啡粉氧化极快，建议研磨后2周内喝完，不要冷藏（会吸潮吸味）。`,
      answerEn: `📦 **Storing, Preserving & Shipping Kenya Coffee**

**Green bean storage rules**:
- **Moisture**: 10–12% is critical; above 12.5% mold and musty flavors develop quickly.
- **Temperature**: 12–20°C, stable; avoid swings that cause condensation.
- **Humidity**: ≤60% RH; warehouse must be ventilated and dry, pallets raised 10–15 cm.
- **Light**: keep away from light to slow oxidation and flavor loss.

**Packaging**:
- Short term (<3 months): clean woven sack with food-grade inner liner, sealed.
- Long term (>6 months): vacuum or nitrogen-flushed bags; GrainPro-style hermetic bags are best to block oxygen and odors.

**Shipping**:
- Never store with spices, fertilizers or chemicals — coffee absorbs odors easily.
- For sea freight, ensure the container is dry and odor-free; use desiccants.
- Move into warehouse quickly on arrival; avoid sun or rain exposure.

**Roasted beans/ground coffee**:
- Roasted beans peak 2–30 days post-roast; store in valve-sealed foil bags, cool, dark place.
- Ground coffee oxidizes fast — use within 2 weeks of grinding; do not refrigerate (absorbs moisture and odors).`
    },

    // ===== 新增：经济效益/成本/收益 =====
    {
      keywords: ['成本', '收益', '利润', '价格', '经济', '投入', '产出', '亩产', '公斤', '效益', 'cost', 'profit', 'price', 'income', 'yield', 'production cost'],
      answer: `💰 **肯尼亚咖啡种植成本与收益概算**

**小规模农户典型投入（每公顷/每年）**：
- 种苗/育苗：约 150–300 美元
- 肥料（有机肥+复合肥）：约 400–800 美元
- 病虫害防治：约 200–400 美元
- 人工采摘：约 600–1,200 美元（主因手工全红果采摘用工密集）
- 加工与干燥：约 200–500 美元（合作社统一处理可分摊）
- **合计可变成本：约 1,500–3,200 美元/公顷**

**产量与收益**：
- 精品小农：每公顷 5–10 袋（60kg/袋）生豆，即 300–600kg。
- 优质批次 NCE 拍卖价可达 3–8 美元/kg，最高端微批次甚至更高。
- 普通商业级价格约 1.5–2.5 美元/kg。

**收益提升关键**：
1. 全红果采摘 + 24小时内进厂 → 等级从 C/TT 提升到 AA/AB/PB。
2. 合作社统一加工拍卖 → 减少中间商压价，拍卖溢价直接返还农户。
3. 高海拔种 SL28/SL34 → 风味溢价显著高于抗病商业品种。
4. 取得有机/公平贸易认证 → 可获得 0.3–0.8 美元/kg 溢价。

**风险提醒**：叶锈病、浆果病、干旱和价格波动是收益最大不确定因素，建议混种抗病品种并购买农业保险。`,
      answerEn: `💰 **Kenya Coffee Growing Costs & Returns**

**Typical smallholder inputs (per hectare / year)**:
- Seedlings/nursery: ~USD 150–300
- Fertilizers (organic + compound): ~USD 400–800
- Pest/disease control: ~USD 200–400
- Hand-picking labor: ~USD 600–1,200 (labor-intensive because only red cherries are picked)
- Processing & drying: ~USD 200–500 (lower when shared via cooperatives)
- **Total variable cost: ~USD 1,500–3,200/ha**

**Yield & returns**:
- Specialty smallholder: 5–10 bags (60 kg each) green beans/ha = 300–600 kg.
- Premium lots at NCE auction: USD 3–8/kg; top micro-lots even higher.
- Commercial grade: ~USD 1.5–2.5/kg.

**How to raise profit**:
1. All-red picking + processing within 24 h → upgrades grade from C/TT to AA/AB/PB.
2. Cooperative processing/auction → cuts middle-man discount, returns auction premium to farmers.
3. High-altitude SL28/SL34 → significant flavor premium over resistant commercial varieties.
4. Organic / Fair Trade certification → adds USD 0.3–0.8/kg premium.

**Risks**: leaf rust, CBD, drought and price volatility are the biggest uncertainties; mix resistant varieties and consider crop insurance.`
    },

    // ===== 新增：杯测与风味 =====
    {
      keywords: ['杯测', '风味', '口感', '酸度', '香气', '黑醋栗', '红酒', '果汁感', 'cupping', 'flavor', 'taste', 'acidity', 'aroma', 'blackcurrant', 'winey', 'juicy'],
      answer: `☕ **肯尼亚咖啡杯测风味解析**

**风味轮廓**：
- **酸质**：肯尼亚咖啡最标志性的特征是明亮、尖锐、果汁感强烈的果酸，常带磷酸感，类似西柚、青柠、黑醋栗。
- **甜感**：成熟莓果、红糖、焦糖甜感，酸与甜分离度高。
- **香气**：紫罗兰、茉莉花、百香果、黑莓、红酒发酵香。
- **醇厚度**：中等到中高，干净度极高，尾韵悠长带回甘。

**杯测打分标准（SCA 100分制）**：
- 90+：卓越（Outstanding），微批次拍卖级。
- 85–89.99：优秀（Excellent），精品咖啡店主流单品豆。
- 80–84.99：非常好（Very Good），优质商业豆。
- <80：商业级或存在明显瑕疵。

**常见风味缺陷**：
- 土味/霉味：干燥或储存不当、发酵过度。
- 青草味：采摘青果过多或烘焙太浅。
- 焦苦：烘焙过深，肯尼亚豆切忌深烘。

**品鉴建议**：用 V60 或虹吸壶，水温 90–93°C，粉水比 1:15–1:16，中细研磨，能最大程度呈现黑醋栗与红酒酸。`,
      answerEn: `☕ **Kenya Coffee Cupping & Flavor Profile**

**Flavor outline**:
- **Acidity**: Kenya's signature is bright, sharp, juicy fruit acidity, often phosphoric — grapefruit, lime, blackcurrant.
- **Sweetness**: ripe berry, brown sugar, caramel — high separation between acidity and sweetness.
- **Aroma**: violet, jasmine, passion fruit, blackberry, red-wine fermentation.
- **Body**: medium to medium-full, very clean, long sweet aftertaste.

**SCA cupping scale (100 points)**:
- 90+: Outstanding — auction micro-lots.
- 85–89.99: Excellent — specialty café single origins.
- 80–84.99: Very Good — premium commercial.
- <80: Commercial or defective.

**Common flavor defects**:
- Earthy/musty: poor drying/storage or over-fermentation.
- Grassy: too many green cherries or under-roasting.
- Burnt bitter: over-roasted; Kenya beans should not be dark-roasted.

**Tasting tip**: Use V60 or siphon, 90–93°C water, 1:15–1:16 ratio, medium-fine grind to maximize blackcurrant and winey acidity.`
    },

    // ===== 新增：有机种植与认证 =====
    {
      keywords: ['有机', '认证', '公平贸易', '雨林联盟', '无公害', '化肥', '农药', 'organic', 'certification', 'fair trade', 'rainforest alliance', 'chemical free'],
      answer: `🌿 **肯尼亚咖啡有机种植与认证**

**有机种植核心要求**：
- 土壤需经过 2–3 年转换期，期间不得使用化学合成肥料和农药。
- 必须使用有机肥（腐熟粪肥、堆肥、绿肥、咖啡果皮还田）。
- 病虫害以预防为主：抗病品种、修剪通风、生物防治、物理诱捕。

**主要认证类型**：
| 认证 | 侧重点 | 溢价潜力 |
|------|--------|----------|
| **有机认证** | 禁用化学合成投入品 | 中 |
| **公平贸易 Fair Trade** | 保障小农最低收购价与社会基金 | 中 |
| **雨林联盟 RA** | 生态可持续与劳工权益 | 中高 |
| **UTZ**（已并入雨林联盟） | 可持续农业规范 | 中 |
| **Direct Trade** | 烘焙商直采，溢价最高但无统一标准 | 高 |

**有机认证注意事项**：
- 认证费用和年度审核对单个小农较高，通常由合作社统一申请、分摊成本。
- 有机地块必须与常规地块有明确隔离带，防止交叉污染。
- 有机产量通常比常规低 10%–20%，但溢价和长期土壤健康可弥补。

**入门建议**：尚未准备认证前，可先"减化学投入、增有机肥、做记录"，为未来认证打基础。`,
      answerEn: `🌿 **Organic Cultivation & Certifications for Kenya Coffee**

**Organic basics**:
- Soil needs a 2–3 year conversion period without synthetic fertilizers or pesticides.
- Use organic inputs only: composted manure, green manure, coffee pulp recycling.
- Pest/disease control focuses on prevention: resistant varieties, pruning for airflow, biocontrol, physical traps.

**Main certifications**:
| Certification | Focus | Premium potential |
|------|--------|----------|
| **Organic** | No synthetic inputs | Medium |
| **Fair Trade** | Minimum price guarantee + social premium | Medium |
| **Rainforest Alliance** | Ecological sustainability & labor rights | Medium-high |
| **UTZ** (merged into RA) | Sustainable farming standards | Medium |
| **Direct Trade** | Roaster direct purchase; highest premium but no unified standard | High |

**Certification tips**:
- Certification and audit costs are high for individual smallholders; cooperatives usually apply and share costs.
- Organic plots need a clear buffer from conventional plots to avoid cross-contamination.
- Organic yields are often 10–20% lower, but premiums and long-term soil health compensate.

**Getting started**: even before formal certification, reduce chemicals, increase organic inputs, and keep records.`
    },

    // ===== 新增：气候变化影响与适应 =====
    {
      keywords: ['气候变暖', '气候变化', '干旱', '极端天气', '适应', '全球变暖', '高温', 'climate change', 'global warming', 'drought', 'extreme weather', 'adaptation'],
      answer: `🌍 **气候变化对肯尼亚咖啡的影响与适应策略**

**主要威胁**：
- **温度上升**：适合咖啡种植的海拔带向上迁移，低海拔产区（<1400m）逐渐变得过热、病害增加。
- **降雨不规律**：长雨季/短雨季时间紊乱，干旱与暴雨交替，导致开花不齐、落花落果。
- **病害北扩/高海拔化**：咖啡浆果病和叶锈病向更高海拔蔓延，传统安全区也受到威胁。
- **传粉昆虫减少**：高温和农药使用导致蜜蜂等传粉者数量下降，影响坐果率。

**适应措施**：
1. **向高海拔迁移**：新建种植园优先选择 1700m 以上凉爽坡地。
2. **种植抗病品种**：逐步用 Batian、Ruiru 11 替换感病老品种。
3. **建设灌溉与蓄水池**：雨季蓄水、旱季滴灌，稳定水分供给。
4. **优化遮荫树**：在高温年份增加遮荫度至 40%–50%，降低树冠温度。
5. **多样化收入**：咖啡+澳洲坚果/香蕉/牛油果间作，降低单一作物气候风险。
6. **土壤覆盖**：保留咖啡果皮、枯枝落叶覆盖，提高保水保肥能力。

**长期建议**：关注肯尼亚咖啡研究所（CRF）发布的抗病新品种和气候适应技术指南，及时调整种植策略。`,
      answerEn: `🌍 **Climate Change Impacts & Adaptation for Kenya Coffee**

**Main threats**:
- **Rising temperatures**: suitable coffee belts move uphill; low-altitude areas (<1,400 m) become too hot and disease-prone.
- **Erratic rainfall**: long/short rains become unpredictable, causing uneven flowering and fruit drop.
- **Disease spread**: CBD and leaf rust move to higher altitudes, threatening previously safe zones.
- **Fewer pollinators**: heat and pesticides reduce bees and other pollinators, lowering fruit set.

**Adaptation measures**:
1. **Move uphill**: new plantations above 1,700 m on cool slopes.
2. **Plant resistant varieties**: gradually replace susceptible old varieties with Batian and Ruiru 11.
3. **Irrigation & water harvesting**: store rainwater in the wet seasons, drip-irrigate in dry spells.
4. **Optimize shade**: raise shade to 40–50% in hotter years to lower canopy temperature.
5. **Diversify income**: intercrop coffee with macadamia, banana or avocado to reduce single-crop climate risk.
6. **Soil cover**: retain coffee pulp, prunings and leaf litter to improve water and nutrient retention.

**Long-term advice**: follow climate-adaptation guidelines and new disease-resistant releases from the Coffee Research Foundation (CRF).`
    },

    // ===== 新增：如何选购/辨别肯尼亚咖啡 =====
    {
      keywords: ['怎么买', '哪里买', '选购', '辨别', '真假', '正品', '品牌', '推荐', '买', '购买', '咖啡豆推荐', 'how to buy', 'where to buy', 'authentic', 'fake', 'brand', 'recommend'],
      answer: `🛒 **如何选购与辨别正宗肯尼亚咖啡**

**看标签信息**：
- **产区**：优先选择标注 Nyeri、Kirinyaga、Murang'a、Embu 等具体产区，而不是只写"肯尼亚"。
- **等级**：AA、AB、PB 为精品级常见；AA TOP 为杯测优选批次。
- **品种**：SL28、SL34 混种是正宗肯尼亚风味；若只有 Ruiru11/Batian 则偏向稳产商业风格。
- **处理厂/合作社名**：如 Karogoto、Gachatha、Kieni 等知名处理厂，可追溯性更好。
- **烘焙日期**：熟豆最佳赏味期 2–30 天，超过 2 个月风味明显衰减。

**风味辨别**：
- 正宗肯尼亚：入口明亮果酸、黑醋栗/百香果/红酒感、尾韵干净回甘。
- 若只有焦苦、草本或沉闷发酵味，可能是深烘过度、陈豆或混合豆。

**购买渠道建议**：
- 国内精品咖啡烘焙商、电商旗舰店、杯测活动；优先支持提供烘焙日期与产地溯源的商家。
- 避免购买无明确产区、无烘焙日期、价格异常低廉（<50元/227g）的"肯尼亚风味"拼配豆。

**保存建议**：买回家后密封避光阴凉处，2 周内喝完风味最佳。`,
      answerEn: `🛒 **How to Buy & Identify Authentic Kenya Coffee**

**Check the label**:
- **Region**: prefer specific regions such as Nyeri, Kirinyaga, Murang'a, Embu — not just "Kenya".
- **Grade**: AA, AB and PB are common specialty grades; AA TOP is a cup-selected premium lot.
- **Variety**: SL28 + SL34 blends give the classic Kenya profile; lots with only Ruiru 11/Batian tend to be commercial-style.
- **Factory/cooperative name**: well-known stations like Karogoto, Gachatha, Kieni offer better traceability.
- **Roast date**: roasted beans peak 2–30 days post-roast; flavor fades significantly after 2 months.

**Flavor check**:
- Authentic Kenya: bright acidity, blackcurrant/passion fruit/winey notes, clean sweet finish.
- Burnt, herbal or dull fermented flavors suggest over-roasting, stale beans or blends.

**Buying tips**:
- Buy from specialty roasters, flagship stores or cupping events that offer roast date and origin traceability.
- Avoid "Kenya-style" blends with no region, no roast date, or abnormally low prices (<USD 7 per 8 oz).

**Storage**: seal tightly, keep cool, dark and consume within 2 weeks for best flavor.`
    },

    // ===== 新增：常见问题FAQ =====
    {
      keywords: ['faq', '常见问题', '问什么', '能问什么', '你会什么', '功能', '介绍一下', '是什么', 'help', 'what can you do'],
      answer: `📚 **我可以为您解答这些方面的问题**

🌱 **种植管理**：土壤pH调节、施肥方案、灌溉排水、遮荫树配置、修剪整形、育苗定植。

🐛 **病虫害诊断**：叶锈病、咖啡浆果病CBD、褐斑病、根腐病、果小蠹、潜叶蛾、线虫及综合防治。

🌿 **品种与产区**：SL28、SL34、Ruiru 11、Batian、K7 品种对比；Nyeri、Kirinyaga 等六大产区风味差异。

💧 **处理与分级**：双重水洗处理法、AA/AB/PB 等级、NCE 拍卖机制、合作社与庄园模式。

🔥 **烘焙冲煮**：浅/中/深烘选择、V60/虹吸/冷萃/意式冲煮参数、风味杯测要点。

💰 **经营与市场**：成本收益、有机认证、气候变化适应、如何选购正宗肯尼亚咖啡。

💡 **您可以直接输入症状**（例如"叶子发黄怎么办""落果严重"），我会根据关键词给出诊断思路。

📊 同时您也可以在「数据录入」页面输入土壤和气象数据，系统会自动生成个性化种植决策。`,
      answerEn: `📚 **Here's what I can help you with**

🌱 **Cultivation**: soil pH adjustment, fertilization, irrigation/drainage, shade-tree setup, pruning, nursery and planting.

🐛 **Pest & disease diagnosis**: leaf rust, CBD, brown blotch, root rot, berry borer, leaf miner, nematodes and integrated control.

🌿 **Varieties & regions**: SL28, SL34, Ruiru 11, Batian, K7 comparisons; Nyeri, Kirinyaga and other region flavor differences.

💧 **Processing & grading**: double-washed processing, AA/AB/PB grades, NCE auction, cooperatives vs estates.

🔥 **Roasting & brewing**: roast level choice, V60/siphon/cold brew/espresso parameters, cupping flavor notes.

💰 **Business & market**: costs/returns, organic certification, climate adaptation, how to buy authentic Kenya coffee.

💡 **You can describe symptoms directly** (e.g., "leaves are yellowing", "heavy fruit drop") and I will give diagnostic suggestions.

📊 You can also enter soil and weather data on the Data Entry page for personalized cultivation advice.`
    },
    // ===== 新增：口语化闲聊对话 =====
    {
      keywords: ['你是谁', '你叫什么', '你叫啥', '你是干嘛的', '你是做什么的', '你是什么', 'who are you', 'what are you', '介绍一下你自己', '介绍下你'],
      answer: `👋 我是**肯尼亚咖啡助手**，一个专门研究肯尼亚咖啡种植的智能助手！☕

🌱 我最擅长聊这些：
- **种植**：土壤pH、施肥、灌溉、修剪、育苗
- **病虫害**：叶锈病、浆果病等诊断与防治
- **品种产区**：SL28/SL34、六大产区风味
- **冲煮选购**：怎么冲好喝、怎么买正宗豆

直接问我问题就行，我会有问必答～`,
      answerEn: `👋 I am the **Kenya Coffee Assistant**, a smart helper specialized in Kenyan coffee growing! ☕

🌱 I know a lot about:
- **Cultivation**: soil pH, fertilization, irrigation, pruning, nursery
- **Pests & diseases**: leaf rust, berry disease diagnosis & control
- **Varieties & regions**: SL28/SL34, the six growing regions
- **Brewing & buying**: how to brew well, how to buy authentic beans

Just ask me anything!`
    },
    {
      keywords: ['你好', '您好', 'hi', 'hello', '嗨', '哈喽', '早上好', '中午好', '下午好', '晚上好', 'hey', '在吗', '在么', '在不在'],
      answer: `👋 您好！欢迎来聊咖啡～☕

我是您的肯尼亚咖啡种植顾问。您可以问我施肥、病虫害、品种、冲煮等任何问题，也可以直接描述症状（比如"叶子发黄"），我来帮您分析。`,
      answerEn: `👋 Hi there! Welcome — let us talk coffee! ☕

I am your Kenya coffee growing advisor. Ask me anything about fertilization, pests, varieties, brewing, or just describe symptoms (e.g. "leaves turning yellow") and I will help you diagnose.`
    },
    {
      keywords: ['谢谢', '感谢', '多谢', '谢谢啦', '谢谢了', 'thanks', 'thank you', 'thx', '辛苦了', '太棒了', '很好', '不错', '厉害', '真棒', '牛', '有道理', '懂了', '明白了', '知道了'],
      answer: `😊 不客气！能帮上忙我就很开心。

后续遇到任何种植问题随时回来找我，祝您的咖啡树越长越壮，豆子香飘满园！☕🌱`,
      answerEn: `😊 You are welcome! Happy to help.

Come back anytime for more coffee questions. Wishing your trees thrive and your beans turn out amazing! ☕🌱`
    },
    {
      keywords: ['再见', '拜拜', 'bye', 'goodbye', '下次聊', '先这样', '晚安', '回聊'],
      answer: `👋 再见！祝您种植顺利，收获满满一季精品豆！有需要随时来找我。☕`,
      answerEn: `👋 Goodbye! Wishing you a great growing season and a wonderful harvest! Come back anytime. ☕`
    },
    {
      keywords: ['讲个笑话', '说个笑话', '笑话', '好无聊', '无聊', 'joke', 'bored'],
      answer: `😄 咖啡树对另一棵咖啡树说："你最近怎么总是精神不振？"
另一棵说："唉，主人今天又给我施氮肥了，我上火了……"

好啦，聊点正事：想了解肯尼亚咖啡怎么种、怎么冲、怎么选，我都能帮您！`,
      answerEn: `😄 A coffee tree said to another: "You look low lately."
The other replied: "Ugh, my owner just applied nitrogen fertilizer again — I am feeling hot..."

Alright, back to coffee talk: I can help with growing, brewing and buying Kenya coffee anytime!`
    },
    {
      keywords: ['今天天气', '天气怎么样', '会不会下雨', '下雨', '天气', 'weather', 'rain'],
      answer: `🌦️ 肯尼亚咖啡产区（如涅里、基安布）年均温 15–24°C、年降雨 1200–2000mm，有明显的**双雨季**（3–5月长雨季、10–12月短雨季）。

如果您想看针对自己地块的天气建议，可以在「数据录入」页面填写温度、降雨、湿度，我会结合这些参数给出个性化方案。`,
      answerEn: `🌦️ Kenya coffee regions (Nyeri, Kirinyaga, etc.) have annual temperatures of 15–24°C and rainfall of 1200–2000mm, with a **double rainy season** (long rains Mar–May, short rains Oct–Dec).

For advice tailored to your own farm, fill in temperature, rainfall and humidity on the Data Entry page and I will use them to customize recommendations.`
    },
    {
      keywords: ['哦', '嗯', '好吧', '好的', 'ok', 'okay', 'fine', '知道了', '收到'],
      answer: `😊 好的～如果之后想深入了解某个环节，随时告诉我。

比如：施肥时间、灌溉频率、叶锈病防治、怎么选品种，我都可以展开细说。`,
      answerEn: `😊 Got it! Let me know if you would like to dig deeper into any topic later.

I can elaborate on fertilization timing, irrigation frequency, leaf rust control, variety selection and more.`
    }
  ],

  /** 通用回答 */
  fallbackAnswers: [
    `🤔 这个问题我需要更多信息才能准确回答。您可以尝试问我关于施肥、修剪、病虫害防治、品种选择、灌溉、土壤pH等问题。`,
    `📚 关于这个问题，我建议您参考肯尼亚咖啡研究所(CRF)的最新指南。同时，您可以在「数据录入」页面输入具体参数，系统会自动生成针对性建议。`,
    `🌿 这是一个很好的问题！肯尼亚咖啡种植涉及多方面因素。建议您提供更具体的信息（如海拔、土壤类型、当前遇到的问题），我可以给出更精准的建议。`
  ],

  /** 英文通用回答 */
  fallbackAnswersEn: [
    `🤔 I need a bit more detail to answer accurately. Try asking about history, growing regions, varieties, grades, fertilization, pruning, pest control, or soil pH.`,
    `📚 For this topic, I recommend checking the latest guidelines from the Coffee Research Foundation (CRF) of Kenya. You can also enter specific values on the Data Entry page for tailored advice.`,
    `🌿 Great question! Kenya coffee growing involves many factors. Please share more specifics (altitude, soil type, current problem) and I can give more precise advice.`
  ],

  /** 英文关键词 → 中文关键词 映射（英文模式下提问也能命中知识库） */
  enKeywordMap: {
    // 长词组优先
    'double washed': '双重水洗', 'double-washed': '双重水洗', 'washed processing': '水洗',
    'leaf rust': '叶锈病', 'coffee berry disease': '浆果病', 'berry disease': '浆果病',
    'yellow leaves': '黄叶', 'leaves yellow': '黄叶', 'leaf yellowing': '黄叶', 'leaf drop': '落叶', 'dropping leaves': '落叶', 'chlorosis': '黄叶', 'wilting': '枯萎',
    'pour over': '手冲', 'cold brew': '冷萃', 'light roast': '浅烘', 'medium roast': '中烘',
    'dark roast': '深烘', 'roast level': '烘焙', 'growing region': '产区', 'growing regions': '产区',
    'production region': '产区', 'smallholder': '合作社', 'small scale farmer': '小农',
    'big farm': '庄园', 'history': '历史', 'development': '发展史', 'origin': '起源', 'origins': '起源',
    'colonial': '殖民', 'missionary': '传教士', 'introduced': '引入',
    'fertilizer': '施肥', 'fertilizing': '施肥', 'fertilize': '施肥', 'manure': '有机肥',
    'nitrogen': '氮肥', 'phosphorus': '磷肥', 'potassium': '钾肥', 'nutrient': '营养',
    'compost': '有机肥', 'organic': '有机肥', 'npk': '复合肥',
    'prune': '修剪', 'pruning': '修剪', 'trim': '修剪', 'trimming': '修剪',
    'branch': '修枝', 'stem': '主干',
    'pest': '病虫害', 'pests': '病虫害', 'disease': '病害', 'rust': '叶锈病',
    'borer': '果小蠹', 'anthracnose': '炭疽病', 'fungus': '真菌', 'fungicide': '杀菌',
    'insect': '虫害', 'root rot': '根腐病', 'nematode': '线虫',
    'ph': 'ph', 'acidity': '酸度', 'acid': '酸性', 'alkaline': '碱性', 'lime': '石灰',
    'variety': '品种', 'varieties': '品种', 'cultivar': '品种', 'sl28': 'sl28',
    'sl34': 'sl34', 'ruiru': 'ruiru', 'batian': 'batian', 'k7': 'k7',
    'irrigation': '灌溉', 'water': '浇水', 'drought': '干旱', 'watering': '浇水',
    'moisture': '水分', 'drip': '滴灌',
    'altitude': '海拔', 'elevation': '海拔', 'height': '高度', 'slope': '山坡',
    'harvest': '收获', 'picking': '采摘', 'ripe': '成熟', 'cherry': '采摘',
    'processing': '加工', 'washed': '水洗', 'sun-dried': '日晒', 'natural': '日晒',
    'fermentation': '发酵', 'soaking': '浸泡', 'parchment': '羊皮纸豆', 'raised bed': '高架床',
    'shade': '遮阴', 'shading': '遮阴', 'intercropping': '间作', 'interplant': '间作',
    'climate': '气候', 'temperature': '温度', 'rainfall': '降雨', 'humidity': '湿度',
    'sunlight': '日照', 'weather': '天气', 'season': '季节', 'rainy': '雨季', 'dry season': '旱季',
    'grade': '等级', 'grading': '分级', 'screen': '筛网', 'peaberry': '圆豆', 'bean size': '等级',
    'auction': '拍卖', 'exchange': '交易所', 'nce': 'nce', 'nairobi': '内罗毕', 'price': '价格',
    'cooperative': '合作社', 'estate': '庄园',
    'nyeri': '涅里', 'kirinyaga': '基安布', 'muranga': '穆兰加', 'embu': '恩布', 'meru': '梅鲁', 'thika': '锡卡',
    'roast': '烘焙', 'roasting': '烘焙', 'brew': '冲煮', 'brewing': '冲煮', 'siphon': '虹吸', 'espresso': '意式',
    'volcanic soil': '火山土', 'rift valley': '大裂谷', 'red soil': '红壤',
    'seedling': '育苗', 'planting': '种植', 'spacing': '株距', 'drainage': '排水', 'terrace': '梯田'
  },

  /** 斯瓦西里语关键词 → 中文关键词 映射（斯瓦西里语模式下提问也能命中知识库） */
  swKeywordMap: {
    'kahawa ya kenya': '肯尼亚咖啡', 'kahawa kenya': '肯尼亚咖啡', 'kenya coffee': '肯尼亚咖啡',
    'mbolea': '施肥', 'kuweka mbolea': '施肥', 'kuwapa mbolea': '施肥',
    'nitrojeni': '氮肥', 'fosforasi': '磷肥', 'potasi': '钾肥',
    'udongo': '土壤', 'ph ya udongo': 'ph', 'kisiki': '酸性', 'jikoni': '碱性',
    'maji': '浇水', 'umwagiliaji': '灌溉', 'matone': '滴灌', 'ukame': '干旱', 'mvua': '降雨',
    'kata': '修剪', 'kukatia': '修剪', 'kukata matawi': '修剪',
    'gonjwa': '病害', 'dudu': '虫害', 'kutu': '叶锈病', 'kutu ya majani': '叶锈病',
    'chungwa': '浆果病', 'kuvunda': '根腐病', 'kuauka': '枯萎', 'njano': '黄叶', 'kushuka': '落果',
    'aina': '品种', 'sl28': 'sl28', 'sl34': 'sl34', 'ruiru': 'ruiru', 'batian': 'batian',
    'mwinuko': '海拔', 'kimo': '海拔', 'milinga': '海拔',
    'joto': '温度', 'unyeshe': '湿度', 'mvua ya mwezi': '降雨',
    'kuchuma': '收获', 'kuvuna': '收获', 'mavuno': '收获', 'matunda': '采摘',
    'kusafisha': '水洗', 'double washed': '双重水洗', 'kukausha': '日晒', 'fermentation': '发酵',
    'daraja': '等级', 'aa': 'aa', 'ab': 'ab', 'pb': '圆豆', 'peaberry': '圆豆',
    'mkoa': '产区', 'nyeri': '涅里', 'kirinyaga': '基安布', 'muranga': '穆兰加', 'embu': '恩布', 'meru': '梅鲁', 'thika': '锡卡',
    'kuchoma': '烘焙', 'kutengeneza': '冲煮', 'v60': '手冲', 'espresso': '意式', 'cold brew': '冷萃',
    'historia': '历史', 'asili': '起源', 'misionari': '传教士', 'mkoloni': '殖民',
    'soko': '拍卖', 'mnada': '拍卖', 'bei': '价格', 'nce': 'nce',
    'kivuli': '遮阴', 'kupanda': '种植', 'miche': '育苗', 'nafasi': '株距'
  },

  /** 中文同义词归一化（症状/口语 → 标准关键词） */
  synonymMap: {
    '叶子': '叶', '叶片': '叶', '树叶': '叶',
    '发黄': '黄', '黄了': '黄', '变黄': '黄',
    '掉叶': '落叶', '掉叶子': '落叶', '落叶了': '落叶',
    '叶尖焦': '焦边', '叶边焦': '焦边', '叶子焦': '焦边',
    '枯': '枯萎', '干枯': '枯萎', '萎蔫': '枯萎',
    '不长': '生长缓慢', '长得慢': '生长缓慢', '长势差': '生长缓慢',
    '斑点': '病斑',
    '不结果': '结果少', '不挂果': '结果少', '挂果少': '结果少', '结果少': '结果少',
    '掉果': '落果', '落果了': '落果', '果子掉': '落果',
    '落花': '落花',
    '产量低': '产量低', '减产': '产量低',
    '怎么种': '种植建议', '如何种': '种植建议', '栽种': '种植建议',
    '啥品种': '品种', '什么品种': '品种', '哪种': '品种',
    '怎么冲': '冲煮', '如何冲': '冲煮', '怎么泡': '冲煮', '如何泡': '冲煮',
    '怎么买': '选购', '在哪买': '选购', '哪里买': '选购',
    '多少钱': '价格', '贵吗': '价格', '便宜': '价格',
    '存储': '储存', '保存': '储存', '存放': '储存',
    '发霉': '霉变', '长霉': '霉变',
    '有没有虫': '虫害', '生虫': '虫害',
    '用什么肥': '施肥', '怎么施肥': '施肥', '施什么肥': '施肥',
    '修剪': '修剪', '修枝': '修剪', '剪枝': '修剪',
    '浇水': '灌溉', '灌水': '灌溉', '缺水': '灌溉',
    '海拔': '海拔', '高度': '海拔',
    '什么时候摘': '收获', '何时采收': '收获', '采摘时间': '收获',
    '怎么处理': '处理法', '加工方式': '处理法',
    '分级': '等级', '级别': '等级',
    '产区': '产区', '产地': '产区',
    '风味': '杯测', '口感': '杯测', '味道': '杯测',
    '认证': '有机', 'fairtrade': '公平贸易', '有机认证': '有机',
    // ===== 口语化表达 → 标准关键词 =====
    '咋办': '怎么办', '咋整': '怎么办', '咋个办': '怎么办', '怎么办': '怎么办',
    '咋回事': '怎么办', '怎么回事': '怎么办', '咋了': '怎么办', '怎么了': '怎么办',
    '啥时候': '什么时候', '啥时': '什么时候', '啥': '什么',
    '咋': '怎么', '肿么': '怎么', '怎么弄': '怎么办', '怎么做': '怎么办',
    '行不行': '可以吗', '能不能': '可以吗', '能行吗': '可以吗', '可以吗': '可以吗',
    '多少钱一斤': '价格', '卖多少钱': '价格', '贵不贵': '价格', '值不值': '价格',
    '怎么选': '选购', '咋选': '选购', '选哪种': '选购', '买哪种': '选购', '推荐哪种': '选购', '哪种好': '选购',
    '好吃吗': '风味', '好喝吗': '冲煮', '苦不苦': '杯测', '香不香': '杯测',
    '有没有病': '病虫害', '是不是生病': '病虫害', '生了啥病': '病虫害', '生什么病': '病虫害', '什么病': '病虫害',
    '要浇几次水': '灌溉', '多久浇一次水': '灌溉', '几天浇一次': '灌溉', '浇多少水': '灌溉',
    '什么时候种': '种植建议', '啥时候种': '种植建议', '什么季节种': '种植建议',
    '什么时候收': '收获', '啥时候摘': '收获', '几月采摘': '收获',
    '长得不好': '生长缓慢', '长不好': '生长缓慢', '不长个': '生长缓慢', '长不大': '生长缓慢',
    '叶子变黄': '黄叶', '叶变黄': '黄叶', '黄叶子': '黄叶', '叶片黄': '黄叶',
    '掉叶子': '落叶', '老掉叶': '落叶', '叶子掉了': '落叶', '叶子掉': '落叶', '掉叶': '落叶', '掉叶子了': '落叶', '叶掉光': '落叶',
    '咖啡好种吗': '种植建议', '好养吗': '种植建议', '容易种吗': '种植建议', '难种吗': '种植建议',
    '施点啥肥': '施肥', '要不要施肥': '施肥', '多久施肥': '施肥', '施肥吗': '施肥',
    '要不要浇水': '灌溉', '啥时候浇水': '灌溉', '多久浇水': '灌溉',
    '豆子苦': '杯测', '太苦': '杯测', '酸不酸': '杯测', '苦不苦': '杯测',
    '果子掉了': '落果', '果掉了': '落果', '掉果子': '落果',
    '生虫子': '虫害', '有虫': '虫害', '长虫': '虫害',
    '用什么肥': '施肥', '下什么肥': '施肥', '施肥吗': '施肥', '上肥': '施肥',
    '剪枝': '修剪', '要剪吗': '修剪', '怎么剪': '修剪',
    '能赚吗': '成本', '赚钱吗': '成本', '有利润吗': '成本', '回本': '成本',
    '在哪能买': '选购', '去哪儿买': '选购', '买得到吗': '选购'
  },

  /** 症状类加权词：命中时优先返回症状诊断条目 */
  symptomKeywords: {
    zh: ['黄', '落叶', '焦边', '枯萎', '病斑', '落果', '结果少', '产量低', '不开花', '不结果'],
    en: ['yellow', 'leaf drop', 'leaf edge', 'wilt', 'spot', 'drop', 'few fruit', 'low yield', 'no flower', 'no fruit'],
    sw: ['njano', 'majani kushuka', 'ukuta wa jani', 'kukauka', 'doa', 'kushuka', 'matunda machache', 'mavuno chache', 'hauchi maua', 'hauchi matunda']
  },

  /** 对话上下文：最近几轮 Q&A，用于指代消解和追问 */
  history: [],

  /** 上一轮命中的知识条目，追问时可直接沿用 */
  lastMatchedEntry: null,
  lastMatchedKeywords: [],

  /** 追问/指代识别模式 */
  followUpPatterns: {
    zh: /(详细|具体|展开|再.*说|举.*例子|还有|为什么|怎么办|那|它|这个|那个|刚才|之前|上面|继续|接着)/,
    en: /(more|detail|elaborate|explain|example|why|how|it|this|that|above|previous|continue|go on)/,
    sw: /(zaidi|maelezo|eleza|mfano|kwa nini|vipi|vile|hili|hicho|hapo|endelea|endeleza|fanya vipi|suluhisha)/i
  },

  /** 多样化开场模板 */
  openerTemplates: {
    zh: {
      how: ['💡 针对您问的这个问题，我整理了几条实用思路：', '💡 好问题，这样做通常比较稳妥：', '💡 我来给您梳理一下处理方向：'],
      why: ['🔍 出现这类情况，通常和下面几个原因有关：', '🔍 我帮您分析一下常见原因：', '🔍 这个问题的背后，一般有这样的逻辑：'],
      what: ['📖 简单理解的话，它是这样的：', '📖 关于这个，我给您通俗地解释一下：', '📖 一句话概括，要点如下：'],
      symptom: ['🩺 结合您描述的情况，我判断可能和这些原因有关：', '🩺 您说的这种症状，常见原因和应对办法如下：', '🩺 别急，这类问题一般可以这样排查：'],
      general: ['☕ 关于您的问题，我整理了这些要点：', '☕ 好的，我来说说我的建议：', '☕ 这个问题很有意思，要点如下：']
    },
    en: {
      how: ['💡 Here are some practical steps for you:', '💡 Good question — here is what usually works:', '💡 Let me walk you through the approach:'],
      why: ['🔍 This usually relates to the following factors:', '🔍 Let me break down the common causes:', '🔍 Here is what is likely going on:'],
      what: ['📖 In simple terms, here is the answer:', '📖 Let me explain it in plain language:', '📖 The key points are:'],
      symptom: ['🩺 Based on what you described, here is what may be happening:', '🩺 The symptoms you mentioned often point to these causes:', '🩺 Let us troubleshoot this together:'],
      general: ['☕ Here are the key points for your question:', '☕ Sure, here is my take:', '☕ Interesting question — here is the summary:']
    },
    sw: {
      how: ['💡 Hapa hatua kadhaa za vitendo kwako:', '💡 Swali zuri — hii ndiyo kawaida inayofanya kazi:', '💡 Nakuongoza katika mbinu:'],
      why: ['🔍 Hii kawaida huhusiana na sababu zifuatazo:', '🔍 Ngoja nikufanyie uchambuzi wa sababu za kawaida:', '🔍 Hili ndilo linalotokea kwa ujumla:'],
      what: ['📖 Kwa maneno rahisi, hii ndiyo jibu:', '📖 Nakuambia kwa lugha rahisi:', '📖 Mambo muhimu ni haya:'],
      symptom: ['🩺 Kulingana na ulichosema, haya ndiyo yanayoweza kuwa yanatokea:', '🩺 Dalili ulizozitaja mara nyingi huashiria sababu hizi:', '🩺 Ngoja tukagua pamoja:'],
      general: ['☕ Haya ndiyo mambo muhimu kuhusu swali lako:', '☕ Hakika, hiki ndicho maoni yangu:', '☕ Swali zuri — hii ndiyo muhtasari:']
    }
  },

  /** 多样化结尾模板 */
  closerTemplates: {
    zh: [
      '如果您能补充海拔、土壤pH或当前照片，我可以给出更精准的判断。',
      '还想了解哪一步的具体操作？可以随时追问。',
      '您可以把这个问题和「数据录入」里的土壤/气象数据结合起来看，会更准确。',
      '需要我针对您的地块条件再细化建议吗？',
      '有后续问题随时问我，我会结合上下文继续帮您分析。'
    ],
    en: [
      'If you can share altitude, soil pH, or a photo, I can refine the advice.',
      'Let me know which step you would like to explore further.',
      'You can also cross-check this with the soil and weather data on the Data Entry page.',
      'Need me to tailor this to your specific farm conditions?',
      'Feel free to follow up — I will keep the context in mind.'
    ],
    sw: [
      'Ukiweza kutoa mwinuko, pH ya udongo, au picha, ninaweza kuboresha shauri.',
      'Nijulishe ni hatua gani ungependa kuchunguza zaidi.',
      'Unaweza pia kulinganisha na data za udongo na hali ya hewa kwenye ukurasa wa Weka Data.',
      'Unahitaji nikufanyie mpangilio kwa hali mahususi ya shamba lako?',
      'Uliza maswali zaidi — nitakumbuka muktadha.'
    ]
  },

  /** 随机取数组元素 */
  _pick(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  },

  /** 问题归一化（小写、去标点、英/中文映射） */
  _normalizeQuestion(question) {
    let q = question.toLowerCase().replace(/[?!？！，,。.\s]+/g, ' ').trim();

    if (this.lang === 'en') {
      Object.keys(this.enKeywordMap).sort((a, b) => b.length - a.length).forEach(ek => {
        if (q.indexOf(ek) !== -1) q = q.split(ek).join(' ' + this.enKeywordMap[ek] + ' ');
      });
    }

    if (this.lang === 'sw') {
      Object.keys(this.swKeywordMap).sort((a, b) => b.length - a.length).forEach(sk => {
        if (q.indexOf(sk) !== -1) q = q.split(sk).join(' ' + this.swKeywordMap[sk] + ' ');
      });
    }

    if (this.lang === 'zh') {
      const syns = Object.keys(this.synonymMap).sort((a, b) => b.length - a.length);
      syns.forEach(from => {
        if (q.indexOf(from) !== -1) q = q.split(from).join(this.synonymMap[from]);
      });
    }

    return ' ' + q + ' ';
  },

  /** 保存/维护对话历史 */
  _remember(role, text, keywords) {
    this.history.push({ role, text, keywords: keywords || [], time: Date.now() });
    if (this.history.length > 8) this.history.shift();
  },

  /** 上下文指代消解与追问补全 */
  _resolveContext(question) {
    const lang = this.lang === 'zh' ? 'zh' : (this.lang === 'sw' ? 'sw' : 'en');
    const pattern = this.followUpPatterns[lang];
    if (!pattern.test(question)) return question;

    const lastBot = this.history.slice().reverse().find(h => h.role === 'bot');
    const lastUser = this.history.slice().reverse().find(h => h.role === 'user');
    const topicKw = (lastBot && lastBot.keywords && lastBot.keywords.length)
      ? lastBot.keywords
      : (lastUser && lastUser.keywords ? lastUser.keywords : []);

    if (!topicKw.length) return question;

    const q = question.trim();

    // 若问题只含指代词，补全为主题关键词
    const bare = {
      zh: /^(它|这个|那个|那|这|刚才|上面|之前)[\?？]?$/,
      en: /^(it|this|that|above|previous)[\?]?$/i,
      sw: /^(hili|hicho|hapo|hii|hiyo|hapo juu|kabla|endelea)[\?]?$/i
    };
    if (bare[lang].test(q)) {
      return topicKw.slice(0, 2).join(' ') + ' ' + q;
    }

    // 简短追问（如“具体措施”“那怎么办”）：把主题关键词前置，增强命中
    const short = {
      zh: q.length <= 8,
      en: q.split(/\s+/).length <= 3,
      sw: q.split(/\s+/).length <= 4
    };
    if (short[lang]) {
      return topicKw.slice(0, 2).join(' ') + ' ' + q;
    }

    // 一般追问：把主题关键词拼到问题末尾辅助匹配
    return question + ' ' + topicKw.slice(0, 3).join(' ');
  },

  /** 检测问题意图 */
  _detectIntent(question) {
    const q = question.toLowerCase();
    if (/怎么办|怎么|如何|how to|what should|fanya vipi|vipi/i.test(q)) return 'how';
    if (/为什么|原因|why|kwa nini/i.test(q)) return 'why';
    if (/是什么|什么叫|what is|what are|ni nini/i.test(q)) return 'what';
    if (/黄|落叶|枯|落果|病斑|不开花|不结果|leaf yellow|drop|wilting|disease|njano|kukauka|kushuka/i.test(q)) return 'symptom';
    return 'general';
  },

  /** 检测是否为追问/深入 */
  _isDeepAsk(question) {
    const q = question.toLowerCase();
    const deep = {
      zh: /详细|具体|展开|深入|再.*说|举.*例子|为什么|怎么办|还有|继续|接着/,
      en: /more|detail|elaborate|deep|example|why|how|continue|go on/,
      sw: /zaidi|maelezo|eleza|kina|mfano|kwa nini|vipi|endelea|fanya vipi|suluhisha/i
    };
    return deep[this.lang] ? deep[this.lang].test(q) : false;
  },

  /** 读取用户在数据录入页面保存的数据 */
  _getUserData() {
    try {
      const raw = localStorage.getItem('coffee_data');
      if (!raw) return null;
      const data = JSON.parse(raw);
      // 确保是土壤/气象数据对象（不是登录用户信息）
      if (!data || typeof data !== 'object' || (!('soilPH' in data) && !('avgTemp' in data))) return null;
      return data;
    } catch (e) {
      return null;
    }
  },

  /** 根据用户数据生成个性化建议尾巴 */
  _buildPersonalizedTail(data) {
    if (!data) return '';
    const lang = this.lang === 'zh' ? 'zh' : (this.lang === 'sw' ? 'sw' : 'en');
    const parts = [];
    const phText = {
      zh: { low: `土壤pH {v} 偏酸`, high: `土壤pH {v} 偏碱`, good: `土壤pH {v} 处于适宜区间` },
      en: { low: `soil pH {v} is rather acidic`, high: `soil pH {v} is rather alkaline`, good: `soil pH {v} is in a good range` },
      sw: { low: `pH ya udongo {v} ni kisiki`, high: `pH ya udongo {v} ni jikoni`, good: `pH ya udongo {v} iko katika kipengele bora` }
    };
    const tempText = {
      zh: { low: `均温 {v}°C 偏低`, high: `均温 {v}°C 偏高`, good: `均温 {v}°C 适宜` },
      en: { low: `average temp {v}°C is on the low side`, high: `average temp {v}°C is on the high side`, good: `average temp {v}°C is suitable` },
      sw: { low: `joto la wastani {v}°C ni chini`, high: `joto la wastani {v}°C ni juu`, good: `joto la wastani {v}°C ni sawa` }
    };
    const altText = {
      zh: { good: `海拔 {v}m 适合精品咖啡`, low: `海拔 {v}m 相对偏低，建议加强遮荫` },
      en: { good: `altitude {v}m favors specialty coffee`, low: `altitude {v}m is relatively low; increase shade` },
      sw: { good: `mwinuko {v}m unafaa kahawa ya kipekee`, low: `mwinuko {v}m ni chini kidogo; ongeza kivuli` }
    };

    if (data.soilPH !== undefined) {
      const ph = parseFloat(data.soilPH);
      const key = ph < 5.0 ? 'low' : (ph > 6.5 ? 'high' : 'good');
      parts.push(phText[lang][key].replace('{v}', ph));
    }
    if (data.avgTemp !== undefined) {
      const t = parseFloat(data.avgTemp);
      const key = t < 15 ? 'low' : (t > 24 ? 'high' : 'good');
      parts.push(tempText[lang][key].replace('{v}', t));
    }
    if (data.altitude !== undefined) {
      const a = parseFloat(data.altitude);
      parts.push(altText[lang][a >= 1400 ? 'good' : 'low'].replace('{v}', a));
    }
    if (data.humidity !== undefined) {
      const h = parseFloat(data.humidity);
      if (h > 85) parts.push(lang === 'zh' ? `湿度 ${h}% 偏高，注意通风防病` : (lang === 'sw' ? `unyevu wa hewa ${h}% ni juu, angalia hewa na magonjwa` : `humidity ${h}% is high; improve ventilation`));
    }
    if (data.monthlyRain !== undefined) {
      const r = parseFloat(data.monthlyRain);
      if (r < 80) parts.push(lang === 'zh' ? `月降雨 ${r}mm 偏少` : (lang === 'sw' ? `mvua ya mwezi ${r}mm ni chache` : `monthly rainfall ${r}mm is low`));
      else if (r > 250) parts.push(lang === 'zh' ? `月降雨 ${r}mm 偏多` : (lang === 'sw' ? `mvua ya mwezi ${r}mm ni nyingi` : `monthly rainfall ${r}mm is high`));
    }

    if (!parts.length) return '';

    const headers = {
      zh: '\n\n📊 **结合您录入的数据**：',
      en: '\n\n📊 **Based on your recorded data**: ',
      sw: '\n\n📊 **Kulingana na data uliyoweka**: '
    };
    const footers = {
      zh: '。您可以把上述建议和这些实际参数对照着看。',
      en: '. You can cross-check the advice against these parameters.',
      sw: '. Unaweza kulinganisha shauri na vigezo hivi halisi.'
    };
    return headers[lang] + parts.join(lang === 'zh' ? '，' : '; ') + footers[lang];
  },

  /** 追问时追加深入解释 */
  _buildDeepExtra(entry, intent) {
    const lang = this.lang === 'zh' ? 'zh' : (this.lang === 'sw' ? 'sw' : 'en');
    const topic = entry.keywords[0] || '';
    const examples = {
      '黄叶': {
        zh: '\n\n🌰 **举个例子**：如果您发现底部老叶先黄、叶脉仍绿，往往是缺镁；可以叶面喷施0.3%硫酸镁，同时根部追施有机肥。',
        en: '\n\n🌰 **For example**: if older lower leaves turn yellow while veins stay green, magnesium deficiency is likely; spray 0.3% magnesium sulfate and add compost.',
        sw: '\n\n🌰 **Kwa mfano**: kama majani ya chini ya zamani yanageuka njano huku mishipa ya kijani ikiwa, uhaba wa magnesiamu unaweza kuwa na hatia; pulizia sulfati ya magnesiamu 0.3% na ongeza mboji kwa mizizi.'
      },
      '叶锈病': {
        zh: '\n\n🌰 **关键细节**：叶锈病在雨季高发，病斑背面可见橙黄色孢子堆。预防上除了喷药，更重要的是保持树冠通风、避免密植。',
        en: '\n\n🌰 **Key detail**: leaf rust peaks in rainy seasons; look for orange spore masses on leaf undersides. Prune for airflow and avoid over-planting.',
        sw: '\n\n🌰 **Maelezo muhimu**: kutu ya majani huongezeka katika msimu wa mvua; tafuta miche ya kijani-chungwa upande wa chini wa majani. Kata ili uhepewe na epuka kupanda miti karibu sana.'
      },
      '施肥': {
        zh: '\n\n🌰 **再具体一点**：花期前1个月可追施磷钾肥促进花芽分化；采果后补充氮肥恢复树势，但切忌旱季单独大量撒施氮肥。',
        en: '\n\n🌰 **More specifically**: apply P/K fertilizer one month before flowering to support bud initiation; after harvest add N to recover tree vigor, but avoid heavy N alone in the dry season.',
        sw: '\n\n🌰 **Kwa maelezo zaidi**: tumia mbolea ya P/K mwezi mmoja kabla ya kuchomoka maua ili kusaidia machipuko; baada ya mavuno ongeza N kurejesha nguvu, lakini epuka mbolea nyingi ya N peke yake katika msimu wa ukame.'
      },
      '灌溉': {
        zh: '\n\n🌰 **实操提示**：滴灌比漫灌节水40%以上，且能减少叶部病害。旱季每周2–3次，每次浸润根区20–30cm即可。',
        en: '\n\n🌰 **Practical tip**: drip irrigation saves 40%+ water vs flood irrigation and reduces leaf diseases. In the dry season, 2–3 times per week, wetting 20–30 cm root zone is enough.',
        sw: '\n\n🌰 **Kidokezo cha vitendo**: umwagiliaji wa matone huokoa maji zaidi ya 40% ukilinganisha na umwagiliaji wa mafuriko na hupunguza magonjwa ya majani. Katika msimu wa ukame, mara 2–3 kwa wiki, kichaka cha mizizi cha cm 20–30 kinatosha.'
      }
    };

    if (examples[topic] && examples[topic][lang]) return examples[topic][lang];

    if (intent === 'why') {
      const whyMsgs = {
        zh: '\n\n🔎 **深层原因**：咖啡是热带高山作物，对环境变化非常敏感。很多表面症状（黄叶、落果）其实是水、肥、光、病几个因素共同作用的结果，需要综合排查。',
        en: '\n\n🔎 **Deeper reason**: coffee is a tropical highland crop very sensitive to environmental shifts. Many visible symptoms result from combined water, nutrition, light and disease factors.',
        sw: '\n\n🔎 **Sababu za kina**: kahawa ni zao la milima ya tropiki na inahisi mabadiliko ya mazingira kwa urahisi. Dalili nyingi zinazoonekana (majani mekundu, kushuka kwa matunda) ni matokeo ya mchanganyiko wa maji, lishe, mwanga na magonjwa.'
      };
      return whyMsgs[lang];
    }

    if (intent === 'how') {
      const howMsgs = {
        zh: '\n\n🔎 **操作建议**：先从最容易排查的因素入手——土壤pH、水分、近期施肥和病虫害痕迹，逐步缩小范围，再针对性处理。',
        en: '\n\n🔎 **Action tip**: start with the easiest checks — soil pH, moisture, recent fertilization and pest/disease signs — then narrow down before treating.',
        sw: '\n\n🔎 **Kidokezo cha hatua**: anza na vipengele rahisi kukagua — pH ya udongo, unyevu, mbolea ya hivi karibuni na dalili za wadudu/magonjwa — kisha fanya matibabu ya kipekee.'
      };
      return howMsgs[lang];
    }

    const extraMsgs = {
      zh: '\n\n🔎 **补充说明**：如果条件允许，建议您拍几张叶片、土壤和全株照片，结合具体海拔、pH和气象数据，判断会更准确。',
      en: '\n\n🔎 **Extra note**: if possible, take photos of leaves, soil and the whole tree, together with altitude, pH and weather data, for a more accurate diagnosis.',
      sw: '\n\n🔎 **Maelezo ya ziada**: ikiwezekana, piga picha za majani, udongo na mti mzima, pamoja na mwinuko, pH na data ya hali ya hewa, ili kupata utambuzi sahihi zaidi.'
    };
    return extraMsgs[lang];
  },

  /** 构建动态开场 */
  _buildAnswerPrefix(question, matchedKw) {
    const lang = this.lang === 'zh' ? 'zh' : (this.lang === 'sw' ? 'sw' : 'en');
    const intent = this._detectIntent(question);
    const templates = this.openerTemplates[lang][intent] || this.openerTemplates[lang].general;
    return this._pick(templates);
  },

  /** 构建动态结尾 */
  _buildCloser(intent) {
    const lang = this.lang === 'zh' ? 'zh' : (this.lang === 'sw' ? 'sw' : 'en');
    const closers = this.closerTemplates[lang];
    return this._pick(closers);
  },

  /** 识别问题中带的具体数值（pH/海拔/温度/降雨），生成针对性点评 */
  _buildNumberTail(question) {
    const q = String(question || '').toLowerCase();
    const lang = this.lang === 'zh' ? 'zh' : (this.lang === 'sw' ? 'sw' : 'en');
    const parts = [];
    const phMsgs = {
      zh: ['土壤pH {v} 明显偏酸，建议先调酸再谈施肥', '土壤pH {v} 略偏酸，可少量施用石灰调节', '土壤pH {v} 正好落在咖啡适宜区间（5.5–6.5）', '土壤pH {v} 偏高，注意磷、铁、锌等元素可能被固定'],
      en: ['soil pH {v} is quite acidic — adjust it before heavy fertilization', 'soil pH {v} is slightly acidic; a little lime would help', 'soil pH {v} is right in the ideal 5.5–6.5 range', 'soil pH {v} is high; phosphorus, iron and zinc may be locked up'],
      sw: ['pH ya udongo {v} ni kisiki sana — rekebisha kabla ya mbolea nyingi', 'pH ya udongo {v} ni kisiki kidogo; chokaa kidogo itasaidia', 'pH ya udongo {v} iko katika kipengele bora cha 5.5–6.5', 'pH ya udongo {v} ni juu; fosforasi, chuma na zinki zinaweza kufungwa']
    };
    const altMsgs = {
      zh: ['海拔 {v}m 属于高海拔，风味潜力大但生长偏慢', '海拔 {v}m 很适合精品咖啡种植', '海拔 {v}m 相对偏低，建议加强遮荫和保水'],
      en: ['altitude {v}m is high — great flavor potential, slower growth', 'altitude {v}m is great for specialty coffee', 'altitude {v}m is relatively low; increase shade and mulching'],
      sw: ['mwinuko {v}m ni mrefu — uwezo mkubwa wa ladha, lakini ukuwa ni polepole', 'mwinuko {v}m ni mzuri kwa kahawa ya kipekee', 'mwinuko {v}m ni chini kidogo; ongeza kivuli na kufunika mabaki']
    };
    const tempMsgs = {
      zh: ['均温 {v}°C 偏低，注意防寒抗冻', '均温 {v}°C 偏高，注意遮荫降温和防日灼', '均温 {v}°C 正处适宜区间（15–24°C）'],
      en: ['average temp {v}°C is low — protect from cold', 'average temp {v}°C is high — add shade and avoid sun scorch', 'average temp {v}°C is in the ideal 15–24°C range'],
      sw: ['joto la wastani {v}°C ni chini — linda dhidi ya baridi', 'joto la wastani {v}°C ni juu — ongeza kivuli na epuka mionzi ya jua', 'joto la wastani {v}°C iko katika kipengele bora cha 15–24°C']
    };
    const rainMsgs = {
      zh: ['月降雨 {v}mm 偏少，需要加强灌溉', '月降雨 {v}mm 偏多，注意排水和防病', '月降雨 {v}mm 属于较合适的水平'],
      en: ['monthly rainfall {v}mm is low — irrigation needed', 'monthly rainfall {v}mm is high — watch drainage and disease', 'monthly rainfall {v}mm is within a good range'],
      sw: ['mvua ya mwezi {v}mm ni chache — umwagiliaji unahitajika', 'mvua ya mwezi {v}mm ni nyingi — angalia mfumo wa maji ya kujitoa na magonjwa', 'mvua ya mwezi {v}mm iko katika kiwango safi']
    };

    // pH 数值
    let m = q.match(/(?:ph|酸碱度)[\s:=~约]*([\d.]+)/i);
    if (!m) m = q.match(/[\s:=~约]([\d.]+)\s*(?:的)?ph/i);
    if (m) {
      const ph = parseFloat(m[1]);
      if (!isNaN(ph)) {
        let idx = ph < 5.0 ? 0 : (ph < 5.5 ? 1 : (ph <= 6.5 ? 2 : 3));
        parts.push(phMsgs[lang][idx].replace('{v}', ph));
      }
    }

    // 海拔
    m = q.match(/(?:海拔|altitude)[\s:=~约]*([\d]{3,4})/i);
    if (m) {
      const a = parseFloat(m[1]);
      if (!isNaN(a)) {
        let idx = a >= 1700 ? 0 : (a >= 1400 ? 1 : 2);
        parts.push(altMsgs[lang][idx].replace('{v}', a));
      }
    }

    // 温度
    m = q.match(/(?:温度|气温|temperature)[\s:=~约]*([\d.]+)/i);
    if (!m) m = q.match(/([\d.]+)\s*度/i);
    if (m) {
      const t = parseFloat(m[1]);
      if (!isNaN(t)) {
        let idx = t < 15 ? 0 : (t > 24 ? 1 : 2);
        parts.push(tempMsgs[lang][idx].replace('{v}', t));
      }
    }

    // 降雨
    m = q.match(/(?:降雨|降水|rainfall|rain)[\s:=~约]*([\d]{3,4})\s*(?:mm)?/i);
    if (m) {
      const r = parseFloat(m[1]);
      if (!isNaN(r)) {
        let idx = r < 80 ? 0 : (r > 250 ? 1 : 2);
        parts.push(rainMsgs[lang][idx].replace('{v}', r));
      }
    }

    if (!parts.length) return '';
    const headers = { zh: '\n\n📏 **针对您提到的参数**：', en: '\n\n📏 **About the values you mentioned**: ', sw: '\n\n📏 **Kuhusu maadili uliyotaja**: ' };
    return headers[lang] + parts.join(lang === 'zh' ? '；' : '; ') + '。';
  },

  /** 把标准答案包装成更自然的对话形式 */
  _wrapAnswer(baseAnswer, question, entry, userData) {
    const intent = this._detectIntent(question);
    const prefix = this._buildAnswerPrefix(question, []);
    const tail = this._buildPersonalizedTail(userData);
    const numberTail = this._buildNumberTail(question);
    const deep = this._isDeepAsk(question) ? this._buildDeepExtra(entry, intent) : '';
    const closer = this._buildCloser(intent);
    return prefix + '\n\n' + baseAnswer + deep + numberTail + tail + '\n\n' + closer;
  },

  /** 问题意图词 → 相关主题引导（口语化问题时给贴近的引导） */
  _detectTopicHint(question) {
    const q = question.toLowerCase();
    const lang = this.lang === 'zh' ? 'zh' : (this.lang === 'sw' ? 'sw' : 'en');
    const hintMap = {
      zh: [
        { re: /(施|肥|氮|磷|钾|底肥|追肥)/, label: '土壤pH与施肥', asks: ['肯尼亚咖啡适合什么土壤pH？', '什么时候施肥最合适？', '叶片发黄要施什么肥？'] },
        { re: /(浇|水|旱|滴灌|漫灌|灌溉|排水|涝)/, label: '灌溉与排水', asks: ['咖啡树多久浇一次水？', '旱季怎么给咖啡树补水？', '园地排水不好怎么办？'] },
        { re: /(修剪|剪枝|整形|打顶|修枝)/, label: '修剪整形', asks: ['咖啡树什么时候修剪？', '怎么给咖啡树修剪？'] },
        { re: /(病|虫|锈|霉|菌|虫害|枯萎|黄叶|落叶)/, label: '病虫害防治', asks: ['咖啡叶锈病怎么防治？', '咖啡浆果病是什么？', '叶子发黄是什么原因？'] },
        { re: /(品种|sl28|sl34|鲁伊鲁|巴蒂安|风味|产区|口感)/, label: '品种与产区', asks: ['SL28和SL34有什么区别？', '肯尼亚有哪些咖啡产区？', '哪种咖啡品种产量高？'] },
        { re: /(冲|泡|煮|烘焙|烘|磨|滤杯|手冲)/, label: '烘焙冲煮', asks: ['肯尼亚咖啡怎么冲最好喝？', '浅烘和深烘怎么选？', '手冲咖啡水温多少合适？'] },
        { re: /(买|卖|价格|钱|贵|认证|选购|正品|真假|哪里)/, label: '选购与市场', asks: ['如何辨别正宗的肯尼亚咖啡豆？', '肯尼亚咖啡怎么分级？', '有机认证是什么？'] },
        { re: /(种|育苗|定植|遮荫|买苗|种植)/, label: '种植管理', asks: ['肯尼亚咖啡怎么育苗？', '咖啡树种植株距是多少？', '为什么要种遮荫树？'] },
        { re: /(收|摘|采|产量|鲜果|成熟)/, label: '收获与处理', asks: ['咖啡果什么时候成熟采摘？', '双重水洗处理法是什么？', '影响咖啡产量的因素有哪些？'] }
      ],
      en: [
        { re: /(fertil|nitrogen|potassium|phosphorus|nutrient)/, label: 'soil pH & fertilization', asks: ['What is the ideal soil pH for Kenya coffee?', 'When should I fertilize?', 'What fertilizer for yellowing leaves?'] },
        { re: /(irrigat|water|drip|drain)/, label: 'irrigation & drainage', asks: ['How often should I water coffee trees?', 'How to irrigate during the dry season?', 'What if my plot has poor drainage?'] },
        { re: /(prun|trim)/, label: 'pruning', asks: ['When should coffee trees be pruned?', 'How do I prune coffee trees?'] },
        { re: /(disease|pest|rust|berry|mold|wilt|yellow)/, label: 'pests & diseases', asks: ['How to control coffee leaf rust?', 'What is coffee berry disease?', 'Why are my coffee leaves yellowing?'] },
        { re: /(variet|sl28|sl34|region|flavor|taste|ruiru|batian)/, label: 'varieties & regions', asks: ['What is the difference between SL28 and SL34?', 'What are the main Kenya coffee regions?'] },
        { re: /(brew|roast|grind|pour|siphon|v60|espresso)/, label: 'roasting & brewing', asks: ['How should I brew Kenya coffee?', 'Light or dark roast?', 'What water temperature for pour-over?'] },
        { re: /(buy|sell|price|cost|authentic|grade|certif)/, label: 'buying & market', asks: ['How to identify authentic Kenya coffee?', 'How are Kenya coffee grades defined?'] },
        { re: /(plant|seedling|shade|spacing|nursery)/, label: 'planting', asks: ['How to raise coffee seedlings?', 'What is the right planting spacing?'] }
      ],
      sw: [
        { re: /(mbolea|nitrojeni|potasi|fosforasi|lishe)/, label: 'pH ya udongo na mbolea', asks: ['pH gani bora ya udongo kwa kahawa ya Kenya?', 'Ni lini ninapaswa kutoa mbolea?', 'Mbolea gani kwa majani mekundu?'] },
        { re: /(umwagiliaji|maji|matone|maji ya kujitoa|mvua)/, label: 'umwagiliaji na maji ya kujitoa', asks: ['Ni mara ngapi ninapaswa kuwagilia miti ya kahawa?', 'Jinsi ya kuwagilia katika msimu wa ukame?', 'Nini kama shamba langu halina maji ya kujitoa?'] },
        { re: /(kata|kukatia|mbinu)/, label: 'kukatia', asks: ['Miti ya kahawa inapaswa kukatiwa lini?', 'Ninawezaje kukata miti ya kahawa?'] },
        { re: /(gonjwa|dudu|kutu|chungwa|ukame|njano)/, label: 'wadudu na magonjwa', asks: ['Jinsi ya kudhibiti kutu ya majani ya kahawa?', 'Gonjwa la chungwa la kahawa ni nini?', 'Kwa nini majani ya kahawa yangu yanageuka njano?'] },
        { re: /(aina|sl28|sl34|mkoa|ladha|ruiru|batian)/, label: 'aina na mikoa', asks: ['Tofauti kati ya SL28 na SL34 ni nini?', 'Mikoa mikuu ya kahawa ya Kenya ni ipi?'] },
        { re: /(tengeneza|choma|saga|v60|espresso)/, label: 'kuchoma na kutengeneza', asks: ['Ninawezaje kutengeneza kahawa ya Kenya?', 'Kuchoma chepesi au kizito?', 'Joto gani la maji kwa pour-over?'] },
        { re: /(nunua|uza|bei|halisi|daraja|cheti)/, label: 'kununua na soko', asks: ['Ninawezaje kutambua kahawa halisi ya Kenya?', 'Daraja za kahawa ya Kenya zimefafanuliwa vipi?'] },
        { re: /(panda|miche|kivuli|nafasi|kituo)/, label: 'kupanda', asks: ['Ninawezaje kukuza miche ya kahawa?', 'Nafasi sahihi ya kupanda ni ipi?'] }
      ]
    };
    const hints = hintMap[lang];
    for (const h of hints) {
      if (h.re.test(q)) return h;
    }
    return null;
  },

  /** 更智能的 fallback：命中意图词给针对性引导，否则给通用引导 */
  _buildFallback(question) {
    const lang = this.lang === 'zh' ? 'zh' : (this.lang === 'sw' ? 'sw' : 'en');
    const q = String(question || '').toLowerCase();
    const hint = this._detectTopicHint(question || '');
    const userData = this._getUserData();
    const extras = {
      zh: '\n\n另外，您在「数据录入」页面已有数据，我可以结合那些参数给您更具体的建议。',
      en: '\n\nAlso, you already have data on the Data Entry page, so I can give more specific advice based on those parameters.',
      sw: '\n\nPia, tayari una data kwenye ukurasa wa Weka Data, naweza kukupa shauri maalum zaidi kulingana na vigezo hivyo.'
    };
    const extra = userData ? extras[lang] : '';

    // 求助但没说明主题 → 安抚式引导，像真人一样先了解情况
    if (!hint && /(怎么办|咋办|咋整|咋回事|怎么回事|help|what should i do|救命|急死|救救|nifanye|nisaidie|nini kifanyike)/.test(q)) {
      const helpMsgs = {
        zh: `😌 别着急，我们一步步来。\n\n先告诉我具体是什么情况吧，比如：\n• 是叶子发黄、干枯，还是落果、有虫？\n• 大概在什么季节、什么海拔？\n• 最近有没有施肥、浇水或打药？\n\n您说清楚一点，我马上帮您判断。${extra}`,
        en: `😌 Take a deep breath — let us solve this step by step.\n\nCould you describe what is happening? For example:\n• Are leaves yellowing, wilting, dropping fruit, or are there pests?\n• What season and altitude is it?\n• Have you recently fertilized, watered, or sprayed?\n\nThe more details you share, the faster I can help. ${extra}`,
        sw: `😌 Usiwe na wasiwasi — tufanye hatua kwa hatua.\n\nUnaweza kuelezea nini kinatokea? Kwa mfano:\n• Je, majani yanageuka njano, kukauka, matunda yanashuka, au kuna wadudu?\n• Ni msimu gani na mwinuko gani?\n• Je, hivi karibuni umetumia mbolea, maji au dawa?\n\nKwa maelezo zaidi, nitakusaidia haraka zaidi. ${extra}`
      };
      return helpMsgs[lang];
    }

    if (hint) {
      const asks = hint.asks.sort(() => 0.5 - Math.random()).slice(0, 3);
      const hintMsgs = {
        zh: `🤔 您问的好像和「${hint.label}」相关，不过我还需要更多细节才能给出准确回答。\n\n您可以试试这样问：\n${asks.map(s => `• ${s}`).join('\n')}${extra}`,
        en: `🤔 It seems related to ${hint.label}, but I need a bit more detail to answer accurately.\n\nTry asking:\n${asks.map(s => `• ${s}`).join('\n')}${extra}`,
        sw: `🤔 Inaonekana inahusiana na ${hint.label}, lakini nahitaji maelezo kidogo zaidi kujibu kwa usahihi.\n\nJaribu kuuliza:\n${asks.map(s => `• ${s}`).join('\n')}${extra}`
      };
      return hintMsgs[lang];
    }

    const suggestions = {
      zh: [
        '肯尼亚咖啡适合什么土壤pH？',
        '咖啡叶子发黄怎么办？',
        'SL28和SL34有什么区别？',
        '肯尼亚咖啡怎么冲最好喝？',
        '咖啡落果严重是什么原因？',
        '如何辨别正宗的肯尼亚咖啡豆？'
      ],
      en: [
        'What is the ideal soil pH for Kenya coffee?',
        'Why are my coffee leaves turning yellow?',
        'What is the difference between SL28 and SL34?',
        'How should I brew Kenya coffee?',
        'Why is my coffee tree dropping fruit?',
        'How can I identify authentic Kenya coffee?'
      ],
      sw: [
        'pH gani bora ya udongo kwa kahawa ya Kenya?',
        'Kwa nini majani ya kahawa yangu yanageuka njano?',
        'Tofauti kati ya SL28 na SL34 ni nini?',
        'Ninawezaje kutengeneza kahawa ya Kenya?',
        'Kwa nini mti wangu wa kahawa unashusha matunda?',
        'Ninawezaje kutambua kahawa halisi ya Kenya?'
      ]
    };
    const randomSuggestions = suggestions[lang].sort(() => 0.5 - Math.random()).slice(0, 3);
    const unsureMsgs = {
      zh: `🤔 这个问题我还不太确定，您可以换个方式提问，例如：\n${randomSuggestions.map(s => `• ${s}`).join('\n')}${extra}`,
      en: `🤔 I am not sure about that. Try asking something like:\n${randomSuggestions.map(s => `• ${s}`).join('\n')}${extra}`,
      sw: `🤔 Sina uhakika na hili. Jaribu kuuliza kama hii:\n${randomSuggestions.map(s => `• ${s}`).join('\n')}${extra}`
    };
    return unsureMsgs[lang];
  },

  /** 生成字符 bigram（用于中文/短文本模糊相似度） */
  _bigram(s) {
    const t = String(s).replace(/\s+/g, '').toLowerCase();
    if (t.length < 2) return t ? [t] : [];
    const out = [];
    for (let i = 0; i < t.length - 1; i++) out.push(t.slice(i, i + 2));
    return out;
  },

  /** Dice 系数相似度（0~1），容忍错别字/口语变体 */
  _similarity(a, b) {
    if (!a || !b) return 0;
    if (a === b) return 1;
    const aa = this._bigram(a), bb = this._bigram(b);
    if (!aa.length || !bb.length) return 0;
    let hit = 0;
    for (const g of aa) if (bb.indexOf(g) !== -1) hit++;
    return (2 * hit) / (aa.length + bb.length);
  },

  /** 计算条目匹配得分（精确命中 + 模糊相似度兜底） */
  _scoreEntry(entry, q) {
    let score = 0;
    let matchedKw = [];
    for (const kw of entry.keywords) {
      const kwl = kw.toLowerCase();
      const idx = q.indexOf(' ' + kwl + ' ');
      const plainHit = q.includes(kwl);
      if (idx !== -1 || plainHit) {
        score += 1;
        if (kwl.length >= 2) score += 0.3;
        if (kwl.length >= 5) score += 0.5;
        matchedKw.push(kwl);
      } else if (kwl.length >= 3) {
        // 模糊匹配：跳过纯数字/过短关键词，相似度达阈值视为命中
        if (/^\d+$/.test(kwl)) continue;
        const sim = this._similarity(kwl, q);
        if (sim >= 0.62) {
          score += 0.55 + sim * 0.25;
          matchedKw.push(kwl);
        }
      }
    }
    const isSymptomEntry = entry.keywords.some(k => ['黄', '落叶', '焦边', '枯萎', '病斑', '落果', '结果少'].includes(k));
    const lang = this.lang === 'zh' ? 'zh' : (this.lang === 'sw' ? 'sw' : 'en');
    const symptomList = this.symptomKeywords[lang] || this.symptomKeywords.zh;
    const hasSymptom = symptomList.some(sk => q.includes(sk));
    if (isSymptomEntry && hasSymptom) score += 2.5;
    return { score, matchedKw };
  },

  /** 查找匹配答案 */
  findAnswer(question) {
    const raw = question.trim();
    const isFollowUp = this._isDeepAsk(raw);

    // 上下文补全（指代消解、追问）
    const contextualQuestion = this._resolveContext(raw);
    const q = this._normalizeQuestion(contextualQuestion);

    // 精准匹配：命中即记录，多个命中时选得分最高
    let candidates = [];
    for (const entry of this.knowledgeBase) {
      const { score, matchedKw } = this._scoreEntry(entry, q);
      if (score > 0) candidates.push({ entry, score, matchedKw });
    }

    // 按得分降序，取最佳匹配
    candidates.sort((a, b) => b.score - a.score);
    let best = candidates[0];

    // 追问兜底：如果当前是追问且没命中，沿用上一轮主题（让“具体措施”“那怎么办”不会突然答不上）
    if ((!best || best.score < 1.0) && isFollowUp && this.lastMatchedEntry) {
      best = {
        entry: this.lastMatchedEntry,
        score: 1,
        matchedKw: (this.lastMatchedKeywords || []).slice(0, 3)
      };
    }

    if (best && best.score >= 1.0) {
      let baseAnswer;
      if (this.lang === 'en') {
        baseAnswer = best.entry.answerEn || best.entry.answer;
      } else if (this.lang === 'sw') {
        baseAnswer = best.entry.answerSw || best.entry.answerEn || best.entry.answer;
      } else {
        baseAnswer = best.entry.answer;
      }
      const userData = this._getUserData();
      const answer = this._wrapAnswer(baseAnswer, raw, best.entry, userData);
      this._remember('bot', answer, best.matchedKw.slice(0, 3));
      this.lastMatchedEntry = best.entry;
      this.lastMatchedKeywords = best.matchedKw;
      return answer;
    }

    // 通用回答（跟随界面语言）
    return this._buildFallback(raw);
  },

  /** 生成本地知识库主题摘要（作为 AI 的领域参考） */
  _kbSummary() {
    try {
      return this.knowledgeBase
        .map(e => (e.keywords || []).slice(0, 5).join('、'))
        .join('\n');
    } catch (e) {
      return '';
    }
  },

  /** 从对话历史构建多轮上下文 messages */
  _buildAIMessages(userText) {
    const msgs = [];
    // 最近几轮对话（用户 + 助手），保持多轮连贯
    this.history.slice(-10).forEach(h => {
      if (h.role === 'user') msgs.push({ role: 'user', content: String(h.text).slice(0, 500) });
      else if (h.role === 'bot') msgs.push({ role: 'assistant', content: String(h.text).slice(0, 1500) });
    });
    msgs.push({ role: 'user', content: String(userText).slice(0, 1000) });
    return msgs;
  },

  /** 调用 AI 代理（Netlify Function /api/ai-chat）。任何失败返回 null，走本地引擎兜底 */
  async _askAI(userText) {
    try {
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), 15000);

      let res;
      try {
        res = await fetch('/api/ai-chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: this._buildAIMessages(userText),
            lang: this.lang,
            kbSummary: this._kbSummary()
          }),
          signal: ctrl.signal
        });
      } catch (e) {
        return null; // 本地开发 / 网络错误 → 回退
      } finally {
        clearTimeout(timer);
      }

      if (!res || !res.ok) return null;
      const data = await res.json().catch(() => null);
      if (!data || data.ai !== true || typeof data.answer !== 'string' || !data.answer.trim()) {
        return null; // 未配置 Key / 上游错误 → 回退
      }
      return data.answer;
    } catch (e) {
      return null;
    }
  },

  /** 异步回答：优先调用大模型 AI（豆包），失败自动回退本地智能引擎 */
  async ask(question) {
    try {
      this._remember('user', question, []);
      await new Promise(r => setTimeout(r, 300 + Math.random() * 400));

      // 1) 优先 AI 自主回答
      const aiAnswer = await this._askAI(question);
      if (aiAnswer) {
        this._remember('bot', aiAnswer, []);
        this.lastMatchedEntry = null;
        this.lastMatchedKeywords = [];
        return aiAnswer;
      }

      // 2) 回退本地智能引擎（未配置 Key / 网络不可用 / 部署未含 Function）
      await new Promise(r => setTimeout(r, 300 + Math.random() * 500));
      return this.findAnswer(question);
    } catch (err) {
      console.error('[CoffeeChatBot] ask error:', err);
      const msg = err && err.message ? err.message : String(err);
      if (this.lang === 'sw') {
        return `⚠️ Kuna hitilafu: ${msg}. Tafadhali burudisha ukurasa au angalia console ya kivinjari.`;
      }
      return this.lang === 'zh'
        ? `⚠️ 回答时出错了：${msg}。请刷新页面再试，或检查浏览器控制台日志。`
        : `⚠️ Something went wrong: ${msg}. Please refresh the page or check the browser console.`;
    }
  }
};
