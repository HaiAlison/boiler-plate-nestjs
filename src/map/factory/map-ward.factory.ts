import { BaseMapFactory } from './map-base.factory';

export class MapWardFactory extends BaseMapFactory {
  async handle() {
    const select = [
      'cte.code::int',
      'cte.full_name as name',
      `concat(cte.division_code,'_',cte.code_name) as codename`,
      'cte.division_type',
      'cte.district_code::int',
    ];
    let query =
      'with cte as (select wards.*, administrative_units.full_name as division_type, ' +
      'administrative_units.code_name as division_code from wards ' +
      'left join administrative_units on administrative_units.id = wards.administrative_unit_id )';

    query += `
        select ${select.join(',')}
            from cte
        order by cte.code asc`;
    return await this.dataSource.query(query);
  }
}
