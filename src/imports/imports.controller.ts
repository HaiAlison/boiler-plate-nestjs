import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ImportsService } from './imports.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes } from '@nestjs/swagger';
import { GetUser } from '../utils/common/common.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt.auth.guard';

@Controller('imports')
export class ImportsController {
  constructor(private readonly importsService: ImportsService) {}

  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @Post()
  @UseGuards(JwtAuthGuard)
  createImport(
    @Body() dto: any,
    @UploadedFile() file: Express.Multer.File,
    @GetUser() jwtPayload: any,
  ) {
    return this.importsService.createImport(dto, file, jwtPayload);
  }
}
