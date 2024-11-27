import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UploadService } from './upload.service';
import { GetUser } from '../utils/common/common.decorator';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';
import { FilesInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/guards/jwt.auth.guard';
import { CommonDto } from '../utils/common/dto';

@Controller('upload')
@UseGuards(JwtAuthGuard)
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @UseInterceptors(FilesInterceptor('images'))
  @ApiConsumes('multipart/form-data')
  @Post('images')
  uploadFile(
    @GetUser() id: string,
    @Body() dto: any,
    @UploadedFiles() images: Express.Multer.File[],
  ) {
    return this.uploadService.uploadFile(dto, images, id);
  }

  @Get('images')
  getImages(@Query() dto: CommonDto, @GetUser() id: string) {
    return this.uploadService.getImages(dto, id);
  }

  @Post('delete-image')
  deleteImage(@Body('id') id: string) {
    return this.uploadService.deleteImage(id);
  }
}
