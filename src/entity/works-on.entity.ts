import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { Employee } from "./employee.entity";
import { Project } from "./project.entity";

@Entity('works_on')
export class WorksOn {

    @PrimaryColumn()
    essn: string;

    @PrimaryColumn()
    pno: string;

    @ManyToOne(() => Employee, employee => employee.worksOn)
    @JoinColumn({ name: 'essn', referencedColumnName: 'id' })
    employee: Employee;

    @ManyToOne(() => Project, project => project.worksOn)
    @JoinColumn({ name: 'pno', referencedColumnName: 'id' })
    project: Project;

    @Column({ type: 'decimal', precision: 4, scale: 1, default: 0 })
    hours: number;
}
