// ============================================
// 인증 (로그인/회원가입/로그아웃)
// ============================================

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

import {
  doc,
  setDoc,
  getDoc,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

import { auth, db } from "./firebase-config.js";

/**
 * 새 유저 생성 + Firestore 에 초기 캐릭터 데이터 저장
 */
export async function signUp(email, password, nickname) {
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(cred.user, { displayName: nickname });

  // 초기 캐릭터 상태
  const initialData = {
    uid: cred.user.uid,
    nickname,
    email,
    stats: {
      health: 100,
      hunger: 100,
      money: 500,         // 시작 자금
    },
    inventory: [],        // [{ id, name, count }]
    location: "square",   // 현재 있는 장소
    createdAt: serverTimestamp(),
    lastSeen: serverTimestamp(),
  };

  await setDoc(doc(db, "players", cred.user.uid), initialData);
  return cred.user;
}

export async function logIn(email, password) {
  const cred = await signInWithEmailAndPassword(auth, email, password);
  return cred.user;
}

export function logOut() {
  return signOut(auth);
}

export function onAuth(callback) {
  return onAuthStateChanged(auth, callback);
}

/**
 * Firestore 에서 플레이어 데이터 불러오기
 */
export async function loadPlayer(uid) {
  const snap = await getDoc(doc(db, "players", uid));
  if (!snap.exists()) throw new Error("플레이어 데이터가 없습니다");
  return snap.data();
}

/**
 * 한국어 에러 메시지 변환
 */
export function authErrorMsg(err) {
  const code = err?.code || "";
  const map = {
    "auth/invalid-email": "이메일 형식이 올바르지 않아요.",
    "auth/email-already-in-use": "이미 사용 중인 이메일이에요.",
    "auth/weak-password": "비밀번호는 6자 이상이어야 해요.",
    "auth/user-not-found": "계정을 찾을 수 없어요.",
    "auth/wrong-password": "비밀번호가 틀려요.",
    "auth/invalid-credential": "이메일 또는 비밀번호가 올바르지 않아요.",
    "auth/too-many-requests": "잠시 후 다시 시도해주세요.",
  };
  return map[code] || "문제가 발생했어요. 다시 시도해주세요.";
}
