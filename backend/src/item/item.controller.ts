import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { ItemService } from './item.service';

@UseGuards(JwtAuthGuard)
@Controller('items')
export class ItemController {
  constructor(private readonly items: ItemService) {}

  @Get('templates')
  templates() {
    return { templates: this.items.listTemplates() };
  }

  @Get()
  list(@Req() req: any) {
    this.items.ensureStarter(req.user.sub);
    return { items: this.items.listUserItems(req.user.sub) };
  }

  @Post('equip')
  equip(@Req() req: any, @Body() body: { itemId: string }) {
    this.items.equip(req.user.sub, body.itemId);
    return { ok: true };
  }

  @Post('upgrade')
  upgrade(@Req() req: any, @Body() body: { itemId: string }) {
    return this.items.upgrade(req.user.sub, body.itemId);
  }
}


