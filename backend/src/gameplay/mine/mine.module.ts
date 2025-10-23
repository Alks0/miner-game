import { Module } from '@nestjs/common';
import { MineService } from './mine.service';
import { MineController } from './mine.controller';
import { NotificationModule } from '../../notification/notification.module';
import { UserModule } from '../../user/user.module';

@Module({
  imports: [NotificationModule, UserModule],
  providers: [MineService],
  controllers: [MineController],
})
export class MineModule {}
