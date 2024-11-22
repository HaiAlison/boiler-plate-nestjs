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
import { SenderService } from './sender.service';
import { JwtAuthGuard } from '../auth/guards/jwt.auth.guard';
import { GetUser } from '../utils/common/common.decorator';
import { CommonDto } from '../utils/common/dto';

@Controller('sender')
export class SenderController {
  constructor(private readonly senderService: SenderService) {}

  @Post('create-sender')
  @UseGuards(JwtAuthGuard)
  async createSender(@Body() dto: any, @GetUser() user_id: string) {
    return this.senderService.createSender(dto, user_id);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async getSenders(@Query() dto: CommonDto, @GetUser() user_id: string) {
    return await this.senderService.getSenders(user_id, dto);
  }

  @Delete(':id')
  async deleteSender(@Param('id') id: string) {
    return await this.senderService.deleteSender(id);
  }
}
