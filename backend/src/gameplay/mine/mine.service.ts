import { Injectable } from '@nestjs/common';
import { NotificationService } from '../../notification/notification.service';

interface UserMineState {
  intervalMs: number;
  timer?: NodeJS.Timeout;
  cartAmount: number;
  cartCapacity: number;
}

@Injectable()
export class MineService {
  private userState: Map<string, UserMineState> = new Map();

  constructor(private readonly notification: NotificationService) {}

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
    const base = 10;
    const random = Math.random();
    let type: 'normal' | 'critical' = 'normal';
    let amount = base;
    if (random < 0.25) {
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
    return collected;
  }
}
