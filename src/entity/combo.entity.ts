import { BaseTimeStampEntity } from 'src/utils/config/database/base-entity';
import { Column, Entity } from 'typeorm';

export enum EComboCategory {
    POPCORN = 'popcorn',       // Bắp
    DRINK = 'drink',           // Nước
    COMBO = 'combo',           // Combo bắp + nước
    SNACK = 'snack',           // Đồ ăn vặt
    MEAL = 'meal',             // Bữa ăn (Gold Class)
    GIFT = 'gift',             // Quà tặng
}

export enum EComboSize {
    SMALL = 'S',
    MEDIUM = 'M',
    LARGE = 'L',
    EXTRA_LARGE = 'XL',
}

// Bắp nước / Combo đồ ăn thức uống
@Entity('combo')
export class ComboEntity extends BaseTimeStampEntity {

    @Column({ type: 'varchar', length: 200 })
    name: string;

    @Column({ type: 'text', nullable: true })
    description?: string;

    @Column({ type: 'enum', enum: EComboCategory })
    category: EComboCategory;

    @Column({ type: 'enum', enum: EComboSize, nullable: true })
    size?: EComboSize;

    @Column({ type: 'decimal', precision: 12, scale: 2 })
    price: number;

    @Column({ type: 'varchar', nullable: true })
    image_url?: string;

    @Column({ type: 'boolean', default: true })
    is_available: boolean;

    @Column({ type: 'boolean', default: false })
    is_e_combo: boolean; // e-Combo (đặt trước online)

    @Column({ type: 'int', default: 0 })
    display_order: number;
}
