import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmAsyncConfig } from './utils/config/database/config.service';
import { join } from 'path';
import { HeaderResolver, I18nModule } from 'nestjs-i18n';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: ['.env'], isGlobal: true }),
    ConfigModule,
    TypeOrmModule.forRootAsync(typeOrmAsyncConfig),
    I18nModule.forRoot({
      fallbackLanguage: process.env.DEFAULT_LANGUAGE,
      loaderOptions: {
        path: join(__dirname, 'utils/i18n/'),
        watch: true,
      },
      resolvers: [new HeaderResolver(['x-language'])],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
