// ============================================
// UI 렌더링 — DOM 업데이트 담당
// ============================================

import { LOCATIONS, LOCATION_ICONS, ITEMS, CATEGORIES, getShopByCategory } from "./world.js";

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

// ============================================
// 일러스트 맵 헬퍼
// ============================================
function svgEl(tag, attrs = {}) {
  const el = document.createElementNS("http://www.w3.org/2000/svg", tag);
  for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
  return el;
}

function drawDefs(svg) {
  const defs = svgEl("defs");
  defs.innerHTML = `
    <pattern id="grass" width="12" height="12" patternUnits="userSpaceOnUse">
      <rect width="12" height="12" fill="#7db358"/>
      <circle cx="3" cy="3" r="0.6" fill="#6aa348" opacity="0.7"/>
      <circle cx="9" cy="8" r="0.5" fill="#8dc268" opacity="0.6"/>
      <circle cx="6" cy="11" r="0.4" fill="#6aa348" opacity="0.5"/>
      <circle cx="1" cy="7" r="0.3" fill="#8dc268" opacity="0.4"/>
      <circle cx="10" cy="2" r="0.5" fill="#6aa348" opacity="0.5"/>
    </pattern>
    <pattern id="water" width="20" height="8" patternUnits="userSpaceOnUse">
      <rect width="20" height="8" fill="#5b9ec4"/>
      <path d="M0 4Q5 2 10 4Q15 6 20 4" fill="none" stroke="#6bb0d6" stroke-width="0.8" opacity="0.6"/>
      <path d="M0 7Q5 5 10 7Q15 9 20 7" fill="none" stroke="#4a8db3" stroke-width="0.5" opacity="0.4"/>
    </pattern>
    <filter id="ss" x="-10%" y="-10%" width="130%" height="130%">
      <feDropShadow dx="1" dy="2" stdDeviation="2" flood-color="#3b5a20" flood-opacity="0.15"/>
    </filter>
  `;
  svg.appendChild(defs);
}

function drawBackground(svg) {
  svg.appendChild(svgEl("rect", { width:"560", height:"360", fill:"url(#grass)" }));
  svg.appendChild(svgEl("ellipse", { cx:"140", cy:"280", rx:"100", ry:"60", fill:"#6aa348", opacity:"0.25" }));
  svg.appendChild(svgEl("ellipse", { cx:"420", cy:"100", rx:"120", ry:"50", fill:"#8dc268", opacity:"0.2" }));
}

function drawPaths(svg) {
  const roads = [
    "M280,190 C240,170 180,140 100,100",
    "M280,190 C320,160 380,130 440,90",
    "M280,190 C230,220 170,250 100,280",
    "M280,190 C340,220 400,250 460,280",
    "M280,200 C280,230 280,260 280,310",
  ];
  for (const d of roads) {
    svg.appendChild(svgEl("path", { d, fill:"none", stroke:"#c4a66a", "stroke-width":"14", "stroke-linecap":"round", opacity:"0.7" }));
    svg.appendChild(svgEl("path", { d, fill:"none", stroke:"#b89858", "stroke-width":"16", "stroke-linecap":"round", opacity:"0.25" }));
    svg.appendChild(svgEl("path", { d, fill:"none", stroke:"#d4b67a", "stroke-width":"2", "stroke-dasharray":"4 8", "stroke-linecap":"round", opacity:"0.5" }));
  }
}

function drawPond(svg) {
  const g = svgEl("g");
  g.appendChild(svgEl("ellipse", { cx:"100", cy:"280", rx:"52", ry:"32", fill:"#4a8db3" }));
  g.appendChild(svgEl("ellipse", { cx:"100", cy:"280", rx:"46", ry:"28", fill:"url(#water)" }));
  g.appendChild(svgEl("ellipse", { cx:"100", cy:"280", rx:"54", ry:"34", fill:"none", stroke:"#5a8a3c", "stroke-width":"3", opacity:"0.5" }));
  g.appendChild(svgEl("circle", { cx:"85", cy:"272", r:"2", fill:"#fff", opacity:"0.5" }));
  g.appendChild(svgEl("circle", { cx:"110", cy:"277", r:"1.5", fill:"#fff", opacity:"0.3" }));
  for (const [x,h] of [[62,18],[58,14],[66,16],[140,15],[136,12]]) {
    g.appendChild(svgEl("line", { x1:x, y1:268, x2:x-2, y2:268-h, stroke:"#5a8a3c", "stroke-width":"1.5", "stroke-linecap":"round" }));
    g.appendChild(svgEl("ellipse", { cx:x-2, cy:268-h-2, rx:"2", ry:"3", fill:"#7a5c3a", opacity:"0.6" }));
  }
  svg.appendChild(g);
}

// 시드 기반 난수 (매 렌더마다 같은 나무 모양)
let _seed = 42;
function sRand() { _seed = (_seed * 16807 + 0) % 2147483647; return (_seed & 0x7fffffff) / 0x7fffffff; }

function drawTrees(svg) {
  _seed = 42;
  const spots = [
    [30,150],[50,60],[180,50],[500,50],[520,150],
    [530,220],[20,330],[180,330],[380,330],[510,320],
    [350,40],[40,220],[170,140],[400,170],[460,140],
  ];
  for (const [x,y] of spots) {
    const g = svgEl("g", { filter:"url(#ss)" });
    g.appendChild(svgEl("ellipse", { cx:x+2, cy:y+2, rx:"10", ry:"5", fill:"#3b5a20", opacity:"0.15" }));
    g.appendChild(svgEl("rect", { x:x-2, y:y-14, width:"4", height:"16", rx:"1", fill:"#8b6b3d" }));
    const c1 = sRand()>0.5 ? "#4a8a2c" : "#5a9e38";
    const c2 = sRand()>0.5 ? "#3d7a24" : "#4e8e30";
    g.appendChild(svgEl("circle", { cx:x-5, cy:y-16, r:"8", fill:c1 }));
    g.appendChild(svgEl("circle", { cx:x+5, cy:y-16, r:"8", fill:c2 }));
    g.appendChild(svgEl("circle", { cx:x, cy:y-22, r:"8", fill:c1 }));
    g.appendChild(svgEl("circle", { cx:x-2, cy:y-24, r:"3", fill:"#8dc268", opacity:"0.4" }));
    svg.appendChild(g);
  }
}

function drawBuilding(svg, x, y, type) {
  const g = svgEl("g");

  if (type === "home") {
    g.appendChild(svgEl("rect", { x:x-20, y:y-10, width:"40", height:"24", rx:"2", fill:"#e8c88a" }));
    g.appendChild(svgEl("rect", { x:x-20, y:y-10, width:"40", height:"24", rx:"2", fill:"none", stroke:"#c9a66a", "stroke-width":"1" }));
    g.appendChild(svgEl("polygon", { points:`${x-24},${y-10} ${x},${y-30} ${x+24},${y-10}`, fill:"#c9604a" }));
    g.appendChild(svgEl("polygon", { points:`${x-24},${y-10} ${x},${y-30} ${x+24},${y-10}`, fill:"none", stroke:"#a64a36", "stroke-width":"0.8" }));
    g.appendChild(svgEl("rect", { x:x-5, y:y+2, width:"10", height:"12", rx:"1", fill:"#8b6b3d" }));
    g.appendChild(svgEl("circle", { cx:x+3, cy:y+8, r:"1", fill:"#d4a84b" }));
    g.appendChild(svgEl("rect", { x:x-16, y:y-4, width:"8", height:"8", rx:"1", fill:"#a8d8ea" }));
    g.appendChild(svgEl("rect", { x:x+8, y:y-4, width:"8", height:"8", rx:"1", fill:"#a8d8ea" }));
    g.appendChild(svgEl("line", { x1:x-12,y1:y-4,x2:x-12,y2:y+4, stroke:"#c9a66a","stroke-width":"0.5" }));
    g.appendChild(svgEl("line", { x1:x-16,y1:y,x2:x-8,y2:y, stroke:"#c9a66a","stroke-width":"0.5" }));
    g.appendChild(svgEl("line", { x1:x+12,y1:y-4,x2:x+12,y2:y+4, stroke:"#c9a66a","stroke-width":"0.5" }));
    g.appendChild(svgEl("line", { x1:x+8,y1:y,x2:x+16,y2:y, stroke:"#c9a66a","stroke-width":"0.5" }));
    g.appendChild(svgEl("rect", { x:x+8, y:y-28, width:"6", height:"12", fill:"#a08060" }));
    const smoke = svgEl("circle", { cx:x+11, cy:y-32, r:"3", fill:"#ddd", opacity:"0.4" });
    smoke.innerHTML = `<animate attributeName="cy" values="${y-32};${y-42};${y-32}" dur="4s" repeatCount="indefinite"/><animate attributeName="opacity" values="0.4;0.1;0.4" dur="4s" repeatCount="indefinite"/>`;
    g.appendChild(smoke);
  }

  if (type === "cafe") {
    g.appendChild(svgEl("rect", { x:x-24, y:y-8, width:"48", height:"24", rx:"2", fill:"#f0e0c0" }));
    g.appendChild(svgEl("rect", { x:x-24, y:y-8, width:"48", height:"24", rx:"2", fill:"none", stroke:"#d4b480", "stroke-width":"1" }));
    g.appendChild(svgEl("rect", { x:x-28, y:y-14, width:"56", height:"8", rx:"2", fill:"#c9604a" }));
    for (let i=0;i<7;i++) g.appendChild(svgEl("rect", { x:x-26+i*8, y:y-14, width:"4", height:"8", fill:"#fff", opacity:"0.3" }));
    g.appendChild(svgEl("rect", { x:x-5, y:y+2, width:"10", height:"14", rx:"2", fill:"#8b6b3d" }));
    g.appendChild(svgEl("rect", { x:x-20, y:y-4, width:"12", height:"12", rx:"1", fill:"#a8d8ea" }));
    g.appendChild(svgEl("rect", { x:x+8, y:y-4, width:"12", height:"12", rx:"1", fill:"#a8d8ea" }));
    g.appendChild(svgEl("circle", { cx:x, cy:y-20, r:"6", fill:"#f0e0c0", stroke:"#8b6b3d", "stroke-width":"1" }));
    const cup = svgEl("text", { x:x, y:y-17, "text-anchor":"middle", "font-size":"8", fill:"#8b6b3d" });
    cup.textContent = "☕";
    g.appendChild(cup);
  }

  if (type === "shop") {
    g.appendChild(svgEl("rect", { x:x-22, y:y-8, width:"44", height:"26", rx:"2", fill:"#e0d0b8" }));
    g.appendChild(svgEl("rect", { x:x-22, y:y-8, width:"44", height:"26", rx:"2", fill:"none", stroke:"#c9b090", "stroke-width":"1" }));
    g.appendChild(svgEl("polygon", { points:`${x-26},${y-8} ${x},${y-26} ${x+26},${y-8}`, fill:"#4a7a3a" }));
    g.appendChild(svgEl("rect", { x:x-6, y:y+2, width:"12", height:"16", rx:"2", fill:"#8b6b3d" }));
    g.appendChild(svgEl("rect", { x:x-16, y:y-4, width:"32", height:"10", rx:"2", fill:"#d4a84b" }));
    const st = svgEl("text", { x:x, y:y+3, "text-anchor":"middle", "font-size":"6", "font-family":"Gowun Dodum,serif", fill:"#3b2e22", "font-weight":"600" });
    st.textContent = "잡화상점";
    g.appendChild(st);
  }

  if (type === "farm") {
    _seed = 100;
    g.appendChild(svgEl("rect", { x:x-36, y:y-16, width:"72", height:"40", rx:"4", fill:"#8b6b3d", opacity:"0.4" }));
    for (let i=0;i<5;i++) {
      const fy = y-12+i*8;
      g.appendChild(svgEl("line", { x1:x-30,y1:fy,x2:x+30,y2:fy, stroke:"#6b4f2a","stroke-width":"2",opacity:"0.3" }));
      for (let j=0;j<6;j++) {
        const fx = x-26+j*10;
        if (sRand()>0.3) {
          const h = 4+sRand()*6;
          g.appendChild(svgEl("line", { x1:fx,y1:fy,x2:fx,y2:fy-h, stroke:"#5a9e38","stroke-width":"1.2","stroke-linecap":"round" }));
          g.appendChild(svgEl("circle", { cx:fx, cy:fy-h-1, r:"2", fill: sRand()>0.5?"#c9604a":"#d4a84b" }));
        }
      }
    }
    for (let i=0;i<8;i++) g.appendChild(svgEl("line", { x1:x-36+i*10,y1:y-18,x2:x-36+i*10,y2:y-24, stroke:"#a08060","stroke-width":"1.5","stroke-linecap":"round" }));
    g.appendChild(svgEl("line", { x1:x-36,y1:y-20,x2:x+36,y2:y-20, stroke:"#a08060","stroke-width":"1" }));
    g.appendChild(svgEl("line", { x1:x+26,y1:y-16,x2:x+26,y2:y-36, stroke:"#a08060","stroke-width":"2" }));
    g.appendChild(svgEl("line", { x1:x+18,y1:y-28,x2:x+34,y2:y-28, stroke:"#a08060","stroke-width":"1.5" }));
    g.appendChild(svgEl("circle", { cx:x+26, cy:y-38, r:"4", fill:"#e8c88a", stroke:"#a08060","stroke-width":"1" }));
  }
  svg.appendChild(g);
}

function drawSquare(svg, x, y) {
  const g = svgEl("g");
  g.appendChild(svgEl("circle", { cx:x, cy:y, r:"34", fill:"#d4c8a8" }));
  g.appendChild(svgEl("circle", { cx:x, cy:y, r:"34", fill:"none", stroke:"#c4b898","stroke-width":"1" }));
  const stones = [[-12,-10,8,6],[4,-14,10,6],[-18,2,8,6],[2,0,10,8],[14,-6,8,6],[-8,10,10,6],[8,12,8,6]];
  for (const [dx,dy,w,h] of stones) {
    g.appendChild(svgEl("rect", { x:x+dx,y:y+dy,width:w,height:h,rx:"2", fill:"none",stroke:"#b8a880","stroke-width":"0.5",opacity:"0.6" }));
  }
  g.appendChild(svgEl("circle", { cx:x, cy:y, r:"10", fill:"#5b9ec4", opacity:"0.5" }));
  g.appendChild(svgEl("circle", { cx:x, cy:y, r:"10", fill:"none", stroke:"#a08060","stroke-width":"1.5" }));
  g.appendChild(svgEl("circle", { cx:x, cy:y, r:"3", fill:"#a08060" }));
  const d1 = svgEl("circle", { cx:x-3, cy:y-2, r:"1", fill:"#8bc4e0", opacity:"0.6" });
  d1.innerHTML = `<animate attributeName="cy" values="${y-2};${y-8};${y-2}" dur="2s" repeatCount="indefinite"/><animate attributeName="opacity" values="0.6;0;0.6" dur="2s" repeatCount="indefinite"/>`;
  g.appendChild(d1);
  const d2 = svgEl("circle", { cx:x+3, cy:y-2, r:"1", fill:"#8bc4e0", opacity:"0.4" });
  d2.innerHTML = `<animate attributeName="cy" values="${y-2};${y-10};${y-2}" dur="2.5s" repeatCount="indefinite"/><animate attributeName="opacity" values="0.4;0;0.4" dur="2.5s" repeatCount="indefinite"/>`;
  g.appendChild(d2);
  svg.appendChild(g);
}

function drawFlowers(svg) {
  _seed = 77;
  const spots = [[150,170],[160,175],[380,160],[390,155],[200,280],[220,310],[340,250],[160,110],[420,200],[450,310]];
  const colors = ["#e87070","#e8a040","#e870c0","#7090e8","#e8e040"];
  for (const [x,y] of spots) {
    const g = svgEl("g");
    const col = colors[Math.floor(sRand()*5)];
    g.appendChild(svgEl("line", { x1:x,y1:y,x2:x,y2:y-5, stroke:"#5a9e38","stroke-width":"0.8" }));
    for (let i=0;i<5;i++) {
      const a = (i*72)*Math.PI/180;
      g.appendChild(svgEl("circle", { cx:x+Math.cos(a)*2.5, cy:(y-5)+Math.sin(a)*2.5, r:"1.5", fill:col, opacity:"0.8" }));
    }
    g.appendChild(svgEl("circle", { cx:x, cy:y-5, r:"1", fill:"#f0d040" }));
    svg.appendChild(g);
  }
}

function drawMarker(svg, x, y, name, isCurrent) {
  const g = svgEl("g");
  if (isCurrent) {
    const pulse = svgEl("circle", { cx:x, cy:y-40, r:"8", fill:"#c9604a", opacity:"0.3" });
    pulse.innerHTML = `<animate attributeName="r" values="8;16;8" dur="2s" repeatCount="indefinite"/><animate attributeName="opacity" values="0.3;0;0.3" dur="2s" repeatCount="indefinite"/>`;
    g.appendChild(pulse);
    g.appendChild(svgEl("circle", { cx:x, cy:y-40, r:"8", fill:"#c9604a", stroke:"#a64a36","stroke-width":"1.5" }));
    g.appendChild(svgEl("circle", { cx:x, cy:y-40, r:"3", fill:"#fff" }));
    g.appendChild(svgEl("polygon", { points:`${x-4},${y-34} ${x},${y-26} ${x+4},${y-34}`, fill:"#c9604a" }));
  }
  const lw = Math.max(name.length * 7 + 12, 48);
  g.appendChild(svgEl("rect", { x:x-lw/2, y:y+26, width:lw, height:"16", rx:"8", fill: isCurrent?"#c9604a":"rgba(59,46,34,0.7)" }));
  const label = svgEl("text", { x:x, y:y+37, "text-anchor":"middle", "font-size":"8", "font-family":"Gowun Dodum,serif", fill:"#fff", "font-weight":"600" });
  label.textContent = name;
  g.appendChild(label);
  svg.appendChild(g);
}

/** 타일맵 렌더 — 일러스트 지도 */
export function renderTilemap(currentLocId) {
  const svg = document.getElementById("tilemap");
  svg.setAttribute("viewBox", "0 0 560 360");
  svg.innerHTML = "";

  drawDefs(svg);
  drawBackground(svg);
  drawPaths(svg);
  drawPond(svg);
  drawFlowers(svg);
  drawBuilding(svg, 100, 100, "home");
  drawBuilding(svg, 440, 90, "farm");
  drawBuilding(svg, 460, 280, "cafe");
  drawBuilding(svg, 280, 310, "shop");
  drawSquare(svg, 280, 190);
  drawTrees(svg);

  const markers = [
    { id:"home", x:100, y:100 },
    { id:"farm", x:440, y:90 },
    { id:"pond", x:100, y:280 },
    { id:"cafe", x:460, y:280 },
    { id:"shop", x:280, y:310 },
    { id:"square", x:280, y:190 },
  ];
  for (const m of markers) {
    const loc = LOCATIONS[m.id];
    if (loc) drawMarker(svg, m.x, m.y, loc.name, m.id === currentLocId);
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

  for (const action of loc.actions) {
    const card = document.createElement("button");
    card.className = "loc-card";
    card.innerHTML = `
      <svg viewBox="0 0 32 32"><circle cx="16" cy="16" r="10" fill="none" stroke="currentColor" stroke-width="2"/><path d="M12 16 L15 19 L20 13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
      <div class="loc-card-name">${action.label}</div>
      <div class="loc-card-desc">${action.desc}</div>`;
    card.addEventListener("click", () => onAction(action.id));
    container.appendChild(card);
  }

  for (const connId of loc.connects) {
    const target = LOCATIONS[connId];
    if (!target) continue;
    const card = document.createElement("button");
    card.className = "loc-card";
    card.innerHTML = `
      <svg viewBox="0 0 32 32">${LOCATION_ICONS[target.id] || ""}</svg>
      <div class="loc-card-name">${target.name}</div>
      <div class="loc-card-desc">이동하기 →</div>`;
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
      slot.innerHTML = `<svg viewBox="0 0 32 32">${def?.icon||""}</svg><span class="count">${item.count}</span>`;
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
  const time = ts ? new Date(ts).toLocaleTimeString("ko-KR", { hour:"2-digit", minute:"2-digit" }) : "";
  if (system) { el.textContent = text; }
  else { el.innerHTML = `<span class="nick">${escapeHtml(nickname)}</span><span>${escapeHtml(text)}</span><span class="time">${time}</span>`; }
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

// ============================================
// 상점 모달
// ============================================

let _shopMode = "buy";     // "buy" | "sell"
let _shopCat = null;       // 현재 선택된 카테고리
let _shopPage = 0;         // 현재 페이지
let _onBuy = null;
let _onSell = null;

const ITEMS_PER_PAGE = 6;

export function openShop(playerData, onBuy, onSell) {
  _onBuy = onBuy;
  _onSell = onSell;
  _shopMode = "buy";
  _shopCat = null;
  _shopPage = 0;
  const modal = document.getElementById("shop-modal");
  modal.classList.remove("hidden");
  renderShopContent(playerData);
}

export function closeShop() {
  document.getElementById("shop-modal").classList.add("hidden");
}

export function renderShopContent(playerData) {
  const container = document.getElementById("shop-items");
  const moneyEl = document.getElementById("shop-money");
  moneyEl.textContent = (playerData?.stats?.money || 0).toLocaleString() + " G";

  document.querySelectorAll(".shop-mode-tab").forEach(t => {
    t.classList.toggle("active", t.dataset.mode === _shopMode);
  });

  container.innerHTML = "";

  if (_shopMode === "buy") {
    renderBuyMode(container, playerData);
  } else {
    renderSellMode(container, playerData);
  }
}

function renderPagination(container, totalItems, playerData) {
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  if (totalPages <= 1) return;

  const nav = document.createElement("div");
  nav.className = "shop-pagination";

  const prev = document.createElement("button");
  prev.className = "shop-page-btn";
  prev.textContent = "←";
  prev.disabled = _shopPage === 0;
  prev.addEventListener("click", () => {
    _shopPage--;
    renderShopContent(playerData);
  });
  nav.appendChild(prev);

  for (let i = 0; i < totalPages; i++) {
    const dot = document.createElement("button");
    dot.className = "shop-page-dot" + (i === _shopPage ? " active" : "");
    dot.textContent = i + 1;
    dot.addEventListener("click", () => {
      _shopPage = i;
      renderShopContent(playerData);
    });
    nav.appendChild(dot);
  }

  const next = document.createElement("button");
  next.className = "shop-page-btn";
  next.textContent = "→";
  next.disabled = _shopPage >= totalPages - 1;
  next.addEventListener("click", () => {
    _shopPage++;
    renderShopContent(playerData);
  });
  nav.appendChild(next);

  container.appendChild(nav);
}

function renderBuyMode(container, playerData) {
  const byCategory = getShopByCategory();
  const cats = Object.keys(byCategory);

  if (!_shopCat || !byCategory[_shopCat]) { _shopCat = cats[0]; _shopPage = 0; }

  // 카테고리 탭들
  const catBar = document.createElement("div");
  catBar.className = "shop-cat-bar";
  for (const catKey of cats) {
    const cat = CATEGORIES[catKey];
    const btn = document.createElement("button");
    btn.className = "shop-cat-btn" + (catKey === _shopCat ? " active" : "");
    btn.style.setProperty("--cat-color", cat.color);
    btn.textContent = cat.name;
    btn.addEventListener("click", () => {
      _shopCat = catKey;
      _shopPage = 0;
      renderShopContent(playerData);
    });
    catBar.appendChild(btn);
  }
  container.appendChild(catBar);

  const allItems = byCategory[_shopCat] || [];
  const start = _shopPage * ITEMS_PER_PAGE;
  const pageItems = allItems.slice(start, start + ITEMS_PER_PAGE);
  const money = playerData?.stats?.money || 0;

  const list = document.createElement("div");
  list.className = "shop-list";

  for (const item of pageItems) {
    const canAfford = money >= item.buy;
    const row = document.createElement("div");
    row.className = "shop-row" + (canAfford ? "" : " cant-afford");
    row.innerHTML = `
      <div class="shop-row-icon"><svg viewBox="0 0 32 32">${item.icon}</svg></div>
      <div class="shop-row-info">
        <div class="shop-row-name">${item.name}</div>
        <div class="shop-row-desc">${item.desc}</div>
      </div>
      <div class="shop-row-price">${item.buy} G</div>
    `;
    const buyBtn = document.createElement("button");
    buyBtn.className = "shop-buy-btn";
    buyBtn.textContent = "구매";
    buyBtn.disabled = !canAfford;
    buyBtn.addEventListener("click", () => { if (_onBuy) _onBuy(item.id); });
    row.appendChild(buyBtn);
    list.appendChild(row);
  }
  container.appendChild(list);

  renderPagination(container, allItems.length, playerData);
}

function renderSellMode(container, playerData) {
  const inv = playerData?.inventory || [];

  if (inv.length === 0) {
    const list = document.createElement("div");
    list.className = "shop-list";
    list.innerHTML = `<div class="shop-empty">판매할 아이템이 없어요</div>`;
    container.appendChild(list);
    return;
  }

  const start = _shopPage * ITEMS_PER_PAGE;
  const pageItems = inv.slice(start, start + ITEMS_PER_PAGE);

  const list = document.createElement("div");
  list.className = "shop-list";

  for (const slot of pageItems) {
    const item = ITEMS[slot.id];
    if (!item) continue;
    const row = document.createElement("div");
    row.className = "shop-row";
    row.innerHTML = `
      <div class="shop-row-icon"><svg viewBox="0 0 32 32">${item.icon}</svg></div>
      <div class="shop-row-info">
        <div class="shop-row-name">${item.name} <span class="shop-row-count">× ${slot.count}</span></div>
        <div class="shop-row-desc">${item.desc}</div>
      </div>
      <div class="shop-row-price sell-price">${item.sell} G</div>
    `;
    const sellBtn = document.createElement("button");
    sellBtn.className = "shop-sell-btn";
    sellBtn.textContent = "판매";
    sellBtn.addEventListener("click", () => { if (_onSell) _onSell(item.id); });
    row.appendChild(sellBtn);
    list.appendChild(row);
  }
  container.appendChild(list);

  renderPagination(container, inv.length, playerData);
}

export function setShopMode(mode) {
  _shopMode = mode;
  _shopPage = 0;
}
