import { Column, Entity, Unique } from 'typeorm';
import { BaseTimeStampEntity } from '../utils/config/database/base-entity';

@Entity()
// @Unique(['code', 'source'])
export class User extends BaseTimeStampEntity {
  @Column({ nullable: false })
  code: string;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: false })
  source: string;
}
