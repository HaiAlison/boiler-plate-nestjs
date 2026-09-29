import { BaseTimeStampEntity } from "src/utils/config/database/base-entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne } from "typeorm";
import { Department } from "./department.entity";
import { WorksOn } from "./works-on.entity";



@Entity('employees')
export class Employee extends BaseTimeStampEntity {

  @Column()
  fname: string;

  @Column()
  minit: string;

  @Column()
  lname: string;

  @Column({ type: 'timestamptz', nullable: true })
  bdate: Date;

  @Column()
  address: string;

  @Column()
  sex: string;

  @Column({ default: 0 })
  salary: number;

  @OneToOne(() => Department, department => department.manager)
  manager: Department;

  @ManyToOne(() => Department, department => department.employees)
  @JoinColumn({ name: 'dno', referencedColumnName: 'id' })
  department: Department;

  @Column({ nullable: true })
  dno: number;

  @OneToMany(() => WorksOn, worksOn => worksOn.employee)
  worksOn: WorksOn[];

  @OneToMany(() => Employee, employee => employee.supervisor)
  supervisee: Employee[];

  @ManyToOne(() => Employee, employee => employee.supervisee)
  @JoinColumn({ name: 'supervisor', referencedColumnName: 'id' })
  supervisor: Employee;
}