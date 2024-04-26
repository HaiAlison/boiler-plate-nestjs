import { Column, Entity, ManyToOne, OneToMany, Unique } from 'typeorm';
import { BaseTimeStampEntity } from '../utils/config/database/base-entity';
import { Notification } from './notification.entity';
import * as bcrypt from 'bcrypt';
@Entity()
@Unique(['code', 'source'])
export class User extends BaseTimeStampEntity {
  @Column({ nullable: false })
  code: string;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: false })
  source: string;

  @Column({ nullable: true, unique: true })
  fbProviderId: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  avatar: string;

  @Column({ nullable: true, select: false })
  password?: string;

  @OneToMany(() => Notification, (notifications) => notifications.user)
  notifications: Notification[];

  constructor(user?: Partial<User>) {
    super();
    Object.assign(this, user);
  }
  public async validatePassword(
    pwd: string,
    salt: string,
    hashPwd: string,
  ): Promise<boolean> {
    const hash = await bcrypt.hash(pwd, 10);
    return hash === hashPwd;
  }
}
