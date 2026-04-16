// ============================================
// 월드 정의 — 장소, 아이콘, 이동 가능한 곳
// 새 장소를 추가하려면 LOCATIONS 객체에 항목만 추가하면 됨.
// ============================================

/**
 * 각 장소는 타일맵에서의 위치(x, y)와 이동 가능한 곳(connects)을 가짐.
 * icon 은 SVG path — 간단한 선화 스타일.
 */
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
      { id: "rest", label: "잠시 쉬기", desc: "체력 +20, 시간 1" },
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
    desc: "생필품과 도구를 살 수 있어요. (곧 열려요)",
    pos: { x: 200, y: 200 },
    connects: ["square"],
    actions: [],
  },
};

/**
 * 장소별 SVG 아이콘 (간단한 선화)
 */
export const LOCATION_ICONS = {
  home: `<path d="M6 14 L16 5 L26 14 L26 26 L20 26 L20 19 L12 19 L12 26 L6 26 Z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>`,
  farm: `<path d="M5 24 Q8 14 16 14 Q24 14 27 24" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M16 14 L16 6 M12 10 L20 10" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>`,
  pond: `<ellipse cx="16" cy="20" rx="10" ry="5" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M11 18 Q13 16 15 18 M17 20 Q19 18 21 20" fill="none" stroke="currentColor" stroke-width="1.3"/>`,
  cafe: `<path d="M7 12 L7 22 Q7 25 10 25 L18 25 Q21 25 21 22 L21 12 Z" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M21 15 L24 15 Q26 15 26 17 Q26 19 24 19 L21 19" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M11 7 Q12 10 11 11 M15 7 Q16 10 15 11" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" fill="none"/>`,
  shop: `<path d="M6 12 L8 7 L24 7 L26 12 Z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M7 12 L7 25 L25 25 L25 12" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M13 25 L13 17 L19 17 L19 25" fill="none" stroke="currentColor" stroke-width="1.5"/>`,
  square: `<circle cx="16" cy="16" r="9" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="16" cy="16" r="2" fill="currentColor"/>`,
};

/**
 * 아이템 정의 (이것도 나중에 아이템 DB로 분리하기 좋아요)
 */
export const ITEMS = {
  herb:   { id: "herb",   name: "야생 허브", icon: `<path d="M16 26 L16 10 M16 14 Q10 10 6 14 Q10 16 16 14 M16 18 Q22 14 26 18 Q22 20 16 18" fill="none" stroke="#6b8f5a" stroke-width="1.8" stroke-linecap="round"/>`, value: 15 },
  fish:   { id: "fish",   name: "물고기",   icon: `<path d="M4 16 Q10 8 20 16 Q10 24 4 16 Z M20 16 L27 11 L27 21 Z" fill="none" stroke="#8fb3c7" stroke-width="1.8" stroke-linejoin="round"/><circle cx="10" cy="15" r="1" fill="#3b2e22"/>`, value: 40 },
  bread:  { id: "bread",  name: "빵",       icon: `<path d="M6 14 Q6 8 16 8 Q26 8 26 14 L26 22 Q26 24 24 24 L8 24 Q6 24 6 22 Z" fill="none" stroke="#d4a84b" stroke-width="1.8" stroke-linejoin="round"/><path d="M11 14 L11 20 M16 14 L16 20 M21 14 L21 20" stroke="#d4a84b" stroke-width="1.2"/>`, value: 30 },
};
