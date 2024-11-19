import { BadRequestException, Injectable } from '@nestjs/common';
import { google } from 'googleapis';
import { User } from '../entities/user.entity';
import { SendMailDto } from './dto/send-mail.dto';
import { handleError } from '../utils/common/handle';

@Injectable()
export class MailService {
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
        to: dto.to,
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
      return result.status >= 200 && result.status < 300
        ? { message: 'Mail sent successfully' }
        : new BadRequestException('Mail not sent');
    } catch (error) {
      handleError(error);
    }
  }
}
