import { Body, Controller, Delete, Get, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { ExchangeService } from './exchange.service';

@UseGuards(JwtAuthGuard)
@Controller('exchange')
export class ExchangeController {
  constructor(private readonly ex: ExchangeService) {}

  @Get('orders')
  list(@Query('item_template_id') itemTemplateId: string, @Query('type') type: 'buy' | 'sell') {
    return this.ex.list(itemTemplateId, type);
  }

  @Post('orders')
  place(@Req() req: any, @Body() body: any) {
    if (body.type === 'buy') {
      return this.ex.placeBuy(req.user.sub, body.item_template_id, body.price, body.amount);
    }
    return this.ex.placeSell(req.user.sub, body.item_instance_id, body.price);
  }

  @Delete('orders/:orderId')
  cancel(@Param('orderId') orderId: string) {
    this.ex.removeOrder(orderId);
    return { ok: true };
  }
}


