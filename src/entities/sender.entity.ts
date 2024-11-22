import { Column, Entity, JoinColumn, ManyToOne, Unique } from 'typeorm';
import { BaseTimeStampEntity } from '../utils/config/database/base-entity';
import { User } from './user.entity';
@Entity()
@Unique('FK_sender_email_user', ['email', 'user'])
export class Sender extends BaseTimeStampEntity {
  @Column({ nullable: true })
  first_name: string;

  @Column({ nullable: true })
  last_name: string;

  @Column({ nullable: false })
  email: string;

  @Column({ nullable: true })
  avatar: string;

  @ManyToOne(() => User, (user) => user.senders)
  @JoinColumn({
    name: 'user_id',
  })
  user: User;

  @Column({ nullable: true })
  user_id: string;
}
