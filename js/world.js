// ============================================
// 월드 정의 — 장소, 아이콘, 아이템, 상점
// ============================================

export const LOCATIONS = {
  square: {
    id: "square",
    name: "마을 광장",
    desc: "사람들이 오가는 작은 광장이에요. 어디로 가볼까요?",
    pos: { x: 200, y: 120 },
    connects: ["farm", "pond", "shop", "home", "cafe"],
    actions: [],
  },
  home: {
    id: "home",
    name: "우리 집",
    desc: "아늑한 내 방. 쉬면 체력이 회복돼요.",
    pos: { x: 60, y: 60 },
    connects: ["square"],
    actions: [
      { id: "rest", label: "잠시 쉬기", desc: "체력 +20, 배고픔 -5" },
    ],
  },
  farm: {
    id: "farm",
    name: "작은 밭",
    desc: "씨앗을 심고 작물을 수확할 수 있어요.",
    pos: { x: 340, y: 60 },
    connects: ["square"],
    actions: [
      { id: "farm_gather", label: "채집하기", desc: "야생 허브 획득" },
    ],
  },
  pond: {
    id: "pond",
    name: "잔잔한 연못",
    desc: "물고기가 노닐고 있어요. 낚싯대를 던져볼까요?",
    pos: { x: 60, y: 180 },
    connects: ["square"],
    actions: [
      { id: "fish", label: "낚시하기", desc: "물고기 획득 (확률)" },
    ],
  },
  cafe: {
    id: "cafe",
    name: "마을 카페",
    desc: "아르바이트로 돈을 벌 수 있는 곳.",
    pos: { x: 340, y: 180 },
    connects: ["square"],
    actions: [
      { id: "work", label: "아르바이트", desc: "50G 획득, 배고픔 -10" },
    ],
  },
  shop: {
    id: "shop",
    name: "잡화 상점",
    desc: "없는 게 없는 마을 유일의 상점이에요.",
    pos: { x: 200, y: 200 },
    connects: ["square"],
    actions: [
      { id: "open_shop", label: "상점 열기", desc: "물건 사고팔기" },
    ],
  },
};

export const LOCATION_ICONS = {
  home: `<path d="M6 14 L16 5 L26 14 L26 26 L20 26 L20 19 L12 19 L12 26 L6 26 Z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>`,
  farm: `<path d="M5 24 Q8 14 16 14 Q24 14 27 24" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M16 14 L16 6 M12 10 L20 10" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>`,
  pond: `<ellipse cx="16" cy="20" rx="10" ry="5" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M11 18 Q13 16 15 18 M17 20 Q19 18 21 20" fill="none" stroke="currentColor" stroke-width="1.3"/>`,
  cafe: `<path d="M7 12 L7 22 Q7 25 10 25 L18 25 Q21 25 21 22 L21 12 Z" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M21 15 L24 15 Q26 15 26 17 Q26 19 24 19 L21 19" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M11 7 Q12 10 11 11 M15 7 Q16 10 15 11" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" fill="none"/>`,
  shop: `<path d="M6 12 L8 7 L24 7 L26 12 Z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M7 12 L7 25 L25 25 L25 12" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M13 25 L13 17 L19 17 L19 25" fill="none" stroke="currentColor" stroke-width="1.5"/>`,
  square: `<circle cx="16" cy="16" r="9" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="16" cy="16" r="2" fill="currentColor"/>`,
};

// ============================================
// 아이템 카테고리
// ============================================
export const CATEGORIES = {
  food:     { name: "식료품",     color: "#d4a84b" },
  seed:     { name: "씨앗",      color: "#6b8f5a" },
  tool:     { name: "도구",      color: "#8b6b3d" },
  bait:     { name: "낚시 미끼",  color: "#5b9ec4" },
  dish:     { name: "요리",      color: "#c9604a" },
  interior: { name: "가구",      color: "#a67c52" },
  gift:     { name: "선물",      color: "#d98a8a" },
  supply:   { name: "소모품",    color: "#8fb3c7" },
  rare:     { name: "희귀",      color: "#b480d4" },
  material: { name: "재료",      color: "#6aa348" },
};

// ============================================
// 전체 아이템 정의 (75종+)
// ============================================
// icon : SVG 32x32 viewBox 안에서의 path
// buy  : 상점에서 사는 가격 (0이면 구매 불가, 드롭 전용)
// sell : 상점에 파는 가격
// cat  : 카테고리 키
// ============================================

// --- 아이콘 단축 함수 ---
const ic = {
  circle: (c, cx=16, cy=16, r=8) => `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${c}" stroke-width="1.8"/>`,
  box: (c) => `<rect x="6" y="8" width="20" height="16" rx="3" fill="none" stroke="${c}" stroke-width="1.8"/>`,
  leaf: (c) => `<path d="M16 26 L16 12 M16 16 Q10 12 8 16 Q12 18 16 16 M16 20 Q22 16 24 20 Q20 22 16 20" fill="none" stroke="${c}" stroke-width="1.5" stroke-linecap="round"/>`,
  seed: (c) => `<ellipse cx="16" cy="18" rx="5" ry="7" fill="none" stroke="${c}" stroke-width="1.8"/><path d="M16 11 Q18 8 20 9" fill="none" stroke="${c}" stroke-width="1.2" stroke-linecap="round"/>`,
  bottle: (c) => `<path d="M13 10 L13 8 L19 8 L19 10 L20 14 L20 24 Q20 26 18 26 L14 26 Q12 26 12 24 L12 14 Z" fill="none" stroke="${c}" stroke-width="1.5"/>`,
  fish: (c) => `<path d="M4 16 Q10 8 20 16 Q10 24 4 16 Z M20 16 L27 11 L27 21 Z" fill="none" stroke="${c}" stroke-width="1.8" stroke-linejoin="round"/><circle cx="10" cy="15" r="1" fill="${c}"/>`,
  pot: (c) => `<path d="M8 14 L8 22 Q8 26 12 26 L20 26 Q24 26 24 22 L24 14 Z" fill="none" stroke="${c}" stroke-width="1.5"/><path d="M6 14 L26 14" stroke="${c}" stroke-width="1.8" stroke-linecap="round"/><path d="M14 10 Q16 7 18 10" fill="none" stroke="${c}" stroke-width="1.2"/>`,
  star: (c) => `<polygon points="16,4 19,13 28,13 21,19 23,28 16,23 9,28 11,19 4,13 13,13" fill="none" stroke="${c}" stroke-width="1.5" stroke-linejoin="round"/>`,
  heart: (c) => `<path d="M16 26 Q6 18 6 12 Q6 6 12 6 Q16 6 16 10 Q16 6 20 6 Q26 6 26 12 Q26 18 16 26 Z" fill="none" stroke="${c}" stroke-width="1.5"/>`,
  tool: (c) => `<path d="M10 22 L22 10 M22 10 L18 10 M22 10 L22 14" fill="none" stroke="${c}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`,
  rod: (c) => `<path d="M8 6 L8 22 Q8 26 12 26" fill="none" stroke="${c}" stroke-width="1.8" stroke-linecap="round"/><circle cx="12" cy="26" r="2" fill="none" stroke="${c}" stroke-width="1"/>`,
  bag: (c) => `<path d="M9 12 L9 26 L23 26 L23 12 Z M12 12 Q12 6 16 6 Q20 6 20 12" fill="none" stroke="${c}" stroke-width="1.5" stroke-linejoin="round"/>`,
  gem: (c) => `<polygon points="16,6 24,14 16,28 8,14" fill="none" stroke="${c}" stroke-width="1.8" stroke-linejoin="round"/>`,
  plate: (c) => `<ellipse cx="16" cy="20" rx="10" ry="5" fill="none" stroke="${c}" stroke-width="1.8"/><ellipse cx="16" cy="18" rx="7" ry="3" fill="none" stroke="${c}" stroke-width="1"/>`,
  cup: (c) => `<path d="M9 10 L9 22 Q9 26 13 26 L19 26 Q23 26 23 22 L23 10 Z" fill="none" stroke="${c}" stroke-width="1.5"/><path d="M23 14 L26 14 Q28 14 28 17 Q28 20 26 20 L23 20" fill="none" stroke="${c}" stroke-width="1.5"/>`,
  furniture: (c) => `<rect x="6" y="14" width="20" height="12" rx="2" fill="none" stroke="${c}" stroke-width="1.5"/><path d="M6 14 L16 6 L26 14" fill="none" stroke="${c}" stroke-width="1.5" stroke-linejoin="round"/>`,
};

export const ITEMS = {
  // ========== 식료품 (12종) ==========
  herb:       { id:"herb",       name:"야생 허브",  cat:"food",  buy:0,    sell:15,  icon: ic.leaf("#6b8f5a"),   hunger:5,  desc:"채집으로 얻는 기본 재료" },
  bread:      { id:"bread",      name:"빵",         cat:"food",  buy:30,   sell:12,  icon: `<path d="M6 18 Q6 10 16 10 Q26 10 26 18 L26 22 Q26 24 24 24 L8 24 Q6 24 6 22 Z" fill="none" stroke="#d4a84b" stroke-width="1.8"/>`, hunger:15, desc:"간단하지만 든든한 한 끼" },
  milk:       { id:"milk",       name:"우유",       cat:"food",  buy:25,   sell:10,  icon: ic.bottle("#f0f0f0"), hunger:10, desc:"신선한 우유" },
  cheese:     { id:"cheese",     name:"치즈",       cat:"food",  buy:45,   sell:20,  icon: `<path d="M4 20 L16 8 L28 20 Z" fill="none" stroke="#d4a84b" stroke-width="1.8"/><circle cx="12" cy="17" r="1.5" fill="#d4a84b"/><circle cx="18" cy="18" r="1" fill="#d4a84b"/>`, hunger:12, desc:"고소한 치즈 한 조각" },
  egg:        { id:"egg",        name:"달걀",       cat:"food",  buy:20,   sell:8,   icon: `<ellipse cx="16" cy="17" rx="7" ry="9" fill="none" stroke="#e8c88a" stroke-width="1.8"/>`, hunger:8, desc:"요리의 기본 재료" },
  rice:       { id:"rice",       name:"쌀",         cat:"food",  buy:35,   sell:15,  icon: ic.bag("#e8e0c0"),    hunger:0,  desc:"한 봉지의 쌀" },
  butter:     { id:"butter",     name:"버터",       cat:"food",  buy:40,   sell:18,  icon: ic.box("#e8c860"),    hunger:5,  desc:"고소한 버터" },
  honey:      { id:"honey",      name:"꿀",         cat:"food",  buy:60,   sell:28,  icon: ic.bottle("#d4a84b"), hunger:10, desc:"달콤한 천연 꿀" },
  jam:        { id:"jam",        name:"잼",         cat:"food",  buy:50,   sell:22,  icon: ic.bottle("#c9604a"), hunger:8,  desc:"딸기잼 한 병" },
  salt:       { id:"salt",       name:"소금",       cat:"food",  buy:15,   sell:5,   icon: ic.bottle("#ccc"),    hunger:0,  desc:"요리에 필수" },
  sugar:      { id:"sugar",      name:"설탕",       cat:"food",  buy:18,   sell:6,   icon: ic.bottle("#f0e0c0"), hunger:0,  desc:"달콤한 설탕" },
  flour:      { id:"flour",      name:"밀가루",     cat:"food",  buy:25,   sell:10,  icon: ic.bag("#f5f0e0"),    hunger:0,  desc:"빵과 요리의 기본" },
  olive_oil:  { id:"olive_oil",  name:"올리브유",   cat:"food",  buy:55,   sell:25,  icon: ic.bottle("#6b8f5a"), hunger:0,  desc:"고급 요리에 쓰이는 기름" },

  // ========== 씨앗 (10종) ==========
  seed_tomato:    { id:"seed_tomato",    name:"토마토 씨앗",   cat:"seed", buy:30,  sell:5,  icon: ic.seed("#c9604a"), desc:"심으면 토마토가 열려요" },
  seed_carrot:    { id:"seed_carrot",    name:"당근 씨앗",     cat:"seed", buy:25,  sell:4,  icon: ic.seed("#e88040"), desc:"주황빛 당근의 씨앗" },
  seed_potato:    { id:"seed_potato",    name:"감자 씨앗",     cat:"seed", buy:20,  sell:3,  icon: ic.seed("#c9a66a"), desc:"땅 속에서 자라는 감자" },
  seed_strawberry:{ id:"seed_strawberry",name:"딸기 씨앗",     cat:"seed", buy:50,  sell:8,  icon: ic.seed("#d98a8a"), desc:"달콤한 딸기 씨앗" },
  seed_corn:      { id:"seed_corn",      name:"옥수수 씨앗",   cat:"seed", buy:35,  sell:6,  icon: ic.seed("#d4a84b"), desc:"쑥쑥 자라는 옥수수" },
  seed_pumpkin:   { id:"seed_pumpkin",   name:"호박 씨앗",     cat:"seed", buy:40,  sell:7,  icon: ic.seed("#e8a040"), desc:"큰 호박이 열려요" },
  seed_onion:     { id:"seed_onion",     name:"양파 씨앗",     cat:"seed", buy:22,  sell:4,  icon: ic.seed("#d4b480"), desc:"만능 재료 양파" },
  seed_herb:      { id:"seed_herb",      name:"허브 씨앗",     cat:"seed", buy:15,  sell:2,  icon: ic.seed("#6b8f5a"), desc:"직접 키우는 허브" },
  seed_sunflower: { id:"seed_sunflower", name:"해바라기 씨앗", cat:"seed", buy:45,  sell:7,  icon: ic.seed("#d4a84b"), desc:"해바라기가 피어요" },
  seed_watermelon:{ id:"seed_watermelon",name:"수박 씨앗",     cat:"seed", buy:60,  sell:10, icon: ic.seed("#5a9e38"), desc:"여름엔 역시 수박" },

  // ========== 도구 (7종) ==========
  rod_basic:    { id:"rod_basic",    name:"기본 낚싯대",   cat:"tool", buy:80,   sell:30,  icon: ic.rod("#8b6b3d"),  desc:"기본적인 낚싯대" },
  rod_good:     { id:"rod_good",     name:"고급 낚싯대",   cat:"tool", buy:250,  sell:100, icon: ic.rod("#5b9ec4"),  desc:"잡히는 확률 UP" },
  rod_best:     { id:"rod_best",     name:"최고급 낚싯대", cat:"tool", buy:600,  sell:250, icon: ic.rod("#d4a84b"),  desc:"전설의 물고기도?" },
  hoe:          { id:"hoe",          name:"호미",          cat:"tool", buy:60,   sell:20,  icon: ic.tool("#8b6b3d"), desc:"밭을 일구는 호미" },
  watering_can: { id:"watering_can", name:"물뿌리개",      cat:"tool", buy:50,   sell:18,  icon: ic.bottle("#5b9ec4"), desc:"작물에 물주기" },
  axe:          { id:"axe",          name:"도끼",          cat:"tool", buy:90,   sell:35,  icon: ic.tool("#a08060"), desc:"나무를 벨 수 있어요" },
  knife:        { id:"knife",        name:"요리칼",        cat:"tool", buy:70,   sell:25,  icon: ic.tool("#c0c0c0"), desc:"요리 효율 UP" },

  // ========== 낚시 미끼 (4종) ==========
  bait_worm:    { id:"bait_worm",    name:"지렁이",    cat:"bait", buy:10,  sell:2,  icon: `<path d="M10 20 Q12 14 16 16 Q20 18 18 24" fill="none" stroke="#a08060" stroke-width="2" stroke-linecap="round"/>`, desc:"기본 미끼" },
  bait_dough:   { id:"bait_dough",   name:"떡밥",      cat:"bait", buy:25,  sell:5,  icon: ic.circle("#e8c88a"), desc:"잉어가 좋아해요" },
  bait_lure:    { id:"bait_lure",    name:"루어",      cat:"bait", buy:50,  sell:15, icon: `<path d="M10 12 L22 18 L10 24 Z" fill="none" stroke="#c9604a" stroke-width="1.8"/><circle cx="12" cy="18" r="1.5" fill="#c9604a"/>`, desc:"큰 물고기용" },
  bait_shrimp:  { id:"bait_shrimp",  name:"새우미끼",  cat:"bait", buy:40,  sell:12, icon: `<path d="M20 10 Q26 14 22 20 Q18 26 12 24 Q8 22 10 18" fill="none" stroke="#d98a8a" stroke-width="1.8" stroke-linecap="round"/>`, desc:"희귀 물고기 확률 UP" },

  // ========== 요리 완성품 (12종) ==========
  dish_grilled_fish: { id:"dish_grilled_fish", name:"생선구이",       cat:"dish", buy:120,  sell:55,  icon: ic.plate("#c9604a"), hunger:35, desc:"고소한 생선구이" },
  dish_veg_soup:     { id:"dish_veg_soup",     name:"야채수프",       cat:"dish", buy:90,   sell:40,  icon: ic.pot("#6b8f5a"),   hunger:30, desc:"따뜻한 야채수프" },
  dish_pasta:        { id:"dish_pasta",        name:"토마토파스타",   cat:"dish", buy:150,  sell:70,  icon: ic.plate("#c9604a"), hunger:40, desc:"새콤달콤 파스타" },
  dish_straw_jam:    { id:"dish_straw_jam",    name:"딸기잼",         cat:"dish", buy:80,   sell:35,  icon: ic.bottle("#d98a8a"),hunger:10, desc:"직접 만든 딸기잼" },
  dish_pumpkin_pie:  { id:"dish_pumpkin_pie",  name:"호박파이",       cat:"dish", buy:130,  sell:60,  icon: ic.plate("#e8a040"), hunger:35, desc:"달콤한 호박파이" },
  dish_curry:        { id:"dish_curry",        name:"카레라이스",     cat:"dish", buy:140,  sell:65,  icon: ic.pot("#d4a84b"),   hunger:45, desc:"든든한 카레라이스" },
  dish_sandwich:     { id:"dish_sandwich",     name:"샌드위치",       cat:"dish", buy:70,   sell:30,  icon: `<path d="M6 12 L26 12 L22 24 L10 24 Z" fill="none" stroke="#d4a84b" stroke-width="1.5"/><line x1="10" y1="16" x2="22" y2="16" stroke="#6b8f5a" stroke-width="1.5"/><line x1="10" y1="20" x2="22" y2="20" stroke="#c9604a" stroke-width="1.5"/>`, hunger:20, desc:"간단한 한 끼" },
  dish_salad:        { id:"dish_salad",        name:"샐러드",         cat:"dish", buy:65,   sell:28,  icon: ic.plate("#6b8f5a"), hunger:15, desc:"신선한 샐러드" },
  dish_omelette:     { id:"dish_omelette",     name:"오믈렛",         cat:"dish", buy:85,   sell:38,  icon: ic.plate("#e8c860"), hunger:25, desc:"푹신한 오믈렛" },
  dish_stew:         { id:"dish_stew",         name:"해물스튜",       cat:"dish", buy:180,  sell:85,  icon: ic.pot("#5b9ec4"),   hunger:50, desc:"푸짐한 해물스튜" },
  dish_honey_bread:  { id:"dish_honey_bread",  name:"꿀바른빵",       cat:"dish", buy:60,   sell:25,  icon: `<path d="M6 18 Q6 10 16 10 Q26 10 26 18 L26 22 Q26 24 24 24 L8 24 Q6 24 6 22 Z" fill="none" stroke="#d4a84b" stroke-width="1.8"/><path d="M10 14 Q16 11 22 14" fill="none" stroke="#d4a84b" stroke-width="1" opacity="0.5"/>`, hunger:20, desc:"꿀이 듬뿍" },
  dish_juice:        { id:"dish_juice",        name:"과일주스",       cat:"dish", buy:50,   sell:20,  icon: ic.cup("#e8a040"),   hunger:12, desc:"상큼한 과일주스" },

  // ========== 가구/인테리어 (8종) ==========
  furn_pot:     { id:"furn_pot",     name:"화분",    cat:"interior", buy:80,   sell:30,  icon: `<path d="M10 14 L10 24 L22 24 L22 14 Z" fill="none" stroke="#a67c52" stroke-width="1.5"/><path d="M16 14 L16 6 M12 10 L20 10" fill="none" stroke="#6b8f5a" stroke-width="1.5" stroke-linecap="round"/>`, desc:"창가에 놓으면 예뻐요" },
  furn_rug:     { id:"furn_rug",     name:"러그",    cat:"interior", buy:120,  sell:45,  icon: `<rect x="6" y="12" width="20" height="14" rx="2" fill="none" stroke="#c9604a" stroke-width="1.5"/><path d="M10 16 L22 16 M10 20 L22 20" stroke="#c9604a" stroke-width="0.8" opacity="0.5"/>`, desc:"포근한 바닥 장식" },
  furn_lamp:    { id:"furn_lamp",    name:"조명",    cat:"interior", buy:150,  sell:55,  icon: `<path d="M12 8 L20 8 L22 18 L10 18 Z" fill="none" stroke="#d4a84b" stroke-width="1.5"/><line x1="16" y1="18" x2="16" y2="24" stroke="#8b6b3d" stroke-width="1.5"/><line x1="12" y1="24" x2="20" y2="24" stroke="#8b6b3d" stroke-width="1.5"/>`, desc:"따뜻한 불빛" },
  furn_curtain: { id:"furn_curtain", name:"커튼",    cat:"interior", buy:100,  sell:38,  icon: `<path d="M8 6 L8 26 Q12 22 16 26 Q20 22 24 26 L24 6 Z" fill="none" stroke="#8fb3c7" stroke-width="1.5"/>`, desc:"바람에 살랑살랑" },
  furn_chair:   { id:"furn_chair",   name:"의자",    cat:"interior", buy:90,   sell:35,  icon: `<path d="M10 10 L10 26 M22 10 L22 26 M10 10 L22 10 M10 18 L22 18" fill="none" stroke="#8b6b3d" stroke-width="1.8" stroke-linecap="round"/>`, desc:"앉으면 편해요" },
  furn_frame:   { id:"furn_frame",   name:"액자",    cat:"interior", buy:70,   sell:25,  icon: `<rect x="8" y="8" width="16" height="16" rx="1" fill="none" stroke="#a67c52" stroke-width="1.8"/><rect x="11" y="11" width="10" height="10" fill="none" stroke="#a67c52" stroke-width="0.8"/>`, desc:"예쁜 그림이 들어있어요" },
  furn_clock:   { id:"furn_clock",   name:"벽시계",  cat:"interior", buy:130,  sell:50,  icon: `<circle cx="16" cy="16" r="10" fill="none" stroke="#8b6b3d" stroke-width="1.8"/><line x1="16" y1="16" x2="16" y2="10" stroke="#8b6b3d" stroke-width="1.5" stroke-linecap="round"/><line x1="16" y1="16" x2="20" y2="16" stroke="#8b6b3d" stroke-width="1.2" stroke-linecap="round"/>`, desc:"째깍째깍" },
  furn_cushion: { id:"furn_cushion", name:"쿠션",    cat:"interior", buy:60,   sell:22,  icon: `<ellipse cx="16" cy="18" rx="10" ry="7" fill="none" stroke="#d98a8a" stroke-width="1.8"/>`, desc:"폭신폭신" },

  // ========== 선물/특수 (7종) ==========
  gift_letter:    { id:"gift_letter",    name:"편지지",    cat:"gift", buy:20,  sell:5,   icon: `<rect x="7" y="10" width="18" height="14" rx="1" fill="none" stroke="#d98a8a" stroke-width="1.5"/><path d="M7 10 L16 18 L25 10" fill="none" stroke="#d98a8a" stroke-width="1.2"/>`, desc:"마음을 담아서" },
  gift_wrap:      { id:"gift_wrap",      name:"포장지",    cat:"gift", buy:15,  sell:3,   icon: ic.box("#d98a8a"),     desc:"예쁘게 포장할 수 있어요" },
  gift_ribbon:    { id:"gift_ribbon",    name:"리본",      cat:"gift", buy:25,  sell:8,   icon: `<path d="M16 16 L10 10 Q8 8 10 6 L16 12 L22 6 Q24 8 22 10 Z M16 16 L16 26" fill="none" stroke="#c9604a" stroke-width="1.5" stroke-linejoin="round"/>`, desc:"선물에 달면 예뻐요" },
  gift_bouquet:   { id:"gift_bouquet",   name:"꽃다발",    cat:"gift", buy:100, sell:40,  icon: ic.heart("#d98a8a"),   desc:"사랑을 담은 꽃다발" },
  gift_chocolate: { id:"gift_chocolate", name:"초콜릿",    cat:"gift", buy:60,  sell:22,  icon: ic.box("#8b6b3d"),     hunger:10, desc:"달콤한 초콜릿" },
  gift_cake:      { id:"gift_cake",      name:"케이크",    cat:"gift", buy:150, sell:60,  icon: `<path d="M8 16 L8 24 L24 24 L24 16 Z M6 16 L26 16 L26 12 Q16 8 6 12 Z" fill="none" stroke="#d98a8a" stroke-width="1.5" stroke-linejoin="round"/><line x1="16" y1="8" x2="16" y2="6" stroke="#d4a84b" stroke-width="1.5" stroke-linecap="round"/>`, hunger:25, desc:"축하할 때 딱!" },
  gift_ring:      { id:"gift_ring",      name:"반지",      cat:"gift", buy:300, sell:120, icon: `<circle cx="16" cy="16" r="8" fill="none" stroke="#d4a84b" stroke-width="2"/><circle cx="16" cy="8" r="3" fill="none" stroke="#d4a84b" stroke-width="1.5"/>`, desc:"소중한 사람에게" },

  // ========== 소모품 (5종) ==========
  bandage:     { id:"bandage",     name:"붕대",           cat:"supply", buy:30,  sell:10, icon: `<path d="M10 10 L22 22 M14 8 L24 18 M8 14 L18 24" fill="none" stroke="#f0e0c0" stroke-width="2" stroke-linecap="round"/>`, health:15, desc:"체력 소회복" },
  herbal_tea:  { id:"herbal_tea",  name:"약초차",         cat:"supply", buy:60,  sell:22, icon: ic.cup("#6b8f5a"),  health:30, desc:"체력 중회복" },
  energy_drink:{ id:"energy_drink",name:"에너지드링크",   cat:"supply", buy:100, sell:40, icon: ic.bottle("#c9604a"), health:50, desc:"체력 대회복" },
  lunchbox:    { id:"lunchbox",    name:"도시락",         cat:"supply", buy:80,  sell:30, icon: ic.box("#d4a84b"),  hunger:60, desc:"배고픔 대회복" },
  tent:        { id:"tent",        name:"텐트",           cat:"supply", buy:200, sell:80, icon: `<path d="M4 26 L16 6 L28 26 Z" fill="none" stroke="#8b6b3d" stroke-width="1.8" stroke-linejoin="round"/><path d="M16 26 L16 14" stroke="#8b6b3d" stroke-width="1"/>`, health:20, hunger:10, desc:"어디서든 쉬기" },

  // ========== 낚시 물고기 (5종, 드롭 전용) ==========
  fish:         { id:"fish",         name:"붕어",        cat:"material", buy:0,  sell:40,  icon: ic.fish("#8fb3c7"),  desc:"흔한 민물고기" },
  fish_carp:    { id:"fish_carp",    name:"잉어",        cat:"material", buy:0,  sell:70,  icon: ic.fish("#a08060"),  desc:"힘이 센 잉어" },
  fish_trout:   { id:"fish_trout",   name:"송어",        cat:"material", buy:0,  sell:90,  icon: ic.fish("#d98a8a"),  desc:"맑은 물의 송어" },
  fish_eel:     { id:"fish_eel",     name:"장어",        cat:"material", buy:0,  sell:120, icon: `<path d="M6 18 Q10 10 16 16 Q22 22 26 14" fill="none" stroke="#6b5a48" stroke-width="2.5" stroke-linecap="round"/>`, desc:"미끌미끌 장어" },
  fish_gold:    { id:"fish_gold",    name:"황금 물고기", cat:"rare",     buy:0,  sell:500, icon: ic.fish("#d4a84b"),  desc:"전설의 황금빛 물고기!" },

  // ========== 채집 재료 (3종, 드롭 전용) ==========
  mushroom:     { id:"mushroom",     name:"버섯",        cat:"material", buy:0,  sell:25,  icon: `<path d="M16 26 L16 18 M10 18 Q10 10 16 10 Q22 10 22 18 Z" fill="none" stroke="#a08060" stroke-width="1.8" stroke-linejoin="round"/>`, desc:"숲에서 주운 버섯" },
  wildflower:   { id:"wildflower",   name:"들꽃",        cat:"material", buy:0,  sell:20,  icon: `<path d="M16 26 L16 16" stroke="#5a9e38" stroke-width="1.5"/><circle cx="16" cy="12" r="5" fill="none" stroke="#d98a8a" stroke-width="1.5"/><circle cx="16" cy="12" r="2" fill="#d4a84b"/>`, desc:"예쁜 들꽃" },
  wood:         { id:"wood",         name:"나뭇가지",    cat:"material", buy:0,  sell:10,  icon: `<path d="M8 24 L20 8 M14 18 L22 14" fill="none" stroke="#8b6b3d" stroke-width="2" stroke-linecap="round"/>`, desc:"주울 수 있는 나뭇가지" },

  // ========== 희귀템 (4종, 드롭 전용) ==========
  rainbow_flower: { id:"rainbow_flower", name:"무지개 꽃",   cat:"rare", buy:0, sell:300, icon: `<path d="M16 26 L16 14" stroke="#5a9e38" stroke-width="1.8"/><circle cx="12" cy="11" r="3" fill="none" stroke="#c9604a" stroke-width="1.2"/><circle cx="20" cy="11" r="3" fill="none" stroke="#5b9ec4" stroke-width="1.2"/><circle cx="16" cy="7" r="3" fill="none" stroke="#d4a84b" stroke-width="1.2"/>`, desc:"무지갯빛으로 빛나는 꽃" },
  star_piece:     { id:"star_piece",     name:"별의 조각",   cat:"rare", buy:0, sell:400, icon: ic.star("#d4a84b"), desc:"밤하늘에서 떨어진 조각" },
  ancient_coin:   { id:"ancient_coin",   name:"고대 동전",   cat:"rare", buy:0, sell:350, icon: `<circle cx="16" cy="16" r="9" fill="none" stroke="#a08060" stroke-width="2"/><text x="16" y="20" text-anchor="middle" font-size="10" font-weight="700" fill="#a08060">古</text>`, desc:"옛날 사람들이 쓰던 동전" },
  fairy_wing:     { id:"fairy_wing",     name:"요정의 날개", cat:"rare", buy:0, sell:600, icon: `<path d="M16 20 Q8 14 10 6 Q16 10 16 20 Q16 10 22 6 Q24 14 16 20 Z" fill="none" stroke="#b480d4" stroke-width="1.5"/>`, desc:"반짝반짝 빛나는 날개" },
};

// ============================================
// 상점에서 파는 아이템 목록 (buy > 0 인 것만)
// ============================================
export function getShopItems() {
  return Object.values(ITEMS).filter(i => i.buy > 0);
}

export function getShopByCategory() {
  const shop = {};
  for (const item of getShopItems()) {
    if (!shop[item.cat]) shop[item.cat] = [];
    shop[item.cat].push(item);
  }
  return shop;
}
