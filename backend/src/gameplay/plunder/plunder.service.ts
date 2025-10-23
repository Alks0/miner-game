import { BadRequestException, Injectable } from '@nestjs/common';
import { UserService } from '../../user/user.service';
import { ItemService } from '../../item/item.service';
import { NotificationService } from '../../notification/notification.service';

@Injectable()
export class PlunderService {
  private cooldown: Map<string, number> = new Map();

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
    const now = Date.now();
    const cd = this.cooldown.get(attackerId) || 0;
    if (cd > now) throw new BadRequestException('掠夺器冷却中');

    const attacker = await this.users.findById(attackerId);
    const defender = await this.users.findById(defenderId);
    const { raiderLevel } = this.items.getEquippedLevels(attackerId);
    const { shieldLevel } = this.items.getEquippedLevels(defenderId);

    let rate = 0.1 + (raiderLevel - 1) * 0.01 - (shieldLevel - 1) * 0.005;
    rate = Math.max(0.05, Math.min(0.3, rate));
    const loot = Math.floor(defender.oreAmount * rate);
    if (loot <= 0) throw new BadRequestException('对方资源不足');

    const consumed = await this.users.consumeResource(defenderId, 'ore', loot);
    if (!consumed) throw new BadRequestException('对方资源不足');
    await this.users.addResource(attackerId, 'ore', loot);

    // 冷却 1 小时（演示可改短）
    this.cooldown.set(attackerId, now + 3600_000);

    this.notification.emitToUser(defenderId, 'plunder.attacked', { attacker: attacker.username, loss: loot });
    return { success: true, loot_amount: loot };
  }
}


