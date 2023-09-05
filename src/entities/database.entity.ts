import { BeforeInsert, Column, Entity, Unique } from 'typeorm';
import { BaseTimeStampEntity } from '../utils/config/database/base-entity';
import * as bcrypt from 'bcrypt';

@Entity({ database: 'primary_database' })
@Unique(['port', 'host'])
export class Database extends BaseTimeStampEntity {
  @Column('varchar', { unique: true, nullable: false })
  name: string;

  @Column('int4', { nullable: false })
  port: number;

  @Column('varchar', { nullable: false })
  type: string;

  @Column('varchar', { nullable: false })
  host: string;

  @Column('varchar', { nullable: false })
  database: string;

  @Column('varchar', { nullable: false })
  username: string;

  @Column('varchar', { nullable: false, select: false })
  password: string;
}
