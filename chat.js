// ============================================
// 실시간 채팅 (Firebase Realtime Database)
// ============================================
// Firestore 보다 Realtime DB가 채팅처럼 "순간순간 흐르는" 데이터에 더 적합하고 저렴함.
// 구조: /chat/global/{messageId} = { uid, nickname, text, ts }

import {
  ref,
  push,
  onChildAdded,
  query,
  limitToLast,
  serverTimestamp,
  onDisconnect,
  set,
  onValue,
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

import { rtdb } from "./firebase-config.js";

const CHAT_PATH = "chat/global";
const PRESENCE_PATH = "presence";

/**
 * 채팅방에 새 메시지가 들어올 때마다 callback 호출.
 * 최근 50개만 가져와서 넘치지 않게.
 */
export function subscribeChat(onMessage) {
  const chatRef = query(ref(rtdb, CHAT_PATH), limitToLast(50));
  return onChildAdded(chatRef, (snap) => {
    const msg = snap.val();
    if (msg) onMessage(msg);
  });
}

export async function sendChat(uid, nickname, text) {
  const trimmed = text.trim();
  if (!trimmed) return;
  await push(ref(rtdb, CHAT_PATH), {
    uid,
    nickname,
    text: trimmed.slice(0, 200),
    ts: serverTimestamp(),
  });
}

/**
 * 접속 상태 표시 — 유저가 창을 닫으면 자동으로 offline 으로 바뀜
 */
export function setupPresence(uid, nickname) {
  const myPresenceRef = ref(rtdb, `${PRESENCE_PATH}/${uid}`);
  const connectedRef = ref(rtdb, ".info/connected");

  onValue(connectedRef, (snap) => {
    if (snap.val() === true) {
      // 연결이 끊기면 자동 정리
      onDisconnect(myPresenceRef).remove();
      set(myPresenceRef, { nickname, online: true, ts: serverTimestamp() });
    }
  });
}

/**
 * 접속 중인 유저 수 구독
 */
export function subscribeOnlineCount(callback) {
  return onValue(ref(rtdb, PRESENCE_PATH), (snap) => {
    const val = snap.val() || {};
    callback(Object.keys(val).length);
  });
}
