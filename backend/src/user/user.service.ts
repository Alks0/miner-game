import { Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

export interface UserEntity {
  id: string;
  username: string;
  passwordHash: string;
  nickname?: string;
  oreAmount: number;
  bbCoins: number;
  isVip: boolean;
  vipExpireAt?: number;
}

@Injectable()
export class UserService {
  private usersById: Map<string, UserEntity> = new Map();
  private usersByName: Map<string, UserEntity> = new Map();

  async createUser(username: string, password: string): Promise<UserEntity> {
    if (this.usersByName.has(username)) {
      return this.usersByName.get(username)!;
    }
    const id = `u_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const passwordHash = await bcrypt.hash(password, 10);
    const user: UserEntity = { 
      id, 
      username, 
      passwordHash, 
      nickname: username, 
      oreAmount: 0, 
      bbCoins: 0,
      isVip: false,
    };
    this.usersById.set(id, user);
    this.usersByName.set(username, user);
    return user;
  }

  // 检查是否VIP
  isVip(userId: string): boolean {
    const user = this.usersById.get(userId);
    if (!user || !user.isVip) return false;
    if (user.vipExpireAt && Date.now() > user.vipExpireAt) {
      user.isVip = false;
      return false;
    }
    return true;
  }

  // 设置VIP（duration为秒数，0表示永久）
  setVip(userId: string, durationSeconds: number = 0): void {
    const user = this.usersById.get(userId);
    if (!user) return;
    user.isVip = true;
    if (durationSeconds > 0) {
      user.vipExpireAt = Date.now() + durationSeconds * 1000;
    }
  }

  async validateUser(username: string, password: string): Promise<UserEntity | null> {
    const user = this.usersByName.get(username);
    if (!user) return null;
    const ok = await bcrypt.compare(password, user.passwordHash);
    return ok ? user : null;
  }

  async findById(id: string): Promise<UserEntity> {
    const user = this.usersById.get(id);
    if (!user) throw new NotFoundException('用户不存在');
    return user;
  }

  // 同步版本（用于非async场景）
  findByIdSync(id: string): UserEntity | undefined {
    return this.usersById.get(id);
  }

  async updateNickname(id: string, nickname: string): Promise<void> {
    const user = await this.findById(id);
    user.nickname = nickname;
  }

  async addResource(
    id: string,
    resource: 'ore' | 'coin',
    amount: number,
  ): Promise<void> {
    const user = await this.findById(id);
    if (resource === 'ore') user.oreAmount += amount;
    else user.bbCoins += amount;
  }

  async consumeResource(
    id: string,
    resource: 'ore' | 'coin',
    amount: number,
  ): Promise<boolean> {
    const user = await this.findById(id);
    if (resource === 'ore') {
      if (user.oreAmount < amount) return false;
      user.oreAmount -= amount;
      return true;
    } else {
      if (user.bbCoins < amount) return false;
      user.bbCoins -= amount;
      return true;
    }
  }

  listNearbyByLevel(userId: string) {
    const self = this.usersById.get(userId);
    const all = Array.from(this.usersById.values()).filter(u => u.id !== userId);
    // 内存版无等级字段，这里简单随机返回最多 10 个且矿石>0
    const candidates = all.filter(u => u.oreAmount > 0);
    return candidates.slice(0, 10);
  }

  async ensureFromPayload(payload: { sub: string; username?: string }): Promise<UserEntity> {
    const existing = this.usersById.get(payload.sub);
    if (existing) return existing;
    const username = payload.username || `player_${payload.sub.slice(-6)}`;
    // 使用安全的哈希轮数
    const passwordHash = await bcrypt.hash('placeholder', 10);
    const user: UserEntity = {
      id: payload.sub,
      username,
      passwordHash,
      nickname: username,
      oreAmount: 0,
      bbCoins: 0,
      isVip: false,
    };
    this.usersById.set(user.id, user);
    this.usersByName.set(user.username, user);
    return user;
  }
}


