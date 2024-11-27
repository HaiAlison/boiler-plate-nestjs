import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { MailService } from './mail.service';
import { SendMailDto } from './dto/send-mail.dto';
import { CronJobDto } from './dto/cron-job.dto';
import { JwtAuthGuard } from '../auth/guards/jwt.auth.guard';
import { GetUser } from '../utils/common/common.decorator';

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
}
