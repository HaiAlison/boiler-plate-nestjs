
import { BaseTimeStampEntity } from "src/utils/config/database/base-entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { CinemaEntity } from "./cinema.entity";
import { SeatEntity } from "./seat.entity";

export enum ERoomType {
    IMAX = 'imax',
    FOUR_DX = '4dx',
    ULTRA_4DX = 'ultra_4dx',
    STARIUM = 'starium',
    INFINITY = 'infinity',
    GOLDEN_CLASS = 'golden_class',
    LAMOUR = 'lamour',
    SWEET_BOX = 'sweet_box',
    STANDARD_2D = 'standard_2d',
    STANDARD_3D = 'standard_3d',

}
@Entity('room')
export class RoomEntity extends BaseTimeStampEntity {

    @Column()
    name: string;

    @Column()
    cinema_id: string;

    @ManyToOne(() => CinemaEntity, cinema => cinema.rooms)
    @JoinColumn({ name: 'cinema_id' })
    cinema: CinemaEntity;

    @Column({ type: 'enum', enum: ERoomType, nullable: false })
    roomType: ERoomType;

    @OneToMany(() => SeatEntity, seat => seat.room)
    seats: SeatEntity[];
}