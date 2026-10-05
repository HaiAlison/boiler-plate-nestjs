import { BaseTimeStampEntity } from 'src/utils/config/database/base-entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { UserEntity } from './user.entity';
import { ShowtimeEntity } from './showtime.entity';
import { PromotionEntity } from './promotion.entity';

export enum EBookingStatus {
    PENDING = 'pending',       // Đang chờ thanh toán
    CONFIRMED = 'confirmed',   // Đã xác nhận / Đã thanh toán
    CANCELLED = 'cancelled',   // Đã hủy
    EXPIRED = 'expired',       // Hết thời gian thanh toán
    REFUNDED = 'refunded',     // Đã hoàn tiền
}

// Đơn đặt vé
@Entity('booking')
export class BookingEntity extends BaseTimeStampEntity {

    @Column({ type: 'varchar', unique: true })
    booking_code: string; // Mã đặt vé (VD: CGV2024001234)

    @Column()
    user_id: string;

    @ManyToOne(() => UserEntity)
    @JoinColumn({ name: 'user_id' })
    user: UserEntity;

    @Column()
    showtime_id: string;

    @ManyToOne(() => ShowtimeEntity)
    @JoinColumn({ name: 'showtime_id' })
    showtime: ShowtimeEntity;

    @Column({ type: 'decimal', precision: 12, scale: 2 })
    ticket_total: number; // Tổng tiền vé

    @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
    combo_total: number; // Tổng tiền combo

    @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
    discount_amount: number; // Số tiền được giảm

    @Column({ type: 'decimal', precision: 12, scale: 2 })
    final_amount: number; // Thực thanh toán

    @Column({ type: 'varchar', nullable: true })
    promotion_id?: string;

    @ManyToOne(() => PromotionEntity, { nullable: true })
    @JoinColumn({ name: 'promotion_id' })
    promotion?: PromotionEntity;

    @Column({ type: 'enum', enum: EBookingStatus, default: EBookingStatus.PENDING })
    status: EBookingStatus;

    @Column({ type: 'timestamptz', nullable: true })
    expired_at?: Date; // Thời điểm hết hạn thanh toán (thường 15 phút)

    @Column({ type: 'timestamptz', nullable: true })
    confirmed_at?: Date;

    @Column({ type: 'int', default: 0 })
    points_earned: number; // CGV Point tích lũy từ đơn này

    @Column({ type: 'int', default: 0 })
    points_used: number; // CGV Point đã dùng để giảm giá
}
