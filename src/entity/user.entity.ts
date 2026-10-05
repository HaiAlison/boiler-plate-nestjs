import { BaseTimeStampEntity } from 'src/utils/config/database/base-entity';
import { Column, Entity } from 'typeorm';



@Entity('users')
export class UserEntity extends BaseTimeStampEntity {
    @Column({ type: 'varchar', length: 100 })
    name: string;

    @Column({ type: 'varchar', length: 100 })
    email: string;

    @Column({ type: 'varchar', length: 15 })
    phone: string;

    @Column({ type: 'date', nullable: true })
    dob?: Date;

    @Column({ type: 'varchar', length: 100, nullable: false })
    province: string;

    @Column({ type: 'varchar', nullable: true })
    avatar?: string;

    @Column({ type: 'varchar' })
    password: string;

    @Column({ type: 'boolean', nullable: true }) // null = None, true = Male, false = Female
    sex?: boolean;

    @Column()
    salt: string;

    @Column({ type: 'boolean', default: true })
    is_active: boolean;

}