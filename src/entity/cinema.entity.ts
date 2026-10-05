import { BaseTimeStampEntity } from "src/utils/config/database/base-entity";
import { Column, Entity, OneToMany } from "typeorm";
import { RoomEntity } from "./room.entity";

//Rạp 
@Entity('cinema')
export class CinemaEntity extends BaseTimeStampEntity {

    @Column()
    name: string;

    @Column()
    phone: string;

    @Column()
    address: string;

    @Column({ type: 'varchar', nullable: true })
    ward: string;

    @Column({ type: 'varchar', nullable: true })
    city: string;

    @Column({ type: 'varchar', nullable: true })
    fax?: string;

    @Column({ type: 'varchar', nullable: true })
    hotline?: string;

    @Column({ type: 'varchar', array: true, nullable: true })
    image_urls?: string[];

    @Column({ type: 'text', nullable: true })
    description?: string;

    @OneToMany(() => RoomEntity, room => room.cinema)
    rooms: RoomEntity[];

    @Column({ type: 'float', nullable: true })
    lat?: number;

    @Column({ type: 'float', nullable: true })
    long?: number;

    @Column({ type: 'varchar', nullable: true })
    link_ggmap?: string;

    @Column({ type: 'boolean', default: true })
    is_active: boolean;
}