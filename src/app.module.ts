import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmAsyncConfig } from './utils/config/database/config.service';
import { typeOrmMapConfig } from './utils/config/database/map.data-source';
import { MapModule } from './map/map.module';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: ['.env'], isGlobal: true }),
    ConfigModule,
    TypeOrmModule.forRootAsync(typeOrmAsyncConfig),
    TypeOrmModule.forRootAsync(typeOrmMapConfig),
    MapModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
