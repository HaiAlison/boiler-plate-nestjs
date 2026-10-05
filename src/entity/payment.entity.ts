import { BaseTimeStampEntity } from 'src/utils/config/database/base-entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BookingEntity } from './booking.entity';

export enum EPaymentMethod {
    CREDIT_CARD = 'credit_card',       // Thẻ tín dụng/ghi nợ
    MOMO = 'momo',                     // Ví MoMo
    ZALOPAY = 'zalopay',               // ZaloPay
    VNPAY = 'vnpay',                   // VNPay QR
    BANKING = 'banking',               // Chuyển khoản ngân hàng
    CGV_GIFTCARD = 'cgv_giftcard',     // Thẻ quà tặng CGV
    CGV_POINT = 'cgv_point',           // CGV Point
    CASH = 'cash',                     // Tiền mặt tại quầy
    SHOPEEPAY = 'shopeepay',           // ShopeePay
}

export enum EPaymentStatus {
    PENDING = 'pending',
    SUCCESS = 'success',
    FAILED = 'failed',
    REFUNDED = 'refunded',
}

// Giao dịch thanh toán
@Entity('payment')
export class PaymentEntity extends BaseTimeStampEntity {

    @Column()
    booking_id: string;

    @ManyToOne(() => BookingEntity)
    @JoinColumn({ name: 'booking_id' })
    booking: BookingEntity;

    @Column({ type: 'enum', enum: EPaymentMethod })
    method: EPaymentMethod;

    @Column({ type: 'decimal', precision: 12, scale: 2 })
    amount: number;

    @Column({ type: 'enum', enum: EPaymentStatus, default: EPaymentStatus.PENDING })
    status: EPaymentStatus;

    @Column({ type: 'varchar', nullable: true })
    transaction_id?: string; // ID giao dịch từ cổng thanh toán

    @Column({ type: 'varchar', nullable: true })
    gateway_response?: string; // Response raw từ cổng (JSON string)

    @Column({ type: 'timestamptz', nullable: true })
    paid_at?: Date;
}
