import { Module } from '@nestjs/common';
import { StreamService } from './stream.service';
import { StreamController } from './stream.controller';

@Module({
  controllers: [StreamController],
  providers: [StreamService]
})
export class StreamModule {}
