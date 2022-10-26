import { UsersEntity } from 'src/users/entities/users.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class TaskBoardsEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'taskIndex' })
  taskIndex: number;

  @Column('varchar', { name: 'taskName', length: 45 })
  taskName: string;

  @Column('varchar', { name: 'description', length: 300 })
  description: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @ManyToOne((type) => UsersEntity, (users) => users.taskBoards, {
    eager: false,
  })
  users: UsersEntity;
}
