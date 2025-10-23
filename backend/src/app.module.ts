import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HealthController } from './health.controller';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { DatabaseModule } from './database/database.module';
import { NotificationModule } from './notification/notification.module';
import { MineModule } from './gameplay/mine/mine.module';
import { ItemModule } from './item/item.module';
import { PlunderModule } from './gameplay/plunder/plunder.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule.forRoot(),
    AuthModule,
    UserModule,
    NotificationModule,
    MineModule,
    ItemModule,
    PlunderModule,
  ],
  controllers: [AppController, HealthController],
  providers: [AppService],
})
export class AppModule {}
