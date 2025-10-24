import { Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/jwt.guard';
import { MineService } from './mine.service';

@UseGuards(JwtAuthGuard)
@Controller('mine')
export class MineController {
  constructor(private readonly mine: MineService) {}

  @Post('start')
  async start(@Req() req: any) {
    // 确保用户存在（token直连时）
    // @ts-ignore
    await this.mine['users'].ensureFromPayload(req.user);
    // @ts-ignore
    this.mine['items'].ensureStarter(req.user.sub);
    return this.mine.start(req.user.sub);
  }

  @Post('stop')
  stop(@Req() req: any) {
    return this.mine.stop(req.user.sub);
  }

  @Get('cart')
  async cart(@Req() req: any) {
    // @ts-ignore
    await this.mine['users'].ensureFromPayload(req.user);
    // @ts-ignore
    this.mine['items'].ensureStarter(req.user.sub);
    return this.mine.getCart(req.user.sub);
  }

  @Post('collect')
  async collect(@Req() req: any) {
    // @ts-ignore
    await this.mine['users'].ensureFromPayload(req.user);
    // @ts-ignore
    this.mine['items'].ensureStarter(req.user.sub);
    return this.mine.collect(req.user.sub);
  }

  @Get('status')
  async status(@Req() req: any) {
    // @ts-ignore
    await this.mine['users'].ensureFromPayload(req.user);
    // @ts-ignore
    this.mine['items'].ensureStarter(req.user.sub);
    return this.mine.getStatus(req.user.sub);
  }

  // 仅本地验证用：快速修理
  @Post('repair')
  async repair(@Req() req: any) {
    // @ts-ignore
    await this.mine['users'].ensureFromPayload(req.user);
    // @ts-ignore
    this.mine['items'].ensureStarter(req.user.sub);
    return this.mine.repair(req.user.sub);
  }
}
