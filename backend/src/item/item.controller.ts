import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { ItemService } from './item.service';
import { FragmentService, FragmentType } from './fragment.service';

@UseGuards(JwtAuthGuard)
@Controller('items')
export class ItemController {
  constructor(
    private readonly items: ItemService,
    private readonly fragments: FragmentService,
  ) {}

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

  @Post('unequip')
  unequip(@Req() req: any, @Body() body: { itemId: string }) {
    this.items.unequip(req.user.sub, body.itemId);
    return { ok: true };
  }

  @Post('upgrade')
  async upgrade(@Req() req: any, @Body() body: { itemId: string }) {
    return this.items.upgrade(req.user.sub, body.itemId);
  }

  @Get('fragments')
  getFragments(@Req() req: any) {
    return { fragments: this.fragments.getUserFragments(req.user.sub) };
  }

  @Post('craft')
  async craft(@Req() req: any, @Body() body: { fragmentType: FragmentType }) {
    const item = await this.items.craftItem(req.user.sub, body.fragmentType);
    return { item };
  }
}


