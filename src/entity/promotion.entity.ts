import { BaseTimeStampEntity } from 'src/utils/config/database/base-entity';
import { Column, Entity } from 'typeorm';

export enum EPromotionType {
    PERCENTAGE = 'percentage',     // Giảm % trên tổng hóa đơn
    FIXED_AMOUNT = 'fixed_amount', // Giảm số tiền cố định
    FREE_COMBO = 'free_combo',     // Tặng combo
    BUY_X_GET_Y = 'buy_x_get_y',  // Mua X tặng Y
    GIFT_CARD = 'gift_card',       // Thẻ quà tặng CGV
}

export enum EPromotionScope {
    ALL = 'all',                   // Áp dụng toàn bộ
    TICKET_ONLY = 'ticket_only',   // Chỉ vé xem phim
    COMBO_ONLY = 'combo_only',     // Chỉ combo đồ ăn
    SPECIFIC_MOVIE = 'specific_movie', // Phim cụ thể
    SPECIFIC_CINEMA = 'specific_cinema', // Rạp cụ thể
    SPECIFIC_DAY = 'specific_day', // Ngày cụ thể (VD: thứ 3 hàng tuần)
}

// Chương trình khuyến mãi / Sự kiện
@Entity('promotion')
export class PromotionEntity extends BaseTimeStampEntity {

    @Column({ type: 'varchar', length: 200 })
    name: string;

    @Column({ type: 'text', nullable: true })
    description?: string;

    @Column({ type: 'varchar', length: 100, nullable: true, unique: true })
    code?: string; // Mã voucher (nếu có)

    @Column({ type: 'enum', enum: EPromotionType })
    type: EPromotionType;

    @Column({ type: 'enum', enum: EPromotionScope, default: EPromotionScope.ALL })
    scope: EPromotionScope;

    // Giá trị giảm: % hoặc số tiền
    @Column({ type: 'decimal', precision: 12, scale: 2 })
    discount_value: number;

    @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
    max_discount_amount?: number; // Giới hạn giảm tối đa (với loại %)

    @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
    min_order_amount?: number; // Đơn hàng tối thiểu để áp dụng

    @Column({ type: 'timestamptz' })
    start_date: Date;

    @Column({ type: 'timestamptz' })
    end_date: Date;

    @Column({ type: 'int', nullable: true })
    usage_limit?: number; // Số lần dùng tối đa (null = không giới hạn)

    @Column({ type: 'int', default: 0 })
    used_count: number;

    @Column({ type: 'int', nullable: true })
    per_user_limit?: number; // Mỗi user chỉ được dùng n lần

    @Column({ type: 'varchar', nullable: true })
    banner_url?: string;

    @Column({ type: 'simple-array', nullable: true })
    applicable_movie_ids?: string[]; // Áp dụng cho phim cụ thể

    @Column({ type: 'simple-array', nullable: true })
    applicable_cinema_ids?: string[]; // Áp dụng cho rạp cụ thể

    @Column({ type: 'boolean', default: true })
    is_active: boolean;
}
