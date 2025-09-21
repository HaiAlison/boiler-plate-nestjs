import { Controller, Get, Res } from '@nestjs/common';
import { StreamService } from './stream.service';
import { Response } from 'express';

@Controller('stream')
export class StreamController {
  constructor(private readonly streamService: StreamService) {}
  @Get()
  streamBigTable(@Res() res: Response) {
    return this.streamService.streamBigTable(res);
  }
}
