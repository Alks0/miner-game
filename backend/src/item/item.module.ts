import { Module, forwardRef } from '@nestjs/common';
import { ItemService } from './item.service';
import { ItemController } from './item.controller';
import { FragmentService } from './fragment.service';
import { UserModule } from '../user/user.module';
import { NotificationModule } from '../notification/notification.module';

@Module({
  imports: [UserModule, forwardRef(() => NotificationModule)],
  providers: [ItemService, FragmentService],
  controllers: [ItemController],
  exports: [ItemService, FragmentService],
})
export class ItemModule {}


