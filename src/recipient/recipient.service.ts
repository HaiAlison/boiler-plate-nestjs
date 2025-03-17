import { Injectable } from '@nestjs/common';
import { Recipient } from '../entities/recipient.entity';
import { google } from 'googleapis';
import { AuthService } from '../auth/auth.service';
import { handleError, pagination } from '../utils/common/handle';
import { CreateRecipientDto } from './dto/sender.dto';
import { CommonDto } from '../utils/common/dto';

@Injectable()
export class RecipientService {
  constructor(private authService: AuthService) {}

  async createRecipient(dto: CreateRecipientDto, user_id: string) {
    try {
      const { email, first_name, last_name } = dto;
      const recipient = Recipient.create({
        user_id: user_id,
        email: email,
        last_name: last_name,
        first_name: first_name,
      });
      return await recipient.save();
    } catch (e) {
      handleError(e);
    }
  }

  async getRecipients(user_id: string, dto: CommonDto) {
    const query = Recipient.createQueryBuilder('recipient').where(
      'recipient.user_id = :user_id',
      { user_id: user_id },
    );
    return pagination(query, { limit: dto.limit, offset: dto.offset });
  }

  async deleteRecipient(id: string) {
    try {
      const recipient = await Recipient.findOne({ where: { id } });
      if (!recipient) {
        throw new Error('Recipient not found');
      }
      await recipient.remove();
      return { email: recipient.email };
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
