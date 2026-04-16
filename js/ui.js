// ============================================
// UI 렌더링 — DOM 업데이트 담당
// ============================================

import { LOCATIONS, LOCATION_ICONS, ITEMS } from "./world.js";

const INVENTORY_SLOTS = 16;

/** 토스트 알림 */
export function toast(message) {
  const container = document.getElementById("toast-container");
  const el = document.createElement("div");
  el.className = "toast";
  el.textContent = message;
  container.appendChild(el);
  setTimeout(() => el.remove(), 3000);
}

/** HUD (닉네임, 스탯) 업데이트 */
export function renderHUD(data) {
  document.getElementById("hud-nickname").textContent = data.nickname;
  const s = data.stats;
  document.getElementById("num-health").textContent = s.health;
  document.getElementById("num-hunger").textContent = s.hunger;
  document.getElementById("num-money").textContent = s.money.toLocaleString() + " G";
  document.getElementById("bar-health").style.width = s.health + "%";
  document.getElementById("bar-hunger").style.width = s.hunger + "%";
}

/** 타일맵 렌더 (장소들을 SVG로 배치) */
export function renderTilemap(currentLocId) {
  const svg = document.getElementById("tilemap");
  svg.innerHTML = "";

  // 배경 풀밭 질감
  const bg = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  bg.setAttribute("width", "400");
  bg.setAttribute("height", "240");
  bg.setAttribute("fill", "url(#grass)");
  svg.appendChild(bg);

  // 그라디언트/패턴 정의
  const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
  defs.innerHTML = `
    <pattern id="grass" width="20" height="20" patternUnits="userSpaceOnUse">
      <rect width="20" height="20" fill="#e8e0cc"/>
      <circle cx="5" cy="5" r="0.8" fill="#c9be9e" opacity="0.5"/>
      <circle cx="15" cy="12" r="0.6" fill="#c9be9e" opacity="0.4"/>
      <circle cx="10" cy="17" r="0.7" fill="#c9be9e" opacity="0.5"/>
    </pattern>
  `;
  svg.appendChild(defs);

  // 현재 위치에서 연결된 곳으로 길 그리기
  const current = LOCATIONS[currentLocId];
  if (current) {
    for (const conn of current.connects) {
      const target = LOCATIONS[conn];
      if (!target) continue;
      const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
      line.setAttribute("x1", current.pos.x);
      line.setAttribute("y1", current.pos.y);
      line.setAttribute("x2", target.pos.x);
      line.setAttribute("y2", target.pos.y);
      line.setAttribute("stroke", "#bfae8a");
      line.setAttribute("stroke-width", "2");
      line.setAttribute("stroke-dasharray", "4 4");
      line.setAttribute("opacity", "0.6");
      svg.appendChild(line);
    }
  }

  // 모든 장소 렌더
  for (const loc of Object.values(LOCATIONS)) {
    const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
    g.setAttribute("transform", `translate(${loc.pos.x - 16}, ${loc.pos.y - 16})`);
    const isCurrent = loc.id === currentLocId;

    // 마커 원
    const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circle.setAttribute("cx", "16");
    circle.setAttribute("cy", "16");
    circle.setAttribute("r", isCurrent ? "18" : "15");
    circle.setAttribute("fill", isCurrent ? "#c9604a" : "#fbf6ea");
    circle.setAttribute("stroke", isCurrent ? "#a64a36" : "#bfae8a");
    circle.setAttribute("stroke-width", "2");
    g.appendChild(circle);

    // 아이콘
    const icon = document.createElementNS("http://www.w3.org/2000/svg", "g");
    icon.innerHTML = LOCATION_ICONS[loc.id] || "";
    icon.setAttribute("color", isCurrent ? "#fbf6ea" : "#3b2e22");
    g.appendChild(icon);

    // 이름 라벨
    const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
    text.setAttribute("x", "16");
    text.setAttribute("y", "44");
    text.setAttribute("text-anchor", "middle");
    text.setAttribute("font-size", "10");
    text.setAttribute("font-family", "Gowun Dodum, serif");
    text.setAttribute("fill", "#3b2e22");
    text.textContent = loc.name;
    g.appendChild(text);

    svg.appendChild(g);
  }
}

/** 월드 헤더 + 이동/액션 카드 */
export function renderWorldPanel(currentLocId, onNavigate, onAction) {
  const loc = LOCATIONS[currentLocId];
  if (!loc) return;

  document.getElementById("world-title").textContent = loc.name;
  document.getElementById("world-desc").textContent = loc.desc;

  const container = document.getElementById("location-cards");
  container.innerHTML = "";

  // 현재 장소의 액션들
  for (const action of loc.actions) {
    const card = document.createElement("button");
    card.className = "loc-card";
    card.innerHTML = `
      <svg viewBox="0 0 32 32"><circle cx="16" cy="16" r="10" fill="none" stroke="currentColor" stroke-width="2"/><path d="M12 16 L15 19 L20 13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
      <div class="loc-card-name">${action.label}</div>
      <div class="loc-card-desc">${action.desc}</div>
    `;
    card.addEventListener("click", () => onAction(action.id));
    container.appendChild(card);
  }

  // 연결된 장소로 이동
  for (const connId of loc.connects) {
    const target = LOCATIONS[connId];
    if (!target) continue;
    const card = document.createElement("button");
    card.className = "loc-card";
    card.innerHTML = `
      <svg viewBox="0 0 32 32">${LOCATION_ICONS[target.id] || ""}</svg>
      <div class="loc-card-name">${target.name}</div>
      <div class="loc-card-desc">이동하기 →</div>
    `;
    card.addEventListener("click", () => onNavigate(connId));
    container.appendChild(card);
  }
}

/** 인벤토리 그리드 */
export function renderInventory(inventory) {
  const grid = document.getElementById("inventory-grid");
  grid.innerHTML = "";
  const items = inventory || [];

  for (let i = 0; i < INVENTORY_SLOTS; i++) {
    const slot = document.createElement("div");
    slot.className = "inv-slot";
    const item = items[i];
    if (!item) {
      slot.classList.add("empty");
    } else {
      const def = ITEMS[item.id];
      slot.innerHTML = `
        <svg viewBox="0 0 32 32">${def?.icon || ""}</svg>
        <span class="count">${item.count}</span>
      `;
      slot.title = `${item.name} × ${item.count}`;
      slot.addEventListener("click", () => {
        document.getElementById("inventory-hint").textContent = `${item.name} × ${item.count}개`;
      });
    }
    grid.appendChild(slot);
  }
}

/** 채팅 메시지 렌더 */
export function renderChatMessage({ nickname, text, ts, system }) {
  const log = document.getElementById("chat-log");
  const el = document.createElement("div");
  el.className = "chat-msg" + (system ? " system" : "");
  const time = ts ? new Date(ts).toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" }) : "";
  if (system) {
    el.textContent = text;
  } else {
    el.innerHTML = `<span class="nick">${escapeHtml(nickname)}</span><span>${escapeHtml(text)}</span><span class="time">${time}</span>`;
  }
  log.appendChild(el);
  log.scrollTop = log.scrollHeight;
}

export function clearChat() {
  document.getElementById("chat-log").innerHTML = "";
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}
