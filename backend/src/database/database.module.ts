import { DynamicModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({})
export class DatabaseModule {
  static forRoot(): DynamicModule {
    const enabled = process.env.DB_ENABLE === '1' || process.env.DB_ENABLE === 'true';
    if (!enabled) {
      return { module: DatabaseModule };
    }
    return {
      module: DatabaseModule,
      imports: [
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: process.env.DB_HOST || 'localhost',
          port: parseInt(process.env.DB_PORT || '5432', 10),
          username: process.env.DB_USERNAME || 'postgres',
          password: process.env.DB_PASSWORD || 'postgres',
          database: process.env.DB_NAME || 'mining_game',
          autoLoadEntities: true,
          synchronize: process.env.NODE_ENV === 'development',
        }),
      ],
    };
  }
}
