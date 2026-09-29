import { BaseTimeStampEntity } from "src/utils/config/database/base-entity";
import { Column } from "typeorm";

export class Dependent extends BaseTimeStampEntity {

    @Column()
    name: string;

    @Column()
    sex: string;

    @Column()
    bdate: Date;

    @Column()
    relationship: string;

}