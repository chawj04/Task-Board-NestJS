import { ApiProperty } from '@nestjs/swagger';
import { TaskBoardsEntity } from 'src/task-boards/entities/tasks.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';

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

  @OneToMany((type) => TaskBoardsEntity, (taskBoards) => taskBoards.users, {
    eager: true,
  })
  taskBoards: TaskBoardsEntity[];
}
