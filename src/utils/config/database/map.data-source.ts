import { ConfigService } from '@nestjs/config';
import {
  TypeOrmModuleAsyncOptions,
  TypeOrmModuleOptions,
} from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

const config: ConfigService = new ConfigService();
const dbConfig = {
  name: 'map',
  type: 'postgres' as const,
  host: config.get<string>('DATABASE_MAP_HOST'),
  port: config.get<number>('DATABASE_MAP_PORT'),
  database: config.get<string>('DATABASE_MAP_NAME'),
  username: config.get<string>('DATABASE_MAP_USER'),
  password: config.get<string>('DATABASE_MAP_PASS'),
  migrations: ['dist/map/migrations/*.{ts,js}'],
  migrationsRun: true,
  migrationsTableName: 'typeorm_migrations',
  synchronize: false,
  ssl: config.get('MAP_SSL_MODE', false),
  extra: {
    ssl:
      config.get('MAP_SSL_MODE', false) == 'true'
        ? {
            rejectUnauthorized: !config.get<boolean>('MAP_SSL_MODE', false),
          }
        : null,
  },
  cli: {
    migrationsDir: 'src/map/migrations',
  },
  logging: true,
  cache: true,
};

export const typeOrmMapConfig: TypeOrmModuleAsyncOptions = {
  useFactory: async (): Promise<TypeOrmModuleOptions> => {
    return dbConfig;
  },
  dataSourceFactory: async (options) => {
    return await new DataSource(options).initialize();
  },
};
export default new DataSource(dbConfig);
