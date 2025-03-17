import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { RecipientService } from './recipient.service';
import { JwtAuthGuard } from '../auth/guards/jwt.auth.guard';
import { GetUser } from '../utils/common/common.decorator';
import { CommonDto } from '../utils/common/dto';

@Controller('recipient')
export class RecipientController {
  constructor(private readonly recipientService: RecipientService) {}

  @Post('create-recipient')
  @UseGuards(JwtAuthGuard)
  async createSender(@Body() dto: any, @GetUser() user_id: string) {
    return this.recipientService.createRecipient(dto, user_id);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async getRecipients(@Query() dto: CommonDto, @GetUser() user_id: string) {
    return await this.recipientService.getRecipients(user_id, dto);
  }

  @Delete(':id')
  async deleteRecipient(@Param('id') id: string) {
    return await this.recipientService.deleteRecipient(id);
  }
}
