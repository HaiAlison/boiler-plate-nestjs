import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseTimeStampEntity } from '../utils/config/database/base-entity';
import { User } from './user.entity';

@Entity()
// @Unique(['code', 'source'])
export class Notification extends BaseTimeStampEntity {
  @Column({ nullable: false })
  title: string;

  @Column({ nullable: true })
  body: string;

  @Column({ nullable: false })
  source: string;
  @ManyToOne(() => User, (user) => user.notifications)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
