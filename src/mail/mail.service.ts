import { BadRequestException, Injectable } from '@nestjs/common';
import { google } from 'googleapis';
import { User } from '../entities/user.entity';
import { SendMailDto } from './dto/send-mail.dto';
import { handleError } from '../utils/common/handle';
import { CronJobDto } from './dto/cron-job.dto';
import { CronJob } from 'cron';
import { RedisStorageService } from '../redis-storage/redis-storage.service';
import { SchedulerRegistry } from '@nestjs/schedule';

@Injectable()
export class MailService {
  constructor(
    private redisStorage: RedisStorageService,
    private schedulerRegistry: SchedulerRegistry,
  ) {}

  async sendMail(dto: SendMailDto) {
    try {
      const user = await User.findOne({ where: { id: dto.user_id } });
      const oauth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        'https://developers.google.com/oauthplayground', // Redirect URL
      );
      oauth2Client.setCredentials({
        refresh_token: user.refresh_token,
        scope: 'https://mail.google.com/',
      });
      const mailOptions = {
        from: user.email,
        to: dto.to.join(', '),
        subject: dto.subject,
        text: dto.text,
      };
      const raw = [
        `From: ${mailOptions.from}`,
        `To: ${mailOptions.to}`,
        'Content-type: text/html;charset=iso-8859-1',
        'MIME-Version: 1.0',
        `Subject: =?UTF-8?B?${Buffer.from(mailOptions.subject).toString(
          'base64',
        )}?=`,
        '',
        mailOptions.text, // HTML content
      ]
        .join('\r\n')
        .trim();
      const encodedMessage = Buffer.from(raw).toString('base64');
      const gmail = google.gmail({ version: 'v1', auth: oauth2Client });
      const result = await gmail.users.messages.send({
        userId: 'me',
        requestBody: {
          raw: encodedMessage,
        },
      });
      console.log('Mail sent successfully', mailOptions);
      return result.status >= 200 && result.status < 300
        ? { message: 'Mail sent successfully' }
        : new BadRequestException('Mail not sent');
    } catch (error) {
      handleError(error);
    }
  }

  async scheduleEmail(dto: CronJobDto, user_id?: string) {
    const { hour, minute } = dto;

    await this.redisStorage.set('cron_time', `${hour}_${minute}`);
    const job = new CronJob(
      `${minute} ${hour} * * *`,
      async () => {
        console.log(`job report running at ${hour}:${minute}!`);
        //TODO send email
      },
      null,
      null,
      'Asia/Ho_Chi_Minh',
    );
    try {
      this.schedulerRegistry.addCronJob(`mail_schedule_${user_id}`, job);
    } catch (e) {}
    console.log(
      `job report added for each ${hour}:${minute
        .toString()
        .padStart(2, '0')} !`,
    );
    job.start();
  }
}
