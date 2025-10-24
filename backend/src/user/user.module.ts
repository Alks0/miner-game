import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { AdService } from './ad.service';

@Module({
  providers: [UserService, AdService],
  controllers: [UserController],
  exports: [UserService, AdService],
})
export class UserModule {}


