import { Injectable } from '@nestjs/common';
import { NotificationService } from '../../notification/notification.service';
import { UserService } from '../../user/user.service';

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
  ) {}

  start(userId: string) {
    let state = this.userState.get(userId);
    if (state?.timer) return;
    if (!state) {
      state = { intervalMs: 3000, cartAmount: 0, cartCapacity: 1000 };
      this.userState.set(userId, state);
    }
    state.timer = setInterval(() => this.produceOnce(userId), state.intervalMs);
  }

  stop(userId: string) {
    const state = this.userState.get(userId);
    if (state?.timer) {
      clearInterval(state.timer);
      state.timer = undefined;
    }
  }

  private produceOnce(userId: string) {
    const state = this.userState.get(userId);
    if (!state) return;
    const now = Date.now();
    if (state.collapsedUntil && now < state.collapsedUntil) {
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
      this.notification.emitToUser(userId, 'mine.collapse', { repair_duration: 120 });
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
    });
  }

  getCart(userId: string) {
    const state = this.userState.get(userId) || { intervalMs: 3000, cartAmount: 0, cartCapacity: 1000 };
    this.userState.set(userId, state);
    return { cartAmount: state.cartAmount, cartCapacity: state.cartCapacity };
  }

  collect(userId: string) {
    const state = this.userState.get(userId) || { intervalMs: 3000, cartAmount: 0, cartCapacity: 1000 };
    const collected = state.cartAmount;
    state.cartAmount = 0;
    if (collected > 0) this.users.addResource(userId, 'ore', collected);
    return collected;
  }

  getStatus(userId: string) {
    const state = this.userState.get(userId) || { intervalMs: 3000, cartAmount: 0, cartCapacity: 1000 };
    const now = Date.now();
    const collapsedRemaining = state.collapsedUntil && now < state.collapsedUntil ? Math.ceil((state.collapsedUntil - now) / 1000) : 0;
    return { collapsed: collapsedRemaining > 0, collapsedRemaining };
  }
}
