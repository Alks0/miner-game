import { Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/jwt.guard';
import { PlunderService } from './plunder.service';

@UseGuards(JwtAuthGuard)
@Controller('plunder')
export class PlunderController {
  constructor(private readonly plunder: PlunderService) {}

  @Get('targets')
  targets(@Req() req: any) {
    return this.plunder.targets(req.user.sub);
  }

  @Get('revenge-list')
  revengeList(@Req() req: any) {
    return this.plunder.getRevengeList(req.user.sub);
  }

  @Post(':defenderId')
  execute(@Req() req: any, @Param('defenderId') defenderId: string) {
    return this.plunder.execute(req.user.sub, defenderId);
  }
}


