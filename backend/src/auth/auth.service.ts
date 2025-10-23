import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

interface LoginDto {
  username: string;
  password: string;
}

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async login(dto: LoginDto) {
    // 简化：内置一个演示用户 user/password
    const isValid = dto.username === 'user' && dto.password === 'password';
    if (!isValid) {
      throw new UnauthorizedException('用户名或密码错误');
    }

    const payload = { sub: 'demo-user-id', username: dto.username };
    return {
      access_token: await this.jwtService.signAsync(payload),
      user: { id: 'demo-user-id', username: dto.username },
    };
  }
}


