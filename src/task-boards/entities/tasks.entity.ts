import { UsersEntity } from '../../users/entities/users.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class TaskBoardsEntity {
  @ApiProperty({
    example: '22',
    description: 'taskIndex',
    required: true,
  })
  @PrimaryGeneratedColumn({ type: 'int', name: 'taskIndex' })
  taskIndex: number;

  @ApiProperty({
    example: 'Task_Name',
    description: 'taskName',
    required: true,
  })
  @Column('varchar', { name: 'taskName', length: 45 })
  taskName: string;

  @ApiProperty({
    example: 'Task_Description',
    description: 'description',
    required: true,
  })
  @Column('varchar', { name: 'description', length: 500 })
  description: string;

  @Column('varchar', { name: 'filesUrl', length: 500, nullable: true })
  filesUrl: string;

  @ApiProperty({
    example: '2022-10-23T06:04:38.570Z',
    description: 'createdAt',
  })
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ApiProperty({
    example: '33',
    description: 'userIndex',
    required: true,
  })
  @Column({ type: 'int', name: 'userIdx', nullable: false })
  userIdx: number;

  @ManyToOne(() => UsersEntity, (User) => User.userIndex, {
    onDelete: 'CASCADE', // User 삭제시, Task도 삭제
  })
  @JoinColumn([{ name: 'userIdx', referencedColumnName: 'userIndex' }])
  User: Promise<UsersEntity>;
}
