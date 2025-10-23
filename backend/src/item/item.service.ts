import { Injectable, NotFoundException } from '@nestjs/common';
import { UserService } from '../user/user.service';

export type ItemCategory = 'miner' | 'cart';

export interface ItemTemplate {
  id: string;
  name: string;
  category: ItemCategory;
}

export interface UserItemInstance {
  id: string;
  templateId: string;
  level: number;
  isEquipped: boolean;
}

@Injectable()
export class ItemService {
  private templates: ItemTemplate[] = [
    { id: 'tpl-miner-1', name: '青铜矿机', category: 'miner' },
    { id: 'tpl-cart-1', name: '木制矿车', category: 'cart' },
  ];

  private userItems: Map<string, UserItemInstance[]> = new Map();

  constructor(private readonly users: UserService) {}

  listTemplates() {
    return this.templates;
  }

  listUserItems(userId: string) {
    return this.userItems.get(userId) || [];
  }

  ensureStarter(userId: string) {
    const items = this.userItems.get(userId) || [];
    if (!items.find(i => i.templateId === 'tpl-miner-1')) {
      items.push({ id: `itm_${Date.now()}_m`, templateId: 'tpl-miner-1', level: 1, isEquipped: true });
    }
    if (!items.find(i => i.templateId === 'tpl-cart-1')) {
      items.push({ id: `itm_${Date.now()}_c`, templateId: 'tpl-cart-1', level: 1, isEquipped: true });
    }
    this.userItems.set(userId, items);
  }

  equip(userId: string, itemId: string) {
    const items = this.listUserItems(userId);
    const item = items.find(i => i.id === itemId);
    if (!item) throw new NotFoundException('道具不存在');
    const template = this.templates.find(t => t.id === item.templateId)!;
    // 同类只允许一个装备
    items.forEach(i => {
      const t = this.templates.find(tt => tt.id === i.templateId)!;
      if (t.category === template.category) i.isEquipped = false;
    });
    item.isEquipped = true;
  }

  upgrade(userId: string, itemId: string) {
    const items = this.listUserItems(userId);
    const item = items.find(i => i.id === itemId);
    if (!item) throw new NotFoundException('道具不存在');
    item.level += 1;
    return { level: item.level };
  }

  getEquippedLevels(userId: string) {
    const items = this.listUserItems(userId);
    const miner = items.find(i => i.isEquipped && this.templates.find(t => t.id === i.templateId)?.category === 'miner');
    const cart = items.find(i => i.isEquipped && this.templates.find(t => t.id === i.templateId)?.category === 'cart');
    return { minerLevel: miner?.level || 1, cartLevel: cart?.level || 1 };
  }
}


