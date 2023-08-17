import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('create-user')
  createUser(@Body() dto) {
    return this.appService.createUser(dto);
  }

  @Post()
  createMultipleUsers() {
    return this.appService.createMultipleUsers();
  }
}
