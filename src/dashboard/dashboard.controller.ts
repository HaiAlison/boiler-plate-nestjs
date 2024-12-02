import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { GetUser } from '../utils/common/common.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt.auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@Controller('dashboard')
@ApiTags('Dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('summary-sent')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('Authorization')
  async getSummarySent(@Query() dto: any, @GetUser() user_id: string) {
    return this.dashboardService.getSummarySent(dto, user_id);
  }
}
