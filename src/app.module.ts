import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { typeOrmAsyncConfig } from './utils/config/database/config.service';
import { RedisModule } from './utils/redis/redis.module';
import { RedisLockModule } from './utils/redis-lock/redis-lock.module';
import { join } from 'path';
import { HeaderResolver, I18nModule } from 'nestjs-i18n';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { DynamicConnectionModule } from './dynamic-connection/dynamic-connection.module';
import { ScheduleModule } from '@nestjs/schedule';
import { typeOrmMapConfig } from './utils/config/database/map.data-source';
import { MapModule } from './map/map.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: ['.env'], isGlobal: true }),
    ConfigModule,
    TypeOrmModule.forRootAsync(typeOrmAsyncConfig),
    RedisModule,
    RedisLockModule,
    I18nModule.forRoot({
      fallbackLanguage: process.env.DEFAULT_LANGUAGE,
      loaderOptions: {
        path: join(__dirname, 'utils/i18n/'),
        watch: true,
      },
      resolvers: [new HeaderResolver(['x-language'])],
    }),
    TypeOrmModule.forRootAsync(typeOrmMapConfig),
    MapModule,
    ScheduleModule.forRoot(),
    // ...connections.map((connection) => {
    //   return TypeOrmModule.forRoot(connection);
    // }),
    MongooseModule.forRoot(
      `mongodb://${process.env.MONGO_DB_HOST}:${process.env.MONGO_DB_PORT}/${process.env.MONGO_DB_NAME}
      ?serverSelectionTimeoutMS=5000&connectTimeoutMS=10000`,
      {
        connectionFactory: (connection) => {
          console.log('Starting MongoDB connection...'); // Log at the start
          connection.on('connected', () => {
            // console.log('Connected to MongoDB');
          });
          connection._events.connected();
          return connection;
        },
      },
    ),
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      useFactory: async () => ({
        autoSchemaFile: true,
        graphiql: true,
      })

    }),
    UserModule,
    DynamicConnectionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
