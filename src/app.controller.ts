import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { I18n, I18nContext } from 'nestjs-i18n';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(@I18n() i18n: I18nContext): string {
    return this.appService.getHello(i18n);
  }
}
