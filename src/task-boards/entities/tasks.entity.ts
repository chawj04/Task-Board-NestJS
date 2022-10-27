import { UsersEntity } from 'src/users/entities/users.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
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
  deletedAt: Date | null;

  @Column({ type: 'int', name: 'userIdx', nullable: true })
  userIdx: number;

  @ManyToOne(() => UsersEntity, (User) => User.userIndex, {
    onDelete: 'CASCADE', // User 삭제시, Task도 삭제
  })
  @JoinColumn([{ name: 'userIdx', referencedColumnName: 'userIndex' }])
  User: Promise<UsersEntity>;
}
