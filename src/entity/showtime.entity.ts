import { BaseTimeStampEntity } from 'src/utils/config/database/base-entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { MovieEntity } from './movie.entity';
import { RoomEntity } from './room.entity';

export enum EShowtimeStatus {
    UPCOMING = 'upcoming',
    OPEN = 'open',       // Đang mở bán
    FULL = 'full',       // Hết ghế
    ENDED = 'ended',     // Đã chiếu xong
    CANCELLED = 'cancelled',
}

export enum ESubtitleType {
    SUBTITLED = 'subtitled',   // Phụ đề
    DUBBED = 'dubbed',         // Lồng tiếng
    ORIGINAL = 'original',     // Tiếng gốc không phụ đề
}

// Suất chiếu
@Entity('showtime')
export class ShowtimeEntity extends BaseTimeStampEntity {

    @Column()
    movie_id: string;

    @ManyToOne(() => MovieEntity)
    @JoinColumn({ name: 'movie_id' })
    movie: MovieEntity;

    @Column()
    room_id: string;

    @ManyToOne(() => RoomEntity)
    @JoinColumn({ name: 'room_id' })
    room: RoomEntity;

    @Column({ type: 'timestamptz' })
    start_time: Date;

    @Column({ type: 'timestamptz' })
    end_time: Date;

    @Column({ type: 'varchar', length: 10, default: 'vi' })
    language: string; // vi, en, ko, ...

    @Column({ type: 'enum', enum: ESubtitleType, nullable: true })
    subtitle_type?: ESubtitleType;

    @Column({ type: 'enum', enum: EShowtimeStatus, default: EShowtimeStatus.UPCOMING })
    status: EShowtimeStatus;

    // Giá cơ bản của suất chiếu (giá có thể thay đổi theo khung giờ, ngày lễ...)
    @Column({ type: 'decimal', precision: 12, scale: 2 })
    base_price: number;

    @Column({ type: 'boolean', default: true })
    is_active: boolean;
}
