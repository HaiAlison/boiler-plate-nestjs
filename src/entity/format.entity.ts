import { BaseTimeStampEntity } from "src/utils/config/database/base-entity";
import { Column, Entity } from "typeorm";

// Định dạng chiếu phim (2D, 3D, IMAX, 4DX, ScreenX...)
@Entity('format')
export class FormatEntity extends BaseTimeStampEntity {

    @Column()
    name: string;

    @Column()
    description: string;

    @Column()
    price: number;

    @Column()
    is_active: boolean;

}