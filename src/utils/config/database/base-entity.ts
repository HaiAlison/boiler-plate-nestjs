import {
  BaseEntity,
  Connection,
  CreateDateColumn,
  DeleteDateColumn,
  getConnection,
  PrimaryGeneratedColumn,
  Repository,
  UpdateDateColumn,
} from 'typeorm';

export class BaseTimeStampEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({ type: 'timestamptz', select: false })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz', nullable: true, select: false })
  updated_at: Date;

  @DeleteDateColumn({ type: 'timestamptz', nullable: true, select: false })
  deleted_at: Date;
}
