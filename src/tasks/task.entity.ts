import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum TaskStatus {
  Pending = 'Pending',
  Done = 'Done',
  InProgress = 'In Progress',
  Paused = 'Paused',
}

export enum TaskPriority {
  Red = 'Red',
  Yellow = 'Yellow',
  Blue = 'Blue',
}

@Entity({ name: 'tasks' })
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'timestamp with time zone', nullable: true })
  dueDate: Date | null;

  @Index()
  @Column({ type: 'enum', enum: TaskStatus })
  status: TaskStatus;

  @Index()
  @Column({ type: 'enum', enum: TaskPriority })
  priority: TaskPriority;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updatedAt: Date;

  @Index()
  @Column({ type: 'boolean', default: true })
  isActive: boolean;
}


