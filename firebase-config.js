// ============================================
// Firebase 초기화
// ============================================
// 사용법:
// 1. https://console.firebase.google.com 에서 프로젝트 만들기
// 2. 웹 앱 추가 → config 객체 복사 → 아래 firebaseConfig 에 붙여넣기
// 3. Firebase 콘솔에서:
//    - Authentication → Sign-in method → 이메일/비밀번호 사용 설정
//    - Firestore Database → 만들기 (테스트 모드로 시작)
//    - Realtime Database → 만들기 (테스트 모드로 시작)
// ============================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

// ⚠️ 여기에 본인의 Firebase 프로젝트 config 를 붙여넣으세요
const firebaseConfig = {
  apiKey: "AIzaSyCoCEJqsGjh8p8fksl6DLd0JCK3NYNNMhU",
  authDomain: "nameisno.firebaseapp.com",
  databaseURL: "https://nameisno-default-rtdb.firebaseio.com",
  projectId: "nameisno",
  storageBucket: "nameisno.firebasestorage.app",
  messagingSenderId: "249400162276",
  appId: "1:249400162276:web:57a5793673b0a1bdcdb9f1"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);     // 유저 데이터, 인벤토리용 (영구 저장)
export const rtdb = getDatabase(app);    // 채팅, 접속 상태용 (실시간)
