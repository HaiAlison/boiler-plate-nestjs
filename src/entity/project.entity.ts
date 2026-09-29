import { BaseTimeStampEntity } from "src/utils/config/database/base-entity";
import { Column, Entity, OneToMany } from "typeorm";
import { WorksOn } from "./works-on.entity";

@Entity('projects')
export class Project extends BaseTimeStampEntity {

    @Column()
    name: string;

    @Column()
    location: string;

    @OneToMany(() => WorksOn, worksOn => worksOn.project)
    worksOn: WorksOn[];
}