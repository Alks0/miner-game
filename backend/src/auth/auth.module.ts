import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const expiresRaw = config.get<string>('JWT_EXPIRES_IN');
        const expiresIn = Number(expiresRaw);
        return {
          secret: config.get<string>('JWT_SECRET', 'dev_secret_change_me'),
          signOptions: { expiresIn: Number.isFinite(expiresIn) ? expiresIn : 604800 },
        };
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}


