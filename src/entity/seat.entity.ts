import { BaseTimeStampEntity } from "src/utils/config/database/base-entity";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { RoomEntity } from "./room.entity";

@Entity('seat')
export class SeatEntity extends BaseTimeStampEntity {
    @Column()
    room_id: string;

    @ManyToOne(() => RoomEntity, room => room.seats)
    @JoinColumn({ name: 'room_id' })
    room: RoomEntity;

    @Column()
    col: string;

    @Column()
    row: string;

    @Column()
    type: string;

    @Column()
    price: number;

    @Column()
    is_book: boolean;
}