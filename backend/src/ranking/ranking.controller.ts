import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { RankingService } from './ranking.service';

@UseGuards(JwtAuthGuard)
@Controller('ranking')
export class RankingController {
  constructor(private readonly ranking: RankingService) {}

  @Get('top')
  top(@Query('n') n = '50') {
    return { list: this.ranking.top(parseInt(n) || 50) };
  }

  @Get('me')
  me(@Req() req: any) {
    return this.ranking.myRank(req.user.sub);
  }
}


