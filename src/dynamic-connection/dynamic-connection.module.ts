import { Module } from '@nestjs/common';
import { DynamicConnectionService } from './dynamic-connection.service';
import { DynamicConnectionController } from './dynamic-connection.controller';

@Module({
  controllers: [DynamicConnectionController],
  providers: [DynamicConnectionService],
  exports: [DynamicConnectionService],
})
export class DynamicConnectionModule {}
