import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { UserService } from '../user/user.service';

export type ItemCategory = 'miner' | 'cart' | 'raider' | 'shield';

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
  isListed?: boolean; // 交易中锁定
}

@Injectable()
export class ItemService {
  private templates: ItemTemplate[] = [
    { id: 'tpl-miner-1', name: '青铜矿机', category: 'miner' },
    { id: 'tpl-cart-1', name: '木制矿车', category: 'cart' },
    { id: 'tpl-raider-1', name: '生锈掠夺器', category: 'raider' },
    { id: 'tpl-shield-1', name: '木制防御盾', category: 'shield' },
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
    if (!items.find(i => i.templateId === 'tpl-raider-1')) {
      items.push({ id: `itm_${Date.now()}_r`, templateId: 'tpl-raider-1', level: 1, isEquipped: true });
    }
    if (!items.find(i => i.templateId === 'tpl-shield-1')) {
      items.push({ id: `itm_${Date.now()}_s`, templateId: 'tpl-shield-1', level: 1, isEquipped: true });
    }
    this.userItems.set(userId, items);
  }

  equip(userId: string, itemId: string) {
    const items = this.listUserItems(userId);
    const item = items.find(i => i.id === itemId);
    if (!item) throw new NotFoundException('道具不存在');
    if (item.isListed) throw new NotFoundException('道具已在交易中');
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
    if (item.isListed) throw new NotFoundException('道具已在交易中');
    item.level += 1;
    return { level: item.level };
  }

  getEquippedLevels(userId: string) {
    const items = this.listUserItems(userId);
    const miner = items.find(i => i.isEquipped && this.templates.find(t => t.id === i.templateId)?.category === 'miner');
    const cart = items.find(i => i.isEquipped && this.templates.find(t => t.id === i.templateId)?.category === 'cart');
    const raider = items.find(i => i.isEquipped && this.templates.find(t => t.id === i.templateId)?.category === 'raider');
    const shield = items.find(i => i.isEquipped && this.templates.find(t => t.id === i.templateId)?.category === 'shield');
    return { minerLevel: miner?.level || 1, cartLevel: cart?.level || 1, raiderLevel: raider?.level || 1, shieldLevel: shield?.level || 1 };
  }

  findUserItem(userId: string, itemId: string) {
    return this.listUserItems(userId).find(i => i.id === itemId);
  }

  lockItem(userId: string, itemId: string) {
    const it = this.findUserItem(userId, itemId);
    if (!it) throw new NotFoundException('道具不存在');
    if (it.isEquipped) throw new NotFoundException('已装备的道具无法出售');
    it.isListed = true;
  }

  unlockItem(userId: string, itemId: string) {
    const it = this.findUserItem(userId, itemId);
    if (it) it.isListed = false;
  }

  transferItemInstance(sellerId: string, buyerId: string, itemId: string) {
    // 验证卖家和买家不是同一个人
    if (sellerId === buyerId) {
      throw new BadRequestException('不能将道具转移给自己');
    }
    
    const sellerItems = this.listUserItems(sellerId);
    const idx = sellerItems.findIndex(i => i.id === itemId);
    if (idx < 0) throw new NotFoundException('道具不存在');
    
    const inst = sellerItems[idx];
    
    // 确保道具没有被装备
    if (inst.isEquipped) {
      throw new BadRequestException('已装备的道具无法转移');
    }
    
    sellerItems.splice(idx, 1);
    inst.isListed = false;
    inst.isEquipped = false;
    
    const buyerItems = this.userItems.get(buyerId) || [];
    buyerItems.push(inst);
    this.userItems.set(buyerId, buyerItems);
  }
}


