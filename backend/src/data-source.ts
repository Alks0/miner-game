import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { UserEntityDb } from './user/entities/user.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'mining_game',
  entities: [UserEntityDb],
  migrations: ['src/database/migrations/*.ts'],
  synchronize: false,
});
