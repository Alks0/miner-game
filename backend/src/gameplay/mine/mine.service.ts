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
    if (!state.timer) {
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

  private produceOnce(userId: string) {
    const state = this.userState.get(userId);
    if (!state) return;
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
    state.cartAmount = 0;
    if (collected > 0) this.users.addResource(userId, 'ore', collected);
    if (collected > 0) this.ranking.addScore(userId, collected);
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
