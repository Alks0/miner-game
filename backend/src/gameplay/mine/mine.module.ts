import { Module } from '@nestjs/common';
import { MineService } from './mine.service';
import { MineController } from './mine.controller';
import { NotificationModule } from '../../notification/notification.module';

@Module({
  imports: [NotificationModule],
  providers: [MineService],
  controllers: [MineController],
})
export class MineModule {}
