import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { FragmentService, FragmentType } from './fragment.service';
import { NotificationService } from '../notification/notification.service';

export type ItemCategory = 'miner' | 'cart' | 'raider' | 'shield';

export type ItemRarity = 'common' | 'rare' | 'epic' | 'legendary';

export interface ItemTemplate {
  id: string;
  name: string;
  category: ItemCategory;
  rarity: ItemRarity;
  description: string;
  baseEffect: number; // 基础效果值
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
    // 矿机系列（影响挖矿间隔）
    { id: 'tpl-miner-1', name: '木制矿机', category: 'miner', rarity: 'common', description: '最基础的矿机，勉强能用', baseEffect: 100 },
    { id: 'tpl-miner-2', name: '青铜矿机', category: 'miner', rarity: 'common', description: '普通的矿机，效率略有提升', baseEffect: 150 },
    { id: 'tpl-miner-3', name: '精钢矿机', category: 'miner', rarity: 'rare', description: '采用精钢打造，挖矿效率大幅提升', baseEffect: 200 },
    { id: 'tpl-miner-4', name: '能量矿机', category: 'miner', rarity: 'epic', description: '注入能量核心，挖矿速度飞快', baseEffect: 300 },
    { id: 'tpl-miner-5', name: '量子矿机', category: 'miner', rarity: 'legendary', description: '使用量子技术，挖矿效率登峰造极', baseEffect: 500 },
    
    // 矿车系列（影响容量）
    { id: 'tpl-cart-1', name: '木板矿车', category: 'cart', rarity: 'common', description: '简陋的木板车，容量有限', baseEffect: 1000 },
    { id: 'tpl-cart-2', name: '铁制矿车', category: 'cart', rarity: 'common', description: '坚固的铁车，能装更多矿石', baseEffect: 1500 },
    { id: 'tpl-cart-3', name: '合金矿车', category: 'cart', rarity: 'rare', description: '轻量化合金材质，大容量', baseEffect: 2500 },
    { id: 'tpl-cart-4', name: '磁悬浮矿车', category: 'cart', rarity: 'epic', description: '磁悬浮技术，容量倍增', baseEffect: 4000 },
    { id: 'tpl-cart-5', name: '次元矿车', category: 'cart', rarity: 'legendary', description: '利用空间折叠，容量惊人', baseEffect: 8000 },
    
    // 掠夺器系列（影响掠夺率）
    { id: 'tpl-raider-1', name: '生锈掠夺器', category: 'raider', rarity: 'common', description: '破旧的掠夺工具，效果一般', baseEffect: 5 },
    { id: 'tpl-raider-2', name: '锋利掠夺器', category: 'raider', rarity: 'common', description: '锋利的刀刃，掠夺更多', baseEffect: 8 },
    { id: 'tpl-raider-3', name: '暗影掠夺器', category: 'raider', rarity: 'rare', description: '在暗影中行动，大幅提升掠夺率', baseEffect: 12 },
    { id: 'tpl-raider-4', name: '嗜血掠夺器', category: 'raider', rarity: 'epic', description: '嗜血之刃，掠夺如虎添翼', baseEffect: 18 },
    { id: 'tpl-raider-5', name: '毁灭掠夺器', category: 'raider', rarity: 'legendary', description: '终极掠夺武器，所向披靡', baseEffect: 30 },
    
    // 防御盾系列（影响防御率）
    { id: 'tpl-shield-1', name: '木制防御盾', category: 'shield', rarity: 'common', description: '基础的防护，聊胜于无', baseEffect: 3 },
    { id: 'tpl-shield-2', name: '青铜防御盾', category: 'shield', rarity: 'common', description: '坚固的青铜，能抵挡一些掠夺', baseEffect: 5 },
    { id: 'tpl-shield-3', name: '秘银防御盾', category: 'shield', rarity: 'rare', description: '魔法秘银打造，防御力强劲', baseEffect: 8 },
    { id: 'tpl-shield-4', name: '符文防御盾', category: 'shield', rarity: 'epic', description: '刻印古老符文，大幅减少损失', baseEffect: 12 },
    { id: 'tpl-shield-5', name: '神圣防御盾', category: 'shield', rarity: 'legendary', description: '神圣之力守护，几乎无法被掠夺', baseEffect: 20 },
  ];

  private userItems: Map<string, UserItemInstance[]> = new Map();

  constructor(
    private readonly users: UserService,
    private readonly fragments: FragmentService,
    private readonly notification: NotificationService,
  ) {}

  listTemplates() {
    return this.templates;
  }

  listUserItems(userId: string) {
    return this.userItems.get(userId) || [];
  }

  ensureStarter(userId: string) {
    const items = this.userItems.get(userId) || [];
    
    // 确保每个类别至少有一个装备
    const categories: ItemCategory[] = ['miner', 'cart', 'raider', 'shield'];
    for (const category of categories) {
      const hasItem = items.find(i => {
        const tpl = this.templates.find(t => t.id === i.templateId);
        return tpl?.category === category;
      });
      
      if (!hasItem) {
        // 给新手最基础的道具
        const templateId = `tpl-${category}-1`;
        items.push({ 
          id: `itm_${Date.now()}_${category[0]}${Math.random().toString(36).slice(2,4)}`, 
          templateId, 
          level: 1, 
          isEquipped: true 
        });
      }
    }
    
    this.userItems.set(userId, items);
  }

  equip(userId: string, itemId: string) {
    const items = this.listUserItems(userId);
    const item = items.find(i => i.id === itemId);
    if (!item) throw new NotFoundException('道具不存在');
    if (item.isListed) throw new BadRequestException('道具已在交易中');
    if (item.isEquipped) throw new BadRequestException('道具已装备');
    
    const template = this.templates.find(t => t.id === item.templateId)!;
    // 同类只允许一个装备
    items.forEach(i => {
      const t = this.templates.find(tt => tt.id === i.templateId)!;
      if (t.category === template.category) i.isEquipped = false;
    });
    item.isEquipped = true;
  }

  unequip(userId: string, itemId: string) {
    const items = this.listUserItems(userId);
    const item = items.find(i => i.id === itemId);
    if (!item) throw new NotFoundException('道具不存在');
    if (!item.isEquipped) throw new BadRequestException('道具未装备');
    
    item.isEquipped = false;
  }

  async upgrade(userId: string, itemId: string) {
    const items = this.listUserItems(userId);
    const item = items.find(i => i.id === itemId);
    if (!item) throw new NotFoundException('道具不存在');
    if (item.isListed) throw new BadRequestException('道具已在交易中');
    
    // 计算升级消耗：等级越高消耗越多
    const cost = item.level * 50;
    const consumed = await this.users.consumeResource(userId, 'ore', cost);
    if (!consumed) {
      throw new BadRequestException(`矿石不足，需要 ${cost} 矿石`);
    }
    
    // 升级成功率计算：80%基础，每级-2%，最低40%
    const successRate = Math.max(0.4, 0.8 - (item.level - 1) * 0.02);
    const success = Math.random() < successRate;
    
    if (success) {
      item.level += 1;
      
      // 高等级道具全服广播（等级>=10）
      if (item.level >= 10) {
        const user = this.users.findByIdSync(userId);
        const template = this.templates.find(t => t.id === item.templateId);
        this.notification.broadcast('global.announcement', {
          type: 'upgrade',
          message: `玩家 ${user?.username || 'Unknown'} 的 ${template?.name || '道具'} 升级到了 Lv.${item.level}！`,
        });
      }
      
      return { success: true, level: item.level, cost, successRate };
    } else {
      // 升级失败，矿石已消耗但等级不变
      return { success: false, level: item.level, cost, successRate };
    }
  }

  // 碎片合成道具
  async craftItem(userId: string, fragmentType: FragmentType): Promise<UserItemInstance> {
    // 检查碎片是否足够（需要50个）
    if (!this.fragments.canCraft(userId, fragmentType)) {
      throw new BadRequestException(`碎片不足，需要 50 个碎片`);
    }
    
    // 消耗碎片
    const consumed = this.fragments.craft(userId, fragmentType);
    if (!consumed) {
      throw new BadRequestException('合成失败');
    }
    
    // 根据碎片类型确定道具模板
    const templateId = `tpl-${fragmentType}-1`;
    const template = this.templates.find(t => t.id === templateId);
    if (!template) {
      throw new NotFoundException('道具模板不存在');
    }
    
    // 创建新道具实例
    const newItem: UserItemInstance = {
      id: `itm_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      templateId: templateId,
      level: 1,
      isEquipped: false,
    };
    
    const items = this.userItems.get(userId) || [];
    items.push(newItem);
    this.userItems.set(userId, items);
    
    return newItem;
  }

  getEquippedLevels(userId: string) {
    const items = this.listUserItems(userId);
    const miner = items.find(i => i.isEquipped && this.templates.find(t => t.id === i.templateId)?.category === 'miner');
    const cart = items.find(i => i.isEquipped && this.templates.find(t => t.id === i.templateId)?.category === 'cart');
    const raider = items.find(i => i.isEquipped && this.templates.find(t => t.id === i.templateId)?.category === 'raider');
    const shield = items.find(i => i.isEquipped && this.templates.find(t => t.id === i.templateId)?.category === 'shield');
    
    // 计算实际效果值（基础效果 + 等级加成）
    const getMinerEffect = (item: UserItemInstance | undefined) => {
      if (!item) return { level: 1, baseEffect: 100, totalEffect: 100 };
      const tpl = this.templates.find(t => t.id === item.templateId);
      const baseEffect = tpl?.baseEffect || 100;
      // 每级增加10%基础效果
      const totalEffect = baseEffect + (item.level - 1) * baseEffect * 0.1;
      return { level: item.level, baseEffect, totalEffect };
    };
    
    const getCartEffect = (item: UserItemInstance | undefined) => {
      if (!item) return { level: 1, baseEffect: 1000, totalEffect: 1000 };
      const tpl = this.templates.find(t => t.id === item.templateId);
      const baseEffect = tpl?.baseEffect || 1000;
      // 每级增加500
      const totalEffect = baseEffect + (item.level - 1) * 500;
      return { level: item.level, baseEffect, totalEffect };
    };
    
    const getRaiderEffect = (item: UserItemInstance | undefined) => {
      if (!item) return { level: 1, baseEffect: 5, totalEffect: 5 };
      const tpl = this.templates.find(t => t.id === item.templateId);
      const baseEffect = tpl?.baseEffect || 5;
      // 每级增加1%
      const totalEffect = baseEffect + (item.level - 1);
      return { level: item.level, baseEffect, totalEffect };
    };
    
    const getShieldEffect = (item: UserItemInstance | undefined) => {
      if (!item) return { level: 1, baseEffect: 3, totalEffect: 3 };
      const tpl = this.templates.find(t => t.id === item.templateId);
      const baseEffect = tpl?.baseEffect || 3;
      // 每级增加0.5%
      const totalEffect = baseEffect + (item.level - 1) * 0.5;
      return { level: item.level, baseEffect, totalEffect };
    };
    
    return { 
      minerLevel: miner?.level || 1,
      minerEffect: getMinerEffect(miner).totalEffect,
      cartLevel: cart?.level || 1, 
      cartCapacity: getCartEffect(cart).totalEffect,
      raiderLevel: raider?.level || 1,
      raiderEffect: getRaiderEffect(raider).totalEffect,
      shieldLevel: shield?.level || 1,
      shieldEffect: getShieldEffect(shield).totalEffect,
    };
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


