import { ApiProperty } from '@nestjs/swagger';
import { TaskBoardsEntity } from '../../task-boards/entities/tasks.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';

export enum UserRole {
  User = 'user',
  Admin = 'admin',
}

@Entity()
@Unique(['email']) // 이메일 중복 방지
export class UsersEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'userIndex' })
  userIndex: number;

  @ApiProperty({
    example: 'testName1',
    description: 'username',
    required: true,
  })
  @Column('varchar', { name: 'username', length: 45 })
  username: string;

  @ApiProperty({
    example: 'testEmail@test.com',
    description: 'email',
    required: true,
  })
  @Column('varchar', { name: 'email', length: 45 })
  email: string;

  @ApiProperty({
    example: 'asd1234',
    description: 'password',
    required: true,
  })
  @Column('varchar', { name: 'password', length: 100 })
  password: string;

  @Column()
  salt: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({
    type: 'enum',
    enum: UserRole,
  })
  role: UserRole;

  @OneToMany(() => TaskBoardsEntity, (TaskBoards) => TaskBoards.User, {
    // eager: true, // - User 로드 시, 속한 모든 Task 로드
    cascade: true, // User 저장시, Task도 저장
  })
  // Lazy Relations - User Entity 접근 시 데이터 로드
  TaskBoards: Promise<TaskBoardsEntity[]>;
}
