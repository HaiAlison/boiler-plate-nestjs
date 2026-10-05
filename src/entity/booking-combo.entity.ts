import { BaseTimeStampEntity } from 'src/utils/config/database/base-entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BookingEntity } from './booking.entity';
import { ComboEntity } from './combo.entity';

// Combo được chọn trong booking
@Entity('booking_combo')
export class BookingComboEntity extends BaseTimeStampEntity {

    @Column()
    booking_id: string;

    @ManyToOne(() => BookingEntity)
    @JoinColumn({ name: 'booking_id' })
    booking: BookingEntity;

    @Column()
    combo_id: string;

    @ManyToOne(() => ComboEntity)
    @JoinColumn({ name: 'combo_id' })
    combo: ComboEntity;

    @Column({ type: 'int', default: 1 })
    quantity: number;

    @Column({ type: 'decimal', precision: 12, scale: 2 })
    unit_price: number; // Giá snapshot tại thời điểm đặt

    @Column({ type: 'decimal', precision: 12, scale: 2 })
    subtotal: number; // quantity * unit_price
}
