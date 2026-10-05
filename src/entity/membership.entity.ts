import { BaseTimeStampEntity } from 'src/utils/config/database/base-entity';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { UserEntity } from './user.entity';

export enum EMembershipTier {
    STANDARD = 'standard',   // Hội viên thường
    VIP = 'vip',             // VIP
    VVIP = 'vvip',           // VVIP
}

// Thẻ hội viên CGV (CGV Member)
@Entity('membership')
export class MembershipEntity extends BaseTimeStampEntity {

    @Column({ unique: true })
    user_id: string;

    @OneToOne(() => UserEntity)
    @JoinColumn({ name: 'user_id' })
    user: UserEntity;

    @Column({ type: 'varchar', unique: true })
    member_code: string; // Mã thẻ hội viên

    @Column({ type: 'enum', enum: EMembershipTier, default: EMembershipTier.STANDARD })
    tier: EMembershipTier;

    @Column({ type: 'int', default: 0 })
    cgv_points: number; // Điểm CGV Point hiện tại

    @Column({ type: 'int', default: 0 })
    total_points_earned: number; // Tổng điểm tích lũy từ trước đến nay (dùng để xét tier)

    @Column({ type: 'date', nullable: true })
    tier_expiry_date?: Date; // Ngày hết hạn của tier VIP/VVIP

    @Column({ type: 'boolean', default: true })
    is_active: boolean;
}
