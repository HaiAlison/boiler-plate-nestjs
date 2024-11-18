import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmAsyncConfig } from './utils/config/database/config.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { DynamicConnectionModule } from './dynamic-connection/dynamic-connection.module';
import { ScheduleModule } from '@nestjs/schedule';
import { typeOrmMapConfig } from './utils/config/database/map.data-source';
import { MapModule } from './map/map.module';
import { AuthModule } from './auth/auth.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { LoggingInterceptor } from './utils/interceptors/logging.interceptor';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: ['.env'], isGlobal: true }),
    ConfigModule,
    TypeOrmModule.forRootAsync(typeOrmAsyncConfig),
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
    UserModule,
    DynamicConnectionModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
})
export class AppModule {}
