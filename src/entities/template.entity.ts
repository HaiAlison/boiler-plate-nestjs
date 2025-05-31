import { Column, Entity, Index, JoinColumn, ManyToOne, Unique } from 'typeorm';
import { BaseTimeStampEntity } from '../utils/config/database/base-entity';
import { User } from './user.entity';

@Entity()
@Unique(['user_id', 'name'])
@Index(['user_id', 'name'])
export class TemplateEntity extends BaseTimeStampEntity {
  @ManyToOne(() => User, (user) => user.loggings)
  @JoinColumn({
    name: 'user_id',
  })
  user: User; //sender

  @Column({ nullable: true })
  user_id: string;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: true })
  subject: string;

  @Column({ nullable: true })
  body: string;
}
