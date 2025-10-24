import { Injectable } from '@nestjs/common';

export type FragmentType = 'miner' | 'cart' | 'raider' | 'shield';

@Injectable()
export class FragmentService {
  // userId -> fragmentType -> amount
  private userFragments: Map<string, Map<FragmentType, number>> = new Map();

  // 获取用户所有碎片
  getUserFragments(userId: string): Record<FragmentType, number> {
    const fragments = this.userFragments.get(userId) || new Map();
    return {
      miner: fragments.get('miner') || 0,
      cart: fragments.get('cart') || 0,
      raider: fragments.get('raider') || 0,
      shield: fragments.get('shield') || 0,
    };
  }

  // 获取指定类型碎片数量
  getFragmentAmount(userId: string, type: FragmentType): number {
    const fragments = this.userFragments.get(userId);
    if (!fragments) return 0;
    return fragments.get(type) || 0;
  }

  // 添加碎片
  addFragment(userId: string, type: FragmentType, amount: number): void {
    if (amount <= 0) return;
    
    let userFrags = this.userFragments.get(userId);
    if (!userFrags) {
      userFrags = new Map();
      this.userFragments.set(userId, userFrags);
    }

    const current = userFrags.get(type) || 0;
    userFrags.set(type, current + amount);
  }

  // 消耗碎片
  consumeFragment(userId: string, type: FragmentType, amount: number): boolean {
    const current = this.getFragmentAmount(userId, type);
    if (current < amount) return false;

    const userFrags = this.userFragments.get(userId)!;
    userFrags.set(type, current - amount);
    return true;
  }

  // 碎片合成道具（需要50个碎片）
  canCraft(userId: string, type: FragmentType): boolean {
    return this.getFragmentAmount(userId, type) >= 50;
  }

  // 执行合成（消耗碎片，返回是否成功）
  craft(userId: string, type: FragmentType): boolean {
    return this.consumeFragment(userId, type, 50);
  }
}

