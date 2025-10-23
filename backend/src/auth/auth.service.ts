import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';

interface LoginDto {
  username: string;
  password: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly users: UserService,
  ) {}

  async login(dto: LoginDto) {
    const user = await this.users.validateUser(dto.username, dto.password);
    if (!user) throw new UnauthorizedException('用户名或密码错误');
    const payload = { sub: user.id, username: user.username };
    return {
      access_token: await this.jwtService.signAsync(payload),
      user: { id: user.id, username: user.username },
    };
  }

  async register(dto: LoginDto) {
    const user = await this.users.createUser(dto.username, dto.password);
    const payload = { sub: user.id, username: user.username };
    return {
      access_token: await this.jwtService.signAsync(payload),
      user: { id: user.id, username: user.username },
    };
  }
}


