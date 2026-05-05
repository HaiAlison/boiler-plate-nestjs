import { Controller, Get, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { I18n, I18nContext } from 'nestjs-i18n';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(@I18n() i18n: I18nContext): string {
    return this.appService.getHello(i18n);
  }

  /**
   * Demo Redis lock: acquire lock thủ công.
   * GET /lock/demo?key=my-resource&hold=2000
   */
  @Get('lock/demo')
  async demoLock(
    @Query('key') key = 'demo-key',
    @Query('hold') hold = '2000',
  ) {
    const holdMs = Math.min(Number(hold) || 2000, 10000);
    return this.appService.demoManualLock(key, holdMs);
  }

  /**
   * Demo Redis lock: withLock (tự acquire/release).
   * GET /lock/with-lock?key=my-resource
   */
  @Get('lock/with-lock')
  async demoWithLock(@Query('key') key = 'demo-key') {
    return this.appService.demoWithLock(key);
  }
}
