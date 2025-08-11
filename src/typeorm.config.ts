import { DataSource } from 'typeorm';
import { config as loadEnv } from 'dotenv';
import { Task } from './tasks/task.entity';

loadEnv();

export default new DataSource({
  type: 'postgres',
  host: process.env.POSTGRES_HOST || 'localhost',
  port: parseInt(process.env.POSTGRES_PORT || '5432', 10),
  username: process.env.POSTGRES_USER || 'postgres',
  password: process.env.POSTGRES_PASSWORD || 'postgres',
  database: process.env.POSTGRES_DB || 'greeka_todo',
  entities: [Task],
  migrations: ['dist/migrations/*.js'],
  synchronize: false,
  logging: process.env.TYPEORM_LOGGING === 'true',
});


