import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { MailService } from './mail.service';
import { SendMailDto } from './dto/send-mail.dto';
import { CronJobDto } from './dto/cron-job.dto';
import { JwtAuthGuard } from '../auth/guards/jwt.auth.guard';
import { GetUser } from '../utils/common/common.decorator';
import { CommonDto } from '../utils/common/dto';
import { TemplateDto } from './dto/template.dto';

@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Post('send')
  async sendMail(@Body() dto: SendMailDto) {
    return this.mailService.sendMail(dto);
  }

  @Post('set-time')
  @UseGuards(JwtAuthGuard)
  addCronJob(@Body() cronDto: CronJobDto, @GetUser() user_id: string) {
    return this.mailService.scheduleEmail(cronDto, user_id);
  }

  @Get('sent')
  @UseGuards(JwtAuthGuard)
  async getSentList(@Query() dto: CommonDto, @GetUser() user_id: string) {
    return this.mailService.getSentList(dto, user_id);
  }

  @Post('template')
  @UseGuards(JwtAuthGuard)
  async createTemplate(@Body() dto: TemplateDto, @GetUser() user_id: string) {
    return this.mailService.createTemplate(dto, user_id);
  }
}
