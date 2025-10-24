import { Injectable } from '@nestjs/common';
import { NotificationService } from '../../notification/notification.service';
import { UserService } from '../../user/user.service';
import { ItemService } from '../../item/item.service';
import { RankingService } from '../../ranking/ranking.service';

interface UserMineState {
  intervalMs: number;
  timer?: NodeJS.Timeout;
  cartAmount: number;
  cartCapacity: number;
  collapsedUntil?: number;
}

@Injectable()
export class MineService {
  private userState: Map<string, UserMineState> = new Map();

  constructor(
    private readonly notification: NotificationService,
    private readonly users: UserService,
    private readonly items: ItemService,
    private readonly ranking: RankingService,
  ) {}

  start(userId: string) {
    const state = this.ensureState(userId);
    // 先刷新状态以获取最新装备数据
    this.refreshStateFromEquipment(userId, state);
    if (!state.timer) {
      console.log(`[MineService] Starting mining for user ${userId}, interval: ${state.intervalMs}ms`);
      state.timer = setInterval(() => this.produceOnce(userId), state.intervalMs);
    }
    return this.buildStatus(state);
  }

  stop(userId: string) {
    const state = this.ensureState(userId);
    if (state?.timer) {
      clearInterval(state.timer);
      state.timer = undefined;
    }
    return this.buildStatus(state);
  }

  // 用户离线时清理资源
  cleanup(userId: string) {
    const state = this.userState.get(userId);
    if (state?.timer) {
      clearInterval(state.timer);
      state.timer = undefined;
    }
  }

  private refreshStateFromEquipment(userId: string, state: UserMineState) {
    const { minerLevel, cartLevel } = this.items.getEquippedLevels(userId);
    const newIntervalMs = Math.max(1000, 3000 - (minerLevel - 1) * 100);
    const newCartCapacity = 1000 + (cartLevel - 1) * 500;
    
    // 如果周期变化，重启计时器
    if (state.intervalMs !== newIntervalMs && state.timer) {
      clearInterval(state.timer);
      state.timer = setInterval(() => this.produceOnce(userId), newIntervalMs);
    }
    
    state.intervalMs = newIntervalMs;
    state.cartCapacity = newCartCapacity;
    // 防止容量缩小导致超出
    if (state.cartAmount > state.cartCapacity) {
      state.cartAmount = state.cartCapacity;
    }
  }

  private produceOnce(userId: string) {
    const state = this.userState.get(userId);
    if (!state) {
      console.warn(`[MineService] produceOnce called but no state for user ${userId}`);
      return;
    }
    const now = Date.now();
    if (state.collapsedUntil && now < state.collapsedUntil) {
      this.notification.emitToUser(userId, 'mine.update', {
        type: 'idle',
        amount: 0,
        cartAmount: state.cartAmount,
        cartCapacity: state.cartCapacity,
        collapsed: true,
        collapsedRemaining: Math.ceil((state.collapsedUntil - now) / 1000),
        running: Boolean(state.timer),
      });
      return;
    }
    const base = 10;
    const random = Math.random();
    let type: 'normal' | 'critical' | 'collapse' = 'normal';
    let amount = base;
    if (random < 0.05) {
      type = 'collapse';
      amount = 0;
      state.collapsedUntil = now + 120000; // 2分钟
      const remaining = Math.ceil((state.collapsedUntil - now) / 1000);
      this.notification.emitToUser(userId, 'mine.collapse', { repair_duration: remaining });
    } else if (random < 0.30) {
      type = 'critical';
      amount = base * 3;
    }
    const space = Math.max(0, state.cartCapacity - state.cartAmount);
    const gain = Math.min(space, amount);
    state.cartAmount += gain;
    
    console.log(`[MineService] Produced for ${userId}: type=${type}, amount=${gain}, cart=${state.cartAmount}/${state.cartCapacity}`);
    
    this.notification.emitToUser(userId, 'mine.update', {
      type,
      amount: gain,
      cartAmount: state.cartAmount,
      cartCapacity: state.cartCapacity,
      collapsed: false,
      collapsedRemaining: 0,
      running: Boolean(state.timer),
    });
  }

  getCart(userId: string) {
    const state = this.ensureState(userId);
    return { cartAmount: state.cartAmount, cartCapacity: state.cartCapacity };
  }

  collect(userId: string) {
    const state = this.ensureState(userId);
    const collected = state.cartAmount;
    
    // 防止重复收集
    if (collected <= 0) {
      return { collected: 0, status: this.buildStatus(state) };
    }
    
    state.cartAmount = 0;
    this.users.addResource(userId, 'ore', collected);
    this.ranking.addScore(userId, collected);
    this.notification.emitToUser(userId, 'mine.update', {
      type: 'collect',
      amount: 0,
      cartAmount: state.cartAmount,
      cartCapacity: state.cartCapacity,
      collapsed: Boolean(state.collapsedUntil && state.collapsedUntil > Date.now()),
      collapsedRemaining: this.getCollapsedRemaining(state),
      running: Boolean(state.timer),
    });
    return { collected, status: this.buildStatus(state) };
  }

  getStatus(userId: string) {
    const state = this.ensureState(userId);
    return this.buildStatus(state);
  }

  repair(userId: string) {
    const state = this.ensureState(userId);
    if (state) {
      state.collapsedUntil = undefined;
    }
    return this.buildStatus(state);
  }

  private ensureState(userId: string): UserMineState {
    let state = this.userState.get(userId);
    if (!state) {
      const { minerLevel, cartLevel } = this.items.getEquippedLevels(userId);
      const intervalMs = Math.max(1000, 3000 - (minerLevel - 1) * 100);
      const cartCapacity = 1000 + (cartLevel - 1) * 500;
      state = { intervalMs, cartAmount: 0, cartCapacity };
      this.userState.set(userId, state);
    }
    return state;
  }

  private buildStatus(state: UserMineState) {
    const collapsedRemaining = this.getCollapsedRemaining(state);
    return {
      cartAmount: state.cartAmount,
      cartCapacity: state.cartCapacity,
      collapsed: collapsedRemaining > 0,
      collapsedRemaining,
      running: Boolean(state.timer),
      intervalMs: state.intervalMs,
    };
  }

  private getCollapsedRemaining(state: UserMineState) {
    if (!state.collapsedUntil) return 0;
    const now = Date.now();
    return state.collapsedUntil > now ? Math.ceil((state.collapsedUntil - now) / 1000) : 0;
  }
}
