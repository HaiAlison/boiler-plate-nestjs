import { Controller, Get, Param, Query } from '@nestjs/common';
import { MapService } from './map.service';
import { ApiParam } from '@nestjs/swagger';
import { GetMapDto, MAP_TYPE } from './map.dto';

@Controller('map')
export class MapController {
  constructor(private readonly mapService: MapService) {}

  @Get(':type')
  @ApiParam({ type: String, name: 'type', enum: MAP_TYPE })
  depth(@Param('type') type: string, @Query() dto: GetMapDto) {
    return this.mapService.getData(dto, type);
  }
}
