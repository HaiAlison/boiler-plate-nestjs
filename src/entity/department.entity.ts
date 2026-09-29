import { BaseTimeStampEntity } from "src/utils/config/database/base-entity";
import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany, OneToOne } from "typeorm";
import { Employee } from "./employee.entity";

@Entity('departments')
export class Department extends BaseTimeStampEntity {

    @Column()
    dname: string;

    @Column()
    dno: number;

    @OneToOne(() => Employee, employee => employee.department)
    @JoinColumn({ name: 'mgrssn', referencedColumnName: 'id' })
    manager: Employee;

    @Column()
    mgrssn: string;

    @Column()
    mgrstartdate: Date;

    @OneToMany(() => Employee, employee => employee.department)
    employees: Employee[];

    @Column({ type: 'simple-array', nullable: true })
    locations: string[];
}