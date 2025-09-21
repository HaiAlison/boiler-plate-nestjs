import {
  BeforeInsert,
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'female_events' })
@Index(['type', 'event_alias'])
@Index(['animal_id'])
@Index(['action_date'])
@Index(['farm_id'])
export class FemaleEventsModel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', nullable: false })
  status: string;

  @Column({ type: 'date', nullable: false, default: () => 'CURRENT_DATE' })
  action_date: Date;

  @Column({ type: 'uuid', nullable: true, default: null })
  animal_id: string;

  @Column({ type: 'int', nullable: true, default: 0 })
  animal_number: number;

  @Column({ type: 'int', nullable: true, default: null })
  week_old: number;

  // type=0 là những event không tác động đến số lượng vật nuôi của nhóm
  @Column({ type: 'int', nullable: false, default: 0 })
  type: number;

  @Column({
    type: 'decimal',
    nullable: true,
    precision: 12,
    scale: 2,
    default: 0,
  })
  weight: number;

  @Column({ type: 'int', nullable: true })
  animal_type: number;

  @Column({ type: 'varchar', nullable: true, default: null })
  documents: string;

  @Column({ type: 'uuid', nullable: true, default: null })
  breed_id: string;

  @Column({ type: 'uuid', nullable: true, default: null })
  genetic_id: string;

  @Column({ type: 'uuid', nullable: true, default: null })
  barn_id: string;

  @Column({ type: 'uuid', nullable: true, default: null })
  group_id: string;

  @Column({ type: 'uuid', nullable: false })
  farm_id: string;

  @Column({ type: 'uuid', nullable: false })
  tenant_id: string;

  @Column({ type: 'varchar', nullable: false })
  event_alias: string;

  @Column({ type: 'uuid', nullable: true, default: null })
  parent_id: string;

  @ManyToOne(() => FemaleEventsModel, (event) => event.id, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'parent_id' })
  parentEvent: FemaleEventsModel;

  @OneToMany(() => FemaleEventsModel, (events) => events.parentEvent, {
    onDelete: 'CASCADE',
  })
  childEvents: FemaleEventsModel[];

  @Column({ type: 'uuid', nullable: true, default: null })
  relation_event_id: string;

  @ManyToOne(() => FemaleEventsModel, (event) => event.id, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'relation_event_id' })
  relationEvent: FemaleEventsModel;

  @Column({ type: 'uuid', nullable: true, default: null })
  employee_id: string;

  @Column({ type: 'uuid', nullable: true, default: null })
  material_id: string;

  @Column({ type: 'float8', nullable: true, default: 0 })
  material_quantity: number;

  @Column({ type: 'varchar', nullable: true, default: null })
  note: string;

  @Column({ type: 'uuid', nullable: true, default: null })
  cause_id: string;

  @Column({ type: 'uuid', nullable: true, default: null })
  pen_id: string;

  @Column({ type: 'uuid', nullable: true, default: null })
  room_id: string;

  // Vị trí ô / chuồng (TEMPORARY - remove later)
  @Column({ type: 'varchar', nullable: true, default: null })
  location: string;

  // Stage vật nuôi trước khi thực hiện sự kiện
  @Column({ type: 'uuid', nullable: true, default: null })
  stage_before_id: string;

  // Stage vật nuôi sau khi thực hiện sự kiện
  @Column({ type: 'uuid', nullable: true, default: null })
  stage_after_id: string;

  // Mục đích phối giống
  @Column({ type: 'varchar', nullable: true, default: null })
  insemination_purpose: string;

  @Column({ type: 'uuid', nullable: true, default: null })
  pork_id: string;
  // Thông tin tinh dịch (TEMPORARILY - dùng trong sự kiện phối)
  @Column({ type: 'varchar', nullable: true, default: null })
  pork_identifier: string;

  @Column({ type: 'int', nullable: true, default: null })
  sperm_quantity: number;

  // Phương pháp kiểm tra thai
  @Column({ type: 'varchar', nullable: true, default: null })
  diagnosis_method: string;

  // Tổng số heo con
  @Column({ type: 'int', nullable: true, default: null })
  total_piglets: number;

  // Số heo con đực
  @Column({ type: 'int', nullable: true, default: null })
  male_piglets: number;

  // Số heo con cái
  @Column({ type: 'int', nullable: true, default: null })
  female_piglets: number;

  // Số thai chết lưu
  @Column({ type: 'int', nullable: true, default: null })
  stillborn_amount: number;

  // Số chêt khô
  @Column({ type: 'int', nullable: true, default: null })
  mummified_amount: number;

  // Số heo con dị tật
  @Column({ type: 'int', nullable: true, default: null })
  defects_amount: number;

  // Số heo con thiếu cân
  @Column({ type: 'int', nullable: true, default: null })
  underweight_amount: number;

  // Số heo con chọn nuôi (hoặc còn sống) sau sự kiện
  @Column({ type: 'int', nullable: true, default: 0 })
  raising_amount: number;

  // Trọng lượng chọn nuôi
  @Column({
    type: 'decimal',
    precision: 12,
    scale: 2,
    nullable: true,
    default: 0,
  })
  raising_weight: number;

  // Trọng lượng trung bình
  @Column({
    type: 'decimal',
    precision: 12,
    scale: 2,
    nullable: true,
    default: null,
  })
  average_weight: number;

  // Lứa đẻ
  @Column({ type: 'int', nullable: true, default: null })
  parity: number;

  // Thời gian bắt đầu đẻ
  @Column({ type: 'time', nullable: true, default: null })
  farrowing_start_time: Date;

  // Thời gian kết thúc đẻ
  @Column({ type: 'time', nullable: true, default: null })
  farrowing_finish_time: Date;

  // Số lượng tách heo (cai sữa)
  @Column({ type: 'int', nullable: true, default: null })
  split_amount: number;

  // Số lượng ghép heo (cai sữa)
  @Column({ type: 'int', nullable: true, default: null })
  merged_amount: number;

  // Số lần liên tiếp trong chuỗi (các sự kiện giống nhau)
  @Column({ type: 'int', nullable: true, default: 1 })
  iteration_index: number;

  // cờ xác định xem sự kiện có được tính là khởi đầu giai đoạn mang thai hay không (dùng trong báo cáo thời gian mang thai)
  @Column({ type: 'boolean', nullable: true, default: true })
  count_as_pregnant: boolean;

  // cờ xác định xem sự kiện có được tính là lần phối hợp lệ hay không
  @Column({ type: 'boolean', nullable: true, default: null })
  is_valid_insemination: boolean;

  @Column({ type: 'varchar', nullable: true, default: null })
  reference_name: string;

  @Column({ type: 'varchar', nullable: true })
  invoice_status: string;

  @Column({ type: 'uuid', nullable: true, default: null })
  import_id: string;

  @Column({ type: 'uuid', nullable: true, default: null })
  invoice_id: string;

  @Column({ type: 'int', nullable: true, default: 0 })
  version: number;
}
