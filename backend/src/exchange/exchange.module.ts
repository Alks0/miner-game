import { Module } from '@nestjs/common';
import { ExchangeService } from './exchange.service';
import { ExchangeController } from './exchange.controller';
import { ItemModule } from '../item/item.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [ItemModule, UserModule],
  providers: [ExchangeService],
  controllers: [ExchangeController],
})
export class ExchangeModule {}


