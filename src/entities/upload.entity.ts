import { Column, Entity, Index, JoinColumn, ManyToOne, Unique } from 'typeorm';
import { BaseTimeStampEntity } from '../utils/config/database/base-entity';
import { User } from './user.entity';

@Entity()
@Unique('UQ_KEY_USER', ['key', 'user_id'])
export class Upload extends BaseTimeStampEntity {
  @Column({ nullable: true })
  name: string;

  @Index()
  @Column({ nullable: false })
  key: string;

  @Column({ nullable: false })
  full_url: string;

  @ManyToOne(() => User, (user) => user.files, { onDelete: 'CASCADE' })
  @JoinColumn({
    name: 'user_id',
  })
  user: User;

  @Column({ nullable: false })
  user_id: string;
}
