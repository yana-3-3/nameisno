// ============================================
// 메인 엔트리 — 모든 모듈을 연결
// ============================================

import { signUp, logIn, logOut, onAuth, authErrorMsg } from "./auth.js";
import { player } from "./player.js";
import { LOCATIONS, ITEMS } from "./world.js";
import {
  renderHUD,
  renderTilemap,
  renderWorldPanel,
  renderInventory,
  renderChatMessage,
  clearChat,
  toast,
  openShop,
  closeShop,
  renderShopContent,
  setShopMode,
} from "./ui.js";
import { subscribeChat, sendChat, setupPresence } from "./chat.js";

// ============================================
// 1) 로그인/회원가입 화면 로직
// ============================================

const authScreen = document.getElementById("auth-screen");
const gameScreen = document.getElementById("game-screen");

// 탭 전환
document.querySelectorAll(".tab").forEach((tab) => {
  tab.addEventListener("click", () => {
    const which = tab.dataset.tab;
    document.querySelectorAll(".tab").forEach((t) => t.classList.toggle("active", t === tab));
    document.querySelectorAll(".auth-form").forEach((f) => {
      f.classList.toggle("active", f.id === `${which}-form`);
    });
  });
});

// 로그인
document.getElementById("login-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const errEl = document.getElementById("login-error");
  errEl.textContent = "";
  try {
    await logIn(
      document.getElementById("login-email").value,
      document.getElementById("login-password").value
    );
  } catch (err) {
    errEl.textContent = authErrorMsg(err);
  }
});

// 회원가입
document.getElementById("signup-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const errEl = document.getElementById("signup-error");
  errEl.textContent = "";
  try {
    await signUp(
      document.getElementById("signup-email").value,
      document.getElementById("signup-password").value,
      document.getElementById("signup-nickname").value.trim()
    );
  } catch (err) {
    errEl.textContent = authErrorMsg(err);
  }
});

// 로그아웃
document.getElementById("btn-logout").addEventListener("click", () => logOut());

// ============================================
// 2) 인증 상태 변화 감지 → 화면 전환
// ============================================

let chatUnsub = null;
let presenceSetup = false;

onAuth((user) => {
  if (user) {
    // 로그인 상태
    authScreen.classList.add("hidden");
    gameScreen.classList.remove("hidden");

    player.startSync(user.uid);

    // 채팅 구독 시작 (중복 방지)
    if (chatUnsub) chatUnsub();
    clearChat();
    chatUnsub = subscribeChat((msg) => {
      renderChatMessage({
        nickname: msg.nickname,
        text: msg.text,
        ts: msg.ts,
      });
    });

    // 접속 상태 등록 (한 번만)
    if (!presenceSetup && user.displayName) {
      setupPresence(user.uid, user.displayName);
      presenceSetup = true;
    }
  } else {
    // 로그아웃 상태
    authScreen.classList.remove("hidden");
    gameScreen.classList.add("hidden");
    player.stopSync();
    if (chatUnsub) { chatUnsub(); chatUnsub = null; }
    clearChat();
  }
});

// ============================================
// 3) 플레이어 데이터 변화 → UI 갱신
// ============================================

player.subscribe((data) => {
  if (!data) return;
  renderHUD(data);
  renderInventory(data.inventory);
  renderTilemap(data.location);
  renderWorldPanel(data.location, onNavigate, onAction);
});

// ============================================
// 4) 장소 이동 / 액션 핸들러
// ============================================

async function onNavigate(locId) {
  await player.setLocation(locId);
  toast(`${LOCATIONS[locId].name}(으)로 이동했어요`);
}

/**
 * 액션 처리 — 각 장소에서 할 수 있는 활동.
 * 새 액션을 추가하려면 world.js 의 LOCATIONS 에 넣고 여기에 case 추가.
 */
async function onAction(actionId) {
  switch (actionId) {
    case "rest": {
      await player.changeHealth(+20);
      await player.changeHunger(-5);
      toast("푹 쉬었어요. 체력이 회복됐어요 💤");
      break;
    }

    case "farm_gather": {
      // 70% 확률로 허브 획득
      if (Math.random() < 0.7) {
        await player.addItem("herb", ITEMS.herb.name, 1);
        await player.changeHunger(-3);
        toast("야생 허브를 찾았어요! 🌿");
      } else {
        await player.changeHunger(-3);
        toast("흠… 오늘은 허탕이네요.");
      }
      break;
    }

    case "fish": {
      // 50% 확률로 물고기
      if (Math.random() < 0.5) {
        await player.addItem("fish", ITEMS.fish.name, 1);
        await player.changeHunger(-5);
        toast("물고기를 낚았어요! 🎣");
      } else {
        await player.changeHunger(-5);
        toast("미끼만 뺏겼어요…");
      }
      break;
    }

    case "work": {
      const pay = 50;
      await player.addMoney(pay);
      await player.changeHunger(-10);
      toast(`아르바이트로 ${pay}G 를 벌었어요`);
      break;
    }

    case "open_shop": {
      openShop(player.data, handleBuy, handleSell);
      break;
    }

    default:
      toast("아직 준비 중인 기능이에요");
  }
}

// ============================================
// 4b) 상점 시스템
// ============================================

async function handleBuy(itemId) {
  const item = ITEMS[itemId];
  if (!item || !player.data) return;
  const money = player.data.stats.money || 0;
  if (money < item.buy) {
    toast("돈이 부족해요!");
    return;
  }
  await player.addMoney(-item.buy);
  await player.addItem(item.id, item.name, 1);
  toast(`${item.name}을(를) 구매했어요!`);
}

async function handleSell(itemId) {
  const item = ITEMS[itemId];
  if (!item || !player.data) return;
  const success = await player.removeItem(itemId, 1);
  if (!success) {
    toast("아이템이 부족해요!");
    return;
  }
  await player.addMoney(item.sell);
  toast(`${item.name}을(를) ${item.sell}G에 팔았어요`);
}

// 상점 모달 이벤트
document.getElementById("shop-close").addEventListener("click", closeShop);
document.getElementById("shop-modal").addEventListener("click", (e) => {
  if (e.target.id === "shop-modal") closeShop();
});
document.querySelectorAll(".shop-mode-tab").forEach(tab => {
  tab.addEventListener("click", () => {
    setShopMode(tab.dataset.mode);
    if (player.data) renderShopContent(player.data);
  });
});

// 상점 데이터가 바뀔 때마다 자동 갱신 (돈/인벤토리 변화 반영)
player.subscribe((data) => {
  if (!data) return;
  const modal = document.getElementById("shop-modal");
  if (!modal.classList.contains("hidden")) {
    renderShopContent(data);
  }
});

// ============================================
// 5) 사이드바 탭 전환 (인벤토리 ↔ 채팅)
// ============================================

document.querySelectorAll(".side-tab").forEach((tab) => {
  tab.addEventListener("click", () => {
    const which = tab.dataset.side;
    document.querySelectorAll(".side-tab").forEach((t) => t.classList.toggle("active", t === tab));
    document.querySelectorAll(".side-panel").forEach((p) => {
      p.classList.toggle("active", p.id === `panel-${which}`);
    });
  });
});

// ============================================
// 6) 채팅 전송
// ============================================

document.getElementById("chat-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const input = document.getElementById("chat-input");
  const text = input.value.trim();
  if (!text || !player.data) return;
  input.value = "";
  try {
    await sendChat(player.data.uid, player.data.nickname, text);
  } catch (err) {
    toast("메시지 전송 실패");
    console.error(err);
  }
});
