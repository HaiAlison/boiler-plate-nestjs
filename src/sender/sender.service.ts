import { Injectable } from '@nestjs/common';
import { Sender } from '../entities/sender.entity';
import { google } from 'googleapis';
import { AuthService } from '../auth/auth.service';
import { handleError, pagination } from '../utils/common/handle';
import { CreateSenderDto } from './dto/sender.dto';
import { CommonDto } from '../utils/common/dto';

@Injectable()
export class SenderService {
  constructor(private authService: AuthService) {
  }

  async createSender(dto: CreateSenderDto, user_id: string) {
    try {
      const { email, first_name, last_name } = dto;
      const sender = Sender.create({
        user_id: user_id,
        email: email,
        last_name: last_name,
        first_name: first_name,
      });
      return await sender.save();
    } catch (e) {
      handleError(e);
    }
  }

  async getSenders(user_id: string, dto: CommonDto) {
    const query = Sender.createQueryBuilder('sender').where(
      'sender.user_id = :user_id',
      { user_id: user_id },
    );
    return pagination(query, { limit: dto.limit, offset: dto.offset });
  }

  async deleteSender(id: string) {
    try {
      const sender = await Sender.findOne({ where: { id } });
      if (!sender) {
        throw new Error('Sender not found');
      }
      await sender.remove();
      return { email: sender.email };
    } catch (e) {
      handleError(e);
    }
  }

  async getSenderInfoByEmail(email: string, user_id: string) {
    try {
      const oauth2Client = await this.authService.oauthLogin(user_id);

      const peopleService = google.people({
        auth: oauth2Client,
        version: 'v1',
      });
      const response = await peopleService.people.searchContacts({
        query: email, // The email to search for
        readMask: 'names,emailAddresses,photos', // Fields to retrieve
      });

      console.log(response.data.results[0]);
    } catch (error) {
      console.error('Error fetching user info:', error.message);
    }
  }
}
