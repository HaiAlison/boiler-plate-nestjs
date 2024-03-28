import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { typeOrmAsyncConfig } from './utils/config/database/config.service';
import { MongooseModule } from '@nestjs/mongoose';

const config: ConfigService = new ConfigService();
const connections: TypeOrmModuleOptions[] = [
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
@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: ['.env'], isGlobal: true }),
    ConfigModule,
    // TypeOrmModule.forRootAsync(typeOrmAsyncConfig),
    ...connections.map((connection) => {
      Object.assign(connection, {
        type: 'postgres',
        database: 'test',
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
      return TypeOrmModule.forRoot(connection);
    }),
    MongooseModule.forRoot(
      `mongodb://${process.env.MONGO_DB_HOST}:${process.env.MONGO_DB_PORT}/${process.env.MONGO_DB_NAME}
      ?serverSelectionTimeoutMS=5000&connectTimeoutMS=10000`,
      {
        connectionFactory: (connection) => {
          console.log('Starting MongoDB connection...'); // Log at the start
          connection.on('connected', () => {
            console.log('Connected to MongoDB');
          });
          connection._events.connected();
          return connection;
        },
      },
    ),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
