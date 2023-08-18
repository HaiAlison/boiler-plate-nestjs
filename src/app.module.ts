import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmAsyncConfig } from './utils/config/database/config.service';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: ['.env'], isGlobal: true }),
    ConfigModule,
    TypeOrmModule.forRootAsync(typeOrmAsyncConfig),
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
