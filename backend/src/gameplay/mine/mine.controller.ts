import { Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/jwt.guard';
import { MineService } from './mine.service';

@UseGuards(JwtAuthGuard)
@Controller('mine')
export class MineController {
  constructor(private readonly mine: MineService) {}

  @Post('start')
  start(@Req() req: any) {
    this.mine.start(req.user.sub);
    return { started: true };
  }

  @Post('stop')
  stop(@Req() req: any) {
    this.mine.stop(req.user.sub);
    return { stopped: true };
  }

  @Get('cart')
  cart(@Req() req: any) {
    return this.mine.getCart(req.user.sub);
  }

  @Post('collect')
  collect(@Req() req: any) {
    const collected = this.mine.collect(req.user.sub);
    return { collected };
  }

  @Get('status')
  status(@Req() req: any) {
    return this.mine.getStatus(req.user.sub);
  }
}
