import { Column, Entity, ManyToOne, OneToMany, Unique } from 'typeorm';
import { BaseTimeStampEntity } from '../utils/config/database/base-entity';
import { Notification } from './notification.entity';
import { Role } from './role.entity';

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

  @OneToMany(() => Notification, (notifications) => notifications.user)
  notifications: Notification[];

  @ManyToOne(() => Role, (role) => role.users)
  role: Role;
}
