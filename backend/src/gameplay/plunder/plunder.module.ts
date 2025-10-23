import { Module } from '@nestjs/common';
import { PlunderService } from './plunder.service';
import { PlunderController } from './plunder.controller';
import { UserModule } from '../../user/user.module';
import { ItemModule } from '../../item/item.module';
import { NotificationModule } from '../../notification/notification.module';

@Module({
  imports: [UserModule, ItemModule, NotificationModule],
  providers: [PlunderService],
  controllers: [PlunderController],
})
export class PlunderModule {}


