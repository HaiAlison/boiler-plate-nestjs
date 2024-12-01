import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseTimeStampEntity } from '../utils/config/database/base-entity';
import { User } from './user.entity';
@Entity()
export class Logging extends BaseTimeStampEntity {
  @ManyToOne(() => User, (user) => user.loggings)
  @JoinColumn({
    name: 'user_id',
  })
  user: User; //sender

  @Column({ nullable: true })
  user_id: string;

  @Column({ nullable: true })
  subject: string;

  @Column({ nullable: true })
  body: string;

  @Column({ nullable: true })
  status: string;

  @Column({ nullable: true })
  send_time: string;

  @Column({ nullable: true })
  total_recipients: string;

  @Column('simple-array', { nullable: true })
  recipients: string[];
}
