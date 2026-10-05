import { BaseTimeStampEntity } from 'src/utils/config/database/base-entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BookingEntity } from './booking.entity';
import { SeatEntity } from './seat.entity';

export enum ETicketStatus {
    ACTIVE = 'active',         // Vé hợp lệ
    USED = 'used',             // Đã soát vé
    CANCELLED = 'cancelled',   // Đã hủy
}

// Chi tiết vé - mỗi ghế trong 1 booking
@Entity('booking_detail')
export class BookingDetailEntity extends BaseTimeStampEntity {

    @Column()
    booking_id: string;

    @ManyToOne(() => BookingEntity)
    @JoinColumn({ name: 'booking_id' })
    booking: BookingEntity;

    @Column()
    seat_id: string;

    @ManyToOne(() => SeatEntity)
    @JoinColumn({ name: 'seat_id' })
    seat: SeatEntity;

    @Column({ type: 'varchar', length: 50 })
    seat_label: string; // VD: "A01", "B12" - snapshot tại thời điểm đặt

    @Column({ type: 'varchar', length: 50 })
    seat_type: string; // Snapshot: standard, vip, sweetbox, ...

    @Column({ type: 'decimal', precision: 12, scale: 2 })
    price: number; // Giá vé tại thời điểm đặt (snapshot)

    @Column({ type: 'enum', enum: ETicketStatus, default: ETicketStatus.ACTIVE })
    status: ETicketStatus;

    @Column({ type: 'varchar', nullable: true })
    qr_code?: string; // QR code để soát vé tại cổng rạp
}
