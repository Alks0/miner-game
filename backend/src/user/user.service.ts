import { Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

export interface UserEntity {
  id: string;
  username: string;
  passwordHash: string;
  nickname?: string;
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
    const user: UserEntity = { id, username, passwordHash, nickname: username };
    this.usersById.set(id, user);
    this.usersByName.set(username, user);
    return user;
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

  async updateNickname(id: string, nickname: string): Promise<void> {
    const user = await this.findById(id);
    user.nickname = nickname;
  }
}


