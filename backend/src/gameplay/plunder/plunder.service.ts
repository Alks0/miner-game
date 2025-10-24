import { BadRequestException, Injectable } from '@nestjs/common';
import { UserService } from '../../user/user.service';
import { ItemService } from '../../item/item.service';
import { NotificationService } from '../../notification/notification.service';

@Injectable()
export class PlunderService {
  private cooldown: Map<string, number> = new Map();
  // 复仇列表：被掠夺者 -> 掠夺者列表（最多保留5个）
  private revengeList: Map<string, string[]> = new Map();

  constructor(
    private readonly users: UserService,
    private readonly items: ItemService,
    private readonly notification: NotificationService,
  ) {}

  targets(userId: string) {
    const list = this.users.listNearbyByLevel(userId).map(u => ({
      id: u.id,
      username: u.username,
      ore: u.oreAmount,
    }));
    return { targets: list };
  }

  async execute(attackerId: string, defenderId: string) {
    // 防止自己掠夺自己
    if (attackerId === defenderId) {
      throw new BadRequestException('不能掠夺自己');
    }
    
    const now = Date.now();
    const cd = this.cooldown.get(attackerId) || 0;
    if (cd > now) {
      const remainingSeconds = Math.ceil((cd - now) / 1000);
      throw new BadRequestException(`掠夺器冷却中，剩余 ${remainingSeconds} 秒`);
    }

    const attacker = await this.users.findById(attackerId);
    const defender = await this.users.findById(defenderId);
    const attackerEquip = this.items.getEquippedLevels(attackerId);
    const defenderEquip = this.items.getEquippedLevels(defenderId);

    // 新的掠夺率计算：基础10% + 掠夺器效果 - 防御盾效果
    let rate = 0.1 + (attackerEquip.raiderEffect / 100) - (defenderEquip.shieldEffect / 100);
    rate = Math.max(0.05, Math.min(0.35, rate));
    const loot = Math.floor(defender.oreAmount * rate);
    if (loot <= 0) throw new BadRequestException('对方资源不足');

    const consumed = await this.users.consumeResource(defenderId, 'ore', loot);
    if (!consumed) throw new BadRequestException('对方资源不足');
    await this.users.addResource(attackerId, 'ore', loot);

    // 冷却 1 小时（演示可改短）
    this.cooldown.set(attackerId, now + 3600_000);

    // 添加到被掠夺者的复仇列表
    this.addToRevengeList(defenderId, attackerId);

    this.notification.emitToUser(defenderId, 'plunder.attacked', { 
      attacker: attacker.username, 
      attackerId: attackerId,
      loss: loot 
    });
    
    return { success: true, loot_amount: loot };
  }

  // 获取复仇列表
  getRevengeList(userId: string) {
    const attackerIds = this.revengeList.get(userId) || [];
    const revenges = attackerIds.map(aid => {
      const attacker = this.users.findByIdSync(aid);
      return {
        id: aid,
        username: attacker?.username || 'Unknown',
        ore: attacker?.oreAmount || 0,
      };
    }).filter(r => r.ore > 0); // 只显示有矿石的
    
    return { revenges };
  }

  // 添加到复仇列表
  private addToRevengeList(defenderId: string, attackerId: string) {
    let list = this.revengeList.get(defenderId) || [];
    
    // 避免重复
    if (!list.includes(attackerId)) {
      list.push(attackerId);
    }
    
    // 只保留最近5个
    if (list.length > 5) {
      list = list.slice(-5);
    }
    
    this.revengeList.set(defenderId, list);
  }

  // 执行复仇后从列表移除
  private removeFromRevengeList(userId: string, targetId: string) {
    const list = this.revengeList.get(userId) || [];
    const idx = list.indexOf(targetId);
    if (idx >= 0) {
      list.splice(idx, 1);
      this.revengeList.set(userId, list);
    }
  }
}


