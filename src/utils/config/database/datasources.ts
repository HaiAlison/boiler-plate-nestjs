import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { DataSource, DataSourceOptions } from 'typeorm';
import { sendPost } from '../../common/handle';
const config: ConfigService = new ConfigService();

export const connections: TypeOrmModuleOptions[] = [
  {
    port: 5433,
  },
  {
    port: 5434,
  },
  {
    port: 5435,
  },
  {
    port: 5436,
  },
  {
    port: 5437,
  },
  {
    port: 5438,
  },
  {
    port: 5439,
  },
  {
    port: 5440,
  },
  {
    port: 5441,
  },
  {
    port: 5442,
  },
];

connections.forEach((connection, index) => {
  Object.assign(connection, {
    name: `postgres1`,
    type: 'postgres',
    database: 'postgres',
    username: 'postgres',
    password: 'postgres',
    entities: ['dist/**/*.entity.{ts,js}'],
    migrations: ['dist/migrations/*.{ts,js}'],
    migrationsRun: true,
    migrationsTableName: 'typeorm_migrations',
    synchronize: false,
    ssl: config.get('SSL_MODE', false),
    extra: {
      ssl:
        config.get('SSL_MODE', false) == 'true'
          ? {
              rejectUnauthorized: !config.get<boolean>('SSL_MODE', false),
            }
          : null,
    },
    logging: true,
  });
});
export const db1 = new DataSource(connections[0] as DataSourceOptions);
