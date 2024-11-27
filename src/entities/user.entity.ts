import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  Unique,
} from 'typeorm';
import { BaseTimeStampEntity } from '../utils/config/database/base-entity';
import { Notification } from './notification.entity';
import * as bcrypt from 'bcrypt';
import { Sender } from './sender.entity';
import { Upload } from './Upload.entity';

@Entity()
@Unique(['code', 'source'])
export class User extends BaseTimeStampEntity {
  @Column({ nullable: false })
  code: string;

  @Column({ nullable: true })
  first_name: string;

  @Column({ nullable: true })
  last_name: string;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: false })
  source: string;

  @Column({ nullable: true, unique: true })
  @JoinColumn({ name: 'fb_provider_id' })
  fb_provider_id: string;

  @Column({ nullable: true, unique: true })
  @JoinColumn({ name: 'google_provider_id' })
  google_provider_id: string;

  @Column('varchar', { nullable: true })
  refresh_token: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  avatar: string;

  @Column({ nullable: true, select: false })
  password?: string;

  @OneToMany(() => Notification, (notifications) => notifications.user)
  notifications: Notification[];

  @OneToMany(() => Sender, (sender) => sender.user)
  senders: Sender[];

  @OneToMany(() => Upload, (file) => file.user)
  files: Upload[];

  @Column({ nullable: true })
  last_login: Date;

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
