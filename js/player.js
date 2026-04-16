// ============================================
// 플레이어 상태 관리 (스탯 + Firestore 동기화)
// ============================================

import {
  doc,
  updateDoc,
  onSnapshot,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

import { db } from "./firebase-config.js";

/**
 * 플레이어 상태를 들고 있는 중앙 스토어.
 * 데이터가 바뀔 때마다 구독자들한테 알려줌.
 */
class PlayerStore {
  constructor() {
    this.data = null;     // { uid, nickname, stats, inventory, ... }
    this.listeners = new Set();
    this._unsub = null;
  }

  /** 상태 변경 구독 */
  subscribe(fn) {
    this.listeners.add(fn);
    if (this.data) fn(this.data);
    return () => this.listeners.delete(fn);
  }

  _emit() {
    for (const fn of this.listeners) fn(this.data);
  }

  /**
   * Firestore 의 내 데이터를 실시간 구독 시작
   * (다른 기기에서 바꿔도 반영되고, 거래 결과 같은 것도 바로 반영됨)
   */
  startSync(uid) {
    this.stopSync();
    const ref = doc(db, "players", uid);
    this._unsub = onSnapshot(ref, (snap) => {
      if (snap.exists()) {
        this.data = snap.data();
        this._emit();
      }
    });
  }

  stopSync() {
    if (this._unsub) { this._unsub(); this._unsub = null; }
    this.data = null;
  }

  // ==============================
  // 스탯 조작
  // ==============================

  async setStats(patch) {
    if (!this.data) return;
    const newStats = { ...this.data.stats, ...patch };
    // 경계값 클램프
    newStats.health = clamp(newStats.health, 0, 100);
    newStats.hunger = clamp(newStats.hunger, 0, 100);
    newStats.money = Math.max(0, Math.floor(newStats.money));

    await updateDoc(doc(db, "players", this.data.uid), {
      stats: newStats,
      lastSeen: serverTimestamp(),
    });
  }

  async addMoney(amount) {
    await this.setStats({ money: (this.data.stats.money || 0) + amount });
  }

  async changeHunger(delta) {
    await this.setStats({ hunger: (this.data.stats.hunger || 0) + delta });
  }

  async changeHealth(delta) {
    await this.setStats({ health: (this.data.stats.health || 0) + delta });
  }

  // ==============================
  // 인벤토리 조작
  // ==============================

  async addItem(itemId, name, count = 1) {
    if (!this.data) return;
    const inv = [...(this.data.inventory || [])];
    const existing = inv.find((i) => i.id === itemId);
    if (existing) existing.count += count;
    else inv.push({ id: itemId, name, count });

    await updateDoc(doc(db, "players", this.data.uid), { inventory: inv });
  }

  async removeItem(itemId, count = 1) {
    if (!this.data) return false;
    const inv = [...(this.data.inventory || [])];
    const existing = inv.find((i) => i.id === itemId);
    if (!existing || existing.count < count) return false;
    existing.count -= count;
    const filtered = inv.filter((i) => i.count > 0);
    await updateDoc(doc(db, "players", this.data.uid), { inventory: filtered });
    return true;
  }

  async setLocation(locId) {
    if (!this.data) return;
    await updateDoc(doc(db, "players", this.data.uid), { location: locId });
  }
}

function clamp(n, min, max) { return Math.max(min, Math.min(max, n)); }

// 싱글톤으로 내보내기
export const player = new PlayerStore();
