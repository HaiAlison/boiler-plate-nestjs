import { BaseTimeStampEntity } from 'src/utils/config/database/base-entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { MembershipEntity } from './membership.entity';

export enum EPointTransactionType {
    EARN = 'earn',       // Tích điểm từ mua vé / combo
    REDEEM = 'redeem',   // Dùng điểm thanh toán
    EXPIRE = 'expire',   // Điểm hết hạn
    ADJUST = 'adjust',   // Điều chỉnh thủ công (admin)
    BONUS = 'bonus',     // Thưởng điểm từ khuyến mãi
    REFUND = 'refund',   // Hoàn điểm khi hủy vé
}

// Lịch sử giao dịch điểm CGV Point
@Entity('point_transaction')
export class PointTransactionEntity extends BaseTimeStampEntity {

    @Column()
    membership_id: string;

    @ManyToOne(() => MembershipEntity)
    @JoinColumn({ name: 'membership_id' })
    membership: MembershipEntity;

    @Column({ type: 'enum', enum: EPointTransactionType })
    type: EPointTransactionType;

    @Column({ type: 'int' })
    points: number; // Số điểm thay đổi (dương = tăng, âm = giảm)

    @Column({ type: 'int' })
    balance_after: number; // Số dư sau giao dịch

    @Column({ type: 'varchar', nullable: true })
    reference_id?: string; // booking_id hoặc promotion_id liên quan

    @Column({ type: 'text', nullable: true })
    note?: string;

    @Column({ type: 'timestamptz', nullable: true })
    expire_at?: Date; // Điểm sẽ hết hạn vào ngày này
}
