import { Body, Controller, Get, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { UserService } from './user.service';
import { AdService } from './ad.service';
import { UpdateNicknameDto } from './dto/update-nickname.dto';

@UseGuards(JwtAuthGuard)
@Controller('user')
export class UserController {
  constructor(
    private readonly users: UserService,
    private readonly ads: AdService,
  ) {}

  @Get('profile')
  async profile(@Req() req: any) {
    await this.users.ensureFromPayload(req.user);
    const user = await this.users.findById(req.user.sub);
    return { id: user.id, username: user.username, nickname: user.nickname, oreAmount: user.oreAmount, bbCoins: user.bbCoins };
  }

  @Patch('nickname')
  async updateNickname(@Req() req: any, @Body() body: UpdateNicknameDto) {
    await this.users.ensureFromPayload(req.user);
    await this.users.updateNickname(req.user.sub, body.nickname);
    return { ok: true };
  }

  @Post('watch-ad')
  async watchAd(@Req() req: any) {
    const userId = req.user.sub;
    if (!this.ads.canWatchAd(userId)) {
      return { success: false, message: '观看广告冷却中，请稍后再试' };
    }
    
    const result = this.ads.watchAd(userId);
    
    // 如果有奖励，给予用户
    if (result.reward) {
      await this.users.addResource(userId, 'ore', result.reward);
    }
    
    return result;
  }

  @Get('vip-status')
  async getVipStatus(@Req() req: any) {
    const isVip = this.users.isVip(req.user.sub);
    return { isVip };
  }
}


