import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { MailService } from './mail.service';
import { SendMailDto } from './dto/send-mail.dto';
import { CronJobDto } from './dto/cron-job.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Post('send')
  async sendMail(@Body() dto: SendMailDto) {
    return this.mailService.sendMail(dto);
  }

  @Post('set-time')
  @UseGuards(AuthGuard('jwt'))
  addCronJob(@Body() cronDto: CronJobDto) {
    return this.mailService.scheduleEmail(cronDto, {});
  }
}
