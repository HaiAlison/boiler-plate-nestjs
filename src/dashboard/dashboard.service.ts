import { Injectable } from '@nestjs/common';
import { Logging } from '../entities/logging.entity';
import * as moment from 'moment';
import { LessThan } from 'typeorm';

@Injectable()
export class DashboardService {
  async getSummarySent(dto: any, user_id: string) {
    const logs = await Logging.createQueryBuilder('log')
      .where('log.user_id = :user_id', { user_id })
      .andWhere('log.send_time > :start', {
        start: moment().subtract(7, 'days').format('YYYY-MM-DD'),
      })
      .orderBy('log.send_time', 'DESC')
      .getMany();
    //chart x-axis is the date and y-axis is the total_recipients
    const days = [
      'Thứ hai',
      'Thứ ba',
      'Thứ tư',
      'Thứ năm',
      'Thứ sáu',
      'Thứ bảy',
      'Chủ nhật',
    ];

    const chartData = logs.reduce((acc, curr) => {
      const date = moment(curr.send_time).day();
      if (acc[date]) {
        acc[date].count += 1;
      } else {
        acc[date] = {
          count: 1,
          date: days[date],
        };
      }
      return acc;
    }, {});
    return Object.values(chartData);
  }
}
