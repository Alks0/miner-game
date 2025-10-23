import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ItemService } from '../item/item.service';
import { UserService } from '../user/user.service';

export interface Order {
  id: string;
  userId: string;
  type: 'buy' | 'sell';
  itemTemplateId?: string; // buy 使用模板，sell 由实例映射
  itemInstanceId?: string; // sell 使用实例
  price: number;
  amount: number; // buy 为数量，sell 恒为1（单实例）
  createdAt: number;
}

@Injectable()
export class ExchangeService {
  private orders: Order[] = [];

  constructor(
    private readonly items: ItemService,
    private readonly users: UserService,
  ) {}

  list(itemTemplateId: string, type: 'buy' | 'sell') {
    return {
      orders: this.orders
        .filter(o => o.type === type && (!itemTemplateId || o.itemTemplateId === itemTemplateId))
        .sort((a, b) => (type === 'buy' ? b.price - a.price : a.price - b.price) || a.createdAt - b.createdAt)
        .slice(0, 50),
    };
  }

  async placeBuy(userId: string, itemTemplateId: string, price: number, amount: number) {
    if (amount <= 0 || price <= 0) throw new BadRequestException('参数错误');
    const total = price * amount;
    const ok = await this.users.consumeResource(userId, 'coin', total);
    if (!ok) throw new BadRequestException('BB币不足');
    const order: Order = {
      id: `o_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      userId,
      type: 'buy',
      itemTemplateId,
      price,
      amount,
      createdAt: Date.now(),
    };
    this.orders.push(order);
    this.tryMatch(order);
    return { id: order.id };
  }

  placeSell(userId: string, itemInstanceId: string, price: number) {
    if (price <= 0) throw new BadRequestException('参数错误');
    const inst = this.items.findUserItem(userId, itemInstanceId);
    if (!inst) throw new NotFoundException('道具不存在');
    if (inst.isEquipped) throw new BadRequestException('已装备无法出售');
    this.items.lockItem(userId, itemInstanceId);
    const order: Order = {
      id: `o_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      userId,
      type: 'sell',
      itemTemplateId: inst.templateId,
      itemInstanceId,
      price,
      amount: 1,
      createdAt: Date.now(),
    };
    this.orders.push(order);
    this.tryMatch(order);
    return { id: order.id };
  }

  private tryMatch(order: Order) {
    if (order.type === 'buy') {
      // 找到最便宜的卖单
      const sells = this.orders
        .filter(o => o.type === 'sell' && o.itemTemplateId === order.itemTemplateId && o.price <= order.price)
        .sort((a, b) => a.price - b.price || a.createdAt - b.createdAt);
      for (const s of sells) {
        if (order.amount <= 0) break;
        this.executeTrade(order, s);
      }
    } else {
      // 找到最高价的买单
      const buys = this.orders
        .filter(o => o.type === 'buy' && o.itemTemplateId === order.itemTemplateId && o.price >= order.price)
        .sort((a, b) => b.price - a.price || a.createdAt - b.createdAt);
      for (const b of buys) {
        if (order.amount <= 0) break;
        this.executeTrade(b, order);
      }
    }
  }

  private executeTrade(buy: Order, sell: Order) {
    const tradeAmount = Math.min(buy.amount, sell.amount);
    if (tradeAmount <= 0) return;
    // 转移道具（sell 实例 → buy 用户）
    this.items.transferItemInstance(sell.userId, buy.userId, sell.itemInstanceId!);
    // 资金结算：把多余币退回买家，把卖家拿到成交价
    const total = sell.price * tradeAmount;
    this.users.addResource(sell.userId, 'coin', total);
    // 买单消耗的币与价格差异在挂单时已扣除，这里按需要可以退差价，内存版从简不退差

    buy.amount -= tradeAmount;
    sell.amount -= tradeAmount;
    if (sell.amount <= 0) {
      // 卖单完成，解除锁定并从订单簿移除
      this.removeOrder(sell.id);
    }
    if (buy.amount <= 0) {
      this.removeOrder(buy.id);
    }
  }

  removeOrder(orderId: string) {
    const idx = this.orders.findIndex(o => o.id === orderId);
    if (idx >= 0) {
      const o = this.orders[idx];
      if (o.type === 'sell' && o.itemInstanceId) {
        this.items.unlockItem(o.userId, o.itemInstanceId);
      }
      this.orders.splice(idx, 1);
    }
  }
}


