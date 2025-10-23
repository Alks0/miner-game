import { Body, Controller, Get, Patch, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { UserService } from './user.service';
import { UpdateNicknameDto } from './dto/update-nickname.dto';

@UseGuards(JwtAuthGuard)
@Controller('user')
export class UserController {
  constructor(private readonly users: UserService) {}

  @Get('profile')
  async profile(@Req() req: any) {
    const user = await this.users.findById(req.user.sub);
    return { id: user.id, username: user.username, nickname: user.nickname };
  }

  @Patch('nickname')
  async updateNickname(@Req() req: any, @Body() body: UpdateNicknameDto) {
    await this.users.updateNickname(req.user.sub, body.nickname);
    return { ok: true };
  }
}


