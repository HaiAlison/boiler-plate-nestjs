import { Column, Entity, ManyToOne, OneToMany, Unique } from 'typeorm';
import { BaseTimeStampEntity } from '../utils/config/database/base-entity';
import { Notification } from './notification.entity';
import { Field, ObjectType } from '@nestjs/graphql';

@Entity()
// @Unique(['code', 'source'])
@ObjectType()
export class User extends BaseTimeStampEntity {
  @Field()
  @Column({ nullable: false })
  code: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  name: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  address: string;

  @Field()
  @Column({ nullable: false })
  source: string;

  @OneToMany(() => Notification, (notifications) => notifications.user)
  notifications: Notification[];
}
