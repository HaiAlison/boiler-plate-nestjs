import { Column, Entity, OneToMany } from 'typeorm';
import { BaseTimeStampEntity } from '../utils/config/database/base-entity';
import { User } from './user.entity';
import { ROLE_TYPES } from '../utils/common/enum';

@Entity()
export class Role extends BaseTimeStampEntity {
  @Column()
  name: string;

  @Column()
  description: string;

  @Column('enum', {
    enum: ROLE_TYPES,
    default: ROLE_TYPES.EMPLOYEE,
    nullable: false,
    comment: 'Role type',
  })
  roleType: ROLE_TYPES;

  @OneToMany(() => User, (user) => user.role)
  users: User[];
}
