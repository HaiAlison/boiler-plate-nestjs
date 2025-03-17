import { Body, Controller, Post } from '@nestjs/common';
import { ImportsService } from './imports.service';

@Controller('imports')
export class ImportsController {
  constructor(private readonly importsService: ImportsService) {}

  @Post()
  async createImport(@Body() dto: any) {
    return this.importsService.createImport(dto);
  }
}
